import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BookOpenText } from 'lucide-react';
import { KnowledgeEntryCard } from '@/components/knowledge/KnowledgeEntryCard';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import {
  getMetaphysicsCategories,
  getMetaphysicsEntriesByCategory,
  knowledgeIndexPage,
} from '@/lib/content/metaphysics';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, knowledgeIndexPage.seo);

  return buildSeoPageMetadata({
    locale,
    path: knowledgeIndexPage.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function KnowledgeIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, knowledgeIndexPage.seo);
  const categories = getMetaphysicsCategories();
  const breadcrumbs = [
    { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
    { name: seo.h1, href: knowledgeIndexPage.path },
  ];
  const jsonLd = buildPageJsonLd({
    locale,
    path: knowledgeIndexPage.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebPage',
    faq: knowledgeIndexPage.faq,
    breadcrumbs,
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
          kicker={localizeBodyCopy(locale, '术语 · 故事 · 方法边界')}
          icon={<BookOpenText className="size-7" aria-hidden="true" />}
          badges={categories.map((category) => localizeBodyCopy(locale, category.label))}
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            <h2 className="text-lg font-semibold text-foreground">
              {localizeBodyCopy(locale, '先把工具里的词读懂')}
            </h2>
            <p className="mt-2">{localizeBodyCopy(locale, knowledgeIndexPage.body)}</p>
          </div>
          <div className="flex flex-col gap-4">
            <FaqBlock items={knowledgeIndexPage.faq} locale={locale} />
            <InternalLinkGrid links={knowledgeIndexPage.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>

      {categories.map((category, index) => {
        const entries = getMetaphysicsEntriesByCategory(category.key);
        if (entries.length === 0) return null;

        return (
          <SeoPageBand key={category.key} tone={index % 2 === 0 ? 'muted' : 'plain'}>
            <div className="flex flex-col gap-4">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-accent">
                  {localizeBodyCopy(locale, category.label)}
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-normal text-foreground">
                  {localizeBodyCopy(locale, `${category.label}条目`)}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {localizeBodyCopy(locale, category.description)}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {entries.map((entry) => (
                  <KnowledgeEntryCard key={entry.slug} entry={entry} locale={locale} />
                ))}
              </div>
            </div>
          </SeoPageBand>
        );
      })}
    </SeoPageShell>
  );
}
