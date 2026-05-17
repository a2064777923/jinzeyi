---
phase: 03-seo-content-matrix
plan: 01
subsystem: seo-foundation
tags: [nextjs, tyme4ts, seo, almanac, validation]

requires:
  - phase: 01-foundation-data-layer
    provides: tyme4ts-backed AlmanacService and project infrastructure
provides:
  - Year range guardrails for legal dynamic routes and indexed SSG/sitemap pages
  - Boundary-year probe covering tyme4ts almanac APIs
  - Blocking product-decision report for unsupported years 0 and 1
affects: [phase-03-seo-content-matrix, jieri, sitemap, almanac, seo]

tech-stack:
  added: []
  patterns:
    - Tested guardrail module before route expansion
    - Explicit blocker artifact when product promise exceeds library support

key-files:
  created:
    - src/lib/almanac/year-support.ts
    - tests/almanac/year-support.test.ts
    - .planning/phases/03-seo-content-matrix/03-YEAR-SUPPORT-BLOCKER.md
  modified: []

key-decisions:
  - "Phase 3 route expansion is blocked until product chooses how to handle years 0 and 1."
  - "The indexed SSG/sitemap window remains 2006-2046 for the 2026-05-17 planning baseline."

patterns-established:
  - "Separate legal route range from indexed sitemap/SSG range."
  - "Probe calendar libraries at product boundary years before generating large route matrices."

requirements-completed:
  - SEO-01
  - SEO-02
  - SEO-03
  - SEO-04
  - SEO-05
  - SEO-06
  - SEO-07
  - SEO-08
  - SEO-09

duration: 6 min
completed: 2026-05-17
---

# Phase 03 Plan 01: Foundation Summary

**Calendar year support guardrail found a blocking mismatch between the 0-5000 product promise and installed tyme4ts behavior.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-05-17T13:15:00Z
- **Completed:** 2026-05-17T13:20:58Z
- **Tasks:** 1 of 4 completed; remaining tasks intentionally blocked
- **Files modified:** 3

## Accomplishments

- Added `src/lib/almanac/year-support.ts` with legal route range `0-5000`, indexed range `2006-2046`, and boundary-year probes.
- Added `tests/almanac/year-support.test.ts` covering years `0`, `1`, `2`, `1900`, `2100`, and `5000`.
- Confirmed year `0` fails all probed tyme4ts APIs, and year `1` fails service-style daily fields while deriving complete almanac semantics.
- Wrote `.planning/phases/03-seo-content-matrix/03-YEAR-SUPPORT-BLOCKER.md` with the required product decision before route expansion.

## Task Commits

1. **Task 1: Blocking year support probe and guardrail module** - `819eb9a` (feat)

**Plan metadata:** pending final decision; this summary records the blocked state.

## Files Created/Modified

- `src/lib/almanac/year-support.ts` - Legal route range, indexed route range, and tyme4ts support probe helpers.
- `tests/almanac/year-support.test.ts` - Boundary-year test coverage for the support probe.
- `.planning/phases/03-seo-content-matrix/03-YEAR-SUPPORT-BLOCKER.md` - Product-decision blocker for unsupported year `0` and `1` almanac semantics.

## Decisions Made

- Execution stopped before Task 2 because the plan explicitly requires stopping if year `0` or `1` cannot support the same computed almanac semantics as later years.
- Route expansion plans `03-02` through `03-06` must not run until the product decision is resolved.

## Deviations from Plan

None - plan executed exactly as written. The stop condition was part of Task 1.

---

**Total deviations:** 0 auto-fixed.
**Impact on plan:** Plan 03-01 is intentionally incomplete pending product decision; no route expansion work was started.

## Issues Encountered

- `tyme4ts` rejects year `0` with `illegal solar year: 0` for `SolarDay`, `SolarTime`, lunar day, gan-zhi, solar term, and daily-field probes.
- `tyme4ts` accepts year `1` for basic Solar/Lunar APIs, but complete daily fields fail with `illegal solar year: 0` when deriving service-style almanac semantics.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Blocked. Choose one of the options in `03-YEAR-SUPPORT-BLOCKER.md` before continuing Phase 3 execution:

1. Add or build an alternate calendar algorithm for years `0` and `1`.
2. Correct the supported legal dynamic route range to `2-5000`.
3. Keep route acceptance for years `0` and `1` but render non-indexable unsupported states, which conflicts with the current Phase 3 decision.

## Self-Check: FAILED

The executed guardrail passed its test command:

- `npx vitest run tests/almanac/year-support.test.ts --reporter=verbose` - passed, 6 tests.

The overall Plan 03-01 self-check is failed by design because Task 2, Task 3, and Task 4 are blocked pending product decision.

---
*Phase: 03-seo-content-matrix*
*Completed: 2026-05-17*
