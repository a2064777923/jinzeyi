import { cn } from '@/lib/utils';

interface FortuneMarkerProps {
  fortune: '吉' | '凶';
  size?: 'sm' | 'lg';
}

export function FortuneMarker({ fortune, size = 'lg' }: FortuneMarkerProps) {
  return (
    <span
      className={cn(
        'font-semibold tracking-tight',
        size === 'lg' ? 'text-[36px]' : 'text-[20px]',
        fortune === '吉' ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {fortune}
    </span>
  );
}
