export type LocaleCode = 'zh-hans' | 'zh-hant';

export type ContentFamily =
  | 'core'
  | 'jieri'
  | 'zodiac'
  | 'feng-shui'
  | 'tool'
  | 'knowledge';

export type PageSchemaType =
  | 'WebSite'
  | 'WebPage'
  | 'WebApplication'
  | 'Article'
  | 'FAQPage';

export type SeedTargetModel =
  | 'ContentPage'
  | 'ZodiacProfile'
  | 'FengShuiArticle'
  | 'MetaphysicsEntry'
  | 'BaZiProfile'
  | 'NamingRecord';

export interface LocalizedValue<T = string> {
  zhHans: T;
  zhHant: T;
}

export interface LocaleSeoFields {
  title: string;
  description: string;
  h1: string;
  deck: string;
  keywords: string[];
}

export type LocalizedSeo = LocalizedValue<LocaleSeoFields>;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface InternalLink {
  href: string;
  label: string;
  description?: string;
  family?: ContentFamily;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface SeedMetadata {
  model: SeedTargetModel;
  slug: string;
  category?: string;
  localeStrategy: 'localized-seo-canonical-body' | 'per-locale-row';
}

export interface IndexablePage {
  id: string;
  family: ContentFamily;
  slug: string;
  path: string;
  pageType: PageSchemaType;
  seo: LocalizedSeo;
  body: string;
  faq: FaqItem[];
  relatedLinks: InternalLink[];
  breadcrumbs?: BreadcrumbItem[];
  sitemap: boolean;
  seed: SeedMetadata;
}

export interface ArticleContent extends IndexablePage {
  pageType: 'Article';
  authorName: string;
  category: string;
  readingMinutes: number;
  sourcePolicy: 'source-synthesized-required' | 'seed-outline';
}

export interface ToolContent extends IndexablePage {
  family: 'tool';
  pageType: 'WebApplication' | 'WebPage';
  toolKey: 'tools-index' | 'bazi' | 'naming' | 'jieri-recommend';
  inputFields: string[];
}

export type MetaphysicsCategory =
  | 'bazi'
  | 'almanac'
  | 'five-elements'
  | 'stars'
  | 'zi-wei'
  | 'cosmology';

export interface KeyConcept {
  term: string;
  explanation: string;
}

export interface MetaphysicsEntry extends IndexablePage {
  family: 'knowledge';
  pageType: 'Article';
  category: MetaphysicsCategory;
  categoryLabel: string;
  name: string;
  short: string;
  detail: string;
  paragraphs: string[];
  practicalUse: string;
  practicalTips: string[];
  keyConcepts: KeyConcept[];
  relatedTerms: string[];
  toolAppearances: string[];
  mythologyStory: string;
  mythologyExtended?: string;
  commonMisunderstandings: string[];
  sourceNotes: string[];
  chartHint?: string;
  starPersonalityMetaphor?: string;
  image?: { src: string; alt: string };
  linkLabel: string;
}
