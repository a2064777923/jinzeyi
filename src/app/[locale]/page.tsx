import { getTranslations } from 'next-intl/server';
import { getDailyAlmanac } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function formatToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default async function HomePage() {
  const t = await getTranslations('Almanac');
  const todayStr = formatToday();

  let almanac;
  let error: string | null = null;

  try {
    almanac = await getDailyAlmanac(todayStr);
  } catch {
    error = 'fetch-error';
  }

  if (error || !almanac) {
    const tHome = await getTranslations('Homepage');
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Card className="max-w-prose w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              {tHome('error.heading')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tHome('error.body')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <h1 className="text-3xl font-bold text-primary">{t('title')}</h1>

      <Card className="max-w-prose w-full">
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
            <div className="flex flex-wrap gap-2">
              {almanac.yi.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-sm text-gold border border-gold/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Ji (忌) */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{t('ji')}</p>
            <div className="flex flex-wrap gap-2">
              {almanac.ji.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground border border-border"
                >
                  {item}
                </span>
              ))}
            </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
