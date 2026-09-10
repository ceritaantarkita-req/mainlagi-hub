# Mainlagi Expansion Implementation Plan

Last reviewed: 10 September 2026

This is the canonical repository copy of the major Mainlagi expansion plan agreed after the platform/foundation closure.

## Product goals

1. Fix the inconsistent mobile experience before scaling content.
2. Reduce Mainlagi-controlled voice/TTS latency and consolidate speech handling.
3. Replace the small hand-authored catalog model with a scalable content architecture.
4. Build a reusable mechanic library rather than hundreds of duplicated components.
5. Reach at least 100 playable activities each for Math, Bahasa Indonesia, English, and Iqro.
6. Add Letters/Menulis, Logic, and Science as first-class subjects, targeting 100 playable activities each for product parity.
7. Add Drawing/Menggambar and Coloring/Mewarnai as creative-practice tracks, targeting 100 playable activities each without fabricating academic mastery evidence.
8. Preserve evidence integrity, mastery anti-farming, stage readiness, adaptive learning, parent reporting, offline sync, ownership, and child-safety boundaries as the catalog grows.

The four mandatory academic subjects represent at least **400** playable activities. If Letters/Menulis, Logic, and Science also reach parity, the seven major academic subjects represent **700** playable activities. Drawing and Coloring add another **200** planned creative-practice activities, bringing the full planned nine-track catalog target to **900** playable activities, excluding optional motion-only extras outside those targets.

A "game" in this target means a meaningfully distinct playable learning experience/level, not a separate React engine. Reordering the same answers or changing cosmetic colors does not create a new game.

## Engineering rules

- mobile-first: release-critical widths are 320, 360, 375, 390, and 430 px;
- core learning remains touch-first; camera is optional;
- completion-only activities never manufacture academic accuracy;
- assessed activities need a measurable evidence contract;
- repeated trivial variants must not allow mastery farming;
- new content must have stable IDs, subject/path/stage/lesson ownership, valid age ranges, skill mappings, and review metadata where required;
- no child voice recording/upload is introduced as part of the voice-latency batch;
- Iqro pronunciation/form content that requires expert validation must expose an explicit human-review state;
- each batch lands through focused branch -> PR -> full CI -> squash merge -> Cloudflare exact-SHA production smoke.

## Batch sequence

### Batch 0 — Baseline, metrics, acceptance contracts

- [x] Freeze exact subject/path/stage/lesson/activity/skill/mechanic counts.
- [x] Add machine-tested content floors and target-gap reporting.
- [x] Add mobile route/viewport acceptance matrix.
- [x] Add local-only speech-start latency instrumentation.
- [x] Record known mobile/voice baseline problems without claiming they are already fixed.

Batch 0 landed through PR #29. Its production baseline is the starting contract for all later expansion work.

### Batch 1 — Mobile design-system rebuild

- [x] Add shared spacing/type/gutter/safe-area/touch/grid tokens.
- [x] Add canonical mobile layout primitives for child/parent surfaces.
- [x] Add responsive card/grid/row/sheet/activity primitives.
- [x] Establish narrow-phone rules without hiding horizontal overflow.
- [x] Enforce an approximately 44x44 CSS px child touch-target contract in the shared foundation.

Batch 1 landed through PR #30 and established the reusable mobile foundation used by route migration.

### Batch 2 — Mobile route migration and responsive QA

- [x] Migrate child entry/profile/home/library/subject/stage/activity/games/rewards surfaces to semantic mobile route boundaries.
- [x] Migrate Parent surfaces to the same foundation and collapse the desktop sidebar into a phone-safe navigation strip.
- [x] Migrate global game catalog/detail and `/play/[slug]` game surfaces to route boundaries.
- [x] Add production-build Chromium QA at 320, 360, 375, 390, 430, 768, and 1024 px.
- [x] Cover tap choice, audio choice, matching, trace, story, coloring, and motion-game wrapper representatives.
- [x] Fail CI on document-level horizontal overflow, undersized child controls, render/framework errors, page errors, or console errors.
- [x] Retain representative responsive screenshots as CI artifacts.
- [x] Make final production smoke depend on the browser mobile-route gate.

The automated gate does not replace physical iOS/Android camera, virtual-keyboard, orientation, audio, or finger-trace acceptance. Those remain part of Batch 16 device QA. See `MOBILE_ROUTE_QA.md`.

### Batch 3 — Voice latency / AudioManager rebuild

- [x] Centralize product speech/TTS and generated feedback tones behind one `AudioManager`.
- [x] Add user-gesture unlock plus silent warmup that does not delay an immediate real prompt.
- [x] Cache locale-aware voices and refresh on `voiceschanged`.
- [x] Replace cancel-before-every-prompt with a bounded queue and deduplication policy.
- [x] Keep intentional interrupt for immediate feedback/system transitions and stop stale speech on navigation.
- [x] Standardize generic child-friendly speech rates while preserving explicit pedagogy-specific overrides.
- [x] Keep readable muted/unavailable/error fallback states.
- [x] Preserve privacy-safe local request-to-start latency instrumentation without prompt text, child IDs, recordings, or uploads.
- [x] Remove direct component-level `SpeechSynthesisUtterance` paths and add behavior/regression tests.

