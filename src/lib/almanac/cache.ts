import { redis } from '@/lib/redis';
import type { DailyAlmanac, HourlyFortune, CalendarDay } from './types';

const CACHE_TTL = 86400; // 24 hours in seconds (DATA-03)

export async function getCachedAlmanac(dateStr: string): Promise<DailyAlmanac | null> {
  try {
    const cached = await redis.get(`almanac:${dateStr}`);
    if (!cached) return null;
    return JSON.parse(cached) as DailyAlmanac;
  } catch {
    return null;
  }
}

export async function setCachedAlmanac(dateStr: string, data: DailyAlmanac): Promise<void> {
  try {
    await redis.setex(`almanac:${dateStr}`, CACHE_TTL, JSON.stringify(data));
  } catch {
    console.error(`[Redis] Failed to cache almanac for ${dateStr}`);
  }
}

export async function getCachedHourlyFortune(dateStr: string): Promise<HourlyFortune[] | null> {
  try {
    const cached = await redis.get(`almanac:hourly:${dateStr}`);
    if (!cached) return null;
    return JSON.parse(cached) as HourlyFortune[];
  } catch {
    return null;
  }
}

export async function setCachedHourlyFortune(dateStr: string, data: HourlyFortune[]): Promise<void> {
  try {
    await redis.setex(`almanac:hourly:${dateStr}`, CACHE_TTL, JSON.stringify(data));
  } catch {
    console.error(`[Redis] Failed to cache hourly fortune for ${dateStr}`);
  }
}

const MONTHLY_CACHE_TTL = 604800; // 7 days

export async function getCachedMonthlyCalendar(cacheKey: string): Promise<CalendarDay[] | null> {
  try {
    const cached = await redis.get(`almanac:monthly:${cacheKey}`);
    if (!cached) return null;
    return JSON.parse(cached) as CalendarDay[];
  } catch {
    return null;
  }
}

export async function setCachedMonthlyCalendar(cacheKey: string, data: CalendarDay[]): Promise<void> {
  try {
    await redis.setex(`almanac:monthly:${cacheKey}`, MONTHLY_CACHE_TTL, JSON.stringify(data));
  } catch {
    console.error(`[Redis] Failed to cache monthly calendar for ${cacheKey}`);
  }
}
