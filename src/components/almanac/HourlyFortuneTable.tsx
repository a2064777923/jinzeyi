import { getTranslations } from 'next-intl/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FortuneMarker } from './FortuneMarker';
import type { HourlyFortune } from '@/lib/almanac/types';

interface HourlyFortuneTableProps {
  hours: HourlyFortune[];
}

export async function HourlyFortuneTable({ hours }: HourlyFortuneTableProps) {
  const t = await getTranslations('HourlyFortune');

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold">{t('title')}</h2>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('hour')}</TableHead>
              <TableHead>干支</TableHead>
              <TableHead>{t('fortune')}</TableHead>
              <TableHead>{t('star')}</TableHead>
              <TableHead>{t('yi')}</TableHead>
              <TableHead>{t('ji')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hours.map((hour) => (
              <TableRow key={hour.name}>
                <TableCell className="font-medium">{hour.name}</TableCell>
                <TableCell>{hour.ganZhi}</TableCell>
                <TableCell>
                  <FortuneMarker fortune={hour.fortune} size="sm" />
                </TableCell>
                <TableCell>{hour.star}</TableCell>
                <TableCell className="text-sm">
                  {hour.yi.length > 0 ? hour.yi.slice(0, 3).join('、') : t('noYi')}
                </TableCell>
                <TableCell className="text-sm">
                  {hour.ji.length > 0 ? hour.ji.slice(0, 3).join('、') : t('noJi')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {hours.map((hour) => (
          <Card key={hour.name}>
            <CardContent className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{hour.name}</span>
                <span className="text-sm text-muted-foreground">{hour.ganZhi}</span>
              </div>
              <div className="flex justify-center">
                <FortuneMarker fortune={hour.fortune} size="lg" />
              </div>
              <div className="text-sm text-muted-foreground">{hour.star}</div>
              <div className="text-sm">
                <span className="text-gold">{t('yi')}:</span>{' '}
                {hour.yi.length > 0 ? hour.yi.slice(0, 3).join('、') : t('noYi')}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">{t('ji')}:</span>{' '}
                {hour.ji.length > 0 ? hour.ji.slice(0, 3).join('、') : t('noJi')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
