import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { InternalLink } from '@/lib/content/types';
import { cn } from '@/lib/utils';

interface InternalLinkGridProps {
  links: InternalLink[];
  title?: string;
  className?: string;
}

export function InternalLinkGrid({ links, title = '相关入口', className }: InternalLinkGridProps) {
  if (links.length === 0) return null;

  return (
    <section className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <LinkIcon className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex min-w-0 items-start justify-between gap-3 rounded-lg border border-border bg-card p-4 text-sm transition hover:border-primary/40 hover:bg-secondary/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">{link.label}</span>
              {link.description && (
                <span className="mt-1 block leading-6 text-muted-foreground">{link.description}</span>
              )}
            </span>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

