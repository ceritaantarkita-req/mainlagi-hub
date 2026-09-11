# Mainlagi Learning Content Coverage

Last reviewed: 11 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capability. A reusable mechanic does **not** count as a playable activity until a real, meaningfully distinct activity instance exists and passes validation.

## Current playable baseline

| Subject | Playable | Assessed | Practice | Skills | Target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Bahasa Indonesia** | **100** | **99** | **1** | **23** | **100** | **0** |
| **English** | **100** | **100** | **0** | **23** | **100** | **0** |
| **Math** | **100** | **98** | **2** | **22** | **100** | **0** |
| **Iqro** | **100** | **99** | **1** | **22** | **100** | **0** |
| **Letters / Menulis** | **100** | **87** | **13** | **25** | **100** | **0** |
| **Logic / Logika** | **100** | **100** | **0** | **22** | **100** | **0** |
| **Science / Sains** | **100** | **100** | **0** | **22** | **100** | **0** |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 | 100 | 98 |
| Drawing / Menggambar | 0 | — | — | — | 100 | 100 |

Current repository/live-DB total after Batch 13: **702 playable activities — 683 assessed and 19 practice** across eight first-class subjects.

All seven academic subjects are now at the canonical 100-activity catalog target. Iqro's engineering/content-catalog count is complete, but every active Iqro pack remains `expert_required`; this is not expert religious-learning approval.

The planned nine-track target remains **900 playable activities**. Remaining catalog gap is **198**: 98 Coloring activities plus 100 Drawing activities.

## Current hierarchy

- first-class subjects: 8
- learning paths: 8
- stages: 38
- lessons: 157
- versioned content packs: 157
- playable activities: 702
- assessed activities: 683
- practice activities: 19
- skills: 160

Every current stage belongs to a learning path; every current activity belongs to a lesson and content pack; historical IDs remain stable.

## Closed academic subject inventories

| Subject | Final count | Assessed | Practice | Skills | Expansion batch |
| --- | ---: | ---: | ---: | ---: | ---: |
| Math | 100 | 98 | 2 | 22 | 7 |
| Bahasa Indonesia | 100 | 99 | 1 | 23 | 8 |
| English | 100 | 100 | 0 | 23 | 9 |
| Iqro | 100 | 99 | 1 | 22 | 10 |
| Letters / Menulis | 100 | 87 | 13 | 25 | 11 |
| Logic / Logika | 100 | 100 | 0 | 22 | 12 |
| Science / Sains | 100 | 100 | 0 | 22 | 13 |

### Batch 12 Logic/Logika

Logic entered with three validated assessed activities and added **97 measured assessed activities** through canonical wave counts `22 + 25 + 25 + 25`.

| Wave | Logic count | Main scope | Migration |
| --- | ---: | --- | --- |
| A | 25 | relations, classification, odd-one-out, comparison, simple rules | `0035_batch12_logic_wave_a.sql` |
| B | 50 | patterns, sequences, associations, comparisons, spatial relations | `0036_batch12_logic_wave_b.sql` |
| C | 75 | conditional rules, multi-attribute classification, analogies, ordering, elimination/inference | `0037_batch12_logic_wave_c.sql` |
| D | 100 | composed rules, set reasoning, transitive comparison, spatial transforms, mixed review | `0038_batch12_logic_wave_d.sql` |

Logic closes at **100 assessed / 0 practice** and 22 active Logic skills. Detailed closure: `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`.

### Batch 13 Science/Sains

Science entered with three validated assessed activities and added **97 measured assessed activities** through canonical wave counts `22 + 25 + 25 + 25`.

| Wave | Science count | Main scope | Migration |
| --- | ---: | --- | --- |
| A | 25 | living/non-living, plants, animal features/habitats, senses/observation, weather/day-night | `0039_batch13_science_wave_a.sql` |
| B | 50 | life cycles, organism needs/food, materials, water-state changes, forces/motion | `0040_batch13_science_wave_b.sql` |
| C | 75 | Earth/sky patterns, healthy habits, ecosystems, environment care, observation/measurement | `0041_batch13_science_wave_c.sql` |
| D | 100 | investigation/evidence, living features/functions, material choice, weather/environment reasoning, mixed review | `0042_batch13_science_wave_d.sql` |

Science closes at **100 assessed / 0 practice** and 22 active Science skills. Detailed closure: `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`.

## Current playable runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 481 |
| Listen and choose | 76 |
| Matching | 125 |
| Guided trace | 14 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts sum exactly to **702**.

## Evidence boundaries

A playable activity counts only when it has meaningful educational or interaction variation. Answer-order shuffle, cosmetic changes, decorative asset swaps, duplicate content under a new ID, or a mechanic definition without a playable instance do not create new counts.

Every assessed activity must resolve to a known subject/path/stage/lesson/pack, known skill(s), supported mechanic, valid payload contract, and measurable evidence contract.

Mastery remains cumulative. Measured all-wrong attempts remain accuracy `0` evidence; missing measurement cannot become assessed evidence; trivial replay must not accelerate mastery.

Generic Latin pre-writing/letter traces remain `practice` + `completion_only_v1` and do not claim handwriting-shape mastery.

Free Drawing/Coloring participation must remain practice/reporting-oriented unless a separately validated objective evidence contract exists. Creative participation must not manufacture academic mastery.

Science content must remain age-appropriate and must not depend on unsafe unsupervised experiments.

## Expansion gates

Canonical wave boundaries remain:

```text
Wave A: canonical count 1–25
Wave B: canonical count 26–50
Wave C: canonical count 51–75
Wave D: canonical count 76–100
```

Math, Bahasa Indonesia, English, Iqro, Letters/Menulis, Logic/Logika, and Science/Sains have completed all four canonical waves.

**Batch 14 Drawing/Menggambar + Coloring/Mewarnai to 100 each is next.** Coloring starts from two validated historical practice activities, while Drawing starts at zero and must first become a proper first-class track under the canonical ownership model.

## Automated contracts

Current CI verifies, among existing learning contracts:

- exactly 100 activities for each of the seven academic subjects;
- Batch 12 Logic has 97 unique additions and closes at 100 assessed / 0 practice;
- Batch 13 Science has 97 unique additions and closes at 100 assessed / 0 practice;
- 702 total activities / 683 assessed / 19 practice;
- 38 stages / 8 paths / 157 lessons / 157 packs / 160 skills;
- final runtime inventory and subject floors;
- complete path/stage/lesson/pack ownership;
- migration parity through `0042_batch13_science_wave_d.sql`;
- preservation of historical learning tables and identities;
- existing mastery anti-farming, adaptive, reporting, ownership, outbox, and award contracts.
