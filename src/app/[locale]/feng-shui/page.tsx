import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { FengShuiIndex } from '@/components/feng-shui/FengShuiIndex';
import { fengShuiIndexPage } from '@/lib/content/feng-shui';
import { localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, fengShuiIndexPage.seo);

  return buildSeoPageMetadata({
    locale,
    path: fengShuiIndexPage.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function FengShuiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, fengShuiIndexPage.seo);
  const jsonLd = buildPageJsonLd({
    locale,
    path: fengShuiIndexPage.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebPage',
    faq: fengShuiIndexPage.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: seo.h1, href: fengShuiIndexPage.path },
    ],
  });

  return (
    <>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <FengShuiIndex locale={locale} />
    </>
  );
}
