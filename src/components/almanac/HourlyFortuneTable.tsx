import { getLocale, getTranslations } from 'next-intl/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FortuneMarker } from './FortuneMarker';
import { cn } from '@/lib/utils';
import { convertToTraditional } from '@/lib/opencc';
import { getModernHourRange } from '@/lib/almanac/hour-ranges';
import type { HourlyFortune } from '@/lib/almanac/types';

interface HourlyFortuneTableProps {
  hours: HourlyFortune[];
}

export async function HourlyFortuneTable({ hours }: HourlyFortuneTableProps) {
  const t = await getTranslations('HourlyFortune');
  const locale = await getLocale();
  const localize = (value: string) =>
    locale === 'zh-hant' ? convertToTraditional(value) : value;
  const luckyCount = hours.filter((hour) => hour.fortune === '吉').length;

  return (
    <div className="w-full min-w-0 space-y-5" data-anime="hours">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t('fortune')}</p>
          <h2 className="font-serif-display text-2xl font-semibold text-foreground">
            {t('title')}
          </h2>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm shadow-sm">
          <span className="font-semibold text-lucky">{luckyCount} 吉</span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <span className="font-semibold text-ominous">{hours.length - luckyCount} 凶</span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1 rounded-lg border border-border bg-card p-2 shadow-sm sm:grid-cols-12">
        {hours.map((hour, index) => (
          <div
            key={`${hour.name}-bar`}
            data-anime-hour-card
            data-anime-hover
            className={cn(
              'group relative h-14 overflow-hidden rounded-md border transition duration-200 hover:-translate-y-0.5',
              hour.fortune === '吉'
                ? 'border-lucky/35 bg-lucky/14 shadow-lucky/10'
                : 'border-ominous/40 bg-ominous/14 shadow-ominous/10'
            )}
            title={`${localize(hour.name)} ${getModernHourRange(hour.name)} ${hour.fortune}`}
          >
            <div
              data-anime-hour-fill
              className={cn(
                'absolute inset-x-0 bottom-0 origin-bottom',
                hour.fortune === '吉' ? 'bg-lucky' : 'bg-ominous'
              )}
              style={{ height: hour.fortune === '吉' ? '82%' : '42%' }}
              aria-hidden="true"
            />
            <span className="absolute inset-0 grid place-items-center text-xs font-bold text-card">
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card shadow-sm md:block">
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
              <TableRow
                key={hour.name}
                data-anime-hour-card
                className={cn(
                  'transition duration-200',
                  hour.fortune === '吉'
                    ? 'bg-lucky/5 hover:bg-lucky/10'
                    : 'bg-ominous/5 hover:bg-ominous/10'
                )}
              >
                <TableCell className="font-medium">
                  <span className="block">{localize(hour.name)}</span>
                  <span className="mt-1 block text-xs font-normal tabular-nums text-muted-foreground">
                    {getModernHourRange(hour.name)}
                  </span>
                </TableCell>
                <TableCell>{localize(hour.ganZhi)}</TableCell>
                <TableCell>
                  <FortuneMarker fortune={hour.fortune} size="sm" variant="pill" />
                </TableCell>
                <TableCell>{localize(hour.star)}</TableCell>
                <TableCell className="text-sm">
                  {hour.yi.length > 0
                    ? hour.yi.map(localize).slice(0, 3).join('、')
                    : t('noYi')}
                </TableCell>
                <TableCell className="text-sm">
                  {hour.ji.length > 0
                    ? hour.ji.map(localize).slice(0, 3).join('、')
                    : t('noJi')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-3">
        {hours.map((hour) => (
          <div
            key={hour.name}
            data-anime-hour-card
            data-anime-hover
            className={cn(
              'min-w-0 rounded-lg border p-3 shadow-sm',
              hour.fortune === '吉'
                ? 'border-lucky/25 bg-lucky/6'
                : 'border-ominous/25 bg-ominous/6'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="block font-medium">{localize(hour.name)}</span>
                <span className="mt-0.5 block text-xs tabular-nums text-primary">
                  {getModernHourRange(hour.name)}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{localize(hour.ganZhi)}</span>
              </div>
              <FortuneMarker
                fortune={hour.fortune}
                size="xs"
                variant="pill"
                className="mt-0.5"
              />
            </div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">{localize(hour.star)}</div>
            <div className="mt-3 grid gap-1 text-sm leading-5">
              <p className="line-clamp-2">
                <span className="font-semibold text-lucky">{t('yi')}:</span>{' '}
                {hour.yi.length > 0 ? hour.yi.map(localize).slice(0, 3).join('、') : t('noYi')}
              </p>
              <p className="line-clamp-2">
                <span className="font-semibold text-ominous">{t('ji')}:</span>{' '}
                {hour.ji.length > 0 ? hour.ji.map(localize).slice(0, 3).join('、') : t('noJi')}
              </p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
