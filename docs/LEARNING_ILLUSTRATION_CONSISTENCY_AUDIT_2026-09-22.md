# Learning Illustration Consistency Audit — 22 September 2026

Status: **AUDIT CLOSED / CONTAINMENT FOLLOW-UP CLOSED / SEMANTIC ART OPEN**

Baseline audited: `25369a559d25f016f4be585b663069f6ff648cc5`

## Execution boundary

This audit starts because the project owner explicitly deferred the English fixed-audio pilot and asked to continue other product-quality work.

Hard boundaries:

- Mainlagi World is separate and **must not be modified**.
- Character production/development remains **PAUSED**.
- English fixed-audio generation/review remains **DEFERRED**, with 0 generated pilot audio, 0 approved production audio, and browser speech fallback preserved.
- WS-05 Logic repeating-pattern reuse remains **CLOSED / MERGED / LIVE VERIFIED** with 900/900 activities, 47 active gameplay patterns, `choice_grid` 174, `pattern_completion` 10, Logic `choice_grid` 21, KEEP 900, and no Pattern #48.
- This audit must not change canonical activity identity, prompt, choices, answer payloads, evidence, mastery, progression, schema, stage ownership, gameplay-pattern classification, or narration behavior.

## Why this wave is next

The active Product UX roadmap lists learning-illustration consistency after the character and English voice-quality gates. Character work is paused and audio is now deferred, so learning illustrations are the next independent product-quality track that can proceed without crossing those boundaries.

The accepted product requirement is:

> Replace ambiguous or tiny learning emoji/icons with consistent child-readable artwork where recognition is part of the task. The pictured object must be recognizable without relying on the text answer, the visual language must not depend on platform-specific emoji rendering, and every icon/illustration must remain clearly contained inside its intended box on both desktop and mobile.

## Project-owner containment and readability requirement

The project owner explicitly added a second class of visual defects that must be treated as first-class product-quality issues, not cosmetic follow-up:

- many icons/illustrations are intended to sit **inside a card/choice box but visually escape or collide with the box**;
- some visuals are clipped, badly scaled, or too close to the card edge;
- some are technically present but **too small, too faint, or too ambiguous to identify**;
- the problem occurs on both **desktop and mobile**, so a desktop-only fix is not acceptable.

The first implementation wave therefore has three equal acceptance dimensions:

1. **semantic clarity** — a child can tell what the pictured object/action/material is;
2. **cross-platform consistency** — recognition-critical learning content does not change with OS emoji rendering;
3. **containment/readability** — the full visual stays inside its intended frame with stable padding, centering, scale and contrast at all supported viewports.

### Containment contract

Any shared visual container introduced by the pilot must:

- own clipping/overflow explicitly rather than relying on font metrics;
- center the visual in both axes;
- preserve an internal safe area so the visible mark does not touch the border;
- use bounded responsive sizing instead of unconstrained emoji/font scaling;
- use `object-fit: contain` for raster/vector image assets;
- preserve intrinsic aspect ratio;
- define minimum readable visual size and maximum box-relative scale;
- avoid accidental overlap with badges, labels, play controls, feedback or other overlays;
- fail visibly/safely when an asset is missing instead of stretching another visual into the slot.

The gallery thumbnail and the in-activity choice surface are separate containment layers. Passing one does not prove the other.

## Static source inventory

A repository code search for literal `emoji:` fields under `src` finds **43 source files**.

The 32 canonical subject batch-wave files contain **280 `emoji:` fields**:

| Subject | Wave files | `emoji:` fields |
| --- | ---: | ---: |
| English | 4 | 57 |
| Huruf & Menulis | 4 | 56 |
| Matematika | 4 | 48 |
| Bahasa Indonesia | 4 | 41 |
| Sains | 4 | 29 |
| Logika | 4 | 23 |
| Iqro | 4 | 18 |
| Creative / Drawing | 4 | 8 |
| **Total** | **32** | **280** |

Additional source usage exists outside those 32 wave files, including:

- `src/lib/learning/systemBase.ts`: 57 literal `emoji:` fields;
- `src/lib/learning/system.ts`: 1 literal `emoji:` field;
- `src/games/MathWarungGame.tsx`;
- several learning presentation components and authoring helpers returned by broader `emoji` searches.

These counts are an **inventory signal**, not a defect count. The field name also carries letters, punctuation, directional symbols, subject metadata, and decorative affordances that do not all require replacement.

## Risk classification

### A — recognition-critical pictorial content

Highest priority. The child may need to identify an object, animal, food, body part, person, material, weather state, or action from the visual itself.

Representative current examples found in canonical wave source:

- English: dog, rabbit, fish, bird, book, chair, cup, backpack, body parts, family members, apple, banana, bread, milk, action poses;
- Bahasa Indonesia: ball, cat, banana, backpack, shirt, milk, car, house, bicycle, flower, umbrella, fish and other word/syllable objects;
- Science: duck/webbed feet, fish/gills, bird/beak, cactus/water storage, raincoat/waterproof, window/transparent, towel/absorbent, block/rigid, cloud/weather, plant condition and other evidence/reasoning scenes.

Examples with explicit activity IDs include:

