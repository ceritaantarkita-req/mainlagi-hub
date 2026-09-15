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

### Merged di `main`: 19 pola

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

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Latest gameplay merge: PR #114 `4f3e2828aa3be804f6d896b10f8e3422c3180811`.

### `material_lab` — ACCEPTED IMPLEMENTATION QA / PR #116 / UNMERGED

Pattern #20 on the current PR head. Exact scope:

```text
science-material-raincoat-waterproof
science-material-window-transparent
science-material-towel-absorbent
science-material-toy-block-rigid
```

Excluded intentionally:

```text
science-match-material-purpose-d
```

Boundaries:
- Science Wave D stage `science-evidence-review-challenge`;
- all four scoped objectives select a material property that lets a familiar object fit its purpose;
- canonical three choices/correctChoice remain the assessed answer set;
- the matching activity stays `matching` / `visible_matching`;
- investigation/evidence tasks stay outside scope because fair-test design, variable control, prediction and conclusion are different objectives;
- runtime remains `tap_choice`;
- assessment, stars, progression, activity identity and completion identity remain canonical;
- assessed fidelity `choice_material_lab_interaction`;
- exact four-ID allowlist prevents unrelated Science Wave D families from reclassification.

Interaction is deliberately two-step: choose a sample, then test it. Selection alone cannot complete. A wrong test is retryable and cannot complete.

QA evidence:
- CI #532 found a real package regression before acceptance; the omitted existing `@phosphor-icons/react` dependency was restored;
- CI #533 is full green on implementation head `09dd638748d62da1da264ce3b4f6f8f6880354b7`;
- static scope regression confirms exactly 4 activities;
- deterministic audit remains **900 KEEP / 0 flagged**, structural findings 0;
- legitimate Wave C progression, keyboard selection, explicit test, false-completion guards, pointer completion, assessed evidence, >=44px controls, no overflow and CTA visibility pass at 320/390/768;
- manual visual review accepts idle/error/success screenshots at 320/390/768.

Measured PR-head distribution:

```text
900 / 900 classified
0 unclassified
20 active child-facing patterns
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

This remains QA state until #116 merges; merged `main` remains at 19 patterns.

## 60 pola permainan target

### A. Recognition & choice
1. `choice_grid` — **MERGED**
2. `symbol_hunt` — **MERGED**
3. `multi_select`
4. `odd_one_out`
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
50. `material_lab` — **ACCEPTED QA / PR #116**

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
12. Material Lab — **ACCEPTED QA / #116; final docs-head CI + merge still required**.
13. After #116, re-audit remaining Science exact families; do not force heterogeneous investigation/evidence tasks into one engine.
14. Audit Logic after the Science pass; continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, and reflected in canonical docs + distribution audit. A QA pattern is not merged/shipped until current docs-head CI is green and exact-head merge is verified.
