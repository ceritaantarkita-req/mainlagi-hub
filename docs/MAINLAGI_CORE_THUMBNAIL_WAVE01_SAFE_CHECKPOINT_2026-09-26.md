# Mainlagi Core Thumbnail System — Wave 01 Safe Checkpoint — 26 September 2026

Status: **PRE-IMPLEMENTATION CHECKPOINT / SCOPE LOCKED / NO RUNTIME OR ASSET MUTATION YET**

This checkpoint starts a new workstream after the closed 16-session character + SVG migration program.

It is **not Session 17**.

## Exact safe baseline

```text
repository:
ceritaantarkita-req/mainlagi-hub

canonical main:
8cd470920e2d230702dd28d7ab4e9037637083e9

feature branch:
feat/mainlagi-core-thumbnail-system-20260926

branch starting SHA:
8cd470920e2d230702dd28d7ab4e9037637083e9

branch status at checkpoint:
identical to main
no runtime changes
no asset changes
```

The baseline above is the final Session 16 closure commit and already passed merged-main CI #1708 including Cloudflare production smoke.

## Owner-approved objective

Replace the **main/core Mainlagi thumbnails** with the new 4:3 visual family supplied in Google Drive.

This wave covers only the primary product surfaces:

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

The 125 activity/gallery previews under `public/artwork/activity-previews/` are **OUT OF SCOPE**.

## Source folders

### Belajar + Main

Google Drive folder:

```text
https://drive.google.com/drive/folders/1fgE3ijTQDoYh__PgEyZsDlwP1ARyeMDH
```

### World

Google Drive folder:

```text
https://drive.google.com/drive/folders/1G4BD37YXf-Uv-Q2C5WKieJeanZ-vfUPn
```

### Product/context source

Mainlagi Hub:

```text
https://drive.google.com/drive/folders/1khaE4VM9eMOtJ-Ilbg2hC3ETVZ8IAZrG
```

The Mainlagi Hub roadmap/worklog is authoritative for child-facing World naming and future concept direction.

## Visual contract

All new primary thumbnails:

- source master is PNG;
- source dimensions are 1448 × 1086;
- aspect ratio is exactly 4:3;
- card presentation is **thumbnail + name only**;
- no descriptive copy inside the card;
- no metadata line;
- no age line;
- no progress line;
- no CTA copy such as "Mainkan";
- no subject icon replacing the image.

Locked World cards may use a **lock icon overlay** as a state affordance, but no additional status text is added to the card.

## Home decision

`home-hero-mainlagi.png` is for the **child Home experience**.

Public landing-page hero is not part of this wave unless separately authorized later.

## Belajar subject cards

The subject directory is redesigned from icon tiles to **4:3 image cards**.

Canonical mapping:

```text
bahasa   -> Bahasa Indonesia -> subject-bahasa-indonesia
english  -> Bahasa Inggris   -> subject-bahasa-inggris
letters  -> Huruf & Menulis  -> subject-huruf-menulis
iqro     -> Iqro             -> subject-iqro
math     -> Matematika       -> subject-matematika
logic    -> Logika           -> subject-logika
science  -> Sains            -> subject-sains
color    -> Mewarnai         -> subject-mewarnai
drawing  -> Menggambar       -> subject-menggambar
```

Responsive intent:

```text
desktop/tablet: image-first grid
mobile: 2 columns
all image boxes: 4:3
card copy: name only
```

## Main Gerak

The ten existing game identities/slugs remain unchanged.

Canonical mapping:

```text
math-choice          -> game-pilih-jawaban
math-motion-battle   -> game-math-battle
number-trace         -> game-number-trace (2)   [CANONICAL NEWER SOURCE]
shape-quest          -> game-shape-quest
pattern-race         -> game-pattern-race
math-warung          -> game-math-warung
iqro-motion          -> game-iqro-motion
airboard-presenter   -> game-aiboard
dodge-motion         -> game-beat-motion
run-to-target        -> game-run-to-target
```

`main-gerak-header.png` becomes the Main Gerak header visual.

The old game title/slug/runtime behavior is not renamed by this visual wave.

## Number Trace duplicate rule

Two Number Trace source files exist in Drive.

Canonical source:

```text
game-number-trace.png (2).png
Drive file id: 1Kw7TpNeP69jmwG9r2IUpQYh400zsXDJH
```

Excluded older duplicate:

```text
game-number-trace.png.png
Drive file id: 1afDlW9wpZq3CmEKI8LlOOLdsumOQOI2D
```

Do not silently switch back to the older duplicate.

## World catalog decision

The World catalog immediately shows all **9 World cards**.

State:

```text
1 live
8 concept/locked
```

The eight concept cards are:

