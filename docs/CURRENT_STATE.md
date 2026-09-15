# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest merged gameplay implementation: PR #133 — Logic Spatial Transform
- verified implementation merge SHA: `f3f00b86537af8d0862a15113778458a777358ca`
- post-merge closure: PR #134
- Pattern #27: **FULLY CLOSED**
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged on `main`: 27 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    27
choice_grid               322 / 900 = 35.78%
spatial_transform           5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           52 / 100
```

Remaining distance: **23** patterns to minimum 50 and **33** to working target 60.

## Pattern #27 `spatial_transform` — FULLY CLOSED

Exact scope:

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

All five remain assessed `tap_choice` activities in stage `logic-mixed-reasoning-challenge`, lesson `logic-spatial-transform`, pack `logic.pack.spatial-transform`, canonical skill `logic.spatial.transform.basic`, with exactly three canonical choices and unchanged `correctChoice`.

Interaction/evidence contract:
- visible canonical starting direction and transform operation;
- result hidden as `?` before assessment;
- keyboard/touch/pointer direct selection;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no answer leakage, extra confirmation, drag-only dependency, invented intermediate assessment, or Wave B spatial-relation bundling;
- assessed fidelity `choice_spatial_transform_interaction`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain unchanged.

Acceptance/closure history:
- implementation head `267f00d243dc1778c2d86e5a0ca70d8cfe76872a` passed CI #597 / run `34976080767` plus manual screenshot acceptance at 320x720, 390x844 and 768x1024;
- final implementation/docs head `c10294b1a69afd50b2458fee305ef59b321274e1` passed CI #602;
- PR #133 clean gate -> exact-head squash merge `f3f00b86537af8d0862a15113778458a777358ca`, independently verified live;
- closure PR #134 is the final docs-only closure for that verified merged state.

Deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Five simulations remain zero invariant errors; Batch17 totals remain unchanged.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:
- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Finish closure PR #134 exact-head CI/gate/merge/live verification.
2. Run a fresh objective/evidence audit for Pattern #28; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
