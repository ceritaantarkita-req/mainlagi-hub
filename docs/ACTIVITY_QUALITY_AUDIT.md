# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

PR #105 implementation-head CI #472 audits all **9 subjects / 900 activities** after Drag-to-Target merge and with the new gameplay-distribution audit enabled:

```text
symbol_hunt           74
structural findings    0
KEEP                  900
POLISH                  0
REDESIGN                0
REPLACE                 0
flagged total           0
```

| Subject | KEEP | POLISH | REDESIGN |
|---|---:|---:|---:|
| Bahasa Indonesia | 100 | 0 | 0 |
| English | 100 | 0 | 0 |
| Matematika | 100 | 0 | 0 |
| Iqro | 100 | 0 | 0 |
| Huruf & Menulis | 100 | 0 | 0 |
| Logika | 100 | 0 | 0 |
| Sains | 100 | 0 | 0 |
| Mewarnai | 100 | 0 | 0 |
| Menggambar | 100 | 0 | 0 |

Accepted deterministic progression:

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

Structural findings stayed 0. Q101–Q108 remain zero.

Deterministic zero does **not** mean all activities are human-approved or maximally varied. Gameplay diversity, art direction, real-device/accessibility, and Iqro expert review remain separate requirements.

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

The deterministic activity-quality audit is clean, but repetition still needs a separate gameplay-distribution view. Repetition is not automatically a quality failure; diversify only when the new mechanic better serves the objective and preserves evidence semantics.

Merged gameplay waves:
- `symbol_hunt` — **DONE**, 74 direct-literacy activities; canonical choice evidence preserved.
- `memory_pair` — **DONE / PR #101**, exactly 12 Letters case-matching activities; canonical `matching` evidence preserved.
- `missing_sequence_slot` — **DONE / PR #102**, exactly 10 Letters order activities; canonical `tap_choice` contract preserved; explicit fidelity `choice_sequence_interaction`.
- `sorting_buckets` — **DONE / PR #103**, exactly 5 basic Logic classification activities; canonical `tap_choice` identity preserved; explicit fidelity `choice_sorting_interaction`.
- `drag_to_target` — **DONE / PR #104**, exactly 5 reviewed Science Wave A matching activities; canonical `matching`, matchItems/pair ids and assessed semantics preserved; explicit fidelity `matching_drag_target_interaction`.

PR #104 merge: `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`.

## WS-05 gameplay-distribution audit — PR #105 QA

PR #105 adds one canonical child-facing pattern classifier and permanent CI audit without changing activity content or runtime behavior.

CI #472 on implementation head `d275dbb0f2b1acfa033fc0c99ecb77d0860d24bd` is full success.

Coverage:

```text
activities            900
classified            900
unclassified            0
active patterns        13
```

Measured distribution:

| Pattern | Activities | Share |
|---|---:|---:|
| `choice_grid` | 392 | 43.56% |
| `visible_matching` | 108 | 12.00% |
| `coloring_canvas` | 100 | 11.11% |
| `drawing_canvas` | 100 | 11.11% |
| `listen_choose` | 76 | 8.44% |
| `symbol_hunt` | 74 | 8.22% |
| `guided_trace` | 14 | 1.56% |
| `memory_pair` | 12 | 1.33% |
| `missing_sequence_slot` | 10 | 1.11% |
| `drag_to_target` | 5 | 0.56% |
| `sorting_buckets` | 5 | 0.56% |
| `motion_game` | 3 | 0.33% |
| `story_read` | 1 | 0.11% |

The only global advisory hotspot above 35% is `choice_grid` at **392/900 (43.56%)**.

Subject advisory hotspots above 60%:
- Mewarnai `coloring_canvas`: 100/100 — expected creative-medium specialization.
- Menggambar `drawing_canvas`: 100/100 — expected creative-medium specialization.
- Matematika `choice_grid`: **82/100**.
- Sains `choice_grid`: **79/100**.
- Logika `choice_grid`: **77/100**.
- Huruf & Menulis `symbol_hunt`: **64/100**.

These are planning signals, not automatic `POLISH`/`REDESIGN` findings. The activity-quality classification therefore correctly remains **900 KEEP / 0 flagged** while WS-05 continues to diversify mechanics.

### Next mechanic decision from the audit

Next planned wave: **Math `count_and_select`** for a reviewed coherent counting family.

Rationale:
- Math has the strongest non-creative `choice_grid` concentration at 82/100.
- Existing Math choice families include `math-count-*` (9), compare (6), order (6), pattern (5), and missing (5), among others.
- `count_and_select` directly matches the counting objective and can preserve canonical choice evidence while changing the child-facing interaction.

Do not mass-convert all Math choice activities. Follow-on mechanics (`number_line`, `more_less_balance`, `pattern_completion`, `make_total`) require their own family review and QA.

## Permanent audits

Activity quality:

```bash
npm run qa:activity-quality
```

Outputs:

```text
.qa/activity-quality/report.json
.qa/activity-quality/report.md
```

Gameplay distribution:

```bash
npm run qa:gameplay-distribution
```

Outputs:

```text
.qa/gameplay-distribution/report.json
.qa/gameplay-distribution/report.md
```

CI uploads both audit artifacts.

Blocking structural activity rules: `Q001` missing catalog spec, `Q002` assessed without skill, `Q003` creative marked assessed, `Q004` invalid choice contract, `Q005` invalid matching contract.

Gameplay-distribution blocking contracts: current 900-activity baseline coverage must be complete, no activity may be unclassified, counts must sum to the catalog, and the active pattern set must change intentionally. Concentration thresholds are advisory only.

Advisory rules Q101–Q108 and gameplay hotspots do not replace human pedagogical/visual review.

## Wave status

- Wave A DONE — PR #91, merge `7a087d590381dd4487811027690ac187ff87954b`.
- Wave B DONE — PR #92, merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`.
- Wave C / Symbol Hunt DONE — PR #93, merge `85aea0e5843f251eb83e5aa62180268b75455cfa`.
- WS-06 Coloring DONE — PR #95/#96; Q108=0.
- WS-07 Drawing DONE — PR #98/#99/#100; Q106=0.
- WS-05 Memory Pair DONE — PR #101, merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- WS-05 Sequence Slot DONE — PR #102, merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- WS-05 Sorting Buckets DONE — PR #103, merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`.
- WS-05 Drag-to-Target DONE — PR #104, merge `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`.
- WS-05 Gameplay Distribution Audit QA — PR #105; CI #472 full green at implementation head; docs-head CI required before merge.
- WS-05 NEXT — Math `count_and_select`, then audit-guided Math/Logic/Science/search/audio/ordering/puzzle/literacy/creative/story waves.
- Wave E LATER — human subject-by-subject review for age fit, ambiguity, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

Deterministic WS-04 triage is clean at 900/900 KEEP. Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
