---
phase: 01-foundation-data-layer
plan: 02
subsystem: data
tags: [prisma, postgresql, redis, tyme4ts, almanac, caching]

# Dependency graph
requires:
  - "01-01 (project scaffold, i18n, layout shell)"
provides:
  - "Full Prisma schema for all phases (7 models)"
  - "Prisma 7 adapter pattern with @prisma/adapter-pg"
  - "Prisma client singleton"
  - "ioredis client singleton"
  - "AlmanacService wrapping tyme4ts with Redis cache"
  - "DailyAlmanac type definition"
  - "Homepage displaying today's almanac data"
affects: [01-03, 02-core-almanac-ui, 03-seo-matrix, 04-ai-integration]

# Tech tracking
tech-stack:
  added: [prisma, @prisma/adapter-pg, pg, ioredis, tyme4ts]
  patterns: [prisma-adapter-pattern, redis-singleton, almanac-service, server-component-data-fetch]

key-files:
  created:
    - "prisma/schema.prisma — Full database schema for all phases (7 models)"
    - "prisma.config.ts — Prisma 7 datasource configuration"
    - "src/lib/prisma.ts — Prisma client singleton with adapter pattern"
    - "src/lib/redis.ts — ioredis client singleton"
    - "src/lib/almanac/types.ts — DailyAlmanac interface"
    - "src/lib/almanac/cache.ts — Redis cache helpers with 24h TTL"
    - "src/lib/almanac/service.ts — AlmanacService wrapping tyme4ts"
  modified:
    - "src/app/[locale]/page.tsx — Homepage with almanac data display"
    - "src/i18n/messages/zh-hant.json — Added Almanac translation keys"
    - "src/i18n/messages/zh-hans.json — Added Almanac translation keys"
    - "package.json — Added @prisma/adapter-pg, pg dependencies"
    - "prisma.config.ts — Fixed to use env() helper"

key-decisions:
  - "Used Prisma 7 adapter pattern (@prisma/adapter-pg) instead of legacy url-in-schema"
  - "Used env() from prisma/config instead of process.env for DATABASE_URL"
  - "AlmanacService catches Redis errors gracefully — returns computed data without caching"
  - "Homepage is dynamic (SSR) to fetch fresh almanac data per request"

patterns-established:
  - "Prisma 7 config: defineConfig with env() helper in prisma.config.ts"
  - "Prisma client singleton: adapter pattern with @prisma/adapter-pg"
  - "Redis singleton: ioredis with lazyConnect, globalThis pattern"
  - "Almanac service: tyme4ts computation → Redis cache → return"

requirements-completed: [FOUND-03, FOUND-04, ALM-01, ALM-02, DATA-03]

# Metrics
duration: 7min
completed: 2026-05-17
---

# Phase 1 Plan 02: Data Layer + AlmanacService Summary

**Prisma 7 schema (7 models for all phases), PostgreSQL adapter pattern, Redis cache singleton, AlmanacService wrapping tyme4ts for daily almanac computation with 24h Redis caching, homepage wired to display today's almanac data**

## Performance

- **Duration:** 7 min
- **Started:** 2026-05-16T17:27:26Z
- **Completed:** 2026-05-16T17:33:59Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Full Prisma schema with 7 models covering all phases (ContentPage, AlmanacQuery, ZodiacProfile, BaZiProfile, FengShuiArticle, NamingRecord, AiQueryLog)
- Prisma 7 adapter pattern with @prisma/adapter-pg (breaking change from v5/6)
- Prisma client singleton and ioredis client singleton
- AlmanacService wrapping tyme4ts with verified API methods (gan-zhi, lunar, yi-ji, zodiac, directions, gods, duty, twenty-eight stars, peng-zu, sound, fetus day)
- Redis cache helpers with 24h TTL and graceful error handling
- Homepage displaying today's almanac data with yi/ji badges and direction info
- Almanac translation keys for both zh-hant and zh-hans

## Task Commits

Each task was committed atomically:

1. **Task 1: Prisma schema + singletons + AlmanacService** - `2e4aeab` (feat)
2. **Task 2: Homepage integration + almanac display** - `aa66f4b` (feat)

## Files Created/Modified

