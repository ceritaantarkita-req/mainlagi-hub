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
- `count_and_select` — PR #106, exactly 9 Math counting activities.
- `number_line` — PR #108, exactly 6 Math Wave B ordering activities.
- `more_less_balance` — PR #109, exactly 6 Math Wave B comparison activities.
- `pattern_completion` — PR #110, exactly 5 Math Wave B choice-pattern activities; merge `6c5566ea9465a26399f9c4637f252d316552636d`.

Current merged distribution after PR #110:

```text
900 / 900 classified
0 unclassified
17 active patterns
choice_grid          366 / 900 = 40.67%
pattern_completion     5 / 900 = 0.56%
Math choice_grid       56 / 100
Science choice_grid    79 / 100
Logic choice_grid      77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## Pattern Completion — DONE / PR #110

Exactly five reviewed Math Wave B choice activities use `pattern_completion`:

```text
math-pattern-ab-shapes
math-pattern-aab-colors
math-pattern-number-step-one
math-pattern-number-step-two
math-pattern-size
```

Preserved:
- canonical runtime `tap_choice`;
- choices/correctChoice;
- skill `math.pattern.sequence`;
- assessment;
- stars;
- progression;
- activity IDs and completion semantics.

Interaction/evidence:
- visible pattern strip with one explicit next-slot;
- repeating/step structure comes from explicit per-activity config;
- wrong answer may be shown in the slot but cannot complete;
- assessed fidelity `choice_pattern_completion_interaction`;
- exact five-ID allowlist prevents unrelated Math or matching activities from reclassification.

Accepted QA:
- implementation CI #503 full green;
- final docs-head CI #508 full green;
- representative browser route `math-pattern-aab-colors` keeps progression guard enabled with legitimate previous-stage readiness;
- keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px controls, no horizontal overflow, and CTA visibility all pass;
- manual visual review accepted idle/error/success at 320, 390, and 768;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural=0.

## Next audit-guided family

Math is now below the >60% subject concentration threshold. Science remains at 79% `choice_grid`, followed by Logic at 77%.

The strongest next Science candidate currently identified is the four-activity Wave B water-change family for `cause_effect`:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

This family shares lesson/skill `science.water.state_changes.basic` and explicitly asks the child to connect a condition with an observable result. The matching activity `science-match-water-states-b` should remain canonical matching in that wave.

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
- WS-05 Pattern Completion DONE — PR #110, merge `6c5566ea9465a26399f9c4637f252d316552636d`.
- WS-05 NEXT — exact Science `cause_effect` water-change family, subject to fresh branch QA from latest `main`.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
