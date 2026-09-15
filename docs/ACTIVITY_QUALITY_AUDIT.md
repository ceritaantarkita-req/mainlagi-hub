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

Fully merged/closed waves now include:
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
- `spatial_transform` — PR #133 + closure #134 — **FULLY CLOSED**.

Current merged distribution:

```text
900 / 900 classified
0 unclassified
27 active merged patterns
choice_grid                 322 / 900 = 35.78%
spatial_transform             5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            52 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Spatial Transform — FULLY CLOSED

Exact scope:

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

Preserved:
- canonical runtime `tap_choice`;
- three choices/`correctChoice`;
- assessment and stars;
- mastery/progression and canonical skill `logic.spatial.transform.basic`;
- activity IDs and completion semantics;
- stage `logic-mixed-reasoning-challenge` / lesson `logic-spatial-transform` / pack `logic.pack.spatial-transform` identity.

Interaction/evidence:
- visible starting direction and canonical transform;
- final direction hidden as `?` before assessment;
- canonical choices remain accessible direct-selection buttons;
- wrong choice is measured/retryable and cannot complete;
- assessed fidelity `choice_spatial_transform_interaction`;
- exact five-ID allowlist prevents unrelated Logic activities from reclassification;
- Wave B spatial-relation tasks remain outside scope;
- no answer leakage, invented intermediate assessment, changed answer set, extra confirmation or drag-only dependency.

Acceptance/closure chain:
- implementation head `267f00d243dc1778c2d86e5a0ca70d8cfe76872a` passed CI #597 / run `34976080767` and manual visual QA;
- final implementation/docs head `c10294b1a69afd50b2458fee305ef59b321274e1` passed CI #602;
- PR #133 clean gate -> exact-head squash merge `f3f00b86537af8d0862a15113778458a777358ca`, independently verified live;
- closure PR #134 records the final completed state.

Permanent evidence remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0. Gameplay distribution remains 900/900 with 27 patterns, `choice_grid` 322/900, `spatial_transform` 5/900, Science 60/100 and Logic 52/100. Simulations remain zero invariant errors; Batch17 totals remain unchanged and physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

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
- WS-05 NEXT — fresh Pattern #28 objective/evidence audit from the verified 27-pattern baseline; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #27 itself is fully closed once closure PR #134 is exact-head merged and independently verified live on `main`.
