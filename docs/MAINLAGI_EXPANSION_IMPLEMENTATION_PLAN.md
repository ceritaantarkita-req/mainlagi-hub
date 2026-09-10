# Mainlagi Expansion Implementation Plan

Last reviewed: 11 September 2026

This is the canonical repository plan for scaling Mainlagi from its original small learning catalog to nine structured learning/creative tracks. `main` remains the implementation source of truth; this document defines sequencing, target counts, and closure rules.

## Product goals

1. Keep mobile usability stable while content volume grows.
2. Keep Mainlagi-controlled speech consolidated behind `AudioManager`.
3. Scale through the canonical Subject -> Path -> Stage -> Lesson -> Content Pack -> Activity -> Mechanic -> Skill/evidence hierarchy.
4. Reuse mechanics rather than creating hundreds of duplicated activity engines.
5. Reach 100 meaningful playable activities each for Math, Bahasa Indonesia, English, Iqro, Letters/Menulis, Logic/Logika, and Science/Sains.
6. Reach 100 meaningful playable activities each for Drawing/Menggambar and Coloring/Mewarnai under creative-practice evidence rules.
7. Preserve mastery anti-farming, stage readiness, adaptive learning, parent reporting, offline sync, child ownership, and safety boundaries throughout expansion.

Seven academic subjects represent 700 target activities. Drawing and Coloring add 200 creative-practice targets. Full planned target: **900 playable activities**.

A "game" means a meaningfully distinct playable learning experience/level, not a separate React component. Answer shuffling, cosmetic changes, or decorative asset swaps do not create new activity counts by themselves.

## Engineering rules

- release-critical mobile widths: 320, 360, 375, 390, and 430 px;
- core learning is touch-first; camera remains optional;
- completion-only activities never manufacture academic accuracy;
- assessed activities require a validated measurable evidence contract;
- measured all-wrong outcomes remain accuracy `0`; missing measurement fails closed;
- trivial replay/variant farming must not accelerate mastery;
- stable historical IDs must be preserved;
- every new activity needs valid subject/path/stage/lesson/pack ownership, age range, difficulty, skill mapping, mechanic, and evidence metadata;
- no child voice recording/upload is introduced by speech features;
- Iqro material requiring expert validation retains explicit `expert_required` state until competent human approval;
- code/DB/CI/production success never means expert religious-learning approval;
- generic Latin letter tracing remains practice-only until a validated glyph-shape fidelity evaluator exists;
- migrations are additive/idempotent unless an explicitly reviewed corrective migration requires otherwise;
- each content wave lands through focused branch -> PR -> CI -> migration verification -> squash merge -> exact-SHA Cloudflare production smoke;
- target floors rise only when real playable instances exist and pass validation.

## Batch status

| Batch | Scope | Status |
| --- | --- | --- |
| 0 | Baseline, metrics, acceptance contracts | COMPLETE |
| 1 | Mobile design-system foundation | COMPLETE |
| 2 | Mobile route migration + Chromium QA | COMPLETE |
| 3 | AudioManager / voice latency architecture | COMPLETE |
| 4 | Scalable content architecture | COMPLETE |
| 5 | Reusable mechanic library | COMPLETE |
| 6 | Letters/Logic/Science foundations | COMPLETE |
| **7** | **Math to 100** | **COMPLETE IN PRODUCTION** |
| **8** | **Bahasa Indonesia to 100** | **COMPLETE IN PRODUCTION** |
| **9** | **English to 100** | **COMPLETE IN PRODUCTION** |
| **10** | **Iqro to 100** | **ENGINEERING/CATALOG COMPLETE IN PRODUCTION — EXPERT REVIEW STILL REQUIRED** |
| **11** | **Letters/Menulis to 100** | **COMPLETE IN PRODUCTION** |
| **12** | **Logic/Logika to 100** | **NEXT** |
| 13 | Science/Sains to 100 | PLANNED |
| 14 | Drawing + Coloring to 100 each | PLANNED |
| 15 | Adaptive/mastery/report scaling | PLANNED |
| 16 | Performance/accessibility/security/device QA | PLANNED |
| 17 | Final acceptance and production closure | PLANNED |

## Completed foundation batches

Batches 0–6 established the baseline, mobile design system, route migration and Chromium QA, centralized `AudioManager`, scalable content ownership, reusable mechanic contracts, and first-class Letters/Logic/Science foundations. Historical evidence and ownership boundaries remain in force.

## Batch 7 — Math to 100 — COMPLETE

Math expanded from 7 historical activities to exactly 100 through four production-gated waves:

- [x] Wave A — +18; PR #39; migration `0015`; SHA `94c21cf84bc809272c93d997b1e994abfc8e9bbb`.
- [x] Wave B — +25; PR #40; migration `0016`; SHA `3c2be1bac0c5f15c559bc3f5a4ab099f4fedf53f`.
- [x] Wave C — +25; PR #41; migration `0017`; SHA `add22b874174ebbb797461f9a0b8c52fe60f9250`.
- [x] Wave D — +25; PR #42; migration `0018`; SHA `82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd`.

