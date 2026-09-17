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

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #37 remains the latest fully closed gameplay pattern on verified `main` `b1793adaabe19a9c73e021534899f8b50c4097f6`; CI #741 passed including exact Cloudflare smoke.

Production visual checkpoint is now live-closed:

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = BLOCKING / LIVE VERIFIED
VUI-01 Parent Report = CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery = CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account = CLOSED / LIVE VERIFIED
VBASE-P1-01 residual token closure = CLOSED / LIVE VERIFIED
Pattern #38 = UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT
```

Final P1 evidence:
- PR #162 final head `38b9eb7920d1e6796384b889f928dfcbf4d7e629`;
- merge/main SHA `2d3f95066e1106c43c76bf91dd29bf5707dca52c`;
- independent main CI #788 / run `35168877485` full success;
- exact Cloudflare release/public smoke success;
- accepted visual artifact `10464427013`, digest `sha256:83c8181998c78da4faf1841b17a42b5874c14c00f6e557a736e946575a87e292`;
- permanent matrix: 21 routes × 3 viewports = 63 exact-path screenshots.

Pattern #38 is **not pre-approved for implementation**. The next task is a fresh objective/evidence audit against the current catalog, distribution and mastery boundaries.

## Closure/evidence records

- [`VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md`](VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md)
- [`VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`](VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md) — pre-merge candidate evidence.
- [`VBASE_P1_01_LIVE_CLOSURE_2026-09-17.md`](VBASE_P1_01_LIVE_CLOSURE_2026-09-17.md) — final merged-main/Cloudflare live closure evidence.

Historical closure records must not be rewritten to pretend later QA expansions existed at their original checkpoint.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

Examples include:
- `AUDIT_2026-09-11_LOCAL_AND_GITHUB.md`
- `LOCAL_REDESIGN_2026-09-11.md`
- `FRONTEND_REDESIGN_SYSTEM_2026-09-12.md`
- `GARDEN_REDESIGN_VALIDATION_2026-09-13.md`
- `ACTIVITY_GALLERY_AND_VARIETY_2026-09-13.md`
- dated batch/acceptance reports

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must:
- update the affected canonical docs;
- update the workstream status;
- record QA/results/remaining work in the execution log or active audit;
- avoid claiming deployment, approval or expert review without evidence;
- keep `MAINLAGI_ART_BIBLE.md` aligned with implemented visual reality when changing product surfaces.

**Code merged without related documentation updates is not complete.**
