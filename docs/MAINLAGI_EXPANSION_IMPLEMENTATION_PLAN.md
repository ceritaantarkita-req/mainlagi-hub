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

- [ ] Freeze exact subject/path/stage/lesson/activity/skill/mechanic counts.
- [ ] Add machine-tested content floors and target-gap reporting.
- [ ] Add mobile route/viewport acceptance matrix.
- [ ] Add local-only speech-start latency instrumentation.
- [ ] Record known mobile/voice baseline problems without claiming they are already fixed.

### Batch 1 — Mobile design-system rebuild

- shared spacing/type/gutter/safe-area/touch/grid tokens;
- canonical child/parent headers and bottom navigation;
- responsive card/grid/sheet primitives;
- remove fragile page-level fixed sizing where possible;
- enforce approximately 44x44 CSS px minimum child touch targets.

### Batch 2 — Mobile route migration and responsive QA

Migrate and verify child selection/home/library/subject/stage/activity/rewards, Parent views, Mainlagi World, and game/camera wrappers at the release-critical viewport matrix. No unexplained document-level horizontal overflow is acceptable.

### Batch 3 — Voice latency / AudioManager rebuild

Centralize speech into one manager with user-gesture unlock/warmup, cached locale voice selection, queue/deduplication policy, stale-speech cancellation, standardized rates, instant tone feedback, capability fallback, and latency measurement. Native Web Speech remains a fallback boundary; microphone pronunciation scoring is out of scope.

### Batch 4 — Scalable content architecture

Move toward:

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

Add schema validation, deterministic IDs, duplicate detection, age/difficulty validation, answer validation, asset checks, skill resolution, and assessment/mechanic compatibility checks. Preserve existing stable activity IDs/history.

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

This expansion is complete only when the target content counts are real, mobile QA is clean, voice handling is consolidated and measurably improved, all seven subjects participate correctly in progression/adaptive/reporting, no assessed activity fabricates evidence, final CI is green, final exact-SHA production smoke passes, and remaining limitations are documented explicitly.
