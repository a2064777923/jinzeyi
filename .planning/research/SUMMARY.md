# Project Research Summary

**Project:** 今擇易 (JinZeYi) — AI 黄历择吉工具平台
**Domain:** AI-powered Chinese almanac / fortune-telling web platform
**Researched:** 2026-05-16
**Confidence:** MEDIUM-HIGH

## Executive Summary

今擇易 is an AI-powered Chinese almanac (黄历) and auspicious date selection (择吉) platform targeting both Traditional Chinese (HK/TW/overseas) and Simplified Chinese (mainland) users. The platform must serve three roles simultaneously: a data-heavy calendar tool (万年历), an SEO content machine generating thousands of pages for long-tail keywords, and an AI assistant that explains and personalizes fortune-telling recommendations. Research concludes this is best built as a Next.js 16 application with SSR/SSG for Baidu SEO compatibility, using `tyme4ts` for calendar computation, Vercel AI SDK for multi-provider AI integration (DeepSeek/Qwen), and PostgreSQL + Redis for persistence and caching.

The recommended approach follows a data-first, AI-second strategy. Phase 1 builds the almanac data foundation and core UI components that drive organic search traffic. Phase 2 layers SEO content pages to capture the massive long-tail keyword matrix (every day, every zodiac, every scenario = a unique URL). Phase 3 introduces AI features as the competitive differentiator — this is where 今擇易 separates from static competitors like 万年历 and 神巴巴. Phase 4 adds monetization through premium AI features and PDF reports. This ordering is deliberate: SEO traffic must exist before AI features can convert users into paying customers.

The two most critical risks are: (1) lunar calendar algorithm correctness — a single wrong date destroys credibility permanently in this trust-sensitive domain, and (2) legal compliance — Chinese regulators actively target "算命" platforms, and the site must position itself as "文化研究/民俗文化工具" with prominent disclaimers. A lawyer specializing in Chinese internet law should review the product before launch. Additionally, Baidu's limited JavaScript rendering means SSR/SSG is not optional — it is mandatory for any page that needs search visibility in China.

## Key Findings

### Recommended Stack

The stack is anchored by Next.js 16 with App Router, chosen for its SSR/SSG/ISR capabilities which are critical for Baidu SEO. TypeScript is non-negotiable given the data-heavy domain. `next-intl` handles i18n routing with `zh-hant`/`zh-hans` locale prefixes (using BCP 47 script subtags, not region codes). Tailwind CSS 4 + shadcn/ui provide a lightweight, customizable UI foundation without the opinionated design lock-in of Ant Design.

**Core technologies:**
- **Next.js 16.2.x**: Full-stack React framework with App Router, SSR/SSG/ISR for SEO, built-in API routes for AI endpoints. `generateStaticParams` pre-renders thousands of almanac pages.
- **TypeScript 5.x**: Essential for type safety across calendar calculations, API integrations, and Prisma types.
- **next-intl 4.12.x**: De facto standard for Next.js App Router i18n. Middleware-based locale detection, supports `zh-hant`/`zh-hans` URL prefixes, ICU message syntax.
- **Tailwind CSS 4.3.x + shadcn/ui 2.9.x**: CSS-first config, copy-paste components on Radix UI. Chinese design considerations: slightly larger base font size (16-17px), `max-w-[65ch]` for readability, red/gold for auspicious themes.
- **PostgreSQL 16 + Prisma 7.8**: Relational data model for content pages, SEO metadata, and AI logs. Type-safe queries, schema-first design, migration system.
- **ioredis 5.10 + Redis 7**: Cache daily almanac data (read-heavy, write-once-per-day), rate limiting, session state. Shared across PM2 cluster instances.
- **Vercel AI SDK 6.0**: Unified API for DeepSeek, Qwen (Alibaba), and OpenAI. Provider registry for hot-swapping, built-in streaming, tool calling. DeepSeek is the default (best cost/quality for Chinese content); Qwen is the reliability fallback.
- **tyme4ts 1.4.x**: TypeScript-native Chinese calendar library by 6tail. Provides 干支, 宜忌, 冲煞, 节气, 二十八宿, 建除十二值, 九星, 纳音. Falls back to `lunar-javascript` if needed.
- **next-sitemap 4.2.x**: Auto-generates sitemap.xml with i18n alternate hreflang support.
- **Docker Compose**: Orchestrates PostgreSQL + Redis + Next.js app. Deployed behind 宝塔 Nginx with PM2 process management.

### Expected Features

