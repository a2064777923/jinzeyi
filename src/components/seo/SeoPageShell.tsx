import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SeoPageShellProps {
  children: ReactNode;
  className?: string;
}

interface SeoPageBandProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: 'default' | 'muted' | 'plain';
}

const toneClassName = {
  default: 'bg-background',
  muted: 'bg-muted/60',
  plain: 'bg-transparent',
} as const;

export function SeoPageShell({ children, className }: SeoPageShellProps) {
  return (
    <main className={cn('flex min-w-0 flex-col', className)}>
      {children}
    </main>
  );
}

export function SeoPageBand({
  children,
  className,
  innerClassName,
  tone = 'default',
}: SeoPageBandProps) {
  return (
    <section className={cn('w-full py-8 sm:py-10 lg:py-12', toneClassName[tone], className)}>
      <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
}

