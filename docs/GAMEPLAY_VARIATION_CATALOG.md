# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target dan aturan

- **Minimum:** 50 pola permainan; **target kerja:** 60.
- Pola permainan bukan berarti 60 engine terpisah. Gunakan sekitar 12–15 interaction engine reusable.
- Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
- Assessed activity wajib menjaga evidence yang benar: correct/incorrect, retry, completion, score/accuracy bila relevan, dan metadata interaction.
- Setiap mechanic baru wajib lolos static regression, progression, completion/evidence, keyboard, touch/pointer, mobile responsive, dan visual review nyata.

## Status implementasi

### Merged di `main`: 12 pola

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

### Dalam QA / PR #104: pola #13

`drag_to_target` — pasangkan source card ke target yang tepat dengan drag nyata dan fallback tap/keyboard.

Scope sengaja sempit, tepat 5 Science Wave A matching activities:
- `science-match-living-nonliving`
- `science-match-plant-parts`
- `science-match-animal-homes-a`
- `science-match-senses-a`
- `science-match-weather-signs-a`

Boundaries:
- runtime tetap `matching`;
- activity ID, `matchItems`, pair ids, skill, assessment, stars, progression, dan completion identity tidak berubah;
- setiap activity tetap 3 canonical pairs;
- pointer desktop dapat drag-and-drop langsung;
- touch/pen memakai pointer drag; tap/select -> target dan keyboard tetap tersedia sebagai fallback;
- explicit assessed evidence memakai `matching_drag_target_interaction` dengan correct/incorrect/retry dan `matchedPairCount`;
- matching lain tetap `memory_pairs` atau `grid_pairs` sesuai classifier yang sudah ada.

QA implementasi PR #104:
- implementation head `722391fe049b3e055ab69e16140141bdf971268b`;
- CI #465 full success: Ubuntu, Windows, production build, dependency audit, secret scan, dan mobile Chromium;
- static regression: **12 memory_pair + 5 drag_targets + 10 sequence_slot + 5 sorting_buckets**;
- browser QA 320/390/768 memakai prerequisite Science yang valid, menguji keyboard wrong-state, real mouse drag, touch fallback, completion/evidence, >=44px controls, no horizontal overflow, dan success CTA tetap di viewport;
- manual visual review menerima idle/error/success pada 320, 390, dan 768;
- deterministic audit tetap **900 KEEP / 0 flagged**, structural findings 0.

Jika PR #104 merged, jumlah gameplay pattern aktif menjadi **13**.

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
16. `drag_to_target` — seret item ke target yang tepat, dengan fallback tap/keyboard. **QA / PR #104**
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
26. `count_and_select` — hitung objek lalu pilih jumlahnya.
27. `number_line` — tempatkan atau pilih angka pada garis bilangan.
28. `more_less_balance` — tentukan sisi lebih banyak, lebih sedikit, atau sama.
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

Tidak ada satu pola yang boleh mendominasi hanya karena paling mudah dibuat. WS-05 harus memelihara audit distribusi mechanic terhadap seluruh 900 activity dan menandai concentration yang terlalu tinggi.

Prinsip alokasi:
- gunakan mechanic paling cocok dengan objective;
- variasikan mechanic di dalam subject/stage supaya sesi tidak monoton;
- jangan memaksa practice/creative menjadi assessed;
- jangan mengubah mastery/progression hanya untuk mechanic baru;
- jangan membuat one-off engine jika pola bisa reusable.

## Rollout order

1. `memory_pair` — **DONE / PR #101**.
2. `missing_sequence_slot` — **DONE / PR #102**.
3. `sorting_buckets` — **DONE / PR #103**.
4. `drag_to_target` — **QA / PR #104**.
5. `reorder_cards` dan `tap_in_order` — kerjakan sebagai wave terpisah sesuai objective multi-step ordering.
6. `find_in_scene` + `hidden_object` — recognition/observation.
7. `count_and_select` + `number_line` + `make_total` — Math.
8. `listen_and_point` + `listen_and_match` + `sound_discrimination` — audio-heavy families.
9. Lanjut puzzle/path, literacy construction, science exploration, creative, dan story berdasarkan mechanic-distribution audit.

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
