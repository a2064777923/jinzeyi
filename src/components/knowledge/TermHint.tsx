import { ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { GlossaryEntry } from '@/lib/content/glossary';

interface TermHintProps {
  entry: GlossaryEntry;
  className?: string;
}

export function TermHint({ entry, className }: TermHintProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={className}
          aria-label={`${entry.term}: ${entry.short}`}
        >
          <span className="inline-flex items-center gap-1 rounded-md text-primary underline decoration-primary/30 underline-offset-4 transition hover:text-primary/80">
            <dfn className="not-italic">{entry.term}</dfn>
            <HelpCircle className="size-3.5" aria-hidden="true" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="block max-w-[20rem] bg-card p-3 text-left text-foreground shadow-lg">
          <span className="block text-sm font-semibold">{entry.term}</span>
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">{entry.short}</span>
          {entry.chartHint ? (
            <span className="mt-2 block rounded-md bg-secondary/70 px-2 py-1.5 text-xs leading-5 text-secondary-foreground">
              {entry.chartHint}
            </span>
          ) : null}
          {entry.sourceNotes?.[0] ? (
            <span className="mt-2 block text-[11px] leading-5 text-muted-foreground">
              {entry.sourceNotes[0]}
            </span>
          ) : null}
          {entry.href && entry.linkLabel ? (
            <Link href={entry.href} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              {entry.linkLabel}
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
