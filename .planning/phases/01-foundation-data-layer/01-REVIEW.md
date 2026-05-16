---
phase: 01-foundation-data-layer
reviewed: 2026-05-17T12:00:00Z
depth: standard
files_reviewed: 32
files_reviewed_list:
  - prisma/schema.prisma
  - prisma.config.ts
  - src/app/[locale]/layout.tsx
  - src/app/[locale]/page.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Header.tsx
  - src/components/layout/LocaleToggle.tsx
  - src/components/ui/button.tsx
  - src/components/ui/card.tsx
  - src/components/ui/separator.tsx
  - src/dictionaries/metaphysics-zh-hans.json
  - src/i18n/messages/zh-hans.json
  - src/i18n/messages/zh-hant.json
  - src/i18n/navigation.ts
  - src/i18n/request.ts
  - src/i18n/routing.ts
  - src/lib/almanac/cache.ts
  - src/lib/almanac/service.ts
  - src/lib/almanac/types.ts
  - src/lib/opencc.ts
  - src/lib/prisma.ts
  - src/lib/redis.ts
  - src/lib/utils.ts
  - src/styles/globals.css
  - tests/almanac/regression.test.ts
  - tests/almanac/service.test.ts
  - tests/almanac/tyme4ts.test.ts
  - tests/i18n/opencc.test.ts
  - tests/setup.ts
  - middleware.ts
  - next.config.ts
  - package.json
  - tsconfig.json
findings:
  critical: 3
  warning: 6
  info: 3
  total: 12
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-17T12:00:00Z
**Depth:** standard
**Files Reviewed:** 32
**Status:** issues_found

## Summary

Reviewed the foundation and data layer for the JinZeYi project: Prisma schema, almanac service (tyme4ts integration, Redis caching), i18n setup (next-intl, OpenCC conversion), layout components, and UI primitives. The codebase is well-structured with clear separation of concerns. Three critical issues were found: a timezone bug that produces wrong "today" dates for Chinese users, missing input validation on the almanac service entry point, and unsafe deserialization of cached data. Six warnings cover a locale-breaking link in the header, swallowed errors, unsafe env var access, a circular CSS variable, a Redis fallback that masks config problems, and `as any` type casts.

## Critical Issues

### CR-01: Timezone bug -- `formatToday()` uses server timezone, not user timezone

**File:** `src/app/[locale]/page.tsx:6-12`
**Issue:** `formatToday()` calls `new Date()` which uses the server's timezone (typically UTC in production). For users in China (UTC+8), the computed "today" date is wrong during certain hours. Example: at 1:00 AM China time (5:00 PM UTC previous day), the server returns yesterday's date. The almanac data served to the user would be for the wrong day.
**Fix:**
```typescript
// Option A: Use Intl with the China timezone explicitly
function formatToday(): string {
  const now = new Date();
  // Format in China Standard Time (UTC+8)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const y = parts.find(p => p.type === 'year')!.value;
  const m = parts.find(p => p.type === 'month')!.value;
  const d = parts.find(p => p.type === 'day')!.value;
  return `${y}-${m}-${d}`;
}

// Option B: Accept dateStr as a searchParam so the client determines "today"
```

---

### CR-02: No input validation on `dateStr` in almanac service

**File:** `src/lib/almanac/service.ts:17`
**Issue:** `getDailyAlmanac(dateStr)` splits the input string and passes the result directly to `SolarDay.fromYmd(year, month, day)` without any validation. A malformed string (e.g., `"abc"`, `"2026/05/17"`, `"2026-13-01"`, or an empty string) produces `NaN` values or triggers an unhandled exception from tyme4ts. Since this function is called from a Server Component, an unhandled exception would crash the page render.
**Fix:**
```typescript
import { z } from 'zod';

const DateStrSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => {
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}, 'Invalid date');

export async function getDailyAlmanac(dateStr: string): Promise<DailyAlmanac> {
  const parsed = DateStrSchema.safeParse(dateStr);
  if (!parsed.success) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  // ... rest of function
}
```

---

### CR-03: Unsafe `JSON.parse` with unchecked type assertion on cached data

**File:** `src/lib/almanac/cache.ts:10`
**Issue:** `JSON.parse(cached) as DailyAlmanac` performs an unsafe type assertion. If Redis data is corrupted, truncated, or was written by a different schema version, the parsed object would have the TypeScript type `DailyAlmanac` but could be missing fields or have wrong types at runtime. Downstream code (the page component) accesses nested properties like `almanac.solar.year` and calls `.map()` on `almanac.yi`, which would throw on malformed data.
**Fix:**
```typescript
import { z } from 'zod';
import { DailyAlmanacSchema } from './types'; // Define a Zod schema matching the interface

export async function getCachedAlmanac(dateStr: string): Promise<DailyAlmanac | null> {
  try {
    const cached = await redis.get(`almanac:${dateStr}`);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return DailyAlmanacSchema.parse(parsed); // throws ZodError if invalid
  } catch {
    return null;
  }
}
```

## Warnings

### WR-01: Header brand link uses raw `<a>` tag, bypassing locale routing

