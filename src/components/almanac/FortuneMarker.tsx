import { cn } from '@/lib/utils';

interface FortuneMarkerProps {
  fortune: '吉' | '凶';
  size?: 'xs' | 'sm' | 'lg';
  variant?: 'seal' | 'pill' | 'text';
  className?: string;
}

export function FortuneMarker({
  fortune,
  size = 'lg',
  variant = 'seal',
  className,
}: FortuneMarkerProps) {
  const isLucky = fortune === '吉';

  if (variant === 'text') {
    return (
      <span
        className={cn(
          'font-semibold tracking-normal',
          size === 'lg' && 'text-[36px]',
          size === 'sm' && 'text-[20px]',
          size === 'xs' && 'text-sm',
          isLucky ? 'text-lucky' : 'text-ominous',
          className
        )}
      >
        {fortune}
      </span>
    );
  }

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-full border font-semibold shadow-sm',
          size === 'lg' && 'px-3 py-1.5 text-base',
          size === 'sm' && 'px-2.5 py-1 text-sm',
          size === 'xs' && 'px-2 py-0.5 text-xs',
          isLucky
            ? 'border-lucky/35 bg-lucky/12 text-lucky shadow-lucky/10'
            : 'border-ominous/35 bg-ominous/12 text-ominous shadow-ominous/10',
          className
        )}
      >
        <span
          className={cn(
            'size-1.5 rounded-full',
            isLucky ? 'bg-lucky' : 'bg-ominous'
          )}
          aria-hidden="true"
        />
        {fortune}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'fortune-seal relative inline-grid shrink-0 place-items-center overflow-hidden rounded-md border font-serif-display font-bold shadow-sm',
        size === 'lg' && 'size-16 text-[34px]',
        size === 'sm' && 'size-10 text-xl',
        size === 'xs' && 'size-7 text-sm',
        isLucky
          ? 'border-lucky/45 bg-lucky/12 text-lucky shadow-lucky/12'
          : 'border-ominous/45 bg-ominous/12 text-ominous shadow-ominous/12',
        className
      )}
      data-fortune={isLucky ? 'lucky' : 'ominous'}
      aria-label={isLucky ? '吉' : '凶'}
    >
      {fortune}
    </span>
  );
}
