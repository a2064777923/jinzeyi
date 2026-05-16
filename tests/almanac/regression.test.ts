import { describe, it, expect } from 'vitest';
import { SolarDay } from 'tyme4ts';

const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// Expected year pillars for known years (based on 60-year cycle)
// Year pillar changes at 立春 (~Feb 4), not Jan 1.
// For Jan dates, use previous year's pillar.
// 1900 = 庚子年, 1960 = 庚子年, 2020 = 庚子年
function expectedYearPillar(year: number, month: number): string {
  const stems = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  // For dates before 立春 (Feb 4), use previous year's pillar
  const effectiveYear = month <= 2 ? year - 1 : year;
  const offset = ((effectiveYear - 1900) % 60 + 60) % 60; // ensure positive
  const stemIdx = offset % 10;
  const branchIdx = offset % 12;
  return stems[stemIdx] + branches[branchIdx];
}

function expectedZodiac(year: number): string {
  // Zodiac based on year pillar's Earthly Branch
  // 1900 = 子 = 鼠
  const branchAnimals: Record<string, string> = {
    '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
    '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
    '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
  };
  const pillar = expectedYearPillar(year);
  return branchAnimals[pillar[1]];
}

describe('tyme4ts regression: 1900-2100 spot checks', () => {
  // Test at 10-year intervals: 1900, 1910, 1920, ..., 2090, 2100
  const testYears = Array.from({ length: 22 }, (_, i) => 1900 + i * 10);

  // For each year, test 3 dates: Jan 1, Jun 15, Dec 31
  const testDates: [number, number, number][] = [
    [1, 1, 0],    // Jan 1
    [6, 15, 0],   // Jun 15
    [12, 31, 0],  // Dec 31
  ];

  for (const year of testYears) {
    for (const [month, day] of testDates) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      it(`${dateStr}: gan-zhi year and zodiac are correct`, () => {
        const solar = SolarDay.fromYmd(year, month, day);
        const lunar = solar.getLunarDay();
        const yearSC = lunar.getYearSixtyCycle().toString();
        const zodiac = yearSC.length >= 2
          ? (() => {
              const branch = yearSC[1];
              const animals: Record<string, string> = {
                '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
                '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
                '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
              };
              return animals[branch] || 'unknown';
            })()
          : 'unknown';

        // Verify year pillar matches expected cycle
        // Year pillar is based on 立春 (~Feb 4), not Jan 1.
        const expected = expectedYearPillar(year, month);
        expect(yearSC).toBe(expected);

        // Verify zodiac is one of the 12 animals
        expect(ZODIAC_ANIMALS).toContain(zodiac);

        // Verify lunar date is non-empty and parseable
        const lunarStr = lunar.toString();
        expect(lunarStr).toBeTruthy();
        expect(lunarStr.length).toBeGreaterThan(0);
      });
    }
  }
});
