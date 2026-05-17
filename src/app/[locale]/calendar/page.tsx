import { getTranslations } from 'next-intl/server';
import { getMonthlyCalendar } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyCalendar } from '@/components/almanac/MonthlyCalendar';

interface Props {
  searchParams: Promise<{ month?: string }>;
}

function parseMonth(monthParam: string | undefined): { year: number; month: number } {
  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const [y, m] = monthParam.split('-').map(Number);
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12) {
      return { year: y, month: m };
    }
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export async function generateMetadata({ searchParams }: Props) {
  const { month } = await searchParams;
  const { year, month: monthNum } = parseMonth(month);
  const t = await getTranslations('Calendar');
  return {
    title: `${t('title')} - ${year}${t('yearSuffix')}${monthNum}${t('monthSuffix')}`,
    description: `${year}${t('yearSuffix')}${monthNum}${t('monthSuffix')}${t('title')}`,
  };
}

export default async function CalendarPage({ searchParams }: Props) {
  const t = await getTranslations('Calendar');
  const { month } = await searchParams;
  const { year, month: monthNum } = parseMonth(month);

  let days;
  let error: string | null = null;

  try {
    days = await getMonthlyCalendar(year, monthNum);
  } catch {
    error = 'fetch-error';
  }

  if (error || !days) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8">
        <Card className="max-w-prose w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              {t('error.heading')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('error.body')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <MonthlyCalendar year={year} month={monthNum} days={days} />
    </div>
  );
}
