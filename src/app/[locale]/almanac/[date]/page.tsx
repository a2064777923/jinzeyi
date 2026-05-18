import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getDailyAlmanac, getHourlyFortune } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlmanacDetail } from '@/components/almanac/AlmanacDetail';
import { Link } from '@/i18n/navigation';
import { buildAlmanacJsonLd, buildLocalizedMetadata } from '@/lib/seo';
import { isValidAlmanacDateString } from '@/lib/almanac/date-range';

interface Props {
  params: Promise<{ locale: string; date: string }>;
  searchParams: Promise<{ tab?: string }>;
}

const VALID_TABS = ['overview', 'yiJi', 'hours', 'directions', 'deities'];

function validateDate(dateStr: string): boolean {
  return isValidAlmanacDateString(dateStr);
}

export async function generateMetadata({ params }: Props) {
  const { locale, date } = await params;
  setRequestLocale(locale as 'zh-hant' | 'zh-hans');
  const t = await getTranslations('Detail');
  const tAlmanac = await getTranslations('Almanac');
  if (!validateDate(date)) {
    return buildLocalizedMetadata({
      locale: locale as 'zh-hant' | 'zh-hans',
      path: `/almanac/${date}`,
      title: tAlmanac('title'),
      description: tAlmanac('title'),
    });
  }

  try {
    const almanac = await getDailyAlmanac(date);
    const yiPreview = almanac.yi.slice(0, 4).join('、');
    const jiPreview = almanac.ji.slice(0, 4).join('、');
    const ogImage = `/api/og/almanac?${new URLSearchParams({
      date,
      fortune: almanac.fortune,
      yi: String(almanac.yi.length),
      ji: String(almanac.ji.length),
      chong: almanac.direction.chong,
      sha: almanac.direction.sha,
      yiText: yiPreview,
      jiText: jiPreview,
    }).toString()}`;
    return buildLocalizedMetadata({
      locale: locale as 'zh-hant' | 'zh-hans',
      path: `/almanac/${date}`,
      title: t('titleFormat', {
        year: almanac.solar.year,
        month: almanac.solar.month,
        day: almanac.solar.day,
      }),
      description: `${date} ${tAlmanac('title')}，今日${almanac.fortune}。${tAlmanac('yi')}：${yiPreview}。${tAlmanac('ji')}：${jiPreview}。含農曆、干支、時辰吉凶、沖煞與神位方位。`,
      image: ogImage,
      imageAlt: `${date} ${tAlmanac('title')} ${almanac.fortune}`,
      imageWidth: 1200,
      imageHeight: 630,
    });
  } catch {
    return buildLocalizedMetadata({
      locale: locale as 'zh-hant' | 'zh-hans',
      path: `/almanac/${date}`,
      title: tAlmanac('title'),
      description: tAlmanac('title'),
    });
  }
}

export default async function AlmanacDetailPage({ params, searchParams }: Props) {
  const { locale, date } = await params;
  setRequestLocale(locale as 'zh-hant' | 'zh-hans');
  const t = await getTranslations('Detail');
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 text-center sm:px-6 lg:px-8">
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
    <div className="flex flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildAlmanacJsonLd({
              locale: locale as 'zh-hant' | 'zh-hans',
              date,
              title: t('titleFormat', {
                year: almanac.solar.year,
                month: almanac.solar.month,
                day: almanac.solar.day,
              }),
              description: `${almanac.fortune}。宜：${almanac.yi.slice(0, 5).join('、')}。忌：${almanac.ji.slice(0, 5).join('、')}。`,
            }),
          ),
        }}
      />
      <AlmanacDetail almanac={almanac} hours={hours} activeTab={activeTab} />
    </div>
  );
}
