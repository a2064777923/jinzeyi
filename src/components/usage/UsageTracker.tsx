'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { recordUsageEvent } from '@/lib/usage/client';
import type { UsageLocale } from '@/lib/usage/types';

export function UsageTracker({ locale }: { locale: UsageLocale }) {
  const pathname = usePathname();
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (lastPathRef.current === currentPath) return;
    lastPathRef.current = currentPath;

    recordUsageEvent({
      eventName: 'page_view',
      area: 'site',
      locale,
      status: 'success',
      payload: {
        route: pathname,
        hasSearch: window.location.search.length > 0,
      },
    });
  }, [locale, pathname]);

  return null;
}
