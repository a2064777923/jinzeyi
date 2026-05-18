# Phase 4: AI Integration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 4-AI Integration
**Areas discussed:** 八字命格深化, 擇吉評分系統, 知識庫與神話故事

---

## Scope Redirection

**User's choice:** AI should be postponed. The user said the current functionality, UI, interaction, and content are still far behind stronger metaphysics products, and asked to research how to improve metaphysics depth, Zi Wei, star systems, five elements, mythology, and "strength/weakness" ideas before discussing AI again.

**Notes:** Phase 4 is therefore redirected from provider/API integration toward product and metaphysics depth. The formal context captures this as a scope redirection so downstream planning does not blindly implement the old AI roadmap goal.

---

## 八字命格深化

### Depth Level

| Option | Description | Selected |
|--------|-------------|----------|
| 專業盤優先 | Build complete professional chart data first: day master, ten gods, hidden stems, na-yin, five elements, luck-cycle-ready structure. | ✓ |
| 命格解讀優先 | Jump directly into strength/weakness, structure, useful god, and life-domain interpretation. | |
| 雙層體驗 | Beginner summary plus professional chart from the start. | |

**User's choice:** 專業盤優先.
**Notes:** User wants professional depth before strong fate-style interpretation.

### First-Slice Contents

| Option | Description | Selected |
|--------|-------------|----------|
| 四柱拆解 + 十神藏干 | Four-pillar details, ten gods, hidden stems, na-yin, five elements. | ✓ |
| 四柱拆解 + 神煞列表 | Add shen-sha terms such as 桃花, 驛馬, 天乙貴人, 文昌, 華蓋. | Later |
| 四柱拆解 + 大運流年 | Add da-yun, liu-nian, liu-yue, and liu-ri. | Later |

**User's choice:** First do 四柱拆解 + 十神藏干; later do 神煞列表 and 大運流年.
**Notes:** The first slice should build the professional skeleton; follow-up slices add richer timing and shen-sha layers.

### Explanation Depth

| Option | Description | Selected |
|--------|-------------|----------|
| 每個術語短解 | Each term has a short 1-3 sentence explanation. | |
| 短解 + 對本盤的提示 | Explain term generally and how it appears in this chart. | ✓ |
| 短解 + 古籍來源 + 白話例子 | Add source/source-note and examples. | ✓ |

**User's choice:** Combine options 2 and 3.
**Notes:** Term content should support short definition, chart-specific hint, traditional/classical source notes, and plain-language examples.

### First-Screen Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| 先給專業盤 | First screen shows four pillars, ten gods, hidden stems, and five elements. | |
| 先給白話摘要 | First screen explains day master, five-element tendency, and chart highlights in plain language. | ✓ |
| 左右/上下雙層 | Desktop split and mobile stacked combination of summary and professional chart. | |

**User's choice:** 先給白話摘要.
**Notes:** Product should feel more approachable like consumer metaphysics products, while professional chart remains complete below.

---

## 擇吉評分系統

### Scoring Inputs

| Option | Description | Selected |
|--------|-------------|----------|
| 黃曆 + 場景 + 生肖 | Extend existing auspicious-day logic with scoring and reasons. | |
| 黃曆 + 場景 + 八字五行 | Combine almanac data, scene rules, and user's BaZi/five-element profile. | ✓ |
| 完整日課模型 | Include almanac, scene, zodiac, BaZi, five elements, shen-sha, and lucky hours as a full date-selection model. | |

**User's choice:** 黃曆 + 場景 + 八字五行.
**Notes:** First version should already be personalized by birth data/five-element signals, not just a generic almanac list.

### Input Model

| Option | Description | Selected |
|--------|-------------|----------|
| 單人擇吉 | One person's birth data for all scenes. | |
| 多人擇吉 | Multiple people for all scenes. | |
| 場景決定輸入人數 | Each scene defines required/optional people and roles. | ✓ |

**User's choice:** 場景決定輸入人數.
**Notes:** Marriage/matching can require two people; moving can optionally include family members; business/opening/signing can use responsible person/legal representative.

