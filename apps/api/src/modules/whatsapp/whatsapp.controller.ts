import {
  Controller, Post, Get, Headers, Body, HttpCode, HttpStatus, Logger, UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Public } from '../../shared/decorators/public.decorator';

interface MetaWebhookBody {
  object?: string;
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{ from: string; text?: { body: string } }>;
      };
    }>;
  }>;
}

@ApiTags('whatsapp')
@Controller('webhook/whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(private readonly config: ConfigService) {}

  // Vérification webhook Meta (GET)
  @Public()
  @Get()
  @ApiOperation({ summary: 'Vérification webhook Meta' })
  verify(
    @Headers('hub.mode') mode: string,
    @Headers('hub.verify_token') token: string,
    @Headers('hub.challenge') challenge: string,
  ): string {
    const expected = this.config.get<string>('WHATSAPP_WEBHOOK_VERIFY_TOKEN');
    if (mode === 'subscribe' && token === expected) return challenge;
    throw new UnauthorizedException('Invalid verify token');
  }

  // Réception messages entrants (POST) — HMAC-SHA256
  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réception messages WhatsApp entrants' })
  async receive(
    @Body() body: MetaWebhookBody,
    @Headers('x-hub-signature-256') signature: string,
  ): Promise<{ status: string }> {
    // Vérification signature HMAC-SHA256 (BLOC 10 sécurité)
    const secret = this.config.get<string>('WHATSAPP_APP_SECRET', '');
    if (secret) {
      const expected = `sha256=${crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex')}`;
      if (!crypto.timingSafeEqual(Buffer.from(signature ?? ''), Buffer.from(expected))) {
        this.logger.warn('Signature HMAC WhatsApp invalide — requête rejetée');
        throw new UnauthorizedException('Invalid HMAC signature');
      }
    }

    // Traiter les messages entrants
    const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages ?? [];
    for (const msg of messages) {
      this.logger.log(`Message WhatsApp entrant de ${msg.from}: ${msg.text?.body ?? '[non-texte]'}`);
      // TODO Phase 2 : router vers AutoBot si message texte
    }

    return { status: 'ok' };
  }
}
