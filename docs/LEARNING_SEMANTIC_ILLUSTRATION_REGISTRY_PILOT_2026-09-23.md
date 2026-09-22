# Learning Semantic Illustration Registry Pilot — 23 September 2026

Status: **IMPLEMENTATION PILOT / FAIL-CLOSED / NO PRODUCTION BINARY / NO RUNTIME ACTIVATION**

Base main: `63eb394db98c5dcac38e68faf4ab0aad2babb4ab`  
Base main CI: **#1534 / run `35766579239` — FULL SUCCESS**

Parent containment closure: `LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md`.

## 1. Purpose

The containment/readability wave is closed. The next defect class is semantic clarity: a visual can be perfectly centered inside its box and still be the wrong or ambiguous picture.

This pilot creates a fail-closed production gate for recognition-critical learning illustrations before any new semantic binary is activated.

Examples that motivated the pilot:

- English HEAD currently falls back to `🙂`;
- English JUMP currently falls back to `🤸`;
- Science gills currently fall back to `🫧`;
- Science beak currently falls back to `👄`;
- Science thick cactus stem currently falls back to `💚`;
- Science towel currently falls back to `🧺`;
- raincoat currently falls back to a generic coat;
- toy block currently falls back to a masonry brick.

These are semantic-art defects, not containment defects.

## 2. Machine-readable registry

Canonical registry:

`src/lib/data/learning-illustration-asset-provenance.json`

Canonical production directory:

`public/artwork/learning-illustrations/`

The first pilot contains **17 semantic slots**:

- `object.apple`
- `animal.cat`
- `animal.fish`
- `object.umbrella`
- `vehicle.car`
- `object.cup`
- `object.house`
- `animal.bird`
- `object.ball`
- `body.head`
- `action.jump`
- `feature.gills`
- `feature.beak`
- `feature.cactus-thick-stem`
- `object.towel`
- `object.raincoat`
- `object.toy-block`

Every slot is initially `review-required` with:

- `productionPath=null`;
- `productionSha256=null`;
- `redistributionAllowed=false`;
- semantic review pending.

Therefore this wave starts with **0 approved semantic illustrations / 0 production binaries / 0 runtime activation**.

## 3. Existing-art preliminary review

Existing `public/artwork/activity-previews/` binaries were visually inspected only as **reuse candidates**. Repository presence or a filename does not establish semantic or redistribution approval.

Preliminary visually-suitable candidates:

- apple -> `color-object-apple.webp`;
- cat -> `color-parts-cat.webp`;
- fish -> `color-palette-fish.webp`;
- umbrella -> `color-object-umbrella.webp`;
- car -> `color-palette-car.webp`;
- cup -> `color-palette-cup.webp`;
- house -> `color-object-house.webp`;
- bird -> `color-contrast-bird.webp`.

These remain provenance-pending and cannot become production semantic assets until exact rights/creation basis and child-readability approval are recorded.

Explicit rejection:

- `color-object-ball.webp` is **rejected** for semantic ball reuse because it reads as a circle containing a pentagon rather than a reliable ball depiction.

The registry records this rejection so a later agent does not accidentally treat the existing filename as approval.

## 4. Blocking validator

New validator:

`scripts/validate-learning-illustration-assets.mjs`

New regression:

`scripts/run-learning-illustration-asset-validator-tests.mjs`

Commands:

```bash
npm run validate:assets:learning-illustrations
npm run test:assets:learning-illustrations
npm run validate:assets
```

The aggregate `validate:assets` gate now includes the semantic-illustration gate.

The validator rejects:

- registry key drift;
- malformed semantic/category records;
- unsafe canonical or candidate paths;
- reviewed candidate paths that do not exist;
- non-approved slots with a production path or SHA;
- premature redistribution approval;
- approved production without owned/licensed provenance;
- missing rights holder/license basis;
- production activation without approved child-readable semantic review;
- missing or malformed SHA-256;
- missing production binary;
- non-WebP production output;
- dimensions outside 128–1024px bounds;
- missing alpha/transparency;
- files over 300 KB;
- SHA mismatch;
- duplicate production path;
- any image binary under `public/artwork/learning-illustrations/` that lacks an approved registry record.

Regression fixtures prove:

- clean 17-slot review-required state passes;
- a reviewed candidate path must exist;
- a candidate can be visually reviewed without being production-approved;
- stray production binary fails;
- missing rights holder fails;
- approved lifecycle without semantic child-readability approval fails;
- opaque WebP fails;
- undersized WebP fails;
- SHA mismatch fails;
- a valid owned + child-readable + hash-bound WebP fixture passes.

## 5. Separation of gates

Three decisions are deliberately separate:

1. **candidate visual review** — does an existing/new image look semantically promising?
2. **provenance approval** — may the exact binary be redistributed from the public repository?
3. **semantic production approval** — is the exact asset child-readable and correct enough to replace fallback content?

A candidate marked `visually-suitable` does **not** become production-approved.

An approved binary also does not automatically change runtime content. Runtime mapping remains a separate wave after this asset gate is live verified.

## 6. Art-direction contract

Semantic illustrations must follow `MAINLAGI_ART_BIBLE.md`:

- warm, playful and calm;
- child-friendly without looking babyish;
- clear silhouette at activity-card scale;
- consistent outline/stroke language;
- simple enough to identify quickly;
- transparent isolated asset;
- no baked text, answer cue, UI chrome or unrelated props;
- do not mix stock/emoji/vector styles within one recognition surface.

Use `LearningSymbol` for controlled abstract learning concepts where an icon is more appropriate than pictorial art. Use semantic illustration assets for concrete objects/body parts/actions/features.

## 7. Hard boundaries

This pilot does not authorize changes to:

- Mainlagi World;
- character production/runtime;
- fixed English audio;
- canonical activity IDs;
- prompt text;
- choice order;
- answers;
- evidence;
- mastery;
- progression;
- schema;
- stage ownership;
- gameplay-pattern classification.

WS-05 remains closed at 900/900 activities / 47 active patterns; no Pattern #48.

## 8. Safe next step after this gate closes

After this registry/validator is merged and live verified:

1. establish provenance for any existing-art reuse candidate that will actually be used;
2. create/review new art for the clearest P0 mismatches where no acceptable candidate exists;
3. approve only exact binaries with child-readability review and SHA-256;
4. add those exact binaries to the dedicated production subtree;
5. in a later separate runtime-mapping wave, resolve approved semantic keys through `LearningVisualToken` while preserving fallback behavior;
6. run 320/390/768/1280 screenshot QA before expanding scope.

Do not bulk-replace the full 280-field emoji inventory.
