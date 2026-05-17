---
phase: 03-seo-content-matrix
plan: 04
subsystem: seo
tags: [tools, bazi, naming, web-application, nextjs]

requires:
  - phase: 03-seo-content-matrix
    provides: 03-01 shared content registry, SEO helpers, and SEO UI components
provides:
  - BaZi calculation utility with China city true solar time correction
  - Naming five-element utility with score, explanation, and suggestions
  - `/[locale]/tools`, `/[locale]/tools/bazi`, and `/[locale]/tools/naming`
  - SEO-rendered tool pages with client-only form/result widgets
affects: [03-06-sitemap, tools, seo-routes]

tech-stack:
  added: []
  patterns: [server-rendered-tool-page, isolated-client-widget, zod-validated-utility]

key-files:
  created:
    - src/lib/almanac/bazi.ts
    - src/lib/tools/china-cities.ts
    - src/lib/tools/naming.ts
    - src/components/tools/BaziForm.tsx
    - src/components/tools/BaziResult.tsx
    - src/components/tools/NamingForm.tsx
    - src/components/tools/NamingResult.tsx
    - src/app/[locale]/tools/page.tsx
    - src/app/[locale]/tools/bazi/page.tsx
    - src/app/[locale]/tools/naming/page.tsx
    - tests/almanac/bazi.test.ts
    - tests/tools/naming.test.ts
  modified: []

key-decisions:
  - "BaZi tool enforces the product's formal legal year range of 2-5000."
  - "True solar time uses China city longitude correction from the UTC+8 standard meridian at 120E."
  - "Naming analysis remains independent of BaZi useful-god data in Phase 3."
  - "Tool routes render SEO body, FAQ, internal links, and JSON-LD server-side; only input/result widgets are client components."

patterns-established:
  - "Utility modules return typed result objects that client widgets can render without route-specific coupling."
  - "Tool pages use WebApplication JSON-LD plus FAQ and breadcrumb structured data."
  - "Interactive result panels keep stable grid dimensions across desktop and narrow mobile widths."

requirements-completed: [SEO-04, SEO-06, SEO-08, SEO-09]

duration: 24min
completed: 2026-05-17
---

# Phase 03-04: Tools Slice Summary

**八字排盤與姓名五行工具已上線為 SEO-rendered route family，互動表單隔離在 client widgets。**

## Performance

- **Duration:** 24 min
- **Started:** 2026-05-17T14:26:00Z
- **Completed:** 2026-05-17T14:50:00Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- Added `calculateBazi` with four pillars, heavenly stems/earthly branches, five-element distribution, China city true solar time correction, birthplace, and gender.
- Added `analyzeName` with per-character five-element lookup, unknown-character handling, score, auspicious flag, explanation, and suggestion chips.
- Added `/tools`, `/tools/bazi`, and `/tools/naming` pages with metadata, WebApplication/WebPage JSON-LD, FAQ, breadcrumbs, body copy, and internal links.
- Added accessible client forms for birth date, precise time, birthplace, gender, surname, and given name.

## Task Commits

1. **Task 1: BaZi utility, true solar time dataset, and tests** - `b4c7bd2`, `ba20774`
2. **Task 2: Naming utility and tests** - `b8c733e`
3. **Task 3: Tool pages, client widgets, metadata, and JSON-LD** - `0edbea8`

**Plan metadata:** pending summary commit

## Files Created/Modified

- `src/lib/almanac/bazi.ts` - BaZi input validation, city lookup, true solar time correction, four-pillar output, and five-element counts.
- `src/lib/tools/china-cities.ts` - Compact China city/province longitude dataset.
- `src/lib/tools/naming.ts` - Character five-element dictionary, score logic, explanations, and suggestions.
- `src/components/tools/*` - BaZi and naming client form/result widgets.
- `src/app/[locale]/tools/*` - Tool directory and individual tool routes.
- `tests/almanac/bazi.test.ts`, `tests/tools/naming.test.ts` - Utility coverage.

## Decisions Made

- Year input follows formal support `2-5000`; year 1 and 5001 are rejected.
- Used a safe UTC date construction path so years `0002-0099` are not remapped by JavaScript Date to the 1900s.
- Kept naming scoring intentionally modest and explanatory, not deterministic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Boundary] JavaScript Date remaps years 0-99 when constructed through `Date.UTC(year, ...)`**
- **Found during:** Task 1 follow-up before route work
- **Issue:** `0002-01-01` could silently become 1902 if passed directly as the year argument.
- **Fix:** Added a safe UTC date helper using `setUTCFullYear`, plus tests for year 0002 and legal year rejection.
- **Files modified:** `src/lib/almanac/bazi.ts`, `tests/almanac/bazi.test.ts`
- **Verification:** `npx vitest run tests/almanac/bazi.test.ts --reporter=verbose`
- **Committed in:** `ba20774`

---

**Total deviations:** 1 auto-fixed boundary issue.
**Impact on plan:** Strengthens the user's requested `2-5000` support and prevents early-year miscalculation.

## Issues Encountered

- The worktree still contains unrelated dirty UI/product changes from earlier work. The 03-04 commits staged only tool utility, route, component, and test files.

## Verification

- `npx vitest run tests/almanac/bazi.test.ts --reporter=verbose` — passed, 6 tests.
- `npx vitest run tests/tools/naming.test.ts --reporter=verbose` — passed, 4 tests.
- `npm test -- tests/almanac/bazi.test.ts tests/tools/naming.test.ts` — passed, 10 tests.
- `npx tsc --noEmit --pretty false` — passed.
- `npm run build` — passed; Next generated 832 static pages, including the tools route family.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 03-05 can link feng shui articles into `/tools/bazi` and `/tools/naming`. Plan 03-06 should include the tool routes in sitemap and structured-data coverage.

## Self-Check: PASSED

---
*Phase: 03-seo-content-matrix*
*Completed: 2026-05-17*
