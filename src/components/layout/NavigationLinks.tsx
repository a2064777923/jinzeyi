'use client';

import { useEffect, useId, useState } from 'react';
import {
  CalendarDays,
  CircleDot,
  Clock3,
  Compass,
  Home,
  Menu,
  Sparkles,
  SunMedium,
  Wrench,
  X,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { LocaleToggle } from './LocaleToggle';

export function NavigationLinks({ todayHref }: { todayHref: string }) {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mobileMenuId = useId();

  const navItems = [
    { href: '/', key: 'home' as const, icon: Home, active: '/' },
    { href: todayHref, key: 'today' as const, icon: Clock3, active: '/almanac/' },
    { href: '/calendar', key: 'calendar' as const, icon: CalendarDays, active: '/calendar' },
    { href: '/solar-terms', key: 'solarTerms' as const, icon: SunMedium, active: '/solar-terms' },
    { href: '/jieri', key: 'jieri' as const, icon: Sparkles, active: '/jieri' },
    { href: '/zodiac', key: 'zodiac' as const, icon: CircleDot, active: '/zodiac' },
    { href: '/tools', key: 'tools' as const, icon: Wrench, active: '/tools' },
    { href: '/feng-shui', key: 'fengShui' as const, icon: Compass, active: '/feng-shui' },
  ] as const;

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.active === '/'
              ? pathname === item.href
              : pathname === item.active || pathname.startsWith(`${item.active}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {t(`nav.${item.key}`)}
            </Link>
          );
        })}
      </nav>

      <div className="hidden sm:block lg:hidden">
        <LocaleToggle />
      </div>

      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-card text-foreground transition duration-200 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
        aria-label={
          open
            ? (locale === 'zh-hant' ? '關閉選單' : '关闭菜单')
            : (locale === 'zh-hant' ? '開啟選單' : '打开菜单')
        }
        aria-expanded={open}
        aria-controls={mobileMenuId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-foreground/12 backdrop-blur-[2px] lg:hidden"
            aria-label={locale === 'zh-hant' ? '關閉選單' : '关闭菜单'}
            onClick={() => setOpen(false)}
          />
          <div
            id={mobileMenuId}
            className="fixed inset-x-0 top-16 z-50 border-b border-border/80 bg-card/98 p-4 shadow-2xl shadow-foreground/15 transition duration-200 lg:hidden"
          >
            <div className="mb-3 rounded-lg border border-border bg-muted/45 px-3 py-2">
              <p className="text-xs font-semibold text-primary">
                {locale === 'zh-hant' ? '快速切換' : '快速切换'}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {locale === 'zh-hant'
                  ? '黃曆、月曆、吉日與工具入口集中在這裡。'
                  : '黄历、月历、吉日与工具入口集中在这里。'}
              </p>
            </div>
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.active === '/'
                    ? pathname === item.href
                    : pathname === item.active || pathname.startsWith(`${item.active}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {t(`nav.${item.key}`)}
                  </Link>
                );
              })}
              <div className="pt-3">
                <LocaleToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
