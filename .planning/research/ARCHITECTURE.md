# Architecture Patterns

**Domain:** AI 黄历择吉工具平台 (Chinese Almanac + AI Fortune Platform)
**Researched:** 2026-05-16

## Recommended Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Nginx (宝塔面板)                              │
│                    Reverse Proxy + SSL + Static                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                     Next.js App (PM2 managed)                       │
│                                                                     │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────────┐ │
│  │  Middleware   │   │  App Router  │   │    API Routes            │ │
│  │  (i18n +     │──▶│  [locale]/   │   │    /api/ai/*             │ │
│  │   locale     │   │  pages SSG/  │   │    /api/almanac/*        │ │
│  │   detect)    │   │  ISR/SSR     │   │    /api/health           │ │
│  └─────────────┘   └──────┬───────┘   └──────────┬───────────────┘ │
│                            │                      │                 │
│  ┌─────────────────────────▼──────────────────────▼───────────────┐ │
│  │                    Service Layer                                │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │ │
│  │  │ AlmanacService│ │  AIService   │ │  ThirdPartyAPIService  │ │ │
│  │  │ (tyme4ts)    │ │ (Vercel AI)  │ │  (八字排盘 etc.)        │ │ │
│  │  └──────┬───────┘ └──────┬───────┘ └──────────┬─────────────┘ │ │
│  └─────────┼────────────────┼────────────────────┼───────────────┘ │
└────────────┼────────────────┼────────────────────┼─────────────────┘
             │                │                    │
    ┌────────▼────────┐  ┌───▼──────────┐   ┌─────▼─────────┐
    │  ioredis (Redis) │  │ Vercel AI SDK│   │ External APIs  │
    │  Daily cache     │  │ @ai-sdk/     │   │ (八字/风水等)   │
    │  Session cache   │  │  deepseek    │   │                │
    └────────┬────────┘  │  @ai-sdk/    │   └────────────────┘
             │           │  alibaba     │
    ┌────────▼────────┐  │  @ai-sdk/    │
    │  PostgreSQL      │  │  openai      │
    │  (Prisma ORM)    │  └──────────────┘
    │  - Content pages │
    │  - SEO metadata  │
    │  - User sessions │
    └─────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Nginx** | SSL termination, static asset serving, reverse proxy to Next.js | Next.js (port 3000) |
| **Middleware** | Locale detection (Accept-Language, cookie, URL prefix), redirect/rewrite to `[locale]/` paths | Next.js routing |
| **App Router Pages** | SSR/SSG rendering of all user-facing pages; SEO-optimized HTML output | Service Layer |
| **API Routes** | AI chat endpoints, almanac data endpoints, health checks | Service Layer |
| **AlmanacService** | Pure computation: daily almanac, 干支, 宜忌, 冲煞, 吉时 via `tyme4ts` | Redis (cache), returns data |
| **AIService** | Provider-agnostic AI interface: routes to DeepSeek/Alibaba/OpenAI via Vercel AI SDK | Vercel AI SDK providers |
| **ThirdPartyAPIService** | Wraps external APIs for complex calculations (八字排盘, detailed 风水) | External HTTP APIs |
| **Redis (ioredis)** | Cache daily almanac data (TTL=24h), rate limiting, session-like state | AlmanacService, API Routes |
| **PostgreSQL (Prisma)** | Persistent storage: content pages, SEO metadata, generated reports, future user data | All services via Prisma Client |

---

## Data Flow

### Flow 1: Daily Almanac Page (SSG + ISR)

```
Build time:
  generateStaticParams() → generates paths for /zh-hant/, /zh-hans/ × 365 days
  Each page: AlmanacService.getDayData(date) → tyme4ts computation → cached in Redis
  HTML pre-rendered with full almanac card

Request time (ISR revalidation):
  User → Nginx → Next.js middleware (detect locale) → [locale]/riqi/[date]/page.tsx
  If stale (>24h): recompute via AlmanacService → update Redis → regenerate HTML
  If fresh: serve cached static HTML

Data resolution order:
  1. Redis cache (key: `almanac:{date}:{locale}`)
  2. tyme4ts computation (if cache miss)
  3. Store in Redis with 24h TTL
```

### Flow 2: AI 择吉 Query (Streaming SSR)

```
User → [locale]/tools/ai-zhaji/page.tsx → client component with form
  ↓ (user submits: "2026年6月适合搬家的日子")
Client → POST /api/ai/chat { messages, context: "搬家" }
  ↓
API Route → AIService.streamResponse(messages, context)
  ↓
AIService selects provider (env.AI_PROVIDER = deepseek|alibaba|openai)
  ↓
Vercel AI SDK: streamText({ model, systemPrompt, messages })
  ↓
System prompt includes: context from AlmanacService (relevant dates, 干支, 宜忌)
  ↓
Stream response back to client via ReadableStream
  ↓
Client renders streaming markdown with AI result cards
```

### Flow 3: SEO Tool Pages (SSG)

```
Build time:
  SEO-01 吉日矩阵: generateStaticParams() → /zh-hant/jieri/jiehun/, /zh-hans/jieri/jiehun/, etc.
  Each page: pre-rendered with yearly auspicious dates for that activity
  ISR revalidation: 7 days (weekly refresh)

  SEO-02 生肖: generateStaticParams() → 12 zodiac × 2 locales = 24 pages
  ISR revalidation: 30 days

  SEO-03 八字: dynamic page, SSR on each request (personalized input)
  SEO-04 风水: SSG with monthly ISR
  SEO-05 起名: SSR (personalized input)
  SEO-06 节气: SSG with yearly ISR
```

### Flow 4: 时辰吉凶 (Hourly Detail)

```
User → [locale]/riqi/[date]/shichen/[hour]/page.tsx
  ↓
AlmanacService.getHourData(date, hour) → tyme4ts SolarTime API
  ↓
Returns: 时辰宜忌, 星神, 冲煞, 纳音
  ↓
Rendered as interactive 12-hour grid component
```

---

## Patterns to Follow

### Pattern 1: Locale-First File Routing with `next-intl`

**What:** All user-facing routes live under `app/[locale]/` using `next-intl` for i18n routing. The `[locale]` segment is always the first path segment, handling both `zh-hant` and `zh-hans`.

**When:** Always. Every page must be locale-aware.

**Example:**
```
app/
├── [locale]/
│   ├── layout.tsx              # Root layout: <html lang={locale}>, providers
│   ├── page.tsx                # Homepage: 今日黄历
│   ├── riqi/
│   │   └── [date]/
│   │       ├── page.tsx        # Daily almanac detail
│   │       └── shichen/
│   │           └── [hour]/
│   │               └── page.tsx  # Hourly detail
│   ├── jieri/
│   │   ├── jiehun/
│   │   │   └── page.tsx        # 结婚吉日
│   │   ├── banjia/
│   │   │   └── page.tsx        # 搬家吉日
│   │   └── kaiye/
│   │       └── page.tsx        # 开业吉日
│   ├── shengxiao/
│   │   ├── [animal]/
│   │   │   └── page.tsx        # 生肖详情
│   │   └── page.tsx            # 生肖首页
│   ├── tools/
│   │   ├── ai-zhaji/
│   │   │   └── page.tsx        # AI 择吉工具
│   │   ├── zodiac/
│   │   │   └── page.tsx        # 生肖配对
│   │   ├── bazi/
│   │   │   └── page.tsx        # 八字排盘
│   │   └── qiming/
│   │       └── page.tsx        # 起名工具
│   └── fengshui/
│       └── page.tsx            # 风水知识
├── layout.tsx                  # (empty or minimal, just wraps [locale])
├── api/
│   ├── ai/
│   │   └── chat/
│   │       └── route.ts        # AI chat streaming endpoint
│   ├── almanac/
│   │   └── [date]/
│   │       └── route.ts        # Almanac data API
│   └── health/
│       └── route.ts
└── middleware.ts                # next-intl middleware
```

**Key config (next-intl):**
```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh-hant', 'zh-hans'],
  defaultLocale: 'zh-hant',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/riqi/[date]': {
      'zh-hant': '/riqi/[date]',
      'zh-hans': '/riqi/[date]'
    },
    '/jieri/jiehun': {
      'zh-hant': '/jieri/jiehun',
      'zh-hans': '/jieri/jiehun'
    },
    '/tools/zodiac': {
      'zh-hant': '/tools/zodiac',
      'zh-hans': '/tools/zodiac'
    },
    // Pinyin paths stay the same across locales (they're Chinese words)
    // English tool paths stay the same across locales
  }
});
```

**Why `next-intl`:** It's the most mature i18n library for Next.js App Router. Has native Server Components support, middleware integration, type-safe translations, and `defineRouting` for localized pathnames. The `localePrefix: 'always'` ensures SEO-friendly URLs with the locale prefix always present.

---

### Pattern 2: Almanac Data Service with `tyme4ts`

**What:** A singleton service class that wraps the `tyme4ts` library (the TypeScript successor to `lunar-javascript` by 6tail) to compute all almanac data. No database needed for core almanac calculations -- it's pure computation.

**When:** Any page or API route that needs almanac data.

**Example:**
```typescript
// src/services/almanac.ts
import { SolarDay, SolarTime, LunarDay } from 'tyme4ts';

export interface DayAlmanacData {
  solarDate: string;           // "2026-06-15"
  lunarDate: string;           // "农历丙午年五月初一"
  yearGanZhi: string;          // "丙午"
  monthGanZhi: string;         // "甲午"
  dayGanZhi: string;           // "庚寅"
  zodiac: string;              // "马"
  recommends: string[];        // ["嫁娶", "祭祀", ...]
  avoids: string[];            // ["破土", "出行", ...]
  gods: { ji: string[]; xiong: string[] };
  duty: string;                // "建除十二值"
  nineStar: string;            // "九星"
  solarTerm: string | null;    // 节气 (if applicable)
  clashDirection: string;      // 冲煞方位
  wealthDirection: string;     // 财神方位
}

export interface HourAlmanacData {
  hour: string;                // "子时"
  hourGanZhi: string;          // "庚子"
  recommends: string[];
  avoids: string[];
  gods: { ji: string[]; xiong: string[] };
}

export class AlmanacService {
  private static instance: AlmanacService;
  private redis: Redis;

  static getInstance(redis: Redis): AlmanacService {
    if (!this.instance) this.instance = new AlmanacService(redis);
    return this.instance;
  }

  async getDayData(year: number, month: number, day: number): Promise<DayAlmanacData> {
    const cacheKey = `almanac:${year}-${month}-${day}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const solar = SolarDay.fromYmd(year, month, day);
    const lunar = solar.getLunarDay();
    const sixtyCycle = lunar.getSixtyCycle();

    const data: DayAlmanacData = {
      solarDate: `${year}-${month}-${day}`,
      lunarDate: `农历${sixtyCycle.getHeavenStem().getName()}${sixtyCycle.getEarthBranch().getName()}年`,
      yearGanZhi: lunar.getYear().getSixtyCycle().getName(),
      monthGanZhi: lunar.getMonth().getSixtyCycle().getName(),
      dayGanZhi: sixtyCycle.getName(),
      zodiac: lunar.getYear().getEarthBranch().getZodiac().getName(),
      recommends: lunar.getRecommends().map(t => t.getName()),
      avoids: lunar.getAvoids().map(t => t.getName()),
      gods: this.categorizeGods(lunar.getGods()),
      duty: lunar.getDuty().getName(),
      nineStar: lunar.getNineStar().toString(),
      solarTerm: lunar.getSolarTerm()?.getName() ?? null,
      clashDirection: this.getClashDirection(lunar),
      wealthDirection: this.getWealthDirection(lunar),
    };

    await this.redis.set(cacheKey, JSON.stringify(data), 'EX', 86400); // 24h TTL
    return data;
  }

  async getHourData(year: number, month: number, day: number, hour: number): Promise<HourAlmanacData> {
    // Similar pattern with SolarTime.fromYmdHms()
    // ...
  }

  // Helper to find auspicious dates for a given activity
  async findAuspiciousDates(activity: string, year: number, month: number): Promise<DayAlmanacData[]> {
    const results: DayAlmanacData[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const data = await this.getDayData(year, month, d);
      if (data.recommends.includes(activity)) results.push(data);
    }
    return results;
  }
}
```

**Why `tyme4ts` over `lunar-javascript`:** `tyme4ts` is the official TypeScript rewrite by the same author (6tail). It has better type safety, cleaner API design, and is the actively maintained successor. Provides: 干支, 宜忌, 冲煞, 节气, 二十八宿, 建除十二值, 九星, 纳音, 月相, 小六壬 -- everything needed for a full almanac.

---

### Pattern 3: Provider-Agnostic AI Layer via Vercel AI SDK

**What:** Use Vercel AI SDK (`ai` package) as the unified AI abstraction. It natively supports DeepSeek (`@ai-sdk/deepseek`), Alibaba/Qwen (`@ai-sdk/alibaba`), and OpenAI (`@ai-sdk/openai`) with a single `generateText`/`streamText` API. No custom abstraction needed.

**When:** All AI-powered features (择吉问答, 一句话提问, 结果解释).

**Example:**
```typescript
// src/services/ai.ts
import { deepSeek } from '@ai-sdk/deepseek';
import { alibaba } from '@ai-sdk/alibaba';
import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';

type Provider = 'deepseek' | 'alibaba' | 'openai';

function getModel(provider: Provider) {
  switch (provider) {
    case 'deepseek': return deepSeek('deepseek-chat');
    case 'alibaba':  return alibaba('qwen-plus');
    case 'openai':   return openai('gpt-4o');
  }
}

export class AIService {
  private provider: Provider;

  constructor() {
    this.provider = (process.env.AI_PROVIDER as Provider) || 'deepseek';
  }

  async streamZhajiResponse(
    messages: { role: 'user' | 'assistant'; content: string }[],
    context: { activity: string; almanacData?: string }
  ) {
    const systemPrompt = `你是"今擇易"AI择吉助手。用户想要查询"${context.activity}"的吉日。
${context.almanacData ? `以下是相关黄历数据：\n${context.almanacData}` : ''}
请根据传统择吉文化，给出推荐日期、理由、避开的禁忌、备选日期。回答要详细但通俗易懂。`;

    return streamText({
      model: getModel(this.provider),
      system: systemPrompt,
      messages,
    });
  }

  async quickAnswer(question: string) {
    return generateText({
      model: getModel(this.provider),
      system: '你是"今擇易"AI助手，专门回答中国传统择吉、黄历、八字、风水相关问题。用简洁明了的中文回答。',
      prompt: question,
    });
  }
}
```

**Why Vercel AI SDK:** It provides first-class support for all three target providers (DeepSeek via `@ai-sdk/deepseek`, Alibaba/Qwen via `@ai-sdk/alibaba`, OpenAI via `@ai-sdk/openai`). The `streamText` function returns a `ReadableStream` that integrates naturally with Next.js API routes. Provider switching is a single env var change (`AI_PROVIDER=deepseek|alibaba|openai`). No need to build a custom abstraction -- the SDK already is one.

**Key packages:**
```bash
npm install ai @ai-sdk/deepseek @ai-sdk/alibaba @ai-sdk/openai
```

---

### Pattern 4: Redis Caching Strategy

**What:** Two-tier caching: Redis for computed data, Next.js ISR/SSG for rendered pages.

**When:** All data-fetching paths.

**Cache tiers:**

| Tier | What's Cached | TTL | Invalidation |
|------|--------------|-----|--------------|
| **Redis: almanac** | Daily almanac JSON (干支, 宜忌, etc.) | 24h | Automatic (TTL) |
| **Redis: hour** | Hourly detail JSON | 1h | Automatic (TTL) |
| **Redis: auspicious** | Pre-computed monthly auspicious dates | 7d | Manual (on month change) |
| **Next.js ISR: tool pages** | Pre-rendered SEO pages (吉日, 生肖, 节气) | 7-30d | `revalidate` per page |
| **Next.js SSG: daily pages** | Pre-rendered daily almanac pages | 24h | `revalidate = 86400` |
| **Next.js: AI responses** | Not cached (always fresh) | 0 | N/A |

**Redis connection pattern:**
```typescript
// src/lib/redis.ts
import Redis from 'ioredis';

let redis: Redis;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redis;
}
```

**Why ioredis over @upstash/redis:** The project deploys on 宝塔 + Nginx + PM2 (a traditional VPS setup), not Vercel serverless. `ioredis` is the standard Redis client for Node.js with connection pooling, pipelining, and cluster support. `@upstash/redis` is designed for serverless edge functions and would be overkill here.

---

### Pattern 5: SEO Architecture for Chinese Search Engines

**What:** Multi-layered SEO strategy optimized for both Baidu and Google.

**URL structure:**
```
/zh-hant/                    # 繁体 (Traditional Chinese) - default
/zh-hans/                    # 简体 (Simplified Chinese)

# Pinyin paths (Chinese keywords, same across locales)
/zh-hant/jieri/jiehun/       # 结婚吉日
/zh-hant/jieri/banjia/       # 搬家吉日
/zh-hant/jieri/kaiye/        # 开业吉日
/zh-hant/shengxiao/long/     # 生肖·龙
/zh-hant/fengshui/           # 风水知识

# English paths (tool pages, same across locales)
/zh-hant/tools/zodiac/       # 生肖配对
/zh-hant/tools/bazi/         # 八字排盘
/zh-hant/tools/qiming/       # 起名工具

# Date-based paths
/zh-hant/riqi/2026-06-15/    # 每日黄历详情
```

**SEO-critical implementation details:**

```typescript
// app/[locale]/layout.tsx
export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  return (
    <html lang={locale === 'zh-hant' ? 'zh-Hant' : 'zh-Hans'}>
      <head>
        {/* Baidu language meta (Baidu doesn't fully support hreflang) */}
        <meta http-equiv="Content-Language" content={locale === 'zh-hant' ? 'zh-TW' : 'zh-CN'} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Per-page: generate hreflang alternates
