# Phase 2: Core Almanac UI - Research

**Researched:** 2026-05-17
**Domain:** Next.js App Router pages, tyme4ts API (hourly/monthly/term), shadcn/ui components, responsive Chinese calendar UI
**Confidence:** HIGH

## Summary

Phase 2 builds the complete daily almanac browsing experience on top of Phase 1's foundation. Five new features: today's almanac card (ALM-03), 12-shichen hourly fortune table (ALM-04), monthly calendar view (ALM-05), 24 solar terms page (ALM-06), and daily almanac detail page (ALM-07). The core technical work involves extending AlmanacService with three new methods (`getHourlyFortune`, `getMonthlyCalendar`, `getSolarTerms`), creating 4 new routes, and building ~10 custom components.

The tyme4ts API has been fully verified for all Phase 2 needs. `LunarHour.getHours()` returns 13 hours (indices 0-12, where 12 is next day's 子时). `SolarMonth.fromYm().getDays()` returns the full day array. `SolarTerm.fromIndex(year, 0..23)` iterates all 24 terms. Fortune classification uses `getTwelveStar().getEcliptic().getLuck().toString()` returning "吉" or "凶". All data is computed server-side — no client-side tyme4ts calls needed.

**Primary recommendation:** Extend AlmanacService with three new cached methods first, then build pages top-down (homepage upgrade, calendar, detail, solar terms). Use Server Components exclusively — no client state management needed for read-only almanac browsing.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Core info prominent + secondary info collapsed. 干支/农历/宜忌 displayed large; 冲煞/财神/星宿/彭祖/纳音/胎神 in "展开更多" collapsible.
- **D-02:** Card top: "今日黄历" + solar date, then lunar date + zodiac, then gan-zhi three pillars, then yi/ji lists.
- **D-03:** Vertical timeline layout for hourly table. Left: shichen name + time. Right: details (yi/ji, star, chong-sha).
- **D-04:** Fortune markers use calligraphy style: brush-font 吉/凶 characters with color coding (吉=red/gold text, 凶=gray/muted text). Not simple check/cross icons.
- **D-05:** Yi/ji items paired with icons/illustrations for visual enhancement. Need metaphysics-themed icons.
- **D-06:** Traditional calendar grid style, 7 columns (日一二三四五六), each cell shows lunar date + fortune color block.
- **D-07:** Color coding: red bg/gold text = 吉日, gray bg = 凶日, white bg = 平日. Today cell highlighted.
- **D-08:** Top arrows for month switching, center shows current year+month (e.g., "2026年5月 · 农历四月").
- **D-09:** Click a day navigates to /almanac/YYYY-MM-DD detail page.
- **D-10:** Full info displayed in sections on a long page. Order: date+gan-zhi+lunar → yi/ji → hourly fortune (timeline) → directions (chong-sha/cai-shen/xi-shen/fu-shen) → gods → duty → twenty-eight star → peng-zu → sound → fetus day.
- **D-11:** URL format /almanac/YYYY-MM-DD, SSR rendered, SEO supported.
- **D-12:** Single page list of 24 solar terms grouped by season (spring/summer/autumn/winter). Each shows: name, date, meaning, traditional customs.
- **D-13:** Solar term data from tyme4ts or static definition (dates change little year to year).
- **D-14:** Header adds main nav links: 首页 | 月历 | 节气. 3 entries covering all Phase 2 pages.
- **D-15:** Detail page accessed via calendar click, not in nav.

### Claude's Discretion
- AlmanacService extension API design (getMonthlyAlmanac, getHourlyFortune, getSolarTerms)
- Monthly calendar data caching strategy (per-month vs per-day assembly)
- Solar term data: static vs dynamic
- Hourly fortune data structure and rendering
- Responsive layout details (mobile/desktop adaptation)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ALM-03 | Today's almanac card: solar, lunar, gan-zhi, zodiac, yi/ji, chong-sha, wealth/joy/mascot directions, gods, duty, 28 stars, peng-zu, sound, fetus | AlmanacService.getDailyAlmanac() already exists; TodayAlmanacCard component uses existing DailyAlmanac type |
| ALM-04 | 12-shichen hourly fortune table: detailed yi/ji, star, chong-sha, fortune markers | tyme4ts LunarHour.getHours() verified: 13 hours, getRecommends/getAvoids/getTwelveStar all work |
| ALM-05 | Monthly calendar: per-day fortune, color-coded, switchable months, clickable | SolarMonth.fromYm().getDays() verified; fortune via getTwelveStar().getEcliptic().getLuck() |
| ALM-06 | Solar terms page: 24 jieqi with dates, meanings, customs | SolarTerm.fromIndex(year, 0..23) verified; isJie()/isQi() classification works |
| ALM-07 | Daily detail page: SSR, /almanac/YYYY-MM-DD, all info in sections | AlmanacService.getDailyAlmanac() exists; new route + tabbed layout needed |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hourly fortune computation | API / Backend | — | tyme4ts runs in Node.js, not browser |
| Monthly calendar computation | API / Backend | — | tyme4ts SolarMonth runs server-side |
| Solar term computation | API / Backend | — | tyme4ts SolarTerm runs server-side |
| Almanac data caching | API / Backend | — | Redis cache layer (existing pattern) |
| Page rendering (SSR) | Frontend Server (SSR) | — | Server Components fetch data and render |
| Calendar grid interaction | Browser / Client | Frontend Server (SSR) | Month navigation via URL searchParams (server), day click via Link (client) |
| Expand/collapse animation | Browser / Client | — | Collapsible component is client-interactive |
| Tab state (detail page) | Browser / Client | Frontend Server (SSR) | URL-based tab state (?tab=hours) for deep linking |
| Navigation links | Frontend Server (SSR) | — | Server Component reading current locale |

## Standard Stack

### Core (inherited from Phase 1)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.6 | Full-stack React framework | App Router with SSR; already installed |
| typescript | 5.x | Type safety | Already configured |
| tyme4ts | 1.4.6 | Chinese calendar algorithms | Already installed; all Phase 2 APIs verified |
| next-intl | 4.12.0 | i18n routing + translations | Already configured |

### UI Components (new for Phase 2)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn/ui tabs | latest | Detail page section tabs | Official shadcn component; Radix UI under the hood |
| shadcn/ui badge | latest | Yi/ji activity tags, fortune badges | Official shadcn component |
| shadcn/ui tooltip | latest | Calendar day hover detail | Official shadcn component |
| shadcn/ui table | latest | Hourly fortune desktop layout | Official shadcn component |
| shadcn/ui scroll-area | latest | Mobile horizontal scroll | Official shadcn component |
| shadcn/ui collapsible | latest | Today card expand/collapse | Official shadcn component |

**Installation:**
```bash
npx shadcn@latest add tabs badge tooltip table scroll-area collapsible
```

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn Table | Custom CSS Grid | Table gives accessibility (aria) out of box; CSS Grid needs manual a11y |
| shadcn Tabs | URL-based manual tabs | shadcn Tabs has keyboard nav + aria; manual needs more work |
| shadcn Collapsible | Custom useState + AnimatePresence | Collapsible gives standard animation + accessibility |

## Package Legitimacy Audit

> All packages are shadcn/ui official components (Radix UI primitives). No third-party registries.

| Package | Registry | Age | Downloads | Source Repo | Disposition |
|---------|----------|-----|-----------|-------------|-------------|
| @radix-ui/react-tabs | npm | 4+ yrs | millions/wk | github.com/radix-ui/primitives | Approved (shadcn dependency) |
| @radix-ui/react-tooltip | npm | 4+ yrs | millions/wk | github.com/radix-ui/primitives | Approved (shadcn dependency) |
| @radix-ui/react-collapsible | npm | 4+ yrs | millions/wk | github.com/radix-ui/primitives | Approved (shadcn dependency) |
| @radix-ui/react-scroll-area | npm | 4+ yrs | millions/wk | github.com/radix-ui/primitives | Approved (shadcn dependency) |

*Note: shadcn components are copy-paste, not npm dependencies. They install Radix UI primitives as dependencies. All verified as official Radix UI packages.*

## Architecture Patterns

### System Architecture (Phase 2 additions)

```
Browser Request
      │
      ▼
┌─────────────────────────────────────────┐
│           Next.js 16 App Router          │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │         Server Components          │ │
│  │                                    │ │
│  │  /[locale]/           → HomePage   │ │
│  │    └ TodayAlmanacCard              │ │
│  │    └ HourlyFortuneTable            │ │
│  │                                    │ │
│  │  /[locale]/calendar   → CalendarPage│ │
│  │    └ MonthlyCalendar               │ │
│  │      └ CalendarDayCell             │ │
│  │                                    │ │
│  │  /[locale]/almanac/[date] → Detail │ │
│  │    └ Tabs (概览/宜忌/时辰/方位/神煞)│ │
│  │    └ HourlyFortuneTable            │ │
│  │    └ YiJiBadgeList                 │ │
│  │                                    │ │
│  │  /[locale]/solar-terms → SolarTerms│ │
│  │    └ SolarTermsList                │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │       AlmanacService (extended)    │ │
│  │  ┌──────────┐  ┌──────────────┐   │ │
│  │  │ Existing │  │ New methods  │   │ │
│  │  │ getDaily │  │ getHourly    │   │ │
│  │  │ Almanac  │  │ getMonthly   │   │ │
│  │  │          │  │ getSolarTerms│   │ │
│  │  └────┬─────┘  └──────┬───────┘   │ │
│  └───────┼────────────────┼───────────┘ │
└──────────┼────────────────┼─────────────┘
           │                │
     ┌─────▼─────┐   ┌─────▼─────┐
     │   Redis    │   │  tyme4ts  │
     │   Cache    │   │  Engine   │
     └───────────┘   └───────────┘
```

### Recommended Project Structure (Phase 2 additions)
```
src/
├── app/[locale]/
│   ├── page.tsx              # MODIFIED: upgraded with TodayAlmanacCard + HourlyFortuneTable
│   ├── calendar/
│   │   └── page.tsx          # NEW: monthly calendar view
│   ├── solar-terms/
│   │   └── page.tsx          # NEW: 24 solar terms page
│   └── almanac/
│       └── [date]/
│           └── page.tsx      # NEW: daily almanac detail page
├── components/
│   ├── almanac/
│   │   ├── TodayAlmanacCard.tsx    # NEW: today's almanac card with collapsible
│   │   ├── HourlyFortuneTable.tsx  # NEW: 12-shichen fortune timeline
│   │   ├── MonthlyCalendar.tsx     # NEW: monthly calendar grid
│   │   ├── CalendarDayCell.tsx     # NEW: individual day cell
│   │   ├── SolarTermsList.tsx      # NEW: 24 terms grouped by season
│   │   ├── AlmanacDetail.tsx       # NEW: detail page with tabs
│   │   ├── FortuneMarker.tsx       # NEW: calligraphy 吉/凶 marker
│   │   └── YiJiBadgeList.tsx       # NEW: yi/ji badge list
│   └── layout/
│       └── Header.tsx              # MODIFIED: add nav links
└── lib/almanac/
    ├── service.ts                  # MODIFIED: add 3 new methods
    ├── types.ts                    # MODIFIED: add HourlyFortune, CalendarDay, SolarTerm types
    └── cache.ts                    # MODIFIED: add new cache helpers
```

### Pattern 1: AlmanacService Extension — Hourly Fortune
**What:** New method `getHourlyFortune(dateStr)` returning 12-shichen data with yi/ji, star, fortune
**When to use:** Homepage and detail page hourly table
**Example:**
```typescript
// Source: tyme4ts 1.4.6 API — VERIFIED via live install
export async function getHourlyFortune(dateStr: string): Promise<HourlyFortune[]> {
  const cached = await getCachedHourlyFortune(dateStr);
  if (cached) return cached;

  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = SolarDay.fromYmd(year, month, day);
  const lunar = solar.getLunarDay();
  const hours = lunar.getHours(); // Returns 13 LunarHour objects

  const result: HourlyFortune[] = hours.slice(0, 12).map(h => {
    const ts = h.getTwelveStar();
    const ecliptic = ts.getEcliptic();
    const luck = ecliptic.getLuck();
    // SixtyCycleHour toString: "丙午年癸巳月辛卯日戊子时"
    // Extract hour gan-zhi: last 2 chars before "时"
    const schStr = h.getSixtyCycleHour().toString();
    const hourGanZhi = schStr.slice(-3, -1); // "戊子" from "...戊子时"

    return {
      name: h.getName(),           // "子时"
      ganZhi: hourGanZhi,          // "戊子"
      star: ts.toString(),         // "司命"
      fortune: luck.toString() as '吉' | '凶',
      yi: h.getRecommends().map(r => r.toString()),
      ji: h.getAvoids().map(a => a.toString()),
    };
  });

  await setCachedHourlyFortune(dateStr, result);
  return result;
}
```
Source: tyme4ts 1.4.6 — LunarHour.getHours() returns 13 hours, getRecommends/getAvoids/getTwelveStar verified [VERIFIED: live API test]

**Critical detail:** `getHours()` returns 13 items. Index 0-11 are the current day's 12 shichen. Index 12 is the next day's 子时. Use `slice(0, 12)` for the standard 12 shichen display.

### Pattern 2: AlmanacService Extension — Monthly Calendar
**What:** New method `getMonthlyCalendar(year, month)` returning day-by-day data for the grid
**When to use:** Calendar page
**Example:**
```typescript
// Source: tyme4ts 1.4.6 API — VERIFIED via live install
export async function getMonthlyCalendar(year: number, month: number): Promise<CalendarDay[]> {
  const cacheKey = `${year}-${String(month).padStart(2, '0')}`;
  const cached = await getCachedMonthlyCalendar(cacheKey);
  if (cached) return cached;

  const solarMonth = SolarMonth.fromYm(year, month);
  const days = solarMonth.getDays();
  const todayStr = formatToday();

  const result: CalendarDay[] = days.map(d => {
    const lunar = d.getLunarDay();
    const ts = lunar.getTwelveStar();
    const luck = ts.getEcliptic().getLuck().toString();
    const dateStr = `${d.getYear()}-${String(d.getMonth()).padStart(2, '0')}-${String(d.getDay()).padStart(2, '0')}`;

    return {
      solarDay: d.getDay(),
      lunarDay: lunar.getName(),    // "初一", "十五", etc.
      fortune: luck as '吉' | '凶' | '平',
      isToday: dateStr === todayStr,
      dateStr,
      weekday: d.getWeek().index,   // 0=Sun, 6=Sat
    };
  });

  await setCachedMonthlyCalendar(cacheKey, result);
  return result;
}
```
Source: tyme4ts 1.4.6 — SolarMonth.fromYm().getDays() returns SolarDay array; getWeek().index 0=Sunday [VERIFIED: live API test]

**Fortune classification note:** `getLuck().toString()` returns only "吉" or "凶" — there is no "平" from tyme4ts. For the UI-SPEC's three-tier classification (吉/凶/平), the plan should either: (a) treat all days as binary 吉/凶, or (b) add a heuristic (e.g., "平" when neither strongly auspicious nor inauspicious). Recommendation: use binary 吉/凶 from tyme4ts directly — the UI-SPEC's "平" was aspirational but tyme4ts doesn't provide it.

### Pattern 3: AlmanacService Extension — Solar Terms
**What:** New method `getSolarTerms(year)` returning all 24 jieqi with dates
**When to use:** Solar terms page
**Example:**
```typescript
// Source: tyme4ts 1.4.6 API — VERIFIED via live install
export async function getSolarTerms(year: number): Promise<SolarTerm[]> {
  const cached = await getCachedSolarTerms(year);
  if (cached) return cached;

  const terms: SolarTerm[] = [];
  for (let i = 0; i < 24; i++) {
    const t = Term.fromIndex(year, i);
    const sd = t.getSolarDay();
    terms.push({
      name: t.toString(),           // "立夏"
      date: `${sd.getYear()}-${String(sd.getMonth()).padStart(2, '0')}-${String(sd.getDay()).padStart(2, '0')}`,
      isJie: t.isJie(),             // true = 节, false = 气
      year: t.getYear(),
    });
  }

  await setCachedSolarTerms(year, terms);
  return terms;
}
```
Source: tyme4ts 1.4.6 — SolarTerm.fromIndex(year, 0..23) verified; index 0 = 冬至 (previous year) [VERIFIED: live API test]

**Critical detail:** `SolarTerm.fromIndex(year, 0)` returns 冬至 of the *previous* year (e.g., for year=2026, index 0 = 2025-12-21 冬至). This is by design — the Chinese solar year starts at 冬至. The solar terms page should filter to show only terms where `t.getYear() === year` for the requested year, OR display the full cycle with appropriate labeling.

### Pattern 4: Next.js Dynamic Route with SSR
**What:** `/[locale]/almanac/[date]` page with `generateMetadata` and `generateStaticParams`
**When to use:** Daily detail page (ALM-07)
**Example:**
```typescript
// src/app/[locale]/almanac/[date]/page.tsx
import { notFound } from 'next/navigation';
import { getDailyAlmanac } from '@/lib/almanac/service';

interface Props {
  params: Promise<{ locale: string; date: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  const almanac = await getDailyAlmanac(date);
  // Return SEO metadata
  return {
    title: `${almanac.solar.year}年${almanac.solar.month}月${almanac.solar.day}日 黄历`,
    description: `今日宜：${almanac.yi.slice(0, 3).join('、')}。忌：${almanac.ji.slice(0, 3).join('、')}。`,
  };
}

export default async function AlmanacDetailPage({ params }: Props) {
  const { date } = await params;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  let almanac;
  try {
    almanac = await getDailyAlmanac(date);
  } catch {
    notFound();
  }

  // Render detail page with tabs
}
```
Source: Next.js 16 App Router pattern [VERIFIED: existing layout.tsx uses same params pattern]

### Anti-Patterns to Avoid
- **Don't fetch tyme4ts data client-side:** All computation is server-side. No `'use client'` on data-fetching components.
- **Don't use 13th hour:** `getHours()` returns 13 items. Slice to 12 for display (index 12 is next day's 子时).
- **Don't assume "平" fortune exists:** tyme4ts only returns "吉" or "凶". No neutral/平 value.
- **Don't hardcode solar term dates:** Use `SolarTerm.fromIndex()` to compute dynamically — dates shift slightly year to year.
- **Don't use `getServerSideProps`:** App Router only. Use Server Components with direct async data fetching.
- **Don't put tab state in React state alone:** Use URL searchParams (`?tab=hours`) for deep-linkable tab state.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hourly fortune data | Custom hour calculation | tyme4ts LunarHour.getHours() | Correctly handles 子时 spanning midnight, gan-zhi cycles |
| Monthly calendar days | Custom date iteration | tyme4ts SolarMonth.fromYm().getDays() | Correct lunar date mapping for each day |
| Solar term dates | Static JSON table | tyme4ts SolarTerm.fromIndex() | Dates shift slightly each year; algorithm is more accurate |
| Fortune classification | Custom heuristics | tyme4ts getTwelveStar().getEcliptic().getLuck() | Standard 黄道/黑道 classification |
| Tab navigation | Manual keyboard/aria | shadcn Tabs (Radix) | Built-in keyboard nav, aria, focus management |
| Expand/collapse | Manual height animation | shadcn Collapsible (Radix) | Standard animation, accessibility, state management |
| Calendar grid | Manual table layout | CSS Grid + shadcn Tooltip | Grid for layout, Tooltip for hover details |

