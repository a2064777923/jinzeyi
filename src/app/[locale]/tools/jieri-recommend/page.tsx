import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CalendarCheck } from 'lucide-react';
import { AuspiciousRecommendationForm } from '@/components/jieri/AuspiciousRecommendationForm';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { getToolPage } from '@/lib/content/tools';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
  searchParams?: Promise<{ scene?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('jieri-recommend');
  if (!page) throw new Error('Missing jieri recommendation tool content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function JieriRecommendToolPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};
  setRequestLocale(locale);
  const page = getToolPage('jieri-recommend');
  if (!page) throw new Error('Missing jieri recommendation tool content');
  const seo = localizeSeo(locale, page.seo);
  const jsonLd = buildPageJsonLd({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebApplication',
    faq: page.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: locale === 'zh-hant' ? '工具' : '工具', href: '/tools' },
      { name: seo.h1, href: page.path },
    ],
  });

  return (
    <SeoPageShell>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          kicker={localizeBodyCopy(locale, '场景 · 参与者 · 日期范围')}
          icon={<CalendarCheck className="size-7" aria-hidden="true" />}
          badges={[
            localizeBodyCopy(locale, '黄历基调'),
            localizeBodyCopy(locale, '事项匹配'),
            localizeBodyCopy(locale, '八字五行'),
            localizeBodyCopy(locale, '可用吉时'),
          ]}
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <AuspiciousRecommendationForm locale={locale} initialScene={query.scene} />
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, page.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={page.faq} locale={locale} />
            <InternalLinkGrid links={page.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
