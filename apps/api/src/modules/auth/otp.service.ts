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

  async send(identifier: string, code: string): Promise<void> {
    if (identifier.includes('@')) {
      return this.sendEmail(identifier, code);
    }

    return this.sendPhone(identifier, code);
  }

  async sendInvitation(identifier: string, payload: { name: string; role: 'GARAGE' | 'SUPPLIER' }): Promise<void> {
    if (identifier.includes('@')) {
      return this.sendInvitationEmail(identifier, payload);
    }

    this.logger.warn(`Invitation téléphone non supportée pour ${identifier}`);
  }

  async sendApprovalInstructions(identifier: string, payload: { name: string; role: 'GARAGE' | 'SUPPLIER' }): Promise<void> {
    if (identifier.includes('@')) {
      return this.sendApprovalEmail(identifier, payload);
    }

    this.logger.warn(`Instructions d'approbation téléphone non supportées pour ${identifier}`);
  }

  private async sendEmail(email: string, code: string): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('RESEND_FROM_EMAIL', 'AUTONORME <onboarding@resend.dev>');
    const masked = email.replace(/(^.).*(@.*$)/, '$1***$2');

    if (!apiKey || apiKey === 'CHANGE_ME') {
      this.logger.warn(`[DEV MODE] OTP email pour ${masked} : ${code}`);
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [email],
          subject: 'Votre code AUTONORME',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
              <h1 style="color:#001F5C;margin-bottom:8px">Code de connexion AUTONORME</h1>
              <p style="font-size:16px;line-height:1.6">Utilisez ce code pour continuer votre connexion ou inscription.</p>
              <div style="font-size:32px;font-weight:800;letter-spacing:8px;background:#EEF5FC;color:#001F5C;border-radius:16px;padding:18px 22px;text-align:center;margin:24px 0">${code}</div>
              <p style="font-size:14px;color:#6B7280">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
            </div>
          `,
          text: `Votre code AUTONORME est ${code}. Il expire dans 10 minutes.`,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        this.logger.error(`Resend OTP failed → ${masked}: ${details}`);
        throw new InternalServerErrorException('Échec envoi code OTP');
      }

      this.logger.log(`OTP email envoyé avec succès → ${masked}`);
    } catch (error) {
      this.logger.error(`Échec envoi OTP email → ${masked}`, error);
      throw new InternalServerErrorException('Échec envoi code OTP');
    }
  }

  private async sendInvitationEmail(email: string, payload: { name: string; role: 'GARAGE' | 'SUPPLIER' }): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('RESEND_FROM_EMAIL', 'AUTONORME <onboarding@resend.dev>');
    const masked = email.replace(/(^.).*(@.*$)/, '$1***$2');
    const roleLabel = payload.role === 'GARAGE' ? 'garage' : 'fournisseur';

    if (!apiKey || apiKey === 'CHANGE_ME') {
      this.logger.warn(`[DEV MODE] Invitation email pour ${masked} (${roleLabel})`);
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Votre accès professionnel AUTONORME',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
            <h1 style="color:#001F5C;margin-bottom:8px">Bienvenue sur AUTONORME</h1>
            <p style="font-size:16px;line-height:1.6">Votre compte ${roleLabel} pour <strong>${payload.name}</strong> a été préparé.</p>
            <p style="font-size:16px;line-height:1.6">Vous pouvez maintenant vous connecter avec votre email et le code OTP reçu à chaque connexion.</p>
            <p style="font-size:14px;color:#6B7280">Si vous n'êtes pas à l'origine de cette création de compte, ignorez cet email.</p>
          </div>
        `,
        text: `Votre compte ${roleLabel} AUTONORME a été préparé pour ${payload.name}.`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`Resend invitation failed → ${masked}: ${details}`);
      throw new InternalServerErrorException('Échec envoi invitation');
    }

    this.logger.log(`Invitation envoyée → ${masked}`);
  }

  private async sendApprovalEmail(email: string, payload: { name: string; role: 'GARAGE' | 'SUPPLIER' }): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('RESEND_FROM_EMAIL', 'AUTONORME <onboarding@resend.dev>');
    const masked = email.replace(/(^.).*(@.*$)/, '$1***$2');
    const roleLabel = payload.role === 'GARAGE' ? 'garage' : 'fournisseur';
    const portalUrl = this.config.get<string>(
      payload.role === 'GARAGE'
        ? 'GARAGE_PORTAL_URL'
        : 'SUPPLIER_PORTAL_URL',
      payload.role === 'GARAGE'
        ? 'https://garage.autonormesolutions.com'
        : 'https://supplier.autonormesolutions.com',
    );

    if (!apiKey || apiKey === 'CHANGE_ME') {
      this.logger.warn(`[DEV MODE] Instructions d'approbation pour ${masked} (${roleLabel})`);
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Votre espace ${roleLabel} AUTONORME est prêt`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
            <h1 style="color:#001F5C;margin-bottom:8px">Votre espace AUTONORME est prêt</h1>
            <p style="font-size:16px;line-height:1.6">Bonjour ${payload.name}, votre accès ${roleLabel} a été approuvé.</p>
            <p style="font-size:16px;line-height:1.6">Connectez-vous via <strong>${portalUrl}</strong> avec votre email. Un code OTP vous sera envoyé à chaque connexion.</p>
            <ol style="font-size:15px;line-height:1.8;padding-left:20px">
              <li>Ouvrez ${portalUrl}</li>
              <li>Saisissez votre email</li>
              <li>Récupérez le code OTP reçu par email</li>
              <li>Accédez à votre espace ${roleLabel}</li>
            </ol>
            <p style="font-size:14px;color:#6B7280">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
          </div>
        `,
        text: `Bonjour ${payload.name}, votre espace ${roleLabel} AUTONORME est prêt. Connectez-vous via ${portalUrl} avec votre email, puis utilisez le code OTP reçu.`,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.error(`Resend approval failed → ${masked}: ${details}`);
      throw new InternalServerErrorException('Échec envoi instructions');
    }

    this.logger.log(`Instructions d'approbation envoyées → ${masked}`);
  }

  private async sendPhone(phone: string, code: string): Promise<void> {
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
