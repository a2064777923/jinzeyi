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
      title: '八字排盘｜四柱五行基础查询｜今择易',
      description: '输入出生日期、精确时间、出生地和性别，查询基础四柱、天干地支与五行分布。',
      h1: '八字排盘',
      deck: '先把出生信息排成四柱和五行分布，用作后续择日、合婚和命理说明的基础资料。',
      keywords: ['八字排盘', '四柱', '五行', '出生地真太阳时'],
    }),
    body: '八字排盘工具的目标是先把基础信息排清楚。用户输入出生日期、精确时间、出生地和性别后，页面会输出年柱、月柱、日柱、时柱，以及五行分布的基础结果。Phase 3 不做十神、格局、喜用神和大运流年等深层判断，而是把四柱数据作为文化参考和后续 AI 解释的可靠输入，避免在没有足够上下文时给出过度结论。',
    faq: [
      {
        id: 'bazi-fields',
        question: '八字排盘为什么需要出生地？',
        answer: '出生地用于中国城市真太阳时校正，尤其在精确时辰边界附近可以减少误差。',
      },
      {
        id: 'bazi-depth',
        question: 'Phase 3 会分析喜用神吗？',
        answer: '不会。当前只输出四柱、天干地支和五行分布，深层个性化解释留给后续 AI 阶段。',
      },
    ],
    relatedLinks: [
      { href: '/zodiac', label: '生肖查询', description: '先确认生肖与年份边界。', family: 'zodiac' },
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

