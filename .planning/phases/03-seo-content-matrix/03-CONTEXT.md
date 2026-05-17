# Phase 3: SEO Content Matrix - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

SEO Content Matrix delivers thousands of discoverable, SSR/SSG-friendly pages and tools for organic search traffic: auspicious day scenario pages, zodiac pages and articles, BaZi charting, Feng Shui articles, naming tool pages, sitemap generation, structured data, and complete page-level metadata.

This phase clarifies HOW to build the SEO matrix. It does not add AI personalized interpretation; Phase 4 owns AI-driven recommendations and explanations.

**Requirements:** SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09

</domain>

<decisions>
## Implementation Decisions

### Auspicious Day Matrix
- **D-01:** `/jieri/{scene}/{year}` pages should combine annual/monthly auspicious day lists, scene-specific explanation, lightweight filtering, and recommendation reasons. They must not be pure data tables.
- **D-02:** Each scene maps to relevant `yi` items as the base match rule. Zodiac conflict avoidance is an advanced condition users can apply to see which matched dates should be avoided or downgraded.
- **D-03:** Ominous days are not deleted when they match a scene. They remain in the list with downgraded labels such as "not preferred" or "use with caution", with reasons based on daily fortune, chong-sha, or zodiac conflict.
- **D-04:** SSG and sitemap inclusion prioritize the current year plus/minus 20 years. With the current date of 2026-05-17, the initial indexed year range is 2006-2046.
- **D-05:** Legal dynamic route target range is year 2-5000. These years should be presented as formally supported, not with a "rough estimate only" UI disclaimer.
- **D-06:** Research/planning MUST verify whether `tyme4ts`, JavaScript/Next date handling, route params, lunar calendar, gan-zhi, solar terms, and existing service constraints can reliably support year 2-5000. Years 0 and 1 are explicitly excluded by the 2026-05-17 scope correction after the Wave 1 probe showed incomplete support.

### Content Source
- **D-07:** Phase 3 MVP content uses typed static content with a seed-friendly shape. Use TypeScript data structures first so SSG is stable; do not require live Prisma content reads in this phase.
- **D-08:** Static content must be designed so it can later seed Prisma models such as `ContentPage`, `ZodiacProfile`, `FengShuiArticle`, and naming-related records.
- **D-09:** Use a mixed Simplified/Traditional strategy. Core SEO title, description, keywords, H1, and short hero copy may be maintained separately per locale; longer body copy, list copy, and tool explanations use Simplified Chinese as canonical and convert to Traditional with the existing OpenCC/metaphysics dictionary.
- **D-10:** All Phase 3 SEO/tool content belongs in structured typed data files, likely under `src/lib/content/...` or a planner-chosen equivalent. Pages should render data, not embed large copy directly.
- **D-11:** Each indexable page needs at least unique main copy, FAQ content, and internal links. Avoid thin pages that only swap year, zodiac, or scene variables.

### BaZi And Naming Tools
- **D-12:** BaZi MVP outputs four pillars, heavenly stems/earthly branches, five-element distribution, and non-personalized cultural explanation. Do not include ten gods, patterns, useful god, luck cycles, or personalized destiny analysis in Phase 3.
- **D-13:** BaZi input supports birth date, precise birth time, birth place, and gender. The product experience can reference the "Cece" / "测测" style of consumer metaphysics apps, while keeping Phase 3 output bounded.
- **D-14:** Birth place is used for China city true solar time correction. Support major Chinese cities/provinces first; do not implement global geolocation, timezone databases, or international true solar time in MVP.
- **D-15:** Naming MVP includes character five-element attributes, basic auspicious/inauspicious explanation, an initial score, and suggested replacement/name characters. It does not combine with BaZi useful-god analysis in Phase 3.

### Zodiac And Feng Shui Content
- **D-16:** Zodiac uses a two-layer structure. `/zodiac/{animal}` is a tool-like hub with year table, personality, compatibility, fortune summary, suitable/unsuitable actions, and related auspicious day entrances. Separate zodiac article pages handle long-tail SEO.
- **D-17:** Zodiac article MVP is 2-3 fixed articles per animal, roughly 24-36 articles total. Topics should cover personality, compatibility, and annual fortune.
- **D-18:** Zodiac article writing must be based on collected and cross-checked source material, not invented from scratch. Do not copy or closely imitate a single source; synthesize multiple sources into JinZeYi's own natural, flowing editorial voice and avoid AI-sounding phrasing.
- **D-19:** Feng Shui uses categorized articles plus tool entrances. Start with categories such as home, office, shop, directions, and wealth position. Each article should include practical checklists and internal links to almanac/auspicious day tools.
- **D-20:** Feng Shui article MVP is about two articles per category, roughly 10 articles total, prioritizing quality and tool conversion.

### SEO Technical Rules
- **D-21:** Sitemap should be generated by hand with Next route APIs, using typed content, route config, locales, and year strategy. Do not make `next-sitemap` a required Phase 3 dependency.
- **D-22:** Every indexable Phase 3 page must have canonical URL, `zh-Hans` and `zh-Hant` hreflang, `x-default`, and Content-Language metadata. Sitemap output must include corresponding alternates.
- **D-23:** JSON-LD should match page type. Tool pages use `WebApplication`/`SoftwareApplication` or `WebPage`; articles use `Article`; FAQ blocks use `FAQPage`; site-level data uses `WebSite`; breadcrumbs use `BreadcrumbList`.
- **D-24:** Add reusable structured data helpers in `src/lib/seo.ts` or a nearby SEO helper module rather than duplicating JSON-LD assembly per page.
- **D-25:** Sitemap includes SSG and core indexable pages: homepage, core almanac pages, calendar/solar terms, `/jieri` scenes for 2006-2046, zodiac hubs, zodiac articles, Feng Shui articles, and tool entrances. Dynamic year 2-5000 pages are accessible but not all listed in sitemap.

