import { createLocalizedSeo } from './localize';
import type { ArticleContent, FaqItem, IndexablePage, InternalLink } from './types';

export interface ZodiacCompatibility {
  best: string[];
  steady: string[];
  caution: string[];
  note: string;
}

export interface ZodiacProfile extends IndexablePage {
  animal: string;
  earthlyBranch: string;
  elementHint: string;
  years: number[];
  traits: string[];
  compatibility: ZodiacCompatibility;
  annualFortuneSummary: string;
  suitableActions: string[];
  unsuitableActions: string[];
}

export interface ZodiacArticle extends ArticleContent {
  animalSlug: string;
  topic: 'personality' | 'compatibility';
  sourceNotes: string[];
  paragraphs: string[];
}

interface ZodiacSeed {
  slug: string;
  animal: string;
  earthlyBranch: string;
  elementHint: string;
  years: number[];
  traits: string[];
  best: string[];
  steady: string[];
  caution: string[];
  tone: string;
  action: string;
}

const zodiacSeeds: ZodiacSeed[] = [
  { slug: 'rat', animal: '鼠', earthlyBranch: '子', elementHint: '水', years: [1960, 1972, 1984, 1996, 2008, 2020], traits: ['机敏', '善察', '重机会'], best: ['牛', '龙', '猴'], steady: ['鼠', '猪'], caution: ['马'], tone: '反应快，习惯观察局势后出手', action: '适合做计划、谈资源、启动需要信息判断的事' },
  { slug: 'ox', animal: '牛', earthlyBranch: '丑', elementHint: '土', years: [1961, 1973, 1985, 1997, 2009, 2021], traits: ['稳重', '耐心', '重承诺'], best: ['鼠', '蛇', '鸡'], steady: ['牛', '龙'], caution: ['羊'], tone: '慢热而有耐力，做事讲秩序和兑现', action: '适合定规矩、签长期约、处理家宅与资产事项' },
  { slug: 'tiger', animal: '虎', earthlyBranch: '寅', elementHint: '木', years: [1962, 1974, 1986, 1998, 2010, 2022], traits: ['果断', '主动', '有担当'], best: ['猪', '马', '狗'], steady: ['虎', '兔'], caution: ['猴'], tone: '气势外放，遇事愿意先承担', action: '适合开局、竞标、出行和需要主动推进的安排' },
  { slug: 'rabbit', animal: '兔', earthlyBranch: '卯', elementHint: '木', years: [1963, 1975, 1987, 1999, 2011, 2023], traits: ['温和', '细腻', '重分寸'], best: ['狗', '猪', '羊'], steady: ['兔', '虎'], caution: ['鸡'], tone: '重礼数与边界，善于把紧张气氛放缓', action: '适合会面、修复关系、整理家居和文书' },
  { slug: 'dragon', animal: '龙', earthlyBranch: '辰', elementHint: '土', years: [1964, 1976, 1988, 2000, 2012, 2024], traits: ['开阔', '自信', '重格局'], best: ['鸡', '鼠', '猴'], steady: ['龙', '蛇'], caution: ['狗'], tone: '看重格局和声势，适合站到台前', action: '适合开业、发布、签约和需要聚拢人气的事' },
  { slug: 'snake', animal: '蛇', earthlyBranch: '巳', elementHint: '火', years: [1965, 1977, 1989, 2001, 2013, 2025], traits: ['谨慎', '洞察', '重判断'], best: ['猴', '牛', '鸡'], steady: ['蛇', '龙'], caution: ['猪'], tone: '不急着表态，对风险更敏感', action: '适合研究、谈判、复盘和需要保密的安排' },
  { slug: 'horse', animal: '马', earthlyBranch: '午', elementHint: '火', years: [1966, 1978, 1990, 2002, 2014, 2026], traits: ['爽朗', '行动快', '重自由'], best: ['羊', '虎', '狗'], steady: ['马', '蛇'], caution: ['鼠'], tone: '行动力强，喜欢清楚直接的节奏', action: '适合出行、开张、会友和需要快速推进的事项' },
  { slug: 'goat', animal: '羊', earthlyBranch: '未', elementHint: '土', years: [1967, 1979, 1991, 2003, 2015, 2027], traits: ['柔和', '顾全', '重关系'], best: ['马', '兔', '猪'], steady: ['羊', '猴'], caution: ['牛'], tone: '顾全气氛，适合把人和事慢慢安顿好', action: '适合家宅、修整、协商和需要耐心磨合的事' },
  { slug: 'monkey', animal: '猴', earthlyBranch: '申', elementHint: '金', years: [1968, 1980, 1992, 2004, 2016, 2028], traits: ['灵活', '好学', '重变化'], best: ['蛇', '鼠', '龙'], steady: ['猴', '鸡'], caution: ['虎'], tone: '脑筋活，容易在变化里找到机会', action: '适合学习、交易、改方案和需要机动调整的安排' },
  { slug: 'rooster', animal: '鸡', earthlyBranch: '酉', elementHint: '金', years: [1969, 1981, 1993, 2005, 2017, 2029], traits: ['清楚', '守序', '重细节'], best: ['龙', '牛', '蛇'], steady: ['鸡', '猴'], caution: ['兔'], tone: '重细节和秩序，喜欢把话说清楚', action: '适合签约、核账、整理资料和仪式性安排' },
  { slug: 'dog', animal: '狗', earthlyBranch: '戌', elementHint: '土', years: [1970, 1982, 1994, 2006, 2018, 2030], traits: ['忠厚', '警觉', '重原则'], best: ['兔', '虎', '马'], steady: ['狗', '猪'], caution: ['龙'], tone: '重承诺，也会先替风险把关', action: '适合立约、守成、安家和需要信任背书的事' },
  { slug: 'pig', animal: '猪', earthlyBranch: '亥', elementHint: '水', years: [1971, 1983, 1995, 2007, 2019, 2031], traits: ['宽和', '实在', '重福气'], best: ['虎', '兔', '羊'], steady: ['猪', '鼠'], caution: ['蛇'], tone: '宽厚而不爱争，重实际舒适', action: '适合团聚、置办、修养和需要缓和气氛的安排' },
];

