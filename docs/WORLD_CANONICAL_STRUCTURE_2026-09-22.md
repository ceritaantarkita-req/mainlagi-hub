# Mainlagi World — Canonical Structure Contract — 22 September 2026

Status: **ACTIVE ON ISOLATED WORLD PRODUCTION BRANCH / NOT MERGED TO MAIN**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This document defines the reusable content hierarchy for Mainlagi World. It is intentionally separate from Mainlagi Belajar progression/mastery and from Bermain/motion.

## 1. Canonical hierarchy

```text
World
└── Chapter
    └── Stage
        └── Scene
            └── Segment
```

Contract source of truth:

```text
src/lib/learning/world/worldStructure.ts
WORLD_STRUCTURE_CONTRACT_VERSION = world-structure-v1
```

Petualangan Uang authored implementation:

```text
src/lib/learning/world/moneyWorldStructure.ts
MONEY_WORLD_STRUCTURE_VERSION = money-world-structure-v1
```

## 2. Meaning of each level

### World

A World is one coherent adventure/content universe.

It owns:

- stable World ID;
- title/version;
- ordered Chapter IDs.

A World is **not** a mastery record, child profile, age-morphing switch, or motion-game runtime.

### Chapter

A Chapter is a narrative arc inside a World.

It owns:

- stable Chapter ID;
- parent World ID;
- Chapter order;
- ordered Stage IDs.

Chapter grouping can drive map sections/milestones, but it does not silently create Belajar mastery or certificates.

### Stage

A Stage is the child-facing completion unit.

It owns:

- stable Stage ID;
- parent Chapter ID;
- global World order;
- ordered Scene IDs.

Current Petualangan Uang progression, unlock, checkpoint/resume and ★★★ completion remain Stage-based.

### Scene

A Scene is a reusable presentation/context slice inside a Stage.

Canonical Scene kinds:

```text
story
challenge
choice
recap
closing
```

It owns:

- stable Scene ID;
- parent Stage ID;
- Scene order inside that Stage;
- short authoring title;
- ordered Segment IDs.

A Scene may contain several narration/concept/payoff Segments, while an interaction can intentionally be a one-Segment challenge Scene.

Scene is now visible to the rendered runtime through:

```text
data-world-scene-id
data-world-scene-kind
data-world-scene-label
```

This lets future presentation/renderers switch by Scene without rewriting progression IDs.

### Segment

A Segment remains the smallest ordered runtime/content unit.

Current Segment variants include:

- narrative;
- concept;
- activity;
- payoff;
- narrative choice;
- recap.

Existing stable Segment IDs remain unchanged. Narration cue IDs and activity IDs therefore remain compatible with the previous World checkpoint.

## 3. Petualangan Uang topology

Current authored pilot:

```text
1 World
2 Chapters
8 Stages
44 Scenes
89 Segments
```

The previous 89 Segment sequence is preserved exactly. The Scene layer groups those existing Segments; it does not rewrite their content or IDs.

Example:

```text
World: money-festival
Chapter: money-chapter-01-road-to-festival
Stage: money-stage-01-money-use

Scene: money-scene-s01-opening
  - money-s01-narrative-01
  - money-s01-narrative-02
  - money-s01-narrative-03
  - money-s01-concept-money

Scene: money-scene-s01-money-price-match
  - money-s01-activity-01
```

## 4. Validation invariants

`validateCanonicalWorldStructure(...)` fails the contract if:

- Chapter, Stage, or Scene IDs are duplicated;
- Chapter order is not contiguous from 1;
- Stage order is not contiguous across the World;
- `world.chapterIds` disagrees with authored Chapter order;
- a Chapter points to another World;
- Stage membership/order disagrees with Chapter declarations;
- a Stage is orphaned or belongs to more than one Chapter;
- Scene membership/order disagrees with Stage declarations;
- Scene order is not contiguous inside a Stage;
- a Scene is empty;
- a Segment appears twice;
- Scene flattening changes the exact original Segment sequence;
- a Scene or Segment registry points to an unknown Stage.

Petualangan Uang static QA requires the validation result to be completely clean.

## 5. Runtime compatibility rule

The new Scene layer does **not** migrate persisted World progress.

Current compatibility remains:

```text
progress unit      = Stage
resume checkpoint  = Segment index
presentation group = Scene
```

This is deliberate. Existing local/cloud checkpoint data remains valid while the runtime gains a stronger authoring hierarchy.

A future persistence migration may store Scene identity as additional metadata, but it must not invalidate existing Segment checkpoints.

## 6. Renderer boundary

The current World Stage runtime resolves the active Scene for every active Segment.

If a Segment cannot resolve to an authored Scene, the runtime fails closed instead of silently rendering content outside the canonical hierarchy.

The Scene contract is presentation-agnostic: a future reusable Scene renderer can use the same IDs/kinds for dialogue, exploration, challenge, choice, recap, or other World presentations.

## 7. Character and narration boundaries

This hierarchy does not resume human-character production.

Current presentation still uses:

```text
Gian story role -> Gavi runtime dummy
Naya story role -> Paca runtime dummy
```

Stable story roles and narration cue IDs remain canonical so final production characters/audio can replace presentation assets later without changing the hierarchy.

## 8. Learning/evidence boundary

Canonical World structure does not make World activity evidence canonical Belajar evidence.

Still unchanged:

- World ★★★ = completion, not mastery;
- evidence bridge remains disabled;
- no SQL schema change in this wave;
- no profile age-range migration;
- no certificate/achievement mutation;
- no Bermain/motion dependency.

## 9. Authoring rule for future Worlds

A future World should be authored in this order:

```text
1. define World
2. define ordered Chapters
3. define ordered Stages
4. define authored Scenes for every Stage
5. attach existing/new Segments to exactly one Scene
6. run canonical structure validation
7. only then bind presentation/runtime
```

Do not hardcode a new World as one large Stage component and reconstruct hierarchy later.

## 10. Current compatibility helpers

Petualangan Uang exposes:

```text
getMoneyWorldScenes(stageId)
getMoneyWorldSceneForSegment(stageId, segmentId)
getMoneyWorldCanonicalSegmentIds(stageId)
```

These provide a migration path from the earlier Stage -> Segment implementation toward reusable Scene renderers without breaking the current pilot.

## 11. Next structural step

After this contract, the next production step is to build the **reusable Scene renderer/presentation layer** on top of the canonical Scene kinds, while preserving the current Gavi/Paca dummy and fixed narration IDs.

That next step should consume this hierarchy, not create a second parallel World structure.
