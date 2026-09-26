# Mainlagi Core Thumbnail System — Wave 01 Live Checkpoint — 27 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

This is the canonical post-implementation safe checkpoint for the first Mainlagi core-thumbnail wave.

It starts **after** the closed Character + SVG migration Sessions 01–16 and must not be interpreted as Session 17.

## Exact production checkpoint

```text
repository:
ceritaantarkita-req/mainlagi-hub

implementation PR:
#357 — feat: replace Mainlagi core thumbnails Wave 01

implementation final PR head:
3596bd18b38711ebcf01f20b5abb8fbe76951765

PR CI:
#1710 / run 36248829022 — full success

merged implementation main:
140532c59e98bb45b63521983fb616bc29d6b217

merged-main CI:
#1711 / run 36249351976 — full success

Production smoke (Cloudflare):
success
```

The exact merged SHA above is live-verified on the canonical Cloudflare production path.

## Delivered visual scope

Wave 01 replaced the primary/core Mainlagi visual cards with one consistent 4:3 family:

```text
1  child Home hero
9  Belajar subject thumbnails
1  Main Gerak header
10 Main Gerak game thumbnails
1  World header
9  World thumbnails
---
31 canonical production visuals
```

The 125 activity/gallery preview WebPs under `public/artwork/activity-previews/` remain unchanged and outside this wave.

## Production asset state

Canonical Drive masters were audited as PNG 1448 × 1086 / exact 4:3.

Production runtime assets are repository-controlled optimized WebPs:

```text
directory:
public/artwork/core-thumbnails/

count:
31

production dimensions:
1200 × 900

aspect ratio:
4:3

total bytes:
3,228,610

total size:
~3.08 MiB
```

Current `public/artwork` WebP truth is therefore:

```text
historical justified Session 15 baseline: 247
post-program Core Thumbnail Wave 01:       31
current total public artwork WebPs:       278
```

The historical Session 15 statement of 247 retained justified WebPs remains correct for that migration-program checkpoint. Wave 01 is a separately classified raster class added after Session 16; the old closure history was not rewritten.

## Central runtime mapping

Canonical mapping now lives in:

```text
src/lib/learning/coreThumbnailRegistry.ts
```

The registry owns:

- child Home hero;
- Main Gerak header;
- World header;
- 9 subject thumbnail bindings;
- 10 existing Main Gerak slug bindings;
- 9 World catalog definitions.

Do not scatter alternative canonical image paths into child-facing components.

Exact audited source mapping remains frozen in:

```text
docs/data/MAINLAGI_CORE_THUMBNAIL_WAVE01_SOURCE_MAP_2026-09-26.json
```

The pre-implementation scope lock remains historical evidence in:

```text
docs/MAINLAGI_CORE_THUMBNAIL_WAVE01_SAFE_CHECKPOINT_2026-09-26.md
```

## Belajar presentation state

The child Home subject directory now uses 4:3 image cards.

Canonical card contract:

```text
thumbnail
+
subject name
```

No activity count, description, age line, progress line, or CTA is added to the primary subject card.

Responsive contract:

```text
mobile <= 760 px: 2 columns
tablet/desktop:    3 columns
```

Canonical subject identity and routes remain unchanged.

The child Home hero uses the new Wave 01 visual while recommendation, child-profile, domain-card, progression and learning logic remain unchanged.

## Main Gerak presentation state

All ten existing Main Gerak identities/slugs are preserved.

The shared `GameArtwork` component now resolves through the central thumbnail registry.

Primary child-facing and public catalog cards use:

```text
4:3 thumbnail
+
game name
```

Old card metadata/CTA/glyph clutter was intentionally removed from the primary grid.

The Main Gerak header uses the new dedicated 4:3 header artwork.

This wave did not change camera startup, preflight, Motion Engine mechanics, scoring, completion, or the Gavi/Paca runtime presentation used inside the game experience.

## World catalog state

The World catalog now renders exactly **9** thumbnail cards.

```text
live:
1

locked/concept:
8
```

Live World:

