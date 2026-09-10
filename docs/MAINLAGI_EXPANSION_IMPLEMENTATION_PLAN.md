# Mainlagi Expansion Implementation Plan

Last reviewed: 10 September 2026

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
- Iqro material requiring expert validation must retain an explicit human-review state;
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
| **8** | **Bahasa Indonesia to 100** | **NEXT** |
| 9 | English to 100 | PLANNED |
| 10 | Iqro to 100 | PLANNED |
| 11 | Letters/Menulis to 100 | PLANNED |
| 12 | Logic/Logika to 100 | PLANNED |
| 13 | Science/Sains to 100 | PLANNED |
| 14 | Drawing + Coloring to 100 each | PLANNED |
| 15 | Adaptive/mastery/report scaling | PLANNED |
| 16 | Performance/accessibility/security/device QA | PLANNED |
| 17 | Final acceptance and production closure | PLANNED |

## Completed foundation batches

### Batch 0 — Baseline, metrics, acceptance contracts — COMPLETE

Established frozen catalog floors, target-gap reporting, mobile route/viewport acceptance, local-only speech-start instrumentation, and explicit baseline limitations. Landed through PR #29.

### Batch 1 — Mobile design-system rebuild — COMPLETE

Established shared spacing/type/gutter/safe-area/touch/grid tokens, responsive child/parent layout primitives, narrow-phone behavior, and approximately 44x44 CSS px child touch targets. Landed through PR #30.

### Batch 2 — Mobile route migration and responsive QA — COMPLETE

Migrated child, parent, catalog, and play routes to the mobile foundation. Chromium production-build QA covers 320/360/375/390/430/768/1024 px and fails on horizontal overflow, undersized child controls, rendering/page/framework errors, or console errors. Physical-device acceptance remains separately scheduled for Batch 16.

### Batch 3 — AudioManager rebuild — COMPLETE

Centralized product speech/TTS and feedback tones behind `AudioManager`, including gesture unlock/warmup, locale-aware voice caching, bounded queue/deduplication, stale-speech cancellation, standardized rates, readable fallback handling, and privacy-safe local latency telemetry. Landed through PR #32 at `20c643214cf60a2bbaefc402d77b89af24ba16cf`.

### Batch 4 — Scalable content architecture — COMPLETE

Established the canonical hierarchy and validation for ownership, stable IDs, content packs, ages, difficulty, answers, matching pairs, skills/weights, motion boundaries, assets, review states, and duplicate-content detection. Migration `0011_scalable_content_architecture`; PR #33 at `923315882f7244f24a2045398a061d12a2b472cf`.

### Batch 5 — Reusable game-mechanics library — COMPLETE

Established 20 reusable mechanic contracts across choice, pairing, targeting, classification, ordering, path, and practice families. Seventeen support assessed/practice mode; story, coloring, and optional motion wrapper remain practice-only. Mechanic capability does not itself count as a playable activity. Migration `0012_reusable_mechanic_library`; PR #35 at `5164d3b40492531b4ba5654ecc192ab3f8db72d8`.

### Batch 6 — New subject/curriculum foundations — COMPLETE

Added `letters`, `logic`, and `science` as first-class subjects with starter paths/stages/lessons/packs, six skills, and nine real activities. Integrated them with navigation, adaptive ranking, progression/readiness, parent reporting, awards/certificates, and database catalog ownership.

`letters-trace-a` remains completion-only practice because the validated trace evaluator is digit-specific. Local/cloud all-subject award logic was scaled to eight current first-class subjects. Migrations `0013` and `0014`; PR #37 at `466634e0d673893cbe25fae68bfe5e22dad04f0a`. Detailed closure: `EXPANSION_BATCH6_CLOSURE_2026-09-10.md`.

## Batch 7 — Math to 100 — COMPLETE

Batch 7 expanded Math from seven historical activities to exactly **100**, while keeping the original IDs and evidence boundaries stable.

### Wave results

- [x] **Wave A 1–25** — number recognition, counting, quantity matching, early quantity intuition. Added 18 because seven historical Math activities already counted toward the target. PR #39, migration `0015`, SHA `94c21cf84bc809272c93d997b1e994abfc8e9bbb`, exact-SHA production smoke success.
- [x] **Wave B 26–50** — quantity comparison, number ordering, shapes/properties, patterns. Added 25. PR #40, migration `0016`, SHA `3c2be1bac0c5f15c559bc3f5a4ab099f4fedf53f`, exact-SHA production smoke success.
- [x] **Wave C 51–75** — missing numbers, grouping, addition/subtraction within 10, size/length. Added 25. PR #41, migration `0017`, SHA `add22b874174ebbb797461f9a0b8c52fe60f9250`, exact-SHA production smoke success.
- [x] **Wave D 76–100** — spatial position, measurement intuition, mixed operations, visual problems, integrated review/challenge. Added 25. PR #42, migration `0018`, SHA `82acd7d39c6cab98f38c92e4f6d7be6afe52cdcd`, main CI #220 exact-SHA production smoke success.

