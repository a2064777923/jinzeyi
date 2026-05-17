import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HourlyFortuneTable } from './HourlyFortuneTable';
import { YiJiBadgeList } from './YiJiBadgeList';
import type { DailyAlmanac, HourlyFortune } from '@/lib/almanac/types';

interface AlmanacDetailProps {
  almanac: DailyAlmanac;
  hours: HourlyFortune[];
  activeTab: string;
}

function formatToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function AlmanacDetail({ almanac, hours, activeTab }: AlmanacDetailProps) {
  const t = await getTranslations('Detail');
  const todayStr = formatToday();

  return (
    <div className="max-w-3xl w-full space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4 text-sm">
        <Link href="/calendar" className="text-primary hover:underline">
          {t('backToCalendar')}
        </Link>
        <Link href={`/almanac/${todayStr}`} className="text-primary hover:underline">
          {t('backToToday')}
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-primary">
        {t('titleFormat', { year: almanac.solar.year, month: almanac.solar.month, day: almanac.solar.day })}
      </h1>

      {/* Tabs */}
      <Tabs defaultValue={activeTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">{t('tab.overview')}</TabsTrigger>
          <TabsTrigger value="yiJi">{t('tab.yiJi')}</TabsTrigger>
          <TabsTrigger value="hours">{t('tab.hours')}</TabsTrigger>
          <TabsTrigger value="directions">{t('tab.directions')}</TabsTrigger>
          <TabsTrigger value="deities">{t('tab.deities')}</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('overview.lunarDate')}</p>
                <p className="text-lg font-medium">{almanac.lunar.lunarDate}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('overview.ganZhi')}</p>
                <p className="text-lg font-medium">
                  {almanac.ganZhi.year}年 {almanac.ganZhi.month}月 {almanac.ganZhi.day}日
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('overview.zodiac')}</p>
                <p className="text-lg font-medium">{almanac.zodiac}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('overview.chongSha')}</p>
                <p className="font-medium">沖{almanac.direction.chong} 煞{almanac.direction.sha}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gold mb-2">{t('overview.yi')}</p>
                <YiJiBadgeList items={almanac.yi} type="yi" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{t('overview.ji')}</p>
                <YiJiBadgeList items={almanac.ji} type="ji" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yi/Ji */}
        <TabsContent value="yiJi" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gold mb-2">{t('overview.yi')}</p>
                <YiJiBadgeList items={almanac.yi} type="yi" />
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{t('overview.ji')}</p>
                <YiJiBadgeList items={almanac.ji} type="ji" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hours */}
        <TabsContent value="hours">
          <HourlyFortuneTable hours={hours} />
        </TabsContent>

        {/* Directions */}
        <TabsContent value="directions" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('overview.chongSha')}</p>
                <p className="font-medium">沖{almanac.direction.chong} 煞{almanac.direction.sha}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('directions.caiShen')}</p>
                <p className="font-medium">{almanac.direction.caiShen}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('directions.xiShen')}</p>
                <p className="font-medium">{almanac.direction.xiShen}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('directions.fuShen')}</p>
                <p className="font-medium">{almanac.direction.fuShen}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deities */}
        <TabsContent value="deities" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('deities.gods')}</p>
                <p className="font-medium">{almanac.gods.join('、')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('deities.duty')}</p>
                <p className="font-medium">{almanac.duty}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('deities.twentyEightStar')}</p>
                <p className="font-medium">{almanac.twentyEightStar}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('deities.pengZu')}</p>
                <p className="font-medium">{almanac.pengZu}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('deities.sound')}</p>
                <p className="font-medium">{almanac.sound}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">{t('deities.fetusDay')}</p>
                <p className="font-medium">{almanac.fetusDay}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
