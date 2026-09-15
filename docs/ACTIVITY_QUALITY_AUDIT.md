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
- `pattern_completion` — PR #110, exactly 5 Math Wave B choice-pattern activities.

Active accepted-QA wave:
- `cause_effect` — PR #112, exactly 4 Science Wave B water-change choice activities; **not merged yet**.

Merged distribution before PR #112:

```text
900 / 900 classified
0 unclassified
17 active patterns
choice_grid          366 / 900 = 40.67%
Math choice_grid       56 / 100
Science choice_grid    79 / 100
Logic choice_grid      77 / 100
```

PR #112 accepted-QA distribution:

```text
900 / 900 classified
0 unclassified
18 active patterns
choice_grid          362 / 900 = 40.22%
cause_effect           4 / 900 = 0.44%
Math choice_grid       56 / 100
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## Cause/Effect — accepted QA / PR #112

Exactly four reviewed Science Wave B choice activities use `cause_effect` on the PR head:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

`science-match-water-states-b` intentionally stays canonical matching / `visible_matching`.

Preserved:
- canonical runtime `tap_choice`;
- choices/correctChoice;
- skill `science.water.state_changes.basic`;
- assessment;
- stars;
- progression;
- activity IDs and completion semantics.

Interaction/evidence:
- visible **Awal -> Kondisi -> Hasil** causal flow;
- result is unrevealed before the child chooses;
- process semantics come from explicit per-activity config;
- wrong answer may be shown as feedback but cannot complete;
- assessed fidelity `choice_cause_effect_interaction`;
- exact four-ID allowlist prevents unrelated Science activities from reclassification.

Accepted implementation QA head: `ad5f427afc9cb0c755872ee88588534066942d47`.

Evidence:
- CI #513 full green across Ubuntu, Windows, production build, dependency audit, secret-history scan, and Mobile Chromium;
- representative browser route `science-water-ice-melts` keeps progression guard enabled with legitimate Science Wave A readiness;
- keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px controls, and no horizontal overflow pass;
- CI #512 caught a real 320x720 success-CTA clipping bug; compact layout was fixed and #513 passed CTA visibility;
- manual visual review accepted idle/error/success at 320, 390, and 768;
- activity-quality artifact at the accepted head remains **900 KEEP / 0 flagged**, structural findings 0.

## Next audit-guided family

After #112 merges, Science will still be at 75% `choice_grid`, above the >60% subject concentration advisory threshold. The next action is therefore another exact-family Science audit, not an automatic conversion.

Prediction/investigation, materials/properties, observation/measurement, environment reasoning, and other Science families must be reviewed separately so each new mechanic has a coherent learning objective and evidence contract.

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
- WS-05 Cause/Effect — **accepted implementation QA / PR #112; final docs-head CI + merge pending**.
- WS-05 NEXT after #112 — exact-family Science audit, then objective-fit mechanic selection.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