const sourceNotes = [
  '十二生肖与十二地支对应资料',
  '六合、三合、六冲等地支关系资料',
  '传统生肖民俗与本命年习俗资料',
];

function linkSet(animal: ZodiacSeed): InternalLink[] {
  return [
    { href: '/jieri/jiehun/2026', label: '结婚吉日', description: `结合属${animal.animal}避冲筛婚嫁日期。`, family: 'jieri' },
    { href: '/tools/bazi', label: '八字排盘', description: '用出生时间继续核对四柱。', family: 'tool' },
    { href: '/tools/naming', label: '姓名五行', description: '名字五行与基础建议。', family: 'tool' },
  ];
}

function profileFaq(animal: ZodiacSeed): FaqItem[] {
  return [
    {
      id: `${animal.slug}-years`,
      question: `属${animal.animal}常见年份有哪些？`,
      answer: `常见年份包括 ${animal.years.join('、')} 等。春节和立春附近出生的人，建议进一步核对农历岁次。`,
    },
    {
      id: `${animal.slug}-jieri`,
      question: `属${animal.animal}选吉日要看什么？`,
      answer: `核对具体场景的宜项、当日是否冲${animal.animal}或冲相关家人生肖，再结合完整黄历与时辰。`,
    },
    {
      id: `${animal.slug}-branch`,
      question: `属${animal.animal}和地支${animal.earthlyBranch}是什么关系？`,
      answer: `十二生肖分别对应十二地支，属${animal.animal}对应${animal.earthlyBranch}。黄历里的冲煞常用地支表达，所以看生肖时也要看地支。`,
    },
    {
      id: `${animal.slug}-compatibility`,
      question: `属${animal.animal}配对能直接下结论吗？`,
      answer: `不适合直接下结论。配对关系更像沟通提醒，适合提示节奏差异和避冲，不应替代真实相处、责任分工和长期观察。`,
    },
    {
      id: `${animal.slug}-bazi`,
      question: `属${animal.animal}还需要看八字吗？`,
      answer: `如果要做更个人化的判断，生肖只是年支的一层，八字还会看月、日、时。可以先用八字排盘整理四柱，再回来看择日。`,
    },
    {
      id: `${animal.slug}-bad-date`,
      question: `如果当天冲${animal.animal}，一定不能办事吗？`,
      answer: `日常小事不必绝对化。若是结婚、入宅、开业、动土等大事，且冲到关键当事人，建议优先换日或至少避开关键时段。`,
    },
  ];
}

