import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly config: ConfigService) {}

  async send(phone: string, code: string): Promise<void> {
    const apiKey = this.config.get<string>('SENTDM_API_KEY');
    const masked = phone.replace(/\d(?=\d{4})/g, '*');
    const message = `Votre code AUTONORME : ${code}. Valide 10 minutes. Ne le partagez jamais.`;

    // Mode développement : log sans envoi réel
    if (!apiKey || apiKey === 'CHANGE_ME') {
      this.logger.warn(`[DEV] OTP ${masked} → ${code}`);
      return;
    }

    this.logger.log(`Envoi OTP → ${masked}`);

    const res = await fetch('https://api.sent.dm/v1/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to: phone, message, channel: 'whatsapp' }),
    });

    if (!res.ok) {
      this.logger.error(`sent.dm erreur ${res.status} pour ${masked}`);
      throw new Error(`OTP send failed: ${res.status}`);
    }
  }
}
