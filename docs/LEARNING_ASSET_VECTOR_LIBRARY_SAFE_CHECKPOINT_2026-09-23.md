# Learning Asset Vector Library Safe Checkpoint — 23 September 2026

Status: **SAFE CHECKPOINT / RESEARCH + STAGING ONLY / NO PRODUCTION APPROVAL / NO RUNTIME ACTIVATION**

## Purpose

This checkpoint records the new external vector-asset sourcing work that started after the exact semantic P0 human-review gate was closed. The goal is to build a reusable, provenance-aware illustration stock library for Mainlagi without contaminating the production semantic registry or runtime.

This work does **not** replace the existing exact semantic candidate/human-review workflow. It is a separate sourcing/reference library that may later provide better candidates.

## Repository baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
local path: C:\Users\Amand\Documents\ChatGPT\mainlagihub
baseline branch: main
baseline SHA: 17b9ca79749e171f62d3adb86df494badef11732
docs branch: docs/asset-vector-library-checkpoint-20260923
```

No learning prompt, choice, answer, evidence, mastery, progression, schema, Mainlagi World, character runtime, narration runtime, production illustration registry, or semantic runtime mapping was changed by this work.

## Drive library created

Target Drive folder supplied by the project owner:

```text
asset-vector
https://drive.google.com/drive/folders/1K-k_Uc0CPk-uSIGFuieZ52H38LsSnIiM
```

Created structure:

```text
00_INDEX_AND_PROVENANCE
01_OBJECTS
02_ANIMALS
03_FOOD_FRUITS
04_BODY_FAMILY_ACTIONS
05_NATURE_SCIENCE
06_TRANSPORT_PLACES
07_MATH_SHAPES_SYMBOLS
08_GAME_ASSETS
09_SCENES_MISC
_LICENSE_PROVENANCE
```

Drive folder IDs:

```text
00_INDEX_AND_PROVENANCE  1NCIEFnZTeoPY2f5OB1bVoxUxNFBH6naM
01_OBJECTS               1XiUGoDjnns9cP5f1u1vQidGqNAuxRGzo
02_ANIMALS               13JpzF0ZZK5DowYrSGREI1aj7QyQvf0m-
03_FOOD_FRUITS           1RaWFiCGjyJqgpN7JG8XoSsA2M8a5OAKE
04_BODY_FAMILY_ACTIONS   1WbzPeLUHEv-uNUwIzCe3I4Fi99OOE9Et
05_NATURE_SCIENCE        18fsJUcfORGKAUyomtOaLASFXRyaZXpVM
06_TRANSPORT_PLACES      1Yc3SfqnaM0lnALExHbdL3yqMfj_Msvtq
07_MATH_SHAPES_SYMBOLS   1N7c3Txb1qKyz-kXzNkA5wCTCyTS5rmLi
08_GAME_ASSETS           137sjso4C0KDqt5FRMoaZoAb2fm1UG500
09_SCENES_MISC           1v4KWETYlM-V6SGg5Cezf5FHlwLqkbTRk
_LICENSE_PROVENANCE      15GzQBMgpjg9ak4vrL89wrQZpxnrvzR-8
```

## Asset index created

Google Sheet:

```text
MAINLAGI_ILLUSTRATION_ASSET_INDEX
https://docs.google.com/spreadsheets/d/10Bp_uTQ95JQdr4A7VsOZWQ8XzQMidqR3i0CweWk9Zh4/edit
```

Current indexed inventory:

```text
needed stock rows:       91
existing artwork rows:   125
semantic registry slots: 17
```

Sheet tabs:

- `NEEDED_STOCK`
- `EXISTING_ARTWORK`
- `LICENSE_RULES`
- `SOURCE_COLLECTIONS`

The index is reuse-oriented: one canonical asset should be shared across activities when the semantic object is the same. Example: one canonical apple should support Bahasa, English and Math rather than downloading three unrelated apples.

## Priority model

```text
P0 = existing semantic-registry slots
P1 = direct/high-reuse learning objects, animals, body/family/actions, lifecycle objects, Math Warung products
P2 = supporting science/habit/weather/nature concepts
P3 = programmatic primitives such as stars/circles/squares/triangles; stock download not required
```

The existing 17 semantic-registry slots remain the first production-relevant priority, but no external asset becomes production-approved merely by being downloaded.

## Source/license rules recorded

Primary sourcing currently targets:

- SVG Repo assets with an explicit commercial-compatible license on the exact item page;
- CC0/public-domain items where possible;
- consistent illustration collections rather than random single icons;
- Pixabay only when the exact content/license is suitable and no third-party brand/trademark problem exists.

Important rule: license compatibility alone is insufficient. A candidate must also pass style consistency, child readability, semantic identity, neighboring-concept safety, small-scale readability, mobile detail retention, and later exact-file human review/provenance gates.

## Staging workflow

A separate staging area is used outside the repository:

```text
C:\Users\Amand\Documents\ChatGPT\mainlagi-asset-staging
```

A Google Drive Desktop staging folder was also created:

```text
H:\My Drive\MAINLAGI_ASSET_UPLOAD_STAGING
Drive folder: 1f7FJZRSIzAbIwPk4aMwMJfN-qyYTyszp
P0 child folder: 10-e3zCOpK4e_bu1z8Lsy8wMfDWLdAQd7
```

This staging folder is **not** the final asset library and must not be treated as production input.

## First P0 download experiment — rejected as a final style set

A first download experiment pulled 13 exact SVG files into the staging folder successfully. The files were technically valid SVGs and Drive synchronized them, but a generated contact sheet showed the set was visually inconsistent:

- bird/fish used colorful flat illustration;
- cat/head used black silhouettes;
- cup/towel used outline icons;
- car used sketch/line art;
- house/umbrella/toy block used other unrelated styles.

Therefore this batch is retained only as sourcing evidence/staging and **must not be promoted as one Mainlagi illustration family**.

No file from this mixed batch has been copied into the final category folders as an approved canonical asset.

## Collection-first correction

The sourcing strategy was corrected from random CC0 selection to **collection/family-first** selection.

Preferred direction:

- `Food And Drinks Flat Icons 2` for food/drink objects;
- `Weather Forecast Flat Icons` for weather/nature support;
- `Family Members Cute Flat Vectors` for family assets when exact attribution/licensing is recorded;
- equivalent consistent flat collections for animals, household objects and actions.

Tiny Flat / colorful flat is the current preferred working direction because it is more coherent than the mixed first batch; it is still not production-approved.

## Successful consistent-family downloads at checkpoint

The browser-headless route was proven to retrieve exact SVG source even while direct PowerShell requests were rate-limited by SVG Repo.

Successfully downloaded to staging:

Food family:
```text
food-apple__food-drinks-flat2__475233.svg
food-banana__food-drinks-flat2__475237.svg
```

Weather family:
```text
weather-light-rain__474568.svg
weather-light-snow__474573.svg
weather-night-fog__474576.svg
weather-partly-cloudy__474579.svg
weather-sunny-night__474585.svg
weather-clear__474587.svg
weather-blowing-sand-night__474588.svg
```

These nine files are **downloaded/staged only**. They have not yet passed the final collection contact-sheet review, exact license capture into per-file provenance, semantic human review, production approval, or runtime mapping.

## Known technical behavior

Direct PowerShell requests to SVG Repo began returning HTTP 429 rate limits. Chrome headless `--dump-dom` could still retrieve exact SVG XML for known item URLs.

Safe rule:

- do not hammer SVG Repo;
- prefer known exact item IDs/URLs;
- use collection-first sourcing;
- throttle requests;
- preserve source URL and license evidence for every file;
- never infer a license from the collection name alone when the exact item page has not been checked.

## Hard boundaries

Until a later explicit approval wave:

- do not copy external stock directly into `public/artwork/learning-illustrations/`;
- do not set any semantic registry lifecycle to approved;
- do not write production SHA values from staging files;
- do not activate `LearningVisualToken` runtime mapping to these files;
- do not mutate canonical prompts/choices/answers/evidence/mastery/progression/schema;
- do not touch Mainlagi World;
- keep character development paused;
- keep fixed English narration deferred;
- do not fabricate human reviewer name, timestamp, review decisions, or `viewedExactFiles:true`.

## Exact safe next sequence

1. Finish visual contact-sheet review for the newly downloaded collection-family files.
2. Reject any collection/family that is visually unsuitable before moving files to the final Drive category folders.
3. For accepted family members, record exact source URL, exact license basis, attribution requirement, commercial-use status and redistribution constraints in the asset index.
4. Move/copy only accepted **library/reference** files from staging into the appropriate final Drive category folders.
5. Continue sourcing P0/P1 with collection consistency as a hard criterion.
6. When a specific semantic slot has a strong external candidate, create a separate exact candidate wave bound to the existing semantic registry and human-review gate.
7. Human review remains per exact binary.
8. Production asset approval/provenance remains a later separate gate.
9. Runtime activation remains a later separate gate after production approval.

## Current truth at checkpoint

```text
asset library Drive structure:      created
asset index:                        created
needed-stock index rows:            91
existing-artwork index rows:        125
P0 registry slots:                  17
mixed P0 SVGs staged:               13
mixed P0 set accepted as style:     0
consistent-family SVGs staged:      9
external stock production-approved: 0
external stock runtime-active:      0
semantic production binaries:       unchanged
Mainlagi World changes:             0
character-development changes:      0
narration-runtime changes:          0
```

This is the safe handoff boundary.


## Continuation checkpoint — user-uploaded stock audit (23 September 2026, late session)

The project owner updated `MAINLAGI_ILLUSTRATION_ASSET_INDEX` and uploaded a larger stock folder:

```text
user stock folder:
https://drive.google.com/drive/folders/1IuvXry8iMbDiRftBglk9JYcCoSDcsI9j
observed SVG count: 105
```

Hard rule honored: **no user-uploaded source file was deleted or moved**. Selected files were copied into the categorized final stock-library folders, leaving originals intact.

### Live spreadsheet structure after owner update

The live Google Sheet now includes:

- `NEEDED_STOCK`
- `EXISTING_ARTWORK`
- `LICENSE_RULES`
- `SOURCE_COLLECTIONS`
- `FINAL_LIBRARY`
- `ATTRIBUTION_PROVENANCE`

Current live counts at this checkpoint:

```text
NEEDED_STOCK data rows:      91
FINAL_LIBRARY data rows:     33
ATTRIBUTION_PROVENANCE rows: 6
status counts:
  needed:        75
  library-ready: 11
  reuse-ready:    1
  programmatic:   4
