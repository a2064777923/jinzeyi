---
phase: 01-foundation-data-layer
plan: 01
subsystem: ui
tags: [next.js, next-intl, tailwind, shadcn, i18n, chinese-typography]

# Dependency graph
requires: []
provides:
  - "Next.js 16 App Router with TypeScript project scaffold"
  - "i18n routing with /zh-hant/ and /zh-hans/ URL prefixes via next-intl"
  - "Tailwind CSS v4 Chinese-optimized theme with custom color tokens"
  - "Responsive layout shell with sticky Header and Footer"
  - "LocaleToggle component for 繁體/简体 switching"
  - "shadcn/ui components: Button, Card, Separator"
  - "Chinese font loading (Noto Sans SC/TC) via next/font"
affects: [01-02, 01-03, 02-core-almanac-ui, 03-seo-matrix, 04-ai-integration]

# Tech tracking
tech-stack:
  added: [next.js, next-intl, tailwindcss, shadcn/ui, vitest, clsx, tailwind-merge]
  patterns: [i18n-routing, locale-toggle, sticky-header, css-first-theme]

key-files:
  created:
    - "middleware.ts — next-intl locale routing middleware"
    - "src/i18n/routing.ts — next-intl routing configuration"
    - "src/i18n/request.ts — next-intl request config"
    - "src/i18n/navigation.ts — next-intl navigation helpers"
    - "src/i18n/messages/zh-hant.json — Traditional Chinese messages"
    - "src/i18n/messages/zh-hans.json — Simplified Chinese messages"
    - "src/app/[locale]/layout.tsx — Root locale layout with fonts, header, footer"
    - "src/app/[locale]/page.tsx — Homepage with CTA"
    - "src/components/layout/Header.tsx — Sticky header with brand + locale toggle"
    - "src/components/layout/Footer.tsx — Legal disclaimer + copyright"
    - "src/components/layout/LocaleToggle.tsx — 繁體/简体 toggle button"
    - "src/components/ui/button.tsx — shadcn Button component"
    - "src/components/ui/card.tsx — shadcn Card component"
    - "src/components/ui/separator.tsx — shadcn Separator component"
    - "src/styles/globals.css — Tailwind v4 CSS-first theme with Chinese design tokens"
    - "src/lib/utils.ts — Utility functions (cn helper)"
    - "vitest.config.ts — Vitest test framework configuration"
    - ".env.example — Environment variable template"
  modified:
    - "package.json — Dependencies and scripts"
    - "next.config.ts — next-intl plugin configuration"
    - ".gitignore — Updated to allow .env.example"

key-decisions:
  - "Used 'latin' subset for Chinese fonts (next/font always includes CJK characters)"
  - "Created src/i18n/navigation.ts for typed navigation helpers"
  - "Used shadcn New York style with CSS variables for theming"
  - "Root layout.tsx passes through; [locale]/layout.tsx handles full HTML structure"

patterns-established:
  - "i18n routing: next-intl with /zh-hant/ and /zh-hans/ URL prefixes"
  - "Locale toggle: Client component using useRouter.replace for locale switching"
  - "Layout structure: Root layout passes through, [locale] layout handles HTML shell"
  - "Chinese typography: Noto Sans SC/TC via next/font with CSS variable"

requirements-completed: [FOUND-01, FOUND-02, FOUND-05, FOUND-06, I18N-01, I18N-02, I18N-04]

# Metrics
duration: 9min
completed: 2026-05-17
---

# Phase 1 Plan 01: Project Scaffold + i18n Routing + Layout Shell Summary

**Next.js 16 App Router with next-intl i18n routing (/zh-hant/ /zh-hans/), Tailwind v4 Chinese-optimized theme, shadcn/ui components, and responsive layout shell (Header with locale toggle, Footer with legal disclaimer)**

## Performance

- **Duration:** 9 min
- **Started:** 2026-05-16T17:16:02Z
- **Completed:** 2026-05-16T17:25:16Z
- **Tasks:** 2
- **Files modified:** 26

## Accomplishments
- Next.js 16 App Router scaffold with TypeScript, ESLint, Tailwind CSS v4
- i18n routing with /zh-hant/ and /zh-hans/ URL prefixes via next-intl
- Responsive layout shell with sticky header (brand + locale toggle) and footer (legal disclaimer)
- Chinese font loading (Noto Sans SC/TC) via next/font
- shadcn/ui components (Button, Card, Separator) with Chinese-optimized theme

