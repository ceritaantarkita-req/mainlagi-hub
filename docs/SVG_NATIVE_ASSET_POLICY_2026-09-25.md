# Mainlagi SVG-Native Asset Policy — 25 September 2026

Status: **CURRENT PROJECT-OWNER ASSET FORMAT POLICY / DIRECT-SVG RUNTIME LIVE / REPOSITORY-WIDE SWEEP + REDUNDANT-WEBP CLEANUP CLOSED THROUGH SESSION 15 / FINAL CHECKPOINT NEXT IN SESSION 16**

This document records the current Mainlagi asset-format decision after the character and learning-illustration reviews.

## 1. Core rule

When the canonical source asset already exists as a clean, production-suitable **SVG**, preserve and integrate that SVG directly into production/runtime.

Do **not** rasterize an approved SVG to WebP merely because an older pipeline expected WebP.

```text
canonical SVG source
    -> provenance / rights
    -> sanitize + validate
    -> normalized production SVG path
    -> runtime resolver
```

Not:

```text
canonical SVG source
    -> convert to WebP
    -> duplicate production derivative
    -> runtime
```

The objective is to reduce unnecessary processing, preserve vector quality and keep source-to-runtime provenance simpler.

## 2. Where this applies

This policy applies to Mainlagi assets whose exact canonical production source is already SVG, including:

- the new Naya / Gian / Zia / Paca / Gavi single-character state assets;
- learning semantic / activity illustrations whose approved canonical source is SVG;
- future icons, instructional illustrations or vector artwork where SVG is already the correct source format.

This does **not** mean every visual in Mainlagi must become SVG.

## 3. Where raster still makes sense

Keep raster production formats such as WebP when the canonical artwork is inherently raster or the existing raster pipeline is appropriate, for example:

- generated or painted subject backgrounds;
- photographic imagery;
- screenshots;
- texture-heavy artwork;
- source PNG/JPEG artwork without a canonical vector source;
- other assets where a reviewed technical reason requires rasterization.

The current **9 subjects / 54 scene families / 108 responsive WebP backgrounds** remain valid. This policy does not require converting raster backgrounds to SVG.

## 4. Existing WebP assets are not silently deleted

Existing verified WebP assets remain valid until an explicit SVG migration is implemented and production-verified.

Examples after Session 15:

- legacy Gavi/Paca Garden WebP binaries have been removed; character runtime is SVG-only;
- the 14 semantic P0 WebP binaries have been removed after live SVG verification;
- their exact historical path/SHA metadata remains in the registry with `status=retired`;
- the controlled semantic runtime continues to use the 14 approved direct-SVG counterparts.

Do not remove a verified WebP in the same change that merely changes documentation or prepares a validator.

Migration should be:

```text
approve exact SVG
-> add SVG + registry binding
-> activate resolver/runtime
-> visual/CI/deploy verify
-> retire redundant WebP in a later cleanup if safe
```

## 5. SVG production security contract

Direct SVG use still requires a production gate.

Every production SVG must:

- have clear provenance / ownership / license / redistribution basis;
- be the exact reviewed source or an explicitly documented reviewed derivative;
- be valid SVG/XML;
- have a usable `viewBox`;
- be sanitized before production approval;
- contain no scripts or inline event handlers;
- contain no unreviewed active content;
- avoid unsafe `foreignObject` use;
- contain no unreviewed external URL/resource dependency;
- use normalized repository production paths;
- have an exact SHA-256 binding;
- pass visual/readability review at actual child-facing sizes;
- be loaded through an image asset URL/path rather than injected as untrusted raw markup.

Unknown provenance or unsafe SVG content fails closed.

## 5.1 Implemented shared SVG security foundation

Session 02 implements the reusable production-safety foundation in:

```text
scripts/lib/svg-asset-security.mjs
scripts/run-svg-asset-security-tests.mjs
```

The foundation is included in `npm run validate:assets` through `npm run test:assets:svg-security`.

It is intentionally registry-agnostic so both character and learning-semantic migrations can reuse the same SVG/XML, URL, active-content, path, size and stray-file gates.

Sanitization is fail-closed. The only automatic rewrite currently allowed is removal of a simple external DOCTYPE without an internal subset; unsafe/internal-subset declarations are rejected.

Current exact-source compatibility check: **49/49 Session 01 scoped SVGs pass**, with only `object-ball.svg` requiring simple DOCTYPE removal.

## 6. Character application

Character production uses the reviewed isolated single-character SVG bank directly.

Locked states:

```text
hero
welcome
pointing
thinking
correct
try_again
celebrate
```

Canonical naming:

```text
/artwork/characters/<id>-<state>-v1.svg
```

`gavi-panel-hero.svg` is the confirmed Gavi hero/default source.

Design-set SVG files and `character-set-collection-mainlagi.ai` remain reference/master material rather than runtime sprites.

Canonical detail:
- `CHARACTER_ASSET_PIPELINE.md`
- `CHARACTER_PRESENTATION_SYSTEM.md`

## 7. Learning semantic / activity illustration application

The semantic P0 production wave through PR #324 created **14 approved 512x512 alpha WebP production derivatives from canonical Drive/library SVG sources**. That completed wave remains historical truth.

