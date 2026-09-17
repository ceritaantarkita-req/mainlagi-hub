# Mainlagi Hub Documentation Index

Last reviewed: **18 September 2026**

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

Pattern #41 `phrase_scene_match` remains **FULLY CLOSED / LIVE VERIFIED**.

Pattern #42 audit is now merged and independently production-verified:

```text
Audit PR:          #186
Audit main:        541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:     #871 / run 35255083348 — full success + exact Cloudflare production smoke
Implementation PR: #187 — IN PROGRESS / NOT MERGED
```

Verified merged gameplay distribution remains **900/900 classified, 41 active patterns, 0 unclassified**, with `choice_grid` 257/900. Pattern #42 implementation targets 42 patterns but is not merged production truth yet.

```text
P0 = 0
P1 = 0
P2 = 3
Permanent visual QA = 21 routes / 63 captures / BLOCKING
Pattern #38 = FULLY CLOSED
Pattern #39 = FULLY CLOSED
Pattern #40 = FULLY CLOSED
Pattern #41 = FULLY CLOSED / LIVE VERIFIED
Pattern #42 = AUDIT LIVE VERIFIED / IMPLEMENTATION IN PROGRESS
```

## Pattern #42 implementation checkpoint

```text
pattern:     growth_stage_transition
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
PR:          #187
status:      IMPLEMENTATION IN PROGRESS / NOT MERGED
```

Exact scope:

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Implementation currently provides:

- exact three-ID fail-closed deterministic config;
- explicit previous-stage / next-adult-stage / next-young-stage modes;
- child-facing known-stage -> hidden-target transition board;
- target hidden until the canonical correct answer succeeds;
- byte-preserved prompts, choice labels/order, answer payload and `correctChoice`;
- retryable wrong state that cannot complete;
- existing assessed `choice_accuracy_v1` semantics plus presentation metadata;
- keyboard/touch/pointer native answer controls;
- exact-scope authoring/manifest/evidence regression;
- 320x720, 390x844 and 768x1024 browser idle/wrong/success QA;
- permanent test and gameplay-distribution wiring.

Important exclusions remain:

- `science-cycle-butterfly` remains a complete ordered lifecycle sequence;
- `science-match-young-adult-b` remains canonical matching;
- existing water-state `cause_effect`, Logic `relative_order_track`, sequence and unrelated gameplay scopes remain unchanged.

Implementation-branch blocking distribution target:

```text
900 / 900 classified
0 unclassified
42 active patterns
choice_grid                     254 / 900
growth_stage_transition           3 / 900
```

These 42-pattern numbers become merged truth only after PR #187 merges and resulting `main` passes independent CI + exact Cloudflare smoke.

## Current evidence records

- [`PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN42_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — merged/live-verified Pattern #42 objective/evidence audit.
- [`WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md`](WS05_GROWTH_STAGE_TRANSITION_WAVE_2026-09-18.md) — Pattern #42 implementation/QA wave record for PR #187.
- [`PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN41_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md) — Pattern #41 objective/evidence audit.
- [`WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md`](WS05_PHRASE_SCENE_MATCH_WAVE_2026-09-17.md) — Pattern #41 implementation/QA wave record.
- [`PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md`](PATTERN41_PHRASE_SCENE_MATCH_CLOSURE_2026-09-17.md) — Pattern #41 closure gate record.
- [`PATTERN41_FINAL_CLOSURE_VERIFICATION_2026-09-17.md`](PATTERN41_FINAL_CLOSURE_VERIFICATION_2026-09-17.md) — final Pattern #41 merged-main truth.
- [`PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`](PATTERN40_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md)
- [`WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`](WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md)

Historical closure/candidate/audit records must not be rewritten to pretend later QA or implementation state existed at their original checkpoint.

## Remaining product-quality work

Immediate WS-05 gate is exact-head PR #187 verification: regression, distribution, Ubuntu/Windows, responsive browser evidence, permanent visual QA, build/security/dependency, clean review/mergeability, then exact-head merge and independent merged-main Cloudflare smoke. Pattern #42 closure docs remain required after that before Pattern #43 begins.

Other open work remains P2 game-shell/icon/inline-style convergence, WS-02 narration, WS-10 real-device/accessibility/human/Iqro acceptance, WS-11 governance, later WS-12 cleanup, and continued WS-05 progression toward 50–60 meaningful patterns.

## Historical snapshot documents

Dated audit/redesign/validation documents record what was true at the time they were written. They are evidence/history, **not the current product baseline**, unless explicitly promoted above as an active canonical audit.

If a historical document conflicts with current code or a canonical current document, use the current code/current canonical docs and record the reconciliation in `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Mandatory documentation rule

Every developer/AI agent completing product-quality work must update affected canonical docs, workstream status, QA/results/remaining work, avoid unsupported deployment/approval claims, and keep visual documentation aligned with implemented reality.

**Code merged without related documentation updates is not complete.**