Batch 3 landed through PR #32. Its squash merge is `20c643214cf60a2bbaefc402d77b89af24ba16cf`; Cloudflare deployment and exact-SHA production smoke succeeded. This closes Mainlagi-controlled speech-path fragmentation. It does **not** claim a synthetic CI millisecond improvement on real child devices; physical-device latency remains measurable through the local instrumentation and is part of later device QA.

### Batch 4 — Scalable content architecture

Canonical hierarchy is now:

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
- [x] Derive compatibility curriculum/spec projections from the manifest rather than keeping a second hand-maintained activity metadata list.
- [x] Add versioned content packs and deterministic helpers for future generated activity IDs.
- [x] Define mechanic-to-runtime, assessment, required payload, and evidence-contract compatibility.
- [x] Validate hierarchy ownership, unique IDs, age ranges, difficulty, answers, matching pairs, skills/weights, motion boundaries, game slugs, asset references, and learning-spec drift.
- [x] Detect materially duplicate playable content, including shuffled answer-order duplicates.
- [x] Add explicit Iqro review states; existing Iqro packs remain `expert_required`, not falsely expert-approved.
- [x] Add additive Supabase `0011_scalable_content_architecture` with `learning_content_packs` and pack/lesson/mechanic/evidence/revision metadata on `learning_activities`.
- [x] Backfill the 25 existing activity rows without renaming activity IDs or altering attempt/mastery/progress identity.
- [x] Add Batch 4 validation to canonical learning/engine CI and migration regression tests.
- [x] Merge PR #33 and verify the exact production SHA through Cloudflare + public smoke.

Batch 4 production closure: squash SHA `923315882f7244f24a2045398a061d12a2b472cf`, Cloudflare Build `0b98b636-b17a-4e64-902b-7b2b958b1e3f`, Version `5559c169-20db-448d-8162-029146ddb4bf`. Production smoke succeeded. The Batch 4 baseline contains 5 subjects, 5 paths, 7 stages, 13 lessons, 13 content packs, 25 playable activities, 12 skills, and 7 mechanics used by current content. The 25 activities remain 19 assessed and 6 practice. Migration `0011` is applied to canonical Supabase and all 25 repository activities are fully registered there.

### Batch 5 — Reusable game-mechanics library

- [x] Define exactly 20 reusable mechanic contracts instead of one-off game score formulas.
- [x] Cover choice, pairing, targeting, classification, ordering, path, and practice interaction families.
- [x] Include tap choice, listen-and-choose, matching, guided trace, drag-to-target, draw-line matching, sort/classify, ordering/sequence, pattern completion, odd-one-out, connect-dots, memory pairs, compare, missing item, maze/path, story comprehension, observation/find-object, story, coloring, and optional motion wrapper.
- [x] Define required payload keys and validate option/pair/target/classification/order/path references.
- [x] Define score, accuracy, correct/incorrect, hint, retry, completion, and mastery behavior for every mechanic.
- [x] Keep story, coloring, and optional motion wrapper practice-only.
- [x] Fail closed to completion-only when an assessed runtime lacks measurement; preserve measured all-wrong attempts as accuracy `0` evidence rather than dropping weak evidence.
- [x] Reuse the existing mastery engine for independence penalties instead of double-penalizing hints/retries.
- [x] Add a runtime adapter that publishes explicit mechanic outcomes to `LearningAttemptBridge` through the existing measurement event.
- [x] Expand Supabase mechanic/evidence vocabulary additively in `0012_reusable_mechanic_library` without changing historical activity IDs or attempt/mastery rows.
- [x] Add reusable-mechanic and migration regression tests to canonical learning CI.

The reusable library is **capability**, not 20 new playable activities. Current playable activity count remains 25 until later content waves instantiate these mechanics. Batch 5 is complete only after migration `0012`, full PR CI, squash merge, and exact-SHA production smoke are verified.

### Batch 6 — New subject/curriculum foundations

Add first-class Letters/Menulis, Logic, and Science subject IDs plus paths/stages/lessons/skills/age bands/stage requirements and starter content. Integrate them into child navigation, adaptive ranking, progression, Parent Dashboard, and reports.

### Batch 7 — Math to 100

- Wave A 1–25: number recognition, counting, quantity matching and early quantity intuition.
- Wave B 26–50: quantity comparison, ordering, shapes and patterns.
- Wave C 51–75: missing numbers, grouping, simple addition/subtraction and size/length.
- Wave D 76–100: spatial position, measurement intuition, mixed operations, visual problems and review/challenge.

### Batch 8 — Bahasa Indonesia to 100

