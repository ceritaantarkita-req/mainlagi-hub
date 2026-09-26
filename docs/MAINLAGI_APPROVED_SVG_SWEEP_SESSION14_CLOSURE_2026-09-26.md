# Mainlagi Approved SVG Sweep — Session 14 Closure — 26 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / REPOSITORY-WIDE APPROVED-SVG SWEEP COMPLETE**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
Session 13 closure baseline: 4979322aa03bdc3cb537c9bd5a387a7890c98bcf
implementation branch: agent/approved-svg-sweep-session14-20260926
PR: #352
final PR head: 74a1fb9967af062274c9ae289e236571c616a862
final PR CI: #1698 / run 36210232551 — full success
merged main: ae1c10087b9b328059605a5cbe9f4fcdf3ba1829
merged-main CI: #1699 / run 36210749985 — full success
Production smoke (Cloudflare): success
```

Session 14 used the Session 01 SVG inventory, current provenance registries, the complete repository artwork tree, source-reference search, static regression and browser verification to answer one bounded question:

> Is any already-approved canonical vector artwork still unnecessarily shadowed by a WebP-only active runtime path?

The answer after this wave is **no for normal product runtime surfaces**.

## Approved vector inventory after Session 14

### Public artwork SVGs

```text
approved character SVG states: 35
approved semantic SVG assets:  14
---------------------------------
approved public artwork SVGs:   49
```

All 49 are provenance-bound and direct-SVG:

- 5 canonical characters × 7 approved states = 35;
- 14 source/license-clear semantic illustration SVGs.

The repository also ships:

```text
src/app/icon.svg
```

directly as SVG. It is outside the artwork provenance registries and has no WebP shadow/conversion rule.

Machine inventory:

```text
docs/data/MAINLAGI_APPROVED_SVG_SWEEP_SESSION14_2026-09-26.json
```

## Legacy character WebP shadows found and fixed

The sweep found active Gavi/Paca Garden WebP consumption even though approved hero SVGs already existed.

The affected normal product surfaces were:

```text
src/components/learning/LearningCommon.tsx
src/components/HomePage.tsx
src/components/auth/AuthFamilyShell.tsx
src/components/learning/world/WorldExperience.tsx
src/components/learning/world-v2/MoneyWorldExperience.module.css
src/lib/learning/world/moneyWorldAssets.ts
```

Session 14 migrated those surfaces to approved direct SVG assets.

### CharacterAvatar

`CharacterAvatar` now resolves all five canonical guide identities through:

```ts
approvedCharacterRuntimeAsset(id, "hero")
```

rather than:

- Gavi/Paca Garden WebP special cases;
- inline approximation SVGs for Naya/Gian/Zia.

This makes the profile/parent guide avatar path use the same approved character state bank as the shared character runtime.

### Public Home and auth

Public Home and the family auth shell now resolve their Gavi + Paca hero pair through the central character presentation resolver with legacy fallback disabled.

Expected runtime paths:

```text
/artwork/characters/gavi-hero-v1.svg
/artwork/characters/paca-hero-v1.svg
```

### Rewards

The retained rewards surface now uses the same approved Gavi/Paca hero SVG pair rather than hardcoded Garden WebPs.

### Petualangan Uang ambient art

The World ambience pseudo-elements now use:

```text
/artwork/characters/paca-hero-v1.svg
/artwork/characters/gavi-hero-v1.svg
```

The World asset plan is now:

```text
MONEY_WORLD_ASSET_PLAN_VERSION = money-world-assets-v2
```

and records those direct SVG sources.

No World story, activity, progression, evidence, reward or narration semantics changed.

## Legacy Garden WebP boundary after Session 14

The physical files are intentionally **not deleted** in this session:

```text
public/artwork/garden-gavi.webp
public/artwork/garden-paca.webp
```

They remain explicit compatibility fallback/history.

The only allowed normal source-code reference after the sweep is:

```text
src/lib/learning/characterAssets.ts
```

where the old same-character legacy fallback is retained as a fail-safe and regression-tested fallback path.

Session 15 owns the separate deletion/removal decision after exact runtime/reference proof. Session 14 does not combine migration with cleanup.

## Complete WebP classification

Session 14 inventories **263 public artwork WebPs** and requires every one to have an explicit classification.

```text
108  subject backgrounds
125  activity/gallery previews
 14  semantic rollback/history derivatives
  2  legacy Gavi/Paca compatibility fallback/history
  1  reference-only mascot file
 13  runtime raster assets with no approved canonical SVG source
