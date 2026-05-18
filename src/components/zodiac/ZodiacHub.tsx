import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';
import type { ZodiacArticle, ZodiacProfile } from '@/lib/content/zodiac';
import { ZodiacCompatibility } from './ZodiacCompatibility';
import { ZodiacYearTable } from './ZodiacYearTable';
import { Link } from '@/i18n/navigation';

interface ZodiacHubProps {
  locale: LocaleCode;
  profile: ZodiacProfile;
  articles: ZodiacArticle[];
}

export function ZodiacHub({ locale, profile, articles }: ZodiacHubProps) {
  const seo = localizeSeo(locale, profile.seo);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          imageSrc="/assets/almanac-icons/zodiac-ring.png"
          kicker={localizeBodyCopy(locale, `${profile.earthlyBranch} · ${profile.elementHint}`)}
          badges={profile.traits.map((trait) => localizeBodyCopy(locale, trait))}
          shareUrl={`/${locale}${profile.path}`}
          shareLabel={localizeBodyCopy(locale, '分享生肖頁')}
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-5">
            <section className="grid gap-4 rounded-lg border border-border bg-card p-5 md:grid-cols-[8rem_minmax(0,1fr)]">
              <div className="relative mx-auto size-28">
                <Image
                  src="/assets/almanac-icons/zodiac-ring.png"
                  alt={localizeBodyCopy(locale, `属${profile.animal}生肖图示`)}
                  fill
                  className="object-contain"
                  sizes="112px"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{localizeBodyCopy(locale, '性格与使用提示')}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{localizeBodyCopy(locale, profile.body)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.suitableActions.map((item) => (
                    <Badge key={item} variant="outline" className="border-lucky/30 bg-lucky/8 text-lucky">
                      {localizeBodyCopy(locale, item)}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>
            <ZodiacYearTable years={profile.years} animal={profile.animal} locale={locale} />
            <ZodiacCompatibility compatibility={profile.compatibility} locale={locale} />
            <section className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-base font-semibold">{localizeBodyCopy(locale, '相关文章')}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {articles.map((article) => {
                  const articleSeo = localizeSeo(locale, article.seo);
                  return (
                    <Link key={article.slug} href={article.path} className="rounded-md border border-border bg-background p-3 transition hover:bg-secondary/70">
                      <span className="block font-semibold">{articleSeo.h1}</span>
                      <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted-foreground">{articleSeo.deck}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <FaqBlock items={profile.faq} locale={locale} />
            <InternalLinkGrid links={profile.relatedLinks} locale={locale} />
          </aside>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
