---
phase: 03
slug: seo-content-matrix
status: approved
shadcn_initialized: true
preset: project-custom
created: 2026-05-17
---

# Phase 03 — UI Design Contract

> Visual and interaction contract for Phase 3 SEO content and tool pages.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui project components |
| Preset | project-custom almanac theme |
| Component library | base-ui primitives via local shadcn components |
| Icon library | lucide-react + existing `/public/assets/almanac-icons/*.png` |
| Font | Noto Sans SC/TC for UI, Noto Serif SC/TC for seals, hero dates, and editorial accents |

**Existing visual language is locked:** modern Chinese almanac tool, not a marketing landing page. Phase 3 pages must feel like usable content/tools on first viewport.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, table cell inner gaps, badge icon gaps |
| sm | 8px | Button/chip gaps, compact card padding |
| md | 16px | Default card padding, form field spacing |
| lg | 24px | Section padding, desktop grid gaps |
| xl | 32px | Page band gaps, article section gaps |
| 2xl | 48px | Major page breaks on desktop |
| 3xl | 64px | Top-level route page vertical rhythm only |

Exceptions: fixed-format widgets may use stable cell dimensions where needed, such as calendar/date rows, zodiac compatibility grids, and BaZi four-pillar columns. These must still align to a 4px grid.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.75 |
| Label | 13-14px | 500-600 | 1.35 |
| Heading | 24-32px | 600 | 1.2 |
| Display | 36-48px desktop, 30-36px mobile | 600 | 1.12 |
| Article body | 17px desktop, 16px mobile | 400 | 1.9 |
| Dense table/list | 14-15px | 500 | 1.5 |

Rules:
- Do not scale type with viewport width.
- Letter spacing stays `tracking-normal`.
- Article lines should cap around `max-w-[65ch]`.
- Compact widgets use smaller headings; hero-scale type is reserved for route-level H1/date/animal/tool names.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#F4FAF6` | Page background and full-width calm content bands |
| Secondary (30%) | `#FFFFFF`, `#E6F4EC`, `#EAF3EE` | Cards, panels, chips, nav surfaces |
| Accent (10%) | `#D97706`, `#B7791F`, `#C2410C`, `#475569` | Gold highlight, auspicious state, caution/ominous state |
| Destructive | `#DC2626` | Input errors and destructive warnings only |

Accent reserved for: auspicious markers, caution labels, zodiac/element badges, active filters, primary CTAs, and key metrics.

Rules:
- `#047857` green is structural primary only: nav active states, focus rings, neutral tool CTAs.
- Auspicious uses red/gold (`lucky`, `accent`, `gold`); ominous/caution uses slate (`ominous`), not green.
- Avoid one-note green pages by pairing green structure with red/gold/slate state colors.
- Do not introduce purple, beige-heavy, brown/orange-heavy, or decorative gradient orb palettes.

---

## Page Type Contracts

### Auspicious Day Scene Page: `/jieri/{scene}/{year}`

First viewport must show:
- H1: `{year}年{scene}吉日`
- Scene summary copy and cultural-use disclaimer in normal page text, not a modal or marketing card.
- Year selector, zodiac filter, and quick month jump controls above the list.
- Summary metrics: recommended days, caution days, matching `yi` terms, zodiac conflict count when filter is active.

Layout:
- Desktop: two-column layout, `minmax(0,1fr)` main list plus 18-22rem right rail for filters, FAQ, related links.
- Mobile: filter controls collapse into segmented/chip rows and accordions; month sections stack but use compact date rows to reduce scroll fatigue.
- Date results are rows or compact tiles with stable height. Each item shows date, lunar date, fortune state, matching reason, caution reason if any, and link to `/almanac/YYYY-MM-DD`.
- Do not use a pure table as the primary experience.

### Zodiac Hub: `/zodiac/{animal}`

First viewport must show:
- Animal name as H1 and a visible zodiac visual signal using `zodiac-ring.png` or a compatible asset.
- Year table/lookup, compatibility highlights, personality summary, and related auspicious day entrances.

Layout:
- Desktop: hub summary grid plus article/compatibility sections below.
- Mobile: compatibility and year table use horizontal scroll or compact accordions, not oversized stacked cards.

### Zodiac Article Pages

Layout:
- Article content uses a readable `max-w-[65ch]` column.
- Desktop may include a sticky right rail with related zodiac links, FAQ, and tool entries.
- Mobile starts with title, short deck, metadata, and direct related tool chips.
- Each article ends with FAQ and internal links. Avoid generic AI-sounding summary blocks.

### Feng Shui Article Pages

Layout:
- Category landing uses dense article list grouped by home, office, shop, directions, wealth position.
- Article pages include a practical checklist block near the top and related almanac/jieri links.
- Use `mountain.png`, `compass.png`, `sprout.png`, `lotus.png`, or `yin-yang.png` as restrained visual cues.

### BaZi Tool Page

First viewport must show:
- H1: `八字排盘`
- Form fields: birth date, precise birth time, birth place, gender.
- Result preview area remains below the form and must not require navigation after submit.

