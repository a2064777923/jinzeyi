# Requirements: 今擇易 (JinZeYi)

**Defined:** 2026-05-16
**Core Value:** AI 驱动的个性化择吉体验——不只是给日期，更告诉用户"为什么选这天"、"避开了什么"、"还有什么备选"。

## v1 Requirements

### Foundation (基础架构)

- [ ] **FOUND-01**: Next.js 16 + TypeScript 项目初始化，App Router 结构
- [ ] **FOUND-02**: Tailwind CSS 4 + shadcn/ui 组件库集成，中文优化主题（红金配色、16-17px 基础字号）
- [ ] **FOUND-03**: PostgreSQL 16 + Prisma 7 数据库集成，schema 设计（内容页、SEO 元数据、AI 日志）
- [ ] **FOUND-04**: Redis 7 + ioredis 缓存层集成，用于每日黄历数据缓存（24h TTL）
- [ ] **FOUND-05**: 法律免责声明框架——每页底部显示"文化研究/民俗文化工具"声明
- [ ] **FOUND-06**: 响应式布局——移动端优先，适配手机/平板/桌面

### I18N (国际化)

- [ ] **I18N-01**: next-intl 集成，URL 路径前缀区分繁简体（/zh-hant/、/zh-hans/）
- [ ] **I18N-02**: 中间件语言检测——根据浏览器语言、URL 前缀自动选择
- [ ] **I18N-03**: OpenCC 自定义词典——命理术语繁简正确转换（天干"干"不变成"乾/幹"，地支"丑"不变成"醜"）
- [ ] **I18N-04**: 繁简体切换 UI 组件——导航栏语言切换按钮

### Almanac (核心黄历)

- [ ] **ALM-01**: tyme4ts 万年历算法库集成——计算每日干支、农历、生肖、宜忌、冲煞
- [ ] **ALM-02**: AlmanacService 服务层——封装 tyme4ts，提供统一 API，Redis 缓存
- [ ] **ALM-03**: 今日黄历卡片组件——公历、农历、干支、生肖、宜忌、冲煞、财神方位、吉神凶煞
- [ ] **ALM-04**: 时辰吉凶表组件——12 时辰详细宜忌、星神、冲煞、吉凶标注
- [ ] **ALM-05**: 月历视图组件——按月浏览每日吉凶，颜色区分吉日/凶日，可切换月份
- [ ] **ALM-06**: 节气查询页面——24 节气日期、含义、传统习俗
- [ ] **ALM-07**: 每日黄历详情页（SSR/ISR）——URL 格式 /almanac/YYYY-MM-DD，包含完整黄历信息

### SEO Matrix (SEO 工具矩阵)

- [ ] **SEO-01**: 吉日查询矩阵页面——结婚、搬家、开业、装修、签约、出行、安葬、起名、合婚等场景
- [ ] **SEO-02**: 每个场景的年度吉日列表页——SSG 预渲染，URL 格式 /jieri/{scene}/{year}
- [ ] **SEO-03**: 生肖内容页——12 生肖运势、配对、性格分析，SSG 预渲染
- [ ] **SEO-04**: 八字排盘页面——基础八字排盘工具，用户输入出生日期时间，展示八字信息
- [ ] **SEO-05**: 风水知识页面——风水基础概念、家居风水、办公室风水等知识内容
- [ ] **SEO-06**: 起名工具页面——基础起名查询，五行属性、姓名吉凶
- [ ] **SEO-07**: XML Sitemap 自动生成——按语言版本分别生成，支持 hreflang 标注
- [ ] **SEO-08**: 结构化数据（JSON-LD）——黄历、文章、工具页面的 Schema.org 标注
- [ ] **SEO-09**: Meta 标签优化——每个页面独立的 title/description/keywords，Content-Language meta 标签

### AI Layer (AI 抽象层)

- [ ] **AI-01**: Vercel AI SDK 集成——provider 注册表，支持 DeepSeek/Qwen/OpenAI 切换
- [ ] **AI-02**: AIService 服务层——统一封装 AI 调用，provider 降级策略
- [ ] **AI-03**: AI API 路由——Next.js API routes for AI endpoints，支持流式响应
- [ ] **AI-04**: 环境变量配置——AI_PROVIDER、DEEPSEEK_API_KEY、QWEN_API_KEY、OPENAI_API_KEY

### Data (数据层)

- [ ] **DATA-01**: 万年历算法库验证——tyme4ts API 面验证，回归测试覆盖闰月、年边界、1900-2100 范围
- [ ] **DATA-02**: 第三方 API 集成框架——为复杂八字排盘/风水计算预留外部 API 调用接口
- [ ] **DATA-03**: 数据缓存策略——每日黄历 Redis 缓存（24h TTL），月度吉日预计算（7d TTL）

### Deployment (部署)

- [ ] **DEPLOY-01**: Docker Compose 配置——PostgreSQL + Redis + Next.js 容器编排
- [ ] **DEPLOY-02**: 宝塔 + Nginx 反向代理配置——SSL、WebSocket 支持、静态资源缓存
- [ ] **DEPLOY-03**: PM2 集群模式配置——进程管理、内存限制、日志轮转

## v2 Requirements

### AI Features (AI 功能)

- **AI-V2-01**: AI 择吉问答——自然语言输入，AI 智能解析并推荐日期
- **AI-V2-02**: AI 结果解释——不只给日期，还给"为什么选这天""避开了什么""备选日期"
- **AI-V2-03**: 场景化引导——结婚/搬家/开业等场景的引导式择吉流程
- **AI-V2-04**: 一句话提问——"我属龙，女方属鸡，想 2026 年 10 月结婚，选周末"

### Premium (付费功能)

- **PAY-V2-01**: 付费转化体系——免费基础结果 + 高级版（八字合参、生肖避冲）
- **PAY-V2-02**: AI 八字合参——双方八字深度交叉分析
- **PAY-V2-03**: PDF 报告导出——专业择吉报告生成
- **PAY-V2-04**: 微信支付/支付宝集成

### Advanced (进阶功能)

- **ADV-V2-01**: 用户注册登录体系——个人资料、历史查询记录
- **ADV-V2-02**: 后台管理系统——内容管理、用户管理、数据统计
- **ADV-V2-03**: 更多工具——二十八星宿、三伏天/三九天查询、闰月查询、六十甲子表

## Out of Scope

| Feature | Reason |
|---------|--------|
| 社交功能（论坛、评论、分享） | v1 专注工具属性，社交增加复杂度 |
| 大师在线咨询 | 法律风险高，责任界定困难 |
| 面相/手相 AI 分析 | 不同产品类别，品牌混淆 |
| 塔罗牌/西方星座 | 品牌定位不符，"今擇易"是中式命理 |
| 电商/商品推荐 | 监管风险，与核心价值无关 |
| 紫微斗数/六爻/奇门遁甲 | 小众受众，复杂 UI，v1 不做 |
| 移动端 App | 先做好 Web 响应式，App 后续考虑 |
| 多时区支持 | 目标用户为 UTC+8 中文用户 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 ~ FOUND-06 | Phase 1 | Pending |
| I18N-01 ~ I18N-04 | Phase 1 | Pending |
| ALM-01 ~ ALM-02 | Phase 1 | Pending |
| ALM-03 ~ ALM-07 | Phase 2 | Pending |
| SEO-01 ~ SEO-09 | Phase 3 | Pending |
| AI-01 ~ AI-04 | Phase 4 | Pending |
| DATA-01 ~ DATA-03 | Phase 1 | Pending |
| DEPLOY-01 ~ DEPLOY-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-16*
*Last updated: 2026-05-16 after initial definition*
