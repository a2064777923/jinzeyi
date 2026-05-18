import type { CSSProperties } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Leaf, Snowflake, Sprout, SunMedium } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { convertToTraditional } from '@/lib/opencc';
import type { SolarTerm } from '@/lib/almanac/types';

interface SolarTermsListProps {
  terms: SolarTerm[];
}

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

function getSeason(month: number): Season {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const seasonOrder = ['spring', 'summer', 'autumn', 'winter'] as const;

const seasonMeta: Record<
  Season,
  {
    Icon: typeof Sprout;
    headerClassName: string;
    iconClassName: string;
    railClassName: string;
    linkClassName: string;
  }
> = {
  spring: {
    Icon: Sprout,
    headerClassName: 'from-emerald-500/14 via-card to-card',
    iconClassName: 'bg-emerald-500/12 text-emerald-700',
    railClassName: 'bg-emerald-500',
    linkClassName: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800',
  },
  summer: {
    Icon: SunMedium,
    headerClassName: 'from-amber-500/16 via-card to-card',
    iconClassName: 'bg-amber-500/14 text-amber-700',
    railClassName: 'bg-amber-500',
    linkClassName: 'border-amber-500/30 bg-amber-500/12 text-amber-800',
  },
  autumn: {
    Icon: Leaf,
    headerClassName: 'from-orange-500/14 via-card to-card',
    iconClassName: 'bg-orange-500/12 text-orange-700',
    railClassName: 'bg-orange-500',
    linkClassName: 'border-orange-500/28 bg-orange-500/10 text-orange-800',
  },
  winter: {
    Icon: Snowflake,
    headerClassName: 'from-sky-500/14 via-card to-card',
    iconClassName: 'bg-sky-500/12 text-sky-700',
    railClassName: 'bg-sky-500',
    linkClassName: 'border-sky-500/25 bg-sky-500/10 text-sky-800',
  },
};

export async function SolarTermsList({ terms }: SolarTermsListProps) {
  const t = await getTranslations('SolarTerms');
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;

  // Group terms by season
  const grouped: Record<string, SolarTerm[]> = {
    spring: [],
    summer: [],
    autumn: [],
    winter: [],
  };

  for (const term of terms) {
    const month = parseInt(term.date.split('-')[1], 10);
    const season = getSeason(month);
    grouped[season].push(term);
  }

  const visibleSeasons = seasonOrder.filter((season) => grouped[season].length > 0);

  return (
    <div className="space-y-5">
      <nav
        aria-label={t('seasonNavAria')}
        className="sticky top-16 z-20 -mx-4 border-y border-border/70 bg-background/95 px-4 py-2 shadow-sm backdrop-blur sm:top-20 sm:mx-0 sm:rounded-lg sm:border"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
          {visibleSeasons.map((season) => {
            const meta = seasonMeta[season];
            const Icon = meta.Icon;
            return (
              <a
                key={season}
                href={`#solar-season-${season}`}
                className={`inline-flex min-w-24 shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${meta.linkClassName}`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t(season)}
              </a>
            );
          })}
        </div>
      </nav>

      {visibleSeasons.map((season) => {
        const seasonTerms = grouped[season];
        const meta = seasonMeta[season];
        const Icon = meta.Icon;

        return (
          <Card
            key={season}
            id={`solar-season-${season}`}
            className="animate-reveal-up border-border/80 shadow-sm"
            style={{ '--reveal-delay': `${seasonOrder.indexOf(season) * 90}ms` } as CSSProperties}
          >
            <CardHeader className={`bg-gradient-to-r ${meta.headerClassName} border-b border-border/70 py-4`}>
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className={`grid size-10 place-items-center rounded-md ${meta.iconClassName}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {t(season)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3 overflow-x-auto px-4 pt-4 pb-5 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-6">
              {seasonTerms.map((term) => {
                const [, month, day] = term.date.split('-');
                return (
                  <div
                    key={`${term.name}-${term.date}`}
                    className="group relative min-w-[17rem] overflow-hidden rounded-lg border border-border/80 bg-background/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-md sm:min-w-0"
                  >
                    <span className={`absolute inset-y-0 left-0 w-1 ${meta.railClassName}`} />
                    <div className="space-y-3 pl-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif-display text-xl font-semibold text-foreground">
                          {localize(term.name)}
                        </span>
                        <Badge variant={term.isJie ? 'default' : 'secondary'} className="text-xs">
                          {term.isJie ? t('jieLabel') : t('qiLabel')}
                        </Badge>
                        <span className="ml-auto text-sm font-medium text-muted-foreground">
                          {parseInt(month, 10)}{t('dateMonth')}{parseInt(day, 10)}{t('dateDay')}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm leading-6">
                        <p className="text-foreground/82">
                          <span className="font-medium text-primary">{t('meaningLabel')}：</span>
                          {t(`terms.${term.name}.meaning`)}
                        </p>
                        <p className="border-l border-accent/45 pl-3 text-foreground/82">
                          <span className="font-medium text-accent">{t('customsLabel')}：</span>
                          {t(`terms.${term.name}.customs`)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
