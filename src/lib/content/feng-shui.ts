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
  { slug: 'home', name: '家居', icon: '/assets/image2/feng-shui/home.png', summary: '从玄关、客厅、卧室和厨房动线入手，让日常空间更顺。' },
  { slug: 'office', name: '办公室', icon: '/assets/image2/feng-shui/office.png', summary: '关注座位背靠、光线、动线和会议协作，让办公空间更稳定。' },
  { slug: 'shop', name: '商铺', icon: '/assets/image2/feng-shui/shop.png', summary: '围绕门面、收银、货架和开业动线，整理可操作的商铺检查点。' },
  { slug: 'directions', name: '方位', icon: '/assets/image2/feng-shui/directions.png', summary: '把门、床、桌和动工位置的取舍讲清楚。' },
  { slug: 'wealth', name: '财位', icon: '/assets/image2/feng-shui/wealth.png', summary: '把明财位、整洁度、光线和日常维护讲清楚，避免过度许诺。' },
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
      { heading: '背后稳定，心神才稳', body: '很多办公室问题的根源在座位背后人来人往，注意力被不断打断，不必急着归因到神秘方位。若条件允许，背后有墙、柜或低隔断，会比空荡通道更容易让人进入状态。' },
      { heading: '坐向也要服从工作流', body: '朝向不能只看罗盘，还要看团队沟通、屏幕反光、插座位置和会议动线。好的工位让人少分心，能快速拿到需要的资料，也能在被叫到时自然回应，减少背后声音的持续打断。若要调整座位，最好先试坐半天，看视线、噪音和取物是否真的顺手。' },
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
      { heading: '协作区要留转圜', body: '协作区不宜只追求坐满。风水讲回旋，现实里是让人能走、能站、能看见彼此，意见自然比较容易接住。若每次起身都要挪椅子、绕线缆，讨论很快就会被琐碎打散。一个好用的协作区，应该让人愿意短暂停留，减少开完会就急着离开的压迫感。' },
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
      { heading: '直冲要学会缓', body: '门窗相对、走廊直冲、风口直吹，都会让空间不够安定。可以用帘、柜、植物或动线调整做缓冲，重点是柔和，空间仍要保持可通行。缓冲之后仍要能通风、能采光，才算真正好用，也不会为了避忌牺牲日常便利和空间尺度。' },
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
    deck: '明财位常从入门对角线理解，重点是干净、明亮、稳定，少堆招财物。',
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
      { heading: '少承诺，多检查', body: '财位布置不应被说成必然发财。它更像一张空间清单，提醒你把光线、收纳、动线和象征物控制在合适范围，长期看才舒服。真正可持续的布置，应该是家人愿意每天顺手维护的样子，避免越摆越满、越看越累。先留出能看见、能清洁、能通过的空间，再谈装饰。' },
    ],
  },
  {
    category: 'home',
    slug: 'chu-fang-shui',
    title: '厨房风水检查：灶位、水火关系与收纳动线',
    deck: '阳宅三要以灶为重，厨房风水的核心在灶台位置、水火距离和做饭动线是否顺畅。',
    checklist: ['灶台不与水槽紧贴或正对，中间留出台面缓冲区', '灶台背后靠实墙，不对窗户风口直吹明火', '冰箱、备菜区、灶台和出菜口形成顺畅的取—洗—切—炒动线'],
    sections: [
      { heading: '灶位要稳，水火要分', body: '《阳宅三要》把灶列为宅之三要之一，重点落在灶在厨房中的位置和朝向。落到现代厨房，灶台背后应靠实墙，避免悬空或正对窗户风口，否则明火受风不稳，日常做饭也不安心。水槽与灶台不宜紧贴或正对面，中间隔一段台面，既符合操作分区逻辑，也避免传统所说的水火相冲。冰箱属水，也不宜紧挨灶台。实际操作中，灶台与水槽之间保留至少60厘米的台面，就是最实用的缓冲。灶台上方不宜正对横梁或吊柜尖角下压，若无法改动，可调整灶位或做圆角处理。' },
      { heading: '收纳动线决定做饭效率', body: '厨房风水的第二层是动线。《鲁班经》讲厨灶布置要便於取用，现代理解就是从冰箱取菜、到水槽清洗、到台面备菜、到灶台烹饪、到出菜装盘，这条线不能反着走或反复折返。刀具、调料和常用锅具应放在灶台伸手可及的位置，不弯腰不踮脚。碗碟放在出菜口附近，减少端着热锅绕路。油烟机排风管尽量走短直路径，弯头多了排烟效果差，厨房长期油腻也会影响整体卫生感。垃圾桶放在水槽旁而非灶台旁，避免油烟和湿垃圾混在一起。地柜内部用分隔件把锅、盆、瓶分类，拿取时不翻找，做饭心态也更稳。' },
    ],
  },
  {
    category: 'home',
    slug: 'er-tong-fang-shui',
    title: '儿童房风水检查：书桌朝向、床位与成长空间',
    deck: '儿童房风水重在安全、光线和学习动线，让孩子有稳定的休息区和专注的学习角。',
    checklist: ['书桌尽量靠窗侧光放置，不背对门口', '床位有床头靠板，不悬空或紧贴窗户', '房间不堆过多玩具和杂物，留出地面活动空间'],
    sections: [
      { heading: '书桌朝向讲安全和专注', body: '儿童房的书桌是重点。《八宅明镜》提到文昌位宜静宜明，落到现代儿童房，书桌应放在光线充足的位置，最好靠窗但侧光入射，避免阳光直射屏幕或纸面造成眩光。书桌不宜背对门口——孩子坐下来后若感觉背后有人进出，注意力容易被打断。若房间格局限制只能背门，可在桌面放一面小镜或保持门常开，减少心理不安。桌面不宜过大，够放书本和文具即可，桌面太空或太满都不利于专注。书桌上方不挂重物或尖角装饰，避免压迫感。台灯放在写字手的对侧，不产生手影，色温选4000K左右的中性白光，对眼睛更友好。' },
      { heading: '床位和活动空间要安全', body: '儿童床位应有稳固的床头板，床头靠实墙，让孩子睡觉时有依靠感。床不宜紧贴窗户，一则避免冷风直吹，二则减少坠落风险；若房间小必须靠窗，窗户应加装限位器和防护栏。床底保持通畅，不塞满收纳箱，便于清洁也减少积尘过敏。房间家具边角做圆角处理或加防撞条，这是比任何方位都优先的安全事项。玩具和书本要有固定收纳位，地面留出至少一平方米的活动区，让孩子能坐能爬能玩。墙面颜色不宜过深或过花，浅暖色系对情绪更稳定。《阳宅爱众篇》提到小儿房宜简净，意思就是东西少一点、空间清一点，孩子反而更容易安定下来。' },
    ],
  },
  {
    category: 'home',
    slug: 'shu-fang-shu-zhuo',
    title: '书房与书桌风水检查：文昌位、光线与安静区',
    deck: '书房风水重在安静、光线和书桌位置，让阅读和工作的空间能持续保持专注。',
    checklist: ['书桌背后靠墙或柜体，面前留出视线空间', '书房远离厨房和卫生间噪音源', '桌面只放当前要用的资料，不长期堆积文件'],
    sections: [
      { heading: '文昌位不是玄学，是安静的好位置', body: '传统风水里的文昌位，本质是找到宅中适合安静阅读、思考的位置。《八宅明镜》以宅卦定文昌，但实际操作中，书房选在远离入户门、不紧邻厨房和卫生间的安静角落，比精确计算方位更实用。书房门不宜正对卫生间门或厨房门，避免油烟和潮气侵入。若家中没有独立书房，在卧室一角用书柜或屏风隔出半封闭区域，也能起到类似效果。书桌放置时，背后靠墙给人稳定感，面前留出足够空间不产生压迫。窗外视野开阔更好，若对面是近距墙壁或杂物棚，可拉薄帘柔化。' },
      { heading: '光线和桌面管理决定效率', body: '书房光线应以自然光为主、人工光为辅。书桌最好靠窗放置，白天利用侧光，减少台灯依赖；傍晚和夜间则需要一盏主灯加一盏台灯，避免只开台灯造成室内外明暗对比过大而视觉疲劳。《鲁班经》讲究书房器物各安其位，现代理解就是桌面管理：当前在读的书和要用的资料放桌面，其他文件归入书架或抽屉。桌面长期堆满未处理的文件，人坐下就会感到压力。显示器或电脑不用时可关闭或调暗屏幕，减少分心。书架上的书按使用频率分层，常用的在中层伸手可及，不常用的放高层或低层。书房窗帘选遮光适中的款式，太暗容易困倦，太亮又干扰屏幕阅读。' },
    ],
  },
  {
    category: 'directions',
    slug: 'wei-sheng-jian',
    title: '卫生间风水检查：位置避忌、通风防潮与化解方法',
    deck: '卫生间风水核心在通风、干湿分离和位置避忌，防潮防臭比摆化解物更有效。',
    checklist: ['卫生间保持排风通畅，排风扇定期清洁', '马桶盖不用时合上，卫生间门随手关闭', '干湿分离做好，地面不长期积水'],
    sections: [
      { heading: '位置避忌讲的是生活逻辑', body: '传统阳宅风水对卫生间的忌讳，大多源于通风、采光和气味管理。《阳宅三要》把厨、灶、门列为三要，卫生间虽未单独列出，但后世阳宅诸书普遍认为卫生间不宜居中、不宜对灶、不宜对床。落到实际：卫生间居中会导致排气管道长、通风差，异味扩散到全屋；卫生间门对厨房门，油烟和潮气交叉污染；卫生间门对卧室床头，夜间冲水声和潮气影响睡眠。这些都能通过调整门位、加装隔断或改变床头朝向来解决。若卫生间已居中无法改动，重点加强排风——排风扇选风量大于150m³/h的型号，管道尽量短直通向室外，不走公共烟道。' },
      { heading: '防潮防臭才是真正的化解', body: '很多卫生间风水问题的根源是潮气和异味。与其摆化解物品，不如把干湿分离做到位。淋浴区用玻璃隔断或挡水条分区，洗完澡用刮水器把地面水刮干，比任何化煞物都管用。地漏选深水封型或磁吸型，定期清理毛发，防止返味。洗手台下方管道接口检查是否密封，老旧硅胶及时更换。毛巾架尽量靠近窗户或排风扇位置，加快晾干。马桶水箱内可放缓释清洁块，减少水垢和异味。卫生间门建议常关，尤其是卧室内的卫生间；若通风条件差，可在门下方留2至3厘米缝隙作为进风补给，形成排风扇抽风、门缝进风的循环。' },
    ],
  },
  {
    category: 'directions',
    slug: 'yang-tai-hua-yuan',
    title: '阳台与花园风水检查：纳气口、植物选择与晾晒动线',
    deck: '阳台是住宅的纳气口之一，风水重点在通畅、采光和植物维护，不把阳台做成杂物间。',
    checklist: ['阳台不堆废旧家具和长期不用的杂物', '晾晒衣物不遮挡阳台主要采光面', '植物选择易打理品种，枯叶及时清理'],
    sections: [
      { heading: '阳台是纳气口，不是储物间', body: '《阳宅爱众篇》讲宅之气从门入、从窗纳，阳台作为住宅对外最大的开口之一，承担着采光和通风的重要功能。很多家庭把阳台变成杂物堆放区，废旧家具、纸箱、不用的电器往阳台一放就是几年，结果阳台采光变差、通风受阻、灰尘积累。阳台应保持通畅：主要通道不被大型物品堵死，栏杆上不挂满物品影响外观和安全。若有封阳台的需求，选透明度好的玻璃，不为了隐私把阳台封成暗室。晾晒动线要合理——洗衣机到晾晒区的路线应短而直，晾衣架升降顺畅，湿衣服不经过客厅就到达阳台。' },
      { heading: '植物选择和维护比品种更关键', body: '阳台种植物是好事，但品种选择和日常维护比种什么更关键。《鲁班经》提到庭前宜植吉祥草木，实际建议选适合本地气候、易打理的品种。朝南阳台光照充足，可种月季、茉莉、薄荷等喜阳植物；朝北阳台光照少，选绿萝、吊兰、龟背竹等耐阴品种。花盆底部要有排水孔，托盘不积水，避免蚊虫滋生和阳台地面长期潮湿。枯叶、落花及时清理，不要让植物区变成腐叶堆。大型盆栽不放在阳台承重薄弱的位置，尤其是外挂式阳台。藤蔓类植物不任其攀爬到外墙和邻居家，避免引起纠纷。有花园的家庭，灌溉水不长期积在低洼处，排水坡度做好，雨后半小时内应无明显积水。' },
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
  body: '风水内容以日常空间检查清单为主，少讲玄而又玄的断语。家居、办公室、商铺、方位和财位五类内容聚焦最常见的问题：哪里需要保持通畅，哪些位置适合安静，动工和开门是否需要看日子，财位布置又该避开什么。每一类都尽量落到可观察、可调整的空间细节。',
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
      question: '财位摆东西越多越好吗？',
      answer: '不用一概而论。财位更重视干净、明亮、稳定和便于维护。摆得过满、积灰、挡路，反而违背了空间整理的初衷。',
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
