# Phase 04 — Research: Metaphysics Depth & Product Experience

**Phase directory:** `.planning/phases/04-ai-integration`  
**Created:** 2026-05-18  
**Scope status:** AI provider integration is intentionally deferred by user decision; this research supports the redirected Phase 4 product foundation.

## Research Question

What does JinZeYi need before AI is worth adding?

The answer from product and code research is: stronger deterministic metaphysics data, richer explanations, and a more engaging interaction/content layer. AI can later summarize or converse over this foundation, but adding AI now would amplify the current shallow BaZi, list-style jieri, and small glossary limitations.

## Product Benchmark Findings

### Consumer Metaphysics Apps

Public app-store materials for products such as Cece/測測 and 準了 point to a layered product pattern: users enter personal data once, then repeatedly receive chart reports, daily/monthly/yearly readings, matching, and lightweight fun hooks. The useful lesson for JinZeYi is not "copy AI chat"; it is:

- make outputs feel personal and repeatable;
- keep one birth profile reusable across tools;
- show layered interpretations instead of one flat paragraph;
- combine serious chart data with approachable labels, badges, stories, and reminders;
- let users compare dimensions rather than accept a single mysterious score.

### Professional BaZi Tools

Professional BaZi apps and websites differentiate through complete chart surfaces: four pillars, day master, ten gods, hidden stems, na-yin, twelve-growth terrain, shen-sha, da-yun, liu-nian, and classical annotations. Phase 4 should not attempt all advanced layers at once, but the first data model must stop at a professional boundary rather than a toy boundary.

The first JinZeYi professional chart should include:

- year/month/day/hour pillar breakdown;
- day master;
- heavenly stem and earthly branch for every pillar;
- ten-god relation from day master to each visible stem;
- hidden stems under every branch, with ten-god relation;
- na-yin for each pillar;
- twelve-growth terrain or equivalent day-master strength signal;
- five-element distribution that distinguishes visible pillar counts from hidden-stem weighted counts.

Shen-sha and luck-cycle layers should remain follow-up modules after this chart skeleton is stable.

### Layered Knowledge Products

Products that feel deeper do not explain every term inline. They use compact tool hints, then link to a knowledge/story layer where the user can explore terminology, mythology, and cultural context without interrupting the workflow.

For JinZeYi, the knowledge layer should start as a structured encyclopedia, not a tiny glossary:

- `name`, `slug`, `category`, `short`, `detail`;
- `practicalUse`;
- `relatedTerms`;
- `toolAppearances`;
- `mythologyStory` or cultural story;
- `starPersonalityMetaphor` when relevant;
- `commonMisunderstandings`;
- `sourceNotes`;
- SEO metadata and JSON-LD.

The first taxonomy should cover current tools and prepare future expansion:

- BaZi: four pillars, day master, ten gods, hidden stems, na-yin, five elements, twelve-growth terrain;
- Almanac/date selection: yi-ji, chong-sha, duty officer, shen-sha, lucky hour, twenty-eight mansions;
- Future modules: Zi Wei Dou Shu, Zhou Tian Xing Dou, star deities, palaces, transformations, brightness states.

Preferred wording: use `紫微斗數`, not `紫薇算術`.

## Technical Research

### tyme4ts BaZi Capability

Local `tyme4ts` inspection confirms the installed package can support the Phase 4 BaZi core without adding a new external API.

Current working entry point:

```ts
const eightChar = SolarTime
  .fromYmdHms(year, month, day, hour, minute, second)
  .getLunarHour()
  .getEightChar();
```

Useful APIs verified from local package typings and runtime probes:

- `EightChar#getYear/getMonth/getDay/getHour()` returns `SixtyCycle` pillars.
- `SixtyCycle#getHeavenStem/getEarthBranch/getSound/getPengZu()`.
- `HeavenStem#getTenStar(targetStem)`.
- `HeavenStem#getTerrain(earthBranch)`.
- `EarthBranch#getHideHeavenStems()`.
- `EarthBranch#getZodiac/getOpposite/getOminous/getElement/getYinYang()`.
- `ChildLimit.fromSolarTime(...)` and luck-cycle methods exist, but should be deferred.

Runtime reference for `2005-12-23 08:37`:

| Pillar | Value | Ten God vs Day Master | Na-yin | Terrain | Hidden Stems |
|--------|-------|------------------------|--------|---------|--------------|
| Year | 乙酉 | 偏财 | 泉中水 | 临官 | 辛 / 比肩 |
| Month | 戊子 | 正印 | 霹雳火 | 长生 | 癸 / 食神 |
| Day | 辛巳 | 比肩 | 白蜡金 | 死 | 丙 / 正官, 庚 / 劫财, 戊 / 正印 |
| Hour | 壬辰 | 伤官 | 长流水 | 墓 | 戊 / 正印, 乙 / 偏财, 癸 / 食神 |

Implementation implication: extend `src/lib/almanac/bazi.ts` instead of replacing it. Preserve the existing return fields so Phase 3 UI/tests do not break, then add professional fields.

### Existing BaZi Code

Current files:

