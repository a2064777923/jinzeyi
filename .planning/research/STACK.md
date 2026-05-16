# Technology Stack

**Project:** 今擇易 (JinZeYi) — AI 黄历择吉工具平台
**Researched:** 2026-05-16
**Overall confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.2.x | Full-stack React framework | App Router with SSR/SSG/ISR for SEO; built-in API routes for AI endpoints; `generateStaticParams` for pre-rendering thousands of almanac pages; latest stable release |
| TypeScript | 5.x | Type safety | Non-negotiable for data-heavy domain (calendar calculations, API integrations, Prisma types) |
| React | 19.x | UI library | Bundled with Next.js 16; Server Components reduce client JS for content-heavy pages |

**Confidence:** HIGH — Verified via npm registry (Next.js 16.2.6, next-intl 4.12.0 confirms Next.js 16 peer dep support).

### Internationalization (繁简体)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-intl | 4.12.x | i18n routing + translations | De facto standard for Next.js App Router i18n; middleware-based locale detection; supports `zh-hant`/`zh-hans` URL prefixes; ICU message syntax; Server Component native |

**Configuration pattern:**

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh-hant', 'zh-hans'],
  defaultLocale: 'zh-hant',  // Traditional Chinese default (primary audience: HK/TW/海外)
  localePrefix: 'always',    // Always show /zh-hant/ or /zh-hans/ in URL for SEO
  pathnames: {
    '/': '/',
    '/jieri/jiehun': {
      'zh-hant': '/jieri/jiehun',
      'zh-hans': '/jieri/jiehun'  // Same pinyin path, different content rendering
    },
    '/tools/zodiac': {
      'zh-hant': '/tools/zodiac',
      'zh-hans': '/tools/zodiac'
    }
  }
});
```

**Why `zh-hant`/`zh-hans` over `zh-TW`/`zh-CN`:** BCP 47 script subtags are correct for language variant. Region codes (`zh-TW`) imply geography, not script. A user in Taiwan may want simplified, and vice versa. Script codes are SEO-neutral and technically correct.

**Why NOT `next-i18next`:** Pages Router only, incompatible with App Router. Abandoned in favor of next-intl ecosystem.

**Confidence:** HIGH — Verified via Context7 docs and npm.

### UI Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.3.x | Utility-first CSS | v4 is the current stable; CSS-first config (no tailwind.config.js); native `@theme` for Chinese design tokens; excellent for content-heavy pages |
| shadcn/ui | 2.9.x (CLI) | Component primitives | Copy-paste components (not a dependency); built on Radix UI; fully customizable; Card/Button/Dialog/Tabs for almanac UI patterns |
| Lucide React | latest | Icon library | Bundled with shadcn/ui; clean line icons suitable for traditional Chinese aesthetic |
| next/font | built-in | Chinese font loading | `Noto Sans SC` (简体) / `Noto Sans TC` (繁體) via Google Fonts; automatic subsetting; zero layout shift |

**Chinese UI design considerations:**
- Use `font-family` with both SC and TC variants; switch via `next-intl` locale
- Traditional Chinese characters are visually denser — slightly larger base font size (16-17px)
- Chinese content is typically wider — use `max-w-prose` or `max-w-[65ch]` for readability
- Color palette: red/gold for auspicious themes, but keep it modern (not kitsch)

**Why NOT Ant Design:** Opinionated design language conflicts with custom branding; heavy bundle for a content site; shadcn/ui gives control without lock-in.

**Confidence:** HIGH — shadcn/ui v2/v3 CLI verified via Context7; Tailwind v4 verified via npm.

### Database

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL | 16.x | Primary database | Robust, mature; JSON support for flexible almanac data; full-text search for Chinese content; excellent Prisma support |
| Prisma | 7.8.x | ORM + migrations | Type-safe queries; schema-first design; migration system; Prisma Studio for data exploration; excellent DX |

**Prisma schema design for almanac domain:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core almanac data — computed daily, cached aggressively
model DailyAlmanac {
  id          Int      @id @default(autoincrement())
  solarDate   DateTime @unique  // 公历日期
  lunarDate   String            // 农历日期 (e.g., "二〇二六年四月初一")
  ganzhi      String            // 干支 (e.g., "丙午年 癸巳月 庚寅日")
  zodiac      String            // 生肖
  yi          String[]          // 宜
  ji          String[]          // 忌
  chongSha    String            // 冲煞
  caiShen     String            // 财神方位
  jiShi       Json              // 吉时详情 (时辰数据)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// SEO content pages — pre-rendered
model SeoPage {
  id        Int      @id @default(autoincrement())
  slug      String   @unique   // e.g., "jieri-jiehun"
  locale    String              // "zh-hant" | "zh-hans"
  title     String
  content   String   @db.Text
  metaDesc  String
  type      String              // "jieri" | "zodiac" | "fengshui" | "bazi" | "name"
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([slug, locale])
}

// AI conversation logs (for analytics, not user accounts)
model AiConversation {
  id         Int      @id @default(autoincrement())
  sessionId  String              // Browser session, not user account
  provider   String              // "deepseek" | "qwen" | "openai"
  prompt     String   @db.Text
  response   String   @db.Text
  tokensUsed Int
  createdAt  DateTime @default(now())
}
```

