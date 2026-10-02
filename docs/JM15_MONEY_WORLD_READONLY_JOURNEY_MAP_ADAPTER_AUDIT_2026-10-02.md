# JM-15 — Petualangan Uang read-only Journey Map adapter audit

Date: **2 October 2026**  
Status: **AUDIT COMPLETE / READ-ONLY / NO RUNTIME CHANGE**  
Workstream: **Phase C — Canonical Journey Map System**  
Audit baseline: `main@cf0007d48734b3dcd3f9ad60bf340ab043ce02a6`

JM-14 predecessor closure:
- JM-12/JM-13 runtime PR **#426**
- runtime main `5c9638303d562f96556bb16a18c40a716b27e73f`
- runtime main CI **#2352 / run `36946329650` — FULL SUCCESS**
- JM-14 docs closure PR **#427**
- docs closure main `cf0007d48734b3dcd3f9ad60bf340ab043ce02a6`
- docs main CI **#2354 / run `36950193685` — FULL SUCCESS**
- exact Cloudflare smoke — **SUCCESS**

## 1. Objective and hard boundary

JM-15 audits the existing Petualangan Uang map/progression source before JM-16 redesign work.

JM-15 is intentionally **read-only**. It does not:

- change World runtime or visuals;
- change Chapter / Stage / Scene / Segment IDs or ordering;
- change story, narration, activity payloads or reusable mechanics;
- change World progression, unlock, checkpoint/resume, stars or completion;
- change supplemental evidence behavior;
- activate Belajar learning-attempt/mastery behavior for World;
- change database/schema/migrations;
- change canonical Completion/Share;
- change character assets/presentation;
- change age policy;
- modify Belajar, Bermain or Shop.

The goal is to define the exact presentation-safe adapter contract that JM-16 may consume.

## 2. Canonical sources audited

Primary World structure/content:

- `src/lib/learning/world/moneyWorld.ts`
- `src/lib/learning/world/worldStructure.ts`
- `src/lib/learning/world/moneyWorldStructure.ts`
- `src/lib/learning/world/moneyWorldContentAudit.ts`

Progress/resume:

- `src/lib/learning/world/progress.ts`
- `src/components/learning/world-v2/useMoneyWorldProgress.ts`

Current World map/runtime:

- `src/components/learning/world-v2/MoneyWorldExperience.tsx`
- `src/components/learning/world/WorldSceneRenderer.tsx`
- `src/app/child/[childId]/world/[worldId]/page.tsx`
- `src/app/child/[childId]/world/[worldId]/stage/[stageId]/page.tsx`

Presentation/age:

- `src/lib/learning/world/moneyWorldPresentation.ts`

Permanent contracts:

- `scripts/run-world-money-tests.mjs`
- `docs/WORLD_CANONICAL_STRUCTURE_2026-09-22.md`
- `docs/JM00_CANONICAL_JOURNEY_MAP_READONLY_AUDIT_2026-09-30.md`
- `docs/SI10_WORLD_ADAPTER_SAFE_CHECKPOINT_2026-09-30.md`

## 3. Exact canonical topology

World ID:

```text
money-festival
```

Current canonical hierarchy:

```text
World
└── 2 Chapters
    └── 8 Stages
        └── 44 Scenes
            └── 89 Segments
```

Content audit additionally locks:

```text
practice activity placements: 16
activities per Stage:          2
narrative choices:             1
recaps:                        1
```

### Chapters

| # | Chapter ID | Title | Stage range |
|---:|---|---|---|
| 1 | `money-chapter-01-road-to-festival` | Jalan ke Festival | 1–4 |
| 2 | `money-chapter-02-prepare-festival` | Siapkan Festival! | 5–8 |

### Stages

| # | Stage ID | Title | Location | Segments |
|---:|---|---|---|---:|
| 1 | `money-stage-01-money-use` | Uang Buat Apa? | Halaman rumah | 10 |
| 2 | `money-stage-02-price-change` | Kok Jadi Lebih Mahal? | Toko mainan | 14 |
| 3 | `money-stage-03-income-sources` | Uang Datang dari Mana? | Jalan kios | 11 |
| 4 | `money-stage-04-needs-wants` | Butuh atau Mau? | Mini market | 11 |
| 5 | `money-stage-05-saving` | Simpan Dulu Yuk | Taman tabungan | 9 |
| 6 | `money-stage-06-investment-intro` | Uang Bisa Bertambah? | Kebun nilai | 11 |
| 7 | `money-stage-07-risk` | Kalau Naik dan Turun? | Jembatan festival | 11 |
| 8 | `money-stage-08-final-festival` | Siapkan Festival! | Festival Mainlagi | 12 |

All eight canonical Stage definitions remain `playable: true`.

The structure validator rejects duplicate/orphan Chapter, Stage, Scene and Segment ownership, non-contiguous ordering, empty Scenes, and any Scene flattening that changes the exact authored Segment sequence.

## 4. Stable route contract

```text
World catalog:
/child/:childId/worlds

Petualangan Uang map:
/child/:childId/world/money-festival

Petualangan Uang Stage:
/child/:childId/world/money-festival/stage/:stageId
```

Current route owners remain:

- map -> `MoneyWorldMapScreen`;
- Stage -> `MoneyWorldStageScreen`.

JM-16 must preserve these routes and owners unless a separately justified route migration is explicitly authorized.

## 5. World progression semantics are not Belajar readiness

World progress source:

```text
MoneyWorldProgress
  worldId
  completedStageIds
  currentStageId
  currentSegmentIndex
  updatedAt
```

Canonical rules:

