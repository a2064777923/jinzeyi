# Phase 4: AI Integration - Context

**Gathered:** 2026-05-18
**Status:** Ready for scope-aligned planning

<domain>
## Phase Boundary

Phase 4 was originally named "AI Integration" in ROADMAP.md, but the user explicitly postponed provider/API integration during discussion. The active Phase 4 product direction is now: improve JinZeYi's metaphysics depth, product experience, and content richness before adding an AI assistant.

This phase should deliver three connected product upgrades:

1. A deeper BaZi professional chart experience with beginner-readable summaries.
2. An interactive auspicious-date recommendation flow using almanac, scene, and BaZi five-element signals.
3. A large metaphysics knowledge base foundation with term explanations, mythology/story content, and in-tool tooltip/popover integration.

Do not implement AI provider registry, streaming AI routes, or model failover in this phase unless the roadmap is explicitly updated again. AI should be treated as a deferred capability that will sit on top of the stronger product/content foundation built here.

</domain>

<decisions>
## Implementation Decisions

### Scope Redirection
- **D-01:** AI assistant/provider integration is postponed. Phase 4 should not start with Vercel AI SDK, provider failover, or AI API routes.
- **D-02:** Downstream planning must treat this phase as "Metaphysics Depth & Product Experience Upgrade" despite the existing roadmap title. If roadmap artifacts are updated later, they should rename or split Phase 4 accordingly.
- **D-03:** The goal is to make existing tools feel closer to strong consumer metaphysics products such as Cece/測測, 準了, 問真八字, and professional Chinese metaphysics tools, while staying SEO-friendly and culturally framed.

### BaZi Depth
- **D-04:** BaZi deepening should be professional-chart-first at the data/model level, but the first screen should show a plain-language summary before the professional chart.
- **D-05:** First-version BaZi professional chart must include four-pillar breakdown, day master, heavenly stems, earthly branches, ten gods, hidden stems, na-yin, and five-element distribution/strength signals.
- **D-06:** Shen-sha lists and luck cycles such as da-yun, liu-nian, liu-yue, and liu-ri are important follow-up layers, but not the first slice.
- **D-07:** BaZi terminology explanations must be richer than a minimal MVP: each important term should support a short definition, a chart-specific hint, traditional/classical source notes where available, and a plain-language example.
- **D-08:** The BaZi page should avoid jumping directly to hard fate claims. It should use the complete professional chart as the source of truth, then present beginner-readable interpretation as an explanation layer.

### Auspicious-Date Scoring
- **D-09:** The auspicious-date upgrade should be an interactive recommendation flow, not just an upgraded annual/monthly SEO list.
- **D-10:** First-version scoring should combine almanac data, scene rules, and BaZi/five-element signals. It should go beyond the current almanac + scene + zodiac list.
- **D-11:** Input requirements should depend on the scene. Marriage/matching scenes can require two people; moving can optionally include household members; business/opening/signing can focus on the responsible person or legal representative.
- **D-12:** Results should show both an overall score/grade and a dimensional breakdown. Dimensions should include almanac fit, scene fit, zodiac/chong-sha, BaZi/five-element fit, and usable lucky hours where available.
- **D-13:** Every score, bonus, and penalty must be explainable. Avoid opaque "mystical" numbers with no rationale.
- **D-14:** The core flow should be: choose scene, enter required people/person data, choose date range, receive top recommended dates with score, reasons, cautions, and usable lucky hours.
- **D-15:** Existing `/jieri/{scene}/{year}` pages can link into or reuse data from the interactive flow, but the personalized recommendation flow is the main product experience for this phase.

### Knowledge Base And Mythology
- **D-16:** The knowledge base should be designed as a broad metaphysics encyclopedia, not only a small glossary for current tools.
- **D-17:** First-version content should include a usable taxonomy plus story-rich entries: name, category, short explanation, practical use, related terms, tool appearances, mythology/cultural story, star/personality metaphor where relevant, and common misunderstandings.
- **D-18:** Coverage should begin with terms needed by BaZi and auspicious-date scoring, while the taxonomy should prepare for Zi Wei Dou Shu, twenty-eight mansions, Zhou Tian Xing Dou, star deities, and broader mythology/story content.
- **D-19:** Tool pages should first integrate the knowledge base through term tooltip/popover interactions. Full encyclopedia/story pages can be linked from those popovers.
- **D-20:** Mythology and fun/story content should primarily live in standalone encyclopedia/story pages such as Zhou Tian Xing Dou, twenty-eight mansions, star stories, and five-element mythology. Tool pages should link to these rather than interrupt workflows with long story blocks.