export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    alternates: {
      languages: {
        'zh-hant': `/zh-hant/jieri/jiehun`,
        'zh-hans': `/zh-hans/jieri/jiehun`,
      }
    }
  };
}
```

**Baidu-specific considerations:**
- Baiduspider has limited JS rendering -- SSR/SSG is mandatory (not optional)
- Use `<meta http-equiv="Content-Language">` in addition to `hreflang` (Baidu ignores `hreflang`)
- Submit XML sitemaps via Baidu Webmaster Tools (ziyuan.baidu.com)
- Use `<lastmod>` aggressively -- Baidu checks freshness
- Host in China mainland or use CDN with China PoPs for fast crawling
- ICP filing required for .cn domains or China-hosted servers

**Sitemap generation:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.jinzeyi.com';
  const locales = ['zh-hant', 'zh-hans'];
  const staticPages = [
    '/jieri/jiehun', '/jieri/banjia', '/jieri/kaiye',
    '/shengxiao/long', '/shengxiao/shu', /* ... 12 animals */
    '/fengshui', '/tools/zodiac', '/tools/bazi', '/tools/qiming',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${base}/${locale}${page}`,
        changeFrequency: page.startsWith('/jieri') ? 'weekly' : 'monthly',
        priority: page.startsWith('/jieri') ? 0.9 : 0.7,
      });
    }
    // Daily pages (next 30 days)
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      entries.push({
        url: `${base}/${locale}/riqi/${date.toISOString().split('T')[0]}`,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }
  return entries;
}
```

---

### Pattern 6: Component Architecture

**What:** Layered component design with clear separation between layout, data-display, and interactive components.

**Component tree:**

```
components/
├── layout/
│   ├── Header.tsx              # Logo, nav, locale switcher
│   ├── Footer.tsx              # Site links, copyright
│   ├── LocaleSwitcher.tsx      # 繁/简 toggle button
│   └── MobileNav.tsx           # Responsive navigation
│
├── almanac/
│   ├── AlmanacCard.tsx         # 今日黄历卡片 (hero component)
│   ├── DayDetail.tsx           # 完整日历详情
│   ├── HourGrid.tsx            # 12时辰吉凶网格
│   ├── GanZhiDisplay.tsx       # 干支展示 (年/月/日/时)
│   ├── YiJiList.tsx            # 宜忌列表 (绿色宜/红色忌)
│   ├── GodDirection.tsx        # 财神/福神方位
│   ├── SolarTermBadge.tsx      # 节气标签
│   └── LunarDateDisplay.tsx    # 农历日期展示
│
├── calendar/
│   ├── MonthCalendar.tsx       # 月历视图 (可切换月份)
│   ├── DayCell.tsx             # 月历中的单日格子
│   ├── DateNavigator.tsx       # 日期前后切换
│   └── MiniCalendar.tsx        # 侧边栏迷你日历
│
├── zodiac/
│   ├── ZodiacCard.tsx          # 生肖卡片 (图标+描述)
│   ├── ZodiacGrid.tsx          # 12生肖网格
│   ├── ZodiacPairResult.tsx    # 配对结果展示
│   └── ZodiacIcon.tsx          # SVG生肖图标
│
├── tools/
│   ├── ActivitySelector.tsx    # 场景选择器 (结婚/搬家/开业...)
│   ├── AIChatBox.tsx           # AI对话组件 (流式)
│   ├── DateRecommendation.tsx  # AI推荐日期卡片
│   ├── BaziInput.tsx           # 八字输入表单
│   └── BaziResult.tsx          # 八字排盘结果
│
├── seo/
│   ├── JieRiMatrix.tsx         # 吉日矩阵表格 (SEO页面用)
│   ├── FAQSection.tsx          # 结构化FAQ (SEO rich results)
│   └── BreadcrumbNav.tsx       # 面包屑导航
│
└── ui/                         # shadcn/ui primitives
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── select.tsx
    └── tabs.tsx
