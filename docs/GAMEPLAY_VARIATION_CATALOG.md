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

Pattern #32 final verified `main` SHA: `63285c6dd39b0cc1a521b042a492a83338bb2582`; final CI #684 / run `35049954680` passed including Cloudflare production smoke.

Permanent gameplay-distribution audit: MERGED PR #105.

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

### Pattern #33 `equal_groups` — QA ACCEPTED / UNMERGED PR #145

If PR #145 merges unchanged, it becomes the 33rd active pattern.

Exact scope:

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

Boundaries:
- subject `math`;
- stage `math-operasi-awal`;
- lesson `math-grouping`;
- pack `math.pack.grouping`;
- canonical skill `math.grouping.equal_groups`;
- assessed runtime remains `tap_choice`;
- canonical three numeric choices and `correctChoice` remain unchanged;
- `math-group-match-2s` and `math-group-match-3s` stay `visible_matching`;
- missing-number, addition, subtraction, length/size, existing Math specialized mechanics and all non-Math families remain outside scope;
- assessment, stars, mastery, progression, content, activity identity, schema and migrations remain unchanged;
- assessed fidelity `choice_equal_groups_interaction`;
- runtime metadata source `equal-groups-runtime`.

Interaction:
- visibly separate the reviewed total into equal-size groups;
- display total and group size as the problem context;
- mask numeric group count with `?` before a correct assessment;
- validate exact divisibility and `totalCount / groupSize === Number(correctChoice)`;
- retain accessible keyboard/touch/pointer direct-selection buttons;
- wrong selection is retryable and measured, cannot complete, and cannot reveal the group count;
- correct selection completes the canonical activity and may reveal the group count;
- no changed choice set, drag-only dependency, extra confirmation or intermediate assessment.

Accepted QA evidence:
- CI #685 / run `35052200287` correctly found success CTA clipping at 320x720;
- CI #686 / run `35052577160` correctly found idle feedback clipping at 390x844 after the first fix;
- final accepted code head `26c2b2355099c4097c015ba5767703035b33aa63` passed full CI #687 / run `35053008065` with the hard viewport assertions intact;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- deterministic activity quality remains 900 KEEP / 0 flagged / structural findings 0;
- accepted PR-head distribution:

```text
900 / 900 classified
0 unclassified
33 active patterns
choice_grid                 295 / 900 = 32.78%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             43 / 100
```

Distance after Pattern #33 would be **17** patterns to minimum 50 and **27** to working target 60.

Pattern #33 is not fully closed until PR #145 passes fresh docs-head CI and exact-head merge/live verification, followed by a separate docs-only closure PR with its own exact-head CI/merge/live verification.

## Target mechanics backlog

Original 60-pattern planning slots remain guidance, not a fixed taxonomy. Validated extra patterns may sit outside an original illustrative slot when objective fit requires a semantically distinct interaction.

Priority families still worth fresh objective/evidence audit include:
- search/scene exploration: `find_in_scene`, `hidden_object`, `spot_difference`, `hotspot_discovery`;
- ordering: `reorder_cards`, `tap_in_order`, `story_sequence`;
- literacy construction: `build_word`, `letter_construction`, `initial_sound_sort`, `word_picture_match`;
- puzzle/path: `maze_path`, `route_planning`, `connect_the_dots`, `missing_piece`, `tile_rotation`;
- audio: `listen_and_point`, `listen_and_match`, `sound_memory`, `audio_sequence`, `sound_discrimination`;
- creative/story mechanics after objective fit is proven.

No family is pre-approved for Pattern #34.

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order terbaru

- Syllable Assembly — DONE / #139 + #140, fully closed.
- Make Total — DONE / #141 + #142, fully closed.
- Take Away — DONE / #143 + #144, fully closed; final CI #684.
- Equal Groups implementation — PR #145 QA ACCEPTED / UNMERGED.
- NEXT only after Pattern #33 full closure — fresh objective/evidence audit for Pattern #34; no family pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
