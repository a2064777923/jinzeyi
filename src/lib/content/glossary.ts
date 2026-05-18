import { localizeBodyCopy } from './localize';
import { getMetaphysicsEntry } from './metaphysics';
import type { LocaleCode, MetaphysicsCategory } from './types';

export type GlossaryKey =
  | 'ganZhi'
  | 'chongSha'
  | 'zhiShen'
  | 'shenSha'
  | 'xingShen'
  | 'twelveOfficer'
  | 'yiJi'
  | 'luckyHour'
  | 'fiveElements'
  | 'fourPillars'
  | 'dayMaster'
  | 'tenGods'
  | 'hiddenStems'
  | 'naYin'
  | 'mingCaiWei'
  | 'qiKou';

export interface GlossaryEntry {
  key: GlossaryKey;
  term: string;
  short: string;
  detail: string;
  href?: string;
  linkLabel?: string;
  knowledgeSlug?: string;
  category?: MetaphysicsCategory;
  chartHint?: string;
  practicalUse?: string;
  sourceNotes?: string[];
}

const metaphysicsGlossaryMap: Partial<Record<GlossaryKey, string>> = {
  ganZhi: 'stem-branch',
  chongSha: 'chong-sha',
  yiJi: 'yi-ji',
  luckyHour: 'lucky-hour',
  fiveElements: 'five-elements',
  fourPillars: 'four-pillars',
  dayMaster: 'day-master',
  tenGods: 'ten-gods',
  hiddenStems: 'hidden-stems',
  naYin: 'na-yin',
};

const fallbackGlossary: Partial<Record<GlossaryKey, Omit<GlossaryEntry, 'key'>>> = {
  ganZhi: {
    term: '干支',
    short: '天干與地支配成六十組，用來記年、月、日、時。',
    detail: '黃曆裡的年柱、月柱、日柱和時柱都會用干支表示。它像一套傳統時間編碼，重點不是單看一個字，而是看它和生肖、五行、值神等資料如何一起描述當日氣象。',
    href: '/tools/bazi',
    linkLabel: '用八字排盤看四柱',
  },
  chongSha: {
    term: '沖煞',
    short: '沖表示生肖或地支相沖，煞表示當日較需避開的方位。',
    detail: '例如「沖酉 煞西」常被理解為今天和酉相關的生肖或方位不宜硬碰。實務上不要只看這四個字，還要看事情類型、當日宜忌和是否涉及本人或家人的生肖。',
    href: '/zodiac',
    linkLabel: '查看生肖與地支',
  },
  zhiShen: {
    term: '值神',
    short: '當日主事的神煞名稱，是黃曆判斷吉凶的其中一層。',
    detail: '值神會影響當日被標為吉日或凶日的基調。這也是為什麼某天有不少宜事，整日仍可能標為凶，因為日子的總判斷不等於吉時數量相加。',
    href: '/calendar',
    linkLabel: '回月曆比較每日值神',
  },
  shenSha: {
    term: '神煞',
    short: '黃曆中用來描述吉凶傾向的傳統名目。',
    detail: '神煞不是單獨下結論的按鈕，更像提醒你某些事項要更謹慎。看神煞時應搭配宜忌、沖煞、時辰和具體場景。',
    href: '/jieri',
    linkLabel: '按場景看吉日',
  },
  xingShen: {
    term: '星神',
    short: '每個時辰對應的傳統吉凶星名，如司命、青龍、白虎、玄武。',
    detail: '星神用來描述一個時辰的傾向。吉星不代表什麼都能做，凶星也不代表完全不能行動，仍要看該時辰列出的宜忌。',
    href: '/almanac',
    linkLabel: '查看今日時辰',
  },
  twelveOfficer: {
    term: '建除十二神',
    short: '建、除、滿、平、定、執、破、危、成、收、開、閉十二種日課名稱。',
    detail: '建除十二神常用來判斷日子的性質，例如開、成較常被視為可推進，破、閉則偏保守。它是一層參考，不應取代具體宜忌。',
    href: '/calendar',
    linkLabel: '看月曆中的日課變化',
  },
  yiJi: {
    term: '宜忌',
    short: '宜是較適合安排的事項，忌是當日較不建議硬做的事項。',
    detail: '宜忌要先對應你的真實場景。凶日仍可能有宜事，代表小事或特定事項可參考，但婚嫁、入宅、開業等大事還應多看一層吉日、時辰和沖煞。',
    href: '/jieri',
    linkLabel: '按事情類型篩吉日',
  },
  luckyHour: {
    term: '吉時',
    short: '一天分成十二個時辰，每個時辰各有吉凶和宜忌。',
    detail: '吉時是時段參考，不是把整天洗成吉日的公式。若整日為凶但有吉時，可以理解為大事仍需慎重，小事可優先挑吉時處理。',
    href: '/calendar',
    linkLabel: '先選日期再看時辰',
  },
  fiveElements: {
    term: '五行分佈',
    short: '把天干地支粗略歸入木、火、土、金、水，觀察偏重與不足。',
    detail: '五行分佈適合作為入門視角，不應直接推出命運結論。八字工具會先把四柱和五行排清楚，後續才適合接更細的解讀。',
    href: '/tools/bazi',
    linkLabel: '查看八字五行',
  },
  fourPillars: {
    term: '四柱',
    short: '年、月、日、時四組干支，是八字排盤的骨架。',
    detail: '四柱把出生時間拆成四個時間層次。一般會以日柱作為中心，再看其他柱和五行分佈，但本站目前只做基礎文化參考。',
    href: '/tools/bazi',
    linkLabel: '輸入出生資料排四柱',
  },
  mingCaiWei: {
    term: '明財位',
    short: '民間常把入門後對角處視作明財位，重點在乾淨、明亮、穩定。',
    detail: '明財位不是承諾發財的位置。它更像空間整理提醒：不要堆垃圾、不要長期陰暗潮濕，也不要把動線堵死。',
    href: '/feng-shui/wealth/ming-cai-wei',
    linkLabel: '看明財位整理方法',
  },
  qiKou: {
    term: '氣口',
    short: '傳統風水裡指氣進出的入口，落到日常就是門口、通風和動線。',
    detail: '談氣口時先看現實問題：門能不能順利打開，玄關是否明亮，鞋物是否絆腳，通風是否舒服。這比堆擺件更重要。',
    href: '/feng-shui/home/xuan-guan-ke-ting',
    linkLabel: '看玄關與客廳檢查',
  },
};

