# Mainlagi Hub Documentation Index

Last reviewed: **17 September 2026**

Use this file to decide which documentation is current and which files are historical snapshots.

## Canonical current documents

Read these first for current work:

1. [`NEXT_PRODUCT_QUALITY_PLAN.md`](NEXT_PRODUCT_QUALITY_PLAN.md) — current execution order, workstreams, status and mandatory gates.
2. [`CURRENT_STATE.md`](CURRENT_STATE.md) — current repository/product/production baseline.
3. [`PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md`](PRODUCTION_VISUAL_PRODUCT_BASELINE_2026-09-16.md) — active production visual/product audit and P0/P1/P2 state.
4. [`MAINLAGI_ART_BIBLE.md`](MAINLAGI_ART_BIBLE.md) — canonical visual direction.
5. [`MOBILE_ROUTE_QA.md`](MOBILE_ROUTE_QA.md) — blocking browser route and permanent visual QA contract.
6. [`ARCHITECTURE.md`](ARCHITECTURE.md) — current technical boundaries and system architecture.
7. [`MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`](MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md) — child/product/UX/activity rules.
8. [`LEARNING_ATTEMPTS_MASTERY.md`](LEARNING_ATTEMPTS_MASTERY.md) — evidence/mastery/progression contract.
9. [`GAMEPLAY_VARIATION_CATALOG.md`](GAMEPLAY_VARIATION_CATALOG.md) — canonical gameplay-pattern catalog and WS-05 boundaries.
10. [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) — product principles and direction.
11. [`KNOWN_LIMITATIONS.md`](KNOWN_LIMITATIONS.md) — current known limitations and external acceptance gaps.

Subsystem docs remain authoritative for their specific scope when they do not conflict with the canonical documents above.

## Current execution checkpoint

Pattern #40 `spatial_relation_board` is **FULLY CLOSED / LIVE VERIFIED**.

Canonical chain:

```text
Audit PR:                #173
Audit main:              f1b4b13d3d9814d2ed06500022218848cd721419
Implementation PR:       #175
Implementation main:     fd017b81137f03bb30eca19a2ceb71c734cb3ba9
Implementation main CI:  #848 / run 35217949039 — full success
Closure PR:              #176
Final closure main:      43d69c42ca456ab41011f1d198e021f2b0d53cae
Final closure CI:        #850 / run 35219083042 — full success
```

Verified gameplay distribution is now **900/900 classified, 40 active patterns, 0 unclassified**, with `choice_grid` 261/900 and `spatial_relation_board` 6/900.

The production visual P1 checkpoint remains closed:

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
```

## Pattern #40 closed contract

```text
pattern:     spatial_relation_board
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
contract:    choice_accuracy_v1
status:      FULLY CLOSED / LIVE VERIFIED
```

Exact activity scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Implementation boundaries remain strict:

- exact six-ID classification only;
- canonical prompts, choices/order and `correctChoice` unchanged;
- deterministic config, no heuristic prompt parsing;
- wrong answers remain measured/retryable and cannot complete;
- turn/opposite results remain hidden until successful completion;
- direct keyboard/touch/pointer answer controls remain primary;
- evidence metadata identifies `spatial-relation-board-runtime` and `choice_spatial_relation_interaction` without redefining `choice_accuracy_v1` correctness;
- no mastery/progression/schema/database rewrite.

## Closure/evidence records

- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — Pattern #40 objective/evidence audit and exact-scope justification.
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md) — Pattern #40 implementation/QA record.
- [`PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`](PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md) — exact-head implementation acceptance evidence.
- [`PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`](PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md) — final Pattern #40 closure evidence.
- [`PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`](WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md)
- [`PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`](PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 work is now a **fresh Pattern #41 objective/evidence audit**. No mechanic, subject or activity family is pre-approved. The audit may validly conclude that no justified candidate exists.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
