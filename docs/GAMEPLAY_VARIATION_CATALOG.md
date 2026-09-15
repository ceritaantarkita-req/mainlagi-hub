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

### Verified merged gameplay baseline: 26 pola

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

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Verified fully closed 26-pattern baseline after metadata PR #132: `7e3192898e37743826266c92c6c12a918d72e508`.

Merged distribution:

```text
900 / 900 classified
0 unclassified
26 active child-facing patterns
choice_grid                 327 / 900 = 36.33%
set_reasoning                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

Distance on merged `main`: **24** patterns to minimum 50 and **34** to working target 60.

### Pattern #27 `spatial_transform` — QA ACCEPTED / UNMERGED PR #133

Exact scope:

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

Boundaries:
- Logic stage `logic-mixed-reasoning-challenge`;
- lesson `logic-spatial-transform`;
- pack `logic.pack.spatial-transform`;
- canonical skill `logic.spatial.transform.basic`;
- assessed runtime remains `tap_choice`;
- exactly three canonical choices and `correctChoice` remain unchanged;
- assessment, stars, mastery, progression, activity identity and completion semantics remain canonical;
- Wave B relative-position tasks remain outside scope;
- assessed fidelity `choice_spatial_transform_interaction`.

Interaction:
- show canonical starting direction;
- show the canonical rotation/reflection operation;
- keep final direction hidden as `?` until the child answers;
- child selects one unchanged canonical answer through accessible direct-selection buttons;
- wrong selection is retryable, measured, and cannot complete;
- correct selection completes the existing activity identity;
- no drag-only dependency, extra confirmation, invented intermediate assessment, or answer leakage.

Accepted implementation evidence:
- implementation head `267f00d243dc1778c2d86e5a0ca70d8cfe76872a`;
- full CI #597 / run `34976080767` green;
- exact-family regression: exactly 5 activities;
- permanent gameplay-presentation default-family guard remains active;
- deterministic activity-quality: 900 KEEP / 0 flagged / structural 0;
- gameplay distribution: 900/900 classified, 27 PR-head patterns, `choice_grid` 322/900 = 35.78%, `spatial_transform` 5/900, Logic `choice_grid` 52/100, Science 60/100;
- five simulations: `invariantErrors: 0`;
- Batch17 totals unchanged; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA and manual screenshots accepted at 320x720, 390x844 and 768x1024.

PR #133 is still unmerged. The finalized docs head requires a fresh full CI plus clean comments/reviews/threads + mergeability gate before exact-head merge. If merged unchanged, remaining distance becomes **23** patterns to minimum 50 and **33** to working target 60.

### `set_reasoning` — FULLY CLOSED

Set Reasoning implementation PR #130, closure PR #131 and metadata PR #132 are complete. Its exact five-ID scope, evidence fidelity `choice_set_reasoning_interaction`, runtime, mastery and progression remain unchanged by Pattern #27.

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
32. `syllable_assembly`
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

`feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, and `spatial_transform` are additional validated objective-fit patterns outside the original illustrative 60-slot naming list. Target slots are planning aids, not a prohibition on better mechanics.

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

Tidak ada satu pola yang boleh mendominasi hanya karena paling mudah dibuat. Coverage dan implemented-pattern consistency bersifat blocking; concentration bersifat advisory.

Prinsip alokasi:
- gunakan mechanic paling cocok dengan objective;
- variasikan mechanic di dalam subject/stage;
- jangan memaksa practice/creative menjadi assessed;
- jangan mengubah mastery/progression hanya untuk mechanic baru;
- jangan membuat one-off engine jika pola bisa reusable;
- jangan menurunkan hotspot secara kosmetik dengan mechanic yang pedagogically salah.

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
16. Odd One Out — **DONE / #125 + closure #126**.
17. Transitive Chain — **DONE / #127 + closure #128 + metadata #129**.
18. Set Reasoning — **DONE / #130 + closure #131 + metadata #132**.
19. Spatial Transform — **QA ACCEPTED / UNMERGED PR #133**.
20. NEXT — only after Pattern #27 merge + post-merge closure is fully verified, run a fresh objective/evidence audit for Pattern #28; no family is pre-approved.
21. Continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, reflected in canonical docs + distribution audit, exact-head merged, independently verified live on `main`, and its required post-merge docs closure is also merged and verified.