**Why NOT MongoDB:** Relational data (almanac dates, SEO pages, locale variants) benefits from PostgreSQL's constraints and joins. Prisma's type safety is superior with relational models.

**Confidence:** HIGH — Prisma 7.8.0 verified via npm; schema patterns are standard.

### Caching

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| ioredis | 5.10.x | Redis client | Most popular Node.js Redis client; cluster/sentinel support; pipeline support; TypeScript types |
| Redis | 7.x | Cache layer | Daily almanac data is read-heavy, write-once-per-day; perfect cache pattern |

**Caching strategy for almanac data:**

```
Cache Key Pattern:
  almanac:daily:{YYYY-MM-DD}     → Full daily almanac JSON (TTL: 24h or until next day)
  almanac:month:{YYYY-MM}        → Monthly overview (TTL: 24h)
  seo:page:{locale}:{slug}       → Pre-rendered SEO content (TTL: 1h, revalidate)
  ai:rate:{sessionId}            → Rate limiting for AI endpoints (TTL: 1h)
```

**Why Redis over in-memory cache:** Shared state across PM2 cluster instances; survives app restarts; TTL support for daily data rotation.

**Why NOT Prisma Accelerate:** Adds latency for a self-hosted deployment; Redis on same server is faster and free.

**Confidence:** HIGH — ioredis 5.10.1 verified via npm; caching patterns are standard.

### AI Integration

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel AI SDK | 6.0.x | AI abstraction layer | Unified API for multiple providers; streaming support; `streamText`/`generateText`; provider registry for hot-swapping; tool calling support |
| @ai-sdk/openai | 3.0.x | OpenAI provider | Works with DeepSeek (OpenAI-compatible endpoint) |
| @ai-sdk/openai-compatible | 2.0.x | Generic OpenAI-compat | For 阿里云百炼/通义千问 (DashScope compatible endpoint) |

**Multi-provider abstraction pattern:**

```typescript
// src/lib/ai/providers.ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createProviderRegistry } from 'ai';

// DeepSeek — OpenAI-compatible API
const deepseek = createOpenAICompatible({
  name: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// 阿里云百炼/通义千问 — DashScope OpenAI-compatible endpoint
const qwen = createOpenAICompatible({
  name: 'qwen',
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

export const registry = createProviderRegistry({
  deepseek,
  qwen,
}, { separator: '/' });

// Usage: registry.languageModel('deepseek/deepseek-chat')
//        registry.languageModel('qwen/qwen-plus')
```

