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

### Merged gameplay baseline: 24 pola

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

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Canonical merged gameplay baseline: `main` @ `a961be0e61055f7347244b58b9dc252d5ed6f382` after Odd One Out closure PR #126.

Merged distribution:

```text
900 / 900 classified
0 unclassified
24 active child-facing patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

### `transitive_chain` — PR #127 QA ACCEPTED / UNMERGED

Pattern #25 exists on the PR head only and is **not yet part of merged `main`**.

Exact scope:

```text
logic-transitive-height-abc
logic-transitive-shortest-xyz
logic-transitive-most-dots
logic-transitive-lightest
logic-transitive-middle-order
```

Boundaries:
- Logic stage `logic-mixed-reasoning-challenge`;
- lesson `logic-transitive-comparison`;
- canonical skill `logic.comparison.transitive.basic`;
- runtime remains `tap_choice`;
- canonical three choices and `correctChoice` remain unchanged;
- assessment, stars, progression, activity identity and completion semantics remain canonical;
- assessed fidelity `choice_transitive_chain_interaction`;
- composed rules, set reasoning, spatial transforms, Wave C inference/ordering and Wave B comparison/spatial families remain outside scope.

Interaction:
- show the three entities as a visible chain linked by two canonical premises;
- label the two connectors as `Premis 1` and `Premis 2`;
- child selects the unchanged canonical conclusion through accessible buttons;
- wrong selection is retryable and cannot complete;
- correct selection completes the existing activity identity;
- success explains the reviewed relation after completion;
- no invented numeric values, extra assessed step, reordering requirement, changed answer set or drag-only dependency.

Accepted implementation evidence:
- CI #569 correctly exposed a stale Rule Pipeline exclusion sentinel and was rejected; the old exact-scope guard remained active after replacing only that sentinel with unrelated `logic-infer-not-red`;
- CI #570 passed every non-browser gate but Mobile correctly exposed that the completed 390x844 layout pushed the CTA below the viewport; that run was rejected;
- phone-sized completed state now hides only the already-consumed prompt + premise chain, preserving question, canonical choices, success explanation and CTA; idle/retry still show the full chain;
- implementation head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833` passed full CI #572 / run `34957824566`;
- gameplay-presentation and dedicated exact-family regressions both verify exactly five Transitive Chain activities;
- deterministic activity-quality remains **900 KEEP / 0 flagged / structural findings 0**;
- gameplay distribution verifies **900/900 classified, 25 PR-head patterns, `choice_grid` 332/900 (36.89%), `transitive_chain` 5/900, Logic 62/100, Science 60/100**;
- all five simulations report zero invariant errors and Batch17 canonical totals remain unchanged;
- canonical Logic Wave C progression, keyboard wrong-state, pointer correct completion, assessed evidence, >=44px controls, no horizontal overflow and in-viewport CTA pass at 320/390/768;
- manual visual review accepted #572 idle/try/success screenshots at all three viewports, including the repaired 390 success state.

The canonical docs update changes the PR SHA, therefore #572 is implementation acceptance evidence only. A new full docs-head CI is mandatory before merge.

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

`feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, and `odd_one_out` are additional merged objective-fit patterns outside the original illustrative 60-slot naming list. `transitive_chain` is an additional QA-accepted objective-fit pattern on unmerged PR #127. Target slots are planning aids, not a prohibition on better mechanics.

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
17. Transitive Chain — **QA ACCEPTED / PR #127 UNMERGED**; final docs-head CI, review gate, exact-head merge and closure remain.
18. After closure: fresh Logic exact-family audit. Logic remains 62% `choice_grid` on the PR head, but no next family is pre-approved.
19. Continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, and reflected in canonical docs + distribution audit. Work is not fully closed until exact-head merge, live-main verification, and required post-merge docs closure are complete.
