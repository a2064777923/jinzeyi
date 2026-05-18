import { ArrowRight, BookOpenText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode, MetaphysicsEntry } from '@/lib/content/types';

interface KnowledgeEntryCardProps {
  entry: MetaphysicsEntry;
  locale: LocaleCode;
}

export function KnowledgeEntryCard({ entry, locale }: KnowledgeEntryCardProps) {
  const name = localizeBodyCopy(locale, entry.name);
  const short = localizeBodyCopy(locale, entry.short);
  const category = localizeBodyCopy(locale, entry.categoryLabel);
  const hint = entry.chartHint
    ? localizeBodyCopy(locale, entry.chartHint)
    : localizeBodyCopy(locale, entry.practicalUse);

  return (
    <Link
      href={entry.path}
      className="group flex min-h-52 min-w-0 flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:bg-secondary/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="flex min-w-0 flex-col gap-3">
        <span className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="max-w-full">
            {category}
          </Badge>
          <BookOpenText className="size-4 shrink-0 text-primary" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-semibold leading-tight text-foreground">
            {name}
          </span>
          <span className="mt-2 block text-sm leading-6 text-muted-foreground">
            {short}
          </span>
        </span>
        <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {hint}
        </span>
      </span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {localizeBodyCopy(locale, entry.linkLabel)}
        <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
