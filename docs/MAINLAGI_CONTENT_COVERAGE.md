# Mainlagi Learning Content Coverage

Last reviewed: 10 September 2026

This document is the Batch 0 expansion baseline for the Mainlagi learning library. It records what is actually represented by the canonical runtime/catalog before the large content expansion starts.

The long-term product target is not to create hundreds of duplicated React game components. Mainlagi will grow through reusable mechanics plus validated content packs, stable skill mappings, age/difficulty metadata, and evidence contracts.

## Current baseline

| Subject | Playable activities | Assessed | Practice | Skills | Mandatory expansion target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 6 | 5 | 1 | 3 | 90 | 84 |
| English | 6 | 6 | 0 | 3 | 90 | 84 |
| Math | 7 | 5 | 2 | 3 | 90 | 83 |
| Iqro | 4 | 3 | 1 | 2 | 90 | 86 |
| Coloring | 2 | 0 | 2 | 1 | not part of the 90-game requirement | — |

Current total: **25 playable activities**.

Mandatory four-subject target: **360 playable activities minimum**.

Planned parity target for the three new first-class subjects:

| Planned subject | Current | Planned target |
| --- | ---: | ---: |
| Letters / Menulis | 0 | 90 |
| Logic / Logika | 0 | 90 |
| Science | 0 | 90 |

If parity targets are completed, the seven major learning subjects will contain approximately **630 playable learning activities**, excluding Coloring and optional legacy motion games.

## Current curriculum hierarchy

- subjects: 5
- learning paths: 5
- stages: 7
- lessons: 13
- activities: 25
- skills: 12

All current stages are owned by a learning path and all current activities are owned by a lesson.

## Current mechanic/runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 6 |
| Listen and choose | 5 |
| Matching | 7 |
| Guided trace | 1 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

Current reusable-mechanic breadth is therefore still too narrow for a 600+ activity catalog. Batch 5 expands this into a broader mechanic library instead of solving quantity through duplicated one-off components.

## Assessment baseline

- assessed activities: 19
- practice activities: 6
- completion-only/practice content remains unable to manufacture academic accuracy
- optional motion activities remain outside core stage completion
- `math-trace-5-touch` is currently the only assessed guided-trace activity

## What counts toward the future target

A playable activity is counted as distinct only when it has meaningful educational or interaction variation, such as a different skill objective, content set, difficulty, mechanic, problem structure, or intentionally spaced review content.

The following do **not** count as a distinct game by themselves:

- the same question with answer order shuffled;
- a cosmetic color change;
- the same answer with a different emoji and no learning change;
- duplicate content with a new ID.

## Expansion gates

Batch-by-batch CI will prevent the library from dropping below the established baseline. The minimum count gates will be raised as each 30-activity content wave lands.

Planned subject waves:

```text
Wave A: 1–30
Wave B: 31–60
Wave C: 61–90
```

Bulk content creation begins only after the mobile foundation, voice latency work, scalable content schema, reusable mechanics, and new subject foundations are ready.

## Learning-integrity requirements during expansion

Every new assessed activity must resolve to:

```text
activity
 -> known subject/stage/lesson
 -> learning catalog spec
 -> known skill(s)
 -> supported measurable mechanic
 -> valid evidence contract
```

Mastery remains cumulative. A large activity library must not make mastery easier to farm through repeated trivial variants.

## Batch 0 automated contract

`scripts/run-expansion-baseline-tests.mjs` verifies:

- the known Batch 0 activity/path/stage/lesson/skill inventory;
- subject activity floors;
- activity ID uniqueness;
- runtime/catalog subject and stage consistency;
- valid child age ranges;
- current runtime inventory;
- assessed/practice inventory;
- curriculum coverage;
- existence of local speech-start latency instrumentation.

The four 90-game targets are intentionally recorded as future targets rather than enforced as passing minimums in Batch 0. Their CI floors will be raised only when the corresponding content waves are implemented and reviewed.
