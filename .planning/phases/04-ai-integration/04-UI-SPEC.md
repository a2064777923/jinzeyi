---
phase: 04
slug: metaphysics-depth-product-experience
status: approved
shadcn_initialized: true
preset: project-existing
created: 2026-05-18
---

# Phase 04 — UI Design Contract

> Visual and interaction contract for the redirected Phase 4: professional BaZi, metaphysics knowledge, and interactive auspicious-date scoring.

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn-style local primitives |
| Preset | project-existing |
| Component library | Base UI primitives through local `src/components/ui/*` wrappers |
| Icon library | lucide-react |
| Font | Existing Chinese-optimized project font stack and `font-serif-display` for metaphysics glyph emphasis |

## Experience Principles

- First screen should be useful, not explanatory marketing.
- Tool pages must show the working experience before long content blocks.
- Dense professional data should be grouped in scan-friendly panels, not long prose.
- Beginners see a plain-language summary first; professionals can inspect chart details below it.
- Every score and metaphysics label must expose a reason, caution, or term hint.
- Mythology/story content belongs on knowledge pages and is linked from tool hints.

## Spacing Scale

Declared values must stay on the existing 4px grid.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, badge internals |
| sm | 8px | Chips, inline controls, compact card gaps |
| md | 16px | Form groups, card padding, result blocks |
| lg | 24px | Tool panel gaps and section padding |
| xl | 32px | Page band spacing |
| 2xl | 48px | Major content separation |

Exceptions: none.

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 15-17px | 400 | 1.7 for Chinese prose |
| Label | 12-14px | 600 | 1.4 |
| Compact panel heading | 16-18px | 600 | 1.35 |
| Page H1 | 30-42px responsive via fixed breakpoints, not viewport scaling | 700 | 1.15 |
| Pillar glyph | 30-40px | 600 | 1.0 |

Do not scale font size with viewport width. Keep letter spacing at `0`.

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant | Existing background/card tokens | Page background and standard surfaces |
| Secondary | Existing muted/secondary tokens | Quiet information bands and disabled/secondary text |
| Auspicious accent | Existing `lucky` token | Positive fit, recommended score, matched yi terms |
| Caution accent | Existing `ominous` token | Cautions, conflicts, penalties, not-preferred score |
| Gold accent | Existing `accent` token | Highlighted metaphysics labels and story/knowledge accents |

Accent reserved for: score state, selected controls, important term hints, and primary CTA emphasis. Do not recolor every card.

## Interaction Contracts

### BaZi Tool

- Form remains a left rail on desktop and stacks above result on mobile.
- Result starts with a compact plain-language summary using tendency/reference language.
- Professional chart renders as four stable pillar cells: year, month, day, hour.
- Each pillar cell must expose visible stem, branch, ten god, hidden stems, na-yin, and terrain.
- Five-element strength panel must distinguish visible counts from hidden-stem weighted signals.
- Term labels such as day master, ten gods, hidden stems, na-yin, and terrain should use term hints linking to knowledge pages.

### Knowledge Base

- `/knowledge` is an index of categories and entry cards, not a marketing page.
- `/knowledge/[slug]` pages use article layout with H1, short definition, practical use, story/cultural context, common misunderstandings, related terms, and tool appearances.
- Entry cards use real domain labels, not generic "learn more" filler.
- Long mythology sections should appear below the practical explanation so tool users can get oriented first.

### Auspicious Recommendation Flow

- First visible control is scene selection.
- Person inputs change by scene:
  - marriage/matching: two required people;
  - moving: primary person plus optional household members;
  - business/signing/opening: responsible person/legal representative;
  - general scenes: one optional primary person.
- Date range control should make the allowed span visible and reject impossible/empty ranges inline.
- Results show ranked dates with overall score/grade, dimensional breakdown, reasons, cautions, and usable lucky hours.
- Annual jieri pages keep SEO list behavior and add a clear route into the personalized flow.

## Copywriting Contract

| Element | Copy |
|---------|------|
| BaZi primary CTA | `排盤` / `排盘` |
| Jieri primary CTA | `推薦日期` / `推荐日期` |
| Knowledge page CTA | `查看相關工具` / `查看相关工具` |
| Empty scoring result heading | `未找到足夠合適的日期` / `未找到足够合适的日期` |
| Empty scoring result body | Explain whether the date range is too short, scene match is too strict, or conflicts are too heavy; suggest widening the range. |
| Error state | State the invalid field and required format; do not blame the user. |
| Safety copy | Use `傾向`, `參考`, `值得留意`, `較適合`, `謹慎使用`; avoid deterministic fate language. |

## Mobile Contracts

- No horizontal body overflow at 320px or 375px.
- Fixed-format chart grids must use stable min/max constraints.
- Score rows must wrap text below labels rather than squeeze long Chinese strings into badges.
- Tooltips/popovers must fit within viewport width and include accessible labels.

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| local shadcn-style UI | button, badge, card, tabs, tooltip, collapsible, scroll-area | Use existing wrappers; no registry fetch needed |
| lucide-react | calculator, book/open, sparkles, alert/check/info icons | Use icons only when they clarify action/state |
| Base UI | tooltip/collapsible through local wrappers | Prefer local wrappers; add new wrapper only if existing controls cannot satisfy mobile accessibility |

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-05-18
