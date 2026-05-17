import { describe, expect, it } from 'vitest';
import {
  getAuspiciousDayStatus,
  getAuspiciousDaysForScene,
  getZodiacConflict,
  matchesSceneYi,
} from '@/lib/almanac/auspicious';
import type { DailyAlmanac, JieriSceneRule } from '@/lib/almanac/types';

const sceneRule: JieriSceneRule = {
  slug: 'jiehun',
  name: '结婚',
  icon: '/assets/almanac-icons/lucky-knot.png',
  yiTerms: ['嫁娶', '纳采'],
  cautionTerms: ['破日'],
  summary: '结婚择日测试规则',
};

function makeAlmanac(overrides: Partial<DailyAlmanac> = {}): DailyAlmanac {
  return {
    solar: { year: 2026, month: 5, day: 17 },
    lunar: { year: '丙午年', month: '四月', day: '初一', lunarDate: '农历丙午年四月初一' },
    ganZhi: { year: '丙午', month: '癸巳', day: '辛卯' },
    zodiac: '马',
    dayZodiac: '兔',
    fortune: '吉',
    yi: ['嫁娶', '祭祀'],
    ji: ['安葬'],
    direction: {
      chong: '鸡',
      sha: '西',
      caiShen: '东',
      xiShen: '西南',
      fuShen: '西北',
    },
    gods: ['天德'],
    duty: '开',
    twentyEightStar: '昴',
    pengZu: '辛不合酱',
    sound: '松柏木',
    fetusDay: '厨灶门外正北',
    ...overrides,
  };
}

describe('auspicious day matching', () => {
  it('matches scene yi terms against daily almanac yi items', () => {
    const matches = matchesSceneYi(makeAlmanac(), sceneRule);

    expect(matches).toEqual(['嫁娶']);
  });

  it('returns recommended for matched yi on a lucky day without zodiac conflict', () => {
    const status = getAuspiciousDayStatus(makeAlmanac(), sceneRule);

    expect(status?.status).toBe('recommended');
    expect(status?.yiMatches).toEqual(['嫁娶']);
    expect(status?.reasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'yi-match', severity: 'positive' }),
      ]),
    );
  });

  it('excludes unmatched days from scene status', () => {
    const status = getAuspiciousDayStatus(makeAlmanac({ yi: ['祭祀', '出行'] }), sceneRule);

    expect(status).toBeNull();
  });

  it('keeps matched ominous days with a downgraded status', () => {
    const status = getAuspiciousDayStatus(makeAlmanac({ fortune: '凶' }), sceneRule);

    expect(status?.status).toBe('not-preferred');
    expect(status?.cautionReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'daily-fortune' }),
      ]),
    );
  });

  it('keeps selected zodiac conflicts in results with a conflict reason', () => {
    const conflict = getZodiacConflict(makeAlmanac(), '鸡');
    const status = getAuspiciousDayStatus(makeAlmanac(), sceneRule, '鸡');

    expect(conflict?.detail).toContain('冲鸡');
    expect(status?.status).toBe('caution');
    expect(status?.cautionReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'zodiac-conflict' }),
      ]),
    );
  });

  it('generates retained annual results for a real scene and year', async () => {
    const results = await getAuspiciousDaysForScene({ scene: sceneRule, year: 2026, zodiac: '鸡' });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.yiMatches.length > 0)).toBe(true);
    expect(results.some((result) => result.status !== 'recommended')).toBe(true);
  });
});