function articleFaq(animal: ZodiacSeed, topic: 'personality' | 'compatibility'): FaqItem[] {
  if (topic === 'personality') {
    return [
      {
        id: `${animal.slug}-personality-border`,
        question: `属${animal.animal}性格可以当成定论吗？`,
        answer: '不适合当成定论。生肖更像民俗语境中的观察入口，仍要结合个人经历、家庭环境和实际选择。',
      },
      {
        id: `${animal.slug}-personality-use`,
        question: `这些性格关键词怎么放进择日里？`,
        answer: `可以用来理解属${animal.animal}的人更重视什么，再配合黄历宜忌、生肖避冲和具体场景选择日期。`,
      },
      {
        id: `${animal.slug}-personality-branch`,
        question: `为什么性格文章会提到${animal.earthlyBranch}？`,
        answer: `${animal.earthlyBranch}是属${animal.animal}对应的地支。黄历里的冲煞常用地支表达，生肖、地支和择日放在一起才容易读懂。`,
      },
      {
        id: `${animal.slug}-personality-overread`,
        question: '读生肖性格时最容易误解什么？',
        answer: '最容易把民俗关键词当成固定标签。更合适的读法是把它当作观察入口，再结合个人经历、家庭环境和现实选择。',
      },
    ];
  }

  return [
    {
      id: `${animal.slug}-compatibility-best`,
      question: `属${animal.animal}和哪些生肖较合？`,
      answer: `传统关系里常把 ${animal.best.join('、')} 视为更容易互补的组合，但实际关系仍要看相处方式。`,
    },
    {
      id: `${animal.slug}-compatibility-caution`,
      question: `遇到相冲生肖就一定不能合作吗？`,
      answer: '不必绝对化。相冲更适合提醒双方提前说清边界、节奏和职责，重要日子再避开明显冲煞。',
    },
    {
      id: `${animal.slug}-compatibility-date`,
      question: '配对关系和结婚吉日怎么一起看？',
      answer: '双方生肖和基本关系适合作为背景，结婚吉日负责筛日期。最终仍要看嫁娶宜项、冲煞、双方时间和仪式安排。',
    },
    {
      id: `${animal.slug}-compatibility-bazi`,
      question: '只看生肖配对够不够？',
      answer: '不够。生肖只是年支层面，若要更细，至少还要看双方出生年月日时，也就是四柱八字。',
    },
  ];
}

function articleBody(animal: ZodiacSeed, topic: 'personality' | 'compatibility'): string {
  if (topic === 'personality') {
    return `说到属${animal.animal}，先不要急着把人归成一种性格。生肖只是民俗里好记的入口，真正落到日常，仍要看一个人怎样做选择。${animal.animal}对应地支${animal.earthlyBranch}，五行提示为${animal.elementHint}，所以常被写成${animal.traits.join('、')}。这些词不是标签，更像提醒：遇到大事时，属${animal.animal}的人往往会在${animal.tone}。若用在择日上，重点不是判断人好坏，而是看这一天的宜忌、冲煞和事情节奏，是否能让这种行事方式更安稳地展开。`;
  }

  return `生肖配对最怕被读成一句话的吉凶。属${animal.animal}常见的合拍关系，会从六合、三合和六冲里找线索：较容易互相补位的生肖有${animal.best.join('、')}，日常相处较平稳的有${animal.steady.join('、')}，需要多留意节奏差异的则是${animal.caution.join('、')}。这套关系适合拿来提醒沟通方式，而不是替人下结论。若要安排婚嫁、合作、签约或开业，可以先避开明显冲${animal.animal}的日子，再回到黄历宜忌和时辰里细看。`;
}

