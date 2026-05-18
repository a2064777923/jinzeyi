'use client';

import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { CalendarCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scoreAuspiciousDateRange } from '@/lib/almanac/auspicious-scoring';
import type {
  AuspiciousPersonInput,
  AuspiciousPersonRole,
  AuspiciousPersonRoleKey,
  AuspiciousRecommendationResult as RecommendationResult,
} from '@/lib/almanac/types';
import { localizeBodyCopy } from '@/lib/content/localize';
import { jieriScenes } from '@/lib/content/jieri-scenes';
import type { LocaleCode } from '@/lib/content/types';
import { CHINA_CITIES } from '@/lib/tools/china-cities';
import { AuspiciousRecommendationResult } from './AuspiciousRecommendationResult';

type PersonDraft = Record<string, AuspiciousPersonInput>;

const genderOptions: Array<{ value: AuspiciousPersonInput['gender']; label: string }> = [
  { value: 'female', label: '女' },
  { value: 'male', label: '男' },
  { value: 'unspecified', label: '不指定' },
];

interface AuspiciousRecommendationFormProps {
  locale: LocaleCode;
  initialScene?: string;
}

export function AuspiciousRecommendationForm({ locale, initialScene }: AuspiciousRecommendationFormProps) {
  const initialSceneSlug = jieriScenes.some((scene) => scene.slug === initialScene)
    ? initialScene!
    : 'jiehun';
  const [sceneSlug, setSceneSlug] = useState(initialSceneSlug);
  const selectedScene = useMemo(
    () => jieriScenes.find((scene) => scene.slug === sceneSlug) ?? jieriScenes[0],
    [sceneSlug],
  );
  const [people, setPeople] = useState<PersonDraft>(() => createPeopleDraft(selectedScene.personRoles));
  const [startDate, setStartDate] = useState('2026-05-18');
  const [endDate, setEndDate] = useState('2026-06-15');
  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  function changeScene(nextSceneSlug: string) {
    const nextScene = jieriScenes.find((scene) => scene.slug === nextSceneSlug) ?? jieriScenes[0];
    setSceneSlug(nextScene.slug);
    setPeople(createPeopleDraft(nextScene.personRoles));
    setResults([]);
    setHasSubmitted(false);
    setError(null);
  }

  function updatePerson(role: AuspiciousPersonRoleKey, patch: Partial<AuspiciousPersonInput>) {
    setPeople((current) => ({
      ...current,
      [role]: {
        ...current[role],
        ...patch,
      },
    }));
    if (error) setError(null);
  }

  function reset() {
    setPeople(createPeopleDraft(selectedScene.personRoles));
    setStartDate('2026-05-18');
    setEndDate('2026-06-15');
    setResults([]);
    setHasSubmitted(false);
    setError(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const scored = scoreAuspiciousDateRange({
        scene: selectedScene.slug,
        startDate,
        endDate,
        people: selectedScene.personRoles
          .map((role) => people[role.key])
          .filter((person) => person && person.birthDate && person.birthTime && person.cityId),
        limit: 8,
      });
      setResults(scored);
      setHasSubmitted(true);
      setError(null);
    } catch (caught) {
      setResults([]);
      setHasSubmitted(true);
      setError(caught instanceof Error ? caught.message : localizeBodyCopy(locale, '资料不完整，补齐后重试。'));
    }
  }

  return (
    <section className="grid min-w-0 gap-5 lg:grid-cols-[24rem_minmax(0,1fr)] lg:items-start">
      <form className="rounded-lg border border-border bg-card p-4 shadow-sm" onSubmit={onSubmit}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {localizeBodyCopy(locale, '推荐日期')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {localizeBodyCopy(locale, '把更合适的日子排到前面，理由和提醒一起看。')}
            </p>
          </div>
          <Button type="button" variant="outline" size="icon" onClick={reset} aria-label={localizeBodyCopy(locale, '重置推荐表单')}>
            <RotateCcw />
          </Button>
        </div>

        <div className="grid gap-4">
          <Field label={localizeBodyCopy(locale, '事项')}>
            <select
              value={sceneSlug}
              onChange={(event) => changeScene(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              {jieriScenes.map((scene) => (
                <option key={scene.slug} value={scene.slug}>
                  {localizeBodyCopy(locale, scene.name)}
                </option>
              ))}
            </select>
          </Field>

          <fieldset className="grid gap-3 rounded-md border border-border bg-background/70 p-3">
            <legend className="px-1 text-sm font-semibold">
              {localizeBodyCopy(locale, '关键参与者')}
            </legend>
            {selectedScene.personRoles.map((role) => (
              <PersonRoleFields
                key={role.key}
                role={role}
                person={people[role.key]}
                locale={locale}
                onChange={(patch) => updatePerson(role.key, patch)}
              />
            ))}
          </fieldset>

          <fieldset className="grid gap-3 rounded-md border border-border bg-background/70 p-3">
            <legend className="px-1 text-sm font-semibold">
              {localizeBodyCopy(locale, '日期范围')}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={localizeBodyCopy(locale, '开始日期')}>
                <input
                  type="text"
                  value={startDate}
                  inputMode="numeric"
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </Field>
              <Field label={localizeBodyCopy(locale, '结束日期')}>
                <input
                  type="text"
                  value={endDate}
                  inputMode="numeric"
                  onChange={(event) => setEndDate(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                />
              </Field>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {localizeBodyCopy(locale, '单次推荐最多比较 90 天。')}
            </p>
          </fieldset>
        </div>

        {error ? (
          <p className="mt-3 rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {localizeBodyCopy(locale, error)}
          </p>
        ) : null}

        <Button type="submit" className="mt-4 w-full" size="lg">
          <CalendarCheck data-icon="inline-start" />
          {localizeBodyCopy(locale, '找合适日期')}
        </Button>
      </form>

      <AuspiciousRecommendationResult results={results} locale={locale} hasSubmitted={hasSubmitted} />
    </section>
  );
}

function createPeopleDraft(roles: AuspiciousPersonRole[]): PersonDraft {
  const defaults: Record<AuspiciousPersonRoleKey, Omit<AuspiciousPersonInput, 'role'>> = {
    primary: { label: '本人', birthDate: '1996-06-15', birthTime: '09:00', cityId: 'hangzhou', gender: 'female' },
    partner: { label: '伴侣', birthDate: '1994-10-03', birthTime: '15:20', cityId: 'beijing', gender: 'male' },
    household: { label: '家人', birthDate: '', birthTime: '', cityId: '', gender: 'unspecified' },
    responsiblePerson: { label: '负责人', birthDate: '1988-03-08', birthTime: '10:30', cityId: 'shanghai', gender: 'unspecified' },
  };

  return Object.fromEntries(
    roles.map((role) => [role.key, { role: role.key, ...defaults[role.key] }]),
  );
}

function PersonRoleFields({
  role,
  person,
  locale,
  onChange,
}: {
  role: AuspiciousPersonRole;
  person: AuspiciousPersonInput;
  locale: LocaleCode;
  onChange: (patch: Partial<AuspiciousPersonInput>) => void;
}) {
  return (
    <div className="grid gap-2 rounded-md border border-border bg-card p-3">
      <div>
        <p className="text-sm font-semibold">
          {localizeBodyCopy(locale, role.label)}
          {role.required ? <span className="ml-1 text-destructive">*</span> : null}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {localizeBodyCopy(locale, role.description)}
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label={localizeBodyCopy(locale, '称呼')}>
          <input
            type="text"
            value={person.label ?? ''}
            onChange={(event) => onChange({ label: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </Field>
        <Field label={localizeBodyCopy(locale, '出生日期')}>
          <input
            type="text"
            value={person.birthDate}
            inputMode="numeric"
            onChange={(event) => onChange({ birthDate: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </Field>
        <Field label={localizeBodyCopy(locale, '出生时间')}>
          <input
            type="time"
            value={person.birthTime}
            onChange={(event) => onChange({ birthTime: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </Field>
        <Field label={localizeBodyCopy(locale, '出生地')}>
          <select
            value={person.cityId}
            onChange={(event) => onChange({ cityId: event.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            {!role.required ? <option value="">{localizeBodyCopy(locale, '不填写')}</option> : null}
            {CHINA_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.province} · {city.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {genderOptions.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center justify-center rounded-md border border-border px-2 py-2 text-xs font-semibold has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <input
              type="radio"
              name={`${role.key}-gender`}
              value={option.value}
              checked={person.gender === option.value}
              onChange={() => onChange({ gender: option.value })}
              className="sr-only"
            />
            {localizeBodyCopy(locale, option.label)}
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-foreground">
      {label}
      {children}
    </label>
  );
}
