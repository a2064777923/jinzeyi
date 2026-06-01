import { type NextRequest } from 'next/server';
import { isUsageAccessAllowed } from '@/lib/usage/auth';
import { clampDays, getUsageSummary } from '@/lib/usage/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  if (!isUsageAccessAllowed(request)) {
    return Response.json({ ok: false, error: 'not-found' }, { status: 404 });
  }

  const days = clampDays(Number(request.nextUrl.searchParams.get('days') ?? 30));
  const summary = await getUsageSummary(days);
  return Response.json(summary);
}
