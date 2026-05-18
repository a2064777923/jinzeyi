import { createLocalizedSeo } from './localize';
import type { ToolContent } from './types';

export const toolPages: ToolContent[] = [
  {
    id: 'tools-index',
    family: 'tool',
    slug: 'tools',
    path: '/tools',
    pageType: 'WebPage',
    toolKey: 'tools-index',
    inputFields: [],
    sitemap: true,
    seo: createLocalizedSeo({
      title: '命理工具｜八字排盘姓名五行｜今择易',
      description: '进入八字排盘、姓名五行查询等命理工具，结合黄历、吉日、生肖和风水内容使用。',
      h1: '命理工具',
      deck: '把需要输入资料的工具集中管理，让用户从黄历和内容页自然进入下一步分析。',
      keywords: ['八字排盘', '姓名五行', '命理工具', '黄历工具'],
    }),
    body: '工具入口用于承接黄历、生肖、吉日和风水内容里的进一步查询。Phase 3 先提供八字排盘和姓名五行两个基础工具：前者关注出生日期、精确时间、出生地和性别，输出四柱与五行分布；后者关注姓氏、名字和单字五行，给出基础评分与替换建议。所有工具都保持页面内容可索引，互动表单只是页面中的一部分。',
    faq: [
      {
        id: 'tools-why',
        question: '工具页和文章页有什么不同？',
        answer: '工具页有可输入的表单和结果区，文章页负责解释背景知识，两者通过内链互相补充。',
      },
      {
        id: 'tools-ai',
        question: '这些工具会直接给 AI 解读吗？',
        answer: 'Phase 3 只提供基础排盘和非个性化说明，AI 个性化解释会放到后续阶段。',
      },
    ],
    relatedLinks: [
      { href: '/tools/bazi', label: '八字排盘', description: '输入出生资料查看四柱。', family: 'tool' },
      { href: '/tools/naming', label: '姓名五行', description: '查看姓名五行与基础建议。', family: 'tool' },
    ],
    seed: {
      model: 'ContentPage',
      slug: 'tools',
      category: 'tools',
      localeStrategy: 'localized-seo-canonical-body',
    },
  },
  {
    id: 'tool-bazi',
    family: 'tool',
    slug: 'bazi',
    path: '/tools/bazi',
    pageType: 'WebApplication',
    toolKey: 'bazi',
    inputFields: ['birthDate', 'birthTime', 'birthPlace', 'gender'],
    sitemap: true,
    seo: createLocalizedSeo({
      title: '八字排盘｜日主十神藏干纳音查询｜今择易',
      description: '输入出生日期、精确时间、出生地和性别，查询四柱、日主、十神、藏干、纳音与五行强弱信号。',
      h1: '八字排盘',
      deck: '先把出生信息排成四柱，再查看日主、十神、藏干、纳音和五行强弱信号。',
      keywords: ['八字排盘', '四柱', '日主', '十神', '藏干', '纳音', '五行强弱'],
    }),
    body: '八字排盘工具的目标是先把专业盘面排清楚。用户输入出生日期、精确时间、出生地和性别后，页面会输出年柱、月柱、日柱、时柱，并进一步展示日主、十神、藏干、纳音、十二长生状态和五行强弱信号。本站把这些字段作为传统文化和方法参考，先说明盘面结构与字段来源，再让用户结合现实条件继续理解。',
    faq: [
      {
        id: 'bazi-fields',
        question: '八字排盘为什么需要出生地？',
        answer: '出生地用于中国城市真太阳时校正，尤其在精确时辰边界附近可以减少误差。',
      },
      {
        id: 'bazi-depth',
        question: '这里会直接判断喜用神吗？',
        answer: '不会。当前重点是把日主、十神、藏干、纳音和五行强弱信号展示清楚，喜用神等深层判断需要更多方法约束。',
      },
      {
        id: 'bazi-time',
        question: '不知道准确出生时间怎么办？',
        answer: '可以先用大致时段做参考，但时辰边界附近误差会影响时柱。重要用途建议尽量核对出生证明、家人记录或医院记录。',
      },
      {
        id: 'bazi-gender',
        question: '性别会影响当前排盘结果吗？',
        answer: '当前专业盘面主要来自出生日期、时间和地点。性别字段先保留给后续更完整的传统排盘层使用。',
      },
      {
        id: 'bazi-zodiac',
        question: '八字和生肖有什么区别？',
        answer: '生肖只看年支，八字会看年、月、日、时四柱。想理解个人信息时，八字比单看生肖更细，但也更需要准确资料。',
      },
      {
        id: 'bazi-date-use',
        question: '八字排盘能和择日一起用吗？',
        answer: '可以。先用排盘整理个人基础信息，再回到吉日和黄历详情页核对日期、冲煞和时辰，避免只看一个维度。',
      },
    ],
    relatedLinks: [
      { href: '/zodiac', label: '生肖查询', description: '先确认生肖与年份边界。', family: 'zodiac' },
      { href: '/knowledge/day-master', label: '日主解释', description: '理解为什么盘面以日主为参照。', family: 'knowledge' },
      { href: '/knowledge/ten-gods', label: '十神解释', description: '查看十神如何来自日主关系。', family: 'knowledge' },
      { href: '/knowledge/five-elements', label: '五行强弱', description: '理解表层计数与藏干加权。', family: 'knowledge' },
      { href: '/jieri/hehun/2026', label: '合婚吉日', description: '查看合婚相关吉日入口。', family: 'jieri' },
    ],
    seed: {
      model: 'BaZiProfile',
      slug: 'bazi',
      category: 'tools',
      localeStrategy: 'localized-seo-canonical-body',
    },
  },
  {
    id: 'tool-naming',
    family: 'tool',
    slug: 'naming',
    path: '/tools/naming',
    pageType: 'WebApplication',
    toolKey: 'naming',
    inputFields: ['surname', 'givenName'],
    sitemap: true,
    seo: createLocalizedSeo({
      title: '姓名五行查询｜名字吉凶基础分析｜今择易',
      description: '输入姓氏和名字，查看单字五行、基础评分、吉凶说明与替换建议。',
      h1: '姓名五行查询',
      deck: '从单字五行、读音和基础寓意入手，给出可继续斟酌的姓名参考。',
      keywords: ['姓名五行', '起名工具', '名字吉凶', '五行取名'],
    }),
    body: '姓名五行查询先处理最基础的问题：每个字大致归属什么五行，名字组合是否有明显偏枯，哪些替换字可以作为参考。Phase 3 不把名字和八字喜用神强行绑定，也不把评分包装成定论，而是用清楚的字义、五行和建议列表帮助用户继续筛选。后续若接入更深的八字分析，再把名字建议和出生信息合并判断。',
    faq: [
      {
        id: 'naming-score',
        question: '姓名评分能直接决定名字好坏吗？',
        answer: '不能。评分只是基础参考，仍要结合读音、字义、家族偏好和使用场景一起判断。',
      },
      {
        id: 'naming-bazi',
        question: '起名工具会结合八字喜用神吗？',
        answer: 'Phase 3 暂不结合喜用神，只做姓名五行和基础说明，避免过度推断。',
      },
    ],
    relatedLinks: [
      { href: '/tools/bazi', label: '八字排盘', description: '查看出生四柱与五行。', family: 'tool' },
      { href: '/jieri/qiming/2026', label: '起名吉日', description: '查看起名相关吉日入口。', family: 'jieri' },
    ],
    seed: {
      model: 'NamingRecord',
      slug: 'naming',
      category: 'tools',
      localeStrategy: 'localized-seo-canonical-body',
    },
  },
];

export function getToolPage(slug: string): ToolContent | undefined {
  return toolPages.find((page) => page.slug === slug || page.toolKey === slug);
}

