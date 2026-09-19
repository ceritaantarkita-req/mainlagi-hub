# Math Spatial Relation Board Reuse Closure — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Scope

Existing Pattern #40 `spatial_relation_board` now serves exactly eleven assessed direct-choice activities:

Legacy Logic:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Math reuse:

```text
math-spatial-above
math-spatial-left
math-spatial-inside
math-spatial-near
math-spatial-between
```

This is existing-mechanic reuse. Active gameplay-pattern count remains 47; Pattern #48 remains unimplemented.

## Verification chain

Audit:

```text
Audit PR:          #209
Audit main:        3e30a817ef86fa691f9b2f1249ac00bc00dce4e6
Audit main CI:     #971 / run 35377783814
Audit smoke:       exact Cloudflare production smoke PASS
```

Implementation:

```text
Implementation PR:       #214
Initial head:            a10940ea85be91bf41f6f3b64fff92a14bd13cfd
CI #980:                 failed stale distribution sentinel only
Accepted checkpoint:     500e71e8a86f4959cffad423b024997d0d06a1b2
Checkpoint CI:           #981 / run 35421474731 — full success
Final PR head:           6e0d52f5c76933f698ac53be5120e5b488b89896
Final PR CI:             #986 / run 35421866386 — full success
Implementation main:     2cb948d614c90aceaa592ddbfae204ed639bc062
Implementation main CI:  #987 / run 35422469117 — full success
Cloudflare smoke:        exact main SHA PASS
```

CI #980 did not expose a runtime defect. Product classification already reported the intended 47 active / `choice_grid` 223 / `spatial_relation_board` 11 result; only the distribution sentinel still froze the earlier Set Reasoning-only baseline at 228. The accepted fix updated that test baseline without changing runtime/config/UI behavior.

## Merged-main evidence

Main CI #987 artifacts:

```text
mobile-route-qa-screenshots
artifact: 10578955102
sha256:0a1a026da811b9fa56c47b4c345aa7bf7d092943712fd6a5ea31061da6735cf6

gameplay-distribution-audit
artifact: 10577864840
sha256:2de881ba65144e60f269e6083ab11713714f4254014e3b39ab8368c2afb8428d

activity-quality-audit
artifact: 10577759869
sha256:4316399ccf695ff40aa0613f94443987634ce43f7b8ae105bfb010ba2fd96c6b
```

Verified distribution:

```text
activities:                 900
classified:                 900
unclassified:                 0
active patterns:             47
choice_grid                 223
spatial_relation_board       11
set_reasoning                10
compare_properties            3
cloze_sentence_choice         5
healthy_habit_routine         4
```

Deterministic activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
```

## Runtime / evidence contract

All five Math activities remain canonical:

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

No content rewrite, mastery/progression change, schema migration or database migration was introduced.

Config is exact/fail-closed on:
- activity ID;
- subject;
- stage;
- runtime;
- prompt;
- choice values/order;
- correct answer;
- explicit deterministic scene config.

Legacy six Logic activities retain their canonical behavior/evidence.

## Interaction implementation

Math scene support now includes:
- `above` as explicit vertical object relation;
- `left_of` as object relation;
- `inside` as containment;
- `near` as proximity with Paca / door / tree first-class scene objects;
- `between` with distinct left/right anchors.

No prompt parser, auto-classifier, drag dependency, numeric measurement checkpoint or second assessed task was added.

## Browser and manual visual acceptance

Legacy Logic browser QA remains wired.

Dedicated Math QA uses `math-spatial-near` at:
- 320x720;
- 390x844;
- 768x1024.

It verifies:
- legitimate progression readiness;
- canonical scene/choice order;
- keyboard wrong/retry;
- actual-touch correct completion;
- assessed evidence;
- incorrect=1 / retry=1 / accuracy=0.5;
- minimum touch targets;
- no horizontal overflow;
- feedback and success CTA visibility;
- no page/console errors.

Nine Math screenshots (idle / wrong / success × 320 / 390 / 768) were manually reviewed at accepted checkpoint and rechecked at final head. Result: **P0=0 / P1=0**.

## Closure

Math spatial reuse is **FULLY CLOSED / LIVE VERIFIED** at implementation level.

The next authorized runtime wave is the already-audited Math measurement reuse:

```text
math-measure-longer
math-measure-more-capacity
math-measure-fuller
math-measure-three-lengths
```

into existing `compare_properties`.

`math-measure-match-length` remains matching / `matching_accuracy_v1`.

Math measurement runtime must still follow its own exact-head CI, legacy Science regression, keyboard/pointer/actual-touch QA, manual visual review, exact merge, merged-main exact Cloudflare smoke and post-merge docs closure before English runtime reuse begins.
