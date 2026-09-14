# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

PR #106 implementation-head CI #480 audits all **9 subjects / 900 activities** after the permanent gameplay-distribution audit landed on `main`:

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

## Resolved deterministic rules

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`: 3 -> 0.
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`: 6 -> 0.
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`: 26 -> 0.
- `Q104_EARLY_AGE_READING_LOAD`: 8 -> 0.
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`: 83 -> 0.
- `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: 75 -> 50 -> 25 -> 0.
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`: 0.
- `Q108_DUPLICATE_COLORING_GEOMETRY`: 59 -> 20 -> 0.

## WS-06 Coloring

DONE. All 100 remain creative practice; Q108=0. Runtime geometry validation and preview regeneration remain active.

## WS-07 Drawing

DONE. All 100 have functional activity-specific scaffolds. Q106=0. Human visual review corrected overly prescriptive guides before final acceptance; scaffolds never count as child strokes or synthetic completion.

## WS-05 gameplay diversification

Merged waves:
- `symbol_hunt` — 74 direct-literacy activities.
- `memory_pair` — PR #101, 12 Letters case-matching activities.
- `missing_sequence_slot` — PR #102, 10 Letters order activities.
- `sorting_buckets` — PR #103, 5 basic Logic classification activities.
- `drag_to_target` — PR #104, 5 reviewed Science Wave A matching activities.
- permanent gameplay-distribution audit — PR #105, merge `02d4696760d7b697cfd319804cd655c0d2bfec4c`.

Merged PR #105 baseline:

```text
900 / 900 classified
0 unclassified
13 active patterns
choice_grid 392 / 900 = 43.56%
Math choice_grid 82 / 100
Science choice_grid 79 / 100
Logic choice_grid 77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## PR #106 QA — Count-and-Select

Exactly 9 reviewed Math counting activities (`math-count-2` through `math-count-10`) use reusable `count_and_select` presentation.

Boundaries:
- canonical runtime stays `tap_choice`;
- choices/correctChoice, skill, assessment, stars, progression, activity ID, and completion identity remain unchanged;
- explicit assessed fidelity is `choice_count_interaction`;
- wrong answer increments incorrect/retry and does not complete;
- exact ID allowlist prevents unrelated Math activities from reclassification.

QA evidence:
- CI #480 at implementation head `871677650ecc9e2e86618fb5f81b342b0b370c85` full green across Ubuntu, Windows, production build, dependency audit, secret scan, and mobile Chromium;
- browser QA covers valid Math prerequisite readiness, keyboard wrong-state, pointer completion, canonical four-star rendering for `math-count-4`, evidence persistence, >=44px controls, no horizontal overflow, and 320/390/768 screenshots;
- manual visual review accepted idle/error/success at 320, 390, and 768;
- deterministic activity quality stays **900 KEEP / 0 flagged**, structural=0.

Measured PR #106 distribution:

| Pattern | Activities | Share |
|---|---:|---:|
| `choice_grid` | 383 | 42.56% |
| `visible_matching` | 108 | 12.00% |
| `coloring_canvas` | 100 | 11.11% |
| `drawing_canvas` | 100 | 11.11% |
| `listen_choose` | 76 | 8.44% |
| `symbol_hunt` | 74 | 8.22% |
| `guided_trace` | 14 | 1.56% |
| `memory_pair` | 12 | 1.33% |
| `missing_sequence_slot` | 10 | 1.11% |
| `count_and_select` | 9 | 1.00% |
| `drag_to_target` | 5 | 0.56% |
| `sorting_buckets` | 5 | 0.56% |
| `motion_game` | 3 | 0.33% |
| `story_read` | 1 | 0.11% |

Math `choice_grid` falls 82 -> 73. Global `choice_grid` falls 392 -> 383. The global hotspot still remains above the 35% planning threshold, so WS-05 continues.

## Permanent audits

Activity quality:

```bash
npm run qa:activity-quality
```

Gameplay distribution:

```bash
npm run qa:gameplay-distribution
```

CI uploads both artifacts. Gameplay-distribution coverage and active-pattern-set consistency are blocking; concentration remains advisory.

## Wave status

- Wave A DONE — PR #91.
- Wave B DONE — PR #92.
- Wave C / Symbol Hunt DONE — PR #93.
- WS-06 Coloring DONE — PR #95/#96.
- WS-07 Drawing DONE — PR #98/#99/#100.
- WS-05 Memory Pair DONE — PR #101.
- WS-05 Sequence Slot DONE — PR #102.
- WS-05 Sorting Buckets DONE — PR #103.
- WS-05 Drag-to-Target DONE — PR #104.
- WS-05 Gameplay Distribution Audit DONE — PR #105.
- WS-05 Count-and-Select QA — PR #106; implementation/browser/visual accepted, docs-head CI required before merge.
- WS-05 NEXT — exact-family Math review for `number_line`, `more_less_balance`, `pattern_completion`, then broader audit-guided waves.

## Completion rule

Deterministic WS-04 triage is clean at 900/900 KEEP. Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
