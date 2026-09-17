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

Pattern #40 `spatial_relation_board` remains **FULLY CLOSED / LIVE VERIFIED**.

Pattern #41 objective/evidence audit is now **MERGED + VERIFIED**:

```text
Audit PR:             #179
Audit main:           917e933b2d69db3d014b98f3aa49bb6962aec992
Audit merged-main CI: #860 / run 35223876877 — full success + exact Cloudflare smoke
```

Pattern #41 `phrase_scene_match` implementation is **IN PROGRESS** on `agent/p41-phrase-scene-match-20260917`. It is not yet merged and must not yet be counted as production Pattern #41.

Verified merged gameplay distribution therefore remains **900/900 classified, 40 active patterns, 0 unclassified**, with `choice_grid` 261/900 and `spatial_relation_board` 6/900.

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
Pattern #41 = AUDIT MERGED + VERIFIED / IMPLEMENTATION IN PROGRESS
```

## Pattern #41 implementation checkpoint

Canonical contract:

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
status:      IMPLEMENTATION IN PROGRESS / NOT MERGED
```

Exact scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Active implementation boundaries:

- exact-ID deterministic scene config only; no arbitrary English phrase parser;
- all twelve canonical choice scenes are explicit;
- canonical prompt, choice labels/order, answer payload and `correctChoice` unchanged;
- color, quantity, size and noun composition represented visually;
- wrong answers remain measured/retryable and cannot complete;
- correct completion keeps `choice_accuracy_v1` semantics;
- direct keyboard/touch/pointer answer controls remain primary;
- `english-listen-phrase-blue-book` and `english-complete-*` remain outside;
- no translation checkpoint, speech scoring, drag-only requirement, mastery/progression/schema/database rewrite;
- responsive browser QA covers 320x720, 390x844 and 768x1024;
- implementation target distribution is 900/900 classified, 41 patterns, `choice_grid` 257/900, `phrase_scene_match` 4/900;
- none of those implementation targets become merged-main claims until exact-head CI, merge and merged-main verification pass.

## Closure/evidence records

- [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — merged Pattern #41 objective/evidence audit.
- [`WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md`](WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md) — active Pattern #41 implementation/QA wave record.
- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — Pattern #40 objective/evidence audit.
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md) — Pattern #40 implementation/QA record.
- [`PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`](PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md) — Pattern #40 exact-head acceptance evidence.
- [`PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`](PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md) — Pattern #40 closure evidence.
- [`PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md`](WS05_VISUAL_WORD_PROBLEM_WAVE_2026-09-17.md)
- [`PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md`](PATTERN39_VISUAL_WORD_PROBLEM_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 work is to finish the Pattern #41 implementation branch, open one implementation PR, pass exact-head full CI/permanent visual QA, merge only the verified head, independently verify resulting `main`, and then run the separate closure-docs gate.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
