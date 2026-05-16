<!-- GSD:project-start source:PROJECT.md -->
## Project

**今擇易 (JinZeYi)**

AI 黄历择吉工具平台，面向中文用户提供黄道吉日查询、八字排盘、生肖配对、风水知识、起名工具等传统命理服务。以现代 AI 技术赋能传统择吉文化，让用户通过自然语言提问获得个性化的择吉建议。

品牌名"今擇易"——今日择吉，简易明白。

**Core Value:** AI 驱动的个性化择吉体验：不只是给日期，更告诉用户"为什么选这天"、"避开了什么"、"还有什么备选"。

### Constraints

- **Tech Stack**: Next.js + TypeScript + Tailwind CSS + shadcn/ui + PostgreSQL + Redis + Prisma
- **SEO**: 必须 SSR/SSG，搜索引擎可抓取；URL 采用混合路径（核心拼音 /jieri/，工具英文 /tools/）
- **I18N**: 繁简体通过 URL 路径区分（/zh-hant/、/zh-hans/），SEO 友好
- **AI**: 先设计抽象接口层，支持 DeepSeek/阿里云百炼/OpenAI 切换
- **Data**: 基础黄历数据用万年历算法库自算，复杂数据（八字排盘）调用第三方 API
- **Deployment**: 宝塔 + Nginx + PM2，或 Docker Compose
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.2.x | Full-stack React framework | App Router with SSR/SSG/ISR for SEO; built-in API routes for AI endpoints; `generateStaticParams` for pre-rendering thousands of almanac pages; latest stable release |
| TypeScript | 5.x | Type safety | Non-negotiable for data-heavy domain (calendar calculations, API integrations, Prisma types) |
| React | 19.x | UI library | Bundled with Next.js 16; Server Components reduce client JS for content-heavy pages |
### Internationalization (繁简体)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-intl | 4.12.x | i18n routing + translations | De facto standard for Next.js App Router i18n; middleware-based locale detection; supports `zh-hant`/`zh-hans` URL prefixes; ICU message syntax; Server Component native |
### UI Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.3.x | Utility-first CSS | v4 is the current stable; CSS-first config (no tailwind.config.js); native `@theme` for Chinese design tokens; excellent for content-heavy pages |
| shadcn/ui | 2.9.x (CLI) | Component primitives | Copy-paste components (not a dependency); built on Radix UI; fully customizable; Card/Button/Dialog/Tabs for almanac UI patterns |
| Lucide React | latest | Icon library | Bundled with shadcn/ui; clean line icons suitable for traditional Chinese aesthetic |
| next/font | built-in | Chinese font loading | `Noto Sans SC` (简体) / `Noto Sans TC` (繁體) via Google Fonts; automatic subsetting; zero layout shift |
- Use `font-family` with both SC and TC variants; switch via `next-intl` locale
- Traditional Chinese characters are visually denser — slightly larger base font size (16-17px)
- Chinese content is typically wider — use `max-w-prose` or `max-w-[65ch]` for readability
- Color palette: red/gold for auspicious themes, but keep it modern (not kitsch)
### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| PostgreSQL | 16.x | Primary database | Robust, mature; JSON support for flexible almanac data; full-text search for Chinese content; excellent Prisma support |
| Prisma | 7.8.x | ORM + migrations | Type-safe queries; schema-first design; migration system; Prisma Studio for data exploration; excellent DX |
### Caching
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| ioredis | 5.10.x | Redis client | Most popular Node.js Redis client; cluster/sentinel support; pipeline support; TypeScript types |
| Redis | 7.x | Cache layer | Daily almanac data is read-heavy, write-once-per-day; perfect cache pattern |
### AI Integration
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel AI SDK | 6.0.x | AI abstraction layer | Unified API for multiple providers; streaming support; `streamText`/`generateText`; provider registry for hot-swapping; tool calling support |
| @ai-sdk/openai | 3.0.x | OpenAI provider | Works with DeepSeek (OpenAI-compatible endpoint) |
| @ai-sdk/openai-compatible | 2.0.x | Generic OpenAI-compat | For 阿里云百炼/通义千问 (DashScope compatible endpoint) |
- Provider registry lets you swap DeepSeek/Qwen/OpenAI with zero code changes
- Built-in streaming with `toUIMessageStreamResponse()` for Next.js route handlers
- Tool calling for structured AI responses (e.g., returning date recommendations as JSON)
- Rate limiting, retries, and error handling built in
| Provider | Model | Cost | Chinese Quality | Use Case |
|----------|-------|------|-----------------|----------|
| DeepSeek | deepseek-chat | Low | Excellent | Default for general fortune queries |
| 阿里云百炼 | qwen-plus | Medium | Excellent | Backup; better for complex 八字 analysis |
| 阿里云百炼 | qwen-max | High | Best | Premium tier (future paid features) |
### Chinese Calendar Algorithms
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| lunar-javascript | 1.7.x | 万年历核心算法 | Most comprehensive Chinese calendar library; zero dependencies; supports 农历/干支/生肖/节气/宜忌/八字/五行/星宿; by 6tail (active maintainer) |
| tyme4ts | 1.4.x | Lunar library (TypeScript) | TypeScript-native rewrite by same author (6tail); better type safety; "升级版" of lunar-javascript |
- Complex 八字 大运/流年 analysis
- 专业风水罗盘 calculations
- 姓名学 五格剖象 detailed scoring
### SEO & Sitemap
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-sitemap | 4.2.x | Sitemap generation | Auto-generates sitemap.xml from routes; supports i18n alternate hreflang; works with App Router |
| Next.js Metadata API | built-in | Meta tags | `generateMetadata()` for dynamic title/description/OG tags per page |
- Submit sitemap to 百度搜索资源平台 (ziyuan.baidu.com)
- Use `lang="zh-Hant"` / `lang="zh-Hans"` in `<html>` tag
- Baidu respects `hreflang` but also needs `Content-Language` header
- Baidu crawls JavaScript but prefers SSR/SSG (confirmed by PROJECT.md reference site needing Playwright)
### Validation & Utilities
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | 4.4.x | Schema validation | API request validation; environment variable parsing; AI response schema |
| date-fns | latest | Date manipulation | Calendar calculations that `lunar-javascript` doesn't cover; formatting |
| sharp | 0.34.x | Image processing | OG image generation; image optimization for SEO pages |
| @tanstack/react-query | 5.x | Client data fetching | AI chat interface; real-time almanac updates; optimistic UI |
### Deployment
| Technology | Purpose | Why |
|------------|---------|-----|
| PM2 | Process manager | Cluster mode for Next.js; auto-restart; log management; zero-downtime reload |
| Nginx (宝塔) | Reverse proxy + SSL | Static file serving; SSL termination; gzip compression; security headers |
| Docker Compose | Service orchestration | PostgreSQL + Redis + Next.js app in isolated containers |
# docker-compose.yml
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
# Create project
# Core dependencies
# Dev dependencies
# shadcn/ui setup
# Prisma init
## Environment Variables
# Database
# Redis
# AI Providers
# Next.js
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
