import { describe, expect, it } from 'vitest';
import zhHans from '@/i18n/messages/zh-hans.json';
import zhHant from '@/i18n/messages/zh-hant.json';

const SOLAR_TERM_KEYS = [
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
  '冬至',
  '小寒',
  '大寒',
] as const;

const HANT_SOLAR_TERM_KEYS = [
  '驚蟄',
  '穀雨',
  '小滿',
  '芒種',
  '處暑',
] as const;

describe('solar terms messages', () => {
  it.each([
    ['zh-hans', zhHans],
    ['zh-hant', zhHant],
  ] as const)('%s has every stable solar term key', (_locale, messages) => {
    const terms = messages.SolarTerms.terms;

    for (const key of SOLAR_TERM_KEYS) {
      expect(terms[key]?.meaning).toBeTruthy();
      expect(terms[key]?.customs).toBeTruthy();
    }
  });

  it('zh-hant also has traditional keys returned by localized term names', () => {
    const terms = zhHant.SolarTerms.terms;

    for (const key of HANT_SOLAR_TERM_KEYS) {
      expect(terms[key]?.meaning).toBeTruthy();
      expect(terms[key]?.customs).toBeTruthy();
    }
  });
});
