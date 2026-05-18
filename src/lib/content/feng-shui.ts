import { createLocalizedSeo } from './localize';
import type { ArticleContent, FaqItem, IndexablePage, InternalLink } from './types';

export type FengShuiCategorySlug = 'home' | 'office' | 'shop' | 'directions' | 'wealth';

export interface FengShuiCategory {
  slug: FengShuiCategorySlug;
  name: string;
  summary: string;
  icon: string;
}

export interface FengShuiArticle extends ArticleContent {
  categorySlug: FengShuiCategorySlug;
  checklist: string[];
  sections: Array<{
    heading: string;
    body: string;
  }>;
  sourceNotes: string[];
}

export const fengShuiCategories: FengShuiCategory[] = [
  { slug: 'home', name: '家居', icon: '/assets/almanac-icons/lotus.png', summary: '从玄关、客厅、卧室和厨房动线入手，让日常空间更顺。' },
  { slug: 'office', name: '办公室', icon: '/assets/almanac-icons/compass.png', summary: '关注座位背靠、光线、动线和会议协作，让办公空间更稳定。' },
  { slug: 'shop', name: '商铺', icon: '/assets/almanac-icons/auspicious-seal.png', summary: '围绕门面、收银、货架和开业动线，整理可操作的商铺检查点。' },
  { slug: 'directions', name: '方位', icon: '/assets/almanac-icons/mountain.png', summary: '把门、床、桌和动工位置的取舍讲清楚。' },
  { slug: 'wealth', name: '财位', icon: '/assets/almanac-icons/sprout.png', summary: '把明财位、整洁度、光线和日常维护讲清楚，避免过度许诺。' },
];

const sourceNotes = [
  '传统阳宅风水场景资料',
  '现代住宅与商业空间动线资料',
  '黄历择日与动工开业场景资料',
];

function categoryBySlug(slug: FengShuiCategorySlug): FengShuiCategory {
  return fengShuiCategories.find((category) => category.slug === slug)!;
}

function linksFor(category: FengShuiCategorySlug): InternalLink[] {
  const shared: InternalLink[] = [
    { href: '/calendar', label: '月历吉凶', description: '按月份比较每日吉凶与节气。', family: 'core' },
    { href: '/tools/bazi', label: '八字排盘', description: '用出生资料排出四柱。', family: 'tool' },
  ];

  if (category === 'shop') {
    return [
      { href: '/jieri/kaiye/2026', label: '开业吉日', description: '开业、交易、立券相关日子。', family: 'jieri' },
      { href: '/tools/naming', label: '店名五行', description: '用姓名五行工具初看店名字义。', family: 'tool' },
      ...shared.slice(0, 1),
    ];
  }

  if (category === 'home') {
    return [
      { href: '/jieri/banjia/2026', label: '搬家吉日', description: '入宅、移徙、安床相关日子。', family: 'jieri' },
      { href: '/jieri/zhuangxiu/2026', label: '装修吉日', description: '修造、动土、上梁相关日子。', family: 'jieri' },
      ...shared.slice(0, 1),
    ];
  }

  if (category === 'office') {
    return [
      { href: '/jieri/qianyue/2026', label: '签约吉日', description: '交易、立券、纳财相关日子。', family: 'jieri' },
      ...shared,
    ];
  }

  if (category === 'wealth') {
    return [
      { href: '/jieri/kaiye/2026', label: '纳财开业吉日', description: '开市、交易、纳财日期。', family: 'jieri' },
      ...shared,
    ];
  }

  return [
    { href: '/jieri/zhuangxiu/2026', label: '动工吉日', description: '动土、修造相关日子。', family: 'jieri' },
    ...shared,
  ];
}