```

**Component design rules:**

1. **Server Components by default** -- all components are Server Components unless they need `useState`, `useEffect`, or event handlers. Mark interactive ones with `'use client'`.

2. **Data flows down** -- page components (Server Components) fetch data via `AlmanacService` and pass it as props to display components. No client-side data fetching for almanac data.

3. **AI components are client-only** -- `AIChatBox.tsx` is `'use client'` because it handles streaming, user input, and real-time updates. It calls `/api/ai/chat` via `fetch`.

4. **Locale-aware text** -- use `next-intl`'s `useTranslations` for UI labels, but almanac data comes pre-computed in the correct locale from `tyme4ts`.

**Key component example (AlmanacCard):**
```tsx
// components/almanac/AlmanacCard.tsx (Server Component)
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GanZhiDisplay } from './GanZhiDisplay';
import { YiJiList } from './YiJiList';
import type { DayAlmanacData } from '@/services/almanac';

interface Props {
  data: DayAlmanacData;
  locale: string;
}

export function AlmanacCard({ data, locale }: Props) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="text-sm text-muted-foreground">{data.solarDate}</div>
        <div className="text-2xl font-bold">{data.lunarDate}</div>
        <GanZhiDisplay year={data.yearGanZhi} month={data.monthGanZhi} day={data.dayGanZhi} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">生肖: {data.zodiac}</span>
          {data.solarTerm && <SolarTermBadge term={data.solarTerm} />}
        </div>
        <YiJiList recommends={data.recommends} avoids={data.avoids} />
        <GodDirection direction={data.wealthDirection} />
      </CardContent>
    </Card>
  );
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side Almanac Computation

