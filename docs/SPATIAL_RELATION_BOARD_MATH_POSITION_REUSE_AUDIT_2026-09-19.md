# Spatial Relation Board Reuse Audit — Math Spatial Position — 19 September 2026

Status: **AUDIT COMPLETE / LIVE VERIFIED / REUSE JUSTIFIED / CODE NOT STARTED / IMPLEMENTATION NEXT**

## Purpose

Evaluate whether the existing `spatial_relation_board` gameplay pattern can safely represent the five Math spatial-position direct-choice activities without creating Pattern #48.

This audit is reuse-first. A valid outcome included rejecting reuse if the existing board could not preserve the Math objective/evidence contract without semantic distortion.

## Audit base

```text
canonical main:             d36a385f131573bb08ec60d4689343ad5e4b8f3c
latest fully closed pattern: Pattern #47 — shape_attribute_board
active pattern count:       47
Pattern #48:                no justified new pattern
Set Reasoning code merge:   9debb6cf30f789125c45eff1b88e65e4eaff7978
Set Reasoning final PR CI:  #963 / run 35372830249 — full success
Set Reasoning live closure: pending independent main/Cloudflare verification
```

The current Set Reasoning reuse live-closure gate remains unresolved in canonical docs. This audit may advance evidence and documentation, but **Math runtime implementation must not start until that prior closure is independently verified and this audit itself is merged/verified**.

## Exact Math reuse scope

```text
math-spatial-above
math-spatial-left
math-spatial-inside
math-spatial-near
math-spatial-between
```

Canonical ownership is one coherent Math family:

```text
subject:      math
stage:        math-ukur-ruang
lesson:       math-spatial-position
pack:         math.pack.spatial-position
skill:        math.spatial.position
runtime:      tap_choice
assessment:   assessed
evidence:     choice_accuracy_v1
age:          4–7
```

Canonical lesson objective:

> Memahami kiri-kanan, atas-bawah, dalam-luar, dekat-jauh, dan di antara.

Canonical skill description:

> Mengenali kiri-kanan, atas-bawah, dalam-luar, dekat-jauh, dan posisi di antara.

All five activities are therefore direct measurements of the same spatial-position objective.

## Current canonical activities

### `math-spatial-above`

```text
prompt:  Bola berada di atas kotak. Posisi bola?
choices: di atas / di bawah / di dalam
correct: di atas
```

### `math-spatial-left`

```text
prompt:  Kucing ada di kiri robot. Posisi kucing?
choices: kiri / kanan / tengah
correct: kiri
```

### `math-spatial-inside`

```text
prompt:  Mainan dimasukkan ke kotak. Mainan sekarang berada di mana?
choices: di dalam / di atas / di luar
correct: di dalam
```

### `math-spatial-near`

```text
prompt:  Paca berdiri dekat pintu dan jauh dari pohon. Apa yang lebih dekat ke Paca?
choices: pintu / pohon / sama
correct: pintu
```

### `math-spatial-between`

```text
prompt:  Urutannya Gavi — Paca — Zia. Siapa yang berada di antara Gavi dan Zia?
choices: Gavi / Paca / Zia
correct: Paca
```

## Existing mechanic being reused

Pattern #40 `spatial_relation_board` is already fully closed/live verified for six assessed Logic spatial activities.

Existing behavior already provides:
- a stable spatial scene;
- exact direct-choice answer controls;
- wrong/retry measurement without false completion;
- canonical `choice_accuracy_v1`;
- metadata `source: spatial-relation-board-runtime`;
- metadata `evidenceFidelity: choice_spatial_relation_interaction`;
- keyboard, pointer and touch input;
- 320/390/768 responsive QA;
- fail-closed exact configuration.

The current config is intentionally strict to Logic / `logic-patterns-sequences-relations`. Reuse therefore requires a **subject-aware exact generalization**, not removal of those safeguards.

## Objective/evidence decision

Reuse is **justified for all five Math activities**.

Why:
1. the lesson and skill explicitly assess spatial position;
2. the existing board already exists to make position/direction relations visible while preserving direct-choice evidence;
3. all five Math activities remain the same canonical assessed answer task after a visual spatial scene is added;
4. no drag/pathfinding/order-construction or new checkpoint is necessary;
5. the five activities are one exact lesson/pack/skill family rather than a loose prompt-text cluster.

This is a presentation generalization of Pattern #40, **not a new gameplay pattern**.

## Required Math spatial scene modes

The existing board should be generalized only through explicit deterministic modes.

### Vertical relation

`math-spatial-above`

```text
kind: above
mode: object_relation
moving: ball
anchor: box
```

The board may place the ball vertically above the box. It must not change the submitted answer token.

### Horizontal relation

`math-spatial-left`

```text
kind: left_of
mode: object_relation
moving: cat
anchor: robot
```

This reuses the existing left/right object-relation concept directly.

### Containment relation

`math-spatial-inside`

```text
kind: inside
mode: containment
moving: toy
anchor: box
```

The object may be visibly placed inside a container. No drag interaction is required or approved.

### Proximity relation

`math-spatial-near`

```text
kind: near
mode: proximity
focus: Paca
nearTarget: door
farTarget: tree
```