function faqFor(category: FengShuiCategorySlug, title: string): FaqItem[] {
  return [
    {
      id: `${category}-${title}-date`,
      question: '风水调整一定要择日吗？',
      answer: '普通整理、清洁和收纳以安全便利为先；涉及动土、装修、开业、搬家等大事，再配合黄历宜忌和吉日查询。',
    },
    {
      id: `${category}-${title}-promise`,
      question: '照着清单做就一定有效吗？',
      answer: '不能作保证。清单帮助检查空间秩序、动线和传统避忌，实际效果还要看居住习惯、行业环境和执行细节。',
    },
    {
      id: `${category}-${title}-first-step`,
      question: '风水调整第一步应该做什么？',
      answer: '先做不花钱也不冒险的部分：清理通道、改善光线、处理潮湿和杂物。等空间基本顺了，再考虑方位、摆设和择日。',
    },
    {
      id: `${category}-${title}-taboo`,
      question: '看到禁忌就一定要马上改吗？',
      answer: '不用急。先判断它是否真的影响安全、通风、睡眠、工作或客流。若只是象征性问题，可以排在真实生活问题之后处理。',
    },
    {
      id: `${category}-${title}-rent`,
      question: '租房或租办公室也能调整吗？',
      answer: '可以从可移动、可恢复的动作开始，比如灯光、收纳、桌椅位置和入口整洁。不要为了风水做破坏结构或违反租约的改动。',
    },
    {
      id: `${category}-${title}-date-link`,
      question: '什么时候需要同时看吉日？',
      answer: '普通整理不必特意择日。涉及开业、入宅、动土、安床、装修、上梁等仪式性或工程性动作时，可配合黄历和吉日列表核对。',
    },
  ];
}