**Must have (table stakes) — 11 features:**
- 今日黄历卡片 (Today's Almanac Card) — homepage anchor, users expect this immediately
- 时辰吉凶表 (Hourly Fortune Table) — 12 时辰 with fortune ratings
- 黄道吉日查询 (Auspicious Day Query) — core use case: find best date for an activity
- 月历视图 (Monthly Calendar View) — browse by month, color-coded 吉凶
- 基础生肖内容 (Zodiac Content) — massive SEO traffic driver
- 基础八字排盘 (BaZi Chart) — high search volume tool
- 基础起名工具 (Naming Tool) — high-intent, high-value use case
- 基础风水知识 (Feng Shui Content) — SEO content vertical
- 节气查询 (Solar Terms) — low effort, high SEO value
- 移动端适配 (Mobile Responsive) — majority of traffic is mobile
- 繁简体切换 (Traditional/Simplified Toggle) — dual audience targeting

**Should have (competitive differentiators) — 7 features:**
- AI 择吉问答 — natural language date recommendations (no competitor does this well)
- AI 结果解释 — plain-language explanations of 干支, 五行, 冲煞
- AI 八字合参 — personalized recommendations cross-referencing user's birth chart
- 一句话提问 — single input field, instant answer (UX differentiator)
- PDF 报告导出 — professional reports for sharing (premium feature)
- 场景化引导 — guided flows for major scenarios (wedding, moving, etc.)
- 生肖配对详情 — nuanced compatibility analysis beyond simple ratings

**Defer to v2+:**
- 社交功能 (social features, forums, comments)
- 大师在线咨询 (live master consultation — liability risk)
- 面相/手相 AI 分析 (face/palm reading — different product category)
- 塔罗牌/西方星座 (tarot/Western astrology — brand confusion)
- 电商/商品推荐 (e-commerce — regulatory risk)
- 紫微斗数/六爻/奇门遁甲 (advanced metaphysics — niche audience, complex UI)

### Architecture Approach

The architecture follows a layered pattern: Nginx (reverse proxy + SSL) -> Next.js App Router (SSR/SSG/ISR) -> Service Layer -> Data Layer. All routes live under `app/[locale]/` with `next-intl` middleware handling locale detection. The `AlmanacService` is a singleton wrapping `tyme4ts` for pure computation (no database needed for core almanac data), with Redis caching (24h TTL for daily data). The `AIService` uses Vercel AI SDK's provider registry for DeepSeek/Qwen/OpenAI switching via a single environment variable. PostgreSQL (via Prisma) stores only things that cannot be computed: content pages, SEO metadata, AI conversation logs.

**Major components:**
1. **AlmanacService** — Pure computation layer wrapping `tyme4ts`. Computes 干支, 宜忌, 冲煞, 吉时 on demand. Cached in Redis. Never stores computed data in PostgreSQL.
2. **AIService** — Provider-agnostic AI layer via Vercel AI SDK. Streams responses for chat interface. System prompts inject correct almanac data as context (data-first, explanation-second).
3. **Next.js App Router Pages** — SSG for static SEO content (吉日矩阵, 生肖, 风水, 节气), ISR for daily almanac data (24h revalidation), SSR for AI chat and personalized tools (八字, 起名).
4. **Redis Cache** — Two-tier: computed almanac data (24h TTL), pre-computed monthly auspicious dates (7d TTL). AI responses are never cached.
5. **PostgreSQL** — Content pages, SEO metadata, AI conversation logs, future user data. Relational constraints for locale variants and page types.

### Critical Pitfalls

1. **Lunar Calendar Algorithm Errors** — The most dangerous data pitfall. Leap month handling, bitmask encoding, base date anchoring, and year boundary errors can produce wrong 宜忌. Prevention: use `lunar-javascript`/`tyme4ts` (battle-tested by 6tail), cross-validate against 紫金山天文台 data, build regression test suite with known date pairs covering edge cases (leap months, year boundaries, 1900-2100 range limits).

2. **AI Hallucination on Cultural Content** — LLMs confidently generate wrong 命理 explanations, invented classical citations, and incorrect 干支 assignments. Prevention: never let AI generate raw data (almanac data must come from `tyme4ts`), constrain output with structured prompts that include correct base data, use DeepSeek/Qwen (outperform OpenAI on C-Eval/CMMLU benchmarks), implement output validation checking AI-generated 干支 against computed values.

3. **Legal/Compliance Risk** — Chinese regulators actively target "算命" platforms. 《治安管理处罚法》第27条 and 《刑法》第300条 penalize superstition-related activities. Prevention: frame as "文化研究/民俗文化工具" (never "算命"), prominent disclaimer on every page, no "guaranteed" language, ICP备案 mandatory, consult a Chinese internet lawyer before launch. 生辰八字 is sensitive personal information under 《个人信息保护法》.

4. **Simplified/Traditional Chinese Conversion** — Naive character mapping produces wrong or offensive output. 地支 "丑" becomes "醜" (ugly), 天干 "干" becomes "乾" or "幹". Prevention: use OpenCC with custom domain dictionary for 命理 terminology, maintain separate content databases for zh-Hans and zh-Hant, test with native speakers from Taiwan and Hong Kong.

5. **Baidu SEO vs Google SEO** — Baidu has limited JS rendering (SSR/SSG mandatory), favors mainland hosting + ICP license, still considers meta keywords, and crawls slower. The reference site (jiton.com.cn) requires Playwright because it's JS-rendered. Next.js SSR/SSG is a direct competitive advantage here.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Data Layer
**Rationale:** Everything depends on correct almanac data. The `tyme4ts` integration, Redis caching, and i18n routing are prerequisites for all subsequent phases. Legal positioning and disclaimers should be baked in from day one.
**Delivers:** Working Next.js 16 app with i18n routing, almanac data service, Redis caching, PostgreSQL schema, basic layout components, legal disclaimers.
**Addresses:** Mobile responsive (built-in), 繁简体切换 (i18n routing), timezone handling (UTC+8 enforcement)
**Avoids:** Pitfall 1 (lunar calendar errors — regression tests built here), Pitfall 4 (繁简转换 — custom OpenCC dictionary created here), Pitfall 10 (timezone issues), Pitfall 3 (legal framing from day one)
**Stack:** Next.js 16, TypeScript, next-intl, Tailwind CSS 4, shadcn/ui, Prisma, PostgreSQL, ioredis, Redis, tyme4ts

### Phase 2: Core UI & Almanac Features
**Rationale:** With the data layer working, build the table-stakes features that serve as the homepage and primary user experience. These features also establish the component library used by all subsequent phases.
**Delivers:** 今日黄历卡片, 时辰吉凶表, 月历视图, 节气查询 — the core almanac browsing experience.
**Addresses:** Table stakes features 1-4, 9 (今日黄历, 时辰吉凶, 月历视图, 节气查询)
**Avoids:** Pitfall 6 (font loading — system fonts first, custom fonts as enhancement)
**Components:** AlmanacCard, GanZhiDisplay, YiJiList, HourGrid, MonthCalendar, DayCell, SolarTermBadge

### Phase 3: SEO Content Matrix
**Rationale:** SEO pages are the primary traffic acquisition channel. Each page type (吉日, 生肖, 八字, 风水, 起名, 节气) generates multiple URLs across two locales. These pages must be built with SSG/ISR for Baidu indexing. This phase can run in parallel with Phase 4 (AI) after Phase 2 completes.
**Delivers:** Full SEO content matrix — 吉日查询 pages, 生肖 pages, 八字排盘, 风水知识, 起名工具, sitemap generation, structured data.
**Addresses:** Table stakes features 3, 5, 6, 7, 8 (黄道吉日查询, 生肖内容, 八字排盘, 起名工具, 风水知识)
**Avoids:** Pitfall 5 (Baidu SEO — SSR/SSG mandatory, meta keywords, Content-Language header), Pitfall 7 (SSG build time — use ISR instead of pure SSG for high-volume pages), Pitfall 11 (content duplication — hreflang + distinct content), Pitfall 13 (URL strategy — document full URL matrix), Pitfall 12 (third-party API dependency — cache aggressively, fallback providers)
**Architecture:** SSG with ISR for static content, SSR for personalized tools (八字, 起名). `generateStaticParams` for pre-rendering. Separate sitemaps per locale for Baidu.

### Phase 4: AI Integration
**Rationale:** AI features are the competitive differentiator but depend on correct almanac data (Phase 1-2) being available to inject into system prompts. The abstract AI interface layer (AI-01) must be designed before any AI feature to enable provider switching.
**Delivers:** AI 择吉问答, AI 结果解释, 场景化引导, 一句话提问 — the "AI赋能" experience.
**Addresses:** Differentiators 1-4, 6 (AI chat, result explanation, BaZi cross-reference, one-sentence query, scenario guidance)
**Avoids:** Pitfall 2 (AI hallucination — data-first, explanation-second architecture), Pitfall 9 (AI provider differences — abstract interface + DeepSeek/Qwen defaults + failover)
**Architecture:** Vercel AI SDK with provider registry. Streaming SSR for chat interface. System prompts include computed almanac data as context. Output validation checks AI-generated 干支 against computed values.

### Phase 5: Premium & Monetization
**Rationale:** Monetization features should come last when the platform has proven value through traffic (Phase 3) and AI engagement (Phase 4). Premature monetization gates features that should build trust first.
**Delivers:** Payment integration, AI 八字合参 (premium), PDF 报告导出, unlimited AI access for subscribers.
**Addresses:** Differentiators 3, 5 (AI BaZi cross-reference, PDF export), PAY-01 (payment system)
**Avoids:** Pitfall 3 (legal risk — frame as "高级文化研究服务," not "付费算命")

### Phase 6: Deployment & Polish
**Rationale:** Deployment configuration (宝塔/Nginx/PM2) has known traps that should be tested early but finalized last. Performance optimization and monitoring come after all features are stable.
**Delivers:** Production deployment on 宝塔 with Nginx, PM2, Docker Compose. Baidu Webmaster Tools submission. Performance optimization. Error monitoring.
**Avoids:** Pitfall 8 (宝塔 deployment traps — Docker Compose recommended, proper PM2 config, Nginx WebSocket headers, static asset serving), Pitfall 6 (font loading — aggressive subsetting, unicode-range splitting)

### Phase Ordering Rationale

- **Data before UI before AI:** AlmanacService (Phase 1) -> UI components (Phase 2) -> AI layer (Phase 4) ensures AI prompts always have correct data to reference. This is the core defense against AI hallucination (Pitfall 2).
- **SEO before monetization:** Traffic must exist before conversion. Phase 3 (SEO matrix) creates the traffic funnel that Phase 5 (premium) monetizes.
- **Phases 3 and 4 can parallelize:** SEO pages (Phase 3) and AI integration (Phase 4) both depend on Phase 2 but not on each other. They can be developed simultaneously by different developers.
- **Deployment last:** 宝塔/Nginx configuration (Pitfall 8) should be tested early (set up in Phase 1) but finalized in Phase 6 when all features are stable and the full URL matrix is known.
- **Legal positioning is Phase 1:** The "文化研究/民俗文化工具" framing and disclaimers must be in the architecture from day one, not bolted on later.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (SEO):** Baidu-specific SEO tactics need validation with current Baidu Webmaster Tools. The `tyme4ts` API surface for 八字排盘 needs hands-on verification — the npm description claims support but actual API coverage is unconfirmed. Third-party API selection for complex 八字/风水 calculations needs evaluation.
- **Phase 4 (AI):** Prompt engineering for Chinese fortune-telling content is a niche domain. System prompt design, output validation rules, and provider quality comparison need hands-on testing with real queries. DeepSeek vs Qwen quality for specific 命理 topics is benchmarked but not tested in this specific use case.
- **Phase 5 (Premium):** Payment integration specifics (WeChat Pay, Alipay) and subscription model design need market research. Legal review of monetization framing is mandatory.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Next.js 16 + next-intl + Prisma + ioredis are all well-documented with verified versions. Standard scaffolding patterns.
- **Phase 2 (Core UI):** Component architecture follows established shadcn/ui + Server Components patterns. AlmanacCard, MonthCalendar are standard data-display components.
- **Phase 6 (Deployment):** Docker Compose + PM2 + Nginx is a well-documented stack. 宝塔-specific traps are already documented in PITFALLS.md.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified via npm registry. Technology choices validated against official documentation via Context7. Installation commands tested. |
| Features | MEDIUM | Table stakes features are HIGH confidence (universal across competitors). AI differentiators and monetization patterns are MEDIUM (based on training knowledge, not live competitor analysis — sites were blocked during research). |
| Architecture | HIGH | Patterns verified against Next.js 16, next-intl, Vercel AI SDK, and tyme4ts official documentation. Data flow patterns are standard for this type of application. |
| Pitfalls | MEDIUM | Lunar calendar pitfalls (MEDIUM-HIGH) verified via library docs. Legal/compliance pitfalls (LOW — needs lawyer). Baidu SEO pitfalls (MEDIUM — based on community knowledge). Deployment pitfalls (MEDIUM — common setup, version-specific behavior varies). |

**Overall confidence:** MEDIUM-HIGH

The stack and architecture are well-supported by verified documentation. Features and pitfalls rely partly on training knowledge of the Chinese almanac ecosystem, which should be validated against live competitor sites when network access permits.

### Gaps to Address

- **Competitor validation:** Live competitor sites (万年历, 神巴巴, 易安居, 灵机妙算) were blocked during research. Feature sets and monetization models should be validated against actual competitor sites before finalizing requirements.
- **tyme4ts API verification:** The npm description claims comprehensive 八字/宜忌 support, but the actual API surface should be verified during Phase 1 implementation. Fall back to `lunar-javascript` if needed.
- **Legal review:** Chinese internet law compliance (Pitfall 3) has LOW confidence. A lawyer specializing in this area must review the product positioning, disclaimers, and monetization model before launch.
- **SEO keyword validation:** Keyword volumes (百度指数, 5118) for target terms like "今日黄历", "结婚吉日", "八字排盘" should be validated to confirm traffic assumptions.
- **Third-party API selection:** Complex 八字排盘 and 风水 calculations need third-party APIs (DATA-02). Specific providers have not been evaluated — this needs research during Phase 3 planning.
- **AI prompt engineering:** System prompts for fortune-telling content are a specialized domain. Quality and accuracy need hands-on testing with real user queries during Phase 4.

---
*Research completed: 2026-05-16*
*Ready for roadmap: yes*
