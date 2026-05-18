---
phase: 04-ai-integration
plan: 04
subsystem: ui
tags: [jieri, bazi, five-elements, scoring, nextjs]
requires:
  - phase: 04-ai-integration
    provides: Professional BaZi chart data and metaphysics knowledge taxonomy
provides:
  - Personalized auspicious-date scoring service
  - Scene-specific participant role requirements
  - Locale-aware `/tools/jieri-recommend` route
  - Interactive recommendation form and explainable result cards
  - Annual jieri page CTA into personalized recommendations
affects: [jieri, bazi, sitemap, knowledge]
tech-stack:
  added: []
  patterns: [deterministic local scoring, explainable score dimensions, scene-role driven forms]
key-files:
  created:
    - src/lib/almanac/auspicious-scoring.ts
    - src/components/jieri/AuspiciousRecommendationForm.tsx
    - src/components/jieri/AuspiciousRecommendationResult.tsx
    - src/components/jieri/ScoreBreakdown.tsx
    - src/app/[locale]/tools/jieri-recommend/page.tsx
    - tests/almanac/auspicious-scoring.test.ts
    - tests/seo/jieri-recommend-route.test.ts
  modified:
    - src/lib/almanac/types.ts
    - src/lib/almanac/auspicious.ts
    - src/lib/content/jieri-scenes.ts
    - src/lib/content/tools.ts
    - src/lib/content/types.ts
    - src/components/jieri/JieriScenePage.tsx
    - tests/almanac/auspicious.test.ts
    - tests/seo/sitemap.test.ts
key-decisions:
  - "Kept the recommendation engine deterministic and local; no AI route, persistence, provider registry, or account flow was added."
  - "Scoring uses fixed transparent dimensions: almanac 30, scene 20, zodiac 20, BaZi/five-elements 20, lucky hours 10."
  - "Scene configs own required participant roles so the UI and scoring validator share one source of truth."
patterns-established:
  - "Jieri recommendation flows derive role fields from `JieriSceneRule.personRoles`."
  - "Score results expose every dimension with `score`, `maxScore`, `reasons`, and `cautions`."
  - "Existing SEO list pages link into the interactive tool without replacing annual server-rendered content."
requirements-completed: [META-02, META-04]
duration: 36min
completed: 2026-05-18
---

# Phase 04: Personalized Auspicious Recommendation Summary

**Scene-aware auspicious-date recommendations with participant inputs, BaZi/five-element scoring, and explainable result cards**

## Performance

- **Duration:** 36 min
- **Started:** 2026-05-18T06:49:00Z
- **Completed:** 2026-05-18T07:25:46Z
- **Tasks:** 4
- **Files modified:** 15

## Accomplishments

- Added scene-specific role config for marriage, matching, moving, opening, signing, and general jieri scenes.
- Built `scoreAuspiciousDateRange` and `scoreAuspiciousDate` with deterministic ranking and five explainable dimensions.
- Added `/tools/jieri-recommend` with a client flow for scene selection, participant birth data, date range, and ranked results.
- Linked annual jieri scene pages into the recommendation flow while preserving their SEO list behavior.

## Task Commits

Inline execution produced one combined production commit covering all four plan tasks:

1. **Tasks 1-4: Role config, scoring service, recommendation route, UI, links, and tests** - `df02b37` (`feat(04-04)`)

## Files Created/Modified

- `src/lib/almanac/auspicious-scoring.ts` - Deterministic recommendation scorer with range validation and five score dimensions.
- `src/lib/almanac/types.ts` - Adds auspicious recommendation role, input, dimension, and result types.
- `src/lib/almanac/auspicious.ts` - Exports `buildDailyAlmanac` for scoring reuse.
- `src/lib/content/jieri-scenes.ts` - Adds `personRoles` and a shared recommendation link.
- `src/lib/content/tools.ts` - Registers the recommendation tool content, FAQ, and related links.
- `src/lib/content/types.ts` - Adds the `jieri-recommend` tool key.
- `src/components/jieri/AuspiciousRecommendationForm.tsx` - Client-side scene, participant, and date-range form.
- `src/components/jieri/AuspiciousRecommendationResult.tsx` - Ranked result cards with reasons, cautions, lucky hours, and day links.
- `src/components/jieri/ScoreBreakdown.tsx` - Dimension score bars and compact explanations.
- `src/components/jieri/JieriScenePage.tsx` - Adds CTA into the personalized recommendation tool.
- `src/app/[locale]/tools/jieri-recommend/page.tsx` - Locale-aware WebApplication route with metadata and JSON-LD.
- `tests/almanac/auspicious-scoring.test.ts` - Covers role config, scoring dimensions, ranking, and validation.
- `tests/almanac/auspicious.test.ts` - Updates fixture for scene roles.
- `tests/seo/jieri-recommend-route.test.ts` - Guards route, UI source contracts, registry, and sitemap behavior.
- `tests/seo/sitemap.test.ts` - Adds localized sitemap assertions for the recommendation tool.

## Decisions Made

- Kept all scoring in the local deterministic layer because the user explicitly deferred AI work.
- Used the existing `calculateBazi` professional element-strength model for first-version BaZi/five-element fit.
- Returned cautious explanatory copy rather than deterministic outcome claims.

## Deviations from Plan

None - plan executed as written, with one combined commit for the inline execution batch.

## Issues Encountered

- Several target files had unrelated unstaged edits before this plan. Only 04-04 hunks were staged for the production commit.

## Verification

- `npx vitest run tests/almanac/auspicious-scoring.test.ts --reporter=verbose` - passed.
- `npx vitest run tests/almanac/auspicious-scoring.test.ts tests/almanac/auspicious.test.ts tests/seo/jieri-recommend-route.test.ts tests/seo/jieri-routes.test.ts tests/seo/sitemap.test.ts --reporter=verbose` - passed, 23 tests.
- `npx tsc --noEmit` - passed.
- `npm run build` - passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 4 deterministic metaphysics foundation is ready for full phase verification. AI provider work remains explicitly deferred.

## Self-Check: PASSED

---
*Phase: 04-ai-integration*
*Completed: 2026-05-18*