- Wave A 1–25: letters, vowels/consonants, initial sounds and case matching.
- Wave B 26–50: syllables, words, picture-word matching and listening.
- Wave C 51–75: complete/order words, simple sentences and vocabulary grouping.
- Wave D 76–100: story comprehension, relations/opposites, mixed language review and challenge.

### Batch 9 — English to 100

- Wave A 1–25: alphabet, basic phonics awareness, colors and numbers.
- Wave B 26–50: animals, objects, body and family.
- Wave C 51–75: food, actions, categories and word-picture matching/listening.
- Wave D 76–100: opposites, simple phrases/sentences, listening comprehension and review/challenge.

### Batch 10 — Iqro to 100

- Wave A 1–25: Hijaiyah recognition, visual discrimination and same-letter matching.
- Wave B 26–50: sequence, dots/form discrimination and reviewed listen-and-find.
- Wave C 51–75: guided trace, similar-letter comparison and broader recognition/matching.
- Wave D 76–100: broader sequence/trace, mixed review and age-appropriate challenge.

Use explicit content/audio review states; code passing CI does not equal expert religious-learning review.

### Batch 11 — Letters/Menulis to 100

- Wave A 1–25: uppercase/lowercase recognition, matching and pre-writing strokes.
- Wave B 26–50: guided letter formation, start direction and connect-dots.
- Wave C 51–75: malformed-letter discrimination, copy/complete letters and simple shape-to-letter preparation.
- Wave D 76–100: mixed formation, sequence, review and age-appropriate writing challenge.

Generalize trace templates rather than hardcoding a separate evaluator for every glyph.

### Batch 12 — Logic to 100

- Wave A 1–25: matching, draw-line, classification and odd-one-out.
- Wave B 26–50: patterns, sequence, shadow/object association and comparisons.
- Wave C 51–75: before/after, maze/path, memory and missing object.
- Wave D 76–100: cause/effect, spatial relations, mixed reasoning and review/challenge.

### Batch 13 — Science to 100

- Wave A 1–25: animals, habitats, plants and living/non-living.
- Wave B 26–50: body/five senses, weather, day/night and water.
- Wave C 51–75: environment, materials/object properties and observation.
- Wave D 76–100: earth/space basics, simple cause/effect, mixed science review and challenge.

Do not encourage unsafe unsupervised experiments.

### Batch 14 — Drawing/Menggambar and Coloring/Mewarnai to 100 each

Expand Drawing and Coloring as creative-practice tracks with **100 playable activities each**. Preserve all existing Coloring activity IDs. Introduce Drawing through the same canonical subject/path/stage/lesson/content-pack ownership model rather than a disconnected mini-app. Reuse guided trace, connect-dots, coloring, and other compatible mechanics; extend mechanic vocabulary additively only if a genuinely distinct drawing interaction requires it.

Drawing waves:

- Wave A 1–25: straight/curved lines, paths, simple shapes and connect-dots.
- Wave B 26–50: guided objects built from basic shapes, symmetry and simple pattern drawing.
- Wave C 51–75: copy/complete simple pictures, faces, animals, objects and scene parts.
- Wave D 76–100: guided scenes, creative prompts, mixed drawing practice and open-ended child-safe creation.

Coloring waves:

- Wave A 1–25: large simple shapes, objects and basic color exploration.
- Wave B 26–50: animals, food, vehicles, nature and everyday-object themes.
- Wave C 51–75: scenes, patterns, category-guided coloring and progressively finer regions.
- Wave D 76–100: themed scenes, creative palettes, mixed guided/free coloring and review collections.

Drawing/Coloring participation, completion, preferences and parent-visible progress may be recorded, but free drawing/coloring must not manufacture academic accuracy or mastery. Any objectively assessed tracing/drawing task must declare an explicit measurable evidence contract.

### Batch 15 — Adaptive/mastery/report scaling

Use skill weakness, confidence, evidence spacing, mechanic/content repetition, age, stage, difficulty, frustration/retry, and motion preferences. Prefer a different item/mechanic for the same weak skill rather than replaying the exact same level. Define evidence-diversity rules for selected core skills. Keep Parent UI summarized rather than dumping hundreds of raw activities. Drawing/Coloring should influence creative-practice recommendations and reporting without being misrepresented as academic mastery.

### Batch 16 — Performance, accessibility, security, device QA

Audit catalog payload, route/mechanic code splitting, assets, initial JS, TTS initialization and query volume. Re-run accessibility, RLS/ownership/RPC/outbox/dependency/secret/advisor checks and real-device mobile/camera/audio flows.

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

## Completion rule

This expansion is complete only when the target content counts are real, mobile QA is clean, voice handling is consolidated and measurably improved on target devices, all seven academic subjects participate correctly in progression/adaptive/reporting, Drawing and Coloring each reach 100 playable activities under their practice/evidence boundaries, no assessed activity fabricates evidence, final CI is green, final exact-SHA production smoke passes, and remaining limitations are documented explicitly.
