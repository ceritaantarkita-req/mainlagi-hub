# Mainlagi Hub Documentation Index

Last reviewed: **17 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit and P0/P1/P2 state.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction for child, parent, public/auth/account and system/game-shell convergence.
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

The production visual P1 checkpoint is now closed:

```text
P0 = 0
P1 = 0
P2 = 3
VQA-01 = CLOSED / LIVE VERIFIED
VUI-01 Parent Report = CLOSED / LIVE VERIFIED
VUI-02 Stage/Gallery = CLOSED / LIVE VERIFIED
VUI-03 Public/Auth/Account = CLOSED / LIVE VERIFIED
VBASE-P1-01 residual visual-token fragmentation = CLOSED / LIVE VERIFIED
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = UNBLOCKED FOR FRESH OBJECTIVE/EVIDENCE AUDIT ONLY
```

Final P1 closure:

- PR #162;
- final candidate-doc head `38b9eb7920d1e6796384b889f928dfcbf4d7e629`;
- PR CI #787 / run `35138385672` — full success;
- squash merge `2d3f95066e1106c43c76bf91dd29bf5707dca52c`;
- independent main CI #788 / run `35168877485` — full success;
- exact Cloudflare release/public smoke — success;
- merged-main visual artifact `10476008006`;
- artifact digest `sha256:6fe0aa3de9bfadfc8e40229948edaca1cf633b33705a429515779b78f077266c`.

The permanent production baseline now captures **63 / 63 exact-path screenshots across 21 canonical routes and 3 canonical viewports**.

Pattern #38 has **not** been selected or implemented. The next WS-05 step is a fresh objective/evidence audit with no gameplay family pre-approved. The merged pattern count remains 37.

## Closure/evidence records

- [`VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md`](VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md)
- [`VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`](VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md) — historical candidate/PR acceptance record.
- [`VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md) — final merge/main/Cloudflare production closure evidence.

These records preserve exact implementation/CI/merge evidence while the canonical docs stay concise. Historical closure/candidate records must not be rewritten to pretend later QA expansions existed at their original checkpoint.

## Remaining product-quality work

The closed P1 checkpoint does not imply all work is done.

Still open:

- P2 game detail/preflight vocabulary convergence;
- P2 canonical semantic icon convergence;
- P2 inline-style drift cleanup;
- WS-02 narration;
- WS-10 real-device/accessibility/human acceptance;
- Iqro expert review;
- WS-11 governance;
- later WS-12 cleanup;
- WS-05 continuation toward 50–60 meaningful patterns after fresh Pattern #38 audit.

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