Interaction:
- Keep the page Server Component; isolate the form/result widget as a client component.
- Field errors appear inline under the field.
- Birth place control supports searchable or grouped China city/province selection.
- Results show four pillars as four stable columns on desktop and a 2x2 grid on mobile.
- Five-element distribution uses bars or chips with stable dimensions.

### Naming Tool Page

First viewport must show:
- H1: `姓名五行查询`
- Form fields: surname, given name.
- Results show per-character five element, score, short explanation, and suggested replacement/name characters.

Interaction:
- Suggestions appear as selectable chips or compact list rows.
- No generated result may shift the form header or cause horizontal overflow.

---

## Component Contracts

| Component | Required Behavior |
|-----------|-------------------|
| `SeoPageShell` | Full-width page bands with constrained `max-w-7xl` inner content; no cards inside cards. |
| `SeoHero` | H1, deck, badges, primary controls; uses real icon/image asset when domain-specific. |
| `FilterRail` | Desktop right rail, mobile collapsible panel; must remain keyboard accessible. |
| `FaqBlock` | Visible HTML content plus JSON-LD source data; not hidden-only SEO text. |
| `InternalLinkGrid` | Dense related links with icons/chips; no decorative card grid bloat. |
| `ArticleLayout` | `max-w-[65ch]` prose, right rail on desktop, compact related chips on mobile. |
| `ToolFormPanel` | Labels, descriptions where useful, inline validation, submit button with icon. |
| `ResultSummary` | Stable result container; no layout jump when result content appears. |

Existing components to reuse where possible:
- `Badge`, `Button/buttonVariants`, `Card`, `Tabs`, `Separator`, `Tooltip`
- `FortuneMarker`, `YiJiBadgeList`, `DateSearchForm`
- `almanac-grid`, `shimmer-panel`, `fortune-pattern-*`, `font-serif-display`

---

## Interaction Contract

| Interaction | Contract |
|-------------|----------|
| Year selector | Accept direct year input and previous/next controls where useful; invalid years show inline error. |
| Zodiac filter | Optional filter for `jieri` pages; selected zodiac downgrades conflicts instead of deleting results. |
| Month jump | Desktop sticky/rail links; mobile horizontal chips. |
| Article related links | Always visible near end of article and in desktop rail. |
| Forms | Keyboard navigable, `form` element based, inline validation, no full-page client rendering. |
| Loading/empty states | Empty states provide next action; loading skeletons preserve final dimensions. |

---

## Responsive Contract

| Viewport | Contract |
|----------|----------|
| Desktop >= 1024px | `max-w-7xl`, two-column where helpful, sticky/context rail allowed. |
| Tablet 768px | Main content remains single column or balanced two-column only when controls fit. |
| Mobile 375px | Controls use chips/accordions/horizontal snap where it reduces page height. |
| Small 320px | No text overlap, no horizontal body overflow, date/result cells preserve dimensions. |

Rules:
- Avoid vertical stacking that turns desktop pages into 3x-4x mobile height when controls can be grouped.
- Long lists need month anchors, accordions, or compact rows.
- Fixed-format widgets must use `min-w-0`, `max-w-full`, and stable grid tracks.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA for scene pages | `查看吉日` / `查看吉日` |
| Zodiac CTA | `查看生肖配对` / `查看生肖配對` |
| BaZi CTA | `排出八字` / `排出八字` |
| Naming CTA | `分析姓名` / `分析姓名` |
| Empty state heading | `未找到符合条件的日期` / `未找到符合條件的日期` |
| Empty state body | `请调整年份、场景或生肖条件，再重新查看。` / `請調整年份、場景或生肖條件，再重新查看。` |
| Error state | `资料暂时无法生成，请稍后重试或返回今日黄历。` / `資料暫時無法生成，請稍後重試或返回今日黃曆。` |
| Destructive confirmation | Not applicable; Phase 3 has no destructive actions. |

Tone:
- Calm, editorial, practical.
- Avoid visible feature explanations such as "this page supports SEO" or "click here to use filters".
- Avoid AI-flavored filler, exaggerated promises, and deterministic fortune claims.

---

## Accessibility Contract

- Every form field has a visible label and programmatic label.
- Icon-only buttons need `aria-label`.
- Month navigation and year navigation include target year/month in `aria-label`.
- Active tabs/filters use `aria-current` or pressed state as appropriate.
- Error text is associated with input fields.
- Focus rings use existing `focus-visible` primary ring.
- JSON-LD scripts must not replace visible FAQ or article content.

---

## SEO UI Contract

- Every indexable page renders meaningful H1 and body content in initial HTML.
- JSON-LD source data must match visible page content.
- FAQ content must be visible to users, not hidden for crawlers.
- Breadcrumbs should be visible on article/tool pages and represented by `BreadcrumbList`.
- Related links should prioritize same-locale URLs and avoid dead/placeholder links.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official/local | Button, Badge, Card, Tabs, Separator, Tooltip, ScrollArea, Table where needed | not required |
| base-ui via local shadcn | Tabs and button primitives already present | use existing wrappers only |
| third-party registry | none approved | shadcn view + diff required before use |

No new UI component registry or heavy visual library is approved for Phase 3.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-05-17