### Batch 7 closure baseline

- 8 first-class subjects;
- 127 total playable activities;
- Math exactly 100;
- 120 assessed / 7 practice;
- 14 stages;
- 8 paths;
- 34 lessons;
- 34 content packs;
- 37 skills.

All 93 Batch 7 additions use measured `choice_accuracy_v1` or `matching_accuracy_v1` evidence. Migrations `0015`–`0018` are applied in canonical Supabase `estvtgflwkebomsqlolv`, live counts match repository expectations, and post-DDL advisor review shows no new Batch 7 regression.

Detailed evidence: `EXPANSION_BATCH7_CLOSURE_2026-09-10.md`.

## Batch 8 — Bahasa Indonesia to 100 — NEXT

Current validated Bahasa baseline is 6 activities, so Wave A must add **19** meaningful activities to reach canonical count 25. Do not add 25 on top of the six existing activities.

- Wave A 1–25: letters, vowels/consonants, initial sounds, and case matching.
- Wave B 26–50: syllables, words, picture-word matching, and listening.
- Wave C 51–75: complete/order words, simple sentences, and vocabulary grouping.
- Wave D 76–100: story comprehension, relations/opposites, mixed language review, and challenge.

Requirements: preserve the six historical Bahasa IDs; reuse supported measured mechanics first; introduce new mechanics only when educationally necessary; keep every assessed item tied to valid measurement; raise catalog/test/DB floors only after each wave passes review.

## Batch 9 — English to 100

Current validated English baseline: 6 activities.

- Wave A 1–25: alphabet, basic phonics awareness, colors, and numbers.
- Wave B 26–50: animals, objects, body, and family.
- Wave C 51–75: food, actions, categories, and word-picture matching/listening.
- Wave D 76–100: opposites, simple phrases/sentences, listening comprehension, review, and challenge.

## Batch 10 — Iqro to 100

Current validated Iqro baseline: 4 activities.

- Wave A 1–25: Hijaiyah recognition, visual discrimination, same-letter matching.
- Wave B 26–50: sequence, dots/form discrimination, reviewed listen-and-find.
- Wave C 51–75: guided trace, similar-letter comparison, broader recognition/matching.
- Wave D 76–100: broader sequence/trace, mixed review, age-appropriate challenge.

Use explicit content/audio review states. Code/DB/CI success does not equal expert religious-learning approval. Assessed tracing remains blocked unless measurement fidelity is validated.

## Batch 11 — Letters/Menulis to 100

Current validated Letters baseline: 3 activities.

- Wave A 1–25: uppercase/lowercase recognition, matching, pre-writing strokes.
- Wave B 26–50: guided letter formation, start direction, connect-dots.
- Wave C 51–75: malformed-letter discrimination, copy/complete letters, shape-to-letter preparation.
- Wave D 76–100: mixed formation, sequence, review, age-appropriate writing challenge.

Generalize trace templates rather than hardcoding a separate evaluator for every glyph. Assessed letter tracing remains blocked until fidelity is explicitly validated.

## Batch 12 — Logic/Logika to 100

Current validated Logic baseline: 3 activities.

- Wave A 1–25: matching, draw-line, classification, odd-one-out.
- Wave B 26–50: patterns, sequence, shadow/object association, comparisons.
- Wave C 51–75: before/after, maze/path, memory, missing object.
- Wave D 76–100: cause/effect, spatial relations, mixed reasoning, review, challenge.

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

Scale recommendations and reporting for hundreds of activities using skill weakness, confidence, evidence spacing, mechanic/content repetition, age, stage, difficulty, frustration/retry, and motion preferences. Prefer a different item/mechanic for a weak skill instead of exact replay. Define evidence-diversity rules for selected core skills and keep Parent UI summarized rather than dumping raw activity lists.

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

Existing validated activities count toward the boundary. Example: Bahasa currently has six, therefore Batch 8 Wave A adds 19 to reach 25. Never add 25 blindly on top of an existing baseline.

Do not merge a giant unreviewed 100-activity PR. Each wave independently passes content validation, mechanic/evidence checks, migration verification, CI, and production closure before the next wave raises the floor.

## Completion rule

The full expansion is complete only when:

- target counts represent real meaningful playable activities rather than metadata-only rows;
- all seven academic subjects reach 100 and participate correctly in progression/adaptive/reporting;
- Drawing and Coloring each reach 100 under their creative-practice/evidence boundaries;
- mobile QA remains clean;
- voice handling stays consolidated and target-device latency evidence is acceptable;
- no assessed activity fabricates evidence;
- Iqro review requirements remain explicit;
- final CI is green;
- final exact-SHA production smoke passes;
- remaining limitations are documented explicitly.
