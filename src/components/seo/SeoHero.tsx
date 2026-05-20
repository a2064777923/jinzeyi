import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { SharePanel } from '@/components/share/SharePanel';
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
  shareUrl?: string;
  shareLabel?: string;
  shareMode?: 'full' | 'compact' | 'hidden';
}

export function SeoHero({
  title,
  deck,
  kicker,
  badges = [],
  imageSrc,
  imageAlt,
  icon,
  controls,
  className,
  shareUrl,
  shareLabel,
  shareMode = 'full',
}: SeoHeroProps) {
  const resolvedImageAlt = imageAlt ?? title;

  return (
    <div
      data-anime="hero"
      className={cn(
        'relative isolate overflow-hidden rounded-xl border border-border/80 bg-[radial-gradient(circle_at_12%_18%,rgba(253,230,138,0.38),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(4,120,87,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,250,246,0.88))] p-5 shadow-sm shadow-primary/5 sm:p-6 lg:p-7',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 almanac-grid opacity-38" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#C2410C,#D97706,#047857)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 -top-16 hidden size-44 rounded-full border border-primary/10 bg-primary/6 sm:block" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-5 right-6 hidden rounded-full border border-accent/25 bg-accent/8 px-3 py-1 text-xs font-semibold text-accent lg:block" aria-hidden="true">
        JinZeYi
      </div>
      <div className="relative grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 flex-col gap-4" data-anime-item>
          <div className="flex flex-wrap items-center gap-3">
            {imageSrc ? (
              <span className="relative flex size-16 shrink-0 items-center justify-center rounded-xl border border-border bg-background/88 p-2 shadow-sm shadow-primary/5" data-anime-hover>
                <Image
                  src={imageSrc}
                  alt={resolvedImageAlt}
                  fill
                  className="object-contain p-2.5"
                  sizes="64px"
                  loading="eager"
                />
              </span>
            ) : icon ? (
              <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-border bg-background/88 text-primary shadow-sm shadow-primary/5" data-anime-hover>
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
          <p className="max-w-3xl text-[1.02rem] leading-7 text-foreground/72 sm:text-lg">
            {deck}
          </p>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary" className="border border-primary/10 bg-secondary/80">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {controls && (
          <div className="min-w-0 lg:w-[20rem]" data-anime-item>
            {controls}
          </div>
        )}
      </div>
      {shareUrl && shareMode !== 'hidden' ? (
        <div className="relative mt-5 flex" data-anime-item>
          {shareMode === 'compact' ? (
            <SharePanel
              title={title}
              text={deck}
              url={shareUrl}
              labels={{
                ...(shareLabel ? { title: shareLabel } : {}),
              }}
              className="w-full bg-background/82 sm:w-auto sm:min-w-72 sm:max-w-md"
            />
          ) : (
            <SharePanel
              title={title}
              text={deck}
              url={shareUrl}
              labels={{
                ...(shareLabel ? { title: shareLabel } : {}),
              }}
              className="bg-background/82"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