Detailed closure: `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.

## Batch 8 — Bahasa Indonesia to 100 — COMPLETE

Bahasa Indonesia expanded from 6 historical activities to exactly 100:

- [x] Wave A — +19; PR #44; migration `0019`; SHA `47bf43240872bfedf4c22dacfc8d417a924411ac`.
- [x] Wave B — +25; PR #45; migration `0020`; SHA `8e0654006105933830ee6637cd3169940404fbf2`.
- [x] Wave C — +25; PR #46; migration `0021`; SHA `d84bf4929cd83d1cebf0017f4a987f04f2eeb0d2`.
- [x] Wave D — +25; PR #47; migration `0022`; SHA `9347f2a6e1e7d27448d0d7f7a7a0c45408b0db2e`.

Detailed closure: `EXPANSION_BATCH8_CLOSURE_2026-09-10.md`.

## Batch 9 — English to 100 — COMPLETE

English expanded from 6 historical activities to exactly 100:

- [x] Wave A — +19; PR #49; migration `0023`; SHA `eb4181df311011eb7724cfcef1565c50ab966120`.
- [x] Wave B — +25; PR #50; migration `0024`; SHA `3dd380f736c3821546e531da2b82593d39519271`.
- [x] Wave C — +25; PR #51; migration `0025`; SHA `4096e68cb6916d7fedd0cf37896a67f6153edd30`.
- [x] Wave D — +25; PR #52; migration `0026`; SHA `cc9430e1d3543de809b26a47d3dd16cad3803897`.

Wave C's first CI run caught a duplicate proposed historical skill ID before migration/merge; it was corrected without overwriting learning history. Detailed closure: `EXPANSION_BATCH9_CLOSURE_2026-09-10.md`.

## Batch 10 — Iqro to 100 — ENGINEERING/CATALOG COMPLETE

Iqro entered Batch 10 with four historical activities and added **96 new activities**:

- [x] Wave A — 4 -> 25, +21; PR #54; migration `0027`; SHA `75152bcf5d930c5a0f072e77a2679ca1c9edef73`; main CI #250, exact-SHA smoke success.
- [x] Wave B — 25 -> 50, +25; PR #55; migration `0028`; SHA `074026b1c8b62a5a63b3004e6d591c820dd3ec5d`; main CI #252, exact-SHA smoke success.
- [x] Wave C — 50 -> 75, +25; PR #56; migration `0029`; SHA `dc367d2fa712c3ec793d6161d8fdde434197a17b`; main CI #254, exact-SHA smoke success.
- [x] Wave D — 75 -> 100, +25; PR #57; migration `0030`; SHA `e927e3e283b3c15fb97239c9ce013ef6121d3947`; main CI #256, exact-SHA smoke success.

Batch 10 closes at 100 Iqro = 99 assessed / 1 historical practice. All active Iqro packs remain `expert_required`. Detailed engineering closure: `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`.

## Batch 11 — Letters/Menulis to 100 — COMPLETE

Letters entered Batch 11 with three historical activities. Wave A therefore correctly added 22 rather than blindly adding 25. Batch 11 adds **97 meaningful activities total: 85 assessed + 12 practice**, closing Letters at exactly **100 = 87 assessed / 13 practice**.

### Wave results

- [x] **Wave A 1–25** — B–F uppercase/lowercase recognition, case matching, visual discrimination, and basic pre-writing strokes. +22. PR #59, migration `0031`, SHA `cb6dfb662f0f14b8c66de29db30319ea08e06644`, main CI #261 exact-SHA smoke success.
- [x] **Wave B 26–50** — G–M recognition, case matching, sequence, visual discrimination, representative formation practice. +25. PR #60, migration `0032`, SHA `3c3f446b70c6047236216b0b505e3f5fe9da9c88`, main CI #263 exact-SHA smoke success.
- [x] **Wave C 51–75** — N–T recognition, case matching, sequence, visual discrimination, representative formation practice. +25. PR #61, migration `0033`, SHA `fdd0dae049b1cd4740286dd1b1a56700d9641154`, main CI #267 exact-SHA smoke success.
- [x] **Wave D 76–100** — U–Z recognition, case matching, end-alphabet sequence, visual discrimination, representative formation practice. +25. PR #62, migration `0034`, SHA `1ec8c69bce010424807d918a3b4655cd18b1f357`, main CI #270 exact-SHA smoke success.

### Batch 11 closure baseline

- 508 total playable activities;
- Letters exactly 100 = 87 assessed / 13 practice;
- Math, Bahasa Indonesia, English, and Iqro remain exactly 100 each;
- 489 assessed / 19 practice globally;
- 30 stages;
- 8 paths;
- 117 lessons;
- 117 content packs;
- 120 skills;
- 25 active Letters skills;
- zero active Letters activities missing mechanic/evidence metadata.

All assessed Batch 11 additions reuse measured choice/matching evidence paths. Generic pre-writing and letter-formation traces remain `practice`, `completion_only_v1`, and non-gating. Batch 11 does not claim validated Latin handwriting accuracy/mastery.

Wave C CI caught an activity-ID collision before migration and the ID was corrected. Wave D CI caught a redundant test assumption about the catalog-spec object; the manifest contract remained the canonical evidence-contract validation. Both were resolved before the relevant production migration.

Migrations `0031`–`0034` are live in canonical Supabase. Post-DDL advisors show no new Batch 11 regression. Detailed closure: `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.

