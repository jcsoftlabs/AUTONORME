import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JoinRequestStatus } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { Role } from '@autonorme/types';
import { OtpService } from '../auth/otp.service';

type CreateJoinRequestInput = {
  type: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  city?: string;
  message?: string;
  locale?: string;
};

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async create(data: CreateJoinRequestInput) {
    const request = await this.db.joinRequest.create({
      data: {
        type: data.type,
        companyName: data.companyName.trim(),
        contactName: data.contactName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        city: data.city?.trim() || null,
        message: data.message?.trim() || null,
        locale: data.locale || 'fr',
      },
    });

    await this.notifyIntake(request);

    return request;
  }

  async list() {
    return this.db.joinRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: JoinRequestStatus, adminNote?: string | null) {
    const existing = await this.db.joinRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Demande introuvable');
    }

    if (status === JoinRequestStatus.APPROVED) {
      await this.preparePartnerAccess(existing);
    }

    return this.db.joinRequest.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote?.trim() || null,
        reviewedAt: new Date(),
      },
    });
  }

  private async preparePartnerAccess(request: {
    type: string;
    companyName: string;
    contactName: string;
    email: string;
  }) {
    const role = request.type === 'garage' ? Role.GARAGE : Role.SUPPLIER;

    const user = await this.db.user.upsert({
      where: { email: request.email },
      update: {
        name: request.contactName || request.companyName,
        role,
        isActive: true,
        accountStatus: 'PENDING',
      },
      create: {
        email: request.email,
        name: request.contactName || request.companyName,
        role,
        isActive: true,
        accountStatus: 'PENDING',
      },
    });

    await this.otpService.sendApprovalInstructions(user.email ?? request.email, {
      name: request.companyName,
      role: request.type === 'garage' ? 'GARAGE' : 'SUPPLIER',
    });
  }

  private async notifyIntake(request: {
    type: string;
    companyName: string;
    contactName: string;
    email: string;
    phone?: string | null;
    city?: string | null;
    message?: string | null;
  }) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('RESEND_FROM_EMAIL', 'AUTONORME <onboarding@resend.dev>');
    const to = this.config.get<string>('JOIN_INTAKE_EMAIL', 'partners@autonormesolutions.com');

    if (!apiKey || apiKey === 'CHANGE_ME') {
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
        to: [to],
        subject: `Nouvelle demande ${request.type === 'garage' ? 'garage' : 'AUTOparts'} AUTONORME`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
            <h1 style="color:#001F5C">Nouvelle demande de partenariat</h1>
            <p><strong>Type:</strong> ${request.type}</p>
            <p><strong>Entreprise:</strong> ${request.companyName}</p>
            <p><strong>Contact:</strong> ${request.contactName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Téléphone:</strong> ${request.phone || '-'}</p>
            <p><strong>Ville:</strong> ${request.city || '-'}</p>
            <p><strong>Message:</strong><br/>${String(request.message || '').replace(/\n/g, '<br/>')}</p>
          </div>
        `,
        text: `Nouvelle demande ${request.type}\nEntreprise: ${request.companyName}\nContact: ${request.contactName}\nEmail: ${request.email}\nTéléphone: ${request.phone || '-'}\nVille: ${request.city || '-'}\nMessage: ${request.message || '-'}`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Échec envoi demande');
    }
  }
}
