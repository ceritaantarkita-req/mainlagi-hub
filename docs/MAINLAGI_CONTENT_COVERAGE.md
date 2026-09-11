# Mainlagi Learning Content Coverage

Last reviewed: 11 September 2026

This document tracks the actual playable catalog separately from authoring/runtime capability and post-catalog learning-system behavior. A reusable mechanic or recommendation policy does **not** create a new playable activity by itself.

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

Current repository/live-DB total after Batch 15 remains **900 playable activities — 683 assessed and 217 practice** across nine first-class subjects.

Batch 15 changes adaptive/mastery/report behavior only. It does not add, remove, reclassify, or renumber activities, packs, skills, paths, lessons, or stages.

All nine planned tracks remain at the canonical 100-activity catalog target. Iqro's engineering/content-catalog count is complete, but every active Iqro pack remains `expert_required`; this is not expert religious-learning approval.

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

Detailed catalog expansion evidence is retained in closure documents for Batches 7–14. Batch 14 is the final activity-count expansion and added 198 creative-practice activities while preserving two historical Coloring activities.

## Batch 15 behavioral coverage

Batch 15 closes the first post-catalog learning-system scaling phase without changing catalog counts.

The production behavior now covers:

- one Adaptive Learning V2 policy across child landing, child path, Parent Progress, and Parent Reports;
- scoped stage-unlock evaluation and reusable static catalog descriptors for 900-item ranking;
- skill-indexed attempt history rather than repeated whole-history filtering per candidate;
- alternate same-skill remediation with additional runtime/mechanic diversity preference;
- recent exact-repeat penalties;
- confidence-building recommendations;
- spaced review for proficient/mastered skills without mastery decay/rewrite;
- frustration-aware soft difficulty from recent measured accuracy/retries/hints/interruptions;
- bounded Parent projections with 9 subject rows and capped recent-attempt detail;
- assessed-only mastery summaries;
- Drawing/Coloring recommendation support without mastery synthesis;
- certificate regression protection for completion-only creative subjects.

The dedicated Batch 15 scaling gate uses a 1,200-attempt synthetic history and verifies the full 9-subject recommendation/report sweep. PR CI #311 measured **72.8 ms** and a **7,937-byte** serialized bounded report, below guards of 5 seconds and 64 KiB.

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

Every assessed activity must resolve to known ownership/skill/mechanic/evidence contracts. Mastery remains cumulative; measured all-wrong attempts remain accuracy `0`; missing measurement cannot become assessed evidence; trivial replay must not accelerate mastery.

Generic Latin pre-writing/letter traces remain `practice` + `completion_only_v1` and do not claim handwriting-shape mastery.

Drawing/Coloring remain `practice` + `completion_only_v1`. They can record participation and support product reporting, but do not create academic or creative mastery evidence. Batch 15 explicitly reports creative `mastery: null` and regression-tests that full creative completion cannot satisfy academic certificate mastery readiness.

Science content remains age-appropriate and does not depend on unsafe unsupervised experiments.

## Automated contracts after Batch 15

Current CI verifies, among existing learning contracts:

- exactly 100 activities for each of all nine subjects;
- 900 total activities / 683 assessed / 217 practice;
- 46 stages / 9 paths / 197 lessons / 197 packs / 200 skills / 8 mechanics;
- complete path/stage/lesson/pack ownership and stable historical IDs;
- migration parity through `0046_batch14_creative_wave_d.sql`;
- Batch 14 creative practice/evidence boundaries;
- mastery anti-farming, measured-zero, missing-measurement, ownership, outbox, awards, and certificate contracts;
- Adaptive V2 scoped recommendation behavior for all nine subjects;
- no motion recommendation without opt-in;
- weak-skill alternate remediation over exact replay;
- legacy recommendation helpers resolve through the same Adaptive V2 policy;
- full creative completion remains non-mastering/non-certificate-eligible;
- bounded Parent report cardinality and payload guard under large history;
- 1,200-attempt catalog-scale performance guard.

No Batch 15 database migration exists because there is no Batch 15 schema/catalog persistence change. The next canonical phase is **Batch 16 — performance/accessibility/security/device QA**.
