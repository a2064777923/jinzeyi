import { SolarDay } from 'tyme4ts';
import { getCachedAlmanac, setCachedAlmanac } from './cache';
import type { DailyAlmanac } from './types';

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

  // Cache the result (non-blocking — errors are caught in setCachedAlmanac)
  await setCachedAlmanac(dateStr, data);

  return data;
}
