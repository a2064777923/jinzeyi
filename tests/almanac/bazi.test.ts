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
    expect(result.professional.dayMaster.heavenlyStem).toBe(result.pillars.day.heavenlyStem);
    expect(result.professional.pillars.year.value).toBe(result.pillars.year.value);
    expect(result.professional.elementStrength.visibleCounts).toMatchObject(result.elements);
  });

  it('returns professional chart fields with ten gods, hidden stems, na-yin, and terrain', () => {
    const result = calculateBazi({
      birthDate: '2005-12-23',
      birthTime: '08:37',
      cityId: 'hangzhou',
      gender: 'unspecified',
    });

    expect(result.professional.dayMaster.heavenlyStem).toBe('辛');
    expect(result.professional.pillars.year.value).toBe('乙酉');
    expect(result.professional.pillars.month.value).toBe('戊子');
    expect(result.professional.pillars.day.value).toBe('辛巳');
    expect(result.professional.pillars.hour.value).toBe('壬辰');
    expect(result.professional.pillars.year.tenGod).toBe('偏财');
    expect(result.professional.pillars.year.naYin).toBe('泉中水');
    expect(result.professional.pillars.month.terrain).toBe('长生');
    expect(result.professional.pillars.day.hiddenStems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ heavenlyStem: '丙', tenGod: '正官', type: 'main', weight: 3 }),
      ]),
    );
    expect(result.professional.pillars.hour.hiddenStems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ heavenlyStem: '乙', tenGod: '偏财' }),
      ]),
    );
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
    expect(result.professional.elementStrength.summary).toContain('参考');
  });

  it('keeps professional element strength bounded to reference language', () => {
    const result = calculateBazi({
      birthDate: '2026-05-17',
      birthTime: '11:30',
      cityId: 'hangzhou',
      gender: 'female',
    });
    const deterministicClaimPattern = /必定|一定|保证|保證/;

    expect(result.professional.elementStrength.visibleCounts).toMatchObject({ 木: expect.any(Number), 火: expect.any(Number), 土: expect.any(Number), 金: expect.any(Number), 水: expect.any(Number) });
    expect(result.professional.elementStrength.hiddenStemWeightedCounts).toMatchObject({ 木: expect.any(Number), 火: expect.any(Number), 土: expect.any(Number), 金: expect.any(Number), 水: expect.any(Number) });
    expect(result.professional.elementStrength.combinedScores).toMatchObject({ 木: expect.any(Number), 火: expect.any(Number), 土: expect.any(Number), 金: expect.any(Number), 水: expect.any(Number) });
    expect(result.explanation).not.toMatch(deterministicClaimPattern);
    expect(result.professional.elementStrength.summary).not.toMatch(deterministicClaimPattern);
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
