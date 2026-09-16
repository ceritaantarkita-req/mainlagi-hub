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

### Verified merged gameplay baseline: 32 pola

1. `choice_grid`
2. `symbol_hunt`
3. `listen_choose`
4. `visible_matching`
5. `guided_trace`
6. `story_read`
7. `motion_game`
8. `coloring_canvas`
9. `drawing_canvas`
10. `memory_pair` — **MERGED PR #101**
11. `missing_sequence_slot` — **MERGED PR #102**
12. `sorting_buckets` — **MERGED PR #103**
13. `drag_to_target` — **MERGED PR #104**
14. `count_and_select` — **MERGED PR #106**
15. `number_line` — **MERGED PR #108**
16. `more_less_balance` — **MERGED PR #109**
17. `pattern_completion` — **MERGED PR #110**
18. `cause_effect` — **MERGED PR #112**
19. `compare_properties` — **MERGED PR #114**
20. `material_lab` — **MERGED PR #116**
21. `feature_function_link` — **MERGED PR #119**
22. `healthy_habit_routine` — **MERGED PR #121**
23. `rule_pipeline` — **MERGED PR #123**
24. `odd_one_out` — **MERGED PR #125**
25. `transitive_chain` — **MERGED PR #127; CLOSED PR #128; metadata PR #129**
26. `set_reasoning` — **MERGED PR #130; CLOSED PR #131; metadata PR #132**
27. `spatial_transform` — **MERGED PR #133; CLOSED PR #134**
28. `investigation_board` — **MERGED PR #135; CLOSED PR #136**
29. `relative_order_track` — **MERGED PR #137; CLOSED PR #138**
30. `syllable_assembly` — **MERGED PR #139; CLOSED PR #140; FULLY CLOSED**
31. `make_total` — **MERGED PR #141; CLOSED PR #142; FULLY CLOSED**
32. `take_away` — **MERGED PR #143; LIVE VERIFIED; CLOSURE PENDING**

Permanent gameplay-distribution audit: **MERGED PR #105**.

Current merged distribution:

```text
900 / 900 classified
0 unclassified
32 active child-facing patterns
choice_grid                 298 / 900 = 33.11%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             46 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Distance remaining: **18** patterns to minimum 50 and **28** to working target 60.

### `take_away` — Pattern #32 merged / closure pending

Exact scope:

```text
math-sub-3-1
math-sub-4-2
math-sub-5-1
math-sub-6-2
math-sub-7-3
```

Boundaries:
- stage `math-operasi-awal`;
- lesson `math-subtraction`;
- pack `math.pack.subtraction`;
- canonical skill `math.operation.subtraction.within_10`;
- assessed runtime remains `tap_choice`;
- canonical three numeric choices and `correctChoice` remain unchanged;
- assessment, stars, mastery, progression, activity identity and completion semantics remain canonical;
- addition remains handled by `make_total`;
- grouping, missing-number, length/size and existing Math specialized mechanics remain outside scope;
- all non-Math families remain outside scope;
- assessed fidelity `choice_take_away_interaction`;
- runtime metadata source `take-away-runtime`.

Interaction:
- show one reviewed starting group;
- visually mark exactly the reviewed removed subset instead of deleting context from the board;
- mask numeric remainder with `?` before a correct assessment;
- validate `startCount - removeCount` exactly equals canonical `correctChoice` and stays within 10;
- retain accessible keyboard/touch/pointer direct-selection buttons;
- wrong selection is retryable, measured, cannot complete, and cannot reveal the numeric remainder;
- correct selection completes the existing activity identity and may reveal the canonical remainder;
- no changed choice set, drag-only dependency, extra confirmation or intermediate assessment.

Acceptance and merge evidence:
- implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed CI #671 / run `35047494614`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- final implementation docs head `061b004188e827ff62bd1e5c48377a087f0f9144` passed full CI #676 / run `35048147580`;
- PR #143 passed clean exact-head merge gate and squash merged as `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`;
- `main` was independently verified at that SHA;
- post-merge CI #677 / run `35048981508` passed the full matrix including Cloudflare production smoke;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #32 becomes fully closed only after this docs-only closure passes exact-head CI, clean merge gate, exact-head merge, final `main` verification and final Cloudflare smoke.

### `make_total` — FULLY CLOSED

Make Total implementation PR #141 and closure PR #142 are complete. Final verified `main` SHA is `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`; final CI #670 passed including Cloudflare production smoke.

### `syllable_assembly` — FULLY CLOSED

Syllable Assembly implementation PR #139 and closure PR #140 remain complete.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns such as `take_away` may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Priority families still worth fresh objective/evidence audit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`, `word_picture_match`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

No family is pre-approved for Pattern #33.

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order terbaru

- Syllable Assembly — **DONE / #139 + #140**, fully closed.
- Make Total — **DONE / #141 + #142**, fully closed.
- Take Away implementation — **DONE / #143**, merged and live-verified.
- Take Away closure — **IN PROGRESS / docs-only closure branch**.
- NEXT only after Pattern #32 full closure — fresh objective/evidence audit for Pattern #33; no family pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