## Task Commits

Each task was committed atomically:

1. **Task 1: Project scaffold + i18n routing + Tailwind theme** - `24b2ddd` (feat)
2. **Task 2: Layout shell — Header, Footer, LocaleToggle, responsive design** - `c4200ae` (feat)

## Files Created/Modified
- `middleware.ts` — next-intl locale routing middleware
- `src/i18n/routing.ts` — next-intl routing configuration
- `src/i18n/request.ts` — next-intl request config
- `src/i18n/navigation.ts` — next-intl navigation helpers
- `src/i18n/messages/zh-hant.json` — Traditional Chinese messages
- `src/i18n/messages/zh-hans.json` — Simplified Chinese messages
- `src/app/[locale]/layout.tsx` — Root locale layout with fonts, header, footer
- `src/app/[locale]/page.tsx` — Homepage with CTA
- `src/components/layout/Header.tsx` — Sticky header with brand + locale toggle
- `src/components/layout/Footer.tsx` — Legal disclaimer + copyright
- `src/components/layout/LocaleToggle.tsx` — 繁體/简体 toggle button
- `src/components/ui/button.tsx` — shadcn Button component
- `src/components/ui/card.tsx` — shadcn Card component
- `src/components/ui/separator.tsx` — shadcn Separator component
- `src/styles/globals.css` — Tailwind v4 CSS-first theme with Chinese design tokens
- `src/lib/utils.ts` — Utility functions (cn helper)
- `vitest.config.ts` — Vitest test framework configuration
- `.env.example` — Environment variable template
- `next.config.ts` — next-intl plugin configuration

## Decisions Made
- Used 'latin' subset for Chinese fonts (next/font always includes CJK characters)
- Created src/i18n/navigation.ts for typed navigation helpers (useRouter, usePathname)
- Used shadcn New York style with CSS variables for theming
- Root layout.tsx passes through; [locale]/layout.tsx handles full HTML structure

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Chinese font subsets**
- **Found during:** Task 1 (Project scaffold)
- **Issue:** `subsets: ['chinese-simplified']` caused TypeScript error — next/font only accepts 'latin', 'cyrillic', 'vietnamese' subsets
- **Fix:** Changed to `subsets: ['latin']` — Chinese characters are always included by next/font
- **Files modified:** src/app/[locale]/layout.tsx
- **Verification:** Build passes without errors
- **Committed in:** 24b2ddd (Task 1 commit)

**2. [Rule 3 - Blocking] Created missing navigation.ts**
- **Found during:** Task 2 (Layout shell)
- **Issue:** LocaleToggle imports from '@/i18n/navigation' which didn't exist
- **Fix:** Created src/i18n/navigation.ts with createNavigation from next-intl
- **Files modified:** src/i18n/navigation.ts
- **Verification:** Build passes without errors
- **Committed in:** c4200ae (Task 2 commit)

**3. [Rule 3 - Blocking] Fixed globals.css Chinese theme colors**
- **Found during:** Task 2 (Layout shell)
- **Issue:** shadcn init overwrote :root section with default oklch colors, losing our Chinese theme
- **Fix:** Restored :root section with Chinese theme colors (#FFFBF5, #C43B3B, etc.)
- **Files modified:** src/styles/globals.css
- **Verification:** Build passes, theme colors preserved
- **Committed in:** c4200ae (Task 2 commit)

**4. [Rule 3 - Blocking] Updated .gitignore for .env.example**
- **Found during:** Task 1 (Project scaffold)
- **Issue:** `.env*` pattern in .gitignore blocked .env.example from being committed
- **Fix:** Updated .gitignore to only ignore .env, .env.local, .env.*.local
- **Files modified:** .gitignore
- **Verification:** .env.example commits successfully
- **Committed in:** 24b2ddd (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (4 blocking)
**Impact on plan:** All auto-fixes necessary for correctness. No scope creep.

## Issues Encountered
None — all issues resolved via deviation rules.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Next.js 16 app builds successfully with i18n routing
- Layout shell ready for content components
- shadcn/ui components available for Phase 2 UI development
- Chinese typography and theme established

## Self-Check: PASSED

- All 18 key files verified present
- Both task commits verified in git log (24b2ddd, c4200ae)
- Build passes without errors

---
*Phase: 01-foundation-data-layer*
*Completed: 2026-05-17*
