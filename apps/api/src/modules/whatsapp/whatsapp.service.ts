import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Sentdm from '@sentdm/sentdm';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Sentdm | null = null;

  constructor(private readonly config: ConfigService) {}

  private getClient(): Sentdm {
    if (!this.client) {
      this.client = new Sentdm({ apiKey: this.config.getOrThrow<string>('SENTDM_API_KEY') });
    }
    return this.client;
  }

  async sendTemplate(phone: string, templateId: string, parameters: Record<string, string>): Promise<void> {
    const apiKey = this.config.get<string>('SENTDM_API_KEY');
    if (!apiKey || apiKey === 'CHANGE_ME') {
      this.logger.warn(`[DEV] WhatsApp template ${templateId} → ${phone}`);
      return;
    }
    try {
      await this.getClient().messages.send({
        to: [phone],
        channel: ['whatsapp'],
        template: { id: templateId, parameters },
        sandbox: false,
      });
    } catch (err) {
      this.logger.error(`WhatsApp send failed → ${phone}`, err);
      throw err;
    }
  }

  // Templates AUTONORME pré-définis
  async sendAppointmentConfirmation(phone: string, data: { date: string; garage: string }): Promise<void> {
    const templateId = this.config.get<string>('SENTDM_TEMPLATE_APPOINTMENT_ID', '');
    await this.sendTemplate(phone, templateId, data);
  }

  async sendOrderConfirmation(phone: string, data: { orderNumber: string; total: string }): Promise<void> {
    const templateId = this.config.get<string>('SENTDM_TEMPLATE_ORDER_ID', '');
    await this.sendTemplate(phone, templateId, data);
  }
}
