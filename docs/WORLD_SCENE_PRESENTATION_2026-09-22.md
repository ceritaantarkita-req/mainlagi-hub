# Mainlagi World — Reusable Scene Presentation Layer — 22 September 2026

Status: **IMPLEMENTED ON ISOLATED WORLD PRODUCTION BRANCH / CI GREEN NOT YET CLAIMED**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave converts canonical `Scene.kind` into a reusable presentation contract and renderer so Petualangan Uang no longer owns Scene-level layout policy itself.

## 1. Reusable presentation policy

Source:

```text
src/lib/learning/world/worldScenePresentation.ts
WORLD_SCENE_PRESENTATION_VERSION = world-scene-presentation-v1
```

Canonical mappings:

```text
story     -> dialogue
challenge -> activity
choice    -> choice
recap     -> recap
closing   -> payoff
```

Every canonical Scene kind has one presentation entry containing:

- child-facing label;
- generic presentation surface;
- ambient-companion policy;
- Scene-title emphasis policy.

This is World-generic and does not reference Petualangan Uang Stage IDs.

## 2. Reusable renderer

Source:

```text
src/components/learning/world/WorldSceneRenderer.tsx
src/components/learning/world/WorldSceneRenderer.module.css
```

The renderer accepts:

- canonical Scene metadata;
- current Segment position;
- Segment count;
- optional World-specific companion layer;
- World-specific Segment content as children.

The renderer owns Scene presentation metadata and exposes:

```text
data-world-scene-frame
data-world-scene-kind
data-world-scene-presentation
data-world-scene-label
data-world-scene-content
```

Future Worlds can reuse the same Scene frame while providing different content, backgrounds and characters.

## 3. Separation of responsibilities

The new boundary is:

```text
canonical hierarchy
  -> Scene.kind
  -> reusable World Scene presentation policy
  -> reusable World Scene renderer
  -> World-specific Segment renderer/content
```

Petualangan Uang still owns the content payloads for its current Segment variants:

- narrative;
- concept;
- payoff;
- activity;
- narrative choice;
- recap.

That is intentional. The reusable Scene layer owns the **presentation/context surface**, not the financial-learning content model.

## 4. Companion policy

The old Petualangan Uang runtime conditional:

```text
activity OR narrative_choice OR recap -> show ambient Gavi/Paca
```

has been removed.

The generic Scene policy now decides:

```text
story     -> no ambient companion layer
challenge -> show companion layer
choice    -> show companion layer
recap     -> show companion layer
closing   -> no ambient companion layer
```

Petualangan Uang supplies Gavi/Paca as the current companion layer, but the reusable renderer does not know who those characters are.

This preserves the current dummy-character boundary:

```text
Gian canonical role -> Gavi runtime dummy
Naya canonical role -> Paca runtime dummy
```

## 5. Stage shell relationship

The Garden-style Stage shell remains responsible for:

- Back;
- Mainlagi wordmark;
- top-level Dengar;
- Stage title/location;
- global Segment progress;
- Stage environment/background.

The reusable Scene renderer sits inside that shell and owns:

- Scene label;
- Scene title;
- Scene surface identity;
- Scene-specific companion visibility;
- World-specific child content slot.

This avoids creating a second Stage runtime.

## 6. Runtime compatibility

No progression/persistence migration is required.

Still unchanged:

```text
completion unit   = Stage
resume unit       = Segment index
presentation unit = Scene
```

Scene presentation is derived from the already-authored canonical Scene and therefore does not change persisted IDs.

## 7. Browser/runtime proof

Petualangan Uang now renders all active Segments through:

```text
<WorldSceneRenderer ...>
```

Browser QA verifies representative presentation transitions:

```text
Stage 1 opening   -> story     -> dialogue
Stage 1 mini-game -> challenge -> activity
Stage 8 choice    -> choice    -> choice
Stage 8 recap     -> recap     -> recap
all Stage endings -> closing   -> payoff
```

This covers all five canonical Scene kinds.

## 8. Static QA

World contract QA now requires:

- presentation policy version `world-scene-presentation-v1`;
- exact coverage of all five canonical Scene kinds;
- valid surface mapping;
- every authored Petualangan Uang Scene resolves a generic presentation;
- Petualangan Uang runtime uses `WorldSceneRenderer`;
- Scene companion visibility does not drift back into a Petualangan-Uang-specific `showAmbientGuides` conditional;
- reusable renderer resolves presentation from `scene.kind`.

## 9. Deliberate non-goals

This wave does not:

- generalize Petualangan Uang finance Segment payloads into a global World content schema;
- change reusable mechanics;
- change narration cue IDs;
- produce final fixed narration;
- resume Gian/Naya production;
- alter World progress;
- activate mastery/evidence;
- touch Bermain/motion;
- change database schemas.

## 10. Production QA follow-through

Production wave 06 now adds the dedicated responsive QA/cleanup pass documented in:

```text
docs/WORLD_PRODUCTION_QA_2026-09-22.md
```

It covers all five Scene kinds at 320 / 390 / 430, adds Scene-local progress, hardens metadata overflow behavior and adjusts story/activity minimum height for the reusable Scene wrapper.

The responsive pass is now green at code head `e8f795b7d26a2cb3bf19fc787f6f58b2b85ed60a` through CI #1382 / run 35704255936.

Frozen checkpoint:

```text
checkpoint/world-petualangan-uang-production-green-20260922
```

The CI matrix includes Ubuntu, Windows, production build, dependency audit, secret history scan and mobile Chromium. Selected 320/430 Scene screenshots were manually reviewed with no P0/P1 World-specific blocker observed.

Do not move the older frozen World checkpoint branches or the new production-green checkpoint.
