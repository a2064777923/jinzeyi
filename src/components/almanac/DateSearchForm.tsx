'use client';

import { FormEvent, useId, useRef, useState } from 'react';
import { CalendarDays, CalendarSearch, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { ALMANAC_DATE_MAX, ALMANAC_DATE_MIN, isValidAlmanacDateString } from '@/lib/almanac/date-range';

interface DateSearchFormProps {
  label: string;
  buttonLabel: string;
  invalidMessage: string;
  defaultDate: string;
  className?: string;
  compact?: boolean;
}

export function DateSearchForm({
  label,
  buttonLabel,
  invalidMessage,
  defaultDate,
  className,
  compact = false,
}: DateSearchFormProps) {
  const router = useRouter();
  const id = useId();
  const errorId = `${id}-error`;
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState(defaultDate);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidAlmanacDateString(date)) {
      setError(invalidMessage);
      return;
    }

    setError(null);
    router.push(`/almanac/${date}`);
  }

  function openDatePicker() {
    const input = dateInputRef.current;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
  }

  return (
    <form
      className={cn(
        'rounded-lg border border-border/80 bg-card/88 p-3 shadow-sm',
        compact ? 'sm:p-3' : 'sm:p-4',
        className
      )}
      onSubmit={onSubmit}
      noValidate
    >
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground" htmlFor={id}>
        <CalendarSearch className="size-4 text-primary" aria-hidden="true" />
        {label}
      </label>
      <div className="flex flex-col gap-2 min-[420px]:flex-row">
        <div className="flex min-w-0 flex-1">
          <input
            ref={dateInputRef}
            id={id}
            name="date"
            type="date"
            autoComplete="off"
            suppressHydrationWarning
            min={ALMANAC_DATE_MIN}
            max={ALMANAC_DATE_MAX}
            value={date}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            aria-label={`${label}，范围 ${ALMANAC_DATE_MIN} 至 ${ALMANAC_DATE_MAX}`}
            onChange={(event) => {
              setDate(event.target.value);
              if (error) setError(null);
            }}
            className="h-9 min-w-0 flex-1 rounded-l-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-xs outline-none transition focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="-ml-px h-9 w-9 shrink-0 rounded-l-none"
            aria-label={label}
            suppressHydrationWarning
            onClick={openDatePicker}
          >
            <CalendarDays className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <Button type="submit" className="h-9 min-[420px]:shrink-0" suppressHydrationWarning>
          <Search data-icon="inline-start" />
          {buttonLabel}
        </Button>
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-xs font-medium text-destructive" aria-live="polite">
          {error}
        </p>
      )}
    </form>
  );
}