### Score Display

| Option | Description | Selected |
|--------|-------------|----------|
| 總分 + 理由列表 | Show overall score/grade and reason list. | ✓ |
| 多維雷達/條形分 | Show breakdown across almanac, zodiac, five elements, scene fit, lucky hours. | ✓ |
| 不顯示數字，只顯示等級 | Show labels such as 首選/可用/謹慎/避開 only. | |

**User's choice:** Combine options 1 and 2.
**Notes:** Show total score/grade plus dimension scores. Every score must be explainable.

### Result Experience

| Option | Description | Selected |
|--------|-------------|----------|
| 日期列表升級版 | Keep annual/monthly SEO list and add score/reasons/filtering. | |
| 互動式推薦流程 | User selects scene, enters people, chooses range, receives top dates. | ✓ |
| 兩者並存 | Keep SEO lists and add a separate personalized flow. | |

**User's choice:** 互動式推薦流程.
**Notes:** Existing SEO lists can feed or link to the flow, but the main Phase 4 experience should be an interactive recommendation tool.

---

## 知識庫與神話故事

### Coverage

| Option | Description | Selected |
|--------|-------------|----------|
| 八字核心術語 | Ten gods, day master, hidden stems, na-yin, five elements, strength/weakness, useful god, shen-sha. | |
| 八字 + 擇吉術語 | Add yi/ji, chong-sha, zhi-shen, lucky/ominous gods, lucky hours, date-selection rules. | |
| 大命理百科 | Include BaZi, auspicious-date selection, Zi Wei, twenty-eight mansions, Zhou Tian Xing Dou, mythology and stories. | ✓ |

**User's choice:** 大命理百科.
**Notes:** First implementation should serve BaZi and auspicious-date scoring, but taxonomy should prepare broader metaphysics expansion.

### Content Depth

| Option | Description | Selected |
|--------|-------------|----------|
| 先做骨架百科 | Name, category, short explanation, usage, related terms, and where it appears. | |
| 骨架 + 故事化內容 | Add mythology, star personality, plain examples, and common misunderstandings. | ✓ |
| 深度長文百科 | Add full source comparison, school differences, methods, and examples per topic. | |

**User's choice:** 骨架 + 故事化內容.
**Notes:** Content should be useful and enjoyable, not a thin glossary.

### Tool Integration

| Option | Description | Selected |
|--------|-------------|----------|
| 術語 tooltip / popover | Click terms in tools to see short explanation and contextual hint. | ✓ |
| 側邊知識面板 | Show related knowledge panel based on current chart/result. | |
| 兩者都做 | Tooltips plus generated knowledge panel. | |

**User's choice:** 術語 tooltip / popover.
**Notes:** Full encyclopedia pages can exist, but the first in-tool integration should be immediate term explanations.

### Story Placement

| Option | Description | Selected |
|--------|-------------|----------|
| 獨立百科/故事頁 | Create pages such as Zhou Tian Xing Dou, twenty-eight mansions, star stories, and five-element mythology. | ✓ |
| 工具頁內直接展示故事 | Insert story cards inside BaZi or auspicious-date workflows. | |
| 分享卡/結果卡中呈現 | Compress story content into shareable star/five-element/shen-sha cards. | |

**User's choice:** 獨立百科/故事頁.
**Notes:** Story content should not interrupt tool workflows; tools should link to stories from relevant terms.

---

## the agent's Discretion

- Exact implementation architecture, route paths, scoring weights, taxonomy schema, and storage strategy are left to planning/implementation.
- Planner should decide how to align the redirected scope with existing roadmap artifacts before execution.

## Deferred Ideas

- AI provider integration and AI chat/Q&A.
- Zi Wei Dou Shu MVP.
- BaZi shen-sha lists and luck cycles after the first professional-chart slice.
- Sidebar knowledge panels.
- Shareable story/result cards.
- Full long-form scholarly encyclopedia entries.