- `science-feature-duck-webbed-feet`;
- `science-feature-fish-gills`;
- `science-feature-bird-beak-seeds`;
- `science-feature-cactus-water`;
- `science-material-raincoat-waterproof`;
- `science-material-window-transparent`;
- `science-material-towel-absorbent`;
- `science-material-toy-block-rigid`.

These are the strongest candidates for a first production illustration wave because platform emoji variation can alter silhouette, detail, color, expression, or semantic clarity.

### B — quantity / spatial / pattern instructional symbols

Medium priority. Examples include Math counters, shapes, number keycaps, rulers, containers, arrows, Logic pattern markers and relation symbols.

Replacement is justified only where the current platform glyph can change the assessed visual evidence or makes the child infer from text instead of the intended representation. Stable CSS/SVG primitives may be better than raster artwork for simple geometric or directional concepts.

### C — letter/script instructional glyphs

Usually keep as typography or controlled vector/text rendering rather than replacing with pictorial art.

Examples include Latin uppercase/lowercase letters and Arabic/Iqro glyphs. These must preserve exact instructional identity and should not be transformed into decorative artwork that changes stroke form.

### D — UI/decorative affordances

Lowest priority. Examples include search, audio, pencil, palette, microscope, brain, stars, finish flags, subject icons and similar metadata.

These should be handled through the design-system/icon layer if consistency is needed, not mixed into recognition-content asset work.

## First implementation scope recommendation

Do **not** replace all 280 fields.

Start with a small, auditable **recognition-critical pilot set** across English, Bahasa Indonesia and Science. The first implementation wave should:

1. select only activities where the image itself participates in the learning objective;
2. preserve the exact canonical text, choice ordering, answer and evidence contract;
3. introduce a centralized illustration resolver/registry rather than hardcoding file paths in individual renderers;
4. use owned/approved local production assets with provenance;
5. define deterministic fallback behavior so a missing asset never silently changes the answer;
6. validate dimensions, format, file size and registry/path synchronization;
7. run responsive visual QA at 320x720, 390x844, 768x1024 and 1280x800 for affected routes;
8. compare idle, wrong/retry and success states where the illustration participates in those states;
9. keep platform emoji as an explicit temporary fallback only where the activity remains semantically safe;
10. avoid any World, character, narration, schema, progression or gameplay-pattern changes.

## Explicit non-goals

This audit does not authorize:

- generating or integrating Naya/Gian/Zia;
- generating English narration;
- bulk replacement of all emoji;
- replacing Arabic/Latin learning glyphs with pictures;
- creating Pattern #48;
- changing canonical distractors or answers to fit new art;
- introducing a broad icon-library refactor in the same wave;
- changing World routes/components;
- adding new activities.

## Acceptance gate for the next wave

Before a recognition-critical illustration can be treated as production-ready:

- one canonical semantic identity per asset;
- child-readable at the smallest supported viewport;
- full visual remains inside its intended box/card with no clipping, edge collision or overlay collision;
- stable centering, safe padding, aspect ratio and contrast on desktop and mobile;
- recognizable without answer text when recognition is the assessed task;
- no platform emoji dependency for the replaced concept;
- deterministic asset mapping;
- provenance/rights recorded;
- fail-closed validation for missing/invalid assets;
- no canonical learning/evidence drift;
- automated route coverage plus human screenshot review;
- exact-main CI and Cloudflare smoke after merge.

## Implementation follow-up — 23 September 2026

The containment/readability recommendation from this audit has now been implemented and live verified.

```text
Audit PR:                    #287
Audit main:                  bea1380e29106388eea415d3733e95d092095d97
Audit main CI:               #1453 / run 35746899947 — full success + exact smoke
Containment PR:              #294
Containment final PR head:   38fe722a63fe073a6ad3ffcfe8fa0e846559dff6
Containment PR CI:           #1529 / run 35763091032 — full success
Containment main:            6d0f9bd8972297e316bdf031603d160d901d8d04
Containment main CI:         #1531 / run 35764397545 — full success + exact smoke
```

The implementation added the shared bounded `LearningVisualToken`, migrated the pilot catalog/runtime surfaces, added blocking bounding-box assertions and closed the known containment/readability defect class for those surfaces across phone/tablet/desktop QA.

The next open requirement from this audit is **semantic clarity / cross-platform consistency / provenance** for recognition-critical pictorial content.

Known mismatches such as HEAD=`🙂`, JUMP=`🤸`, gills=`🫧`, beak=`👄` and towel=`🧺` confirm why containment alone is not final illustration quality.

Canonical containment closure: `LEARNING_VISUAL_CONTAINMENT_CLOSURE_2026-09-23.md`.

## Current conclusion

Learning-illustration consistency remains a valid active product-quality track while audio and character production are paused.

The **containment foundation is closed/live verified**. The next engineering step is a **small semantic illustration registry/provenance pilot**, not another generic containment refactor and not a catalog-wide 280-field replacement.

English, Bahasa Indonesia and Science remain the first semantic-art focus. Existing Mainlagi artwork may be reused only after exact semantic/readability/provenance review; filename or repository presence alone is insufficient.

This audit does not authorize World, character, narration, learning-contract or gameplay-pattern changes.
