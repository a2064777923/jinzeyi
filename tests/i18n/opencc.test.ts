import { describe, it, expect } from 'vitest';
import { convertToTraditional, convertToSimplified, convertMetaphysics } from '@/lib/opencc';

describe('OpenCC metaphysics conversion', () => {
  describe('天干 (Heavenly Stems)', () => {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    it.each(stems)('"%s" stays as-is in both locales', (stem) => {
      expect(convertToTraditional(stem)).toBe(stem);
      expect(convertToSimplified(stem)).toBe(stem);
    });
  });

  describe('地支 (Earthly Branches)', () => {
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    it.each(branches)('"%s" stays as-is in Traditional', (branch) => {
      expect(convertToTraditional(branch)).toBe(branch);
    });

    it('丑 does NOT convert to 醜', () => {
      expect(convertToTraditional('丑')).not.toBe('醜');
      expect(convertToTraditional('丑')).toBe('丑');
    });

    it('子丑寅卯 stays as-is (not 子醜寅卯)', () => {
      expect(convertToTraditional('子丑寅卯')).toBe('子丑寅卯');
    });
  });

  describe('生肖 (Zodiac)', () => {
    const zodiacMap: Record<string, string> = {
      '鼠': '鼠', '牛': '牛', '虎': '虎', '兔': '兔',
      '龙': '龍', '蛇': '蛇', '马': '馬', '羊': '羊',
      '猴': '猴', '鸡': '雞', '狗': '狗', '猪': '豬',
    };
    it.each(Object.entries(zodiacMap))(
      '"%s" converts to "%s" in Traditional',
      (simplified, traditional) => {
        expect(convertToTraditional(simplified)).toBe(traditional);
      }
    );

    it('龙马精神 converts correctly', () => {
      expect(convertToTraditional('龙马精神')).toBe('龍馬精神');
    });
  });

  describe('五行 (Five Elements)', () => {
    const elements = ['金', '木', '水', '火', '土'];
    it.each(elements)('"%s" stays as-is in both locales', (el) => {
      expect(convertToTraditional(el)).toBe(el);
      expect(convertToSimplified(el)).toBe(el);
    });
  });

  describe('节气 (Solar Terms)', () => {
    const termMap: Record<string, string> = {
      '立春': '立春', '雨水': '雨水', '惊蛰': '驚蟄', '春分': '春分',
      '清明': '清明', '谷雨': '穀雨', '立夏': '立夏', '小满': '小滿',
      '芒种': '芒種', '夏至': '夏至', '小暑': '小暑', '大暑': '大暑',
      '立秋': '立秋', '处暑': '處暑', '白露': '白露', '秋分': '秋分',
      '寒露': '寒露', '霜降': '霜降', '立冬': '立冬', '小雪': '小雪',
      '大雪': '大雪', '冬至': '冬至', '小寒': '小寒', '大寒': '大寒',
    };
    it.each(Object.entries(termMap))(
      '"%s" converts to "%s" in Traditional',
      (simplified, traditional) => {
        expect(convertToTraditional(simplified)).toBe(traditional);
      }
    );
  });

  describe('干支 context protection', () => {
    it('干 in 天干 does NOT convert to 乾 or 幹', () => {
      expect(convertToTraditional('天干')).toBe('天干');
      expect(convertToTraditional('干支')).toBe('干支');
    });

    it('sexagenary cycle terms with 丑 stay correct', () => {
      const sexagenaryWithChou = ['乙丑', '丁丑', '己丑', '辛丑', '癸丑'];
      for (const term of sexagenaryWithChou) {
        expect(convertToTraditional(term)).toBe(term);
      }
    });
  });

  describe('神煞 (Star Deities) conversion', () => {
    const godsMap: Record<string, string> = {
      '阴德': '陰德',
      '时阴': '時陰',
      '生气': '生氣',
      '普护': '普護',
      '灾煞': '災煞',
      '驿马': '驛馬',
      '勾陈': '勾陳',
      '青龙': '青龍',
      '金匮': '金匱',
      '母仓': '母倉',
      '天仓': '天倉',
      '天医': '天醫',
      '天马': '天馬',
    };
    it.each(Object.entries(godsMap))(
      '"%s" converts to "%s" in Traditional',
      (simplified, traditional) => {
        expect(convertToTraditional(simplified)).toBe(traditional);
      }
    );

    it('神后 stays as 神后 (not 神後)', () => {
      expect(convertToTraditional('神后')).toBe('神后');
    });
  });

  describe('十二值神 (Twelve Duty Officers)', () => {
    const dutyMap: Record<string, string> = {
      '满': '滿', '执': '執', '开': '開', '闭': '閉',
    };
    it.each(Object.entries(dutyMap))(
      '"%s" converts to "%s" in Traditional',
      (simplified, traditional) => {
        expect(convertToTraditional(simplified)).toBe(traditional);
      }
    );
  });

  describe('二十八星宿 (28 Lunar Mansions)', () => {
    const starMap: Record<string, string> = {
      '虚': '虛', '娄': '婁', '毕': '畢', '参': '參',
      '张': '張', '轸': '軫',
    };
    it.each(Object.entries(starMap))(
      '"%s" converts to "%s" in Traditional',
      (simplified, traditional) => {
        expect(convertToTraditional(simplified)).toBe(traditional);
      }
    );
  });

  describe('convertToSimplified (reverse)', () => {
    it('converts Traditional zodiac back to Simplified', () => {
      expect(convertToSimplified('龍')).toBe('龙');
      expect(convertToSimplified('馬')).toBe('马');
      expect(convertToSimplified('雞')).toBe('鸡');
      expect(convertToSimplified('豬')).toBe('猪');
    });

    it('converts Traditional solar terms back to Simplified', () => {
      expect(convertToSimplified('驚蟄')).toBe('惊蛰');
      expect(convertToSimplified('穀雨')).toBe('谷雨');
      expect(convertToSimplified('小滿')).toBe('小满');
      expect(convertToSimplified('芒種')).toBe('芒种');
      expect(convertToSimplified('處暑')).toBe('处暑');
    });
  });

  describe('convertMetaphysics (direct term conversion)', () => {
    it('converts Simplified terms to Traditional', () => {
      expect(convertMetaphysics('龙', 'zh-hant')).toBe('龍');
      expect(convertMetaphysics('马', 'zh-hant')).toBe('馬');
      expect(convertMetaphysics('丑', 'zh-hant')).toBe('丑');
      expect(convertMetaphysics('惊蛰', 'zh-hant')).toBe('驚蟄');
    });

    it('converts Traditional terms to Simplified', () => {
      expect(convertMetaphysics('龍', 'zh-hans')).toBe('龙');
      expect(convertMetaphysics('馬', 'zh-hans')).toBe('马');
      expect(convertMetaphysics('驚蟄', 'zh-hans')).toBe('惊蛰');
    });

    it('returns the term unchanged if not in dictionary', () => {
      expect(convertMetaphysics('甲', 'zh-hant')).toBe('甲');
      expect(convertMetaphysics('甲', 'zh-hans')).toBe('甲');
    });
  });
});
