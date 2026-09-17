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

30. `syllable_assembly` — MERGED PR #139; CLOSED PR #140; FULLY CLOSED
31. `make_total` — MERGED PR #141; CLOSED PR #142; FULLY CLOSED
32. `take_away` — MERGED PR #143; CLOSED PR #144; FULLY CLOSED
33. `equal_groups` — MERGED PR #145; CLOSED PR #146; FULLY CLOSED
34. `initial_sound` — MERGED PR #147; CLOSED PR #148; FULLY CLOSED
35. `picture_word_match` — MERGED PR #149; CLOSED PR #150; FULLY CLOSED
36. `sentence_order_cards` — MERGED PR #151; CLOSED PR #152; **FULLY CLOSED**
37. `reading_passage_question` — MERGED PR #153; CLOSED PR #154; **FULLY CLOSED**
38. `cloze_sentence_choice` — MERGED PR #166; **LIVE VERIFIED / DOCS CLOSURE IN PROGRESS**

Permanent gameplay-distribution audit: MERGED PR #105.

Current verified merged distribution on `main` from CI #801:

```text
900 / 900 classified
0 unclassified
38 active child-facing patterns
choice_grid                    272 / 900 = 30.22%
cloze_sentence_choice            5 / 900 = 0.56%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards             5 / 900 = 0.56%
picture_word_match               5 / 900 = 0.56%
```

Remaining distance is **12** patterns to minimum 50 and **22** to working target 60.

### `cloze_sentence_choice` — Pattern #38 LIVE VERIFIED

Exact scope:

```text
bahasa-lengkap-ayah-minum
bahasa-lengkap-burung-terbang
bahasa-lengkap-kucing-tidur
bahasa-lengkap-ibu-pasar
bahasa-lengkap-rina-payung
```

Boundaries:
- subject `bahasa`;
- canonical objective/evidence family: sentence context completion;
- canonical skill `bahasa.kalimat.context_completion`;
- assessed runtime remains `tap_choice`;
- assessment remains `assessed` + `choice_accuracy_v1`;
- prompts, three canonical choices/order and `correctChoice` remain unchanged;
- required-for-stage/progression semantics remain unchanged;
- schema, migrations, mastery and unrelated activity families remain unchanged.

Interaction:
- parse exactly one literal `___` fail-closed;
- render the canonical sentence with one visible answer slot;
- keep canonical choices as direct keyboard/touch/pointer controls;
- wrong selection is retryable/measured and cannot complete;
- correct selection completes through the existing canonical activity/evidence path;
- no drag-only dependency or added assessment layer.

Verified implementation chain:
- objective/evidence audit PR #165;
- implementation PR #166 exact head `7bfb58d93c5c61200dc6a91c5fd5243c1369c3bd`;
- exact-head PR CI #795 / run `35176307842` — full success;
- implementation squash merge `76a2d87dca3689ed8206f5ce0556760dabe903b6`;
- independent merged-main CI #801 / run `35179596668` — full success including exact Cloudflare release smoke;
- responsive QA covers 320x720, 390x844 and 768x1024 idle/wrong/success states;
- PR screenshot artifact `10478269865`, digest `sha256:92c561e8afd029cc618a966e1686a5e601cbc72580c387c608f73bafc814246b`;
- merged-main distribution artifact `10479619607`, digest `sha256:2bc2b1734091a6de2c71c6545d3e07a27cab02c685c537cf002ac9a8a3092381`;
- merged distribution is 900/900 classified with 38 active patterns, `choice_grid` 272/900 (30.22%), `cloze_sentence_choice` 5/900 (0.56%) and no global hotspot above 35%.

Duplicate draft PR #167 represented an overlapping implementation and failed its gameplay-presentation regression. It was closed as superseded after canonical PR #166 passed and merged.

Pattern #38 is not called **FULLY CLOSED** until its separate docs-only closure passes exact-head CI, clean merge and independent merged-main production verification.

### `reading_passage_question` — Pattern #37 FULLY CLOSED