const articleSeeds: Array<{
  category: FengShuiCategorySlug;
  slug: string;
  title: string;
  deck: string;
  checklist: string[];
  sections: Array<{ heading: string; body: string }>;
}> = [
  {
    category: 'home',
    slug: 'xuan-guan-ke-ting',
    title: '玄关与客厅风水检查',
    deck: '从入门第一眼、客厅明堂和日常动线开始，让家里的气口更顺。',
    checklist: ['入门通道保持明亮，不堆鞋盒杂物', '客厅中心留出走动空间，不让茶几堵住主通道', '沙发背后尽量有墙或稳定柜体，不长期背空'],
    sections: [
      { heading: '入门处要顺', body: '玄关是家里每天最早被使用的位置。传统说法里讲气口，落到生活里，就是门口能不能打开、鞋物会不会绊脚、光线会不会让人一进门就压抑。这里清爽，比急着摆吉祥物更有用。' },
      { heading: '客厅重在聚而不堵', body: '客厅适合有一块相对完整的活动面。沙发、茶几和电视柜之间要留出顺畅距离，家人坐下说话、孩子走动、客人进出都不别扭，空间自然就稳。若要添置摆件，关键是别妨碍清洁和走动。' },
    ],
  },
  {
    category: 'home',
    slug: 'wo-shi-an-chuang',
    title: '卧室安床与睡眠动线',
    deck: '卧室风水重在床位安全感、门窗关系和夜间动线，不把休息区做成杂物区。',
    checklist: ['床头尽量靠实墙，避免长期悬空', '床边至少一侧留出顺畅起身通道', '镜面不直接照向睡眠位置，夜间少受惊扰'],
    sections: [
      { heading: '床位求安稳', body: '卧室最重要的是能休息。床头靠实、左右能起身、门窗不直冲枕边，这些看似朴素，却决定了人在房间里是否放松。传统安床讲究日子，日常布置更重安全和舒适。' },
      { heading: '少一点杂物，气息更清', body: '床底、床头和窗边长期堆放杂物，会让清洁和通风都变麻烦。风水里说藏污纳浊，现实里就是灰尘、潮气和心理负担一起增加。睡前能少看见一堆待处理的东西，人的心也容易慢慢安下来，第二天起身也不容易被杂乱牵住情绪。' },
    ],
  },
  {
    category: 'office',
    slug: 'gong-wei-zuo-xiang',
    title: '办公室工位坐向怎么安排',
    deck: '办公桌重在背靠、视线和协作距离，让人坐得稳，也方便真正工作。',
    checklist: ['座位背后避免主通道直冲', '电脑屏幕不正对强光窗面', '常用文件和工具放在伸手可及的位置'],
    sections: [
      { heading: '背后稳定，心神才稳', body: '很多办公室问题不是神秘方位造成，而是座位背后人来人往，注意力被不断打断。若条件允许，背后有墙、柜或低隔断，会比空荡通道更容易让人进入状态。' },
      { heading: '坐向也要服从工作流', body: '朝向不能只看罗盘，还要看团队沟通、屏幕反光、插座位置和会议动线。好的工位让人少分心，能快速拿到需要的资料，也能在被叫到时自然回应，而不是一直被背后的声音打断。若要调整座位，最好先试坐半天，看视线、噪音和取物是否真的顺手。' },
    ],
  },
  {
    category: 'office',
    slug: 'hui-yi-shi-dong-xian',
    title: '会议室与协作区风水',
    deck: '会议空间重在秩序和可见度，桌椅、门口、白板和光线都要服务沟通。',
    checklist: ['主位能看到门口但不被门直冲', '白板或屏幕前不堆放杂物', '会议桌周围保留完整进出通道'],
    sections: [
      { heading: '会议室怕乱，也怕压', body: '会议室若一开门就见杂物、线缆和堆叠椅子，讨论还没开始，气氛就先乱了。保持入口清楚、桌面干净，是最基础的空间礼貌。' },
      { heading: '协作区要留转圜', body: '协作区不宜只追求坐满。风水讲回旋，现实里是让人能走、能站、能看见彼此，意见自然比较容易接住。若每次起身都要挪椅子、绕线缆，讨论很快就会被琐碎打散。一个好用的协作区，应该让人愿意短暂停留，而不是开完会就急着离开。' },
    ],
  },
  {
    category: 'shop',
    slug: 'men-mian-shou-yin',
    title: '商铺门面与收银位置',
    deck: '门面负责让人愿意进来，收银位负责让交易顺手，两处都要清楚明亮。',
    checklist: ['门口招牌、营业信息和入口不互相遮挡', '收银台能看见主要入口但不阻挡客流', '通往热销区的动线保持简单直接'],
    sections: [
      { heading: '门面先讲清楚', body: '商铺的第一层风水，是路过的人能不能看懂你卖什么、从哪里进、营业到几点。门口若被堆货、海报和杂物挡住，再好的摆设也很难发挥作用。' },
      { heading: '收银位要稳而不堵', body: '收银台适合放在能照看入口和货区的位置，但不能卡住客人进出。传统说守财，落到店里就是交易动线顺、找零扫码方便、员工不慌张。客人结账时少等一步，门店的气就顺一分，也更容易把最后的体验留得干净利落，复购也更自然。' },
    ],
  },
  {
    category: 'shop',
    slug: 'kai-ye-bu-ju',
    title: '开业前商铺布置清单',
    deck: '开业前把灯光、动线、收银和开门时间排好，仪式才接得住。',
    checklist: ['开业前完成水电、招牌、收银和消防检查', '主通道不摆临时箱包，避免首日拥堵', '若做仪式，提前核对开业吉日和当日时辰'],
    sections: [
      { heading: '店先开顺', body: '开业择日有仪式感，但真正承接好运的是店铺本身。灯是否亮、货是否齐、收银是否能用、员工是否知道安排，这些比临时加摆件更关键。' },
      { heading: '开门气氛要明朗', body: '首日可以重视门口、橱窗和收银区的整洁。让第一批客人走得顺、看得清、问得到人，就是商铺风水里最实在的旺气。开业当天少做临时大调整，把精力留给接待和复盘；若要择日，也把布置完成时间提前到前一天，别让仪式压过经营本身。' },
    ],
  },
  {
    category: 'directions',
    slug: 'men-chuang-fang-wei',
    title: '门窗方位与通风采光',
    deck: '方位不只看吉凶字眼，也要看门窗是否形成舒适的风、光和隐私边界。',
    checklist: ['门窗能通风，但不形成长期强风直吹坐卧区', '采光面保持干净，厚重遮挡物适度减少', '隐私不足的位置用帘、屏或柜体缓冲'],
    sections: [
      { heading: '方位先和风光有关', body: '谈门窗方位，不必一开始就陷入复杂术语。每天的风从哪里来，光照什么时候最强，邻里视线会不会直入室内，这些才是方位在生活里的第一层作用。' },
      { heading: '直冲要学会缓', body: '门窗相对、走廊直冲、风口直吹，都会让空间不够安定。可以用帘、柜、植物或动线调整做缓冲，重点是柔和，不是把空间堵死。缓冲之后仍要能通风、能采光，才算真正好用，也不会为了避忌牺牲日常便利和空间尺度。' },
    ],
  },
  {
    category: 'directions',
    slug: 'dong-gong-fang-wei',
    title: '装修动工方位怎么避忌',
    deck: '动工方位要同时看安全、施工顺序和黄历提示，不把传统避忌和工程管理分开。',
    checklist: ['确认承重墙、水电和消防限制', '动土、拆改、上梁等大动作核对黄历宜忌', '施工入口和材料堆放避开主要生活通道'],
    sections: [
      { heading: '动工不只是一锤子', body: '装修动工常被问到方位吉凶。实际安排里，结构安全、物业规定和施工顺序更靠前；黄历里的修造、动土、上梁等宜项适合做辅助核对。日子选得稳，现场也要稳。' },
      { heading: '方位避忌要落到现场', body: '传统上有些年份和方位会被提醒谨慎，落到家里可以理解为少在敏感位置长期大拆大改。若必须施工，就把保护、清洁、噪音和时间安排做得更稳，并提前给家人和邻里留出缓冲。这样即使不谈玄学，工程本身也更少出错。' },
    ],
  },
  {
    category: 'wealth',
    slug: 'ming-cai-wei',
    title: '明财位怎么找与怎么养',
    deck: '明财位常从入门对角线理解，重点是干净、明亮、稳定，不是堆满招财物。',
    checklist: ['入门对角位置保持整洁明亮', '避免把垃圾桶、杂物箱长期放在财位附近', '可放稳定柜体、绿植或常用收纳，但不妨碍通行'],
    sections: [
      { heading: '找得到，也养得住', body: '民间常把入门后的对角位置称为明财位。这个说法适合做空间提醒：那里若总是堆满杂物、光线昏暗、走路磕碰，人的感受自然不会好。' },
      { heading: '财位贵在稳定', body: '财位不需要摆得复杂。干净、明亮、少移动、不过度潮湿，比摆满象征物更重要。若要放植物或收纳，也要以好打理、不挡路为前提；长期能维持，才比一时热闹更有意义。每周顺手擦拭和整理，比偶尔大张旗鼓布置更可靠，也更接近日常的养财。' },
    ],
  },
  {
    category: 'wealth',
    slug: 'cai-wei-jin-ji',
    title: '财位布置常见禁忌',
    deck: '财位禁忌可以理解为不脏、不暗、不动荡、不压迫，让空间保持可持续维护。',
    checklist: ['不把破损物、过期物长期留在财位', '不让大型尖角家具直接压迫坐卧区', '保持灯光和通风，避免潮湿霉味'],
    sections: [
      { heading: '禁忌背后是维护成本', body: '所谓财位忌脏、忌暗、忌乱，本质上是提醒人别把重要角落变成无人维护的死角。一个角落若长期积灰、潮湿、有异味，很难给人稳定和富足的感受。' },
      { heading: '少承诺，多检查', body: '财位布置不应被说成必然发财。它更像一张空间清单，提醒你把光线、收纳、动线和象征物控制在合适范围，长期看才舒服。真正可持续的布置，应该是家人愿意每天顺手维护的样子，而不是越摆越满、越看越累的角落。' },
    ],
  },
];

