---
phase: 03-seo-content-matrix
plan: 01
subsystem: seo
tags: [nextjs, seo, json-ld, content-registry, i18n, shadcn]

requires:
  - phase: 02-core-almanac-ui
    provides: existing almanac UI, locale routing, metadata patterns, and tyme4ts services
provides:
  - Phase 3 legal route year guardrails for 2-5000 with 2006-2046 indexed window
  - Typed static content registry for core, jieri, zodiac, feng shui, and tool page families
  - Centralized page metadata and JSON-LD helpers
  - Shared SEO page shell, hero, FAQ, internal-link, and article layout components
  - Phase 3 navigation entrances
affects: [03-seo-content-matrix, seo-routes, sitemap, metadata, navigation]

tech-stack:
  added: []
  patterns: [typed-static-content-registry, localized-seo-pair, centralized-json-ld, server-first-seo-components]

key-files:
  created:
    - src/lib/content/types.ts
    - src/lib/content/localize.ts
    - src/lib/content/registry.ts
    - src/lib/content/jieri-scenes.ts
    - src/lib/content/zodiac.ts
    - src/lib/content/feng-shui.ts
    - src/lib/content/tools.ts
    - src/components/seo/SeoPageShell.tsx
    - src/components/seo/SeoHero.tsx
    - src/components/seo/FaqBlock.tsx
    - src/components/seo/InternalLinkGrid.tsx
    - src/components/seo/ArticleLayout.tsx
    - tests/seo/content-registry.test.ts
    - tests/seo/metadata.test.ts
  modified:
    - src/lib/almanac/year-support.ts
    - src/lib/seo.ts
    - src/components/layout/NavigationLinks.tsx
    - src/i18n/messages/zh-hans.json
    - src/i18n/messages/zh-hant.json
    - tests/almanac/year-support.test.ts

key-decisions:
  - "Formal legal dynamic route year support is 2-5000; years 0 and 1 are rejected and retained as regression probes."
  - "Typed static content is the Phase 3 source of truth before Prisma/CMS seeding."
  - "Page metadata and JSON-LD assembly are centralized in src/lib/seo.ts."

patterns-established:
  - "Content registry: route path, localized SEO, FAQ, related links, sitemap flag, and seed metadata live together."
  - "Localized SEO pair: short SEO fields are maintained per locale; longer canonical body copy can be converted through OpenCC."
  - "SEO UI components remain server-renderable by default and compose existing shadcn/base wrappers."

requirements-completed: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09]

duration: 32min
completed: 2026-05-17
---

# Phase 03-01: Shared SEO Foundation Summary

**Typed Phase 3 content registry with legal year guardrails, centralized metadata/JSON-LD helpers, and reusable SEO page components.**

## Performance

- **Duration:** 32 min
- **Started:** 2026-05-17T13:21:46Z
- **Completed:** 2026-05-17T13:53:45Z
- **Tasks:** 4
- **Files modified:** 28

## Accomplishments

- Corrected formal year support to `2-5000`; `0` and `1` now reject in route validation and remain documented probes.
- Added a seed-friendly typed content registry for core pages, jieri scenes, zodiac hubs, feng shui, and tools.
- Added `buildSeoPageMetadata` plus BreadcrumbList, FAQPage, Article, WebApplication, and WebPage JSON-LD helpers.
- Added shared SEO UI components and Phase 3 navigation entrances for 吉日, 生肖, 工具, and 風水/风水.

## Task Commits

1. **Task 1: Blocking year support probe and guardrail module** - `819eb9a`, `b3376a3`
2. **Task 2: Typed static content contracts and seed-friendly registry shell** - `290f70e`
3. **Task 3: Centralized metadata and JSON-LD helpers** - `52467c8`
4. **Task 4: Shared SEO page components and navigation entrances** - `5ac431e`

**Plan metadata:** pending summary commit

## Files Created/Modified

- `src/lib/almanac/year-support.ts` - Legal dynamic range, indexed range, and tyme4ts support probes.
- `src/lib/content/*` - Typed content contracts, locale helpers, route registry, and seed-friendly page data.
- `src/lib/seo.ts` - Localized metadata and reusable JSON-LD helpers.
- `src/components/seo/*` - Shared page shell, hero, FAQ, internal links, and article layout.
- `src/components/layout/NavigationLinks.tsx` - Phase 3 navigation entries.
- `tests/almanac/year-support.test.ts`, `tests/seo/*.test.ts` - Year, registry, and metadata coverage.

## Decisions Made

- Resolved the original year `0-5000` blocker by accepting formal support for `2-5000`.
- Kept sitemap indexing separate from dynamic legality: SSG/indexed window remains `2006-2046`.
- Used TypeScript content modules rather than Prisma reads for Phase 3 MVP content.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Year 0/1 support could not satisfy formal route support**
- **Found during:** Task 1
- **Issue:** `tyme4ts` rejects year 0 and cannot provide complete service-style daily fields for year 1.
- **Fix:** Product scope corrected to legal years `2-5000`; planning files and tests updated.
- **Files modified:** `src/lib/almanac/year-support.ts`, `tests/almanac/year-support.test.ts`, Phase 3 planning docs.
- **Verification:** `npx vitest run tests/almanac/year-support.test.ts --reporter=verbose`
- **Committed in:** `b3376a3`

---

**Total deviations:** 1 auto-fixed (blocking scope correction).
**Impact on plan:** Route expansion is now unblocked for `2-5000`; years `0` and `1` are intentionally out of scope.

## Issues Encountered

- The worktree already contained unrelated dirty UI/product changes before this plan resumed. `NavigationLinks` and locale message files were already modified; the Phase 3 navigation commit includes the current mobile navigation shape plus the required Phase 3 entries. Other unrelated dirty files were left untouched.

## Verification

- `npx vitest run tests/almanac/year-support.test.ts --reporter=verbose` — passed, 6 tests.
- `npx vitest run tests/seo/content-registry.test.ts --reporter=verbose` — passed, 6 tests.
- `npx vitest run tests/seo/metadata.test.ts --reporter=verbose` — passed, 7 tests.
- `npm test -- tests/almanac/year-support.test.ts tests/seo/content-registry.test.ts tests/seo/metadata.test.ts` — passed, 19 tests.
- `npx tsc --noEmit` — passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 03-02 can consume `year-support.ts`, the content registry, SEO helpers, and shared SEO components to build `/jieri` scene and year pages. Existing unrelated dirty worktree changes remain and should be handled carefully by later executors.

## Self-Check: PASSED

---
*Phase: 03-seo-content-matrix*
*Completed: 2026-05-17*

