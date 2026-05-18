import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FaqBlock } from '@/components/seo/FaqBlock';
import { InternalLinkGrid } from '@/components/seo/InternalLinkGrid';
import { SeoHero } from '@/components/seo/SeoHero';
import { SeoPageBand, SeoPageShell } from '@/components/seo/SeoPageShell';
import { Link } from '@/i18n/navigation';
import { jieriIndexPage } from '@/lib/content/jieri-scenes';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { AuspiciousDayResult, JieriSceneRule } from '@/lib/almanac/types';
import type { FaqItem, LocaleCode } from '@/lib/content/types';
import { JieriFilterPanel } from './JieriFilterPanel';
import { JieriMonthSection } from './JieriMonthSection';

interface JieriScenePageProps {
  locale: LocaleCode;
  year: number;
  scene: JieriSceneRule;
  results: AuspiciousDayResult[];
  zodiac?: string;
  faq: FaqItem[];
}

function groupByMonth(results: AuspiciousDayResult[]): Map<number, AuspiciousDayResult[]> {
  const grouped = new Map<number, AuspiciousDayResult[]>();
  for (let month = 1; month <= 12; month += 1) {
    grouped.set(month, []);
  }

  for (const result of results) {
    grouped.get(result.month)?.push(result);
  }

  return grouped;
}

export function JieriScenePage({ locale, year, scene, results, zodiac, faq }: JieriScenePageProps) {
  const grouped = groupByMonth(results);
  const months = Array.from(grouped.keys());
  const recommendedCount = results.filter((result) => result.status === 'recommended').length;
  const cautionCount = results.length - recommendedCount;
  const conflictCount = zodiac
    ? results.filter((result) => result.cautionReasons.some((reason) => reason.type === 'zodiac-conflict')).length
    : 0;
  const title = localizeBodyCopy(locale, `${year}年${scene.name}吉日`);

  return (
    <SeoPageShell>
      <SeoPageBand>
        <SeoHero
          title={title}
          deck={localizeBodyCopy(locale, scene.summary)}
          kicker={localizeBodyCopy(locale, '黄道吉日')}
          imageSrc={scene.icon}
          badges={[
            localizeBodyCopy(locale, `匹配宜项 ${scene.yiTerms.length}`),
            localizeBodyCopy(locale, `推荐 ${recommendedCount}`),
            localizeBodyCopy(locale, `谨慎 ${cautionCount}`),
          ]}
          controls={
            <div className="lg:hidden">
              <JieriFilterPanel locale={locale} scene={scene} year={year} zodiac={zodiac} months={months} />
            </div>
          }
        />
      </SeoPageBand>

      <SeoPageBand tone="plain" className="pt-0">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label={localizeBodyCopy(locale, '推荐日')} value={recommendedCount} tone="lucky" />
              <Metric label={localizeBodyCopy(locale, '谨慎日')} value={cautionCount} tone="ominous" />
              <Metric label={localizeBodyCopy(locale, '宜项数')} value={scene.yiTerms.length} tone="gold" />
              <Metric label={localizeBodyCopy(locale, '生肖相冲')} value={conflictCount} tone="slate" />
            </div>

            <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-3">
              {scene.yiTerms.map((term) => (
                <Badge key={term} variant="outline" className="border-lucky/30 bg-lucky/8 text-lucky">
                  {localizeBodyCopy(locale, term)}
                </Badge>
              ))}
            </div>

            <Link
              href={`/tools/jieri-recommend?scene=${scene.slug}`}
              className="inline-flex w-fit items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {localizeBodyCopy(locale, '输入参与者资料推荐日期')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            {months.map((month) => (
              <JieriMonthSection
                key={month}
                month={month}
                results={grouped.get(month) ?? []}
                locale={locale}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="hidden lg:block">
              <JieriFilterPanel locale={locale} scene={scene} year={year} zodiac={zodiac} months={months} />
            </div>
            <FaqBlock items={faq} />
            <InternalLinkGrid links={jieriIndexPage.relatedLinks} />
          </div>
        </div>
      </SeoPageBand>
    </SeoPageShell>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: 'lucky' | 'ominous' | 'gold' | 'slate' }) {
  const toneClassName = {
    lucky: 'border-lucky/30 bg-lucky/8 text-lucky',
    ominous: 'border-ominous/30 bg-ominous/8 text-ominous',
    gold: 'border-accent/30 bg-accent/8 text-accent',
    slate: 'border-border bg-card text-foreground',
  }[tone];

  return (
    <div className={`rounded-lg border p-4 ${toneClassName}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
