import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { CalendarDay } from '@/lib/almanac/types';

interface CalendarDayCellProps {
  day: CalendarDay;
  todayLabel: string;
}

export function CalendarDayCell({ day, todayLabel }: CalendarDayCellProps) {
  return (
    <Link
      href={`/almanac/${day.dateStr}`}
      className={cn(
        'flex flex-col items-center justify-center min-h-[48px] p-1 rounded-md transition-colors hover:opacity-80',
        day.fortune === '吉'
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground',
        day.isToday && 'ring-2 ring-primary'
      )}
    >
      <span className="text-base font-semibold">{day.solarDay}</span>
      <span
        className={cn(
          'text-[12px] font-normal',
          day.fortune === '吉' ? 'text-gold' : 'text-muted-foreground'
        )}
      >
        {day.lunarDay}
      </span>
      {day.isToday && (
        <span className="text-[10px] font-medium">{todayLabel}</span>
      )}
    </Link>
  );
}
