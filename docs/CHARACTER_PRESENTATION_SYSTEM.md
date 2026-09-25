# Activity Character Presentation System — 21 September 2026

Status: **FOUNDATION MERGED / LIVE VERIFIED / CHARACTER DEVELOPMENT RESUMED / SVG RUNTIME MIGRATION PENDING**

This document defines how Mainlagi activity characters sit above the now-live subject-background system.


Cross-system asset-format policy: `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`.


## Goal

- keep characters as a dynamic foreground presentation layer;
- never bake Naya, Gian, Zia, Paca, or Gavi into gameplay background art;
- let subject presentation prefer an appropriate character pair without changing curriculum, answers, mastery, evidence, progression, or activity identity;
- fail closed to production-approved artwork when a preferred character does not yet have an approved runtime asset.

## 25 September 2026 shared-character runtime — CURRENT

Character development is resumed/authorized for the unified Mainlagi integration. Sessions 01–05 have now established the shared SVG character foundation for Naya, Gian, Zia, Paca and Gavi.

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

All five characters now have all seven exact production-approved SVG states under:

```text
public/artwork/characters/
```

with provenance/hash binding in:

```text
src/lib/data/character-asset-provenance.json
```

Design-set SVGs, waving extras, and the Illustrator collection remain source/reference material only.

### Shared runtime foundation — Session 05

Canonical runtime modules:

```text
src/lib/learning/characterAssets.ts
src/lib/learning/characterPresentation.ts
src/components/learning/CharacterLayer.tsx
```

`characterAssets.ts` owns concrete approved asset-path resolution and exposes:

```ts
approvedCharacterRuntimeAsset(characterId, state)
resolveCharacterState(characterId, requestedState)
```

Fail-closed same-character state order:

```text
requested approved state
-> hero
-> welcome
-> approved legacy Gavi/Paca WebP where valid
-> null / hide
```

Reference/design assets are never runtime fallbacks.

`characterPresentation.ts` owns presentation policy rather than provenance. It resolves context/subject/World/authored cast into already-approved runtime assets and keeps the following pair policy:

| Subject | Shared resolver pair |
| --- | --- |
| Bahasa Indonesia | Gavi + Paca |
| English | Naya + Zia |
| Matematika | Gian + Paca |
| Iqro | Gavi + Paca |
| Huruf & Menulis | Gavi + Paca |
| Logika | Gavi + Paca |
| Sains | Gavi + Paca |
| Mewarnai | Gavi + Paca |
| Menggambar | Gavi + Paca |

Petualangan Uang keeps explicit authored cast:

```text
money-festival -> Gavi + Paca
```

Default context-state policy:

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

Unknown World IDs fail closed rather than receiving an invented cast.

### CharacterLayer

`CharacterLayer` is a renderer only. It:

- renders zero to two already-resolved foreground characters;
- exposes stable ID/state/side/role/source data attributes;
- is pointer-transparent;
- uses safe-area-aware anchors;
- uses small entry/idle/celebrate motion only;
- disables animation under `prefers-reduced-motion: reduce`;
- does not decide cast, mastery, eligibility, evidence, or progression.

### Current product-surface compatibility boundary

Session 05 deliberately does **not** migrate Belajar/World/Home rendering yet.

The historical pre-SVG compatibility API:

```ts
approvedCharacterRuntimeSrc()
```

still behaves as:

```text
Naya/Gian/Zia -> null
Gavi/Paca     -> /artwork/garden-*.webp
```

because current `activityVisualTheme.ts` still calls that API.

Therefore the current visible Belajar pair remains:

| Subject | Shared resolver target | Current Belajar surface until Session 06 |
| --- | --- | --- |
| Bahasa Indonesia | Gavi + Paca | Gavi + Paca |
| English | Naya + Zia | Gavi + Paca compatibility fallback |
| Matematika | Gian + Paca | Gavi + Paca compatibility fallback |
| Iqro | Gavi + Paca | Gavi + Paca |
| Huruf & Menulis | Gavi + Paca | Gavi + Paca |
| Logika | Gavi + Paca | Gavi + Paca |
| Sains | Gavi + Paca | Gavi + Paca |
| Mewarnai | Gavi + Paca | hidden in creative workspace |
| Menggambar | Gavi + Paca | hidden in creative workspace |

This staged boundary prevents Session 05 from silently changing live product presentation. Session 06 owns Belajar migration; Session 08 owns World migration; Session 09 owns unified Home integration.

The character system remains presentation-only. It must not change curriculum, answers, mastery, evidence, progression, activity identity, World narrative progress, or child profile identity.

## Creative workspace rule

Coloring and Drawing continue to use their subject scenery, but decorative foreground characters remain hidden in workspace mode so they do not compete with the canvas/tools.

## Fail-closed rule — CURRENT

The shared state-aware runtime may render only production-approved character state assets exposed by `characterAssets.ts`.

Current order:

```text
requested approved state
-> same-character hero
-> same-character welcome
-> approved same-character legacy Gavi/Paca WebP where valid
-> presentation-layer approved identity fallback when allowed
-> hide
```

Reference/design sheets are never runtime fallbacks.

Unknown World IDs fail closed to no cast. Product surfaces must not infer a new World cast merely because approved character assets exist.

## Regression contract — CURRENT

`npm run test:learning:character-runtime` must verify:

- the locked five characters and seven states;
- all 35 SVG runtime paths match the approved provenance registry;
- requested-state, hero/welcome and legacy fallback behavior;
- Naya/Gian/Zia never fall back to reference artwork;
- English shared resolver policy = Naya + Zia;
- Math shared resolver policy = Gian + Paca;
- Petualangan Uang cast = Gavi + Paca;
- context-to-state defaults;
- authored override dedupe/cap;
- unknown World fail-closed behavior;
- explicit approved identity fallback;
- legacy Belajar compatibility remains unchanged until Session 06;
- CharacterLayer two-character cap, QA attributes, pointer safety, safe-area and reduced-motion behavior.

The existing `test:learning:visual-theme` regression remains responsible for the currently deployed pre-Session-06 Belajar behavior until that surface is deliberately migrated.

## Non-goals — Session 05

Session 05 does not:

- migrate Belajar surfaces;
- migrate World surfaces;
- change Home;
- change creative workspace visibility;
- change child profile/guide identity;
- change narration identity;
- change curriculum/content/answers;
- change learning evidence, mastery, progression, rewards or schema;
- delete legacy Gavi/Paca WebP fallback files.

## Historical checkpoint — PR #259

PR **#259** at `b5acbfcde66ea1451f3e55a8d469d33ba4845af1` established the earlier character-presentation/fail-closed foundation.

Merged-main CI **#1190 / run `35589937017`** passed its then-current quality, build, mobile-route/permanent visual QA, Windows, dependency and production-smoke gates.

Its historical statements that Naya/Gian/Zia lacked production artwork and that character development was paused were correct for that checkpoint. They are **not current execution instructions** after the project-owner 25 September authorization and Sessions 01–05.

## Current continuation boundary

Character source/provenance/production/runtime-foundation work is now complete through Session 05.

Next:

```text
Session 06 -> deliberate Belajar migration
Session 07 -> Belajar responsive QA
Session 08 -> World migration
Session 09 -> Home integration
```

The five-character homepage hero remains a separate composition/surface task and must use the same approved production identities rather than becoming a new source-of-truth asset.