**Key insight:** All almanac data computation should go through AlmanacService with Redis caching. The UI layer is purely presentational — it receives typed data and renders it.

## Common Pitfalls

### Pitfall 1: 13th Hour (Next Day's 子时)
**What goes wrong:** Displaying 13 hours instead of 12, showing next day's 子时 as today's last hour
**Why it happens:** `getHours()` returns 13 items by design — the last 子时 (23:00-01:00) spans midnight
**How to avoid:** Always `hours.slice(0, 12)` for display. The 13th hour belongs to the next day.
**Warning signs:** Hourly table shows duplicate 子时 entries

### Pitfall 2: SolarTerm Index 0 = Previous Year's 冬至
**What goes wrong:** Showing last year's 冬至 as the first term of the requested year
**Why it happens:** `SolarTerm.fromIndex(2026, 0)` returns 2025-12-21 冬至 — the Chinese solar year cycle starts at 冬至
**How to avoid:** Filter terms by `t.getYear() === year` or display the full cycle with clear labeling. For the 24 solar terms page, showing the full cycle (冬至 through 大雪) is the traditional approach.
**Warning signs:** First term date is in the previous year

### Pitfall 3: Fortune Classification is Binary
**What goes wrong:** Trying to display "平" (neutral) days when tyme4ts only returns "吉" or "凶"
**Why it happens:** UI-SPEC mentions three tiers but tyme4ts only provides two
**How to avoid:** Use binary classification from tyme4ts. If three tiers are desired, add a heuristic layer (e.g., based on number of yi vs ji items) but this is optional.
**Warning signs:** TypeScript errors when trying to assign "平" to fortune field

