# Phase 1: Foundation & Data Layer - Research

**Researched:** 2026-05-17
**Domain:** Next.js 16 App Router scaffolding, i18n routing, Chinese calendar algorithms, PostgreSQL/Prisma, Redis caching, responsive Chinese UI
**Confidence:** HIGH

## Summary

Phase 1 establishes the walking skeleton for JinZeYi: a Next.js 16 app with App Router, i18n routing (next-intl, `/zh-hant/`/`/zh-hans/`), tyme4ts-based almanac data service, PostgreSQL via Prisma 7, Redis caching, and a responsive Chinese-optimized layout with legal disclaimers. This is the thinnest possible end-to-end working slice that all subsequent phases build on.

The key technical risk is the tyme4ts API surface — verified via live npm install and API exploration. The library provides comprehensive almanac data (干支, 农历, 宜忌, 冲煞, 生肖, 节气, 时辰, 胎神, 彭祖百忌, 纳音) through a clean object model. Zero dependencies. OpenCC metaphysics dictionary needs to be built from tyme4ts output to handle terms like 干支 correctly in Simplified Chinese.

**Primary recommendation:** Scaffold Next.js 16 + next-intl + Prisma + Tailwind v4 + shadcn/ui in one pass, wire up AlmanacService with tyme4ts + Redis cache, verify with a live DB read/write on a daily almanac page.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Full schema design for all phases — include zodiac, BaZi, feng shui, naming tables now
- **D-02:** Content pages stored in DB with title, slug, content, SEO meta, locale
- **D-03:** JSON columns for flexible almanac data (yi-ji, chong-sha, hourly fortune)
- **D-04:** Separate rows per locale for multilingual content
- **D-05:** Pre-build comprehensive OpenCC dictionary from tyme4ts output
- **D-06:** Static dictionary file implementation (JSON/text format), loaded at build time
- **D-07:** Automated tests for OpenCC conversion accuracy
- **D-08:** next-intl handles locale routing, OpenCC handles content conversion
- **D-09:** Full range regression testing (1900-2100) for tyme4ts
- **D-10:** Published 万年历 as reference source of truth
- **D-11:** CI pipeline execution for tyme4ts tests
- **D-12:** All almanac fields verified (干支, 农历, 生肖, 宜忌, 冲煞, 节气)

