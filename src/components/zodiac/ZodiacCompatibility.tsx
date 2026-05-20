import { Badge } from '@/components/ui/badge';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { ZodiacCompatibility as Compatibility } from '@/lib/content/zodiac';
import type { LocaleCode } from '@/lib/content/types';
import { getZodiacSlugByAnimal, ZodiacAnimalIcon } from './ZodiacAnimalIcon';

interface ZodiacCompatibilityProps {
  compatibility: Compatibility;
  locale: LocaleCode;
}

export function ZodiacCompatibility({ compatibility, locale }: ZodiacCompatibilityProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{localizeBodyCopy(locale, '生肖配对')}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {localizeBodyCopy(locale, '用合、稳、冲三层关系提示沟通节奏，不直接替关系下结论。')}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3">
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
    <div className="rounded-2xl border border-border bg-background/72 p-3">
      <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline" className={className}>
            <ZodiacAnimalIcon
              slug={getZodiacSlugByAnimal(item)}
              animal={localizeBodyCopy(locale, item)}
              label={localizeBodyCopy(locale, `属${item}`)}
              className="mr-1 size-5"
            />
            {localizeBodyCopy(locale, item)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

