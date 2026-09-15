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

Fully merged waves through verified Pattern #28:
- `symbol_hunt` — 74 direct-literacy activities.
- `memory_pair` — PR #101.
- `missing_sequence_slot` — PR #102.
- `sorting_buckets` — PR #103.
- `drag_to_target` — PR #104.
- permanent gameplay-distribution audit — PR #105.
- `count_and_select` — PR #106.
- `number_line` — PR #108.
- `more_less_balance` — PR #109.
- `pattern_completion` — PR #110.
- `cause_effect` — PR #112.
- `compare_properties` — PR #114.
- `material_lab` — PR #116.
- `feature_function_link` — PR #119.
- `healthy_habit_routine` — PR #121.
- `rule_pipeline` — PR #123.
- `odd_one_out` — PR #125 + closure #126.
- `transitive_chain` — PR #127 + closure #128 + metadata #129.
- `set_reasoning` — PR #130 + closure #131 + metadata #132.
- `spatial_transform` — PR #133 + closure #134.
- `investigation_board` — PR #135 + closure #136 — **FULLY CLOSED**.

Current merged distribution remains:

```text
900 / 900 classified
0 unclassified
28 active merged patterns
choice_grid                 318 / 900 = 35.33%
investigation_board           4 / 900 = 0.44%
Science choice_grid          56 / 100
Logic choice_grid            52 / 100
```

## Relative Order Track — Pattern #29 QA acceptance

PR #137 is QA accepted but remains unmerged at this documentation point.

Exact scope:

```text
logic-order-first-after-start
logic-order-before-d
logic-order-between-blue-green
logic-order-third-symbol
logic-order-two-steps-after
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `logic.order.relative.basic`;
- stage `logic-conditional-analogy-inference`, lesson `logic-relative-ordering`, pack `logic.pack.relative-ordering`;
- activity IDs and completion semantics;
- Logic conditional/classification/inference families remain outside scope;
- Logic analogies remain `visible_matching`;
- Math ordering remains `number_line`;
- Letters ordering remains `missing_sequence_slot`.

Interaction/evidence contract:
- visualizes only canonical sequence context already expressed by the prompt;
- masks the inferred target slot with `?` before assessment;
- hidden slot is validated to equal canonical `correctChoice`;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable and cannot complete;
- correct choice completes the canonical activity;
- no invented sequence fact, answer leakage, changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_relative_order_track_interaction`;
- runtime metadata source `relative-order-track-runtime`.

Accepted PR-head evidence from `e91087aa1176723b0d90f310088b65a51d413ce7` / CI #626 / run `34992813094`:

```text
900 / 900 classified
0 unclassified
29 active PR-head patterns
choice_grid                 313 / 900 = 34.78%
relative_order_track          5 / 900 = 0.56%
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Deterministic quality artifact remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Simulations and Batch17 passed. Ubuntu, Windows, production build, dependency, secret scan and Chromium mobile/accessibility matrix all passed.

Manual visual acceptance reviewed idle / wrong / success at 320x720, 390x844 and 768x1024. All nine screenshots passed with no clipping/horizontal overflow, target slot still masked, visible retry/success feedback, no answer leakage, and CTA only after success.

Pattern #29 remains **QA ACCEPTED / UNMERGED** until fresh docs-head CI, exact-head merge/live verification, and a separate docs-only closure PR are complete.

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
- WS-05 Odd One Out DONE — PR #125 + #126.
- WS-05 Transitive Chain DONE — PR #127 + #128 + #129.
- WS-05 Set Reasoning DONE — PR #130 + #131 + #132.
- WS-05 Spatial Transform DONE — PR #133 + #134.
- WS-05 Investigation Board DONE — PR #135 + #136, fully closed.
- WS-05 Relative Order Track — **QA ACCEPTED / UNMERGED** — PR #137.
- WS-05 NEXT after Pattern #29 closure — fresh Pattern #30 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #29 itself becomes fully closed only after PR #137 exact-head merge/live verification and its required docs-only closure PR also passes exact-head CI, merge and live verification.
