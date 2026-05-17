---
phase: 03-seo-content-matrix
plan: 02
subsystem: seo
tags: [jieri, ssg, almanac, json-ld, nextjs]

requires:
  - phase: 03-seo-content-matrix
    provides: 03-01 shared content registry, year support, SEO helpers, and SEO UI components
provides:
  - Auspicious day scene matching with visible downgrade reasons
  - `/[locale]/jieri` scene directory
  - `/[locale]/jieri/[scene]/[year]` annual scene pages
  - SSG params for 2006-2046 and dynamic validation for 2-5000
  - Jieri route metadata, FAQ, breadcrumbs, and JSON-LD
affects: [03-06-sitemap, jieri, almanac-service, seo-routes]

tech-stack:
  added: []
  patterns: [annual-scene-ssg, visible-caution-downgrade, typed-scene-rules]

key-files:
  created:
    - src/lib/almanac/auspicious.ts
    - src/app/[locale]/jieri/page.tsx
    - src/app/[locale]/jieri/[scene]/[year]/page.tsx
    - src/components/jieri/JieriScenePage.tsx
    - src/components/jieri/JieriFilterPanel.tsx
    - src/components/jieri/JieriMonthSection.tsx
    - src/components/jieri/JieriDateRow.tsx
    - tests/almanac/auspicious.test.ts
    - tests/seo/jieri-routes.test.ts
  modified:
    - src/lib/almanac/service.ts
    - src/lib/almanac/types.ts
    - src/lib/content/jieri-scenes.ts
    - tests/almanac/service.test.ts

key-decisions:
  - "Auspicious matching uses scene yi terms as the inclusion rule."
  - "Ominous matching days stay visible and are downgraded to caution/not-preferred."
  - "Annual jieri pages use SSG only for 2006-2046 while accepting dynamic legal years 2-5000."

patterns-established:
  - "AuspiciousDayResult carries status, yi matches, and explicit reasons for UI rendering."
  - "Route modules validate scene/year before almanac computation."
  - "Jieri UI groups annual results by month with compact rows and filter rails."

requirements-completed: [SEO-01, SEO-02, SEO-07, SEO-08, SEO-09]

duration: 12min
completed: 2026-05-17
---

# Phase 03-02: Jieri Matrix Summary

**Annual auspicious-day pages now render from typed scene rules with SSG year windows, route validation, downgrade reasons, and SEO metadata.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-17T13:54:48Z
- **Completed:** 2026-05-17T14:06:03Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments

- Added deterministic jieri matching by scene yi terms with zodiac conflict and ominous-day downgrade reasons.
- Added `/jieri` directory and `/jieri/{scene}/{year}` pages with metadata, FAQ, breadcrumbs, and JSON-LD.
- Added responsive jieri UI components: filter panel, month sections, date rows, metrics, FAQ, and related links.
- Enriched almanac service data so jieri pages can use year zodiac, day zodiac, daily fortune, and monthly yi/ji metadata consistently.

## Task Commits

1. **Task 1 support: Almanac data enrichment** - `c8404c5`
2. **Task 1: Auspicious day service and tests** - `6eb0fcb`
3. **Tasks 2-3: Jieri routes and UI** - `7650f38`

**Plan metadata:** pending summary commit

## Files Created/Modified

- `src/lib/almanac/auspicious.ts` - Scene yi matching, downgrade status, zodiac conflict logic, and annual result generation.
- `src/app/[locale]/jieri/page.tsx` - Scene directory page.
- `src/app/[locale]/jieri/[scene]/[year]/page.tsx` - Dynamic annual scene route with static params and validation.
- `src/components/jieri/*` - Annual page UI with filters, monthly grouping, compact date rows, and right rail.
- `tests/almanac/auspicious.test.ts`, `tests/seo/jieri-routes.test.ts` - Matching and route contract coverage.

## Decisions Made

- `getAuspiciousDaysForScene` generates annual results from tyme4ts directly instead of calling cached daily service repeatedly.
- The route rejects invalid scene slugs and years outside `2-5000`, while static params include only `2006-2046`.
- `DailyAlmanac.zodiac` is now year zodiac; `dayZodiac` carries day-branch zodiac for conflict context.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Almanac service lacked fields needed by jieri matching**
- **Found during:** Task 1
- **Issue:** Jieri downgrade UI needs daily fortune, year zodiac, day zodiac, and monthly yi/ji metadata. Some of this existed in the dirty worktree but was not committed.
- **Fix:** Formalized these fields in `DailyAlmanac`/`CalendarDay`, added cache completeness checks, and added service tests.
- **Files modified:** `src/lib/almanac/service.ts`, `src/lib/almanac/types.ts`, `tests/almanac/service.test.ts`
- **Verification:** `npm test -- tests/almanac/auspicious.test.ts tests/seo/jieri-routes.test.ts tests/almanac/service.test.ts`
- **Committed in:** `c8404c5`

---

**Total deviations:** 1 auto-fixed (missing service support).
**Impact on plan:** Required for 03-02 correctness; no route or sitemap scope expansion.

## Issues Encountered

- `tests/seo/jieri-routes.test.ts` initially imported Next/next-intl navigation through the page tree and failed in Vitest Node resolution. The test now mocks Next navigation and the UI component, then verifies route exports, source contracts, and metadata.
- Unrelated dirty product/UI files remain in the worktree and were not committed.

## Verification

- `npx vitest run tests/almanac/auspicious.test.ts --reporter=verbose` — passed, 6 tests.
- `npx vitest run tests/seo/jieri-routes.test.ts --reporter=verbose` — passed, 4 tests.
- `npm test -- tests/almanac/auspicious.test.ts tests/seo/jieri-routes.test.ts` — passed, 10 tests.
- `npm test -- tests/almanac/auspicious.test.ts tests/seo/jieri-routes.test.ts tests/almanac/service.test.ts` — passed, 20 tests.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed; Next generated 752 static pages.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plans 03-03 through 03-05 can build their page families on the shared SEO helpers and content registry. Plan 03-06 should include the jieri static matrix in the sitemap for 2006-2046 only.

## Self-Check: PASSED

---
*Phase: 03-seo-content-matrix*
*Completed: 2026-05-17*

