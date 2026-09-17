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

Merged-main gameplay distribution remains **900/900 classified, 39 active patterns, 0 unclassified**, with `choice_grid` 267/900 and `visual_word_problem` 5/900.

Pattern #40 is now in its fresh objective/evidence audit gate in PR #173. The audit selects `spatial_relation_board` as a candidate for exactly six `logic-spatial-*` activities in `logic-spatial-relations`. This is **audit-only**: no Pattern #40 runtime is implemented or live yet, and merged pattern count remains 39.

The production visual P1 checkpoint remains closed:

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = AUDIT OPEN / IMPLEMENTATION NOT STARTED
```

## Pattern #39 verified closure chain

- objective/evidence audit PR #169;
- implementation PR #170 head `df503b95abf86e2b530dd9ff18bd5d8b9707e2db`;
- implementation squash merge/main `bcb8479514f44d46ebc68917981699240aabc3b2`;
- independent implementation main CI #809 / run `35187506724` — full success including exact Cloudflare release/public smoke;
- closure PR #171;
- final closure main `98725727c866d410b2d0caa206e86e70cd0e5741`;
- final closure CI #811 / run `35190499794` — success.

## Pattern #40 audit checkpoint

Current audit candidate:

```text
pattern:     spatial_relation_board
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
contract:    choice_accuracy_v1
status:      AUDIT OPEN / IMPLEMENTATION NOT STARTED
```

Exact audited activity scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

If PR #173 is accepted, implementation must start on a separate branch from the resulting latest `main`; it must not broaden scope or alter canonical prompts/choices/answers, mastery/progression, schema or database semantics.

## Closure/evidence records

- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — active docs-only Pattern #40 audit and exact candidate justification.
- [`PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — historical pre-implementation Pattern #39 audit and exact-scope justification.
- [`WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`](WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md) — Pattern #39 implementation/QA record.
- [`PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`](PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md) — Pattern #39 implementation/main/QA and closure evidence.
- [`PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN38_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md`](PATTERN38_CLOZE_SENTENCE_CHOICE_CLOSURE_2026-09-17.md)
- [`VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md`](VBASE_P1_01_VISUAL_TOKEN_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Still open:

- complete/merge Pattern #40 objective/evidence audit PR #173;
- if accepted, implement Pattern #40 exact six-activity scope on a separate branch;
- independently verify 900/900 classification, 40 active patterns and live production before implementation closure;
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

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
