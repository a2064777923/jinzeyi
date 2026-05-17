import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Link } from '@/i18n/navigation';
import { fengShuiCategories, fengShuiIndexPage, getFengShuiArticlesByCategory } from '@/lib/content/feng-shui';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

export function FengShuiIndex({ locale }: { locale: LocaleCode }) {
  const seo = localizeSeo(locale, fengShuiIndexPage.seo);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          kicker={localizeBodyCopy(locale, '空间清单 · 吉日入口')}
          imageSrc="/assets/almanac-icons/compass.png"
          badges={fengShuiCategories.map((category) => localizeBodyCopy(locale, category.name))}
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-5">
          {fengShuiCategories.map((category) => {
            const articles = getFengShuiArticlesByCategory(category.slug);
            return (
              <section key={category.slug} id={category.slug} className="rounded-lg border border-border bg-card p-4">
                <div className="grid gap-3 sm:grid-cols-[3rem_minmax(0,1fr)]">
                  <span className="relative size-12 rounded-lg border border-border bg-background p-2">
                    <Image src={category.icon} alt="" fill className="object-contain p-2" sizes="48px" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{localizeBodyCopy(locale, category.name)}</h2>
                      <Badge variant="secondary">{articles.length}</Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{localizeBodyCopy(locale, category.summary)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {articles.map((article) => {
                    const articleSeo = localizeSeo(locale, article.seo);
                    return (
                      <Link
                        key={article.path}
                        href={article.path}
                        className="group flex min-w-0 items-start justify-between gap-3 rounded-md border border-border bg-background p-3 transition hover:border-primary/40 hover:bg-secondary/70"
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold">{articleSeo.h1}</span>
                          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted-foreground">{articleSeo.deck}</span>
                        </span>
                        <ArrowRight className="mt-1 size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </SeoPageBand>

      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, fengShuiIndexPage.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={fengShuiIndexPage.faq} />
            <InternalLinkGrid links={fengShuiIndexPage.relatedLinks} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
