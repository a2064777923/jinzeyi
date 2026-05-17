import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SeoHeroProps {
  title: string;
  deck: string;
  kicker?: string;
  badges?: string[];
  imageSrc?: string;
  imageAlt?: string;
  icon?: ReactNode;
  controls?: ReactNode;
  className?: string;
}

export function SeoHero({
  title,
  deck,
  kicker,
  badges = [],
  imageSrc,
  imageAlt = '',
  icon,
  controls,
  className,
}: SeoHeroProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-border/80 bg-card p-5 shadow-sm sm:p-6 lg:p-8',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 almanac-grid opacity-45" aria-hidden="true" />
      <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {imageSrc ? (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-background/85 p-2 shadow-sm">
                <Image src={imageSrc} alt={imageAlt} width={40} height={40} className="size-10 object-contain" />
              </span>
            ) : icon ? (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-background/85 text-primary shadow-sm">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0">
              {kicker && (
                <p className="text-sm font-semibold leading-6 text-accent">
                  {kicker}
                </p>
              )}
              <h1 className="font-serif-display text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
          </div>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {deck}
          </p>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {controls && (
          <div className="min-w-0 lg:w-80">
            {controls}
          </div>
        )}
      </div>
    </div>
  );
}

