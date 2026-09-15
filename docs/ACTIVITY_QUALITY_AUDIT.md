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
- `healthy_habit_routine` — PR #121, exactly 4 Science Wave C body-health choices.
- `rule_pipeline` — PR #123, exactly 5 Logic Wave D composed-rule activities.

Current active gameplay QA wave: none. Next work is a fresh Logic Wave A `odd-one-out` exact-family audit from the verified 23-pattern baseline.

Merged distribution after PR #123:

```text
900 / 900 classified
0 unclassified
23 active patterns
choice_grid                 342 / 900 = 38.00%
rule_pipeline                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            72 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Rule Pipeline — MERGED PR #123

Exact scope:

```text
logic-compose-red-circle-to-star
logic-compose-small-left-then-up
logic-compose-two-to-blue
logic-compose-triangle-turn-right
logic-compose-swap-then-grow
```

Preserved:
- canonical runtime `tap_choice`;
- final choices/`correctChoice`;
- assessment and stars;
- progression and canonical skill `logic.rule.composition.basic`;
- activity IDs and completion semantics;
- Logic Wave D stage/lesson identity.

Interaction/evidence:
- start state and rule 1 appear as explicit context;
- child must explicitly execute rule 1 before final choices become available;
- deterministic intermediate state is visible;
- rule 2 uses exactly the canonical three final choices;
- wrong final choice is measured/retryable and cannot complete;
- assessed fidelity `choice_rule_pipeline_interaction`;
- exact five-ID allowlist prevents unrelated Logic activities from reclassification;
- one-step conditional, set, transitive, spatial and odd-one-out activities remain canonical `choice_grid`.

Accepted and merged evidence:
- implementation head `5def5791d3e3b09fbc680ba52e9e6605695e66c4` passed CI #557 / run `34936058944`;
- final docs head `3bb4684ae69fcd76a354b6b319fbe9992e6a50d3` passed CI #558 / run `34937511724`;
- Ubuntu and Windows typecheck/lint/engine gates passed;
- production build, dependency audit and secret-history scan passed;
- gameplay-presentation regression reports `5 rule_pipeline` and dedicated exact-family regression passes;
- representative browser route uses legitimate Logic Wave C readiness;
- keyboard rule-1 execution, visible intermediate state, keyboard wrong final state, pointer correct completion, false-completion guards, assessed evidence persistence, >=44px controls, no horizontal overflow and CTA visibility all pass at 320/390/768;
- manual review accepted green #557 idle/intermediate/error/success screenshots at 320x720, 390x844 and 768x1024;
- deterministic activity-quality remains **900 KEEP / 0 flagged**, structural findings 0;
- gameplay-distribution audit verifies 900/900, 23 patterns, global `choice_grid` 342/900, `rule_pipeline` 5/900, Science 60/100 and Logic 72/100;
- five simulations all report `invariantErrors: 0`;
- Batch17 final acceptance remains PASS with 9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons/packs and 200 skills; physical-device certification remains pending external evidence;
- final review gate had **0 PR comments, 0 submitted reviews and 0 review threads**;
- exact-head squash merge produced `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1` and live `main` was verified at that SHA.

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
- WS-05 Healthy Habit Routine DONE — PR #121.
- WS-05 Rule Pipeline DONE — PR #123.
- WS-05 NEXT — fresh Logic Wave A `odd-one-out` exact-family audit from the verified 23-pattern baseline.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