export const fengShuiIndexPage: IndexablePage = {
  id: 'feng-shui-index',
  family: 'feng-shui',
  slug: 'feng-shui',
  path: '/feng-shui',
  pageType: 'WebPage',
  sitemap: true,
  seo: createLocalizedSeo({
    title: '风水知识｜家居办公室商铺方位财位｜今择易',
    description: '整理家居、办公室、商铺、方位、财位等风水基础知识，搭配黄历、吉日和工具入口。',
    h1: '风水知识',
    deck: '以实用场景整理风水文章入口，把空间检查、动工择日和方位提示连在一起。',
    keywords: ['风水知识', '家居风水', '办公室风水', '财位', '方位'],
  }),
  body: '风水内容不是玄而又玄的断语，而是面向日常空间的检查清单。家居、办公室、商铺、方位和财位五类内容聚焦最常见的问题：哪里需要保持通畅，哪些位置适合安静，动工和开门是否需要看日子，财位布置又该避开什么。',
  faq: [
    {
      id: 'feng-shui-where',
      question: '风水文章会从哪些场景开始？',
      answer: '从家居、办公室、商铺、方位和财位五类入手，每篇都配合实际检查点和相关择日入口。',
    },
    {
      id: 'feng-shui-date',
      question: '风水调整需要看黄历吗？',
      answer: '涉及动土、装修、开业、入宅等事项时建议同时核对黄历宜忌和吉日列表，普通整理则以安全和便利为先。',
    },
    {
      id: 'feng-shui-beginner',
      question: '看风水从哪几件事开始？',
      answer: '门口是否通畅、采光是否够、坐卧是否安稳、杂物是否长期堆积。把这些现实问题处理好，方位和财位才更容易读懂。',
    },
    {
      id: 'feng-shui-compass',
      question: '没有罗盘还能看风水文章吗？',
      answer: '可以。风水内容优先解释动线、光线、整洁和使用习惯，方位只是其中一层，不需要一开始就懂复杂罗盘。',
    },
    {
      id: 'feng-shui-wealth',
      question: '财位是不是摆东西越多越好？',
      answer: '不是。财位更重视干净、明亮、稳定和便于维护。摆得过满、积灰、挡路，反而违背了空间整理的初衷。',
    },
    {
      id: 'feng-shui-cross-link',
      question: '风水页怎么和吉日页一起使用？',
      answer: '确认要做的动作，比如入宅、动土、安床或开业；再到吉日页按对应场景筛日期，打开黄历详情看时辰。',
    },
    {
      id: 'feng-shui-safety',
      question: '风水建议和安全规范冲突时听哪个？',
      answer: '优先听安全规范和专业要求。承重墙、水电、消防、租约和法律限制不能因为风水建议被忽略。',
    },
  ],
  relatedLinks: [
    { href: '/jieri/zhuangxiu/2026', label: '装修吉日', description: '装修动工相关吉日。', family: 'jieri' },
    { href: '/jieri/kaiye/2026', label: '开业吉日', description: '商铺开张相关吉日。', family: 'jieri' },
    { href: '/calendar', label: '月历吉凶', description: '按月比较动工与整理日期。', family: 'core' },
    { href: '/tools/bazi', label: '八字排盘', description: '用出生资料排出四柱。', family: 'tool' },
  ],
  seed: {
    model: 'ContentPage',
    slug: 'feng-shui',
    category: 'feng-shui',
    localeStrategy: 'localized-seo-canonical-body',
  },
};

