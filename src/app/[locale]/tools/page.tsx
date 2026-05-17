import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Link } from '@/i18n/navigation';
import { getToolPage, toolPages } from '@/lib/content/tools';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

const toolIcons = {
  bazi: Calculator,
  naming: Sparkles,
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('tools-index');
  if (!page) throw new Error('Missing tools index content');
  const seo = localizeSeo(locale, page.seo);

  return buildSeoPageMetadata({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function ToolsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = getToolPage('tools-index');
  if (!page) throw new Error('Missing tools index content');
  const seo = localizeSeo(locale, page.seo);
  const tools = toolPages.filter((item) => item.toolKey === 'bazi' || item.toolKey === 'naming');
  const jsonLd = buildPageJsonLd({
    locale,
    path: page.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebPage',
    faq: page.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
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
          kicker={localizeBodyCopy(locale, '排盘 · 起名 · 查询')}
          icon={<Calculator className="size-7" aria-hidden="true" />}
          badges={page.inputFields.length === 0 ? ['八字排盘', '姓名五行'] : page.inputFields}
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const toolSeo = localizeSeo(locale, tool.seo);
            const Icon = toolIcons[tool.toolKey as 'bazi' | 'naming'];
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className="group flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:bg-secondary/70"
              >
                <span className="flex size-11 items-center justify-center rounded-lg border border-border bg-background text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xl font-semibold">{toolSeo.h1}</span>
                  <span className="mt-2 block text-sm leading-7 text-muted-foreground">{toolSeo.deck}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {locale === 'zh-hant' ? '開始查詢' : '开始查询'}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
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
