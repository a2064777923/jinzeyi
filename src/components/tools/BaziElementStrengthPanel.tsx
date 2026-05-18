import { Badge } from '@/components/ui/badge';
import { TermHint } from '@/components/knowledge/TermHint';
import type { BaziResult as BaziResultData, FiveElement } from '@/lib/almanac/bazi';
import { getGlossaryEntry } from '@/lib/content/glossary';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

const ELEMENTS: FiveElement[] = ['木', '火', '土', '金', '水'];
const ELEMENT_CLASS: Record<FiveElement, string> = {
  木: 'bg-lucky',
  火: 'bg-ominous',
  土: 'bg-accent',
  金: 'bg-slate-500',
  水: 'bg-primary',
};

const copy = {
  'zh-hans': {
    title: '五行强弱信号',
    deck: '哪种五行更明显，哪种偏少，一眼看清。',
    visibleCounts: '表层',
    hiddenStemWeightedCounts: '藏干',
    combinedScores: '综合',
    strongest: '较明显',
    weakest: '偏少',
    method: '权重说明',
  },
  'zh-hant': {
    title: '五行強弱信號',
    deck: '哪種五行更明顯，哪種偏少，一眼看清。',
    visibleCounts: '表層',
    hiddenStemWeightedCounts: '藏干',
    combinedScores: '綜合',
    strongest: '較明顯',
    weakest: '偏少',
    method: '權重說明',
  },
} satisfies Record<LocaleCode, Record<string, string>>;

export function BaziElementStrengthPanel({ result, locale = 'zh-hans' }: { result: BaziResultData; locale?: LocaleCode }) {
  const t = copy[locale];
  const fiveElementsEntry = getGlossaryEntry('fiveElements', locale);
  const {
    visibleCounts,
    hiddenStemWeightedCounts,
    combinedScores,
    strongest,
    weakest,
    summary,
  } = result.professional.elementStrength;
  const maxScore = Math.max(...ELEMENTS.map((element) => combinedScores[element]), 1);

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            <TermHint entry={fiveElementsEntry} />
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.deck}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{t.strongest} {strongest.element}</Badge>
          <Badge variant="outline">{t.weakest} {weakest.element}</Badge>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {ELEMENTS.map((element) => {
          const score = combinedScores[element];
          const width = `${Math.max((score / maxScore) * 100, score > 0 ? 12 : 4)}%`;

          return (
            <div key={element} className="rounded-md border border-border bg-background/75 p-3">
              <div className="grid gap-2 sm:grid-cols-[2rem_minmax(0,1fr)_13rem] sm:items-center">
                <span className="font-serif-display text-2xl font-semibold leading-none text-foreground">{element}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <span className={`block h-full rounded-full ${ELEMENT_CLASS[element]}`} style={{ width }} />
                </span>
                <span className="grid grid-cols-3 gap-1 text-xs leading-5 text-muted-foreground">
                  <span>{t.visibleCounts} {visibleCounts[element]}</span>
                  <span>{t.hiddenStemWeightedCounts} {hiddenStemWeightedCounts[element]}</span>
                  <span>{t.combinedScores} {combinedScores[element]}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <p className="rounded-lg bg-secondary/70 p-3 text-sm leading-7 text-secondary-foreground">
          {localizeBodyCopy(locale, summary)}
        </p>
        <p className="rounded-lg border border-border bg-background/75 p-3 text-xs leading-6 text-muted-foreground">
          <span className="font-semibold text-foreground">{t.method}：</span>
          {localizeBodyCopy(locale, '综合分会纳入藏干权重，避免只按表面字数判断。')}
        </p>
      </div>
    </section>
  );
}