**What:** Computing 干支, 宜忌, etc. in the browser via `tyme4ts` client bundle.

**Why bad:** The `tyme4ts` library is not tiny. Shipping it to the browser bloats the JS bundle. Almanac data is deterministic -- it's always better to compute server-side and cache.

**Instead:** Always compute in Server Components or API routes. Pass computed data as props to client components.

### Anti-Pattern 2: Custom AI Abstraction Layer

**What:** Building a custom `LLMProvider` interface with `DeepSeekProvider`, `AlibabaProvider`, etc.

**Why bad:** Vercel AI SDK already provides this abstraction with `@ai-sdk/deepseek`, `@ai-sdk/alibaba`, `@ai-sdk/openai`. Building a custom layer duplicates effort and loses streaming/tool-calling features.

**Instead:** Use Vercel AI SDK directly. Switch providers via env var (`AI_PROVIDER`).

### Anti-Pattern 3: Database-Heavy Almanac Schema

**What:** Creating PostgreSQL tables for daily almanac data (storing all 365 days of 干支, 宜忌 in a DB).

**Why bad:** `tyme4ts` computes this deterministically from algorithms. Storing it in a DB adds complexity, migration burden, and data staleness risk for zero benefit.

**Instead:** Compute on demand, cache in Redis. Only store in PostgreSQL things that can't be computed: user-generated content, AI conversation logs, SEO metadata.

