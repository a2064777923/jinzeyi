import { SolarDay } from 'tyme4ts';
import { calculateBazi, type BaziResult, type FiveElement } from './bazi';
import { buildDailyAlmanac, matchesSceneYi } from './auspicious';
import { formatAlmanacDate, isValidAlmanacDateString } from './date-range';
import { getJieriScene } from '@/lib/content/jieri-scenes';
import type {
  AuspiciousDateScoreInput,
  AuspiciousPersonInput,
  AuspiciousRecommendationInput,
  AuspiciousRecommendationResult,
  AuspiciousScoreDimension,
  AuspiciousScoreGrade,
  DailyAlmanac,
  JieriSceneRule,
} from './types';

const MAX_RANGE_DAYS = 90;
const TOTAL_MAX_SCORE = 100;

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

const BRANCH_ZODIAC: Record<string, string> = {
  子: '鼠',
  丑: '牛',
  寅: '虎',
  卯: '兔',
  辰: '龙',
  巳: '蛇',
  午: '马',
  未: '羊',
  申: '猴',
  酉: '鸡',
  戌: '狗',
  亥: '猪',
};

export function scoreAuspiciousDateRange(input: AuspiciousRecommendationInput): AuspiciousRecommendationResult[] {
  const scene = resolveScene(input.scene);
  validatePeople(scene, input.people);
  const dates = datesInRange(input.startDate, input.endDate);
  const limit = input.limit ?? 8;

  return dates
    .map((date) => scoreAuspiciousDate({ scene, date, people: input.people }))
    .sort((a, b) =>
      Number(hasSceneMatch(b)) - Number(hasSceneMatch(a))
      || b.score - a.score
      || a.date.localeCompare(b.date))
    .slice(0, limit);
}

function hasSceneMatch(result: AuspiciousRecommendationResult): boolean {
  return result.dimensions.scene.reasons.length > 0;
}

export function scoreAuspiciousDate(input: AuspiciousDateScoreInput): AuspiciousRecommendationResult {
  const scene = typeof input.scene === 'string' ? resolveScene(input.scene) : input.scene;
  validatePeople(scene, input.people);
  const almanac = almanacForDate(input.date);
  const people = normalizedPeople(input.people);
  const charts = people.map((person) => ({ person, chart: calculateBazi(person) }));
  const dimensions = {
    almanac: scoreAlmanacDimension(almanac),
    scene: scoreSceneDimension(almanac, scene),
    zodiac: scoreZodiacDimension(almanac, charts),
    bazi: scoreBaziDimension(almanac, charts),
    luckyHours: scoreLuckyHoursDimension(input.date, scene),
  };
  const score = Object.values(dimensions).reduce((total, dimension) => total + dimension.score, 0);
  const reasons = Object.values(dimensions).flatMap((dimension) => dimension.reasons);
  const cautions = Object.values(dimensions).flatMap((dimension) => dimension.cautions);

  return {
    date: input.date,
    score,
    maxScore: TOTAL_MAX_SCORE,
    grade: gradeForScore(score),
    scene,
    almanac,
    dimensions,
    reasons,
    cautions,
    usableLuckyHours: dimensions.luckyHours.reasons
      .filter((reason) => reason.startsWith('可用吉时'))
      .map((reason) => reason.replace(/^可用吉时：/, '')),
    peopleCount: people.length,
  };
}

function resolveScene(slug: string): JieriSceneRule {
  const scene = getJieriScene(slug);
  if (!scene) throw new RangeError(`Unknown jieri scene: ${slug}`);
  return scene;
}

function normalizedPeople(people: AuspiciousPersonInput[]): AuspiciousPersonInput[] {
  return people.filter((person) => person.birthDate && person.birthTime && person.cityId);
}

function validatePeople(scene: JieriSceneRule, people: AuspiciousPersonInput[]): void {
  const normalized = normalizedPeople(people);

  for (const role of scene.personRoles.filter((item) => item.required)) {
    const hasRole = normalized.some((person) => person.role === role.key);
    if (!hasRole) {
      throw new Error(`${scene.name}需要填写${role.label}资料`);
    }
  }
}

function datesInRange(startDate: string, endDate: string): string[] {
  if (!isValidAlmanacDateString(startDate) || !isValidAlmanacDateString(endDate)) {
    throw new RangeError('日期范围需要使用合法 YYYY-MM-DD 日期');
  }

  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (start.getTime() > end.getTime()) {
    throw new RangeError('开始日期不能晚于结束日期');
  }

  const days = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1;
  if (days > MAX_RANGE_DAYS) {
    throw new RangeError(`日期范围不能超过 ${MAX_RANGE_DAYS} 天`);
  }

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return formatAlmanacDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  });
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(0, month - 1, day));
  date.setUTCFullYear(year);
  return date;
}

function almanacForDate(date: string): DailyAlmanac {
  if (!isValidAlmanacDateString(date)) {
    throw new RangeError(`Illegal recommendation date: ${date}`);
  }

  const [year, month, day] = date.split('-').map(Number);
  return buildDailyAlmanac(SolarDay.fromYmd(year, month, day));
}

function scoreAlmanacDimension(almanac: DailyAlmanac): AuspiciousScoreDimension {
  if (almanac.fortune === '吉') {
    return {
      key: 'almanac',
      label: '黄历基调',
      score: 28,
      maxScore: 30,
      reasons: ['当日黄历基调为吉，可作为候选日继续比较。'],
      cautions: [],
    };
  }

  return {
    key: 'almanac',
    label: '黄历基调',
    score: 12,
    maxScore: 30,
    reasons: [],
    cautions: ['当日黄历基调为凶，即使命中事项也建议谨慎使用。'],
  };
}

