# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

All **9 subjects / 900 activities** remain deterministically clean on merged `main` `0d595f8b1b824125dc2cc26277f3e469b9325c73`:

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
- `odd_one_out` — PR #125, exactly 5 Logic Wave A discrimination activities.

Current active gameplay QA wave: none. Next work is a fresh Logic exact-family audit from the verified 24-pattern baseline.

Merged distribution after PR #125:

```text
900 / 900 classified
0 unclassified
24 active patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Odd One Out — MERGED PR #125

Exact scope:

```text
logic-odd-category-animal-vehicle
logic-odd-shape-angular
logic-odd-direction-right
logic-odd-count-three
logic-odd-pattern-symmetry
```

Preserved:
- canonical runtime `tap_choice`;
- choices/`correctChoice`;
- assessment and stars;
- progression and canonical skill `logic.discrimination.odd_one_out.basic`;
- activity IDs and completion semantics;
- Logic `logic-classification-rules-basics` stage / `logic-odd-one-out-basic` lesson identity.

Interaction/evidence:
- canonical trio is shown as one comparison set;
- `2 mirip • 1 beda` makes the comparison relation explicit without revealing the answer;
- canonical choices remain accessible direct-selection buttons;
- wrong choice is measured/retryable and cannot complete;
- assessed fidelity `choice_odd_one_out_interaction`;
- exact five-ID allowlist prevents unrelated Logic activities from reclassification;
- classification, comparison, simple sequence-rule, set, spatial, inference and composed-rule tasks stay outside this scope.

Accepted and merged evidence:
- CI #562 exposed a stale Rule Pipeline exclusion sentinel because one Odd One Out activity was intentionally no longer `default`; the sentinel was replaced with `logic-compare-more-dots`, retaining the old exact-scope guard rather than weakening it;
- CI #563 passed non-browser gates but Mobile correctly exposed that the target stage requires prior `logic-foundations` readiness;
- Odd One Out browser QA now seeds canonical qualifying foundation evidence using the established Logic readiness pattern, while progression guards remain active;
- implementation head `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d` passed CI #564 / run `34951235607`;
- final docs head `7b0735f13ab7ad22dff8c6fed792e62f9a66bc60` passed CI #565 / run `34952172997`;
- Ubuntu and Windows typecheck/lint/engine gates passed;
- production build, dependency audit and secret-history scan passed;
- gameplay-presentation regression reports exactly `5 odd_one_out` activities and the dedicated exact-family regression passes;
- representative browser route uses legitimate Logic foundation readiness;
- keyboard wrong-state, pointer completion, false-completion protection, assessed evidence persistence, >=44px controls, no horizontal overflow, trio layout and CTA visibility all pass at 320/390/768;
- manual review accepted green #564 idle/error/success screenshots at 320x720, 390x844 and 768x1024; no UI polish commit was required;
- activity-quality artifact verifies **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0;
- gameplay-distribution audit verifies 900/900, 24 patterns, global `choice_grid` 337/900, `odd_one_out` 5/900, Science 60/100 and Logic 67/100;
- simulations and Batch17 final acceptance pass with 9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons/packs and 200 skills; physical-device certification remains pending external evidence;
- final review gate had 0 PR comments, 0 submitted reviews and 0 review threads;
- exact-head squash merge produced `0d595f8b1b824125dc2cc26277f3e469b9325c73`, verified live on `main`.

Regression history is retained intentionally: #562 and #563 are not acceptance runs. #564 is the accepted implementation run; #565 is the accepted final docs-head run.

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
- WS-05 Odd One Out DONE — PR #125.
- WS-05 NEXT — fresh Logic exact-family audit from the verified 24-pattern baseline.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #24 is code-merged; its required docs-only post-merge closure must also be merged before the wave is called fully closed.
