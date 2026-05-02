import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoyer un OTP par WhatsApp/SMS' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier OTP → retourne JWT access token' })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(dto.phone, dto.code);

    if (result.requires2FA) {
      return result; // Renvoie { requires2FA: true, tempToken: "..." } sans setter de cookie
    }

    // Set le vrai refresh token en cookie s'il y a un login normal
    if (result.refreshToken) {
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraîchir le token d\'accès depuis le cookie' })
  refresh(@Req() req: Request) {
    const token = (req.cookies as Record<string, string> | undefined)?.['refresh_token'];
    if (!token) throw new UnauthorizedException();
    return this.authService.refresh(token);
  }

  // ── 2FA Routes ─────────────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Générer le secret 2FA et le QR Code pour l\'utilisateur connecté' })
  async generateTwoFactorSecret(@CurrentUser() user: any) {
    return this.authService.generateTwoFactorSecret(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activer le 2FA après avoir scanné le QR Code (1er code de vérification)' })
  async turnOnTwoFactorAuthentication(
    @CurrentUser() user: any,
    @Body('code') code: string,
  ) {
    await this.authService.turnOnTwoFactorAuthentication(user.id, code);
    return { success: true, message: '2FA activé avec succès' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/authenticate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'S\'authentifier avec le code 2FA (nécessite le tempToken)' })
  async authenticateTwoFactor(
    @CurrentUser() user: any,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyTwoFactor(user.id, code);

    if (result.refreshToken) {
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    return { accessToken: result.accessToken, user: result.user };
  }
}
