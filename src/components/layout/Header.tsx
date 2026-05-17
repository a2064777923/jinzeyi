import { getTranslations } from 'next-intl/server';
import { LocaleToggle } from './LocaleToggle';
import { NavigationLinks } from './NavigationLinks';

export async function Header() {
  const t = await getTranslations('Layout');

  return (
    <header className="sticky top-0 z-50 h-14 md:h-16 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <a
          href="/"
          className="text-lg font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          {t('brand')}
        </a>
        <NavigationLinks />
        <LocaleToggle />
      </div>
    </header>
  );
}
