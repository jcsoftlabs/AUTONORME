import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.type || !body?.companyName || !body?.contactName || !body?.email) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json({ error: 'API non configurée' }, { status: 500 });
  }

  const response = await fetch(`${apiUrl}/join-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    return NextResponse.json({ error: error?.message || 'Erreur join' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
