# Mainlagi Subject Background System

Status: **PRODUCTION / LIVE VERIFIED**  
Last reviewed: **21 September 2026**

Use this document as the canonical contract for activity backgrounds. Read it with `MAINLAGI_ART_BIBLE.md`, `ASSET_PROVENANCE.md`, and `SUBJECT_BACKGROUND_ALL_SUBJECTS_INTEGRATION_2026-09-21.md`.

## Goal

- Give every learning subject a coherent environment instead of reusing one Garden background everywhere.
- Keep gameplay, text, answers, evidence and progression in foreground/runtime layers.
- Reuse a small family of scenes per subject rather than creating 900 unrelated backgrounds.
- Keep wide and phone artwork as an art-directed pair, not a blind crop.
- Keep characters separate from the background artwork so character presentation can remain dynamic.

## Current implementation scope

The system now covers the canonical **9 subjects / 900 activities**:

| Subject ID | Product label | Theme | Scene families |
| --- | --- | --- | ---: |
| `bahasa` | Bahasa Indonesia | garden / village literacy | 6 |
| `english` | English | beach | 6 |
| `math` | Matematika | playful learning spaces | 6 |
| `iqro` | Iqro | mosque | 6 |
| `letters` | Huruf & Menulis | city | 6 |
| `logic` | Logika | outer space | 6 |
| `science` | Sains | nature / lab | 6 |
| `color` | Mewarnai | art gallery / museum | 6 |
| `drawing` | Menggambar | nature | 6 |

Total:

- **54 reusable scene families**;
- **108 production WebP files**: 54 wide + 54 mobile;
- deterministic visual-theme resolution for all **900 activities**.

## Scene families

### Bahasa Indonesia

- `letter-garden`
- `sound-garden`
- `word-playground`
- `village-market`
- `reading-garden`
- `story-garden`

### English

- `seaside-learning-cove`
- `phonics-cove`
- `beach-playground`
- `beach-market`
- `seaside-reading-nook`
- `storybook-beach`

### Math

- `number-park`
- `playground-park`
- `mini-market`
- `shape-playground`
- `block-yard`
- `measurement-workshop`

### Iqro

- `mosque-courtyard-01`
- `mosque-courtyard-02`
- `mosque-courtyard-03`
- `mosque-library-04`
- `mosque-courtyard-05`
- `mosque-study-06`

### Huruf & Menulis

- `city-plaza-01`
- `alphabet-city-02`
- `library-plaza-03`
- `mail-town-04`
- `notebook-park-05`
- `storybook-town-06`

### Logic

- `space-observatory-01`
- `space-observation-deck-02`
- `space-under-stars-03`
- `space-maze-04`
- `space-playroom-05`
- `space-workshop-06`

### Coloring

- `art-gallery-01`
- `art-gallery-02`
- `art-gallery-03`
- `art-gallery-04`
- `art-gallery-05`
- `art-gallery-06`

### Drawing

- `meadow-art-01`
- `woodland-art-02`
- `garden-art-03`
- `lakeside-art-04`
- `meadow-activity-05`
- `mountain-art-06`

### Science

- `garden-lab`
- `pond`
- `weather-meadow`
- `greenhouse`
- `nature-trail`
- `material-workshop`

## Runtime architecture

Canonical implementation:

- `src/lib/learning/activityVisualTheme.ts`
  - owns the nine `SubjectTheme` records;
  - owns the 54 `SceneVariant` records;
  - maps activity IDs through subject-specific semantic rules;
  - falls back to a stable hash when no semantic rule matches;
  - never reads the correct answer or mutates learning state.
- `src/app/child/[childId]/activity/[activity]/page.tsx`
  - resolves one visual theme at route entry;
  - provides it through `ActivityVisualThemeProvider`.
- `GardenActivityFrame`
  - consumes approved wide/mobile sources;
  - switches to the mobile composition below the existing mobile breakpoint;
  - keeps gameplay/UI above the scene.

The same activity therefore receives the same scene across renders unless the mapping contract is intentionally changed.

## Production storage

Production binaries live under:

