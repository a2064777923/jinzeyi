import { Badge } from '@/components/ui/badge';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { ZodiacCompatibility as Compatibility } from '@/lib/content/zodiac';
import type { LocaleCode } from '@/lib/content/types';

interface ZodiacCompatibilityProps {
  compatibility: Compatibility;
  locale: LocaleCode;
}

export function ZodiacCompatibility({ compatibility, locale }: ZodiacCompatibilityProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-base font-semibold">{localizeBodyCopy(locale, '生肖配对')}</h2>
      <div className="mt-3 grid gap-3">
        <Group label={localizeBodyCopy(locale, '较合')} items={compatibility.best} className="border-lucky/30 bg-lucky/8 text-lucky" locale={locale} />
        <Group label={localizeBodyCopy(locale, '平稳')} items={compatibility.steady} className="border-accent/30 bg-accent/8 text-accent" locale={locale} />
        <Group label={localizeBodyCopy(locale, '留意')} items={compatibility.caution} className="border-ominous/30 bg-ominous/8 text-ominous" locale={locale} />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {localizeBodyCopy(locale, compatibility.note)}
      </p>
    </section>
  );
}

function Group({ label, items, className, locale }: { label: string; items: string[]; className: string; locale: LocaleCode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 text-sm font-semibold text-muted-foreground">{label}</span>
      {items.map((item) => (
        <Badge key={item} variant="outline" className={className}>
          {localizeBodyCopy(locale, item)}
        </Badge>
      ))}
    </div>
  );
}

