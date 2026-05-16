---
phase: 01-foundation-data-layer
plan: 03
subsystem: i18n-data
tags: [opencc, tyme4ts, metaphysics, i18n, testing, regression]

# Dependency graph
requires:
  - "01-01 (project scaffold, i18n, layout shell)"
  - "01-02 (data layer, AlmanacService, tyme4ts integration)"
provides:
  - "OpenCC conversion with custom metaphysics dictionary"
  - "convertToTraditional/convertToSimplified/convertMetaphysics functions"
  - "Comprehensive tyme4ts regression test suite (1900-2100)"
  - "AlmanacService integration tests with mocked Redis"
affects: [02-core-almanac-ui, 03-seo-matrix]

# Tech tracking
tech-stack:
  added: [opencc-js (CustomConverter)]
  patterns: [opencc-post-processing-correction, redis-mock-for-testing]

key-files:
  created:
    - "src/lib/opencc.ts — OpenCC conversion with metaphysics term protection"
    - "src/dictionaries/metaphysics-zh-hans.json — Custom metaphysics dictionary (47 entries)"
    - "tests/setup.ts — Shared test setup"
    - "tests/i18n/opencc.test.ts — OpenCC conversion accuracy tests (97 tests)"
    - "tests/almanac/tyme4ts.test.ts — tyme4ts API verification tests (20 tests)"
    - "tests/almanac/regression.test.ts — 1900-2100 regression spot checks (66 tests)"
    - "tests/almanac/service.test.ts — AlmanacService integration tests (5 tests)"
  modified: []

key-decisions:
  - "Used opencc-js CustomConverter for post-processing corrections instead of trying to override dictionary entries"
  - "Dictionary focuses on terms that actually DIFFER between Simplified and Traditional (47 entries, not 100+) — most metaphysics terms are identical in both character sets"
  - "Blanket 醜→丑 replacement acceptable for metaphysics domain (丑陋/ugly unlikely in almanac content)"
  - "Zodiac boundary follows 立春 (solar term), not 正月初一 (lunar new year) — verified via tyme4ts API"
  - "Service tests mock Redis at module level with shared store, cleared in beforeEach"
  - "Regression tests use 立春-aware expected year pillar calculation"

patterns-established:
  - "OpenCC post-processing: standard Converter + CustomConverter chain for domain-specific corrections"
  - "Redis mock pattern for AlmanacService: module-level store with vi.mock factory"

requirements-completed: [I18N-03, DATA-01]

# Metrics
duration: 7min
completed: 2026-05-17
---

# Phase 1 Plan 03: OpenCC Metaphysics Dictionary + tyme4ts Regression Tests Summary

**Custom OpenCC metaphysics dictionary (47 entries) with post-processing correction pipeline for domain-specific Simplified/Traditional Chinese conversion, plus comprehensive tyme4ts regression test suite verifying almanac accuracy across 1900-2100 range (188 tests total)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-16T17:38:22Z
- **Completed:** 2026-05-16T17:45:48Z
- **Tasks:** 2
- **Files created:** 7

## Accomplishments

- OpenCC metaphysics dictionary covering 地支, 生肖, 节气, 神煞, 十二值神, 二十八星宿, 十二月将 (47 entries)
- `convertToTraditional`/`convertToSimplified` with post-processing corrections using opencc-js `CustomConverter`
- `convertMetaphysics` for direct term lookup via dictionary
- Protection for critical metaphysics terms: 丑→丑 (not 醜), 神后→神后 (not 神後), 干→干 (not 乾/幹)
- 97 OpenCC conversion tests covering all term categories
- 20 tyme4ts API verification tests against known reference dates
- 66 regression spot checks across 1900-2100 at 10-year intervals
- 5 AlmanacService integration tests with mocked Redis cache verification
- Verified zodiac boundary follows 立春 (not Jan 1 or 正月初一)

## Task Commits

Each task was committed atomically:

1. **Task 1: OpenCC metaphysics dictionary + conversion implementation** - `10bec20` (feat)
2. **Task 2: tyme4ts regression tests + integration verification** - `5e0010d` (test)

## Files Created

- `src/lib/opencc.ts` — OpenCC conversion with metaphysics term protection
- `src/dictionaries/metaphysics-zh-hans.json` — Custom metaphysics dictionary (47 entries)
- `tests/setup.ts` — Shared test setup
- `tests/i18n/opencc.test.ts` — OpenCC conversion accuracy tests (97 tests)
- `tests/almanac/tyme4ts.test.ts` — tyme4ts API verification tests (20 tests)
- `tests/almanac/regression.test.ts` — 1900-2100 regression spot checks (66 tests)
- `tests/almanac/service.test.ts` — AlmanacService integration tests (5 tests)

## Decisions Made

- Used opencc-js `CustomConverter` for post-processing corrections — cleaner than trying to override individual dictionary entries
- Dictionary has 47 entries (not 100+) because most metaphysics terms are identical in Simplified and Traditional Chinese; dictionary only maps terms that DIFFER
- Blanket 醜→丑 replacement is acceptable for the metaphysics domain since "丑陋" (ugly) is unlikely to appear in almanac content
- Zodiac boundary follows 立春 (Start of Spring solar term), verified via tyme4ts `getYearSixtyCycle()` API
- Service tests use module-level Redis mock with `vi.mock` factory and shared store, cleared between tests

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Regression test expected year pillar calculation wrong for 1900-01-01**
- **Found during:** Task 2 (regression test execution)
- **Issue:** `expectedYearPillar` function used `(year - 1900) % 60` which produced negative modulo for year 1899 (used as previous year reference). Also, the function didn't account for 立春 boundary — year pillar changes at ~Feb 4, not Jan 1.
- **Fix:** Added `month` parameter to `expectedYearPillar`, use `effectiveYear = month <= 2 ? year - 1 : year`, and `((offset) % 60 + 60) % 60` for positive modulo
- **Files modified:** tests/almanac/regression.test.ts
- **Committed in:** 5e0010d (Task 2 commit)

**2. [Rule 1 - Bug] Service test cache assertion failed due to shared store between tests**
- **Found during:** Task 2 (service test execution)
- **Issue:** Mock Redis store was shared across tests. First test populated cache, so second test got a cache hit and `setex` was never called.
- **Fix:** Moved store to module level, added `store.clear()` in `beforeEach`
- **Files modified:** tests/almanac/service.test.ts
- **Committed in:** 5e0010d (Task 2 commit)

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Minor test fixes. No scope creep.

## Known Stubs

None — all implementations are complete and functional.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| *(none)* | | |

## Self-Check

- All 7 key files verified present
- Both task commits verified in git log (10bec20, 5e0010d)
- Full test suite: 188 tests pass, 0 failures
- `npx vitest run` exits 0

## Self-Check: PASSED

---

*Phase: 01-foundation-data-layer*
*Completed: 2026-05-17*
