# Walking Skeleton — 今擇易 (JinZeYi)

**Phase:** 1
**Generated:** 2026-05-17

## Capability Proven End-to-End

A user visits the site, sees a responsive Chinese-optimized layout, toggles between Traditional and Simplified Chinese via the header, views today's almanac data (gan-zhi, lunar date, yi-ji) on the homepage served from a tyme4ts-backed AlmanacService with Redis caching, and sees a legal disclaimer in the footer.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.2.6 App Router | SSR/SSG/ISR for SEO; Server Components reduce client JS; built-in API routes for future AI endpoints |
| i18n | next-intl 4.12 with /zh-hant/ /zh-hans/ URL prefix | De facto standard for Next.js App Router i18n; SEO-friendly locale URLs; middleware-based detection |
| CSS | Tailwind CSS 4.3 (CSS-first config) | No tailwind.config.js; @theme in CSS for Chinese design tokens; utility-first for content-heavy pages |
| Component library | shadcn/ui 4.7 (Radix UI primitives) | Copy-paste components; fully customizable; no dependency lock-in; New York style |
| Database | PostgreSQL 16 + Prisma 7.8 | Schema-first; type-safe queries; full schema for all phases (D-01) |
| Cache | Redis 7 + ioredis 5.10 | Daily almanac data is read-heavy, write-once-per-day; 24h TTL; self-hosted deployment |
| Calendar engine | tyme4ts 1.4.6 | TypeScript-native; zero deps; comprehensive API (干支, 农历, 宜忌, 冲煞, 生肖, 节气); by 6tail |
| Chinese conversion | opencc-js 1.3.1 + custom dictionary | Pure JS (no native deps); custom metaphysics dictionary for correct 干支/生肖/节气 conversion (D-05/D-06) |
| Validation | zod 4.4 | Runtime validation for API requests; TypeScript inference; Prisma integration |
| Test framework | vitest | Fast; native TypeScript support; Vite-powered; recommended for Next.js 16 |
| Directory layout | src/ with app/[locale]/ routing | Standard Next.js App Router; locale as URL segment; lib/ for services; components/ for UI |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js 16, TypeScript, ESLint, Tailwind v4, shadcn/ui, vitest)
- [x] Routing — /zh-hant/ and /zh-hans/ with next-intl middleware
- [x] Database — Prisma schema (full for all phases per D-01), db push, singleton client
- [x] UI — Header with locale toggle, Footer with disclaimer, responsive layout
- [x] Cache — Redis singleton, AlmanacService with 24h TTL caching
- [x] Local run command: `npm run dev` (requires PostgreSQL + Redis running)

## Project Structure

```
src/
├── app/
│   ├── [locale]/                    # i18n locale segment
│   │   ├── layout.tsx               # Root layout with fonts, header, footer
│   │   └── page.tsx                 # Homepage — today's almanac
│   ├── api/
│   │   └── almanac/
│   │       └── route.ts             # Almanac API endpoint
│   └── layout.tsx                   # HTML shell (<html>, <body>)
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Sticky header with brand + locale toggle
│   │   ├── Footer.tsx               # Legal disclaimer + copyright
│   │   └── LocaleToggle.tsx         # 繁體/简体 toggle button
│   └── ui/                          # shadcn/ui components (auto-generated)
├── i18n/
│   ├── routing.ts                   # next-intl routing config
│   ├── request.ts                   # next-intl request config
│   └── messages/
│       ├── zh-hant.json             # Traditional Chinese messages
│       └── zh-hans.json             # Simplified Chinese messages
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── redis.ts                     # ioredis client singleton
│   ├── opencc.ts                    # OpenCC conversion with custom dictionary
│   └── almanac/
│       ├── service.ts               # AlmanacService (tyme4ts wrapper)
│       ├── types.ts                 # Almanac data types
│       └── cache.ts                 # Redis cache helpers
├── dictionaries/
│   └── metaphysics-zh-hans.json     # OpenCC custom dictionary for metaphysics terms
├── styles/
│   └── globals.css                  # Tailwind + CSS variables (Chinese theme)
└── types/
    └── almanac.ts                   # Shared type definitions

prisma/
└── schema.prisma                    # Full schema for all phases

tests/
├── almanac/
│   ├── tyme4ts.test.ts              # tyme4ts API verification
│   ├── regression.test.ts           # 1900-2100 regression
│   └── service.test.ts              # AlmanacService integration
├── i18n/
│   └── opencc.test.ts               # OpenCC conversion accuracy
└── setup.ts                         # Shared test fixtures
```

## Out of Scope (Deferred to Later Slices)

- Dark theme (Phase 2+)
- Almanac UI components (hourly fortune table, monthly calendar, solar terms) — Phase 2
- SEO content matrix (zodiac, BaZi, feng shui, naming pages) — Phase 3
- AI integration (Vercel AI SDK, streaming) — Phase 4
- Production deployment (Docker, Nginx, PM2) — Phase 5
- User authentication — v2
- Payment integration — v2

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Core Almanac UI — today's almanac card, hourly fortune table, monthly calendar, solar terms
- Phase 3: SEO Content Matrix — auspicious day queries, zodiac, BaZi, feng shui, naming, sitemap
- Phase 4: AI Integration — multi-provider AI, streaming responses, personalized recommendations
- Phase 5: Production Deployment — Docker Compose, Nginx, PM2 cluster
