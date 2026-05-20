import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card px-4 py-6">
      <div className="mx-auto max-w-[82rem] text-center">
        <p className="text-xs text-muted-foreground">{t('disclaimer')}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t('copyright', { year })}</p>
      </div>
    </footer>
  );
}
