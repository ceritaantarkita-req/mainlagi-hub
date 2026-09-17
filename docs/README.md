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

Pattern #39 `visual_word_problem` is **FULLY CLOSED**. Its implementation merged at `bcb8479514f44d46ebc68917981699240aabc3b2` with CI #809 / run `35187506724`; docs closure PR #171 merged as main `98725727c866d410b2d0caa206e86e70cd0e5741`, and final CI #811 / run `35190499794` succeeded.

Pattern #40 objective/evidence audit PR #173 is **MERGED** to main `f1b4b13d3d9814d2ed06500022218848cd721419`. The accepted exact candidate is `spatial_relation_board` for six `logic-spatial-*` activities in `logic-spatial-relations`.

Pattern #40 implementation is now isolated in **draft PR #175**. The runtime/config foundation already passed CI #821 at head `1889e1b5ea954be3cab6978e1f82a680b8281ca8`; classifier/distribution registration, exact-scope regression, dedicated browser QA, answer-leakage hardening, mobile composition hardening and implementation-wave docs have since been added and require a fresh exact-head CI before merge.

Merged-main gameplay distribution is still the last verified production baseline: **900/900 classified, 39 active patterns, 0 unclassified**, with `choice_grid` 267/900 and `visual_word_problem` 5/900. Pattern #40 must not be counted as merged until exact-head branch QA and independent merged-main verification prove it.

The production visual P1 checkpoint remains closed:

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 audit = MERGED
Pattern #40 implementation = IN PROGRESS / NOT MERGED
```

## Pattern #40 implementation checkpoint

Canonical contract:

```text
pattern:     spatial_relation_board
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
contract:    choice_accuracy_v1
status:      IMPLEMENTATION IN PROGRESS / DRAFT PR #175
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
- no mastery/progression/schema/database rewrite;
- no claim of 40 merged patterns until branch distribution and independent merged-main verification prove it.

## Pattern #39 verified closure chain

- objective/evidence audit PR #169;
- implementation PR #170 head `df503b95abf86e2b530dd9ff18bd5d8b9707e2db`;
- implementation squash merge/main `bcb8479514f44d46ebc68917981699240aabc3b2`;
- independent implementation main CI #809 / run `35187506724` — full success including exact Cloudflare release/public smoke;
- closure PR #171;
- final closure main `98725727c866d410b2d0caa206e86e70cd0e5741`;
- final closure CI #811 / run `35190499794` — success.

## Closure/evidence records

- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — merged Pattern #40 objective/evidence audit and exact-scope justification.
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md) — active Pattern #40 implementation/QA record.
- [`PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — historical pre-implementation Pattern #39 audit and exact-scope justification.
- [`WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`](WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md) — Pattern #39 implementation/QA record.
- [`PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`](PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md) — Pattern #39 implementation/main/QA and closure evidence.
- [`PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md`](PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate Pattern #40 work:

- pass a fresh exact-head CI containing the final classifier/distribution/regression/browser/mobile/docs state;
- prove branch distribution is 900/900 classified with exactly 40 active patterns;
- keep activity-quality and permanent visual QA green;
- pass Windows, Ubuntu, production build and mobile Chromium matrices;
- clear mergeability/review/thread gates, then squash-merge only the exact verified head;
- independently verify merged `main` and production smoke;
- run a separate post-merge Pattern #40 closure-docs gate before **FULLY CLOSED** status.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