### The Agent's Discretion
- Exact route file organization, component split, data module naming, and helper function names are planner/implementer discretion as long as they follow existing Next.js App Router, next-intl, Tailwind, and shadcn patterns.
- Exact content object schemas are planner discretion, but must be typed, seed-friendly, locale-aware for SEO fields, and reusable by sitemap/metadata/JSON-LD generation.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Planning
- `.planning/PROJECT.md` — Project definition, core value, constraints, mixed SEO path decision, and v1 scope.
- `.planning/REQUIREMENTS.md` — SEO-01 through SEO-09 requirements and v1 traceability.
- `.planning/ROADMAP.md` — Phase 3 goal, dependencies, and success criteria.
- `.planning/STATE.md` — Current workflow state and completed prior phases.
- `CLAUDE.md` — Current tech stack, SEO constraints, and project conventions.

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Phase 1 decisions: Prisma content models, OpenCC strategy, tyme4ts verification scope, and service boundaries.
- `.planning/phases/02-core-almanac-ui/02-CONTEXT.md` — Phase 2 UI/data decisions for almanac, calendar, detail pages, and visual language.

### Existing Code
- `src/lib/almanac/service.ts` — Existing tyme4ts-backed daily/hourly/monthly/solar-term services and current date range assumptions.
- `src/lib/almanac/types.ts` — Almanac data types to reuse or extend for SEO scene matching.
- `src/lib/seo.ts` — Existing metadata and JSON-LD helpers to extend for Phase 3.
- `prisma/schema.prisma` — Existing seed-target models: `ContentPage`, `ZodiacProfile`, `BaZiProfile`, `FengShuiArticle`, `NamingRecord`.
- `src/i18n/routing.ts` — Locale list and locale routing behavior.
- `src/i18n/locale-path.ts` — Existing locale path switching helper.
- `src/lib/opencc.ts` — Existing Simplified/Traditional conversion path.
- `src/components/layout/NavigationLinks.tsx` — Current primary navigation pattern.
- `src/components/almanac/DateSearchForm.tsx` — Existing client-side date form pattern.
- `src/app/[locale]/almanac/[date]/page.tsx` — Existing dynamic detail page metadata and JSON-LD pattern.
- `src/app/[locale]/calendar/page.tsx` — Existing metadata pattern for query-driven pages.
- `src/app/[locale]/solar-terms/page.tsx` — Existing content-heavy page pattern.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getDailyAlmanac`, `getMonthlyCalendar`, and `getSolarTerms` in `src/lib/almanac/service.ts` can feed auspicious day matching, internal links, calendar snippets, and SEO copy.
- `buildLocalizedMetadata`, `buildWebsiteJsonLd`, and `buildAlmanacJsonLd` in `src/lib/seo.ts` provide the base for canonical, alternate language, OG, Twitter, and JSON-LD helpers.
- `convertToTraditional` in `src/lib/opencc.ts` supports the chosen Simplified canonical body copy strategy.
- `DateSearchForm`, `FortuneMarker`, `YiJiBadgeList`, existing almanac icons, and shadcn UI primitives can be reused for tool pages and list summaries.
- Prisma already contains Phase 3-oriented models even though MVP content should start as typed static content.

### Established Patterns
- App Router routes live under `src/app/[locale]/...` and pages are Server Components by default.
- `generateMetadata` uses `buildLocalizedMetadata` and `setRequestLocale`.
- Locale-aware links use helpers from `src/i18n/navigation`.
- Copy lives in `next-intl` messages for UI labels, while domain content can be structured outside message files.
- Current visual language uses modern Chinese almanac styling with red/gold/lucky/ominous accents, icons, and compact responsive layouts.

### Integration Points
- New route groups likely include `/[locale]/jieri/...`, `/[locale]/zodiac/...`, `/[locale]/feng-shui/...`, and `/[locale]/tools/...` or equivalent paths consistent with PROJECT.md.
- Sitemap generation should consume the same typed route/content registry used by page metadata and static params.
- Navigation needs new Phase 3 entrances without overcrowding the existing header; planner should decide grouped nav or tool hub.
- Service layer needs scene-to-yi matching and zodiac conflict logic for auspicious day pages.
- BaZi and naming tools need client forms but should keep heavy calculations and validation in typed utilities or server actions/routes as appropriate.

</code_context>

<specifics>
## Specific Ideas

- `/jieri/{scene}/{year}` should feel like a practical SEO tool page, not a database dump.
- The indexed year window is current year plus/minus 20; as of 2026-05-17 that is 2006-2046.
- Product target wants dynamic year 2-5000 to appear formally supported; years 0 and 1 are out of scope because the installed calendar stack cannot provide complete almanac semantics for them.
- The "测测" app is a reference for BaZi form completeness and consumer metaphysics UX, not for copying content or adding deep Phase 4-style interpretation.
- Articles should sound natural and editorial, with a calm "娓娓道来" tone, not AI-generated filler.

</specifics>

<deferred>
## Deferred Ideas

- Later content enhancement can combine yearly/day-specific historical events or major records with almanac pages.
- Deeper BaZi analysis such as ten gods, useful god, luck cycles, personalized interpretation, and AI explanation belongs to later AI/product phases.
- Global birthplace, timezone, and true solar time support is deferred; Phase 3 only targets Chinese cities/provinces.
- Full Prisma/CMS-backed content management is deferred; Phase 3 content should be seed-friendly so it can migrate later.

</deferred>

---

*Phase: 3-SEO Content Matrix*
*Context gathered: 2026-05-17*
