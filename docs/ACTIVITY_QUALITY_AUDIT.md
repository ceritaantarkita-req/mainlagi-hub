# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.**

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

All subjects remain 100 KEEP / 0 flagged. Q101–Q108 remain zero. Deterministic zero does not mean every activity is human-approved or maximally varied.

## WS-05 merged gameplay state

Merged through PR #109:
- `memory_pair` — #101
- `missing_sequence_slot` — #102
- `sorting_buckets` — #103
- `drag_to_target` — #104
- permanent gameplay-distribution audit — #105
- `count_and_select` — #106
- `number_line` — #108
- `more_less_balance` — #109, merge `8a54534ac285013d22d2fc458bb302ae1fe1a87b`

Merged distribution after #109:

```text
900 / 900 classified
0 unclassified
16 active patterns
choice_grid          371 / 900 = 41.22%
Math choice_grid      61 / 100
Science choice_grid   79 / 100
Logic choice_grid     77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## PR #110 QA — Pattern Completion

Exactly five reviewed Math Wave B choice activities use `pattern_completion`:

```text
math-pattern-ab-shapes
math-pattern-aab-colors
math-pattern-number-step-one
math-pattern-number-step-two
math-pattern-size
```

`math-pattern-match-ab` and `math-pattern-match-aab` remain matching / `visible_matching` and are explicitly regression-tested against accidental reclassification.

Preserved:
- runtime `tap_choice`;
- choices/correctChoice;
- skill `math.pattern.sequence`;
- assessment, stars, progression;
- activity IDs and completion semantics.

Interaction/evidence:
- explicit observed pattern strip + next-slot;
- pattern structure is data-configured per activity;
- wrong answer increments incorrect/retry and cannot complete;
- assessed fidelity `choice_pattern_completion_interaction` records pattern kind, visual mode, and observed sequence;
- exact 5-ID allowlist prevents scope spillover.

QA at implementation head `6d79bf3716b65657da67ff0078767800b76b22ed`:
- CI #503 full green across Ubuntu, Windows, build, dependency audit, secret scan, and mobile Chromium;
- representative `math-pattern-aab-colors` keeps progression guard enabled with legitimate previous-stage readiness;
- exact AAB sequence `🔴 🔴 🔵 🔴 🔴`, canonical choices `🔴/🔵/🟡`, keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, touch-target, overflow, and CTA checks pass;
- manual visual review accepted idle/error/success at 320, 390, 768;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural findings 0.

Measured PR #110 distribution:

| Pattern / metric | Result |
|---|---:|
| classified | 900 / 900 |
| unclassified | 0 |
| active patterns | 17 |
| `choice_grid` | 366 / 900 = 40.67% |
| `pattern_completion` | 5 / 900 = 0.56% |
| Math `choice_grid` | 56 / 100 |
| Science `choice_grid` | 79 / 100 |
| Logic `choice_grid` | 77 / 100 |

Delta from PR #109 merged baseline: global `choice_grid` 371 -> 366 and Math `choice_grid` 61 -> 56. Math therefore leaves the >60% subject hotspot set.

## Permanent audits

```bash
npm run qa:activity-quality
npm run qa:gameplay-distribution
```

Coverage and active-pattern-set consistency are blocking; concentration remains advisory.

## Wave status

- WS-04 deterministic triage DONE — 900 KEEP / 0 flagged.
- WS-06 Coloring DONE — #95/#96.
- WS-07 Drawing DONE — #98/#99/#100.
- WS-05 Memory Pair DONE — #101.
- WS-05 Sequence Slot DONE — #102.
- WS-05 Sorting Buckets DONE — #103.
- WS-05 Drag-to-Target DONE — #104.
- WS-05 Gameplay Distribution Audit DONE — #105.
- WS-05 Count-and-Select DONE — #106.
- WS-05 Number Line DONE — #108.
- WS-05 More/Less Balance DONE — #109, merge `8a54534ac285013d22d2fc458bb302ae1fe1a87b`.
- WS-05 Pattern Completion QA — #110; implementation/browser/visual accepted; docs-head CI + review checks + merge still required.
- WS-05 NEXT after #110 — exact-family Science audit, then Logic, because current choice concentration is Science 79% and Logic 77% while Math is 56%.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
