# WS-05 Pattern #46 — Phenomenon Relation Board Wave — 18 September 2026

Status: **IMPLEMENTATION CHECKPOINT VERIFIED / NOT MERGED**

## Goal

Move the four audited Science `science-earth-sky-patterns` direct-choice activities from generic `choice_grid` into one evidence-safe child-facing relation mechanic without changing canonical learning ownership or assessment semantics.

## Exact scope

```text
science-earth-sun-day
science-earth-moon-night
science-earth-shadow-sun
science-earth-cloud-rain
```

Same-pack `science-match-sky-observation-c` remains matching.

## Presentation

`phenomenon_relation_board` renders:

```text
stable observation / condition -> unresolved related condition or result
```

The right-side result is hidden until the canonical correct answer is submitted. A wrong choice receives local feedback but cannot resolve or reveal the result.

Deterministic relation modes:

```text
science-earth-sun-day       -> sun_day_relation
science-earth-moon-night    -> night_sky_observation
science-earth-shadow-sun    -> light_shadow_relation
science-earth-cloud-rain    -> cloud_rain_prediction
```

No prompt parsing is used.

## Files

Runtime/config surfaces:

- `src/lib/learning/phenomenonRelationBoardConfig.ts`
- `src/components/learning/PhenomenonRelationBoardActivity.tsx`
- `src/components/learning/PhenomenonRelationBoardActivity.module.css`
- `src/lib/learning/gameplayPatternClassifier.ts`
- `src/app/child/[childId]/activity/[activity]/page.tsx`

Regression/QA surfaces:

- `scripts/run-phenomenon-relation-board-tests.mjs`
- `scripts/run-phenomenon-relation-board-browser-tests.mjs`
- `scripts/audit-gameplay-distribution.mjs`
- `tsconfig.learning-tests.json`
- `package.json`

No canonical content payload, mastery, progression, schema or database file is changed.

## Evidence contract

```text
runtime:            tap_choice
assessment:         assessed
contract:           choice_accuracy_v1
wrong:              incorrect + retry / no completion / target stays unresolved
correct:            completion + target resolution
accuracy:           1 / (1 + incorrectCount)
```

Additive metadata:

```text
source:             phenomenon-relation-board-runtime
evidenceFidelity:   choice_phenomenon_relation_interaction
relationMode
selectedChoice
observationLabel
relationLabel
```

## CI history

Audit:

```text
PR #199 head b53a299fafa8058af78797b3cd345984dedc9027
CI #928 / run 35316239193 — full success
main b620c78f186b7c8e8612afdb616420d923a57e00
CI #929 / run 35316693100 — full success + Cloudflare
```

Implementation:

```text
PR #200
initial implementation head: 83290426008e0fe81a959337b2af979ac21d3539
CI #930 / run 35331633980 — blocked by 320px horizontal overflow
responsive-fix / accepted head: 558f154278a6a75c01e3fad14171e5ae5bc66fdd
CI #931 / run 35338034584 — full success
```

The #930 failure was a useful product gate. The fix only adds narrow-layout containment/wrapping; evidence and canonical scope remain unchanged.

## Accepted branch distribution

```text
900/900 classified
0 unclassified
46 active child-facing patterns
choice_grid 237
phenomenon_relation_board 4
```

## Visual checkpoint

Manual nine-shot review at 320x720, 390x844 and 768x1024 is **ACCEPTED / no P0-P1 Pattern #46 blocker**.

The 320px screenshots specifically verify that the overflow caught by #930 is fixed and that success feedback plus CTA remain visible.

## Next gate

1. Reconcile canonical docs with this accepted checkpoint.
2. Run full CI on the resulting docs-inclusive final PR #200 head.
3. Confirm exact head, mergeability and no review/thread blocker.
4. Exact-head squash merge PR #200.
5. Require full merged-main CI including exact Cloudflare production smoke.
6. Verify merged distribution remains 46 active / `choice_grid` 237 / `phenomenon_relation_board` 4.
7. Perform post-merge Pattern #46 docs closure before Pattern #47 implementation work.
