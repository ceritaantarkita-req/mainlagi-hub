# Mainlagi Redundant WebP Cleanup — Session 15 Closure — 26 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / REDUNDANT WEBP CLEANUP COMPLETE**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
Session 14 closure baseline: 229fb1c8018db270d2bfbdf99dfd8dbebc5a8877
implementation branch: agent/redundant-webp-cleanup-session15-20260926
PR: #354
final PR head: 1165053368b69440ce55e067f8c5232256a84146
final PR CI: #1703 / run 36218219712 — full success
merged main: 0f8505fb58b3f698a93e9003eb32ad9fe0e75c67
merged-main CI: #1704 / run 36218744065 — full success
Production smoke (Cloudflare): success
```

Session 15 executed the cleanup authorized by Session 14 only after exact runtime/reference tracing proved the candidates redundant.

## Removed binaries

Exactly **16 WebP binaries / 223,524 bytes** were removed.

### Legacy character fallback/history

```text
public/artwork/garden-gavi.webp
public/artwork/garden-paca.webp
```

The historical character compatibility layer was also removed from runtime code:

- `CHARACTER_ASSET_REGISTRY` legacy WebP gate removed;
- `approvedLegacyCharacterRuntimeAsset()` removed;
- `approvedCharacterRuntimeSrc()` removed;
- `legacy-webp` runtime asset source removed;
- `allowLegacyFallback` presentation option removed.

Current same-identity character resolution is now:

```text
requested approved SVG state
-> same-character hero SVG
-> same-character welcome SVG
-> null
```

Cross-identity fallback remains presentation-owned and resolves approved SVG character states only.

### Semantic WebP history derivatives

The 14 redundant files under:

```text
public/artwork/learning-illustrations/*.webp
```

were removed.

All 14 approved semantic SVG binaries remain present and active.

## Semantic history was retired, not erased

The provenance registry still preserves the exact historical WebP metadata for every approved semantic key:

- historical WebP path;
- historical SHA-256;
- format;
- `status: retired`;
- `retiredAt: 2026-09-26`;
- explicit Session 15 retirement reason.

The binary is no longer present.

The validator now treats the lifecycle explicitly:

```text
status=approved -> WebP binary must exist and pass technical/hash validation
status=retired  -> exact history metadata must remain, WebP binary must be absent
```

This preserves auditability without carrying redundant production binaries.

The historical deterministic WebP comparison preflight remains reproducible from the canonical SVG sources in internal/non-public output only.

## Post-cleanup artwork inventory

```text
approved public artwork SVGs: 49
  character state SVGs: 35
  semantic SVGs: 14

direct app icon SVG: 1

public artwork WebPs: 247
  subject backgrounds: 108
  activity/gallery previews: 125
  reference-only mascot: 1
  runtime rasters without approved canonical SVG replacement: 13

semantic WebP production binaries: 0
legacy Garden Gavi/Paca WebP binaries: 0
```

The 247 remaining WebPs are intentionally retained.

## Explicitly retained raster classes

### 108 subject backgrounds

These remain the canonical responsive raster scene system.

No vector migration is authorized.

### 125 activity/gallery previews

These remain intentional derived preview thumbnails.

They are not treated as redundant merely because an underlying activity may have vector geometry elsewhere.

### 1 reference-only mascot

```text
public/artwork/_mascot-reference.webp
```

This remains reference material.

### 13 runtime raster assets without approved canonical SVG replacement

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

These remain raster because there is no currently approved canonical SVG replacement.

## Held semantic assets remain unchanged

The exact held set remains:

```text
vehicle.car
object.towel
object.raincoat
```

Session 15 did not alter rights, provenance or approval state.

## Permanent cleanup manifest

Canonical machine record:

```text
docs/data/MAINLAGI_REDUNDANT_WEBP_CLEANUP_SESSION15_2026-09-26.json
```

It freezes:

- the exact 16 removed paths;
- historical Git blob SHA and size for deletion candidates;
- historical semantic registry SHA-256 values;
- total removed bytes;
- exact retained raster classes/counts;
- post-cleanup invariants.

## Permanent regression

Added:

```text
scripts/run-redundant-webp-cleanup-session15-tests.mjs
npm run test:assets:redundant-webp-cleanup
```

and wired into:

```text
npm run validate:assets
```

The regression requires:

- all 16 cleanup candidates physically absent;
- semantic production directory = exactly 14 SVG / 0 WebP;
- all 14 approved semantic WebP history records = `retired`;
- exact historical semantic WebP path/SHA retained;
- all 14 approved semantic SVGs still present;
- car/towel/raincoat remain held;
- public artwork WebP count exactly 247;
- every retained WebP belongs to a justified raster/reference class;
- no runtime TypeScript/TSX/CSS source references Garden Gavi/Paca WebPs;
- no runtime source references semantic WebPs;
- no legacy character WebP APIs remain;
- all 49 approved public artwork SVGs remain present.

The Session 14 approved-SVG sweep regression was also advanced to preserve its direct-SVG/raster-classification invariants after this authorized cleanup.

Existing Session 14 browser QA remains part of the permanent Chromium mobile-route matrix and continues to verify zero Garden character WebP requests on migrated surfaces.

## CI evidence

The first PR CI run correctly caught one stale preflight message expectation after the semantic WebP history lifecycle changed.

That mismatch was fixed before merge.

Final PR head:

```text
1165053368b69440ce55e067f8c5232256a84146
```

passed PR CI **#1703 / run `36218219712`**:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
Production smoke (Cloudflare)  skipped on PR
```

Merged main:

```text
0f8505fb58b3f698a93e9003eb32ad9fe0e75c67
```

passed merged-main CI **#1704 / run `36218744065`**:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
Production smoke (Cloudflare)  success
```

Therefore Session 15 is **merged, deployed, cleanup-locked and live verified**.

## Hard boundaries preserved

Session 15 did not:

- create new artwork;
- approve new artwork;
- alter semantic identities;
- clear car/towel/raincoat;
- change correctness or canonical answers;
- change mastery;
- change progression/readiness;
- change evidence semantics;
- change rewards/certificates;
- change database/schema contracts;
- change World content/progression/evidence;
- change Motion Engine mechanics;
- change narration/audio behavior.

## Next authorized session

### Session 16 — Final production checkpoint

Session 16 is verification/closure only.

It should:

- run the full relevant CI matrix;
- verify the exact deployed main SHA;
- re-audit final public artwork counts;
- re-audit character and semantic SVG runtime state;
- record held semantic assets;
- record remaining justified WebPs;
- synchronize canonical docs;
- close the SVG/character integration program.

Session 16 must not start another feature/art/mechanic wave.

## Safe resume baseline

```text
Sessions 01–15: COMPLETE

approved public artwork SVGs: 49
  character state SVGs: 35
  semantic SVGs: 14

semantic runtime: controlled-svg
approved semantic consumer coverage: 14/14
held semantic fallback coverage: 3/3
semantic held vectors: car / towel / raincoat

semantic WebP binaries: 0
legacy Garden character WebP binaries: 0
semantic retired WebP history records: 14

public artwork WebPs retained: 247
  108 subject backgrounds
  125 activity previews
  1 reference-only
  13 no-approved-vector runtime rasters

Session 15 main: 0f8505fb58b3f698a93e9003eb32ad9fe0e75c67
Session 15 merged-main CI: #1704 / run 36218744065 — full success
Cloudflare production smoke: success

next: Session 16 — final production checkpoint
```
