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
39. `visual_word_problem` — implementation #170 **LIVE VERIFIED / DOCS CLOSURE IN PROGRESS**

Permanent gameplay-distribution audit: MERGED PR #105.

Current verified merged distribution on `main` from CI #809:

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

Remaining distance is **11** patterns to minimum 50 and **21** to working target 60.

### `visual_word_problem` — Pattern #39 LIVE VERIFIED

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

Interaction:
- canonical everyday story remains the primary prompt;
- deterministic quantity-change board shows start -> add/remove -> unknown result;
- final result remains hidden before success and after wrong answers;
- canonical answers remain direct keyboard/touch/pointer buttons;
- wrong selection is retryable/measured and cannot complete;
- correct selection completes through the existing canonical activity/evidence path;
- runtime source `visual-word-problem-runtime`;
- assessed fidelity `choice_visual_word_problem_interaction`.

Verified implementation chain:
- objective/evidence audit PR #169;
- implementation PR #170 exact head `df503b95abf86e2b530dd9ff18bd5d8b9707e2db`;
- implementation squash merge `bcb8479514f44d46ebc68917981699240aabc3b2`;
- independent merged-main CI #809 / run `35187506724` — full success including exact Cloudflare release smoke;
- responsive QA covers 320x720, 390x844 and 768x1024 idle/wrong/success states;
- merged-main distribution artifact `10482459288`, digest `sha256:4bacc984852eb4befd352a727935daf8e75cb0b30ec1a58af8451895649ae967`;
- merged distribution is 900/900 classified with 39 active patterns, `choice_grid` 267/900 and `visual_word_problem` 5/900.

Pattern #39 is not called **FULLY CLOSED** until its separate docs-only closure passes exact-head CI, clean merge and independent merged-main production verification.

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

## Pattern #40 objective/evidence audit gate

After Pattern #39 is fully closed, the next gameplay wave must begin with a fresh Pattern #40 audit that:

1. inspects remaining objectives/content where current interaction representation is weakest;
2. identifies the evidence that the learning objective actually requires;
3. determines whether an existing pattern already measures that evidence adequately;
4. rejects cosmetic re-skins and taxonomy-only variants;
5. rejects changes that weaken or ambiguously reinterpret mastery/progression evidence;
6. selects a small exact activity scope only after the mechanic is justified;
7. documents why the chosen interaction is materially better than the current representation;
8. preserves the valid outcome **“no justified Pattern #40 candidate yet.”**

No code/content migration for Pattern #40 should begin before this gate produces a justified exact scope.

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Patterns #1–#37 — fully closed.
- Cloze Sentence Choice — **FULLY CLOSED** / #166 + #168; final CI #803.
- Visual Word Problem — implementation DONE / #170, live verified main `bcb8479514f44d46ebc68917981699240aabc3b2`, CI #809; docs closure current gate.
- NEXT — finish Pattern #39 docs closure, then fresh Pattern #40 objective/evidence audit; no mechanic pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
