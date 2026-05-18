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
      deck: '八字、姓名、择日相关工具集中在这里，适合继续核对个人资料。',
      keywords: ['八字排盘', '姓名五行', '命理工具', '黄历工具'],
    }),
    body: '这里集中放置需要个人资料或姓名输入的工具。八字排盘整理出生日期、时间、地点和性别；姓名五行拆解名字里的五行与基础建议。结果适合做传统文化参考，不替代现实判断。',
    faq: [
      {
        id: 'tools-why',
        question: '工具页和文章页有什么不同？',
        answer: '工具页有可输入的表单和结果区，文章页负责解释背景知识，两者通过内链互相补充。',
      },
      {
        id: 'tools-ai',
        question: '有 AI 解读吗？',
        answer: '目前只提供基础排盘和非个性化说明，AI 个性化解释会放到后续阶段。',
      },
      {
        id: 'tools-when',
        question: '什么时候应该从黄历页跳到工具页？',
        answer: '当你已经找到候选日期，但还想结合个人出生信息、生肖边界或姓名五行继续核对时，就可以进入工具页。',
      },
      {
        id: 'tools-gender',
        question: '八字排盘为什么要填性别？',
        answer: '性别会影响部分传统排盘层；当前结果仍以出生时间和地点为主。',
      },
      {
        id: 'tools-limits',
        question: '工具结果能直接替我做决定吗？',
        answer: '不能。工具结果只整理传统民俗资料，不应替代现实判断、专业意见、法律手续和家庭沟通。',
      },
      {
        id: 'tools-next',
        question: '排完八字后下一步看什么？',
        answer: '四柱和五行完整后，可以拿候选日期去核对生肖、冲煞和时辰。',
      },
    ],
    relatedLinks: [
      { href: '/tools/bazi', label: '八字排盘', description: '输入出生资料排出四柱。', family: 'tool' },
      { href: '/tools/naming', label: '姓名五行', description: '姓名五行与基础建议。', family: 'tool' },
      { href: '/zodiac', label: '生肖查询', description: '确认生肖与地支边界。', family: 'zodiac' },
      { href: '/jieri', label: '吉日查询', description: '按事项场景筛选候选日期。', family: 'jieri' },
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
      description: '输入出生日期、精确时间和出生地，自动排出四柱、日主、十神、藏干、纳音与五行强弱。',
      h1: '八字排盘',
      deck: '输入出生资料，自动排出四柱命盘。',
      keywords: ['八字排盘', '四柱', '日主', '十神', '藏干', '纳音', '五行强弱'],
    }),
    body: '输入出生时间、地点和性别后，自动排出四柱、日主、十神、藏干、纳音、十二长生和五行强弱。所有结果都是传统文化参考，适合整理盘面，不替代现实判断。',
    faq: [
      {
        id: 'bazi-fields',
        question: '八字排盘为什么需要出生地？',
        answer: '出生地会参与中国城市真太阳时校正，尤其在精确时辰边界附近可以减少误差。',
      },
      {
        id: 'bazi-depth',
        question: '这里会直接判断喜用神吗？',
        answer: '不会。当前重点是把日主、十神、藏干、纳音和五行强弱信号展示清楚，喜用神等深层判断需要更多方法约束。',
      },
      {
        id: 'bazi-time',
        question: '不知道准确出生时间怎么办？',
        answer: '可以用大致时段作参考，但时辰边界附近误差会影响时柱。重要用途建议核对出生证明、家人记录或医院记录。',
      },
      {
        id: 'bazi-gender',
        question: '性别会影响当前排盘结果吗？',
        answer: '当前专业盘面主要来自出生日期、时间和地点。性别会影响部分传统推算层。',
      },
      {
        id: 'bazi-zodiac',
        question: '八字和生肖有什么区别？',
        answer: '生肖只看年支，八字会看年、月、日、时四柱。想理解个人信息时，八字比单看生肖更细，但也更需要准确资料。',
      },
      {
        id: 'bazi-date-use',
        question: '八字排盘能和择日一起用吗？',
        answer: '可以。八字能整理个人基础信息，吉日页能核对日期、冲煞和时辰，避免只看一个维度。',
      },
    ],
    relatedLinks: [
      { href: '/zodiac', label: '生肖查询', description: '确认生肖与年份边界。', family: 'zodiac' },
      { href: '/knowledge/day-master', label: '日主解释', description: '盘面为什么以日主为中心。', family: 'knowledge' },
      { href: '/knowledge/ten-gods', label: '十神解释', description: '十神来自日主关系。', family: 'knowledge' },
      { href: '/knowledge/five-elements', label: '五行强弱', description: '表层计数与藏干加权。', family: 'knowledge' },
      { href: '/jieri/hehun/2026', label: '合婚吉日', description: '合婚相关吉日入口。', family: 'jieri' },
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
      description: '输入姓氏和名字，得到单字五行、基础评分、吉凶说明与替换建议。',
      h1: '姓名五行查询',
      deck: '从单字五行、读音和基础寓意入手，给出可继续斟酌的姓名参考。',
      keywords: ['姓名五行', '起名工具', '名字吉凶', '五行取名'],
    }),
    body: '姓名五行查询回答几个基础问题：每个字大致归属什么五行，名字组合是否有明显偏枯，哪些替换字可以作为参考。这里不把名字和八字喜用神强行绑定，也不把评分包装成定论。',
    faq: [
      {
        id: 'naming-score',
        question: '姓名评分能直接决定名字好坏吗？',
        answer: '不能。评分只是基础参考，仍要结合读音、字义、家族偏好和使用场景一起判断。',
      },
      {
        id: 'naming-bazi',
        question: '起名会结合八字喜用神吗？',
        answer: '暂不结合喜用神，只做姓名五行和基础说明，避免过度推断。',
      },
      {
        id: 'naming-meaning',
        question: '名字只看五行就够吗？',
        answer: '不够。五行只是一个参考层，名字还要看读音、字义、书写、家族偏好、地区语言习惯和实际使用场景。',
      },
      {
        id: 'naming-score-limit',
        question: '评分高的名字就更好吗？',
        answer: '未必。评分只帮助排序和发现明显问题，不适合替代父母的真实偏好、字义审美和长期使用感受。',
      },
      {
        id: 'naming-rare-characters',
        question: '起名适合用生僻字吗？',
        answer: '要谨慎。生僻字可能影响证件录入、学校点名、银行系统和日常沟通。即使寓意好，也要考虑长期使用成本。',
      },
      {
        id: 'naming-qiming-date',
        question: '起名需要看吉日吗？',
        answer: '命名、登记、祈福和宴请可以分开看。若重视仪式，可以到起名吉日核对求嗣、祈福等相关宜项。',
      },
    ],
    relatedLinks: [
      { href: '/tools/bazi', label: '八字排盘', description: '出生四柱与五行。', family: 'tool' },
      { href: '/jieri/qiming/2026', label: '起名吉日', description: '起名相关吉日入口。', family: 'jieri' },
      { href: '/zodiac', label: '生肖查询', description: '确认生肖年份与地支关系。', family: 'zodiac' },
      { href: '/calendar', label: '月历吉凶', description: '比较命名、登记或宴请日期。', family: 'core' },
    ],
    seed: {
      model: 'NamingRecord',
      slug: 'naming',
      category: 'tools',
      localeStrategy: 'localized-seo-canonical-body',
    },
  },
  {
    id: 'tool-jieri-recommend',
    family: 'tool',
    slug: 'jieri-recommend',
    path: '/tools/jieri-recommend',
    pageType: 'WebApplication',
    toolKey: 'jieri-recommend',
    inputFields: ['scene', 'people', 'dateRange'],
    sitemap: true,
    seo: createLocalizedSeo({
      title: '推荐日期｜结婚搬家开业个性化择日｜今择易',
      description: '输入参与者出生资料和日期范围，筛出更适合结婚、搬家、开业、签约等安排的日期。',
      h1: '推荐日期',
      deck: '把更合适的日子排到前面，理由和提醒一起展开。',
      keywords: ['推荐日期', '个性化择日', '结婚择日', '搬家择日', '开业择日'],
    }),
    body: '适合结婚、搬家、开业、签约等需要多方确认的日期。一张卡同时呈现黄历基调、事项匹配、生肖冲煞、八字五行和可用吉时，方便比较取舍。',
    faq: [
      {
        id: 'jieri-recommend-privacy',
        question: '出生资料会被保存吗？',
        answer: '不会。出生资料只在本次查询中参与计算，不新增账号、数据库记录或 AI API 请求。',
      },
      {
        id: 'jieri-recommend-score',
        question: '分数代表什么？',
        answer: '分数只帮助排序和解释传统参考维度，不代表现实结果。重要事项仍要结合场地、合同、天气、交通和家人时间。',
      },
      {
        id: 'jieri-recommend-range',
        question: '为什么日期范围最多 90 天？',
        answer: '范围太长会稀释重点。30 到 90 天更适合做第一轮候选。',
      },
    ],
    relatedLinks: [
      { href: '/jieri', label: '吉日查询', description: '年度场景吉日列表。', family: 'jieri' },
      { href: '/tools/bazi', label: '八字排盘', description: '四柱、日主和五行强弱。', family: 'tool' },
      { href: '/knowledge/yi-ji', label: '宜忌解释', description: '理解事项匹配维度。', family: 'knowledge' },
      { href: '/knowledge/five-elements', label: '五行解释', description: '理解八字五行维度。', family: 'knowledge' },
    ],
    seed: {
      model: 'ContentPage',
      slug: 'jieri-recommend',
      category: 'tools',
      localeStrategy: 'localized-seo-canonical-body',
    },
  },
];

export function getToolPage(slug: string): ToolContent | undefined {
  return toolPages.find((page) => page.slug === slug || page.toolKey === slug);
}
