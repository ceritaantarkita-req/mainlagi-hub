# WS-05 Science Healthy Habit Routine Wave — 2026-09-15

Status: **IMPLEMENTATION IN PROGRESS / QA PENDING**

Baseline: `main` @ `92664642287ecdd64ce408d3d08794a24aa2b588` (Feature Function Link closure PR #120).

## Audit decision

Science remains at 64/100 `choice_grid` after pattern #21. A fresh Wave A-D audit rejected heterogeneous investigation/evidence tasks and mixed-review tasks as one mechanic. The strongest remaining exact family is the four Wave C body-health choices: same stage, lesson, assessed evidence contract and canonical skill, all measuring recognition of a healthy everyday habit.

Exact scope:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

Explicit exclusion:

```text
science-match-body-care-c
```

The excluded activity remains canonical `matching` / `visible_matching`; it measures direct body-part-to-care pairing rather than selecting one habit for one health context.

## Pattern #22

Pattern: `healthy_habit_routine`.

Interaction contract:
- show the health focus and familiar routine cue;
- show exactly the canonical three choices as accessible habit cards;
- keyboard or pointer/touch selects one habit;
- wrong choice increments assessed error/retry evidence and cannot complete;
- correct choice completes the canonical activity identity;
- no drag-only interaction.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, canonical choices and `correctChoice` remain unchanged;
- skill remains `science.body.health_habits.basic`;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_healthy_habit_routine_interaction`.

## Intended distribution

```text
900 / 900 classified
0 unclassified
22 active patterns
choice_grid               347 / 900 = 38.56%
healthy_habit_routine       4 / 900 = 0.44%
Science choice_grid        60 / 100
Logic choice_grid          77 / 100
```

At 60%, Science will no longer exceed the permanent subject-hotspot advisory rule (`>60%`). If this wave passes all gates, the next subject audit should move to Logic rather than forcing weaker Science families.

## Required acceptance

1. Exact classifier/config/static regression for four IDs only.
2. `science-match-body-care-c` remains visible matching.
3. Dedicated browser QA at 320x720, 390x844, 768x1024 with legitimate Wave B progression.
4. Keyboard wrong-state, pointer completion, false-completion guard, evidence persistence, >=44px controls, no overflow and in-viewport success CTA.
5. Full CI, deterministic activity audit, gameplay-distribution audit and Batch17 acceptance remain green.
6. Manual review idle/error/success screenshots from a green run.
7. Canonical docs finalization, final docs-head CI, clean review gate, exact-head merge and post-merge docs closure before calling pattern #22 shipped.
