---
phase: 02-core-almanac-ui
plan: 01
status: complete
completed: 2026-05-17
commit: 6839901
---

# Plan 01 Summary: Homepage Upgrade

## What Was Built

Extended AlmanacService with getHourlyFortune method, built the TodayAlmanacCard with collapsible secondary info, the HourlyFortuneTable with calligraphy fortune markers, navigation links in the header, and upgraded the homepage to display both components.

## Files Changed

| File | Action | Description |
|------|--------|-------------|
| src/lib/almanac/types.ts | Modified | Added HourlyFortune interface |
| src/lib/almanac/cache.ts | Modified | Added getCachedHourlyFortune/setCachedHourlyFortune |
| src/lib/almanac/service.ts | Modified | Added getHourlyFortune method using tyme4ts LunarHour |
| src/i18n/messages/zh-hant.json | Modified | Added HourlyFortune namespace, expanded Almanac/Layout |
| src/i18n/messages/zh-hans.json | Modified | Added HourlyFortune namespace, expanded Almanac/Layout |
| src/components/almanac/FortuneMarker.tsx | Created | Calligraphy-style 吉/凶 marker (36px/20px) |
| src/components/almanac/YiJiBadgeList.tsx | Created | Yi/ji badges with Lucide icon mapping (21 activities) |
| src/components/almanac/TodayAlmanacCard.tsx | Created | Today's almanac card with collapsible secondary info |
| src/components/almanac/HourlyFortuneTable.tsx | Created | 12-shichen hourly fortune table (desktop table + mobile cards) |
| src/components/layout/NavigationLinks.tsx | Created | Header nav links with active state detection |
| src/components/layout/Header.tsx | Modified | Added NavigationLinks between brand and LocaleToggle |
| src/app/[locale]/page.tsx | Modified | Upgraded to fetch both daily almanac and hourly fortune |
| src/components/ui/*.tsx | Created | 6 shadcn components: tabs, badge, tooltip, table, scroll-area, collapsible |

## Verification

- `npx next build` passes
- All acceptance criteria verified via grep
- HourlyFortune interface: name, ganZhi, star, fortune, yi, ji
- Cache key: almanac:hourly:{dateStr}, TTL 86400
- FortuneMarker: text-primary for 吉, text-muted-foreground for 凶
- NavigationLinks: 3 links (/, /calendar, /solar-terms) with active state

## Deviations

None.
