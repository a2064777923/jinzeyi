import { getTranslations } from 'next-intl/server';
import { getDailyAlmanac, getHourlyFortune } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TodayAlmanacCard } from '@/components/almanac/TodayAlmanacCard';
import { HourlyFortuneTable } from '@/components/almanac/HourlyFortuneTable';

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
  let hours;
  let error: string | null = null;

  try {
    [almanac, hours] = await Promise.all([
      getDailyAlmanac(todayStr),
      getHourlyFortune(todayStr),
    ]);
  } catch {
    error = 'fetch-error';
  }

  if (error || !almanac || !hours) {
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

      <div className="max-w-2xl w-full space-y-6">
        <TodayAlmanacCard almanac={almanac} />
        <HourlyFortuneTable hours={hours} />
      </div>
    </div>
  );
}
