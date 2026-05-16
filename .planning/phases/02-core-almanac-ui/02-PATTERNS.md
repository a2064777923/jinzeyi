# Phase 2: Core Almanac UI - Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 19 (7 modified, 12 new)
**Analogs found:** 16 / 19

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/lib/almanac/types.ts` | model | transform | `src/lib/almanac/types.ts` (self) | exact |
| `src/lib/almanac/service.ts` | service | CRUD | `src/lib/almanac/service.ts` (self) | exact |
| `src/lib/almanac/cache.ts` | utility | CRUD | `src/lib/almanac/cache.ts` (self) | exact |
| `src/app/[locale]/page.tsx` | controller | request-response | `src/app/[locale]/page.tsx` (self) | exact |
| `src/app/[locale]/calendar/page.tsx` | controller | request-response | `src/app/[locale]/page.tsx` | role-match |
| `src/app/[locale]/solar-terms/page.tsx` | controller | request-response | `src/app/[locale]/page.tsx` | role-match |
| `src/app/[locale]/almanac/[date]/page.tsx` | controller | request-response | `src/app/[locale]/page.tsx` | role-match |
| `src/components/almanac/TodayAlmanacCard.tsx` | component | request-response | `src/app/[locale]/page.tsx` (inline card) | partial |
| `src/components/almanac/HourlyFortuneTable.tsx` | component | request-response | `src/app/[locale]/page.tsx` (inline yi/ji) | partial |
| `src/components/almanac/MonthlyCalendar.tsx` | component | request-response | — | no analog |
| `src/components/almanac/CalendarDayCell.tsx` | component | request-response | — | no analog |
| `src/components/almanac/SolarTermsList.tsx` | component | request-response | — | no analog |
| `src/components/almanac/AlmanacDetail.tsx` | component | request-response | — | no analog |
| `src/components/almanac/FortuneMarker.tsx` | component | request-response | — | no analog |
| `src/components/almanac/YiJiBadgeList.tsx` | component | request-response | `src/app/[locale]/page.tsx` (inline badges) | partial |
| `src/components/almanac/NavigationLinks.tsx` | component | request-response | `src/components/layout/LocaleToggle.tsx` | role-match |
| `src/components/layout/Header.tsx` | component | request-response | `src/components/layout/Header.tsx` (self) | exact |
| `src/i18n/messages/zh-hant.json` | config | transform | `src/i18n/messages/zh-hant.json` (self) | exact |
| `src/i18n/messages/zh-hans.json` | config | transform | `src/i18n/messages/zh-hans.json` (self) | exact |

## Pattern Assignments

---

### `src/lib/almanac/types.ts` (model, transform)

**Analog:** `src/lib/almanac/types.ts` (self — extend existing)

**Existing pattern** (full file, lines 1-34):
```typescript
export interface DailyAlmanac {
  solar: {
    year: number;
    month: number;
    day: number;
  };
  lunar: {
    year: string;      // e.g., "丙午年"
    month: string;     // e.g., "四月"
    day: string;       // e.g., "初一"
    lunarDate: string; // full lunar date string, e.g., "农历丙午年四月初一"
  };
  ganZhi: {
    year: string;   // e.g., "丙午"
    month: string;  // e.g., "癸巳"
    day: string;    // e.g., "辛卯"
  };
  zodiac: string;     // e.g., "兔"
  yi: string[];       // 宜 (recommended activities)
  ji: string[];       // 忌 (activities to avoid)
  direction: { ... };
  gods: string[];
  duty: string;
  twentyEightStar: string;
  pengZu: string;
  sound: string;
  fetusDay: string;
}
```

**New types to add** (from UI-SPEC + RESEARCH):
```typescript
export interface HourlyFortune {
  name: string;          // 子时, 丑时, ...
  ganZhi: string;        // 戊子, 己丑, ...
  star: string;          // 司命, 勾陈, ...
  fortune: '吉' | '凶';  // from ecliptic.getLuck()
  yi: string[];          // recommended activities
  ji: string[];          // activities to avoid
}