The board may restate the canonical near/far relationship visually. It must not introduce distance measurement, numeric units, ranking beyond the existing question, or an extra assessed comparison.

### Between relation

`math-spatial-between`

```text
kind: between
mode: object_relation
left: Gavi
moving: Paca
right: Zia
```

This reuses the existing between relation directly.

## Why this remains one existing mechanic

The new Math modes stay inside the existing semantic boundary: **represent a stated spatial relation, then answer the unchanged canonical direct-choice question**.

They do not create:
- a measurement mechanic;
- a pathfinding mechanic;
- a drag/drop placement task;
- an ordering construction task;
- a multi-step transformation task;
- a new assessed evidence contract.

`above`, `inside`, `near`, `left_of`, and `between` are all spatial-position relations explicitly named by the Math lesson/skill itself.

## Fail-closed implementation boundary

A later implementation is allowed only if config validates exact audited identity.

For the five Math IDs require:
- subject `math`;
- stage `math-ukur-ruang`;
- lesson/pack/skill ownership retained by canonical catalog;
- runtime `tap_choice`;
- exact prompt;
- exactly three canonical choices in exact order;
- exact `correctChoice`;
- explicit deterministic spatial scene config.

The existing six Logic IDs must retain their current exact stage/prompt/choice/answer validation and behavior.

No prompt parser or keyword-based auto-classification is approved.

## Evidence contract

Must remain unchanged:
- canonical activity IDs;
- assessed status;
- `choice_accuracy_v1`;
- canonical prompt;
- canonical answer values and order;
- `correctChoice`;
- retry/incorrect/accuracy semantics;
- mastery/progression;
- database/schema/content revision.

Runtime metadata may continue to use:

```text
source: spatial-relation-board-runtime
evidenceFidelity: choice_spatial_relation_interaction
mode
relationOrTurn
selectedChoice
```

If Math-specific metadata is added, it may describe the scene but must not redefine correctness.

## Required regression / browser proof

Before any implementation merge:
1. exactly the existing six Logic + five audited Math activities classify as `spatial_relation_board`;
2. all 11 configs fail closed on subject/stage/prompt/order/answer/runtime drift;
3. existing six Logic activities keep old behavior/evidence unchanged;
4. all five Math activities keep exact catalog/authoring/manifest ownership;
5. wrong answer increments incorrect/retry and cannot complete;
6. correct answer completes through canonical measured evidence;
7. keyboard, pointer and actual touch are covered;
8. dedicated representative Math QA covers 320x720, 390x844 and 768x1024, idle/wrong/success;
9. containment and proximity scenes do not overflow or obscure choices;
10. success feedback and CTA remain visible on the short viewport;
11. permanent visual QA remains P0=0/P1=0;
12. gameplay distribution remains 900/900 classified.

## Expected distribution only after later verified implementation

Current exact-head Set Reasoning implementation evidence is:

```text
47 active patterns
choice_grid                228 / 900
set_reasoning               10 / 900
spatial_relation_board       6 / 900
```

If this exact five-ID Math reuse later passes every gate:

```text
47 active patterns
choice_grid                223 / 900
set_reasoning               10 / 900
spatial_relation_board      11 / 900
```

Active pattern count remains 47. Pattern #48 remains unimplemented.

## Explicit non-scope

This audit does not approve:
- Math measurement activities;
- `compare_properties` changes;
- matching activities;
- arbitrary Math direct-choice activities;
- Logic spatial-transform or ordering families;
- content rewrites;
- migrations;
- mastery/progression changes;
- Pattern #48;
- implementation before the current Set Reasoning live-closure gate is resolved.

## Decision

**Reuse existing `spatial_relation_board` for exactly the five Math `math.spatial.position` activities is justified.**

The evidence gap is the same one Pattern #40 was designed to solve: a spatial objective represented mostly as text/direct choices. The existing mechanic can be generalized with explicit vertical, containment and proximity scene modes while preserving the canonical assessed answer contract.

## Post-merge audit verification

PR #209 merged the docs-only audit to main `3e30a817ef86fa691f9b2f1249ac00bc00dce4e6`. Exact-head PR CI #970 / run `35377295090` passed. Push-to-`main` CI #971 / run `35377783814` then passed the full matrix including `Production smoke (Cloudflare)`, whose health response served the exact `3e30a817...` SHA on branch `main` with the canonical site and Supabase target.

The preceding Set Reasoning implementation is also fully live verified by implementation-main CI #964 and post-merge docs main CI #969. Therefore the prerequisite live gate for this Math spatial implementation is resolved.

## Next gate

1. merge and live-verify the reuse-chain closure docs;
2. create a separate Math spatial implementation branch from the latest verified `main`;
3. implement the exact five audited Math IDs while preserving the six existing Logic IDs;
4. require exact fail-closed config, old-family regression, Math keyboard/pointer/actual-touch QA, 320/390/768 idle-wrong-success visual QA, distribution and activity-quality gates;
5. exact-head merge only after manual screenshot acceptance;
6. require merged-main exact-SHA Cloudflare smoke and post-merge docs closure before starting Math measurement runtime reuse.
