# WS-05 Pattern #40 — Spatial Relation Board Implementation Wave — 17 September 2026

Status: **IMPLEMENTATION IN PROGRESS / BASE RUNTIME GREEN / DISTRIBUTION + BROWSER QA PENDING**

Canonical audit: PR #173  
Audit merge/main: `f1b4b13d3d9814d2ed06500022218848cd721419`  
Implementation PR: #175 (draft)  
Latest verified implementation head before distribution registration: `1889e1b5ea954be3cab6978e1f82a680b8281ca8`  
CI: #821 / run `35213178491` — full success

## Exact audited scope

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical ownership remains:

```text
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

## Implemented so far

- exact-scoped `spatialRelationBoardConfig` for the six audited activity IDs;
- deterministic visual relation models for left/right, between, turn-right, turn-left and opposite-direction tasks;
- dedicated child-facing `SpatialRelationBoardActivity`;
- route dispatch to the dedicated activity only when the exact-scope classifier accepts the activity;
- direct button-based keyboard/touch/pointer answers remain the assessed input;
- wrong answers remain retryable and measured and cannot complete;
- correct answer completes through the existing canonical measured activity path;
- runtime metadata identifies `spatial-relation-board-runtime` and `choice_spatial_relation_board_interaction`;
- mastery, progression, schema, database and canonical content are unchanged;
- learning-test TypeScript compilation includes the new config.

## Verification already obtained

Implementation head `1889e1b5ea954be3cab6978e1f82a680b8281ca8` passed CI #821 / run `35213178491` in full. This proves the current runtime foundation does not break the existing repository quality matrix, but does **not** yet make Pattern #40 complete.

## Remaining blocking work

1. register `spatial_relation_board` in the canonical gameplay-pattern taxonomy and distribution audit;
2. prove exactly six activities classify into Pattern #40 and unrelated activities fail closed;
3. prove canonical prompts, choices/order and `correctChoice` remain unchanged;
4. prove assessed evidence/retry/completion metadata semantics;
5. add browser QA for idle, wrong and success states, keyboard interaction and responsive layouts at 320x720, 390x844 and 768x1024;
6. confirm no horizontal overflow or hidden controls;
7. run the permanent visual QA matrix;
8. prove gameplay distribution remains 900/900 classified and becomes exactly 40 active child-facing patterns;
9. run a fresh exact-head full CI after all implementation/test/docs changes;
10. only then mark PR #175 ready, pass clean review/merge gates, squash-merge exact head and independently verify merged `main` including production smoke;
11. perform a separate post-merge closure docs gate before calling Pattern #40 **FULLY CLOSED**.

## Non-negotiable boundaries

- no scope expansion beyond the six audited IDs;
- no heuristic arbitrary-prompt classification;
- no canonical prompt, choice or answer rewrite;
- no new assessed checkpoint;
- no drag-only interaction;
- no mastery/progression/schema/database rewrite;
- no claim of 40 merged patterns until the distribution audit and merged-main verification prove it.