export interface CalendarDay {
  solarDay: number;      // 1-31
  lunarDay: string;      // 初一, 十五, ...
  fortune: '吉' | '凶';  // tyme4ts only returns binary (no '平')
  isToday: boolean;
  dateStr: string;       // YYYY-MM-DD for linking
  weekday: number;       // 0=Sun, 6=Sat
}

export interface SolarTerm {
  name: string;          // 立夏, 小满, ...
  date: string;          // YYYY-MM-DD
  isJie: boolean;        // true = 节, false = 气
  year: number;
}
```

**Pattern notes:**
- Follow existing interface style: exported, flat properties with JSDoc-style inline comments
- Use string literal unions for enum-like values (`'吉' | '凶'`)
- Arrays for list data (`string[]`)

---

### `src/lib/almanac/service.ts` (service, CRUD)

**Analog:** `src/lib/almanac/service.ts` (self — extend existing)

**Existing imports pattern** (lines 1-3):
```typescript
import { SolarDay } from 'tyme4ts';
import { getCachedAlmanac, setCachedAlmanac } from './cache';
import type { DailyAlmanac } from './types';
```

**Existing core pattern** (lines 11-65):
```typescript
export async function getDailyAlmanac(dateStr: string): Promise<DailyAlmanac> {
  // 1. Check cache first
  const cached = await getCachedAlmanac(dateStr);
  if (cached) return cached;

  // 2. Parse input
  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = SolarDay.fromYmd(year, month, day);
  const lunar = solar.getLunarDay();

  // 3. Extract data from tyme4ts API
  // ... (gan-zhi, yi/ji, directions, gods, etc.)

  // 4. Build typed result
  const data: DailyAlmanac = { ... };

  // 5. Cache (non-blocking)
  await setCachedAlmanac(dateStr, data);

  // 6. Return
  return data;
}
```

**New methods to add — follow same pattern:**

1. `getHourlyFortune(dateStr: string): Promise<HourlyFortune[]>`
   - Import: `LunarHour` from `tyme4ts` (add to existing tyme4ts import)
   - Cache key: `almanac:hourly:{dateStr}`
   - Critical: `lunar.getHours()` returns 13 items; use `.slice(0, 12)`
   - Hour gan-zhi extraction: `h.getSixtyCycleHour().toString().slice(-3, -1)`

2. `getMonthlyCalendar(year: number, month: number): Promise<CalendarDay[]>`
   - Import: `SolarMonth` from `tyme4ts`
   - Cache key: `almanac:monthly:{year}-{month}`
   - Use `SolarMonth.fromYm(year, month).getDays()`

3. `getSolarTerms(year: number): Promise<SolarTerm[]>`
   - Import: `Term` from `tyme4ts`
   - Cache key: `almanac:terms:{year}`
   - Use `Term.fromIndex(year, 0..23)`
   - Critical: Index 0 = previous year's 冬至; filter by `t.getYear() === year` or show full cycle

---

### `src/lib/almanac/cache.ts` (utility, CRUD)

**Analog:** `src/lib/almanac/cache.ts` (self — extend existing)

**Existing pattern** (full file, lines 1-24):
```typescript
import { redis } from '@/lib/redis';
import type { DailyAlmanac } from './types';

const CACHE_TTL = 86400; // 24 hours in seconds

export async function getCachedAlmanac(dateStr: string): Promise<DailyAlmanac | null> {
  try {
    const cached = await redis.get(`almanac:${dateStr}`);
    if (!cached) return null;
    return JSON.parse(cached) as DailyAlmanac;
  } catch {
    return null;
  }
}