- visually faded;
- non-navigable to unfinished runtime;
- visibly locked through an icon/overlay;
- still show only thumbnail + child-facing name.

### Existing live World

The existing runtime identity remains:

```text
money-festival
Petualangan Uang
```

Do not rename its route, progress identity, evidence identity, stages, or runtime semantics in this thumbnail wave.

Its new visual source is:

```text
world-uang-investasi.png
```

### Future locked Worlds

Child-facing titles are authoritative; filenames describe concept/profession, not UI title.

```text
world-arsitek-interior
-> Petualangan Ruang

world-youtuber-content-creator
-> Studio Cerita

world-pembalap-mobil
-> Balapan Mainlagi

world-robot-engineer
-> Bengkel Robot

world-ai-software-engineer
-> Kode Pintar

world-dokter
-> Klinik Sehat

world-ilmuwan-penjelajah-alam
-> Ekspedisi Alam

world-chef-pemilik-restoran
-> Restoran Mainlagi
```

Stable locked catalog ids for this wave:

```text
petualangan-ruang
studio-cerita
balapan-mainlagi
bengkel-robot
kode-pintar
klinik-sehat
ekspedisi-alam
restoran-mainlagi
```

These ids are catalog/presentation identities only. They do not imply that future World runtime/content has been implemented.

## Historical World thumbnail exclusion

Do not use:

```text
world-petualangan-uang.png
Drive file id: 16zB20iWhpdCKIWHcpJKGQxbMWABcn8dj
```

It is historical.

Canonical new visual for the live money World:

```text
world-uang-investasi.png
Drive file id: 1Pv1KkFxiwWCieRUHl2OwiPQJA44Lt3CZ
```

## Architecture decision

Do not scatter literal image paths across components.

Create one centralized primary-thumbnail registry covering:

```text
surface hero
subject id
game slug
world id
```

The registry is the only canonical presentation mapping for this Wave 01 set.

## Runtime boundaries

This visual wave must not change:

- activity ids;
- game slugs;
- existing World route ids;
- Petualangan Uang stage ids;
- canonical answers;
- learning correctness;
- mastery;
- progression/readiness;
- evidence semantics;
- reward/certificate semantics;
- database/schema;
- Motion Engine mechanics;
- narration/audio behavior;
- character SVG runtime;
- semantic illustration SVG runtime.

The eight locked World cards are **catalog presentation only**.

## Asset handling

The Drive PNGs are source masters.

Production integration must preserve:

- exact 4:3 presentation;
- no accidental crop that removes primary character/action;
- lazy loading where safe;
- priority only for above-the-fold hero/header assets;
- no remote Drive URL in runtime;
- all runtime assets stored under repository-controlled `public/`.

If repository/runtime optimization uses PNG directly through `next/image`, browser output must still be verified for payload and rendering. If optimized derivatives are introduced, source mapping must remain traceable to the Drive master.

## Expected implementation surfaces

Primary expected files include:

```text
src/components/learning/Playroom.tsx
src/components/learning/Playroom.module.css
src/components/learning/Batch14WorldHome.tsx
src/components/GameArtwork.tsx
src/components/games/GameCatalog.tsx
src/components/learning/world-v2/MoneyWorldExperience.tsx
src/components/learning/world-v2/MoneyWorldExperience.module.css
src/lib/learning/... central thumbnail registry
public/artwork/... new primary thumbnail assets
```

Additional test/style files may change only as required to lock the visual contract.

## QA minimum before merge

Verify at minimum:

- all 31 canonical assets exist locally in repository-controlled `public/`;
- each source mapping is exact;
- every primary thumbnail displays 4:3;
- subject cards show image + name only;
- Main Gerak game cards show image + name only on the child-facing primary grid;
- World catalog shows 9 cards;
- exactly one World card is live;
- exactly eight World cards are locked/faded;
- locked cards do not navigate to unfinished World runtime;
- no historical `world-petualangan-uang` source is used;
- newer Number Trace source is used;
- 125 activity previews are unchanged;
- game slugs/routes are unchanged;
- `money-festival` runtime route/progression is unchanged;
- responsive QA includes phone and desktop widths;
- full PR CI passes;
- merged-main exact-SHA Cloudflare smoke passes.

## Safe continuation point

```text
program before this wave:
Character + SVG migration Sessions 01–16 CLOSED

new workstream:
Mainlagi Core Thumbnail System — Wave 01

feature branch:
feat/mainlagi-core-thumbnail-system-20260926

starting SHA:
8cd470920e2d230702dd28d7ab4e9037637083e9

checkpoint state:
scope locked
Drive sources audited
repo surfaces audited
mapping locked
no runtime mutation yet
no asset mutation yet
```

Resume from this document and the machine-readable mapping manifest. Do not repeat the prior audit unless the branch or Drive source set materially changes.