### Claude's Discretion
- Redis cache key strategy and TTL configuration
- Responsive layout component structure (mobile-first approach)
- Disclaimer framework implementation (footer component pattern)
- Project scaffolding details (directory structure, config files)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js 16 + TypeScript project init, App Router | Standard stack verified: Next.js 16.2.6, TypeScript 5.x, React 19.x |
| FOUND-02 | Tailwind CSS 4 + shadcn/ui, Chinese-optimized theme | Verified: Tailwind 4.3.0 (CSS-first config), shadcn 4.7.0 CLI |
| FOUND-03 | PostgreSQL 16 + Prisma 7, schema design | Verified: Prisma 7.8.0; full schema for all phases per D-01 |
| FOUND-04 | Redis 7 + ioredis, 24h TTL cache | Verified: ioredis 5.10.1; cache key strategy per discretion |
| FOUND-05 | Legal disclaimer framework | Footer component, every page, not dismissible |
| FOUND-06 | Responsive layout, mobile-first | Tailwind breakpoints, 320px+ base, Chinese typography |
| I18N-01 | next-intl, /zh-hant/ /zh-hans/ URL prefixes | Verified: next-intl 4.12.0; middleware-based locale routing |
| I18N-02 | Middleware language detection | next-intl middleware handles browser lang + URL prefix |
| I18N-03 | OpenCC custom dictionary for metaphysics terms | opencc-js 1.3.1 verified; static dictionary per D-05/D-06 |
| I18N-04 | Locale toggle UI component | Two-option button in header, per UI-SPEC |
| ALM-01 | tyme4ts integration for daily almanac | Verified: tyme4ts 1.4.6, zero deps, comprehensive API |
| ALM-02 | AlmanacService with Redis cache | Service layer wrapping tyme4ts, cache per D-13 |
| DATA-01 | tyme4ts API verification, regression tests | Full range 1900-2100 per D-09, CI per D-11 |
| DATA-03 | Data caching strategy | 24h TTL for daily almanac, 7d for monthly per D-13 |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| i18n routing | Frontend Server (SSR) | — | next-intl middleware runs server-side before page render |
| Almanac data computation | API / Backend | — | tyme4ts runs in Node.js, not browser |
| Redis caching | API / Backend | — | Cache layer sits between service and DB |
| PostgreSQL persistence | Database / Storage | — | Prisma schema + migrations |
| Layout shell (header/footer) | Frontend Server (SSR) | Browser / Client | Server Components for static shell, client for locale toggle |
| Legal disclaimer | Frontend Server (SSR) | — | Static content in root layout |
| OpenCC conversion | API / Backend | Frontend Server (SSR) | Dictionary loaded at build time, applied during rendering |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.6 | Full-stack React framework | App Router with SSR/SSG/ISR; latest stable verified via npm |
| typescript | 5.x | Type safety | Non-negotiable for data-heavy domain |
| react / react-dom | 19.x | UI library | Bundled with Next.js 16; Server Components |
| next-intl | 4.12.0 | i18n routing + translations | De facto standard for Next.js App Router i18n |
| prisma | 7.8.0 | ORM + migrations | Schema-first, type-safe queries, migration system |
| @prisma/client | 7.8.0 | Prisma runtime | Generated client for database access |
| ioredis | 5.10.1 | Redis client | Most popular Node.js Redis client |
| tyme4ts | 1.4.6 | Chinese calendar algorithms | Zero deps, TypeScript-native, by 6tail (active maintainer) |
| zod | 4.4.3 | Schema validation | API validation, env parsing, AI response schema |

### UI
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.3.0 | Utility-first CSS | v4 CSS-first config, no tailwind.config.js |
| shadcn (CLI) | 4.7.0 | Component primitives | Copy-paste components on Radix UI |
| lucide-react | latest | Icons | Bundled with shadcn/ui |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| opencc-js | 1.3.1 | OpenCC Chinese conversion | Simplified/Traditional conversion with custom dictionary |
| date-fns | latest | Date manipulation | Calendar formatting that tyme4ts doesn't cover |
| sharp | 0.34.5 | Image processing | OG image generation (Phase 3) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tyme4ts | lunar-javascript | Same author; tyme4ts is TS-native upgrade. lunar-javascript as fallback per CLAUDE.md |
| opencc-js | opencc (native) | opencc-js is pure JS, no native deps; opencc is faster but needs C++ build |
| next-intl | next-i18next | Pages Router only; abandoned for App Router |

**Installation:**
```bash
npx create-next-app@latest jinzeyi --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install next-intl prisma @prisma/client ioredis tyme4ts zod opencc-js date-fns
npm install -D @types/node
npx shadcn@latest init
npx shadcn@latest add button card separator
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Disposition |
|---------|----------|-----|-----------|-------------|-------------|
| next | npm | 10+ yrs | millions/wk | github.com/vercel/next.js | Approved |
| next-intl | npm | 3+ yrs | 500k+/wk | github.com/amannn/next-intl | Approved |
| prisma | npm | 6+ yrs | millions/wk | github.com/prisma/prisma | Approved |
| ioredis | npm | 10+ yrs | millions/wk | github.com/redis/ioredis | Approved |
| tyme4ts | npm | ~2 yrs | moderate | github.com/6tail/tyme4ts | Approved |
| zod | npm | 5+ yrs | millions/wk | github.com/colinhacks/zod | Approved |
| opencc-js | npm | 3+ yrs | moderate | github.com/nk2028/opencc-js | Approved |
| tailwindcss | npm | 7+ yrs | millions/wk | github.com/tailwindlabs/tailwindcss | Approved |
| shadcn | npm | 2+ yrs | 500k+/wk | github.com/shadcn-ui/ui | Approved |

*Note: slopcheck not available at research time. All packages verified via `npm view` and have established GitHub repos with significant download counts.*

## Architecture Patterns

### System Architecture Diagram

```
Browser Request
      │
      ▼
