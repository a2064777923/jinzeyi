'use client';

import Image from 'next/image';
import { useEffect, useId, useMemo, useState } from 'react';
import { CalendarDays, ChevronRight, Leaf, Snowflake, Sprout, SunMedium, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SolarTermSeason } from '@/lib/content/solar-terms';

export interface SolarTermExplorerItem {
  originalName: string;
  name: string;
  dateLabel: string;
  isJie: boolean;
  season: SolarTermSeason;
  image: string;
  imageAlt: string;
  colorWord: string;
  scene: string;
  punchline: string;
  tags: string[];
  phenology: string[];
  customs: string[];
  food: string[];
  fieldNote: string;
  almanacNote: string;
  oralArticle: string[];
}

interface SeasonView {
  key: SolarTermSeason;
  label: string;
  items: SolarTermExplorerItem[];
}

interface SolarTermsExplorerProps {
  seasons: SeasonView[];
  labels: {
    introTitle: string;
    introBody: string;
    seasonNavAria: string;
    jie: string;
    qi: string;
    open: string;
    close: string;
    phenology: string;
    customs: string;
    food: string;
    fieldNote: string;
    almanacNote: string;
    article: string;
    listenStyle: string;
  };
}

const seasonStyles: Record<
  SolarTermSeason,
  {
    icon: typeof Sprout;
    nav: string;
    panel: string;
    chip: string;
    glow: string;
  }
> = {
  spring: {
    icon: Sprout,
    nav: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-900',
    panel: 'from-emerald-500/12 via-card to-card',
    chip: 'bg-emerald-500/10 text-emerald-800',
    glow: 'bg-emerald-300/30',
  },
  summer: {
    icon: SunMedium,
    nav: 'border-amber-500/30 bg-amber-500/12 text-amber-900',
    panel: 'from-amber-500/14 via-card to-card',
    chip: 'bg-amber-500/12 text-amber-900',
    glow: 'bg-amber-300/35',
  },
  autumn: {
    icon: Leaf,
    nav: 'border-orange-500/30 bg-orange-500/12 text-orange-900',
    panel: 'from-orange-500/14 via-card to-card',
    chip: 'bg-orange-500/12 text-orange-900',
    glow: 'bg-orange-300/30',
  },
  winter: {
    icon: Snowflake,
    nav: 'border-sky-500/25 bg-sky-500/10 text-sky-900',
    panel: 'from-sky-500/14 via-card to-card',
    chip: 'bg-sky-500/10 text-sky-900',
    glow: 'bg-sky-300/28',
  },
};

