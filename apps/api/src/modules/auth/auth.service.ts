import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';
import { OtpService } from './otp.service';
import { ErrorCodes } from '@autonorme/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Invalider OTPs existants
    await this.db.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    });

    await this.db.otpCode.create({ data: { phone, code, expiresAt } });
    await this.otpService.send(phone, code);

    return { message: 'Code envoyé avec succès' };
  }

  async verifyOtp(
    phone: string,
    code: string,
  ): Promise<{
    accessToken: string;
    user: { id: string; phone: string; name: string; role: string };
  }> {
    const otp = await this.db.otpCode.findFirst({
      where: { phone, code, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException({
        code: ErrorCodes.AUTH_OTP_INVALID,
        message: 'Code invalide ou expiré',
      });
    }

    await this.db.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    // Créer ou récupérer l'utilisateur
    let user = await this.db.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.db.user.create({ data: { phone, name: phone } });
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwt.sign(payload);

    // Stocker refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    await this.db.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const record = await this.db.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException({
        code: ErrorCodes.AUTH_TOKEN_EXPIRED,
        message: 'Session expirée, veuillez vous reconnecter',
      });
    }

    // Rotation du refresh token
    const newToken = crypto.randomBytes(64).toString('hex');
    await this.db.refreshToken.update({
      where: { id: record.id },
      data: { token: newToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });

    const payload = { sub: record.user.id, phone: record.user.phone, role: record.user.role };
    return { accessToken: this.jwt.sign(payload) };
  }
}
