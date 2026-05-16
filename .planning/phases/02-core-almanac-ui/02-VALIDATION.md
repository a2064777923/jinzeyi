---
phase: 2
slug: core-almanac-ui
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-17
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (recommended in Phase 1 research) |
| **Config file** | none yet — see Wave 0 |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run --coverage` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run` (affected tests)
- **After every plan wave:** Run `npx vitest run` (full suite)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | ALM-03 | unit | `npx vitest run tests/almanac/today-card.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | ALM-04 | unit | `npx vitest run tests/almanac/hourly.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | ALM-04 | integration | `npx vitest run tests/almanac/hourly-cache.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | ALM-05 | unit | `npx vitest run tests/almanac/monthly.test.ts` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | ALM-05 | unit | `npx vitest run tests/almanac/calendar-grid.test.tsx` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 3 | ALM-06 | unit | `npx vitest run tests/almanac/solar-terms.test.ts` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 3 | ALM-06 | unit | `npx vitest run tests/almanac/solar-terms-page.test.tsx` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 4 | ALM-07 | integration | `npx vitest run tests/almanac/detail-page.test.tsx` | ❌ W0 | ⬜ pending |
| 02-04-02 | 04 | 4 | ALM-07 | unit | `npx vitest run tests/almanac/detail-meta.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — test framework configuration (if not created in Phase 1)
- [ ] `tests/setup.ts` — shared test fixtures (mock AlmanacService)
- [ ] `tests/almanac/hourly.test.ts` — hourly fortune computation tests
- [ ] `tests/almanac/monthly.test.ts` — monthly calendar computation tests
- [ ] `tests/almanac/solar-terms.test.ts` — solar terms computation tests
- [ ] `tests/almanac/today-card.test.tsx` — TodayAlmanacCard rendering tests
- [ ] `tests/almanac/detail-page.test.tsx` — detail page rendering + 404 tests
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react` (if not done in Phase 1)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Fortune marker calligraphy visual weight | ALM-04 | Visual quality cannot be automated | View hourly table on mobile/desktop, confirm 吉/凶 markers have brush-stroke aesthetic |
| Calendar color coding contrast | ALM-05 | Accessibility contrast ratio | Verify red bg (#C43B3B) with gold text (#B8860B) meets WCAG AA 4.5:1 |
| Responsive layout at breakpoints | ALM-03/05 | Cross-device visual check | Test at 360px, 640px, 768px, 1024px widths |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
