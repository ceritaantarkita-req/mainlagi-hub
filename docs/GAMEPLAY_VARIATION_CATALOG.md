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

1. `choice_grid`
2. `symbol_hunt`
3. `listen_choose`
4. `visible_matching`
5. `guided_trace`
6. `story_read`
7. `motion_game`
8. `coloring_canvas`
9. `drawing_canvas`
10. `memory_pair` — MERGED PR #101
11. `missing_sequence_slot` — MERGED PR #102
12. `sorting_buckets` — MERGED PR #103
13. `drag_to_target` — MERGED PR #104
14. `count_and_select` — MERGED PR #106
15. `number_line` — MERGED PR #108
16. `more_less_balance` — MERGED PR #109
17. `pattern_completion` — MERGED PR #110
18. `cause_effect` — MERGED PR #112
19. `compare_properties` — MERGED PR #114
20. `material_lab` — MERGED PR #116
21. `feature_function_link` — MERGED PR #119
22. `healthy_habit_routine` — MERGED PR #121
23. `rule_pipeline` — MERGED PR #123
24. `odd_one_out` — MERGED PR #125
25. `transitive_chain` — MERGED PR #127; CLOSED PR #128; metadata PR #129
26. `set_reasoning` — MERGED PR #130; CLOSED PR #131; metadata PR #132
27. `spatial_transform` — MERGED PR #133; CLOSED PR #134
28. `investigation_board` — MERGED PR #135; CLOSED PR #136
29. `relative_order_track` — MERGED PR #137; CLOSED PR #138
30. `syllable_assembly` — MERGED PR #139; CLOSED PR #140; FULLY CLOSED
31. `make_total` — MERGED PR #141; CLOSED PR #142; FULLY CLOSED
32. `take_away` — MERGED PR #143; CLOSED PR #144; FULLY CLOSED
33. `equal_groups` — MERGED PR #145; CLOSED PR #146; FULLY CLOSED
34. `initial_sound` — MERGED PR #147; CLOSED PR #148; **FULLY CLOSED**
35. `picture_word_match` — MERGED PR #149; **LIVE VERIFIED / CLOSURE IN PROGRESS**

Permanent gameplay-distribution audit: MERGED PR #105.

Current verified merged distribution after PR #149:

```text
900 / 900 classified
0 unclassified
35 active child-facing patterns
choice_grid                 287 / 900 = 31.89%
picture_word_match            5 / 900 = 0.56%
initial_sound                  3 / 900 = 0.33%
equal_groups                   3 / 900 = 0.33%
make_total                     5 / 900 = 0.56%
take_away                      5 / 900 = 0.56%
Bahasa choice_grid            39 / 100
Math choice_grid              43 / 100
Science choice_grid           56 / 100
Logic choice_grid             47 / 100
English choice_grid           44 / 100
Iqro choice_grid              58 / 100
```

Distance remaining is **15** patterns to minimum 50 and **25** to working target 60.

### `picture_word_match` — Pattern #35 MERGED / LIVE VERIFIED

Exact scope:

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

Boundaries:
- subject `bahasa`;
- stage `bahasa-suku-kata-kata`;
- lesson `bahasa-kata-gambar`;
- pack `bahasa.pack.kata-gambar`;
- canonical skill `bahasa.kata.picture_matching`;
- assessed runtime remains `tap_choice`;
- exactly three canonical lowercase word choices and unchanged `correctChoice`;
- `bahasa-pasang-kata-*` remains `visible_matching`;
- Syllable Assembly, audio word recognition, Initial Sound, English, Math and every non-scope family remain unchanged;
- assessment, stars, mastery, progression, activity identity, content, schema and migrations remain canonical;
- assessed fidelity `choice_picture_word_match_interaction`;
- runtime metadata source `picture-word-match-runtime`.

Interaction:
- show the existing familiar object as a large visual clue;
- mask the word result with `?` before correct assessment;
- retain accessible keyboard/touch/pointer direct-selection buttons;
- wrong selection is retryable and measured, cannot complete, and cannot reveal the canonical word;
- correct selection completes the existing activity identity and reveals the canonical word;
- no changed choice set, drag-only dependency, extra confirmation or intermediate assessment.

Verified evidence:
- implementation branch started from Pattern #34 final `main` `8bfb0027a5f4963a6875310c7408cb56018cc422`;
- accepted code head `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca` passed full CI #718 / run `35082720001`;
- final implementation docs head `79767b320372ac6dd78bfae90ffb2e2307154401` passed full CI #723 / run `35083623316`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- PR #149 passed clean exact-head scope/review/thread/mergeability gate and squash merged as `47e3373ed9ba4a96331a8e61286dc80d37b6b518`;
- post-merge CI #724 / run `35085618422` passed the full matrix including **Production smoke (Cloudflare)**;
- 900/900 classification passes with 35 active merged patterns and no global hotspot above 35%;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #35 still requires this separate docs-only closure to pass fresh exact-head CI, clean merge gate, exact-head closure merge, and final independent `main` + Cloudflare verification before **FULLY CLOSED**.

### `initial_sound` — Pattern #34 FULLY CLOSED

Implementation PR #147 and closure PR #148 are complete. Final verified `main` is `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717 / run `35074306579` passed the full matrix including Cloudflare production smoke.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Priority families still worth fresh objective/evidence audit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

No family is pre-approved for Pattern #36. A fresh audit starts only after Pattern #35 is fully closed.

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order terbaru

- Syllable Assembly — DONE / #139 + #140, fully closed.
- Make Total — DONE / #141 + #142, fully closed.
- Take Away — DONE / #143 + #144, fully closed.
- Equal Groups — DONE / #145 + #146, fully closed.
- Initial Sound — DONE / #147 + #148, fully closed; final main `8bfb0027a5f4963a6875310c7408cb56018cc422`, final CI #717.
- Picture Word Match implementation — **MERGED / LIVE VERIFIED via PR #149**; implementation merge `47e3373ed9ba4a96331a8e61286dc80d37b6b518`; post-merge CI #724 full success; docs-only closure in progress.
- NEXT only after Pattern #35 full closure — fresh objective/evidence audit for Pattern #36; no family pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
