# Phase 03 Year Support Blocker

**Created:** 2026-05-17  
**Plan:** 03-01  
**Status:** Resolved by product scope correction to `2-5000`

## Summary

Phase 3 originally requested legal dynamic route support for years `0-5000`, presented as formally supported. The installed `tyme4ts` implementation does not support years `0` and `1` for the same almanac semantics used by the rest of the product.

On 2026-05-17, product scope was corrected to formal support for years `2-5000`. Years `0` and `1` are now explicitly outside the legal dynamic route range and remain as regression probes only.

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

Chosen resolution: correct the supported legal dynamic route range to `2-5000`.

## Execution Impact

Execution may resume after `src/lib/almanac/year-support.ts`, tests, and Phase 3 planning artifacts are updated to reject years `0` and `1` and accept years `2-5000`.
