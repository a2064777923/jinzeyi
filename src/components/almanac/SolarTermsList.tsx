import { getLocale, getTranslations } from 'next-intl/server';
import { convertToTraditional } from '@/lib/opencc';
import type { SolarTerm } from '@/lib/almanac/types';
import { getSolarTermArticle, getSolarTermOrder, type SolarTermSeason } from '@/lib/content/solar-terms';
import { SolarTermsExplorer, type SolarTermExplorerItem } from './SolarTermsExplorer';

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

export async function SolarTermsList({ terms }: SolarTermsListProps) {
  const t = await getTranslations('SolarTerms');
  const locale = await getLocale();
  const localize = (value: string) => locale === 'zh-hant' ? convertToTraditional(value) : value;
  const localizeList = (values: string[]) => values.map(localize);

  // Group terms by season
  const grouped: Record<Season, SolarTermExplorerItem[]> = {
    spring: [],
    summer: [],
    autumn: [],
    winter: [],
  };

  for (const term of terms) {
    const month = parseInt(term.date.split('-')[1], 10);
    const season = getSeason(month);
    const article = getSolarTermArticle(term.name);
    const [, monthText, dayText] = term.date.split('-');
    grouped[season].push({
      originalName: term.name,
      name: localize(term.name),
      dateLabel: `${parseInt(monthText, 10)}${t('dateMonth')}${parseInt(dayText, 10)}${t('dateDay')}`,
      isJie: term.isJie,
      season: article.season as SolarTermSeason,
      image: article.image,
      imageAlt: localize(article.imageAlt),
      colorWord: localize(article.colorWord),
      scene: localize(article.scene),
      punchline: localize(article.punchline),
      tags: localizeList(article.tags),
      phenology: localizeList(article.phenology),
      customs: localizeList(article.customs),
      food: localizeList(article.food),
      fieldNote: localize(article.fieldNote),
      almanacNote: localize(article.almanacNote),
      oralArticle: localizeList(article.oralArticle),
    });
  }

  const visibleSeasons = seasonOrder.filter((season) => grouped[season].length > 0);
  for (const season of visibleSeasons) {
    grouped[season].sort((left, right) => getSolarTermOrder(left.originalName) - getSolarTermOrder(right.originalName));
  }

  return (
    <SolarTermsExplorer
      seasons={visibleSeasons.map((season) => ({
        key: season,
        label: t(season),
        items: grouped[season],
      }))}
      labels={{
        introTitle: t('introTitle'),
        introBody: t('introBody'),
        seasonNavAria: t('seasonNavAria'),
        jie: t('jieLabel'),
        qi: t('qiLabel'),
        open: t('openDetail'),
        close: t('closeDetail'),
        phenology: t('detail.phenology'),
        customs: t('detail.customs'),
        food: t('detail.food'),
        fieldNote: t('detail.fieldNote'),
        almanacNote: t('detail.almanacNote'),
        article: t('detail.article'),
        listenStyle: t('listenStyle'),
      }}
    />
  );
}
