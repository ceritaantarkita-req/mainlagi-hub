# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah; gunakan interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos exact-scope regression, completion/evidence, keyboard, touch/pointer, responsive QA, manual visual review, dan merged-main verification.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.
- WS-08 visual QA tetap blocking pada setiap wave WS-05.

## Status implementasi

Patterns #1–#35 remain as previously closed/merged. Latest entries:

30. `syllable_assembly` — FULLY CLOSED
31. `make_total` — FULLY CLOSED
32. `take_away` — FULLY CLOSED
33. `equal_groups` — FULLY CLOSED
34. `initial_sound` — FULLY CLOSED
35. `picture_word_match` — FULLY CLOSED
36. `sentence_order_cards` — FULLY CLOSED
37. `reading_passage_question` — FULLY CLOSED
38. `cloze_sentence_choice` — FULLY CLOSED via implementation #166 + closure #168
39. `visual_word_problem` — FULLY CLOSED via audit #169 + implementation #170 + closure #171
40. `spatial_relation_board` — FULLY CLOSED via audit #173 + implementation #175 + closure #176
41. `phrase_scene_match` — **IMPLEMENTATION MERGED + LIVE VERIFIED / CLOSURE DOCS IN PROGRESS** via audit #179 + implementation #180

Permanent gameplay-distribution audit foundation: MERGED PR #105.

Verified merged distribution on `main` after Pattern #41 implementation:

```text
900 / 900 classified
0 unclassified
41 active child-facing patterns
choice_grid                     257 / 900
phrase_scene_match                4 / 900
spatial_relation_board            6 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Remaining distance is **9 patterns** to minimum 50 and **19** to working target 60.

## Pattern #41 — `phrase_scene_match`

Exact scope:

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical boundaries:

```text
subject:     english
stage:       english-phrases-review
lesson:      english-simple-phrases
pack:        english.pack.simple-phrases
skill:       english.phrase.literal
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Verified merged implementation:

- exact-ID fail-closed config for exactly four activities;
- deterministic visual scene for all twelve canonical choices;
- semantic coverage for color, quantity, size and noun composition;
- canonical prompt, visible choice labels/order, submitted answer strings and `correctChoice` unchanged;
- direct keyboard/touch/pointer controls;
- wrong answer remains measured/retryable and cannot complete;
- correct answer completes with existing `choice_accuracy_v1` semantics;
- metadata uses `phrase-scene-match-runtime` / `choice_phrase_scene_interaction`;
- listening, sentence completion, unrelated vocabulary and opposites remain outside Pattern #41;
- no arbitrary phrase parser or mastery/progression/schema/database rewrite;
- responsive browser QA passes at 320x720, 390x844 and 768x1024;
- permanent visual QA remains P0=0/P1=0.

Verification chain:

```text
Audit PR:                #179
Audit main:              917e933b2d69db3d014b98f3aa49bb6962aec992
Audit main CI:           #860 / run 35223876877 — full success + Cloudflare smoke
Implementation PR:       #180
Verified PR head:        03886f191d089a37bbaf7c9d429d6d9a8020ec6d
Implementation PR CI:    #861 / run 35228880841 — full success
Implementation main:     f90a0d377fa7227b8857f6069a5e957c99eb0b11
Implementation main CI:  #862 / run 35229750381 — full success + Cloudflare smoke
```

The implementation is production-verified, but Pattern #41 remains pending the separate closure-docs merge and merged-main verification required by the project Definition of Done.

## Production visual checkpoint

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
```

P2 findings remain visible but do not re-block accepted gameplay implementations.

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#40 — **FULLY CLOSED**.
- Pattern #41 `phrase_scene_match` — **IMPLEMENTATION MERGED + LIVE VERIFIED / CLOSURE DOCS IN PROGRESS**.
- NEXT — exact-head closure docs -> closure merge -> merged-main closure verification -> fresh Pattern #42 objective/evidence audit.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
