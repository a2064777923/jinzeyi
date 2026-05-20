import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { AuspiciousRecommendationResult as RecommendationResult } from '@/lib/almanac/types';
import type { LocaleCode } from '@/lib/content/types';
import { ScoreBreakdown } from './ScoreBreakdown';

const gradeLabel = {
  excellent: '优选',
  good: '较适合',
  usable: '可参考',
  caution: '需谨慎',
} as const;

interface AuspiciousRecommendationResultProps {
  results: RecommendationResult[];
  locale: LocaleCode;
  hasSubmitted?: boolean;
}

export function AuspiciousRecommendationResult({ results, locale, hasSubmitted = false }: AuspiciousRecommendationResultProps) {
  if (results.length === 0) {
    return (
      <section className="rounded-[1.5rem] border border-border bg-card p-5 text-sm leading-7 text-muted-foreground shadow-lg shadow-lucky/6" data-anime="result">
        <h2 className="text-lg font-semibold text-foreground">
          {localizeBodyCopy(locale, hasSubmitted ? '这段时间没有明显优选' : '候选日会出现在这里')}
        </h2>
        <p className="mt-2">
          {localizeBodyCopy(locale, hasSubmitted ? '换一段日期，或减少可选参与者。' : '结果包含分数、理由、提醒和可用吉时。')}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4" data-anime="result">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {localizeBodyCopy(locale, '推荐结果')}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {localizeBodyCopy(locale, '高分日期在前，冲煞、五行和吉时提醒都在同一张卡里。')}
        </p>
      </div>

      {results.map((result, index) => (
        <article key={result.date} data-anime-result-card data-anime-hover className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-4 shadow-lg shadow-lucky/6">
          <span className="absolute -right-10 -top-10 hidden size-28 rounded-full bg-lucky/10 sm:block" aria-hidden="true" />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-accent">
                {localizeBodyCopy(locale, `第${index + 1}位`)}
              </p>
              <h3 className="mt-1 font-serif-display text-2xl font-semibold leading-tight text-foreground">
                {result.date}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {localizeBodyCopy(locale, `${result.almanac.lunar.lunarDate} · 冲${result.almanac.direction.chong} · 煞${result.almanac.direction.sha}`)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-primary">{result.score}</p>
              <Badge variant={result.grade === 'caution' ? 'outline' : 'default'}>
                {localizeBodyCopy(locale, gradeLabel[result.grade])}
              </Badge>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-3">
              <ReasonList
                title={localizeBodyCopy(locale, '推荐理由')}
                items={result.reasons.slice(0, 4)}
                icon="positive"
                locale={locale}
              />
              <ReasonList
                title={localizeBodyCopy(locale, '需要留意')}
                items={result.cautions.slice(0, 4)}
                icon="caution"
                locale={locale}
              />
              {result.usableLuckyHours.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.usableLuckyHours.map((hour) => (
                    <Badge key={hour} variant="secondary">
                      {localizeBodyCopy(locale, hour)}
                    </Badge>
                  ))}
                </div>
              ) : null}
              <Link
                href={`/almanac/${result.date}`}
                className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-primary transition hover:bg-secondary"
              >
                {localizeBodyCopy(locale, '打开当日黄历')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ScoreBreakdown dimensions={Object.values(result.dimensions)} locale={locale} />
          </div>
        </article>
      ))}
    </section>
  );
}

function ReasonList({
  title,
  items,
  icon,
  locale,
}: {
  title: string;
  items: string[];
  icon: 'positive' | 'caution';
  locale: LocaleCode;
}) {
  if (items.length === 0) return null;
  const Icon = icon === 'positive' ? CheckCircle2 : AlertTriangle;
  const iconClassName = icon === 'positive' ? 'text-lucky' : 'text-ominous';

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
            <Icon className={`mt-1 size-3.5 shrink-0 ${iconClassName}`} aria-hidden="true" />
            <span>{localizeBodyCopy(locale, item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