export async function setCachedAlmanac(dateStr: string, data: DailyAlmanac): Promise<void> {
  try {
    await redis.setex(`almanac:${dateStr}`, CACHE_TTL, JSON.stringify(data));
  } catch {
    console.error(`[Redis] Failed to cache almanac for ${dateStr}`);
  }
}
```

**New cache helpers to add — follow same pattern:**

1. `getCachedHourlyFortune` / `setCachedHourlyFortune` — TTL 86400 (24h), key `almanac:hourly:{dateStr}`
2. `getCachedMonthlyCalendar` / `setCachedMonthlyCalendar` — TTL 604800 (7d), key `almanac:monthly:{year}-{month}`
3. `getCachedSolarTerms` / `setCachedSolarTerms` — TTL 31536000 (365d), key `almanac:terms:{year}`

**Pattern:** Each helper pair is a generic copy of the existing pattern. Consider extracting a generic `getCached<T>(key)` / `setCached<T>(key, data, ttl)` utility to reduce duplication.

---

### `src/app/[locale]/page.tsx` (controller, request-response)

**Analog:** `src/app/[locale]/page.tsx` (self — modify existing)

**Existing imports pattern** (lines 1-4):
```typescript
import { getTranslations } from 'next-intl/server';
import { getDailyAlmanac } from '@/lib/almanac/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
```

**Existing data-fetching pattern** (lines 14-26):
```typescript
export default async function HomePage() {
  const t = await getTranslations('Almanac');
  const todayStr = formatToday();

  let almanac;
  let error: string | null = null;

  try {
    almanac = await getDailyAlmanac(todayStr);
  } catch {
    error = 'fetch-error';
  }
```

**Existing error handling pattern** (lines 27-43):
```typescript
  if (error || !almanac) {
    const tHome = await getTranslations('Homepage');
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Card className="max-w-prose w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">
              {tHome('error.heading')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{tHome('error.body')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
```

**Existing yi/ji badge rendering pattern** (lines 77-105):
```typescript
  {/* Yi (宜) */}
  <div>
    <p className="text-sm font-medium text-gold mb-2">{t('yi')}</p>
    <div className="flex flex-wrap gap-2">
      {almanac.yi.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-sm text-gold border border-gold/20"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
```

**Modification plan:**
- Replace inline card with `<TodayAlmanacCard almanac={almanac} />` component
- Add `<HourlyFortuneTable hours={hours} />` below the card
- Fetch hourly data: `const hours = await getHourlyFortune(todayStr);`
- Update `max-w-prose` to `max-w-2xl` (672px) per UI-SPEC

---

### `src/app/[locale]/calendar/page.tsx` (controller, request-response)

**Analog:** `src/app/[locale]/page.tsx`

**Imports to copy from homepage** (lines 1-4 of existing page.tsx):
```typescript
import { getTranslations } from 'next-intl/server';
import { getMonthlyCalendar } from '@/lib/almanac/service';
```

**searchParams pattern** (from RESEARCH.md):
```typescript
interface Props {
  searchParams: Promise<{ month?: string }>;
}

export default async function CalendarPage({ searchParams }: Props) {
  const { month } = await searchParams;
  const now = new Date();
  const year = month ? parseInt(month.split('-')[0]) : now.getFullYear();
  const monthNum = month ? parseInt(month.split('-')[1]) : now.getMonth() + 1;

  const days = await getMonthlyCalendar(year, monthNum);

  return <MonthlyCalendar year={year} month={monthNum} days={days} />;
}
```

**Error handling:** Copy from homepage pattern (lines 27-43) — Card with error heading + body from translations.

**generateMetadata:** Add for SEO:
```typescript
export async function generateMetadata() {
  const t = await getTranslations('Calendar');
  return { title: t('title') };
}
```

---

### `src/app/[locale]/solar-terms/page.tsx` (controller, request-response)

**Analog:** `src/app/[locale]/page.tsx`

Same structure as calendar page. Fetch `getSolarTerms(currentYear)`, pass to `<SolarTermsList>`.

**Static page:** No searchParams needed — shows current year's terms. Can use `generateStaticParams` for pre-rendering if desired.

---

### `src/app/[locale]/almanac/[date]/page.tsx` (controller, request-response)

**Analog:** `src/app/[locale]/page.tsx` (for data fetching + error handling pattern)

**Params pattern** (from existing `layout.tsx` lines 28-35):
```typescript
export default async function AlmanacDetailPage({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}) {
  const { date } = await params;
```

**Date validation pattern** (from RESEARCH.md):
```typescript
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

let almanac;
try {
  almanac = await getDailyAlmanac(date);
} catch {
  notFound();
}
```

**generateMetadata pattern:**
```typescript
export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  const almanac = await getDailyAlmanac(date);
  return {
    title: `${almanac.solar.year}年${almanac.solar.month}月${almanac.solar.day}日 黄历`,
    description: `今日宜：${almanac.yi.slice(0, 3).join('、')}。忌：${almanac.ji.slice(0, 3).join('、')}。`,
  };
}
```

**notFound import:** `import { notFound } from 'next/navigation';` (already used in `layout.tsx` line 3)

---

### `src/components/almanac/TodayAlmanacCard.tsx` (component, request-response)

**Analog:** Inline card pattern from `src/app/[locale]/page.tsx` lines 49-125

**Component structure to extract from homepage:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { DailyAlmanac } from '@/lib/almanac/types';
import { YiJiBadgeList } from './YiJiBadgeList';

interface TodayAlmanacCardProps {
  almanac: DailyAlmanac;
}

export async function TodayAlmanacCard({ almanac }: TodayAlmanacCardProps) {
  // ... renders card with collapsible secondary info
}
```

**Badge rendering pattern** (from page.tsx lines 77-105) — extract to `<YiJiBadgeList>`.

**Direction grid pattern** (from page.tsx lines 110-123):
```typescript
<div className="grid grid-cols-3 gap-4">
  <div>
    <p className="text-sm text-muted-foreground">{t('direction.caiShen')}</p>
    <p className="font-medium">{almanac.direction.caiShen}</p>
  </div>
  {/* ... xiShen, fuShen */}
</div>
```

**New: Collapsible section** for secondary info (冲煞, 吉神凶煞, 值神, 星宿, 彭祖百忌, 纳音, 胎神):
```typescript
<Collapsible>
  <CollapsibleTrigger>{t('expand')}</CollapsibleTrigger>
  <CollapsibleContent>
    {/* Secondary info sections */}
  </CollapsibleContent>
</Collapsible>
```

---

### `src/components/almanac/HourlyFortuneTable.tsx` (component, request-response)

**Analog:** Yi/ji badge rendering from `src/app/[locale]/page.tsx` lines 77-105 (for badge style)

**New component — no direct analog for table layout.** Use shadcn Table:
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FortuneMarker } from './FortuneMarker';
import type { HourlyFortune } from '@/lib/almanac/types';
```

**Desktop:** Table with columns [时辰, 干支, 吉凶, 星神, 宜, 忌]
**Mobile:** Vertical card layout per UI-SPEC — each hour is a stacked block

---

### `src/components/almanac/MonthlyCalendar.tsx` (component, request-response)

**No direct analog.** New CSS Grid-based component.

**Pattern from RESEARCH.md code example:**
```typescript
<div className="grid grid-cols-7 gap-1">
  {/* Weekday headers */}
  {['日', '一', '二', '三', '四', '五', '六'].map(d => (
    <div key={d} className="text-center text-sm font-semibold text-muted-foreground py-2">
      {d}
    </div>
  ))}
  {/* Empty cells for offset */}
  {Array.from({ length: startOffset }).map((_, i) => (
    <div key={`empty-${i}`} />
  ))}
  {/* Day cells */}
  {days.map(day => (
    <CalendarDayCell key={day.dateStr} day={day} />
  ))}
</div>
```

**Month navigation:** Left/right arrow buttons using `<Button>` from shadcn. Update URL `?month=YYYY-MM`.

**Link component:** Use `import { Link } from '@/i18n/navigation';` (from `src/i18n/navigation.ts`)

---

### `src/components/almanac/CalendarDayCell.tsx` (component, request-response)

**No direct analog.** Simple presentational component.

**Fortune color coding** (from UI-SPEC):
- 吉日: `bg-primary text-primary-foreground` (red bg)
- 凶日: `bg-muted text-muted-foreground` (gray bg)
- Today: `ring-2 ring-primary` (2px primary border)

---

### `src/components/almanac/SolarTermsList.tsx` (component, request-response)

**No direct analog.** Uses Card pattern from `src/components/ui/card.tsx`.

**Structure:** 4 seasonal groups, each a Card with terms listed inside.

---

### `src/components/almanac/AlmanacDetail.tsx` (component, request-response)

**No direct analog.** Uses shadcn Tabs:
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
```

**Tab structure:** 概覽 | 宜忌 | 時辰 | 方位 | 神煞
**URL-based tab state:** `?tab=hours` via searchParams

---

### `src/components/almanac/FortuneMarker.tsx` (component, request-response)

**No direct analog.** Simple presentational component.

**Pattern from RESEARCH.md:**
```typescript
import { cn } from '@/lib/utils';

interface FortuneMarkerProps {
  fortune: '吉' | '凶';
  size?: 'sm' | 'lg';
}

export function FortuneMarker({ fortune, size = 'lg' }: FortuneMarkerProps) {
  const isAuspicious = fortune === '吉';
  return (
    <span
      className={cn(
        'font-semibold tracking-tight',
        size === 'lg' ? 'text-[36px]' : 'text-[20px]',
        isAuspicious ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {fortune}
    </span>
  );
}
```

---

### `src/components/almanac/YiJiBadgeList.tsx` (component, request-response)

**Analog:** Badge rendering from `src/app/[locale]/page.tsx` lines 77-105

**Extract existing badge pattern:**
```typescript
// Yi badges (gold themed)
<span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-sm text-gold border border-gold/20">
  {item}
</span>

// Ji badges (muted themed)
<span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground border border-border">
  {item}
</span>
```

**Upgrade to shadcn Badge:**
```typescript
import { Badge } from '@/components/ui/badge';
// Yi: <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20">{item}</Badge>
// Ji: <Badge variant="secondary">{item}</Badge>
```

---

### `src/components/almanac/NavigationLinks.tsx` (component, request-response)

**Analog:** `src/components/layout/LocaleToggle.tsx` (client component in header)

**LocaleToggle pattern** (full file, lines 1-40):
```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function LocaleToggle() {
  const locale = useLocale();
  // ...
}
```

**NavigationLinks — Server Component** (no 'use client' needed):
```typescript
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

// Links: 首頁 (/), 月曆 (/calendar), 節氣 (/solar-terms)
// Active state: text-primary + border-b-2 border-primary
```

**Note:** NavigationLinks needs pathname detection for active state. If using `usePathname()`, it must be a Client Component. Alternative: make it a Server Component that receives `pathname` as a prop from Header.

---

### `src/components/layout/Header.tsx` (component, request-response)

**Analog:** `src/components/layout/Header.tsx` (self — modify existing)

**Existing pattern** (full file, lines 1-20):
```typescript
import { getTranslations } from 'next-intl/server';
import { LocaleToggle } from './LocaleToggle';

export async function Header() {
  const t = await getTranslations('Layout');

  return (
    <header className="sticky top-0 z-50 h-14 md:h-16 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <a
          href="/"
          className="text-lg font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          {t('brand')}
        </a>
        <LocaleToggle />
      </div>
    </header>
  );
}
```

**Modification:** Add `<NavigationLinks />` between brand and LocaleToggle:
```typescript
<div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
  <a href="/" className="text-lg font-semibold text-primary">{t('brand')}</a>
  <NavigationLinks />
  <LocaleToggle />
</div>
```

---

### `src/i18n/messages/zh-hant.json` + `zh-hans.json` (config, transform)

**Analog:** `src/i18n/messages/zh-hant.json` (self — extend existing)

**Existing structure** (lines 1-48):
```json
{
  "Layout": { "brand": "今擇易", ... },
  "Footer": { "disclaimer": "...", "copyright": "..." },
  "Homepage": { "title": "今日黃曆", ... },
  "Almanac": { "title": "今日黃曆", "yi": "宜", "ji": "忌", ... },
  "NotFound": { "heading": "頁面未找到", ... }
}
```

**New namespaces to add** (from UI-SPEC copywriting contract):

1. **Expand `Almanac`** — add collapsible labels (冲煞, 吉神凶煞, 值神, 星宿, 彭祖百忌, 纳音, 胎神, expand/collapse buttons)
2. **New `HourlyFortune`** — section title, column headers (时辰, 吉凶, 星神, 宜, 忌), no-yi/no-ji text
3. **New `Calendar`** — page title, month format, weekday headers, today label, prev/next aria, legend
4. **New `SolarTerms`** — page title, season groups (春/夏/秋/冬), jie/qi labels
5. **New `Detail`** — page title format, tab names (概覽/宜忌/時辰/方位/神煞), back links, error/404 states
6. **Expand `Layout`** — nav labels (首页/月历/节气)

**Pattern:** Each namespace is a flat or one-level-nested object. Use ICU message syntax for interpolated values (`{year}`, `{month}`).

---

## Shared Patterns

### Server Component Data Fetching
**Source:** `src/app/[locale]/page.tsx` lines 14-26
**Apply to:** All new page.tsx files (calendar, solar-terms, almanac/[date])
```typescript
export default async function PageComponent() {
  const t = await getTranslations('Namespace');
  let data;
  let error: string | null = null;
  try {
    data = await serviceMethod(args);
  } catch {
    error = 'fetch-error';
  }
  if (error || !data) {
    // Render error card with translated strings
  }
  // Render data
}
```

### Error Handling (Page Level)
**Source:** `src/app/[locale]/page.tsx` lines 27-43
**Apply to:** All new page.tsx files
```typescript
if (error || !data) {
  const tError = await getTranslations('Namespace');
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Card className="max-w-prose w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-destructive">
            {tError('error.heading')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{tError('error.body')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Redis Cache Pattern
**Source:** `src/lib/almanac/cache.ts` lines 6-24
**Apply to:** All new cache helpers
```typescript
export async function getCachedX(key: string): Promise<Type | null> {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as Type;
  } catch {
    return null;
  }
}

export async function setCachedX(key: string, data: Type): Promise<void> {
  try {
    await redis.setex(key, TTL, JSON.stringify(data));
  } catch {
    console.error(`[Redis] Failed to cache ${key}`);
  }
}
```

### i18n Translation Access
**Source:** `src/app/[locale]/page.tsx` line 15, `src/components/layout/Header.tsx` line 5
**Apply to:** All components and pages
```typescript
// Server Component (page.tsx):
const t = await getTranslations('Namespace');

// Client Component:
'use client';
import { useTranslations } from 'next-intl';
const t = useTranslations('Namespace');
```

### Component Import Aliases
**Source:** `tsconfig.json` + `components.json`
**Apply to:** All new files
```typescript
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DailyAlmanac } from '@/lib/almanac/types';
import { getDailyAlmanac } from '@/lib/almanac/service';
import { Link } from '@/i18n/navigation';
```

### Locale-Aware Linking
**Source:** `src/i18n/navigation.ts` + `src/components/layout/LocaleToggle.tsx`
**Apply to:** All navigation links (calendar day clicks, nav links, back links)
```typescript
import { Link } from '@/i18n/navigation';

// Usage:
<Link href={`/almanac/${dateStr}`}>{label}</Link>
<Link href="/calendar">{t('calendar')}</Link>
```

### Layout Container
**Source:** `src/app/[locale]/layout.tsx` line 47
**Note:** The layout already wraps children in `max-w-[65ch] w-full px-4 py-8`. Pages do NOT need to add their own max-width wrapper unless they need a different width (e.g., calendar page may need `max-w-2xl` or `max-w-3xl`).

---

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md patterns and UI-SPEC contracts instead):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/components/almanac/MonthlyCalendar.tsx` | component | request-response | No CSS Grid calendar pattern exists; use RESEARCH.md code example |
| `src/components/almanac/CalendarDayCell.tsx` | component | request-response | No cell-based interactive component exists; use UI-SPEC color coding |
| `src/components/almanac/AlmanacDetail.tsx` | component | request-response | No tabbed layout exists; use shadcn Tabs pattern from RESEARCH.md |

---

## Metadata

**Analog search scope:** `src/` directory (19 TypeScript files)
**Files scanned:** 19
**Pattern extraction date:** 2026-05-17
