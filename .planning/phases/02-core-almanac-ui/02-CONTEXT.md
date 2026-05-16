# Phase 2: Core Almanac UI - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

完整的黄历浏览体验：今日黄历卡片、12时辰吉凶表、月历视图、24节气查询、每日黄历详情页。用户可以浏览今天的完整黄历信息，查看每个时辰的吉凶，按月浏览每日运势，查询节气，以及通过 /almanac/YYYY-MM-DD 访问任何一天的详细黄历。

**Requirements:** ALM-03, ALM-04, ALM-05, ALM-06, ALM-07

</domain>

<decisions>
## Implementation Decisions

### 今日黄历卡片（ALM-03）
- **D-01:** 核心信息突出 + 次要信息折叠。干支、农历日期、宜忌大字显眼展示；冲煞方位、财神/喜神/福神、星宿、彭祖百忌、纳音、胎神折叠在「展开更多」区域。
- **D-02:** 卡片顶部显示：标题"今日黄历" + 公历日期，下方农历日期 + 生肖，再下方干支三柱（年/月/日），然后宜忌列表。

### 时辰吉凶表（ALM-04）
- **D-03:** 时间线布局（垂直），左边时辰名+时间，右边详情（宜忌、星神、冲煞）。
- **D-04:** 吉凶标识用书法风格：毛笔字体的"吉"/"凶"字作为标识，配合颜色（吉=红/金字，凶=灰/暗字）。不是简单的勾叉图标。
- **D-05:** 宜忌事项配合插图/图标展示说明，增强视觉表现力。需要设计或找现成的命理相关图标。

### 月历视图（ALM-05）
- **D-06:** 传统日历网格样式，7列（日一二三四五六），每天一格显示农历日期 + 吉凶色块。
- **D-07:** 颜色编码：红底/金字 = 吉日，灰底 = 凶日，白底 = 平日。今天的格子高亮。
- **D-08:** 顶部左右箭头切换月份，中间显示当前年月（如"2026年5月 · 农历四月"）。
- **D-09:** 点击某天跳转到 /almanac/YYYY-MM-DD 详情页。

### 黄历详情页（ALM-07）
- **D-10:** 全部信息分区展示，一个长页面。分区顺序：日期+干支+农历 → 宜忌 → 时辰吉凶（时间线） → 方位（冲煞/财神/喜神/福神） → 神煞 → 值神 → 二十八星宿 → 彭祖百忌 → 纳音 → 胎神。
- **D-11:** URL 格式 /almanac/YYYY-MM-DD，SSR 渲染，支持 SEO。

### 节气页面（ALM-06）
- **D-12:** 单页列表展示 24 节气，按季节分组（春/夏/秋/冬）。每个节气显示：节气名、日期、含义、传统习俗。
- **D-13:** 节气数据可以从 tyme4ts 获取，也可以静态定义（每年日期变化不大）。

### 导航
- **D-14:** Header 加主导航链接：首页 | 月历 | 节气。3个入口覆盖 Phase 2 所有页面。
- **D-15:** 黄历详情页通过月历点击进入，不单独放导航。

### Claude's Discretion
- AlmanacService 是否需要扩展 API（如 getMonthlyAlmanac、getHourlyFortune、getSolarTerms）由 Claude 决定
- 月历数据缓存策略（按月缓存 vs 按日缓存拼装）
- 节气数据是静态还是动态获取
- 时辰吉凶的具体数据结构和渲染方式
- 响应式布局细节（移动端/桌面端适配）

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Configuration
- `.planning/PROJECT.md` — Project definition, core value, requirements, constraints
- `.planning/REQUIREMENTS.md` — Full v1 requirements with traceability
- `.planning/ROADMAP.md` — 5-phase roadmap with goals and success criteria
- `.planning/STATE.md` — Current project state
- `CLAUDE.md` — Project-specific guidelines, tech stack, conventions

### Prior Phase Context
- `.planning/phases/01-foundation-data-layer/01-CONTEXT.md` — Phase 1 decisions (Prisma schema, OpenCC, tyme4ts verification)
- `.planning/phases/01-foundation-data-layer/01-SUMMARY.md` — What was built in Phase 1
- `.planning/phases/01-foundation-data-layer/01-02-SUMMARY.md` — AlmanacService implementation details

### Existing Code (Phase 1)
- `src/lib/almanac/service.ts` — AlmanacService wrapping tyme4ts
- `src/lib/almanac/types.ts` — DailyAlmanac type definition
- `src/lib/almanac/cache.ts` — Redis cache helpers (24h TTL)
- `src/app/[locale]/page.tsx` — Current homepage
- `src/components/ui/card.tsx` — shadcn Card component
- `src/components/layout/Header.tsx` — Header component (needs nav addition)

### External References
- tyme4ts npm: https://www.npmjs.com/package/tyme4ts — Chinese calendar algorithm library
- shadcn/ui docs: https://ui.shadcn.com — Component primitives

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AlmanacService.getDailyAlmanac(dateStr)` — Returns DailyAlmanac with all fields needed for cards and detail pages
- `DailyAlmanac` type — Already has lunar, ganZhi, zodiac, yi, ji, direction, gods, duty, twentyEightStar, pengZu, sound, fetusDay
- shadcn Card/Button/Separator — UI primitives ready to use
- Responsive layout shell — Header + Footer + max-w-[65ch] container
- Redis cache layer — 24h TTL pattern established

### Established Patterns
- Server Components for data fetching (page.tsx calls getDailyAlmanac directly)
- next-intl useTranslations for all UI text
- Tailwind v4 CSS-first theme with Chinese design tokens (red/gold palette)
- Locale-aware routing via /[locale]/ prefix

### Integration Points
- AlmanacService may need new methods: getMonthlyAlmanac, getHourlyFortune, getSolarTerms
- Header.tsx needs nav links added (currently only brand + locale toggle)
- New routes needed: /[locale]/almanac/[date], /[locale]/calendar, /[locale]/solar-terms

</code_context>

<specifics>
## Specific Ideas

- 时辰吉凶标识要用书法风格毛笔字"吉"/"凶"，不是简单图标
- 宜忌事项配合插图/图标增强视觉表现力
- 月历用传统日历网格，有传统黄历的感觉但保持现代 UI
- 参考站点 http://jiton.com.cn/ 的黄历展示方式，但用现代 SSR 实现

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-Core Almanac UI*
*Context gathered: 2026-05-17*
