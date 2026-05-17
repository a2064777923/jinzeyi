import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';
import type { JieriSceneRule } from '@/lib/almanac/types';
import { cn } from '@/lib/utils';

const zodiacOptions = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

interface JieriFilterPanelProps {
  locale: LocaleCode;
  scene: JieriSceneRule;
  year: number;
  zodiac?: string;
  months: number[];
}

export function JieriFilterPanel({ locale, scene, year, zodiac, months }: JieriFilterPanelProps) {
  const prevYear = year - 1;
  const nextYear = year + 1;

  return (
    <aside className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div>
        <h2 className="text-base font-semibold">{localizeBodyCopy(locale, '筛选条件')}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {localizeBodyCopy(locale, '切换年份、生肖或月份，快速比较备选日。')}
        </p>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <Button variant="outline" size="icon" render={<Link href={`/jieri/${scene.slug}/${prevYear}`} />} aria-label={localizeBodyCopy(locale, `查看${prevYear}年${scene.name}吉日`)}>
          <ChevronLeft />
        </Button>
        <div className="rounded-md border border-border bg-background px-3 py-2 text-center text-sm font-semibold">
          {year}
        </div>
        <Button variant="outline" size="icon" render={<Link href={`/jieri/${scene.slug}/${nextYear}`} />} aria-label={localizeBodyCopy(locale, `查看${nextYear}年${scene.name}吉日`)}>
          <ChevronRight />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">{localizeBodyCopy(locale, '生肖避冲')}</p>
        <div className="flex max-h-28 flex-wrap gap-2 overflow-auto pr-1">
          <Link
            href={`/jieri/${scene.slug}/${year}`}
            aria-current={!zodiac ? 'page' : undefined}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-semibold transition',
              !zodiac ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:text-foreground'
            )}
          >
            {localizeBodyCopy(locale, '不限')}
          </Link>
          {zodiacOptions.map((item) => (
            <Link
              key={item}
              href={`/jieri/${scene.slug}/${year}?zodiac=${encodeURIComponent(item)}`}
              aria-current={zodiac === item ? 'page' : undefined}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-semibold transition',
                zodiac === item
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {localizeBodyCopy(locale, item)}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">{localizeBodyCopy(locale, '月份跳转')}</p>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
          {months.map((month) => (
            <a
              key={month}
              href={`#month-${month}`}
              aria-label={localizeBodyCopy(locale, `跳转到${month}月`)}
              className="shrink-0 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              {month}{localizeBodyCopy(locale, '月')}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}

