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

### Verified merged gameplay baseline: 35 pola

Patterns #1–#34 remain as previously closed/merged. Latest entries:

30. `syllable_assembly` — MERGED PR #139; CLOSED PR #140; FULLY CLOSED
31. `make_total` — MERGED PR #141; CLOSED PR #142; FULLY CLOSED
32. `take_away` — MERGED PR #143; CLOSED PR #144; FULLY CLOSED
33. `equal_groups` — MERGED PR #145; CLOSED PR #146; FULLY CLOSED
34. `initial_sound` — MERGED PR #147; CLOSED PR #148; FULLY CLOSED
35. `picture_word_match` — MERGED PR #149; CLOSED PR #150; **FULLY CLOSED**
36. `sentence_order_cards` — **PR #151 QA ACCEPTED / UNMERGED**

Permanent gameplay-distribution audit: MERGED PR #105.

Verified merged Pattern #35 baseline:

```text
900 / 900 classified
0 unclassified
35 active merged patterns
choice_grid                 287 / 900 = 31.89%
picture_word_match            5 / 900 = 0.56%
Bahasa choice_grid            39 / 100
```

Accepted Pattern #36 candidate from CI #728:

```text
900 / 900 classified
0 unclassified
36 active candidate patterns
choice_grid                 282 / 900 = 31.33%
sentence_order_cards          5 / 900 = 0.56%
picture_word_match            5 / 900 = 0.56%
Bahasa choice_grid            34 / 100
```

Candidate distance is **14** patterns to minimum 50 and **24** to working target 60.

### `sentence_order_cards` — Pattern #36 QA ACCEPTED / UNMERGED

Exact scope:

```text
bahasa-urut-ibu-memasak
bahasa-urut-adi-berlari
bahasa-urut-kucing-tidur
bahasa-urut-siti-membaca
bahasa-urut-burung-terbang
```

Boundaries:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-kalimat-urutan`;
- pack `bahasa.pack.kalimat-urutan`;
- canonical skill `bahasa.kalimat.order`;
- assessed runtime remains `tap_choice`;
- exactly three canonical sentence choices and unchanged `correctChoice`;
- non-scope Bahasa meaning/comprehension, listening, matching, previous literacy patterns, Letters ordering, Logic ordering, Math ordering and all other families remain unchanged;
- activity identity, content, assessment, stars, mastery, progression, schema and migrations remain canonical;
- assessed fidelity `choice_sentence_order_cards_interaction`;
- runtime metadata source `sentence-order-cards-runtime`.

Interaction:
- render each unchanged sentence answer as its canonical words in left-to-right cards;
- keep the three sentence choices as direct keyboard/touch/pointer buttons;
- wrong selection is retryable/measured and cannot complete;
- correct selection completes the existing canonical activity;
- no drag-only dependency, changed word order in the payload, invented token, extra confirmation or intermediate assessment.

Verified QA evidence:
- branch started from Pattern #35 fully closed `main` `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`;
- accepted code head `595bc4e94065eb5250aef27797858641ca959c67` passed full CI #728 / run `35089266590`;
- 900/900 classification passes with 36 active candidate patterns and no global hotspot above 35%;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0;
- dedicated representative `bahasa-urut-ibu-memasak` passed 320x720, 390x844 and 768x1024 browser QA with legitimate prior-stage readiness, keyboard wrong-state, pointer success, completion/evidence guards, touch targets, overflow and visible feedback/CTA;
- all nine idle/wrong/success screenshots passed manual visual acceptance.

Pattern #36 still requires final canonical docs-head CI, clean exact-head implementation merge, independent live `main` verification + Cloudflare smoke, separate docs-only closure, and final live verification before **FULLY CLOSED**.

### `picture_word_match` — Pattern #35 FULLY CLOSED

Implementation PR #149 and closure PR #150 are complete. Final verified `main` is `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`; final CI #727 / run `35086954102` passed the full matrix including exact Cloudflare production smoke.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Priority families still worth fresh objective/evidence audit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering beyond the reviewed sentence-choice family: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

No family is pre-approved for Pattern #37. A fresh audit starts only after Pattern #36 is fully closed.

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order terbaru

- Syllable Assembly — DONE / #139 + #140, fully closed.
- Make Total — DONE / #141 + #142, fully closed.
- Take Away — DONE / #143 + #144, fully closed.
- Equal Groups — DONE / #145 + #146, fully closed.
- Initial Sound — DONE / #147 + #148, fully closed.
- Picture Word Match — DONE / #149 + #150, fully closed; final main `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`, final CI #727.
- Sentence Order Cards — **PR #151 QA ACCEPTED / UNMERGED**; accepted code head `595bc4e94065eb5250aef27797858641ca959c67`, CI #728 full success.
- NEXT only after Pattern #36 full closure — fresh objective/evidence audit for Pattern #37; no family pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
