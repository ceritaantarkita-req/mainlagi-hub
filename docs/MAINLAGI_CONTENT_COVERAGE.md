# Mainlagi Learning Content Coverage

Last reviewed: 10 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capabilities. Mainlagi grows through validated content packs plus reusable mechanics; adding a mechanic contract does **not** by itself count as adding a playable learning activity.

## Current playable baseline

| Subject | Playable activities | Assessed | Practice | Skills | Planned expansion target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 6 | 5 | 1 | 3 | 100 | 94 |
| English | 6 | 6 | 0 | 3 | 100 | 94 |
| Math | 7 | 5 | 2 | 3 | 100 | 93 |
| Iqro | 4 | 3 | 1 | 2 | 100 | 96 |
| Letters / Menulis | 3 | 2 | 1 | 2 | 100 | 97 |
| Logic / Logika | 3 | 3 | 0 | 2 | 100 | 97 |
| Science / Sains | 3 | 3 | 0 | 2 | 100 | 97 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 | 100 | 98 |

Current Batch 6 repository total: **34 playable activities** — **27 assessed** and **7 practice**.

The 25 activities that predate Batch 6 retain their historical IDs. Batch 6 adds exactly nine intentional starter activities: three each for Letters/Menulis, Logic/Logika, and Science/Sains.

Mandatory four-academic-subject target: **400 playable activities minimum**.

The seven academic subject targets total **700 playable learning activities**. Drawing/Menggambar and Coloring/Mewarnai add **200 creative-practice targets**, producing the planned nine-track catalog target of **900 playable activities**. Drawing remains planned for its dedicated creative-track batch and is not falsely counted in the current Batch 6 baseline.

## Current authoring hierarchy

- first-class subjects: 8
- learning paths: 8
- stages: 10
- lessons: 16
- versioned content packs: 16
- playable activities: 34
- skills: 18

Every current stage is owned by one learning path, every current activity is owned by one lesson and one content pack, and all 25 pre-Batch-6 activity IDs remain stable.

### Batch 6 foundation inventory

| Subject | Starter path | Starter stage | Starter lesson | Starter content pack | Activities | Required core |
| --- | --- | --- | --- | --- | ---: | ---: |
| Letters / Menulis | `letters-writing-foundations` | `letters-foundations` | `letters-a-foundations` | `letters.pack.letter-a` | 3 | 2 |
| Logic / Logika | `logic-thinking-foundations` | `logic-foundations` | `logic-visual-foundations` | `logic.pack.visual-basics` | 3 | 2 |
| Science / Sains | `science-discovery-foundations` | `science-foundations` | `science-living-world` | `science.pack.living-world` | 3 | 2 |

Logic and Science each start with two required measured core activities plus one assessed variation. Letters deliberately uses a stricter boundary: `letters-find-a` is required and assessed, `letters-trace-a` is required guided formation practice with `completion_only_v1`, and `letters-match-case` is an assessed variation. Letter tracing stays excluded from academic accuracy/mastery until a letter-shape fidelity evaluator is explicitly validated. All three foundations remain touch-first and camera-independent.

## Current playable runtime inventory

| Runtime used by current content | Count |
| --- | ---: |
| Tap choice | 11 |
| Listen and choose | 5 |
| Matching | 10 |
| Guided trace | 2 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts describe the **34 activities** currently represented by the Batch 6 repository catalog.

## Batch 5 reusable mechanic capability

Batch 5 established **20 reusable mechanic contracts**. Batch 6 deliberately reuses the already-supported subset rather than inflating mechanic count while adding subjects:

| Family | Reusable mechanics |
| --- | --- |
| Choice | tap choice, listen-and-choose, pattern completion, odd-one-out, compare, missing item, story comprehension, find-object |
| Pairing | matching, draw-line matching, memory pairs |
| Targeting | drag-to-target |
| Classification | sort/classify |
| Ordering | ordering/sequence, connect-dots |
| Path | guided trace, maze/path |
| Practice-only | story, coloring, optional motion wrapper |

