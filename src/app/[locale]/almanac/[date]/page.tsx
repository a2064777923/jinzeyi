import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getDailyAlmanac, getHourlyFortune } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlmanacDetail } from '@/components/almanac/AlmanacDetail';
import { Link } from '@/i18n/navigation';

interface Props {
  params: Promise<{ locale: string; date: string }>;
  searchParams: Promise<{ tab?: string }>;
}

const VALID_TABS = ['overview', 'yiJi', 'hours', 'directions', 'deities'];

function validateDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  return year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  if (!validateDate(date)) {
    return { title: '黄历' };
  }

  try {
    const almanac = await getDailyAlmanac(date);
    const t = await getTranslations('Detail');
    const yiPreview = almanac.yi.slice(0, 3).join('、');
    const jiPreview = almanac.ji.slice(0, 3).join('、');
    return {
      title: t('titleFormat', {
        year: almanac.solar.year,
        month: almanac.solar.month,
        day: almanac.solar.day,
      }),
      description: `宜：${yiPreview}。忌：${jiPreview}。`,
    };
  } catch {
    return { title: '黄历' };
  }
}

export default async function AlmanacDetailPage({ params, searchParams }: Props) {
  const t = await getTranslations('Detail');
  const { date } = await params;
  const { tab } = await searchParams;

  if (!validateDate(date)) {
    notFound();
  }

  const activeTab = tab && VALID_TABS.includes(tab) ? tab : 'overview';

  let almanac;
  let hours;
  let error: string | null = null;

  try {
    [almanac, hours] = await Promise.all([
      getDailyAlmanac(date),
      getHourlyFortune(date),
    ]);
  } catch {
    error = 'fetch-error';
  }

  if (error || !almanac || !hours) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8">
        <Card className="max-w-prose w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              {t('error.heading')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t('error.body')}</p>
            <Link href="/calendar" className="text-primary hover:underline">
              {t('backToCalendar')}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <AlmanacDetail almanac={almanac} hours={hours} activeTab={activeTab} />
    </div>
  );
}
