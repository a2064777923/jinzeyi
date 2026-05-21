import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ZodiacIndex } from '@/components/zodiac/ZodiacIndex';
import { localizeSeo } from '@/lib/content/localize';
import { zodiacAnimals, zodiacIndexPage } from '@/lib/content/zodiac';
import { buildDefinedTermSetJsonLd, buildItemListJsonLd, buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, zodiacIndexPage.seo);

  return buildSeoPageMetadata({
    locale,
    path: zodiacIndexPage.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function ZodiacPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, zodiacIndexPage.seo);
  const jsonLd = buildPageJsonLd({
    locale,
    path: zodiacIndexPage.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebPage',
    faq: zodiacIndexPage.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: seo.h1, href: zodiacIndexPage.path },
    ],
  });
  const zodiacListJsonLd = buildItemListJsonLd({
    locale,
    path: zodiacIndexPage.path,
    title: seo.title,
    description: seo.description,
    listName: locale === 'zh-hant' ? '十二生肖入口清單' : '十二生肖入口清单',
    items: zodiacAnimals.map((animal) => ({
      name: `属${animal.animal}`,
      description: `${animal.earthlyBranch}支，五行${animal.elementHint}，常见年份 ${animal.years.slice(-3).join('、')}。`,
      path: animal.path,
    })),
  });
  const zodiacTermsJsonLd = buildDefinedTermSetJsonLd({
    locale,
    path: zodiacIndexPage.path,
    title: seo.title,
    description: seo.description,
    terms: zodiacAnimals.map((animal) => ({
      name: animal.animal,
      alternateName: [`属${animal.animal}`, `${animal.earthlyBranch}${animal.animal}`],
      description: `十二生肖中的${animal.animal}，对应地支${animal.earthlyBranch}，五行提示为${animal.elementHint}。`,
      path: animal.path,
    })),
  });

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(zodiacListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(zodiacTermsJsonLd) }} />
      <ZodiacIndex locale={locale} />
    </>
  );
}

