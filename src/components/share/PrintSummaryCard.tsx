import { QrCode } from 'lucide-react';

interface PrintSummaryCardProps {
  title: string;
  summary: string;
  url: string;
  brand: string;
}

export function PrintSummaryCard({ title, summary, url, brand }: PrintSummaryCardProps) {
  return (
    <aside className="hidden rounded-lg border border-border bg-card p-4 shadow-sm print:block">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{brand}</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{summary}</p>
          <p className="mt-3 text-xs text-muted-foreground">{url}</p>
        </div>
        <div className="grid size-20 shrink-0 place-items-center rounded-md border border-border bg-background text-primary">
          <QrCode className="size-10" aria-hidden="true" />
          <span className="sr-only">QR code placeholder</span>
        </div>
      </div>
    </aside>
  );
}