export function SolarTermsExplorer({ seasons, labels }: SolarTermsExplorerProps) {
  const [activeTerm, setActiveTerm] = useState<SolarTermExplorerItem | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const allTerms = useMemo(() => seasons.flatMap((season) => season.items), [seasons]);

  useEffect(() => {
    if (!activeTerm) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveTerm(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeTerm]);

  return (
    <div className="space-y-5">
      <nav
        aria-label={labels.seasonNavAria}
        className="sticky top-16 z-20 -mx-4 border-y border-border/70 bg-background/95 px-4 py-2 shadow-sm backdrop-blur sm:top-20 sm:mx-0 sm:rounded-xl sm:border"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
          {seasons.map((season) => {
            const style = seasonStyles[season.key];
            const Icon = style.icon;
            return (
              <a
                key={season.key}
                href={`#solar-season-${season.key}`}
                className={cn(
                  'inline-flex min-w-24 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  style.nav,
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {season.label}
              </a>
            );
          })}
        </div>
      </nav>

      <section data-anime="method" className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="almanac-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 lg:w-72">
            <p className="text-xs font-semibold tracking-[0.2em] text-accent">{labels.listenStyle}</p>
            <h2 className="mt-2 font-serif-display text-2xl font-semibold text-foreground">
              {labels.introTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {labels.introBody}
            </p>
          </div>
          <div className="grid flex-1 grid-cols-6 gap-1.5 sm:grid-cols-12 lg:gap-2">
            {allTerms.map((term) => (
              <button
                key={`rail-${term.name}`}
                type="button"
                onClick={() => setActiveTerm(term)}
                data-anime-step
                data-anime-hover
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`${labels.open}${term.name}`}
              >
                <Image
                  src={term.image}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="72px"
                  loading={term.originalName === '清明' ? 'eager' : 'lazy'}
                  fetchPriority={term.originalName === '清明' ? 'high' : 'auto'}
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/72 to-transparent px-1.5 pb-1 pt-5 text-center text-[0.68rem] font-semibold leading-none text-primary-foreground">
                  {term.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {seasons.map((season) => {
        const style = seasonStyles[season.key];
        const Icon = style.icon;

        return (
          <section
            key={season.key}
            id={`solar-season-${season.key}`}
            data-anime="method"
            className={cn(
              'animate-reveal-up relative overflow-hidden rounded-[1.5rem] border border-border bg-gradient-to-r p-4 shadow-sm sm:p-5',
              style.panel,
            )}
          >
            <div className={cn('pointer-events-none absolute -right-10 -top-10 size-32 rounded-full blur-3xl', style.glow)} aria-hidden="true" />
            <div className="relative mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={cn('grid size-11 place-items-center rounded-xl', style.chip)}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-serif-display text-xl font-semibold text-foreground">{season.label}</h2>
                  <p className="text-sm text-muted-foreground">{season.items.map((item) => item.name).join(' · ')}</p>
                </div>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {season.items.length} 个
              </Badge>
            </div>
            <div className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {season.items.map((term) => (
                <button
                  key={`${term.name}-${term.dateLabel}`}
                  type="button"
                  onClick={() => setActiveTerm(term)}
                  data-anime-step
                  data-anime-hover
                  className="image2-art-card group grid min-h-48 grid-cols-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-2xl border border-border bg-background/86 p-2 text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[8.5rem_minmax(0,1fr)]"
                >
                  <span className="relative min-h-40 overflow-hidden rounded-xl bg-[#fff2d8]">
                    <Image
                      src={term.image}
                      alt={term.imageAlt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 120px, 150px"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col justify-between p-2 sm:p-3">
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-serif-display text-xl font-semibold text-foreground">{term.name}</span>
                        <Badge variant={term.isJie ? 'default' : 'secondary'} className="text-[0.68rem]">
                          {term.isJie ? labels.jie : labels.qi}
                        </Badge>
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {term.dateLabel}
                      </span>
                      <span className="mt-3 line-clamp-3 block text-sm leading-6 text-foreground/82">
                        {term.punchline}
                      </span>
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {labels.open}
                      <ChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      {activeTerm ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/46 p-2 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveTerm(null);
            }
          }}
        >
          <article className="solar-term-modal relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-2xl sm:rounded-[1.6rem]">
            <button
              type="button"
              onClick={() => setActiveTerm(null)}
              className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full border border-border bg-card/92 text-foreground shadow-sm transition hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={labels.close}
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
              <div className="relative min-h-[18rem] overflow-hidden bg-[#fff2d8] lg:min-h-full">
                <Image
                  src={activeTerm.image}
                  alt={activeTerm.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 460px"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/78 to-transparent p-5 text-primary-foreground">
                  <p className="text-xs font-semibold tracking-[0.22em]">{activeTerm.colorWord}</p>
                  <h2 id={titleId} className="mt-1 font-serif-display text-3xl font-semibold">
                    {activeTerm.name}
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-primary-foreground/88">{activeTerm.scene}</p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-7">
                <div className="pr-10">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={activeTerm.isJie ? 'default' : 'secondary'}>
                      {activeTerm.isJie ? labels.jie : labels.qi}
                    </Badge>
                    <Badge variant="outline">{activeTerm.dateLabel}</Badge>
                    {activeTerm.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-background/70">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p id={descriptionId} className="mt-4 font-serif-display text-2xl font-semibold leading-9 text-foreground">
                    {activeTerm.punchline}
                  </p>
                </div>

                <SectionBlock title={labels.article}>
                  <div className="space-y-3">
                    {activeTerm.oralArticle.map((paragraph) => (
                      <p key={paragraph} className="text-[0.96rem] leading-8 text-foreground/82">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </SectionBlock>

                <div className="grid gap-3 md:grid-cols-2">
                  <ListBlock title={labels.phenology} items={activeTerm.phenology} />
                  <ListBlock title={labels.customs} items={activeTerm.customs} />
                </div>

                <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
                  <SectionBlock title={labels.food}>
                    <div className="flex flex-wrap gap-2">
                      {activeTerm.food.map((food) => (
                        <span
                          key={food}
                          className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </SectionBlock>
                  <SectionBlock title={labels.fieldNote}>
                    <p className="text-sm leading-7 text-muted-foreground">{activeTerm.fieldNote}</p>
                  </SectionBlock>
                </div>

                <section className="rounded-2xl border border-primary/15 bg-primary/7 p-4">
                  <h3 className="text-sm font-semibold text-primary">{labels.almanacNote}</h3>
                  <p className="mt-2 text-sm leading-7 text-foreground/82">{activeTerm.almanacNote}</p>
                </section>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-background/72 p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <SectionBlock title={title}>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-7 text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionBlock>
  );
}