**Why Vercel AI SDK over raw OpenAI SDK:**
- Provider registry lets you swap DeepSeek/Qwen/OpenAI with zero code changes
- Built-in streaming with `toUIMessageStreamResponse()` for Next.js route handlers
- Tool calling for structured AI responses (e.g., returning date recommendations as JSON)
- Rate limiting, retries, and error handling built in

**Why NOT separate SDKs per provider:** The whole point of AI-01 (抽象接口层) is provider independence. Vercel AI SDK gives you this out of the box.

**Provider recommendation (cost/quality for Chinese fortune content):**

| Provider | Model | Cost | Chinese Quality | Use Case |
|----------|-------|------|-----------------|----------|
| DeepSeek | deepseek-chat | Low | Excellent | Default for general fortune queries |
| 阿里云百炼 | qwen-plus | Medium | Excellent | Backup; better for complex 八字 analysis |
| 阿里云百炼 | qwen-max | High | Best | Premium tier (future paid features) |

**Confidence:** HIGH — AI SDK 6.0.184 verified via npm; provider patterns verified via Context7 docs; DeepSeek/Qwen OpenAI-compatible endpoints confirmed via official documentation.

### Chinese Calendar Algorithms

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| lunar-javascript | 1.7.x | 万年历核心算法 | Most comprehensive Chinese calendar library; zero dependencies; supports 农历/干支/生肖/节气/宜忌/八字/五行/星宿; by 6tail (active maintainer) |
| tyme4ts | 1.4.x | Lunar library (TypeScript) | TypeScript-native rewrite by same author (6tail); better type safety; "升级版" of lunar-javascript |

**Recommendation: Use `tyme4ts` as primary, `lunar-javascript` as fallback.**

`tyme4ts` is the TypeScript-native evolution of `lunar-javascript` by the same author. It has better type safety and cleaner API design. However, `lunar-javascript` is more battle-tested and has wider adoption. Start with `tyme4ts`; fall back to `lunar-javascript` if specific features are missing.

**What these libraries provide (DATA-01 coverage):**

```
lunar-javascript / tyme4ts:
  - 公历 <-> 农历 conversion
  - 干支 (Year/Month/Day/Hour Pillars)
  - 生肖 (Chinese Zodiac)
  - 节气 (24 Solar Terms)
  - 宜忌 (Auspicious/Inauspicious activities) ← ALMANAC-01 core
  - 冲煞 (Clash/Evil directions)
  - 财神/喜神/福神 方位
  - 胎神方位
  - 彭祖百忌
  - 星宿 (28 Mansions)
  - 八字排盘 (Four Pillars) ← SEO-03
  - 五行 (Five Elements)
  - 纳音
```

**What needs third-party API (DATA-02):**
- Complex 八字 大运/流年 analysis
- 专业风水罗盘 calculations
- 姓名学 五格剖象 detailed scoring

**Confidence:** MEDIUM-HIGH — Package descriptions verified via npm; feature set based on npm description and GitHub. Actual API surface should be verified during implementation.

### SEO & Sitemap

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-sitemap | 4.2.x | Sitemap generation | Auto-generates sitemap.xml from routes; supports i18n alternate hreflang; works with App Router |
| Next.js Metadata API | built-in | Meta tags | `generateMetadata()` for dynamic title/description/OG tags per page |

**SSG/SSR strategy for SEO-heavy content:**

```
Page Type              | Rendering    | Rationale
-----------------------|--------------|------------------------------------------
/ (homepage)           | ISR (1h)     | Daily almanac changes; cache then revalidate
/jieri/jiehun          | SSG          | Static SEO content; pre-render at build
/jieri/banjiayellow    | SSG          | Static SEO content
/tools/zodiac          | SSG          | Static knowledge pages
/tools/bazi            | SSR          | User-input driven (date of birth)
/tools/fengshui        | SSG          | Static knowledge
/zh-hant/[...slug]     | SSG+ISR      | Locale variants of above
/api/chat              | SSR (stream) | AI streaming endpoint
/api/almanac/[date]    | SSR+cache    | Redis-cached daily data API
```

