import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { SolarTerm } from '@/lib/almanac/types';

interface SolarTermsListProps {
  terms: SolarTerm[];
}

function getSeason(month: number): 'spring' | 'summer' | 'autumn' | 'winter' {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const seasonOrder = ['spring', 'summer', 'autumn', 'winter'] as const;

export async function SolarTermsList({ terms }: SolarTermsListProps) {
  const t = await getTranslations('SolarTerms');

  // Group terms by season
  const grouped: Record<string, SolarTerm[]> = {
    spring: [],
    summer: [],
    autumn: [],
    winter: [],
  };

  for (const term of terms) {
    const month = parseInt(term.date.split('-')[1], 10);
    const season = getSeason(month);
    grouped[season].push(term);
  }

  return (
    <div className="space-y-6">
      {seasonOrder.map((season) => {
        const seasonTerms = grouped[season];
        if (seasonTerms.length === 0) return null;

        return (
          <Card key={season}>
            <CardHeader>
              <CardTitle className="text-lg">{t(season)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seasonTerms.map((term, index) => {
                const [, month, day] = term.date.split('-');
                return (
                  <div key={term.name}>
                    {index > 0 && <Separator className="mb-4" />}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{term.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {parseInt(month)}{t('dateMonth')}{parseInt(day)}{t('dateDay')}
                        </span>
                        <Badge variant={term.isJie ? 'default' : 'secondary'} className="text-xs">
                          {term.isJie ? t('jieLabel') : t('qiLabel')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t(`terms.${term.name}.meaning`)}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">{t('customsLabel')}：</span>
                        {t(`terms.${term.name}.customs`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
