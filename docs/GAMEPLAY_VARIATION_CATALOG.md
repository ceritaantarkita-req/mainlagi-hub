# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah. Gunakan interaction engine reusable sebanyak yang memang dibutuhkan.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence yang benar: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos static regression, progression, completion/evidence, keyboard, touch/pointer, mobile responsive, dan visual review nyata.
- Permanent distribution audit wajib tetap 900/900 classified selama baseline produk masih 900 activities.

## Status implementasi

### Merged di `main`: 15 pola

1. `choice_grid` — pilih satu jawaban dari beberapa opsi.
2. `symbol_hunt` — cari simbol/huruf target dalam area visual.
3. `listen_choose` — dengarkan petunjuk lalu pilih jawaban.
4. `visible_matching` — pilih dua item terbuka yang berpasangan.
5. `guided_trace` — ikuti garis/bentuk panduan.
6. `story_read` — baca/dengarkan cerita singkat.
7. `motion_game` — respons aktivitas dengan gerak tubuh opsional.
8. `coloring_canvas` — isi area gambar dengan warna.
9. `drawing_canvas` — menggambar bebas/terarah dengan scaffold.
10. `memory_pair` — buka kartu tertutup dan cari pasangan. **MERGED PR #101**
11. `missing_sequence_slot` — isi slot kosong pada urutan huruf. **MERGED PR #102**
12. `sorting_buckets` — kelompokkan semua kartu ke kategori sesuai/tidak sesuai. **MERGED PR #103**
13. `drag_to_target` — seret source card ke target yang tepat dengan fallback tap/keyboard. **MERGED PR #104**
14. `count_and_select` — hitung kumpulan benda lalu pilih jumlah yang tepat. **MERGED PR #106**
15. `number_line` — gunakan posisi angka pada garis bilangan. **MERGED PR #108**

Permanent gameplay-distribution audit: **MERGED PR #105**.  
Number Line merge: `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`.

### Dalam QA / PR #109: pola #16

`more_less_balance` — bandingkan dua jumlah melalui posisi kiri / sama / kanan pada balance board.

Exact scope: 6 Math Wave B comparison activities:

```text
math-compare-more-2-4
math-compare-less-5-3
math-compare-equal-4-4
math-compare-more-6-5
math-compare-less-7-9
math-compare-more-10-8
```

Boundaries:
- satu stage `math-banding-bentuk`, lesson comparison, skill `math.quantity.comparison`;
- canonical choices dipetakan eksplisit ke left/equal/right;
- beam tetap netral sebelum completion agar visual tidak membocorkan jawaban;
- runtime tetap `tap_choice`;
- choices, correctChoice, skill, assessment, stars, progression, activity ID dan completion identity tetap canonical;
- wrong answer menambah incorrect/retry dan tidak complete;
- assessed fidelity `choice_balance_comparison_interaction` dengan comparison goal, left/right counts dan correct-side metadata;
- exact six-ID allowlist mencegah Math choice family lain ikut ter-route.

QA implementation head `9c71560e37a5dace1c79abea56d4cda625eb27c0`:
- CI #496 full green di Ubuntu, Windows, production build, dependency audit, secret scan dan Chromium mobile QA;
- browser representative `math-compare-equal-4-4` memakai legitimate Wave A readiness; progression guard tetap aktif;
- keyboard wrong-state, pointer completion melalui `Sama`, evidence persistence, >=44px controls, no overflow dan success CTA semuanya lolos pada 320/390/768;
- manual visual review idle/error/success pada 320, 390 dan 768 accepted;
- deterministic audit tetap **900 KEEP / 0 flagged**, structural findings 0.

Measured distribution PR #109:

```text
900 / 900 classified
0 unclassified
16 active child-facing patterns
choice_grid          371 / 900 = 41.22%
more_less_balance      6 / 900 = 0.67%
number_line             6 / 900 = 0.67%
Math choice_grid       61 / 100
```

Dibanding merged baseline PR #108: `choice_grid` 377 -> 371 dan Math `choice_grid` 67 -> 61.

## 60 pola permainan target

### A. Recognition & choice
1. `choice_grid` — pilih satu jawaban dari beberapa opsi. **MERGED**
2. `symbol_hunt` — cari huruf/simbol target di area visual. **MERGED**
3. `multi_select` — pilih semua item yang memenuhi aturan.
4. `odd_one_out` — temukan item yang berbeda dari kelompok.
5. `true_false_swipe` — tentukan benar/salah dengan dua arah aksi.

### B. Matching & memory
6. `visible_matching` — pilih dua item terbuka yang berpasangan. **MERGED**
7. `memory_pair` — buka kartu tertutup dan temukan pasangan. **MERGED PR #101**
8. `line_matching` — hubungkan item kiri dan kanan dengan garis.
9. `shadow_matching` — cocokkan objek dengan bentuk/siluetnya.
10. `sound_matching` — cocokkan bunyi dengan gambar/simbol yang sesuai.

### C. Sequence & ordering
11. `missing_sequence_slot` — isi bagian kosong pada urutan. **MERGED PR #102**
12. `reorder_cards` — susun kartu ke urutan yang benar.
13. `tap_in_order` — ketuk item sesuai urutan yang diminta.
14. `before_after` — tentukan item sebelum atau sesudah target.
15. `story_sequence` — susun kejadian cerita dari awal sampai akhir.

### D. Drag, drop & sort
16. `drag_to_target` — seret item ke target yang tepat, dengan fallback tap/keyboard. **MERGED PR #104**
17. `sorting_buckets` — kelompokkan semua item ke kategori yang tepat. **MERGED PR #103**
18. `shape_fit` — masukkan bentuk ke slot yang sesuai.
19. `assemble_pieces` — gabungkan bagian menjadi objek utuh.
20. `label_picture` — tempatkan label ke bagian gambar yang benar.

