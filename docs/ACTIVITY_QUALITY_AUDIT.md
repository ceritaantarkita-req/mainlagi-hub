# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

All **9 subjects / 900 activities** remain deterministically clean on merged `main` `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`:

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
- `odd_one_out` — PR #125, exactly 5 Logic Wave A discrimination activities; closure #126.
- `transitive_chain` — PR #127, exactly 5 Logic Wave D transitive-comparison activities; post-merge closure active.

Current merged distribution:

```text
900 / 900 classified
0 unclassified
25 active merged patterns
choice_grid                 332 / 900 = 36.89%
transitive_chain              5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            62 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Transitive Chain — MERGED PR #127

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

Accepted and merged evidence:
- CI #569 was correctly rejected after a stale Rule Pipeline exclusion sentinel was surfaced; the old exact-scope guard remained active;
- CI #570 was correctly rejected after Mobile surfaced the completed 390x844 CTA overflow;
- accepted implementation head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833` passed full CI #572 / run `34957824566`;
- manual screenshot review accepted #572 idle/try/success screenshots at 320x720, 390x844 and 768x1024;
- final canonical-docs head `beb2e793ad3dfeb7ebb2b41c0f085b11d910f948` passed full CI #577 / run `34961404909`;
- final gate verified state open, draft false, mergeable true, 0 PR comments, 0 submitted reviews and 0 review threads;
- exact-head squash merge produced `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`, verified live on `main`;
- gameplay-presentation regression reports exactly `5 transitive_chain` activities and dedicated exact-family regression passes;
- activity-quality audit verifies **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0;
- gameplay-distribution audit verifies **900/900, 25 patterns, global `choice_grid` 332/900, `transitive_chain` 5/900, Science 60/100 and Logic 62/100**;
- simulations all report `invariantErrors: 0`;
- Batch17 final acceptance passes with 9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons/packs and 200 skills; physical-device certification remains pending external evidence.

Regression history is retained intentionally: #569 and #570 are not acceptance runs. #572 is accepted implementation QA and #577 is accepted final docs-head QA.

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
- WS-05 Transitive Chain — PR #127 **MERGED**, post-merge closure branch active.
- WS-05 NEXT AFTER CLOSURE — fresh Logic exact-family audit; no next family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #25 is code-merged; its docs-only post-merge closure must also merge before the wave is called fully closed.
