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
}: SeoHeroProps) {
  const resolvedImageAlt = imageAlt ?? title;

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
                <Image src={imageSrc} alt={resolvedImageAlt} width={40} height={40} className="size-10 object-contain" />
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
      {shareUrl ? (
        <div className="relative mt-5">
          <SharePanel
            title={title}
            text={deck}
            url={shareUrl}
            labels={{
              title: shareLabel ?? '分享這頁',
              copyLink: '複製連結',
              copySummary: '複製摘要',
              copied: '已複製',
              nativeShare: '系統分享',
            }}
            className="bg-background/82"
          />
        </div>
      ) : null}
    </div>
  );
}