**Key SEO patterns:**

```typescript
// app/[locale]/jieri/[slug]/page.tsx
export async function generateStaticParams() {
  const pages = await prisma.seoPage.findMany({
    where: { type: 'jieri', published: true },
    select: { slug: true, locale: true }
  });
  return pages.map(p => ({ locale: p.locale, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params.locale, params.slug);
  return {
    title: page.title,
    description: page.metaDesc,
    alternates: {
      languages: {
        'zh-Hant': `/zh-hant/jieri/${params.slug}`,
        'zh-Hans': `/zh-hans/jieri/${params.slug}`,
      }
    }
  };
}
```

**Baidu SEO specifics:**
- Submit sitemap to 百度搜索资源平台 (ziyuan.baidu.com)
- Use `lang="zh-Hant"` / `lang="zh-Hans"` in `<html>` tag
- Baidu respects `hreflang` but also needs `Content-Language` header
- Baidu crawls JavaScript but prefers SSR/SSG (confirmed by PROJECT.md reference site needing Playwright)

**Confidence:** HIGH — next-sitemap 4.2.3 verified via npm; Next.js Metadata API is well-documented.

### Validation & Utilities

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | 4.4.x | Schema validation | API request validation; environment variable parsing; AI response schema |
| date-fns | latest | Date manipulation | Calendar calculations that `lunar-javascript` doesn't cover; formatting |
| sharp | 0.34.x | Image processing | OG image generation; image optimization for SEO pages |
| @tanstack/react-query | 5.x | Client data fetching | AI chat interface; real-time almanac updates; optimistic UI |

**Confidence:** HIGH — All versions verified via npm.

### Deployment

| Technology | Purpose | Why |
|------------|---------|-----|
| PM2 | Process manager | Cluster mode for Next.js; auto-restart; log management; zero-downtime reload |
| Nginx (宝塔) | Reverse proxy + SSL | Static file serving; SSL termination; gzip compression; security headers |
| Docker Compose | Service orchestration | PostgreSQL + Redis + Next.js app in isolated containers |

**Deployment architecture (DEPLOY-01):**

```
                    ┌─────────────────────────────────┐
                    │        宝塔面板 (BT Panel)       │
                    │  ┌───────────────────────────┐  │
Internet ──────────►│  │    Nginx (port 80/443)    │  │
                    │  │    - SSL termination       │  │
                    │  │    - Static file cache     │  │
                    │  │    - Gzip compression      │  │
                    │  │    - Security headers      │  │
                    │  └──────────┬────────────────┘  │
                    │             │ reverse proxy      │
                    │  ┌──────────▼────────────────┐  │
                    │  │   Docker Compose Stack     │  │
                    │  │  ┌─────────────────────┐  │  │
                    │  │  │ Next.js + PM2       │  │  │
                    │  │  │ (port 3000)         │  │  │
                    │  │  │ cluster mode        │  │  │
                    │  │  └─────────────────────┘  │  │
                    │  │  ┌─────────────────────┐  │  │
                    │  │  │ PostgreSQL 16       │  │  │
                    │  │  │ (port 5432)         │  │  │
                    │  │  └─────────────────────┘  │  │
                    │  │  ┌─────────────────────┐  │  │
                    │  │  │ Redis 7             │  │  │
                    │  │  │ (port 6379)         │  │  │
                    │  │  └─────────────────────┘  │  │
                    │  └──────────────────────────┘  │
                    └─────────────────────────────────┘
```

**Docker Compose recommendation:**

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://jinze:password@postgres:5432/jinze
      - REDIS_URL=redis://redis:6379
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=jinze
      - POSTGRES_USER=jinze
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    restart: always

volumes:
  pgdata:
  redisdata:
