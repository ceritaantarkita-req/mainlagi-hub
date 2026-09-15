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

### Merged di `main`: 17 pola

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

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Merged baseline before active PR #112: `main` @ `06477dbc8fc4d2c4f990b19f2edb3e217b3e26ae`.

### Pattern #18 in accepted QA: `cause_effect` / PR #112

Exact scope: four Science Wave B water-change choice activities:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

Excluded intentionally:
- `science-match-water-states-b`

The excluded activity remains canonical `matching` / `visible_matching` because its interaction/evidence contract differs.

Boundaries:
- stage/lesson family: Science Wave B water-state changes;
- assessed skill `science.water.state_changes.basic`;
- explicit per-activity process config, no prompt parsing;
- child-facing flow is **Awal -> Kondisi -> Hasil**;
- result remains unrevealed before a choice;
- canonical three choices and correctChoice remain intact;
- wrong answer is retryable and cannot complete;
- runtime remains `tap_choice`;
- assessment, stars, progression, activity identity, and completion identity remain canonical;
- assessed fidelity `choice_cause_effect_interaction`;
- exact four-ID allowlist prevents unrelated Science families from reclassification.

Accepted implementation QA at head `ad5f427afc9cb0c755872ee88588534066942d47`:
- CI #513 full green across Ubuntu, Windows, production build, dependency audit, secret-history scan, and Mobile Chromium;
- representative route `science-water-ice-melts` uses legitimate Science Wave A progression readiness;
- keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px controls, no overflow, and success CTA visibility pass;
- CI #512 caught a real 320x720 CTA clipping issue; compact layout was fixed and #513 passed the same assertion;
- manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024;
- deterministic audit at the accepted head remains **900 KEEP / 0 flagged**, structural findings 0.

Accepted PR #112 QA distribution:

```text
900 / 900 classified
0 unclassified
18 active child-facing patterns
choice_grid          362 / 900 = 40.22%
cause_effect           4 / 900 = 0.44%
Math choice_grid       56 / 100
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

`cause_effect` is **not merged yet** in this document state. Final docs-head CI and exact-head merge remain required.

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
48. `cause_effect` — **PR #112 ACCEPTED QA / PENDING MERGE**
49. `compare_properties`
50. `observation_checklist`

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
10. Cause/Effect — **IMPLEMENTATION QA ACCEPTED / #112; merge gates remain**.
11. After #112 merges, run another exact-family Science audit because Science remains at 75% `choice_grid`; choose the next mechanic only from objective fit, not quota pressure.
12. Audit Logic families after Science; continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.

## Definition of done per mechanic

A pattern is complete only when it is reusable for suitable activities, evidence-safe, keyboard/touch accessible, mobile-safe, progression-correct, completion-safe, regression/browser-tested in CI, manually visually reviewed, and reflected in canonical docs + distribution audit.