### Safety And Product Voice
- **D-21:** Keep the site framed as cultural research and folklore reference. Do not present scores or chart hints as deterministic fate, legal, medical, financial, or life-critical advice.
- **D-22:** Prefer "tendency", "reference", "worth noting", "more suitable", and "use with caution" language over absolute prediction.
- **D-23:** Explain methodology visibly enough that users understand why a date or chart insight is being shown.

### the agent's Discretion
- Exact route names, component splits, data module names, database schema changes, scoring formula weights, and taxonomy storage shape are planner/implementer discretion.
- Planner may decide whether the personalized auspicious-date flow is a new route under `/tools`, `/jieri`, or a product-specific path, as long as it stays locale-aware and links cleanly from existing SEO pages.
- Planner may decide which classical/traditional sources are realistic to encode first, but source/source-note fields should be present in the content model.
- Planner should decide whether to keep first-version knowledge data as typed static content or Prisma-seedable structured content, following existing Phase 3 patterns.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/PROJECT.md` — Project definition, cultural framing, tech stack, AI constraint, and v1 scope.
- `.planning/REQUIREMENTS.md` — Original AI requirements and existing v1 traceability; note that user has now postponed AI implementation.
- `.planning/ROADMAP.md` — Original Phase 4 goal and dependency context; planner must account for the user-approved scope redirection in this CONTEXT.md.
- `.planning/STATE.md` — Current project state and Phase 3 completion status.
- `CLAUDE.md` — Current stack recommendations, SEO constraints, i18n conventions, and AI SDK notes for deferred future work.

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Foundation decisions: schema strategy, OpenCC, tyme4ts verification, service boundaries.
- `.planning/phases/02-core-almanac-ui/02-CONTEXT.md` — Almanac UI/data decisions: card, hourly fortune, calendar, detail page, visual language.
- `.planning/phases/03-seo-content-matrix/03-CONTEXT.md` — SEO matrix decisions: `/jieri` pages, BaZi/naming tool boundaries, content structure, metadata/JSON-LD rules.

### Existing Code
- `src/lib/almanac/bazi.ts` — Existing BaZi calculator with input schema, true solar time correction, four pillars, and five-element count.
- `src/components/tools/BaziForm.tsx` — Existing BaZi input UI for birth date/time, Chinese city, and gender.
- `src/components/tools/BaziResult.tsx` — Existing BaZi output UI to extend into summary + professional chart.
- `src/lib/almanac/auspicious.ts` — Current auspicious-day scene matching, zodiac conflict, status, and reason generation.
- `src/lib/almanac/types.ts` — Shared almanac, auspicious-day, and reason types to extend for scoring.
- `src/app/[locale]/jieri/[scene]/[year]/page.tsx` — Existing SEO route that builds annual scene pages and calls auspicious-day matching.
- `src/components/jieri/JieriScenePage.tsx` — Existing scene page display with metrics, month sections, and filter panel.
- `src/components/jieri/JieriFilterPanel.tsx` — Existing zodiac/year/month filtering pattern.
- `src/components/knowledge/TermHint.tsx` — Existing tooltip-style term hint component; can be expanded for richer knowledge popovers.
- `src/components/knowledge/GlossaryPanel.tsx` — Existing related-knowledge panel pattern.
- `src/lib/content/glossary.ts` — Existing small glossary data model; likely needs to become a broader metaphysics knowledge taxonomy.
- `src/lib/seo.ts` — Existing metadata and JSON-LD helpers for encyclopedia/story pages.
- `src/i18n/routing.ts` — Locale routing behavior for all new pages and tools.
- `src/lib/content/localize.ts` — Existing Simplified/Traditional content localization helper.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `calculateBazi` already produces four pillars, true solar time, and five-element counts. It is the natural base for ten gods, hidden stems, na-yin, and day-master calculations.
- `BaziForm` already collects the exact fields needed for BaZi-based personalized scoring: birth date, precise time, Chinese city, and gender.
- `getAuspiciousDaysForScene` already generates candidate dates with almanac data, scene yi matches, status, zodiac conflict, and reason objects.
- `AuspiciousDayReason` gives a starting point for explainable scoring; it should likely expand from reason-only into weighted dimensions.
- `TermHint`, `GlossaryPanel`, and `glossary.ts` already establish a small knowledge layer that can be expanded into richer popovers and encyclopedia pages.
- `SeoPageShell`, `SeoHero`, `FaqBlock`, `InternalLinkGrid`, and `buildPageJsonLd` can support standalone encyclopedia/story pages without inventing a separate page system.

### Established Patterns
- App Router routes live under `src/app/[locale]/...`; pages are mostly Server Components with focused client components for forms.
- Content-heavy pages use typed content modules and localize body copy, matching the Phase 3 decision to keep SSG/SEO stable.
- Tool pages keep forms interactive while preserving indexable surrounding content.
- Existing language uses careful cultural-reference framing and disclaimers rather than absolute claims.
- Current UI uses red/gold/ink-inspired metaphysics styling with shadcn primitives and compact rounded cards.

### Integration Points
- BaZi depth should extend `src/lib/almanac/bazi.ts`, `src/components/tools/BaziForm.tsx`, and `src/components/tools/BaziResult.tsx`.
- Auspicious scoring should extend or sit beside `src/lib/almanac/auspicious.ts`, likely adding scene input configuration and score dimension types.
- Personalized recommendation flow should link from `/jieri`, `/jieri/{scene}/{year}`, BaZi tool pages, and relevant encyclopedia terms.
- Knowledge base taxonomy should connect with `TermHint`, `GlossaryPanel`, SEO content registry, sitemap generation, metadata, and JSON-LD.
- Any new content/data model should preserve zh-hans/zh-hant URL behavior and either store separate localized SEO fields or use existing conversion/localization patterns.

</code_context>

<specifics>
## Specific Ideas

- Product inspiration: Cece/測測 combines astrology/BaZi reports, AI Q&A, social comparison, and tests; the useful lesson is not "add AI now", but make metaphysics outputs feel personal, explainable, and repeatable.
- Product inspiration: 準了 combines astrology, BaZi, Zi Wei Dou Shu, twenty-eight mansions, daily/monthly/yearly fortune, matching, and fun lifestyle hooks; JinZeYi can borrow the layered "many lenses" product feel without copying content.
- Product inspiration: 問真八字 and professional tools emphasize professional charts, classical references, hidden terms, luck cycles, and clickable explanations. JinZeYi should become deeper than the current four-pillar/five-element MVP.
- Product inspiration: 星河易道-style tools show the value of one input powering multiple systems, such as BaZi, Zi Wei, Qi Men, and auspicious-date selection.
- External research references considered during discussion:
  - Google Play 測測: `https://play.google.com/store/apps/details?hl=zh_TW&id=com.lingocc.cc5`
  - 準了 App Store: `https://apps.apple.com/cn/app/id1356471277`
  - 問真八字 App Store: `https://apps.apple.com/cn/app/id1665624645`
  - 星河易道: `https://xuebz.com/`
  - GuidingStar: `https://guidingstar.ai/`
  - 靈淵: `https://lingyuan.ai/`
  - FortuneTell: `https://fortunetell.ai/`
  - iztro Zi Wei learning/docs: `https://iztro.com/learn/star`
- "紫微斗數" should be the preferred wording for the future module, not "紫薇算術".
- The knowledge base should prepare for Zi Wei and star-mythology expansion even though Zi Wei MVP is not part of the selected first implementation line.

</specifics>

<deferred>
## Deferred Ideas

- AI provider registry, streaming AI routes, model failover, and one-sentence AI Q&A are deferred until the product/content foundation is stronger.
- Zi Wei Dou Shu MVP is deferred from this Phase 4 first slice, but the knowledge taxonomy should prepare for future Zi Wei terms, stars, palaces, four transformations, and brightness states.
- BaZi shen-sha lists and da-yun/liu-nian/liu-yue/liu-ri should come after the first professional-chart slice with ten gods, hidden stems, na-yin, and five-element signals.
- Sidebar knowledge panels can come later; first integration should be tooltip/popover term hints.
- Share cards/result cards for mythology, stars, five elements, or shen-sha are useful future product hooks but not the first knowledge-base integration.
- Full long-form scholarly encyclopedia entries with deep source comparison and school differences are deferred; first version uses a structured encyclopedia skeleton plus story-rich content.

</deferred>

---

*Phase: 4-AI Integration*
*Context gathered: 2026-05-18*
