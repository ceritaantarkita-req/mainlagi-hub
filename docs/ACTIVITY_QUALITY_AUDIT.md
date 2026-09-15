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

Active accepted/unmerged wave:
- `set_reasoning` — PR #130 — **QA ACCEPTED / UNMERGED**.

Current merged distribution on verified `main` before Pattern #26:

```text
900 / 900 classified
0 unclassified
25 active merged patterns
choice_grid                 332 / 900 = 36.89%
transitive_chain              5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            62 / 100
```

Accepted PR #130 distribution:

```text
900 / 900 classified
0 unclassified
26 active PR-head patterns
choice_grid                 327 / 900 = 36.33%
set_reasoning                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Set Reasoning — QA ACCEPTED / UNMERGED

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
- composed rules, transitive comparison, spatial transforms and other Logic families stay outside scope;
- no false Venn geometry, invented intermediate assessment, changed answer set, extra confirmation or drag-only dependency.

Acceptance history:
- CI #583 / run `34968050234` rejected a stale Rule Pipeline sentinel; the fix removed only the obsolete `default/choice_grid` expectation while preserving Rule Pipeline exact-family scope.
- CI #584 / run `34968353606` passed automated jobs but was rejected manually because 320x720 idle/try feedback was clipped.
- responsive CSS was tightened specifically for narrow phone height/width and browser QA was strengthened so feedback and CTA must be fully inside the viewport.
- accepted implementation head `acc5ce9d5661818842effcd120346ded3891dd50` passed CI #586 / run `34969198343`.
- CI #586 gameplay-presentation regression reports exactly `5 set_reasoning`; dedicated exact-family regression passes.
- activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0.
- gameplay distribution is **900/900, 26 patterns, `choice_grid` 327/900, `set_reasoning` 5/900, Science 60/100, Logic 57/100**.
- five simulations report zero invariant errors; Batch17 totals remain **9 / 900 / 683 / 217 / 46 / 197 / 197 / 200**.
- manual review accepted new idle/try/success screenshots at 320x720, 390x844 and 768x1024 with no clipping, overlap or horizontal overflow.
- physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

PR #130 is still unmerged. Deterministic QA acceptance does not equal shipped/fully closed state.

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
- WS-05 Set Reasoning QA ACCEPTED / UNMERGED — PR #130.
- WS-05 NEXT — only after Pattern #26 closure: fresh exact-family audit; no next family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #26 itself is not fully closed until PR #130 and its required post-merge docs closure are merged and live-verified.
