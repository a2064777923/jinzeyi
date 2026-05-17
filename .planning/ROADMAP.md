# Roadmap: 今擇易 (JinZeYi)

## Overview

Five phases building from data foundation to production deployment. Phase 1 establishes the infrastructure everything depends on: i18n routing, almanac computation engine, caching, and database. Phase 2 builds the core almanac browsing experience that serves as both the homepage and the component library. Phase 3 expands into the SEO content matrix that drives organic traffic through thousands of pre-rendered pages. Phase 4 layers AI as the competitive differentiator -- personalized, explained fortune-telling powered by multi-provider AI. Phase 5 finalizes production deployment on self-hosted infrastructure.

## Phases

- [ ] **Phase 1: Foundation & Data Layer** - Project scaffolding, i18n, almanac engine, Redis cache, PostgreSQL, legal disclaimers
- [ ] **Phase 2: Core Almanac UI** - Today's almanac card, hourly fortune table, monthly calendar, solar terms
- [ ] **Phase 3: SEO Content Matrix** - Auspicious day queries, zodiac, BaZi, Feng Shui, naming tool, sitemap, structured data
- [ ] **Phase 4: AI Integration** - Vercel AI SDK, multi-provider registry, AI service layer, streaming API routes
- [ ] **Phase 5: Production Deployment** - Docker Compose, BaoTa + Nginx, PM2 cluster

## Phase Details

### Phase 1: Foundation & Data Layer
**Goal**: A working Next.js 16 app with i18n routing, almanac data service, Redis caching, PostgreSQL, responsive layout, and legal disclaimers baked in from day one
**Mode:** mvp (Walking Skeleton)
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, I18N-01, I18N-02, I18N-03, I18N-04, ALM-01, ALM-02, DATA-01, DATA-03
**Success Criteria** (what must be TRUE):
  1. User visits the site and sees a responsive layout that works on mobile, tablet, and desktop with Chinese-optimized typography (16-17px base font, red/gold theme)
  2. User switches between Traditional Chinese (/zh-hant/) and Simplified Chinese (/zh-hans/) via a nav bar toggle, and metaphysics terms convert correctly (e.g., "丑" stays "丑" not "醜")
  3. AlmanacService returns accurate daily almanac data (gan-zhi, lunar date, yi-ji, chong-sha) for any date in the 1900-2100 range, verified by regression tests
  4. Redis cache serves daily almanac data with 24h TTL; cache miss triggers computation and populates cache
  5. Every page displays a "文化研究/民俗文化工具" legal disclaimer in the footer
**Plans:** 3 plans
Plans:
- [x] 01-01-PLAN.md — Walking Skeleton: scaffold + i18n routing + Tailwind theme + layout shell (Header, Footer, LocaleToggle) ✓ 2026-05-17
- [x] 01-02-PLAN.md — Data Layer: Prisma schema + Redis/Prisma singletons + AlmanacService + homepage integration + schema push ✓ 2026-05-17
- [x] 01-03-PLAN.md — Verification: OpenCC metaphysics dictionary + tyme4ts regression tests + integration verification ✓ 2026-05-17

### Phase 2: Core Almanac UI
**Goal**: Users can browse today's almanac, check hourly fortune, navigate a monthly calendar, and look up solar terms -- the complete daily almanac experience
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: ALM-03, ALM-04, ALM-05, ALM-06, ALM-07
**Success Criteria** (what must be TRUE):
  1. Homepage displays today's almanac card showing public date, lunar date, gan-zhi, zodiac, yi-ji, chong-sha, god of wealth direction, and auspicious hours
  2. User can view a 12-shichen hourly fortune table with detailed yi-ji, star deities, chong-sha, and fortune ratings for each 2-hour period
  3. User navigates a monthly calendar view showing each day's fortune with color-coded indicators (auspicious in red/gold, inauspicious in grey), and can switch between months
  4. User can browse a solar terms page listing all 24 jie-qi with dates, meanings, and traditional customs
  5. User can access a daily almanac detail page at /almanac/YYYY-MM-DD with complete almanac information rendered via SSR/ISR
