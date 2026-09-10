# Mainlagi Learning Content Coverage

Last reviewed: 10 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capability. A reusable mechanic does **not** count as a playable learning activity until a real, meaningfully distinct activity instance exists and passes validation.

## Current playable baseline

| Subject | Playable | Assessed | Practice | Skills | Target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Bahasa Indonesia** | **100** | **99** | **1** | **23** | **100** | **0** |
| **English** | **100** | **100** | **0** | **23** | **100** | **0** |
| **Math** | **100** | **98** | **2** | **22** | **100** | **0** |
| Iqro | 4 | 3 | 1 | 2 | 100 | 96 |
| Letters / Menulis | 3 | 2 | 1 | 2 | 100 | 97 |
| Logic / Logika | 3 | 3 | 0 | 2 | 100 | 97 |
| Science / Sains | 3 | 3 | 0 | 2 | 100 | 97 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 | 100 | 98 |

Current Batch 9 repository/live-DB total: **315 playable activities — 308 assessed and 7 practice**.

Math, Bahasa Indonesia, and English are now the first three subjects to reach their canonical 100-activity targets. The remaining academic/creative targets are intentionally not counted as complete before their activity instances exist and pass review.

The seven academic subject targets total 700 playable learning activities. Drawing/Menggambar and Coloring/Mewarnai add 200 creative-practice targets, producing the planned nine-track target of 900 playable activities. Drawing is not first-class yet.

## Current authoring hierarchy

- first-class subjects: 8
- learning paths: 8
- stages: 22
- lessons: 74
- versioned content packs: 74
- playable activities: 315
- skills: 77

Every current stage is owned by a learning path; every current activity is owned by a lesson and content pack; historical activity IDs remain stable.

## Batch 9 English inventory

English started Batch 9 with six historical activities. The expansion added exactly 94 new activities through four separately gated waves:

| Wave | Canonical English count | New activities | Main topics |
| --- | ---: | ---: | --- |
| A | 25 | 19 | alphabet recognition/listening, initial sounds, colors, numbers one to five |
| B | 50 | 25 | animals, everyday objects, body vocabulary, family vocabulary |
| C | 75 | 25 | food, actions, semantic categories, expanded word-picture matching, listening |
| D | 100 | 25 | opposites, simple phrases, sentence completion, listening detail, integrated review |

Wave migrations are `0023_batch9_english_wave_a` through `0026_batch9_english_wave_d`. All 94 additions are assessed through measured tap-choice, listen-and-choose, or matching evidence paths. English closes at 100 assessed / 0 practice.

English now has 23 mapped skills: three historical skills plus 20 Batch 9 skills distributed across alphabet/phonics awareness, vocabulary, matching/listening, phrase/sentence comprehension, and integrated review.

Wave C's first PR CI correctly rejected a proposed duplicate skill ID, `english.word.picture_matching`. The new skill was renamed to `english.word.picture_matching.expanded` before migration/merge, preserving the historical skill identity. Live verification confirmed both IDs remain separate.

## Previous Batch 8 Bahasa inventory

Bahasa Indonesia remains closed at exactly 100 activities: six historical activities plus 94 Batch 8 additions across migrations `0019`–`0022`. It retains 99 assessed / 1 historical story practice and 23 mapped skills.

## Previous Batch 7 Math inventory

Math remains closed at exactly 100 activities: seven historical activities plus 93 Batch 7 additions across migrations `0015`–`0018`. Its 22 mapped skills and evidence boundaries remain unchanged.

## Current playable runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 194 |
| Listen and choose | 48 |
| Matching | 65 |
| Guided trace | 2 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts describe the complete 315-activity Batch 9 catalog and sum exactly to 315.

## Existing subject foundations

Batch 6 foundations remain unchanged:

| Subject | Path | Stage | Starter lesson/pack | Activities | Required core |
| --- | --- | --- | --- | ---: | ---: |
| Letters / Menulis | `letters-writing-foundations` | `letters-foundations` | `letters-a-foundations` / `letters.pack.letter-a` | 3 | 2 |
| Logic / Logika | `logic-thinking-foundations` | `logic-foundations` | `logic-visual-foundations` / `logic.pack.visual-basics` | 3 | 2 |
| Science / Sains | `science-discovery-foundations` | `science-foundations` | `science-living-world` / `science.pack.living-world` | 3 | 2 |

`letters-trace-a` remains guided completion-only practice because the validated trace-fidelity evaluator is digit-specific. It must not manufacture letter-writing accuracy/mastery until letter-shape fidelity is explicitly implemented and validated.

Current Iqro packs remain `expert_required`, not `expert_approved`. Passing repository/database CI is not equivalent to religious-learning expert review.

## Reusable mechanic capability

Batch 5 established 20 reusable mechanic contracts across choice, pairing, targeting, classification, ordering, path, and practice families.

- choice family: tap choice, listen-and-choose, pattern completion, odd-one-out, compare, missing item, story comprehension, find-object;
- pairing: matching, draw-line matching, memory pairs;
- targeting: drag-to-target;
- classification: sort/classify;
- ordering: ordering/sequence, connect-dots;
- path: guided trace, maze/path;
- practice-only: story, coloring, optional motion wrapper.

Seventeen contracts support assessed + practice mode; three remain intentionally practice-only. Capability count and playable-activity count must remain separate.

## What counts as a distinct playable activity

A playable activity counts only when there is meaningful educational or interaction variation, such as a different objective, content set, difficulty, mechanic, problem structure, or intentionally spaced review task.

The following do **not** create a distinct activity by themselves:

- answer-order shuffle;
- cosmetic color change;
- decorative emoji/asset swap with no learning change;
- duplicate content under a new ID;
- a mechanic definition with no playable instance.

Drawing/Coloring follow the same rule: palette/background swaps or nearly identical outlines alone do not create new activities.

## Expansion gates

Canonical wave boundaries remain:

```text
Wave A: 1–25
Wave B: 26–50
Wave C: 51–75
Wave D: 76–100
```

Math, Bahasa Indonesia, and English have completed all four waves. **Batch 10 Iqro to 100 is next**. Iqro currently has four validated activities, so Wave A must add **21** meaningful activities to reach canonical count 25 rather than blindly adding 25 on top of the existing baseline.

## Learning-integrity requirements

Every new assessed activity must resolve to:

```text
activity
 -> known subject/path/stage/lesson/content pack
 -> known skill(s)
 -> supported reusable mechanic
 -> valid payload contract
 -> valid measurable evidence contract
```

Mastery remains cumulative. Repeated trivial variants must not make mastery easier to farm. Measured zero-score attempts remain weak evidence instead of disappearing, while unmeasured completion cannot become assessed evidence.

Creative participation/completion may be reported, but free Drawing/Coloring practice must not manufacture academic accuracy or mastery. Objectively assessed tracing/drawing requires a validated evidence contract.

## Automated contracts

Current CI now verifies, among the existing learning contracts:

- exactly 100 canonical Math activities after Batch 7;
- exactly 100 canonical Bahasa activities after Batch 8;
- exactly 100 canonical English activities after Batch 9;
- 94 unique Batch 9 English additions with wave counts `19 + 25 + 25 + 25`;
- English closes at 100 assessed / 0 practice;
- 315 total activities / 308 assessed / 7 practice;
- 22 stages / 8 paths / 74 lessons / 74 packs / 77 skills;
- final runtime inventory and subject floors;
- complete path/stage/lesson/pack ownership;
- content-pack version/age/skill/asset/answer/duplicate validation;
- migration `0023`–`0026` registration for the correct English wave IDs;
- preservation of historical learning tables and identities;
- measured evidence boundaries for every Batch 9 assessed addition;
- existing mastery anti-farming, adaptive, reporting, ownership, outbox, and award contracts.

Detailed Batch 9 production closure evidence is recorded in `EXPANSION_BATCH9_CLOSURE_2026-09-10.md`.