### E. Search & scene exploration
21. `find_in_scene` — cari objek target di dalam sebuah scene.
22. `hidden_object` — temukan objek yang sebagian tersembunyi.
23. `spot_difference` — cari perbedaan antara dua visual.
24. `treasure_hunt` — ikuti petunjuk untuk menemukan target akhir.
25. `hotspot_discovery` — ketuk bagian scene untuk menemukan informasi/target.

### F. Number & math interaction
26. `count_and_select` — hitung objek lalu pilih jumlahnya. **MERGED PR #106**
27. `number_line` — gunakan posisi angka pada garis bilangan. **MERGED PR #108**
28. `more_less_balance` — tentukan sisi lebih banyak, lebih sedikit, atau sama. **QA / PR #109**
29. `make_total` — pilih/gabung item untuk mencapai jumlah tertentu.
30. `pattern_completion` — pilih bagian berikutnya dari pola visual/angka.

### G. Literacy construction
31. `build_word` — susun huruf menjadi kata.
32. `syllable_assembly` — gabungkan suku kata menjadi kata.
33. `letter_construction` — susun garis/bentuk menjadi huruf.
34. `initial_sound_sort` — kelompokkan kata/gambar berdasarkan bunyi awal.
35. `word_picture_match` — cocokkan kata dengan gambar melalui interaction khusus.

### H. Puzzle & path
36. `maze_path` — temukan jalur dari start ke tujuan.
37. `route_planning` — pilih urutan titik/jalur untuk mencapai target.
38. `connect_the_dots` — hubungkan titik sesuai urutan.
39. `missing_piece` — pilih potongan yang melengkapi gambar/pola.
40. `tile_rotation` — putar bagian sampai membentuk konfigurasi benar.

### I. Audio-focused
41. `listen_and_point` — dengarkan lalu tunjuk item dalam scene.
42. `listen_and_match` — dengarkan lalu pasangkan audio ke item.
43. `sound_memory` — ingat urutan/posisi bunyi lalu jawab.
44. `audio_sequence` — susun item berdasarkan urutan bunyi yang didengar.
45. `sound_discrimination` — bedakan dua atau lebih bunyi yang mirip.

### J. Science & logic exploration
46. `classify_observation` — kelompokkan objek berdasarkan ciri yang diamati.
47. `predict_result` — pilih prediksi sebelum melihat hasil.
48. `cause_effect` — lakukan aksi sederhana dan lihat akibatnya.
49. `compare_properties` — bandingkan ukuran, bentuk, fungsi, atau sifat.
50. `observation_checklist` — temukan beberapa ciri target dalam visual.

### K. Creative visual play
51. `color_by_rule` — warnai bagian berdasarkan aturan sederhana.
52. `color_mixing` — gabungkan warna untuk mendapatkan warna target.
53. `drawing_continuation` — lanjutkan garis/bentuk awal menjadi gambar.
54. `symmetry_completion` — lengkapi sisi lain dari bentuk simetris.
55. `mirror_drawing` — tirukan bentuk pada sisi cermin/grid.

### L. Story & interactive scene
56. `choose_next_scene` — pilih kejadian/gambar yang paling masuk akal berikutnya.
57. `cause_consequence_story` — pilih akibat dari tindakan dalam cerita.
58. `comic_ordering` — susun panel komik menjadi alur yang benar.
59. `conversation_choice` — pilih respons yang sesuai dalam dialog sederhana.
60. `interactive_scene` — lakukan beberapa aksi pada scene untuk menyelesaikan objective.

## Distribution rule

Tidak ada satu pola yang boleh mendominasi hanya karena paling mudah dibuat. Distribution audit adalah gate permanen untuk coverage dan pattern-set consistency, sementara concentration tetap advisory.

Prinsip alokasi:
- gunakan mechanic paling cocok dengan objective;
- variasikan mechanic di dalam subject/stage supaya sesi tidak monoton;
- jangan memaksa practice/creative menjadi assessed;
- jangan mengubah mastery/progression hanya untuk mechanic baru;
- jangan membuat one-off engine jika pola bisa reusable;
- jangan menurunkan hotspot secara kosmetik dengan mechanic yang pedagogically salah.

## Rollout order berdasarkan audit aktual

1. `memory_pair` — **DONE / PR #101**.
2. `missing_sequence_slot` — **DONE / PR #102**.
3. `sorting_buckets` — **DONE / PR #103**.
4. `drag_to_target` — **DONE / PR #104**.
5. gameplay-distribution audit — **DONE / PR #105**.
6. `count_and_select` — **DONE / PR #106**.
7. `number_line` — **DONE / PR #108**.
8. `more_less_balance` — **QA / PR #109**, exact six Wave B comparison activities.
9. next review: `pattern_completion`; review Wave C missing-number and `make_total` as separate families.
10. broader Logic/Science/search/audio/puzzle/literacy/creative/story waves follow permanent audit + objective fit.

## Definition of done per mechanic

Satu pola baru dianggap selesai jika:
- reusable untuk lebih dari satu activity yang memang cocok;
- objective dan evidence semantics benar;
- pointer/touch dan keyboard dapat dipakai;
- mobile layout aman dan touch target layak;
- idle/error/success state rapi secara visual pada viewport target;
- progression guard tetap benar;
- completion tidak bisa dipalsukan oleh UI;
- regression/browser tests masuk CI;
- canonical docs dan distribution audit diperbarui.
