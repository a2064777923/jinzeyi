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

import { getDailyAlmanac, getMonthlyCalendar, getSolarTerms } from '@/lib/almanac/service';
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
    expect(data.zodiac).toBe('马');
    expect(ZODIAC_ANIMALS).toContain(data.dayZodiac);
    expect(data.dayZodiac).toBe('兔');
    expect(data.fortune).toBe('凶');

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

  it('ignores stale daily cache where zodiac was day zodiac', async () => {
    store.set(
      'almanac:2026-05-17',
      JSON.stringify({
        solar: { year: 2026, month: 5, day: 17 },
        lunar: { year: '丙午年', month: '四月', day: '初一', lunarDate: '农历丙午年四月初一' },
        ganZhi: { year: '丙午', month: '癸巳', day: '辛卯' },
        zodiac: '兔',
        yi: ['祭祀'],
        ji: ['嫁娶'],
        direction: { chong: '鸡', sha: '西', caiShen: '东', xiShen: '西南', fuShen: '西北' },
        gods: ['天德'],
        duty: '开',
        twentyEightStar: '昴',
        pengZu: '辛不合酱',
        sound: '松柏木',
        fetusDay: '厨灶门外正北',
      })
    );

    const data = await getDailyAlmanac('2026-05-17');

    expect(data.zodiac).toBe('马');
    expect(data.dayZodiac).toBe('兔');
    expect(redis.setex).toHaveBeenCalledWith(
      'almanac:2026-05-17',
      86400,
      expect.stringContaining('"dayZodiac":"兔"')
    );
  });

  it('returns consistent data across multiple calls for same date', async () => {
    const data1 = await getDailyAlmanac('2026-06-01');
    const data2 = await getDailyAlmanac('2026-06-01');
    expect(data1).toEqual(data2);
  });

  it('uses the same daily fortune for detail and monthly calendar', async () => {
    const [daily, days] = await Promise.all([
      getDailyAlmanac('2026-05-17'),
      getMonthlyCalendar(2026, 5),
    ]);
    const calendarDay = days.find((day) => day.dateStr === '2026-05-17');

    expect(calendarDay?.fortune).toBe('凶');
    expect(daily.fortune).toBe(calendarDay?.fortune);
  });

  it('handles different dates independently', async () => {
    const data1 = await getDailyAlmanac('2026-01-01');
    const data2 = await getDailyAlmanac('2026-12-31');
    // Different dates should have different lunar dates
    expect(data1.lunar.lunarDate).not.toBe(data2.lunar.lunarDate);
  });

  it('getSolarTerms returns all 24 terms for a year', async () => {
    const terms = await getSolarTerms(2026);

    expect(terms).toHaveLength(24);
    expect(terms[0].name).toBe('小寒');
    expect(terms.at(-1)?.name).toBe('冬至');
    expect(terms.every((term) => term.date.startsWith('2026-'))).toBe(true);
  });

  it('getMonthlyCalendar includes educational day metadata', async () => {
    const days = await getMonthlyCalendar(2026, 5);
    const liXia = days.find((day) => day.solarTerm === '立夏');
    const firstDay = days[0];

    expect(days).toHaveLength(31);
    expect(firstDay.duty).toBeTruthy();
    expect(firstDay.twelveStar).toBeTruthy();
    expect(Array.isArray(firstDay.yi)).toBe(true);
    expect(Array.isArray(firstDay.ji)).toBe(true);
    expect(liXia?.solarDay).toBe(5);
  });

  it('getMonthlyCalendar formats early common-era dates with four-digit years', async () => {
    const days = await getMonthlyCalendar(2, 1);

    expect(days[0].dateStr).toBe('0002-01-01');
    expect(days[0].dateStr).toHaveLength(10);
  });

  it('getMonthlyCalendar ignores stale cached data without educational metadata', async () => {
    store.set(
      'almanac:monthly:2026-05:v2',
      JSON.stringify([
        {
          solarDay: 1,
          lunarDay: '十五',
          fortune: '吉',
          isToday: false,
          dateStr: '2026-05-01',
          weekday: 5,
        },
      ])
    );

    const days = await getMonthlyCalendar(2026, 5);

    expect(days).toHaveLength(31);
    expect(days[0].duty).toBeTruthy();
    expect(days[0].twelveStar).toBeTruthy();
    expect(Array.isArray(days[0].yi)).toBe(true);
    expect(Array.isArray(days[0].ji)).toBe(true);
    expect(redis.setex).toHaveBeenCalledWith(
      'almanac:monthly:2026-05:v2',
      604800,
      expect.any(String)
    );
  });
});
