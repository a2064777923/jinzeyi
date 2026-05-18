'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { buildLocaleHref } from '@/i18n/locale-path';
import { cn } from '@/lib/utils';

export function LocaleToggle() {
  const locale = useLocale();
  const t = useTranslations('Layout.localeToggle');
  const router = useRouter();

  function handleToggle(targetLocale: 'zh-hant' | 'zh-hans') {
    if (targetLocale === locale) return;

    const href = buildLocaleHref({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      targetLocale,
    });

    router.replace(href);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border/70 bg-background/70 p-0.5"
      role="group"
      aria-label={t('ariaLabel')}
    >
      <Button
        variant={locale === 'zh-hant' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'h-9 min-w-[44px] rounded-md px-3 text-sm font-semibold',
          locale === 'zh-hant' && 'shadow-sm'
        )}
        onClick={() => handleToggle('zh-hant')}
        aria-label={t('zhHant')}
        aria-pressed={locale === 'zh-hant'}
      >
        {t('zhHant')}
      </Button>
      <Button
        variant={locale === 'zh-hans' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'h-9 min-w-[44px] rounded-md px-3 text-sm font-semibold',
          locale === 'zh-hans' && 'shadow-sm'
        )}
        onClick={() => handleToggle('zh-hans')}
        aria-label={t('zhHans')}
        aria-pressed={locale === 'zh-hans'}
      >
        {t('zhHans')}
      </Button>
    </div>
  );
}