1. `completedStageIds` is normalized to an exact ordered prefix of the eight canonical Stages;
2. Stage 1 is always unlocked;
3. Stage N unlocks only when Stage N-1 is completed;
4. completed Stage -> exactly **★★★**;
5. incomplete Stage -> **0** stars;
6. World map current position is the first incomplete Stage;
7. in-Stage resume is separate through `currentStageId + currentSegmentIndex`;
8. World completion is all eight Stages completed;
9. no Belajar `getSubjectStageReadiness()` or mastery/evidence threshold participates in World unlock.

`useMoneyWorldProgress()` preserves local/cloud World state and reconciles by completed-Stage count, then timestamp. JM-16 must consume the existing state; it must not create a second progress store.

## 6. Existing map state projection

The current `MoneyWorldMapScreen` already derives:

- World complete;
- completed Stage count;
- first incomplete/current Journey Stage;
- Chapter completed counts;
- Stage unlocked/locked;
- Stage complete via three-star state;
- current Stage semantic `aria-current="step"`;
- stable Stage links;
- Chapter identity/order;
- canonical Stage identity/order.

This is valid **source behavior**, but the current visual is not automatically the JM-16 target visual.

## 7. Required read-only adapter contract for JM-16

JM-16 should consume a World-specific presentation adapter rather than passing Petualangan Uang into `BelajarJourneyMap`.

Minimum audited projection:

```text
WorldJourneyMapModel
  worldId
  title
  href
  completed
  completedStageCount
  totalStageCount
  nextStageId
  resumeStageId
  resumeSegmentIndex
  chapters[]
  stages[]
```

Chapter projection:

```text
id
order
title
stageIds
completedStageCount
totalStageCount
completed
```

Stage projection:

```text
id
order
chapterId
title
subtitle
locationLabel
href
playable
completed
current
open
locked
stars
canonicalSourceState
```

Derivation rules:

- Stage order/ownership -> canonical World structure only;
- completed -> `completedStageIds.includes(stage.id)`;
- current -> existing Journey semantics: first incomplete Stage;
- open/locked -> `isMoneyWorldStageUnlocked()`;
- stars -> existing `moneyWorldStars()`;
- resume Stage/index -> preserve `currentStageId + currentSegmentIndex` separately;
- Chapter progress -> canonical Chapter membership + completed Stage IDs;
- destination -> existing stable World Stage route.

The adapter must be pure presentation projection. It must not write progress.

## 8. Do not reuse the Belajar engine directly

Directly adding World to `BelajarJourneyMap` is rejected by this audit.

That component currently owns Belajar-specific assumptions including:

- `LearningSubjectId`;
- canonical Belajar Stage/activity registries;
- `getActivitiesForStage()`;
- age-filtered activity lists;
- Browse All activity catalog;
- Belajar readiness projection;
- subject-specific Stage detail / activity Continue behavior.

Petualangan Uang is a narrative World with Chapter / Stage / Scene / Segment hierarchy and no 100-activity Browse All contract.

JM-16 may reuse or extract **presentation primitives** where useful, but must not reuse Belajar curriculum/progression semantics.

## 9. Browse All and Stage-detail boundary

World must **not** inherit Belajar Browse All.

World is sequential narrative navigation. Existing stable Stage links are the canonical destination.

JM-16 therefore should preserve:

- map -> Stage route;
- Chapter grouping;
- Stage lock/current/complete semantics;
- Stage resume checkpoint inside the Stage runtime.

It should not invent a World activity catalog or expose internal Segments as a Browse All substitute.

## 10. Age/presentation boundary

Current Petualangan Uang presentation policy:

```text
pilot band: 6–8
3–5: future separate variant
9–12: future separate series
auto-morph same World by age: false
same World spans age 3–12: false
completion stars are mastery: false
```

JM-16 must not change this policy or make the World map silently behave like the Belajar 3–7 catalog.

## 11. Evidence/mastery boundary

World completion/stars/narrative progress remain semantically separate from Belajar mastery.

Permanent World QA explicitly prevents the World runtime from using the Belajar `LearningAttemptBridge` / ordinary learning-attempt path.

JM-15 does not alter any existing World supplemental-evidence infrastructure or its activation rules.

Therefore JM-16 map work must not:

- mint Belajar activity completion;
- unlock Belajar Stages;
- issue mastery/certificates;
- treat ★★★ as mastery evidence;
- create new evidence mappings;
- change current World evidence ingestion behavior.

## 12. Completion/Share boundary

SI-10 already closed the World Completion/Share adapter.

Preserve:

- `CanonicalCompletion(context="world", surface="inline")`;
- canonical parent-gated Share;
- Back -> World map;
- Again -> existing same-document World restart;
- Next -> canonical Stage order / final return to map;
- Chapter/finale supporting content;
- public-safe World share target;
- Gavi + Paca completion presentation.

JM-16 is a map redesign, not a Completion/Share rewrite.

## 13. JM-15 conclusion

No structural blocker was found for JM-16.

The safe architecture is:

```text
canonical World structure
+ existing MoneyWorldProgress
        ↓
World-specific read-only Journey Map adapter
        ↓
JM-16 desktop presentation
        ↓
existing stable World Stage routes/runtime
```

Do not:

```text
Petualangan Uang
        ↓
BelajarJourneyMap progression/activity engine
```

## 14. Next authorized sequence

```text
JM-15 — read-only adapter audit      COMPLETE in this document
JM-16 — Petualangan Uang desktop redesign
JM-17 — Petualangan Uang mobile/responsive
JM-18 — final Journey Map closure
```

JM-16 may implement the audited adapter and desktop map presentation.

JM-16 must preserve all hard boundaries above. JM-17 responsive work must not be pulled into the JM-16 package except where a minimal desktop implementation would otherwise be structurally invalid.
