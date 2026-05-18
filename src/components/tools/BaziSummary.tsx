import { Badge } from '@/components/ui/badge';
import { TermHint } from '@/components/knowledge/TermHint';
import type { BaziResult as BaziResultData } from '@/lib/almanac/bazi';
import { getGlossaryEntry } from '@/lib/content/glossary';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

const copy = {
  'zh-hans': {
    title: '盘面摘要',
    reference: '结构参考',
    adjusted: '真太阳时',
    offsetUnit: '分钟',
    dayMaster: '日主',
    strongest: '较明显',
    weakest: '偏少',
    method: '重点',
  },
  'zh-hant': {
    title: '盤面摘要',
    reference: '結構參考',
    adjusted: '真太陽時',
    offsetUnit: '分鐘',
    dayMaster: '日主',
    strongest: '較明顯',
    weakest: '偏少',
    method: '重點',
  },
} satisfies Record<LocaleCode, Record<string, string>>;

export function BaziSummary({ result, locale = 'zh-hans' }: { result: BaziResultData; locale?: LocaleCode }) {
  const t = copy[locale];
  const professional = result.professional;
  const dayMaster = professional.dayMaster;
  const strongest = professional.elementStrength.strongest;
  const weakest = professional.elementStrength.weakest;
  const dayMasterEntry = getGlossaryEntry('dayMaster', locale);
  const summary = localizeBodyCopy(
    locale,
    `日主是${dayMaster.heavenlyStem}${dayMaster.element}，五行里${strongest.element}较明显，${weakest.element}偏少。这个摘要能帮你抓住盘面的主要倾向。`,
  );

  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
            <Badge variant="secondary">{t.reference}</Badge>
          </div>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {localizeBodyCopy(locale, result.city.name)} · {localizeBodyCopy(locale, result.genderLabel)} · {t.adjusted} {result.trueSolarTime.adjusted}
          </p>
        </div>
        <Badge variant="outline">
          {result.trueSolarTime.offsetMinutes >= 0 ? '+' : ''}
          {result.trueSolarTime.offsetMinutes} {t.offsetUnit}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-background/75 p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            <TermHint entry={dayMasterEntry} />
          </p>
          <p className="mt-2 font-serif-display text-3xl font-semibold leading-none text-foreground">
            {dayMaster.heavenlyStem}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {localizeBodyCopy(locale, `${dayMaster.element} · ${dayMaster.yinYang}`)}
          </p>
        </div>
        <MetricCard label={t.strongest} value={`${strongest.element} ${strongest.score}`} locale={locale} />
        <MetricCard label={t.weakest} value={`${weakest.element} ${weakest.score}`} locale={locale} />
      </div>

      <p className="mt-4 rounded-lg bg-secondary/70 p-3 text-sm leading-7 text-secondary-foreground">
        <span className="font-semibold">{t.method}：</span>
        {summary}
      </p>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">
        {localizeBodyCopy(locale, result.trueSolarTime.description)}
      </p>
    </section>
  );
}

function MetricCard({ label, value, locale }: { label: string; value: string; locale: LocaleCode }) {
  return (
    <div className="rounded-md border border-border bg-background/75 p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold leading-none text-foreground">
        {localizeBodyCopy(locale, value)}
      </p>
    </div>
  );
}
