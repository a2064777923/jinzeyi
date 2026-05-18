import { SolarTime } from 'tyme4ts';
import { z } from 'zod';
import { isLegalRouteYear } from '@/lib/almanac/year-support';
import { getChinaCity, type ChinaCity } from '@/lib/tools/china-cities';

export type Gender = 'male' | 'female' | 'unspecified';
export type FiveElement = '木' | '火' | '土' | '金' | '水';
export type PillarKey = 'year' | 'month' | 'day' | 'hour';
type EightChar = ReturnType<ReturnType<SolarTime['getLunarHour']>['getEightChar']>;
type SixtyCyclePillar = ReturnType<EightChar['getYear']>;
type HeavenStemValue = ReturnType<SixtyCyclePillar['getHeavenStem']>;

export interface BaziInput {
  birthDate: string;
  birthTime: string;
  cityId: string;
  gender: Gender;
}

export interface BaziPillar {
  label: string;
  value: string;
  heavenlyStem: string;
  earthlyBranch: string;
  stemElement: FiveElement;
  branchElement: FiveElement;
}

export type HiddenStemType = 'main' | 'middle' | 'residual';

export interface BaziHiddenStem {
  value: string;
  heavenlyStem: string;
  element: FiveElement;
  tenGod: string;
  type: HiddenStemType;
  weight: number;
}

export interface BaziProfessionalPillar extends BaziPillar {
  tenGod: string;
  hiddenStems: BaziHiddenStem[];
  naYin: string;
  terrain: string;
}

export interface BaziDayMaster {
  heavenlyStem: string;
  element: FiveElement;
  yinYang: string;
  pillar: string;
  description: string;
}

export interface BaziElementRank {
  element: FiveElement;
  score: number;
}

export interface BaziElementStrength {
  visibleCounts: Record<FiveElement, number>;
  hiddenStemWeightedCounts: Record<FiveElement, number>;
  combinedScores: Record<FiveElement, number>;
  strongest: BaziElementRank;
  weakest: BaziElementRank;
  summary: string;
}

export interface BaziProfessionalChart {
  dayMaster: BaziDayMaster;
  pillars: Record<PillarKey, BaziProfessionalPillar>;
  elementStrength: BaziElementStrength;
}

export interface TrueSolarTimeSummary {
  original: string;
  adjusted: string;
  offsetMinutes: number;
  longitude: number;
  standardLongitude: number;
  description: string;
}

export interface BaziResult {
  input: BaziInput;
  city: ChinaCity;
  genderLabel: string;
  trueSolarTime: TrueSolarTimeSummary;
  pillars: Record<PillarKey, BaziPillar>;
  elements: Record<FiveElement, number>;
  professional: BaziProfessionalChart;
  explanation: string;
}

const STEM_ELEMENTS: Record<string, FiveElement> = {
  甲: '木',
  乙: '木',
  丙: '火',
  丁: '火',
  戊: '土',
  己: '土',
  庚: '金',
  辛: '金',
  壬: '水',
  癸: '水',
};

const BRANCH_ELEMENTS: Record<string, FiveElement> = {
  寅: '木',
  卯: '木',
  巳: '火',
  午: '火',
  辰: '土',
  戌: '土',
  丑: '土',
  未: '土',
  申: '金',
  酉: '金',
  子: '水',
  亥: '水',
};

export const baziInputSchema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/),
  cityId: z.string().min(1),
  gender: z.enum(['male', 'female', 'unspecified']),
});

export function calculateTrueSolarOffsetMinutes(longitude: number): number {
  return Math.round((longitude - 120) * 4);
}

