import { createLocalizedSeo } from './localize';
import type { IndexablePage, InternalLink } from './types';

export interface ZodiacAnimal {
  slug: string;
  animal: string;
  earthlyBranch: string;
  elementHint: string;
  years: number[];
  traits: string[];
}

export const zodiacAnimals: ZodiacAnimal[] = [
  { slug: 'rat', animal: '鼠', earthlyBranch: '子', elementHint: '水', years: [1960, 1972, 1984, 1996, 2008, 2020], traits: ['机敏', '善察', '重机会'] },
  { slug: 'ox', animal: '牛', earthlyBranch: '丑', elementHint: '土', years: [1961, 1973, 1985, 1997, 2009, 2021], traits: ['稳重', '耐心', '重承诺'] },
  { slug: 'tiger', animal: '虎', earthlyBranch: '寅', elementHint: '木', years: [1962, 1974, 1986, 1998, 2010, 2022], traits: ['果断', '主动', '有担当'] },
  { slug: 'rabbit', animal: '兔', earthlyBranch: '卯', elementHint: '木', years: [1963, 1975, 1987, 1999, 2011, 2023], traits: ['温和', '细腻', '重分寸'] },
  { slug: 'dragon', animal: '龙', earthlyBranch: '辰', elementHint: '土', years: [1964, 1976, 1988, 2000, 2012, 2024], traits: ['开阔', '自信', '重格局'] },
  { slug: 'snake', animal: '蛇', earthlyBranch: '巳', elementHint: '火', years: [1965, 1977, 1989, 2001, 2013, 2025], traits: ['谨慎', '洞察', '重判断'] },
  { slug: 'horse', animal: '马', earthlyBranch: '午', elementHint: '火', years: [1966, 1978, 1990, 2002, 2014, 2026], traits: ['爽朗', '行动快', '重自由'] },
  { slug: 'goat', animal: '羊', earthlyBranch: '未', elementHint: '土', years: [1967, 1979, 1991, 2003, 2015, 2027], traits: ['柔和', '顾全', '重关系'] },
  { slug: 'monkey', animal: '猴', earthlyBranch: '申', elementHint: '金', years: [1968, 1980, 1992, 2004, 2016, 2028], traits: ['灵活', '好学', '重变化'] },
  { slug: 'rooster', animal: '鸡', earthlyBranch: '酉', elementHint: '金', years: [1969, 1981, 1993, 2005, 2017, 2029], traits: ['清楚', '守序', '重细节'] },
  { slug: 'dog', animal: '狗', earthlyBranch: '戌', elementHint: '土', years: [1970, 1982, 1994, 2006, 2018, 2030], traits: ['忠厚', '警觉', '重原则'] },
  { slug: 'pig', animal: '猪', earthlyBranch: '亥', elementHint: '水', years: [1971, 1983, 1995, 2007, 2019, 2031], traits: ['宽和', '实在', '重福气'] },
];

const zodiacLinks: InternalLink[] = [
  { href: '/jieri', label: '吉日查询', description: '按生肖避冲筛选重要日子。', family: 'jieri' },
  { href: '/tools/bazi', label: '八字排盘', description: '用出生时间查看四柱与五行。', family: 'tool' },
];

export const zodiacIndexPage: IndexablePage = {
  id: 'zodiac-index',
  family: 'zodiac',
  slug: 'zodiac',
  path: '/zodiac',
  pageType: 'WebPage',
  sitemap: true,
  seo: createLocalizedSeo({
    title: '十二生肖查询｜生肖年份性格配对｜今择易',
    description: '查询十二生肖年份、地支、五行提示、性格关键词、配对关系和相关择日入口。',
    h1: '十二生肖查询',
    deck: '从生肖年份、地支五行和性格关键词切入，再连接吉日、合婚和八字工具。',
    keywords: ['十二生肖', '生肖年份', '生肖配对', '生肖性格'],
  }),
  body: '生肖内容页承担两个作用：一是让用户快速确认自己的生肖、地支和常见年份，二是把生肖冲合放回择日场景里使用。今择易不会把生肖写成绝对判断，而是把它作为民俗语境中的参考维度，配合黄历宜忌、冲煞、八字排盘与吉日列表，帮助用户更清楚地理解哪些日子适合推进，哪些日子应该多看一层理由。',
  faq: [
    {
      id: 'zodiac-year',
      question: '生肖年份按农历还是公历？',
      answer: '传统生肖以农历岁次为准，实际查询时要留意立春和春节附近的年份边界。',
    },
    {
      id: 'zodiac-use',
      question: '生肖能直接决定吉日吗？',
      answer: '生肖适合用来检查冲合关系，但不能单独决定吉凶，仍要结合当日宜忌、冲煞和具体场景。',
    },
  ],
  relatedLinks: zodiacLinks,
  seed: {
    model: 'ContentPage',
    slug: 'zodiac',
    category: 'zodiac',
    localeStrategy: 'localized-seo-canonical-body',
  },
};

export const zodiacHubPages: IndexablePage[] = zodiacAnimals.map((animal) => ({
  id: `zodiac-${animal.slug}`,
  family: 'zodiac',
  slug: animal.slug,
  path: `/zodiac/${animal.slug}`,
  pageType: 'WebPage',
  sitemap: true,
  seo: createLocalizedSeo({
    title: `属${animal.animal}生肖查询｜年份性格配对｜今择易`,
    description: `查看属${animal.animal}的年份、地支${animal.earthlyBranch}、五行${animal.elementHint}、性格关键词和相关吉日工具入口。`,
    h1: `属${animal.animal}生肖`,
    deck: `围绕${animal.earthlyBranch}${animal.animal}的年份、性格关键词和择日避冲线索，整理成可继续查询的生肖入口。`,
    keywords: [`属${animal.animal}`, `${animal.animal}年`, '生肖配对', '生肖运势'],
  }),
  body: `属${animal.animal}对应地支${animal.earthlyBranch}，常见关键词可以从${animal.traits.join('、')}几个角度理解。生肖页面不会把性格写成绝对结论，而是把年份、地支、五行提示和择日避冲放在一起，方便用户先确认基础信息，再进入吉日、合婚或八字工具继续查看。若要安排结婚、搬家、开业等事项，建议把生肖冲煞当作筛选条件之一，而不是唯一依据。`,
  faq: [
    {
      id: `${animal.slug}-years`,
      question: `属${animal.animal}常见年份有哪些？`,
      answer: `常见年份包括 ${animal.years.join('、')} 等，春节和立春附近出生的人需要进一步核对农历岁次。`,
    },
    {
      id: `${animal.slug}-jieri`,
      question: `属${animal.animal}选吉日要看什么？`,
      answer: `先看具体场景的宜项，再检查当日是否冲${animal.animal}或冲相关家人生肖，最后结合完整黄历与时辰。`,
    },
  ],
  relatedLinks: zodiacLinks,
  seed: {
    model: 'ZodiacProfile',
    slug: animal.slug,
    category: 'zodiac',
    localeStrategy: 'localized-seo-canonical-body',
  },
}));

export function getZodiacAnimal(slug: string): ZodiacAnimal | undefined {
  return zodiacAnimals.find((animal) => animal.slug === slug);
}

