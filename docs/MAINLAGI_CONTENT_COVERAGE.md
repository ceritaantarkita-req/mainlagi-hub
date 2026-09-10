# Mainlagi Learning Content Coverage

Last reviewed: 10 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capability. A reusable mechanic does **not** count as a playable learning activity until a real, meaningfully distinct activity instance exists and passes validation.

## Current playable baseline

| Subject | Playable | Assessed | Practice | Skills | Target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Bahasa Indonesia** | **100** | **99** | **1** | **23** | **100** | **0** |
| English | 6 | 6 | 0 | 3 | 100 | 94 |
| **Math** | **100** | **98** | **2** | **22** | **100** | **0** |
| Iqro | 4 | 3 | 1 | 2 | 100 | 96 |
| Letters / Menulis | 3 | 2 | 1 | 2 | 100 | 97 |
| Logic / Logika | 3 | 3 | 0 | 2 | 100 | 97 |
| Science / Sains | 3 | 3 | 0 | 2 | 100 | 97 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 | 100 | 98 |

Current Batch 8 repository/live-DB total: **221 playable activities — 214 assessed and 7 practice**.

Math and Bahasa Indonesia are now the first two subjects to reach their canonical 100-activity targets. The remaining academic/creative targets are intentionally not counted as complete before their activity instances exist and pass review.

The seven academic subject targets total 700 playable learning activities. Drawing/Menggambar and Coloring/Mewarnai add 200 creative-practice targets, producing the planned nine-track target of 900 playable activities. Drawing is not first-class yet.

## Current authoring hierarchy

- first-class subjects: 8
- learning paths: 8
- stages: 18
- lessons: 54
- versioned content packs: 54
- playable activities: 221
- skills: 57

Every current stage is owned by a learning path; every current activity is owned by a lesson and content pack; historical activity IDs remain stable.

## Batch 8 Bahasa inventory

Bahasa started Batch 8 with six historical activities. The expansion added exactly 94 new activities through four separately gated waves:

| Wave | Canonical Bahasa count | New activities | Main topics |
| --- | ---: | ---: | --- |
| A | 25 | 19 | vowels, vowel/consonant classification, case matching, initial sounds, listening |
| B | 50 | 25 | syllables, blending, words/meanings, picture-word matching, listening |
| C | 75 | 25 | sentence ordering/comprehension, instructions, vocabulary relations, short reading |
| D | 100 | 25 | punctuation/capitalization, contextual completion, vocabulary categories, listening detail, integrated reading review |

Wave migrations are `0019_batch8_bahasa_wave_a` through `0022_batch8_bahasa_wave_d`. All 94 additions are assessed through measured tap-choice, listen-and-choose, or matching evidence paths. The historical Bahasa story remains the single Bahasa practice activity.

Bahasa now has 23 mapped skills: three historical skills plus 20 Batch 8 skills distributed across letter/sound discrimination, syllables, vocabulary, listening, sentence comprehension, and applied reading/language review.

## Previous Batch 7 Math inventory

Math remains closed at exactly 100 activities: seven historical activities plus 93 Batch 7 additions across migrations `0015`–`0018`. Its 22 mapped skills and evidence boundaries remain unchanged.

## Current playable runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 147 |
| Listen and choose | 24 |
| Matching | 42 |
| Guided trace | 2 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts describe the complete 221-activity Batch 8 catalog.

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

Math and Bahasa have completed all four waves. **Batch 9 English to 100 is next**. English currently has six validated activities, so Wave A must add **19** meaningful activities to reach canonical count 25 rather than blindly adding 25 on top of the existing baseline.

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
- 94 unique Batch 8 Bahasa IDs with wave counts `19 + 25 + 25 + 25`;
- Bahasa closes at 99 assessed / 1 historical practice;
- 221 total activities / 214 assessed / 7 practice;
- 18 stages / 8 paths / 54 lessons / 54 packs / 57 skills;
- runtime inventory and subject floors;
- complete path/stage/lesson/pack ownership;
- content-pack version/age/skill/asset/answer/duplicate validation;
- migration `0019`–`0022` registration for the correct Bahasa wave IDs;
- preservation of historical learning tables and identities;
- measured evidence boundaries for every Batch 8 assessed addition;
- existing mastery anti-farming, adaptive, reporting, ownership, outbox, and award contracts.

Detailed Batch 8 production closure evidence is recorded in `EXPANSION_BATCH8_CLOSURE_2026-09-10.md`.
