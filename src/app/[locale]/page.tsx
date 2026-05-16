import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const t = useTranslations('Homepage');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="max-w-prose w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-muted-foreground">{t('title')}</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {t('cta')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
