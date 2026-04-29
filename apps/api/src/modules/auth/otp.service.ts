import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Sentdm from '@sentdm/sentdm';

// ─────────────────────────────────────────────────────────────────────────────
// OTP Service — sent.dm SDK officiel (API v3)
//
// API v3 key points :
//   - Authentification : header x-api-key (pas Bearer)
//   - Envoi via template (id ou name + parameters)
//   - Multi-canal : ["whatsapp", "sms"] = fallback automatique
//   - Mode sandbox : { sandbox: true } pour les tests
//
// Template requis sur app.sent.dm :
//   Nom    : "autonorme_otp"
//   Contenu: "Votre code AUTONORME est : {{code}}. Valide 10 minutes."
//   Canaux : WhatsApp + SMS
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private client: Sentdm | null = null;

  constructor(private readonly config: ConfigService) {}

  private getClient(): Sentdm {
    if (!this.client) {
      this.client = new Sentdm({
        apiKey: this.config.getOrThrow<string>('SENTDM_API_KEY'),
      });
    }
    return this.client;
  }

  async send(phone: string, code: string): Promise<void> {
    const apiKey = this.config.get<string>('SENTDM_API_KEY');
    const templateId = this.config.get<string>('SENTDM_OTP_TEMPLATE_ID');
    const masked = phone.replace(/\d(?=\d{4})/g, '*');

    // ── Mode développement : log direct, pas d'envoi réel ────────────────────
    if (!apiKey || apiKey === 'CHANGE_ME') {
      this.logger.warn(`[DEV MODE] OTP pour ${masked} : ${code}`);
      return;
    }

    if (!templateId || templateId === 'CHANGE_ME') {
      this.logger.error('SENTDM_OTP_TEMPLATE_ID non configuré. Créer le template sur app.sent.dm');
      throw new InternalServerErrorException('Service OTP non configuré');
    }

    this.logger.log(`Envoi OTP → ${masked}`);

    try {
      const client = this.getClient();

      // API v3 : envoi multi-canal avec template
      // "whatsapp" est prioritaire, "sms" en fallback automatique
      await client.messages.send({
        to: [phone],
        channel: ['whatsapp', 'sms'],
        template: {
          id: templateId,
          parameters: {
            code,              // {{code}} dans le template
            expiry: '10 min', // {{expiry}} optionnel
          },
        },
        sandbox: false,
      });

      this.logger.log(`OTP envoyé avec succès → ${masked}`);
    } catch (error) {
      this.logger.error(`Échec envoi OTP → ${masked}`, error);
      throw new InternalServerErrorException('Échec envoi code OTP');
    }
  }
}