```text
runtime id:
money-festival

child-facing title:
Petualangan Uang

route:
 /child/<childId>/world/money-festival

visual:
world-uang-investasi.webp
```

Its route, stages, progress identity, evidence semantics and resume behavior remain unchanged.

Locked concepts:

```text
petualangan-ruang  -> Petualangan Ruang
studio-cerita      -> Studio Cerita
balapan-mainlagi   -> Balapan Mainlagi
bengkel-robot      -> Bengkel Robot
kode-pintar        -> Kode Pintar
klinik-sehat       -> Klinik Sehat
ekspedisi-alam     -> Ekspedisi Alam
restoran-mainlagi  -> Restoran Mainlagi
```

Locked cards are faded, display a lock affordance, and are deliberately non-navigable. No unfinished World runtime was created by this wave.

The historical `world-petualangan-uang` source remains excluded. The live money World uses `world-uang-investasi`.

## Number Trace duplicate decision

Canonical source remains the newer Drive item:

```text
game-number-trace.png (2).png
Drive file id:
1Kw7TpNeP69jmwG9r2IUpQYh400zsXDJH
```

The older duplicate remains excluded.

## Permanent regression coverage

Wave 01 added:

```text
scripts/run-core-thumbnail-wave01-tests.mjs
scripts/run-core-thumbnail-wave01-browser-tests.mjs
```

CI now permanently locks:

- exact 31 production thumbnail files;
- 1200 × 900 WebP geometry;
- optimized per-file and aggregate payload bounds;
- exact source-map counts for Home/subject/game/World scope;
- newer Number Trace source;
- historical money-World image exclusion;
- 125 activity previews remaining untouched;
- centralized registry use;
- 9 subject cards;
- 10 game cards;
- 9 World cards;
- 1 live World;
- 8 locked/non-navigable Worlds;
- responsive 4:3 browser geometry;
- responsive column counts;
- no horizontal overflow;
- World progress resume semantics after entering through the image-only catalog.

Historical Session 08/09 browser suites were updated only where their catalog presentation assumptions were intentionally superseded. Character runtime remains tested in World map/stage and Main Gerak preflight/completion surfaces.

## Verification record

PR #357 exact-head CI #1710 passed:

- Production dependency audit;
- Secret history scan;
- Quality gate (Ubuntu);
- Production build;
- Windows compatibility;
- Mobile route QA (Chromium).

Merged-main CI #1711 passed the same full matrix plus:

- exact-SHA Production smoke (Cloudflare).

The Chromium job also passed:

- canonical mobile route/accessibility/lazy-load matrix;
- permanent visual product baseline;
- Wave 01 dedicated browser QA.

## Hard boundaries preserved

Wave 01 did not change:

- activity IDs;
- game slugs;
- learning canonical answers;
- assessed/practice identity;
- mastery;
- progression/readiness;
- evidence semantics;
- reward/certificate semantics;
- database/schema;
- Motion Engine mechanics;
- narration/audio behavior;
- character SVG production/runtime;
- semantic SVG production/runtime;
- Petualangan Uang stage IDs;
- `money-festival` runtime identity;
- the 125 activity/gallery preview images.

## Safe continuation point

```text
Character + SVG migration Sessions 01–16:
CLOSED

Core Thumbnail System Wave 01:
CLOSED / MERGED / LIVE VERIFIED

verified implementation main:
140532c59e98bb45b63521983fb616bc29d6b217

merged-main CI:
#1711 / run 36249351976 — full success

Cloudflare exact-SHA smoke:
success

current core thumbnail assets:
31 WebP / 1200×900 / exact 4:3 / 3,228,610 bytes

current World catalog:
9 total / 1 live / 8 locked

activity previews:
125 unchanged

next thumbnail/product wave:
NOT AUTHORIZED BY THIS CHECKPOINT
```

Future work should begin from the verified main SHA above or a later descendant of `main`, inspect current state once, and define a fresh bounded objective. Do not reopen the completed Sessions 01–16 migration program or silently expand Wave 01 into activity-preview replacement, future World runtime implementation, Motion Engine work, narration work, or learning-semantics changes.
