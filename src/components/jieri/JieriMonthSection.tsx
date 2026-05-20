import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { AuspiciousDayResult } from '@/lib/almanac/types';
import type { LocaleCode } from '@/lib/content/types';
import { localizeBodyCopy } from '@/lib/content/localize';
import { JieriDateRow } from './JieriDateRow';

interface JieriMonthSectionProps {
  month: number;
  results: AuspiciousDayResult[];
  locale: LocaleCode;
}

export function JieriMonthSection({ month, results, locale }: JieriMonthSectionProps) {
  const recommended = results.filter((result) => result.status === 'recommended').length;

  return (
    <Collapsible defaultOpen={month <= 3 || results.length > 0}>
      <section id={`month-${month}`} className="scroll-mt-24 overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-sm">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 p-4 text-left">
          <span>
            <span className="block text-lg font-semibold">
              {month}{localizeBodyCopy(locale, '月')}
            </span>
            <span className="text-sm text-muted-foreground">
              {localizeBodyCopy(locale, `推荐 ${recommended} 天，谨慎 ${results.length - recommended} 天`)}
            </span>
          </span>
          <span className="rounded-full border border-border px-2 py-1 text-xs font-semibold text-muted-foreground">
            {results.length}
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-3 border-t border-border p-3" data-anime="result">
            {results.length > 0 ? (
              results.map((result) => (
                <JieriDateRow key={result.date} result={result} locale={locale} />
              ))
            ) : (
              <p className="rounded-2xl bg-muted/50 p-3 text-sm text-muted-foreground">
                {localizeBodyCopy(locale, '本月暂无符合条件的日期。')}
              </p>
            )}
          </div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}

