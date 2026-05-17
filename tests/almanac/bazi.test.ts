import { describe, expect, it } from 'vitest';
import { CHINA_CITIES } from '@/lib/tools/china-cities';
import { calculateBazi, calculateTrueSolarOffsetMinutes } from '@/lib/almanac/bazi';

describe('bazi calculation utility', () => {
  it('provides a compact China city dataset for true solar time', () => {
    expect(CHINA_CITIES.length).toBeGreaterThanOrEqual(20);
    expect(CHINA_CITIES.some((city) => city.id === 'beijing')).toBe(true);
    expect(CHINA_CITIES.every((city) => city.timezone === 'UTC+8')).toBe(true);
  });

  it('calculates reference four pillars for 2026-05-17 11:30 in Hangzhou', () => {
    const result = calculateBazi({
      birthDate: '2026-05-17',
      birthTime: '11:30',
      cityId: 'hangzhou',
      gender: 'female',
    });

    expect(result.pillars.year.value).toBe('丙午');
    expect(result.pillars.month.value).toBe('癸巳');
    expect(result.pillars.day.value).toBe('辛卯');
    expect(result.pillars.hour.value).toBe('甲午');
    expect(result.genderLabel).toBe('女');
    expect(result.elements).toMatchObject({ 木: expect.any(Number), 火: expect.any(Number), 土: expect.any(Number), 金: expect.any(Number), 水: expect.any(Number) });
  });

  it('applies true solar time at 4 minutes per longitude degree from 120E', () => {
    expect(calculateTrueSolarOffsetMinutes(121)).toBe(4);
    expect(calculateTrueSolarOffsetMinutes(119)).toBe(-4);
  });

  it('returns a true solar time summary with adjusted time and city', () => {
    const result = calculateBazi({
      birthDate: '2026-05-17',
      birthTime: '11:30',
      cityId: 'beijing',
      gender: 'male',
    });

    expect(result.city.name).toBe('北京');
    expect(result.trueSolarTime.offsetMinutes).toBe(-14);
    expect(result.trueSolarTime.adjusted).toBe('2026-05-17 11:16');
    expect(result.explanation).toContain('文化参考');
  });

  it('does not remap early common-era years to the 1900s', () => {
    const result = calculateBazi({
      birthDate: '0002-01-01',
      birthTime: '00:30',
      cityId: 'hangzhou',
      gender: 'unspecified',
    });

    expect(result.trueSolarTime.adjusted.startsWith('2-')).toBe(false);
    expect(result.trueSolarTime.adjusted).toMatch(/^0002-01-01 /);
  });

  it('rejects unsupported city ids and invalid dates', () => {
    expect(() => calculateBazi({ birthDate: '2026-05-17', birthTime: '11:30', cityId: 'unknown', gender: 'unspecified' })).toThrow();
    expect(() => calculateBazi({ birthDate: '2026-02-31', birthTime: '11:30', cityId: 'beijing', gender: 'unspecified' })).toThrow();
    expect(() => calculateBazi({ birthDate: '0001-01-01', birthTime: '11:30', cityId: 'beijing', gender: 'unspecified' })).toThrow();
    expect(() => calculateBazi({ birthDate: '5001-01-01', birthTime: '11:30', cityId: 'beijing', gender: 'unspecified' })).toThrow();
  });
});
