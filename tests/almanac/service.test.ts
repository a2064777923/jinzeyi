import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Redis before importing the service
const store = new Map<string, string>();

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(async (key: string) => store.get(key) || null),
    setex: vi.fn(async (key: string, _ttl: number, value: string) => {
      store.set(key, value);
    }),
  },
}));

import { getDailyAlmanac } from '@/lib/almanac/service';
import { redis } from '@/lib/redis';

const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

describe('AlmanacService integration', () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  it('getDailyAlmanac returns valid DailyAlmanac object', async () => {
    const data = await getDailyAlmanac('2026-05-17');

    // Solar date
    expect(data.solar.year).toBe(2026);
    expect(data.solar.month).toBe(5);
    expect(data.solar.day).toBe(17);

    // Lunar date
    expect(data.lunar.year).toBeTruthy();
    expect(data.lunar.month).toBeTruthy();
    expect(data.lunar.day).toBeTruthy();
    expect(data.lunar.lunarDate).toBeTruthy();

    // Gan-Zhi
    expect(data.ganZhi.year).toBeTruthy();
    expect(data.ganZhi.month).toBeTruthy();
    expect(data.ganZhi.day).toBeTruthy();

    // Zodiac
    expect(ZODIAC_ANIMALS).toContain(data.zodiac);

    // Yi/Ji
    expect(Array.isArray(data.yi)).toBe(true);
    expect(data.yi.length).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(data.ji)).toBe(true);
    expect(data.ji.length).toBeGreaterThanOrEqual(1);

    // Directions
    expect(data.direction.chong).toBeTruthy();
    expect(data.direction.sha).toBeTruthy();
    expect(data.direction.caiShen).toBeTruthy();
    expect(data.direction.xiShen).toBeTruthy();
    expect(data.direction.fuShen).toBeTruthy();

    // Other fields
    expect(Array.isArray(data.gods)).toBe(true);
    expect(data.gods.length).toBeGreaterThanOrEqual(1);
    expect(data.duty).toBeTruthy();
    expect(data.twentyEightStar).toBeTruthy();
    expect(data.pengZu).toBeTruthy();
    expect(data.sound).toBeTruthy();
    expect(data.fetusDay).toBeTruthy();
  });

  it('cache is populated on first call', async () => {
    await getDailyAlmanac('2026-05-17');
    expect(redis.get).toHaveBeenCalledWith('almanac:2026-05-17');
    expect(redis.setex).toHaveBeenCalledWith(
      'almanac:2026-05-17',
      86400,
      expect.any(String)
    );
  });

  it('second call returns cached data from Redis', async () => {
    const first = await getDailyAlmanac('2026-05-18');
    const second = await getDailyAlmanac('2026-05-18');

    // Both calls should return the same data
    expect(first).toEqual(second);
    // Redis.get should have been called twice (first miss, second hit)
    expect(redis.get).toHaveBeenCalledTimes(2);
    // Redis.setex should have been called only once (first call only)
    expect(redis.setex).toHaveBeenCalledTimes(1);
  });

  it('returns consistent data across multiple calls for same date', async () => {
    const data1 = await getDailyAlmanac('2026-06-01');
    const data2 = await getDailyAlmanac('2026-06-01');
    expect(data1).toEqual(data2);
  });

  it('handles different dates independently', async () => {
    const data1 = await getDailyAlmanac('2026-01-01');
    const data2 = await getDailyAlmanac('2026-12-31');
    // Different dates should have different lunar dates
    expect(data1.lunar.lunarDate).not.toBe(data2.lunar.lunarDate);
  });
});