export function calculateBazi(input: BaziInput): BaziResult {
  const parsed = baziInputSchema.parse(input);
  const city = getChinaCity(parsed.cityId);
  if (!city) {
    throw new Error(`Unsupported birth city: ${parsed.cityId}`);
  }

  const { year, month, day, hour, minute } = parseBirthDateTime(parsed.birthDate, parsed.birthTime);
  const offsetMinutes = calculateTrueSolarOffsetMinutes(city.longitude);
  const adjusted = createUtcDate(year, month, day, hour, minute, 0);
  adjusted.setUTCMinutes(adjusted.getUTCMinutes() + offsetMinutes);
  const solarTime = SolarTime.fromYmdHms(
    adjusted.getUTCFullYear(),
    adjusted.getUTCMonth() + 1,
    adjusted.getUTCDate(),
    adjusted.getUTCHours(),
    adjusted.getUTCMinutes(),
    adjusted.getUTCSeconds(),
  );
  const eightChar = solarTime.getLunarHour().getEightChar();
  const dayStem = eightChar.getDay().getHeavenStem();
  const pillars = {
    year: createPillar('年柱', eightChar.getYear().toString()),
    month: createPillar('月柱', eightChar.getMonth().toString()),
    day: createPillar('日柱', eightChar.getDay().toString()),
    hour: createPillar('时柱', eightChar.getHour().toString()),
  };
  const elements = countElements(Object.values(pillars));
  const professionalPillars = {
    year: createProfessionalPillar('年柱', eightChar.getYear(), dayStem),
    month: createProfessionalPillar('月柱', eightChar.getMonth(), dayStem),
    day: createProfessionalPillar('日柱', eightChar.getDay(), dayStem),
    hour: createProfessionalPillar('时柱', eightChar.getHour(), dayStem),
  };
  const elementStrength = buildElementStrength(elements, professionalPillars);
  const professional: BaziProfessionalChart = {
    dayMaster: {
      heavenlyStem: dayStem.toString(),
      element: toFiveElement(dayStem.getElement().toString()),
      yinYang: dayStem.getYinYang().toString(),
      pillar: professionalPillars.day.value,
      description: buildDayMasterDescription(dayStem.toString(), dayStem.getElement().toString(), dayStem.getYinYang().toString()),
    },
    pillars: professionalPillars,
    elementStrength,
  };

  return {
    input: parsed,
    city,
    genderLabel: genderLabel(parsed.gender),
    trueSolarTime: {
      original: `${parsed.birthDate} ${parsed.birthTime}`,
      adjusted: formatAdjustedTime(adjusted),
      offsetMinutes,
      longitude: city.longitude,
      standardLongitude: 120,
      description: buildSolarTimeDescription(city, offsetMinutes),
    },
    pillars,
    elements,
    professional,
    explanation: buildExplanation(pillars, elements),
  };
}

function parseBirthDateTime(birthDate: string, birthTime: string) {
  const [year, month, day] = birthDate.split('-').map(Number);
  const [hour, minute] = birthTime.split(':').map(Number);
  if (!isLegalRouteYear(year)) {
    throw new Error('Birth year must be between 2 and 5000');
  }

  const date = createUtcDate(year, month, day, hour, minute, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute
  ) {
    throw new Error('Invalid birth date or time');
  }

  return { year, month, day, hour, minute };
}

function createUtcDate(year: number, month: number, day: number, hour: number, minute: number, second: number): Date {
  const date = new Date(Date.UTC(0, month - 1, day, hour, minute, second));
  date.setUTCFullYear(year);
  return date;
}

function createPillar(label: string, value: string): BaziPillar {
  const heavenlyStem = value.slice(0, 1);
  const earthlyBranch = value.slice(1, 2);
  const stemElement = STEM_ELEMENTS[heavenlyStem];
  const branchElement = BRANCH_ELEMENTS[earthlyBranch];

  if (!stemElement || !branchElement) {
    throw new Error(`Unsupported pillar: ${value}`);
  }

  return {
    label,
    value,
    heavenlyStem,
    earthlyBranch,
    stemElement,
    branchElement,
  };
}

function createProfessionalPillar(
  label: string,
  pillar: SixtyCyclePillar,
  dayMasterStem: HeavenStemValue,
): BaziProfessionalPillar {
  const heavenlyStem = pillar.getHeavenStem();
  const earthlyBranch = pillar.getEarthBranch();
  const value = pillar.toString();
  const base = createPillar(label, value);

  return {
    ...base,
    tenGod: dayMasterStem.getTenStar(heavenlyStem).toString(),
    hiddenStems: earthlyBranch.getHideHeavenStems().map((hidden) => {
      const stem = hidden.getHeavenStem();
      const type = normalizeHiddenStemType(hidden.getType().toString());
      return {
        value: hidden.toString(),
        heavenlyStem: stem.toString(),
        element: toFiveElement(stem.getElement().toString()),
        tenGod: dayMasterStem.getTenStar(stem).toString(),
        type,
        weight: hiddenStemWeight(type),
      };
    }),
    naYin: pillar.getSound().toString(),
    terrain: dayMasterStem.getTerrain(earthlyBranch).toString(),
  };
}

