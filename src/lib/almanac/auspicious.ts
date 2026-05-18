import { SolarDay, SolarMonth } from 'tyme4ts';
import { getJieriScene } from '@/lib/content/jieri-scenes';
import { isLegalRouteYear } from './year-support';
import type {
  AuspiciousDayReason,
  AuspiciousDayResult,
  AuspiciousDayStatus,
  DailyAlmanac,
  JieriSceneRule,
} from './types';

export interface GetAuspiciousDaysInput {
  scene: string | JieriSceneRule;
  year: number;
  zodiac?: string;
}

interface StatusResult {
  status: AuspiciousDayStatus;
  reasons: AuspiciousDayReason[];
  cautionReasons: AuspiciousDayReason[];
  yiMatches: string[];
}

type LunarDay = ReturnType<SolarDay['getLunarDay']>;

function getDailyFortune(lunar: LunarDay): '吉' | '凶' {
  return lunar.getTwelveStar().getEcliptic().getLuck().toString() as '吉' | '凶';
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function buildDailyAlmanac(solar: SolarDay): DailyAlmanac {
  const year = solar.getYear();
  const month = solar.getMonth();
  const day = solar.getDay();
  const lunar = solar.getLunarDay();
  const daySixtyCycle = lunar.getSixtyCycle();
  const earthBranch = daySixtyCycle.getEarthBranch();
  const heavenStem = daySixtyCycle.getHeavenStem();
  const lunarMonth = lunar.getLunarMonth();
  const lunarYear = lunarMonth.getLunarYear();

  return {
    solar: { year, month, day },
    lunar: {
      year: `${lunarYear.getSixtyCycle()}年`,
      month: lunarMonth.getName(),
      day: lunar.getName(),
      lunarDate: lunar.toString(),
    },
    ganZhi: {
      year: lunar.getYearSixtyCycle().toString(),
      month: lunar.getMonthSixtyCycle().toString(),
      day: daySixtyCycle.toString(),
    },
    zodiac: lunar.getYearSixtyCycle().getEarthBranch().getZodiac().toString(),
    dayZodiac: earthBranch.getZodiac().toString(),
    fortune: getDailyFortune(lunar),
    yi: lunar.getRecommends().map((item) => item.toString()),
    ji: lunar.getAvoids().map((item) => item.toString()),
    direction: {
      chong: earthBranch.getOpposite().toString(),
      sha: earthBranch.getOminous().toString(),
      caiShen: heavenStem.getWealthDirection().toString(),
      xiShen: heavenStem.getJoyDirection().toString(),
      fuShen: heavenStem.getMascotDirection().toString(),
    },
    gods: lunar.getGods().map((item) => item.toString()),
    duty: lunar.getDuty().toString(),
    twentyEightStar: lunar.getTwentyEightStar().toString(),
    pengZu: daySixtyCycle.getPengZu().toString(),
    sound: daySixtyCycle.getSound().toString(),
    fetusDay: lunar.getFetusDay().toString(),
  };
}

export function matchesSceneYi(almanac: DailyAlmanac, sceneRule: JieriSceneRule): string[] {
  return sceneRule.yiTerms.filter((term) => almanac.yi.includes(term));
}

export function getZodiacConflict(
  almanac: DailyAlmanac,
  zodiac?: string,
): AuspiciousDayReason | null {
  if (!zodiac) return null;

  const selected = zodiac.trim();
  if (!selected) return null;

  if (almanac.direction.chong !== selected) return null;

  return {
    type: 'zodiac-conflict',
    label: '生肖相冲',
    detail: `当日冲${selected}，已保留在列表中并降级提示。`,
    severity: 'caution',
  };
}

export function getAuspiciousDayStatus(
  almanac: DailyAlmanac,
  sceneRule: JieriSceneRule,
  zodiac?: string,
): StatusResult | null {
  const yiMatches = matchesSceneYi(almanac, sceneRule);
  if (yiMatches.length === 0) return null;

  const reasons: AuspiciousDayReason[] = [
    {
      type: 'yi-match',
      label: '宜项命中',
      detail: `黄历宜「${yiMatches.join('、')}」，符合${sceneRule.name}场景。`,
      severity: 'positive',
    },
  ];

  const cautionReasons: AuspiciousDayReason[] = [];
  const zodiacConflict = getZodiacConflict(almanac, zodiac);
  const sceneCautions = sceneRule.cautionTerms.filter(
    (term) => almanac.ji.includes(term) || almanac.gods.includes(term) || almanac.duty.includes(term),
  );

  if (almanac.fortune === '凶') {
    cautionReasons.push({
      type: 'daily-fortune',
      label: '当日为凶',
      detail: '虽命中场景宜项，但今日黄历整体为凶，建议谨慎使用或继续比较备选日期。',
      severity: 'negative',
    });
  }

  if (zodiacConflict) {
    cautionReasons.push(zodiacConflict);
  }

  if (sceneCautions.length > 0) {
    cautionReasons.push({
      type: 'scene-caution',
      label: '场景忌项',
      detail: `出现「${sceneCautions.join('、')}」等需留意的神煞或忌项。`,
      severity: 'caution',
    });
  }

  const status: AuspiciousDayStatus =
    almanac.fortune === '凶'
      ? 'not-preferred'
      : cautionReasons.length > 0
        ? 'caution'
        : 'recommended';

  return {
    status,
    reasons: [...reasons, ...cautionReasons],
    cautionReasons,
    yiMatches,
  };
}

export async function getAuspiciousDaysForScene({
  scene,
  year,
  zodiac,
}: GetAuspiciousDaysInput): Promise<AuspiciousDayResult[]> {
  if (!isLegalRouteYear(year)) {
    throw new RangeError(`Illegal jieri year: ${year}`);
  }

  const sceneRule = typeof scene === 'string' ? getJieriScene(scene) : scene;
  if (!sceneRule) {
    throw new RangeError(`Unknown jieri scene: ${scene}`);
  }

  const results: AuspiciousDayResult[] = [];

  for (let month = 1; month <= 12; month += 1) {
    const days = SolarMonth.fromYm(year, month).getDays();

    for (const solar of days) {
      const almanac = buildDailyAlmanac(solar);
      const status = getAuspiciousDayStatus(almanac, sceneRule, zodiac);
      if (!status) continue;

      results.push({
        date: formatDate(almanac.solar.year, almanac.solar.month, almanac.solar.day),
        year: almanac.solar.year,
        month: almanac.solar.month,
        day: almanac.solar.day,
        lunarDay: almanac.lunar.day,
        lunarDate: almanac.lunar.lunarDate,
        fortune: almanac.fortune,
        dayZodiac: almanac.dayZodiac,
        chong: almanac.direction.chong,
        sha: almanac.direction.sha,
        yiMatches: status.yiMatches,
        status: status.status,
        reasons: status.reasons,
        cautionReasons: status.cautionReasons,
        almanac,
      });
    }
  }

  return results;
}
