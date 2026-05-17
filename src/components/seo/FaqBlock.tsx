import { HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { FaqItem } from '@/lib/content/types';
import { cn } from '@/lib/utils';

interface FaqBlockProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqBlock({ items, title = '常见问题', className }: FaqBlockProps) {
  if (items.length === 0) return null;

  return (
    <section className={cn('flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5', className)}>
      <div className="flex items-center gap-2">
        <HelpCircle className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex flex-col gap-3">
            {index > 0 && <Separator />}
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold leading-snug">{item.question}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

