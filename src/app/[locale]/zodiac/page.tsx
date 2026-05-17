import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ZodiacIndex } from '@/components/zodiac/ZodiacIndex';
import { localizeSeo } from '@/lib/content/localize';
import { zodiacIndexPage } from '@/lib/content/zodiac';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

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

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <ZodiacIndex locale={locale} />
    </>
  );
}

