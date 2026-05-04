import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { DatabaseService } from '../database/database.service';
import { OtpService } from './otp.service';
import { ErrorCodes } from '@autonorme/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly otpService: OtpService,
    private readonly config: ConfigService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    const isDevOtpMode = !this.config.get<string>('SENTDM_API_KEY') || this.config.get<string>('SENTDM_API_KEY') === 'CHANGE_ME';
    const code = isDevOtpMode ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.db.otpCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    });

    await this.db.otpCode.create({ data: { phone, code, expiresAt } });
    await this.otpService.send(phone, code);

    return { message: isDevOtpMode ? 'Code démo envoyé (123456)' : 'Code envoyé avec succès' };
  }

  async verifyOtp(phone: string, code: string): Promise<{
    requires2FA?: boolean;
    tempToken?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
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

    let user = await this.db.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.db.user.create({ data: { phone, name: phone } });
    }

    // Vérification du 2FA pour les admins
    if (user.isTwoFactorEnabled && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      const tempToken = this.jwt.sign({ sub: user.id, requires2fa: true }, { expiresIn: '5m' });
      return { requires2FA: true, tempToken };
    }

    return this.generateAuthResult(user);
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

    const newToken = crypto.randomBytes(64).toString('hex');
    await this.db.refreshToken.update({
      where: { id: record.id },
      data: { token: newToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    });

    const payload = { sub: record.user.id, phone: record.user.phone, role: record.user.role };
    return { accessToken: this.jwt.sign(payload) };
  }

  // ── TOTP 2FA Methods ───────────────────────────────────────────────────────

  async generateTwoFactorSecret(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.phone, 'AUTONORME', secret);

    await this.db.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
    return { secret, qrCodeUrl };
  }

  async turnOnTwoFactorAuthentication(userId: string, code: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) {
      throw new BadRequestException('Le secret 2FA n\'a pas été généré');
    }

    const isCodeValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isCodeValid) {
      throw new BadRequestException('Code 2FA invalide');
    }

    await this.db.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });
  }

  async verifyTwoFactor(userId: string, code: string): Promise<{
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  }> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) {
      throw new UnauthorizedException('2FA non configuré');
    }

    const isCodeValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isCodeValid) {
      throw new UnauthorizedException('Code 2FA incorrect');
    }

    return this.generateAuthResult(user);
  }

  // ── Helper ─────────────────────────────────────────────────────────────────

  private async generateAuthResult(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwt.sign(payload);

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
      refreshToken,
      user: { id: user.id, phone: user.phone, name: user.name, role: user.role },
    };
  }
}
