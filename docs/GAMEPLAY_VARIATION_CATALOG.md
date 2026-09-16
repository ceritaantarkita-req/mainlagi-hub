# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah; gunakan interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.

## Status implementasi

### Verified merged gameplay baseline: 36 pola

Patterns #1–#35 remain as previously closed/merged. Latest entries:

30. `syllable_assembly` — MERGED PR #139; CLOSED PR #140; FULLY CLOSED
31. `make_total` — MERGED PR #141; CLOSED PR #142; FULLY CLOSED
32. `take_away` — MERGED PR #143; CLOSED PR #144; FULLY CLOSED
33. `equal_groups` — MERGED PR #145; CLOSED PR #146; FULLY CLOSED
34. `initial_sound` — MERGED PR #147; CLOSED PR #148; FULLY CLOSED
35. `picture_word_match` — MERGED PR #149; CLOSED PR #150; FULLY CLOSED
36. `sentence_order_cards` — MERGED PR #151; CLOSED PR #152; **FULLY CLOSED**
37. `reading_passage_question` — **IMPLEMENTATION ACCEPTED / PR #153 OPEN**

Permanent gameplay-distribution audit: MERGED PR #105.

Current verified merged distribution on `main` remains:

```text
900 / 900 classified
0 unclassified
36 active child-facing patterns
choice_grid                 282 / 900 = 31.33%
sentence_order_cards          5 / 900 = 0.56%
picture_word_match            5 / 900 = 0.56%
Bahasa choice_grid            34 / 100
```

Accepted Pattern #37 implementation-head distribution:

```text
900 / 900 classified
0 unclassified
37 active candidate patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
Bahasa choice_grid                29 / 100
```

If Pattern #37 is merged unchanged, distance remaining becomes **13** patterns to minimum 50 and **23** to working target 60.

### `reading_passage_question` — Pattern #37 IMPLEMENTATION ACCEPTED

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

Interaction:
- parse the unchanged canonical quoted passage and following literal question fail-closed;
- render passage and question as separate reading surfaces;
- keep the three canonical answers as direct keyboard/touch/pointer buttons;
- wrong selection is retryable/measured and cannot complete;
- correct selection completes the existing canonical activity;
- no invented passage, changed answer payload, extra confirmation or intermediate assessment.

Accepted evidence:
- branch started from fully closed Pattern #36 final `main` `461b0fd59a6c238752aa858bf783716b225b548a`;
- accepted code head `6ac29623ce53940f45cdfea623340d833af68c4d` passed full CI #733 / run `35096952272`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- 900/900 classification passes with 37 candidate patterns, `choice_grid` 277/900 (30.78%), Bahasa `choice_grid` 29/100 and no global hotspot above 35%;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #37 still requires these implementation docs to receive fresh exact-head CI, clean scope/review/thread/mergeability gates, exact-head implementation merge and independent live `main` + Cloudflare verification. A separate docs-only closure must then also pass its own full chain before **FULLY CLOSED**.

### `sentence_order_cards` — Pattern #36 FULLY CLOSED

Implementation PR #151 and closure PR #152 are complete. Final verified `main` is `461b0fd59a6c238752aa858bf783716b225b548a`; final CI #732 / run `35094107947` passed the full matrix including exact Cloudflare production smoke.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Priority families still worth fresh objective/evidence audit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering beyond the reviewed sentence-choice family: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

No family is pre-approved for Pattern #38. A fresh audit starts only after Pattern #37 is fully closed.

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order terbaru

- Syllable Assembly — DONE / #139 + #140, fully closed.
- Make Total — DONE / #141 + #142, fully closed.
- Take Away — DONE / #143 + #144, fully closed.
- Equal Groups — DONE / #145 + #146, fully closed.
- Initial Sound — DONE / #147 + #148, fully closed.
- Picture Word Match — DONE / #149 + #150, fully closed.
- Sentence Order Cards — DONE / #151 + #152, fully closed; final `main` `461b0fd59a6c238752aa858bf783716b225b548a`, CI #732 full success.
- Reading Passage Question — **IMPLEMENTATION ACCEPTED / PR #153 OPEN**; accepted head `6ac29623ce53940f45cdfea623340d833af68c4d`; CI #733 full success; fresh docs-head implementation gate pending.
- NEXT only after Pattern #37 full closure — fresh objective/evidence audit for Pattern #38; no family pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
