import { redis } from '@/lib/redis';
import type { DailyAlmanac } from './types';

const CACHE_TTL = 86400; // 24 hours in seconds (DATA-03)

export async function getCachedAlmanac(dateStr: string): Promise<DailyAlmanac | null> {
  try {
    const cached = await redis.get(`almanac:${dateStr}`);
    if (!cached) return null;
    return JSON.parse(cached) as DailyAlmanac;
  } catch {
    // Redis connection error — return null to trigger recomputation
    return null;
  }
}

export async function setCachedAlmanac(dateStr: string, data: DailyAlmanac): Promise<void> {
  try {
    await redis.setex(`almanac:${dateStr}`, CACHE_TTL, JSON.stringify(data));
  } catch {
    // Redis connection error — log but don't throw; data is still returned
    console.error(`[Redis] Failed to cache almanac for ${dateStr}`);
  }
}
