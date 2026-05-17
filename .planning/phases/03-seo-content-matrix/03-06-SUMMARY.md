---
phase: 03-seo-content-matrix
plan: 06
subsystem: seo
tags: [sitemap, metadata, json-ld, smoke, nextjs]

requires:
  - phase: 03-seo-content-matrix
    provides: 03-02 jieri routes, 03-03 zodiac routes, 03-04 tool routes, 03-05 feng shui routes
provides:
  - Locale sitemap route at `/[locale]/sitemap.xml`
  - Metadata coverage tests for canonical, hreflang, x-default, keywords, and Content-Language
  - Structured data coverage tests for WebPage, WebApplication, Article, FAQPage, and BreadcrumbList
  - Phase 3 representative smoke test list and browser smoke verification notes
affects: [seo-routes, sitemap, phase3-completion]

tech-stack:
  added: []
  patterns: [registry-driven-sitemap, centralized-json-ld-coverage, browser-smoke-check]

key-files:
  created:
    - src/app/[locale]/sitemap.ts
    - tests/seo/sitemap.test.ts
    - tests/seo/metadata-coverage.test.ts
    - tests/seo/structured-data-coverage.test.ts
    - tests/seo/phase3-smoke.test.ts
  modified:
    - src/components/tools/BaziForm.tsx
    - src/components/tools/BaziResult.tsx
    - src/app/[locale]/tools/bazi/page.tsx

key-decisions:
  - "Sitemap includes indexed jieri years 2006-2046 only; legal dynamic route access remains 2-5000."
  - "Next metadata sitemap route may call the default export without params, so the handler falls back to zh-hant while preserving hreflang alternates."
  - "Metadata and JSON-LD coverage is tested through centralized helpers and route-source assertions."
  - "Browser smoke checks representative pages at 1440, 375, and 320 widths."

patterns-established:
  - "Sitemap entries are generated from `getSitemapCandidates()` plus the indexed jieri matrix."
  - "Every sitemap entry has `zh-Hans`, `zh-Hant`, and `x-default` alternates."
  - "Tool client widgets receive locale where visible labels need exact Traditional/Simplified output."

requirements-completed: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09]

duration: 31min
completed: 2026-05-17
---

# Phase 03-06: Sitemap and Coverage Summary

**Phase 3 SEO matrix now has registry-driven sitemap output, metadata/JSON-LD coverage tests, and representative browser smoke verification.**

## Performance

- **Duration:** 31 min
- **Started:** 2026-05-17T15:13:00Z
- **Completed:** 2026-05-17T15:44:00Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Added `/[locale]/sitemap.xml` from typed registry candidates and indexed jieri scene/year pages.
- Added sitemap tests for Phase 3 route families, 2006/2046 inclusion, 0/1/5000 exclusion, and hreflang alternates.
- Added metadata coverage tests for canonical URL, `zh-Hans`, `zh-Hant`, `x-default`, keywords, and Content-Language.
- Added structured-data coverage tests for WebPage, WebApplication, Article, FAQPage, BreadcrumbList, and route helper imports.
- Added representative smoke test URL list and manually ran Playwright browser smoke across desktop, 375px, and 320px.

## Task Commits

1. **Task 1: Locale sitemap route from registry** - `89a32ee`
2. **Task 2: Metadata and structured-data coverage tests** - `a9f8e7d`
3. **Task 3: Final smoke coverage and production sitemap hardening** - `2bb8174`

**Plan metadata:** pending summary commit

## Files Created/Modified

- `src/app/[locale]/sitemap.ts` - Next metadata sitemap route.
- `tests/seo/sitemap.test.ts` - Sitemap route and alternates coverage.
- `tests/seo/metadata-coverage.test.ts` - Canonical, hreflang, keyword, and Content-Language coverage.
- `tests/seo/structured-data-coverage.test.ts` - JSON-LD helper and route-source coverage.
- `tests/seo/phase3-smoke.test.ts` - Representative Phase 3 smoke URL list and source checks.
- `src/components/tools/BaziForm.tsx`, `src/components/tools/BaziResult.tsx`, `src/app/[locale]/tools/bazi/page.tsx` - Locale-aware Traditional labels caught during browser smoke.

## Decisions Made

- Kept legal route year support separate from sitemap indexing: `2-5000` remains accepted by route validation, while sitemap lists `2006-2046`.
- Made sitemap default to `zh-hant` when Next invokes the metadata route without params.
- Used Playwright CLI for browser smoke because Playwright is not a project dependency.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Production Route] `/zh-hant/sitemap.xml` returned 500 under `next start`**
- **Found during:** Browser smoke verification
- **Issue:** Next's metadata sitemap loader called the default export without `params`.
- **Fix:** Made the sitemap handler accept optional input and default to `zh-hant`.
- **Files modified:** `src/app/[locale]/sitemap.ts`, `tests/seo/sitemap.test.ts`
- **Verification:** `curl http://127.0.0.1:3100/zh-hant/sitemap.xml` returned 200 XML with alternates.
- **Committed in:** `2bb8174`

**2. [Rule 2 - Visible Locale Copy] Traditional BaZi page showed Simplified form labels**
- **Found during:** Playwright browser smoke at 1440/375/320 widths
- **Issue:** Client form labels were hard-coded Simplified: `精确时间`, `出生地点`, `性别`.
- **Fix:** Passed locale into `BaziForm` and rendered exact Traditional labels for `zh-hant`.
- **Files modified:** `src/components/tools/BaziForm.tsx`, `src/components/tools/BaziResult.tsx`, `src/app/[locale]/tools/bazi/page.tsx`, `tests/seo/phase3-smoke.test.ts`
- **Verification:** Playwright smoke returned `{ ok: true, failures: [], checked: 18 }`.
- **Committed in:** `2bb8174`

---

**Total deviations:** 2 auto-fixed issues.
**Impact on plan:** Strengthens production sitemap behavior and visible i18n correctness.

## Issues Encountered

- Running `npx tsc --noEmit` concurrently with `npm run build` can produce transient `.next/types` missing-file errors because build rewrites `.next`. Re-running `tsc` after build completed exited 0.
- `npm run lint` exits 0 but reports one warning in `src/lib/almanac/year-support.ts` for unused `_referenceDate`.
- Unrelated dirty UI/product files remain in the worktree and were not staged.

## Verification

- `npx vitest run tests/seo/sitemap.test.ts --reporter=verbose` — passed, 4 tests.
- `npx vitest run tests/seo/metadata-coverage.test.ts tests/seo/structured-data-coverage.test.ts --reporter=verbose` — passed, 6 tests.
- `npx vitest run tests/seo/phase3-smoke.test.ts --reporter=verbose` — passed, 3 tests.
- `npm run lint` — exited 0 with 1 warning.
- `npm test` — passed, 21 test files and 267 tests.
- `npx tsc --noEmit --pretty false` — passed when run after build/type generation settled.
- `npm run build` — passed; Next generated 854 static pages.
- `curl http://127.0.0.1:3100/zh-hant/sitemap.xml` — returned 200 XML and contained `zh-Hans` alternate links.
- Playwright browser smoke via CLI — checked jieri, zodiac hub, zodiac article, feng shui article, BaZi tool, and naming tool at 1440/375/320 widths; no failures and no horizontal overflow.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 3 is ready for final phase verification and milestone routing. Later work can build on the SEO content matrix for article expansion, richer tools, and event-history content.

## Self-Check: PASSED

---
*Phase: 03-seo-content-matrix*
*Completed: 2026-05-17*
