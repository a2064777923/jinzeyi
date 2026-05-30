import { createLocalizedSeo, localizeBodyCopy } from './localize';
import type {
  InternalLink,
  IndexablePage,
  LocaleCode,
  MetaphysicsCategory,
  MetaphysicsEntry,
} from './types';

export interface MetaphysicsCategoryMeta {
  key: MetaphysicsCategory;
  label: string;
  description: string;
}

export const metaphysicsCategories: MetaphysicsCategoryMeta[] = [
  {
    key: 'bazi',
    label: '八字命理',
    description: '围绕四柱、日主、十神、藏干、纳音和强弱信号整理排盘语言。',
  },
  {
    key: 'almanac',
    label: '黄历择日',
    description: '解释宜忌、冲煞、吉时和择日评分里常出现的判断层。',
  },
  {
    key: 'five-elements',
    label: '五行系统',
    description: '把木火土金水作为传统分类语言来理解季节、方位、性情和工具提示。',
  },
  {
    key: 'stars',
    label: '星宿神话',
    description: '连接二十八宿、周天星斗、星官故事和未来星曜内容。',
  },
  {
    key: 'zi-wei',
    label: '紫微斗数',
    description: '为未来命盘、星曜、宫位和四化内容预留清晰入口。',
  },
  {
    key: 'cosmology',
    label: '术数宇宙观',
    description: '说明干支、周天、阴阳和历法如何成为各类工具的共同底层语言。',
  },
];

interface EntryInput {
  slug: string;
  category: MetaphysicsCategory;
  name: string;
  short: string;
  detail: string;
  practicalUse: string;
  relatedTerms: string[];
  toolAppearances: string[];
  mythologyStory: string;
  commonMisunderstandings: string[];
  sourceNotes: string[];
  chartHint?: string;
  starPersonalityMetaphor?: string;
  keywords: string[];
}

function categoryLabel(category: MetaphysicsCategory): string {
  return metaphysicsCategories.find((item) => item.key === category)?.label ?? '命理知识';
}

function categoryLinks(category: MetaphysicsCategory): InternalLink[] {
  if (category === 'bazi') {
    return [
      { href: '/tools/bazi', label: '八字排盘', description: '把出生资料整理成四柱与专业盘面。', family: 'tool' },
      { href: '/knowledge', label: '命理知识库', description: '继续查日主、十神、藏干等术语。', family: 'knowledge' },
      { href: '/jieri', label: '吉日查询', description: '把个人盘面和择日场景分开参考。', family: 'jieri' },
    ];
  }

  if (category === 'almanac') {
    return [
      { href: '/calendar', label: '月历', description: '连续比较每日宜忌、冲煞和时辰。', family: 'core' },
      { href: '/jieri', label: '吉日查询', description: '按事项场景筛选候选日期。', family: 'jieri' },
      { href: '/knowledge', label: '命理知识库', description: '理解择日名词背后的判断层。', family: 'knowledge' },
    ];
  }

  if (category === 'five-elements') {
    return [
      { href: '/tools/bazi', label: '八字五行', description: '出生四柱里的五行分布。', family: 'tool' },
      { href: '/tools/naming', label: '姓名五行', description: '用名字单字五行做基础参考。', family: 'tool' },
      { href: '/knowledge', label: '命理知识库', description: '继续查五行和相关术语。', family: 'knowledge' },
    ];
  }

  return [
    { href: '/knowledge', label: '命理知识库', description: '浏览星宿、紫微斗数和周天故事。', family: 'knowledge' },
    { href: '/tools/bazi', label: '八字排盘', description: '用个人四柱理解术数语言。', family: 'tool' },
    { href: '/jieri', label: '吉日查询', description: '回到可执行的择日场景。', family: 'jieri' },
  ];
}

function buildBody(input: EntryInput): string {
  return [
    input.detail,
    `实用读法：${input.practicalUse}`,
    `文化故事：${input.mythologyStory}`,
    `常见误读：${input.commonMisunderstandings.join('；')}`,
    `来源提示：${input.sourceNotes.join('；')}`,
  ].join('\n\n');
}

function buildEntry(input: EntryInput): MetaphysicsEntry {
  const entryPath = `/knowledge/${input.slug}`;
  const label = categoryLabel(input.category);
  const body = buildBody(input);

  return {
    id: `knowledge-${input.slug}`,
    family: 'knowledge',
    slug: input.slug,
    path: entryPath,
    pageType: 'Article',
    sitemap: true,
    category: input.category,
    categoryLabel: label,
    name: input.name,
    short: input.short,
    detail: input.detail,
    practicalUse: input.practicalUse,
    relatedTerms: input.relatedTerms,
    toolAppearances: input.toolAppearances,
    mythologyStory: input.mythologyStory,
    commonMisunderstandings: input.commonMisunderstandings,
    sourceNotes: input.sourceNotes,
    chartHint: input.chartHint,
    starPersonalityMetaphor: input.starPersonalityMetaphor,
    linkLabel: '完整知识页',
    seo: createLocalizedSeo({
      title: `${input.name}是什么意思｜${label}｜今择易`,
      description: `${input.short}今择易用文化参考方式解释${input.name}的用法、相关术语、故事背景和常见误读。`,
      h1: input.name,
      deck: input.short,
      keywords: input.keywords,
    }),
    body,
    faq: [
      {
        id: `${input.slug}-use`,
        question: `${input.name}在今择易里怎么用？`,
        answer: input.practicalUse,
      },
      {
        id: `${input.slug}-care`,
        question: `阅读${input.name}时要注意什么？`,
        answer: input.commonMisunderstandings[0],
      },
    ],
    relatedLinks: categoryLinks(input.category),
    breadcrumbs: [
      { name: '首页', href: '/' },
      { name: '命理知识库', href: '/knowledge' },
      { name: input.name, href: entryPath },
    ],
    seed: {
      model: 'MetaphysicsEntry',
      slug: input.slug,
      category: input.category,
      localeStrategy: 'localized-seo-canonical-body',
    },
  };
}

