import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  MoonStar,
  Sparkles,
  SunMedium,
} from 'lucide-react';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { getDailyAlmanac, getHourlyFortune } from '@/lib/almanac/service';
import { convertToTraditional } from '@/lib/opencc';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { TodayAlmanacCard } from '@/components/almanac/TodayAlmanacCard';
import { HourlyFortuneTable } from '@/components/almanac/HourlyFortuneTable';
import { DateSearchForm } from '@/components/almanac/DateSearchForm';
import { FortuneMarker } from '@/components/almanac/FortuneMarker';
import { GlossaryPanel } from '@/components/knowledge/GlossaryPanel';
import { SharePanel } from '@/components/share/SharePanel';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { Image2MethodDiagram } from '@/components/visual/Image2Showcase';
import { SITE_ORIGIN, buildFaqJsonLd, buildLocalizedMetadata, buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/seo';
import { coreIndexablePages } from '@/lib/content/registry';
import { getGlossaryEntries } from '@/lib/content/glossary';

export const dynamic = 'force-dynamic';

function formatToday(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localize(locale: string, value: string) {
  return locale === 'zh-hant' ? convertToTraditional(value) : value;
}

interface Props {
  params: Promise<{ locale: 'zh-hant' | 'zh-hans' }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Homepage');
  return buildLocalizedMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);
  const locale = await getLocale();
  const tHome = await getTranslations('Homepage');
  const tAlmanac = await getTranslations('Almanac');
  const tCalendar = await getTranslations('Calendar');
  const tSolarTerms = await getTranslations('SolarTerms');
  const homeContent = coreIndexablePages.find((page) => page.id === 'home');
  if (!homeContent) throw new Error('Missing home content registry');
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-prose">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-semibold text-destructive">
              {tHome('error.heading')}
            </h1>
            <p className="mt-3 text-muted-foreground">{tHome('error.body')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const luckyHours = hours.filter((hour) => hour.fortune === '吉').length;
  const unluckyHours = hours.length - luckyHours;
  const shareSummary = localize(
    locale,
    `${todayStr} 今日${almanac.fortune}。宜 ${almanac.yi.slice(0, 5).join('、')}；忌 ${almanac.ji.slice(0, 5).join('、')}。吉时 ${luckyHours}/12，冲${almanac.direction.chong}，煞${almanac.direction.sha}。`
  );
  const summaryItems = [
    {
      icon: Sparkles,
      label: tAlmanac('yi'),
      value: `${almanac.yi.length}`,
      hint: localize(locale, '项宜事'),
    },
    {
      icon: MoonStar,
      label: tAlmanac('ji'),
      value: `${almanac.ji.length}`,
      hint: localize(locale, '项忌事'),
    },
    {
      icon: Clock3,
      label: tHome('luckyHours'),
      value: `${luckyHours}`,
      hint: `${localize(locale, '个吉时')} / 12`,
    },
    {
      icon: CalendarDays,
      label: tHome('unluckyHours'),
      value: `${unluckyHours}`,
      hint: `${localize(locale, '个凶时')} / 12`,
    },
  ] as const;

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildWebsiteJsonLd(routeLocale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildOrganizationJsonLd(routeLocale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd({ locale: routeLocale, faq: homeContent.faq })),
        }}
      />
      <section data-anime="home-hero" className="relative overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_12%_20%,rgba(253,230,138,0.42),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(16,185,129,0.24),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(230,244,236,0.82))]">
        <div className="almanac-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[82rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-12">
          <div className="space-y-6 animate-reveal-up" data-anime-item>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3" aria-hidden="true" />
                {tHome('heroKicker')}
              </Badge>
              <Badge variant="outline">{todayStr}</Badge>
              <Badge
                variant="outline"
                className={cn(
                  almanac.fortune === '吉'
                    ? 'border-lucky/30 bg-lucky/8 text-lucky'
                    : 'border-ominous/35 bg-ominous/10 text-ominous'
                )}
              >
                {almanac.fortune === '吉' ? localize(locale, '今日吉日') : localize(locale, '今日凶日')}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <FortuneMarker fortune={almanac.fortune} size="lg" />
              <div className="space-y-3">
                <h1 className="font-serif-display text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">
                  {localize(locale, `${almanac.solar.year}年${almanac.solar.month}月${almanac.solar.day}日`)}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {localize(locale, almanac.lunar.lunarDate)} · {tAlmanac('zodiac')} {localize(locale, almanac.zodiac)} · {localize(locale, `干支 ${almanac.ganZhi.day}`)}
                </p>
                <p className="max-w-2xl text-sm leading-7 text-foreground/78 sm:text-base">
                  {tHome('heroLead')}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/almanac/${todayStr}`}
                className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md')}
              >
                {tHome('cta')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/calendar"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                {tCalendar('title')}
              </Link>
              <Link
                href="/solar-terms"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
              >
                {tSolarTerms('title')}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {summaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    data-anime-item
                    data-anime-hover
                    className="shimmer-panel rounded-lg border border-border/80 bg-card/88 p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md sm:p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                      </div>
                      <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary sm:size-9">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">{item.hint}</p>
                  </div>
                );
              })}
            </div>

            <DateSearchForm
              label={tHome('search.label')}
              buttonLabel={tHome('search.button')}
              invalidMessage={tHome('search.invalid')}
              defaultDate={todayStr}
            />
          </div>

          <Card data-anime-item data-anime-hover className="animate-float-slow self-start overflow-hidden border-border/80 bg-card/92 shadow-lg shadow-primary/8">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{tHome('todayFocus')}</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">
                    {localize(locale, almanac.lunar.lunarDate)}
                  </p>
                </div>
                <Badge variant="default">
                  {tAlmanac('yi')} {almanac.yi.length} / {tAlmanac('ji')} {almanac.ji.length}
                </Badge>
              </div>

              <div className="relative mx-auto aspect-square w-44 sm:w-52">
                <Image
                  src="/assets/image2/direction-compass-cutout.png"
                  alt={localize(locale, '今日方位罗盘图示')}
                  fill
                  className="object-contain p-2 drop-shadow-[0_18px_28px_rgba(20,37,31,0.18)]"
                  sizes="208px"
                  priority
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow label={tAlmanac('lunarDate')} value={localize(locale, almanac.lunar.lunarDate)} />
                <InfoRow
                  label={tAlmanac('ganZhi')}
                  value={localize(locale, `${almanac.ganZhi.year} ${almanac.ganZhi.month} ${almanac.ganZhi.day}`)}
                />
                <InfoRow label={tAlmanac('zodiac')} value={localize(locale, almanac.zodiac)} />
                <InfoRow label={tAlmanac('dayZodiac')} value={localize(locale, almanac.dayZodiac)} />
                <InfoRow
                  label={tAlmanac('chongSha')}
                  value={localize(locale, `${almanac.direction.chong} ${almanac.direction.sha}`)}
                />
              </div>

              <div className="rounded-md border border-border bg-muted/45 p-4 text-sm leading-7 text-muted-foreground">
                {localize(locale, '今日宜忌、时辰和冲煞适合一起核对。重要事项优先参考吉时和避冲。')}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[82rem] px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <TodayAlmanacCard almanac={almanac} />
          <HourlyFortuneTable hours={hours} />
        </div>
      </section>

      <section className="mx-auto grid max-w-[82rem] gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-8">
        <Image2MethodDiagram
          title={localize(locale, '今日黃曆怎麼讀')}
          deck={localize(locale, '不要只盯一个吉凶字。整日基调、事情宜忌、吉时、生肖和方位要放在一起核对。')}
          steps={[
            {
              label: 'DAY',
              title: localize(locale, '整日基调'),
              body: localize(locale, '吉日适合推进，凶日更适合拆小、准备或换近期其他日期。'),
              iconSrc: almanac.fortune === '吉' ? '/assets/image2/almanac-yi.png' : '/assets/image2/almanac-ji.png',
              iconAlt: localize(locale, '整日基调图示'),
            },
            {
              label: 'MATCH',
              title: localize(locale, '宜忌对事'),
              body: localize(locale, '宜项要和事情对上，忌项若直接命中，优先换日或避开关键动作。'),
            },
            {
              label: 'HOUR',
              title: localize(locale, '时辰细化'),
              body: localize(locale, '出门、签字、拜访等具体动作，再放到吉时里安排。'),
            },
            {
              label: 'DIRECTION',
              title: localize(locale, '冲煞方位'),
              body: localize(locale, '冲煞提醒生肖与方位多留余地，大事才需要重点核对。'),
              iconSrc: '/assets/image2/direction-compass-cutout.png',
              iconAlt: localize(locale, '方位罗盘图示'),
            },
          ]}
        />
        <SharePanel
          title={tHome('title')}
          text={shareSummary}
          url={`/${routeLocale}`}
          copyText={`今擇易\n${shareSummary}\n${SITE_ORIGIN}/${routeLocale}`}
          labels={{
            title: localize(locale, '分享今日黄历'),
            copyLink: localize(locale, '复制链接'),
            copySummary: localize(locale, '复制摘要'),
            copied: localize(locale, '已复制'),
            nativeShare: localize(locale, '系统分享'),
          }}
        />
      </section>

      <section className="mx-auto max-w-[82rem] px-4 sm:px-6 lg:px-8">
        <GlossaryPanel
          title={localize(locale, '常見詞速查')}
          intro={localize(locale, '幾個常見詞弄清楚，月曆和吉日頁會更容易讀。')}
          entries={getGlossaryEntries(['yiJi', 'luckyHour', 'chongSha', 'ganZhi'], routeLocale)}
        />
      </section>

      <section className="mx-auto grid max-w-[82rem] gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-8">
        <FaqBlock items={homeContent.faq} locale={routeLocale} />
        <InternalLinkGrid links={homeContent.relatedLinks} locale={routeLocale} />
      </section>

      <section className="mx-auto max-w-[82rem] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/calendar"
            className="group rounded-lg border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{tHome('quickEntry')}</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{localize(locale, '按月比較吉日凶日')}</h2>
              </div>
              <CalendarDays className="size-5 text-primary transition duration-300 group-hover:translate-x-1" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {localize(locale, '每一天都能点进去看详细黄历，适合挑选出行、开工和办事日期。')}
            </p>
          </Link>

          <Link
            href="/solar-terms"
            className="group rounded-lg border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{tSolarTerms('title')}</p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">{localize(locale, '了解二十四节气')}</h2>
              </div>
              <SunMedium className="size-5 text-primary transition duration-300 group-hover:rotate-45" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {localize(locale, '节气、民俗和当年节令放在一起，浏览时更容易对照时间节点。')}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/80 px-3 py-2">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Compass className="size-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium leading-6 text-foreground">{value}</p>
    </div>
  );
}