**File:** `src/components/layout/Header.tsx:11`
**Issue:** The brand link uses `<a href="/">` instead of the next-intl `Link` component. This link always navigates to `/` without the locale prefix. While the middleware will redirect to the default locale, this creates an unnecessary redirect on every click and will break if the middleware matcher is changed. More critically, the link loses the user's current locale context.
**Fix:**
```typescript
import { Link } from '@/i18n/navigation';

// In the JSX:
<Link href="/" className="text-lg font-semibold text-primary hover:opacity-80 transition-opacity">
  {t('brand')}
</Link>
```

---

### WR-02: Error object discarded in page.tsx catch block

**File:** `src/app/[locale]/page.tsx:23-25`
**Issue:** The catch block catches the error but discards it, setting only a string flag `'fetch-error'`. The actual error (stack trace, message) is lost, making production debugging impossible.
**Fix:**
```typescript
try {
  almanac = await getDailyAlmanac(todayStr);
} catch (e) {
  console.error('[HomePage] Failed to fetch almanac:', e);
  error = 'fetch-error';
}
```

---

### WR-03: Non-null assertion on `DATABASE_URL` without validation

**File:** `src/lib/prisma.ts:7`
**Issue:** `process.env.DATABASE_URL!` uses a non-null assertion. If the environment variable is missing, the value is `undefined` and gets passed to `PrismaPg`, which will throw a cryptic error at runtime rather than a clear startup message.
**Fix:**
```typescript
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
```

---

### WR-04: Self-referential CSS variable declaration

**File:** `src/styles/globals.css:32`
**Issue:** In the `@theme inline` block, `--font-sans: var(--font-sans);` is a circular self-reference. In CSS, a custom property referencing itself resolves to the inherited value (from `@theme` above or a parent rule). While this may work in practice due to how Tailwind v4 processes `@theme inline`, it is fragile and could break if Tailwind's CSS variable handling changes.
**Fix:** Remove the self-referential line from `@theme inline`. The `@theme` block on line 27 already defines `--font-sans`. The `@theme inline` block should only define variables that need different treatment:
```css
@theme inline {
  --font-heading: var(--font-sans);
  /* Remove: --font-sans: var(--font-sans); */
  --color-sidebar-ring: var(--sidebar-ring);
  /* ... rest of variables ... */
}
```

---

### WR-05: Redis URL defaults to localhost, masking missing config in production

**File:** `src/lib/redis.ts:6`
**Issue:** `process.env.REDIS_URL || 'redis://localhost:6379'` silently falls back to localhost when `REDIS_URL` is not set. In production, this would attempt to connect to a non-existent local Redis, causing silent cache misses (since errors are caught in cache.ts) rather than a clear configuration error.
**Fix:**
```typescript
function createRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl && process.env.NODE_ENV === 'production') {
    throw new Error('REDIS_URL environment variable is required in production');
  }
  const client = new Redis(redisUrl || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
  return client;
}
```

---

### WR-06: `as any` type casts bypass TypeScript safety in i18n layer

**File:** `src/app/[locale]/layout.tsx:37` and `src/i18n/request.ts:7`
**Issue:** Both files use `as any` to bypass TypeScript's type checking on locale validation. `routing.locales` is typed as `readonly string[]` and the locale parameter is `string`, so `includes()` requires the argument to match the array element type. Using `as any` silences the compiler but also silences legitimate type errors.
**Fix:**
```typescript
// In layout.tsx:
if (!(routing.locales as readonly string[]).includes(locale)) notFound();

// Or define a type guard:
function isValidLocale(locale: string): locale is (typeof routing.locales)[number] {
  return (routing.locales as readonly string[]).includes(locale);
}
```

## Info

### IN-01: `convertMetaphysics` rebuilds reverse dictionary on every call

**File:** `src/lib/opencc.ts:78-81`
**Issue:** When called with `targetLocale === 'zh-hans'`, the function calls `Object.fromEntries(Object.entries(metaphysicsDict).map(...))` to build a reverse lookup map on every invocation. This is a small dictionary (~40 entries) so performance impact is negligible, but it is wasteful and could be cached at module level like the forward corrections are.
**Fix:**
```typescript
// Build at module level, alongside the other pre-built maps
const reverseMetaphysicsDict: Record<string, string> = Object.fromEntries(
  Object.entries(metaphysicsDict).map(([k, v]) => [v, k])
);

export function convertMetaphysics(term: string, targetLocale: 'zh-hant' | 'zh-hans'): string {
  if (targetLocale === 'zh-hant') {
    return (metaphysicsDict as Record<string, string>)[term] || term;
  }
  return reverseMetaphysicsDict[term] || term;
}
```

---

### IN-02: `shadcn` listed as runtime dependency

**File:** `package.json:29`
**Issue:** `"shadcn": "^4.7.0"` is listed under `dependencies` rather than `devDependencies`. The `shadcn` CLI is a development tool used to add components; it is not needed at runtime. This increases the production bundle/deployment size unnecessarily.
**Fix:** Move `shadcn` to `devDependencies`.

---

### IN-03: Dark mode primary color loses brand identity

**File:** `src/styles/globals.css:114`
**Issue:** In the `.dark` theme, `--primary: oklch(0.922 0 0)` is a near-white gray. The light theme uses `#C43B3B` (brand red). This means all primary-colored elements (buttons, links, headings) lose the red/gold brand identity in dark mode. For a traditional Chinese almanac app where red is culturally significant, this may be a design oversight worth revisiting.

---

_Reviewed: 2026-05-17T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
