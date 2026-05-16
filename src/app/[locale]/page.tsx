import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Homepage');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">{t('title')}</h1>
      <p className="text-muted-foreground mb-8">...</p>
    </div>
  );
}