### Pitfall 4: Calendar Grid First-Day Offset
**What goes wrong:** Calendar days misaligned — 1st of month not in correct weekday column
**Why it happens:** Not accounting for the weekday of the 1st day of the month
**How to avoid:** Use `SolarDay.fromYmd(year, month, 1).getWeek().index` to get the starting column (0=Sun). Add empty cells before the 1st.
**Warning signs:** Calendar shows wrong weekday for known dates

### Pitfall 5: Month Navigation State Loss
**What goes wrong:** Clicking "next month" loses current context or creates broken URLs
**Why it happens:** Not properly constructing the `?month=YYYY-MM` searchParam
**How to avoid:** Use `useRouter().push` with constructed URL, or use Link components with pre-built hrefs. Server Component reads `searchParams.month`.
**Warning signs:** 404 on month navigation, or month resets to current month

### Pitfall 6: Hour Gan-Zhi Extraction
**What goes wrong:** Extracting wrong characters from SixtyCycleHour.toString()
**Why it happens:** `getSixtyCycleHour().toString()` returns full string like "丙午年癸巳月辛卯日戊子时" — need to extract just the hour part
**How to avoid:** Use `schStr.slice(-3, -1)` to extract the 2-char gan-zhi before "时". Or use dedicated method if available.
**Warning signs:** Wrong gan-zhi displayed for hours