**Plans:** 4 plans
Plans:
- [x] 02-01-PLAN.md — Homepage upgrade: AlmanacService hourly fortune extension + TodayAlmanacCard + HourlyFortuneTable + Header nav links ✓ 2026-05-17
- [x] 02-02-PLAN.md — Monthly calendar: getMonthlyCalendar service + CalendarDayCell + MonthlyCalendar grid + month navigation ✓ 2026-05-17
- [x] 02-03-PLAN.md — Solar terms: getSolarTerms service + SolarTermsList grouped by season ✓ 2026-05-17
- [x] 02-04-PLAN.md — Detail page: 5-tab AlmanacDetail + SSR page with generateMetadata + URL-based tab state + 404 handling ✓ 2026-05-17

### Phase 3: SEO Content Matrix
**Goal**: Thousands of SEO-optimized pages are pre-rendered and discoverable, covering auspicious day queries, zodiac, BaZi, Feng Shui, naming, and solar terms -- driving organic search traffic
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09
**Success Criteria** (what must be TRUE):
  1. User can query auspicious days by scenario (wedding, moving, opening, renovation, contract, travel, burial, naming, matchmaking) and see annual lists at /jieri/{scene}/{year}
  2. User can browse 12 zodiac pages with fortune, compatibility, and personality analysis, pre-rendered via SSG for both locales
  3. User can enter a birth date/time and see a basic BaZi chart with four pillars displayed
  4. User can read Feng Shui knowledge articles and use a basic naming tool showing five-element attributes
  5. XML sitemaps are auto-generated per locale with hreflang annotations; all pages have JSON-LD structured data and optimized meta tags (title, description, keywords, Content-Language)
**Plans**: 6 plans
Plans:
- [x] 03-01-PLAN.md — Foundation: typed content registry, year guardrails, SEO helpers, shared SEO components, and Wave 0 tests ✓ 2026-05-17
- [x] 03-02-PLAN.md — Auspicious day matrix: `/jieri/{scene}/{year}` pages, matching, filters, metadata, and JSON-LD ✓ 2026-05-17
- [x] 03-03-PLAN.md — Zodiac matrix: hubs, article pages, compatibility/year tables, metadata, and JSON-LD ✓ 2026-05-17
- [x] 03-04-PLAN.md — Tools: BaZi chart, naming five-element analysis, tool pages, forms, and tests ✓ 2026-05-17
- [x] 03-05-PLAN.md — Feng Shui content: category landing, practical articles, checklists, metadata, and JSON-LD ✓ 2026-05-17
- [x] 03-06-PLAN.md — Sitemap and final SEO coverage: hreflang sitemap, metadata/JSON-LD coverage, smoke verification ✓ 2026-05-17

### Phase 4: AI Integration
**Goal**: Users can interact with an AI assistant that provides personalized, explained fortune-telling recommendations powered by multi-provider AI with automatic failover
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: AI-01, AI-02, AI-03, AI-04
**Success Criteria** (what must be TRUE):
  1. AIService abstracts multiple AI providers (DeepSeek, Qwen, OpenAI) behind a unified interface; switching providers requires only changing one environment variable
  2. AI API routes serve streaming responses; if the primary provider fails, requests automatically fall back to the next configured provider
  3. System prompts inject computed almanac data as context, so AI explanations reference accurate gan-zhi, yi-ji, and chong-sha values (not hallucinated)
  4. All AI configuration (provider, API keys) is managed through environment variables without code changes
**Plans**: TBD

### Phase 5: Production Deployment
**Goal**: The application runs in production on self-hosted infrastructure with proper process management, reverse proxy, SSL, and container orchestration
**Mode:** mvp
**Depends on**: Phase 3, Phase 4
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03
**Success Criteria** (what must be TRUE):
  1. Docker Compose orchestrates PostgreSQL 16, Redis 7, and the Next.js application in a single `docker compose up` command
  2. Nginx reverse proxy serves the application over HTTPS with SSL termination, WebSocket support for AI streaming, and static asset caching headers
  3. PM2 runs the Next.js app in cluster mode with memory limits, automatic restarts, and log rotation
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Layer | 3/3 | Planning complete | 2026-05-17 |
| 2. Core Almanac UI | 4/4 | Complete | 2026-05-17 |
| 3. SEO Content Matrix | 0/6 | Blocked on year 0/1 support | - |
| 4. AI Integration | 0/TBD | Not started | - |
| 5. Production Deployment | 0/TBD | Not started | - |
