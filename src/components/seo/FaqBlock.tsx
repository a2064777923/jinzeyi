import { ChevronDown, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { FaqItem, LocaleCode } from '@/lib/content/types';
import { cn } from '@/lib/utils';

interface FaqBlockProps {
  items: FaqItem[];
  title?: string;
  locale?: LocaleCode;
  className?: string;
}

export function FaqBlock({ items, title = '常见问题', locale, className }: FaqBlockProps) {
  if (items.length === 0) return null;
  const copy = (value: string) => (locale ? localizeBodyCopy(locale, value) : value);

  return (
    <section className={cn('flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5', className)}>
      <div className="flex items-center gap-2">
        <HelpCircle className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold leading-tight">{copy(title)}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-3">
            {index > 0 && <Separator />}
            <details className="group" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-md px-1 py-1 text-base font-semibold leading-snug marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span>{copy(item.question)}</span>
                <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="px-1 pb-1 pt-2 text-sm leading-7 text-muted-foreground">{copy(item.answer)}</p>
            </details>
          </div>
        ))}
      </div>
    </section>
  );
}
