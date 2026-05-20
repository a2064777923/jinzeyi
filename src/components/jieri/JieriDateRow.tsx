import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FortuneMarker } from '@/components/almanac/FortuneMarker';
import { Link } from '@/i18n/navigation';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { AuspiciousDayResult } from '@/lib/almanac/types';
import type { LocaleCode } from '@/lib/content/types';
import { cn } from '@/lib/utils';

interface JieriDateRowProps {
  result: AuspiciousDayResult;
  locale: LocaleCode;
}

export function JieriDateRow({ result, locale }: JieriDateRowProps) {
  const isRecommended = result.status === 'recommended';
  const toneClassName = isRecommended
    ? 'border-lucky/30 bg-lucky/6 hover:border-lucky/45'
    : 'border-ominous/25 bg-ominous/6 hover:border-ominous/40';

  return (
    <article
      data-anime-result-card
      data-anime-hover
      className={cn(
        'grid min-w-0 gap-3 rounded-2xl border p-3 shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center',
        toneClassName
      )}
    >
      <div className="flex items-center gap-3 sm:block">
        <div className="flex items-center gap-2 sm:mb-2">
          <FortuneMarker fortune={result.fortune} variant="pill" size="sm" />
          <Badge variant={isRecommended ? 'default' : 'outline'}>
            {isRecommended ? localizeBodyCopy(locale, '推荐') : localizeBodyCopy(locale, '谨慎')}
          </Badge>
        </div>
        <div>
          <p className="font-serif-display text-2xl font-semibold leading-none">
            {result.month}/{result.day}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{localizeBodyCopy(locale, result.lunarDay)}</p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          {result.yiMatches.map((term) => (
            <Badge key={term} variant="outline" className="border-lucky/30 bg-lucky/8 text-lucky">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              {localizeBodyCopy(locale, term)}
            </Badge>
          ))}
          {result.cautionReasons.map((reason) => (
            <Badge key={`${result.date}-${reason.type}`} variant="outline" className="border-ominous/30 bg-ominous/8 text-ominous">
              <AlertTriangle className="size-3" aria-hidden="true" />
              {localizeBodyCopy(locale, reason.label)}
            </Badge>
          ))}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {localizeBodyCopy(locale, result.reasons.map((reason) => reason.detail).join(' '))}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {localizeBodyCopy(locale, `冲${result.chong} · 煞${result.sha} · 日生肖${result.dayZodiac}`)}
        </p>
      </div>

      <Link
        href={`/almanac/${result.date}`}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-semibold text-primary transition hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {localizeBodyCopy(locale, '看黄历')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