Session 10 / PR #343 migrated the semantic registry/validator contract to SVG-aware v2, and Session 11 / PR #346 promoted the exact 14 reviewed canonical SVG sources into production.

Current state:

```text
registry version: 2
preferredProductionFormat: svg
runtimeActivation: controlled-svg
retired WebP history records: 14
semantic WebP binaries: 0
approved SVG binaries: 14
SVG migration-ready: 0
held SVG slots: 3
approved consumer coverage: 14/14
held fallback coverage: 3/3
```

The implemented semantic architecture is now:

```text
approved canonical semantic SVG
-> shared SVG sanitize + validate
-> /artwork/learning-illustrations/<semantic-slug>-v1.svg
-> centralized fail-closed semantic resolver
-> controlled direct-SVG runtime
```

The three held keys remain held:

```text
vehicle.car
object.towel
object.raincoat
```

SVG format does not override missing/insufficient redistribution rights.

The semantic validator/registry migration, exact SVG production promotion, centralized controlled runtime activation and responsive/browser verification are complete through Session 13 / PR #350 -> main `d9fba856e3819c2a0f353624f5255f84c27bef9a`. Session 14 / PR #352 then completed the repository-wide approved-SVG sweep on main `ae1c10087b9b328059605a5cbe9f4fcdf3ba1829`. All 14 approved semantic keys have explicit consumer coverage; car/towel/raincoat remain held and fallback-only. The next step is Session 15 removal of only proven-redundant WebP derivatives.

## 8. Runtime architecture rule

Application code should resolve an approved logical asset to an approved repository path.

Do not hardcode raw Drive URLs throughout activities.

Preferred pattern:

```text
semantic key / character state
        ->
central approved registry/resolver
        ->
normalized local production SVG path
        ->
image rendering layer
```

This keeps future source/format changes centralized and avoids editing hundreds of activities individually.

## 9. Provenance and lifecycle remain separate

These statements remain distinct:

```text
source SVG exists
!= rights approved
!= production approved
!= runtime active
!= used on every surface
```

The SVG-first policy removes unnecessary raster conversion. It does **not** remove provenance, security, semantic review, child-readability, responsive QA or runtime activation gates.

## 10. Migration priority

Recommended implementation order:

1. update canonical docs and asset-format boundaries;
2. inventory exact SVG-source production candidates;
3. migrate character and learning-illustration registries/validators to SVG-aware rules — **complete for characters and semantic illustrations**;
4. promote exact reviewed semantic SVGs to normalized repository paths — **complete through Session 11**;
5. activate the central semantic resolver/runtime in a controlled wave — **complete through Session 12**;
6. run full semantic responsive/browser/accessibility verification — **complete through Session 13**;
7. sweep the repository for remaining already-approved vector assets still shadowed by unnecessary WebP-only rules — **complete through Session 14**;
8. only after verified sweep/live coverage, remove proven-redundant WebP derivatives when no longer needed — **complete through Session 15**;
9. run final closure + exact production checkpoint — **Session 16 next**.

## 11. Historical documents

Older audit, preflight and closure documents that describe WebP generation remain valid evidence of what was actually implemented at that dated checkpoint.

Do not rewrite historical facts to pretend those WebP waves did not happen.

For current implementation decisions, this policy and the canonical current-state documents take precedence over old “convert SVG to WebP” next-step wording.


## 8. Session 14 repository-wide sweep

Session 14 / PR #352 -> main `ae1c10087b9b328059605a5cbe9f4fcdf3ba1829` closed the repository-wide approved-SVG sweep with merged-main CI #1699 and Cloudflare smoke.

Verified inventory:

```text
approved public artwork SVGs: 49
  character state SVGs: 35
  semantic SVGs: 14
direct app icon SVG: 1
public artwork WebPs: 263 / 263 classified
normal direct legacy Garden character WebP consumers: 0
normal direct semantic WebP runtime refs: 0
held semantic vectors: 3
```

The permanent gate is `npm run test:assets:approved-svg-sweep`, included in `npm run validate:assets`. The browser sweep is `npm run test:ui:approved-svg-sweep`, included in `npm run test:ui:mobile-routes`.

Session 15 may remove only WebP files proven redundant. Raster-native backgrounds, intentional gallery previews, and runtime rasters without an approved canonical SVG replacement remain raster.


## 12. Session 15 redundant-WebP cleanup

Session 15 / PR #354 -> main `0f8505fb58b3f698a93e9003eb32ad9fe0e75c67` removed exactly 16 proven-redundant WebP binaries / 223,524 bytes and passed merged-main CI #1704 including Cloudflare production smoke.

Current post-cleanup inventory:

```text
approved public artwork SVGs: 49
  character states: 35
  semantic illustrations: 14

semantic WebP binaries: 0
legacy Garden character WebP binaries: 0
retired semantic WebP history records: 14
retained justified public artwork WebPs: 247
held semantic vectors: 3
```

The 247 retained WebPs are intentional under this policy: 108 subject backgrounds, 125 activity previews, 1 reference-only mascot asset, and 13 runtime rasters without an approved canonical SVG replacement.

Canonical safe checkpoint: `MAINLAGI_REDUNDANT_WEBP_CLEANUP_SESSION15_SAFE_CHECKPOINT_2026-09-26.md`.