```

`FINAL_LIBRARY` remains a **stock/reference library only**. It is not the production semantic registry.

### User-stock files safely copied into final stock library

The following user-uploaded files were visually checked, exact source/license verified, then **copied** (not moved) into categorized library folders:

```text
weather.snowflake
  weather-snowflake__svgrepo-402713.svg
  SVG Repo / CC0

nature.wood
  nature-wood__svgrepo-289194.svg
  SVG Repo / CC0

nature.soil
  nature-soil__svgrepo-227146.svg
  SVG Repo / CC0

weather.fog-steam
  weather-fog__svgrepo-405681.svg
  SVG Repo / CC0
  note: suitable for fog; steam may still require a separate semantic asset

object.spoon
  object-spoon__svgrepo-402737.svg
  SVG Repo / CC0

habit.trash-bin
  habit-trash-bin__svgrepo-287570.svg
  SVG Repo / CC0

object.pencil
  object-pencil__svgrepo-484688.svg
  SVG Repo / CC0

object.ribbon
  object-ribbon__svgrepo-484156.svg
  SVG Repo / CC0

food.bread
  food-bread__svgrepo-227403.svg
  SVG Repo / CC0
  note: canonical stock can be reused by Math Warung

habit.reusable-bottle
  habit-reusable-bottle__svgrepo-459777.svg
  SVG Repo / CC0
  note: selected for reusable/recycling habit, not Math Warung bottled-water product

