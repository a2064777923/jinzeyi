import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { localizeBodyCopy } from '@/lib/content/localize';
import type { LocaleCode } from '@/lib/content/types';

interface ZodiacYearTableProps {
  years: number[];
  animal: string;
  locale: LocaleCode;
}

export function ZodiacYearTable({ years, animal, locale }: ZodiacYearTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <h2 className="mb-2 text-base font-semibold">{localizeBodyCopy(locale, `${animal}年速查`)}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{localizeBodyCopy(locale, '年份')}</TableHead>
            <TableHead>{localizeBodyCopy(locale, '生肖')}</TableHead>
            <TableHead>{localizeBodyCopy(locale, '提示')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {years.map((year) => (
            <TableRow key={year}>
              <TableCell className="font-semibold">{year}</TableCell>
              <TableCell>{localizeBodyCopy(locale, `属${animal}`)}</TableCell>
              <TableCell className="text-muted-foreground">{localizeBodyCopy(locale, '春节/立春附近需核对岁次')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

