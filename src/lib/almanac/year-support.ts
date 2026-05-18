import { SolarDay, SolarTerm, SolarTime } from 'tyme4ts';
import { LEGAL_YEAR_MAX, LEGAL_YEAR_MIN, isLegalRouteYear } from './date-range';

export const INDEXED_YEAR_START = 2006;
export const INDEXED_YEAR_END = 2046;

export type YearProbeCheck =
  | 'SolarDay'
  | 'SolarTime'
  | 'LunarDay'
  | 'GanZhi'
  | 'SolarTerm'
  | 'DailyFields';

export interface YearProbeResult {
  year: number;
  supported: boolean;
  checks: Record<YearProbeCheck, { ok: boolean; value?: string; error?: string }>;
}

export function getIndexedYearRange(_referenceDate?: Date): { start: number; end: number } {
  void _referenceDate;

  return {
    start: INDEXED_YEAR_START,
    end: INDEXED_YEAR_END,
  };
}

export { LEGAL_YEAR_MAX, LEGAL_YEAR_MIN, isLegalRouteYear };

export function isIndexedYear(year: number, referenceDate?: Date): boolean {
  const { start, end } = getIndexedYearRange(referenceDate);
  return Number.isInteger(year) && year >= start && year <= end;
}

export function probeCalendarYearSupport(year: number): YearProbeResult {
  const checks = {} as YearProbeResult['checks'];

  function run(check: YearProbeCheck, fn: () => string): void {
    try {
      checks[check] = { ok: true, value: fn() };
    } catch (error) {
      checks[check] = {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  run('SolarDay', () => SolarDay.fromYmd(year, 1, 1).toString());
  run('SolarTime', () => SolarTime.fromYmdHms(year, 1, 1, 0, 0, 0).toString());
  run('LunarDay', () => SolarDay.fromYmd(year, 1, 1).getLunarDay().toString());
  run('GanZhi', () => SolarDay.fromYmd(year, 1, 1).getLunarDay().getSixtyCycle().toString());
  run('SolarTerm', () => SolarTerm.fromIndex(year, 1).getSolarDay().toString());
  run('DailyFields', () => {
    const lunar = SolarDay.fromYmd(year, 1, 1).getLunarDay();
    const daySixtyCycle = lunar.getSixtyCycle();
    const earthBranch = daySixtyCycle.getEarthBranch();
    const heavenStem = daySixtyCycle.getHeavenStem();

    return JSON.stringify({
      lunar: lunar.toString(),
      ganZhi: daySixtyCycle.toString(),
      zodiac: lunar.getYearSixtyCycle().getEarthBranch().getZodiac().toString(),
      yiCount: lunar.getRecommends().length,
      jiCount: lunar.getAvoids().length,
      chong: earthBranch.getOpposite().toString(),
      sha: earthBranch.getOminous().toString(),
      caiShen: heavenStem.getWealthDirection().toString(),
      solarTerm: SolarTerm.fromIndex(year, 1).getSolarDay().toString(),
    });
  });

  return {
    year,
    supported: Object.values(checks).every((check) => check.ok),
    checks,
  };
}
