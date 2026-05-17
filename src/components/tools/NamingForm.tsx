'use client';

import { FormEvent, useId, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeName, type NameAnalysis, type NameInput } from '@/lib/tools/naming';
import { NamingResult } from './NamingResult';

const DEFAULT_VALUES: NameInput = {
  surname: '李',
  givenName: '明泽',
};

export function NamingForm() {
  const id = useId();
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
      setResult(analyzeName(values));
      setError(null);
    } catch {
      setError('请输入 1-2 个中文姓氏字和 1-2 个中文名字字，不支持数字或符号。');
    }
  }

  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <form className="rounded-lg border border-border bg-card p-4 shadow-sm" onSubmit={onSubmit} noValidate>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">输入姓名</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">先看单字五行、收录状态和基础组合。</p>
        </div>

        <div className="grid gap-3">
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor={`${id}-surname`}>
            姓氏
            <input
              id={`${id}-surname`}
              value={values.surname}
              maxLength={2}
              onChange={(event) => updateValue('surname', event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold" htmlFor={`${id}-given`}>
            名字
            <input
              id={`${id}-given`}
              value={values.givenName}
              maxLength={2}
              onChange={(event) => updateValue('givenName', event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

        <Button type="submit" className="mt-4 w-full" size="lg">
          <Sparkles data-icon="inline-start" />
          查询姓名五行
        </Button>
      </form>

      {result ? <NamingResult result={result} /> : null}
    </section>
  );
}
