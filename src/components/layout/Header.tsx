import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { BrandMark } from './BrandMark';
import { LocaleToggle } from './LocaleToggle';
import { NavigationLinks } from './NavigationLinks';

export async function Header() {
  const t = await getTranslations('Layout');

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-md text-primary transition duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <BrandMark className="transition duration-300 group-hover:-rotate-3 group-hover:scale-105" />
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="whitespace-nowrap text-base font-semibold leading-5">{t('brand')}</span>
            <span className="hidden whitespace-nowrap text-xs leading-5 text-muted-foreground xl:inline">
              {t('tagline')}
            </span>
          </span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <NavigationLinks />
          <div className="hidden lg:block">
            <LocaleToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
