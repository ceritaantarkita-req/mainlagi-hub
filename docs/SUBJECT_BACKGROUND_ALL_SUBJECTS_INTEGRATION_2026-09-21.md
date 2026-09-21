# All-Subject Background Integration — 21 September 2026

Status: **IMPLEMENTATION BRANCH ACTIVE — PENDING CI / PR MERGE / PRODUCTION VERIFICATION**

Repository: `ceritaantarkita-req/mainlagi-hub`  
Branch: `agent/subject-backgrounds-all-9-20260921`  
Base main: `e84163e7c7a6bc231f32ec3207266a9340e2846e`

## Scope

This wave expands the existing Math/Science background foundation to the complete Mainlagi learning catalog without changing curriculum, answers, evidence, mastery, progression, schema, or activity identity.

Target baseline:

- 9 subjects;
- 900 activities;
- 6 scene families per subject;
- 54 scene families total;
- 54 wide + 54 mobile optimized WebP files;
- deterministic activity-to-scene resolution.

## Asset pipeline

The reviewed PNG pairs in the Mainlagi Google Drive workflow were converted to optimized WebP production derivatives.

Production asset structure:

```text
public/artwork/backgrounds/
  bahasa/
  english/
  math/
  iqro/
  letters/
  logic/
  science/
  creative/   # subjectId=color
  drawing/
```

Each folder contains six scene families with:

```text
<scene>-wide.webp
<scene>-mobile.webp
```

Total expected binaries: **108**.

## Subject/theme matrix

| Subject | Theme | Production folder | Scene count |
| --- | --- | --- | ---: |
| Bahasa Indonesia | garden / village literacy | `bahasa` | 6 |
| English | beach | `english` | 6 |
| Matematika | playful learning spaces | `math` | 6 |
| Iqro | mosque | `iqro` | 6 |
| Huruf & Menulis | city | `letters` | 6 |
| Logika | outer space | `logic` | 6 |
| Sains | nature / lab | `science` | 6 |
| Mewarnai | gallery / art museum | `creative` | 6 |
| Menggambar | nature | `drawing` | 6 |

## Runtime changes

`src/lib/learning/activityVisualTheme.ts` now:

- recognizes all nine canonical subject IDs;
- exposes six approved scene variants per subject;
- supplies explicit wide/mobile production paths;
- uses subject-specific semantic keyword rules where applicable;
- uses a stable deterministic hash for unmatched activities;
- never uses answer/correct-choice data.

The route-level `ActivityVisualThemeProvider` and `GardenActivityFrame` foundation from PR #255 remains the single presentation path. Creative Drawing/Coloring already use the shared Garden frame in workspace mode.

## Regression contract

`scripts/run-subject-background-theme-tests.mjs` now requires:

- nine subject themes;
- 100 activities per subject;
- six scene families per subject;
- approved WebP runtime paths for every scene;
- deterministic resolution for every activity;
- total resolved activities = 900;
- representative semantic mapping checks.

Expected summary when green:

```text
nine subjects
54 scene families
108 responsive WebP assets
900 deterministic activity resolutions
```

## Provenance

The project owner approved this generated background set for repository integration. The creation basis and redistribution decision for this wave are recorded in `ASSET_PROVENANCE.md`.

This approval applies to this specific generated set. Future replacements still require their own source/rights review.

## Non-goals

This wave does not:

- change learning objectives or canonical answers;
- change assessment/evidence contracts;
- change mastery/progression;
- change database/schema;
- bake characters into gameplay backgrounds;
- create one unique background per activity;
- replace dedicated visual surfaces that are required by a special runtime.

## Remaining closure gates

1. Verify all 9 production directories contain 12 files each.
2. Run visual-theme regression plus aggregate typecheck/lint/tests.
3. Run representative responsive/browser QA.
4. Open PR to `main`.
5. Merge only after required checks pass.
6. Verify merged-main CI and exact deployed production SHA.
7. Update this document and `CURRENT_STATE.md` with final PR/SHA/CI evidence.

Until gates 4–6 are complete, this branch is implementation truth only; production truth remains `main`.
