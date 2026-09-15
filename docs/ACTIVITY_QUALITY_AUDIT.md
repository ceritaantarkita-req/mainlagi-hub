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
- `cause_effect` — PR #112, exactly 4 Science Wave B water-change choice activities.
- `compare_properties` — PR #114, exactly 3 Science Wave C direct-comparison activities.

Current active QA wave:
- `material_lab` — PR #116, exactly 4 Science Wave D material-purpose activities; **accepted implementation QA but unmerged**.

Merged distribution after PR #114:

```text
900 / 900 classified
0 unclassified
19 active patterns
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

PR #116 measured QA distribution:

```text
900 / 900 classified
0 unclassified
20 active patterns on PR head
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## Material Lab — ACCEPTED IMPLEMENTATION QA / PR #116 / UNMERGED

Exact scope:

```text
science-material-raincoat-waterproof
science-material-window-transparent
science-material-towel-absorbent
science-material-toy-block-rigid
```

Explicit exclusion:

```text
science-match-material-purpose-d
```

Preserved:
- canonical runtime `tap_choice`;
- choices/correctChoice;
- assessment and stars;
- progression and skill identity;
- activity IDs and completion semantics;
- Wave D stage identity.

Interaction/evidence:
- child chooses one material-property sample and then explicitly tests it against the visible object purpose;
- selection alone cannot complete;
- wrong tested sample is measured/retryable and cannot complete;
- assessed fidelity `choice_material_lab_interaction`;
- exact four-ID allowlist prevents unrelated Science activities from reclassification.

Accepted evidence:
- CI #532 blocked an accidental package regression before acceptance;
- existing `@phosphor-icons/react` dependency was restored at `^2.1.10`;
- implementation head `09dd638748d62da1da264ce3b4f6f8f6880354b7` passed full CI #533;
- representative route uses legitimate Science Wave C readiness to unlock Wave D;
- keyboard selection, explicit test action, false-completion guards, pointer completion, assessed evidence persistence, >=44px controls, no horizontal overflow, and CTA visibility all pass at 320/390/768;
- manual visual review accepted idle/error/success at 320x720, 390x844 and 768x1024;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0.

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
- WS-05 Material Lab — **ACCEPTED QA / PR #116; final docs-head CI + merge pending**.
- WS-05 NEXT — after #116, continue fresh objective-driven Science audit, then Logic.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
