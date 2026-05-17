import { Badge } from '@/components/ui/badge';
import type { BaziResult as BaziResultData, FiveElement, PillarKey } from '@/lib/almanac/bazi';
import type { LocaleCode } from '@/lib/content/types';

const PILLAR_ORDER: PillarKey[] = ['year', 'month', 'day', 'hour'];
const ELEMENTS: FiveElement[] = ['木', '火', '土', '金', '水'];
const ELEMENT_CLASS: Record<FiveElement, string> = {
  木: 'bg-lucky/15 text-lucky',
  火: 'bg-ominous/12 text-ominous',
  土: 'bg-accent/12 text-accent',
  金: 'bg-slate-500/12 text-slate-700',
  水: 'bg-primary/12 text-primary',
};

const copy = {
  'zh-hans': {
    title: '排盘结果',
    distribution: '五行分布',
    offsetUnit: '分钟',
    heavenlyStem: '天干',
    earthlyBranch: '地支',
    belongsTo: '属',
  },
  'zh-hant': {
    title: '排盤結果',
    distribution: '五行分佈',
    offsetUnit: '分鐘',
    heavenlyStem: '天干',
    earthlyBranch: '地支',
    belongsTo: '屬',
  },
} satisfies Record<LocaleCode, Record<string, string>>;

export function BaziResult({ result, locale = 'zh-hans' }: { result: BaziResultData; locale?: LocaleCode }) {
  const t = copy[locale];
  const max = Math.max(...ELEMENTS.map((element) => result.elements[element]), 1);

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{t.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {result.city.name} · {result.genderLabel} · {result.trueSolarTime.adjusted}
          </p>
        </div>
        <Badge variant="outline">{result.trueSolarTime.offsetMinutes >= 0 ? '+' : ''}{result.trueSolarTime.offsetMinutes} {t.offsetUnit}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PILLAR_ORDER.map((key) => {
          const pillar = result.pillars[key];
          return (
            <div key={key} className="min-h-28 rounded-lg border border-border bg-background p-3 text-center">
              <p className="text-xs font-semibold text-muted-foreground">{pillar.label}</p>
              <p className="mt-2 font-serif-display text-3xl font-semibold leading-none text-foreground">{pillar.value}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {t.heavenlyStem}{pillar.heavenlyStem}{t.belongsTo}{pillar.stemElement} · {t.earthlyBranch}{pillar.earthlyBranch}{t.belongsTo}{pillar.branchElement}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-background p-3">
        <h3 className="text-sm font-semibold">{t.distribution}</h3>
        <div className="mt-3 grid gap-2">
          {ELEMENTS.map((element) => {
            const value = result.elements[element];
            const width = `${Math.max((value / max) * 100, value > 0 ? 18 : 6)}%`;
            return (
              <div key={element} className="grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-sm">
                <span className="font-semibold">{element}</span>
                <span className="h-2 overflow-hidden rounded-full bg-muted">
                  <span className={`block h-full rounded-full ${ELEMENT_CLASS[element]}`} style={{ width }} />
                </span>
                <span className="text-right text-muted-foreground">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="rounded-lg bg-muted/70 p-3 text-sm leading-7 text-muted-foreground">
        {result.trueSolarTime.description} {result.explanation}
      </p>
    </div>
  );
}
