import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-6 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs text-muted-foreground">
          {t('disclaimer')}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
