# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS — Coloring findings are closed; WS-07 Drawing Wave A is complete and 50 scaffold findings remain**. Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

PR #98 / CI #413 audits all **9 subjects / 900 activities** with the accepted WS-07 Wave A baseline:

```text
symbol_hunt           74
structural findings    0
KEEP                  850
POLISH                 50
REDESIGN                0
REPLACE                 0
flagged total          50
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
| Menggambar | 50 | 50 | 0 |

Accepted progression:

```text
Wave A         640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B         683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C         766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A   805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B   825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
WS-07 Wave A   850 KEEP /  50 POLISH /  0 REDESIGN / 0 REPLACE —  50 flagged
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
- `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: 75 -> 50 after WS-07 Wave A; remaining work stays explicit rather than weakening the rule.

Wave B fixed color/shape representation, separated `audioPrompt` from visible listening instructions, blocked no-audio guessing, and removed inappropriate age-three reading load.

Wave C keeps direct letter recognition on the existing `tap_choice` evidence contract but renders **74 Bahasa/English/Letters activities** through `choicePresentation: "symbol_hunt"`. Math/Logic one-character answers are excluded from this literacy rule. Button values remain canonical, so the existing attempt bridge still measures correct/incorrect/retries. No skill mapping, assessment mode, mastery formula, progression rule, DB schema, or activity count changed.

WS-06 rebuilt Coloring geometry without changing creative-practice semantics. Wave A authored distinct compositions for the 39 activities that were in duplicate groups of 3+; Wave B removed the final ten exact-geometry pairs. The final Coloring set has **100/100 activities free of exact geometry duplicates** under Q108. Preview generation is part of the normal dev/build/Cloudflare lifecycle so gallery thumbnails come from runtime geometry rather than drifting stale.

WS-07 Wave A uses the **existing Drawing runtime and `DrawingGuide` contract**, not a second drawing system. It adds 25 explicit activity-specific `complete` starter scaffolds for concrete object, animal, nature, face/people, and simple-scene activities. The original 25 foundational trace/dots/composition guides stay intact, bringing the functional guide total to **50/100 Drawing activities**.

The new guides remain non-interactive, can be shown/hidden, and are never counted as the child's stroke or synthetic completion. Browser QA checks all 50 guide definitions for uniqueness, SVG parsing, non-zero path length, and 480×480 canvas bounds. CI #413 also confirms the normal production build, mobile route matrix, Drawing runtime smoke, Windows compatibility, dependency audit, simulations/final acceptance, and secret-history scan.

Manual visual review of the 25 runtime-derived Wave A previews found two guides that were too prescriptive: `drawing-face-surprised` originally supplied the eyes and `drawing-face-hair` supplied a hair arc. Both were corrected before acceptance so they now provide only structural face anchors while leaving the requested expression/hair work to the child. The corrected rerenders were visually reviewed after CI #413.

## Remaining deterministic work

Only one quality family remains:

1. `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: **50** -> later WS-07 waves + WS-08 visual review.

No Coloring duplicate-geometry work remains. Do not close Q106 by weakening its age/scaffold rule; resolve the remaining Drawing activities through appropriate scaffolds and age-fit decisions.

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
- **Wave C DONE** — PR #93, merge `85aea0e5843f251eb83e5aa62180268b75455cfa`, CI #398; 74 symbol hunts; Q105=0.
- **WS-06 Wave A DONE** — PR #95, merge `4049449b5678f7f769f986750380a71b30536928`, CI #406; Q108 59 -> 20.
- **WS-06 Wave B DONE** — PR #96, merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22`, CI #408; Q108 20 -> 0.
- **WS-07 Wave A DONE** — PR #98; implementation/visual QA CI #413 full success; 25 new concrete scaffolds; Q106 75 -> 50; baseline `850/50/0/0`.
- **WS-07 NEXT** — resolve the remaining 50 Drawing findings in smaller pedagogically appropriate waves.
- **Wave E LATER** — human subject-by-subject review for age fit, ambiguity, distractors, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

WS-04 is complete only when all 900 activities keep a current triage record, structural findings remain zero, high-confidence representation issues are resolved/accepted, remaining Drawing scaffold findings are resolved or explicitly dispositioned through WS-07/08, docs remain current, and relevant CI/product QA passes.
