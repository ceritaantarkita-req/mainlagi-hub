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

## Fail-closed rule

A preferred character may not render until `characterAssets.ts` marks it `approved` **and** exposes a concrete `runtimeSrc`. Merely adding a file under `public/artwork` must not activate a character.

Example:

- English prefers Naya + Zia;
- neither currently has a production foreground file;
- runtime therefore stays Gavi + Paca;
- once both are approved and entered into the allowlist, English can switch without activity-specific hardcoding.

The same rule applies to Math's future Gian + Paca pair.

## Regression contract

The visual-theme regression must verify:

- all 900 activities still resolve deterministically;
- two foreground character slots resolve for normal Garden activities;
- the canonical five-character registry is complete;
- only `approved` registry entries can expose a runtime path;
- Naya/Gian/Zia remain `reference-only` with `runtimeSrc=null` until explicit production approval;
- only production-approved asset IDs are returned;
- the same character cannot occupy both slots;
- GardenActivityFrame contains no hardcoded Gavi/Paca runtime path;
- creative workspace CSS hides the generic character layer;
- English remains fail-closed to Gavi/Paca until Naya/Zia production assets are approved.

## Non-goals

This foundation does not:

- approve Naya/Gian/Zia production artwork;
- infer new subject pairings that were not already established;
- change child profile/guide identity;
- change coloring content;
- change narration identity;
- change learning evidence/mastery/progression/schema.

## Merge / production verification

The character-presentation foundation is merged through PR **#259** at `b5acbfcde66ea1451f3e55a8d469d33ba4845af1`.

Merged-main CI **#1190 / run `35589937017`** passed the quality gate, production build, mobile-route/permanent visual QA, Windows compatibility, dependency audit, and exact Cloudflare production smoke.

This closes the architecture/fail-closed foundation. It does **not** approve Naya/Gian/Zia artwork for runtime.

## Paused gate / resume conditions

The production asset directory, machine-readable provenance registry, and blocking character-asset validator remain the pre-activation gate. No human production binary is approved or activated by that infrastructure alone.

**Character production/development is currently paused by the project owner. Do not execute the steps below until an explicit resume instruction is given. Mainlagi World is developed separately and is not part of this character workstream.**

When explicitly resumed, execute the human-character production wave in this order:

1. lock the production character specification against the reviewed Naya/Gian/Zia design sheets;
2. create isolated transparent full-body runtime assets with stable scale, silhouette, pose and identity;
3. record provenance, ownership and redistribution status for each production file;
4. review visual consistency against the design references;
5. run responsive activity screenshots and check that foreground characters never cover instructions, choices, canvas/tools or completion controls;
6. activate only approved assets through the central approved-character map/resolver;
7. verify English -> Naya + Zia and Math -> Gian + Paca while preserving fail-closed fallback for any missing asset;
8. keep all other subject pairings unchanged until separately approved.

The **five-character homepage hero is a separate composition task**. It should use the same approved production identities, but it must not be treated as the source asset for activity foreground characters or finalized from unapproved human-character sprites.

The paused character gate does not block separately approved Mainlagi Belajar work such as English narration quality, learning-illustration consistency, public/parent information architecture cleanup, or external physical-device acceptance. Any such work should be opened as its own scoped wave.
