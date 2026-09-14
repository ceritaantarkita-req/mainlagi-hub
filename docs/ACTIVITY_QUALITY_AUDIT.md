# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

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

Current merged distribution:

```text
900 / 900 classified
0 unclassified
14 active patterns
choice_grid         383 / 900 = 42.56%
count_and_select      9 / 900 = 1.00%
Math choice_grid     73 / 100
Science choice_grid  79 / 100
Logic choice_grid    77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## PR #108 QA — Number Line

Exactly six reviewed Math Wave B ordering activities use `number_line` presentation:

```text
math-order-next-1-2
math-order-next-3-4
math-order-before-6
math-order-between-6-8
math-order-descend-5
math-order-descend-10
```

Preserved:
- canonical runtime `tap_choice`;
- choices/correctChoice;
- skill `math.number.ordering`;
- assessment;
- stars;
- progression;
- activity IDs and completion semantics.

Interaction/evidence:
- compact five-tick local number line;
- explicit configured context for direction/sequence;
- only canonical three choices are interactive;
- wrong answer increments incorrect/retry and does not complete;
- assessed fidelity `choice_number_line_interaction` includes direction/range/context metadata;
- exact ID allowlist prevents Wave C missing-number or other Math families from reclassification.

QA evidence at implementation head `6b92ff922b6878d6ff1a88b1162f6adc9beee05f`:
- CI #489 full green across Ubuntu, Windows, build, dependency audit, secret scan and mobile Chromium;
- representative browser route keeps progression guard enabled with legitimate Wave A readiness;
- keyboard wrong-state, pointer completion, evidence persistence, >=44px controls, no horizontal overflow and CTA visibility all pass;
- manual visual review accepted idle/error/success at 320, 390 and 768;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural=0.

Measured PR #108 distribution:

| Pattern | Activities | Share |
|---|---:|---:|
| `choice_grid` | 377 | 41.89% |
| `visible_matching` | 108 | 12.00% |
| `coloring_canvas` | 100 | 11.11% |
| `drawing_canvas` | 100 | 11.11% |
| `listen_choose` | 76 | 8.44% |
| `symbol_hunt` | 74 | 8.22% |
| `guided_trace` | 14 | 1.56% |
| `memory_pair` | 12 | 1.33% |
| `missing_sequence_slot` | 10 | 1.11% |
| `count_and_select` | 9 | 1.00% |
| `number_line` | 6 | 0.67% |
| `drag_to_target` | 5 | 0.56% |
| `sorting_buckets` | 5 | 0.56% |
| `motion_game` | 3 | 0.33% |
| `story_read` | 1 | 0.11% |

Math `choice_grid` falls **73 -> 67**; global `choice_grid` falls **383 -> 377**. Coverage remains 900/900 with 0 unclassified and 15 active patterns on the PR.

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
- WS-05 Number Line QA — PR #108; implementation/browser/visual accepted, docs-head CI required before merge.
- WS-05 likely NEXT after #108 — exact six Wave B compare activities for `more_less_balance`, subject to final family review on latest main.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
