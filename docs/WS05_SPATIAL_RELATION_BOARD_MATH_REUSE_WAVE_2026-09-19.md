# WS-05 Math Spatial Relation Board Reuse Wave — 19 September 2026

Status: **IMPLEMENTATION ACTIVE / PR NOT OPENED YET**

## Authorized base

```text
canonical main: db49f059b557f1109dceb6f4b5ad397d8641d6af
reuse audit:    PR #209 -> main 3e30a817ef86fa691f9b2f1249ac00bc00dce4e6
audit main CI:  #971 / run 35377783814 — full success + exact Cloudflare smoke
reuse-chain closure: PR #213 -> main db49f059b557f1109dceb6f4b5ad397d8641d6af
```

The live-verification chain is closed. Runtime implementation is authorized.

## Exact scope

Legacy Logic Pattern #40 activities preserved:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

New Math reuse scope:

```text
math-spatial-above
math-spatial-left
math-spatial-inside
math-spatial-near
math-spatial-between
```

Total intended `spatial_relation_board` scope after implementation: **11 activities**.

## Runtime changes

- generalized `spatialRelationBoardConfig` from Logic-only stage validation to exact per-ID subject/stage validation;
- preserved exact prompt, choice order, correct answer and runtime checks;
- added explicit Math scene kinds:
  - `above` / object relation;
  - `left_of` / object relation;
  - `inside` / containment;
  - `near` / proximity;
  - `between` / object relation with distinct left/right anchors;
- preserved existing turn/opposite behavior for Logic;
- no prompt parser or keyword classifier;
- no catalog/content/mastery/progression/schema migration.

## Evidence contract

All five Math activities remain:

```text
subject:     math
stage:       math-ukur-ruang
lesson:      math-spatial-position
pack:        math.pack.spatial-position
skill:       math.spatial.position
runtime:     tap_choice
assessment:  assessed
evidence:    choice_accuracy_v1
```

Runtime metadata remains:

```text
source: spatial-relation-board-runtime
evidenceFidelity: choice_spatial_relation_interaction
mode
relationOrTurn
selectedChoice
```

## Regression coverage

Updated `run-spatial-relation-board-tests.mjs` now requires:
- exactly 11 classified activities;
- six legacy Logic + five Math IDs only;
- exact canonical subject/stage/prompt/choices/order/correct answer;
- canonical authoring and manifest ownership;
- exact `choice_accuracy_v1`;
- fail-closed drift checks for Logic and Math representatives;
- unrelated Math/Logic/Science activities remain outside the family.

Pattern #47 sentinel is updated so `math-spatial-above` now intentionally classifies as `spatial_relation_board`.

## Browser QA

New dedicated Math browser QA:

```text
scripts/run-spatial-relation-board-reuse-browser-tests.mjs
representative route: /child/demo-gian/activity/math-spatial-near
viewports:
- 320x720
- 390x844
- 768x1024
```

It verifies:
- legitimate prior Math progression;
- canonical proximity scene;
- exact canonical choices/order;
- no horizontal overflow;
- minimum touch target;
- keyboard wrong/retry path;
- actual-touch correct completion;
- assessed attempt evidence;
- incorrect=1 / retry=1 / accuracy=0.5;
- idle/wrong/success screenshots;
- feedback and CTA visibility;
- no page/console errors.

Legacy Logic browser QA remains in CI unchanged.

## Expected branch distribution

If implementation passes:

```text
classified:               900 / 900
unclassified:               0
active patterns:           47
choice_grid               223 / 900
spatial_relation_board     11 / 900
set_reasoning              10 / 900
```

Pattern count remains 47. This is reuse, not Pattern #48.

## Merge gates

Before merge:
1. exact-head full CI green;
2. distribution exactly 900/900, 47 active, `choice_grid` 223, `spatial_relation_board` 11;
3. activity quality KEEP 900 / no structural findings;
4. legacy Logic regression green;
5. new Math keyboard + actual-touch browser QA green;
6. nine dedicated Math screenshots manually reviewed with P0=0/P1=0;
7. no unresolved review threads;
8. exact-head squash merge only.

After merge:
1. merged-main CI full success;
2. exact-SHA Cloudflare smoke;
3. merged-main distribution independently confirms 47/223/11;
4. docs-only post-merge closure before Math measurement runtime begins.
