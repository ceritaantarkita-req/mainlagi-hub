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

Pattern #38 `cloze_sentence_choice` is the latest live-verified gameplay implementation on `main` `76a2d87dca3689ed8206f5ce0556760dabe903b6`; CI #801 / run `35179596668` passed the full matrix including exact Cloudflare release/public smoke.

Its exact scope is five Bahasa context-completion activities. Merged-main gameplay distribution is now **900/900 classified, 38 active patterns, 0 unclassified**, with `choice_grid` 272/900 (30.22%) and `cloze_sentence_choice` 5/900 (0.56%).

Pattern #38 is currently in its separate docs-only closure gate. After that closure is merged and independently production-verified, the next gameplay step is a fresh Pattern #39 objective/evidence audit with no mechanic pre-approved.

The production visual P1 checkpoint remains closed:

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
Pattern #38 implementation = MERGED / LIVE VERIFIED
Pattern #38 docs closure = IN PROGRESS
```

Pattern #38 verified implementation chain:

- objective/evidence audit PR #165;
- implementation PR #166 head `7bfb58d93c5c61200dc6a91c5fd5243c1369c3bd`;
- PR CI #795 / run `35176307842` — full success;
- squash merge `76a2d87dca3689ed8206f5ce0556760dabe903b6`;
- independent main CI #801 / run `35179596668` — full success;
- exact Cloudflare release/public smoke — success;
- responsive QA at 320x720, 390x844 and 768x1024 across idle/wrong/success;
- PR screenshot artifact `10478269865`, digest `sha256:92c561e8afd029cc618a966e1686a5e601cbc72580c387c608f73bafc814246b`;
- merged-main gameplay-distribution artifact `10479619607`, digest `sha256:2bc2b1734091a6de2c71c6545d3e07a27cab02c685c537cf002ac9a8a3092381`.

Duplicate draft PR #167 was closed as superseded after failing its gameplay-presentation regression; it is not part of the canonical chain.

## Closure/evidence records

- [`PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — historical pre-implementation Pattern #38 audit and exact-scope justification.
- [`PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md`](PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md) — Pattern #38 implementation/main/QA evidence and docs-closure gate.
- [`VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md`](VUI02_STAGE_GALLERY_CLOSURE_2026-09-16.md)
- [`VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md`](VUI03_PUBLIC_AUTH_ACCOUNT_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CANDIDATE_2026-09-17.md) — historical candidate/PR acceptance record.
- [`VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md) — final merge/main/Cloudflare production closure evidence.

These records preserve exact implementation/CI/merge evidence while the canonical docs stay concise. Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

The closed P1 checkpoint and live Pattern #38 implementation do not imply all work is done.

Still open:

- Pattern #38 docs closure exact-head CI/merge/final main verification;
- subsequent Pattern #39 objective/evidence audit;
- P2 game detail/preflight vocabulary convergence;
- P2 canonical semantic icon convergence;
- P2 inline-style drift cleanup;
- WS-02 narration;
- WS-10 real-device/accessibility/human acceptance;
- Iqro expert review;
- WS-11 governance;
- later WS-12 cleanup;
- WS-05 continuation toward 50–60 meaningful patterns.

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