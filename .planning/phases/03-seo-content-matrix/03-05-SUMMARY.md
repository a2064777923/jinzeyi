---
phase: 03-seo-content-matrix
plan: 05
subsystem: seo
tags: [feng-shui, article, checklist, json-ld, nextjs]

requires:
  - phase: 03-seo-content-matrix
    provides: 03-01 shared content registry, SEO helpers, and SEO UI components
provides:
  - `/[locale]/feng-shui` category landing
  - 10 categorized Feng Shui article pages
  - Practical checklist, FAQ, source notes, Article JSON-LD, and internal links
  - Almanac icon assets used by Phase 3 SEO pages
affects: [03-06-sitemap, feng-shui, seo-routes]

tech-stack:
  added: []
  patterns: [categorized-article-registry, practical-checklist-block, article-json-ld]

key-files:
  created:
    - src/components/feng-shui/FengShuiIndex.tsx
    - src/components/feng-shui/FengShuiArticle.tsx
    - src/components/feng-shui/ChecklistBlock.tsx
    - src/app/[locale]/feng-shui/page.tsx
    - src/app/[locale]/feng-shui/[category]/[slug]/page.tsx
    - tests/seo/feng-shui-content.test.ts
    - tests/seo/feng-shui-routes.test.ts
    - public/assets/almanac-icons/*.png
  modified:
    - src/lib/content/feng-shui.ts
    - src/lib/content/registry.ts

key-decisions:
  - "Feng Shui MVP ships five categories with two practical articles each."
  - "Each article frames Feng Shui as spatial checklist and cultural reference, not deterministic promises."
  - "Article JSON-LD, FAQ JSON-LD, visible checklist, and related links all come from the typed registry."
  - "Almanac icon assets are committed because jieri, zodiac, and feng shui pages reference them directly."

patterns-established:
  - "FengShuiArticle extends ArticleContent with categorySlug, sections, checklist, and sourceNotes."
  - "Category landing groups dense article lists by home, office, shop, directions, and wealth."
  - "ChecklistBlock renders near the top of article pages before editorial sections."

requirements-completed: [SEO-05, SEO-08, SEO-09]

duration: 21min
completed: 2026-05-17
---

# Phase 03-05: Feng Shui Content Summary

**風水首頁與 10 篇分類文章已完成，文章都有實用清單、FAQ、source notes、內鏈與 JSON-LD。**

## Performance

- **Duration:** 21 min
- **Started:** 2026-05-17T14:51:00Z
- **Completed:** 2026-05-17T15:12:00Z
- **Tasks:** 3
- **Files modified:** 29

## Accomplishments

- Expanded `src/lib/content/feng-shui.ts` into five categories and 10 source-synthesized practical articles.
- Registered Feng Shui articles in the shared indexable route registry.
- Added `/feng-shui` category landing and `/feng-shui/{category}/{slug}` article route family.
- Added article UI with practical checklist near the top, body sections, visible FAQ, related links, and source-note rail.
- Added almanac icon assets used by Phase 3 SEO pages.

## Task Commits

1. **Task 1: Feng Shui content registry and tests** - `b15b4f9`
2. **Tasks 2-3: Feng Shui routes, metadata, JSON-LD, and UI** - `25e22bc`

**Plan metadata:** pending summary commit

## Files Created/Modified

- `src/lib/content/feng-shui.ts` - Categories, article content, checklists, source notes, FAQs, related links, and lookup helpers.
- `src/lib/content/registry.ts` - Feng Shui articles included in indexable route registry.
- `src/app/[locale]/feng-shui/*` - Landing and article routes.
- `src/components/feng-shui/*` - Category landing, article renderer, and checklist block.
- `public/assets/almanac-icons/*` - Visual assets referenced by Phase 3 SEO pages.
- `tests/seo/feng-shui-content.test.ts`, `tests/seo/feng-shui-routes.test.ts` - Content and route contract coverage.

## Decisions Made

- Kept the article count at 10 pages: two each for home, office, shop, directions, and wealth.
- Used practical language around lighting, clutter, routes, work flow, and maintenance instead of guaranteed outcomes.
- Committed the whole `almanac-icons` asset set because multiple Phase 3 route families now depend on it.

## Deviations from Plan

None.

## Issues Encountered

- Initial article bodies were intentionally concise and failed the content-depth test threshold. The registry copy was expanded rather than weakening the test.
- The worktree still contains unrelated dirty UI/product changes from earlier work. The 03-05 commits staged only Feng Shui content, route, component, test, and referenced icon assets.

## Verification

- `npx vitest run tests/seo/feng-shui-content.test.ts --reporter=verbose` — passed, 3 tests.
- `npm test -- tests/seo/feng-shui-content.test.ts tests/seo/feng-shui-routes.test.ts` — passed, 7 tests.
- `npx tsc --noEmit --pretty false` — passed.
- `npm run build` — passed; Next generated 854 static pages, including Feng Shui landing and article routes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 03-06 can now generate sitemap coverage for jieri, zodiac, tools, and Feng Shui routes and run structured-data/metadata smoke checks.

## Self-Check: PASSED

---
*Phase: 03-seo-content-matrix*
*Completed: 2026-05-17*