```

**Why Docker Compose over bare PM2:** Isolates PostgreSQL and Redis; reproducible deploys; easier backups (volume snapshots); doesn't conflict with 宝塔's existing services.

**Why PM2 inside Docker:** Next.js cluster mode benefits from PM2's process management even inside a container. Use `pm2-runtime` (not `pm2`) for Docker compatibility.

**Confidence:** MEDIUM — Deployment patterns are standard but specific 宝塔 panel integration should be tested during implementation.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 16 | Nuxt 3 / Astro | Next.js has best React SSR/SSG story; Astro good for pure content but lacks interactive AI chat |
| i18n | next-intl | next-i18next | Pages Router only; abandoned for App Router |
| CSS | Tailwind v4 | Ant Design / Chakra UI | Opinionated design language; heavy bundle; shadcn/ui gives primitives without lock-in |
| ORM | Prisma 7 | Drizzle ORM | Drizzle is lighter but Prisma has better migration workflow and Studio for data exploration |
| AI SDK | Vercel AI SDK 6 | Raw OpenAI SDK | Vercel AI SDK gives provider registry, streaming, tool calling out of the box |
| Calendar | tyme4ts | lunar-javascript | Same author; tyme4ts is TypeScript-native. Keep lunar-javascript as fallback |
| Cache | ioredis + Redis | Upstash Redis | Self-hosted deployment; no need for serverless Redis; local Redis is faster and free |
| Database | PostgreSQL | MongoDB | Relational data benefits from constraints; Prisma type safety is superior with SQL |
| Validation | zod 4 | yup / valibot | zod is the standard; best Prisma/TypeScript integration; largest ecosystem |

## Installation

```bash
# Create project
npx create-next-app@latest jinze --typescript --tailwind --eslint --app --src-dir

# Core dependencies
npm install next-intl@^4.12.0
npm install @prisma/client@^7.8.0
npm install ioredis@^5.10.0
npm install ai@^6.0.0 @ai-sdk/openai@^3.0.0 @ai-sdk/openai-compatible@^2.0.0
npm install tyme4ts@^1.4.0
npm install lunar-javascript@^1.7.0
npm install zod@^4.4.0
npm install sharp@^0.34.0
npm install date-fns@latest
npm install @tanstack/react-query@^5.100.0

# Dev dependencies
npm install -D prisma@^7.8.0
npm install -D next-sitemap@^4.2.0

# shadcn/ui setup
npx shadcn@latest init
npx shadcn@latest add card button tabs select dialog input textarea badge separator

# Prisma init
npx prisma init
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://jinze:password@localhost:5432/jinze"

# Redis
REDIS_URL="redis://localhost:6379"

# AI Providers
DEEPSEEK_API_KEY="sk-..."
DASHSCOPE_API_KEY="sk-..."

# Next.js
NEXT_PUBLIC_SITE_URL="https://jinze.yi"
```

## Sources

| Source | Confidence | URL |
|--------|------------|-----|
| Next.js docs (Context7) | HIGH | https://nextjs.org/docs |
| next-intl docs (Context7) | HIGH | https://next-intl.dev |
| Prisma docs (Context7) | HIGH | https://www.prisma.io/docs |
| Vercel AI SDK docs (Context7) | HIGH | https://ai-sdk.dev |
| ioredis docs (Context7) | HIGH | https://github.com/redis/ioredis |
| shadcn/ui docs (Context7) | HIGH | https://ui.shadcn.com |
| lunar-javascript (npm) | MEDIUM-HIGH | https://www.npmjs.com/package/lunar-javascript |
| tyme4ts (npm) | MEDIUM-HIGH | https://www.npmjs.com/package/tyme4ts |
| DeepSeek API docs | MEDIUM | https://platform.deepseek.com |
| 阿里云百炼 docs | MEDIUM | https://help.aliyun.com/zh/model-studio/ |
| Tailwind CSS v4 | HIGH | https://tailwindcss.com |
