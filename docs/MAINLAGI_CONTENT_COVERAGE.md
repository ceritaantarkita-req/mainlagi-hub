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
| Coloring | 2 | 0 | 2 | 1 | 100 | 98 |

Current total: **25 playable activities** — 19 assessed and 6 practice.

Mandatory four-academic-subject target: **400 playable activities minimum**.

Planned parity target for the three new first-class academic subjects:

| Planned subject | Current | Planned target |
| --- | ---: | ---: |
| Letters / Menulis | 0 | 100 |
| Logic / Logika | 0 | 100 |
| Science | 0 | 100 |

Planned creative-practice targets:

| Creative track | Current | Planned target |
| --- | ---: | ---: |
| Drawing / Menggambar | 0 | 100 |
| Coloring / Mewarnai | 2 | 100 |

If all targets are completed, the seven major academic subjects will contain **700 playable learning activities** and Drawing + Coloring will add **200 creative-practice activities**, for a planned nine-track catalog target of **900 playable activities**. Optional motion-only extras outside those targets are not included in the 900 target.

## Current authoring hierarchy

- subjects: 5
- learning paths: 5
- stages: 7
- lessons: 13
- versioned content packs: 13
- playable activities: 25
- skills: 12

Every current stage is owned by one learning path, every current activity is owned by one lesson and one content pack, and all 25 historical activity IDs remain stable.

## Current playable runtime inventory

| Runtime used by current content | Count |
| --- | ---: |
| Tap choice | 6 |
| Listen and choose | 5 |
| Matching | 7 |
| Guided trace | 1 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts describe the 25 activities that are actually playable today.

## Batch 5 reusable mechanic capability

Batch 5 expands authoring/runtime capability to **20 reusable mechanic contracts** without inflating the playable activity count:

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

Batch 5 therefore increases **mechanic capability from the 7 mechanics represented by current content to a 20-mechanic reusable library**, but current playable activity count stays **25** until later content waves instantiate the new mechanics.

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
- stable activity IDs and hierarchy ownership;
- content-pack version/age/skill/asset/answer/duplicate validation;
- deterministic future content IDs;
- reusable mechanic count and unique IDs;
- payload integrity for choice/pair/target/classification/order/path families;
- explicit mechanic evidence contracts and practice-only boundaries;
- hint/retry handoff to the existing mastery penalty logic;
- additive DB mechanic/evidence vocabulary compatibility.

The 100-activity targets remain future content targets and are not falsely counted as complete before their activity instances exist and pass review.
