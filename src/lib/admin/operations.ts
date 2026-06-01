import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fengShuiCategories, getIndexableRoutes, jieriScenes, toolPages, zodiacAnimals } from '@/lib/content/registry';
import { solarTermArticles } from '@/lib/content/solar-terms';
import type { ContentFamily, IndexablePage } from '@/lib/content/types';
import type { UsageSummary, UsageTopItem } from '@/lib/usage/summary';

export interface AdminOpportunity {
  title: string;
  body: string;
  href: string;
  signal: string;
  label: string;
  tone: 'jade' | 'amber' | 'ink' | 'rose';
}

export interface ContentInventoryItem {
  family: ContentFamily;
  label: string;
  count: number;
  articleCount: number;
  webAppCount: number;
}

export interface AiCaseCard {
  title: string;
  subtitle: string;
  detail: string;
  href: string;
  status: 'ready' | 'attention';
}

export interface AssetGroup {
  key: string;
  title: string;
  body: string;
  total: number;
  ready: number;
  missing: number;
  samples: Array<{ src: string; alt: string; ok: boolean }>;
}

export function buildContentOpportunities(summary: UsageSummary, limit = 8): AdminOpportunity[] {
  const opportunities: AdminOpportunity[] = [
    ...summary.topScenes.map((item) => sceneOpportunity(item)),
    ...summary.topPaths.map((item) => pathOpportunity(item)).filter((item): item is AdminOpportunity => Boolean(item)),
    ...summary.topBaziBirthYears.map((item) => baziYearOpportunity(item)),
    ...summary.topAlmanacDates.map((item) => almanacDateOpportunity(item)),
  ];

  const unique = new Map<string, AdminOpportunity>();
  for (const item of opportunities) {
    if (!unique.has(item.title)) unique.set(item.title, item);
  }

  const ranked = Array.from(unique.values()).slice(0, limit);
  return ranked.length > 0 ? ranked : fallbackOpportunities.slice(0, limit);
}

