# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

PR #104 implementation-head CI #465 audits all **9 subjects / 900 activities** after Sorting Buckets merge and Drag-to-Target implementation:

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

The deterministic audit is clean, but repeated templates remain useful prioritization signals. Repetition is not automatically a quality failure; diversify only when the new mechanic better serves the objective and preserves evidence semantics.

Current state:
- `symbol_hunt` — **DONE**, 74 direct-literacy activities; canonical choice evidence preserved.
- `memory_pair` — **DONE / PR #101**, exactly 12 Letters case-matching activities; canonical `matching` evidence preserved.
- `missing_sequence_slot` — **DONE / PR #102**, exactly 10 `letters-order-*` activities; canonical `tap_choice` contract preserved; explicit fidelity `choice_sequence_interaction`.
- `sorting_buckets` — **DONE / PR #103**, exactly 5 basic Logic classification activities; canonical `tap_choice` identity preserved; explicit fidelity `choice_sorting_interaction`.
- `drag_to_target` — **QA / PR #104**, exactly 5 reviewed Science Wave A matching activities; canonical `matching`, matchItems/pair ids and assessed semantics preserved; explicit fidelity `matching_drag_target_interaction`.

PR #104 QA evidence:
- static presentation regression reports **12 memory_pair + 5 drag_targets + 10 sequence_slot + 5 sorting_buckets** activities;
- exact Science ID + stage + 3-pair guard prevents other matching families from being silently reclassified;
- browser QA covers valid Science foundation prerequisites, keyboard wrong placement, real mouse drag, touch fallback, completion/evidence persistence, >=44px controls, no horizontal overflow, and 320/390/768 screenshots;
- wrong placement increments incorrect/retry without consuming a pair; all three correct pairs are required for completion;
- manual visual review accepted idle/error/success screenshots at 320, 390 and 768, including an in-viewport 320 success CTA;
- CI #465 on implementation head `722391fe049b3e055ab69e16140141bdf971268b` is full success;
- deterministic activity quality remains **900 KEEP / 0 flagged**, structural=0.

Next WS-05 work after #104 closes: mechanic-distribution audit, then separate `reorder_cards` / `tap_in_order` waves where the objective genuinely requires multi-step ordering.

## Permanent audit

```bash
npm run qa:activity-quality
```

Outputs:

```text
.qa/activity-quality/report.json
.qa/activity-quality/report.md
```

CI uploads `activity-quality-audit`.

Blocking structural rules: `Q001` missing catalog spec, `Q002` assessed without skill, `Q003` creative marked assessed, `Q004` invalid choice contract, `Q005` invalid matching contract.

Advisory rules Q101–Q108 do not replace human pedagogical/visual review.

## Wave status

- Wave A DONE — PR #91, merge `7a087d590381dd4487811027690ac187ff87954b`.
- Wave B DONE — PR #92, merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`.
- Wave C / Symbol Hunt DONE — PR #93, merge `85aea0e5843f251eb83e5aa62180268b75455cfa`.
- WS-06 Coloring DONE — PR #95/#96; Q108=0.
- WS-07 Drawing DONE — PR #98/#99/#100; Q106=0.
- WS-05 Memory Pair DONE — PR #101, merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- WS-05 Sequence Slot DONE — PR #102, merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- WS-05 Sorting Buckets DONE — PR #103, merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`.
- WS-05 Drag-to-Target QA — PR #104; implementation-head CI #465 full green; visual review accepted; docs-head CI required before merge.
- WS-05 NEXT — mechanic-distribution audit, then objective-driven ordering/search/math/audio/puzzle/literacy/science/story waves.
- Wave E LATER — human subject-by-subject review for age fit, ambiguity, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

Deterministic WS-04 triage is clean at 900/900 KEEP. Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
