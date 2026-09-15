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

### Merged gameplay baseline: 23 pola

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

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Canonical merged baseline: `main` @ `c0583c8e07907f02e9671e8254bc35353cf64d24` after Rule Pipeline closure PR #124.

Merged distribution:

```text
900 / 900 classified
0 unclassified
23 active child-facing patterns
choice_grid                 342 / 900 = 38.00%
rule_pipeline                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            72 / 100
```

### `odd_one_out` — PR #125 ACCEPTED QA / UNMERGED

Exact scope:

```text
logic-odd-category-animal-vehicle
logic-odd-shape-angular
logic-odd-direction-right
logic-odd-count-three
logic-odd-pattern-symmetry
```

Boundaries:
- Logic stage `logic-classification-rules-basics`;
- lesson `logic-odd-one-out-basic`;
- canonical skill `logic.discrimination.odd_one_out.basic`;
- runtime remains `tap_choice`;
- canonical three choices and `correctChoice` remain unchanged;
- assessment, stars, progression, activity identity and completion semantics remain canonical;
- assessed fidelity `choice_odd_one_out_interaction`;
- classification, comparison, simple sequence-rule, set, spatial, inference and composed-rule activities remain outside scope.

Interaction:
- show the canonical three options as one comparison trio;
- frame the task as `2 mirip • 1 beda` without revealing which option differs;
- child selects the outsider directly using accessible buttons;
- wrong selection is retryable and cannot complete;
- correct selection completes the existing activity identity;
- success may show the reviewed shared relation after completion;
- no extra confirmation step, invented assessment or drag-only dependency.

Accepted implementation evidence at head `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`:
- CI #562 surfaced a stale Rule Pipeline exclusion sentinel and was correctly blocked; the sentinel was replaced with `logic-compare-more-dots`, preserving the Rule Pipeline scope regression;
- CI #563 surfaced an incorrect QA assumption that the target stage was naturally unlocked; the progression guard correctly required preceding `logic-foundations` readiness;
- browser QA now seeds canonical qualifying Logic foundation evidence identical in principle to the established Sorting Buckets readiness path, without bypassing progression;
- CI #564 / run `34951235607` is the accepted full-green implementation run;
- gameplay-presentation and dedicated exact-family regressions pass for exactly five Odd One Out activities;
- deterministic activity-quality remains **900 KEEP / 0 flagged / structural findings 0**;
- gameplay distribution verifies **900/900 classified, 24 PR-head patterns, `choice_grid` 337/900 (37.44%), `odd_one_out` 5/900, Logic 67/100, Science 60/100**;
- simulations and Batch17 pass with canonical catalog totals unchanged;
- canonical Logic foundation progression plus keyboard wrong-state, pointer correct completion, assessed evidence, >=44px controls, no horizontal overflow and in-viewport CTA pass at 320/390/768;
- manual visual review accepted green #564 idle/error/success screenshots at all three viewports; no UI polish was required.

PR-head distribution, **not yet merged**:

```text
900 / 900 classified
0 unclassified
24 active child-facing patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

## 60 pola permainan target

### A. Recognition & choice
1. `choice_grid` — **MERGED**
2. `symbol_hunt` — **MERGED**
3. `multi_select`
4. `odd_one_out` — **PR #125 accepted QA / unmerged**
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

`feature_function_link`, `healthy_habit_routine`, and `rule_pipeline` are additional validated objective-fit patterns outside the original illustrative 60-slot naming list. Target slots are planning aids, not a prohibition on better mechanics.

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
16. Odd One Out — **PR #125 accepted QA / unmerged**.
17. After #125 closure: run a fresh Logic exact-family audit from the verified 24-pattern baseline; do not assume the next family until objective/evidence fit is rechecked.
18. Continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, and reflected in canonical docs + distribution audit. A QA pattern is not merged/shipped until current docs-head CI is green and exact-head merge + live-main verification + required post-merge closure are complete.