### Anti-Pattern 4: Separate Pages for 繁/简

**What:** Duplicating `page.tsx` files or content for zh-hant and zh-hans.

**Why bad:** The almanac data is identical (干支, 宜忌 are the same regardless of 繁/简). Only UI labels differ. Duplication means double maintenance.

**Instead:** One `page.tsx` per route under `[locale]/`. Use `next-intl` messages for UI text. Almanac data is locale-agnostic.

### Anti-Pattern 5: Ignoring Baidu's JS Limitations

**What:** Relying on client-side rendering for SEO-critical content.

**Why bad:** Baiduspider has limited JavaScript execution. Client-rendered content may not be indexed.

**Instead:** All SEO-critical content must be in the server-rendered HTML. Use SSR/SSG exclusively for pages that need Baidu indexing.

---

## Scalability Considerations

| Concern | At 100 users/day | At 10K users/day | At 1M users/day |
|---------|-------------------|-------------------|------------------|
| **Almanac computation** | Compute on-demand, no cache needed | Redis cache with 24h TTL | Pre-compute full year at midnight, warm cache |
| **AI requests** | Single provider, no queue | Rate limiting per IP, provider fallback chain | Queue system (BullMQ), multiple provider keys, cost monitoring |
| **Page rendering** | ISR with default revalidation | Shorter ISR intervals, CDN edge caching | Static export + CDN, ISR only for dynamic pages |
| **Redis** | Single instance, ~10MB memory | Single instance, ~100MB | Redis Cluster or read replicas |
| **PostgreSQL** | Single instance, connection pool of 5 | Connection pool of 20, read replica | PgBouncer, horizontal read scaling |
| **Static assets** | Local Nginx serving | CDN (Cloudflare/阿里云CDN) | Multi-region CDN with China PoPs |

