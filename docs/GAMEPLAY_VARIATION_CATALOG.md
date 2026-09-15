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

### Verified merged gameplay baseline: 30 pola

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
30. `syllable_assembly` — **MERGED PR #139; CLOSURE PR #140**

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Verified Pattern #30 implementation merge SHA: `c973dbc9e6010ff167a082cd6759728b590e7626`.  
Final implementation PR docs head `ee891dc99c1f86831ba67b34ae39e71ec50ee886` passed CI #647 / run `35001595648`; post-merge `main` CI #648 / run `35003757463` passed including Cloudflare production smoke.

Merged distribution:

```text
900 / 900 classified
0 unclassified
30 active child-facing patterns
choice_grid                 308 / 900 = 34.22%
syllable_assembly             5 / 900 = 0.56%
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Distance remaining: **20** patterns to minimum 50 and **30** to working target 60.

### `syllable_assembly` — Pattern #30 closure record

Exact scope:

```text
bahasa-gabung-baju
bahasa-gabung-buku
bahasa-gabung-meja
bahasa-gabung-bola
bahasa-gabung-susu
```

Boundaries:
- stage `bahasa-suku-kata-kata`;
- lesson `bahasa-suku-kata-gabung`;
- pack `bahasa.pack.suku-kata-gabung`;
- canonical skill `bahasa.suku_kata.blending`;
- assessed runtime remains `tap_choice`;
- canonical three choices and `correctChoice` remain unchanged;
- assessment, stars, mastery, progression, activity identity and completion semantics remain canonical;
- Bahasa recognition/picture-word/initial-sound/listening/matching remain outside scope;
- English phonics, Math and Logic families remain outside scope;
- assessed fidelity `choice_syllable_assembly_interaction`;
- runtime metadata source `syllable-assembly-runtime`.

Interaction:
- show only the two canonical syllables already present in title/prompt content;
- mask assembled result with `?` before a correct assessment;
- validate that the two syllables concatenate exactly to canonical `correctChoice`;
- retain accessible direct-selection buttons;
- wrong selection is retryable, measured, cannot complete, and cannot reveal the result;
- correct selection completes the existing activity identity and may reveal the canonical word;
- no invented syllable, answer leakage, changed choice set, drag-only dependency, extra confirmation or intermediate assessment.

Acceptance/closure chain:
- CI #640 caught missing permanent central-test registration; fixed without weakening default-family coverage;
- CI #641 caught missing learning-test compile-manifest coverage for the new config; fixed;
- implementation head `d55c1deb54f1402c38d84417ca7ae8248c9d3b07` passed full CI #642 / run `35000557604`;
- final canonical implementation docs head `ee891dc99c1f86831ba67b34ae39e71ec50ee886` passed full CI #647 / run `35001595648`;
- all nine idle/wrong/success screenshots at 320x720, 390x844 and 768x1024 passed manual visual acceptance;
- PR #139 exact-head squash merged as `c973dbc9e6010ff167a082cd6759728b590e7626` and was independently verified live;
- post-merge `main` CI #648 / run `35003757463` passed every gate including Cloudflare production smoke;
- closure PR #140 is the final closure gate.

### `relative_order_track` — FULLY CLOSED

Relative Order Track implementation PR #137 and closure PR #138 remain complete. Pattern #30 does not change its evidence, runtime, mastery or progression.

### `investigation_board` — FULLY CLOSED

Investigation Board implementation PR #135 and closure PR #136 remain complete.

### `spatial_transform` — FULLY CLOSED

Spatial Transform implementation PR #133 and closure PR #134 remain complete.

## 60 pola permainan target

### A. Recognition & choice
1. `choice_grid` — **MERGED**
2. `symbol_hunt` — **MERGED**
3. `multi_select`
4. `odd_one_out` — **MERGED PR #125**
5. `true_false_swipe`

### B. Matching & memory
6. `visible_matching` — **MERGED**
7. `memory_pair` — **MERGED PR #101**
8. `line_matching`
9. `shadow_matching`
10. `sound_matching`

### C. Sequence & ordering
11. `missing_sequence_slot` — **MERGED PR #102**
12. `reorder_cards`
13. `tap_in_order`
14. `before_after`
15. `story_sequence`

### D. Drag, drop & sort
16. `drag_to_target` — **MERGED PR #104**
17. `sorting_buckets` — **MERGED PR #103**
18. `shape_fit`
19. `assemble_pieces`
20. `label_picture`

### E. Search & scene exploration
21. `find_in_scene`
22. `hidden_object`
23. `spot_difference`
24. `treasure_hunt`
25. `hotspot_discovery`

### F. Number & math interaction
26. `count_and_select` — **MERGED PR #106**
27. `number_line` — **MERGED PR #108**
28. `more_less_balance` — **MERGED PR #109**
29. `make_total`
30. `pattern_completion` — **MERGED PR #110**

### G. Literacy construction
31. `build_word`
32. `syllable_assembly` — **MERGED PR #139; CLOSURE PR #140**
33. `letter_construction`
34. `initial_sound_sort`
35. `word_picture_match`

### H. Puzzle & path
36. `maze_path`
37. `route_planning`
38. `connect_the_dots`
39. `missing_piece`
40. `tile_rotation`

### I. Audio-focused
41. `listen_and_point`
42. `listen_and_match`
43. `sound_memory`
44. `audio_sequence`
45. `sound_discrimination`

### J. Science & logic exploration
46. `classify_observation`
47. `predict_result`
48. `cause_effect` — **MERGED PR #112**
49. `compare_properties` — **MERGED PR #114**
50. `material_lab` — **MERGED PR #116**

`feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`, `relative_order_track`, and `syllable_assembly` are additional validated objective-fit patterns outside the original illustrative 60-slot naming list where applicable. Target slots are planning aids, not a prohibition on better mechanics.

### K. Creative visual play
51. `color_by_rule`
52. `color_mixing`
53. `drawing_continuation`
54. `symmetry_completion`
55. `mirror_drawing`

### L. Story & interactive scene
56. `choose_next_scene`
57. `cause_consequence_story`
58. `comic_ordering`
59. `conversation_choice`
60. `interactive_scene`

## Distribution rule

Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory. Gunakan mechanic karena objective fit, jangan kosmetik mengejar angka.

## Rollout order berdasarkan audit aktual

1. Memory Pair — **DONE / #101**.
2. Missing Sequence Slot — **DONE / #102**.
3. Sorting Buckets — **DONE / #103**.
4. Drag-to-Target — **DONE / #104**.
5. Gameplay Distribution Audit — **DONE / #105**.
6. Count-and-Select — **DONE / #106**.
7. Number Line — **DONE / #108**.
8. More/Less Balance — **DONE / #109**.
9. Pattern Completion — **DONE / #110**.
10. Cause/Effect — **DONE / #112**.
11. Compare Properties — **DONE / #114**.
12. Material Lab — **DONE / #116**.
13. Feature Function Link — **DONE / #119**.
14. Healthy Habit Routine — **DONE / #121**.
15. Rule Pipeline — **DONE / #123**.
16. Odd One Out — **DONE / #125 + #126**.
17. Transitive Chain — **DONE / #127 + #128 + #129**.
18. Set Reasoning — **DONE / #130 + #131 + #132**.
19. Spatial Transform — **DONE / #133 + #134**.
20. Investigation Board — **DONE / #135 + #136**.
21. Relative Order Track — **DONE / #137 + #138**.
22. Syllable Assembly — **DONE / #139 + closure #140**, fully closed after closure exact-head merge/live verification.
23. NEXT — fresh objective/evidence audit for Pattern #31 from the verified 30-pattern baseline; no family is pre-approved.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