export function buildContentInventory(): ContentInventoryItem[] {
  const routes = getIndexableRoutes();
  const groups = new Map<ContentFamily, IndexablePage[]>();
  for (const route of routes) {
    groups.set(route.family, [...(groups.get(route.family) ?? []), route]);
  }

  return Array.from(groups.entries())
    .map(([family, pages]) => ({
      family,
      label: familyLabels[family],
      count: pages.length,
      articleCount: pages.filter((page) => page.pageType === 'Article').length,
      webAppCount: pages.filter((page) => page.pageType === 'WebApplication').length,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function buildAiCases(summary: UsageSummary, limit = 6): AiCaseCard[] {
  const cases = summary.latestToolEvents
    .filter((event) => event.eventName === 'tool_submit' || event.eventName === 'tool_error')
    .map((event) => describeAiCase(event))
    .slice(0, limit);

  return cases.length > 0 ? cases : fallbackAiCases.slice(0, limit);
}

export function buildIntentMix(summary: UsageSummary): UsageTopItem[] {
  const mapped = summary.byArea
    .filter((item) => item.key !== 'site')
    .map((item) => ({ key: areaLabel(item.key), count: item.count }));
  return mapped.length > 0 ? mapped : fallbackIntentMix;
}

export function buildAssetInventory(): AssetGroup[] {
  return [
    assetGroup('brand', '站点门面', '图标、收藏入口和社媒露出先保持统一。', [
      { src: '/assets/image2/site-icon.png', alt: '今择易站点图标' },
      { src: '/icon-192.png', alt: '192 尺寸站点图标' },
      { src: '/icon-512.png', alt: '512 尺寸站点图标' },
      { src: '/apple-touch-icon.png', alt: '移动端收藏图标' },
    ]),
    assetGroup('jieri', '吉日场景', '结婚、搬家、开业、上学等入口保持同一套新中式卡通风。', jieriScenes.map((scene) => ({
      src: scene.icon,
      alt: `${scene.name}场景图`,
    }))),
    assetGroup('zodiac', '十二生肖', '生肖主视觉用于首页轮盘、详情页和配对入口。', zodiacAnimals.map((animal) => ({
      src: `/assets/image2/zodiac/${animal.slug}.png`,
      alt: `生肖${animal.animal}插图`,
    }))),
    assetGroup('solar-terms', '二十四节气', '节气故事配图要有季节画面，避免只剩文字。', solarTermArticles.map((term) => ({
      src: term.image,
      alt: term.imageAlt,
    }))),
    assetGroup('tools', '工具入口', '八字、姓名和推荐日期入口需要能一眼分辨用途。', toolPages
      .filter((tool) => tool.toolKey !== 'tools-index')
      .map((tool) => ({
        src: `/assets/image2/tools/${tool.toolKey}.png`,
        alt: `${tool.seo.zhHans.h1}工具图`,
      }))),
    assetGroup('feng-shui', '风水空间', '家居、商铺、办公室和方位图要表达空间关系。', fengShuiCategories.map((category) => ({
      src: category.icon,
      alt: `${category.name}风水插图`,
    }))),
    assetGroup('almanac', '黄历方位', '财神、喜神、福神、冲煞和罗盘底图要能对上含义。', [
      { src: '/assets/image2/direction-compass-base.png', alt: '黄历方位罗盘底图' },
      { src: '/assets/image2/direction-wealth.png', alt: '财神方位标记' },
      { src: '/assets/image2/direction-joy.png', alt: '喜神方位标记' },
      { src: '/assets/image2/direction-blessing.png', alt: '福神方位标记' },
      { src: '/assets/image2/direction-conflict.png', alt: '冲煞方位标记' },
    ]),
  ];
}

export function normalizeTrackedPath(path: string): string {
  const clean = path.split('?')[0]?.replace(/\/$/, '') || '/';
  const withoutLocale = clean.replace(/^\/zh-han[st](?=\/|$)/, '');
  return withoutLocale || '/';
}

export function routeLabel(path: string): string {
  const route = getIndexableRoutes().find((item) => item.path === normalizeTrackedPath(path));
  return route?.seo.zhHans.h1 ?? normalizeTrackedPath(path);
}

export function areaLabel(area: string): string {
  return areaLabels[area] ?? area;
}

function sceneOpportunity(item: UsageTopItem): AdminOpportunity {
  const scene = jieriScenes.find((candidate) => candidate.slug === item.key);
  const name = scene?.name ?? item.key;
  return {
    title: `${name}择日专题`,
    body: `把${name}的宜项、避冲和常见现实安排写成一组可连续阅读的内容。`,
    href: scene ? `/jieri/${scene.slug}/2026` : '/jieri',
    signal: `${item.count} 次提交`,
    label: '择日',
    tone: 'amber',
  };
}

function pathOpportunity(item: UsageTopItem): AdminOpportunity | null {
  const path = normalizeTrackedPath(item.key);
  const route = getIndexableRoutes().find((candidate) => candidate.path === path);
  if (!route) return null;

  return {
    title: `${route.seo.zhHans.h1}加深`,
    body: route.seo.zhHans.deck,
    href: route.path,
    signal: `${item.count} 次访问`,
    label: familyLabels[route.family],
    tone: route.family === 'zodiac' ? 'rose' : route.family === 'tool' ? 'jade' : 'ink',
  };
}

function baziYearOpportunity(item: UsageTopItem): AdminOpportunity {
  return {
    title: `${item.key} 年出生盘面`,
    body: '把常见出生年份、生肖边界和四柱基础读法整理成容易理解的案例。',
    href: '/tools/bazi',
    signal: `${item.count} 次排盘`,
    label: '八字',
    tone: 'jade',
  };
}

function almanacDateOpportunity(item: UsageTopItem): AdminOpportunity {
  return {
    title: `${item.key} 黄历解读`,
    body: '围绕这一天的宜忌、冲煞、神位和时辰，整理成一篇日期说明。',
    href: `/almanac/${item.key}`,
    signal: `${item.count} 次查询`,
    label: '黄历',
    tone: 'ink',
  };
}

function describeAiCase(event: UsageSummary['latestToolEvents'][number]): AiCaseCard {
  const payload = asRecord(event.payload);
  const result = asRecord(event.result);
  const attention = event.status === 'error';

  if (event.area === 'bazi') {
    return {
      title: '八字盘面延展',
      subtitle: [readText(payload?.birthDate), readText(payload?.birthTime)].filter(Boolean).join(' · ') || '出生资料已记录',
      detail: result?.dayMaster ? `围绕日主 ${result.dayMaster}、五行偏向和十神关系扩写解释。` : '整理四柱、日主和五行偏向，形成更有温度的解读。',
      href: '/admin/usage',
      status: attention ? 'attention' : 'ready',
    };
  }

  if (event.area === 'jieri-recommend') {
    const scene = jieriScenes.find((item) => item.slug === readText(payload?.scene));
    return {
      title: `${scene?.name ?? '择日'}结果说明`,
      subtitle: [readText(payload?.startDate), readText(payload?.endDate)].filter(Boolean).join(' 至 ') || '日期范围已记录',
      detail: '把候选日差异、冲煞提醒和现实安排写成可直接阅读的择日说明。',
      href: '/admin/usage',
      status: attention ? 'attention' : 'ready',
    };
  }

  if (event.area === 'naming') {
    return {
      title: '姓名五行建议',
      subtitle: `姓 ${readNumber(payload?.surnameLength) ?? 0} 字 · 名 ${readNumber(payload?.givenNameLength) ?? 0} 字`,
      detail: result?.score ? `围绕 ${result.score} 分结果补充读音、寓意和替换字建议。` : '把五行分布、读音和字义合成一段更像真人建议的说明。',
      href: '/admin/usage',
      status: attention ? 'attention' : 'ready',
    };
  }

  return {
    title: `${areaLabel(event.area)}解读`,
    subtitle: event.path ? routeLabel(event.path) : '近期提交',
    detail: attention ? '这条记录适合排查表单、文案或结果解释。' : '这条记录适合沉淀成可复用的回答片段。',
    href: '/admin/usage',
    status: attention ? 'attention' : 'ready',
  };
}

function assetGroup(key: string, title: string, body: string, assets: Array<{ src: string; alt: string }>): AssetGroup {
  const samples = assets.map((asset) => ({
    ...asset,
    ok: publicAssetExists(asset.src),
  }));
  const ready = samples.filter((sample) => sample.ok).length;

  return {
    key,
    title,
    body,
    total: samples.length,
    ready,
    missing: samples.length - ready,
    samples: samples.slice(0, 8),
  };
}

function publicAssetExists(src: string): boolean {
  if (!src.startsWith('/')) return false;
  return existsSync(join(process.cwd(), 'public', src.slice(1)));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function readText(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

const familyLabels: Record<ContentFamily, string> = {
  core: '核心入口',
  jieri: '吉日',
  zodiac: '生肖',
  'feng-shui': '风水',
  tool: '工具',
  knowledge: '知识',
};

const areaLabels: Record<string, string> = {
  site: '全站',
  almanac: '黄历',
  bazi: '八字排盘',
  naming: '姓名五行',
  'jieri-recommend': '推荐日期',
};

const fallbackOpportunities: AdminOpportunity[] = [
  {
    title: '节气故事系列',
    body: '按四季挑出最近节气，把习俗、饮食和黄历入口串成轻松可读的内容。',
    href: '/solar-terms',
    signal: '常青专题',
    label: '节气',
    tone: 'jade',
  },
  {
    title: '生肖避冲入口',
    body: '把生肖、节日和场景之间的影响讲清楚，方便连接吉日与八字。',
    href: '/zodiac',
    signal: '常青专题',
    label: '生肖',
    tone: 'rose',
  },
  {
    title: '推荐日期使用指南',
    body: '用结婚、搬家、开业、上学四个场景示范如何比较候选日期。',
    href: '/tools/jieri-recommend',
    signal: '工具专题',
    label: '工具',
    tone: 'amber',
  },
];

const fallbackAiCases: AiCaseCard[] = [
  {
    title: '八字结果解释',
    subtitle: '四柱、日主、五行',
    detail: '把盘面结果改写成更顺口的说明，重点解释最容易卡住的名词。',
    href: '/tools/bazi',
    status: 'ready',
  },
  {
    title: '推荐日期说明',
    subtitle: '场景、宜忌、冲煞',
    detail: '把候选日差异讲成人能判断的理由，提醒要小心注意的位置。',
    href: '/tools/jieri-recommend',
    status: 'ready',
  },
  {
    title: '姓名五行建议',
    subtitle: '字义、读音、五行',
    detail: '把评分、五行和替换字合成更自然的起名建议。',
    href: '/tools/naming',
    status: 'ready',
  },
];

const fallbackIntentMix: UsageTopItem[] = [
  { key: '八字排盘', count: 0 },
  { key: '推荐日期', count: 0 },
  { key: '姓名五行', count: 0 },
];
