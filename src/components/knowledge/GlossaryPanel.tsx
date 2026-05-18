import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { GlossaryEntry } from '@/lib/content/glossary';

interface GlossaryPanelProps {
  title: string;
  intro: string;
  entries: GlossaryEntry[];
}

export function GlossaryPanel({ title, intro, entries }: GlossaryPanelProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <BookOpen className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{intro}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.key} className="rounded-md border border-border bg-background/70 p-3">
            <h3 className="text-sm font-semibold text-foreground">
              <dfn className="not-italic">{entry.term}</dfn>
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.detail}</p>
            {entry.practicalUse ? (
              <p className="mt-2 rounded-md bg-secondary/65 px-2 py-1.5 text-xs leading-5 text-secondary-foreground">
                {entry.practicalUse}
              </p>
            ) : null}
            {entry.sourceNotes?.[0] ? (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {entry.sourceNotes[0]}
              </p>
            ) : null}
            {entry.href && entry.linkLabel ? (
              <Link href={entry.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                {entry.linkLabel}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
