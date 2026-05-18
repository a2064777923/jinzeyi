import { describe, expect, it } from 'vitest';
import { jieriScenes } from '@/lib/content/jieri-scenes';
import {
  scoreAuspiciousDate,
  scoreAuspiciousDateRange,
} from '@/lib/almanac/auspicious-scoring';
import type { AuspiciousPersonInput } from '@/lib/almanac/types';

const primary: AuspiciousPersonInput = {
  role: 'primary',
  label: '本人',
  birthDate: '1996-06-15',
  birthTime: '09:00',
  cityId: 'hangzhou',
  gender: 'female',
};

const partner: AuspiciousPersonInput = {
  role: 'partner',
  label: '伴侣',
  birthDate: '1994-10-03',
  birthTime: '15:20',
  cityId: 'beijing',
  gender: 'male',
};

const responsiblePerson: AuspiciousPersonInput = {
  role: 'responsiblePerson',
  label: '负责人',
  birthDate: '1988-03-08',
  birthTime: '10:30',
  cityId: 'shanghai',
  gender: 'unspecified',
};

describe('auspicious recommendation scoring', () => {
  it('configures scene-specific person roles', () => {
    const jiehun = jieriScenes.find((scene) => scene.slug === 'jiehun')!;
    const banjia = jieriScenes.find((scene) => scene.slug === 'banjia')!;
    const kaiye = jieriScenes.find((scene) => scene.slug === 'kaiye')!;
    const qianyue = jieriScenes.find((scene) => scene.slug === 'qianyue')!;

    expect(jiehun.personRoles.filter((role) => role.required).map((role) => role.key)).toEqual(['primary', 'partner']);
    expect(banjia.personRoles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'primary', required: true }),
        expect.objectContaining({ key: 'household', required: false }),
      ]),
    );
    expect(kaiye.personRoles).toEqual([
      expect.objectContaining({ key: 'responsiblePerson', required: true }),
    ]);
    expect(qianyue.personRoles).toEqual([
      expect.objectContaining({ key: 'responsiblePerson', required: true }),
    ]);
  });

  it('scores a single date with exact dimension max scores', () => {
    const result = scoreAuspiciousDate({
      scene: 'jiehun',
      date: '2026-05-20',
      people: [primary, partner],
    });

    expect(result.maxScore).toBe(100);
    expect(Object.keys(result.dimensions).sort()).toEqual(['almanac', 'bazi', 'luckyHours', 'scene', 'zodiac']);
    expect(result.dimensions.almanac.maxScore).toBe(30);
    expect(result.dimensions.scene.maxScore).toBe(20);
    expect(result.dimensions.zodiac.maxScore).toBe(20);
    expect(result.dimensions.bazi.maxScore).toBe(20);
    expect(result.dimensions.luckyHours.maxScore).toBe(10);
    for (const dimension of Object.values(result.dimensions)) {
      expect(dimension.reasons.length + dimension.cautions.length, dimension.key).toBeGreaterThan(0);
    }
  });

  it('returns ranked date-range results sorted by score', () => {
    const results = scoreAuspiciousDateRange({
      scene: 'jiehun',
      startDate: '2026-05-18',
      endDate: '2026-06-05',
      people: [primary, partner],
      limit: 6,
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(6);
    for (let index = 1; index < results.length; index += 1) {
      expect(results[index - 1].score).toBeGreaterThanOrEqual(results[index].score);
    }
    expect(results.every((result) => ['excellent', 'good', 'usable', 'caution'].includes(result.grade))).toBe(true);
  });

  it('validates required roles and date ranges', () => {
    expect(() => scoreAuspiciousDateRange({
      scene: 'jiehun',
      startDate: '2026-05-18',
      endDate: '2026-05-20',
      people: [primary],
    })).toThrow(/伴侣/);

    expect(() => scoreAuspiciousDateRange({
      scene: 'kaiye',
      startDate: '2026-05-18',
      endDate: '2026-05-20',
      people: [responsiblePerson],
      limit: 3,
    })).not.toThrow();

    expect(() => scoreAuspiciousDateRange({
      scene: 'kaiye',
      startDate: '2026-01-01',
      endDate: '2026-05-01',
      people: [responsiblePerson],
    })).toThrow(/90/);
  });
});