## Batch 12 — Logic/Logika to 100 — NEXT

Current validated Logic baseline: **3 activities**, so Wave A must add **22 meaningful activities** to reach canonical count 25.

- Wave A 1–25: matching, classification, odd-one-out, simple ordering/path or equivalent measurable reasoning tasks using existing validated mechanics.
- Wave B 26–50: patterns, sequence, shadow/object association, comparisons.
- Wave C 51–75: before/after, maze/path, memory, missing object.
- Wave D 76–100: cause/effect, spatial relations, mixed reasoning, review, challenge.

Batch 12 must preserve existing Logic IDs and reuse measurable evidence contracts. Any new mechanic must be introduced as capability first and counted only when meaningful playable instances exist.

## Batch 13 — Science/Sains to 100

Current validated Science baseline: 3 activities.

- Wave A 1–25: animals, habitats, plants, living/non-living.
- Wave B 26–50: body/five senses, weather, day/night, water.
- Wave C 51–75: environment, materials/object properties, observation.
- Wave D 76–100: earth/space basics, simple cause/effect, mixed science review, challenge.

Do not encourage unsafe unsupervised experiments.

## Batch 14 — Drawing/Menggambar and Coloring/Mewarnai to 100 each

Drawing becomes first-class through the same canonical ownership model; Coloring preserves its two existing IDs. Free creative work remains practice/reporting-oriented and must not fabricate academic mastery.

Drawing:
- Wave A 1–25: straight/curved lines, paths, simple shapes, connect-dots.
- Wave B 26–50: guided objects from basic shapes, symmetry, pattern drawing.
- Wave C 51–75: copy/complete simple pictures, faces, animals, objects, scene parts.
- Wave D 76–100: guided scenes, creative prompts, mixed practice, child-safe open creation.

Coloring:
- Wave A 1–25: large simple shapes/objects, basic color exploration.
- Wave B 26–50: animals, food, vehicles, nature, everyday objects.
- Wave C 51–75: scenes, patterns, category-guided coloring, finer regions.
- Wave D 76–100: themed scenes, creative palettes, guided/free coloring, review collections.

Any objectively assessed tracing/drawing task requires an explicit validated evidence contract.

## Batch 15 — Adaptive/mastery/report scaling

Scale recommendations and reporting for hundreds of activities using skill weakness, confidence, evidence spacing, mechanic/content repetition, age, stage, difficulty, frustration/retry, and motion preferences. Prefer different items/mechanics for a weak skill instead of exact replay. Define evidence-diversity rules for selected core skills and keep Parent UI summarized rather than dumping raw activity lists.

## Batch 16 — Performance, accessibility, security, device QA

Audit catalog payload size, route/mechanic code splitting, assets, initial JS, TTS initialization, and query volume. Re-run accessibility, RLS/ownership/RPC/outbox/dependency/secret/advisor checks plus representative physical-device mobile/camera/audio/trace flows.

## Batch 17 — Final acceptance and production closure

CI must verify final target counts, unique IDs, content references, evidence contracts, adaptive/mastery/outbox regressions, mobile overflow gates, typecheck/lint/Ubuntu/Windows/simulations/build/audit/secret scan. Then run guest/authenticated/offline/multi-child acceptance, exact-SHA Cloudflare production smoke, and synchronize canonical docs.

## Content-wave rule

Every 100-activity subject target uses reviewable boundaries:

```text
Wave A: canonical count 1–25
Wave B: canonical count 26–50
Wave C: canonical count 51–75
Wave D: canonical count 76–100
```

Existing validated activities count toward the boundary. Never add 25 blindly on top of a non-zero baseline.

Completed entry baselines:
- Math entered Batch 7 with 7 -> Wave A added 18;
- Bahasa entered Batch 8 with 6 -> Wave A added 19;
- English entered Batch 9 with 6 -> Wave A added 19;
- Iqro entered Batch 10 with 4 -> Wave A added 21;
- Letters entered Batch 11 with 3 -> Wave A added 22.

Next:
- Logic enters Batch 12 with 3 -> Wave A must add **22**.

## Production closure rule

No batch is production-closed until:

- target counts and unique-ID/content/evidence contracts pass automated gates;
- required migrations are applied to canonical Supabase;
- live DB counts match repository contracts;
- advisor changes are reviewed;
- PR is merged to `main`;
- final `main` CI is green;
- exact-SHA Cloudflare production smoke succeeds;
- canonical handoff/coverage/deployment docs are synchronized;
- remaining limitations are documented explicitly.

For Iqro specifically, engineering closure and expert content approval remain separate statuses. For Letters/Menulis, completion-only tracing remains separate from objectively measured handwriting accuracy.
