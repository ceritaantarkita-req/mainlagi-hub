# Mainlagi World — Production QA / Responsive Checkpoint Pass — 22 September 2026

Status: **IMPLEMENTED ON ISOLATED WORLD PRODUCTION BRANCH / CI VALIDATION PENDING**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This pass validates and hardens the production-wave runtime after the reusable Scene presentation layer was introduced.

## 1. Scope

The QA target is intentionally narrow:

```text
World runtime only
Petualangan Uang pilot
320 / 390 / 430 mobile widths
all five canonical Scene kinds
all eight Stage closing checkpoints
```

This pass does not change Belajar, Bermain/motion, evidence/mastery, SQL schema, global age policy, or final human-character production.

## 2. Responsive fix

The reusable Scene wrapper adds Scene metadata above the World-specific Segment content.

To avoid making the existing mobile story/activity minimum height behave as though the wrapper did not exist, the Stage CSS now applies an explicit wrapper-aware mobile fit rule:

```text
Production wave 06: Scene wrapper responsive fit
```

At <=760px and <=390px, story/activity minimum height is calculated against the remaining Stage-shell space while still retaining a floor large enough for child-facing interaction.

This is a minimum-height correction only. Long activities may still grow vertically and scroll naturally.

## 3. Narrow-width metadata hardening

`WorldSceneRenderer.module.css` now keeps Scene metadata/content min-width safe.

The Scene title remains ellipsized inside the metadata pill rather than forcing horizontal overflow at narrow widths.

## 4. Scene-local progress

The reusable Scene renderer now shows progress **inside the current authored Scene**, not a duplicate of global Stage Segment progress.

Example:

```text
Stage shell:
Bagian 5/10

Scene:
Tantangan · Cocokkan uang dan harga · Bagian 1/1
```

Runtime derives Scene-local position from:

```text
activeScene.segmentIds.indexOf(segment.id) + 1
```

If the active Segment is not present in the resolved Scene, runtime fails closed.

## 5. 320 / 390 / 430 responsive matrix

Permanent mobile browser QA now opens representative authored checkpoints for all five Scene kinds at each target width:

```text
story     -> Stage 1 opening
challenge -> Stage 1 money/price challenge
choice    -> Stage 8 child choice
recap     -> Stage 8 recap
closing   -> Stage 1 closing
```

For every scenario and width QA verifies:

- canonical Scene ID;
- canonical Scene kind;
- reusable presentation surface;
- Scene-local progress;
- no document horizontal overflow;
- Scene frame remains inside viewport;
- Scene metadata remains inside viewport;
- Scene content remains inside viewport;
- visible interactive controls retain >=44px touch target;
- visible interactive controls remain inside viewport;
- no page errors;
- no console errors.

Selected screenshots are retained for 320px and 430px review.

## 6. Existing eight-Stage production QA retained

The earlier all-eight Stage closure matrix remains active.

Each Stage still verifies:

- valid production manifest;
- canonical closing Scene;
- reusable payoff presentation;
- illustrated background;
- narration attempt;
- transition to completion;
- exact ★★★ completion.

The deeper representative mechanics/finale/share/map tests are also retained.

## 7. Static contract additions

`run-world-money-tests.mjs` now locks:

- Scene-local progress derives from authored Scene membership;
- `data-world-scene-progress` remains exposed for QA;
- the wrapper-aware responsive fit rule remains in World CSS.

## 8. CI/checkpoint rule

Do not label this production wave green until GitHub Actions validates the exact branch head.

After a full successful PR matrix:

1. record PR/run/head in the safe checkpoint doc;
2. create a new immutable checkpoint branch from the validated head;
3. do not force-push/move older World checkpoint branches;
4. keep production integration separate from PR #272 unless explicitly approved.

## 9. Next after green

Once this exact production-wave head is green, the remaining product gaps are primarily **assets/integration**, not core World runtime architecture:

- 88 fixed narration assets still need actual approved production audio;
- Gian/Naya final production remains paused;
- dedicated public World social card remains open;
- bespoke World background art remains optional/future;
- World -> Belajar evidence bridge remains deliberately disabled.