export const knowledgeIndexPage = {
  id: 'knowledge-index',
  family: 'knowledge',
  slug: 'knowledge',
  path: '/knowledge',
  pageType: 'WebPage',
  sitemap: true,
  seo: createLocalizedSeo({
    title: '命理知识库｜八字五行星宿故事｜今择易',
    description: '查四柱、日主、十神、藏干、纳音、五行、宜忌、冲煞、二十八宿、紫微斗数和周天星斗等命理知识。',
    h1: '命理知识库',
    deck: '把工具里出现的术语、文化故事和方法提示集中整理，方便边查边理解。',
    keywords: ['命理知识', '八字术语', '五行', '紫微斗数', '二十八宿'],
  }),
  body: '命理知识库是今择易的术语和故事层。这里把四柱、日主、十神、藏干、纳音、五行、宜忌、冲煞、吉时、二十八宿、紫微斗数和周天星斗放在同一个结构里，方便排盘、看黄历和择日时快速理解每个词的来源、用法和边界，同时避免替代工具计算或把民俗语言包装成结论。',
  faq: [
    {
      id: 'knowledge-tool',
      question: '知识库和工具页是什么关系？',
      answer: '工具页负责计算和筛选，知识库负责解释术语、故事和方法边界。工具里的术语提示会逐步链接到这里。',
    },
    {
      id: 'knowledge-source',
      question: '这些内容是断语吗？',
      answer: '这里按传统文化与民俗参考来写，重要安排仍要结合现实条件和专业意见。',
    },
    {
      id: 'knowledge-order',
      question: '新手适合从哪些词开始？',
      answer: '四柱、日主、五行、宜忌和冲煞适合入门；十神、藏干、纳音、二十八宿和紫微斗数更偏进阶。',
    },
  ],
  relatedLinks: [
    { href: '/tools/bazi', label: '八字排盘', description: '从个人出生资料进入四柱。', family: 'tool' },
    { href: '/calendar', label: '月历', description: '在具体日期里理解宜忌和冲煞。', family: 'core' },
    { href: '/jieri', label: '吉日查询', description: '把知识放进具体事项里比较。', family: 'jieri' },
  ],
  seed: {
    model: 'ContentPage',
    slug: 'knowledge',
    category: 'knowledge',
    localeStrategy: 'localized-seo-canonical-body',
  },
} satisfies IndexablePage;

