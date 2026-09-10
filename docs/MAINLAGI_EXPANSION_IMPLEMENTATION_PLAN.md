# Mainlagi Expansion Implementation Plan

Last reviewed: 10 September 2026

This is the canonical repository copy of the major Mainlagi expansion plan agreed after the platform/foundation closure.

## Product goals

1. Fix the inconsistent mobile experience before scaling content.
2. Reduce Mainlagi-controlled voice/TTS latency and consolidate speech handling.
3. Replace the small hand-authored catalog model with a scalable content architecture.
4. Build a reusable mechanic library rather than hundreds of duplicated components.
5. Reach at least 100 playable activities each for Math, Bahasa Indonesia, English, and Iqro.
6. Add Letters/Menulis, Logic/Logika, and Science/Sains as first-class subjects, targeting 100 playable activities each for product parity.
7. Add Drawing/Menggambar and Coloring/Mewarnai as creative-practice tracks, targeting 100 playable activities each without fabricating academic mastery evidence.
8. Preserve evidence integrity, mastery anti-farming, stage readiness, adaptive learning, parent reporting, offline sync, ownership, and child-safety boundaries as the catalog grows.

The four original academic subjects represent at least **400** playable activities. If Letters/Menulis, Logic/Logika, and Science/Sains also reach parity, the seven academic subjects represent **700** playable activities. Drawing and Coloring add another **200** planned creative-practice activities, bringing the full planned nine-track catalog target to **900 playable activities**, excluding optional motion-only extras outside those targets.

A "game" in this target means a meaningfully distinct playable learning experience/level, not a separate React engine. Reordering the same answers, swapping decorative assets, or changing cosmetic colors does not create a new activity.

## Engineering rules

- mobile-first: release-critical widths are 320, 360, 375, 390, and 430 px;
- core learning remains touch-first; camera is optional;
- completion-only activities never manufacture academic accuracy;
- assessed activities need a measurable evidence contract;
- repeated trivial variants must not allow mastery farming;
- new content must have stable IDs, subject/path/stage/lesson ownership, valid age ranges, skill mappings, and review metadata where required;
- no child voice recording/upload is introduced as part of the voice-latency work;
- Iqro pronunciation/form content that requires expert validation must expose an explicit human-review state;
- each batch lands through focused branch -> PR -> full CI -> squash merge -> Cloudflare exact-SHA production smoke;
- target counts rise only when real playable content instances exist and pass validation.

## Batch sequence

### Batch 0 — Baseline, metrics, acceptance contracts — COMPLETE

- [x] Freeze exact subject/path/stage/lesson/activity/skill/mechanic counts.
- [x] Add machine-tested content floors and target-gap reporting.
- [x] Add mobile route/viewport acceptance matrix.
- [x] Add local-only speech-start latency instrumentation.
- [x] Record known mobile/voice baseline problems without claiming they are already fixed.

Batch 0 landed through PR #29 and established the starting expansion contract.

### Batch 1 — Mobile design-system rebuild — COMPLETE

- [x] Add shared spacing/type/gutter/safe-area/touch/grid tokens.
- [x] Add canonical mobile layout primitives for child/parent surfaces.
- [x] Add responsive card/grid/row/sheet/activity primitives.
- [x] Establish narrow-phone rules without hiding horizontal overflow.
- [x] Enforce an approximately 44x44 CSS px child touch-target contract in the shared foundation.

Batch 1 landed through PR #30.

### Batch 2 — Mobile route migration and responsive QA — COMPLETE

- [x] Migrate child entry/profile/home/library/subject/stage/activity/games/rewards surfaces to semantic mobile route boundaries.
- [x] Migrate Parent surfaces to the same foundation and collapse the desktop sidebar into a phone-safe navigation strip.
- [x] Migrate global game catalog/detail and `/play/[slug]` game surfaces to route boundaries.
- [x] Add production-build Chromium QA at 320, 360, 375, 390, 430, 768, and 1024 px.
- [x] Cover tap choice, audio choice, matching, trace, story, coloring, and motion-game wrapper representatives.
- [x] Fail CI on document-level horizontal overflow, undersized child controls, render/framework errors, page errors, or console errors.
- [x] Retain representative responsive screenshots as CI artifacts.
- [x] Make final production smoke depend on the browser mobile-route gate.

Automated browser QA does not replace physical iOS/Android camera, virtual-keyboard, orientation, audio, or finger-trace acceptance. Those remain part of Batch 16 device QA.

### Batch 3 — Voice latency / AudioManager rebuild — COMPLETE

