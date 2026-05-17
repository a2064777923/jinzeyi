# Phase 03 Year Support Blocker

**Created:** 2026-05-17  
**Plan:** 03-01  
**Status:** Blocking product decision required before route expansion

## Summary

Phase 3 requested legal dynamic route support for years `0-5000`, presented as formally supported. The installed `tyme4ts` implementation does not support years `0` and `1` for the same almanac semantics used by the rest of the product.

## Probe Result

The Wave 1 guardrail probe exercised the required APIs for years `0`, `1`, `2`, `1900`, `2100`, and `5000`.

| Year | SolarDay | SolarTime | LunarDay | Gan-Zhi | SolarTerm | Daily Fields |
|------|----------|-----------|----------|---------|-----------|--------------|
| 0 | FAIL: `illegal solar year: 0` | FAIL: `illegal solar year: 0` | FAIL: `illegal solar year: 0` | FAIL: `illegal solar year: 0` | FAIL: `illegal solar year: 0` | FAIL: `illegal solar year: 0` |
| 1 | PASS | PASS | PASS | PASS | PASS | FAIL: `illegal solar year: 0` while deriving service-style daily fields |
| 2 | PASS | PASS | PASS | PASS | PASS | PASS |
| 1900 | PASS | PASS | PASS | PASS | PASS | PASS |
| 2100 | PASS | PASS | PASS | PASS | PASS | PASS |
| 5000 | PASS | PASS | PASS | PASS | PASS | PASS |

## Required Decision

Choose one before executing Phase 3 route expansion:

1. Add or build an alternate calendar algorithm for years `0` and `1`, then keep the product promise of `0-5000`.
2. Correct the supported legal dynamic route range to `2-5000`.
3. Keep route acceptance for years `0` and `1` but render non-indexable unsupported states, which conflicts with the current decision that pages should be formally supported without a rough-estimate disclaimer.

## Execution Impact

Per `03-01-PLAN.md`, execution stops before Task 2 and before Plans `03-02` through `03-06`. The typed content matrix, jieri pages, zodiac pages, tools, Feng Shui pages, and sitemap should not be expanded until this blocker is resolved.
