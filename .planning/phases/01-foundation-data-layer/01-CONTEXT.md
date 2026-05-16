# Phase 1: Foundation & Data Layer - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

A working Next.js 16 app with i18n routing (next-intl, /zh-hant/ /zh-hans/), almanac data service (tyme4ts), Redis caching (24h TTL), PostgreSQL (Prisma 7), responsive layout (mobile-first, Chinese-optimized typography), and legal disclaimers. This is the foundation that Phases 2-5 build on — every subsequent phase depends on the infrastructure established here.

**Requirements:** FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, I18N-01, I18N-02, I18N-03, I18N-04, ALM-01, ALM-02, DATA-01, DATA-03

</domain>

<decisions>
## Implementation Decisions

### Prisma Schema Design
- **D-01:** Full schema design for all phases — include zodiac, BaZi, feng shui, naming tables now (not just Phase 1 needs). Phase 3 SEO matrix can query structured data instead of computing on-the-fly.
- **D-02:** Content pages stored in DB with title, slug, content, SEO meta, locale. Not file-based. Flexible for CMS-style management.
- **D-03:** JSON columns for flexible almanac data — yi-ji (宜忌) lists, chong-sha (冲煞) details, hourly fortune. Prisma Json type. Simpler schema, variable-length data.
- **D-04:** Separate rows per locale for multilingual content. Every content page has zh-hant and zh-hans as separate rows. Simpler queries, more storage.

### OpenCC Metaphysics Dictionary
- **D-05:** Pre-build comprehensive dictionary from tyme4ts output. Extract all 天干, 地支, 生肖, 节气, 神煞 terms and their correct Traditional forms upfront. Not incremental.
- **D-06:** Static dictionary file implementation (JSON/text format). Loaded at build time. No runtime wrapper functions.
- **D-07:** Automated tests for conversion accuracy. Unit tests that verify each metaphysics term converts correctly between Traditional and Simplified Chinese.
- **D-08:** next-intl handles locale routing, OpenCC handles content conversion. Separate concerns, no custom middleware.

### tyme4ts Verification
- **D-09:** Full range regression testing (1900-2100). Systematic comparison against published 万年历 reference data.
- **D-10:** Published 万年历 (e.g., 中科院紫金山天文台) as the source of truth. Not cross-referencing with other libraries.
- **D-11:** CI pipeline execution. Tests run on every code change, not scheduled or pre-release only.
- **D-12:** All almanac fields verified — gan-zhi (干支), lunar date (农历), yi-ji (宜忌), chong-sha (冲煞), zodiac (生肖), jie-qi (节气).

### AlmanacService API Shape
- **D-13:** Claude's discretion — AlmanacService wraps tyme4ts, exposes methods for daily almanac data, hourly fortune, monthly calendar. Redis cache key strategy (per-date vs per-query-type) is Claude's choice.

### Claude's Discretion
- Redis cache key strategy and TTL configuration
- Responsive layout component structure (mobile-first approach)
- Disclaimer framework implementation (footer component pattern)
- Project scaffolding details (directory structure, config files)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Configuration
- `.planning/PROJECT.md` — Project definition, core value, requirements, constraints, key decisions
- `.planning/REQUIREMENTS.md` — Full v1 requirements (28 items) with traceability matrix
- `.planning/ROADMAP.md` — 5-phase roadmap with goals, dependencies, success criteria
- `.planning/STATE.md` — Current project state, accumulated context, session continuity
- `CLAUDE.md` — Project-specific guidelines, tech stack, conventions, architecture notes

### Technology Stack (from CLAUDE.md)
- Next.js 16 + TypeScript 5.x + React 19.x — App Router with SSR/SSG/ISR
- Tailwind CSS 4.3.x + shadcn/ui 2.9.x — CSS-first config, Chinese design tokens
- next-intl 4.12.x — i18n routing with /zh-hant/ /zh-hans/ URL prefixes
- PostgreSQL 16.x + Prisma 7.8.x — Schema-first design, type-safe queries
- ioredis 5.10.x + Redis 7.x — Cache layer for daily almanac data
- tyme4ts 1.4.x — TypeScript-native lunar library by 6tail
- zod 4.4.x — Schema validation for API requests and AI responses

### External References
- tyme4ts npm: https://www.npmjs.com/package/tyme4ts — Chinese calendar algorithm library
- next-intl docs: https://next-intl.dev — i18n routing for Next.js App Router
- Prisma docs: https://www.prisma.io/docs — ORM and migration workflow
- shadcn/ui docs: https://ui.shadcn.com — Component primitives

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. No existing code.

### Established Patterns
- None — patterns will be established in this phase.

### Integration Points
- This phase creates the foundation that all subsequent phases integrate with:
  - Phase 2 (Core Almanac UI) consumes AlmanacService
  - Phase 3 (SEO Matrix) extends the Prisma schema and uses the i18n infrastructure
  - Phase 4 (AI Integration) adds AI service layer on top of the existing architecture
  - Phase 5 (Deployment) containerizes the app built in this phase

</code_context>

<specifics>
## Specific Ideas

- Reference site: http://jiton.com.cn/ — existing 黄道吉日/老黄历 tool site. New version needs SSR/SSG instead of JavaScript-heavy rendering.
- Brand name "今擇易" — 今日择吉，简易明白. Red/gold color theme, modern (not kitsch).
- Chinese typography: 16-17px base font size, Noto Sans SC (简体) / Noto Sans TC (繁體), max-w-prose or max-w-[65ch] for readability.
- Legal disclaimer: "文化研究/民俗文化工具" statement on every page footer.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1-Foundation & Data Layer*
*Context gathered: 2026-05-17*
