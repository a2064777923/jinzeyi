import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const points = Array.from({ length: 24 }, (_, index) => {
  const angle = (index / 24) * Math.PI * 2;
  const radius = 42;
  return {
    left: 50 + Math.sin(angle) * radius,
    top: 50 - Math.cos(angle) * radius,
    delay: index * 65,
  };
});

const seasonLabels = [
  { label: '春', left: '72%', top: '28%' },
  { label: '夏', left: '72%', top: '72%' },
  { label: '秋', left: '28%', top: '72%' },
  { label: '冬', left: '28%', top: '28%' },
];

export function SolarOrbit({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'solar-orbit relative aspect-square w-full max-w-[22rem] overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-sm',
        className
      )}
      aria-hidden="true"
    >
      <div className="almanac-grid absolute inset-0 opacity-50" />
      <div className="solar-orbit__glow absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="absolute inset-[8%] rounded-full border border-primary/20" />
      <div className="absolute inset-[18%] rounded-full border border-accent/30" />
      <div className="absolute inset-[31%] rounded-full border border-border/80 bg-background/65" />

      {points.map((point, index) => (
        <span
          key={index}
          className={cn(
            'solar-orbit__tick absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full',
            index % 2 === 0 ? 'bg-primary' : 'bg-accent'
          )}
          style={
            {
              left: `${point.left}%`,
              top: `${point.top}%`,
              '--tick-delay': `${point.delay}ms`,
            } as CSSProperties
          }
        />
      ))}

      {seasonLabels.map((season) => (
        <span
          key={season.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
          style={{ left: season.left, top: season.top }}
        >
          {season.label}
        </span>
      ))}

      <div className="solar-orbit__bead absolute left-1/2 top-1/2 size-3 rounded-full bg-accent shadow-[0_0_24px_rgba(217,119,6,0.72)]" />
      <div className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/25 bg-card shadow-sm">
        <div className="text-center">
          <p className="text-2xl font-semibold leading-none text-primary">今</p>
          <p className="mt-1 text-[11px] font-medium tracking-[0.16em] text-muted-foreground">
            24
          </p>
        </div>
      </div>
    </div>
  );
}
