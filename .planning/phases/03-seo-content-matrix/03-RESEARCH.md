# Phase 3: SEO Content Matrix - Research

**Researched:** 2026-05-17
**Domain:** Next.js App Router SEO matrix, Chinese almanac tooling, typed content architecture
**Confidence:** MEDIUM-HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- `/jieri/{scene}/{year}` combines scene explanation, annual/monthly day lists, lightweight filtering, and recommendation reasons.
- Scene matching uses relevant `yi` items as the base rule. Zodiac conflict avoidance is an advanced condition.
- Ominous matched days remain visible but are downgraded with explanation.
- SSG/sitemap include current year plus/minus 20 years. On 2026-05-17 this means 2006-2046.
- Dynamic route target is year 0-5000, presented as formal support.
- Content source is typed static content with seed-friendly shape, not live Prisma reads for MVP.
- SEO title/description/keywords/H1 may be maintained per locale; longer body copy uses Simplified canonical text plus OpenCC conversion.
- Every indexable page needs unique main copy, FAQ, and internal links.
- BaZi MVP outputs four pillars, five-element distribution, and basic cultural explanation only.
- BaZi input includes birth date, precise time, birth place, and gender; Chinese city true solar time correction is required.
- Naming MVP includes five-element attributes, basic explanation, initial score, and suggested characters, without BaZi useful-god analysis.
- Zodiac uses hubs plus 2-3 articles per animal; Feng Shui uses categorized articles plus tool entrances.
- Sitemap is hand-written with Next route APIs. All indexable pages need canonical, hreflang, x-default, Content-Language, and page-type JSON-LD.

### The Agent's Discretion
- Route grouping, component split, helper names, and content schema details.
- Exact names and file layout under a typed content directory.

### Deferred Ideas (OUT OF SCOPE)
- Historical event overlays for years/days.
- Deep BaZi interpretation, useful god, luck cycles, and AI explanations.
- Global birthplace/timezone true solar time.
- Full Prisma/CMS-backed content management.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Typed SEO content registry | Frontend Server | Static build | App Router pages, static params, metadata, sitemap, and JSON-LD should all read one typed source of truth. |
| Auspicious day scene matching | Frontend Server | Cache/service | Generated pages need deterministic date lists from `AlmanacService` plus scene rules. |
| Zodiac and Feng Shui articles | Frontend Server | Static build | SSG content pages are static data rendered by route templates. |
| BaZi and naming forms | Browser/Client | Frontend Server utilities | Forms need interactivity; calculations should live in typed utilities/server-safe modules. |
| Sitemap and metadata | Static/CDN | Frontend Server | Next metadata routes and `generateMetadata` own indexability output. |
| Prisma content models | Database/Storage | Future seed path | Existing models are future targets, not MVP runtime sources. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 3 should be planned as a vertical SEO matrix built around a typed route/content registry. The same registry should drive `generateStaticParams`, page metadata, JSON-LD, breadcrumbs, internal links, and sitemap entries. This prevents divergence between what is rendered, what is linked, and what search engines see.

The largest technical risk is the year 0-5000 decision. A local probe against installed `tyme4ts` showed `SolarDay.fromYmd(5000, 1, 1)` and `SolarTime.fromYmdHms(5000, 12, 31, 23, 59, 0)` work, but year 0 and year 1 fail with `illegal solar year: 0`; year 2 and later work in the smoke test. The planner must include a blocking research/guardrail task before implementing formal 0-5000 support.

The standard Next.js approach is to use Metadata API functions and metadata route files instead of introducing `next-sitemap`. Existing `src/lib/seo.ts` already centralizes localized metadata and JSON-LD, so Phase 3 should extend that helper layer rather than duplicating metadata per page.

