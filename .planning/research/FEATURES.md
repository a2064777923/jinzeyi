# Feature Landscape

**Domain:** AI 黄历择吉工具平台 (Chinese Almanac & Fortune Telling)
**Researched:** 2026-05-16
**Confidence:** MEDIUM (training knowledge + project context; unable to verify with live competitor sites due to network restrictions)

> Note: Live competitor site access was blocked during research. Findings are based on training knowledge of the ecosystem (万年历, 神巴巴, 易安居, 灵机妙算, 测测星座, etc.) and the reference site structure from PROJECT.md. Recommend validating key assumptions against actual competitor sites before finalizing requirements.

---

## Table Stakes

Features users expect from any Chinese almanac site. Missing any of these = users bounce to a competitor immediately.

### 1. 今日黄历卡片 (Today's Almanac Card)

**Why expected:** This is the homepage anchor. Every almanac site (万年历, 老黄历, 360黄历) opens with today's information. Users visit specifically to check "today怎么样."

**What it must show:**
- 公历日期 (Gregorian date)
- 农历日期 (Lunar date)
- 干支日 (Heavenly Stems & Earthly Branches for the day)
- 今日生肖 (Day's zodiac animal)
- 宜 (Auspicious activities) — list of recommended activities
- 忌 (Inauspicious activities) — list of activities to avoid
- 冲煞 (Clash & Sha) — which zodiac is clashed, which direction has sha
- 财神方位 (God of Wealth direction)
- 吉时/凶时 (Auspicious/inauspicious hours)

**Complexity:** Medium (requires reliable 万年历 algorithm)
**Dependencies:** DATA-01 (万年历算法库)

---

### 2. 时辰吉凶表 (Hourly Fortune Table)

**Why expected:** Users checking today's almanac expect to see all 12 时辰 (two-hour periods) with their fortune ratings. This is standard on every competitor.

**What it must show:**
- 12 时辰 (子时 through 亥时) with time ranges
- Each hour: 吉/凶 rating, 宜忌, 星神, 冲煞

**Complexity:** Low (derives from day's 干支 data)
**Dependencies:** DATA-01

---

### 3. 黄道吉日查询 (Auspicious Day Query)

**Why expected:** The core use case. Users come to find the best date for a specific activity. Every competitor has this. Without it, the site is not a "择吉" site.

**What it must support:**
- 场景选择 (Scenario selection): 结婚/嫁娶, 搬家/入宅, 开业/开张, 动土/装修, 签约, 出行, 安葬, 祈福, etc.
- 日期范围选择 (Date range): 本月, 未来3个月, 自定义范围
- 结果展示: 推荐日期列表 with 宜忌, 冲煞, 吉时
- 日历视图: 月历 with color-coded 吉凶 indicators

**Complexity:** Medium (algorithm + UI)
**Dependencies:** DATA-01, SEO-01

---

### 4. 月历视图 (Monthly Calendar View)

**Why expected:** Users want to browse by month, see at a glance which days are good/bad. Standard on 万年历, 日历网, etc.

**What it must show:**
- Month grid with 公历 + 农历 dates
- Color-coded 吉凶 indicators (green=吉, red=凶)
- Click any day to see full details
- Month navigation (prev/next)

**Complexity:** Low-Medium
**Dependencies:** DATA-01

---

### 5. 基础生肖内容 (Basic Zodiac Content)

**Why expected:** 生肖 (Chinese zodiac) is a massive traffic driver. Users search "属虎今日运势" etc. Every competitor has zodiac pages. Critical for SEO.

**What it must include:**
- 12 生肖运势页面 (daily/monthly/yearly fortune for each zodiac)
- 生肖性格分析 (personality traits)
- 生肖配对 (compatibility between zodiacs)
- 本命年提醒 (Ben Ming Nian / zodiac year warnings)

**Complexity:** Low (mostly content)
**Dependencies:** SEO-02

---

### 6. 基础八字排盘 (Basic BaZi Chart)

**Why expected:** 八字排盘 is one of the most searched terms in this domain. Users input birth date/time and expect a chart. Competitors like 元亨利贞, 神巴巴 all offer this.

**What it must show:**
- 四柱 (Four Pillars): 年柱, 月柱, 日柱, 时柱
- 天干地支 for each pillar
- 五行 distribution (金木水火土)
- 十神 (Ten Gods) analysis
- 基础解读 (basic interpretation)

**Complexity:** Medium-High (algorithm or API)
**Dependencies:** DATA-02 (third-party API for complex calculations)

---

### 7. 基础起名工具 (Basic Naming Tool)

**Why expected:** 起名 (baby naming) is a high-intent, high-value use case. Parents actively search for this. Sites like 起名网 (qiming.com) are entirely built around this.

**What it must include:**
- 姓名测试 (name scoring based on 三才五格)
- 基于八字的起名建议 (suggestions based on BaZi five elements)
- 姓名含义查询 (name meaning lookup)

**Complexity:** Medium
**Dependencies:** SEO-05, DATA-02

---

### 8. 基础风水知识 (Basic Feng Shui Content)

**Why expected:** 风水 is a major content vertical. Users search for "家居风水"、"办公室风水" etc. Provides SEO traffic and positions the site as comprehensive.

**What it must include:**
- 风水入门知识 (Feng Shui basics)
- 家居风水布局 (home layout guidance)
- 办公室风水 (office Feng Shui)
- 方位吉凶 (directional fortune)

**Complexity:** Low (content-driven)
**Dependencies:** SEO-04

---

### 9. 节气查询 (Solar Terms Query)

**Why expected:** 二十四节气 is a standard reference feature. Users check "今天是什么节气" or look up upcoming solar terms. Low effort, high SEO value.

**What it must show:**
- All 24 solar terms with dates
- Current/upcoming solar term highlighted
- Brief description of each term's significance

**Complexity:** Low (static data with annual updates)
**Dependencies:** SEO-06

---

### 10. 移动端适配 (Mobile Responsive)

**Why expected:** Majority of almanac traffic is mobile (users check on the go, in the morning, before important events). Google/百度 also penalize non-mobile-friendly sites.

**Complexity:** Medium (built into Next.js + Tailwind)
**Dependencies:** None (built into tech stack)

---

### 11. 繁简体切换 (Traditional/Simplified Chinese Toggle)

**Why expected:** Targeting both mainland (简体) and Taiwan/HK/overseas (繁體) Chinese users. The project already specifies URL-based i18n.

**Complexity:** Medium (content translation + URL routing)
**Dependencies:** I18N-01

---

## Differentiators

Features that set 今擇易 apart from competitors. These create competitive advantage and justify the "AI" positioning.

### 1. AI 择吉问答 (AI Fortune Telling Chat)

**Value proposition:** Instead of just showing a list of dates, users can ask "我下个月想搬家，帮我选个好日子" in natural language and get a personalized, explained answer. No competitor does this well — most are static tools.

**What it must include:**
- Natural language input field
- AI parses intent (what activity, what constraints)
- AI returns recommended dates with explanations
- "为什么选这天" (why this day) explanation
- "避开了什么" (what was avoided) explanation
- "备选日期" (alternative dates)

**Complexity:** High (LLM integration + prompt engineering)
**Dependencies:** AI-01, AI-02, AI-03, AI-04

---

### 2. AI 结果解释 (AI-Powered Result Explanation)

**Value proposition:** Traditional sites show dry data (宜: 嫁娶, 忌: 动土). 今擇易 explains in plain language WHY a day is good for marriage, what cosmic factors are at play, and what to watch out for. This is the core "AI赋能" differentiator.

**What it must include:**
- Plain-language explanation of 干支, 五行, 冲煞
- Contextual advice (e.g., "这天虽然宜嫁娶，但冲属虎的人，如果新郎属虎建议另选")
- Risk warnings and mitigation suggestions

**Complexity:** Medium-High (prompt engineering + domain knowledge)
**Dependencies:** AI-04

---

### 3. AI 八字合参 (AI BaZi Cross-Reference)

**Value proposition:** When recommending dates, cross-reference with user's birth chart for personalized recommendations. Traditional sites show generic "宜忌"; 今擇易 says "根据你的八字，这天对你特别有利因为..."

**What it must include:**
- Optional birth date/time input
- AI combines almanac data + user's BaZi for personalized advice
- Explains the interaction between the day's energy and user's chart

**Complexity:** High (BaZi algorithm + AI reasoning)
**Dependencies:** AI-01, AI-02, PAY-01 (premium feature)

---

### 4. 一句话提问 (One-Sentence Query)

**Value proposition:** Users don't need to navigate menus or fill forms. Just type "下周三适合签合同吗" and get an instant answer. This is a UX differentiator over form-based competitors.

**What it must include:**
- Single input field on homepage (prominent)
- AI parses: activity type + date/time constraint + user context
- Returns: yes/no recommendation + explanation + alternatives

**Complexity:** Medium (NLP intent parsing)
**Dependencies:** AI-03

---

### 5. PDF 报告导出 (PDF Report Export)

**Value proposition:** Users preparing for important events (wedding, business opening) want a professional-looking report they can share with family/friends/master. This is a premium feature competitors rarely offer.

**What it must include:**
- Formatted PDF with date recommendation, explanations, charts
- Customizable: include/exclude BaZi analysis, zodiac compatibility
- Downloadable and shareable

**Complexity:** Medium (PDF generation library)
**Dependencies:** PAY-01 (premium feature)

---

### 6. 场景化引导 (Scenario-Based Guidance)

**Value proposition:** Instead of showing a generic almanac, guide users through their specific scenario. "你要结婚？让我帮你一步步选日子。" This reduces cognitive load and increases engagement.

**What it must include:**
- Guided flow: Select scenario -> Enter constraints -> Get recommendations
- Scenario-specific questions (e.g., for wedding: both parties' zodiac, venue availability)
- Contextual tips (e.g., "结婚吉日最好避开农历七月")

**Complexity:** Medium (UI flow design)
**Dependencies:** AI-02

---

### 7. 生肖配对详情 (Detailed Zodiac Compatibility)

**Value proposition:** Beyond simple "合/不合" ratings, provide nuanced compatibility analysis with specific advice. Users researching relationships (romantic or business) want depth.

**What it must include:**
- 12x12 compatibility matrix with detailed explanations
- Relationship type filtering (romantic, business, friendship)
- Specific advice for each pairing
- Year-specific compatibility (流年影响)

**Complexity:** Low-Medium (content + algorithm)
**Dependencies:** SEO-02

---

## Anti-Features

Features to deliberately NOT build. These are common in the ecosystem but would harm 今擇易's positioning, quality, or focus.

### 1. 社交功能 (Social Features: Forums, Comments, Sharing)

**Why avoid:** The project explicitly scopes this out. Social features add complexity (moderation, spam, liability) without adding tool value. v1 should be a pure tool, not a community.

**What to do instead:** Focus on being the best tool. Add social later only if user research demands it.

---

### 2. 大师在线咨询 (Live Master Consultation)

**Why avoid:** Platforms like 灵机妙算 and 高人汇 offer live consultations with "masters." This creates massive liability (human advice on life decisions), quality control nightmares, and regulatory risk. It also conflicts with the AI-first positioning.

**What to do instead:** Let AI be the "master." If users want human consultation, point them to external services (affiliate/referral model).

---

### 3. 面相/手相 AI 分析 (Face/Palm Reading via Camera)

**Why avoid:** Some apps (灵机妙算, 测测) offer photo-based face reading. This requires computer vision models, raises privacy concerns (facial data), and feels gimmicky. It also dilutes the "择吉" focus.

**What to do instead:** Stay focused on date/time-based tools. Face reading is a different product category.

---

### 4. 塔罗牌/西方星座 (Tarot / Western Astrology)

**Why avoid:** Mixing Western astrology (塔罗, 星座) with Chinese metaphysics confuses the brand positioning. Users looking for 塔罗 go to 测测星座; users looking for 黄历 come here. Stay in lane.

**What to do instead:** Be the best Chinese almanac/择吉 tool. Don't dilute with Western systems.

---

### 5. 电商/商品推荐 (E-commerce / Product Recommendations)

**Why avoid:** Some sites sell 开运商品 (fortune-enhancing products), 风水摆件, etc. This creates regulatory risk (making health/fortune claims about products), distracts from core tool value, and erodes trust.

**What to do instead:** If monetization through commerce is needed later, use affiliate links to established sellers, not direct sales.

---

### 6. 过度广告 (Aggressive Advertising)

**Why avoid:** Many almanac sites are ad-heavy (pop-ups, interstitials, auto-playing video). This destroys UX and makes the site feel cheap. The AI premium positioning requires a clean, professional experience.

**What to do instead:** Monetize through premium features (PDF reports, AI BaZi analysis), not through ad spam. If ads are needed, use minimal, non-intrusive placements.

---

### 7. 紫微斗数/六爻/奇门遁甲 (Advanced Metaphysics Systems)

**Why avoid:** 紫微斗数, 六爻, 奇门遁甲 are complex systems that require deep domain expertise and significant UI investment. They serve a niche audience of practitioners, not the mainstream "我要选个好日子" user. Competitors like 元亨利贞 already own this space.

**What to do instead:** Focus on 八字 (which is most relevant to 择吉) and leave advanced systems for potential future expansion.

---

### 8. 无限免费 AI 对话 (Unlimited Free AI Chat)

**Why avoid:** LLM API calls cost money. Offering unlimited free AI chat will hemorrhage money with no conversion path. Users will consume AI responses without ever paying.

**What to do instead:** Free tier: basic almanac data + limited AI queries (e.g., 3/day). Premium: unlimited AI + BaZi cross-reference + PDF reports.

---

## Feature Dependencies

```
DATA-01 (万年历算法)
├── 今日黄历卡片
├── 时辰吉凶表
├── 黄道吉日查询
├── 月历视图
└── 节气查询

DATA-02 (第三方API)
├── 八字排盘
├── 起名工具基础数据
└── AI 八字合参

AI-01 (抽象接口层)
├── AI-02 (场景化择吉)
├── AI-03 (一句话提问)
└── AI-04 (结果解释)

SEO-01 (吉日矩阵) ──→ 黄道吉日查询
SEO-02 (生肖页面) ──→ 基础生肖内容
SEO-03 (八字页面) ──→ 八字排盘
SEO-04 (风水页面) ──→ 风水知识
SEO-05 (起名页面) ──→ 起名工具
SEO-06 (节气页面) ──→ 节气查询

PAY-01 (付费体系)
├── AI 八字合参 (premium)
├── PDF 报告导出 (premium)
└── 无限AI对话 (premium)
```

---

## MVP Recommendation

**Phase 1 — Foundation (流量入口):**
1. 今日黄历卡片 (table stakes, homepage anchor)
2. 时辰吉凶表 (table stakes, low effort)
3. 月历视图 (table stakes, browsing)
4. 节气查询 (table stakes, SEO)
5. 移动端适配 (table stakes)

**Phase 2 — SEO Matrix (流量增长):**
1. 黄道吉日查询 + 吉日矩阵页面 (SEO-01)
2. 生肖内容页面 (SEO-02)
3. 八字排盘页面 (SEO-03)
4. 风水知识页面 (SEO-04)
5. 起名工具页面 (SEO-05)
6. 繁简体切换 (I18N-01)

**Phase 3 — AI Differentiation (竞争优势):**
1. AI 抽象接口层 (AI-01)
2. AI 结果解释 (AI-04) — explain existing data, not yet full chat
3. 场景化引导 (AI-02) — guided flows for major scenarios
4. 一句话提问 (AI-03) — natural language input

**Phase 4 — Premium Monetization:**
1. 付费转化体系 (PAY-01)
2. AI 八字合参 (premium)
3. PDF 报告导出 (premium)

**Rationale:** Start with data/tool foundation that drives organic traffic (SEO). Layer AI on top as differentiator once traffic exists. Monetize last when value is proven.

---

## SEO Strategy Notes

Based on ecosystem knowledge (MEDIUM confidence):

**Content Strategy:**
- 按日期生成页面: Every day = a unique URL (今日黄历 for 2026-05-16, 2026-05-17, etc.) — massive long-tail SEO
- 按场景生成页面: 结婚吉日, 搬家吉日, 开业吉日 = separate landing pages
- 按生肖生成页面: 属虎今日运势, 属兔今日运势 = 12 pages updated daily
- 节气/节日专题: Seasonal content spikes

**Technical SEO:**
- SSR/SSG is critical — competitor jiton.com.cn requires Playwright (JavaScript rendering), which hurts SEO. Next.js SSR/SSG is a direct advantage.
- Structured data (Schema.org) for dates, events, articles
- Fast load times (Next.js + Tailwind = lightweight)
- Clean URL structure (拼音 paths for Chinese SEO, English for tool pages)

**Traffic Patterns:**
- Peak: Morning hours (users check today's fortune), weekends, wedding season (spring/autumn), Chinese New Year
- High-intent keywords: "今日黄历", "黄道吉日查询", "结婚吉日", "搬家吉日", "八字排盘"
- Long-tail: "2026年6月结婚吉日", "属虎2026年运势"

---

## Monetization Patterns

Based on ecosystem knowledge (MEDIUM confidence):

| Model | Prevalence | Pros | Cons |
|-------|-----------|------|------|
| 广告 (Ads) | Very high | Easy to implement, passive revenue | Hurts UX, low eCPM for this niche |
| VIP订阅 (Subscription) | High | Recurring revenue, predictable | Low conversion (1-5%), needs strong value prop |
| 单次付费 (One-time purchase) | Medium | Good for reports/readings | No recurring revenue |
| API服务 (API service) | Low | B2B revenue, high margin | Requires stable, accurate data |
| 电商导流 (Affiliate) | Medium | No inventory risk | Low margins, brand risk |

**Recommended for 今擇易:**
- Free tier: All basic almanac data + 3 AI queries/day
- Premium: Unlimited AI + BaZi cross-reference + PDF reports
- Avoid: Ad-heavy model (conflicts with premium positioning)

---

## Sources & Confidence Notes

| Finding | Source | Confidence |
|---------|--------|------------|
| Table stakes features (今日黄历, 宜忌, 时辰) | Training knowledge of ecosystem | HIGH — these are universal across all competitors |
| Feature categorization | Training knowledge + PROJECT.md reference site structure | HIGH — consistent across 万年历, 神巴巴, 易安居, etc. |
| AI feature patterns | Training knowledge of 测测, 灵机妙算, etc. | MEDIUM — apps evolve rapidly, current state may differ |
| Monetization patterns | Training knowledge of app ecosystem | MEDIUM — market may have shifted |
| SEO strategies | Training knowledge + industry patterns | MEDIUM — algorithms change, verify with current tools |
| Anti-feature rationale | Project requirements + domain knowledge | HIGH — aligned with project scope |

**Validation needed:**
- Verify competitor feature sets against live sites (blocked during this research)
- Confirm AI feature patterns are current (field moves fast)
- Validate SEO keyword volumes with 百度指数 or 5118
- Check monetization models against current app store data (七麦/蝉大师)