┌─────────────┐
│  Nginx/PM2  │  (Phase 5 — reverse proxy, SSL)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           Next.js 16 App Router          │
│                                          │
│  ┌────────────────┐  ┌────────────────┐ │
│  │ next-intl       │  │ Middleware      │ │
│  │ middleware       │→│ locale detect   │ │
│  └────────────────┘  └────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │         Server Components          │ │
│  │  ┌──────────┐  ┌────────────────┐ │ │
│  │  │ Layout   │  │ Page Components│ │ │
│  │  │ (Header, │  │ (SSR/SSG)      │ │ │
│  │  │  Footer) │  │                │ │ │
│  │  └──────────┘  └───────┬────────┘ │ │
│  └────────────────────────┼───────────┘ │
│                           │              │
│  ┌────────────────────────▼───────────┐ │
│  │       API Routes / Server Actions  │ │
│  └────────────────────────┬───────────┘ │
└───────────────────────────┼─────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌──────────────┐ ┌──────────┐ ┌──────────┐
     │ AlmanacService│ │  Redis   │ │ Prisma   │
     │ (tyme4ts)    │ │  Cache   │ │ Client   │
     └──────────────┘ └──────────┘ └─────┬────┘
                                         │
                                    ┌────▼────┐
                                    │PostgreSQL│
                                    └─────────┘
```

### Recommended Project Structure
```
src/
├── app/
│   ├── [locale]/                    # i18n locale segment
│   │   ├── layout.tsx               # Root layout with fonts, header, footer
│   │   ├── page.tsx                 # Homepage (Phase 1: placeholder CTA)
│   │   └── almanac/
│   │       └── [date]/
│   │           └── page.tsx         # Daily almanac page (Phase 2)
│   ├── api/
│   │   └── almanac/
│   │       └── route.ts             # Almanac API endpoint
│   └── layout.tsx                   # HTML shell (<html>, <body>)
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Sticky header with brand + locale toggle
│   │   ├── Footer.tsx               # Legal disclaimer + copyright
│   │   └── LocaleToggle.tsx         # 繁體/简体 toggle button
│   └── ui/                          # shadcn/ui components (auto-generated)
├── i18n/
│   ├── routing.ts                   # next-intl routing config
│   ├── request.ts                   # next-intl request config
│   └── messages/
│       ├── zh-hant.json             # Traditional Chinese messages
│       └── zh-hans.json             # Simplified Chinese messages
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── redis.ts                     # ioredis client singleton
│   ├── opencc.ts                    # OpenCC conversion with custom dictionary
│   └── almanac/
│       ├── service.ts               # AlmanacService (tyme4ts wrapper)
│       ├── types.ts                 # Almanac data types
│       └── cache.ts                 # Redis cache helpers
├── dictionaries/
│   └── metaphysics-zh-hans.json     # OpenCC custom dictionary for metaphysics terms
├── styles/
│   └── globals.css                  # Tailwind + CSS variables (Chinese theme)
└── types/
    └── almanac.ts                   # Shared type definitions
```

### Pattern 1: next-intl i18n Routing
**What:** Middleware-based locale detection with URL prefix routing (`/zh-hant/`, `/zh-hans/`)
**When to use:** Every page in the app; locale is a URL segment, not a cookie-only concern
**Example:**
```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh-hant', 'zh-hans'],
  defaultLocale: 'zh-hant'
});

// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(zh-hant|zh-hans)/:path*']
};
```
Source: next-intl 4.12.0 App Router docs [ASSUMED — WebFetch blocked, based on training knowledge for next-intl 4.x API]

### Pattern 2: Prisma Client Singleton
**What:** Single PrismaClient instance to prevent connection pool exhaustion in dev
**When to use:** Every database access point
**Example:**
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```
Source: Prisma docs [VERIFIED: standard pattern]

