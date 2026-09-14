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

Accepted deterministic progression remains:

```text
Wave A          640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B          683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C          766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A    805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B    825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
WS-07 Wave A    850 KEEP /  50 POLISH /  0 REDESIGN / 0 REPLACE —  50 flagged
WS-07 Wave B    875 KEEP /  25 POLISH /  0 REDESIGN / 0 REPLACE —  25 flagged
WS-07 Final     900 KEEP /   0 POLISH /  0 REDESIGN / 0 REPLACE —   0 flagged
```

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
- `number_line` — PR #108, exactly 6 Math Wave B ordering activities, merge `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`.

Current merged distribution after PR #108:

```text
900 / 900 classified
0 unclassified
15 active patterns
choice_grid         377 / 900 = 41.89%
number_line           6 / 900 = 0.67%
count_and_select      9 / 900 = 1.00%
Math choice_grid     67 / 100
Science choice_grid  79 / 100
Logic choice_grid    77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## PR #109 QA — More/Less Balance

Exactly six reviewed Math Wave B comparison activities use `more_less_balance`:

```text
math-compare-more-2-4
math-compare-less-5-3
math-compare-equal-4-4
math-compare-more-6-5
math-compare-less-7-9
math-compare-more-10-8
```

Preserved:
- canonical runtime `tap_choice`;
- choices/correctChoice;
- skill `math.quantity.comparison`;
- assessment;
- stars;
- progression;
- activity IDs and completion semantics.

Interaction/evidence:
- visible left/right quantity pans plus center equal control;
- canonical choices map explicitly to left/equal/right;
- beam remains neutral until correct completion so visual feedback cannot reveal the answer beforehand;
- wrong answer increments incorrect/retry and does not complete;
- assessed fidelity `choice_balance_comparison_interaction` includes comparison goal, left/right counts and correct-side metadata;
- exact ID allowlist prevents unrelated Math families from reclassification.

QA evidence at implementation head `9c71560e37a5dace1c79abea56d4cda625eb27c0`:
- CI #496 full green across Ubuntu, Windows, build, dependency audit, secret scan and mobile Chromium;
- representative browser route `math-compare-equal-4-4` keeps progression guard enabled with legitimate Wave A readiness;
- keyboard wrong-state, pointer completion through `Sama`, evidence persistence, >=44px controls, no horizontal overflow and CTA visibility all pass;
- manual visual review accepted idle/error/success at 320, 390 and 768;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural=0.

Measured PR #109 distribution:

| Pattern | Activities | Share |
|---|---:|---:|
| `choice_grid` | 371 | 41.22% |
| `visible_matching` | 108 | 12.00% |
| `coloring_canvas` | 100 | 11.11% |
| `drawing_canvas` | 100 | 11.11% |
| `listen_choose` | 76 | 8.44% |
| `symbol_hunt` | 74 | 8.22% |
| `guided_trace` | 14 | 1.56% |
| `memory_pair` | 12 | 1.33% |
| `missing_sequence_slot` | 10 | 1.11% |
| `count_and_select` | 9 | 1.00% |
| `more_less_balance` | 6 | 0.67% |
| `number_line` | 6 | 0.67% |
| `drag_to_target` | 5 | 0.56% |
| `sorting_buckets` | 5 | 0.56% |
| `motion_game` | 3 | 0.33% |
| `story_read` | 1 | 0.11% |

Math `choice_grid` falls **67 -> 61**; global `choice_grid` falls **377 -> 371**. Coverage remains 900/900 with 0 unclassified and 16 active patterns on the PR.

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
- WS-05 Number Line DONE — PR #108, merge `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`.
- WS-05 More/Less Balance QA — PR #109; implementation/browser/visual accepted, final docs-head CI required before merge.
- WS-05 likely NEXT after #109 — exact Wave B pattern family for `pattern_completion`, subject to fresh family review on latest main.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
