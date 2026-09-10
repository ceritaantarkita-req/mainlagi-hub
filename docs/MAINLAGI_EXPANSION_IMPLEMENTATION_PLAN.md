# Mainlagi Expansion Implementation Plan

Last reviewed: 10 September 2026

This is the canonical repository copy of the major Mainlagi expansion plan agreed after the platform/foundation closure.

## Product goals

1. Fix the inconsistent mobile experience before scaling content.
2. Reduce Mainlagi-controlled voice/TTS latency and consolidate speech handling.
3. Replace the small hand-authored catalog model with a scalable content architecture.
4. Build a reusable mechanic library rather than hundreds of duplicated components.
5. Reach at least 90 playable activities each for Math, Bahasa Indonesia, English, and Iqro.
6. Add Letters/Menulis, Logic, and Science as first-class subjects, targeting 90 playable activities each for product parity.
7. Preserve evidence integrity, mastery anti-farming, stage readiness, adaptive learning, parent reporting, offline sync, ownership, and child-safety boundaries as the catalog grows.

The four mandatory 90-game subjects represent at least **360** playable activities. If the three new subjects also reach parity, the seven major subjects represent approximately **630** playable activities, excluding Coloring and optional motion games.

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

The automated gate does not replace physical iOS/Android camera, virtual-keyboard, orientation, audio, or finger-trace acceptance. Those remain part of Batch 15 device QA. See `MOBILE_ROUTE_QA.md`.

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

The repository baseline at Batch 4 contains 5 subjects, 5 paths, 7 stages, 13 lessons, 13 content packs, 25 playable activities, 12 skills, and 7 registered mechanics. The 25 existing activities remain 19 assessed and 6 practice. Migration `0011` is applied to the canonical Supabase project; all 25 current repository activities have pack/lesson/mechanic/evidence metadata there.

### Batch 5 — Reusable game-mechanics library

Target roughly 12–20 reusable mechanics including tap choice, listen-and-choose, matching, drag-to-target, draw-line matching, sort/classify, ordering, sequence, pattern completion, odd-one-out, guided trace, connect-dots, memory pairs, compare, missing item, simple maze/path selection, story comprehension, and observation/find-object. Every assessed mechanic defines score/accuracy/correct/incorrect/hint/retry/completion/mastery behavior.

### Batch 6 — New subject/curriculum foundations

Add first-class Letters/Menulis, Logic, and Science subject IDs plus paths/stages/lessons/skills/age bands/stage requirements and starter content. Integrate them into child navigation, adaptive ranking, progression, Parent Dashboard, and reports.

### Batch 7 — Math to 90

- Wave A 1–30: number recognition, counting, quantity matching/comparison, ordering.
- Wave B 31–60: shapes, patterns, missing numbers, grouping, simple addition/subtraction, size/length.
- Wave C 61–90: spatial position, measurement intuition, mixed operations, visual problems and review/challenge.

### Batch 8 — Bahasa Indonesia to 90

- Wave A 1–30: letters, vowels/consonants, initial sounds, case matching.
- Wave B 31–60: syllables, words, picture-word matching, complete/order words, listening.
- Wave C 61–90: simple sentences, story comprehension, vocabulary grouping, relations/opposites and mixed review.

### Batch 9 — English to 90

- Wave A 1–30: alphabet, basic phonics awareness, colors, numbers, animals, objects.
- Wave B 31–60: body, family, food, actions, categories, word-picture matching/listening.
- Wave C 61–90: opposites, simple phrases/sentences, listening comprehension, review/challenge.

### Batch 10 — Iqro to 90

- Wave A 1–30: Hijaiyah recognition, visual discrimination, same-letter matching, sequence.
- Wave B 31–60: dots/form discrimination, reviewed listen-and-find, guided trace, similar-letter comparison.
- Wave C 61–90: broader recognition/sequence/matching/trace/review.

Use explicit content/audio review states; code passing CI does not equal expert religious-learning review.

### Batch 11 — Letters/Menulis expansion

Target 90 playable activities covering uppercase/lowercase recognition and matching, guided formation, direction, connect dots, malformed-letter discrimination, copy/complete shape and sequence. Generalize trace templates rather than hardcoding a separate evaluator for every glyph.

### Batch 12 — Logic expansion

Target 90 playable activities across matching, draw-line, classification, odd-one-out, pattern, sequence, shadow/object association, comparisons, before/after, maze, memory, missing object, cause/effect, and spatial relations.

### Batch 13 — Science expansion

Target 90 age-appropriate activities across animals, habitats, plants, body/five senses, weather, day/night, water, environment, living/non-living, materials/object properties, earth/space basics, observation and simple cause/effect. Do not encourage unsafe unsupervised experiments.

### Batch 14 — Adaptive/mastery/report scaling

Use skill weakness, confidence, evidence spacing, mechanic/content repetition, age, stage, difficulty, frustration/retry, and motion preferences. Prefer a different item/mechanic for the same weak skill rather than replaying the exact same level. Define evidence-diversity rules for selected core skills. Keep Parent UI summarized rather than dumping hundreds of raw activities.

### Batch 15 — Performance, accessibility, security, device QA

Audit catalog payload, route/mechanic code splitting, assets, initial JS, TTS initialization and query volume. Re-run accessibility, RLS/ownership/RPC/outbox/dependency/secret/advisor checks and real-device mobile/camera/audio flows.

### Batch 16 — Final acceptance and production closure

CI must verify target counts, unique IDs, valid content references, evidence contracts, adaptive/mastery/outbox regressions, mobile overflow gates, typecheck/lint/Ubuntu/Windows/simulations/build/audit/secret scan. Then run guest/authenticated/offline/multi-child acceptance, exact-SHA Cloudflare production smoke, and synchronize canonical docs.

## Content-wave rule

Each 90-activity subject is split into three reviewable waves:

```text
Wave A: 1–30
Wave B: 31–60
Wave C: 61–90
```

Do not merge a giant unreviewed 90-activity PR.

## Completion rule

This expansion is complete only when the target content counts are real, mobile QA is clean, voice handling is consolidated and measurably improved on target devices, all seven subjects participate correctly in progression/adaptive/reporting, no assessed activity fabricates evidence, final CI is green, final exact-SHA production smoke passes, and remaining limitations are documented explicitly.
