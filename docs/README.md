# Mainlagi Hub Documentation Index

Last reviewed: **17 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit and current P0/P1/P2 state.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction.
5. [`MOBILE_ROUTE_QA.md`](MOBILE_ROUTE_QA.md) — blocking browser route and permanent visual QA contract.
6. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
7. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — current child/product/UX/activity rules.
8. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — current evidence/mastery/progression contract.
9. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
10. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
11. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

## Current execution checkpoint

Pattern #37 remains the latest fully closed gameplay pattern.

The production visual checkpoint is now:

```text
P0 = 0
P1 = 0
P2 = 3
VQA-01 = CLOSED / LIVE VERIFIED
VUI-01 Parent Report = CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery = CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account = CLOSED / LIVE VERIFIED
VBASE-P1-01 residual visual-token fragmentation = CLOSED / LIVE VERIFIED
Pattern #38 = READY FOR FRESH OBJECTIVE/EVIDENCE AUDIT
```

Final P1 closure evidence:
- PR #162;
- merge `2d3f95066e1106c43c76bf91dd29bf5707dca52c`;
- independent main CI **#788 / run `35168877485` — full success**;
- exact Cloudflare release smoke success;
- permanent visual QA strengthened to **21 routes × 3 viewports = 63 exact-path screenshots**.

Pattern #38 is no longer blocked by P1, but it is **not pre-approved for implementation**. The next step is a fresh learning-objective/evidence audit.

## Closure/evidence records

- [`VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md`](VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md)
- [`VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`](VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md) — complete PR #162 evidence chain, now updated with live-production closure.

Historical closure records preserve the truth of their checkpoint and must not be rewritten to pretend later QA expansions existed earlier.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

Examples include:
- `AUDIT_2026-09-11_LOCAL_AND_GITHUB.md`
- `LOCAL_REDESIGN_2026-09-11.md`
- `FRONTEND_REDESIGN_SYSTEM_2026-09-12.md`
- `GARDEN_REDESIGN_VALIDATION_2026-09-13.md`
- `ACTIVITY_GALLERY_AND_VARIETY_2026-09-13.md`
- dated batch/acceptance reports

If a historical document conflicts with current code or a canonical current document, use current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must:
- update affected canonical docs;
- update workstream status;
- record QA/results/remaining work;
- avoid claiming deployment, approval or expert review without evidence;
- keep `MAINLAGI_ART_BIBLE.md` aligned with implemented visual reality when changing product surfaces.

**Code merged without related documentation updates is not complete.**