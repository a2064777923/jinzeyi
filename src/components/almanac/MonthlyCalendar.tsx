import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import type { CSSProperties, ReactNode } from 'react';
import { SolarDay } from 'tyme4ts';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Compass,
  ShieldAlert,
  Sparkles,
  Sprout,
  SunMedium,
} from 'lucide-react';
import { CalendarDayCell } from './CalendarDayCell';
import { DateSearchForm } from './DateSearchForm';
import { SharePanel } from '@/components/share/SharePanel';
import { cn } from '@/lib/utils';
import { convertToTraditional } from '@/lib/opencc';
import { formatAlmanacMonth } from '@/lib/almanac/date-range';
import type { CalendarDay } from '@/lib/almanac/types';

interface MonthlyCalendarProps {
  year: number;
  month: number;
  days: CalendarDay[];
}

export async function MonthlyCalendar({ year, month, days }: MonthlyCalendarProps) {
  const t = await getTranslations('Calendar');
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;
  const weekdays = t.raw('weekdays') as string[];
  const normalizedDays = days.map(normalizeCalendarDay);

  const lunarMonth = localize(
    SolarDay.fromYmd(year, month, 1).getLunarDay().getLunarMonth().getName()
  );

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const prevHref = `/calendar?month=${formatAlmanacMonth(prevYear, prevMonth)}`;
  const nextHref = `/calendar?month=${formatAlmanacMonth(nextYear, nextMonth)}`;

  const firstDayOffset = normalizedDays.length > 0 ? normalizedDays[0].weekday : 0;
  const luckyDays = normalizedDays.filter((day) => day.fortune === '吉');
  const ominousDays = normalizedDays.filter((day) => day.fortune === '凶');
  const termDays = normalizedDays.filter((day) => day.solarTerm);
  const today = normalizedDays.find((day) => day.isToday);
  const topLuckyDays = luckyDays.slice(0, 5);
  const topOminousDays = ominousDays.slice(0, 4);
  const luckyPercent = normalizedDays.length > 0
    ? Math.round((luckyDays.length / normalizedDays.length) * 100)
    : 0;
  const ominousPercent = normalizedDays.length > 0 ? 100 - luckyPercent : 0;
  const termNames = termDays.map((day) => localize(day.solarTerm ?? '')).join('、');
  const shareUrl = `/${locale}/calendar?month=${formatAlmanacMonth(year, month)}`;
  const shareText = localize(
    `${year}年${month}月月历：吉日 ${luckyDays.length} 天，凶日 ${ominousDays.length} 天，节气 ${termDays.length} 个。适合先比较整月，再点进日期看完整黄历。`
  );

  return (
    <div className="w-full max-w-[82rem] space-y-6">
      <section className="animate-reveal-up relative isolate overflow-hidden rounded-lg border border-border/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,247,237,0.76)_48%,rgba(244,250,246,0.92))] p-4 shadow-sm sm:p-6">
        <div className="almanac-grid absolute inset-0 opacity-45" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#B91C1C,#D97706,#047857)]" aria-hidden="true" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-lucky/30 bg-lucky/10 px-2.5 py-1 text-xs font-semibold text-lucky">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {t('title')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                <SunMedium className="size-3.5" aria-hidden="true" />
                {termNames || t('summary.noSolarTerm')}
              </span>
            </div>

            <div>
              <h1 className="font-serif-display text-[2rem] font-semibold leading-tight text-foreground sm:text-5xl">
                {year}{t('yearSuffix')}{month}{t('monthSuffix')} · {lunarMonth}
              </h1>
              <p className="mt-3 line-clamp-3 max-w-3xl text-sm font-medium leading-7 text-foreground/76 sm:text-base">
                {t('summary.description')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MonthMetric
                icon="lucky"
                label={t('summary.luckyDays')}
                value={String(luckyDays.length)}
                hint={`${luckyPercent}%`}
              />
              <MonthMetric
                icon="ominous"
                label={t('summary.ominousDays')}
                value={String(ominousDays.length)}
                hint={`${ominousPercent}%`}
              />
              <MonthMetric
                icon="term"
                label={t('summary.solarTerms')}
                value={String(termDays.length)}
                hint={t('summary.monthOverview')}
              />
            </div>

            <div className="rounded-lg border border-border/75 bg-card/84 p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                <span>{t('summary.luckyRatio')}</span>
                <span className="font-semibold text-lucky">{luckyDays.length}/{normalizedDays.length}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ominous/14">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#B91C1C,#D97706)] transition-[width] duration-500 ease-out"
                  style={{ width: `${luckyPercent}%` }}
                />
              </div>
            </div>

            <DateSearchForm
              label={t('search.label')}
              buttonLabel={t('search.button')}
              invalidMessage={t('search.invalid')}
              defaultDate={today?.dateStr ?? `${year}-${String(month).padStart(2, '0')}-01`}
              compact
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-1">
            <div className="relative min-h-28 overflow-visible rounded-lg border border-accent/25 bg-card/82 p-3 shadow-sm sm:min-h-36 sm:p-4">
              <div className="fortune-pattern fortune-pattern-bleed fortune-pattern-lucky absolute opacity-35" aria-hidden="true" />
              <div className="relative mx-auto aspect-square w-20 animate-reveal-up sm:w-28" style={{ '--reveal-delay': '80ms' } as CSSProperties}>
                <Image
                  src="/assets/almanac-icons/calendar.png"
                  alt={localize(`${year}年${month}月月历图示`)}
                  fill
                  className="object-contain drop-shadow-[0_16px_24px_rgba(20,37,31,0.18)]"
                  sizes="112px"
                  priority
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniFact
                icon={<Sparkles className="size-4" aria-hidden="true" />}
                label={t('summary.bestEntry')}
                value={topLuckyDays[0] ? `${month}/${topLuckyDays[0].solarDay} ${topLuckyDays[0].yi.map(localize).join('、')}` : t('summary.noLucky')}
                tone="lucky"
              />
              <MiniFact
                icon={<SunMedium className="size-4" aria-hidden="true" />}
                label={t('summary.termTitle')}
                value={termNames || t('summary.noTermDays')}
                tone="term"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="animate-reveal-up rounded-lg border border-border bg-card p-3 shadow-sm sm:p-5" style={{ '--reveal-delay': '90ms' } as CSSProperties}>
          <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={prevHref}
              aria-label={t('prevMonthAria', { year: prevYear, month: prevMonth })}
              className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'h-10 cursor-pointer gap-1 px-2 sm:px-3')}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden text-xs font-semibold sm:inline">{t('prevMonth')}</span>
            </Link>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">{lunarMonth}</p>
              <p className="text-lg font-semibold text-foreground">
                {year}{t('yearSuffix')}{month}{t('monthSuffix')}
              </p>
            </div>
            <Link
              href={nextHref}
              aria-label={t('nextMonthAria', { year: nextYear, month: nextMonth })}
              className={cn(buttonVariants({ variant: 'outline', size: 'default' }), 'h-10 cursor-pointer gap-1 px-2 sm:px-3')}
            >
              <span className="hidden text-xs font-semibold sm:inline">{t('nextMonth')}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <CalendarInsight
              icon={<Sparkles className="size-4" aria-hidden="true" />}
              title={t('summary.quickLucky')}
              body={topLuckyDays.slice(0, 3).map((day) => `${day.solarDay}`).join('、') || t('summary.noLucky')}
              tone="lucky"
            />
            <CalendarInsight
              icon={<ShieldAlert className="size-4" aria-hidden="true" />}
              title={t('summary.quickOminous')}
              body={topOminousDays.slice(0, 3).map((day) => `${day.solarDay}`).join('、') || t('summary.noOminous')}
              tone="ominous"
            />
            <CalendarInsight
              icon={<Sprout className="size-4" aria-hidden="true" />}
              title={t('summary.quickTerm')}
              body={termNames || t('summary.noTermDays')}
              tone="term"
            />
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2" data-anime="calendar">
            {weekdays.map((day) => (
              <div
                key={day}
                className="py-1 text-center text-xs font-semibold uppercase tracking-normal text-muted-foreground sm:py-2 sm:text-sm"
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {normalizedDays.map((day) => (
              <CalendarDayCell key={day.dateStr} day={day} todayLabel={t('today')} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-md border border-border/70 bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
            <LegendDot tone="lucky" label={t('legend.auspicious')} />
            <LegendDot tone="ominous" label={t('legend.inauspicious')} />
            <LegendDot tone="term" label={t('legend.solarTerm')} />
          </div>
          </div>
        </div>

        <aside className="space-y-4">
          <InfoCard
            icon={<Sparkles className="size-4" aria-hidden="true" />}
            title={t('summary.recommendedTitle')}
            tone="lucky"
          >
            <div className="space-y-2">
              {topLuckyDays.length > 0 ? topLuckyDays.map((day) => (
                <DayLink key={day.dateStr} day={day} month={month} localize={localize} tone="lucky" />
              )) : (
                <p className="text-sm leading-6 text-muted-foreground">{t('summary.noLucky')}</p>
              )}
            </div>
          </InfoCard>

          <InfoCard
            icon={<ShieldAlert className="size-4" aria-hidden="true" />}
            title={t('summary.avoidTitle')}
            tone="ominous"
          >
            <div className="space-y-2">
              {topOminousDays.length > 0 ? topOminousDays.map((day) => (
                <DayLink key={day.dateStr} day={day} month={month} localize={localize} tone="ominous" />
              )) : (
                <p className="text-sm leading-6 text-muted-foreground">{t('summary.noOminous')}</p>
              )}
            </div>
          </InfoCard>

          <InfoCard
            icon={<BookOpen className="size-4" aria-hidden="true" />}
            title={t('guide.title')}
          >
            <div className="space-y-3">
              <LearningRow icon={<Sparkles className="size-4" aria-hidden="true" />} text={t('guide.stepFortune')} />
              <LearningRow icon={<SunMedium className="size-4" aria-hidden="true" />} text={t('guide.stepSolarTerm')} />
              <LearningRow icon={<Compass className="size-4" aria-hidden="true" />} text={t('guide.stepDetail')} />
            </div>
          </InfoCard>

          <InfoCard
            icon={<CircleAlert className="size-4" aria-hidden="true" />}
            title={t('guide.noteTitle')}
          >
            <p className="text-sm leading-6 text-muted-foreground">
              {today
                ? t('guide.todayNote', {
                    date: `${month}/${today.solarDay}`,
                    fortune: today.fortune,
                  })
                : t('guide.generalNote')}
            </p>
          </InfoCard>

          <SharePanel
            title={localize(`${year}年${month}月月历`)}
            text={shareText}
            url={shareUrl}
            labels={{
              title: localize('分享这张月历'),
              copyLink: localize('复制链接'),
              copySummary: localize('复制摘要'),
              copied: localize('已复制'),
              nativeShare: localize('系统分享'),
            }}
          />
        </aside>
      </section>
    </div>
  );
}

function normalizeCalendarDay(day: CalendarDay): CalendarDay {
  return {
    ...day,
    duty: day.duty ?? '',
    twelveStar: day.twelveStar ?? '',
    solarTerm: day.solarTerm ?? null,
    yi: day.yi ?? [],
    ji: day.ji ?? [],
  };
}

function MonthMetric({
  icon,
  label,
  value,
  hint,
}: {
  icon: 'lucky' | 'ominous' | 'term';
  label: string;
  value: string;
  hint: string;
}) {
  const Icon = icon === 'term' ? SunMedium : icon === 'lucky' ? Sparkles : ShieldAlert;
  return (
    <div
      className={cn(
        'shimmer-panel rounded-lg border bg-card/86 p-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 sm:p-3',
        icon === 'lucky' && 'border-lucky/28',
        icon === 'ominous' && 'border-ominous/28',
        icon === 'term' && 'border-accent/28'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-semibold leading-4 text-foreground/72">{label}</p>
        <Icon
          className={cn(
            'size-4',
            icon === 'lucky' && 'text-lucky',
            icon === 'ominous' && 'text-ominous',
            icon === 'term' && 'text-accent'
          )}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-xl font-semibold text-foreground sm:text-2xl">{value}</p>
        <p className="truncate pb-0.5 text-xs font-semibold text-foreground/62">{hint}</p>
      </div>
    </div>
  );
}

function MiniFact({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'lucky' | 'term';
}) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card/86 p-2.5 shadow-sm sm:p-3',
        tone === 'lucky' ? 'border-lucky/28' : 'border-accent/28'
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            'grid size-6 place-items-center rounded-md sm:size-7',
            tone === 'lucky' ? 'bg-lucky/10 text-lucky' : 'bg-accent/10 text-accent'
          )}
        >
          {icon}
        </span>
        <p className="truncate text-xs font-semibold leading-4 text-foreground/72">{label}</p>
      </div>
      <p className="line-clamp-2 text-xs font-semibold leading-5 text-foreground sm:text-sm sm:leading-6">{value}</p>
    </div>
  );
}

function CalendarInsight({
  icon,
  title,
  body,
  tone,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  tone: 'lucky' | 'ominous' | 'term';
}) {
  return (
    <div
      className={cn(
        'rounded-md border px-2 py-2 sm:px-3',
        tone === 'lucky' && 'border-lucky/25 bg-lucky/8',
        tone === 'ominous' && 'border-ominous/25 bg-ominous/8',
        tone === 'term' && 'border-accent/25 bg-accent/8'
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'hidden size-7 shrink-0 place-items-center rounded-md bg-card/80 sm:grid',
            tone === 'lucky' && 'text-lucky',
            tone === 'ominous' && 'text-ominous',
            tone === 'term' && 'text-accent'
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold leading-4 text-foreground/70">{title}</p>
          <p className="truncate text-[13px] font-semibold text-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ tone, label }: { tone: 'lucky' | 'ominous' | 'term'; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'grid h-4 w-4 place-items-center rounded border text-[9px] font-bold leading-none',
          tone === 'lucky' && 'border-lucky bg-lucky text-lucky-foreground',
          tone === 'ominous' && 'fortune-pattern fortune-pattern-ominous border-ominous bg-card text-ominous',
          tone === 'term' && 'border-accent bg-accent text-accent-foreground'
        )}
        aria-hidden="true"
      >
        {tone === 'term' ? '' : tone === 'lucky' ? '吉' : '凶'}
      </span>
      <span>{label}</span>
    </div>
  );
}

function DayLink({
  day,
  month,
  localize,
  tone,
}: {
  day: CalendarDay;
  month: number;
  localize: (value: string) => string;
  tone: 'lucky' | 'ominous';
}) {
  const items = tone === 'lucky' ? (day.yi ?? []) : (day.ji ?? []);
  return (
    <Link
      href={`/almanac/${day.dateStr}`}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        tone === 'lucky'
          ? 'border-lucky/24 bg-lucky/8 hover:bg-lucky/12'
          : 'border-ominous/24 bg-ominous/7 hover:bg-ominous/10'
      )}
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-md border font-serif-display text-base font-semibold',
          tone === 'lucky'
            ? 'border-lucky/35 bg-lucky text-lucky-foreground'
            : 'fortune-pattern fortune-pattern-ominous border-ominous/35 bg-card text-ominous'
        )}
      >
        {month}/{day.solarDay}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-foreground">
          {day.solarTerm ? localize(day.solarTerm) : localize(day.lunarDay)}
        </span>
        <span className="block truncate text-xs leading-5 text-muted-foreground">
          {items.length > 0 ? items.map(localize).join('、') : '—'}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

function LearningRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex gap-3 text-sm leading-6 text-muted-foreground">
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-primary">
        {icon}
      </span>
      <p>{text}</p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  tone,
  children,
}: {
  icon: ReactNode;
  title: string;
  tone?: 'lucky' | 'ominous';
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'animate-reveal-up rounded-lg border border-border bg-card p-4 shadow-sm',
        tone === 'lucky' && 'border-lucky/25',
        tone === 'ominous' && 'border-ominous/25'
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            'grid size-8 place-items-center rounded-md bg-secondary text-primary',
            tone === 'lucky' && 'bg-lucky/10 text-lucky',
            tone === 'ominous' && 'bg-ominous/10 text-ominous'
          )}
        >
          {icon}
        </span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}