- [x] Centralize product speech/TTS and generated feedback tones behind one `AudioManager`.
- [x] Add user-gesture unlock plus silent warmup that does not delay an immediate real prompt.
- [x] Cache locale-aware voices and refresh on `voiceschanged`.
- [x] Replace cancel-before-every-prompt with a bounded queue and deduplication policy.
- [x] Keep intentional interrupt for immediate feedback/system transitions and stop stale speech on navigation.
- [x] Standardize generic child-friendly speech rates while preserving explicit pedagogy-specific overrides.
- [x] Keep readable muted/unavailable/error fallback states.
- [x] Preserve privacy-safe local request-to-start latency instrumentation without prompt text, child IDs, recordings, or uploads.
- [x] Remove direct component-level `SpeechSynthesisUtterance` paths and add behavior/regression tests.

Batch 3 landed through PR #32 at squash SHA `20c643214cf60a2bbaefc402d77b89af24ba16cf`; Cloudflare deployment and exact-SHA production smoke succeeded. Physical-device latency remains separately measurable and is part of later device QA.

### Batch 4 — Scalable content architecture — COMPLETE

Canonical hierarchy:

```text
Subject
 -> Learning Path
 -> Stage
 -> Lesson
 -> Content Pack
 -> Activity Instance
 -> Mechanic
 -> Skill mapping / evidence contract
```

- [x] Add one canonical content manifest for path/lesson/pack/activity ownership.
- [x] Preserve all existing stable activity IDs and historical learning identity.
- [x] Derive compatibility curriculum/spec projections from the manifest rather than maintaining duplicate metadata lists.
- [x] Add versioned content packs and deterministic helpers for future generated activity IDs.
- [x] Define mechanic-to-runtime, assessment, required payload, and evidence-contract compatibility.
- [x] Validate hierarchy ownership, unique IDs, age ranges, difficulty, answers, matching pairs, skills/weights, motion boundaries, game slugs, asset references, and learning-spec drift.
- [x] Detect materially duplicate playable content, including shuffled answer-order duplicates.
- [x] Add explicit Iqro review states; current Iqro packs remain `expert_required`, not falsely expert-approved.
- [x] Add additive Supabase migration `0011_scalable_content_architecture`.
- [x] Backfill the 25 pre-Batch-6 activity rows without renaming IDs or altering attempt/mastery/progress identity.
- [x] Add architecture and migration regression tests to canonical CI.
- [x] Merge and verify exact production SHA through Cloudflare + public smoke.

Batch 4 landed through PR #33 at squash SHA `923315882f7244f24a2045398a061d12a2b472cf`. Migration `0011` is applied to canonical Supabase.

### Batch 5 — Reusable game-mechanics library — COMPLETE

- [x] Define exactly 20 reusable mechanic contracts instead of one-off game score formulas.
- [x] Cover choice, pairing, targeting, classification, ordering, path, and practice interaction families.
- [x] Include tap choice, listen-and-choose, matching, guided trace, drag-to-target, draw-line matching, sort/classify, ordering/sequence, pattern completion, odd-one-out, connect-dots, memory pairs, compare, missing item, maze/path, story comprehension, observation/find-object, story, coloring, and optional motion wrapper.
- [x] Define required payload keys and validate option/pair/target/classification/order/path references.
- [x] Define score, accuracy, correct/incorrect, hint, retry, completion, and mastery behavior for every mechanic.
- [x] Keep story, coloring, and optional motion wrapper practice-only.
- [x] Fail closed to completion-only when an assessed runtime lacks measurement; preserve measured all-wrong attempts as accuracy `0` evidence.
- [x] Reuse the existing mastery engine for independence penalties instead of double-penalizing hints/retries.
- [x] Add a runtime adapter that publishes explicit mechanic outcomes through the existing measurement pipeline.
- [x] Expand Supabase mechanic/evidence vocabulary additively in `0012_reusable_mechanic_library` without changing historical activity IDs or attempt/mastery rows.
- [x] Add reusable-mechanic and migration regression tests to canonical learning CI.
- [x] Merge PR #35 and apply migration `0012` to canonical Supabase.

Batch 5 landed through PR #35 at squash SHA `5164d3b40492531b4ba5654ecc192ab3f8db72d8`. The reusable library is **capability**, not 20 new playable activities. The catalog remained 25 playable activities until Batch 6 instantiated additional content.

### Batch 6 — New subject/curriculum foundations — COMPLETE

