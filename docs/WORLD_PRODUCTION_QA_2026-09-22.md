# Mainlagi World — Production QA / Responsive Checkpoint Pass — 22 September 2026

Status: **LATEST NON-AUDIO VALIDATED GREEN HEAD `1a74e5da7803c736a9ccff6b1fda52975501bfeb` / CI #1516**

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


## 15. Production wave 14 — eight-Stage content consistency QA

Machine-readable audit:

```text
src/lib/learning/world/moneyWorldContentAudit.ts
money-world-content-audit-v1
```

The audit locks:

```text
8 canonical Stage focus rows
89 Segments
16 practice activities
2 practice challenges per Stage
1 Stage-8 open narrative choice
1 Stage-8 recap
<=18 spoken words per cue
no factual guaranteed-return claim
no Bermain motion dependency
```

Targeted continuity gates additionally lock the clearer inflation wording, Stage-6 saving bridge, Stage-7 uncertainty explanation, and Stage-8 post-choice arithmetic separation.

Browser QA now waits for the explicit Stage-8 “latihan hitung lain” bridge after an open child choice.

Detailed record:

```text
docs/WORLD_CONTENT_AUDIT_2026-09-22.md
```

CI status for this exact wave head must be recorded before freezing a content-audit checkpoint.


## 16. Production wave 15 — World accessibility QA

Focused accessibility contracts were added without changing World progression/content ownership.

Browser QA now locks:

```text
Stage progressbar min/current/max/text semantics
active Scene role=region
Scene context aria-live=polite + aria-atomic=true
completion heading receives focus
next journey Stage aria-current=step
locked Stage accessible label/state
```

Static QA additionally locks:

```text
ordering + recap list semantics
take-away visualization text alternative
open choice polite status
journey/share focus-visible treatment
forced-colors selected/current state support
```

Detailed record:

```text
docs/WORLD_ACCESSIBILITY_PASS_2026-09-22.md
```

Green validation is recorded in section 19; accessibility is included in the frozen non-audio checkpoint.


## 17. Production wave 16 — World performance / lazy-load QA

World-specific performance QA now adds repository-byte budgets and route-scoped artwork loading assertions.

Static budgets:

```text
single reused visual <= 80 KiB
approved reused World visual library <= 600 KiB
Stage-shell wordmark <= 40 KiB
map core artwork <= 230 KiB
single Stage shell artwork set <= 190 KiB
```

Browser network QA:

```text
320/430 World map:
  no /artwork/backgrounds/math/* Stage background requests

390 Stage 1:
  playground-park-mobile.webp requested
  playground-park-wide.webp not requested
  mini-market-* not requested
  number-park-* not requested
```

Detailed record:

```text
docs/WORLD_PERFORMANCE_LAZY_LOAD_2026-09-22.md
```

Green validation is recorded in section 19; performance/lazy-load is included in the frozen non-audio checkpoint.


## 18. Production wave 14 green result

Validated exact content-audit head:

```text
ef0a0ab60b66e9ed19da27b9b5a64e8a86f9f524
CI #1491 / run 35752625951
checkpoint/world-petualangan-uang-content-audit-green-20260922
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

Earlier audit-candidate failures were fail-closed test-contract drift while the audit was being introduced; the exact checkpoint above is the first frozen full-green content-audit closure.


## 19. Production waves 15–16 joint green result

The corrected accessibility + performance/lazy-load head is fully green:

```text
head: 1a74e5da7803c736a9ccff6b1fda52975501bfeb
CI:   #1516 / run 35755761647
checkpoint: checkpoint/world-petualangan-uang-non-audio-production-green-20260922
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

Relevant artifacts:

```text
mobile-route-qa-screenshots — 10707813193
activity-quality-audit      — 10707852606
gameplay-distribution-audit — 10707742788
```

The mobile job passed:

```text
canonical mobile route matrix
World accessibility assertions
World route-scoped artwork/lazy-load assertions
permanent visual product baseline
```

One earlier candidate run failed because browser QA looked for a non-canonical Stage-3 title string. The authored runtime title remained `Uang Datang dari Mana?`; the test literal was corrected and the exact corrected head above passed.

This checkpoint is the safe rollback for the completed non-audio World production sequence after the separate content-audit checkpoint.


## 20. World → Evidence v1 design QA — CI #1530

Validated exact head:

```text
38bbe5704d4d63781410842cbf134dcb76c3ab54
checkpoint: checkpoint/world-evidence-bridge-contract-green-20260923
PR: #295 Draft
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

The World regression suite now locks:

```text
bridge version = money-world-evidence-bridge-v1
mode = design-only-disabled
enabled = false
16/16 World activity audit coverage
16 current placements remain practice
2 candidate-only canonical Math relations
14 explicit exclusions
0 canonical learning_activity mappings
all write/schema/runtime flags false
all activation prerequisites unsatisfied
valid candidate observation remains blocked
practice -> assessed spoof fails closed
excluded activity remains unmapped
unknown source identity fails closed
World runtime has no learning-attempt/evidence write hook
existing record_learning_attempt still has Belajar progress/star side effects
```

The last point is intentional evidence for why direct reuse of the existing RPC is forbidden.

Passing this QA does not authorize activation.


## 21. World → Evidence final design-closure QA — CI #1535

Final synchronized design head:

```text
82faddd6b90eac603cb2449b8f16d7aff98a1792
checkpoint: checkpoint/world-evidence-bridge-design-closure-green-20260923
PR: #295 Draft / unmerged
```

CI #1535 / run 35768996360 passed the full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

This revalidates the disabled v1 architecture together with its final docs/current-state handoff. It does **not** add an evidence write path.

The activation boundary remains fail-closed and separately authorized.
