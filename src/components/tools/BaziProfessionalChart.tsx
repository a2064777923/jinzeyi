import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { TermHint } from '@/components/knowledge/TermHint';
import type { BaziProfessionalPillar, BaziResult as BaziResultData, HiddenStemType, PillarKey } from '@/lib/almanac/bazi';
import { getGlossaryEntry } from '@/lib/content/glossary';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

const PILLAR_ORDER: PillarKey[] = ['year', 'month', 'day', 'hour'];

const copy = {
  'zh-hans': {
    title: '专业四柱盘',
    deck: '四柱、十神、藏干、纳音和十二长生集中在一张盘里。',
    heavenlyStem: '天干',
    earthlyBranch: '地支',
    tenGod: '十神',
    hiddenStems: '藏干',
    naYin: '纳音',
    terrain: '十二长生',
    noHiddenStems: '无藏干',
    main: '主气',
    middle: '中气',
    residual: '余气',
  },
  'zh-hant': {
    title: '專業四柱盤',
    deck: '四柱、十神、藏干、納音和十二長生集中在一張盤裡。',
    heavenlyStem: '天干',
    earthlyBranch: '地支',
    tenGod: '十神',
    hiddenStems: '藏干',
    naYin: '納音',
    terrain: '十二長生',
    noHiddenStems: '無藏干',
    main: '主氣',
    middle: '中氣',
    residual: '餘氣',
  },
} satisfies Record<LocaleCode, Record<string, string>>;

export function BaziProfessionalChart({ result, locale = 'zh-hans' }: { result: BaziResultData; locale?: LocaleCode }) {
  const t = copy[locale];
  const professional = result.professional;
  const dayMaster = professional.dayMaster;
  const termHints = {
    dayMaster: getGlossaryEntry('dayMaster', locale),
    tenGods: getGlossaryEntry('tenGods', locale),
    hiddenStems: getGlossaryEntry('hiddenStems', locale),
    naYin: getGlossaryEntry('naYin', locale),
  };

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-4 shadow-lg shadow-primary/6 sm:p-5">
      <span className="absolute -left-12 -top-12 hidden size-32 rounded-full bg-accent/8 sm:block" aria-hidden="true" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.deck}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TermHint entry={termHints.dayMaster} />
          <Badge variant="outline">{localizeBodyCopy(locale, `${dayMaster.heavenlyStem}${dayMaster.element}`)}</Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {PILLAR_ORDER.map((key) => (
          <PillarCell
            key={key}
            pillar={professional.pillars[key]}
            locale={locale}
            termHints={termHints}
          />
        ))}
      </div>
    </section>
  );
}

function PillarCell({
  pillar,
  locale,
  termHints,
}: {
  pillar: BaziProfessionalPillar;
  locale: LocaleCode;
  termHints: {
    tenGods: ReturnType<typeof getGlossaryEntry>;
    hiddenStems: ReturnType<typeof getGlossaryEntry>;
    naYin: ReturnType<typeof getGlossaryEntry>;
  };
}) {
  const t = copy[locale];
  const hiddenStems = pillar.hiddenStems;

  return (
    <article className="min-w-0 rounded-2xl border border-border bg-background/75 p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold text-muted-foreground">{localizeBodyCopy(locale, pillar.label)}</p>
      <p className="mt-2 text-center font-serif-display text-3xl font-semibold leading-none text-foreground sm:text-4xl">
        {pillar.value}
      </p>
      <div className="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground">
        <InfoRow label={t.heavenlyStem} value={`${pillar.heavenlyStem} · ${pillar.stemElement}`} locale={locale} />
        <InfoRow label={t.earthlyBranch} value={`${pillar.earthlyBranch} · ${pillar.branchElement}`} locale={locale} />
        <InfoRow
          label={<TermHint entry={termHints.tenGods} />}
          value={pillar.tenGod}
          locale={locale}
        />
        <InfoRow
          label={<TermHint entry={termHints.naYin} />}
          value={pillar.naYin}
          locale={locale}
        />
        <InfoRow label={t.terrain} value={pillar.terrain} locale={locale} />
      </div>

      <div className="mt-3 rounded-xl bg-muted/70 p-2">
        <div className="mb-2 text-xs font-semibold text-foreground">
          <TermHint entry={termHints.hiddenStems} />
        </div>
        {hiddenStems.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {hiddenStems.map((hiddenStem) => (
              <span
                key={`${pillar.value}-${hiddenStem.heavenlyStem}-${hiddenStem.type}`}
                className="inline-flex min-w-0 items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs leading-5"
              >
                <span className="font-semibold text-foreground">{hiddenStem.heavenlyStem}</span>
                <span className="text-muted-foreground">{localizeBodyCopy(locale, hiddenStem.tenGod)}</span>
                <span className="text-muted-foreground">{hiddenStemTypeLabel(hiddenStem.type, locale)}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">{t.noHiddenStems}</p>
        )}
      </div>
    </article>
  );
}

function InfoRow({
  label,
  value,
  locale,
}: {
  label: ReactNode;
  value: string;
  locale: LocaleCode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(3.5rem,auto)_minmax(0,1fr)] gap-2">
      <span className="min-w-0 font-semibold text-foreground">{label}</span>
      <span className="min-w-0 text-right text-muted-foreground">{localizeBodyCopy(locale, value)}</span>
    </div>
  );
}

function hiddenStemTypeLabel(type: HiddenStemType, locale: LocaleCode): string {
  return copy[locale][type];
}
