import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.type || !body?.companyName || !body?.contactName || !body?.email) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || 'AUTONORME <onboarding@resend.dev>';
  const to = process.env.JOIN_INTAKE_EMAIL || 'partners@autonormesolutions.com';

  if (!apiKey || apiKey === 'CHANGE_ME') {
    console.log('[JOIN REQUEST]', body);
    return NextResponse.json({ ok: true, demo: true });
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
      subject: `Nouvelle demande ${body.type === 'garage' ? 'garage' : 'AUTOparts'} AUTONORME`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
          <h1 style="color:#001F5C">Nouvelle demande de partenariat</h1>
          <p><strong>Type:</strong> ${body.type}</p>
          <p><strong>Entreprise:</strong> ${body.companyName}</p>
          <p><strong>Contact:</strong> ${body.contactName}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Téléphone:</strong> ${body.phone || '-'}</p>
          <p><strong>Ville:</strong> ${body.city || '-'}</p>
          <p><strong>Message:</strong><br/>${String(body.message || '').replace(/\n/g, '<br/>')}</p>
        </div>
      `,
      text: `Nouvelle demande ${body.type}\nEntreprise: ${body.companyName}\nContact: ${body.contactName}\nEmail: ${body.email}\nTéléphone: ${body.phone || '-'}\nVille: ${body.city || '-'}\nMessage: ${body.message || '-'}`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
