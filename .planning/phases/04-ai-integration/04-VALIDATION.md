---
phase: 04
slug: metaphysics-depth-product-experience
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-18
---

# Phase 04 — Validation Strategy

> Validation contract for Phase 4 planning and execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | package scripts (`npm test`, `vitest run`) |
| **Quick run command** | `npx vitest run <target> --reporter=verbose` |
| **Full suite command** | `npm test && npx tsc --noEmit && npm run build` |
| **Estimated runtime** | Existing targeted tests ~5-30 seconds; full build depends on Next build cache |

## Sampling Rate

- **After every task commit:** Run the targeted Vitest command listed in the task.
- **After every plan wave:** Run `npm test && npx tsc --noEmit`.
- **Before `$gsd-verify-work`:** Run `npm test && npx tsc --noEmit && npm run build`.
- **Max feedback latency:** Keep targeted feedback under 60 seconds where possible.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | META-01 | T-04-01 | Birth data stays local deterministic calculation; invalid input rejected | unit | `npx vitest run tests/almanac/bazi.test.ts --reporter=verbose` | ✅ | pending |
| 04-01-02 | 01 | 1 | META-01 | T-04-02 | Professional chart fields are explicit and bounded | unit | `npx vitest run tests/almanac/bazi.test.ts --reporter=verbose` | ✅ | pending |
| 04-02-01 | 02 | 1 | META-03 | T-04-03 | Knowledge entries are typed and source-note aware | unit | `npx vitest run tests/content/metaphysics.test.ts --reporter=verbose` | ❌ W0 | pending |
| 04-02-02 | 02 | 1 | META-04 | T-04-04 | Term hints do not hide critical tool behavior or deterministic claims | unit/source | `npx vitest run tests/content/metaphysics.test.ts --reporter=verbose` | ❌ W0 | pending |
| 04-03-01 | 03 | 2 | META-01 | T-04-05 | BaZi UI shows summary first and professional details as evidence | source/build | `npx vitest run tests/tools/bazi-ui-source.test.ts --reporter=verbose && npx tsc --noEmit` | ❌ W0 | pending |
| 04-04-01 | 04 | 2 | META-02 | T-04-06 | Scores expose dimensions and reasons, not opaque fate claims | unit | `npx vitest run tests/almanac/auspicious-scoring.test.ts --reporter=verbose` | ❌ W0 | pending |
| 04-04-02 | 04 | 2 | META-02 | T-04-07 | Scene roles validate required people and date range | unit/build | `npx vitest run tests/almanac/auspicious-scoring.test.ts --reporter=verbose && npx tsc --noEmit` | ❌ W0 | pending |

## Wave 0 Requirements

- [x] Existing `tests/almanac/bazi.test.ts` covers the BaZi utility baseline.
- [x] Existing `tests/almanac/auspicious.test.ts` covers the annual jieri baseline.
- [ ] `tests/content/metaphysics.test.ts` — create in Plan 04-02.
- [ ] `tests/tools/bazi-ui-source.test.ts` — create in Plan 04-03 if no component test library is added.
- [ ] `tests/almanac/auspicious-scoring.test.ts` — create in Plan 04-04.
- [ ] `tests/seo/knowledge-routes.test.ts` — create in Plan 04-02.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Professional BaZi result readability | META-01 | Requires visual scan of hierarchy and overflow | Open `/zh-hant/tools/bazi` at desktop, 375px, and 320px; verify summary first, no overlap, professional chart visible. |
| Knowledge/story page tone | META-03/META-04 | Requires editorial judgment | Open `/zh-hant/knowledge/day-master`; verify cultural/story tone, source notes, common misunderstandings, and no deterministic fate claims. |
| Recommendation flow ergonomics | META-02 | Requires interaction through form steps | Open `/zh-hant/tools/jieri-recommend`; run marriage and moving scenes; verify role inputs, ranked dates, score reasons, cautions, and lucky hours. |

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies.
- [x] Sampling continuity: no 3 consecutive tasks without automated verify.
- [x] Wave 0 covers all missing references.
- [x] No watch-mode flags.
- [x] Feedback latency target < 60 seconds for targeted tests.
- [x] `nyquist_compliant: true` set in frontmatter.

**Approval:** approved 2026-05-18
