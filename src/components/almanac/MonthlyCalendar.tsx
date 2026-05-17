import { getTranslations } from 'next-intl/server';
import { SolarDay } from 'tyme4ts';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDayCell } from './CalendarDayCell';
import type { CalendarDay } from '@/lib/almanac/types';

interface MonthlyCalendarProps {
  year: number;
  month: number;
  days: CalendarDay[];
}

export async function MonthlyCalendar({ year, month, days }: MonthlyCalendarProps) {
  const t = await getTranslations('Calendar');
  const weekdays = t.raw('weekdays') as string[];

  // Compute lunar month name from the first day
  const lunarMonth = SolarDay.fromYmd(year, month, 1).getLunarDay().getLunarMonth().getName();

  // Previous/next month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const prevHref = `/calendar?month=${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  const nextHref = `/calendar?month=${nextYear}-${String(nextMonth).padStart(2, '0')}`;

  // First day offset (0=Sun)
  const firstDayOffset = days.length > 0 ? days[0].weekday : 0;

  return (
    <div className="max-w-2xl w-full space-y-4">
      <h1 className="text-2xl font-bold text-primary">{t('title')}</h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Link href={prevHref}>
          <Button variant="outline" size="icon" aria-label={t('prevMonth')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-lg font-semibold">
          {year}{t('yearSuffix')}{month}{t('monthSuffix')} · {lunarMonth}
        </span>
        <Link href={nextHref}>
          <Button variant="outline" size="icon" aria-label={t('nextMonth')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {days.map((day) => (
          <CalendarDayCell key={day.dateStr} day={day} todayLabel={t('today')} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-primary" />
          <span>{t('legend.auspicious')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-muted" />
          <span>{t('legend.inauspicious')}</span>
        </div>
      </div>
    </div>
  );
}