export const metaphysicsEntries: MetaphysicsEntry[] = [
  buildEntry({
    slug: 'stem-branch',
    category: 'cosmology',
    name: '干支',
    short: '天干和地支组成六十组传统时间符号，用来记录年、月、日、时。',
    detail: '干支是许多术数系统共同使用的时间语言。十天干偏向天象、节令和五行气机的表达，十二地支则连接月份、时辰、生肖和方位。看黄历或八字时，干支负责把日期、时辰和五行关系放到同一套编码里，不宜当成孤立符号。',
    practicalUse: '在黄历页读干支时，重点是它对应年、月、日还是时；在八字页读干支时，重点是它和日主、十神、藏干、五行分布的关系。',
    relatedTerms: ['four-pillars', 'five-elements', 'chong-sha'],
    toolAppearances: ['今日黄历', '八字排盘', '月历详情'],
    mythologyStory: '古人用十和十二两个节奏相配，形成六十循环。这个循环像一部传统时间齿轮，把天象、节令、农事和民俗安排接到同一张表上。',
    commonMisunderstandings: [
      '干支不能只按生肖来读，八字会同时看四组干支。',
      '同一个干支出现在不同位置时，读法会随年柱、月柱、日柱、时柱而变化。',
    ],
    sourceNotes: [
      '参考传统历法、干支纪时和术数排盘的通用框架。',
      '本站只解释工具字段，不把单个干支当作完整判断。',
    ],
    chartHint: '八字里每一柱都是一组干支，日柱天干会成为日主。',
    starPersonalityMetaphor: '干支像命理图谱上的坐标，把时间点标到可比较的位置。',
    keywords: ['干支', '天干地支', '六十甲子', '八字术语'],
  }),
  buildEntry({
    slug: 'four-pillars',
    category: 'bazi',
    name: '四柱',
    short: '年、月、日、时四组干支，是八字排盘的骨架。',
    detail: '四柱把出生时间拆成四个层次：年柱看较大的时代和家族背景，月柱连接节令和成长环境，日柱是个人视角的中心，时柱常见于后续计划、子女和晚景等传统主题。今择易会排出四柱，并把十神、藏干、纳音和五行强弱作为证据层展示。',
    practicalUse: '排盘时要留意四柱是否因出生地、真太阳时或时辰边界而变化。择日时，也可把候选日期的日柱与个人四柱分开比较。',
    relatedTerms: ['stem-branch', 'day-master', 'ten-gods', 'hidden-stems', 'five-elements'],
    toolAppearances: ['八字排盘', '择日推荐', '合婚吉日'],
    mythologyStory: '四柱像四根梁柱，把一个时间点撑成可阅读的空间。年、月、日、时各自带着不同节奏，组合后才有完整盘面。',
    commonMisunderstandings: [
      '四柱需要合起来看，重点在它们互相生克、同气和位置关系。',
      '排出四柱只是开始，不能跳过日主、十神和五行结构直接下结论。',
    ],
    sourceNotes: [
      '源于子平八字体系中以年、月、日、时为基本盘面的读法。',
      '本站以排盘展示和文化说明为主，深层格局断法放在后续层级。',
    ],
    chartHint: '专业盘面并列呈现每柱的天干、地支、十神、藏干、纳音和十二长生状态。',
    starPersonalityMetaphor: '四柱像一张舞台布景，日主站在中央，其他柱位提供光线、背景和互动对象。',
    keywords: ['四柱', '八字排盘', '年柱', '月柱', '日柱', '时柱'],
  }),
  buildEntry({
    slug: 'day-master',
    category: 'bazi',
    name: '日主',
    short: '日柱天干代表排盘阅读的中心，用来判断十神和五行关系。',
    detail: '日主也称日元，是八字里用来建立关系坐标的核心。其他天干、地支藏干和五行信号都会回到日主来比较：谁生我、我生谁、谁克我、我克谁、谁与我同类。日主是读盘参照点，不能写成性格定论。',
    practicalUse: '看八字结果时，日主是中心点；十神、藏干和五行强弱都围绕它展开。日主附近若有较多同类或生扶信息，适合当作结构信号，不等于命运结论。',
    relatedTerms: ['four-pillars', 'ten-gods', 'hidden-stems', 'five-elements'],
    toolAppearances: ['八字排盘', '择日推荐', '命理知识提示'],
    mythologyStory: '如果四柱是一座庭院，日主就是站在院中的观察者。风从哪个方向来、哪一扇门更亮，都要知道观察者站在哪里。',
    commonMisunderstandings: [
      '日主不等于完整人格，不能只凭一个天干判断一个人。',
      '日主强弱需要看月令、同类、生扶、克泄耗和藏干，不宜只数表面五行。',
    ],
    sourceNotes: [
      '参考子平八字以日干为中心建立十神关系的读法。',
      '本站用日主解释盘面结构，避免把文化符号当成高风险决策依据。',
    ],
    chartHint: '十神标签会以日主为基准生成；日主换了，其他干支的十神名称也会随之变化。',
    starPersonalityMetaphor: '日主像地图上的“当前位置”，没有它就无法说明别的符号离你多远、如何互动。',
    keywords: ['日主', '日元', '八字日主', '十神'],
  }),
  buildEntry({
    slug: 'ten-gods',
    category: 'bazi',
    name: '十神',
    short: '十神用日主和其他天干的生克阴阳关系，标出比劫、食伤、财、官杀、印等角色。',
    detail: '十神是八字关系标签，名称虽然带“神”，读法仍回到五行生克和阴阳同异。它会转换成可读角色，例如同类为比劫，我生者为食伤，我克者为财，克我者为官杀，生我者为印。专业盘面显示十神，能看出每个干支相对日主扮演什么角色。',
    practicalUse: '读十神时，位置、透出、藏支和五行强弱都很关键。十神只是解释依据，不能写成绝对好坏。',
    relatedTerms: ['day-master', 'hidden-stems', 'five-elements', 'four-pillars'],
    toolAppearances: ['八字排盘', '合婚参考', '择日推荐'],
    mythologyStory: '十神像一组剧中角色：朋友、表达、资源、规则、追求各有位置。一个角色上场不代表剧情结束，关键在角色之间怎样配合。',
    commonMisunderstandings: [
      '正财、偏财等名称不应直接理解成现实财富结果。',
      '官杀、印星等词有传统语境，阅读时重在关系和位置，少做单字联想。',
    ],
    sourceNotes: [
      '参考子平八字十神关系体系。',
      '本站采用关系标签和结构说明，不输出职业、财富、婚恋等确定化断语。',
    ],
    chartHint: '四柱天干和地支藏干都会显示十神，帮助比较显性信息和隐藏信息。',
    starPersonalityMetaphor: '十神像人际关系图上的角色标签，提醒你某个符号是在支持、表达、约束还是消耗日主。',
    keywords: ['十神', '比肩', '食神', '正财', '正官', '正印'],
  }),
  buildEntry({
    slug: 'hidden-stems',
    category: 'bazi',
    name: '藏干',
    short: '藏干是地支内部包含的天干，用来观察盘面里的隐藏五行和十神。',
    detail: '地支不能当成单一五行标签，许多地支内部会藏一到三个天干。藏干让八字从表层四个天干扩展到更细的结构：有些力量透在天干，容易被看到；有些力量藏在地支，需要结合月令、透出和冲合来读。',
    practicalUse: '当五行表面看起来偏少时，地支藏干可能提供隐藏来源。今择易会给藏干做权重提示，标出主气、中气或余气。',
    relatedTerms: ['day-master', 'ten-gods', 'five-elements', 'four-pillars'],
    toolAppearances: ['八字排盘', '五行强弱面板', '择日推荐'],
    mythologyStory: '藏干像山脉中的矿脉。远看只见山形，走近才发现里面还有不同质地和层次。',
    commonMisunderstandings: [
      '藏干不能当成可忽略的小字，它会影响五行分布和十神结构。',
      '藏干也不能简单相加成结论，主气、中气、余气的权重不同。',
    ],
    sourceNotes: [
      '参考地支藏干与月令主气的传统排盘规则。',
      '本站用主次权重展示结构，不进入复杂门派差异比较。',
    ],
    chartHint: '专业盘面列出每个地支的藏干，并标出它相对日主的十神关系。',
    starPersonalityMetaphor: '藏干像角色的内在线索，表面剧情之外还藏着动机和资源。',
    keywords: ['藏干', '地支藏干', '主气', '中气', '余气'],
  }),
  buildEntry({
    slug: 'na-yin',
    category: 'bazi',
    name: '纳音',
    short: '纳音把六十甲子配成带意象的五行名称，如海中金、炉中火、泉中水。',
    detail: '纳音是六十甲子的一套象征性分类。它把干支组合转成更具画面感的五行名称，用来补充文化意象和传统命名。和日主、十神相比，纳音更像意象层，不适合单独承担结构判断。',
    practicalUse: '在今择易的八字盘里，纳音辅助理解每柱的文化意象。四柱、日主、十神、藏干和五行强弱是结构主线，纳音更像补充故事线。',
    relatedTerms: ['stem-branch', 'four-pillars', 'five-elements', 'day-master'],
    toolAppearances: ['八字排盘', '命理知识页', '分享摘要'],
    mythologyStory: '纳音名称常带自然画面：水有泉中、涧下、大海，火有炉中、山下、霹雳。它让干支不只是一组代码，也像一幅可记忆的景象。',
    commonMisunderstandings: [
      '纳音不宜被当成八字结构的唯一核心，不能只看纳音五行判断强弱。',
      '纳音名称偏意象，和天干地支本身的五行读法要分开。',
    ],
    sourceNotes: [
      '参考六十甲子纳音体系和传统历书用语。',
      '本站将纳音作为文化意象字段，不把它单独放进高权重评分。',
    ],
    chartHint: '纳音属于每柱的补充意象，适合和四柱细节一起读。',
    starPersonalityMetaphor: '纳音像给每组干支配上的画面标题，便于记忆和讲故事。',
    keywords: ['纳音', '六十甲子', '海中金', '泉中水', '八字纳音'],
  }),
  buildEntry({
    slug: 'five-elements',
    category: 'five-elements',
    name: '五行',
    short: '木、火、土、金、水是一套传统分类语言，用来描述生克、节令和结构倾向。',
    detail: '五行是一套关系模型，不宜只读成五种物质清单。木火土金水之间有相生、相克和旺衰变化，可描述季节、方位、颜色、脏腑、姓名字义和八字结构。五行适合作为解释工具，不适合把某个五行写成现实结果。',
    practicalUse: '在八字中，可见天干地支和藏干权重需要分开看；在姓名中，五行只作为字义与结构参考；在择日中，五行可帮助说明某日对某个日主的相对倾向。',
    relatedTerms: ['day-master', 'ten-gods', 'hidden-stems', 'na-yin'],
    toolAppearances: ['八字排盘', '姓名五行', '择日推荐'],
    mythologyStory: '五行常被想成四季流转：木生发，火舒展，土承载，金收敛，水收藏。它像一套观察变化的语言，不适合给人贴单色标签。',
    commonMisunderstandings: [
      '五行偏多或偏少不等于现实好坏，需要看位置、时令和组合。',
      '起名或择日不能只靠补某个五行，还要结合读音、字义、事项和现实条件。',
    ],
    sourceNotes: [
      '参考阴阳五行作为中国传统分类语言在历法、术数和民俗中的使用。',
      '本站用五行说明结构和倾向，不替代医疗、财务或法律判断。',
    ],
    chartHint: '五行强弱面板会区分表层计数和藏干加权，避免只看表面柱字。',
    starPersonalityMetaphor: '五行像调色盘，重点在整幅画的比例、层次和光线，不宜只看单色命名。',
    keywords: ['五行', '木火土金水', '五行生克', '八字五行', '姓名五行'],
  }),
  buildEntry({
    slug: 'chong-sha',
    category: 'almanac',
    name: '冲煞',
    short: '冲提示地支或生肖关系较紧，煞提示当天较需避开的传统方位。',
    detail: '黄历里的冲煞通常写成“冲某生肖，煞某方”。冲表示当日地支和某个地支相冲，常提醒相关生肖或事项要更谨慎；煞方则是传统择日里较不宜主动触动的方向。它是一层提醒，不能当成完整择日结果。',
    practicalUse: '涉及搬家、动土、安床、开业等事项时，冲煞是否触及本人或关键参与者生肖很重要，也要结合宜忌、值神、吉时和现实安排。',
    relatedTerms: ['stem-branch', 'yi-ji', 'lucky-hour', 'five-elements'],
    toolAppearances: ['今日黄历', '月历详情', '择日推荐'],
    mythologyStory: '冲煞像路口的风向标：它不替你决定行程，但会提醒某个方向或某类关系今天更容易有阻力。',
    commonMisunderstandings: [
      '冲到某生肖不代表整天无法行动，事项轻重和参与者关系都要一起看。',
      '煞方不能代替现实安全判断，动工、出行和法律手续仍要按实际规则处理。',
    ],
    sourceNotes: [
      '参考传统黄历择日中地支相冲和煞方提示的用法。',
      '本站把冲煞作为评分和提醒维度之一，不单独给出最终结论。',
    ],
    chartHint: '择日推荐中的冲煞属于生肖和地支维度，扣分理由会单独标出。',
    starPersonalityMetaphor: '冲煞像一条张力线，提示今天哪些关系和方向需要降低硬碰硬。',
    keywords: ['冲煞', '生肖相冲', '黄历冲煞', '煞方'],
  }),
  buildEntry({
    slug: 'yi-ji',
    category: 'almanac',
    name: '宜忌',
    short: '宜是较适合安排的事项，忌是当天较不建议硬做的事项。',
    detail: '宜忌是黄历最直观的事项列表，但它需要和具体场景对应。比如嫁娶、入宅、开市、动土、祭祀、出行等词都有传统语境。今择易会匹配事项，并结合冲煞、时辰和场景权重给出解释。',
    practicalUse: '选日时，关键问题是“我要办的事在不在宜项里，是否被忌项命中”。若同一天有很多宜项，也要看这件事是否匹配，不能只看宜项数量。',
    relatedTerms: ['chong-sha', 'lucky-hour', 'five-elements', 'stem-branch'],
    toolAppearances: ['今日黄历', '吉日查询', '择日推荐'],
    mythologyStory: '宜忌像古代生活事项的索引，把祭祀、修造、交易、婚嫁、出行等活动放到日课语言里，方便人们安排节奏。',
    commonMisunderstandings: [
      '宜项多不等于所有事情都合适，真正要办的事是否命中更重要。',
      '忌项命中时宜谨慎处理，大事可换日，小事可结合实际权衡。',
    ],
    sourceNotes: [
      '参考传统黄历对每日事项宜忌的分类。',
      '宜忌与场景规则对应后，才不会只按词条数量排序。',
    ],
    chartHint: '择日推荐把事项匹配作为场景维度，命中的宜项和需要留意的忌项会分开展示。',
    starPersonalityMetaphor: '宜忌像当天的事项菜单，能点什么菜，还要看你今天真正要吃什么。',
    keywords: ['宜忌', '黄历宜忌', '吉日查询', '择日'],
  }),
  buildEntry({
    slug: 'lucky-hour',
    category: 'almanac',
    name: '吉时',
    short: '一天十二个时辰各有吉凶和宜忌，吉时适合细化具体办事时间。',
    detail: '吉时把一天再分成十二段，每段有星神、宜忌和传统吉凶。它适合在已选日期后继续缩小时间范围。若整日基调较谨慎，吉时也只能作为局部参考，不能把日期整体改成完全适合。',
    practicalUse: '日期定下来后，吉时适合安排关键动作。婚嫁、开业、搬家等场景可优先找事项相关的吉时；若只处理小事，吉时可以作为方便安排的提醒。',
    relatedTerms: ['yi-ji', 'chong-sha', 'twenty-eight-mansions', 'stem-branch'],
    toolAppearances: ['今日黄历', '日期详情', '择日推荐'],
    mythologyStory: '古人把昼夜分成十二个时辰，每段都有不同气象。吉时像一天里的小窗口，让大日课之外还有更细的节奏。',
    commonMisunderstandings: [
      '吉时不能当万能开关，整日冲煞和忌项仍然需要看。',
      '同一个吉时也要结合地点、参与者时间和现实安排。',
    ],
    sourceNotes: [
      '参考黄历十二时辰、星神和时辰宜忌的常见结构。',
      '本站在评分中把吉时作为可用时段维度，不把它当最终判断。',
    ],
    chartHint: '择日结果优先显示可用吉时，并标出哪些时辰更贴近你的安排。',
    starPersonalityMetaphor: '吉时像一日中的灯光变化，提醒你哪一段更适合推进。',
    keywords: ['吉时', '时辰吉凶', '十二时辰', '黄历吉时'],
  }),
  buildEntry({
    slug: 'twenty-eight-mansions',
    category: 'stars',
    name: '二十八宿',
    short: '二十八宿是古代星空分区，也被黄历和民俗用来描述日辰星宿气象。',
    detail: '二十八宿把天空分成东方青龙、北方玄武、西方白虎、南方朱雀四组，每组七宿。它既是古代天文星官系统的一部分，也进入历书、择日和民俗故事，适合作为星宿知识和择日细节的入口。',
    practicalUse: '在黄历或知识页看到星宿时，方位、分组和事项倾向都值得留意。它适合作为辅助层，不适合替代宜忌和冲煞。',
    relatedTerms: ['zhou-tian-xing-dou', 'lucky-hour', 'yi-ji', 'chong-sha'],
    toolAppearances: ['命理知识页', '未来黄历星宿扩展', '择日推荐'],
    mythologyStory: '二十八宿像星空的二十八个驿站。青龙、白虎、朱雀、玄武四象把星空故事化，也让历法、神话和方向感连接起来。',
    commonMisunderstandings: [
      '二十八宿并非现代星座的中文翻译，它属于中国传统星官体系。',
      '星宿吉凶有历书语境，不能脱离事项类型单独使用。',
    ],
    sourceNotes: [
      '参考中国传统二十八宿与四象星官体系。',
      '本站目前做文化解释和未来字段预留，深层星宿择日规则会逐步补充。',
    ],
    chartHint: '未来黄历详情可把当日星宿作为补充信息展示，帮助解释日辰气象。',
    starPersonalityMetaphor: '二十八宿像星空地图上的章节标题，每一宿都有自己的方位、气质和故事。',
    keywords: ['二十八宿', '星宿', '四象', '青龙白虎朱雀玄武'],
  }),
  buildEntry({
    slug: 'zi-wei-dou-shu',
    category: 'zi-wei',
    name: '紫微斗数',
    short: '紫微斗数以命盘宫位和星曜为核心，是与八字并列的传统命理系统。',
    detail: '紫微斗数通常以出生时间排出十二宫位，核心信息包括紫微、天府、太阳、太阴等星曜，以及四化、庙旺陷等状态。它和八字都使用出生资料，但阅读语言不同：八字强调干支五行与十神，紫微斗数强调宫位、星曜组合和主题宫。',
    practicalUse: '今择易当前不排紫微命盘，知识库只解释术语边界，为未来星曜、宫位和四化内容做准备。紫微斗数和八字分属两套模型。',
    relatedTerms: ['zhou-tian-xing-dou', 'twenty-eight-mansions', 'four-pillars', 'day-master'],
    toolAppearances: ['命理知识页', '未来紫微斗数模块', '未来星曜故事页'],
    mythologyStory: '紫微星常被视为帝座象征，斗数把群星安排进十二宫位，像一座以星曜为角色、宫位为场景的剧场。',
    commonMisunderstandings: [
      '紫微斗数不能当成八字的别名，两者盘面、术语和判断路径不同。',
      '星曜名称有神话色彩，适合当作传统文化和工具术语阅读。',
    ],
    sourceNotes: [
      '参考紫微斗数常见命盘、星曜、宫位和四化术语。',
      '本站此阶段只建立知识入口，不实现完整紫微排盘。',
    ],
    chartHint: '未来若加入紫微命盘，星曜解释会从这里复用，避免每个工具重复写长文。',
    starPersonalityMetaphor: '紫微斗数像一座星曜剧场，宫位是场景，星曜是角色，四化像剧情推进方式。',
    keywords: ['紫微斗数', '紫微星', '星曜', '十二宫', '四化'],
  }),
  buildEntry({
    slug: 'zhou-tian-xing-dou',
    category: 'stars',
    name: '周天星斗',
    short: '周天星斗泛指满天星官与星曜秩序，是星宿、神话和术数想象的总背景。',
    detail: '周天星斗是传统星空想象的总称，范围大于单个排盘字段。它把北斗、南斗、二十八宿、星官神名和民间故事放进一个更大的星空秩序里。今择易把它作为故事层入口，用来说明为什么命理产品常把星、神、方位和时间放在一起。',
    practicalUse: '阅读周天星斗时，把它当作文化背景和内容导航。它适合承接星宿故事、紫微星曜、神话人物和未来趣味测试，不直接参与当前八字或择日计算。',
    relatedTerms: ['twenty-eight-mansions', 'zi-wei-dou-shu', 'lucky-hour', 'five-elements'],
    toolAppearances: ['命理知识页', '未来星宿故事页', '未来趣味内容'],
    mythologyStory: '“周天”有环绕天宇之意，星斗则让天空像一座有秩序的城。北斗指向、四象分野、群星列位，构成古人理解时间和方向的宏大背景。',
    commonMisunderstandings: [
      '周天星斗无法作为直接计算个人结果的单一模块，它更像知识和故事总入口。',
      '星神故事有文学和民俗色彩，阅读时应和现实决策分开。',
    ],
    sourceNotes: [
      '参考中国传统星官、北斗南斗、四象和民间星神叙事。',
      '本站用它组织故事内容和未来星曜入口，不当作当前评分公式。',
    ],
    chartHint: '当前工具不会用周天星斗直接打分，但相关星宿和星曜词会链接到这里。',
    starPersonalityMetaphor: '周天星斗像一座星空图书馆，二十八宿、紫微星曜和神话人物都能在其中找到书架。',
    keywords: ['周天星斗', '星官', '北斗', '南斗', '星宿神话'],
  }),
  buildEntry({
    slug: 'tiangan',
    category: 'bazi',
    name: '十天干',
    short: '甲乙丙丁戊己庚辛壬癸是十天干，配合五行和阴阳，构成八字与历法的基础符号。',
    detail: '十天干是传统干支系统中"天"的部分，依次为甲、乙、丙、丁、戊、己、庚、辛、壬、癸。它们各有五行属性和阴阳之分：甲为阳木、乙为阴木，丙为阳火、丁为阴火，戊为阳土、己为阴土，庚为阳金、辛为阴金，壬为阳水、癸为阴水。《渊海子平》以十天干为八字论命之起点，每一干皆有物象比喻：甲如参天大树、乙如藤萝花草，丙如太阳烈火、丁如灯烛星光，戊如高山城墙、己如田园沃土，庚如刀斧矿石、辛如珠玉首饰，壬如江河大海、癸如雨露甘霖。这些物象帮助理解天干在不同位置和组合中的气质差异。十天干与十二地支配合成六十甲子，构成传统纪年、纪月、纪日、纪时的循环编码。读八字时，天干主外、主显，是盘面上最容易被观察到的信息层。',
    practicalUse: '在八字排盘中，四柱天干是最先被注意的符号。日柱天干即日主，其余天干相对日主的十神关系是排盘核心。在黄历中，日干支标示每一天的干支编号，了解天干五行有助于快速判断当日五行属性。',
    relatedTerms: ['stem-branch', 'four-pillars', 'day-master', 'ten-gods', 'five-elements', 'dizhi'],
    toolAppearances: ['八字排盘', '今日黄历', '月历详情'],
    mythologyStory: '传说天干源于上古观天。《三命通会》引古说称，甲为"万物剖符甲而出"，乙为"万物初生屈曲而长"。古人从草木生长、日月变化中提取十种气机节律，配以五行阴阳，成为天干。又有说法认为十天干与十日神话有关：《山海经》载"汤谷上有扶桑，十日所浴"，十日轮替即十干循环的文化源头之一。',
    commonMisunderstandings: [
      '天干不能脱离地支单独解读。八字是干支配合的系统，单独一个天干只是半边信息。',
      '甲木不等于"大木头"或"木命"，物象比喻只是帮助理解气质，不能简化为字面意思。',
      '天干五行不是物理元素分类，而是传统气机节律的符号编码，阅读时应注重关系而非实体。',
      '阴阳不是好坏之分。阳干主动、外放，阴干主静、内敛，各有适用场景。',
    ],
    sourceNotes: [
      '《渊海子平·论天干》详述十天干性情物象与阴阳五行配属。',
      '《三命通会·论干支源流》考证天干起源与十日神话。',
      '《滴天髓·天干论》以天干体用刚柔为纲，讨论天干在不同月令中的强弱变化。',
      '本站用十天干作为排盘基础说明，不将单个天干当作完整命理判断。',
    ],
    chartHint: '四柱排盘中每柱上方为天干，日柱天干即日主，是十神关系的参照中心。',
    starPersonalityMetaphor: '十天干像十种不同的天气：甲乙如春风草木，丙丁如夏日火焰，戊己如大地承载，庚辛如秋霜金石，壬癸如冬水雨露。',
    keywords: ['十天干', '天干', '甲乙丙丁', '天干五行', '天干阴阳'],
  }),
  buildEntry({
    slug: 'dizhi',
    category: 'bazi',
    name: '十二地支',
    short: '子丑寅卯辰巳午未申酉戌亥是十二地支，承载藏干、方位、月份和生肖等多重信息。',
    detail: '十二地支是干支系统中"地"的部分，依次为子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。每个地支有本气五行，也有内部藏干：子藏癸水，丑藏己土、癸水、辛金，寅藏甲木、丙火、戊土，卯藏乙木，辰藏戊土、乙木、癸水，巳藏丙火、庚金、戊土，午藏丁火、己土，未藏己土、丁火、乙木，申藏庚金、壬水、戊土，酉藏辛金，戌藏戊土、辛金、丁火，亥藏壬水、甲木。地支之间存在六合（子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合）、三合（申子辰合水、亥卯未合木、寅午戌合火、巳酉丑合金）、三会（寅卯辰会木、巳午未会火、申酉戌会金、亥子丑会水）和六冲（子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲）等关系。《子平真诠》强调地支因藏干多重，读法比天干更复杂，需要分清主气、中气和余气。',
    practicalUse: '在八字排盘中，地支的藏干决定了五行分布的深层结构。看五行强弱时不能只看天干四个字，还要算入地支藏干的权重。在黄历中，日地支用于推算冲煞方位，如子日冲午（南方）。',
    relatedTerms: ['stem-branch', 'hidden-stems', 'four-pillars', 'chong-sha', 'five-elements', 'tiangan'],
    toolAppearances: ['八字排盘', '今日黄历', '冲煞说明', '月历详情'],
    mythologyStory: '十二地支与十二生肖相配，是民间最熟悉的文化关联。《三命通会》载，子属鼠、丑属牛，各取动物习性与地支时辰对应：子时鼠最活跃，丑时牛反刍，寅时虎啸林。地支也对应十二个月份和十二时辰，构成天文中黄道十二次的历法基础。古人又以地支配方位，寅卯辰为东方木，巳午未为南方火，申酉戌为西方金，亥子丑为北方水。',
    commonMisunderstandings: [
      '地支不能只看本气五行，藏干中的中气和余气在特定条件下会成为重要信息。',
      '生肖只是地支的一个文化附会层，八字论命要看完整的四柱地支，不能只凭生肖下结论。',
      '地支六合、三合等关系不是简单的好或坏，要看合化是否成立、对日主是喜是忌。',
      '辰戌丑未四个土支容易被忽略，但它们藏干丰富，是许多五行变化的关键位置。',
    ],
    sourceNotes: [
      '《渊海子平·论地支》详述十二地支藏干与合冲关系。',
      '《子平真诠·论地支藏干》强调主气、中气、余气的权重差异。',
      '《三命通会·论地支刑冲》系统讨论地支之间的冲合刑害。',
      '本站用十二地支说明排盘底层结构，合化与刑冲的深层断法需参考专业典籍。',
    ],
    chartHint: '四柱排盘中每柱下方为地支，点击可展开查看藏干及其十神。',
    starPersonalityMetaphor: '十二地支像十二间密室，每间房里藏着不同的来客（藏干），表面看是一扇门，里面可能住着一到三位。',
    keywords: ['十二地支', '地支', '子丑寅卯', '地支藏干', '六合', '三合', '六冲'],
  }),
  buildEntry({
    slug: 'hehua',
    category: 'bazi',
    name: '天干合化与地支合化',
    short: '天干五合和地支六合、三合、三会是八字中重要的组合关系，影响五行转化和力量变化。',
    detail: '合化是八字中干支之间因特定配对而产生组合甚至转化的关系。天干五合为：甲己合化土、乙庚合化金、丙辛合化水、丁壬合化木、戊癸合化火。五合源于河图之数相配，只有在月令和全局条件支持时才能真正化成，否则只是合而不化。地支六合为：子丑合化土、寅亥合化木、卯戌合化火、辰酉合化金、巳申合化水、午未合化土（一说合化火）。地支三合为：申子辰合水局、亥卯未合木局、寅午戌合火局、巳酉丑合金局。三合以中间一支为旺，如申子辰以子水为旺。地支三会为：寅卯辰会东方木、巳午未会南方火、申酉戌会西方金、亥子丑会北方水，三会力量通常大于六合和三合。《滴天髓》强调"合"不是消除，而是转化：合去忌神为喜，合去喜神为忌，要看具体盘面。',
    practicalUse: '在八字排盘中，合化关系会影响五行强弱判断。如果日主旁边的干支与之相合，需要看合化后对日主是有利还是不利。择日时也要注意候选日的干支是否与个人八字形成有利或不利的合化。',
    relatedTerms: ['tiangan', 'dizhi', 'stem-branch', 'five-elements', 'day-master', 'ten-gods', 'hidden-stems'],
    toolAppearances: ['八字排盘', '五行强弱面板', '择日推荐'],
    mythologyStory: '天干五合源于河图生成之理。《三命通会》解释：甲为一、己为六，一六合居北方水位而成化土，暗合天地生成之数。古人观察到天干相合如同阴阳相吸，好比天地之间气息流转，阳干主动去合，阴干被动回应，合化后五行属性发生质变。地支合化则更复杂，像不同季节的气息在同一地支中汇聚、交融和转化。传统上把合化比喻为婚姻：两干或两支相遇，有情则合，有缘则化。',
    commonMisunderstandings: [
      '合化不是必然会发生的。天干五合需要月令和全局条件支持才能真化，否则只是"合而不化"，原来的五行仍然存在。',
      '地支六合、三合的力量和三会不同，三会局的力量通常最强，因为它汇聚了同一方位的三个地支。',
      '合化不能简单理解为"好"或"坏"。合去了忌神可能有利，合去了喜神反而不利，要结合日主喜忌来判断。',
      '天干合化与地支合化是不同层次的系统，不能混为一谈。天干主外显，地支主内藏，合化规则各不相同。',
    ],
    sourceNotes: [
      '《三命通会·论天干合》系统阐述天干五合的来源、条件和化与不化的区别。',
      '《滴天髓·合化论》强调合化需看全局，"合中带克"和"合中带生"效果完全不同。',
      '《渊海子平·论地支合局》详述六合、三合、三会的形成条件和力量大小。',
      '《子平真诠·论合》讨论合化对格局的影响，是理解合化最系统的章节之一。',
      '本站用合化说明排盘中常见的组合现象，深层断法需参考原典。',
    ],
    chartHint: '八字排盘中会标注天干五合和地支六合、三合关系，帮助观察五行力量的潜在变化。',
    starPersonalityMetaphor: '合化像人际关系中的化学反应：两个独立个体相遇后，可能融合成全新的状态，也可能只是暂时握手而不改变本质。',
    keywords: ['天干合化', '地支合化', '五合', '六合', '三合', '三会', '甲己合', '乙庚合'],
  }),
  buildEntry({
    slug: 'dayun',
    category: 'bazi',
    name: '大运流年',
    short: '大运是八字中以十年为单位的运势周期，流年是每一年的天干地支，两者共同构成时间运势的动态层。',
    detail: '大运是八字排盘中除四柱之外最重要的时间维度。它以月柱为起点，根据性别和年干阴阳决定顺排或逆排：阳年男命和阴年女命顺行，阴年男命和阳年女命逆行。每步大运十年，天干管前五年，地支管后五年（传统说法）。起运年龄的计算方法是从出生日到下一个节气（顺排）或上一个节气（逆排）的天数除以三，商数即为起运岁数。流年则是每一年的天干地支，也称太岁。流年与大运、原局四柱之间形成的生克合冲关系，是传统命理判断吉凶时段的主要依据。《子平真诠》强调"命好不如运好"，指出大运对原局的影响有时比四柱本身的组合更关键。《渊海子平》则把大运比喻为人生旅途中的不同路段：同一条命走不同的运，体验完全不同。',
    practicalUse: '在八字排盘结果中，大运部分会列出每步大运的起始年龄和干支，帮助理解人生不同阶段的五行环境变化。流年则对应每一年的具体干支，与大运和原局配合使用。需要注意的是，大运排法有多种门派差异，今择易采用常见排法供参考。',
    relatedTerms: ['four-pillars', 'stem-branch', 'day-master', 'ten-gods', 'five-elements'],
    toolAppearances: ['八字排盘', '流年运势参考'],
    mythologyStory: '古人把人生比喻为一条长河，四柱是河道的形状，大运则是河水流经的不同地段。有的地段宽阔平坦，有的地段险滩密布。《渊海子平》记载，古人认为大运来源于"天地之气"的周期流转：十年一变，如同四季更替，每个人在不同年龄段会遇到不同的"天时"。这种观念与古代天文历法中"运"的概念相呼应——天体运行有其周期，人的运势也随之起伏。',
    commonMisunderstandings: [
      '大运不是算命先生的发明，它是基于出生时间和节气的固定推算规则，不同排法之间可能有差异。',
      '起运年龄不等于出生年龄。有的人一岁起运，有的人十岁才起运，这取决于出生日到节气的天数。',
      '大运天干管前五年、地支管后五年是传统简化说法，实际读法需要看干支整体与原局的关系，不能机械切割。',
      '流年太岁不等于"犯太岁就一定不好"。太岁是时间标记，吉凶要看它与个人八字的生克合冲关系。',
    ],
    sourceNotes: [
      '《渊海子平·论大运》详述大运排法、起运规则和运与命的关系。',
      '《子平真诠·论运》强调运对格局的补救和破坏作用，是大运论法的经典章节。',
      '《三命通会·论流年太岁》讨论流年与原局、大运的互动关系。',
      '本站大运排法采用常见传统规则供参考，门派差异不在工具中展开比较。',
    ],
    chartHint: '八字排盘下方会列出大运序列和起运年龄，流年则在详情页单独标注。',
    starPersonalityMetaphor: '大运像人生旅途中的天气预报，告诉你某段路上大概率遇到阳光还是风雨，但具体怎么走还是看个人。',
    keywords: ['大运', '流年', '起运年龄', '太岁', '大运排法', '流年运势'],
  }),
  buildEntry({
    slug: 'qi-men-dun-jia',
    category: 'cosmology',
    name: '奇门遁甲',
    short: '奇门遁甲是中国古代三式之一，以九宫、八门、八神、九星和天干地支构成复杂的时空预测模型。',
    detail: '奇门遁甲与太乙、六壬并称"三式"，被认为是古代最高层次的术数体系之一。其基本框架以洛书九宫为空间基础，配合天干地支、八门、八神和九星，构成一个立体的时空模型。九宫对应洛书九数和八卦方位：坎一宫（北）、坤二宫（西南）、震三宫（东）、巽四宫（东南）、中五宫（中）、乾六宫（西北）、艮七宫（东北）、离八宫（南）、兑九宫（西）。八门为：开门、休门、生门、伤门、杜门、景门、死门、惊门，各门有吉凶之分：开、休、生为三吉门，死、惊、伤为三凶门，杜、景为中平。八神为：值符、腾蛇、太阴、六合、白虎、玄武、九地、九天，代表不同的神煞力量。九星为：天蓬、天芮、天冲、天辅、天禽、天心、天柱、天任、天英，各星有不同性质。奇门遁甲的排盘非常复杂，需要区分阴阳遁、确定局数、排布各层信息。《奇门遁甲元灵经》称其"以时系事，以方定位"，强调时间和空间的双重维度。',
    practicalUse: '奇门遁甲在传统文化中用于择时择方，即在特定时间选择有利的方位和行动时机。现代应用中，它主要作为文化研究和传统学术探讨的对象。了解奇门遁甲的基本框架有助于理解传统术数的复杂性和系统性，但不应将其作为决策依据。',
    relatedTerms: ['stem-branch', 'five-elements', 'twenty-eight-mansions', 'zhou-tian-xing-dou'],
    toolAppearances: ['未来术数内容', '命理知识页'],
    mythologyStory: '传说奇门遁甲为九天玄女所授，帮助黄帝在涿鹿之战中战胜蚩尤。《奇门遁甲统宗》记载："黄帝命风后演遁甲奇门，用以破蚩尤。"这个神话将奇门遁甲的起源追溯到上古战争，暗示它最初可能与军事布局和择时有关。"遁甲"之名有多种解释：一说天干中甲为尊，遁入六仪（戊己庚辛壬癸）之中而不显；一说甲为首领，需藏匿以保护。历史上，奇门遁甲被军事家、政治家和术士研究，诸葛亮、刘伯温等传说人物都被认为精通此术。',
    commonMisunderstandings: [
      '奇门遁甲不是简单的"算命工具"，它是一个包含空间（九宫方位）和时间（干支时辰）的复合模型，比八字的结构复杂得多。',
      '八门的吉凶不是绝对的。吉门遇到凶星或凶神也可能变差，凶门在特定条件下也能化凶为吉，要看整体盘面。',
      '奇门遁甲的排盘方法有多个门派（飞盘、转盘等），不同门派的排法可能差异很大，不能混用。',
      '奇门遁甲与八字是不同的术数系统，虽然都用干支，但分析框架和应用场景完全不同。',
    ],
    sourceNotes: [
      '《奇门遁甲统宗》为奇门遁甲的综合性典籍，涵盖排盘方法和断法框架。',
      '《奇门遁甲元灵经》详述九星、八门、八神的性质和组合断法。',
      '《遁甲符应经》为早期奇门遁甲文献，记载基本格局和应用原则。',
      '本站将奇门遁甲作为传统术数文化知识介绍，不提供排盘工具和预测服务。',
    ],
    starPersonalityMetaphor: '奇门遁甲像一张多层棋盘，每一层（天盘、地盘、人盘、神盘）都在不同维度上放置棋子，整体局面要看所有层次的配合。',
    keywords: ['奇门遁甲', '九宫', '八门', '八神', '九星', '三式', '遁甲'],
  }),
];

