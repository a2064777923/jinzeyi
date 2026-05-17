import { SolarDay, SolarMonth } from 'tyme4ts';
import { getCachedAlmanac, setCachedAlmanac, getCachedHourlyFortune, setCachedHourlyFortune, getCachedMonthlyCalendar, setCachedMonthlyCalendar } from './cache';
import type { DailyAlmanac, HourlyFortune, CalendarDay } from './types';

/**
 * Get daily almanac data for a given date.
 * Checks Redis cache first; on miss, computes from tyme4ts and caches for 24h.
 *
 * @param dateStr - Date in "YYYY-MM-DD" format
 */
export async function getDailyAlmanac(dateStr: string): Promise<DailyAlmanac> {
  // Check cache first
  const cached = await getCachedAlmanac(dateStr);
  if (cached) return cached;

  // Parse date string
  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = SolarDay.fromYmd(year, month, day);
  const lunar = solar.getLunarDay();

  // Gan-Zhi (干支) cycles
  const daySixtyCycle = lunar.getSixtyCycle();
  const earthBranch = daySixtyCycle.getEarthBranch();
  const heavenStem = daySixtyCycle.getHeavenStem();

  // Lunar date parts
  const lunarMonth = lunar.getLunarMonth();
  const lunarYear = lunarMonth.getLunarYear();

  const data: DailyAlmanac = {
    solar: { year, month, day },
    lunar: {
      year: lunarYear.getSixtyCycle().toString() + '年',
      month: lunarMonth.getName(),
      day: lunar.getName(),
      lunarDate: lunar.toString(),
    },
    ganZhi: {
      year: lunar.getYearSixtyCycle().toString(),
      month: lunar.getMonthSixtyCycle().toString(),
      day: daySixtyCycle.toString(),
    },
    zodiac: earthBranch.getZodiac().toString(),
    yi: lunar.getRecommends().map((r) => r.toString()),
    ji: lunar.getAvoids().map((a) => a.toString()),
    direction: {
      chong: earthBranch.getOpposite().toString(),
      sha: earthBranch.getOminous().toString(),
      caiShen: heavenStem.getWealthDirection().toString(),
      xiShen: heavenStem.getJoyDirection().toString(),
      fuShen: heavenStem.getMascotDirection().toString(),
    },
    gods: lunar.getGods().map((g) => g.toString()),
    duty: lunar.getDuty().toString(),
    twentyEightStar: lunar.getTwentyEightStar().toString(),
    pengZu: daySixtyCycle.getPengZu().toString(),
    sound: daySixtyCycle.getSound().toString(),
    fetusDay: lunar.getFetusDay().toString(),
  };

  await setCachedAlmanac(dateStr, data);

  return data;
}

export async function getHourlyFortune(dateStr: string): Promise<HourlyFortune[]> {
  const cached = await getCachedHourlyFortune(dateStr);
  if (cached) return cached;

  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = SolarDay.fromYmd(year, month, day);
  const lunar = solar.getLunarDay();
  const hours = lunar.getHours().slice(0, 12);

  const result: HourlyFortune[] = hours.map((h) => {
    const star = h.getTwelveStar();
    return {
      name: h.getName(),
      ganZhi: h.getSixtyCycleHour().toString().slice(-3, -1),
      star: star.toString(),
      fortune: star.getEcliptic().getLuck().toString() as '吉' | '凶',
      yi: h.getRecommends().map((r) => r.toString()),
      ji: h.getAvoids().map((a) => a.toString()),
    };
  });

  await setCachedHourlyFortune(dateStr, result);
  return result;
}

export async function getMonthlyCalendar(year: number, month: number): Promise<CalendarDay[]> {
  const cacheKey = `${year}-${String(month).padStart(2, '0')}`;
  const cached = await getCachedMonthlyCalendar(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const days = SolarMonth.fromYm(year, month).getDays();
  const result: CalendarDay[] = days.map((d) => {
    const lunar = d.getLunarDay();
    const dateStr = `${d.getYear()}-${String(d.getMonth()).padStart(2, '0')}-${String(d.getDay()).padStart(2, '0')}`;
    return {
      solarDay: d.getDay(),
      lunarDay: lunar.getName(),
      fortune: lunar.getTwelveStar().getEcliptic().getLuck().toString() as '吉' | '凶',
      isToday: dateStr === todayStr,
      dateStr,
      weekday: d.getWeek().getIndex(),
    };
  });

  await setCachedMonthlyCalendar(cacheKey, result);
  return result;
}
