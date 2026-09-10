# Mainlagi Learning Content Coverage

Last reviewed: 11 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capability. A reusable mechanic does **not** count as a playable learning activity until a real, meaningfully distinct activity instance exists and passes validation.

## Current playable baseline

| Subject | Playable | Assessed | Practice | Skills | Target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Bahasa Indonesia** | **100** | **99** | **1** | **23** | **100** | **0** |
| **English** | **100** | **100** | **0** | **23** | **100** | **0** |
| **Math** | **100** | **98** | **2** | **22** | **100** | **0** |
| **Iqro** | **100** | **99** | **1** | **22** | **100** | **0** |
| **Letters / Menulis** | **100** | **87** | **13** | **25** | **100** | **0** |
| Logic / Logika | 3 | 3 | 0 | 2 | 100 | 97 |
| Science / Sains | 3 | 3 | 0 | 2 | 100 | 97 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 | 100 | 98 |
| Drawing / Menggambar | 0 | — | — | — | 100 | 100 |

Current Batch 11 repository/live-DB total: **508 playable activities — 489 assessed and 19 practice** across the current eight first-class subjects.

Math, Bahasa Indonesia, English, Iqro, and Letters/Menulis are now at their canonical 100-activity catalog targets. Iqro's engineering/content-catalog count is complete, but every Iqro pack remains `expert_required`; this is not expert religious-learning approval.

The seven academic subject targets total 700 playable learning activities. Drawing/Menggambar and Coloring/Mewarnai add 200 creative-practice targets, producing the planned nine-track target of **900**. Current planned gap including not-yet-first-class Drawing is **392** activities.

## Current authoring hierarchy

- first-class subjects: 8
- learning paths: 8
- stages: 30
- lessons: 117
- versioned content packs: 117
- playable activities: 508
- skills: 120

Every current stage is owned by a learning path; every current activity is owned by a lesson and content pack; historical activity IDs remain stable.

## Batch 11 Letters/Menulis inventory

Letters started Batch 11 with three historical activities. The expansion added exactly 97 new activities through four separately gated waves:

| Wave | Canonical Letters count | New | Assessed new | Practice new | Main topics |
| --- | ---: | ---: | ---: | ---: | --- |
| A | 25 | 22 | 19 | 3 | B–F uppercase/lowercase recognition, case matching, visual discrimination, pre-writing strokes |
| B | 50 | 25 | 22 | 3 | G–M recognition, case matching, alphabet sequence, visual discrimination, representative formation practice |
| C | 75 | 25 | 22 | 3 | N–T recognition, case matching, alphabet sequence, visual discrimination, representative formation practice |
| D | 100 | 25 | 22 | 3 | U–Z recognition, case matching, final alphabet sequence, visual discrimination, representative formation practice |

Wave migrations are `0031_batch11_letters_wave_a.sql` through `0034_batch11_letters_wave_d.sql`. Batch 11 adds **85 assessed + 12 practice** activities; together with the historical baseline, Letters closes at **87 assessed / 13 practice**.

Batch 11 adds 23 Letters skills and 23 content packs. Together with the historical two Letters skills, Letters now has **25 active skills**.

### Letter-writing evidence boundary

`letters-trace-a` and all generic Batch 11 pre-writing/letter-formation traces remain guided completion-only practice. The validated existing trace-fidelity evaluator is not a general Latin letter-shape evaluator, so these activities do not claim handwriting accuracy/mastery.

Practice traces use `completion_only_v1`, are not required for stage readiness, and cannot manufacture assessed mastery. Objectively assessed Latin handwriting remains blocked until an explicit glyph-shape fidelity evaluator is implemented and validated.

## Previous closed subject inventories

- Math: exactly 100; 98 assessed / 2 practice; 22 skills; Batch 7 migrations `0015`–`0018`.
- Bahasa Indonesia: exactly 100; 99 assessed / 1 historical story practice; 23 skills; Batch 8 migrations `0019`–`0022`.
- English: exactly 100; 100 assessed / 0 practice; 23 skills; Batch 9 migrations `0023`–`0026`.
- Iqro: exactly 100; 99 assessed / 1 historical practice; 22 skills; Batch 10 migrations `0027`–`0030`; all active packs remain `expert_required`.

Historical IDs and evidence classifications remain stable.

## Current playable runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 324 |
| Listen and choose | 76 |
| Matching | 88 |
| Guided trace | 14 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts sum exactly to the **508-activity** Batch 11 catalog.

## Remaining subject foundations

Batch 6 foundations remain the starting point for the next two academic subject expansions:

| Subject | Path | Stage | Current activities | Required core |
| --- | --- | --- | ---: | ---: |
| Logic / Logika | `logic-thinking-foundations` | `logic-foundations` | 3 | 2 |
| Science / Sains | `science-discovery-foundations` | `science-foundations` | 3 | 2 |

Letters/Menulis no longer has a count gap after Batch 11, although objectively assessed handwriting remains a future capability boundary as described above.

## Reusable mechanic capability

Batch 5 established reusable mechanic contracts across choice, pairing, targeting, classification, ordering, path, and practice families. Capability count and playable-activity count remain separate.

Current expansion deliberately reuses validated measured mechanics instead of inventing one engine per activity. Any objectively assessed tracing/drawing task still requires an explicit validated evidence contract.

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

Math, Bahasa Indonesia, English, Iqro, and Letters/Menulis have completed all four canonical waves. **Batch 12 Logic/Logika to 100 is next.** Logic currently has three validated activities, so Wave A must add **22** meaningful activities to reach canonical count 25 rather than blindly adding 25.

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

Current CI verifies, among the existing learning contracts:

- exactly 100 canonical Math activities after Batch 7;
- exactly 100 canonical Bahasa activities after Batch 8;
- exactly 100 canonical English activities after Batch 9;
- exactly 100 canonical Iqro activities after Batch 10;
- exactly 100 canonical Letters activities after Batch 11;
- 97 unique Batch 11 Letters additions with wave counts `22 + 25 + 25 + 25`;
- Letters closes at 87 assessed / 13 practice;
- all Batch 11 assessed activities use measured choice/matching evidence;
- generic Letters trace activities remain practice-only and do not gate readiness;
- 508 total activities / 489 assessed / 19 practice;
- 30 stages / 8 paths / 117 lessons / 117 packs / 120 skills;
- final runtime inventory and subject floors;
- complete path/stage/lesson/pack ownership;
- migration `0031`–`0034` registration for the correct Letters wave IDs;
- preservation of historical learning tables and identities;
- existing mastery anti-farming, adaptive, reporting, ownership, outbox, and award contracts.

Detailed Batch 11 engineering production closure evidence is recorded in `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.
