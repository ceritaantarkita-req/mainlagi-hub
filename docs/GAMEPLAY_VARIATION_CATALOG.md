# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah; gunakan interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.
- Production visual P1 checkpoint sudah closed/live verified; WS-08 visual QA tetap berjalan paralel dan blocking pada wave WS-05 berikutnya.

## Status implementasi

Patterns #1–#35 remain as previously closed/merged. Latest entries:

30. `syllable_assembly` — FULLY CLOSED
31. `make_total` — FULLY CLOSED
32. `take_away` — FULLY CLOSED
33. `equal_groups` — FULLY CLOSED
34. `initial_sound` — FULLY CLOSED
35. `picture_word_match` — FULLY CLOSED
36. `sentence_order_cards` — **FULLY CLOSED**
37. `reading_passage_question` — **FULLY CLOSED**
38. `cloze_sentence_choice` — **FULLY CLOSED** via implementation #166 + closure #168
39. `visual_word_problem` — **FULLY CLOSED** via audit #169 + implementation #170 + closure #171
40. `spatial_relation_board` — **IMPLEMENTATION IN PROGRESS** in draft PR #175; audit #173 merged, exact six-activity runtime foundation green at CI #821; not counted in merged distribution yet

Permanent gameplay-distribution audit: MERGED PR #105.

Current verified merged distribution on `main` remains:

```text
900 / 900 classified
0 unclassified
39 active child-facing patterns
choice_grid                     267 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Remaining distance is **11** patterns to minimum 50 and **21** to working target 60 until Pattern #40 is actually implemented, merged and independently verified.

### `visual_word_problem` — Pattern #39 FULLY CLOSED

Exact scope:

```text
math-problem-apples
math-problem-birds
math-problem-cars
math-problem-cookies
math-problem-balloons
```

Boundaries:
- subject `math`;
- stage `math-ukur-ruang`;
- lesson `math-visual-problems`;
- pack `math.pack.visual-problems`;
- canonical skill `math.problem.visual`;
- assessed runtime remains `tap_choice`;
- assessment remains `choice_accuracy_v1`;
- prompts, three canonical numeric choices/order and `correctChoice` remain unchanged;
- mastery/progression/schema/database remain unchanged.

Verified chain:
- objective/evidence audit PR #169;
- implementation PR #170 exact head `df503b95abf86e2b530dd9ff18bd5d8b9707e2db`;
- implementation squash merge `bcb8479514f44d46ebc68917981699240aabc3b2`;
- independent merged-main CI #809 / run `35187506724` — full success including exact Cloudflare release smoke;
- closure PR #171;
- final closure main `98725727c866d410b2d0caa206e86e70cd0e5741`;
- final closure CI #811 / run `35190499794` — success;
- merged distribution remains 900/900 classified with 39 active patterns.

### `spatial_relation_board` — Pattern #40 IMPLEMENTATION IN PROGRESS

Audit PR #173 is merged to main `f1b4b13d3d9814d2ed06500022218848cd721419`. Draft implementation PR #175 currently targets exactly:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical boundaries:

```text
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Objective fit:

- left/right activities require recognizing object placement relative to another object;
- between activity requires recognizing an object centered between two references;
- turn activities require transforming an initial facing direction by a left/right turn;
- opposite-direction activity requires identifying the inverse direction;
- current generic `choice_grid` records a valid final answer but under-represents the explicitly spatial learning objective.

Implemented foundation in PR #175:

- deterministic `spatialRelationBoardConfig` exact-scoped to the six audited IDs;
- dedicated child-facing relation board for object position and directional transformations;
- canonical prompt remains primary and unchanged;
- canonical choices/order and `correctChoice` stay unchanged;
- direct keyboard/touch/pointer choice controls remain the assessed input;
- wrong answer remains retryable/measured and cannot complete;
- correct answer completes through the existing canonical evidence path;
- no drag-only dependency or additional assessed checkpoint;
- mastery/progression/schema/database remain unchanged;
- runtime metadata uses `spatial-relation-board-runtime` and `choice_spatial_relation_board_interaction`;
- implementation foundation head `1889e1b5ea954be3cab6978e1f82a680b8281ca8` passed full CI #821 / run `35213178491`.

Remaining before Pattern #40 can be counted:

1. register `spatial_relation_board` in the canonical gameplay pattern taxonomy/distribution;
2. exact-scope regression proving six-and-only-six classification plus fail-closed negatives;
3. evidence/completion/retry regressions;
4. keyboard/touch/responsive browser QA across idle/wrong/success states;
5. permanent visual QA remains green;
6. branch audit proves 900/900 classified and exactly 40 active child-facing patterns;
7. fresh exact-head full CI and clean PR gates;
8. independent merged-main verification after squash merge;
9. separate post-merge docs closure before **FULLY CLOSED** status.

Full in-progress record: `WS05_SPATIAL_RELATION_BOARD_WAVE_2026-09-17.md`.

### `cloze_sentence_choice` — Pattern #38 FULLY CLOSED

Exact scope:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

Canonical chain:
- audit PR #165;
- implementation PR #166;
- implementation main `76a2d87dca3689ed8206f5ce0556760dabe903b6`, CI #801;
- closure PR #168;
- final closure main `86e6b69d576d72fec73158a7a1c6d8961de36887`, CI #803 including exact Cloudflare smoke.

### `reading_passage_question` — Pattern #37 FULLY CLOSED

Implementation PR #153 and closure PR #154 are complete. Final verified `main` is `b1793adaabe19a9c73e021534899f8b50c4097f6`; CI #741 passed including exact Cloudflare production smoke.

### `sentence_order_cards` — Pattern #36 FULLY CLOSED

Implementation PR #151 and closure PR #152 are complete. Final verified `main` is `461b0fd59a6c238752aa858bf783716b225b548a`; CI #732 passed the full matrix including exact Cloudflare production smoke.

## Production visual checkpoint

The product-quality gate remains complete:

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
```

P2 findings remain visible but do not re-block accepted gameplay implementations.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Candidate families are never approvals. Search/scene exploration, ordering, literacy construction, puzzle/path, audio and creative/story mechanics may only be selected when a fresh objective/evidence audit proves objective fit.

## Pattern #40 implementation gate

The objective/evidence audit gate is complete via PR #173. PR #175 now carries the only canonical implementation candidate for `spatial_relation_board` and must remain exact-scoped.

Before implementation merge, prove:

1. exact six-activity classification and fail-closed negatives;
2. unchanged canonical IDs, prompts, choices/order and `correctChoice`;
3. existing Logic stage/lesson/pack/skill ownership;
4. assessed `tap_choice` and `choice_accuracy_v1` semantics;
5. unchanged mastery/progression/schema/database;
6. deterministic spatial config rather than heuristic arbitrary-prompt parsing;
7. keyboard/touch/pointer answer controls;
8. wrong attempts remain measured/retryable and cannot complete;
9. responsive idle/wrong/success acceptance;
10. permanent visual QA stays green;
11. distribution remains 900/900 classified and becomes exactly 40 active patterns;
12. exact-head full CI passes before merge and merged-main verification passes after merge.

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#39 — fully closed.
- Spatial Relation Board — Pattern #40 **IMPLEMENTATION IN PROGRESS** in PR #175; audit #173 merged; foundation CI #821 green; merged distribution still 39.
- NEXT — finish distribution registration + regression/browser/visual gates, exact-head CI, merge verification, then separate closure docs gate.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
