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
- `set_reasoning` — PR #130 + closure #131 — **FULLY CLOSED**.

Current merged distribution:

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

## Set Reasoning — FULLY CLOSED

Exact scope:

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

Preserved:
- canonical runtime `tap_choice`;
- three choices/`correctChoice`;
- assessment and stars;
- mastery/progression and canonical skill `logic.set.relation.basic`;
- activity IDs and completion semantics;
- Logic stage `logic-mixed-reasoning-challenge` / lesson `logic-set-reasoning` / pack `logic.pack.set-reasoning` identity.

Interaction/evidence:
- explicit two-rule set board makes membership/exclusion logic visible;
- operation is explicit for intersection, set difference or outside-union;
- canonical choices remain accessible direct-selection buttons;
- wrong choice is measured/retryable and cannot complete;
- assessed fidelity `choice_set_reasoning_interaction`;
- exact five-ID allowlist prevents unrelated Logic activities from reclassification;
- no false Venn geometry, invented intermediate assessment, changed answer set, extra confirmation or drag-only dependency.

Acceptance/closure chain:
- CI #583 rejected a stale Rule Pipeline sentinel.
- CI #584 passed automation but manual visual QA rejected 320x720 idle/try clipping.
- implementation head `acc5ce9d5661818842effcd120346ded3891dd50` passed CI #586 / run `34969198343` and manual visual QA.
- final implementation/docs head `a725e567898a07bfd4977d5015a179c7a6d88ab2` passed CI #591 / run `34971570563`.
- PR #130 clean gate -> exact-head squash merge `678c2b0ec73910181f4a8a8e804f83f0fe0d0392`, independently verified live.
- closure head `3e9ea7300290c94e8774068b80cf028d7f3dcd90` passed CI #593 / run `34972491678`.
- PR #131 clean gate: open, non-draft, mergeable, 0 comments, 0 reviews, 0 review threads.
- exact-head squash merge #131 -> `3a07bec3f09381d2ba02726e5b67a71f9f5dc626`, independently verified live on `main`.

Permanent evidence remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0. Gameplay distribution remains 900/900 with 26 patterns, `choice_grid` 327/900, `set_reasoning` 5/900, Science 60/100 and Logic 57/100. Simulations remain zero invariant errors; Batch17 totals remain unchanged and physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

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
- WS-05 Set Reasoning DONE — PR #130 + closure #131.
- WS-05 NEXT — fresh Logic exact-family audit from the verified 26-pattern baseline; no Pattern #27 family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #26 itself is fully closed.
