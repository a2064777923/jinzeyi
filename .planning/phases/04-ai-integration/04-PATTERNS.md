# Phase 04 — Pattern Map

**Phase:** Metaphysics Depth & Product Experience Upgrade  
**Created:** 2026-05-18  
**Source:** 04-CONTEXT.md + 04-RESEARCH.md + current codebase

## Purpose

Phase 4 should deepen the existing deterministic product instead of creating a parallel AI or content stack. The strongest local patterns are Phase 3's typed content registries, localized App Router pages, `tyme4ts` utility wrappers, and compact shadcn/Base UI interactive islands.

## Existing Patterns To Reuse

| New Capability | Closest Existing Analog | Reuse Guidance |
|----------------|-------------------------|----------------|
| Professional BaZi model | `src/lib/almanac/bazi.ts` | Extend the current result type and preserve existing fields; add professional sub-objects instead of rewriting callers. |
| tyme4ts almanac/BaZi calls | `src/lib/almanac/service.ts`, `src/lib/almanac/bazi.ts` | Keep deterministic calculations in `src/lib/almanac`; wrap `tyme4ts` APIs in project-owned types. |
| Almanac and auspicious-day types | `src/lib/almanac/types.ts` | Extend types for score dimensions, role configs, and reusable explanations. |
| Scene rules | `src/lib/content/jieri-scenes.ts` | Add scene-specific person-role/input config near existing scene metadata. |
| Annual jieri results | `src/lib/almanac/auspicious.ts`, `src/components/jieri/JieriScenePage.tsx` | Preserve existing SEO list behavior; personalized scoring should reuse candidates, not replace annual pages. |
| Client form/result island | `src/components/tools/BaziForm.tsx` | Use focused client components for form state; keep route pages as Server Components. |
| Tool route SEO shell | `src/app/[locale]/tools/bazi/page.tsx`, `src/app/[locale]/tools/page.tsx` | New tools should include `generateMetadata`, visible copy, FAQ, internal links, share panel, and JSON-LD. |
| Knowledge term hints | `src/components/knowledge/TermHint.tsx`, `GlossaryPanel.tsx` | Evolve the existing small glossary; keep compatibility helpers for current almanac pages. |
| Typed content registry | `src/lib/content/registry.ts`, `src/lib/content/types.ts` | Add knowledge pages to the same registry/sitemap pattern instead of a separate content system. |
| Localization | `src/lib/content/localize.ts` | Store canonical Simplified body copy when practical and use OpenCC for Traditional rendering; keep locale-specific SEO fields for important pages. |
| Metadata and JSON-LD | `src/lib/seo.ts` | Reuse `buildSeoPageMetadata` and `buildPageJsonLd`; add Article/WebPage/WebApplication as appropriate. |
| Tests | `tests/almanac/*.test.ts`, `tests/seo/*.test.ts` | Use Vitest for utility and source assertions; avoid adding a UI test library unless a plan explicitly needs it. |

## Recommended New Structure

```text
src/lib/almanac/
  bazi.ts                         # extend with day master, ten gods, hidden stems, na-yin, terrain, strength
  auspicious.ts                   # keep annual candidate generation
  auspicious-scoring.ts           # personalized scoring and ranked recommendations
  types.ts                        # score and professional chart types

src/lib/content/
  metaphysics.ts                  # encyclopedia taxonomy and story-rich entries
  glossary.ts                     # compatibility wrapper over metaphysics entries
  jieri-scenes.ts                 # add scene role/input config
  registry.ts                     # include knowledge pages and jieri recommendation route
  types.ts                        # add knowledge content family and entry types

src/components/knowledge/
  TermHint.tsx                    # richer tooltip/popover body
  GlossaryPanel.tsx               # can show richer entries
  KnowledgeEntryCard.tsx          # optional list card

src/components/tools/
  BaziResult.tsx                  # summary-first professional chart
  BaziForm.tsx                    # keep existing input shape; improve result framing if needed

src/components/jieri/
  AuspiciousRecommendationForm.tsx
  AuspiciousRecommendationResult.tsx
  ScoreBreakdown.tsx

src/app/[locale]/knowledge/
  page.tsx
  [slug]/page.tsx

src/app/[locale]/tools/jieri-recommend/
  page.tsx

tests/almanac/
  bazi.test.ts
  auspicious-scoring.test.ts

tests/content/
  metaphysics.test.ts

tests/seo/
  knowledge-routes.test.ts
```

## Data Flow Patterns

### Professional BaZi

1. `BaziForm` validates date/time/city/gender and calls `calculateBazi`.
2. `calculateBazi` applies true solar time and obtains `EightChar`.
3. Each pillar is converted into project-owned data:
   - visible stem/branch;
   - element/yin-yang;
   - ten god vs day master;
   - hidden stems;
   - na-yin;
   - terrain/twelve-growth signal.
4. `BaziResult` renders:
   - beginner summary;
   - four professional pillar cards;
   - five-element strength panel;
   - term hints linked to knowledge entries.

### Knowledge Entries

1. `metaphysics.ts` owns rich entries.
2. `glossary.ts` maps legacy keys to rich entries for old consumers.
3. `TermHint` accepts entries with `short`, `detail`, `chartHint`, `sourceNotes`, and `href`.
4. `/knowledge/[slug]` renders story, practical use, common misunderstandings, related terms, and JSON-LD.
5. `registry.ts` and sitemap include knowledge pages.

### Auspicious-Date Scoring

1. `AuspiciousRecommendationForm` collects scene, people roles, and date range.
2. `auspicious-scoring.ts` reuses `getAuspiciousDaysForScene` or equivalent daily almanac generation.
3. Score dimensions return explainable reason arrays.
4. Ranked results render overall grade, dimensional bars, cautions, and usable lucky hours.
5. Annual `/jieri/{scene}/{year}` pages keep SEO list behavior and link into `/tools/jieri-recommend`.

## Risk Notes For Planning

- Do not remove or rename existing fields in `BaziResult`; Phase 3 pages/tests rely on them.
- Keep deterministic computation in local services; do not add an AI or third-party API dependency for this phase.
- Avoid opaque lucky scores. Any score must include dimension-level evidence and cautions.
- Knowledge content must not become untyped blobs in page files. Keep it in typed registries for sitemap, metadata, and future database seeding.
- Tool copy must stay in the cultural-reference voice: tendency/reference/use with caution, no deterministic fate claims.
- Personalized forms collect birth data. Keep it client-side/local for now unless a future plan intentionally adds persistence.

## Verification Patterns

- `npx vitest run tests/almanac/bazi.test.ts --reporter=verbose`
- `npx vitest run tests/content/metaphysics.test.ts --reporter=verbose`
- `npx vitest run tests/almanac/auspicious-scoring.test.ts --reporter=verbose`
- `npx vitest run tests/seo/knowledge-routes.test.ts --reporter=verbose`
- `npx tsc --noEmit`
- `npm run build`

Manual browser checks should cover `/tools/bazi`, `/knowledge`, `/knowledge/day-master`, `/tools/jieri-recommend`, and one existing annual jieri page at mobile widths.
