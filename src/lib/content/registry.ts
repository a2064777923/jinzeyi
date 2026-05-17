import { fengShuiIndexPage } from './feng-shui';
import { jieriIndexPage } from './jieri-scenes';
import { toolPages } from './tools';
import type { IndexablePage } from './types';
import { zodiacHubPages, zodiacIndexPage } from './zodiac';

export const coreIndexablePages: IndexablePage[] = [
  {
    id: 'home',
    family: 'core',
    slug: 'home',
    path: '/',
    pageType: 'WebSite',
    sitemap: true,
    seo: {
      zhHans: {
        title: '今日黄历｜今择易',
        description: '查询今日黄历、农历、宜忌、吉时凶时、月历吉日凶日与二十四节气。',
        h1: '今日黄历',
        deck: '先看今日宜忌、时辰吉凶和月历入口，再进入具体日期或择日工具。',
        keywords: ['今日黄历', '黄历', '择日', '今择易'],
      },
      zhHant: {
        title: '今日黃曆｜今擇易',
        description: '查詢今日黃曆、農曆、宜忌、吉時凶時、月曆吉日凶日與二十四節氣。',
        h1: '今日黃曆',
        deck: '先看今日宜忌、時辰吉凶和月曆入口，再進入具體日期或擇日工具。',
        keywords: ['今日黃曆', '黃曆', '擇日', '今擇易'],
      },
    },
    body: '首页是今择易的黄历入口，集中呈现今日公历、农历、干支、生肖、宜忌、冲煞、方位和时辰吉凶。用户可以先快速判断今天适合做什么，再通过日期搜索、月历、节气和后续吉日工具进入更细的场景。首页内容必须保持服务端可渲染，让搜索引擎和用户都能直接看到核心信息。',
    faq: [
      {
        id: 'home-today',
        question: '首页黄历每天都会更新吗？',
        answer: '首页按当前日期生成今日黄历信息，并链接到完整日期详情和月历入口。',
      },
      {
        id: 'home-tools',
        question: '首页和择日工具是什么关系？',
        answer: '首页适合看今天，择日工具适合按结婚、搬家、开业等场景筛选某一年的吉日。',
      },
    ],
    relatedLinks: [
      { href: '/calendar', label: '月历', description: '按月浏览每日吉凶。', family: 'core' },
      { href: '/jieri', label: '吉日查询', description: '按场景查询年度吉日。', family: 'jieri' },
    ],
    seed: {
      model: 'ContentPage',
      slug: 'home',
      category: 'core',
      localeStrategy: 'per-locale-row',
    },
  },
  {
    id: 'calendar',
    family: 'core',
    slug: 'calendar',
    path: '/calendar',
    pageType: 'WebPage',
    sitemap: true,
    seo: {
      zhHans: {
        title: '月历吉日凶日查询｜今择易',
        description: '按月查看每日吉凶、农历、节气、值神和宜忌摘要，快速进入完整黄历详情。',
        h1: '月历',
        deck: '把一个月里的吉日、凶日、节气和每日宜忌放进同一张表，方便连续比较。',
        keywords: ['月历', '吉日', '凶日', '农历'],
      },
      zhHant: {
        title: '月曆吉日凶日查詢｜今擇易',
        description: '按月查看每日吉凶、農曆、節氣、值神和宜忌摘要，快速進入完整黃曆詳情。',
        h1: '月曆',
        deck: '把一個月裡的吉日、凶日、節氣和每日宜忌放進同一張表，方便連續比較。',
        keywords: ['月曆', '吉日', '凶日', '農曆'],
      },
    },
    body: '月历页面适合在同一个月份里连续比较多个日期。它把公历、农历、节气、吉凶、值神和宜忌摘要压缩在一个视图中，让用户先找出可进一步查看的日期，再进入完整黄历详情核对冲煞、神位和时辰。后续吉日场景页也会复用这种按月分组和快速跳转的阅读方式。',
    faq: [
      {
        id: 'calendar-how',
        question: '月历里的吉日可以直接使用吗？',
        answer: '月历适合初步筛选，具体事项仍建议进入详情页查看完整宜忌、冲煞和时辰。',
      },
      {
        id: 'calendar-terms',
        question: '月历会显示节气吗？',
        answer: '会。遇到二十四节气的日期会在日期格中显示节气信息。',
      },
    ],
    relatedLinks: [
      { href: '/', label: '今日黄历', description: '回到今日黄历入口。', family: 'core' },
      { href: '/solar-terms', label: '二十四节气', description: '查看全年节气。', family: 'core' },
    ],
    seed: {
      model: 'ContentPage',
      slug: 'calendar',
      category: 'core',
      localeStrategy: 'per-locale-row',
    },
  },
  {
    id: 'solar-terms',
    family: 'core',
    slug: 'solar-terms',
    path: '/solar-terms',
    pageType: 'WebPage',
    sitemap: true,
    seo: {
      zhHans: {
        title: '二十四节气查询｜今择易',
        description: '按四季查看二十四节气日期、含义和传统习俗，连接黄历与月历。',
        h1: '二十四节气',
        deck: '按春夏秋冬整理节气，帮助用户理解日期背后的节令变化。',
        keywords: ['二十四节气', '节气查询', '农历', '黄历'],
      },
      zhHant: {
        title: '二十四節氣查詢｜今擇易',
        description: '按四季查看二十四節氣日期、含義和傳統習俗，連接黃曆與月曆。',
        h1: '二十四節氣',
        deck: '按春夏秋冬整理節氣，幫助用戶理解日期背後的節令變化。',
        keywords: ['二十四節氣', '節氣查詢', '農曆', '黃曆'],
      },
    },
    body: '节气页面负责把一年里的节令节点讲清楚。用户可以按春、夏、秋、冬查看二十四节气的日期、含义和习俗，再回到月历或每日黄历理解具体日期。节气不是单独的装饰信息，它会影响用户对季节、农事、养生和传统节令的理解，也为后续内容页提供自然的内部链接。',
    faq: [
      {
        id: 'terms-count',
        question: '二十四节气分为几类？',
        answer: '通常按春、夏、秋、冬四季整理，也可区分节令节点和中气节点。',
      },
      {
        id: 'terms-calendar',
        question: '节气和黄历有什么关系？',
        answer: '节气标记太阳运行与季节变化，黄历页面会把节气和当日宜忌放在一起显示。',
      },
    ],
    relatedLinks: [
      { href: '/calendar', label: '月历', description: '查看节气所在月份。', family: 'core' },
      { href: '/jieri', label: '吉日查询', description: '按场景继续择日。', family: 'jieri' },
    ],
    seed: {
      model: 'ContentPage',
      slug: 'solar-terms',
      category: 'core',
      localeStrategy: 'per-locale-row',
    },
  },
];

const indexableRoutes: IndexablePage[] = [
  ...coreIndexablePages,
  jieriIndexPage,
  zodiacIndexPage,
  ...zodiacHubPages,
  fengShuiIndexPage,
  ...toolPages,
];

export function getIndexableRoutes(): IndexablePage[] {
  return [...indexableRoutes];
}

export function getRouteByPath(path: string): IndexablePage | undefined {
  return indexableRoutes.find((route) => route.path === path);
}

export function getSitemapCandidates(): IndexablePage[] {
  return indexableRoutes.filter((route) => route.sitemap);
}

export { fengShuiCategories, fengShuiIndexPage } from './feng-shui';
export { getJieriScene, jieriIndexPage, jieriScenes } from './jieri-scenes';
export { getToolPage, toolPages } from './tools';
export type {
  ArticleContent,
  BreadcrumbItem,
  FaqItem,
  IndexablePage,
  InternalLink,
  LocaleCode,
  LocaleSeoFields,
  LocalizedSeo,
  ToolContent,
} from './types';
export { getZodiacAnimal, zodiacAnimals, zodiacHubPages, zodiacIndexPage } from './zodiac';