export const zodiacAnimals: ZodiacProfile[] = zodiacSeeds.map((animal) => ({
  id: `zodiac-${animal.slug}`,
  family: 'zodiac',
  slug: animal.slug,
  path: `/zodiac/${animal.slug}`,
  pageType: 'WebPage',
  sitemap: true,
  animal: animal.animal,
  earthlyBranch: animal.earthlyBranch,
  elementHint: animal.elementHint,
  years: animal.years,
  traits: animal.traits,
  compatibility: {
    best: animal.best,
    steady: animal.steady,
    caution: animal.caution,
    note: `属${animal.animal}可参考六合、三合与六冲关系，但仍应结合具体相处和择日场景。`,
  },
  annualFortuneSummary: `${animal.action}。今年若要安排大事，时间边界要清楚，黄历宜忌与生肖避冲也要一起核对。`,
  suitableActions: animal.action.split('、').map((item) => item.replace(/^适合/, '').trim()).filter(Boolean),
  unsuitableActions: ['仓促定案', '只看生肖不看日期', `选择明显冲${animal.animal}的日子`],
  seo: createLocalizedSeo({
    title: `属${animal.animal}生肖查询｜年份性格配对｜今择易`,
    description: `整理属${animal.animal}的年份、地支${animal.earthlyBranch}、五行${animal.elementHint}、性格关键词、配对关系和相关吉日入口。`,
    h1: `属${animal.animal}生肖`,
    deck: `围绕${animal.earthlyBranch}${animal.animal}的年份、性格关键词和择日避冲线索，整理成可继续查询的生肖入口。`,
    keywords: [`属${animal.animal}`, `${animal.animal}年`, '生肖配对', '生肖运势'],
  }),
  body: `属${animal.animal}对应地支${animal.earthlyBranch}，常见关键词可以从${animal.traits.join('、')}几个角度理解。生肖内容不把性格写成绝对结论，而是把年份、地支、五行提示和择日避冲放在一起。若要安排结婚、搬家、开业等事项，生肖冲煞适合作为筛选条件之一，而不是唯一依据。`,
  faq: profileFaq(animal),
  relatedLinks: linkSet(animal),
  seed: {
    model: 'ZodiacProfile',
    slug: animal.slug,
    category: 'zodiac',
    localeStrategy: 'localized-seo-canonical-body',
  },
}));

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
  body: '生肖内容帮助确认生肖、地支和常见年份，也把生肖冲合放回择日场景里使用。生肖不是绝对判断，而是民俗语境中的参考维度；配合黄历宜忌、冲煞、八字排盘与吉日列表，更容易看懂哪些日子适合推进，哪些日子需要多留一层理由。',
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
    {
      id: 'zodiac-branch',
      question: '为什么生肖页一直提到地支？',
      answer: '黄历里的冲、合、刑、害多用地支表达。生肖和地支放在一起，“冲酉”“冲卯”才知道对应到哪个生肖。',
    },
    {
      id: 'zodiac-lunar-boundary',
      question: '春节前后出生的人怎么确认生肖？',
      answer: '春节和立春附近出生的人最容易遇到边界问题。简单阅读可以先按农历年看，重要用途建议结合具体生日和八字排盘核对。',
    },
    {
      id: 'zodiac-compatibility',
      question: '生肖配对主要看什么？',
      answer: '常见阅读会看六合、三合、六冲等关系。它适合提醒沟通节奏和避冲，不适合把关系好坏说成一句绝对断语。',
    },
    {
      id: 'zodiac-jieri',
      question: '生肖页怎么和吉日页一起用？',
      answer: '先在生肖页确认本人和家人的地支，再到吉日页筛场景日期。若候选日冲到关键生肖，就换同月其他推荐日。',
    },
    {
      id: 'zodiac-benzi',
      question: '本命年一定不适合办大事吗？',
      answer: '不必绝对化。本命年在民俗里常被提醒谨慎，但真正安排大事仍要看具体日期、宜忌、冲煞、现实条件和双方准备程度。',
    },
  ],
  relatedLinks: [
    { href: '/jieri', label: '吉日查询', description: '按生肖避冲筛选重要日子。', family: 'jieri' },
    { href: '/tools/bazi', label: '八字排盘', description: '用出生时间排出四柱与五行。', family: 'tool' },
    { href: '/calendar', label: '月历吉凶', description: '回到月份视图连续比较日期。', family: 'core' },
    { href: '/tools/naming', label: '姓名五行', description: '名字单字五行与基础建议。', family: 'tool' },
  ],
  seed: {
    model: 'ContentPage',
    slug: 'zodiac',
    category: 'zodiac',
    localeStrategy: 'localized-seo-canonical-body',
  },
};

