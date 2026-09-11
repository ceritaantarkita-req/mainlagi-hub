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
| **Coloring / Mewarnai** | **100** | **0** | **100** | **21** | **100** | **0** |
| **Drawing / Menggambar** | **100** | **0** | **100** | **20** | **100** | **0** |

Current repository/live-DB catalog total remains **900 playable activities — 683 assessed and 217 practice** across nine first-class subjects. Batch 15 does not alter catalog counts, classifications, IDs, or persistence schema.

All nine planned tracks are at the canonical 100-activity catalog target. Iqro's engineering/content-catalog count is complete, but every active Iqro pack remains `expert_required`; this is not expert religious-learning approval.

## Current hierarchy

- first-class subjects: 9
- learning paths: 9
- stages: 46
- lessons: 197
- versioned content packs: 197
- playable activities: 900
- assessed activities: 683
- practice activities: 217
- skills: 200
- reusable manifest mechanics: 8

Every current stage belongs to a learning path; every current activity belongs to a lesson and content pack; historical IDs remain stable.

## Closed subject inventories

| Subject | Final count | Assessed | Practice | Skills | Expansion batch |
| --- | ---: | ---: | ---: | ---: | ---: |
| Math | 100 | 98 | 2 | 22 | 7 |
| Bahasa Indonesia | 100 | 99 | 1 | 23 | 8 |
| English | 100 | 100 | 0 | 23 | 9 |
| Iqro | 100 | 99 | 1 | 22 | 10 |
| Letters / Menulis | 100 | 87 | 13 | 25 | 11 |
| Logic / Logika | 100 | 100 | 0 | 22 | 12 |
| Science / Sains | 100 | 100 | 0 | 22 | 13 |
| Coloring / Mewarnai | 100 | 0 | 100 | 21 | 14 |
| Drawing / Menggambar | 100 | 0 | 100 | 20 | 14 |

### Batch 12 Logic/Logika

Logic entered with three validated assessed activities and added **97 measured assessed activities** through canonical wave counts `22 + 25 + 25 + 25`. It closes at **100 assessed / 0 practice** and 22 active Logic skills. Detailed closure: `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`.

### Batch 13 Science/Sains

Science entered with three validated assessed activities and added **97 measured assessed activities** through canonical wave counts `22 + 25 + 25 + 25`. It closes at **100 assessed / 0 practice** and 22 active Science skills. Detailed closure: `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`.

### Batch 14 Drawing + Coloring

Drawing entered at zero and Batch 14 added **100 Drawing creative-practice activities**. Coloring preserved its two historical practice activities and added **98 new creative-practice activities**. Total Batch 14 additions: **198**.

| Wave | Drawing | Coloring | New total | Main scope | Migration |
| --- | ---: | ---: | ---: | --- | --- |
| A | 25 | 25 | 48 | Drawing first-class foundation, lines/shapes/paths/connect-dots; Coloring foundation and simple color exploration | `0043_batch14_creative_wave_a.sql` |
| B | 50 | 50 | 50 | objects from shapes, animals, nature, faces/scenes; warm/cool play, patterns, scenes, vehicles, fantasy | `0044_batch14_creative_wave_b.sql` |
| C | 75 | 75 | 50 | space/layers, textures, two-side balance, story sequence, inventions; palette relationships, contrast, mood, materials, story scenes | `0045_batch14_creative_wave_c.sql` |
| D | 100 | 100 | 50 | composition/focus, character design, maps/worlds, visual design, open drawing studio; limited palettes, time/season, character palettes, scene storytelling, open color studio | `0046_batch14_creative_wave_d.sql` |

Every Batch 14 creative addition remains `practice` with `completion_only_v1` evidence. Drawing/Coloring participation is reportable completion, not objective mastery. Detailed closure: `EXPANSION_BATCH14_CLOSURE_2026-09-11.md`.

## Batch 15 learning-system coverage

