# Phase 1: Foundation & Data Layer - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 1-Foundation & Data Layer
**Areas discussed:** Prisma schema design, OpenCC metaphysics dictionary, tyme4ts verification depth

---

## Prisma Schema Design

### Q1: How much schema should Phase 1 include?

| Option | Description | Selected |
|--------|-------------|----------|
| Lean (Phase 1 needs only) | Content pages, SEO meta, AI logs only. Keep it minimal — add tables when Phase 3 needs them. | |
| Full (design for all phases) | Include zodiac, BaZi, feng shui, naming tables now. More upfront work but Phase 3 can query structured data. | ✓ |
| Core + stubs | Phase 1 core tables + stub models for Phase 3 tables (empty schemas, no migrations). | |

**User's choice:** Full (design for all phases)
**Notes:** Design the complete schema upfront including zodiac, BaZi, feng shui, naming tables.

### Q2: How should content pages be stored?

| Option | Description | Selected |
|--------|-------------|----------|
| Content pages in DB | Pages stored in DB with title, slug, content, SEO meta, locale. Flexible for CMS-style management. | ✓ |
| Files + SEO meta in DB | Pages are file-based (MDX/TSX) with SEO meta stored in DB. Simpler, better for static content. | |
| Hybrid | Core pages in DB, SEO matrix pages are file-based with DB meta. | |

**User's choice:** Content pages in DB
**Notes:** Dynamic content approach. Good for SEO matrix pages in Phase 3.

### Q3: How should complex almanac data be modeled?

| Option | Description | Selected |
|--------|-------------|----------|
| JSON for flexible data | Use JSON columns for yi-ji lists, chong-sha details, hourly fortune. Prisma Json type. | ✓ |
| Fully normalized | Normalize everything into separate tables. Easier to query, more tables, more joins. | |
| Hybrid (columns + JSON) | Core fields as columns, detailed sub-data as JSON. Balance of queryability and flexibility. | |

**User's choice:** JSON for flexible data
**Notes:** Simpler schema for variable-length almanac data.

### Q4: How should multilingual content be modeled?

| Option | Description | Selected |
|--------|-------------|----------|
| Separate rows per locale | Every page needs locale as part of primary key. Content duplicated per locale. | ✓ |
| Single row with locale JSON | One row per page, content stored as JSON with locale keys. | |
| Translation table pattern | Base table for shared data, translation table for locale-specific content. | |

**User's choice:** Separate rows per locale
**Notes:** Simpler queries, more storage. Standard approach for i18n content.

---

## OpenCC Metaphysics Dictionary

### Q1: How comprehensive should the OpenCC custom dictionary be?

| Option | Description | Selected |
|--------|-------------|----------|
| Pre-build from tyme4ts | Build comprehensive dictionary upfront from tyme4ts output. Extract all terms and correct Traditional forms. | ✓ |
| Minimal + incremental | Start with minimal set of common terms. Add more as issues are discovered. | |
| Reactive (fix as found) | Use OpenCC's built-in conversion, only add custom rules for terms that break. | |

**User's choice:** Pre-build from tyme4ts
**Notes:** More work now, fewer bugs later. Comprehensive approach.

### Q2: How should the custom conversion rules be implemented?

| Option | Description | Selected |
|--------|-------------|----------|
| Static dictionary file | OpenCC custom dictionary file (JSON/text format) loaded at build time. | ✓ |
| Wrapper function | Custom conversion function that intercepts OpenCC output. | |
| Hybrid (dictionary + wrapper) | Static dictionary for common terms + wrapper for context-dependent conversions. | |

**User's choice:** Static dictionary file
**Notes:** Simple, no runtime overhead.

### Q3: How should OpenCC conversion accuracy be verified?

| Option | Description | Selected |
|--------|-------------|----------|
| Automated tests | Unit tests that verify each metaphysics term converts correctly. | ✓ |
| Manual review | Visual spot-checks during development. | |
| Critical-only tests | Automated tests for critical terms + manual review for less common terms. | |

**User's choice:** Automated tests
**Notes:** Catches regressions if OpenCC or dictionary is updated.

### Q4: How should OpenCC integrate with next-intl?

| Option | Description | Selected |
|--------|-------------|----------|
| next-intl handles routing, OpenCC handles content | Separate concerns. OpenCC only handles content conversion. | ✓ |
| Custom middleware for both | Custom middleware that does routing and content conversion in one pass. | |
| Something else | Let user describe preferred approach. | |

**User's choice:** next-intl handles routing, OpenCC handles content
**Notes:** Simpler, uses existing infrastructure. No custom middleware needed.

---

## tyme4ts Verification Depth

### Q1: How thorough should tyme4ts verification be?

| Option | Description | Selected |
|--------|-------------|----------|
| Full range regression | Systematic comparison against known reference for every year in 1900-2100. | ✓ |
| Boundary + sampling | Test key boundary dates plus random sampling. Good coverage, faster. | |
| Curated reference dates | Test a curated set of ~50 known dates with expected values. | |

**User's choice:** Full range regression
**Notes:** Most thorough approach. Takes longer to build but catches all edge cases.

### Q2: What should be the reference source for verifying tyme4ts output?

| Option | Description | Selected |
|--------|-------------|----------|
| Published 万年历 reference | Use published data (e.g., 中科院紫金山天文台) as source of truth. | ✓ |
| Cross-reference with lunar-javascript | Use another established library as cross-reference. | |
| Both sources | Use both published data AND lunar-javascript cross-reference. | |

**User's choice:** Published 万年历 reference
**Notes:** Most authoritative source.

### Q3: When should the regression tests run?

| Option | Description | Selected |
|--------|-------------|----------|
| CI pipeline | Run once during CI, store results. Fast feedback. | ✓ |
| Scheduled + on-demand | Run on schedule plus on-demand. Catches upstream changes. | |
| Pre-release only | Run manually before releases. Simplest. | |

**User's choice:** CI pipeline
**Notes:** Catches regressions on code changes.

### Q4: Which tyme4ts outputs should be verified?

| Option | Description | Selected |
|--------|-------------|----------|
| All almanac fields | Test gan-zhi, lunar date, yi-ji, chong-sha, zodiac, jie-qi — all outputs. | ✓ |
| Core fields only | Test only gan-zhi and lunar date — the most critical fields. | |
| Custom selection | Let user specify which fields to test. | |

**User's choice:** All almanac fields
**Notes:** Comprehensive verification of all tyme4ts outputs.

---

## Claude's Discretion

- AlmanacService API shape (methods, cache key strategy) — not discussed, deferred to Claude
- Redis cache key strategy and TTL configuration
- Responsive layout component structure
- Disclaimer framework implementation
- Project scaffolding details (directory structure, config files)

## Deferred Ideas

None — discussion stayed within phase scope.
