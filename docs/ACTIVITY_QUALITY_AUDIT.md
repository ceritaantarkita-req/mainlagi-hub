# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

All **9 subjects / 900 activities** remain deterministically clean:

```text
symbol_hunt           74
structural findings    0
KEEP                  900
POLISH                  0
REDESIGN                0
REPLACE                 0
flagged total           0
```

All subjects remain 100 KEEP / 0 flagged. Q101–Q108 remain zero.

Deterministic zero does **not** mean every activity is human-approved or maximally varied. Gameplay diversity, art direction, real-device/accessibility, and Iqro expert review remain separate requirements.

## WS-05 gameplay diversification

Merged waves:
- `symbol_hunt` — 74 direct-literacy activities.
- `memory_pair` — PR #101.
- `missing_sequence_slot` — PR #102.
- `sorting_buckets` — PR #103.
- `drag_to_target` — PR #104.
- permanent gameplay-distribution audit — PR #105.
- `count_and_select` — PR #106, exactly 9 Math counting activities.
- `number_line` — PR #108, exactly 6 Math Wave B ordering activities.
- `more_less_balance` — PR #109, exactly 6 Math Wave B comparison activities.
- `pattern_completion` — PR #110, exactly 5 Math Wave B choice-pattern activities.
- `cause_effect` — PR #112, exactly 4 Science Wave B water-change choice activities.
- `compare_properties` — PR #114, exactly 3 Science Wave C direct-comparison activities.
- `material_lab` — PR #116, exactly 4 Science Wave D material-purpose activities.
- `feature_function_link` — PR #119, exactly 4 Science Wave D living feature/function activities.

Current active QA wave:
- `healthy_habit_routine` — PR #121, exactly 4 Science Wave C body-health choices; QA accepted / unmerged.

Merged distribution on `main` remains 21 patterns. Accepted PR #121 head projects and verifies:

```text
900 / 900 classified
0 unclassified
22 PR-head active patterns
choice_grid                 347 / 900 = 38.56%
healthy_habit_routine         4 / 900 = 0.44%
Science choice_grid          60 / 100
Logic choice_grid            77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## Healthy Habit Routine — QA ACCEPTED / ACTIVE PR #121

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

Preserved:
- canonical runtime `tap_choice`;
- choices/`correctChoice`;
- assessment and stars;
- progression and canonical skill `science.body.health_habits.basic`;
- activity IDs and completion semantics;
- Wave C stage/lesson identity.

Interaction/evidence:
- health focus and routine cue appear as explicit context;
- canonical three habits appear as accessible answer buttons;
- wrong choice is measured/retryable and cannot complete;
- assessed fidelity `choice_healthy_habit_routine_interaction`;
- exact four-ID allowlist prevents unrelated Science activities from reclassification;
- `science-match-body-care-c` remains canonical visible matching.

Accepted QA evidence:
- implementation was cleaned to a reviewable minimal diff before acceptance; current accepted implementation head is `8086670711221dd077c64bdab2eb308040c3db86`;
- full CI #552 / run `34932904970` passed all required jobs;
- gameplay-presentation regression reports exactly `4 healthy_habit_routine` activities and dedicated exact-family regression passes;
- representative browser route uses legitimate Science Wave B readiness;
- keyboard wrong-state, pointer completion, false-completion protection, assessed evidence persistence, >=44px controls, no horizontal overflow, and CTA visibility all pass at 320/390/768;
- manual visual review accepted CI #552 idle/error/success screenshots at 320x720, 390x844 and 768x1024;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0;
- gameplay-distribution audit verifies 900/900, 22 PR-head patterns, global `choice_grid` 347/900, Science 60/100 and Logic 77/100;
- Batch17 final acceptance remains PASS with 9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons/packs and 200 skills; physical-device certification remains pending external evidence.

The wave is not merged yet. Final canonical docs-head CI, review gate, exact-head merge, `main` verification and post-merge closure remain required.

## Permanent audits

```bash
npm run qa:activity-quality
npm run qa:gameplay-distribution
```

CI uploads both artifacts. Gameplay-distribution coverage and active-pattern-set consistency are blocking; concentration remains advisory.

## Wave status

- WS-04 deterministic triage DONE — 900 KEEP / 0 flagged.
- WS-06 Coloring DONE — PR #95/#96.
- WS-07 Drawing DONE — PR #98/#99/#100.
- WS-05 Memory Pair DONE — PR #101.
- WS-05 Sequence Slot DONE — PR #102.
- WS-05 Sorting Buckets DONE — PR #103.
- WS-05 Drag-to-Target DONE — PR #104.
- WS-05 Gameplay Distribution Audit DONE — PR #105.
- WS-05 Count-and-Select DONE — PR #106.
- WS-05 Number Line DONE — PR #108.
- WS-05 More/Less Balance DONE — PR #109.
- WS-05 Pattern Completion DONE — PR #110.
- WS-05 Cause/Effect DONE — PR #112.
- WS-05 Compare Properties DONE — PR #114.
- WS-05 Material Lab DONE — PR #116.
- WS-05 Feature Function Link DONE — PR #119.
- WS-05 Healthy Habit Routine — **QA ACCEPTED / PR #121 / merge pending**.
- WS-05 NEXT after #121 closure — fresh **Logic exact-family audit** from the verified new baseline.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
