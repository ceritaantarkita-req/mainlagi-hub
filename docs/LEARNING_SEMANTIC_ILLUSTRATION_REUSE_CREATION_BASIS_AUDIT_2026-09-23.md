# Learning Semantic Illustration Reuse Creation-Basis Audit — 23 September 2026

Status: **CREATION BASIS ESTABLISHED / LEGAL RIGHTS STILL PENDING / NO PRODUCTION APPROVAL**

Base main: `5de635989c5fec51d7900a253fd7d86192017b99`

This audit narrows provenance uncertainty for the eight existing Mainlagi activity-preview binaries already marked visually suitable in the semantic illustration registry.

## Scope

Exact semantic candidates:

- `object.apple` -> `/artwork/activity-previews/color-object-apple.webp`;
- `animal.cat` -> `/artwork/activity-previews/color-parts-cat.webp`;
- `animal.fish` -> `/artwork/activity-previews/color-palette-fish.webp`;
- `object.umbrella` -> `/artwork/activity-previews/color-object-umbrella.webp`;
- `vehicle.car` -> `/artwork/activity-previews/color-palette-car.webp`;
- `object.cup` -> `/artwork/activity-previews/color-palette-cup.webp`;
- `object.house` -> `/artwork/activity-previews/color-object-house.webp`;
- `animal.bird` -> `/artwork/activity-previews/color-contrast-bird.webp`.

## Evidence found

All eight binaries first appear in repository history in merged PR **#87**, merge commit:

`25c83840b74c4eca1dd3d3b71e888f7dfc4d8b21`

PR #87 added the child Garden/Playroom redesign, vector coloring scenes, activity gallery previews and the preview generation pipeline.

The exact generator remains in the repository:

`scripts/build-coloring-previews.mjs`

It compiles the canonical learning source, reads:

`src/lib/learning/coloringScenes.ts`

and rasterizes the actual game paint regions into WebP files under:

`public/artwork/activity-previews/`

using `sharp`.

The generator itself states that it rasterizes the game's real paint regions rather than inventing different preview artwork.

Therefore the eight files are not unexplained stock binaries: their **technical creation basis is traceable to repository-authored vector geometry plus a repository-owned rasterization script**.

## What this does NOT prove

This audit does not independently establish a legal rights holder or license basis.

The repository history shows how and where the binaries were generated, but no existing canonical record explicitly states the legal rights holder/license basis for these 2026-09-14 preview assets.

Therefore all eight registry records remain:

- lifecycle: `review-required`;
- provenance.status: `pending`;
- rightsHolder: `null`;
- licenseBasis: `null`;
- redistributionAllowed: `false`;
- semanticReview.status: `pending`;
- productionPath: `null`;
- productionSha256: `null`.

No binary is copied into `public/artwork/learning-illustrations/`.

## Safe conclusion

Creation-basis uncertainty is closed for these eight candidate files.

Legal/provenance approval remains open and must not be inferred merely because the files were generated inside this repository.

If the project owner explicitly confirms that the repository-authored coloring geometry and generated derivatives are project-owned and may be redistributed for Mainlagi semantic-learning use, a later approval wave may record that legal basis and proceed to exact child-readability review.

## Hard boundaries

- Mainlagi World untouched.
- Character development paused.
- Fixed English audio deferred.
- No runtime semantic illustration mapping.
- No production semantic binary approval.
- No canonical learning/evidence/mastery/progression/schema/stage change.
- WS-05 remains 900/900 / 47 active / no Pattern #48.
