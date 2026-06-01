import { type NextRequest } from 'next/server';
import { parseUsageEventPayload } from '@/lib/usage/payload';
import { storeUsageEvent } from '@/lib/usage/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BODY_LENGTH = 12_000;

export async function POST(request: NextRequest) {
  const text = await request.text();
  if (text.length > MAX_BODY_LENGTH) {
    return Response.json({ ok: false, error: 'payload-too-large' }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return Response.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }

  const event = parseUsageEventPayload(raw);
  if (!event) {
    return Response.json({ ok: false, error: 'invalid-event' }, { status: 400 });
  }

  try {
    await storeUsageEvent(event, request);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[usage] failed to store event', error);
    return Response.json({ ok: false, error: 'store-failed' }, { status: 500 });
  }
}