---

## Suggested Build Order (Dependencies)

The build order is driven by data dependencies: later components need earlier ones to function.

```
Phase 1: Foundation (no dependencies)
├── Project scaffolding (Next.js + TypeScript + Tailwind + shadcn/ui)
├── next-intl setup (middleware, [locale] routing, zh-hant/zh-hans)
├── Redis connection (ioredis singleton)
├── Prisma schema + PostgreSQL connection
└── Basic layout components (Header, Footer, LocaleSwitcher)

Phase 2: Core Data Layer (depends on: Phase 1)
├── AlmanacService implementation (tyme4ts integration)
├── Redis caching layer for almanac data
├── Almanac API routes (/api/almanac/[date])
└── Unit tests for AlmanacService (known date → expected 干支)

Phase 3: Core UI Components (depends on: Phase 2)
├── AlmanacCard (今日黄历 hero)
├── GanZhiDisplay, YiJiList, SolarTermBadge
├── LunarDateDisplay, GodDirection
├── HourGrid (12时辰)
└── MonthCalendar + DayCell + DateNavigator

Phase 4: SEO Pages - Static (depends on: Phase 3)
├── Homepage with AlmanacCard
├── /riqi/[date] daily detail page (SSG + ISR)
├── /jieri/* matrix pages (结婚/搬家/开业吉日 - SSG)
├── /shengxiao/* zodiac pages (SSG)
├── /fengshui knowledge pages (SSG)
├── /jieqi solar terms pages (SSG)
├── XML sitemap generation
└── Meta tags, Open Graph, structured data (FAQ schema)

Phase 5: AI Layer (depends on: Phase 2, Phase 3)
├── Vercel AI SDK setup (@ai-sdk/deepseek + @ai-sdk/alibaba + @ai-sdk/openai)
├── AIService with provider switching
├── /api/ai/chat streaming endpoint
├── AIChatBox client component
├── ActivitySelector (场景选择器)
├── DateRecommendation (AI推荐卡片)
└── AI 择吉 page (/tools/ai-zhaji)

Phase 6: Complex Tools (depends on: Phase 5)
├── BaziInput + BaziResult (八字排盘 - calls external API)
├── ZodiacPairResult (生肖配对)
├── /tools/qiming (起名工具)
└── AI one-sentence query (一句话提问)

Phase 7: Polish & Deploy (depends on: Phase 4, Phase 6)
├── Mobile responsive refinements
├── Performance optimization (bundle analysis, image optimization)
├── 宝塔 + Nginx + PM2 deployment config
├── Baidu Webmaster Tools sitemap submission
├── ICP filing preparation (if hosting in China)
└── Error monitoring (Sentry or similar)
```