Exact scope:

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Boundaries:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-bacaan-pendek`;
- pack `bahasa.pack.bacaan-pendek`;
- canonical skill `bahasa.bacaan.short_comprehension`;
- assessed runtime remains `tap_choice`;
- exactly three canonical answers, answer order and unchanged `correctChoice`;
- non-scope Bahasa meaning, listening, sentence-order, picture-word, matching and all other families remain unchanged;
- activity identity, content, assessment, stars, mastery, progression, schema and migrations remain canonical;
- assessed fidelity `choice_reading_passage_question_interaction`;
- runtime metadata source `reading-passage-question-runtime`.

Verified implementation and closure chain:
- implementation PR #153 squash merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`;
- independent implementation-main CI #739 / run `35098428328` — full success including exact Cloudflare production smoke;
- closure PR #154 completed;
- final verified `main` `b1793adaabe19a9c73e021534899f8b50c4097f6`;
- final closure CI #741 / run `35103399012` — full success including exact Cloudflare production smoke.

### `sentence_order_cards` — Pattern #36 FULLY CLOSED

Implementation PR #151 and closure PR #152 are complete. Final verified `main` is `461b0fd59a6c238752aa858bf783716b225b548a`; final CI #732 / run `35094107947` passed the full matrix including exact Cloudflare production smoke.

## Production visual checkpoint

The product-quality gate that intentionally paused WS-05 after Pattern #37 remains complete:

```text
P0 = 0
P1 = 0
P2 = 3
permanent visual QA = 21 canonical routes / 63 captures / blocking
visual closure main SHA = 2d3f95066e1106c43c76bf91dd29bf5707dca52c
visual closure main CI = #788 / run 35168877485 — full success
exact Cloudflare release/public smoke = success
```

P2 findings remain visible but do not re-block the completed P1 checkpoint or the verified Pattern #38 implementation.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Families worth considering only when a fresh objective/evidence audit finds a real fit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

These are **audit candidates, not approvals**.

## Pattern #39 objective/evidence audit gate

After Pattern #38 is fully closed, the next gameplay wave must begin with a fresh Pattern #39 audit that:

1. inspects remaining objectives/content where current interaction representation is weakest;
2. identifies the evidence that the learning objective actually requires;
3. determines whether an existing pattern already measures that evidence adequately;
4. rejects cosmetic re-skins and taxonomy-only variants;
5. rejects changes that would weaken or ambiguously reinterpret mastery/progression evidence;
6. selects a small exact activity scope only after the mechanic is justified;
7. documents why the chosen interaction is materially better than the current representation;
8. preserves the valid outcome **“no justified Pattern #39 candidate yet.”**

No code/content migration for Pattern #39 should begin before this gate produces a justified exact scope.

## Distribution rule

Coverage and implemented-pattern consistency are blocking; concentration is advisory. Use a mechanic because it fits the objective, not as cosmetic taxonomy inflation.

## Rollout order terbaru

- Syllable Assembly — DONE / #139 + #140, fully closed.
- Make Total — DONE / #141 + #142, fully closed.
- Take Away — DONE / #143 + #144, fully closed.
- Equal Groups — DONE / #145 + #146, fully closed.
- Initial Sound — DONE / #147 + #148, fully closed.
- Picture Word Match — DONE / #149 + #150, fully closed.
- Sentence Order Cards — DONE / #151 + #152, fully closed.
- Reading Passage Question — DONE / #153 + #154, fully closed; final main `b1793adaabe19a9c73e021534899f8b50c4097f6`, CI #741.
- Production visual P1 checkpoint — DONE / PR #162, main `2d3f95066e1106c43c76bf91dd29bf5707dca52c`, CI #788 exact Cloudflare smoke.
- Cloze Sentence Choice — implementation DONE / PR #166, live verified main `76a2d87dca3689ed8206f5ce0556760dabe903b6`, CI #801; docs closure current gate.
- NEXT — finish Pattern #38 docs closure, then fresh Pattern #39 objective/evidence audit; no mechanic pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.