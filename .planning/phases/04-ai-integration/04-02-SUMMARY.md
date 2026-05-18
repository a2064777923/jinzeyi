---
phase: 04-ai-integration
plan: 02
subsystem: content
tags: [metaphysics, knowledge, glossary, seo, sitemap]
requires:
  - phase: 03-seo-content-matrix
    provides: SEO registry, glossary panel pattern, locale-aware routes, metadata helpers
provides:
  - Typed metaphysics knowledge taxonomy
  - Backward-compatible glossary wrappers backed by knowledge entries
  - Locale-aware /knowledge index and detail routes
  - Richer term hints with chart/source context
  - Registry and sitemap coverage for knowledge pages
affects: [bazi-ui, jieri-scoring, knowledge, seo]
tech-stack:
  added: []
  patterns: [typed static content taxonomy, glossary compatibility wrapper, registry-backed knowledge routes]
key-files:
  created:
    - src/lib/content/metaphysics.ts
    - src/app/[locale]/knowledge/page.tsx
    - src/app/[locale]/knowledge/[slug]/page.tsx
    - src/components/knowledge/KnowledgeEntryCard.tsx
    - tests/content/metaphysics.test.ts
    - tests/seo/knowledge-routes.test.ts
  modified:
    - src/lib/content/types.ts
    - src/lib/content/glossary.ts
    - src/lib/content/registry.ts
    - src/components/knowledge/TermHint.tsx
    - src/components/knowledge/GlossaryPanel.tsx
    - tests/seo/sitemap.test.ts
key-decisions:
  - "Stored first-version knowledge as typed static content instead of adding database seed/schema work."
  - "Kept getGlossaryEntry/getGlossaryEntries compatible while mapping core terms to knowledge entries."
  - "Used /knowledge pages for long cultural/story content while keeping tool hints compact."
patterns-established:
  - "Metaphysics entries carry required explanation fields plus SEO, FAQ, breadcrumbs, related links, and sitemap metadata."
  - "Tool hints can surface chartHint/sourceNotes and link to a full knowledge page without changing existing consumers."
requirements-completed: [META-03, META-04]
duration: 28min
completed: 2026-05-18
---

# Phase 04: Metaphysics Knowledge Base Summary

**Typed metaphysics encyclopedia with glossary compatibility, rich term hints, SEO knowledge pages, and sitemap coverage**

## Performance

- **Duration:** 28 min
- **Started:** 2026-05-18T06:21:00Z
- **Completed:** 2026-05-18T06:49:00Z
- **Tasks:** 4
- **Files modified:** 12

## Accomplishments

- Added `metaphysicsEntries` with required BaZi, five-element, almanac, star, Zi Wei, and Zhou Tian entries.
- Preserved existing glossary API while backing core terms such as `ganZhi`, `fourPillars`, `fiveElements`, `yiJi`, `chongSha`, and `luckyHour` with knowledge entries.
- Added `/knowledge` and `/knowledge/[slug]` pages with metadata, JSON-LD, breadcrumbs, FAQ, related terms, source notes, and story sections.
- Registered knowledge routes in the content registry and sitemap tests for both locales.

## Task Commits

Inline execution produced one combined production commit covering all four plan tasks:

1. **Tasks 1-4: Taxonomy, hints, routes, registry, sitemap, and tests** - `c3bc9b8` (`feat(04-02)`)

## Files Created/Modified

- `src/lib/content/metaphysics.ts` - Typed metaphysics taxonomy, category helpers, knowledge index page, entry lookups, and localization helpers.
- `src/lib/content/glossary.ts` - Compatibility wrapper that maps legacy glossary keys to metaphysics entries and keeps feng-shui fallbacks.
- `src/components/knowledge/TermHint.tsx` - Compact popover with chart hint, source note, and knowledge link.
- `src/components/knowledge/GlossaryPanel.tsx` - Richer panel rendering practical use and source notes.
- `src/components/knowledge/KnowledgeEntryCard.tsx` - Stable index card for knowledge entries.
- `src/app/[locale]/knowledge/page.tsx` - Locale-aware knowledge index page.
- `src/app/[locale]/knowledge/[slug]/page.tsx` - Locale-aware detail page with static params and `notFound()` guard.
- `src/lib/content/registry.ts` - Registers and exports knowledge pages and helpers.
- `tests/content/metaphysics.test.ts` - Field, glossary, localization, and deterministic-copy coverage.
- `tests/seo/knowledge-routes.test.ts` - Route, metadata, JSON-LD, registry, and sitemap contract coverage.
- `tests/seo/sitemap.test.ts` - Adds knowledge URL assertions for both locales.

## Decisions Made

- Kept the knowledge base static and typed for this slice, matching existing Phase 3 SEO content patterns.
- Added `stem-branch` as an extra knowledge entry so the legacy `ganZhi` tooltip can point to a real encyclopedia page.
- Did not add AI routes, provider configuration, or database seeding because Phase 4 AI work remains deferred.

## Deviations from Plan

None - plan executed exactly as written, with a combined commit for the inline execution batch.

## Issues Encountered

- `src/lib/content/registry.ts` already had unrelated unstaged edits before this plan. Only the knowledge import, registry inclusion, and exports were staged for the 04-02 production commit.

## Verification

- `npx vitest run tests/content/metaphysics.test.ts --reporter=verbose` — passed, 7 tests.
- `npx vitest run tests/seo/knowledge-routes.test.ts tests/seo/sitemap.test.ts --reporter=verbose` — passed, 10 tests.
- `npx vitest run tests/seo/content-registry.test.ts --reporter=verbose` — passed, 6 tests.
- `npx tsc --noEmit` — passed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Plan 04-03 can use `TermHint`, `getGlossaryEntry`, and `/knowledge` links to explain day master, ten gods, hidden stems, na-yin, and five-element strength inside the BaZi result UI. Plan 04-04 can reuse the almanac and five-element entries to explain scoring dimensions.

## Self-Check: PASSED

---
*Phase: 04-ai-integration*
*Completed: 2026-05-18*