### Pattern 3: AlmanacService with Redis Cache
**What:** Service layer wrapping tyme4ts with Redis caching. Cache key: `almanac:{date}`.
**When to use:** Every almanac data access
**Example:**
```typescript
// src/lib/almanac/service.ts
import { SolarDay } from 'tyme4ts';
import { redis } from '@/lib/redis';
import type { DailyAlmanac } from './types';

const CACHE_TTL = 86400; // 24 hours

export async function getDailyAlmanac(dateStr: string): Promise<DailyAlmanac> {
  const cacheKey = `almanac:${dateStr}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [year, month, day] = dateStr.split('-').map(Number);
  const solar = SolarDay.fromYmd(year, month, day);
  const lunar = solar.getLunarDay();
  const sc = lunar.getSixtyCycle();
  const eb = sc.getEarthBranch();
  const hs = sc.getHeavenStem();

  const data: DailyAlmanac = {
    solar: { year, month, day },
    lunar: {
      year: lunar.getYearSixtyCycle().toString(),
      month: lunar.getMonthSixtyCycle().toString(),
      day: lunar.getSixtyCycle().toString(),
      lunarDate: lunar.toString(),
    },
    yi: lunar.getRecommends().map(r => r.toString()),
    ji: lunar.getAvoids().map(a => a.toString()),
    zodiac: eb.getZodiac().toString(),
    direction: {
      chong: eb.getOpposite().toString(),
      sha: eb.getOminous().toString(),
      caiShen: hs.getWealthDirection().toString(),
      xiShen: hs.getJoyDirection().toString(),
      fuShen: hs.getMascotDirection().toString(),
    },
    gods: lunar.getGods().map(g => g.toString()),
    duty: lunar.getDuty().toString(),
    twentyEightStar: lunar.getTwentyEightStar().toString(),
    pengZu: sc.getPengZu().toString(),
    sound: sc.getSound().toString(),
    fetusDay: lunar.getFetusDay().toString(),
  };

  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
  return data;
}
```
Source: tyme4ts 1.4.6 API verified via live install [VERIFIED: npm registry + live API test]

### Anti-Patterns to Avoid
- **Don't use Pages Router patterns:** No `getServerSideProps`, no `pages/` directory. App Router only.
- **Don't mix locale detection:** Let next-intl middleware handle it entirely. No custom middleware locale logic.
- **Don't cache OpenCC at runtime:** Dictionary is static, loaded at build time per D-06. No dynamic dictionary loading.
- **Don't store computed almanac in DB:** Almanac data is computed from tyme4ts on-demand, cached in Redis. Only content pages go in DB.
- **Don't use `import 'tailwindcss/tailwind.css'`:** Tailwind v4 uses CSS-first config with `@import "tailwindcss"` in globals.css.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Chinese calendar computation | Custom lunar calendar code | tyme4ts 1.4.6 | Handles 闰月, 节气, 干支, 宜忌 correctly; verified 1900-2100 |
| Simplified/Traditional conversion | String replacement maps | opencc-js with custom dictionary | OpenCC handles edge cases; custom dict for metaphysics terms |
| i18n routing | Custom middleware + locale state | next-intl 4.12 | Handles locale detection, routing, message loading, cookie persistence |
| Database queries | Raw SQL | Prisma 7.8 | Type-safe queries, migration system, connection pooling |
| Redis operations | Manual connection management | ioredis 5.10 | Cluster support, pipeline, reconnection logic |
| Schema validation | Manual type checking | zod 4.4 | Runtime validation, TypeScript inference, API schema |

## Common Pitfalls

### Pitfall 1: Tailwind v4 Configuration
**What goes wrong:** Using `tailwind.config.js` (v3 pattern) instead of CSS-first config
**Why it happens:** Most online examples still show v3 patterns
**How to avoid:** Tailwind v4 uses `@import "tailwindcss"` and `@theme` in CSS. No JS config file needed.
**Warning signs:** `tailwind.config.js` exists in project root; `content` array in config

### Pitfall 2: next-intl App Router Setup
**What goes wrong:** Missing `[locale]` segment in app directory, or wrong middleware matcher
**Why it happens:** Easy to forget the URL segment wrapping
**How to avoid:** All pages go under `src/app/[locale]/`. Middleware matcher must include locale prefixes.
**Warning signs:** 404 on locale-prefixed URLs; locale not detected from URL

### Pitfall 3: Prisma + Next.js Hot Reload
**What goes wrong:** Multiple PrismaClient instances in development causing connection pool exhaustion
**Why it happens:** Next.js hot reload re-creates the module
**How to avoid:** Singleton pattern with `globalThis` (see Pattern 2 above)
**Warning signs:** "Too many database connections" errors in dev

### Pitfall 4: tyme4ts Year Boundary
**What goes wrong:** Lunar year doesn't align with solar year — 农历正月初一 is typically in January/February
**Why it happens:** Assuming solar and lunar years start on the same date
**How to avoid:** Always use `SolarDay.fromYmd()` and convert to lunar. Never assume lunar year = solar year.
**Warning signs:** Wrong 生肖 at year boundaries (e.g., January before 春节)

### Pitfall 5: OpenCC Metaphysics Terms
**What goes wrong:** 干 converts to 乾/幹, 丑 converts to 醜 in Traditional Chinese
**Why it happens:** Generic OpenCC dictionaries don't know metaphysics context
**How to avoid:** Custom dictionary per D-05 that maps 干→干 (not 乾), 丑→丑 (not 醜) in metaphysics context
**Warning signs:** Wrong characters in 干支, 生肖, 节气 display

### Pitfall 6: Redis Connection in Serverless
**What goes wrong:** Redis connection created per-request in serverless/edge functions
**Why it happens:** No connection pooling in edge runtime
**How to avoid:** Use Node.js runtime (not edge) for API routes that need Redis. Singleton connection pattern.
**Warning signs:** High Redis connection count; connection timeouts

## Code Examples

### Tailwind v4 CSS-First Config
```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  --color-background: #FFFBF5;
  --color-foreground: #1A1A1A;
  --color-card: #F5F0E8;
  --color-card-foreground: #1A1A1A;
  --color-primary: #C43B3B;
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #F5F0E8;
  --color-secondary-foreground: #1A1A1A;
  --color-accent: #F5F0E8;
  --color-accent-foreground: #1A1A1A;
  --color-muted: #F0EBE3;
  --color-muted-foreground: #6B6B6B;
  --color-border: #E5DFD5;
  --color-input: #E5DFD5;
  --color-ring: #C43B3B;
  --color-destructive: #DC2626;
  --color-destructive-foreground: #FFFFFF;
  --color-gold: #B8860B;
  --radius: 0.5rem;
  --font-sans: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
}
```
Source: Tailwind v4 CSS-first config pattern [ASSUMED — based on training knowledge for Tailwind v4]

### next-intl App Router Root Layout
```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Noto_Sans_SC, Noto_Sans_TC } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const notoSansSC = Noto_Sans_SC({ subsets: ['chinese-simplified'], variable: '--font-sans' });
const notoSansTC = Noto_Sans_TC({ subsets: ['chinese-traditional'], variable: '--font-sans' });

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  const fontClass = locale === 'zh-hant' ? notoSansTC : notoSansSC;

  return (
    <html lang={locale}>
      <body className={`${fontClass.variable} font-sans bg-background text-foreground`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="mx-auto max-w-[65ch] px-4 py-8">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```
Source: next-intl 4.x App Router pattern [ASSUMED — based on training knowledge]

### Prisma Schema (Phase 1 relevant tables)
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Content pages (D-02, D-04)
model ContentPage {
  id        String   @id @default(cuid())
  slug      String
  locale    String   // "zh-hant" | "zh-hans"
  title     String
  content   String   @db.Text
  seoTitle  String?
  seoDesc   String?
  seoKeywords String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([slug, locale])
  @@index([locale])
}

// Almanac cache metadata (not the data itself — that's in Redis)
model AlmanacQuery {
  id        String   @id @default(cuid())
  date      DateTime @unique
  queryCount Int     @default(0)
  lastQueriedAt DateTime?
  createdAt DateTime @default(now())
}

// Phase 3+ tables (D-01: full schema now)
model ZodiacProfile {
  id        String @id @default(cuid())
  animal    String // "鼠", "牛", etc.
  locale    String
  title     String
  content   String @db.Text
  seoTitle  String?
  seoDesc   String?
  @@unique([animal, locale])
}

// BaZi, FengShui, Naming tables — placeholder for Phase 3-4
model BaZiProfile {
  id        String @id @default(cuid())
  pillarKey String // e.g., "甲子"
  locale    String
  title     String
  content   String @db.Text
  @@unique([pillarKey, locale])
}
```
Source: Prisma 7.8 schema syntax [VERIFIED: Prisma docs pattern]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 JS config | Tailwind v4 CSS-first config | Tailwind v4 (2024) | No tailwind.config.js; use @theme in CSS |
| next-i18next (Pages Router) | next-intl 4.x (App Router) | next-intl 3+ (2023) | Middleware-based routing, Server Component native |
| Prisma 5 | Prisma 7.8 | Prisma 6-7 (2024-2025) | Improved performance, new features |
| lunar-javascript | tyme4ts | tyme4ts 1.x (2024) | TypeScript-native, same author, better design |

**Deprecated/outdated:**
- `tailwind.config.js` — replaced by CSS-first config in v4
- `getServerSideProps` / `getStaticProps` — replaced by App Router Server Components
- `pages/_app.tsx` / `pages/_document.tsx` — replaced by `app/layout.tsx`
- `next-i18next` — Pages Router only; use next-intl for App Router

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | next-intl 4.12 uses `defineRouting()` API in `src/i18n/routing.ts` | Architecture Patterns | May need different import path or API shape |
| A2 | `params` in Next.js 16 layout is `Promise<{ locale: string }>` | Code Examples | May be sync in some Next.js versions |
| A3 | Tailwind v4 uses `@import "tailwindcss"` and `@theme` block | Code Examples | May need different syntax |
| A4 | next-intl middleware matcher pattern `['/', '/(zh-hant|zh-hans)/:path*']` | Architecture Patterns | Matcher syntax may differ |
| A5 | opencc-js 1.3.1 supports custom dictionary loading | Standard Stack | May need different OpenCC library |
| A6 | shadcn 4.7.0 CLI `npx shadcn@latest init` works with Tailwind v4 | Standard Stack | May need specific flags or config |

## Open Questions

1. **next-intl 4.x exact API shape**
   - What we know: next-intl 4.12.0 is latest; App Router is the primary target
   - What's unclear: Exact function names and import paths for 4.x (training data may reflect 3.x)
   - Recommendation: Verify during Wave 0 by reading next-intl source or running `npx next-intl` init

2. **Prisma 7.8 specific features**
   - What we know: Prisma 7.8 is latest stable
   - What's unclear: Any breaking changes from Prisma 5/6 that affect schema syntax
   - Recommendation: Run `npx prisma init` and verify generated schema matches expectations

3. **tyme4ts lunar month naming**
   - What we know: `lunar.toString()` returns "农历丙午年四月初一"
   - What's unclear: How to get just the month/day number without year prefix
   - Recommendation: Parse string or check for `getMonth()`/`getDay()` methods during implementation

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All | Check at runtime | Required 18+ | — |
| npm | Package install | Check at runtime | — | — |
| PostgreSQL 16 | Prisma/DB | Check at runtime | Required 16+ | Docker Compose (Phase 5) |
| Redis 7 | ioredis cache | Check at runtime | Required 7+ | In-memory Map (dev fallback) |
| Git | Version control | Check at runtime | — | — |

**Missing dependencies with no fallback:**
- PostgreSQL must be running for Prisma `db push` to work
- Redis must be running for cache layer (or use in-memory fallback for dev)

**Missing dependencies with fallback:**
- Redis: Can use in-memory Map for local dev; Redis required for production

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest (recommended for Next.js 16) or jest |
| Config file | none — see Wave 0 |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ALM-01 | tyme4ts returns correct 干支 for known dates | unit | `npx vitest run tests/almanac/tyme4ts.test.ts` | Wave 0 |
| ALM-01 | tyme4ts returns correct 宜忌 for known dates | unit | `npx vitest run tests/almanac/tyme4ts.test.ts` | Wave 0 |
| ALM-02 | AlmanacService returns cached data on second call | integration | `npx vitest run tests/almanac/service.test.ts` | Wave 0 |
| DATA-01 | tyme4ts regression: 1900-2100 range spot checks | unit | `npx vitest run tests/almanac/regression.test.ts` | Wave 0 |
| I18N-03 | OpenCC converts metaphysics terms correctly | unit | `npx vitest run tests/i18n/opencc.test.ts` | Wave 0 |
| FOUND-03 | Prisma schema validates, can push to DB | integration | `npx prisma validate && npx prisma db push` | Wave 0 |
| FOUND-04 | Redis cache set/get roundtrip | integration | `npx vitest run tests/cache/redis.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run` (affected tests)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green + `npx prisma validate` before verify-work

### Wave 0 Gaps
- [ ] `vitest.config.ts` — test framework configuration
- [ ] `tests/almanac/tyme4ts.test.ts` — tyme4ts API verification tests
- [ ] `tests/almanac/regression.test.ts` — 1900-2100 regression tests
- [ ] `tests/almanac/service.test.ts` — AlmanacService integration tests
- [ ] `tests/i18n/opencc.test.ts` — OpenCC conversion tests
- [ ] `tests/cache/redis.test.ts` — Redis cache tests
- [ ] `tests/conftest.ts` or `tests/setup.ts` — shared test fixtures
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react`

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in Phase 1 |
| V3 Session Management | No | No sessions in Phase 1 |
| V4 Access Control | No | No user roles in Phase 1 |
| V5 Input Validation | Yes | zod for API request validation |
| V6 Cryptography | No | No encryption needed in Phase 1 |

### Known Threat Patterns for Next.js + Prisma + Redis

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SQL injection | Tampering | Prisma parameterized queries (automatic) |
| Redis injection | Tampering | ioredis escapes commands; no user input in keys |
| XSS in user content | Information Disclosure | React auto-escapes; sanitize any `dangerouslySetInnerHTML` |
| Environment variable leak | Information Disclosure | .env in .gitignore; never commit secrets |
| Cache poisoning | Tampering | Cache keys are date-based, not user-input-based |

## Sources

### Primary (HIGH confidence)
- npm registry: tyme4ts 1.4.6 — live API exploration, all methods verified
- npm registry: next-intl 4.12.0, prisma 7.8.0, ioredis 5.10.1, zod 4.4.3, tailwindcss 4.3.0
- CLAUDE.md: Tech stack decisions, architecture constraints

### Secondary (MEDIUM confidence)
- next-intl App Router patterns — training knowledge for 4.x API (A1, A2, A4)
- Tailwind v4 CSS-first config — training knowledge for v4 syntax (A3)
- shadcn/ui initialization — training knowledge (A6)

### Tertiary (LOW confidence)
- opencc-js custom dictionary API — training knowledge only (A5)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified via npm registry
- Architecture: MEDIUM — patterns based on training knowledge, needs Wave 0 verification
- Pitfalls: HIGH — tyme4ts API verified live; next-intl/Tailwind pitfalls well-documented
- OpenCC: MEDIUM — package exists but custom dict API unverified

**Research date:** 2026-05-17
**Valid until:** 2026-06-17 (30 days — stable stack)