function scoreSceneDimension(almanac: DailyAlmanac, scene: JieriSceneRule): AuspiciousScoreDimension {
  const yiMatches = matchesSceneYi(almanac, scene);
  const sceneCautions = scene.cautionTerms.filter(
    (term) => almanac.ji.includes(term) || almanac.gods.includes(term) || almanac.duty.includes(term),
  );
  const baseScore = yiMatches.length > 0 ? Math.min(20, 12 + yiMatches.length * 4) : 4;
  const score = Math.max(0, baseScore - sceneCautions.length * 3);

  return {
    key: 'scene',
    label: '事项匹配',
    score,
    maxScore: 20,
    reasons: yiMatches.length > 0
      ? [`命中${scene.name}相关宜项：${yiMatches.join('、')}。`]
      : [],
    cautions: [
      ...(yiMatches.length === 0 ? [`未命中${scene.name}核心宜项，可作为低优先级备选。`] : []),
      ...(sceneCautions.length > 0 ? [`出现${sceneCautions.join('、')}等场景需留意项。`] : []),
    ],
  };
}

function scoreZodiacDimension(
  almanac: DailyAlmanac,
  charts: Array<{ person: AuspiciousPersonInput; chart: BaziResult }>,
): AuspiciousScoreDimension {
  if (charts.length === 0) {
    return {
      key: 'zodiac',
      label: '生肖冲煞',
      score: 12,
      maxScore: 20,
      reasons: [],
      cautions: ['未填写参与者资料，生肖冲煞只按日期信息保守展示。'],
    };
  }

  const personZodiacs = charts.map(({ chart }) => BRANCH_ZODIAC[chart.pillars.year.earthlyBranch] ?? '');
  const conflicts = personZodiacs.filter((zodiac) => zodiac && zodiac === almanac.direction.chong);

  if (conflicts.length > 0) {
    return {
      key: 'zodiac',
      label: '生肖冲煞',
      score: 6,
      maxScore: 20,
      reasons: [],
      cautions: [`当日冲${almanac.direction.chong}，与参与者生肖存在相冲提示。`],
    };
  }

  return {
    key: 'zodiac',
    label: '生肖冲煞',
    score: 18,
    maxScore: 20,
    reasons: ['未发现当日冲煞直接冲到已填写参与者生肖。'],
    cautions: [],
  };
}

function scoreBaziDimension(
  almanac: DailyAlmanac,
  charts: Array<{ person: AuspiciousPersonInput; chart: BaziResult }>,
): AuspiciousScoreDimension {
  const dateElement = STEM_ELEMENTS[almanac.ganZhi.day.slice(0, 1)];
  if (!dateElement || charts.length === 0) {
    return {
      key: 'bazi',
      label: '八字五行',
      score: 10,
      maxScore: 20,
      reasons: [],
      cautions: ['缺少可比较的八字资料，五行维度按中性参考处理。'],
    };
  }

  let score = 10;
  const reasons: string[] = [];
  const cautions: string[] = [];

  for (const { person, chart } of charts) {
    const label = person.label || roleLabel(person.role);
    const strongest = chart.professional.elementStrength.strongest.element;
    const weakest = chart.professional.elementStrength.weakest.element;

    if (dateElement === weakest) {
      score += 4;
      reasons.push(`${label}盘中${weakest}偏少，当日日干五行属${dateElement}，可作为补充信号参考。`);
    } else if (dateElement === strongest) {
      score += 2;
      reasons.push(`${label}盘中${strongest}较明显，当日${dateElement}同气，适合视为结构呼应。`);
    } else {
      score += 1;
      cautions.push(`${label}盘中强弱信号与当日${dateElement}关系不突出，建议继续看其他维度。`);
    }
  }

  return {
    key: 'bazi',
    label: '八字五行',
    score: Math.min(20, score),
    maxScore: 20,
    reasons,
    cautions,
  };
}

function scoreLuckyHoursDimension(date: string, scene: JieriSceneRule): AuspiciousScoreDimension {
  const [year, month, day] = date.split('-').map(Number);
  const hours = SolarDay.fromYmd(year, month, day)
    .getLunarDay()
    .getHours()
    .slice(0, 12);
  const usable = hours
    .filter((hour) => {
      const star = hour.getTwelveStar();
      const fortune = star.getEcliptic().getLuck().toString();
      const recommends = hour.getRecommends().map((item) => item.toString());
      return fortune === '吉' && scene.yiTerms.some((term) => recommends.includes(term));
    })
    .map((hour) => `${hour.getName()} ${hour.getTwelveStar()}`);

  if (usable.length === 0) {
    return {
      key: 'luckyHours',
      label: '可用吉时',
      score: 2,
      maxScore: 10,
      reasons: [],
      cautions: ['未找到直接命中事项宜项的吉时，可改看全天候选或扩大日期范围。'],
    };
  }

  return {
    key: 'luckyHours',
    label: '可用吉时',
    score: Math.min(10, 4 + usable.length * 2),
    maxScore: 10,
    reasons: [`可用吉时：${usable.slice(0, 4).join('、')}`],
    cautions: usable.length > 4 ? ['可用吉时较多，仍需结合实际安排关键动作。'] : [],
  };
}

function gradeForScore(score: number): AuspiciousScoreGrade {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'usable';
  return 'caution';
}

function roleLabel(role: AuspiciousPersonInput['role']): string {
  if (role === 'partner') return '伴侣';
  if (role === 'household') return '家人';
  if (role === 'responsiblePerson') return '负责人';
  return '本人';
}
