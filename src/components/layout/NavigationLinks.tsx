'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', key: 'home' as const },
  { href: '/calendar', key: 'calendar' as const },
  { href: '/solar-terms', key: 'solarTerms' as const },
] as const;

export function NavigationLinks() {
  const t = useTranslations('Layout');
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-semibold transition-colors',
              isActive
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t(`nav.${item.key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
