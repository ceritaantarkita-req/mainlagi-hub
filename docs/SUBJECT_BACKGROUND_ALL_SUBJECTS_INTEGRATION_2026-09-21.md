# All-Subject Background Integration — 21 September 2026

Status: **FULLY CLOSED / MERGED / LIVE VERIFIED**

Repository: `ceritaantarkita-req/mainlagi-hub`  
Implementation PR: **#256**  
Merged main: `7502c708c998c87bb273639025fcb10ba6c81e12`  
Merged-main CI: **#1183 / run 35565937149 — full success including exact Cloudflare production smoke**

## Scope

This wave expanded the existing Math/Science background foundation to the complete Mainlagi learning catalog without changing curriculum, canonical answers, evidence, mastery, progression, schema, or activity identity.

Final production baseline:

- **9 subjects**;
- **900 activities**;
- **6 scene families per subject**;
- **54 scene families total**;
- **54 wide + 54 mobile optimized WebP files**;
- **108 production background binaries**;
- deterministic activity-to-scene resolution.

## Asset pipeline

The reviewed PNG pairs in the Mainlagi Google Drive workflow were converted to optimized WebP production derivatives and integrated under:

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

Each production folder contains exactly 12 WebP files: six scene families with one `-wide.webp` and one `-mobile.webp` each.

Repository audit at closure:

- total files: **108**;
- total background payload: approximately **9.58 MiB**;
- largest individual background: approximately **200 KB**.

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
- uses subject-specific semantic keyword rules where appropriate;
- uses a stable deterministic hash for unmatched activities;
- never reads answer/correct-choice data.

The route-level `ActivityVisualThemeProvider` and `GardenActivityFrame` remain the single shared visual-theme path.

Creative Coloring and Drawing use the shared workspace frame while preserving their subject background image behind the actual canvas/tools. The workspace override uses `background-color` rather than the `background` shorthand so it cannot wipe the resolved scene image.

Logic space scenes retain title readability through a non-layout-shifting translucent title backdrop.

## Regression contract

`npm run test:learning:visual-theme` now requires:

- exactly nine subject themes;
- exactly 100 activities per subject;
- exactly six scene families per subject;
- approved wide/mobile WebP runtime paths for every scene;
- deterministic resolution for all 900 activities;
- representative semantic mappings;
- the creative workspace CSS must not reset the themed background image.

Verified CI output:

```text
Subject background theme regression passed:
nine subjects,
54 scene families,
108 responsive WebP assets,
deterministic coverage for all 900 activities.
```

## QA history

PR #256 final accepted head:

```text
e2990d251dba295faedca62c6f4b8350e15dda9a
```

Final PR CI:

```text
#1181 / run 35565379806 — SUCCESS
```

Final PR artifacts:

- activity quality: `10624391064`;
- gameplay distribution: `10624361245`;
- responsive/mobile screenshots: `10623787050`.

During the wave, manual screenshot review found two presentation issues before merge:

1. Coloring/Drawing workspace shorthand background reset hid the subject scene.
2. A Logic title-contrast treatment initially added layout height and caused a 320px spatial-relation retry visibility regression.

Both were fixed before the accepted PR head. The final responsive QA passed.

## Merge and production verification

PR #256 was squash-merged to:

```text
7502c708c998c87bb273639025fcb10ba6c81e12
```

Merged-main CI:

```text
#1183 / run 35565937149 — SUCCESS
```

All merged-main jobs passed:

- Production build;
- Production dependency audit;
- Quality gate (Ubuntu);
- Mobile route QA (Chromium);
- Secret history scan;
- Windows compatibility;
- Production smoke (Cloudflare).

Exact production smoke confirmed:

```text
Production is serving expected commit
7502c708c998c87bb273639025fcb10ba6c81e12
with canonical Supabase target.
```

Production health reported:

- branch: `main`;
- site: `https://mainlagihub.my.id`;
- backend: `supabase`;
- project ref: `estvtgflwkebomsqlolv`.

Merged-main QA artifacts:

- activity quality: `10623958296`;
- gameplay distribution: `10623624279`;
- responsive/mobile screenshots: `10623533407`.

## Provenance

The project owner approved this generated background set for repository integration. The creation basis and redistribution decision for this wave are recorded in `ASSET_PROVENANCE.md`.

This approval applies to this specific generated set. Future replacements still require their own source/rights review.

## Non-goals preserved

This wave did not:

- change learning objectives or canonical answers;
- change assessment/evidence contracts;
- change mastery/progression;
- change database/schema;
- bake Naya/Gian/Zia/Paca/Gavi into gameplay backgrounds;
- create one unique background per activity;
- replace dedicated surfaces that are required by special runtimes.

## Closure

All implementation, CI, merge, responsive QA, and exact production-verification gates are complete.

Production truth for this wave is `main@7502c708c998c87bb273639025fcb10ba6c81e12`.
