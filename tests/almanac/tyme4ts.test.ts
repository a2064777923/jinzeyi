import { describe, it, expect } from 'vitest';
import { SolarDay } from 'tyme4ts';

const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

function getAlmanac(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = SolarDay.fromYmd(year, month, day);
  const lunar = solar.getLunarDay();
  const daySC = lunar.getSixtyCycle();
  const yearSC = lunar.getYearSixtyCycle();
  const monthSC = lunar.getMonthSixtyCycle();
  const eb = daySC.getEarthBranch();
  const hs = daySC.getHeavenStem();

  return {
    lunar: lunar.toString(),
    lunarDay: lunar.getName(),
    lunarMonth: lunar.getLunarMonth().getName(),
    yearSixtyCycle: yearSC.toString(),
    monthSixtyCycle: monthSC.toString(),
    daySixtyCycle: daySC.toString(),
    zodiac: yearSC.getEarthBranch().getZodiac().toString(),
    yi: lunar.getRecommends().map((r: { toString: () => string }) => r.toString()),
    ji: lunar.getAvoids().map((a: { toString: () => string }) => a.toString()),
    chong: eb.getOpposite().toString(),
    sha: eb.getOminous().toString(),
    caiShen: hs.getWealthDirection().toString(),
    xiShen: hs.getJoyDirection().toString(),
    fuShen: hs.getMascotDirection().toString(),
    gods: lunar.getGods().map((g: { toString: () => string }) => g.toString()),
    duty: lunar.getDuty().toString(),
    twentyEightStar: lunar.getTwentyEightStar().toString(),
    pengZu: daySC.getPengZu().toString(),
    sound: daySC.getSound().toString(),
    fetusDay: lunar.getFetusDay().toString(),
  };
}

