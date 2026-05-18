import { z } from 'zod';
import type { FiveElement } from '@/lib/almanac/bazi';

export interface NameInput {
  surname: string;
  givenName: string;
}

export interface CharacterElement {
  char: string;
  element: FiveElement | '未知';
  known: boolean;
  meaning: string;
}

export interface NameAnalysis {
  surname: string;
  givenName: string;
  characters: CharacterElement[];
  score: number;
  auspicious: boolean;
  explanation: string;
  suggestions: string[];
}

const CHINESE_NAME_RE = /^[\u4e00-\u9fff]{1,4}$/;

export const nameInputSchema = z.object({
  surname: z.string().trim().min(1).max(2).regex(CHINESE_NAME_RE),
  givenName: z.string().trim().min(1).max(2).regex(CHINESE_NAME_RE),
});

const CHARACTER_ELEMENTS: Record<string, { element: FiveElement; meaning: string }> = {
  李: { element: '木', meaning: '木气舒展，有生发之意' },
  王: { element: '土', meaning: '端正稳重，有承载之意' },
  张: { element: '火', meaning: '张弛有度，带外放之气' },
  刘: { element: '金', meaning: '金气清利，重判断与边界' },
  陈: { element: '土', meaning: '土气厚实，重积累与根基' },
  林: { element: '木', meaning: '双木成林，有成长与扶持之象' },
  黄: { element: '土', meaning: '中央土色，重安定与包容' },
  赵: { element: '火', meaning: '行动感较强，适合明朗表达' },
  周: { element: '金', meaning: '结构感强，重秩序与完整' },
  吴: { element: '木', meaning: '木气温和，重舒展与人缘' },
  子: { element: '水', meaning: '水气灵动，含启蒙与涵养之意' },
  涵: { element: '水', meaning: '涵养包容，水意较足' },
  沐: { element: '水', meaning: '润泽清新，适合柔和气质' },
  泽: { element: '水', meaning: '泽被万物，有润下之意' },
  森: { element: '木', meaning: '木气旺盛，重成长与生命力' },
  梓: { element: '木', meaning: '木意清正，常见于文雅命名' },
  楠: { element: '木', meaning: '木材坚实，带稳健之象' },
  明: { element: '火', meaning: '光明清楚，火意温暖' },
  昕: { element: '火', meaning: '晨光初起，有开启之意' },
  晨: { element: '火', meaning: '日出时分，带明朗气息' },
  安: { element: '土', meaning: '安定平和，重家宅与根基' },
  宇: { element: '土', meaning: '屋宇空间，带包容与格局' },
  辰: { element: '土', meaning: '辰为湿土，含时序之意' },
  钧: { element: '金', meaning: '金气端重，带均衡和法度' },
  铭: { element: '金', meaning: '铭记成文，金气清晰' },
  锦: { element: '金', meaning: '华美有章，重品质与呈现' },
  诗: { element: '金', meaning: '文辞有韵，金气偏清雅' },
  雅: { element: '木', meaning: '文雅舒展，木气柔和' },
  宁: { element: '土', meaning: '安宁沉稳，土意较足' },
  远: { element: '土', meaning: '空间开阔，重方向与格局' },
  然: { element: '火', meaning: '自然明亮，火意不躁' },
  玥: { element: '土', meaning: '美玉之意，土中藏珍' },
};

const SUGGESTIONS: Record<FiveElement, string[]> = {
  木: ['梓', '楠', '森', '雅'],
  火: ['明', '昕', '晨', '然'],
  土: ['安', '宇', '辰', '宁'],
  金: ['钧', '铭', '锦', '诗'],
  水: ['涵', '沐', '泽', '子'],
};

export function analyzeName(input: NameInput): NameAnalysis {
  const parsed = nameInputSchema.parse(input);
  const fullName = `${parsed.surname}${parsed.givenName}`;
  const characters = Array.from(fullName).map(characterElement);
  const knownCount = characters.filter((item) => item.known).length;
  const elementCounts = countNameElements(characters);
  const uniqueKnownElements = Object.values(elementCounts).filter((count) => count > 0).length;
  const unknownPenalty = (characters.length - knownCount) * 8;
  const balanceBonus = Math.min(uniqueKnownElements * 8, 32);
  const repeatedPenalty = Math.max(...Object.values(elementCounts)) >= 3 ? 10 : 0;
  const score = clamp(62 + balanceBonus - unknownPenalty - repeatedPenalty, 0, 100);
  const weakElements = (Object.entries(elementCounts) as Array<[FiveElement, number]>)
    .filter(([, count]) => count === 0)
    .map(([element]) => element);
  const suggestions = buildSuggestions(weakElements.length > 0 ? weakElements : ['木', '水']);

  return {
    surname: parsed.surname,
    givenName: parsed.givenName,
    characters,
    score,
    auspicious: score >= 72,
    explanation: buildNameExplanation(characters, score, weakElements),
    suggestions,
  };
}

function characterElement(char: string): CharacterElement {
  const entry = CHARACTER_ELEMENTS[char];
  if (!entry) {
    return {
      char,
      element: '未知',
      known: false,
      meaning: '字库暂未收录，可结合字义、读音和家族偏好继续判断',
    };
  }

  return {
    char,
    element: entry.element,
    known: true,
    meaning: entry.meaning,
  };
}

function countNameElements(characters: CharacterElement[]): Record<FiveElement, number> {
  const counts: Record<FiveElement, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const item of characters) {
    if (item.known && item.element !== '未知') {
      counts[item.element] += 1;
    }
  }
  return counts;
}

function buildSuggestions(elements: FiveElement[]): string[] {
  const chars = elements.flatMap((element) => SUGGESTIONS[element]);
  return Array.from(new Set(chars)).slice(0, 8);
}

function buildNameExplanation(characters: CharacterElement[], score: number, weakElements: FiveElement[]): string {
  const known = characters.filter((item) => item.known);
  const unknown = characters.length - known.length;
  const weakText = weakElements.length > 0 ? `可留意${weakElements.join('、')}字作补充。` : '五行分布较完整，可继续看读音和字义。';
  const unknownText = unknown > 0 ? `其中有${unknown}个字暂未收录，评分已做保守处理。` : '所输入文字均在基础字库内。';
  return `此名基础评分为${score}分，主要依据单字五行覆盖、重复偏重和字库收录情况。${unknownText}${weakText}该结果是姓名文化参考，不直接判断人生吉凶。`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
