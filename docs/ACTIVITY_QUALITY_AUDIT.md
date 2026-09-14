# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS — deterministic Coloring findings are closed; Drawing scaffold work is next**. Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

CI #408 audits all **9 subjects / 900 activities** with the accepted post-WS-06 baseline:

```text
symbol_hunt           74
structural findings    0
KEEP                  825
POLISH                 75
REDESIGN                0
REPLACE                 0
flagged total          75
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
| Menggambar | 25 | 75 | 0 |

Accepted progression:

```text
Wave A        640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B        683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C        766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A  805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B  825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
```

Structural findings stayed **0** throughout.

## Resolved rules

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`: 3 -> 0.
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`: 6 -> 0.
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`: 26 -> 0.
- `Q104_EARLY_AGE_READING_LOAD`: 8 -> 0.
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`: 83 -> 0.
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`: remains 0 after Unicode-safe calibration.
- `Q108_DUPLICATE_COLORING_GEOMETRY`: 59 -> 20 in WS-06 Wave A -> 0 in WS-06 Wave B.

Wave B fixed color/shape representation, separated `audioPrompt` from visible listening instructions, blocked no-audio guessing, and removed inappropriate age-three reading load.

Wave C keeps direct letter recognition on the existing `tap_choice` evidence contract but renders **74 Bahasa/English/Letters activities** through `choicePresentation: "symbol_hunt"`. Math/Logic one-character answers are excluded from this literacy rule. Button values remain canonical, so the existing attempt bridge still measures correct/incorrect/retries. No skill mapping, assessment mode, mastery formula, progression rule, DB schema, or activity count changed.

WS-06 rebuilt Coloring geometry without changing creative-practice semantics. Wave A authored distinct compositions for the 39 activities that were in duplicate groups of 3+; Wave B removed the final ten exact-geometry pairs by changing one context-specific scene per pair. The final Coloring set has **100/100 activities free of exact geometry duplicates** under Q108.

WS-06 also made Coloring preview generation part of the normal dev/build/Cloudflare build lifecycle, so gallery thumbnails are regenerated from the same runtime geometry rather than drifting stale. Runtime-derived preview evidence covered 39 authored scenes in Wave A and 49 after Wave B. Human visual review caught and fixed two clipping issues in Wave A before merge, and the ten Wave B scenes were visually checked for clipping/off-canvas and contextual readability before merge.

## Remaining deterministic work

Only one quality family remains:

1. `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: **75** -> WS-07 + WS-08.

No Coloring duplicate-geometry work remains. The next deterministic product-quality task is Drawing scaffold quality.

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
- **Wave C DONE** — PR #93, merge `85aea0e5843f251eb83e5aa62180268b75455cfa`, final PR-head CI #398 success; 74 symbol hunts; Q105=0.
- **WS-06 Wave A DONE** — PR #95, merge `4049449b5678f7f769f986750380a71b30536928`, CI #406 full success; Q108 59 -> 20.
- **WS-06 Wave B DONE** — PR #96, merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22`, CI #408 full success; Q108 20 -> 0; baseline `825/75/0/0`.
- **WS-07 NEXT** — 75 young Drawing activities need explicit, age-appropriate scaffold treatment.
- **Wave E LATER** — human subject-by-subject review for age fit, ambiguity, distractors, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

WS-04 is complete only when all 900 activities keep a current triage record, structural findings remain zero, high-confidence representation issues are resolved/accepted, the remaining Drawing scaffold findings are resolved or explicitly handed to WS-07/08, docs remain current, and relevant CI/product QA passes.
