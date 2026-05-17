# Phase 03 — Pattern Map

**Phase:** SEO Content Matrix  
**Created:** 2026-05-17  
**Source:** CONTEXT.md + RESEARCH.md + UI-SPEC.md + current codebase

## Purpose

Phase 3 should extend the existing almanac product instead of introducing a parallel SEO stack. The closest existing patterns are the Phase 2 App Router pages, `AlmanacService`, localized metadata helpers, OpenCC conversion, and compact shadcn/Tailwind page sections.

## Existing Patterns To Reuse

| New Capability | Closest Existing Analog | Reuse Guidance |
|----------------|-------------------------|----------------|
| Localized metadata, canonical, hreflang, Content-Language | `src/lib/seo.ts` | Extend helper functions here or in a nearby SEO module; do not duplicate metadata assembly in each route. |
| Daily almanac computation | `src/lib/almanac/service.ts` | Keep deterministic tyme4ts-backed utilities in `src/lib/almanac`; add scene/year/BaZi helpers near the service layer. |
| Almanac data types | `src/lib/almanac/types.ts` | Extend with typed result objects such as auspicious-day matches, BaZi pillars, element counts, and route-year support reports. |
| Simplified canonical content with Traditional rendering | `src/lib/opencc.ts` | Use `convertToTraditional` for longer body/tool copy; keep locale-specific SEO title/description/H1 fields where needed. |
| App Router page structure | `src/app/[locale]/page.tsx`, `calendar/page.tsx`, `solar-terms/page.tsx`, `almanac/[date]/page.tsx` | Server Components by default; call `setRequestLocale`; implement `generateMetadata`; inject JSON-LD in initial HTML. |
| Locale navigation | `src/i18n/navigation.ts`, `src/i18n/routing.ts`, `src/i18n/locale-path.ts` | Use locale-aware `Link` and shared path helpers for alternates and sitemap URLs. |
| Header/navigation | `src/components/layout/NavigationLinks.tsx` | Add Phase 3 entrances without overcrowding desktop header; keep icon+text desktop links and mobile menu pattern. |
| Date search form | `src/components/almanac/DateSearchForm.tsx` | Copy the client-island form pattern for BaZi and naming tools, but keep route pages server-rendered. |
| Fortune badges and yi/ji rendering | `FortuneMarker`, `YiJiBadgeList`, `TodayAlmanacCard` | Reuse red/gold/slate fortune semantics for auspicious/caution/ominous states. |
| Dense content page visuals | `SolarTermsList`, `MonthlyCalendar`, `AlmanacDetail` | Build compact rows, chips, accordions, and rails; avoid pure data tables as the primary experience. |
| Theme and motion utilities | `src/styles/globals.css` | Reuse `font-serif-display`, `almanac-grid`, `shimmer-panel`, `fortune-seal`; preserve green as structure and red/gold/slate as state colors. |
| Tests | `tests/almanac/*.test.ts`, `tests/i18n/*.test.ts` | Add `tests/seo`, `tests/almanac`, and `tests/tools` coverage using Vitest. |

## Recommended New Structure

```text
src/lib/content/
  types.ts                  # shared SEO/content registry types
  localize.ts               # locale body-copy helpers using OpenCC
  registry.ts               # typed indexable route registry
  jieri-scenes.ts           # auspicious day scenes and FAQ/content
  zodiac.ts                 # 12 zodiac hubs + article metadata/copy
  feng-shui.ts              # category/articles/checklists
  tools.ts                  # BaZi/naming tool SEO content

src/lib/almanac/
  year-support.ts           # legal route year vs computation support probes
  auspicious.ts             # scene-to-yi matching, downgrade reasons
  bazi.ts                   # four-pillar and five-element utilities

src/lib/tools/
  china-cities.ts           # MVP city/province longitude dataset
  naming.ts                 # character five-element and naming score utilities

src/components/seo/
  SeoPageShell.tsx
  SeoHero.tsx
  FaqBlock.tsx
  InternalLinkGrid.tsx
  ArticleLayout.tsx

src/components/jieri/
src/components/zodiac/
src/components/tools/
src/components/feng-shui/
```

## Route Patterns

| Page Family | Route Pattern | Rendering Notes |
|-------------|---------------|-----------------|
| Auspicious day index | `/[locale]/jieri` | Server-rendered scene directory with tool entrances. |
| Auspicious day year | `/[locale]/jieri/[scene]/[year]` | SSG for 2006-2046 via `generateStaticParams`; dynamic route validates legal 2-5000. |
| Zodiac index | `/[locale]/zodiac` | 12-animal directory and internal links. |
| Zodiac hub | `/[locale]/zodiac/[animal]` | SSG for both locales; hub content plus related article links. |
| Zodiac article | `/[locale]/zodiac/[animal]/[slug]` | Static article pages with FAQ and breadcrumbs. |
| BaZi tool | `/[locale]/tools/bazi` | Server page plus isolated client form/result widget. |
| Naming tool | `/[locale]/tools/naming` | Server page plus isolated client form/result widget. |
| Feng Shui index | `/[locale]/feng-shui` | Category landing with article groups. |
| Feng Shui article | `/[locale]/feng-shui/[category]/[slug]` | Static article pages with practical checklist and tool links. |
| Sitemap | `/[locale]/sitemap.xml` | Hand-written Next metadata route consuming the typed registry. |

## Risk Notes For Planning

- Year legality and computation support must be separated. Route validation targets year `2-5000`; tyme4ts failed smoke tests for year `0` and `1`, so execution must keep those years rejected while retaining probes as regression evidence.
- The indexed sitemap year window is current year ±20. With current date `2026-05-17`, the concrete SSG/sitemap range is `2006-2046`.
- Content must not be embedded as large route-file strings. Use typed static registries that can later seed Prisma models.
- Articles must be source-synthesized, natural Chinese editorial copy with visible FAQs and internal links. Avoid raw copied source text and generic AI filler.
- Tool pages must keep SEO content server-rendered. Only the interactive form/result widgets should be client components.

## Verification Patterns

Use these concrete checks in PLAN tasks:

- `npm test` for registry, year support, matching, BaZi, naming, and sitemap helpers.
- `npx tsc --noEmit` after shared type and page route work.
- `npm run build` after each route-family plan and before final verification.
- Playwright/browser smoke for representative pages at desktop and mobile: `/jieri/jiehun/2026`, `/zodiac/rat`, one zodiac article, one Feng Shui article, `/tools/bazi`, `/tools/naming`, and `/zh-hant/sitemap.xml`.
