# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS — Wave A/B merged; Wave C PR #93 in QA**. Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

CI #389 / PR #93 audits all **9 subjects / 900 activities**:

```text
symbol_hunt           74
structural findings    0
KEEP                  766
POLISH                 95
REDESIGN               39
REPLACE                 0
flagged total         134
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
| Mewarnai | 41 | 20 | 39 |
| Menggambar | 25 | 75 | 0 |

Accepted progression:

```text
Wave A  640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B  683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C  766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
```

Structural findings stayed **0**.

## Resolved rules

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`: 3 -> 0.
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`: 6 -> 0.
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`: 26 -> 0.
- `Q104_EARLY_AGE_READING_LOAD`: 8 -> 0.
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`: 83 -> 0.
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`: remains 0 after Unicode-safe calibration.

Wave B fixed color/shape representation, separated `audioPrompt` from visible listening instructions, blocked no-audio guessing, and removed inappropriate age-three reading load.

Wave C keeps direct letter recognition on the existing `tap_choice` evidence contract but renders **74 Bahasa/English/Letters activities** through `choicePresentation: "symbol_hunt"`. Math/Logic one-character answers are excluded from this literacy rule. Button values remain canonical, so the existing attempt bridge still measures correct/incorrect/retries. No skill mapping, assessment mode, mastery formula, progression rule, DB schema, or activity count changed.

## Remaining deterministic work

Only two quality families remain:

1. `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: **75** -> WS-07 + WS-08.
2. `Q108_DUPLICATE_COLORING_GEOMETRY`: **59** -> WS-06 + WS-08.

The next work should therefore move to authored visual/scaffold quality rather than cosmetic text changes.

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

Advisory quality rules: `Q101`–`Q108`. Heuristics do not replace human pedagogical/visual review.

## Wave status

- **Wave A DONE** — PR #91, merge `7a087d590381dd4487811027690ac187ff87954b`, CI #378.
- **Wave B DONE** — PR #92, merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`, closeout CI #387.
- **Wave C QA** — PR #93, implementation CI #389 success; current baseline `766/95/39/0`, 74 symbol hunts, Q105=0.
- **Wave D NEXT** — Coloring geometry + Drawing scaffold rebuild.
- **Wave E** — human subject-by-subject review for age fit, ambiguity, distractors, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

WS-04 is complete only when all 900 activities keep a current triage record, structural findings remain zero, high-confidence representation issues are resolved/accepted, creative findings are resolved or explicitly handed to WS-06/07/08, docs remain current, and relevant CI/product QA passes.
