import { describe, expect, it } from 'vitest';
import {
  ALMANAC_DATE_MAX,
  ALMANAC_DATE_MIN,
  formatAlmanacDate,
  formatAlmanacMonth,
  formatAlmanacYear,
  isValidAlmanacDateString,
  isValidAlmanacMonthString,
} from '@/lib/almanac/date-range';

describe('almanac date range helpers', () => {
  it('formats early common-era years with four digits', () => {
    expect(formatAlmanacYear(2)).toBe('0002');
    expect(formatAlmanacDate(2, 1, 1)).toBe(ALMANAC_DATE_MIN);
    expect(formatAlmanacMonth(2, 1)).toBe('0002-01');
  });

  it('accepts legal almanac date boundaries and rejects unsupported years', () => {
    expect(isValidAlmanacDateString(ALMANAC_DATE_MIN)).toBe(true);
    expect(isValidAlmanacDateString(ALMANAC_DATE_MAX)).toBe(true);
    expect(isValidAlmanacDateString('0001-12-31')).toBe(false);
    expect(isValidAlmanacDateString('5001-01-01')).toBe(false);
  });

  it('rejects impossible calendar dates', () => {
    expect(isValidAlmanacDateString('2026-02-29')).toBe(false);
    expect(isValidAlmanacDateString('2024-02-29')).toBe(true);
    expect(isValidAlmanacDateString('2026-04-31')).toBe(false);
    expect(isValidAlmanacDateString('2026-13-01')).toBe(false);
  });

  it('validates almanac month query strings across the legal range', () => {
    expect(isValidAlmanacMonthString('0002-01')).toBe(true);
    expect(isValidAlmanacMonthString('5000-12')).toBe(true);
    expect(isValidAlmanacMonthString('0001-12')).toBe(false);
    expect(isValidAlmanacMonthString('5001-01')).toBe(false);
    expect(isValidAlmanacMonthString('2026-00')).toBe(false);
  });
});