**Primary recommendation:** Plan Phase 3 in waves: first shared SEO/content/almanac utilities and risk probes, then route slices for auspicious days, zodiac/articles, tools, and finally sitemap/coverage verification.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16.2.6 | SSG/SSR pages, metadata, sitemap routes | Already in project; official `sitemap.ts` and `generateMetadata` APIs fit this phase. |
| next-intl | 4.12.x | Locale routing and UI labels | Already provides `/zh-hant` and `/zh-hans` route structure. |
| tyme4ts | 1.4.6 | Lunar, gan-zhi, zodiac, solar terms, EightChar | Already powers almanac service; has `SolarTime` and `EightChar` APIs for BaZi. |
| OpenCC | 1.3.1 | Simplified/Traditional conversion | Already has metaphysics dictionary tests and helpers. |
| Zod | 4.4.x | Form/input validation | Already installed; suitable for BaZi/naming/date/year validation. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Prisma | 7.8.x | Future content seed target | Do not use as MVP runtime content source, but keep static data shape seed-friendly. |
| Lucide React | 1.16.x | Icons | Reuse for tool hubs and article metadata. |
| shadcn/ui primitives | local | Cards, badges, tabs, forms | Existing style system for content/tool pages. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-written `sitemap.ts` | `next-sitemap` | `next-sitemap` is useful for simpler route sets, but this phase needs a typed content registry, custom year windows, locales, and alternates. |
| Typed TS content | MDX | MDX is nicer for editorial writing but adds a content pipeline and weakens seed-friendly structured data for tools. |
| tyme4ts only for 0-5000 | Alternative ephemeris/almanac library | Use only if 0/1 AD and true calendar support cannot be solved with tyme4ts. |
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

```text
Typed content registry
  ├─ scenes / zodiac / articles / feng shui / tools / FAQ / SEO fields
  │
  ├─ generateStaticParams() ──> SSG routes
  ├─ generateMetadata() ──────> canonical / hreflang / OG / Content-Language
  ├─ JSON-LD helpers ─────────> WebApplication / Article / FAQPage / BreadcrumbList
  ├─ sitemap.ts ──────────────> indexable URL list + alternates
  └─ page components ─────────> rendered content + internal links

Almanac service + scene rules
  └─ annual auspicious day generation
       ├─ yi match
       ├─ daily fortune downgrade
       └─ optional zodiac conflict downgrade

Tool forms
  ├─ client input components
  ├─ zod validation
  └─ server-safe utilities using tyme4ts / local dictionaries
```

### Recommended Project Structure

```text
src/
├── lib/content/              # typed content registry and seed-friendly objects
├── lib/seo.ts                # existing metadata helpers, extended with JSON-LD/page helpers
├── lib/almanac/              # scene matching, year validation, BaZi helpers
├── lib/tools/                # naming and city true solar time utilities if planner separates tools
├── components/seo/           # reusable content page sections, FAQ, breadcrumbs
└── app/[locale]/             # route templates for jieri, zodiac, feng-shui, tools
```

### Pattern 1: Single Route Registry
**What:** Define route slugs, locale SEO fields, FAQ, related links, and sitemap inclusion from a single typed data layer.
**When to use:** Any page family that appears in both route rendering and sitemap.
**Why:** Prevents pages from rendering without metadata, or sitemap entries for routes that do not exist.

### Pattern 2: Locale SEO Pair + Canonical Body
**What:** Keep `seo.zhHans` and `seo.zhHant` fields for title/description/H1, while long body copy is Simplified canonical and converted where appropriate.
**When to use:** Article and tool content where SEO copy must read naturally but long body duplication is too expensive.

### Pattern 3: Downgraded Match Reasons
**What:** Annual auspicious day results should carry a status such as `recommended`, `caution`, or `zodiac-conflict`, plus reason strings.
**When to use:** `/jieri/{scene}/{year}` pages and zodiac filter UI.

### Anti-Patterns to Avoid
- **Separate hardcoded page/sitemap lists:** Leads to broken sitemap coverage and missing hreflang.
- **Embedding long content in route files:** Makes future Prisma seeding difficult and bloats pages.
- **Claiming 0-5000 support without tests:** Local probe already shows year 0/1 are not straightforward.
- **Generating all dynamic 0-5000 URLs in sitemap:** Too many low-value URLs; violates the chosen sitemap strategy.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lunar/gan-zhi/BaZi base calculations | Custom calendar math | `tyme4ts` where verified | Calendar edge cases are complex; existing library already supports many APIs. |
| Simplified/Traditional conversion | Regex replacement | Existing `convertToTraditional` and metaphysics dictionary | Prevents incorrect metaphysics term conversion. |
| Schema.org object assembly per page | Duplicated JSON literals | SEO helper functions | Keeps structured data consistent and testable. |
| Form validation | Manual string checks | Zod schemas | Date/time/year/city inputs need clear error handling. |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Year 0/1 Support Assumed
**What goes wrong:** Routes accept 0-5000 but almanac/BaZi utilities throw at runtime for some years.
**Why it happens:** `tyme4ts` normalizes or validates early years in ways that reject year 0/1.
**How to avoid:** Add a Wave 1 probe and tests for 0, 1, 2, 1900, 2100, 5000 before broad route implementation.
**Warning signs:** `illegal solar year: 0`, `RangeError`, failed static param generation, or ISR runtime errors.

