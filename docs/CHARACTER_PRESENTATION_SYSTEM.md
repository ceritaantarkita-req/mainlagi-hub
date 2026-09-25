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

### Current Belajar surface state — Session 06

Belajar is now deliberately migrated to the shared SVG character runtime.

The historical compatibility API:

```ts
approvedCharacterRuntimeSrc()
```

still exists for older callers, but `activityVisualTheme.ts` no longer uses it.

Current Belajar pair:

| Subject | Current Belajar pair |
| --- | --- |
| Bahasa Indonesia | Gavi + Paca |
| English | Naya + Zia |
| Matematika | Gian + Paca |
| Iqro | Gavi + Paca |
| Huruf & Menulis | Gavi + Paca |
| Logika | Gavi + Paca |
| Sains | Gavi + Paca |
| Mewarnai | Gavi + Paca, hidden in creative workspace |
| Menggambar | Gavi + Paca, hidden in creative workspace |

Belajar feedback presentation is centralized rather than hardcoded per activity:

```text
entry       -> welcome
guide       -> pointing
waiting     -> hero
correct     -> correct
retry       -> try_again
completion  -> celebrate
```

`LearningAttemptBridge` publishes a separate presentation-only `childId + activityId + moment` event from interaction knowledge it already owns. `ActivityVisualThemeProvider` converts that moment into a shared character state and `GardenActivityFrame` renders only through `CharacterLayer`.

The character system does not use the feedback event to modify curriculum, answers, mastery, evidence, progression, rewards, activity identity, World narrative progress, or child profile identity.

World remains reserved for Session 08. Home/Bermain shell integration remains Session 09.

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
- canonical Belajar moment -> state mapping;
- exact child/activity presentation-event filtering;
- English shared resolver policy = Naya + Zia;
- Math shared resolver policy = Gian + Paca;
- Petualangan Uang cast remains Gavi + Paca for later World integration;
- CharacterLayer two-character cap, QA attributes, pointer safety, safe-area and reduced-motion behavior;
- Belajar no longer depends on `approvedCharacterRuntimeSrc()`.

`npm run test:learning:visual-theme` must additionally verify all 900 canonical Belajar activities resolve deterministically to their canonical subject pair using approved SVG `hero` assets at neutral route resolution.

`npm run test:ui:character-belajar` verifies representative English and Math browser flows at 390px/reduced-motion:

```text
English: Naya + Zia
Math:    Gian + Paca
wrong:   try_again
finish:  celebrate
```

The full 320/390/430/768/1280 visual-layout matrix remains Session 07.

## Non-goals — Session 06

Session 06 does not:

- integrate World characters;
- integrate Home/Bermain characters;
- redesign Motion Engine;
- change child profile/guide identity;
- change narration identity;
- change curriculum/content/answers;
- change the 900-activity or 47-pattern baselines;
- change learning evidence, mastery, progression, rewards or schema;
- delete legacy Gavi/Paca WebP fallback files.

## Historical checkpoint — PR #259

PR **#259** at `b5acbfcde66ea1451f3e55a8d469d33ba4845af1` established the earlier character-presentation/fail-closed foundation.

Merged-main CI **#1190 / run `35589937017`** passed its then-current quality, build, mobile-route/permanent visual QA, Windows, dependency and production-smoke gates.

Its historical statements that Naya/Gian/Zia lacked production artwork and that character development was paused were correct for that checkpoint. They are **not current execution instructions** after the project-owner 25 September authorization and Sessions 01–06.

## Current continuation boundary

Character source/provenance/production/runtime-foundation work plus Belajar integration is now complete through Session 06.

Next:

```text
Session 07 -> Belajar responsive QA
Session 08 -> World migration
Session 09 -> Home integration
```

The five-character homepage hero remains a separate composition/surface task and must use the same approved production identities rather than becoming a new source-of-truth asset.

