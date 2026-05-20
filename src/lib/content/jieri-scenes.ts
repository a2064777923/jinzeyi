import { createLocalizedSeo } from './localize';
import type { JieriSceneRule } from '@/lib/almanac/types';
import type { FaqItem, IndexablePage, InternalLink } from './types';

const primaryRole = {
  key: 'primary',
  label: '本人',
  required: false,
  description: '主要参与者。',
} satisfies JieriSceneRule['personRoles'][number];

const marriageRoles: JieriSceneRule['personRoles'] = [
  {
    key: 'primary',
    label: '本人',
    required: true,
    description: '第一位当事人。',
  },
  {
    key: 'partner',
    label: '伴侣',
    required: true,
    description: '第二位当事人。',
  },
];

const movingRoles: JieriSceneRule['personRoles'] = [
  {
    key: 'primary',
    label: '屋主',
    required: true,
    description: '主要负责人。',
  },
  {
    key: 'household',
    label: '同住家人',
    required: false,
    description: '家人里需要重点避冲的一位。',
  },
];

const responsiblePersonRoles: JieriSceneRule['personRoles'] = [
  {
    key: 'responsiblePerson',
    label: '负责人',
    required: true,
    description: '负责人或法定代表人。',
  },
];

const optionalPrimaryRoles: JieriSceneRule['personRoles'] = [primaryRole];

const sharedJieriLinks: InternalLink[] = [
  { href: '/calendar', label: '月历吉日', description: '每日吉凶与节气。', family: 'core' },
  { href: '/tools/bazi', label: '八字排盘', description: '结合出生时间理解四柱与五行。', family: 'tool' },
  { href: '/tools/jieri-recommend', label: '推荐日期', description: '按参与者筛出更合适的日子。', family: 'tool' },
];

export const jieriScenes: JieriSceneRule[] = [
  {
    slug: 'jiehun',
    name: '结婚',
    icon: '/assets/image2/jieri/jiehun.png',
    yiTerms: ['嫁娶', '纳采', '订盟'],
    cautionTerms: ['破日', '月破', '岁破'],
    summary: '结婚择日关注嫁娶、纳采、订盟等宜项，也要避开与新人生肖明显相冲的日子。',
    personRoles: marriageRoles,
  },
  {
    slug: 'banjia',
    name: '搬家',
    icon: '/assets/image2/jieri/banjia.png',
    yiTerms: ['入宅', '移徙', '安床'],
    cautionTerms: ['月破', '闭日'],
    summary: '搬家择日重在入宅、移徙与安床，适合把吉日、吉时和家人生肖一起看。',
    personRoles: movingRoles,
  },
  {
    slug: 'kaiye',
    name: '开业',
    icon: '/assets/image2/jieri/kaiye.png',
    yiTerms: ['开市', '交易', '立券'],
    cautionTerms: ['收日', '闭日'],
    summary: '开业择日关注开市、交易、立券等事项，也要避开过重的冲煞和不利财位。',
    personRoles: responsiblePersonRoles,
  },
  {
    slug: 'zhuangxiu',
    name: '装修',
    icon: '/assets/image2/jieri/zhuangxiu.png',
    yiTerms: ['修造', '动土', '上梁'],
    cautionTerms: ['土府', '土符'],
    summary: '装修动工要看修造、动土、上梁等宜项，并留意土煞、方位与家宅动线。',
    personRoles: optionalPrimaryRoles,
  },
  {
    slug: 'qianyue',
    name: '签约',
    icon: '/assets/image2/jieri/qianyue.png',
    yiTerms: ['交易', '立券', '纳财'],
    cautionTerms: ['破日', '闭日'],
    summary: '签约择日偏重交易、立券与纳财，适合筛出气势平稳、冲煞较轻的日期。',
    personRoles: responsiblePersonRoles,
  },
  {
    slug: 'chuxing',
    name: '出行',
    icon: '/assets/image2/jieri/chuxing.png',
    yiTerms: ['出行', '赴任', '会友'],
    cautionTerms: ['四离', '四绝'],
    summary: '出行择日以出行、赴任、会友为主，同时参考当日冲向与路途安排。',
    personRoles: optionalPrimaryRoles,
  },
  {
    slug: 'anzang',
    name: '安葬',
    icon: '/assets/image2/jieri/anzang.png',
    yiTerms: ['安葬', '破土', '启钻'],
    cautionTerms: ['重丧', '复日'],
    summary: '安葬择日更讲究稳妥，宜项、冲煞、方位和家属生肖都需要谨慎交叉核对。',
    personRoles: optionalPrimaryRoles,
  },
  {
    slug: 'qiming',
    name: '起名',
    icon: '/assets/image2/jieri/qiming.png',
    yiTerms: ['求嗣', '祈福', '纳采'],
    cautionTerms: ['月厌', '厌对'],
    summary: '起名相关日子可参考祈福、求嗣等宜项，姓名五行适合另行比较。',
    personRoles: optionalPrimaryRoles,
  },
  {
    slug: 'hehun',
    name: '合婚',
    icon: '/assets/image2/jieri/hehun.png',
    yiTerms: ['嫁娶', '纳采', '合帐'],
    cautionTerms: ['孤辰', '寡宿'],
    summary: '合婚择日关注婚嫁相关宜项，也要把双方生肖冲合与八字基础信息放在一起判断。',
    personRoles: marriageRoles,
  },
];

