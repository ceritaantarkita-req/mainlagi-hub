# Mainlagi Hub Documentation Index

Last reviewed: **16 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit, P0/P1/P2 findings and remediation order.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction for child, parent, public/auth/account and game-shell convergence.
5. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
6. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — current child/product/UX/activity rules.
7. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — current evidence/mastery/progression contract.
8. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
9. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
10. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #37 is fully closed on final verified `main` `b1793adaabe19a9c73e021534899f8b50c4097f6`; final CI #741 / run `35103399012` passed including exact Cloudflare production smoke.

The active gate before Pattern #38 is the **production visual/product baseline**:
- P0 = 0;
- P1 = 5;
- Garden representative activities are the accepted child-facing anchor;
- permanent visual QA and P1 remediation are required before WS-05 continues.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

Examples include:

- `AUDIT_2026-09-11_LOCAL_AND_GITHUB.md`
- `LOCAL_REDESIGN_2026-09-11.md`
- `FRONTEND_REDESIGN_SYSTEM_2026-09-12.md`
- `GARDEN_REDESIGN_VALIDATION_2026-09-13.md`
- `ACTIVITY_GALLERY_AND_VARIETY_2026-09-13.md`
- dated batch/acceptance reports

These files may intentionally contain statements such as “not merged”, “local only”, old SHAs or old catalog snapshots. Do not rewrite history to make those statements look current.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must:

- update the affected canonical docs;
- update the workstream status;
- record QA/results/remaining work in the execution log or active audit;
- avoid claiming deployment, approval or expert review without evidence;
- keep `MAINLAGI_ART_BIBLE.md` aligned with implemented visual reality when changing product surfaces.

**Code merged without related documentation updates is not complete.**