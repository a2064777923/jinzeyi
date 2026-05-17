import { getTranslations } from 'next-intl/server';
import { getSolarTerms } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SolarTermsList } from '@/components/almanac/SolarTermsList';

export async function generateMetadata() {
  const t = await getTranslations('SolarTerms');
  const year = new Date().getFullYear();
  return {
    title: `${t('title')} - ${year}`,
    description: `${year}年二十四节气日期、含义与传统习俗。`,
  };
}

export default async function SolarTermsPage() {
  const t = await getTranslations('SolarTerms');
  const currentYear = new Date().getFullYear();

  let terms;
  let error: string | null = null;

  try {
    terms = await getSolarTerms(currentYear);
  } catch {
    error = 'fetch-error';
  }

  if (error || !terms) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-8">
        <Card className="max-w-prose w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              {t('error.heading')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('error.body')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-primary">{t('title')}</h1>
        <SolarTermsList terms={terms} />
      </div>
    </div>
  );
}
