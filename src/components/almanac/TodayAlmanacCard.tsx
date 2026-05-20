import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { YiJiBadgeList } from './YiJiBadgeList';
import { FortuneMarker } from './FortuneMarker';
import { cn } from '@/lib/utils';
import { convertToTraditional } from '@/lib/opencc';
import type { DailyAlmanac } from '@/lib/almanac/types';

interface TodayAlmanacCardProps {
  almanac: DailyAlmanac;
}

export async function TodayAlmanacCard({ almanac }: TodayAlmanacCardProps) {
  const t = await getTranslations('Almanac');
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;

  return (
    <Card
      className={cn(
        'w-full',
        almanac.fortune === '吉'
          ? 'border-lucky/22 bg-card'
          : 'border-ominous/28 bg-[linear-gradient(180deg,#FFFFFF,rgba(241,245,249,0.72))]'
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl">
            {almanac.solar.year}{t('solarDate')}{almanac.solar.month}{t('solarDateMonth')}{almanac.solar.day}{t('solarDateDay')}
          </CardTitle>
          <FortuneMarker fortune={almanac.fortune} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Lunar date & Gan-Zhi */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">{t('lunarDate')}</p>
            <p className="text-lg font-medium">{localize(almanac.lunar.lunarDate)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('ganZhi')}</p>
            <p className="text-lg font-medium">
              {localize(almanac.ganZhi.year)}{t('ganZhiYear')} {localize(almanac.ganZhi.month)}{t('ganZhiMonth')} {localize(almanac.ganZhi.day)}{t('ganZhiDay')}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t('zodiac')}</p>
          <p className="text-lg font-medium">{localize(almanac.zodiac)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t('dayZodiac')}</p>
          <p className="text-lg font-medium">{localize(almanac.dayZodiac)}</p>
        </div>

        <Separator />

        {/* Yi (宜) */}
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-lucky">
            <Sparkles className="size-4" aria-hidden="true" />
            {t('yi')}
          </p>
          <YiJiBadgeList items={almanac.yi} type="yi" />
        </div>

        {/* Ji (忌) */}
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ominous">
            <ShieldAlert className="size-4" aria-hidden="true" />
            {t('ji')}
          </p>
          <YiJiBadgeList items={almanac.ji} type="ji" />
        </div>

        <Separator />

        {/* Directions */}
        <div className="grid gap-3 sm:grid-cols-3">
          <DirectionMiniTile kind="wealth" label={t('direction.caiShen')} value={localize(almanac.direction.caiShen)} />
          <DirectionMiniTile kind="joy" label={t('direction.xiShen')} value={localize(almanac.direction.xiShen)} />
          <DirectionMiniTile kind="blessing" label={t('direction.fuShen')} value={localize(almanac.direction.fuShen)} />
        </div>

        {/* Collapsible secondary info */}
        <Collapsible>
          <CollapsibleTrigger
            aria-label={t('expandAriaLabel')}
            className="group flex w-full items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-muted-foreground transition duration-200 hover:bg-muted hover:text-foreground"
          >
            <span>{t('expand')}</span>
            <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <Separator />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SecondaryInfo label={t('chongSha')} value={`${localize(almanac.direction.chong)} ${localize(almanac.direction.sha)}`} />
              <SecondaryInfo label={t('gods')} value={almanac.gods.map(localize).join('、')} />
              <SecondaryInfo label={t('duty')} value={localize(almanac.duty)} />
              <SecondaryInfo label={t('twentyEightStar')} value={localize(almanac.twentyEightStar)} />
              <SecondaryInfo label={t('pengZu')} value={localize(almanac.pengZu)} />
              <SecondaryInfo label={t('sound')} value={localize(almanac.sound)} />
              <SecondaryInfo label={t('fetusDay')} value={localize(almanac.fetusDay)} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

function SecondaryInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/80 bg-background/72 p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  );
}

function DirectionMiniTile({
  kind,
  label,
  value,
}: {
  kind: 'wealth' | 'joy' | 'blessing';
  label: string;
  value: string;
}) {
  const visual = {
    wealth: {
      src: '/assets/image2/direction-wealth.png',
      className: 'border-accent/30 bg-accent/10 text-accent',
    },
    joy: {
      src: '/assets/image2/direction-joy.png',
      className: 'border-lucky/30 bg-lucky/10 text-lucky',
    },
    blessing: {
      src: '/assets/image2/direction-blessing.png',
      className: 'border-primary/25 bg-primary/10 text-primary',
    },
  }[kind];

  return (
    <div className="rounded-md border border-border/80 bg-background/72 p-3">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className={cn('relative block size-8 overflow-hidden rounded-lg border', visual.className)}>
          <Image
            src={visual.src}
            alt={`${label}新中式卡通圖示`}
            fill
            className="object-contain p-0.5"
            sizes="32px"
          />
        </span>
        {label}
      </p>
      <p className="mt-2 text-base font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}
