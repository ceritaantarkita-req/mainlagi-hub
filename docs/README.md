# Mainlagi Hub Documentation Index

Last reviewed: **17 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit, P0/P1/P2 findings and remediation order.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction for child, parent, public/auth/account and system/game-shell convergence.
5. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
6. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — current child/product/UX/activity rules.
7. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — current evidence/mastery/progression contract.
8. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
9. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
10. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #37 remains the latest fully closed gameplay pattern on verified `main` `b1793adaabe19a9c73e021534899f8b50c4097f6`; CI #741 passed including exact Cloudflare smoke.

The active gate before Pattern #38 remains the **production visual/product baseline**, but the P1 backlog has been reduced materially:

```text
P0 = 0
P1 = 1
P2 = 3
VQA-01 = CLOSED / LIVE VERIFIED
VUI-01 Parent Report = CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery = CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account = CLOSED / LIVE VERIFIED
Pattern #38 = BLOCKED until P1=0
```

VUI-03 closure:
- PR #160;
- merge `415008a4a0503da98937ee8df0a1e5feb1a08c62`;
- independent main CI #776 / run `35124809180` full success;
- exact Cloudflare release smoke success.

Detailed closure record: [`VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`](VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md).

The sole remaining P1 is **VBASE-P1-01 residual visual-token fragmentation**. The next wave must be targeted and evidence-first; do not mass-rewrite `globals.css`.

## Closure/evidence records

- [`VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md`](VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md)
- [`VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`](VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md)

These records preserve exact implementation/CI/merge evidence while the canonical docs stay concise.

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