- [x] Add first-class `letters`, `logic`, and `science` subject IDs while preserving the five historical subject IDs.
- [x] Add one starter learning path, stage, lesson, and versioned content pack for each new subject.
- [x] Add six starter skills: two each for Letters/Menulis, Logic/Logika, and Science/Sains.
- [x] Add exactly nine real starter playable activities: three per new subject.
- [x] Integrate the new subjects into child navigation/Mainlagi World, age eligibility, adaptive ranking, progression/stage readiness, Parent Dashboard summaries, skill rows, and certificate eligibility.
- [x] Keep exactly two required core activities in each new starter stage.
- [x] Reuse existing measured touch-first mechanics instead of introducing a new camera/runtime dependency.
- [x] Keep `letters-trace-a` as required guided **practice** with `completion_only_v1`; do not fabricate letter-shape mastery until a letter-specific trace fidelity evaluator is validated.
- [x] Scale local and cloud `all-subjects` achievement logic from the historical five-subject threshold to the current eight first-class subjects.
- [x] Add additive Supabase migration `0013_new_subject_curriculum_foundations`.
- [x] Add additive Supabase migration `0014_batch6_award_catalog_scaling`.
- [x] Expand content, schema, adaptive, evidence, award, and baseline regression contracts.
- [x] Merge PR #37, verify post-merge CI on `main`, and verify exact-SHA Cloudflare production smoke.
- [x] Verify migrations `0013` and `0014` plus live production catalog counts in canonical Supabase.

Batch 6 production implementation landed through PR #37 at squash SHA `466634e0d673893cbe25fae68bfe5e22dad04f0a`. Post-merge CI run #210 succeeded, including Ubuntu quality/learning/simulation gates, Windows compatibility, Chromium mobile-route QA, production build, dependency audit, secret-history scan, and exact-SHA Cloudflare production smoke.

Canonical Supabase `estvtgflwkebomsqlolv` has migrations `0013` and `0014` applied. Live production verification matches the repository baseline: **8 first-class subjects, 34 playable activities, 27 assessed / 7 practice, 10 stages, 8 paths, 16 lessons, 16 content packs, and 18 skills**. Detailed closure evidence is recorded in `EXPANSION_BATCH6_CLOSURE_2026-09-10.md`.

### Batch 7 — Math to 100 — NEXT

Expand Math from the current 7-activity baseline to 100 meaningfully distinct playable activities. Land content in reviewable waves rather than one giant change.

- Wave A 1–25: number recognition, counting, quantity matching, and early quantity intuition.
- Wave B 26–50: quantity comparison, ordering, shapes, and patterns.
- Wave C 51–75: missing numbers, grouping, simple addition/subtraction, and size/length.
- Wave D 76–100: spatial position, measurement intuition, mixed operations, visual problems, review, and challenge.

### Batch 8 — Bahasa Indonesia to 100

- Wave A 1–25: letters, vowels/consonants, initial sounds, and case matching.
- Wave B 26–50: syllables, words, picture-word matching, and listening.
- Wave C 51–75: complete/order words, simple sentences, and vocabulary grouping.
- Wave D 76–100: story comprehension, relations/opposites, mixed language review, and challenge.

### Batch 9 — English to 100

- Wave A 1–25: alphabet, basic phonics awareness, colors, and numbers.
- Wave B 26–50: animals, objects, body, and family.
- Wave C 51–75: food, actions, categories, and word-picture matching/listening.
- Wave D 76–100: opposites, simple phrases/sentences, listening comprehension, review, and challenge.

### Batch 10 — Iqro to 100

- Wave A 1–25: Hijaiyah recognition, visual discrimination, and same-letter matching.
- Wave B 26–50: sequence, dots/form discrimination, and reviewed listen-and-find.
- Wave C 51–75: guided trace, similar-letter comparison, and broader recognition/matching.
- Wave D 76–100: broader sequence/trace, mixed review, and age-appropriate challenge.

Use explicit content/audio review states; code passing CI does not equal expert religious-learning review.

### Batch 11 — Letters/Menulis to 100

- Wave A 1–25: uppercase/lowercase recognition, matching, and pre-writing strokes.
- Wave B 26–50: guided letter formation, start direction, and connect-dots.
- Wave C 51–75: malformed-letter discrimination, copy/complete letters, and simple shape-to-letter preparation.
- Wave D 76–100: mixed formation, sequence, review, and age-appropriate writing challenge.

Generalize trace templates rather than hardcoding a separate evaluator for every glyph. Assessed letter tracing must remain blocked until its measurement fidelity is explicitly validated.

### Batch 12 — Logic/Logika to 100

