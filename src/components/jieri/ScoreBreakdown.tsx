import { Badge } from '@/components/ui/badge';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { AuspiciousScoreDimension } from '@/lib/almanac/types';
import type { LocaleCode } from '@/lib/content/types';

interface ScoreBreakdownProps {
  dimensions: AuspiciousScoreDimension[];
  locale: LocaleCode;
}

export function ScoreBreakdown({ dimensions, locale }: ScoreBreakdownProps) {
  return (
    <div className="grid gap-2">
      {dimensions.map((dimension) => {
        const width = `${Math.max((dimension.score / dimension.maxScore) * 100, 4)}%`;

        return (
          <div key={dimension.key} className="rounded-md border border-border bg-background/75 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {localizeBodyCopy(locale, dimension.label)}
              </p>
              <Badge variant="outline">
                {dimension.score}/{dimension.maxScore}
              </Badge>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width }} />
            </div>
            <div className="mt-2 grid gap-1 text-xs leading-5 text-muted-foreground">
              {[...dimension.reasons, ...dimension.cautions].slice(0, 2).map((item) => (
                <p key={item}>{localizeBodyCopy(locale, item)}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
