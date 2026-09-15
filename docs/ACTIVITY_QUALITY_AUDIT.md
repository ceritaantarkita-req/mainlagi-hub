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

Fully merged/closed waves through the verified 26-pattern baseline:
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
- `set_reasoning` — PR #130 + closure #131 + metadata #132 — **FULLY CLOSED**.

Verified merged baseline after #132: `7e3192898e37743826266c92c6c12a918d72e508`.

```text
900 / 900 classified
0 unclassified
26 active merged patterns
choice_grid                 327 / 900 = 36.33%
set_reasoning                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Spatial Transform — Pattern #27 — QA ACCEPTED / UNMERGED PR #133

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
- exactly three choices and unchanged `correctChoice`;
- assessment and stars;
- mastery/progression and canonical skill `logic.spatial.transform.basic`;
- activity IDs and completion semantics;
- stage `logic-mixed-reasoning-challenge` / lesson `logic-spatial-transform` / pack `logic.pack.spatial-transform` identity.

Interaction/evidence:
- visible starting direction and canonical transform operation;
- final direction remains hidden as `?` until the child answers;
- canonical choices remain accessible direct-selection buttons;
- wrong choice is measured/retryable and cannot complete;
- correct choice completes the canonical activity;
- assessed fidelity `choice_spatial_transform_interaction`;
- exact five-ID allowlist prevents unrelated Logic activities from reclassification;
- Wave B spatial-relation activities remain outside the family;
- no answer leakage, invented intermediate assessment, changed answer set, extra confirmation or drag-only dependency.

Accepted implementation head `267f00d243dc1778c2d86e5a0ca70d8cfe76872a` passed full CI #597 / run `34976080767`.

Permanent evidence from that run:

```text
900 / 900 classified
0 unclassified
27 PR-head patterns
choice_grid                 322 / 900 = 35.78%
spatial_transform             5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            52 / 100
activity quality             900 KEEP / 0 flagged / structural 0
simulations                  5 runs / invariantErrors 0
```

Batch17 remains **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills** and physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

Browser QA passed 320x720, 390x844 and 768x1024 with canonical Wave C prerequisite evidence, keyboard wrong-state, pointer completion, hidden-result guard, >=44px controls, no horizontal overflow, fully visible feedback/CTA, assessed evidence, and zero console/page errors. Manual review accepted all nine idle/try/success screenshots.

Pattern #27 remains unmerged until the finalized docs-head full CI and clean review gate pass. The 27-pattern distribution is therefore a PR-head fact, not yet the merged product baseline.

## Set Reasoning — FULLY CLOSED

Set Reasoning implementation PR #130, closure PR #131 and metadata PR #132 remain fully closed at the verified baseline. Pattern #27 does not change its exact five-ID family, evidence fidelity `choice_set_reasoning_interaction`, runtime, mastery or progression.

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
- WS-05 Odd One Out DONE — PR #125 + closure #126.
- WS-05 Transitive Chain DONE — PR #127 + closure #128 + metadata #129.
- WS-05 Set Reasoning DONE — PR #130 + closure #131 + metadata #132.
- WS-05 Spatial Transform — **QA ACCEPTED / UNMERGED PR #133**.
- WS-05 NEXT — only after #133 exact-head merge + live verification + post-merge closure are complete, run a fresh Pattern #28 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #27 itself cannot be called fully closed until PR #133 and its required post-merge docs closure are both merged and independently verified live on `main`.
