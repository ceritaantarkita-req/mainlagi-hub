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

Pattern #40 `spatial_relation_board` is **FULLY CLOSED / LIVE VERIFIED**. Its implementation merged via PR #175 as `fd017b81137f03bb30eca19a2ceb71c734cb3ba9`, closure PR #176 merged as `43d69c42ca456ab41011f1d198e021f2b0d53cae`, and final closure CI #850 / run `35219083042` succeeded. Canonical truth reconciliation PR #177 then merged as `7c7f715a18a36e76fbf7483e5bc3e25d9ff8a32f`.

Verified gameplay distribution remains **900/900 classified, 40 active patterns, 0 unclassified**, with `choice_grid` 261/900 and `spatial_relation_board` 6/900.

Pattern #41 objective/evidence audit is **OPEN in PR #179**. The audit selects `phrase_scene_match` as an implementation candidate for exactly four assessed English simple-phrase choice activities. No Pattern #41 runtime is implemented or counted yet.

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
Pattern #41 = AUDIT OPEN / IMPLEMENTATION NOT STARTED
```

## Pattern #41 audit checkpoint

Canonical candidate contract:

```text
pattern:     phrase_scene_match
subject:     english
stage:       english-phrases-review
lesson:      english-simple-phrases
pack:        english.pack.simple-phrases
skill:       english.phrase.literal
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
status:      AUDIT CANDIDATE ONLY / PR #179
```

Exact candidate scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

The audit preserves these boundaries:

- canonical prompts, choice labels/order and `correctChoice` unchanged;
- direct `tap_choice` and `choice_accuracy_v1` evidence semantics unchanged;
- explicit deterministic scene config only; no arbitrary English phrase parser;
- `english-listen-phrase-blue-book` excluded because it is listening;
- `english-complete-*` excluded because sentence completion should reuse `cloze_sentence_choice` if separately approved;
- no translation step, speech scoring, drag-only requirement, mastery/progression/schema/database rewrite;
- implementation starts only after PR #179 passes exact-head CI and merges.

Full audit rationale and regression requirements: [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md).

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

Exact activity scope remains the six audited `logic-spatial-*` activities. Canonical prompt/choice/answer, mastery, progression, schema and database boundaries remain unchanged.

## Closure/evidence records

- [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — active Pattern #41 audit candidate; implementation not started.
- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — Pattern #40 objective/evidence audit.
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md) — Pattern #40 implementation/QA record.
- [`PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`](PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md) — Pattern #40 exact-head acceptance evidence.
- [`PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`](PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md) — Pattern #40 closure evidence.
- [`PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`](WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md)
- [`PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`](PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 gate is Pattern #41 audit PR #179. If its exact head passes the complete docs-only gate and merges, `phrase_scene_match` implementation begins from the resulting latest `main` on a separate branch and must pass exact-scope, evidence, keyboard/touch, responsive browser, distribution and permanent visual QA before any implementation claim.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