**Dependency graph (critical path):**
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 7
                     Phase 3 → Phase 5 → Phase 6 → Phase 7
```

Phase 4 and Phase 5 can be developed in parallel after Phase 3, as they don't depend on each other. Phase 6 depends on Phase 5 (AI integration). Phase 7 depends on both Phase 4 and Phase 6.

---

## Sources

- **Next.js i18n docs**: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/internationalization.mdx (Context7, HIGH confidence)
- **next-intl**: https://github.com/amannn/next-intl (Context7, HIGH confidence)
- **tyme4ts (6tail)**: https://github.com/6tail/tyme4ts -- TypeScript calendar library, successor to lunar-javascript (Context7, HIGH confidence)
- **Vercel AI SDK DeepSeek provider**: https://github.com/vercel/ai/blob/main/content/providers/01-ai-sdk-providers/30-deepseek.mdx (Context7, HIGH confidence)
- **Vercel AI SDK Alibaba provider**: https://github.com/vercel/ai/blob/main/content/providers/01-ai-sdk-providers/32-alibaba.mdx (Context7, HIGH confidence)
- **Next.js ISR docs**: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/incremental-static-regeneration.mdx (Context7, HIGH confidence)
- **ioredis**: https://github.com/redis/ioredis (Context7, HIGH confidence)
- **Baidu SEO specifics**: Web search results on Baiduspider JS limitations, hreflang non-support (MEDIUM confidence -- based on community knowledge, not official Baidu docs)
