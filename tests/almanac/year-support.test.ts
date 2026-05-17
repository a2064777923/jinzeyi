import { describe, expect, it } from 'vitest';
import {
  INDEXED_YEAR_END,
  INDEXED_YEAR_START,
  LEGAL_YEAR_MAX,
  LEGAL_YEAR_MIN,
  getIndexedYearRange,
  isIndexedYear,
  isLegalRouteYear,
  probeCalendarYearSupport,
} from '@/lib/almanac/year-support';

describe('Phase 3 year support guardrails', () => {
  it('defines the legal dynamic route range as 2-5000', () => {
    expect(LEGAL_YEAR_MIN).toBe(2);
    expect(LEGAL_YEAR_MAX).toBe(5000);
    expect(isLegalRouteYear(2)).toBe(true);
    expect(isLegalRouteYear(5000)).toBe(true);
    expect(isLegalRouteYear(-1)).toBe(false);
    expect(isLegalRouteYear(0)).toBe(false);
    expect(isLegalRouteYear(1)).toBe(false);
    expect(isLegalRouteYear(5001)).toBe(false);
    expect(isLegalRouteYear(2026.5)).toBe(false);
  });

  it('defines the indexed sitemap/SSG window as 2006-2046 for 2026-05-17', () => {
    const range = getIndexedYearRange(new Date('2026-05-17T00:00:00+08:00'));

    expect(INDEXED_YEAR_START).toBe(2006);
    expect(INDEXED_YEAR_END).toBe(2046);
    expect(range).toEqual({ start: 2006, end: 2046 });
    expect(isIndexedYear(2006)).toBe(true);
    expect(isIndexedYear(2046)).toBe(true);
    expect(isIndexedYear(2005)).toBe(false);
    expect(isIndexedYear(2047)).toBe(false);
  });

  it('probes tyme4ts calendar support for the required boundary years', () => {
    const probeYears = [0, 1, 2, 1900, 2100, 5000];
    const results = probeYears.map((year) => probeCalendarYearSupport(year));

    expect(results.map((result) => result.year)).toEqual(probeYears);
    for (const result of results) {
      expect(Object.keys(result.checks).sort()).toEqual([
        'DailyFields',
        'GanZhi',
        'LunarDay',
        'SolarDay',
        'SolarTerm',
        'SolarTime',
      ]);
    }
  });

  it('records year 0 as unsupported by the installed tyme4ts APIs', () => {
    const result = probeCalendarYearSupport(0);

    expect(result.supported).toBe(false);
    expect(result.checks.SolarDay.ok).toBe(false);
    expect(result.checks.SolarDay.error).toContain('illegal solar year: 0');
    expect(result.checks.SolarTime.ok).toBe(false);
    expect(result.checks.LunarDay.ok).toBe(false);
    expect(result.checks.GanZhi.ok).toBe(false);
    expect(result.checks.SolarTerm.ok).toBe(false);
    expect(result.checks.DailyFields.ok).toBe(false);
  });

  it('records year 1 as unsupported for service-style daily fields', () => {
    const result = probeCalendarYearSupport(1);

    expect(result.supported).toBe(false);
    expect(result.checks.SolarDay.ok).toBe(true);
    expect(result.checks.SolarTime.ok).toBe(true);
    expect(result.checks.LunarDay.ok).toBe(true);
    expect(result.checks.GanZhi.ok).toBe(true);
    expect(result.checks.SolarTerm.ok).toBe(true);
    expect(result.checks.DailyFields.ok).toBe(false);
    expect(result.checks.DailyFields.error).toContain('illegal solar year: 0');
  });

  it('records years 2, 1900, 2100, and 5000 as supported by the probe', () => {
    for (const year of [2, 1900, 2100, 5000]) {
      const result = probeCalendarYearSupport(year);

      expect(result.supported).toBe(true);
      expect(result.checks.SolarDay.ok).toBe(true);
      expect(result.checks.SolarTime.ok).toBe(true);
      expect(result.checks.LunarDay.ok).toBe(true);
      expect(result.checks.GanZhi.ok).toBe(true);
      expect(result.checks.SolarTerm.ok).toBe(true);
      expect(result.checks.DailyFields.ok).toBe(true);
    }
  });
});