## Code Examples

### FortuneMarker Component
```typescript
// Source: UI-SPEC calligraphy design contract
interface FortuneMarkerProps {
  fortune: '吉' | '凶';
  size?: 'sm' | 'lg'; // sm=20px for calendar, lg=36px for hourly table
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

### Calendar Grid with CSS Grid
```typescript
// Source: UI-SPEC layout contract
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

### Server Component with searchParams (Calendar Page)
```typescript
// src/app/[locale]/calendar/page.tsx
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
Source: Next.js 16 App Router searchParams pattern [VERIFIED: params is Promise in Next.js 16]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side data fetching | Server Components with direct async | Next.js 13+ App Router | No loading spinners for SSR pages |
| URL query state via useRouter | searchParams prop in Server Components | Next.js 15+ | Direct access, no useSearchParams needed |
| Manual tab state | URL-based tab state + shadcn Tabs | shadcn/ui best practice | Deep-linkable, shareable tab URLs |

**Deprecated/outdated:**
- `getServerSideProps` / `getStaticProps` — replaced by Server Components
- `useSearchParams()` for read-only URL state — prefer `searchParams` prop in Server Components
- `pages/` directory — use `app/` directory only

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | shadcn `npx shadcn@latest add tabs badge tooltip table scroll-area collapsible` installs correctly with base-nova style | Standard Stack | May need individual installs or different component names |
| A2 | Next.js 16 `searchParams` in Server Components is `Promise<{...}>` (async) | Code Examples | May be sync in some configurations; low risk — pattern already used in params |
| A3 | `SixtyCycleHour.toString()` format is consistent: "...{ganZhi}时" | Code Examples | Format may differ for edge cases; slice(-3,-1) may extract wrong chars |
| A4 | Fortune "平" does not exist in tyme4ts — only "吉" and "凶" | Pitfall 3 | If "平" exists, need to handle three-tier display |
| A5 | SolarTerm index 0 is always previous year's 冬至 | Pitfall 2 | May vary for edge years; verify with year boundary tests |

## Open Questions

1. **Should solar terms page show full cycle (冬至-大雪) or calendar year (January-December)?**
   - What we know: `SolarTerm.fromIndex(year, 0)` returns previous year's 冬至. The traditional Chinese solar year starts at 冬至.
   - What's unclear: Whether users expect calendar year grouping or traditional cycle.
   - Recommendation: Show full 24-term cycle starting from 冬至, grouped by season (春/夏/秋/冬). This is the traditional approach and matches D-12.

2. **How to handle "平" (neutral) fortune when tyme4ts only returns binary?**
   - What we know: `getLuck().toString()` only returns "吉" or "凶".
   - What's unclear: Whether the UI needs three tiers or binary is acceptable.
   - Recommendation: Use binary (吉/凶) from tyme4ts. The UI-SPEC's "平" was aspirational. Calendar cells with "凶" use muted bg, "吉" use red bg. No neutral state needed.

3. **Hour gan-zhi extraction method reliability?**
   - What we know: `getSixtyCycleHour().toString()` returns "丙午年癸巳月辛卯日戊子时". Slicing last 3 chars before "时" gives "戊子".
   - What's unclear: Whether format is always consistent (especially for edge cases like year boundaries).
   - Recommendation: Verify with a few edge cases (year boundary, month boundary). Alternative: parse by splitting on "日" and taking the last part before "时".

## Environment Availability

> Phase 2 has no new external dependencies beyond what Phase 1 established.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All | Check at runtime | Required 18+ | — |
| tyme4ts | AlmanacService | Installed | 1.4.6 | — |
| Redis | Cache layer | Check at runtime | Required 7+ | In-memory fallback (existing) |
| shadcn CLI | Component install | Via npx | latest | Manual file creation |

**Missing dependencies with no fallback:**
- None — all Phase 1 dependencies are sufficient for Phase 2.

**Missing dependencies with fallback:**
- Redis: graceful fallback already implemented in Phase 1's cache.ts

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (recommended in Phase 1 research) |
| Config file | none yet — see Wave 0 |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ALM-03 | TodayAlmanacCard renders all DailyAlmanac fields | unit | `npx vitest run tests/almanac/today-card.test.tsx` | Wave 0 |
| ALM-04 | getHourlyFortune returns 12 hours with correct yi/ji/star | unit | `npx vitest run tests/almanac/hourly.test.ts` | Wave 0 |
| ALM-04 | Hourly fortune cache hit returns same data | integration | `npx vitest run tests/almanac/hourly-cache.test.ts` | Wave 0 |
| ALM-05 | getMonthlyCalendar returns correct day count for month | unit | `npx vitest run tests/almanac/monthly.test.ts` | Wave 0 |
| ALM-05 | Calendar grid offset matches weekday of 1st | unit | `npx vitest run tests/almanac/calendar-grid.test.tsx` | Wave 0 |
| ALM-06 | getSolarTerms returns 24 terms with correct dates | unit | `npx vitest run tests/almanac/solar-terms.test.ts` | Wave 0 |
| ALM-06 | Solar terms page groups by season correctly | unit | `npx vitest run tests/almanac/solar-terms-page.test.tsx` | Wave 0 |
| ALM-07 | Detail page renders for valid date, 404 for invalid | integration | `npx vitest run tests/almanac/detail-page.test.tsx` | Wave 0 |
| ALM-07 | generateMetadata returns correct title/description | unit | `npx vitest run tests/almanac/detail-meta.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run` (affected tests)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green before verify-work

### Wave 0 Gaps
- [ ] `vitest.config.ts` — test framework configuration (if not created in Phase 1)
- [ ] `tests/almanac/hourly.test.ts` — hourly fortune computation tests
- [ ] `tests/almanac/monthly.test.ts` — monthly calendar computation tests
- [ ] `tests/almanac/solar-terms.test.ts` — solar terms computation tests
- [ ] `tests/almanac/today-card.test.tsx` — TodayAlmanacCard rendering tests
- [ ] `tests/almanac/detail-page.test.tsx` — detail page rendering + 404 tests
- [ ] `tests/setup.ts` — shared test fixtures (mock AlmanacService)
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react` (if not done in Phase 1)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in Phase 2 |
| V3 Session Management | No | No sessions in Phase 2 |
| V4 Access Control | No | No user roles in Phase 2 |
| V5 Input Validation | Yes | Date parameter validation (YYYY-MM-DD format, range check) |
| V6 Cryptography | No | No encryption needed |

