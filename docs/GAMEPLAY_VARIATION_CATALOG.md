# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah; gunakan interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.
- Unmerged PR head harus dibedakan dari merged `main` baseline.

## Status implementasi

### Merged di `main`: 22 pola

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

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Current canonical `main`: `e46c9ff13fcf0004edbd36ed36bd638dc02cd4e0` after docs closure PR #122.  
Latest gameplay merge remains PR #121.

Merged distribution:

```text
900 / 900 classified
0 unclassified
22 active child-facing patterns
choice_grid                 347 / 900 = 38.56%
healthy_habit_routine         4 / 900 = 0.44%
Science choice_grid          60 / 100
Logic choice_grid            77 / 100
```

### `rule_pipeline` — PR #123 ACCEPTED QA / UNMERGED

Exact scope:

```text
logic-compose-red-circle-to-star
logic-compose-small-left-then-up
logic-compose-two-to-blue
logic-compose-triangle-turn-right
logic-compose-swap-then-grow
```

Boundaries:
- Logic Wave D stage `logic-mixed-reasoning-challenge`;
- all five belong to lesson `logic-composed-rules`;
- canonical skill `logic.rule.composition.basic`;
- runtime remains `tap_choice`;
- canonical three final choices and `correctChoice` remain unchanged;
- assessment, stars, progression, activity identity and completion semantics remain canonical;
- assessed fidelity `choice_rule_pipeline_interaction`;
- nearby one-step conditional, set, transitive, spatial and odd-one-out families remain canonical and outside scope.

Interaction:
- visible start state + rule 1;
- child explicitly executes rule 1 using an accessible button;
- deterministic intermediate state becomes visible;
- rule 2 then exposes the canonical three final choices;
- final choices are unavailable before rule 1;
- wrong final answer is retryable and cannot complete;
- correct final answer completes the existing activity identity;
- no invented intermediate assessment and no drag-only dependency.

Accepted evidence on implementation head `5def5791d3e3b09fbc680ba52e9e6605695e66c4`:
- CI #557 / run `34936058944` completed success across Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium;
- gameplay-presentation regression confirms exactly `5 rule_pipeline` activities;
- dedicated exact-family regression passes;
- activity-quality remains **900 KEEP / 0 flagged / structural findings 0**;
- legitimate Logic Wave C progression plus keyboard/pointer/false-completion/evidence/touch-size/overflow/CTA checks pass at 320/390/768;
- manual visual review accepted green #557 idle/intermediate/error/success screenshots at 320/390/768;
- Batch17 remains canonical and all five simulations report zero invariant errors.

PR-head distribution, **not merged yet**:

```text
900 / 900 classified
0 unclassified
23 active child-facing patterns
choice_grid                 342 / 900 = 38.00%
rule_pipeline                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            72 / 100
```

Final remaining gates for #123: canonical docs commit, final docs-head CI, clean review/thread gate, exact-head merge, verified live `main`, then post-merge docs closure.

## 60 pola permainan target

### A. Recognition & choice
1. `choice_grid` — **MERGED**
2. `symbol_hunt` — **MERGED**
3. `multi_select`
4. `odd_one_out` — next Logic candidate after #123 closure
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
15. Rule Pipeline — **PR #123 accepted QA / unmerged**.
16. After #123 closure: audit Logic Wave A `odd-one-out`; keep it separate unless its own objective/evidence gate passes.
17. Continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, and reflected in canonical docs + distribution audit. A QA pattern is not merged/shipped until current docs-head CI is green and exact-head merge + live-main verification + required post-merge closure are complete.