function countElements(pillars: BaziPillar[]): Record<FiveElement, number> {
  const elements: Record<FiveElement, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const pillar of pillars) {
    elements[pillar.stemElement] += 1;
    elements[pillar.branchElement] += 1;
  }
  return elements;
}

function buildElementStrength(
  visibleCounts: Record<FiveElement, number>,
  pillars: Record<PillarKey, BaziProfessionalPillar>,
): BaziElementStrength {
  const hiddenStemWeightedCounts = createEmptyElementCounts();
  for (const pillar of Object.values(pillars)) {
    for (const hiddenStem of pillar.hiddenStems) {
      hiddenStemWeightedCounts[hiddenStem.element] += hiddenStem.weight;
    }
  }

  const combinedScores = createEmptyElementCounts();
  for (const element of FIVE_ELEMENTS) {
    combinedScores[element] = visibleCounts[element] * 3 + hiddenStemWeightedCounts[element];
  }

  const ranked = FIVE_ELEMENTS
    .map((element) => ({ element, score: combinedScores[element] }))
    .sort((a, b) => b.score - a.score);
  const strongest = ranked[0] ?? { element: '木' as FiveElement, score: 0 };
  const weakest = ranked.at(-1) ?? { element: '水' as FiveElement, score: 0 };

  return {
    visibleCounts: { ...visibleCounts },
    hiddenStemWeightedCounts,
    combinedScores,
    strongest,
    weakest,
    summary: `此盘五行综合信号以${strongest.element}较明显，${weakest.element}偏少；该结果只作传统排盘结构参考，需结合完整四柱和现实条件理解。`,
  };
}

const FIVE_ELEMENTS: FiveElement[] = ['木', '火', '土', '金', '水'];

function createEmptyElementCounts(): Record<FiveElement, number> {
  return { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
}

function toFiveElement(value: string): FiveElement {
  if (FIVE_ELEMENTS.includes(value as FiveElement)) return value as FiveElement;
  throw new Error(`Unsupported five element: ${value}`);
}

function normalizeHiddenStemType(type: string): HiddenStemType {
  if (type === '2' || type === 'main' || type === '本气') return 'main';
  if (type === '1' || type === 'middle' || type === '中气') return 'middle';
  return 'residual';
}

function hiddenStemWeight(type: HiddenStemType): number {
  if (type === 'main') return 3;
  if (type === 'middle') return 2;
  return 1;
}

function buildDayMasterDescription(heavenlyStem: string, element: string, yinYang: string): string {
  return `日主为${heavenlyStem}，五行属${element}，阴阳为${yinYang}；后续十神、藏干和五行强弱均以日主作为参照。`;
}

function genderLabel(gender: Gender): string {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未指定';
}

function formatAdjustedTime(date: Date): string {
  return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

function buildSolarTimeDescription(city: ChinaCity, offsetMinutes: number): string {
  if (offsetMinutes === 0) {
    return `${city.name}经度接近东经120度，真太阳时与北京时间差异很小。`;
  }

  const action = offsetMinutes > 0 ? '加' : '减';
  return `${city.name}经度为东经${city.longitude.toFixed(2)}度，按东经120度标准时区${action}${Math.abs(offsetMinutes)}分钟后排盘。`;
}

function buildExplanation(pillars: Record<PillarKey, BaziPillar>, elements: Record<FiveElement, number>): string {
  const strongest = Object.entries(elements).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '五行';
  return `此盘以${pillars.day.value}日柱为中心，四柱分别为${pillars.year.value}、${pillars.month.value}、${pillars.day.value}、${pillars.hour.value}。五行数量以${strongest}较明显，结果适合作为传统文化参考，不能替代个人决策或专业建议。`;
}
