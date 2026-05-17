import { Badge } from '@/components/ui/badge';
import type { NameAnalysis } from '@/lib/tools/naming';

export function NamingResult({ result }: { result: NameAnalysis }) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{result.surname}{result.givenName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">姓名五行基础分析</p>
        </div>
        <div className="min-w-20 rounded-lg border border-border bg-background p-3 text-center">
          <p className="text-xs text-muted-foreground">评分</p>
          <p className="text-3xl font-semibold text-primary">{result.score}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {result.characters.map((item, index) => (
          <div key={`${item.char}-${index}`} className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-serif-display text-3xl font-semibold">{item.char}</span>
              <Badge variant={item.known ? 'secondary' : 'outline'}>{item.element}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.meaning}</p>
          </div>
        ))}
      </div>

      <p className="rounded-lg bg-muted/70 p-3 text-sm leading-7 text-muted-foreground">{result.explanation}</p>

      <div>
        <h3 className="text-sm font-semibold">可参考用字</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {result.suggestions.map((item) => (
            <Badge key={item} variant="outline" className="border-primary/30 bg-primary/8 text-primary">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
