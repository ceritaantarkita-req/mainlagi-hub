# Mainlagi Shared Character Runtime — Session 05 Closure

Date: **25 September 2026**  
Status: **SESSION 05 COMPLETE / SHARED RESOLVER + RENDERER FOUNDATION IMPLEMENTED / PRODUCT-SURFACE MIGRATION DEFERRED**  
Base main: `9b9c28e997374d0dcb15b3796a8c6698097dd234`

## Scope

Session 05 implements the shared character runtime foundation on top of the 35 production-approved SVG variants from Session 04.

New/updated runtime foundation:

```text
src/lib/learning/characterAssets.ts
src/lib/learning/characterPresentation.ts
src/components/learning/CharacterLayer.tsx
src/components/learning/CharacterLayer.module.css
scripts/run-character-runtime-tests.mjs
```

## Character asset runtime

`characterAssets.ts` now exposes the locked seven-state vocabulary:

```text
hero
welcome
pointing
thinking
correct
try_again
celebrate
```

and a canonical state-aware API:

```ts
approvedCharacterRuntimeAsset(characterId, state)
resolveCharacterState(characterId, requestedState)
```

All 35 production SVG paths are runtime-addressable through the central asset module and regression-cross-checked against:

```text
src/lib/data/character-asset-provenance.json
```

Raw character SVG paths must not be spread through product components.

## Fail-closed state contract

Implemented same-identity resolution:

```text
requested approved SVG state
-> same-character hero
-> same-character welcome
-> same-character approved legacy Gavi/Paca WebP where valid
-> null / hide
```

Naya/Gian/Zia never fall back to design/reference artwork.

Cross-identity fallback is deliberately owned by `characterPresentation.ts`, not the asset registry.

## Shared presentation resolver

New module:

```text
src/lib/learning/characterPresentation.ts
```

It resolves presentation-only inputs:

- context;
- subject ID;
- World ID;
- requested semantic state;
- optional authored character override.

It returns already-resolved runtime character records containing:

- character ID;
- resolved state;
- SVG/legacy asset path;
- left/right side;
- guide/companion role;
- asset source.

Locked subject preferences are centralized for the shared runtime:

```text
Bahasa        Gavi + Paca
English       Naya + Zia
Math          Gian + Paca
Iqro          Gavi + Paca
Huruf         Gavi + Paca
Logic         Gavi + Paca
Science       Gavi + Paca
Color         Gavi + Paca
Drawing       Gavi + Paca
```

Petualangan Uang cast:

```text
money-festival -> Gavi + Paca
```

Default context-state mapping:

```text
home                 hero
subject              welcome
activity             hero
activity_completion  celebrate
world_catalog        welcome
world_map            pointing
world_scene          hero
world_completion     celebrate
```

Unknown World IDs fail closed to zero characters instead of silently injecting a cast.

## Shared CharacterLayer

New renderer:

```text
src/components/learning/CharacterLayer.tsx
```

Contract:

- render zero to two already-resolved foreground characters;
- never choose cast/mastery/eligibility itself;
- stable QA data attributes for ID/state/side/role/asset source;
- decorative image semantics by default;
- no pointer interception;
- safe-area-aware anchors;
- mobile sizing contract;
- subtle entry/idle/celebrate motion only;
- `prefers-reduced-motion: reduce` disables animation.

## Compatibility boundary

Session 05 deliberately keeps the historical pre-SVG Belajar compatibility API behavior unchanged:

```text
approvedCharacterRuntimeSrc()
Naya/Gian/Zia -> null
Gavi/Paca     -> legacy /artwork/garden-*.webp
```

Reason: `activityVisualTheme.ts` still calls this compatibility API. Changing it in Session 05 would silently activate new character pairings in Belajar before Session 06.

Therefore:

```text
shared SVG runtime foundation: ready
Belajar surface migration:     not yet
World surface migration:       not yet
Home surface migration:        not yet
```

## Regression contract

New command:

```bash
npm run test:learning:character-runtime
```

It is included in:

```bash
npm run test:learning
```

Regression verifies:

- exact 5 × 7 state vocabulary;
- all 35 runtime SVG paths match approved provenance records;
- requested-state resolution;
- hero/welcome fallback;
- approved legacy Gavi fallback;
- no human reference-art fallback;
- English Naya+Zia resolver policy;
- Math Gian+Paca resolver policy;
- Petualangan Uang Gavi+Paca cast;
- World/context default states;
- authored override dedupe/cap;
- unknown-World fail closed;
- explicit cross-identity fallback;
- legacy Belajar compatibility remains unchanged;
- CharacterLayer two-character cap;
- QA data attributes;
- pointer safety;
- safe area;
- reduced motion.

## Hard boundaries preserved

Session 05 does **not**:

- modify `activityVisualTheme.ts`;
- replace GardenActivityFrame rendering;
- activate Naya/Zia in English;
- activate Gian in Math;
- integrate World rendering;
- change Home;
- change creative workspace behavior;
- change activity IDs, answers, patterns, mastery, progression, evidence or certificates;
- delete legacy Gavi/Paca WebP.

## Next allowed session

Only **Session 06 — Integrate characters into Belajar**, after Session 05 is merged and CI is green.

Session 06 owns the deliberate migration from the legacy compatibility API to the state-aware shared resolver on Belajar surfaces.
