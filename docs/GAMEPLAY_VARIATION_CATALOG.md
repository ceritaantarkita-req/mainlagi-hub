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

### Merged production baseline: 33 pola

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
33. `equal_groups` — MERGED PR #145; CLOSED PR #146; **FULLY CLOSED**

Candidate Pattern #34 on implementation PR #147:

34. `initial_sound` — **QA ACCEPTED / UNMERGED**

Permanent gameplay-distribution audit: MERGED PR #105.

Merged production distribution remains:

```text
900 / 900 classified
0 unclassified
33 active child-facing patterns
choice_grid                 295 / 900 = 32.78%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             43 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Accepted PR #147 candidate distribution:

```text
900 / 900 classified
0 unclassified
34 active candidate patterns
choice_grid                 292 / 900 = 32.44%
initial_sound                 3 / 900 = 0.33%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Bahasa choice_grid           44 / 100
Math choice_grid             43 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Candidate distance after merge: **16** patterns to minimum 50 and **26** to working target 60.

### `initial_sound` — Pattern #34 QA accepted / unmerged

Exact scope:

```text
bahasa-awal-bola
bahasa-awal-kucing
bahasa-awal-pisang
```

Boundaries:
- subject `bahasa`;
- stage `bahasa-dasar-huruf`;
- lesson `bahasa-bunyi-awal`;
- pack `bahasa.pack.bunyi-awal`;
- canonical skill `bahasa.bunyi.awal.recognition`;
- assessed runtime remains `tap_choice`;
- canonical three uppercase single-letter choices and `correctChoice` remain unchanged;
- `bahasa-match-awal-tas-susu` remains `visible_matching`;
- vowel recognition/classification, Syllable Assembly, English inverse initial-sound tasks, letter ordering and every non-scope family remain unchanged;
- assessment, stars, mastery, progression, activity identity, content, schema and migrations remain canonical;
- assessed fidelity `choice_initial_sound_interaction`;
- runtime metadata source `initial-sound-runtime`.

Interaction:
- show the existing familiar clue and the canonical familiar word with its first letter masked;
- keep `?` as the masked first-letter result before correct assessment;
- prompt the child to say/read the visible familiar word before choosing its first letter;
- retain accessible keyboard/touch/pointer direct-selection buttons;
- wrong selection is retryable and measured, cannot complete, and cannot reveal the first letter;
- correct selection completes the existing activity identity and reveals the canonical first letter;
- no changed choice set, drag-only dependency, extra confirmation or intermediate assessment.

Acceptance evidence:
- CI #701/#702/#703 correctly caught progressively more accurate but still-invalid QA progression fixtures rather than allowing a false browser pass;
- final fixture reflects immediate prior stage `bahasa-cerita` and required practice `bahasa-cerita-teman` with completion-only evidence semantics;
- accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` passed full CI #704 / run `35069389333`;
- dedicated Initial Sound browser QA passed 320x720, 390x844 and 768x1024 idle/wrong/success states, keyboard wrong-path, pointer completion, masked answer, false-completion guard, target sizing, feedback/CTA visibility and evidence checks;
- all nine Initial Sound screenshots passed manual visual acceptance;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #34 is not merged/closed until implementation PR #147 passes fresh docs-head CI, clean exact-head merge, live-main verification, then a separate docs-only closure PR is also exact-head merged and verified on `main` with Cloudflare smoke.

### `equal_groups` — Pattern #33 FULLY CLOSED

Exact scope:

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

Pattern #33 implementation PR #145 and closure PR #146 are complete. Final verified `main` is `0f90a7fae1164ae6ace86f993024cef7b4989ca9`; final CI #700 / run `35058250562` passed the full matrix including Cloudflare production smoke.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Priority families still worth **fresh** objective/evidence audit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`, `word_picture_match`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

No family is pre-approved for Pattern #35. A fresh audit starts only after Pattern #34 is fully closed.

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order terbaru

- Syllable Assembly — DONE / #139 + #140, fully closed.
- Make Total — DONE / #141 + #142, fully closed.
- Take Away — DONE / #143 + #144, fully closed.
- Equal Groups — DONE / #145 + #146, fully closed; final CI #700.
- Initial Sound implementation — **PR #147 QA ACCEPTED / UNMERGED**.
- NEXT only after Pattern #34 full closure — fresh objective/evidence audit for Pattern #35; no family pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
