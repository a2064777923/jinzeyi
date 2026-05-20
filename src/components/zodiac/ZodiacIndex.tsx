import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { localizeBodyCopy, localizeSeo } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';
import { zodiacAnimals, zodiacIndexPage } from '@/lib/content/zodiac';
import { ZodiacAnimalImage } from './ZodiacAnimalImage';
import { ZodiacAnimalIcon } from './ZodiacAnimalIcon';

export function ZodiacIndex({ locale }: { locale: LocaleCode }) {
  const seo = localizeSeo(locale, zodiacIndexPage.seo);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={seo.h1}
          deck={seo.deck}
          icon={
            <ZodiacAnimalImage
              slug="dragon"
              label={localizeBodyCopy(locale, '十二生肖新中式卡通图示')}
              className="size-16 rounded-xl shadow-sm"
              imageClassName="p-0"
              sizes="64px"
              priority
            />
          }
          kicker={localizeBodyCopy(locale, '生肖年份 · 配对 · 择日')}
          badges={[localizeBodyCopy(locale, '十二生肖'), localizeBodyCopy(locale, '地支五行'), localizeBodyCopy(locale, '吉日入口')]}
          shareUrl={`/${locale}/zodiac`}
          shareLabel={localizeBodyCopy(locale, '分享生肖查詢')}
          shareMode="compact"
          controls={
            <ZodiacBranchWheel locale={locale} />
          }
        />
      </SeoPageBand>
      <SeoPageBand tone="plain" className="pt-0">
        <section className="mb-5 grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <h2 className="font-serif-display text-2xl font-semibold text-foreground">
              {localizeBodyCopy(locale, '生肖先看三层关系')}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {localizeBodyCopy(locale, '生肖先从年份边界进入，再看地支五行，最后把六合、三合和六冲放回择日。')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3" data-anime="tiles">
            {[
              ['01', '年份边界', '春节与立春附近先核对岁次。'],
              ['02', '地支五行', '生肖对应子丑寅卯等地支。'],
              ['03', '合冲择日', '重要事项避开关键生肖相冲。'],
            ].map(([label, title, body]) => (
              <div key={label} data-anime-tile data-anime-hover className="rounded-xl border border-border bg-background/75 p-4">
                <span className="text-xs font-semibold tracking-[0.2em] text-accent">{label}</span>
                <h3 className="mt-2 font-semibold text-foreground">{localizeBodyCopy(locale, title)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{localizeBodyCopy(locale, body)}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" data-anime="tiles">
          {zodiacAnimals.map((animal) => (
            <Link
              key={animal.slug}
              href={`/zodiac/${animal.slug}`}
              data-anime-tile
              data-anime-hover
              className="group grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] gap-3 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/70 hover:shadow-md sm:grid-cols-[5rem_minmax(0,1fr)_auto]"
            >
              <ZodiacAnimalImage
                slug={animal.slug}
                label={localizeBodyCopy(locale, `属${animal.animal}生肖新中式卡通图示`)}
                className="size-20"
                imageClassName="p-0 transition duration-300 group-hover:scale-105"
                sizes="80px"
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-semibold">{localizeBodyCopy(locale, `属${animal.animal}`)}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {localizeBodyCopy(locale, `${animal.earthlyBranch}支 · ${animal.elementHint}`)}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {localizeBodyCopy(locale, animal.traits.join('、'))}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {animal.years.slice(-3).map((year) => (
                    <span key={year} className="rounded-full border border-border bg-background px-2 py-0.5">
                      {year}
                    </span>
                  ))}
                  <span className="rounded-full border border-lucky/25 bg-lucky/8 px-2 py-0.5 text-lucky">
                    {localizeBodyCopy(locale, `合 ${animal.compatibility.best.slice(0, 2).join('、')}`)}
                  </span>
                  <span className="rounded-full border border-ominous/25 bg-ominous/8 px-2 py-0.5 text-ominous">
                    {localizeBodyCopy(locale, `冲 ${animal.compatibility.caution[0]}`)}
                  </span>
                </span>
              </span>
              <ArrowRight className="hidden size-4 text-primary transition group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
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

function ZodiacBranchWheel({ locale }: { locale: LocaleCode }) {
  return (
    <div data-anime="zodiac-orbit" className="relative mx-auto aspect-square w-full max-w-[19.5rem] overflow-visible rounded-full border border-primary/15 bg-background/82 p-[clamp(0.75rem,4vw,1rem)] shadow-sm">
      <div className="absolute inset-[5%] rounded-full border border-dashed border-primary/20" aria-hidden="true" />
      <div className="absolute inset-[32%] grid place-items-center rounded-full border border-accent/20 bg-card text-center shadow-sm">
        <span className="text-xs font-semibold tracking-[0.18em] text-accent">
          {localizeBodyCopy(locale, '十二地支')}
        </span>
        <span className="mt-1 text-lg font-semibold text-foreground">
          {localizeBodyCopy(locale, '轮')}
        </span>
      </div>
      {zodiacAnimals.map((animal, index) => {
        const angle = index * 30;
        return (
          <Link
            key={animal.slug}
            href={`/zodiac/${animal.slug}`}
            className="absolute left-1/2 top-1/2 grid size-[clamp(2.15rem,10.5vw,2.65rem)] place-items-center rounded-full bg-card shadow-sm ring-1 ring-border transition hover:z-10 hover:scale-110 hover:ring-primary"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * clamp(5.55rem, 29vw, 6.85rem))) rotate(-${angle}deg)`,
            }}
            aria-label={localizeBodyCopy(locale, `查看属${animal.animal}`)}
          >
            <span data-anime-orbit-item className="grid size-full place-items-center rounded-full">
              <ZodiacAnimalImage
                slug={animal.slug}
                label={localizeBodyCopy(locale, `属${animal.animal}生肖新中式卡通图示`)}
                className="size-[calc(100%-0.25rem)] overflow-hidden rounded-full border-0 shadow-none"
                imageClassName="scale-[1.18] p-0"
                sizes="40px"
              />
            </span>
          </Link>
        );
      })}
      <ZodiacAnimalIcon
        slug="dragon"
        animal={localizeBodyCopy(locale, '龙')}
        label={localizeBodyCopy(locale, '生肖地支辅助图示')}
        className="absolute bottom-5 right-5 hidden size-10 opacity-75 sm:block"
        aria-hidden="true"
      />
    </div>
  );
}
