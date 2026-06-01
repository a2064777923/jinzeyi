'use client';

import { FormEvent, useId, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeName, type NameAnalysis, type NameInput } from '@/lib/tools/naming';
import type { LocaleCode } from '@/lib/content/types';
import { recordToolUsage } from '@/lib/usage/client';
import { NamingResult } from './NamingResult';

const DEFAULT_VALUES: NameInput = {
  surname: '李',
  givenName: '明泽',
};

export function NamingForm({ locale = 'zh-hans' }: { locale?: LocaleCode }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [values, setValues] = useState<NameInput>(DEFAULT_VALUES);
  const [result, setResult] = useState<NameAnalysis | null>(() => analyzeName(DEFAULT_VALUES));
  const [error, setError] = useState<string | null>(null);

  function updateValue<K extends keyof NameInput>(key: K, value: NameInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const nextResult = analyzeName(values);
      setResult(nextResult);
      setError(null);
      recordToolUsage({
        tool: 'naming',
        locale,
        status: 'success',
        payload: summarizeNameInput(values),
        result: summarizeNameResult(nextResult),
      });
    } catch {
      setError('输入 1-2 个中文姓氏字和 1-2 个中文名字字，不支持数字或符号。');
      recordToolUsage({
        tool: 'naming',
        locale,
        status: 'error',
        payload: summarizeNameInput(values),
        result: { reason: 'invalid-input' },
      });
    }
  }

  return (
    <section className="grid min-w-0 gap-5 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <form className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-5 shadow-lg shadow-accent/6" onSubmit={onSubmit} noValidate>
        <span className="absolute -right-10 -top-10 hidden size-28 rounded-full bg-accent/10 sm:block" aria-hidden="true" />
        <div className="mb-4">
          <h2 className="text-lg font-semibold">输入姓名</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">单字五行、收录状态和基础组合一并呈现。</p>
        </div>

        <div className="grid gap-3">
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor={`${id}-surname`}>
            姓氏
            <input
              id={`${id}-surname`}
              name="surname"
              autoComplete="off"
              value={values.surname}
              maxLength={2}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => updateValue('surname', event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor={`${id}-given`}>
            名字
            <input
              id={`${id}-given`}
              name="givenName"
              autoComplete="off"
              value={values.givenName}
              maxLength={2}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => updateValue('givenName', event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>
        </div>

        {error && (
          <p id={errorId} className="mt-3 text-sm font-medium text-destructive" aria-live="polite">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-4 w-full" size="lg">
          <Sparkles data-icon="inline-start" />
          查询姓名五行
        </Button>
      </form>

      {result ? (
        <div className="animate-reveal-up">
          <NamingResult result={result} />
        </div>
      ) : null}
    </section>
  );
}

function summarizeNameInput(values: NameInput): Record<string, unknown> {
  const surname = values.surname.trim();
  const givenName = values.givenName.trim();
  return {
    surnameLength: Array.from(surname).length,
    givenNameLength: Array.from(givenName).length,
    totalLength: Array.from(`${surname}${givenName}`).length,
  };
}

function summarizeNameResult(result: NameAnalysis): Record<string, unknown> {
  const elementCounts = result.characters.reduce<Record<string, number>>((counts, item) => {
    counts[item.element] = (counts[item.element] ?? 0) + 1;
    return counts;
  }, {});

  return {
    score: result.score,
    auspicious: result.auspicious,
    knownCharacters: result.characters.filter((item) => item.known).length,
    unknownCharacters: result.characters.filter((item) => !item.known).length,
    elementCounts,
    suggestionCount: result.suggestions.length,
  };
}
