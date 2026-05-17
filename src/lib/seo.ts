import type { Metadata } from 'next';
import type { BreadcrumbItem, FaqItem, LocaleCode } from '@/lib/content/types';

export const SITE_ORIGIN = 'http://43.139.84.61:3000';
export const SITE_NAME = '今擇易';
export const SITE_KEYWORDS = [
  '黄历',
  '黃曆',
  '今日黄历',
  '今日黃曆',
  '择日',
  '擇日',
  '吉日',
  '凶日',
  '农历',
  '農曆',
  '二十四节气',
  '二十四節氣',
  '宜忌',
  '时辰吉凶',
  '時辰吉凶',
];

type Locale = 'zh-hans' | 'zh-hant';

type JsonLdObject = Record<string, unknown>;

interface JsonLdPageInput {
  locale: LocaleCode;
  path: string;
  title: string;
  description: string;
}

function normalizedLocalePath(path: string): string {
  if (path === '/') return '';
  return path.startsWith('/') ? path : `/${path}`;
}

function languageTag(locale: LocaleCode): 'zh-Hans' | 'zh-Hant' {
  return locale === 'zh-hans' ? 'zh-Hans' : 'zh-Hant';
}

function absoluteUrl(locale: LocaleCode, path: string): string {
  return `${SITE_ORIGIN}/${locale}${normalizedLocalePath(path)}`;
}

export function buildLocalizedMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const normalizedPath = normalizedLocalePath(path);
  const currentPath = `/${locale}${normalizedPath}`;
  const canonical = `${SITE_ORIGIN}${currentPath}`;
  const alternatePath = locale === 'zh-hans'
    ? `/zh-hant${normalizedPath}`
    : `/zh-hans${normalizedPath}`;

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    keywords: SITE_KEYWORDS,
    alternates: {
      canonical: currentPath,
      languages: {
        'zh-Hans': `/zh-hans${normalizedPath}`,
        'zh-Hant': `/zh-hant${normalizedPath}`,
        'x-default': `/zh-hant${normalizedPath}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh-hans' ? 'zh_CN' : 'zh_TW',
      alternateLocale: [locale === 'zh-hans' ? 'zh_TW' : 'zh_CN'],
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: '/jinzeyi-icon.svg',
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: ['/jinzeyi-icon.svg'],
    },
    other: {
      'content-language': locale === 'zh-hans' ? 'zh-Hans' : 'zh-Hant',
      'alternate-page': `${SITE_ORIGIN}${alternatePath}`,
    },
  };
}

export function buildSeoPageMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}): Metadata {
  const metadata = buildLocalizedMetadata({ locale, path, title, description });
  const mergedKeywords = Array.from(new Set([...keywords, ...SITE_KEYWORDS]));

  return {
    ...metadata,
    keywords: mergedKeywords,
  };
}

export function buildWebsiteJsonLd(locale: Locale) {
  const localePrefix = `/${locale}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: locale === 'zh-hans' ? '今择易' : '今擇易',
    url: `${SITE_ORIGIN}${localePrefix}`,
    inLanguage: locale === 'zh-hans' ? 'zh-Hans' : 'zh-Hant',
    description: locale === 'zh-hans'
      ? '今日黄历、农历、宜忌、吉时凶时、月历吉日凶日与二十四节气查询。'
      : '今日黃曆、農曆、宜忌、吉時凶時、月曆吉日凶日與二十四節氣查詢。',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}${localePrefix}/almanac/{date}`,
      'query-input': 'required name=date',
    },
  };
}

export function buildBreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: LocaleCode;
  items: BreadcrumbItem[];
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.href),
    })),
  };
}

export function buildFaqJsonLd({
  locale,
  faq,
}: {
  locale: LocaleCode;
  faq: FaqItem[];
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: languageTag(locale),
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildArticleJsonLd({
  locale,
  path,
  title,
  description,
  authorName = SITE_NAME,
}: JsonLdPageInput & {
  authorName?: string;
}): JsonLdObject {
  const url = absoluteUrl(locale, path);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    inLanguage: languageTag(locale),
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/${locale}`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function buildWebApplicationJsonLd({
  locale,
  path,
  title,
  description,
  applicationCategory = 'LifestyleApplication',
}: JsonLdPageInput & {
  applicationCategory?: string;
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    url: absoluteUrl(locale, path),
    inLanguage: languageTag(locale),
    applicationCategory,
    operatingSystem: 'Web',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/${locale}`,
    },
  };
}

export function buildWebPageJsonLd({
  locale,
  path,
  title,
  description,
}: JsonLdPageInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: absoluteUrl(locale, path),
    inLanguage: languageTag(locale),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/${locale}`,
    },
  };
}

export function buildPageJsonLd({
  locale,
  path,
  title,
  description,
  pageType = 'WebPage',
  faq = [],
  breadcrumbs = [],
}: JsonLdPageInput & {
  pageType?: 'WebPage' | 'WebApplication' | 'Article';
  faq?: FaqItem[];
  breadcrumbs?: BreadcrumbItem[];
}): JsonLdObject[] {
  const pageJsonLd =
    pageType === 'Article'
      ? buildArticleJsonLd({ locale, path, title, description })
      : pageType === 'WebApplication'
        ? buildWebApplicationJsonLd({ locale, path, title, description })
        : buildWebPageJsonLd({ locale, path, title, description });

  return [
    pageJsonLd,
    ...(faq.length > 0 ? [buildFaqJsonLd({ locale, faq })] : []),
    ...(breadcrumbs.length > 0 ? [buildBreadcrumbJsonLd({ locale, items: breadcrumbs })] : []),
  ];
}

export function buildAlmanacJsonLd({
  locale,
  date,
  title,
  description,
}: {
  locale: Locale;
  date: string;
  title: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: `${SITE_ORIGIN}/${locale}/almanac/${date}`,
    inLanguage: locale === 'zh-hans' ? 'zh-Hans' : 'zh-Hant',
    description,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/${locale}`,
    },
    about: [
      { '@type': 'Thing', name: locale === 'zh-hans' ? '黄历' : '黃曆' },
      { '@type': 'Thing', name: locale === 'zh-hans' ? '择日' : '擇日' },
      { '@type': 'Thing', name: locale === 'zh-hans' ? '农历' : '農曆' },
    ],
  };
}