```text
public/artwork/backgrounds/<asset-folder>/<scene>-wide.webp
public/artwork/backgrounds/<asset-folder>/<scene>-mobile.webp
```

Asset folders are the subject IDs except Coloring, whose files use:

```text
public/artwork/backgrounds/creative/
```

The reviewed PNG generation outputs remain separate source/review material. Runtime code references only optimized WebP production assets.

## Visual composition contract

- Mainlagi 2D illustration language: friendly, rounded, clean, soft shading, low noise.
- No photorealism or cinematic/glowing treatment.
- Keep the gameplay center comparatively quiet.
- Decorative detail belongs mainly near scene edges.
- Do not bake answers, task text, letters, numbers, progress or instructions into backgrounds.
- Do not bake Naya, Gian, Zia, Paca or Gavi into normal gameplay backgrounds.
- Characters remain separate foreground/presentation assets.
- A scene communicates context only; it must not alter the learning objective.

## Responsive contract

- Wide and mobile files are a matched scene pair.
- Mobile art is recomposed, not merely cropped from landscape.
- Required review viewports:
  - 320x720;
  - 390x844;
  - 768x1024;
  - 1280x800;
  - 1440x900.
- `background-size: cover` is allowed only because a dedicated mobile source exists; it is not a substitute for mobile art direction.
- The frame must not introduce horizontal document overflow.
- Foreground controls, choices, boards and creative canvases must remain reachable and readable.

## Runtime exceptions

The resolver covers every activity route, but a dedicated runtime may still intentionally render its own visual surface when the activity itself requires it, for example camera/motion gameplay. Such exceptions must remain explicit and must not duplicate subject-theme mapping logic.

Creative Coloring and Drawing already use `GardenActivityFrame workspace`, so their gallery/nature backgrounds remain behind the actual canvas and tools.

## Provenance boundary

The 108 WebP files integrated by the 21 September wave are derived from the project-approved generated PNG pairs stored in the project Google Drive workflow. Their production approval record is documented in `ASSET_PROVENANCE.md`.

Do not silently replace a production background with third-party/reference imagery. A replacement must pass the same visual-pair and provenance review.

## Automated regression contract

`npm run test:learning:visual-theme` must verify:

- exactly nine themed subjects;
- exactly six scene families per subject;
- all 54 scenes have approved wide/mobile WebP runtime assets;
- all 900 activities resolve deterministically;
- no activity resolves outside its own subject scene family;
- representative semantic mappings remain stable.

This test is also part of the aggregate `npm run test:learning` chain.

## Project-owner production preview

On 21 September 2026, the project owner supplied one live production desktop screenshot for each canonical subject:

- English — `english-find-blue`;
- Bahasa Indonesia — `bahasa-cari-a`;
- Matematika — `math-count-2`;
- Iqro — `iqro-cari-alif`;
- Huruf & Menulis — `letters-find-a`;
- Logika — `logic-match-pairs`;
- Sains — `science-living-cat`;
- Mewarnai — `color-gavi`;
- Menggambar — `drawing-line-horizontal`.

These previews confirm subject-specific environments are visible behind the intended gameplay/workspace surfaces. They also show normal gameplay keeping Gavi/Paca as foreground layers and creative workspace routes preserving their subject scenery.

This is desktop preview evidence only; automated responsive/mobile QA remains authoritative for broader viewport coverage.

Review record: `docs/SUBJECT_BACKGROUND_PRODUCTION_PREVIEW_REVIEW_2026-09-21.md`.

## Production closure

This system is live in production.

- PR: **#256**
- background implementation main: `7502c708c998c87bb273639025fcb10ba6c81e12`
- implementation merged-main CI: **#1183 / run 35565937149 — full success**
- latest production main/docs closure: `41df41c9dc0edc449af8260bbfe3887e0175bfb0`
- docs-closure merged-main CI: **#1186 / run 35567718494 — full success**
- exact Cloudflare production smoke: **PASS**
- canonical site: `https://mainlagihub.my.id`

Detailed closure record: `docs/SUBJECT_BACKGROUND_ALL_SUBJECTS_INTEGRATION_2026-09-21.md`.
