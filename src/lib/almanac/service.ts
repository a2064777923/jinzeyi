import { SolarDay, SolarMonth, SolarTerm as TymeSolarTerm } from 'tyme4ts';
import { getCachedAlmanac, setCachedAlmanac, getCachedHourlyFortune, setCachedHourlyFortune, getCachedMonthlyCalendar, setCachedMonthlyCalendar, getCachedSolarTerms, setCachedSolarTerms } from './cache';
import type { DailyAlmanac, HourlyFortune, CalendarDay, SolarTerm } from './types';

type Fortune = '吉' | '凶';

function getDailyFortune(lunar: ReturnType<SolarDay['getLunarDay']>): Fortune {
  return lunar.getTwelveStar().getEcliptic().getLuck().toString() as Fortune;
}

/**
 * Get daily almanac data for a given date.
 * Checks Redis cache first; on miss, computes from tyme4ts and caches for 24h.
 *
 * @param dateStr - Date in "YYYY-MM-DD" format
 */
export async function getDailyAlmanac(dateStr: string): Promise<DailyAlmanac> {
  // Check cache first
  const cached = await getCachedAlmanac(dateStr);
  if (isCompleteDailyAlmanac(cached)) return cached;

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
    zodiac: lunar.getYearSixtyCycle().getEarthBranch().getZodiac().toString(),
    dayZodiac: earthBranch.getZodiac().toString(),
    fortune: getDailyFortune(lunar),
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

function isCompleteDailyAlmanac(data: DailyAlmanac | null): data is DailyAlmanac {
  return Boolean(
    data &&
    typeof data.zodiac === 'string' &&
    typeof data.dayZodiac === 'string' &&
    (data.fortune === '吉' || data.fortune === '凶') &&
    Array.isArray(data.yi) &&
    Array.isArray(data.ji)
  );
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
  const cacheKey = `${year}-${String(month).padStart(2, '0')}:v2`;
  const cached = await getCachedMonthlyCalendar(cacheKey);
  const todayStr = getTodayDateStr();
  if (isCompleteMonthlyCalendar(cached)) {
    return applyTodayFlag(cached, todayStr);
  }


  const days = SolarMonth.fromYm(year, month).getDays();
  const result: CalendarDay[] = days.map((d) => {
    const lunar = d.getLunarDay();
    const dateStr = `${d.getYear()}-${String(d.getMonth()).padStart(2, '0')}-${String(d.getDay()).padStart(2, '0')}`;
    const term = d.getTermDay();
    const isTermDay = term.getDayIndex() === 0;
    return {
      solarDay: d.getDay(),
      lunarDay: lunar.getName(),
      fortune: getDailyFortune(lunar),
      duty: lunar.getDuty().toString(),
      twelveStar: lunar.getTwelveStar().toString(),
      solarTerm: isTermDay ? term.getSolarTerm().toString() : null,
      yi: lunar.getRecommends().map((r) => r.toString()).slice(0, 2),
      ji: lunar.getAvoids().map((a) => a.toString()).slice(0, 2),
      isToday: dateStr === todayStr,
      dateStr,
      weekday: d.getWeek().getIndex(),
    };
  });

  await setCachedMonthlyCalendar(cacheKey, result);
  return applyTodayFlag(result, todayStr);
}

function getTodayDateStr(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function applyTodayFlag(days: CalendarDay[], todayStr: string): CalendarDay[] {
  return days.map((day) => {
    const isToday = day.dateStr === todayStr;
    return day.isToday === isToday ? day : { ...day, isToday };
  });
}

function isCompleteMonthlyCalendar(days: CalendarDay[] | null): days is CalendarDay[] {
  if (!Array.isArray(days) || days.length === 0) return false;

  return days.every((day) => (
    typeof day.solarDay === 'number' &&
    typeof day.lunarDay === 'string' &&
    (day.fortune === '吉' || day.fortune === '凶') &&
    typeof day.duty === 'string' &&
    typeof day.twelveStar === 'string' &&
    (typeof day.solarTerm === 'string' || day.solarTerm === null) &&
    Array.isArray(day.yi) &&
    Array.isArray(day.ji) &&
    typeof day.isToday === 'boolean' &&
    typeof day.dateStr === 'string' &&
    typeof day.weekday === 'number'
  ));
}

export async function getSolarTerms(year: number): Promise<SolarTerm[]> {
  const cached = await getCachedSolarTerms(year);
  if (cached?.length === 24) return cached;

  const terms: SolarTerm[] = [];
  for (let i = 1; i <= 24; i++) {
    const t = TymeSolarTerm.fromIndex(year, i);
    const solarDay = t.getSolarDay();
    terms.push({
      name: t.toString(),
      date: `${solarDay.getYear()}-${String(solarDay.getMonth()).padStart(2, '0')}-${String(solarDay.getDay()).padStart(2, '0')}`,
      isJie: t.isJie(),
      year: t.getYear(),
    });
  }

  await setCachedSolarTerms(year, terms);
  return terms;
}
