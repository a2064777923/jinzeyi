import { createHash } from 'node:crypto';
import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { UsageEventPayload } from './types';
import { buildUsageSummary, type UsageSummary } from './summary';

const MAX_EVENTS_FOR_SUMMARY = 20000;

export async function storeUsageEvent(event: UsageEventPayload, request: NextRequest): Promise<void> {
  const visitorHash = hashVisitor(event.sessionId || getClientIp(request));

  await prisma.usageEvent.create({
    data: {
      eventName: event.eventName,
      area: event.area,
      status: event.status,
      locale: event.locale,
      path: event.path,
      referrer: event.referrer,
      visitorHash,
      payload: event.payload as Prisma.InputJsonValue | undefined,
      result: event.result as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function getUsageSummary(days: number): Promise<UsageSummary> {
  const safeDays = clampDays(days);
  const since = new Date(Date.now() - safeDays * 24 * 60 * 60 * 1000);
  const events = await prisma.usageEvent.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: 'desc' },
    take: MAX_EVENTS_FOR_SUMMARY,
    select: {
      eventName: true,
      area: true,
      status: true,
      locale: true,
      path: true,
      visitorHash: true,
      payload: true,
      result: true,
      createdAt: true,
    },
  });

  return buildUsageSummary(events, safeDays);
}

export function clampDays(value: number): number {
  if (!Number.isFinite(value)) return 30;
  return Math.min(180, Math.max(1, Math.round(value)));
}

function hashVisitor(value: string | undefined): string | undefined {
  const salt = process.env.USAGE_HASH_SALT;
  if (!salt || !value) return undefined;
  return createHash('sha256').update(`${salt}:${value}`).digest('hex').slice(0, 40);
}

function getClientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || undefined;
}