- `src/lib/almanac/bazi.ts` computes true solar time, four pillars, simple stem/branch elements, and visible element counts.
- `src/components/tools/BaziForm.tsx` already collects birth date, precise time, China city, and gender.
- `src/components/tools/BaziResult.tsx` renders a compact four-pillar card grid and element bars.
- `tests/almanac/bazi.test.ts` already verifies true solar time, reference pillars, early years, invalid input, and city dataset.

Gaps:

- no day-master object;
- no ten gods;
- no hidden stems;
- no na-yin display;
- no terrain/twelve-growth signal;
- five-element counts are too coarse;
- explanation is one paragraph rather than layered summary + professional chart;
- glossary is too small for chart-specific hints.

### Existing Auspicious-Day Code

Current files:

- `src/lib/almanac/auspicious.ts` builds annual candidates by matching scene `yiTerms`.
- `src/lib/almanac/types.ts` defines `DailyAlmanac`, `AuspiciousDayResult`, and reason objects.
- `src/lib/content/jieri-scenes.ts` defines nine scene rules.
- `src/components/jieri/*` renders annual SEO lists, filters, and date rows.

Strengths:

- candidate generation is deterministic and testable;
- reason objects already exist;
- scene rules already separate yi/caution terms;
- annual SEO pages should remain valuable and indexable.

Gaps:

- no date-range flow;
- no multi-person scene input;
- no dimensional score;
- no BaZi/five-element fit;
- no usable lucky-hour dimension;
- no reusable scene role schema for marriage/moving/business differences.

Recommended service shape:

```ts
scoreAuspiciousDate({
  scene,
  date,
  people,
  almanac,
}): AuspiciousScoreResult
```

Score dimensions should total 100:

- almanac fit: 30;
- scene fit: 20;
- zodiac/chong-sha fit: 20;
- BaZi/five-element fit: 20;
- usable lucky hours: 10.

Every dimension must return `score`, `maxScore`, `grade`, `reasons`, and `cautions`.

### Existing Knowledge Layer

Current files:

- `src/lib/content/glossary.ts` defines a small `GlossaryEntry` model.
- `src/components/knowledge/TermHint.tsx` shows tooltip hints.
- `src/components/knowledge/GlossaryPanel.tsx` displays related entries.
- `src/components/almanac/AlmanacDetail.tsx`, homepage, and tools pages already consume glossary entries.

Recommended evolution:

- introduce `src/lib/content/metaphysics.ts` as the richer source of truth;
- keep `getGlossaryEntry` compatibility wrappers for existing screens;
- let `TermHint` render richer fields when present;
- add `/knowledge` and `/knowledge/[slug]` pages;
- register knowledge pages in `src/lib/content/registry.ts` and sitemap;
- include content-family support in `src/lib/content/types.ts`.

## Validation Architecture

### Unit Tests

- Extend `tests/almanac/bazi.test.ts` to assert ten gods, hidden stems, na-yin, day master, and terrain for a fixed fixture.
- Add `tests/almanac/auspicious-scoring.test.ts` for dimensional scoring, role requirements, explainable reasons, and grade thresholds.
- Add `tests/content/metaphysics.test.ts` to assert required knowledge fields, related links, tool appearances, and compatibility wrapper behavior.
- Add source-level tests for UI wiring if no React testing library is present.

### Integration / Build Checks

- `npm test -- tests/almanac/bazi.test.ts tests/content/metaphysics.test.ts tests/almanac/auspicious-scoring.test.ts`
- `npx tsc --noEmit`
- `npm run build`

### Manual / Browser Checks

- `/zh-hant/tools/bazi`: first screen shows plain-language summary before professional chart details.
- `/zh-hant/knowledge`: entry cards are readable at 320px and 375px.
- `/zh-hant/knowledge/day-master`: page has H1, story/cultural context, related terms, and JSON-LD.
- `/zh-hant/tools/jieri-recommend`: scene -> people -> date range -> ranked results flow works without horizontal overflow.
- Existing `/zh-hant/jieri/jiehun/2026` still renders annual SEO list and links into the interactive recommendation flow.

## Sources Consulted

- Google Play listing for 測測/Cece: `https://play.google.com/store/apps/details?hl=zh_TW&id=com.lingocc.cc5`
- Apple App Store listing for 準了: `https://apps.apple.com/cn/app/id1356471277`
- Apple App Store listing for 問真八字: `https://apps.apple.com/cn/app/id1665624645`
- tyme4ts project documentation: `https://6tail.cn/tyme.html`
- Local `tyme4ts` package typings: `node_modules/tyme4ts/dist/lib/index.d.ts`
- iztro Zi Wei learning/docs for future taxonomy shape: `https://iztro.com/learn/star`

## Planning Recommendation

Create four vertical slices:

1. Professional BaZi calculation core.
2. Metaphysics knowledge taxonomy and rich term hints.
3. BaZi result UI upgrade using the professional chart and knowledge hints.
4. Interactive auspicious-date scoring and recommendation flow.

Do not implement AI provider registry, streaming API routes, or model failover in this phase.