function localizeLink(locale: LocaleCode, link: InternalLink): InternalLink {
  return {
    ...link,
    label: localizeBodyCopy(locale, link.label),
    description: link.description ? localizeBodyCopy(locale, link.description) : undefined,
  };
}

function localizeEntry(locale: LocaleCode, entry: MetaphysicsEntry): MetaphysicsEntry {
  return {
    ...entry,
    categoryLabel: localizeBodyCopy(locale, entry.categoryLabel),
    name: localizeBodyCopy(locale, entry.name),
    short: localizeBodyCopy(locale, entry.short),
    detail: localizeBodyCopy(locale, entry.detail),
    practicalUse: localizeBodyCopy(locale, entry.practicalUse),
    mythologyStory: localizeBodyCopy(locale, entry.mythologyStory),
    commonMisunderstandings: entry.commonMisunderstandings.map((item) => localizeBodyCopy(locale, item)),
    sourceNotes: entry.sourceNotes.map((item) => localizeBodyCopy(locale, item)),
    chartHint: entry.chartHint ? localizeBodyCopy(locale, entry.chartHint) : undefined,
    starPersonalityMetaphor: entry.starPersonalityMetaphor
      ? localizeBodyCopy(locale, entry.starPersonalityMetaphor)
      : undefined,
    linkLabel: localizeBodyCopy(locale, entry.linkLabel),
    body: localizeBodyCopy(locale, entry.body),
    faq: entry.faq.map((item) => ({
      ...item,
      question: localizeBodyCopy(locale, item.question),
      answer: localizeBodyCopy(locale, item.answer),
    })),
    relatedLinks: entry.relatedLinks.map((link) => localizeLink(locale, link)),
    breadcrumbs: entry.breadcrumbs?.map((item) => ({
      ...item,
      name: localizeBodyCopy(locale, item.name),
    })),
  };
}

