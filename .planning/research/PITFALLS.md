# Domain Pitfalls: 今擇易 (JinZeYi)

**Domain:** AI-powered Chinese almanac / fortune-telling web platform
**Researched:** 2026-05-16
**Overall confidence:** MEDIUM (training data + library docs; legal/compliance area is LOW confidence and needs lawyer review)

---

## Critical Pitfalls

Mistakes that cause data inaccuracy, legal trouble, or complete rewrites.

---

### Pitfall 1: Lunar Calendar Algorithm Data Errors (万年历数据错误)

**What goes wrong:** The lunar-to-solar conversion, leap month (闰月) identification, or GanZhi (干支) calculation produces wrong results. Users see a wrong date for a wedding or move, and the platform loses all credibility instantly.

**Why it happens:** Chinese lunar calendar algorithms are deceptively complex:
- **Leap month (闰月) handling:** Each year's leap month position changes. The convention is to use negative month numbers (e.g., `Lunar.fromYmd(2020, -4, 2)` for leap 4th month), but many implementations get the sign convention wrong or mishandle the 13-month year.
- **Bitmask encoding errors:** Most libraries use packed hex data tables (e.g., `0x04bd8`) where bit positions encode big/small months and leap month info. Off-by-one in bit shifting corrupts entire year ranges.
- **Base date anchoring:** Algorithms typically anchor on January 31, 1900 (庚子年正月初一). Off-by-one errors in day-offset calculations cascade through all subsequent dates.
- **Year boundary (春节):** Lunar New Year falls between Jan 21 and Feb 20. Dates before Spring Festival belong to the previous lunar year -- many implementations forget this.
- **Solar term (节气) confusion:** Solar terms follow the solar calendar, not lunar. The leap month is determined by which lunar month contains no 中气 (major solar term). Mixing these up breaks the entire calendar.
- **1900-2100 table limitation:** Most lookup-table approaches hardcode data for ~200 years. Extending beyond requires recomputing astronomical data.

**Consequences:** Wrong 宜忌 (auspicious/inauspicious) recommendations. Users who discover errors will publicly call out the site. Fortune-telling is a trust-sensitive domain -- one wrong date destroys credibility permanently.

