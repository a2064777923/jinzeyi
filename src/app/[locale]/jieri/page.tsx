import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { Link } from '@/i18n/navigation';
import { jieriIndexPage, jieriScenes } from '@/lib/content/jieri-scenes';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import { buildPageJsonLd, buildSeoPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = localizeSeo(locale, jieriIndexPage.seo);

  return buildSeoPageMetadata({
    locale,
    path: jieriIndexPage.path,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function JieriIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations('Layout');
  const seo = localizeSeo(locale, jieriIndexPage.seo);
  const currentYear = getCurrentYear();
  const jsonLd = buildPageJsonLd({
    locale,
    path: jieriIndexPage.path,
    title: seo.title,
    description: seo.description,
    pageType: 'WebApplication',
    faq: jieriIndexPage.faq,
    breadcrumbs: [
      { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
      { name: seo.h1, href: jieriIndexPage.path },
    ],
  });

  return (
    <SeoPageShell>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          kicker={locale === 'zh-hant' ? '場景擇日' : '场景择日'}
          imageSrc="/assets/almanac-icons/auspicious-seal.png"
          badges={[`${currentYear}`, locale === 'zh-hant' ? '宜忌匹配' : '宜忌匹配', locale === 'zh-hant' ? '凶日降級' : '凶日降级']}
          shareUrl={`/${locale}/jieri`}
          shareLabel={locale === 'zh-hant' ? '分享吉日查詢' : '分享吉日查询'}
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jieriScenes.map((scene) => (
            <Link
              key={scene.slug}
              href={`/jieri/${scene.slug}/${currentYear}`}
              className="group flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:bg-secondary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div className="flex items-start gap-3">
                <span className="relative size-12 shrink-0 rounded-lg border border-border bg-background p-2">
                  <Image
                    src={scene.icon}
                    alt={localizeBodyCopy(locale, `${scene.name}吉日圖示`)}
                    fill
                    className="object-contain p-2"
                    sizes="48px"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-semibold">{scene.name}吉日</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {localizeBodyCopy(locale, scene.summary)}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {scene.yiTerms.map((term) => (
                  <Badge key={term} variant="outline">{localizeBodyCopy(locale, term)}</Badge>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {currentYear}{locale === 'zh-hant' ? '年吉日' : '年吉日'}
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold">{locale === 'zh-hant' ? '如何使用吉日矩陣' : '如何使用吉日矩阵'}</h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {localizeBodyCopy(locale, jieriIndexPage.body)}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <FaqBlock items={jieriIndexPage.faq} locale={locale} />
            <InternalLinkGrid links={jieriIndexPage.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