export function getMetaphysicsEntry(slug: string, locale?: LocaleCode): MetaphysicsEntry | undefined {
  const entry = metaphysicsEntries.find((item) => item.slug === slug);
  if (!entry || !locale) return entry;
  return localizeEntry(locale, entry);
}

export function getMetaphysicsEntries(locale?: LocaleCode): MetaphysicsEntry[] {
  return locale ? metaphysicsEntries.map((entry) => localizeEntry(locale, entry)) : [...metaphysicsEntries];
}

export function getMetaphysicsEntriesByCategory(
  category: MetaphysicsCategory,
  locale?: LocaleCode,
): MetaphysicsEntry[] {
  return getMetaphysicsEntries(locale).filter((entry) => entry.category === category);
}

export function getMetaphysicsCategory(category: MetaphysicsCategory, locale?: LocaleCode): MetaphysicsCategoryMeta | undefined {
  const meta = metaphysicsCategories.find((item) => item.key === category);
  if (!meta || !locale) return meta;

  return {
    ...meta,
    label: localizeBodyCopy(locale, meta.label),
    description: localizeBodyCopy(locale, meta.description),
  };
}

export function getMetaphysicsCategories(locale?: LocaleCode): MetaphysicsCategoryMeta[] {
  return locale
    ? metaphysicsCategories.map((item) => ({
        ...item,
        label: localizeBodyCopy(locale, item.label),
        description: localizeBodyCopy(locale, item.description),
      }))
    : [...metaphysicsCategories];
}