export const fengShuiArticles: FengShuiArticle[] = articleSeeds.map((seed) => {
  const category = categoryBySlug(seed.category);
  const path = `/feng-shui/${seed.category}/${seed.slug}`;

  return {
    id: `feng-shui-${seed.category}-${seed.slug}`,
    family: 'feng-shui',
    slug: seed.slug,
    path,
    pageType: 'Article',
    sitemap: true,
    categorySlug: seed.category,
    authorName: '今择易编辑部',
    category: category.name,
    readingMinutes: 4,
    sourcePolicy: 'source-synthesized-required',
    sourceNotes,
    checklist: seed.checklist,
    sections: seed.sections,
    seo: createLocalizedSeo({
      title: `${seed.title}｜今择易`,
      description: `${seed.deck} 配合黄历、吉日和工具入口，整理成可执行的空间检查清单。`,
      h1: seed.title,
      deck: seed.deck,
      keywords: [seed.title, `${category.name}风水`, '风水清单', '今择易'],
    }),
    body: seed.sections.map((section) => section.body).join('\n'),
    faq: faqFor(seed.category, seed.slug),
    relatedLinks: linksFor(seed.category),
    seed: {
      model: 'FengShuiArticle',
      slug: seed.slug,
      category: seed.category,
      localeStrategy: 'localized-seo-canonical-body',
    },
  };
});

export function getFengShuiCategory(slug: string): FengShuiCategory | undefined {
  return fengShuiCategories.find((category) => category.slug === slug);
}

export function getFengShuiArticlesByCategory(categorySlug: string): FengShuiArticle[] {
  return fengShuiArticles.filter((article) => article.categorySlug === categorySlug);
}

export function getFengShuiArticle(categorySlug: string, slug: string): FengShuiArticle | undefined {
  return fengShuiArticles.find((article) => article.categorySlug === categorySlug && article.slug === slug);
}
