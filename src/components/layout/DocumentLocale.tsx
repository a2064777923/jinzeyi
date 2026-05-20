'use client';

import { useEffect } from 'react';
import type { routing } from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

export function DocumentLocale({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  return null;
}