nature.rock
  nature-rock__svgrepo-398225.svg
  SVG Repo / CC0
```

All eleven are recorded as:

```text
VISUAL_CHECK_PASS
STOCK_LIBRARY_ONLY
```

They are **not** production-approved and are **not** runtime-active.

### Explicit semantic rejections / holds from the user stock

The following decisions were intentionally conservative:

- `sand-castle-svgrepo-com.svg` was **not** selected for `nature.sand`; the illustration means “sand castle”, not generic sand.
- `teddy-bear-bear-svgrepo-com.svg` was **not** selected for `object.teddy`; the large “LOVE” text is visually distracting for a clean learning semantic.
- `water-bottle-svgrepo-com.svg` was **not** selected for `game.warung.water`; the recycling mark changes the intended product meaning. The same uploaded asset was instead selected for `habit.reusable-bottle`.
- `car-svgrepo-com.svg` is visually usable but held because exact provenance/source binding was not successfully proven during this session.
- other exact-name files such as bucket, ruler, glass-of-milk, faucet, ice, water-drop, sun and moon are **still held** when exact source/license binding was not strong enough. Do not promote them merely from filename similarity.
- observed index mapping anomalies remain unresolved: `nature.river-sea` currently points to a branch source URL and `nature.nest` points to a bee source URL. These must be corrected before use.

### Math Warung reuse

`game.warung.bread` is now marked `reuse-ready` and should reuse canonical stock `food.bread`. A separate bread download is not required.

### Provenance rule tightened

Filename similarity, visual suitability, and commercial-friendly source-site reputation are **not enough** for final-library intake.

A stock file may be copied into the categorized final library only when:

1. semantic identity is appropriate;
2. visual check passes;
3. exact source page or equivalent reliable source binding is established;
4. license permits the intended commercial use;
5. attribution requirement is recorded;
6. original user-uploaded stock remains untouched;
7. the copy is still labeled `STOCK_LIBRARY_ONLY`.

### Verification limitation discovered

During exact-source matching, SVG Repo began presenting HTTP 429 / Vercel Security Checkpoint responses. This can make browser/hash comparison temporarily unreliable.

Safe behavior:

- do not treat a security-checkpoint HTML response as an SVG reference;
- do not infer exact provenance from a visually similar search result;
- hold the candidate until exact binding can be proven later;
- preserve the uploaded original and continue with other verified items.

### Updated current truth

```text
user-uploaded stock SVGs observed: 105
FINAL_LIBRARY stock/reference rows: 33
NEEDED_STOCK library-ready: 11
NEEDED_STOCK reuse-ready: 1
programmatic-only rows: 4
still needed: 75

external stock production-approved: 0
external stock runtime-active: 0
production semantic registry changes: 0
production semantic binaries added: 0
Mainlagi World changes: 0
character-development changes: 0
narration-runtime changes: 0
user-uploaded stock deletions: 0
```

### Exact next safe sequence

1. Continue audit of the remaining 75 `needed` rows against the 105-file user stock folder.
2. Prefer exact filename/semantic matches, but require exact source/license binding before final-library intake.
3. Continue to copy only; never delete or move the owner's original stock files.
4. Fix the known source-mapping anomalies in `NEEDED_STOCK` before those rows are used.
5. Keep building `FINAL_LIBRARY` as reference supply only.
6. Only after a semantic slot has a suitable exact stock candidate should a **new exact candidate wave** be created for human review.
7. Production approval/provenance remains a separate later gate.
8. Runtime activation remains the final separate gate.

This continuation is the safe handoff boundary for the user-uploaded stock audit.
