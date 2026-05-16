'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function handleToggle(targetLocale: string) {
    router.replace(pathname, { locale: targetLocale });
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      <Button
        variant={locale === 'zh-hant' ? 'default' : 'secondary'}
        size="sm"
        className="h-11 min-w-[44px] px-3 text-sm font-medium"
        onClick={() => handleToggle('zh-hant')}
        aria-label="切換語言"
        aria-pressed={locale === 'zh-hant'}
      >
        繁體
      </Button>
      <Button
        variant={locale === 'zh-hans' ? 'default' : 'secondary'}
        size="sm"
        className="h-11 min-w-[44px] px-3 text-sm font-medium"
        onClick={() => handleToggle('zh-hans')}
        aria-label="切换语言"
        aria-pressed={locale === 'zh-hans'}
      >
        简体
      </Button>
    </div>
  );
}
