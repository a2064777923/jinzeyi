---
phase: 03
slug: seo-content-matrix
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-17
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + TypeScript + Playwright/manual browser smoke |
| **Config file** | `vitest.config.ts` inferred from current test setup |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm run lint && npm test && npx tsc --noEmit && npm run build` |
| **Estimated runtime** | ~60-180 seconds depending on Next build |

---

## Sampling Rate

- **After every task commit:** Run `npm test` for utility/content tasks; run targeted Playwright smoke checks after route/UI tasks.
- **After every plan wave:** Run `npm run lint && npm test && npx tsc --noEmit`.
- **Before `$gsd-verify-work`:** Full suite must be green, including `npm run build`.
- **Max feedback latency:** 180 seconds for automated checks.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | SEO-01, SEO-02 | T-03-01 | N/A | unit | `npm test` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | SEO-07, SEO-09 | T-03-02 | N/A | unit/build | `npm test && npm run build` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | SEO-01, SEO-02 | T-03-03 | Route params reject unsafe values | unit/build | `npm test && npm run build` | ❌ W0 | ⬜ pending |
| 03-03-01 | 03 | 2 | SEO-03 | T-03-04 | Article slugs render static content only | unit/build | `npm test && npm run build` | ❌ W0 | ⬜ pending |
| 03-04-01 | 04 | 2 | SEO-04, SEO-06 | T-03-05 | Form input validated by zod before calculation | unit/build | `npm test && npm run build` | ❌ W0 | ⬜ pending |
| 03-05-01 | 05 | 2 | SEO-05, SEO-08 | T-03-06 | Article data sanitized as typed static content | unit/build | `npm test && npm run build` | ❌ W0 | ⬜ pending |
| 03-06-01 | 06 | 3 | SEO-07, SEO-08, SEO-09 | T-03-07 | Sitemap includes only approved indexable URLs | unit/build | `npm test && npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠ flaky*

---

## Wave 0 Requirements

- [ ] `tests/seo/` — tests for metadata helpers, sitemap entries, content registry, route year windows.
- [ ] `tests/almanac/` — tests for scene matching, year support probes, zodiac conflict, BaZi/five-element utilities.
- [ ] `tests/tools/` — tests for naming and true solar time utilities if planner places them outside `lib/almanac`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Long-form article tone and non-AI feel | SEO-03, SEO-05 | Editorial quality cannot be fully automated | Review one zodiac article and one Feng Shui article for natural flow, source-synthesized claims, and no obvious AI filler. |
| Mobile layout of long SEO/tool pages | FOUND-06, SEO-01~SEO-06 | Visual density and overflow need browser inspection | Use Playwright at 375px and 320px on representative route pages. |
| JSON-LD appears in rendered HTML | SEO-08 | Source assertions are helpful but browser output is final | Open representative pages and inspect `<script type="application/ld+json">`. |

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 180s.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** pending