export const zodiacArticles: ZodiacArticle[] = zodiacSeeds.flatMap((animal) => {
  const baseLinks = [
    { href: `/zodiac/${animal.slug}`, label: `属${animal.animal}生肖`, description: '返回生肖年份与配对入口。', family: 'zodiac' as const },
    ...linkSet(animal).slice(0, 2),
  ];

  return (['personality', 'compatibility'] as const).map((topic) => {
    const slug = topic === 'personality' ? `${animal.slug}-xingge` : `${animal.slug}-peidui`;
    const title = topic === 'personality' ? `属${animal.animal}的人性格怎么看` : `属${animal.animal}生肖配对与避冲`;
    const deck = topic === 'personality'
      ? `从地支${animal.earthlyBranch}、五行${animal.elementHint}和民俗关键词，温和地理解属${animal.animal}的行事方式。`
      : `把六合、三合、六冲当作关系提醒，整理属${animal.animal}在婚嫁、合作和择日里的参考线索。`;
    const body = articleBody(animal, topic);

    return {
      id: `zodiac-article-${slug}`,
      family: 'zodiac',
      slug,
      path: `/zodiac/${animal.slug}/${slug}`,
      pageType: 'Article',
      sitemap: true,
      animalSlug: animal.slug,
      topic,
      authorName: '今择易编辑部',
      category: 'zodiac',
      readingMinutes: 3,
      sourcePolicy: 'source-synthesized-required',
      sourceNotes,
      paragraphs: [
        body,
        topic === 'personality'
          ? `若把这些线索放回生活里，属${animal.animal}的人在重要安排前，通常需要一个能让自己踏实的节奏。比如${animal.action}，就不只是在挑一个“好日子”，也是在挑一个与人、事、时间都能配合的入口。`
          : `配对文章适合读关系里的节奏差异。真正决定事情能不能成，仍要回到沟通、责任和日期安排；生肖只是把这些差异提前摆到桌面上。`,
      ],
      seo: createLocalizedSeo({
        title: `${title}｜今择易`,
        description: `${deck} 结合生肖年份、配对关系、黄历吉日和八字工具继续查询。`,
        h1: title,
        deck,
        keywords: [`属${animal.animal}`, `${animal.animal}性格`, `${animal.animal}配对`, '生肖文章'],
      }),
      body,
      faq: articleFaq(animal, topic),
      relatedLinks: baseLinks,
      seed: {
        model: 'ContentPage',
        slug,
        category: 'zodiac',
        localeStrategy: 'localized-seo-canonical-body',
      },
    };
  });
});

export const zodiacHubPages = zodiacAnimals;

export function getZodiacProfile(slug: string): ZodiacProfile | undefined {
  return zodiacAnimals.find((animal) => animal.slug === slug);
}

export function getZodiacAnimal(slug: string): ZodiacProfile | undefined {
  return getZodiacProfile(slug);
}

export function getZodiacArticlesForAnimal(animalSlug: string): ZodiacArticle[] {
  return zodiacArticles.filter((article) => article.animalSlug === animalSlug);
}

export function getZodiacArticle(animalSlug: string, slug: string): ZodiacArticle | undefined {
  return zodiacArticles.find((article) => article.animalSlug === animalSlug && article.slug === slug);
}
