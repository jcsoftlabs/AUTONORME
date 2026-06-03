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
import type { OtpAuthMode } from './dto/send-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwt: JwtService,
    private readonly otpService: OtpService,
    private readonly config: ConfigService,
  ) {}

  async sendOtp(target: { phone?: string; email?: string }, mode: OtpAuthMode = 'login'): Promise<{ message: string }> {
    const identifier = this.getOtpIdentifier(target);
    await this.assertAuthModeAllowed(target, mode);

    const isEmailOtp = identifier.includes('@');
    const providerKey = isEmailOtp ? 'RESEND_API_KEY' : 'SENTDM_API_KEY';
    const isDevOtpMode = !this.config.get<string>(providerKey) || this.config.get<string>(providerKey) === 'CHANGE_ME';
    const code = isDevOtpMode ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.db.otpCode.updateMany({
      where: { phone: identifier, used: false },
      data: { used: true },
    });

    await this.db.otpCode.create({ data: { phone: identifier, code, expiresAt } });
    await this.otpService.send(identifier, code);

    return { message: isDevOtpMode ? 'Code démo envoyé (123456)' : 'Code envoyé avec succès' };
  }

  async verifyOtp(target: { phone?: string; email?: string }, code: string, mode: OtpAuthMode = 'login'): Promise<{
    requires2FA?: boolean;
    tempToken?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  }> {
    const identifier = this.getOtpIdentifier(target);
    await this.assertAuthModeAllowed(target, mode);

    const otp = await this.db.otpCode.findFirst({
      where: { phone: identifier, code, used: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException({
        code: ErrorCodes.AUTH_OTP_INVALID,
        message: 'Code invalide ou expiré',
      });
    }

    await this.db.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    const email = target.email?.trim().toLowerCase();
    const phone = target.phone?.trim();
    let user = await this.findUserByOtpTarget(target);
    if (!user) {
      user = await this.db.user.create({
        data: {
          email,
          phone,
          name: email ?? phone ?? identifier,
        },
      });
    }

    if (user.accountStatus === 'PENDING') {
      user = await this.db.user.update({
        where: { id: user.id },
        data: { accountStatus: 'ACTIVE', isActive: true },
      });
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

    const payload = { sub: record.user.id, phone: record.user.phone, email: record.user.email, role: record.user.role };
    return { accessToken: this.jwt.sign(payload) };
  }

  // ── TOTP 2FA Methods ───────────────────────────────────────────────────────

  async generateTwoFactorSecret(userId: string) {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email ?? user.phone ?? user.id, 'AUTONORME', secret);

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
    const payload = { sub: user.id, phone: user.phone, email: user.email, role: user.role };
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
      user: { id: user.id, phone: user.phone, email: user.email, name: user.name, role: user.role },
    };
  }

  private getOtpIdentifier(target: { phone?: string; email?: string }): string {
    const email = target.email?.trim().toLowerCase();
    if (email) return email;

    const phone = target.phone?.trim();
    if (phone) return phone;

    throw new BadRequestException('Email ou téléphone requis');
  }

  private async findUserByOtpTarget(target: { phone?: string; email?: string }) {
    const email = target.email?.trim().toLowerCase();
    if (email) {
      return this.db.user.findUnique({ where: { email } });
    }

    const phone = target.phone?.trim();
    if (phone) {
      return this.db.user.findUnique({ where: { phone } });
    }

    return null;
  }

  private async assertAuthModeAllowed(target: { phone?: string; email?: string }, mode: OtpAuthMode): Promise<void> {
    const existingUser = await this.findUserByOtpTarget(target);

    if (mode === 'login' && !existingUser) {
      throw new BadRequestException({
        code: 'AUTH_ACCOUNT_NOT_FOUND',
        message: 'Aucun compte ne correspond à cet email. Créez un compte avant de vous connecter.',
      });
    }

    if (mode === 'register' && existingUser) {
      throw new BadRequestException({
        code: 'AUTH_ACCOUNT_ALREADY_EXISTS',
        message: 'Un compte existe déjà avec cet email. Connectez-vous plutôt.',
      });
    }
  }
}
