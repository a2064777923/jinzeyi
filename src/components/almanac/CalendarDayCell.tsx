import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { convertToTraditional } from '@/lib/opencc';
import type { CalendarDay } from '@/lib/almanac/types';

interface CalendarDayCellProps {
  day: CalendarDay;
  todayLabel: string;
}

export async function CalendarDayCell({ day, todayLabel }: CalendarDayCellProps) {
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;
  const yi = day.yi ?? [];
  const ji = day.ji ?? [];
  const duty = day.duty ?? '';
  const twelveStar = day.twelveStar ?? '';
  const isLucky = day.fortune === '吉';

  return (
    <Link
      href={`/almanac/${day.dateStr}`}
      data-anime-calendar-cell
      data-anime-hover
      aria-label={`${day.dateStr} ${localize(day.lunarDay)} ${day.fortune}${day.solarTerm ? ` ${localize(day.solarTerm)}` : ''}${day.isToday ? ` ${todayLabel}` : ''}`}
      className={cn(
        'group relative flex h-[5.4rem] min-w-0 cursor-pointer flex-col overflow-hidden rounded-md border p-1.5 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:aspect-square sm:h-auto sm:min-h-[7.9rem] sm:p-2',
        isLucky
          ? 'border-lucky/55 bg-[linear-gradient(145deg,#C2410C,#B91C1C_58%,#7F1D1D)] text-lucky-foreground shadow-lucky/15'
          : 'border-ominous/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(241,245,249,0.92)_46%,rgba(226,232,240,0.9))] text-foreground shadow-ominous/10',
        day.isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {isLucky ? (
        <span className="fortune-pattern fortune-pattern-bleed fortune-pattern-lucky absolute opacity-55" aria-hidden="true" />
      ) : (
        <span className="fortune-pattern fortune-pattern-bleed fortune-pattern-ominous absolute opacity-95" aria-hidden="true" />
      )}
      <span
        className={cn(
          'absolute -right-6 -top-6 size-16 rounded-full blur-2xl transition duration-300 group-hover:opacity-90',
          isLucky ? 'bg-accent/55 opacity-60' : 'bg-ominous/16 opacity-70'
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'absolute right-1 top-1 inline-flex min-w-5 items-center justify-center rounded border px-1 text-[9px] font-bold leading-4 shadow-sm sm:text-[10px]',
          isLucky
            ? 'border-lucky-foreground/45 bg-lucky-foreground/18 text-lucky-foreground'
            : 'border-ominous/65 bg-ominous text-ominous-foreground'
        )}
      >
        {day.fortune}
      </span>
      {day.solarTerm && (
        <span className="absolute left-1 top-1 size-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(217,119,6,0.16)]" aria-hidden="true" />
      )}
      <span
        className={cn(
          'relative mt-1 font-serif-display text-[1.32rem] font-semibold leading-none sm:text-[1.55rem]',
          isLucky ? 'text-lucky-foreground' : 'text-foreground'
        )}
      >
        {day.solarDay}
      </span>
      <div className="relative mt-1 min-w-0 space-y-0.5">
        <p
          className={cn(
            'truncate text-[10px] font-medium leading-4 sm:text-[11px]',
            isLucky ? 'text-lucky-foreground/92' : 'text-foreground/74'
          )}
        >
          {day.solarTerm ? localize(day.solarTerm) : localize(day.lunarDay)}
        </p>
        <p
          className={cn(
            'hidden truncate text-[10px] font-medium leading-4 sm:block',
            isLucky ? 'text-lucky-foreground/78' : 'text-foreground/70'
          )}
        >
          {duty || twelveStar ? `${localize(duty)} · ${localize(twelveStar)}` : '—'}
        </p>
      </div>
      <div className="relative mt-auto hidden min-w-0 space-y-0.5 sm:block">
        <p
          className={cn(
            'truncate text-[10px] leading-4',
            isLucky ? 'text-lucky-foreground/88' : 'text-foreground/74'
          )}
        >
          宜 {yi.length > 0 ? yi.map(localize).join('、') : '—'}
        </p>
        <p
          className={cn(
            'truncate text-[10px] leading-4',
            isLucky ? 'text-lucky-foreground/72' : 'font-medium text-ominous'
          )}
        >
          忌 {ji.length > 0 ? ji.map(localize).join('、') : '—'}
        </p>
      </div>
      {day.isToday && (
        <span className="absolute bottom-1 right-1 rounded-full bg-background/90 px-1 py-0.5 text-[9px] font-medium text-foreground sm:px-1.5 sm:text-[10px]">
          {todayLabel}
        </span>
      )}
    </Link>
  );
}