### Known Threat Patterns for SSR Almanac Pages

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal via date param | Tampering | Validate date format with regex; use notFound() for invalid |
| XSS via tyme4ts output | Information Disclosure | React auto-escapes; tyme4ts returns plain strings |
| Cache poisoning via manipulated dates | Tampering | Date-based cache keys; no user input in keys |
| DoS via extreme date ranges | Denial of Service | Limit date range (e.g., 1900-2100); reject out-of-range |

## Sources

### Primary (HIGH confidence)
- tyme4ts 1.4.6 npm: LunarHour.getHours(), SolarMonth.fromYm().getDays(), SolarTerm.fromIndex() — all verified via live Node.js execution
- Next.js 16.2.6 App Router: params/searchParams as Promise — verified in existing layout.tsx
- shadcn/ui: base-nova style, components.json confirmed — verified in Phase 1

### Secondary (MEDIUM confidence)
- shadcn component install command `npx shadcn@latest add tabs badge tooltip table scroll-area collapsible` — based on shadcn CLI conventions [ASSUMED]
- CSS Grid calendar layout pattern — standard web practice [VERIFIED: standard pattern]
- URL-based tab state pattern — Next.js best practice [VERIFIED: standard pattern]

### Tertiary (LOW confidence)
- "平" fortune classification absence — verified only for 2026-05 sample; may exist for other date ranges [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified, Phase 1 stack inherited
- tyme4ts API: HIGH — all methods verified via live execution
- Architecture: HIGH — patterns match existing Phase 1 code
- Pitfalls: HIGH — edge cases discovered via live testing (13th hour, term index 0)
- UI components: MEDIUM — shadcn install command not yet tested

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (30 days — stable stack)