export function getGlossaryEntry(key: GlossaryKey, locale: LocaleCode): GlossaryEntry {
  const metaphysicsSlug = metaphysicsGlossaryMap[key];
  const metaphysicsEntry = metaphysicsSlug ? getMetaphysicsEntry(metaphysicsSlug, locale) : undefined;

  if (metaphysicsEntry) {
    return {
      key,
      term: metaphysicsEntry.name,
      short: metaphysicsEntry.short,
      detail: metaphysicsEntry.detail,
      href: metaphysicsEntry.path,
      linkLabel: metaphysicsEntry.linkLabel,
      knowledgeSlug: metaphysicsEntry.slug,
      category: metaphysicsEntry.category,
      chartHint: metaphysicsEntry.chartHint,
      practicalUse: metaphysicsEntry.practicalUse,
      sourceNotes: metaphysicsEntry.sourceNotes,
    };
  }

  const entry = fallbackGlossary[key];
  if (!entry) {
    throw new Error(`Missing glossary entry: ${key}`);
  }

  return {
    key,
    term: localizeBodyCopy(locale, entry.term),
    short: localizeBodyCopy(locale, entry.short),
    detail: localizeBodyCopy(locale, entry.detail),
    href: entry.href,
    linkLabel: entry.linkLabel ? localizeBodyCopy(locale, entry.linkLabel) : undefined,
  };
}

export function getGlossaryEntries(keys: GlossaryKey[], locale: LocaleCode): GlossaryEntry[] {
  return keys.map((key) => getGlossaryEntry(key, locale));
}
