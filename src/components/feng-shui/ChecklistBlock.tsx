import { CheckCircle2 } from 'lucide-react';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

export function ChecklistBlock({ items, locale }: { items: string[]; locale: LocaleCode }) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-base font-semibold">{localizeBodyCopy(locale, '实用检查清单')}</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div key={item} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 rounded-md bg-background p-3 text-sm leading-6">
            <CheckCircle2 className="mt-0.5 size-4 text-lucky" aria-hidden="true" />
            <span>{localizeBodyCopy(locale, item)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