---
263  total
```

### 108 subject backgrounds — raster-native exemption

The existing subject-scene system remains intentionally raster:

```text
9 subjects
54 scene families
108 responsive WebP files
```

No SVG conversion is justified merely for format uniformity.

### 125 activity/gallery previews — preview-raster exemption

`public/artwork/activity-previews/` contains derived preview thumbnails.

These are not treated as canonical approved vector production sources merely because some underlying activity geometry may be vector-like or procedurally represented elsewhere.

They remain WebP preview artifacts.

### 14 semantic WebPs — rollback/history

The semantic runtime already uses the 14 approved SVG binaries.

The 14 WebP derivatives remain rollback/history and are deliberately preserved for Session 15 cleanup analysis.

Normal TypeScript/TSX/CSS runtime may not directly consume these semantic WebP history assets; Session 14 regression requires zero such direct runtime references.

### 2 legacy character WebPs — compatibility fallback/history

```text
garden-gavi.webp
garden-paca.webp
```

Normal product surfaces no longer request them in Session 14 browser QA.

They remain only because the central character asset resolver still exposes a legacy fail-safe path whose removal is separately gated.

### 1 reference-only WebP

```text
public/artwork/_mascot-reference.webp
```

This is reference material, not an approved canonical vector-migration target.

### 13 raster assets without approved canonical SVG source

The sweep found no currently approved canonical SVG source for:

```text
public/artwork/airboard-presenter.webp
public/artwork/dodge-motion.webp
public/artwork/garden-apple.webp
public/artwork/garden-background.webp
public/artwork/garden-wordmark.webp
public/artwork/iqro-motion.webp
public/artwork/math-choice.webp
public/artwork/math-motion-battle.webp
public/artwork/math-warung.webp
public/artwork/number-trace.webp
public/artwork/pattern-race.webp
public/artwork/run-to-target.webp
public/artwork/shape-quest.webp
```

Session 14 therefore retains them as raster. It does **not** invent or auto-generate vector replacements.

A future migration would require a separately approved canonical SVG source and provenance basis.

## Held semantic vectors remain held

No rights decision changed.

The exact held set remains:

```text
vehicle.car
object.towel
object.raincoat
```

They remain fail-closed and fallback-only. SVG format does not override missing redistribution approval.

## Permanent regression gate

Added:

```text
scripts/run-approved-svg-sweep-session14-tests.mjs
npm run test:assets:approved-svg-sweep
```

and wired into:

```text
npm run validate:assets
```

The gate verifies:

- all 35 approved character state SVGs remain approved, owned/redistributable and present;
- all 14 approved semantic SVGs remain approved and present;
- the exact three semantic held keys remain held with no production SVG path;
- the public artwork SVG set is exactly the 49 provenance-approved artwork SVGs;
- the app icon remains direct SVG;
- all 263 public artwork WebPs remain explicitly classified;
- no unexpected/unclassified WebP can enter silently;
- direct semantic WebP runtime references remain zero;
- legacy Garden character WebP source references are restricted to the explicit compatibility fallback in `characterAssets.ts`;
- every migrated Session 14 consumer remains free of direct legacy Garden character WebP references;
- World ambient assets remain direct approved SVG.

## Browser regression

Added:

```text
scripts/run-approved-svg-sweep-session14-browser-tests.mjs
npm run test:ui:approved-svg-sweep
```

and wired into:

```text
npm run test:ui:mobile-routes
```

Representative production-browser QA at 390 and 1280 verifies:

- public Home hero Gavi/Paca = approved direct SVG;
- auth shell Gavi/Paca = approved direct SVG;
- visible guide avatars = approved direct hero SVGs;
- rewards companions = approved direct SVG;
- World ambient pseudo-elements = approved Paca/Gavi hero SVG;
- all SVG images decode successfully;
- zero network requests to `garden-gavi.webp` or `garden-paca.webp` on these migrated surfaces;
- zero page/console errors.

Existing broader responsive suites remain in place.

## Hard boundaries preserved

Session 14 did not:

- add new artwork;
- delete artwork;
- approve a new source or rights basis;
- clear car/towel/raincoat;
- change semantic illustration identity;
- change correctness or canonical answers;
- change mastery;
- change progression/readiness;
- change evidence semantics;
- change rewards/certificates;
- change database/schema contracts;
- change World content/progression/evidence semantics;
- change Motion Engine mechanics;
- change narration/audio activation.

The migration is asset/presentation routing plus permanent verification.

## CI evidence

PR head `74a1fb9967af062274c9ae289e236571c616a862` passed PR CI **#1698 / run `36210232551`**.

Merged main `ae1c10087b9b328059605a5cbe9f4fcdf3ba1829` passed merged-main CI **#1699 / run `36210749985`**:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
Production smoke (Cloudflare)  success
```

Therefore Session 14 is **merged, deployed, repository-classified, regression-locked and live verified**.

## Next authorized session

### Session 15 — Remove redundant WebP derivatives only after live SVG verification

Session 15 may trace and remove only WebP files proven redundant.

Primary candidates:

```text
public/artwork/garden-gavi.webp
public/artwork/garden-paca.webp

14 × public/artwork/learning-illustrations/*.webp
```

Session 15 must prove:

- no required runtime path still depends on a candidate;
- no validator/rollback requirement still requires the binary;
- registry/history docs remain truthful after cleanup;
- asset/build/browser tests pass after deletion.

Do not remove:

- the 108 raster-native subject backgrounds;
- the 125 intentional activity preview thumbnails merely because SVG exists elsewhere;
- the 13 raster runtime assets without an approved canonical SVG replacement;
- any still-referenced compatibility fallback without first removing/replacing the code path safely.

## Safe resume baseline

```text
Sessions 01–14: COMPLETE
approved public artwork SVGs: 49
  character state SVGs: 35
  semantic SVGs: 14
direct app icon SVG: 1
semantic held vectors: 3
public artwork WebPs: 263, all classified
normal direct legacy Garden character WebP consumers: 0
allowed legacy character WebP source refs: characterAssets.ts fallback only
normal direct semantic WebP runtime refs: 0
Session 14 main: ae1c10087b9b328059605a5cbe9f4fcdf3ba1829
Session 14 merged-main CI: #1699 / run 36210749985 — full success
Cloudflare production smoke: success
next: Session 15 — remove only proven-redundant WebP derivatives
```