Of the 20 mechanic contracts, **17 support assessed + practice mode** and **3 are intentionally practice-only**. Assessed mechanics require measured evidence; absent measurement fails closed to completion-only. Story, coloring, and optional motion wrapper cannot self-promote into academic mastery evidence.

## Batch 6 integration boundaries

Letters/Menulis, Logic/Logika, and Science/Sains are first-class learning subjects rather than isolated mini-apps. Their starter activities participate in the same canonical systems as the older academic subjects:

- child subject/stage/activity navigation;
- canonical path, lesson, and versioned content-pack ownership;
- age eligibility;
- measured learning-attempt evidence where the runtime has a validated evidence path;
- completion-only practice where evidence fidelity is not yet validated;
- skill mastery and stage readiness;
- adaptive subject-scoped recommendation ranking;
- Parent Dashboard summaries and skill rows;
- server-owned activity catalog registration;
- certificate eligibility when completion and mastery requirements are genuinely met.

The local and cloud `all-subjects` achievement threshold is also scaled to the eight current first-class subjects. Drawing will require another intentional catalog-threshold update when it becomes first-class in its planned creative-track batch.

## What counts toward the future target

A playable activity counts as distinct only when it has meaningful educational or interaction variation, such as a different skill objective, content set, difficulty, mechanic, problem structure, or intentionally spaced review content.

The following do **not** count as a distinct game by themselves:

- the same question with answer order shuffled;
- a cosmetic color change;
- the same answer with a different emoji and no learning change;
- duplicate content with a new ID;
- a mechanic definition that has no activity/content instance.

Drawing and Coloring activities count only when the playable task itself is meaningfully distinct. Swapping a palette, background, decorative asset, or nearly identical outline does not by itself create a new activity.

## Expansion gates

Batch-by-batch CI prevents the library from dropping below the established baseline. Count floors rise only when reviewed content waves land.

```text
Wave A: 1–25
Wave B: 26–50
Wave C: 51–75
Wave D: 76–100
```

Bulk content creation begins after the mobile foundation, AudioManager, scalable content schema, reusable mechanic library, and new subject foundations are ready. Drawing/Coloring expansion follows the same canonical content-pack and review discipline rather than bypassing the learning platform architecture.

## Learning-integrity requirements during expansion

Every new assessed activity must resolve to:

```text
activity
 -> known subject/path/stage/lesson/content pack
 -> known skill(s)
 -> supported reusable mechanic
 -> valid payload contract
 -> valid measurable evidence contract
```

Mastery remains cumulative. A large activity library must not make mastery easier to farm through repeated trivial variants. Measured zero-score attempts remain weak evidence instead of disappearing; unmeasured completion cannot become assessed evidence.

Drawing/Coloring participation, completion, preferences, and parent-visible progress may be recorded, but free creative practice must not manufacture academic accuracy or mastery. Objectively assessed tracing/drawing tasks require an explicit measurable evidence contract.

## Automated contracts

Current expansion tests cover:

- playable subject/activity floors and runtime inventory;
- stable historical activity IDs and hierarchy ownership;
- Batch 6 starter subject/path/stage/lesson/pack/activity/skill ownership;
- content-pack version/age/skill/asset/answer/duplicate validation;
- deterministic future content IDs;
- reusable mechanic count and unique IDs;
- payload integrity for choice/pair/target/classification/order/path families;
- explicit mechanic evidence contracts and practice-only boundaries;
- conservative completion-only handling for unvalidated letter tracing;
- adaptive subject scoping, stage readiness, and Parent summary participation for all three Batch 6 subjects;
- local/cloud all-subject achievement threshold scaling;
- additive DB subject/mechanic/evidence vocabulary compatibility;
- preservation of historical learning tables and identities.

The 100-activity targets remain future content targets and are not falsely counted as complete before their activity instances exist and pass review.
