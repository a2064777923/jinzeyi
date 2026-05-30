import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getDailyAlmanac, getHourlyFortune } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlmanacDetail } from '@/components/almanac/AlmanacDetail';
import { Link } from '@/i18n/navigation';
import { buildAlmanacJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd, buildLocalizedMetadata } from '@/lib/seo';
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
      {[
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
        buildBreadcrumbJsonLd({
          locale: locale as 'zh-hant' | 'zh-hans',
          items: [
            { name: locale === 'zh-hant' ? '首頁' : '首页', href: '/' },
            { name: locale === 'zh-hant' ? '月曆' : '月历', href: '/calendar' },
            { name: t('titleFormat', { year: almanac.solar.year, month: almanac.solar.month, day: almanac.solar.day }), href: `/almanac/${date}` },
          ],
        }),
        buildFaqJsonLd({
          locale: locale as 'zh-hant' | 'zh-hans',
          faq: [
            { id: 'almanac-yi', question: locale === 'zh-hant' ? '黃曆中的「宜」是什麼意思？' : '黄历中的「宜」是什么意思？', answer: locale === 'zh-hant' ? '「宜」指當日氣場較為順暢的事項，傳統上認為在這些時辰或日子進行相關活動較順利。僅供參考，不作為決定依據。' : '「宜」指当日气场较为顺畅的事项，传统上认为在这些时辰或日子进行相关活动较顺利。仅供参考，不作为决定依据。' },
            { id: 'almanac-ji', question: locale === 'zh-hant' ? '黃曆中的「忌」需要注意什麼？' : '黄历中的「忌」需要注意什么？', answer: locale === 'zh-hant' ? '「忌」指當日氣場較為緊張的事項。遇到忌事不必過度緊張，日常小事影響不大，但婚嫁、入宅、開業等大事建議參考黃曆另擇他日。' : '「忌」指当日气场较为紧张的事项。遇到忌事不必过度紧张，日常小事影响不大，但婚嫁、入宅、开业等大事建议参考黄历另择他日。' },
            { id: 'almanac-chong', question: locale === 'zh-hant' ? '「沖煞」是什麼？' : '「冲煞」是什么？', answer: locale === 'zh-hant' ? '沖煞提醒當日與某個地支或生肖關係較緊，煞方提示某個方向不宜硬碰。日常小事不必緊張，搬家、動土等大事再重點核對。' : '冲煞提醒当日与某个地支或生肖关系较紧，煞方提示某个方向不宜硬碰。日常小事不必紧张，搬家、动土等大事再重点核对。' },
            { id: 'almanac-hour', question: locale === 'zh-hant' ? '時辰吉凶怎麼看？' : '时辰吉凶怎么看？', answer: locale === 'zh-hant' ? '一天分為十二個時辰，每個時辰有吉凶判斷和對應的值神。選擇吉時做事是傳統擇日的其中一個參考維度。' : '一天分为十二个时辰，每个时辰有吉凶判断和对应的值神。选择吉时做事是传统择日的其中一个参考维度。' },
          ],
        }),
      ].map((item, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }} />
      ))}
      <AlmanacDetail almanac={almanac} hours={hours} activeTab={activeTab} />
    </div>
  );
}