# 今擇易 (JinZeYi)

## What This Is

AI 黄历择吉工具平台，面向中文用户提供黄道吉日查询、八字排盘、生肖配对、风水知识、起名工具等传统命理服务。以现代 AI 技术赋能传统择吉文化，让用户通过自然语言提问获得个性化的择吉建议。

品牌名"今擇易"——今日择吉，简易明白。

## Core Value

AI 驱动的个性化择吉体验：不只是给日期，更告诉用户"为什么选这天"、"避开了什么"、"还有什么备选"。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **ALMANAC-01**: 首页展示今日黄历卡片（公历、农历、干支、生肖、宜忌、冲煞、财神方位、吉时）
- [ ] **ALMANAC-02**: 时辰吉凶表（12时辰详细宜忌、星神、冲煞）
- [ ] **ALMANAC-03**: 月历视图，可按月浏览每日吉凶
- [ ] **SEO-01**: 吉日工具矩阵页面（结婚、搬家、开业、装修、签约、出行、安葬、起名、合婚）
- [ ] **SEO-02**: 生肖知识页面（生肖运势、配对、性格分析）
- [ ] **SEO-03**: 八字排盘页面
- [ ] **SEO-04**: 风水知识页面
- [ ] **SEO-05**: 起名工具页面
- [ ] **SEO-06**: 节气查询页面
- [ ] **I18N-01**: 繁简体切换，URL 路径区分（/zh-hant/、/zh-hans/）
- [ ] **AI-01**: AI 择吉抽象接口层，支持多供应商切换（DeepSeek、阿里云百炼、OpenAI）
- [ ] **AI-02**: AI 择吉入口——用户选择场景（结婚/搬家/开业等），AI 给出推荐日期和解释
- [ ] **AI-03**: 一句话提问——自然语言输入，AI 智能解析并回答
- [ ] **AI-04**: 结果解释页——不只给日期，还给"为什么选这天""避开了什么""备选日期"
- [ ] **DATA-01**: 万年历算法库——计算每日干支、农历、宜忌、冲煞等基础数据
- [ ] **DATA-02**: 第三方 API 集成——复杂数据（八字排盘等）调用外部 API
- [ ] **PAY-01**: 付费转化体系——免费基础结果 + 高级版（八字合参、生肖避冲、PDF 报告）
- [ ] **DEPLOY-01**: 宝塔 + Nginx + PM2 部署方案

### Out of Scope

- 社交功能（论坛、评论、分享）——v1 专注工具属性
- 移动端 App——先做好 Web 响应式，App 后续考虑
- 用户注册登录体系——v1 先做无状态工具，后续加用户系统
- 微信支付/支付宝集成——v1 先做免费功能，付费功能后续迭代
- 后台管理系统——v1 先手动维护内容，后续加 Payload CMS 或自建 admin

## Context

- 参考站点：http://jiton.com.cn/（黄道吉日/老黄历/八字/生肖/风水/姓名工具站）
- 原站结构：首页（今日黄历+吉日查询）+ 吉日矩阵（/hdjr/jiehun.html 等）+ 生肖(/sx/) + 风水(/fs/) + 八字(/bz/) + 姓名(/xm/)
- 原站需要 Playwright 才能渲染完整内容（JavaScript 重度渲染）
- 新版需要 SSR/SSG 保证 SEO 效果
- 目标用户：需要择吉服务的中文用户（结婚、搬家、开业等场景）

## Constraints

- **Tech Stack**: Next.js + TypeScript + Tailwind CSS + shadcn/ui + PostgreSQL + Redis + Prisma
- **SEO**: 必须 SSR/SSG，搜索引擎可抓取；URL 采用混合路径（核心拼音 /jieri/，工具英文 /tools/）
- **I18N**: 繁简体通过 URL 路径区分（/zh-hant/、/zh-hans/），SEO 友好
- **AI**: 先设计抽象接口层，支持 DeepSeek/阿里云百炼/OpenAI 切换
- **Data**: 基础黄历数据用万年历算法库自算，复杂数据（八字排盘）调用第三方 API
- **Deployment**: 宝塔 + Nginx + PM2，或 Docker Compose

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 品牌名"今擇易" | 区别于原站，体现 AI+择吉定位 | — Pending |
| 跳过复刻直接做新版 | 避免两次重构，一步到位 | — Pending |
| 混合 SEO 路径 | 核心页面拼音（/jieri/jiehun/），工具页面英文（/tools/zodiac/） | — Pending |
| /zh-hant/ /zh-hans/ 前缀 | 标准 locale 前缀，SEO 最友好 | — Pending |
| AI 抽象接口层 | 灵活切换供应商，不被单一厂商绑定 | — Pending |
| 算法+API 混合数据 | 基础数据可控，复杂数据依赖专业服务 | — Pending |
| MVP 先做黄历卡片+SEO矩阵 | 先有流量入口，再叠加 AI 功能 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-16 after initialization*
