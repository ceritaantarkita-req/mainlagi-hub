# WS-05 Pattern #40 — Spatial Relation Board Implementation Wave — 17 September 2026

Status: **IMPLEMENTATION IN PROGRESS / CLASSIFIER + REGRESSION + BROWSER QA WIRED / EXACT-HEAD CI PENDING**

Canonical audit: PR #173  
Audit merge/main: `f1b4b13d3d9814d2ed06500022218848cd721419`  
Implementation PR: #175 (draft)  
Verified foundation head: `1889e1b5ea954be3cab6978e1f82a680b8281ca8`  
Foundation CI: #821 / run `35213178491` — full success

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

## Implemented

- exact-scoped `spatialRelationBoardConfig` for the six audited IDs;
- fail-closed canonical snapshots for prompt, choice order and `correctChoice`;
- deterministic object-relation, turn and opposite-direction models;
- dedicated child-facing `SpatialRelationBoardActivity`;
- directional answer stays hidden before success and after wrong answers;
- direct keyboard/touch/pointer buttons remain the assessed input;
- wrong answers remain retryable/measured and cannot complete;
- correct answer completes through the existing canonical measured path;
- runtime metadata uses `source: spatial-relation-board-runtime`, `evidenceFidelity: choice_spatial_relation_interaction`, `mode`, `relationOrTurn`, and `selectedChoice`;
- mastery, progression, schema, database and canonical content remain unchanged;
- `canonicalGameplayPattern` registers `spatial_relation_board` ahead of the unchanged legacy classifier;
- permanent gameplay-distribution audit expects Pattern #40 and must prove 900/900 classified with 40 active patterns;
- exact-scope regression covers six-and-only-six classification, canonical content, skill evidence and malformed/non-scope fail-closed cases;
- browser QA is wired into the mobile matrix for 320x720, 390x844 and 768x1024 idle/wrong/success states;
- mobile composition keeps short symbolic answers in three columns and compacts the board so status/CTA remain usable on 320x720.

## Verification already obtained

Foundation head `1889e1b5ea954be3cab6978e1f82a680b8281ca8` passed CI #821 / run `35213178491` in full. That checkpoint predates Pattern #40 taxonomy/distribution registration and the new dedicated regression/browser gates, so it is supporting evidence only, not final implementation acceptance.

## Exact-head gate now required

The final implementation candidate must prove on one exact head:

1. Pattern #40 regression passes for exactly six audited activities;
2. gameplay distribution stays 900/900 classified, 0 unclassified and becomes exactly 40 active patterns;
3. expected distribution change is six activities moving from `choice_grid` into `spatial_relation_board` without catalog-count change;
4. browser QA passes at 320x720, 390x844 and 768x1024 with hidden directional result, keyboard wrong-state, pointer completion, touch targets and measured evidence;
5. permanent visual baseline remains green with no new P0/P1 regression;
6. activity-quality remains deterministic clean;
7. Windows compatibility, Ubuntu quality gate, production build, dependency/security jobs and the full mobile matrix pass;
8. PR #175 remains exact-scope, mergeable and free of unresolved review/thread blockers.

Only after those checks may PR #175 be marked ready and squash-merged at its exact verified head. Merged `main` must then be independently verified, including production smoke, before Pattern #40 can be called implementation-complete.

A separate post-merge closure-docs gate is still required before Pattern #40 is called **FULLY CLOSED**.

## Non-negotiable boundaries

- no scope expansion beyond the six audited IDs;
- no heuristic arbitrary-prompt classification;
- no canonical prompt, choice or answer rewrite;
- no answer leakage before successful completion for turn/opposite tasks;
- no new assessed checkpoint;
- no drag-only dependency;
- no mastery/progression/schema/database rewrite;
- no claim of 40 merged patterns until merged-main distribution and production verification prove it.
