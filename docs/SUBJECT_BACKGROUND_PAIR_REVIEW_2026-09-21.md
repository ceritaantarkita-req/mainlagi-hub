# Math + Science Subject Background Pair Review

Reviewed: **21 September 2026**

This note records the visual pair review for the first Mainlagi subject-background pilot. It is intentionally separate from copyright/provenance approval and from final production viewport QA.

## Scope

The reviewed candidate set contains **12 scene families / 24 PNG candidates**:

| Subject | Scene | Wide candidate | Mobile candidate | Pair review |
| --- | --- | --- | --- | --- |
| Math | Number Park | `math-scene-number-park-v1.png` | `math-scene-number-park-mobile-v1.png` | PASS |
| Math | Playground Park | `math-scene-playground-park-v1.png` | `math-scene-playground-park-mobile-v1.png` | PASS |
| Math | Mini Market | `math-scene-mini-market-v1.png` | `math-scene-mini-market-mobile-v1.png` | PASS |
| Math | Shape Playground | `math-scene-shape-playground-v1.png` | `math-scene-shape-playground-mobile-v1.png` | PASS |
| Math | Block Yard | `math-scene-block-yard-v1.png` | `math-scene-block-yard-mobile-v1.png` | PASS |
| Math | Measurement Workshop | `math-scene-measurement-workshop-v1.png` | `math-scene-measurement-workshop-mobile-v1.png` | PASS |
| Science | Garden Lab | `science-scene-garden-lab-v1.png` | `science-scene-garden-lab-mobile-v1.png` | PASS |
| Science | Pond | `science-scene-pond-v1.png` | `science-scene-pond-mobile-v1.png` | PASS |
| Science | Weather Meadow | `science-scene-weather-meadow-v1.png` | `science-scene-weather-meadow-mobile-v1.png` | PASS |
| Science | Greenhouse | `science-scene-greenhouse-v1.png` | `science-scene-greenhouse-mobile-v1.png` | PASS |
| Science | Nature Trail | `science-scene-nature-trail-v1.png` | `science-scene-nature-trail-mobile-v1.png` | PASS |
| Science | Material Workshop | `science-scene-material-workshop-v1.png` | `science-scene-material-workshop-mobile-v1.png` | PASS |

## What PASS means here

The pair review checked the art-direction contract before runtime integration:

- wide and mobile versions preserve the same scene identity;
- the mobile version is recomposed for portrait rather than treated as a simple crop;
- the central gameplay area remains comparatively quiet;
- major decorative props stay toward scene edges;
- no task answer, prompt text, or fake UI control is embedded in the background;
- the visual language remains within the rounded Mainlagi Garden 2D family;
- the scene remains usable as a background rather than becoming the gameplay itself.

This PASS does **not** mean the PNG candidates are approved for public AGPL redistribution.

## Candidate dimensions observed

- all reviewed mobile candidates: **941 × 1672**;
- reviewed wide candidates currently use either **1672 × 941** or **1448 × 1086**.

The runtime contract therefore must not assume one fixed source aspect ratio. Production layout continues to use cover-style composition plus viewport-specific wide/mobile sources.

## Production boundary

The candidate PNGs remain outside the public repository.

Before activation:

1. complete asset provenance / redistribution review;
2. optimize approved assets to production WebP;
3. place them under the canonical `public/artwork/backgrounds/<subject>/` structure;
4. switch the scene registry from `candidate` to `approved` with explicit runtime paths;
5. run responsive browser QA at 320×720, 390×844, 768×1024, 1280×800, and 1440×900.

Until those steps are complete, production must continue to fall back to the existing Garden background.

## Runtime foundation

The next implementation wave introduces:

- typed `SubjectTheme` and `SceneVariant` definitions;
- deterministic `resolveActivityVisualTheme(activity)`;
- a route-level activity visual-theme provider so every current renderer can share one resolver;
- `GardenActivityFrame` support for approved wide/mobile scene sources;
- fail-closed candidate entries with `runtimeAssets: null`.

The resolver is presentation-only. It must not inspect answer correctness or modify curriculum, assessment evidence, progression, mastery, or activity identity.
