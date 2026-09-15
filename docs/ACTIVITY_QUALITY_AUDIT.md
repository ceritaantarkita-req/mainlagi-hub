# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

All **9 subjects / 900 activities** remain deterministically clean on merged `main` `a961be0e61055f7347244b58b9dc252d5ed6f382`:

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
- `odd_one_out` — PR #125, exactly 5 Logic Wave A discrimination activities; docs closure #126.

Current active gameplay QA wave: PR #127 `transitive_chain` — **QA ACCEPTED / UNMERGED**.

Merged distribution after Odd One Out closure:

```text
900 / 900 classified
0 unclassified
24 active merged patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

PR #127 accepted implementation head distribution:

```text
900 / 900 classified
0 unclassified
25 active PR-head patterns
choice_grid                 332 / 900 = 36.89%
transitive_chain              5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            62 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Transitive Chain — PR #127 QA ACCEPTED / UNMERGED

Exact scope:

```text
logic-transitive-height-abc
logic-transitive-shortest-xyz
logic-transitive-most-dots
logic-transitive-lightest
logic-transitive-middle-order
```

Preserved:
- canonical runtime `tap_choice`;
- choices/`correctChoice`;
- assessment and stars;
- progression and canonical skill `logic.comparison.transitive.basic`;
- activity IDs and completion semantics;
- Logic stage `logic-mixed-reasoning-challenge` / lesson `logic-transitive-comparison` identity.

Interaction/evidence:
- canonical three entities are shown as one chain with two visible premises;
- canonical choices remain accessible direct-selection buttons;
- wrong choice is measured/retryable and cannot complete;
- assessed fidelity `choice_transitive_chain_interaction`;
- exact five-ID allowlist prevents unrelated Logic activities from reclassification;
- composed rules, set reasoning, spatial, Wave C inference/ordering and Wave B comparison/spatial tasks stay outside this scope;
- no invented numeric quantities, extra assessed step, reordering requirement or drag-only dependency.

QA history and accepted implementation evidence:
- CI #569 was correctly rejected after a stale Rule Pipeline exclusion sentinel named one newly promoted Transitive Chain activity as `default`; only that sentinel was replaced with unrelated `logic-infer-not-red`, preserving the old exact-scope guard;
- CI #570 passed all non-browser gates but Mobile correctly blocked the 390x844 completed state because the success CTA fell below the viewport;
- completed phone-sized state now hides only the already-consumed prompt and premise chain while retaining the question, canonical answer trio, success explanation and CTA; idle/retry keep the full chain and touch targets were not reduced;
- accepted implementation head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833` passed full CI #572 / run `34957824566`;
- Ubuntu and Windows typecheck/lint/engine gates passed;
- production build and budgets, dependency audit and secret-history scan passed;
- gameplay-presentation regression reports exactly `5 transitive_chain` activities and dedicated exact-family regression passes;
- representative browser route uses canonical Logic Wave C readiness before entering the Wave D target;
- keyboard wrong-state, pointer completion, assessed evidence persistence, >=44px controls, no horizontal overflow, two-premise layout and CTA visibility all pass at 320/390/768;
- manual screenshot review accepted #572 idle/try/success screenshots at 320x720, 390x844 and 768x1024, including the repaired 390 success state;
- activity-quality audit verifies **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0;
- gameplay-distribution audit verifies 900/900, 25 PR-head patterns, global `choice_grid` 332/900, `transitive_chain` 5/900, Science 60/100 and Logic 62/100;
- simulations all report `invariantErrors: 0`;
- Batch17 final acceptance passes with 9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons/packs and 200 skills; physical-device certification remains pending external evidence.

Regression history is retained intentionally: #569 and #570 are not acceptance runs. #572 is the accepted **implementation-head** run. Canonical docs finalization changes the PR SHA and therefore requires a new full final docs-head CI before merge.

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
- WS-05 Transitive Chain — PR #127 **QA ACCEPTED / UNMERGED**; final docs-head CI, merge and closure remain.
- WS-05 NEXT AFTER CLOSURE — fresh Logic exact-family audit; no next family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #25 must not be called merged or fully closed until PR #127 exact-head merge, live-main verification and its required docs-only post-merge closure are complete.
