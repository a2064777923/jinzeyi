import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpenText, Compass, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Link } from '@/i18n/navigation';
import {
  getMetaphysicsEntry,
  metaphysicsEntries,
} from '@/lib/content/metaphysics';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { MetaphysicsEntry } from '@/lib/content/types';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans'; slug: string }>;
}

export function generateStaticParams() {
  return metaphysicsEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = getMetaphysicsEntry(slug);

  if (!entry) {
    return buildSeoPageMetadata({
      locale,
      path: `/knowledge/${slug}`,
      title: locale === 'zh-hant' ? '命理知識｜今擇易' : '命理知识｜今择易',
      description: locale === 'zh-hant' ? '命理知識條目。' : '命理知识条目。',
    });
  }

  const seo = localizeSeo(locale, entry.seo);
  return buildSeoPageMetadata({
    locale,
    path: entry.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

function asEntry(entry: MetaphysicsEntry | undefined): entry is MetaphysicsEntry {
  return Boolean(entry);
}

export default async function KnowledgeEntryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = getMetaphysicsEntry(slug);
  if (!entry) notFound();

  const seo = localizeSeo(locale, entry.seo);
  const breadcrumbs = [
    { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
    { name: locale === 'zh-hant' ? '命理知識庫' : '命理知识库', href: '/knowledge' },
    { name: seo.h1, href: entry.path },
  ];
  const jsonLd = buildPageJsonLd({
    locale,
    path: entry.path,
    title: seo.title,
    description: seo.description,
    pageType: 'Article',
    faq: entry.faq,
    breadcrumbs,
  });
  const relatedEntries = entry.relatedTerms.map((termSlug) => getMetaphysicsEntry(termSlug)).filter(asEntry);

  return (
    <SeoPageShell>
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}

      <SeoPageBand>
        <article className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-12 place-items-center rounded-lg border border-border bg-background text-primary">
                <BookOpenText className="size-6" aria-hidden="true" />
              </span>
              <Badge variant="secondary">{localizeBodyCopy(locale, entry.categoryLabel)}</Badge>
            </div>
            <h1 className="mt-5 font-serif-display text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl">
              {seo.h1}
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {localizeBodyCopy(locale, entry.short)}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {entry.chartHint ? (
                <div className="rounded-lg border border-border bg-background/75 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {localizeBodyCopy(locale, '工具提示')}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {localizeBodyCopy(locale, entry.chartHint)}
                  </p>
                </div>
              ) : null}
              {entry.starPersonalityMetaphor ? (
                <div className="rounded-lg border border-border bg-background/75 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    {localizeBodyCopy(locale, '星象比喻')}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {localizeBodyCopy(locale, entry.starPersonalityMetaphor)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground">
                {localizeBodyCopy(locale, '出现位置')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.toolAppearances.map((item) => (
                  <Badge key={item} variant="outline">
                    {localizeBodyCopy(locale, item)}
                  </Badge>
                ))}
              </div>
            </div>
            <FaqBlock items={entry.faq} locale={locale} />
          </aside>
        </article>
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-4 lg:grid-cols-3">
          <section className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Compass className="size-5 text-primary" aria-hidden="true" />
              {localizeBodyCopy(locale, '怎么实际阅读')}
            </h2>
            <p className="mt-3 text-base leading-8 text-muted-foreground">
              {localizeBodyCopy(locale, entry.detail)}
            </p>
            <p className="mt-4 rounded-lg bg-secondary/70 p-4 text-sm leading-7 text-secondary-foreground">
              {localizeBodyCopy(locale, entry.practicalUse)}
            </p>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              {localizeBodyCopy(locale, '文化故事')}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {localizeBodyCopy(locale, entry.mythologyStory)}
            </p>
          </section>
        </div>
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground">
              {localizeBodyCopy(locale, '常见误读')}
            </h2>
            <ul className="mt-4 grid gap-3">
              {entry.commonMisunderstandings.map((item) => (
                <li key={item} className="rounded-md border border-border bg-background/75 p-3 text-sm leading-7 text-muted-foreground">
                  {localizeBodyCopy(locale, item)}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-xl font-semibold text-foreground">
              {localizeBodyCopy(locale, '来源提示')}
            </h2>
            <ul className="mt-4 grid gap-3">
              {entry.sourceNotes.map((item) => (
                <li key={item} className="text-sm leading-7 text-muted-foreground">
                  {localizeBodyCopy(locale, item)}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </SeoPageBand>

      <SeoPageBand tone="plain">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              {localizeBodyCopy(locale, '相关术语')}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedEntries.map((related) => {
                const relatedSeo = localizeSeo(locale, related.seo);
                return (
                  <Link
                    key={related.slug}
                    href={related.path}
                    className="group flex min-w-0 justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm transition hover:border-primary/40 hover:bg-secondary/65"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold text-foreground">{relatedSeo.h1}</span>
                      <span className="mt-1 line-clamp-2 block leading-6 text-muted-foreground">
                        {relatedSeo.deck}
                      </span>
                    </span>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
          <InternalLinkGrid links={entry.relatedLinks} locale={locale} />
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