describe('tyme4ts API verification', () => {
  describe('Reference dates against 万年历', () => {
    it('2026-01-01: correct gan-zhi year, lunar date, zodiac', () => {
      const data = getAlmanac('2026-01-01');
      // Before 立春, year pillar is still 乙巳
      expect(data.yearSixtyCycle).toBe('乙巳');
      expect(data.zodiac).toBe('蛇');
      expect(data.lunar).toContain('十一月');
    });

    it('2026-02-17: Chinese New Year (正月初一 of 丙午年)', () => {
      const data = getAlmanac('2026-02-17');
      expect(data.lunar).toContain('丙午年');
      expect(data.lunar).toContain('正月');
      expect(data.lunar).toContain('初一');
    });

    it('2026-05-17 (today): all fields are non-empty', () => {
      const data = getAlmanac('2026-05-17');
      expect(data.lunar).toBeTruthy();
      expect(data.yearSixtyCycle).toBeTruthy();
      expect(data.monthSixtyCycle).toBeTruthy();
      expect(data.daySixtyCycle).toBeTruthy();
      expect(data.zodiac).toBeTruthy();
      expect(data.yi.length).toBeGreaterThan(0);
      expect(data.ji.length).toBeGreaterThan(0);
      expect(data.chong).toBeTruthy();
      expect(data.sha).toBeTruthy();
      expect(data.caiShen).toBeTruthy();
      expect(data.xiShen).toBeTruthy();
      expect(data.fuShen).toBeTruthy();
      expect(data.duty).toBeTruthy();
      expect(data.twentyEightStar).toBeTruthy();
      expect(data.pengZu).toBeTruthy();
      expect(data.sound).toBeTruthy();
      expect(data.fetusDay).toBeTruthy();
    });

    it('1900-01-01: handles earliest supported date', () => {
      const data = getAlmanac('1900-01-01');
      expect(data.lunar).toBeTruthy();
      expect(data.yearSixtyCycle).toBe('己亥');
      expect(data.zodiac).toBe('猪');
    });

    it('2100-12-31: handles latest supported date', () => {
      const data = getAlmanac('2100-12-31');
      expect(data.lunar).toBeTruthy();
      expect(data.yearSixtyCycle).toBeTruthy();
      expect(data.zodiac).toBeTruthy();
    });
  });

  describe('Field categories per D-12', () => {
    const data = getAlmanac('2026-05-17');

    it('gan-zhi (干支): year, month, day pillars are non-empty strings', () => {
      expect(typeof data.yearSixtyCycle).toBe('string');
      expect(data.yearSixtyCycle.length).toBeGreaterThan(0);
      expect(typeof data.monthSixtyCycle).toBe('string');
      expect(data.monthSixtyCycle.length).toBeGreaterThan(0);
      expect(typeof data.daySixtyCycle).toBe('string');
      expect(data.daySixtyCycle.length).toBeGreaterThan(0);
    });

    it('lunar (农历): year, month, day are valid', () => {
      expect(data.lunar).toBeTruthy();
      expect(data.lunarDay).toBeTruthy();
      expect(data.lunarMonth).toBeTruthy();
    });

    it('yi-ji (宜忌): recommends and avoids are arrays with at least 1 item', () => {
      expect(Array.isArray(data.yi)).toBe(true);
      expect(data.yi.length).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(data.ji)).toBe(true);
      expect(data.ji.length).toBeGreaterThanOrEqual(1);
    });

    it('chong-sha (冲煞): chong and sha directions are non-empty', () => {
      expect(data.chong).toBeTruthy();
      expect(data.sha).toBeTruthy();
    });

    it('zodiac (生肖): is one of the 12 animals', () => {
      expect(ZODIAC_ANIMALS).toContain(data.zodiac);
    });

    it('directions (方位): caiShen, xiShen, fuShen are non-empty', () => {
      expect(data.caiShen).toBeTruthy();
      expect(data.xiShen).toBeTruthy();
      expect(data.fuShen).toBeTruthy();
    });

    it('gods (神煞): is a non-empty array', () => {
      expect(Array.isArray(data.gods)).toBe(true);
      expect(data.gods.length).toBeGreaterThanOrEqual(1);
    });

    it('duty (值神): is a non-empty string', () => {
      expect(typeof data.duty).toBe('string');
      expect(data.duty.length).toBeGreaterThan(0);
    });

    it('twentyEightStar (二十八星宿): is a non-empty string', () => {
      expect(typeof data.twentyEightStar).toBe('string');
      expect(data.twentyEightStar.length).toBeGreaterThan(0);
    });

    it('pengZu (彭祖百忌): is a non-empty string', () => {
      expect(typeof data.pengZu).toBe('string');
      expect(data.pengZu.length).toBeGreaterThan(0);
    });

    it('sound (纳音): is a non-empty string', () => {
      expect(typeof data.sound).toBe('string');
      expect(data.sound.length).toBeGreaterThan(0);
    });

    it('fetusDay (胎神): is a non-empty string', () => {
      expect(typeof data.fetusDay).toBe('string');
      expect(data.fetusDay.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('zodiac changes at 立春 (not Jan 1)', () => {
      // 2026 立春 is around Feb 4
      const beforeLiChun = getAlmanac('2026-02-03');
      const afterLiChun = getAlmanac('2026-02-05');
      // Before 立春: still 乙巳年 (蛇)
      expect(beforeLiChun.yearSixtyCycle).toBe('乙巳');
      expect(beforeLiChun.zodiac).toBe('蛇');
      // After 立春: 丙午年 (马)
      expect(afterLiChun.yearSixtyCycle).toBe('丙午');
      expect(afterLiChun.zodiac).toBe('马');
    });

    it('year boundary: Dec 31 vs Jan 1 zodiac is same (both before 立春)', () => {
      const dec31 = getAlmanac('2025-12-31');
      const jan1 = getAlmanac('2026-01-01');
      // Both are before 立春 2026, so both should be 乙巳年 (蛇)
      expect(dec31.zodiac).toBe(jan1.zodiac);
      expect(dec31.yearSixtyCycle).toBe(jan1.yearSixtyCycle);
    });

    it('sexagenary cycle repeats every 60 years', () => {
      const d1 = getAlmanac('1966-05-17');
      const d2 = getAlmanac('2026-05-17');
      // 1966 and 2026 are 60 years apart — same year pillar
      expect(d1.yearSixtyCycle).toBe(d2.yearSixtyCycle);
    });
  });
});