### Pitfall 2: Thin Content From Matrix Expansion
**What goes wrong:** Hundreds of pages differ only by year/scene tokens.
**Why it happens:** Route generation outpaces editorial data.
**How to avoid:** Each indexable page must render unique main copy, FAQ, and internal links from typed content.
**Warning signs:** Identical descriptions, repeated FAQ, or pages without scene-specific text.

### Pitfall 3: Hreflang Diverges From Actual Routes
**What goes wrong:** Metadata claims alternates that return 404 or wrong canonical.
**Why it happens:** Locale paths are assembled independently in many files.
**How to avoid:** Use a shared localized URL helper consumed by metadata and sitemap.

### Pitfall 4: Client Forms Break Static SEO Pages
**What goes wrong:** Tool pages become mostly client-rendered and lose indexable content.
**Why it happens:** Entire page marked `'use client'` for a small form.
**How to avoid:** Keep route pages as Server Components; isolate interactive form widgets into client components.
</common_pitfalls>

<code_examples>
## Code Examples

### Next.js Sitemap Route Shape

Official Next.js docs show a `sitemap.(js|ts)` file returning `MetadataRoute.Sitemap`, with each entry containing `url`, `lastModified`, `changeFrequency`, and `priority` fields. The docs also show sitemap entries can include `alternates.languages` for localized alternate URLs. Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

### Existing Project Metadata Helper

`src/lib/seo.ts` already provides `buildLocalizedMetadata({ locale, path, title, description })`, which sets canonical, `zh-Hans`/`zh-Hant` alternates, OG, Twitter, and Content-Language. Phase 3 should extend this instead of bypassing it.

### tyme4ts BaZi API Probe

```typescript
import { SolarTime } from 'tyme4ts';

const birthTime = SolarTime.fromYmdHms(2026, 5, 17, 11, 30, 0);
const eightChar = birthTime.getLunarHour().getEightChar();

eightChar.getYear().toString();
eightChar.getMonth().toString();
eightChar.getDay().toString();
eightChar.getHour().toString();
```

Local probe output for 2026-05-17 11:30 was year `丙午`, month `癸巳`, day `辛卯`, hour `甲午`.
</code_examples>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Separate sitemap package for all routes | Use App Router metadata routes when content registry is internal | Fewer dependencies and tighter control over alternates. |
| Route-level ad hoc SEO metadata | Shared metadata/JSON-LD helpers | Easier auditing and consistent hreflang/canonical output. |
| Fully client-rendered tool pages | Server-rendered content pages with isolated client widgets | Better crawlability and lower JS for SEO pages. |
</sota_updates>

<open_questions>
## Open Questions

- Can product accept year 2-5000 formal support if year 0/1 remain unsupported by `tyme4ts`, or must an alternate date model be introduced for year 0/1?
- Which Chinese city dataset will be used for true solar time: small static list, province capitals, or a larger local JSON table?
- How much article source collection is expected before implementation versus after route scaffolding?
</open_questions>

<validation_architecture>
## Validation Architecture

### Automated Tests Needed
- Unit tests for indexed year window calculation: with current date 2026-05-17, sitemap year range is 2006-2046.
- Unit tests for route year validation and tyme4ts support probes: 0, 1, 2, 1900, 2100, 5000.
- Unit tests for scene-to-yi matching and downgrade reasons.
- Unit tests for zodiac conflict detection.
- Unit tests for BaZi four-pillar extraction and five-element counting.
- Unit tests for China city true solar time correction math.
- Unit tests for content registry uniqueness: no duplicate slugs, all indexable entries have SEO fields, FAQ, and related links.
- Metadata/sitemap tests that verify canonical, alternates, Content-Language, and JSON-LD helper output.

### Manual/Browser Checks
- Playwright smoke checks for `/jieri/{scene}/{year}`, `/zodiac/{animal}`, a zodiac article, a Feng Shui article, BaZi tool, naming tool, and sitemap route.
- Mobile viewport checks for forms and long SEO pages to avoid horizontal overflow.
- HTML source checks that key content and JSON-LD are present without client interaction.

### Commands
- `npm run lint`
- `npm test`
- `npx tsc --noEmit`
- `npm run build`
</validation_architecture>

## Research Complete

Research is complete and sufficient for planning. Planner should treat 0/1 AD calendar support as the highest-risk item and plan it before route expansion.