**Prevention:**
1. Use **`lunar-javascript`** (by 6tail) as the primary library -- it is the most battle-tested open-source Chinese lunar calendar library with multi-language ports (Java, Python, C#). Supports full GanZhi, festivals, 宜忌, and leap month handling via negative month convention.
2. **Cross-validate** against authoritative sources: 紫金山天文台 (Purple Mountain Observatory) published calendar data, and 寿星万年历 (by 许剑伟).
3. Build a **regression test suite** with known date pairs (solar <-> lunar) covering edge cases: leap months, year boundaries, dates before 1900, dates after 2100.
4. For dates outside the 1900-2100 range, either show a clear disclaimer or call a third-party API.

**Detection (warning signs):**
- Unit tests comparing library output against known reference dates fail
- User reports of "wrong date" for any single year
- Discrepancy between your output and http://jiton.com.cn/ or other reference sites

**Phase:** DATA-01 (万年历算法库) -- this is the foundation. Must be correct before any other feature is built on top.

---

### Pitfall 2: AI Hallucination on Cultural/Fortune Content (AI 胡编乱造命理内容)

**What goes wrong:** The AI confidently generates factually wrong 命理 (metaphysics) explanations -- wrong 天干地支 assignments, invented 宜忌 rules, incorrect 生肖配对 logic, or fabricated classical citations.

**Why it happens:**
- LLMs are trained on internet text that mixes genuine 命理 knowledge with pop-culture fortune-telling, fiction, and misinformation. The model cannot distinguish authoritative classical sources from casual blog posts.
- Chinese-origin models (DeepSeek, Qwen) perform better on C-Eval and CMMLU benchmarks for Chinese cultural knowledge than OpenAI models, but still hallucinate on niche topics like specific 八字 combinations or obscure 风水 rules.
- When the AI doesn't know, it generates plausible-sounding but wrong content rather than admitting uncertainty.

**Consequences:** Users follow AI advice for major life decisions (wedding dates, home purchases). Wrong advice = potential real harm + legal liability + viral negative reviews.

**Prevention:**
1. **Never let AI generate raw data.** The almanac data (dates, 干支, 宜忌) must come from the algorithm library (DATA-01). AI only generates the *explanation layer* -- "why this date is recommended given your constraints."
2. **Constrain AI output with structured prompts** that include the correct base data as context. The prompt should say "Given this data: [correct 宜忌 for date X], explain why..." not "What are the 宜忌 for date X?"
3. **Use DeepSeek or Qwen** as primary model for Chinese cultural content -- they outperform OpenAI on Chinese cultural benchmarks (C-Eval, CMMLU). OpenAI as fallback only.
4. **Implement output validation** -- check that AI-generated 干支, 生肖, 宜忌 terms match the algorithm-computed values. Reject and retry if they diverge.
5. **Add a disclaimer** on all AI-generated content: "AI 生成内容仅供参考，重大决策请咨询专业人士。"

**Detection (warning signs):**
- AI output contains 干支 that don't match the date's computed 干支
- AI cites classical texts that don't exist
- AI gives contradictory advice for the same query asked differently
- Users report "AI说的不对" in feedback

**Phase:** AI-02, AI-03, AI-04 -- the AI integration phase must design the data-first, explanation-second architecture from day one.

---

### Pitfall 3: Legal/Compliance Risk for Fortune-Telling Content in China (法律合规风险)

**What goes wrong:** The platform gets flagged by Chinese regulators for 迷信活动 (superstitious activities), faces ICP license revocation, app store removal, or criminal liability.

**Why it happens:** This is the most dangerous pitfall because the legal boundaries are ambiguous and enforcement is inconsistent:
- **《治安管理处罚法》第27条** penalizes "利用迷信活动扰乱社会秩序"
- **《刑法》第300条** covers "组织、利用迷信破坏法律实施罪"
- **《广告法》** prohibits false advertising -- claiming "100% accurate" or "guaranteed results" violates this
- **《互联网信息服务管理办法》** requires content compliance for all hosted services
- Multiple provinces have conducted 线上算命专项整治 campaigns, removing apps and mini-programs

**The key legal distinction:** 民俗文化研究/文化娱乐 vs 封建迷信/营利性算命. The platform must clearly position itself as the former.

**Consequences:** ICP license revocation (site goes offline in China), app store removal, potential criminal prosecution for operators, fines.

**Prevention:**
1. **Frame as 文化研究/民俗文化工具** -- never as "算命" or "占卜." Use terms like "传统历法查询," "民俗文化参考," "择吉文化研究."
2. **Prominent disclaimer on every page:** "本平台内容仅供文化研究和娱乐参考，不构成任何决策建议。重大事项请咨询专业人士。"
3. **No "guaranteed" language anywhere.** Never say "100% 准确" or "保证." Use "传统认为," "民俗观点," "仅供参考."
4. **ICP备案** is mandatory. For hosting in mainland China, get an ICP备案 (filing) or ICP许可证 (license) depending on whether it's commercial.
5. **Consult a lawyer specializing in Chinese internet law** before launch. This is not optional -- the legal landscape is too ambiguous for self-assessment.
6. **Avoid收费模式 that looks like "付费算命"** -- if monetizing, frame as "高级文化研究报告" or "个性化历法服务," not "付费算命结果."
7. **Collect minimal personal data.** 生辰八字 is sensitive personal information under 《个人信息保护法》. If collecting, need explicit consent and clear privacy policy.

**Detection (warning signs):**
- Content review by platform or regulator flags 迷信 language
- Competitor sites in same domain get taken down (monitor industry news)
- User complaints to authorities about "封建迷信" content
- ICP备案 application gets rejected with 迷信-related reason

**Phase:** Before any code is written. The legal positioning should inform the entire product architecture and content strategy. Revisit at every phase transition.

---

### Pitfall 4: Simplified/Traditional Chinese Conversion Is NOT Just Character Mapping (繁简转换不只是字符映射)

**What goes wrong:** Using naive character-level conversion (or even OpenCC with default dictionaries) produces wrong or offensive Traditional Chinese output, especially for 命理 terminology.

**Why it happens:** Simplified-to-Traditional Chinese conversion has deep context-dependency problems:

| Simplified | In 命理 context (correct Traditional) | Naive conversion (wrong) |
|------------|---------------------------------------|--------------------------|
| 干 (天干) | 干 | 乾 or 幹 |
| 丑 (地支) | 丑 | 醜 |
| 后 (神后) | 后 | 後 |
| 斗 (北斗) | 斗 | 鬥 |
| 余 (姓氏/术数) | 余 | 餘 |
| 冲 (冲煞) | 衝 | 冲 (may be correct but context matters) |
| 里 (方位) | 裡 | 里 (should stay 里 in some contexts) |

Beyond single characters, **vocabulary differs** between Mainland (zh-Hans) and Taiwan/Hong Kong (zh-Hant):
- 软件 vs 軟體
- 网络 vs 網路
- 数据 vs 資料
- 出租车 vs 計程車 (Taiwan) vs 的士 (Hong Kong)

**Punctuation also differs:** "" (Hans) vs 「」 (Hant), different quotation mark styles.

**Consequences:** Traditional Chinese users (Taiwan, Hong Kong, overseas) see incorrect or offensive text. 地支 "丑" becoming "醜" (ugly) is a real error seen in production apps.

**Prevention:**
1. **Use OpenCC with a custom domain dictionary** for 命理/术数 terminology. Create a mapping file that overrides problematic conversions for all 地支 (子丑寅卯...), 天干 (甲乙丙丁...), 五行, 宜忌 terms.
2. **Maintain separate content databases** for zh-Hans and zh-Hant rather than auto-converting. For key pages (SEO-01 through SEO-06), write native Traditional Chinese copy.
3. **For programmatic output** (almanac data, GanZhi strings), use the algorithm library's native output and maintain a manual mapping table for display in each locale.
4. **Test with native Traditional Chinese speakers** from both Taiwan and Hong Kong -- their terminology differs significantly.
5. **Implement the I18N-01 requirement** with URL-based locale (`/zh-hant/`, `/zh-hans/`) as the project specifies. Never auto-detect and convert.

**Detection (warning signs):**
- 丑 displays as 醜 in Traditional Chinese output
- 干支 strings look wrong when viewed in zh-Hant locale
- Taiwanese or Hong Kong users report "wrong characters"
- Automated conversion produces different results for the same term on different pages

**Phase:** I18N-01 -- but the custom domain dictionary for OpenCC should be created during DATA-01 phase, since the almanac data model needs to store/display both variants correctly.

---

## Moderate Pitfalls

Issues that cause significant problems but are recoverable.

---

### Pitfall 5: Baidu SEO vs Google SEO Requires Different Strategies (百度和谷歌SEO策略差异)

**What goes wrong:** The site ranks well on Google but is invisible on Baidu, or vice versa. Since the target audience is mainland Chinese users, Baidu ranking is critical.

**Why it happens:** Baidu and Google have fundamentally different ranking factors for Chinese content:

| Factor | Baidu | Google |
|--------|-------|--------|
| **Hosting location** | Strongly favors mainland China servers + ICP license | No preference |
| **JavaScript rendering** | Limited JS rendering -- heavy SPA content may not index | Excellent JS rendering |
| **Meta keywords** | Still considered (partially) | Completely ignored |
| **Content freshness** | Heavily weighted | Important but less dominant |
| **Crawl frequency** | Slower, less frequent | Faster, more aggressive |
| **Language preference** | Strongly favors Simplified Chinese | Language-neutral |
| **Canonical tags** | Less sophisticated handling | Well-implemented |
| **Mobile** | Heavy mobile-first emphasis | Mobile-first indexing |

**The JS rendering issue is critical for this project:** The reference site (jiton.com.cn) requires Playwright to render. If the new site uses heavy client-side JS, Baidu's crawler may not index the content. SSR/SSG is mandatory.

**Consequences:** Low Baidu visibility = missing 70%+ of Chinese search traffic. The project's SEO-01 through SEO-06 requirements are worthless if Baidu can't index them.

**Prevention:**
1. **SSR/SSG is non-negotiable** (already in project constraints). Every SEO page must render complete HTML server-side. No client-side data fetching for content.
2. **Host in mainland China** with ICP备案. If using Hong Kong servers, Baidu crawling will be slower but still workable. US/EU hosting = Baidu crawls poorly.
3. **Submit sitemap to Baidu Webmaster** (zhanzhang.baidu.com) separately from Google Search Console.
4. **Include meta keywords** for Baidu -- not keyword-stuffed, but relevant terms like "黄道吉日," "结婚吉日," "搬家吉日查询."
5. **Ensure fast TTFB** (Time To First Byte) -- Baidu penalizes slow servers more than Google. The 宝塔/Nginx/PM2 stack needs proper caching.
6. **Create a Baidu-specific sitemap** with `baiduspider` user-agent considerations.
7. **No cloaking** -- Baidu has been cracking down on showing different content to crawlers vs users.

**Detection (warning signs):**
- Pages indexed by Google but not Baidu (check with `site:yourdomain.com` on both)
- Baidu Webmaster shows crawl errors or slow crawl rate
- Mobile Baidu search shows no results for your content
- Baidu index count much lower than actual page count

**Phase:** SEO-01 through SEO-06. But the SSR/SSG architecture decision (Phase 1) must account for Baidu's JS rendering limitations from the start.

---

### Pitfall 6: Chinese Font Loading Destroys Performance (中文字体加载拖垮性能)

**What goes wrong:** The site loads a full CJK font file (5-20+ MB), causing massive FOIT (Flash of Invisible Text) or FOUT (Flash of Unstyled Text) and terrible LCP/CLS scores.

**Why it happens:** CJK fonts contain thousands of glyphs (vs ~200-300 for Latin). A full Noto Sans SC font is ~9 MB. Loading this synchronously blocks text rendering for seconds on typical Chinese mobile networks (4G, not always fast).

Key issues:
- `font-display: block` with large CJK fonts = invisible text for 3-10 seconds
- `font-display: swap` = jarring layout shift when the full font loads
- Not subsetting = downloading 10,000+ glyphs when the page uses 200-500
- No `unicode-range` splitting = browser downloads the entire font even if only a few characters are needed

**Consequences:** Poor Core Web Vitals (LCP, CLS) = lower Google ranking and terrible user experience on mobile. Chinese users on slower connections see blank text.

**Prevention:**
1. **Use system fonts as primary stack:** `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif` -- these are pre-installed on Chinese devices and require zero download.
2. **If custom font is needed for branding:** Use `font-display: optional` for non-critical text, `font-display: swap` for critical text with a fast subset.
3. **Subset aggressively:** Use `fonttools`/`pyftsubset` or `font-spider` to create subsets containing only characters used on each page.
4. **Split by `unicode-range`:** Create multiple `@font-face` declarations, each covering a small Unicode range (~600 glyphs). The browser downloads only the chunks needed.
5. **Preload critical subsets:** `<link rel="preload" as="font" ...>` for the most common character ranges.
6. **Consider variable CJK fonts** (e.g., Source Han Sans Variable) for smaller file sizes with weight variation.
7. **Use Google Fonts' pre-subsetted CJK fonts** (e.g., Noto Sans SC) which are already split into unicode-range chunks.

**Detection (warning signs):**
- Lighthouse "Avoid enormous network payloads" warning for font files
- CLS score > 0.1 on Chinese content pages
- LCP > 2.5s on mobile
- Font files > 500KB in network tab
- Users report "文字先是一片空白" (text is blank initially)

**Phase:** Phase 1 (first content pages). Font strategy must be decided before any page is built. System fonts for MVP, custom fonts as enhancement.

---

### Pitfall 7: SSR/SSG Build Time Explosion for Data-Heavy Chinese Sites (SSG构建时间爆炸)

**What goes wrong:** `generateStaticParams` for thousands of Chinese content pages (吉日矩阵, 生肖, 八字, etc.) causes build times of 10-30+ minutes, making iteration painfully slow.

**Why it happens:** The project requires SEO-01 (吉日工具矩阵 with 9+ categories), SEO-02 (12 生肖 pages), SEO-03 (八字排盘), SEO-04 (风水), SEO-05 (起名), SEO-06 (节气) -- each with multiple sub-pages. With `/zh-hant/` and `/zh-hans/` variants, the page count doubles. Add monthly calendar views (ALMANAC-03) and the total can easily reach 500-2000+ static pages.

Each page requires:
- Fetching almanac data (possibly from database or API)
- Rendering with React (CPU-intensive)
- Writing HTML to disk

**Consequences:** 15-30 minute builds. Developer productivity drops. CI/CD pipeline becomes bottleneck. Hot reload in dev is slow.

**Prevention:**
1. **Use ISR (Incremental Static Regeneration)** instead of pure SSG for high-volume pages. Set `revalidate` to reasonable intervals (daily for almanac data, weekly for knowledge articles).
2. **Separate build tiers:** Critical pages (homepage, today's almanac) = true SSG with fast builds. Content matrix pages = ISR with longer revalidation.
3. **Pre-compute almanac data** into static JSON files during build, not on-the-fly database queries.
4. **Use `generateStaticParams` with `dynamicParams: false`** for fixed pages and ISR for dynamic ones.
5. **Parallelize data fetching** in `generateStaticParams` -- don't fetch serially.
6. **Cache build artifacts** -- use Next.js build cache and CI cache for `.next` directory.

**Detection (warning signs):**
- `npm run build` takes > 5 minutes locally
- CI/CD pipeline times out
- Developer experience degrades (waiting for builds)
- Build memory usage exceeds available RAM

**Phase:** Phase 1 architecture decisions. The SSG vs ISR tradeoff must be decided before the first content page is built.

---

### Pitfall 8: Next.js Deployment on 宝塔/Nginx -- Hidden Configuration Traps (宝塔部署陷阱)

**What goes wrong:** 502 Bad Gateway, static assets returning 404, WebSocket/HMR not working in dev, PM2 memory leaks crashing the app silently.

**Why it happens:** 宝塔 (BT Panel) is designed for PHP/LAMP stacks. Next.js (Node.js SSR) requires specific configuration that conflicts with 宝塔's defaults:

**Common traps:**
- **PM2 not in PATH:** 宝塔's Node.js manager may install PM2 in a different location than the system PATH. `pm2 start` works in terminal but 宝塔's process manager can't find it.
- **Port conflicts:** 宝塔's default Nginx config may already bind to port 80/443. Next.js needs a reverse proxy, not direct binding.
- **Static file serving:** 宝塔's Nginx tries to serve `.next/static/` files directly, but the hashed filenames and paths confuse 宝塔's default location blocks.
- **WebSocket for HMR:** Dev mode needs WebSocket upgrade headers. 宝塔's default proxy config doesn't include `Upgrade` and `Connection` headers.
- **Memory leaks:** Node.js in production can leak memory. Without `max_memory_restart` in PM2 config, the app crashes silently after days of uptime.
- **Environment variables:** 宝塔 doesn't load `.env` files the same way as local dev. `process.env.DATABASE_URL` may be undefined.

**Consequences:** Site goes down intermittently. Static assets break after deploy. Dev workflow is painful. Debugging takes hours because 宝塔 abstracts away the actual errors.

**Prevention:**
1. **Use Docker Compose** instead of bare-metal 宝塔 deployment if possible -- eliminates most 宝塔-specific issues. But if 宝塔 is required:
2. **Create a proper `ecosystem.config.js`** for PM2:
   ```javascript
   module.exports = {
     apps: [{
       name: 'jinzeyi',
       script: 'node_modules/.bin/next',
       args: 'start',
       cwd: '/www/wwwroot/jinzeyi',
       instances: 1,
       exec_mode: 'fork', // NOT cluster -- Next.js handles its own clustering
       max_memory_restart: '500M',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```
3. **Nginx reverse proxy config** must include WebSocket headers:
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
   }
   ```
4. **Serve `.next/static/` with Nginx directly** (not through Node.js) for performance:
   ```nginx
   location /_next/static/ {
       alias /www/wwwroot/jinzeyi/.next/static/;
       expires 365d;
       access_log off;
   }
   ```
5. **Set environment variables** in PM2 config or use `dotenv` explicitly -- don't rely on 宝塔's UI for env vars.
6. **Monitor with `pm2 monit`** and set up alerts for memory usage and restarts.

**Detection (warning signs):**
- 502 errors after deploy
- `pm2 list` shows app in "errored" state
- Static assets return HTML (the Nginx fallback to index.html is too broad)
- Memory usage grows steadily over days
- `pm2 logs` shows unhandled exceptions

**Phase:** DEPLOY-01. But test the deployment setup early (Phase 1) to catch configuration issues before they block later phases.

---

### Pitfall 9: AI API Provider Differences for Chinese Cultural Content (AI供应商中文文化内容差异)

**What goes wrong:** Using OpenAI as the default AI provider produces mediocre Chinese cultural content. Or using a single provider creates vendor lock-in when prices change or APIs go down.

**Why it happens:** Different AI models have significantly different capabilities for Chinese cultural content:

| Model | Chinese Cultural Knowledge | Pricing | API Stability | Notes |
|-------|---------------------------|---------|---------------|-------|
| **DeepSeek-V3/R1** | Strong (trained on Chinese corpora) | Very cheap | Good but occasional outages | Best cost-performance for Chinese content |
| **Qwen (通义千问)** | Strong (Alibaba, extensive Chinese training) | Cheap | Very stable (Alibaba Cloud) | Best for enterprise reliability |
| **OpenAI GPT-4o** | Moderate (gaps in niche Chinese topics) | Expensive | Very stable | Better for cross-cultural/reasoning tasks |

Key differences for 命理 content:
- **DeepSeek and Qwen** outperform OpenAI on C-Eval and CMMLU benchmarks (Chinese cultural knowledge evaluation)
- **OpenAI** may hallucinate Chinese historical/cultural details more frequently
- **DeepSeek** is extremely cost-effective but has had uptime issues
- **Qwen** via Alibaba Cloud 百炼 platform offers the most stable enterprise API in China

**Consequences:** Subpar AI explanations if using the wrong model. Vendor lock-in if using a single provider. High costs if defaulting to OpenAI.

**Prevention:**
1. **Design the abstract AI interface layer (AI-01) from day one** -- this is already in the project requirements. The interface must support provider switching without code changes.
2. **Default to DeepSeek** for cost-effectiveness and Chinese cultural knowledge. Use **Qwen (百炼)** as the reliability fallback. OpenAI as last resort.
3. **Implement provider health checks** -- if DeepSeek API is down, automatically failover to Qwen.
4. **Cache AI responses** for common queries (same date + same scenario = same explanation). This reduces API costs and provides consistent results.
5. **Track per-provider quality** -- log AI responses and periodically review for accuracy. If one provider's quality degrades, switch.
6. **Use structured output** (JSON mode) where available to make response parsing reliable.

**Detection (warning signs):**
- AI response contains culturally incorrect statements
- API latency > 5 seconds for simple queries
- API error rate > 1%
- Cost per query exceeds budget
- Users report "AI回答不靠谱"

**Phase:** AI-01 (abstract interface layer). The provider selection and fallback strategy must be designed before AI-02/03/04 implementation.

---

## Minor Pitfalls

Issues that cause friction but are easily fixable.

---

### Pitfall 10: Almanac Data Freshness -- Today's Data Must Be Correct (今日黄历数据必须实时正确)

**What goes wrong:** The homepage shows yesterday's almanac data, or the "today" card shows wrong data because of timezone issues.

**Why it happens:** Server timezone vs user timezone vs Chinese standard time (UTC+8). If the server is in UTC and the code does `new Date().getDate()`, users in China see wrong data during the first 8 hours of each day (midnight to 8am UTC).

**Prevention:**
1. **Always use UTC+8 (Asia/Shanghai)** for date calculations, not server timezone.
2. **Pre-generate almanac data** for the entire year (or at least the current month) and serve from cache.
3. **Use `revalidate: 3600`** (1 hour) for the homepage to ensure freshness without rebuilding.
4. **Display "北京时间"** next to the date to make the timezone explicit.

**Detection (warning signs):**
- Users in China report "today's data is wrong" in the morning
- Homepage shows different dates in different timezones
- Almanac data updates at wrong time

**Phase:** ALMANAC-01 (today's almanac card). Must get timezone right from day one.

---

### Pitfall 11: SEO Content Duplication Across Locale Variants (繁简版本内容重复)

**What goes wrong:** Baidu or Google sees `/zh-hant/` and `/zh-hans/` pages as duplicate content and penalizes or deduplicates them.

**Why it happens:** If the zh-Hant content is just an auto-converted version of zh-Hans, search engines may treat them as the same page. This is especially true if the conversion is character-level (most of the content is identical).

**Prevention:**
1. **Use `hreflang` tags** to tell search engines that `/zh-hant/` and `/zh-hans/` are alternate versions of the same page, not duplicates.
2. **Use `canonical` tags** pointing to the preferred version (zh-Hans for Baidu, either for Google).
3. **Write distinct content** for zh-Hant where possible -- different vocabulary, different examples, cultural references relevant to Taiwan/Hong Kong audience.
4. **Submit separate sitemaps** for each locale to both Baidu and Google.

**Detection (warning signs):**
- Only one locale variant appears in search results
- Baidu Webmaster shows "重复页面" warnings
- Google Search Console shows "Alternate page with proper canonical tag" errors

**Phase:** I18N-01 and SEO-01 through SEO-06.

---

### Pitfall 12: Third-Party API Dependency for Complex Calculations (第三方API依赖风险)

**What goes wrong:** The third-party API for 八字排盘 or other complex calculations goes down, changes its API, or increases prices.

**Why it happens:** The project plans to use third-party APIs (DATA-02) for complex calculations like 八字排盘. These APIs are often small, niche services with uncertain long-term availability.

**Prevention:**
1. **Cache API responses aggressively** -- 八字 for a given birth datetime never changes. Cache permanently.
2. **Have a fallback provider** -- don't depend on a single API.
3. **Implement graceful degradation** -- if the API is down, show cached results with a "数据更新中" notice.
4. **Consider implementing basic 八字排盘 locally** -- the algorithm is well-documented and doesn't require astronomical precision. Use the `lunar-javascript` library's GanZhi methods as a foundation.
5. **Monitor API health** and set up alerts for failures.

**Detection (warning signs):**
- API response time > 3 seconds
- API returns errors intermittently
- API provider's website/service shows signs of neglect (no updates, broken docs)

**Phase:** DATA-02 (third-party API integration). Design the caching and fallback strategy during this phase.

---

### Pitfall 13: Mixed URL Strategy Confusion (混合URL路径策略混乱)

**What goes wrong:** The project uses mixed URL paths -- pinyin for core pages (`/jieri/jiehun/`), English for tools (`/tools/zodiac/`), and locale prefixes (`/zh-hant/`, `/zh-hans/`). This creates a complex routing matrix that's easy to get wrong.

**Why it happens:** Combining locale prefixes with mixed-language paths creates edge cases:
- `/zh-hant/jieri/jiehun/` vs `/zh-hans/tools/zodiac/` -- are both valid?
- Do locale-less paths redirect? To which locale?
- How do rewrites interact with locale routing?
- What happens when a user manually types `/zh-hant/tools/zodiac/`?

**Prevention:**
1. **Document the full URL matrix** before implementation. Every valid URL pattern must be specified.
2. **Use Next.js middleware** for locale detection and redirect (as shown in the Next.js i18n docs).
3. **Define clear rules:** locale prefix is always first (`/[locale]/[path]`), never embedded.
4. **Test all URL permutations** in the CI pipeline.
5. **Use `rewrites` in `next.config.js`** to handle legacy URLs from the old site (jiton.com.cn) for SEO continuity.

**Detection (warning signs):**
- 404 errors for valid pages when accessed with wrong locale prefix
- Baidu indexing pages at unexpected URLs
- Redirect loops between locale variants

**Phase:** SEO-01 (first content pages with mixed URLs). Define the URL schema in Phase 1 architecture.

---

### Pitfall 14: Redis Cache Invalidation for Almanac Data (Redis缓存失效策略)

**What goes wrong:** Stale almanac data served from Redis cache, or cache stampede when popular dates' cache expires simultaneously.

**Why it happens:** Almanac data for a given date is immutable once computed (a date's 干支, 宜忌, etc. never change). But "today's data" changes daily, and popular queries (e.g., "next month's wedding dates") create hot keys.

**Prevention:**
1. **Cache almanac data permanently** for past dates (they never change).
2. **Pre-compute and cache future dates** in advance (e.g., cache next month's data on the 25th of current month).
3. **Use cache-aside pattern** with TTL for "today" and "tomorrow" data (expire at midnight UTC+8).
4. **Implement cache warming** -- pre-populate cache for popular date ranges (next 3 months of wedding dates, etc.).
5. **Use Redis `SETNX`** or distributed locks to prevent cache stampede.

**Detection (warning signs):**
- Slow response times at midnight (cache expiry causing stampede)
- Users report "数据不对" that resolves after page refresh (stale cache)
- Redis memory usage growing unbounded

**Phase:** ALMANAC-01 through ALMANAC-03. Cache strategy must be designed alongside the data model.

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation | Severity |
|-------|---------------|------------|----------|
| **DATA-01** (万年历算法库) | Lunar calendar algorithm errors (Pitfall 1) | Use `lunar-javascript` + cross-validate + regression tests | Critical |
| **DATA-01** | Timezone issues (Pitfall 10) | Force UTC+8 for all date operations | Moderate |
| **DATA-01** | I18N conversion for domain terms (Pitfall 4) | Build OpenCC custom dictionary for 命理 terms during this phase | Critical |
| **SEO-01~06** | Baidu can't index JS-rendered content (Pitfall 5) | SSR/SSG is mandatory, test with Baidu spider simulator | Critical |
| **SEO-01~06** | Content duplication across locales (Pitfall 11) | hreflang + distinct content + separate sitemaps | Moderate |
| **SEO-01~06** | Mixed URL routing confusion (Pitfall 13) | Document URL matrix, test all permutations | Moderate |
| **AI-01** | Vendor lock-in and poor Chinese cultural content (Pitfall 9) | Abstract interface + DeepSeek/Qwen defaults | Critical |
| **AI-02~04** | AI hallucination on 命理 content (Pitfall 2) | Data-first, explanation-second architecture | Critical |
| **I18N-01** | Context-dependent 繁简转换 (Pitfall 4) | Custom domain dictionary + native content for each locale | Critical |
| **DEPLOY-01** | 宝塔/Nginx/PM2 configuration traps (Pitfall 8) | Test deployment early, use Docker if possible | Moderate |
| **DEPLOY-01** | Font loading performance (Pitfall 6) | System fonts first, subset custom fonts | Moderate |
| **ALMANAC-01~03** | Cache invalidation (Pitfall 14) | Pre-compute + permanent cache for immutable data | Moderate |
| **DATA-02** | Third-party API dependency (Pitfall 12) | Cache aggressively + fallback providers | Moderate |
| **PAY-01** | Legal risk from "付费算命" framing (Pitfall 3) | Frame as "高级文化研究服务," lawyer review | Critical |
| **All phases** | Legal/compliance risk (Pitfall 3) | Consult lawyer before launch, use disclaimer everywhere | Critical |

---

## Confidence Assessment

| Pitfall Area | Confidence | Notes |
|-------------|------------|-------|
| Lunar calendar algorithms | MEDIUM-HIGH | Verified via `lunar-javascript` Context7 docs; algorithm details from training data |
| AI hallucination | MEDIUM | Model comparison based on benchmarks (C-Eval, CMMLU); needs hands-on testing |
| Legal/compliance | LOW | Training data only; Chinese internet law is ambiguous and evolving. **Must consult lawyer.** |
| I18N 繁简转换 | MEDIUM | OpenCC pitfalls well-documented in community; domain-specific mappings need validation |
| Baidu vs Google SEO | MEDIUM | Based on well-known differences; Baidu's algorithm changes frequently |
| Font loading | HIGH | Well-documented problem with standard solutions |
| SSG build time | HIGH | Known Next.js limitation with large static sites |
| 宝塔 deployment | MEDIUM | Common setup with known issues; specific 宝塔 version behavior varies |
| AI API providers | MEDIUM | Benchmark data available; pricing and stability change frequently |

---

## Sources

- `lunar-javascript` library (6tail) -- Context7 documentation: `/6tail/lunar-javascript`
- Next.js i18n documentation -- Context7: `/vercel/next.js`
- Next.js App Router i18n guide: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/internationalization.mdx
- Next.js Pages Router i18n guide: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/internationalization.mdx
- OpenCC project: https://github.com/BYVoid/OpenCC
- 寿星万年历 algorithm (许剑伟) -- widely referenced in Chinese calendar computation community
- 紫金山天文台 (Purple Mountain Observatory) -- authoritative source for Chinese calendar data
- C-Eval / CMMLU benchmarks -- Chinese language model evaluation
- LMSYS Chatbot Arena -- model comparison leaderboard
- Baidu Webmaster Platform: zhanzhang.baidu.com
- 《互联网信息服务管理办法》 -- Chinese internet information service regulations
- 《治安管理处罚法》第27条 -- penalties for superstition-related activities
- 《个人信息保护法》 -- Chinese personal information protection law
