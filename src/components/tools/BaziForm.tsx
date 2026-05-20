'use client';

import { FormEvent, useId, useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateBazi, type BaziInput, type BaziResult as BaziResultData, type Gender } from '@/lib/almanac/bazi';
import { ALMANAC_DATE_MAX, ALMANAC_DATE_MIN } from '@/lib/almanac/date-range';
import type { LocaleCode } from '@/lib/content/types';
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

const copy = {
  'zh-hans': {
    heading: '输入出生资料',
    deck: '按中国城市经度先做真太阳时校正。',
    reset: '重置八字表单',
    birthDate: '出生日期',
    birthTime: '精确时间',
    birthPlace: '出生地点',
    gender: '性别',
    unspecified: '不指定',
    error: '日期需在 0002-01-01 到 5000-12-31 之间，时间、城市和性别也要完整。',
    submit: '排盘',
  },
  'zh-hant': {
    heading: '輸入出生資料',
    deck: '按中國城市經度先做真太陽時校正。',
    reset: '重置八字表單',
    birthDate: '出生日期',
    birthTime: '精確時間',
    birthPlace: '出生地點',
    gender: '性別',
    unspecified: '不指定',
    error: '日期需在 0002-01-01 到 5000-12-31 之間，時間、城市和性別也要完整。',
    submit: '排盤',
  },
} satisfies Record<LocaleCode, Record<string, string>>;

export function BaziForm({ locale = 'zh-hans' }: { locale?: LocaleCode }) {
  const t = copy[locale];
  const id = useId();
  const errorId = `${id}-error`;
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
      setError(t.error);
    }
  }

  function reset() {
    setValues(DEFAULT_VALUES);
    setResult(calculateBazi(DEFAULT_VALUES));
    setError(null);
  }

  return (
    <section className="grid min-w-0 gap-5 lg:grid-cols-[23rem_minmax(0,1fr)] lg:items-start">
      <form className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card p-5 shadow-lg shadow-primary/6" onSubmit={onSubmit} noValidate>
        <span className="absolute -right-10 -top-10 hidden size-28 rounded-full bg-primary/8 sm:block" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{t.heading}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t.deck}</p>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={reset} aria-label={t.reset}>
            <RotateCcw />
          </Button>
        </div>

        <div className="grid gap-3">
          <Field label={t.birthDate} htmlFor={`${id}-date`}>
            <input
              id={`${id}-date`}
              name="birthDate"
              type="text"
              inputMode="numeric"
              autoComplete="bday"
              placeholder={ALMANAC_DATE_MIN}
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
              minLength={10}
              maxLength={10}
              value={values.birthDate}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              aria-label={`${t.birthDate}，格式 YYYY-MM-DD，范围 ${ALMANAC_DATE_MIN} 至 ${ALMANAC_DATE_MAX}`}
              onChange={(event) => updateValue('birthDate', event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </Field>
          <Field label={t.birthTime} htmlFor={`${id}-time`}>
            <input
              id={`${id}-time`}
              name="birthTime"
              type="time"
              autoComplete="bday-time"
              value={values.birthTime}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => updateValue('birthTime', event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </Field>
          <Field label={t.birthPlace} htmlFor={`${id}-city`}>
            <select
              id={`${id}-city`}
              name="birthPlace"
              autoComplete="address-level2"
              value={values.cityId}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => updateValue('cityId', event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {CHINA_CITIES.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.province} · {city.name}
                </option>
              ))}
            </select>
          </Field>
          <fieldset className="rounded-xl border border-border bg-background p-3">
            <legend className="px-1 text-sm font-semibold">{t.gender}</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((option) => (
                <label key={option.value} className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-2 py-2 text-sm transition has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                  <input
                    type="radio"
                    name={`${id}-gender`}
                    value={option.value}
                    checked={values.gender === option.value}
                    onChange={() => updateValue('gender', option.value)}
                    className="sr-only"
                  />
                  {option.value === 'unspecified' ? t.unspecified : option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {error && (
          <p id={errorId} className="mt-3 text-sm font-medium text-destructive" aria-live="polite">
            {error}
          </p>
        )}

        <Button type="submit" className="mt-4 w-full" size="lg">
          <Calculator data-icon="inline-start" />
          {t.submit}
        </Button>
      </form>

      {result ? (
        <div className="animate-reveal-up">
          <BaziResult result={result} locale={locale} />
        </div>
      ) : null}
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
