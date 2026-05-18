export interface DailyAlmanac {
  solar: {
    year: number;
    month: number;
    day: number;
  };
  lunar: {
    year: string;      // e.g., "丙午年"
    month: string;     // e.g., "四月"
    day: string;       // e.g., "初一"
    lunarDate: string; // full lunar date string, e.g., "农历丙午年四月初一"
  };
  ganZhi: {
    year: string;   // e.g., "丙午"
    month: string;  // e.g., "癸巳"
    day: string;    // e.g., "辛卯"
  };
  zodiac: string;     // Year zodiac, e.g., "马"
  dayZodiac: string;  // Day-branch zodiac, e.g., "兔"
  fortune: '吉' | '凶'; // Daily ecliptic fortune, shared with calendar cells
  yi: string[];       // 宜 (recommended activities)
  ji: string[];       // 忌 (activities to avoid)
  direction: {
    chong: string;    // 冲煞方位 (opposite earthly branch)
    sha: string;      // 煞 (ominous direction)
    caiShen: string;  // 财神方位 (wealth god direction)
    xiShen: string;   // 喜神方位 (joy god direction)
    fuShen: string;   // 福神方位 (mascot god direction)
  };
  gods: string[];     // 吉神凶煞
  duty: string;       // 值神 (duty officer)
  twentyEightStar: string; // 二十八星宿
  pengZu: string;     // 彭祖百忌
  sound: string;      // 纳音
  fetusDay: string;   // 胎神
}

export interface HourlyFortune {
  name: string;       // 时辰名 (e.g., "子时")
  ganZhi: string;     // 干支 (e.g., "戊子")
  star: string;       // 星神 (e.g., "金匮")
  fortune: '吉' | '凶';
  yi: string[];       // 宜
  ji: string[];       // 忌
}

export interface CalendarDay {
  solarDay: number;      // 1-31
  lunarDay: string;      // 初一, 十五, ...
  fortune: '吉' | '凶';
  duty: string;          // 值神/建除十二神
  twelveStar: string;    // 黄道黑道星神
  solarTerm: string | null; // 节气 name when the day is a solar term
  yi: string[];          // Top recommended activities
  ji: string[];          // Top avoided activities
  isToday: boolean;
  dateStr: string;       // YYYY-MM-DD
  weekday: number;       // 0=Sun, 6=Sat
}

export interface SolarTerm {
  name: string;       // 节气名 (e.g., "立春")
  date: string;       // YYYY-MM-DD
  isJie: boolean;     // true=节, false=气
  year: number;
}

export type AuspiciousDayStatus = 'recommended' | 'caution' | 'not-preferred';

export type AuspiciousDayReasonType =
  | 'yi-match'
  | 'daily-fortune'
  | 'zodiac-conflict'
  | 'scene-caution';

export interface AuspiciousDayReason {
  type: AuspiciousDayReasonType;
  label: string;
  detail: string;
  severity: 'positive' | 'caution' | 'negative';
}

export interface JieriSceneRule {
  slug: string;
  name: string;
  icon: string;
  yiTerms: string[];
  cautionTerms: string[];
  summary: string;
  personRoles: AuspiciousPersonRole[];
}

export type AuspiciousPersonRoleKey = 'primary' | 'partner' | 'household' | 'responsiblePerson';

export interface AuspiciousPersonRole {
  key: AuspiciousPersonRoleKey;
  label: string;
  required: boolean;
  description: string;
}

export interface AuspiciousPersonInput {
  role: AuspiciousPersonRoleKey;
  birthDate: string;
  birthTime: string;
  cityId: string;
  gender: 'male' | 'female' | 'unspecified';
  label?: string;
}

export type AuspiciousScoreDimensionKey = 'almanac' | 'scene' | 'zodiac' | 'bazi' | 'luckyHours';
export type AuspiciousScoreGrade = 'excellent' | 'good' | 'usable' | 'caution';

export interface AuspiciousScoreDimension {
  key: AuspiciousScoreDimensionKey;
  label: string;
  score: number;
  maxScore: number;
  reasons: string[];
  cautions: string[];
}

export interface AuspiciousRecommendationInput {
  scene: string;
  startDate: string;
  endDate: string;
  people: AuspiciousPersonInput[];
  limit?: number;
}

export interface AuspiciousDateScoreInput {
  scene: string | JieriSceneRule;
  date: string;
  people: AuspiciousPersonInput[];
}

export interface AuspiciousRecommendationResult {
  date: string;
  score: number;
  maxScore: number;
  grade: AuspiciousScoreGrade;
  scene: JieriSceneRule;
  almanac: DailyAlmanac;
  dimensions: Record<AuspiciousScoreDimensionKey, AuspiciousScoreDimension>;
  reasons: string[];
  cautions: string[];
  usableLuckyHours: string[];
  peopleCount: number;
}

export interface AuspiciousDayResult {
  date: string;
  year: number;
  month: number;
  day: number;
  lunarDay: string;
  lunarDate: string;
  fortune: '吉' | '凶';
  dayZodiac: string;
  chong: string;
  sha: string;
  yiMatches: string[];
  status: AuspiciousDayStatus;
  reasons: AuspiciousDayReason[];
  cautionReasons: AuspiciousDayReason[];
  almanac: DailyAlmanac;
}
