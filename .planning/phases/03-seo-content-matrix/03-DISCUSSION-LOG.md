# Phase 3: SEO Content Matrix - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 3-SEO Content Matrix
**Areas discussed:** 吉日矩陣頁面深度, 內容來源, 八字與起名工具 MVP 深度, 生肖與風水內容頁形態, SEO 技術規則

---

## 吉日矩陣頁面深度

| Question | Options Presented | User's Choice / Notes |
|----------|-------------------|-----------------------|
| `/jieri/{scene}/{year}` 的 MVP 頁面應該做到哪一層？ | 年度列表 + 場景說明; 純年度吉日列表; 年度列表 + 篩選/排序/推薦理由 | User chose 1 and 3. Use scene explanation, annual/monthly lists, lightweight filtering, and recommendation reasons. |
| 每個場景的吉日判定要多精細？ | 宜忌命中為主; 宜忌 + 凶日排除; 宜忌 + 凶日 + 生肖避沖 | User chose 1 and 3. Base match uses scene-specific yi items, with zodiac conflict as an advanced condition. |
| 凶日怎麼處理？ | 保留但降級標示; 預設排除凶日; 分區顯示 | User chose 1. Keep matched ominous days but downgrade and explain. |
| `/jieri/{scene}/{year}` 要預渲染多少年份？ | 1900-2100 全量預渲染; 今年起 5 年; 近年 SSG + 歷史年份按需生成 | User chose 3, with current year plus/minus 20 years for SSG/sitemap and dynamic legal years initially discussed as 0-5000, later corrected to 2-5000 after support probing. |
| 超出 1900-2100 驗證範圍的年份，要如何對使用者呈現？ | 允許查詢但顯示準確性提示; 先限制 1900-2100; 0-5000 全部等同正式支持 | User chose formal support. After the Wave 1 probe showed year 0/1 incomplete support, user revised the formal legal range to 2-5000 on 2026-05-17. |

---

## 內容來源

| Question | Options Presented | User's Choice / Notes |
|----------|-------------------|-----------------------|
| Phase 3 的生肖、風水、起名等內容，MVP 先用哪種來源？ | Typed static content + seed-friendly 結構; 直接接 Prisma DB; 混合模式 | User chose 1. Use TypeScript structured content first, designed for future Prisma seeding. |
| 繁簡內容要怎麼維護？ | 簡體作 canonical，繁體由 OpenCC 轉換; 繁簡各維護一份 static content; 混合：核心 SEO title/description 雙語維護，正文 OpenCC | User chose 3. Maintain SEO meta/hero separately per locale; convert longer body copy. |
| static content 的管理邊界要到哪裡？ | 所有 Phase 3 文案都進 structured data 檔; 長文用 Markdown/MDX，工具資料用 TS; 直接寫在 page/components 裡 | User chose 1. Structured typed data for all Phase 3 content. |
| 內容品質的 MVP 底線是什麼？ | 每頁至少有唯一主文案 + FAQ + 內鏈; 先模板化鋪頁; 少量頁面高品質，其他先不生成 | User chose 1. Avoid thin content; every indexable page needs unique copy, FAQ, and internal links. |

---

## 八字與起名工具 MVP 深度

| Question | Options Presented | User's Choice / Notes |
|----------|-------------------|-----------------------|
| 八字排盤 MVP 要做到哪一層？ | 四柱 + 五行分布 + 基礎說明; 四柱 + 詳細命理解讀; 只做四柱表格 | User chose 1. Keep BaZi to four pillars, five elements, and basic explanation. |
| 八字輸入要支援哪些欄位？ | 日期 + 時辰 + 性別可選; 日期 + 精確時間 + 出生地; 只要日期 | User chose 2 and added gender. Reference "测测" for form completeness and product feel. |
| 出生地在 MVP 裡要怎麼用？ | 只記錄出生地，不做真太陽時換算; 中國城市真太陽時換算; 全球出生地 + 時區 + 真太陽時 | User chose 2. Use China city/province true solar time correction. |
| 起名工具 MVP 要做到哪一層？ | 姓名五行屬性 + 基礎吉凶說明; 姓名評分 + 改名建議字; 結合八字喜用神推薦名字 | User chose 1 and 2. Include five elements, basic explanation, initial score, and suggested characters; do not bind to BaZi useful-god analysis. |

---

## 生肖與風水內容頁形態

| Question | Options Presented | User's Choice / Notes |
|----------|-------------------|-----------------------|
| 生肖頁要偏哪種形態？ | 工具型內容頁; 文章型長內容頁; 雙層結構 | User chose 3. Zodiac hub plus separate articles. |
| 生肖文章頁在 Phase 3 MVP 要生成到什麼程度？ | 每個生肖 2-3 篇固定文章; 只做生肖主頁，不做文章頁; 大量模板化文章矩陣 | User chose 1. Must collect and synthesize source material, avoid invented or AI-sounding text, and write naturally. |
| 風水內容頁要偏哪種形態？ | 分類文章 + 工具入口; 純知識百科; 大量場景頁 | User chose 1. Categorized practical articles with tool entrances. |
| Phase 3 MVP 的風水文章數量要定多少？ | 每個分類 2 篇左右; 每個分類 5 篇以上; 先做 3-5 篇總覽文章 | User chose 1. About 10 Feng Shui articles across five categories. |

---

## SEO 技術規則

| Question | Options Presented | User's Choice / Notes |
|----------|-------------------|-----------------------|
| sitemap 要怎麼實作？ | Next route 手寫 sitemap; 引入 next-sitemap; 先只做核心 sitemap | User chose 1. Use Next route/API generation from typed content and route config. |
| hreflang/canonical 的規則要多嚴格？ | 所有可索引頁必須完整; 只在主要頁完整; 先靠 Next metadata defaults | User chose 1. All indexable pages need canonical, zh-Hans/zh-Hant hreflang, x-default, Content-Language, and sitemap alternates. |
| JSON-LD 要覆蓋哪些類型？ | 頁型對應 schema; 全部用 WebPage; 只做 FAQPage + WebSite | User chose 1. Use schema per page type and reusable helpers. |
| 哪些頁面應該進 sitemap？ | 只收 SSG 和核心可索引頁; 所有合法動態頁都收錄; 先只收工具入口，不收文章/年份矩陣 | User chose 1. Include SSG/core pages; dynamic year 2-5000 pages remain accessible but are not all listed. |

---

## The Agent's Discretion

- Exact file organization, route grouping, helper names, component decomposition, and content object schemas are left to planner/implementer discretion within the decisions captured in `03-CONTEXT.md`.

## Deferred Ideas

- Later content enhancement can combine yearly/day-specific historical events or major records with almanac pages.
- Deep personalized BaZi interpretation and AI explanations belong to later phases.
- Global birthplace/timezone true solar time support is deferred.
- Full Prisma/CMS-backed content management is deferred until after typed static content proves the shape.