- Wave A 1–25: matching, draw-line, classification, and odd-one-out.
- Wave B 26–50: patterns, sequence, shadow/object association, and comparisons.
- Wave C 51–75: before/after, maze/path, memory, and missing object.
- Wave D 76–100: cause/effect, spatial relations, mixed reasoning, review, and challenge.

### Batch 13 — Science/Sains to 100

- Wave A 1–25: animals, habitats, plants, and living/non-living.
- Wave B 26–50: body/five senses, weather, day/night, and water.
- Wave C 51–75: environment, materials/object properties, and observation.
- Wave D 76–100: earth/space basics, simple cause/effect, mixed science review, and challenge.

Do not encourage unsafe unsupervised experiments.

### Batch 14 — Drawing/Menggambar and Coloring/Mewarnai to 100 each

Expand Drawing and Coloring as creative-practice tracks with **100 playable activities each**. Preserve existing Coloring activity IDs. Introduce Drawing through the same canonical subject/path/stage/lesson/content-pack ownership model rather than as a disconnected mini-app. Reuse guided trace, connect-dots, coloring, and other compatible mechanics; extend mechanic vocabulary additively only if a genuinely distinct drawing interaction requires it.

Drawing waves:

- Wave A 1–25: straight/curved lines, paths, simple shapes, and connect-dots.
- Wave B 26–50: guided objects built from basic shapes, symmetry, and simple pattern drawing.
- Wave C 51–75: copy/complete simple pictures, faces, animals, objects, and scene parts.
- Wave D 76–100: guided scenes, creative prompts, mixed drawing practice, and open-ended child-safe creation.

Coloring waves:

- Wave A 1–25: large simple shapes, objects, and basic color exploration.
- Wave B 26–50: animals, food, vehicles, nature, and everyday-object themes.
- Wave C 51–75: scenes, patterns, category-guided coloring, and progressively finer regions.
- Wave D 76–100: themed scenes, creative palettes, mixed guided/free coloring, and review collections.

Drawing/Coloring participation, completion, preferences, and parent-visible progress may be recorded, but free creative practice must not manufacture academic accuracy or mastery. Any objectively assessed tracing/drawing task must declare an explicit measurable evidence contract.

### Batch 15 — Adaptive/mastery/report scaling

Use skill weakness, confidence, evidence spacing, mechanic/content repetition, age, stage, difficulty, frustration/retry, and motion preferences. Prefer a different item/mechanic for the same weak skill rather than replaying the exact same level. Define evidence-diversity rules for selected core skills. Keep Parent UI summarized rather than dumping hundreds of raw activities. Drawing/Coloring should influence creative-practice recommendations/reporting without being misrepresented as academic mastery.

### Batch 16 — Performance, accessibility, security, device QA

Audit catalog payload, route/mechanic code splitting, assets, initial JS, TTS initialization, and query volume. Re-run accessibility, RLS/ownership/RPC/outbox/dependency/secret/advisor checks and representative physical-device mobile/camera/audio/trace flows.

### Batch 17 — Final acceptance and production closure

CI must verify target counts, unique IDs, valid content references, evidence contracts, adaptive/mastery/outbox regressions, mobile overflow gates, typecheck/lint/Ubuntu/Windows/simulations/build/audit/secret scan. Then run guest/authenticated/offline/multi-child acceptance, exact-SHA Cloudflare production smoke, and synchronize canonical docs.

## Content-wave rule

Each 100-activity target is split into four reviewable waves:

```text
Wave A: 1–25
Wave B: 26–50
Wave C: 51–75
Wave D: 76–100
```

Do not merge a giant unreviewed 100-activity PR. Each wave must independently pass content validation, mechanic/evidence checks, responsive QA where applicable, and review requirements before the next wave raises the catalog floor.

For subjects that already contain activities when a wave starts, the wave boundary refers to the resulting canonical subject count. Existing validated activities count toward that subject's target; new work fills the remaining gap without renaming historical IDs.

## Completion rule

This expansion is complete only when:

- the target activity counts are real rather than metadata-only;
- all seven academic subjects reach 100 meaningful playable activities and participate correctly in progression/adaptive/reporting;
- Drawing and Coloring each reach 100 playable activities under their creative-practice/evidence boundaries;
- mobile QA is clean;
- voice handling remains consolidated and target-device latency evidence is acceptable;
- no assessed activity fabricates evidence;
- Iqro review requirements remain explicit;
- final CI is green;
- final exact-SHA production smoke passes;
- remaining limitations are documented explicitly.
