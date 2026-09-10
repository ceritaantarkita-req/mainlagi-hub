# Mainlagi Learning Content Coverage

Last reviewed: 10 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capability. A reusable mechanic does **not** count as a playable learning activity until a real, meaningfully distinct activity instance exists and passes validation.

## Current playable baseline

| Subject | Playable | Assessed | Practice | Skills | Target | Gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Bahasa Indonesia** | **100** | **99** | **1** | **23** | **100** | **0** |
| **English** | **100** | **100** | **0** | **23** | **100** | **0** |
| **Math** | **100** | **98** | **2** | **22** | **100** | **0** |
| **Iqro** | **100** | **99** | **1** | **22** | **100** | **0** |
| Letters / Menulis | 3 | 2 | 1 | 2 | 100 | 97 |
| Logic / Logika | 3 | 3 | 0 | 2 | 100 | 97 |
| Science / Sains | 3 | 3 | 0 | 2 | 100 | 97 |
| Coloring / Mewarnai | 2 | 0 | 2 | 1 | 100 | 98 |
| Drawing / Menggambar | 0 | — | — | — | 100 | 100 |

Current Batch 10 repository/live-DB total: **411 playable activities — 404 assessed and 7 practice** across the current eight first-class subjects.

Math, Bahasa Indonesia, English, and Iqro are now at their canonical 100-activity catalog targets. Iqro's engineering/content-catalog count is complete, but every Iqro pack remains `expert_required`; this is not expert religious-learning approval.

The seven academic subject targets total 700 playable learning activities. Drawing/Menggambar and Coloring/Mewarnai add 200 creative-practice targets, producing the planned nine-track target of **900**. Current planned gap including not-yet-first-class Drawing is **489** activities.

## Current authoring hierarchy

- first-class subjects: 8
- learning paths: 8
- stages: 26
- lessons: 94
- versioned content packs: 94
- playable activities: 411
- skills: 97

Every current stage is owned by a learning path; every current activity is owned by a lesson and content pack; historical activity IDs remain stable.

## Batch 10 Iqro inventory

Iqro started Batch 10 with four historical activities. The expansion added exactly 96 new activities through four separately gated waves:

| Wave | Canonical Iqro count | New activities | Main topics |
| --- | ---: | ---: | --- |
| A | 25 | 21 | early Hijaiyah recognition/discrimination, listening, dot awareness, name/form matching |
| B | 50 | 25 | Dal/Dzal, Ra/Zai, Sin/Syin recognition/listening/dots/name/family discrimination |
| C | 75 | 25 | Shad through Qaf recognition/listening/dot features/name/family discrimination |
| D | 100 | 25 | Kaf through Ya, standalone Hamzah, integrated review |

Wave migrations are `0027_batch10_iqro_wave_a` through `0030_batch10_iqro_wave_d`. All 96 additions are assessed through measured tap-choice, listen-and-choose, or matching evidence paths. Iqro closes at **99 assessed / 1 historical practice**.

Batch 10 adds 20 Iqro skills; together with two historical Iqro skills, Iqro now has 22 mapped skills. The 20 new packs plus two historical Iqro packs produce **22 active Iqro packs**, all `expert_required`.

Authoring metadata mirrors the canonical `HIJAIYAH_TEMPLATES` engine registry and is automatically checked for 29 entries: 28 Hijaiyah letters plus standalone Hamzah. Tests enforce glyph, Latin label, dot count, and dot-zone parity.

### Expert-review boundary

`expert_required` must not be interpreted as `expert_approved`. Automated validation can verify IDs, registry parity, evidence contracts, and structural consistency; it cannot certify pronunciation, religious pedagogy, or teaching correctness. Formal expert review remains outstanding as a separate content-governance task.

## Previous closed subject inventories

- Bahasa Indonesia: exactly 100; 99 assessed / 1 historical story practice; 23 skills; Batch 8 migrations `0019`–`0022`.
- English: exactly 100; 100 assessed / 0 practice; 23 skills; Batch 9 migrations `0023`–`0026`.
- Math: exactly 100; 98 assessed / 2 practice; 22 skills; Batch 7 migrations `0015`–`0018`.

Historical IDs and evidence classifications remain stable.

## Current playable runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 251 |
| Listen and choose | 76 |
| Matching | 76 |
| Guided trace | 2 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 2 |

These counts sum exactly to the **411-activity** Batch 10 catalog.

## Existing subject foundations

Batch 6 foundations remain the starting point for the next three subject expansions:

| Subject | Path | Stage | Current activities | Required core |
| --- | --- | --- | ---: | ---: |
| Letters / Menulis | `letters-writing-foundations` | `letters-foundations` | 3 | 2 |
| Logic / Logika | `logic-thinking-foundations` | `logic-foundations` | 3 | 2 |
| Science / Sains | `science-discovery-foundations` | `science-foundations` | 3 | 2 |

`letters-trace-a` remains guided completion-only practice because the validated trace-fidelity evaluator is digit-specific. It must not manufacture letter-writing accuracy/mastery until letter-shape fidelity is explicitly implemented and validated.

## Reusable mechanic capability

Batch 5 established 20 reusable mechanic contracts across choice, pairing, targeting, classification, ordering, path, and practice families. Capability count and playable-activity count remain separate.

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

Math, Bahasa Indonesia, English, and Iqro have completed all four waves. **Batch 11 Letters/Menulis to 100 is next.** Letters currently has three validated activities, so Wave A must add **22** meaningful activities to reach canonical count 25 rather than blindly adding 25.

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
- 96 unique Batch 10 Iqro additions with wave counts `21 + 25 + 25 + 25`;
- Iqro closes at 99 assessed / 1 historical practice;
- all Batch 10 additions use measured evidence paths;
- no new generic trace is promoted to assessed;
- all Batch 10 Iqro packs remain `expert_required`;
- Hijaiyah metadata parity against the 29-entry canonical engine registry;
- 411 total activities / 404 assessed / 7 practice;
- 26 stages / 8 paths / 94 lessons / 94 packs / 97 skills;
- final runtime inventory and subject floors;
- complete path/stage/lesson/pack ownership;
- migration `0027`–`0030` registration for the correct Iqro wave IDs;
- preservation of historical learning tables and identities;
- existing mastery anti-farming, adaptive, reporting, ownership, outbox, and award contracts.

Detailed Batch 10 engineering production closure evidence is recorded in `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`.
