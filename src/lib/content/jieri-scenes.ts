import { createLocalizedSeo } from './localize';
import type { JieriSceneRule } from '@/lib/almanac/types';
import type { FaqItem, IndexablePage, InternalLink } from './types';

const sharedJieriLinks: InternalLink[] = [
  { href: '/calendar', label: '月历吉日', description: '按月查看每日吉凶与节气。', family: 'core' },
  { href: '/tools/bazi', label: '八字排盘', description: '结合出生时间理解四柱与五行。', family: 'tool' },
];

export const jieriScenes: JieriSceneRule[] = [
  {
    slug: 'jiehun',
    name: '结婚',
    icon: '/assets/almanac-icons/lucky-knot.png',
    yiTerms: ['嫁娶', '纳采', '订盟'],
    cautionTerms: ['破日', '月破', '岁破'],
    summary: '结婚择日先看嫁娶、纳采、订盟等宜项，再结合冲煞与新人生肖避开明显相冲的日子。',
  },
  {
    slug: 'banjia',
    name: '搬家',
    icon: '/assets/almanac-icons/lantern.png',
    yiTerms: ['入宅', '移徙', '安床'],
    cautionTerms: ['月破', '闭日'],
    summary: '搬家择日重在入宅、移徙与安床，适合把吉日、吉时和家人生肖一起看。',
  },
  {
    slug: 'kaiye',
    name: '开业',
    icon: '/assets/almanac-icons/auspicious-seal.png',
    yiTerms: ['开市', '交易', '立券'],
    cautionTerms: ['收日', '闭日'],
    summary: '开业择日关注开市、交易、立券等事项，也要避开过重的冲煞和不利财位。',
  },
  {
    slug: 'zhuangxiu',
    name: '装修',
    icon: '/assets/almanac-icons/brush.png',
    yiTerms: ['修造', '动土', '上梁'],
    cautionTerms: ['土府', '土符'],
    summary: '装修动工要看修造、动土、上梁等宜项，并留意土煞、方位与家宅动线。',
  },
  {
    slug: 'qianyue',
    name: '签约',
    icon: '/assets/almanac-icons/hourglass.png',
    yiTerms: ['交易', '立券', '纳财'],
    cautionTerms: ['破日', '闭日'],
    summary: '签约择日偏重交易、立券与纳财，适合筛出气势平稳、冲煞较轻的日期。',
  },
  {
    slug: 'chuxing',
    name: '出行',
    icon: '/assets/almanac-icons/sun.png',
    yiTerms: ['出行', '赴任', '会友'],
    cautionTerms: ['四离', '四绝'],
    summary: '出行择日以出行、赴任、会友为主，同时参考当日冲向与路途安排。',
  },
  {
    slug: 'anzang',
    name: '安葬',
    icon: '/assets/almanac-icons/mountain.png',
    yiTerms: ['安葬', '破土', '启钻'],
    cautionTerms: ['重丧', '复日'],
    summary: '安葬择日更讲究稳妥，宜项、冲煞、方位和家属生肖都需要谨慎交叉查看。',
  },
  {
    slug: 'qiming',
    name: '起名',
    icon: '/assets/almanac-icons/sprout.png',
    yiTerms: ['求嗣', '祈福', '纳采'],
    cautionTerms: ['月厌', '厌对'],
    summary: '起名相关日子可参考祈福、求嗣等宜项，再结合姓名五行工具做更细的字义与五行分析。',
  },
  {
    slug: 'hehun',
    name: '合婚',
    icon: '/assets/almanac-icons/yin-yang.png',
    yiTerms: ['嫁娶', '纳采', '合帐'],
    cautionTerms: ['孤辰', '寡宿'],
    summary: '合婚择日先看婚嫁相关宜项，再把双方生肖冲合与八字基础信息放在同一视图里判断。',
  },
];

const jieriFaq: FaqItem[] = [
  {
    id: 'jieri-how',
    question: '吉日列表是怎么筛出来的？',
    answer: '先按场景对应的宜项匹配，再结合当日吉凶、冲煞和值神等信息做降级提示，凶日不会被悄悄删除。',
  },
  {
    id: 'jieri-year',
    question: '为什么只把部分年份放进 sitemap？',
    answer: '用户可以查询 2-5000 年的合法动态页面，但 sitemap 只收录当前年前后二十年的重点页面，避免低价值 URL 过多。',
  },
];

export const jieriIndexPage: IndexablePage = {
  id: 'jieri-index',
  family: 'jieri',
  slug: 'jieri',
  path: '/jieri',
  pageType: 'WebApplication',
  sitemap: true,
  seo: createLocalizedSeo({
    title: '黄道吉日查询｜结婚搬家开业装修吉日｜今择易',
    description: '按结婚、搬家、开业、装修、签约、出行、安葬、起名、合婚等场景查询黄道吉日，查看宜忌、冲煞和推荐理由。',
    h1: '黄道吉日查询',
    deck: '把常见择日场景整理成可查询的年度入口，先看宜项命中，再看冲煞、凶日降级和相关工具。',
    keywords: ['黄道吉日', '结婚吉日', '搬家吉日', '开业吉日', '择日查询'],
  }),
  body: '吉日查询不是只挑一个红色日期。今择易把结婚、搬家、开业、装修、签约、出行、安葬、起名、合婚等场景拆开，分别对应黄历里的宜项，再把每日吉凶、冲煞、值神和生肖避冲放在同一套规则里。这样用户进入年度页面时，能看到为什么这天被推荐，哪些日子虽然命中宜项但仍需谨慎，也能顺手跳到当日完整黄历继续核对时辰。',
  faq: jieriFaq,
  relatedLinks: sharedJieriLinks,
  seed: {
    model: 'ContentPage',
    slug: 'jieri',
    category: 'jieri',
    localeStrategy: 'localized-seo-canonical-body',
  },
};

export function getJieriScene(slug: string): JieriSceneRule | undefined {
  return jieriScenes.find((scene) => scene.slug === slug);
}
