import { fengShuiArticles, fengShuiIndexPage } from './feng-shui';
import { jieriIndexPage } from './jieri-scenes';
import { knowledgeIndexPage, metaphysicsEntries } from './metaphysics';
import { toolPages } from './tools';
import type { IndexablePage } from './types';
import { zodiacArticles, zodiacHubPages, zodiacIndexPage } from './zodiac';

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
        deck: '今日宜忌、时辰吉凶和月历入口集中呈现。',
        keywords: ['今日黄历', '黄历', '择日', '今择易'],
      },
      zhHant: {
        title: '今日黃曆｜今擇易',
        description: '查詢今日黃曆、農曆、宜忌、吉時凶時、月曆吉日凶日與二十四節氣。',
        h1: '今日黃曆',
        deck: '今日宜忌、時辰吉凶和月曆入口集中呈現。',
        keywords: ['今日黃曆', '黃曆', '擇日', '今擇易'],
      },
    },
    body: '首页集中呈现今日公历、农历、干支、生肖、宜忌、冲煞、方位和时辰吉凶。想知道今天适合做什么，可以从今日概览进入日期搜索、月历、节气和吉日场景。',
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
      {
        id: 'home-bad-day-yi',
        question: '为什么凶日里也会出现很多宜事？',
        answer: '整日吉凶看当天总体气象，宜忌看具体事项。凶日仍可能适合祭祀、整理、出行等小事，但婚嫁、入宅、开业这类大事还要核对场景吉日、冲煞和时辰。',
      },
      {
        id: 'home-lucky-hours',
        question: '吉时占一半，为什么整天还可能是凶？',
        answer: '吉时只是一天里的十二个时段分布，不会直接把整日改判为吉。整日吉凶还会参考值神、神煞和日课，所以要把“今天基调”和“具体几点做事”分开读。',
      },
      {
        id: 'home-chong-sha',
        question: '首页的冲煞要怎么理解？',
        answer: '冲煞提醒今天与某个地支或生肖关系较紧，煞方提示某个方向不宜硬碰。日常小事不必紧张，搬家、动土、安床、开业这类大事再重点核对。',
      },
      {
        id: 'home-pick-date',
        question: '我想办一件大事，应该从哪里开始？',
        answer: '进入吉日查询按场景筛选，打开候选日期的完整黄历，核对宜忌、本人或家人生肖避冲，再挑较合适的时辰。',
      },
      {
        id: 'home-reference-only',
        question: '这些内容可以当成决定依据吗？',
        answer: '不建议单独当成决定依据。今择易把黄历作为传统民俗和文化参考呈现，重要安排仍要结合现实条件、法律要求、家人时间和专业意见。',
      },
    ],
    relatedLinks: [
      { href: '/calendar', label: '月历', description: '按月浏览每日吉凶。', family: 'core' },
      { href: '/jieri', label: '吉日查询', description: '按场景查询年度吉日。', family: 'jieri' },
      { href: '/zodiac', label: '生肖查询', description: '核对生肖与冲煞关系。', family: 'zodiac' },
      { href: '/tools/bazi', label: '八字排盘', description: '用出生资料排出四柱。', family: 'tool' },
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
        description: '按月浏览每日吉凶、农历、节气、值神和宜忌摘要，快速进入完整黄历详情。',
        h1: '月历',
        deck: '把一个月里的吉日、凶日、节气和每日宜忌放进同一张表，方便连续比较。',
        keywords: ['月历', '吉日', '凶日', '农历'],
      },
      zhHant: {
        title: '月曆吉日凶日查詢｜今擇易',
        description: '按月瀏覽每日吉凶、農曆、節氣、值神和宜忌摘要，快速進入完整黃曆詳情。',
        h1: '月曆',
        deck: '把一個月裡的吉日、凶日、節氣和每日宜忌放進同一張表，方便連續比較。',
        keywords: ['月曆', '吉日', '凶日', '農曆'],
      },
    },
    body: '月历适合在同一个月份里连续比较多个日期。公历、农历、节气、吉凶、值神和宜忌摘要集中在一个视图中，适合快速找出候选日，再打开完整黄历核对冲煞、神位和时辰。',
    faq: [
      {
        id: 'calendar-how',
        question: '月历里的吉日可以直接使用吗？',
        answer: '月历适合初步筛选，具体事项仍建议打开详情页核对完整宜忌、冲煞和时辰。',
      },
      {
        id: 'calendar-terms',
        question: '月历会显示节气吗？',
        answer: '会。遇到二十四节气的日期会在日期格中显示节气信息。',
      },
      {
        id: 'calendar-color',
        question: '月历颜色代表什么？',
        answer: '每日吉凶颜色帮你快速判断哪些日子值得点开。节气和值神标签提供辅助信息，完整宜忌、冲煞和时辰在详情页核对。',
      },
      {
        id: 'calendar-many-choices',
        question: '同一个月有多个吉日怎么选？',
        answer: '排除忌项直接命中的日期，避开冲到本人或家人生肖的日期。剩下的日子可继续比较吉时、交通安排、场地档期和参与者时间。',
      },
      {
        id: 'calendar-ominous-use',
        question: '凶日完全不能办事吗？',
        answer: '不用一概而论。凶日更适合把事情拆小、做准备或处理不关键的步骤。若事项正好出现在忌项里，或涉及入宅、开业、动土等大动作，就建议换日。',
      },
      {
        id: 'calendar-date-search',
        question: '能不能查很久以前或很久以后的日期？',
        answer: '日期查询支持公元 2 年到 5000 年之间的合法日期。站点地图只收录当前年前后二十年的重点吉日。',
      },
      {
        id: 'calendar-compare',
        question: '月历和黄历详情有什么区别？',
        answer: '月历适合横向比较一整月，详情页适合纵向读某一天。真正择日时，通常先用月历筛日期，再用详情页确认冲煞、神位和时辰。',
      },
    ],
    relatedLinks: [
      { href: '/', label: '今日黄历', description: '回到今日黄历入口。', family: 'core' },
      { href: '/solar-terms', label: '二十四节气', description: '全年节气日期。', family: 'core' },
      { href: '/jieri', label: '吉日查询', description: '按结婚、搬家、开业等场景继续筛。', family: 'jieri' },
      { href: '/zodiac', label: '生肖避冲', description: '看冲煞时先确认生肖地支。', family: 'zodiac' },
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
        description: '按四季整理二十四节气日期、含义和传统习俗，连接黄历与月历。',
        h1: '二十四节气',
        deck: '按春夏秋冬整理节气，看懂日期背后的节令变化。',
        keywords: ['二十四节气', '节气查询', '农历', '黄历'],
      },
      zhHant: {
        title: '二十四節氣查詢｜今擇易',
        description: '按四季整理二十四節氣日期、含義和傳統習俗，連接黃曆與月曆。',
        h1: '二十四節氣',
        deck: '按春夏秋冬整理節氣，看懂日期背後的節令變化。',
        keywords: ['二十四節氣', '節氣查詢', '農曆', '黃曆'],
      },
    },
    body: '二十四节气按春、夏、秋、冬整理，日期、含义和习俗集中呈现。看懂节令节点后，再回到月历或每日黄历理解具体日期。',
    faq: [
      {
        id: 'terms-count',
        question: '二十四节气分为几类？',
        answer: '通常按春、夏、秋、冬四季整理，也可区分节令节点和中气节点。',
      },
      {
        id: 'terms-calendar',
        question: '节气和黄历有什么关系？',
        answer: '节气标记太阳运行与季节变化，黄历详情会同时呈现节气和当日宜忌。',
      },
      {
        id: 'terms-date-change',
        question: '为什么每年节气日期会有细微变化？',
        answer: '二十四节气按太阳运行位置推算，落到公历日期时通常在相邻一两天内浮动。每年的具体日期会自动更新，不用套用固定口诀。',
      },
      {
        id: 'terms-jie-qi',
        question: '“节”和“气”有什么区别？',
        answer: '传统上二十四节气交替分为节与中气，用来标记月令和季节变化。按四季理解即可，不必一开始就背术语。',
      },
      {
        id: 'terms-practical',
        question: '节气适合怎么看？',
        answer: '适合理解季节节点，比如清明、立夏、冬至所在日期，再回到月历和黄历详情核对当天宜忌。',
      },
      {
        id: 'terms-mobile',
        question: '手机上怎么快速看四季？',
        answer: '顶部有四季快速跳转，移动端可横向滑动节气卡片；需要具体日子时，回到月历确认日期。',
      },
      {
        id: 'terms-customs',
        question: '节气习俗可以直接当养生建议吗？',
        answer: '不建议直接当成医疗或养生建议。节气习俗属于民俗和文化阅读，饮食、运动和健康问题仍应结合个人身体状况和专业意见。',
      },
    ],
    relatedLinks: [
      { href: '/calendar', label: '月历', description: '节气所在月份。', family: 'core' },
      { href: '/jieri', label: '吉日查询', description: '按场景继续择日。', family: 'jieri' },
      { href: '/', label: '今日黄历', description: '回到今日日期与宜忌。', family: 'core' },
      { href: '/feng-shui', label: '风水知识', description: '把节令、空间和动工场景连起来看。', family: 'feng-shui' },
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
  ...zodiacArticles,
  fengShuiIndexPage,
  ...fengShuiArticles,
  ...toolPages,
  knowledgeIndexPage,
  ...metaphysicsEntries,
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

export {
  fengShuiArticles,
  fengShuiCategories,
  fengShuiIndexPage,
  getFengShuiArticle,
  getFengShuiArticlesByCategory,
  getFengShuiCategory,
} from './feng-shui';
export { getJieriScene, jieriIndexPage, jieriScenes } from './jieri-scenes';
export {
  getMetaphysicsCategories,
  getMetaphysicsCategory,
  getMetaphysicsEntries,
  getMetaphysicsEntriesByCategory,
  getMetaphysicsEntry,
  knowledgeIndexPage,
  metaphysicsCategories,
  metaphysicsEntries,
} from './metaphysics';
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
  MetaphysicsCategory,
  MetaphysicsEntry,
  ToolContent,
} from './types';
export {
  getZodiacAnimal,
  getZodiacArticle,
  getZodiacArticlesForAnimal,
  getZodiacProfile,
  zodiacAnimals,
  zodiacArticles,
  zodiacHubPages,
  zodiacIndexPage,
} from './zodiac';
