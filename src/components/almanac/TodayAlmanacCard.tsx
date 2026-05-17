import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { YiJiBadgeList } from './YiJiBadgeList';
import type { DailyAlmanac } from '@/lib/almanac/types';

interface TodayAlmanacCardProps {
  almanac: DailyAlmanac;
}

export async function TodayAlmanacCard({ almanac }: TodayAlmanacCardProps) {
  const t = await getTranslations('Almanac');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          {almanac.solar.year}{t('solarDate')}{almanac.solar.month}{t('solarDateMonth')}{almanac.solar.day}{t('solarDateDay')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lunar date & Gan-Zhi */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('lunarDate')}</p>
            <p className="text-lg font-medium">{almanac.lunar.lunarDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('ganZhi')}</p>
            <p className="text-lg font-medium">
              {almanac.ganZhi.year}{t('ganZhiYear')} {almanac.ganZhi.month}{t('ganZhiMonth')} {almanac.ganZhi.day}{t('ganZhiDay')}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{t('zodiac')}</p>
          <p className="text-lg font-medium">{almanac.zodiac}</p>
        </div>

        <Separator />

        {/* Yi (宜) */}
        <div>
          <p className="text-sm font-medium text-gold mb-2">{t('yi')}</p>
          <YiJiBadgeList items={almanac.yi} type="yi" />
        </div>

        {/* Ji (忌) */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{t('ji')}</p>
          <YiJiBadgeList items={almanac.ji} type="ji" />
        </div>

        <Separator />

        {/* Directions */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('direction.caiShen')}</p>
            <p className="font-medium">{almanac.direction.caiShen}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('direction.xiShen')}</p>
            <p className="font-medium">{almanac.direction.xiShen}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('direction.fuShen')}</p>
            <p className="font-medium">{almanac.direction.fuShen}</p>
          </div>
        </div>

        {/* Collapsible secondary info */}
        <Collapsible>
          <CollapsibleTrigger className="w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
            {t('expand')}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('chongSha')}</p>
              <p className="font-medium">{almanac.direction.chong} {almanac.direction.sha}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('gods')}</p>
              <p className="font-medium">{almanac.gods.join('、')}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('duty')}</p>
              <p className="font-medium">{almanac.duty}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('twentyEightStar')}</p>
              <p className="font-medium">{almanac.twentyEightStar}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('pengZu')}</p>
              <p className="font-medium">{almanac.pengZu}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('sound')}</p>
              <p className="font-medium">{almanac.sound}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">{t('fetusDay')}</p>
              <p className="font-medium">{almanac.fetusDay}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
