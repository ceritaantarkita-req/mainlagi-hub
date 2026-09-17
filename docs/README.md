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

Pattern #41 `phrase_scene_match` implementation is now **MERGED + LIVE VERIFIED** but the separate closure-docs gate is still in progress.

```text
Audit PR:                #179
Audit main:              917e933b2d69db3d014b98f3aa49bb6962aec992
Audit main CI:           #860 / run 35223876877 — full success + exact Cloudflare smoke
Implementation PR:       #180
Verified PR head:        03886f191d089a37bbaf7c9d429d6d9a8020ec6d
Implementation PR CI:    #861 / run 35228880841 — full success
Implementation main:     f90a0d377fa7227b8857f6069a5e957c99eb0b11
Implementation main CI:  #862 / run 35229750381 — full success + exact Cloudflare smoke
```

Verified merged gameplay distribution is now **900/900 classified, 41 active patterns, 0 unclassified**, with `choice_grid` 257/900 and `phrase_scene_match` 4/900.

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
Pattern #41 = IMPLEMENTATION MERGED + LIVE VERIFIED / CLOSURE DOCS IN PROGRESS
```

## Pattern #41 verified contract

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
status:      IMPLEMENTATION MERGED + LIVE VERIFIED / CLOSURE DOCS IN PROGRESS
```

Exact scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Verified boundaries:

- exact-ID deterministic scene config only; no arbitrary English phrase parser;
- all twelve canonical choice scenes are explicit;
- canonical prompt, visible choice labels/order, submitted answer strings and `correctChoice` unchanged;
- color, quantity, size and noun composition represented visually;
- wrong answers remain measured/retryable and cannot complete;
- correct completion keeps `choice_accuracy_v1` semantics;
- metadata uses `phrase-scene-match-runtime` / `choice_phrase_scene_interaction`;
- direct keyboard/touch/pointer controls remain available;
- `english-listen-phrase-blue-book`, sentence completion and unrelated content remain outside;
- no translation checkpoint, speech scoring, drag-only requirement, mastery/progression/schema/database rewrite;
- responsive browser QA covers 320x720, 390x844 and 768x1024;
- permanent visual baseline remains green.

## Closure/evidence records

- [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — merged Pattern #41 objective/evidence audit.
- [`WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md`](WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md) — Pattern #41 implementation/QA wave record.
- [`PATTERN41_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`](PATTERN41_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md) — exact-head and merged-main Pattern #41 implementation acceptance evidence.
- [`PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md`](PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md) — active Pattern #41 closure evidence record.
- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md)
- [`PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md`](PATTERN40_IMPLEMENTATION_ACCEPTANCE_2026-09-17.md)
- [`PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md`](PATTERN40_SPATIAL_RELATION_BOARD_CLOSURE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 work is the Pattern #41 closure-docs gate: exact-head full CI, merge only the verified head, then independently verify resulting `main`. Only after that may Pattern #41 become **FULLY CLOSED** and Pattern #42 begin with a fresh objective/evidence audit.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
