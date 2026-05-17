'use client';

import { FormEvent, useId, useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateBazi, type BaziInput, type BaziResult as BaziResultData, type Gender } from '@/lib/almanac/bazi';
import { CHINA_CITIES } from '@/lib/tools/china-cities';
import { BaziResult } from './BaziResult';

const DEFAULT_VALUES: BaziInput = {
  birthDate: '2026-05-17',
  birthTime: '11:30',
  cityId: 'hangzhou',
  gender: 'unspecified',
};

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'female', label: '女' },
  { value: 'male', label: '男' },
  { value: 'unspecified', label: '不指定' },
];

export function BaziForm() {
  const id = useId();
  const [values, setValues] = useState<BaziInput>(DEFAULT_VALUES);
  const [result, setResult] = useState<BaziResultData | null>(() => calculateBazi(DEFAULT_VALUES));
  const [error, setError] = useState<string | null>(null);

  function updateValue<K extends keyof BaziInput>(key: K, value: BaziInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setResult(calculateBazi(values));
      setError(null);
    } catch {
      setError('请确认日期在 0002-01-01 到 5000-12-31 之间，时间、城市和性别都已正确选择。');
    }
  }

  function reset() {
    setValues(DEFAULT_VALUES);
    setResult(calculateBazi(DEFAULT_VALUES));
    setError(null);
  }

  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <form className="rounded-lg border border-border bg-card p-4 shadow-sm" onSubmit={onSubmit} noValidate>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">输入出生资料</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">按中国城市经度先做真太阳时校正。</p>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={reset} aria-label="重置八字表单">
            <RotateCcw />
          </Button>
        </div>

        <div className="grid gap-3">
          <Field label="出生日期" htmlFor={`${id}-date`}>
            <input
              id={`${id}-date`}
              type="date"
              min="0002-01-01"
              max="5000-12-31"
              value={values.birthDate}
              onChange={(event) => updateValue('birthDate', event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </Field>
          <Field label="精确时间" htmlFor={`${id}-time`}>
            <input
              id={`${id}-time`}
              type="time"
              value={values.birthTime}
              onChange={(event) => updateValue('birthTime', event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </Field>
          <Field label="出生地点" htmlFor={`${id}-city`}>
            <select
              id={`${id}-city`}
              value={values.cityId}
              onChange={(event) => updateValue('cityId', event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {CHINA_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.province} · {city.name}
                </option>
              ))}
            </select>
          </Field>
          <fieldset className="rounded-md border border-border bg-background p-3">
            <legend className="px-1 text-sm font-semibold">性别</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-2 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    type="radio"
                    name={`${id}-gender`}
                    value={option.value}
                    checked={values.gender === option.value}
                    onChange={() => updateValue('gender', option.value)}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

        <Button type="submit" className="mt-4 w-full" size="lg">
          <Calculator data-icon="inline-start" />
          排盘
        </Button>
      </form>

      {result ? <BaziResult result={result} /> : null}
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-foreground" htmlFor={htmlFor}>
      {label}
      {children}
    </label>
  );
}
