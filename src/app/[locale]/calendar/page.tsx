import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getMonthlyCalendar } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyCalendar } from '@/components/almanac/MonthlyCalendar';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { buildFaqJsonLd, buildLocalizedMetadata } from '@/lib/seo';
import { isValidAlmanacMonthString } from '@/lib/almanac/date-range';
import { coreIndexablePages } from '@/lib/content/registry';

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
  searchParams: Promise<{ month?: string }>;
}

function parseMonth(monthParam: string | undefined): { year: number; month: number } {
  if (monthParam && isValidAlmanacMonthString(monthParam)) {
    const [y, m] = monthParam.split('-').map(Number);
    return { year: y, month: m };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { month } = await searchParams;
  const { year, month: monthNum } = parseMonth(month);
  const t = await getTranslations('Calendar');
  return buildLocalizedMetadata({
    locale,
    path: '/calendar',
    title: `${t('title')} - ${year}${t('yearSuffix')}${monthNum}${t('monthSuffix')}`,
    description: `${year}${t('yearSuffix')}${monthNum}${t('monthSuffix')}${t('title')}，整理每日吉日凶日、農曆、節氣、值神、宜忌摘要，並可跳轉到指定日期完整黃曆。`,
  });
}

export default async function CalendarPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Calendar');
  const { month } = await searchParams;
  const { year, month: monthNum } = parseMonth(month);
  const calendarContent = coreIndexablePages.find((page) => page.id === 'calendar');
  if (!calendarContent) throw new Error('Missing calendar content registry');

  let days;
  let error: string | null = null;

  try {
    days = await getMonthlyCalendar(year, monthNum);
  } catch {
    error = 'fetch-error';
  }

  if (error || !days) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 text-center sm:px-6 lg:px-8">
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
    <div className="flex flex-col items-center gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd({ locale, faq: calendarContent.faq })),
        }}
      />
      <MonthlyCalendar year={year} month={monthNum} days={days} />
      <section className="grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <FaqBlock items={calendarContent.faq} locale={locale} />
        <InternalLinkGrid links={calendarContent.relatedLinks} locale={locale} />
      </section>
    </div>
  );
}
