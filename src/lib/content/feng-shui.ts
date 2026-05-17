import { createLocalizedSeo } from './localize';
import type { IndexablePage } from './types';

export const fengShuiCategories = [
  { slug: 'home', name: '家居', icon: '/assets/almanac-icons/lotus.png' },
  { slug: 'office', name: '办公室', icon: '/assets/almanac-icons/compass.png' },
  { slug: 'shop', name: '商铺', icon: '/assets/almanac-icons/auspicious-seal.png' },
  { slug: 'directions', name: '方位', icon: '/assets/almanac-icons/mountain.png' },
  { slug: 'wealth', name: '财位', icon: '/assets/almanac-icons/sprout.png' },
] as const;

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
  body: '风水内容在今择易里不是玄而又玄的断语，而是面向日常空间的检查清单。家居、办公室、商铺、方位和财位五类内容会优先回答用户最常遇到的问题：哪里需要保持通畅，哪些位置适合安静，动工和开门是否需要看日子，财位布置又该避开什么。后续文章会和黄历、吉日、装修动工、开业择日等入口互相连接，形成可阅读也可操作的知识路径。',
  faq: [
    {
      id: 'feng-shui-where',
      question: '风水文章会从哪些场景开始？',
      answer: '先从家居、办公室、商铺、方位和财位五类入手，每篇都配合实际检查点和相关择日入口。',
    },
    {
      id: 'feng-shui-date',
      question: '风水调整需要看黄历吗？',
      answer: '涉及动土、装修、开业、入宅等事项时建议同时查看黄历宜忌和吉日列表，普通整理则以安全和便利为先。',
    },
  ],
  relatedLinks: [
    { href: '/jieri/zhuangxiu/2026', label: '装修吉日', description: '查看装修动工相关吉日。', family: 'jieri' },
    { href: '/jieri/kaiye/2026', label: '开业吉日', description: '查看商铺开张相关吉日。', family: 'jieri' },
  ],
  seed: {
    model: 'ContentPage',
    slug: 'feng-shui',
    category: 'feng-shui',
    localeStrategy: 'localized-seo-canonical-body',
  },
};