const jieriFaq: FaqItem[] = [
  {
    id: 'jieri-how',
    question: '吉日列表是怎么筛出来的？',
    answer: '场景宜项、当日吉凶、冲煞和值神都会参与判断。凶日不会被悄悄删除，会标成谨慎。',
  },
  {
    id: 'jieri-year',
    question: '为什么只把部分年份放进 sitemap？',
    answer: '2-5000 年的合法日期都能打开，但站点地图只收录当前年前后二十年的重点年份。',
  },
  {
    id: 'jieri-bad-day-match',
    question: '凶日如果命中宜项，还能算吉日吗？',
    answer: '不会直接算成上等吉日。这类日期会标为谨慎：它有场景宜项，但整日基调、冲煞或值神仍提醒保守。',
  },
  {
    id: 'jieri-hour-after-date',
    question: '日期和时辰哪个更重要？',
    answer: '日期决定整件事的大环境，时辰适合安排关键动作。若日期本身与事项严重相冲，只靠吉时不适合硬补。',
  },
  {
    id: 'jieri-zodiac',
    question: '生肖相冲在吉日筛选里怎么用？',
    answer: '生肖相冲适合做第二层过滤。若候选日冲到本人、伴侣、屋主或关键参与者，可以优先换到同月其他推荐日。',
  },
  {
    id: 'jieri-no-perfect',
    question: '如果没有完美吉日怎么办？',
    answer: '现实里常常没有所有条件都完美的日期。避开忌项和明显冲煞后，可以在可用日期里挑吉时，或把正式仪式和准备工作拆开。',
  },
  {
    id: 'jieri-scene-difference',
    question: '结婚、搬家、开业为什么不能用同一套吉日？',
    answer: '不同事项对应的宜项不同。结婚重嫁娶、纳采，搬家重入宅、移徙，开业重开市、交易、立券，所以要按场景筛选。',
  },
  {
    id: 'jieri-cultural-reference',
    question: '吉日查询能替代现实安排吗？',
    answer: '不能。吉日查询提供传统黄历参考，最终还要看场地档期、天气交通、家人时间、预算和相关法律手续。',
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
    description: '按结婚、搬家、开业、装修、签约、出行、安葬、起名、合婚等场景查询黄道吉日，呈现宜忌、冲煞和推荐理由。',
    h1: '黄道吉日查询',
    deck: '常见择日场景按年份整理，宜项命中、冲煞和凶日提醒都在列表里。',
    keywords: ['黄道吉日', '结婚吉日', '搬家吉日', '开业吉日', '择日查询'],
  }),
  body: '吉日查询要看场景、宜项、冲煞和避冲，别只挑一个红色日期。结婚、搬家、开业、装修、签约、出行、安葬、起名、合婚各有不同宜项，每日吉凶、冲煞、值神和生肖避冲也会一起呈现。推荐理由会说明这天适合在哪里，哪些日子虽然命中宜项但仍需谨慎。',
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