- `prisma/schema.prisma` — Full database schema (7 models)
- `prisma.config.ts` — Prisma 7 datasource config with env() helper
- `src/lib/prisma.ts` — Prisma client singleton (adapter pattern)
- `src/lib/redis.ts` — ioredis client singleton
- `src/lib/almanac/types.ts` — DailyAlmanac interface
- `src/lib/almanac/cache.ts` — Redis cache helpers (getCachedAlmanac, setCachedAlmanac)
- `src/lib/almanac/service.ts` — AlmanacService (getDailyAlmanac)
- `src/app/[locale]/page.tsx` — Homepage with almanac data display
- `src/i18n/messages/zh-hant.json` — Added Almanac translation keys
- `src/i18n/messages/zh-hans.json` — Added Almanac translation keys
- `package.json` — Added @prisma/adapter-pg, pg, @types/pg

## Decisions Made

- Prisma 7 requires adapter pattern — used @prisma/adapter-pg for PostgreSQL
- env() from prisma/config required instead of process.env for datasource URL
- AlmanacService catches Redis errors gracefully (returns computed data without caching)
- Homepage is dynamic (SSR) to fetch fresh almanac data per request

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prisma 7 breaking change: url no longer in schema**
- **Found during:** Task 1 (Prisma schema validation)
- **Issue:** Prisma 7 removed `url` property from datasource in schema.prisma. Error: "The datasource property `url` is no longer supported in schema files"
- **Fix:** Created `prisma.config.ts` with `defineConfig` and `env('DATABASE_URL')`; removed `url` from schema.prisma
- **Files modified:** prisma/schema.prisma, prisma.config.ts
- **Committed in:** 2e4aeab (Task 1 commit)

**2. [Rule 3 - Blocking] Prisma 7 requires adapter pattern for PrismaClient**
- **Found during:** Task 1 (Prisma client creation)
- **Issue:** Prisma 7 PrismaClient requires either `adapter` or `accelerateUrl` — no longer accepts DATABASE_URL directly
- **Fix:** Installed @prisma/adapter-pg and pg; updated src/lib/prisma.ts to use PrismaPg adapter
- **Files modified:** src/lib/prisma.ts, package.json
- **Committed in:** 2e4aeab (Task 1 commit)

**3. [Rule 3 - Blocking] Prisma 7 env() helper required for config**
- **Found during:** Task 2 (Schema push attempt)
- **Issue:** `process.env.DATABASE_URL` returns undefined in prisma.config.ts — Prisma 7's env() helper is required
- **Fix:** Changed to `import { env } from 'prisma/config'` and used `env('DATABASE_URL')`
- **Files modified:** prisma.config.ts
- **Committed in:** aa66f4b (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All deviations related to Prisma 7 breaking changes from v5/6. No scope creep.

## Blocking Issues

**1. PostgreSQL not running — Schema push blocked**
- **Found during:** Task 2 (Schema push)
- **Issue:** PostgreSQL is not installed/running on this machine. `npx prisma db push` fails with "Can't reach database server"
- **Impact:** Schema cannot be pushed to database. Homepage will work at runtime once PostgreSQL is available.
- **Resolution required:** User must install/start PostgreSQL and create the jinzeyi database before `npx prisma db push` can succeed.

## Issues Encountered

- Prisma 7 has significant breaking changes from v5/6 that were not anticipated in research
- tyme4ts API verified successfully — all methods work as documented in RESEARCH.md

## User Setup Required

1. **PostgreSQL** — Install and start PostgreSQL, create database 'jinzeyi' and user
2. **Run schema push** — `DATABASE_URL="..." npx prisma db push`
3. **Redis** — Ensure Redis is running for cache layer (optional for dev — graceful fallback)

## Next Phase Readiness

- AlmanacService ready for Phase 2 UI components
- Prisma schema covers all phase tables — Phase 3 can query structured data
- Redis cache layer operational (requires Redis running)
- Homepage displays almanac data once PostgreSQL is available

## Self-Check: PASSED

- All 7 key files verified present (prisma/schema.prisma, prisma.config.ts, src/lib/prisma.ts, src/lib/redis.ts, src/lib/almanac/types.ts, src/lib/almanac/cache.ts, src/lib/almanac/service.ts)
- Both task commits verified in git log (2e4aeab, aa66f4b)
- TypeScript compilation passes
- Next.js build succeeds
- Schema validates (npx prisma validate passes)
- Schema push blocked by missing PostgreSQL (documented as blocking issue)

---

*Phase: 01-foundation-data-layer*
*Completed: 2026-05-17*
