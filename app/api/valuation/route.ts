import { NextRequest, NextResponse } from 'next/server';

const requests = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;

function text(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  // Silent success for bots that fill the off-screen honeypot.
  if (text(body.website, 300)) return NextResponse.json({ ok: true });
  const name = text(body.name, 120); const email = text(body.email, 254); const telephone = text(body.telephone, 60);
  const address = text(body.address, 300); const lookingTo = text(body.lookingTo, 10); const message = text(body.message, 3000);
  const consent = body.consent === true;
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telephone.replace(/\D/g, '').length < 7 || address.length < 3 || !['Sell', 'Let'].includes(lookingTo) || !consent) {
    return NextResponse.json({ error: 'Please check the required details and try again.' }, { status: 400 });
  }

  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const key = forwarded || request.headers.get('x-real-ip') || 'unknown'; const now = Date.now();
  const recent = (requests.get(key) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) return NextResponse.json({ error: 'Too many requests. Please try again later or call 01 459 5941.' }, { status: 429 });
  recent.push(now); requests.set(key, recent);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return NextResponse.json({ error: 'Online requests are temporarily unavailable. Please call 01 459 5941.' }, { status: 503 });
  const submittedAt = new Date().toISOString();
  const pageUrl = new URL('/valuation', process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin).toString();
  const emailText = [
    'New property valuation request', '', `Name: ${name}`, `Email: ${email}`, `Telephone: ${telephone}`,
    `Property address: ${address}`, `Looking to: ${lookingTo}`, `Message: ${message || '(not provided)'}`,
    `Consent: ${consent ? 'Yes' : 'No'}`, '', `Page: ${pageUrl}`, `Submitted at: ${submittedAt}`,
  ].join('\n');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: ['info@cityproperties.ie'], reply_to: email, subject: `Property valuation request — ${name}`, text: emailText }),
    });
    if (!response.ok) return NextResponse.json({ error: 'We could not send your request. Please retry or call 01 459 5941.' }, { status: 502 });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'We could not send your request. Please retry or call 01 459 5941.' }, { status: 502 });
  }
}
