# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 IN PROGRESS — Coloring is closed; WS-07 Drawing Waves A/B are complete in PR #98/#99 scope and 25 scaffold findings remain**. Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

PR #99 / final implementation CI #418 audits all **9 subjects / 900 activities** with the accepted WS-07 Wave B baseline:

```text
symbol_hunt           74
structural findings    0
KEEP                  875
POLISH                 25
REDESIGN                0
REPLACE                 0
flagged total          25
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
| Menggambar | 75 | 25 | 0 |

Accepted progression:

```text
Wave A         640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B         683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C         766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A   805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B   825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
WS-07 Wave A   850 KEEP /  50 POLISH /  0 REDESIGN / 0 REPLACE —  50 flagged
WS-07 Wave B   875 KEEP /  25 POLISH /  0 REDESIGN / 0 REPLACE —  25 flagged
```

Structural findings stayed **0** throughout.

## Resolved / active rules

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`: 3 -> 0.
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`: 6 -> 0.
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`: 26 -> 0.
- `Q104_EARLY_AGE_READING_LOAD`: 8 -> 0.
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`: 83 -> 0.
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`: remains 0.
- `Q108_DUPLICATE_COLORING_GEOMETRY`: 59 -> 20 -> 0 across WS-06.
- `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: 75 -> 50 -> 25 across WS-07 Waves A/B.

Wave C keeps direct letter recognition on the existing `tap_choice` evidence contract while rendering 74 Bahasa/English/Letters activities through `choicePresentation: "symbol_hunt"`. No mastery/progression/schema semantics changed.

WS-06 rebuilt Coloring geometry while keeping all 100 Coloring activities creative practice. Q108 is zero, runtime geometry validation remains active, and gallery previews regenerate from the same runtime geometry before dev/build/Cloudflare build.

WS-07 reuses the existing `DrawingGuide` + `DrawingScaffold` runtime. Scaffolds are non-interactive visual starters, can be shown/hidden, and never count as the child's stroke or synthetic completion.

### WS-07 Wave A

Wave A added 25 activity-specific `complete` starter guides for concrete objects, animals, nature, faces/people, and simple scenes. Together with the original 25 foundational trace/dots/composition guides, this raised functional guide coverage to 50/100 Drawing activities and reduced Q106 75 -> 50.

Manual visual review caught two overly prescriptive guides before acceptance: `drawing-face-surprised` originally supplied eyes and `drawing-face-hair` supplied a hair arc. Both were reduced to structural face anchors before merge.

### WS-07 Wave B

Wave B adds 25 structured-skill starter guides across:

- space/layers: 5;
- texture/marks: 5;
- symmetry: 5;
- story/sequence: 5;
- composition/focus: 5.

The guides teach organizing structure instead of drawing a finished answer. Browser QA checks all 75 guide definitions for uniqueness, SVG parsing, non-zero path length, 480×480 bounds, direct runtime route loading, matching preview availability, and confirmation that scaffold presence does not enable `Selesai` before the child draws.

The first Wave B visual review caught three story guides that were still too prescriptive:

- `drawing-story-rain-sun` supplied the cloud and sun;
- `drawing-story-ball-roll` supplied the ball;
- `drawing-story-friend-wave` supplied the waving arm.

All three were reduced to neutral sequence/path/figure anchors. Their corrected runtime-derived previews were rerendered and manually reviewed before final acceptance. Final implementation CI #418 is full green across Ubuntu quality gate, production build, mobile Chromium, Windows compatibility, dependency audit, simulations/final acceptance, and secret-history scan.

## Remaining deterministic work

Only one quality family remains:

1. `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: **25** -> later WS-07 wave + WS-08 visual review.

The remaining activities are intentionally the more open-ended invention, character, map/world, visual-design, and capstone/free-studio families. Do **not** close them by weakening Q106 or by imposing finished-picture templates. They need sparse, creativity-preserving scaffolds or an explicit age-fit disposition backed by human review.

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
- **Wave B DONE** — PR #92, merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`, CI #387.
- **Wave C DONE** — PR #93, merge `85aea0e5843f251eb83e5aa62180268b75455cfa`, CI #398; Q105=0.
- **WS-06 Wave A DONE** — PR #95, merge `4049449b5678f7f769f986750380a71b30536928`, CI #406.
- **WS-06 Wave B DONE** — PR #96, merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22`, CI #408; Q108=0.
- **WS-07 Wave A DONE** — PR #98, merge `d9f0245e8531662840e2d9030e7b9b6e2f9e1df0`; final head CI #415 success; Q106 75 -> 50.
- **WS-07 Wave B QA** — PR #99; implementation CI #418 full success; 25 structured guides added; Q106 50 -> 25; docs sync pending final CI/merge.
- **WS-07 NEXT** — remaining 25 open-ended Drawing activities need sparse creativity-preserving treatment.
- **Wave E LATER** — human subject-by-subject review for age fit, ambiguity, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

WS-04 is complete only when all 900 activities keep a current triage record, structural findings remain zero, remaining Drawing scaffold findings are resolved or explicitly dispositioned through WS-07/08, canonical docs remain current, and relevant CI/product QA passes. Deterministic zero findings do not substitute for final human pedagogical/art review.
