import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';
import { zodiacAnimals, zodiacIndexPage } from '@/lib/content/zodiac';

export function ZodiacIndex({ locale }: { locale: LocaleCode }) {
  const seo = localizeSeo(locale, zodiacIndexPage.seo);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          imageSrc="/assets/almanac-icons/zodiac-ring.png"
          kicker={localizeBodyCopy(locale, '生肖年份 · 配对 · 择日')}
          badges={[localizeBodyCopy(locale, '十二生肖'), localizeBodyCopy(locale, '地支五行'), localizeBodyCopy(locale, '吉日入口')]}
          shareUrl={`/${locale}/zodiac`}
          shareLabel={localizeBodyCopy(locale, '分享生肖查詢')}
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {zodiacAnimals.map((animal) => (
            <Link
              key={animal.slug}
              href={`/zodiac/${animal.slug}`}
              className="group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-secondary/70"
            >
              <span className="relative size-12 rounded-lg border border-border bg-background p-2">
                <Image
                  src="/assets/almanac-icons/zodiac-ring.png"
                  alt={localizeBodyCopy(locale, `属${animal.animal}生肖图示`)}
                  fill
                  className="object-contain p-1.5"
                  sizes="48px"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold">{localizeBodyCopy(locale, `属${animal.animal}`)}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {localizeBodyCopy(locale, `${animal.earthlyBranch} · ${animal.elementHint} · ${animal.traits.join('、')}`)}
                </span>
              </span>
              <ArrowRight className="size-4 text-primary transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </SeoPageBand>
      <SeoPageBand tone="muted">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <p className="rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, zodiacIndexPage.body)}
          </p>
          <div className="flex flex-col gap-4">
            <FaqBlock items={zodiacIndexPage.faq} locale={locale} />
            <InternalLinkGrid links={zodiacIndexPage.relatedLinks} locale={locale} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}
