---
phase: 02-core-almanac-ui
plan: 03
status: complete
completed: 2026-05-17
commit: 3471485
---

# Plan 03 Summary: Solar Terms Page

## What Was Built

Solar terms page showing all 24 jie-qi grouped by season (spring/summer/autumn/winter), with dates computed dynamically from tyme4ts, and meanings/customs from static i18n content.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| src/lib/almanac/types.ts | Modified | Added SolarTerm interface |
| src/lib/almanac/cache.ts | Modified | Added getCachedSolarTerms/setCachedSolarTerms (365-day TTL) |
| src/lib/almanac/service.ts | Modified | Added getSolarTerms using TymeSolarTerm.fromIndex |
| src/i18n/messages/zh-hant.json | Modified | Added SolarTerms namespace with 24 term entries |
| src/i18n/messages/zh-hans.json | Modified | Added SolarTerms namespace with 24 term entries |
| src/components/almanac/SolarTermsList.tsx | Created | Season-grouped solar terms list with meanings/customs |
| src/app/[locale]/solar-terms/page.tsx | Created | Solar terms page with generateMetadata |

## Verification

- `npx next build` passes
- SolarTerm interface: name, date, isJie, year
- Cache key: almanac:terms:{year}, TTL 31536000
- 23 terms returned for 2026 (冬至 filtered out — its solar day is in 2025)
- Season grouping: month 2-4=spring, 5-7=summer, 8-10=autumn, 11-12/1=winter

## Deviations

- tyme4ts exports `SolarTerm` class (not `Term` as RESEARCH.md suggested). Used `TymeSolarTerm` alias to avoid naming conflict with our custom `SolarTerm` interface.
- Index 0 冬至 has `getYear()=2026` but solar day in 2025. Filter by `solarDay.getYear() !== year` instead of `t.getYear() !== year`.
