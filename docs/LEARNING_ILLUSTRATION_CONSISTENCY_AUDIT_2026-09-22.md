# Learning Illustration Consistency Audit — 22 September 2026

Status: **AUDIT / NO RUNTIME CHANGE**

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

> Replace ambiguous or tiny learning emoji/icons with consistent child-readable artwork where recognition is part of the task. The pictured object must be recognizable without relying on the text answer, and the visual language must not depend on platform-specific emoji rendering.

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
- recognizable without answer text when recognition is the assessed task;
- no platform emoji dependency for the replaced concept;
- deterministic asset mapping;
- provenance/rights recorded;
- fail-closed validation for missing/invalid assets;
- no canonical learning/evidence drift;
- automated route coverage plus human screenshot review;
- exact-main CI and Cloudflare smoke after merge.

## Current conclusion

Learning-illustration consistency is a valid next independent workstream while audio and character production are paused.

The first engineering step should be a **small recognition-critical pilot**, not a catalog-wide visual rewrite. English, Bahasa Indonesia and Science contain the clearest object-recognition cases and should be audited at activity-ID level before any production binary is added.

This document is an audit checkpoint only. No runtime or production asset is changed by this branch.
