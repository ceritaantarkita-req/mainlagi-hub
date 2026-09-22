# Mainlagi World — Production QA / Responsive Checkpoint Pass — 22 September 2026

Status: **LATEST VALIDATED GREEN HEAD `9f6953302ee82db62a7362288233a77db2251743`**

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

## 8. CI/checkpoint result

A dedicated CI-only Draft PR was opened without touching PR #272:

```text
PR:      #282
base:    feature/world-petualangan-uang-dummy-20260922
head:    feature/world-petualangan-uang-production-wave-20260922
target:  NOT main
```

First responsive run exposed a real QA issue: one Stage challenge control did not meet the new 44px touch-target gate at 320px. The production CSS was hardened so every interactive control inside `data-world-scene-content` has at least **44 × 44 CSS px**.

Validated exact code head:

```text
head: e8f795b7d26a2cb3bf19fc787f6f58b2b85ed60a
CI:   #1382 / run 35704255936
```

Full matrix result:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
```

Frozen rollback branch:

```text
checkpoint/world-petualangan-uang-production-green-20260922
@ e8f795b7d26a2cb3bf19fc787f6f58b2b85ed60a
```

Do not move or force-push this checkpoint branch.

## 9. Manual screenshot review

Reviewed CI artifact:

```text
mobile-route-qa-screenshots
artifact id: 10683524631
run: 35704255936
```

Selected new responsive screenshots reviewed:

```text
320-world-scene-story.png
320-world-scene-challenge.png
430-world-scene-choice.png
430-world-scene-recap.png
430-world-scene-closing.png
```

Review result:

- 320px story shell remains readable and horizontally contained;
- 320px challenge keeps the illustrated environment and uses natural vertical scrolling instead of horizontal compression;
- Scene metadata pills remain inside viewport;
- 430px choice/recap/closing surfaces remain visually separated from the Stage shell;
- recap cards stay readable;
- closing dialogue does not overlap top controls or Scene metadata;
- no P0/P1 World-specific visual blocker was observed in these selected CI screenshots.

## 10. Next after green

Once this exact production-wave head is green, the remaining product gaps are primarily **assets/integration**, not core World runtime architecture:

- 88 fixed narration assets still need actual approved production audio;
- Gian/Naya final production remains paused;
- dedicated public World social card remains open;
- bespoke World background art remains optional/future;
- World -> Belajar evidence bridge remains deliberately disabled.


## 11. Production wave 07 — dedicated social-card QA

The generic `/og/math-warung.png` fallback has been replaced for Petualangan Uang by:

```text
/worlds/money-festival/social-card
```

Static/browser QA now locks the public-safe 1200×630 ImageResponse contract, Open Graph/Twitter metadata routing, PNG response, and absence of child/account/progress identity.

Detailed record:

```text
docs/WORLD_SOCIAL_CARD_2026-09-22.md
```

Validated result:

```text
head: 9f6953302ee82db62a7362288233a77db2251743
CI:   #1391 / run 35716360918

Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Frozen social-card checkpoint:

```text
checkpoint/world-petualangan-uang-social-green-20260922
```

The previous runtime-responsive checkpoint remains valid and unmoved.


## 12. Production wave 12 — semantic Chapter navigation QA

World map Chapter presentation is now runtime-semantic rather than CSS pseudo-content.

New QA locks:

```text
Stage shell Chapter identity/title
Chapter 1 progress after Stage 1 = 1/4
Chapter 2 progress after Stage 1 = 0/4
completed World Chapter 1 = 4/4
completed World Chapter 2 = 4/4
320/430 Chapter-banner horizontal containment
no CSS-hardcoded Chapter title content
```

New screenshots:

```text
320-world-money-map-chapter-nav.png
430-world-money-map-chapter-nav.png
```

Detailed record:

```text
docs/WORLD_VISUAL_NAVIGATION_POLISH_2026-09-22.md
```

CI status for this exact wave head must be recorded before freezing a new checkpoint.


## 13. Production wave 13 — Stage completion UX QA

The Stage-end contract remains `★★★ + Back / Again / Next + Share`, but completion is now canonical Chapter-aware.

New QA locks:

```text
Stage completion Stage ID
Stage completion Chapter ID
final/non-final completion state
Chapter/Stage context label
Stage 1 Next -> Stage 2
Stage 4 -> Chapter 1 milestone
Stage 8 -> Chapter 2 milestone + final World
all eight Stage completion identities
320/430 Share below Back / Again / Next
no Stage-4 hardcoded Chapter completion shortcut
```

Detailed record:

```text
docs/WORLD_COMPLETION_UX_POLISH_2026-09-22.md
```

CI status for this exact wave head must be recorded before freezing a completion-UX checkpoint.


## 14. Production wave 13 green result

Validated exact head:

```text
40436d41678f41d08516c3029b554dee5b7f339d
CI #1467 / run 35750690235
checkpoint/world-petualangan-uang-completion-ux-green-20260922
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Mobile screenshots artifact:

```text
10705397615
```

The required completion contract remains visible and responsive: ★★★, rotating praise, Back / Again / Next, then Share below.
