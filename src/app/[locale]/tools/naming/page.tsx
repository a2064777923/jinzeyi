import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Sparkles } from 'lucide-react';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { NamingForm } from '@/components/tools/NamingForm';
import { getToolPage } from '@/lib/content/tools';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('naming');
  if (!page) throw new Error('Missing naming tool content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function NamingToolPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('naming');
  if (!page) throw new Error('Missing naming tool content');
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
          kicker={localizeBodyCopy(locale, '单字五行 · 基础评分 · 建议字')}
          icon={<Sparkles className="size-7" aria-hidden="true" />}
          badges={page.inputFields.map((field) => localizeBodyCopy(locale, field))}
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <NamingForm />
      </SeoPageBand>
      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, page.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={page.faq} />
            <InternalLinkGrid links={page.relatedLinks} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