Batch 15 closes the post-catalog adaptive/mastery/report scaling phase without adding catalog rows.

Coverage now includes:

- bounded Adaptive Learning V2 ranking over every subject;
- a single recommendation policy shared by child/parent consumers;
- weak-skill remediation that can prefer alternate same-skill activities/runtimes instead of exact replay;
- explicit preservation of assessed-only mastery qualification;
- recommendation support for Drawing/Coloring without synthetic mastery;
- bounded Parent-report projections by subject, assessed skill, stage status, recommendation, and capped recent attempts;
- explicit creative certificate regression so completion-only Drawing/Coloring cannot satisfy assessed mastery gates;
- a 1,200-attempt regression/benchmark included in the canonical learning test suite.

Detailed closure: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

## Current playable runtime inventory

| Runtime | Count |
| --- | ---: |
| Tap choice | 481 |
| Listen and choose | 76 |
| Matching | 125 |
| Guided trace | 14 |
| Story | 1 |
| Motion game | 3 |
| Coloring | 100 |
| Drawing | 100 |

These counts sum exactly to **900**.

## Evidence boundaries

A playable activity counts only when it has meaningful educational or interaction variation. Answer-order shuffle, cosmetic changes, decorative asset swaps, duplicate content under a new ID, or a mechanic definition without a playable instance do not create new counts.

Every assessed activity must resolve to a known subject/path/stage/lesson/pack, known skill(s), supported mechanic, valid payload contract, and measurable evidence contract.

Mastery remains cumulative. Measured all-wrong attempts remain accuracy `0` evidence; missing measurement cannot become assessed evidence; trivial replay must not accelerate mastery.

Generic Latin pre-writing/letter traces remain `practice` + `completion_only_v1` and do not claim handwriting-shape mastery.

Drawing/Coloring activities remain `practice` + `completion_only_v1`. They can record participation and support product reporting/recommendations, but do not create academic or creative mastery evidence unless a separately validated objective evaluator/evidence contract is introduced in a future reviewed change.

Science content remains age-appropriate and does not depend on unsafe unsupervised experiments.

## Expansion gates

Canonical wave boundaries remain historical content-authoring evidence:

```text
Wave A: canonical count 1–25
Wave B: canonical count 26–50
Wave C: canonical count 51–75
Wave D: canonical count 76–100
```

All nine planned tracks have completed their canonical path to 100. Existing validated activities counted toward boundaries; the system did not blindly add 25 on top of non-zero baselines.

## Automated contracts

Current CI verifies, among existing learning contracts:

- exactly 100 activities for each of all nine subjects;
- Batch 12 Logic closes at 100 assessed / 0 practice;
- Batch 13 Science closes at 100 assessed / 0 practice;
- Batch 14 generated additions are 198 unique activities = Drawing 100 + Coloring 98, while two historical Coloring activities are preserved;
- every generated Batch 14 creative activity is practice/completion-only;
- **900 total activities / 683 assessed / 217 practice**;
- **46 stages / 9 paths / 197 lessons / 197 packs / 200 skills / 8 mechanics**;
- final runtime inventory and subject exact targets;
- complete path/stage/lesson/pack ownership;
- migration parity through `0046_batch14_creative_wave_d.sql`;
- preservation of historical learning tables and identities;
- mastery anti-farming, assessed-evidence integrity, ownership, outbox, and award contracts;
- Batch 15 bounded ranking across all nine subjects;
- Drawing/Coloring remain recommendation-capable practice with no fabricated mastery/certificate eligibility;
- same-skill remediation can prefer a useful variant over exact replay;
- Parent report stays one bounded row per subject with capped recent attempts;
- the 1,200-attempt Batch 15 scale fixture stays under the `<64 KiB` report-payload and `<5s` conservative CI sweep gates.

The next canonical phase is **Batch 16 — performance, accessibility, security, and representative physical-device QA**. It should optimize and validate the shipped system rather than reopen the closed activity-count target.