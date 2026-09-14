# GAMEPLAY VARIATION CATALOG

> Source of truth singkat untuk variasi cara bermain Mainlagi. Baca ini sebelum membuat atau mengubah mechanic activity.

## Target

- **Target minimum:** 50 pola permainan.
- **Target kerja:** **60 pola permainan**.
- Pola permainan **bukan** berarti 60 engine terpisah. Gunakan sekitar 12–15 engine/interaksi reusable, lalu variasikan presentasi sesuai learning objective.
- Jangan mengganti mechanic hanya demi mengejar angka. Mechanic harus membantu skill yang sedang dilatih.
- Assessed activity wajib tetap menghasilkan evidence yang benar: correct/incorrect, retry/attempt, completion, dan metadata yang relevan.
- Setiap mechanic baru wajib punya mobile, keyboard/accessibility, progression, completion, evidence regression QA, dan review visual nyata pada viewport target.

## Status saat ini

**Merged di `main`: 10 pola utama**
1. `choice_grid` — pilih satu jawaban dari beberapa opsi.
2. `symbol_hunt` — cari simbol/huruf target dalam area visual.
3. `listen_choose` — dengarkan petunjuk lalu pilih jawaban.
4. `visible_matching` — pilih dua item terbuka yang berpasangan.
5. `guided_trace` — ikuti garis/bentuk panduan.
6. `story_read` — baca/dengarkan cerita singkat.
7. `motion_game` — respon aktivitas dengan gerak tubuh opsional.
8. `coloring_canvas` — isi area gambar dengan warna.
9. `drawing_canvas` — menggambar bebas/terarah dengan scaffold.
10. `memory_pair` — buka kartu tertutup dan cari pasangan yang cocok. **MERGED PR #101**

**Dalam QA / PR #102: pola #11**
11. `missing_sequence_slot` — lihat urutan huruf dengan satu slot kosong lalu pilih kartu yang melengkapinya; runtime presentation internal memakai `sequence_slot`. Scope: **10 Letters `letters-order-*` activities**.

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
11. `missing_sequence_slot` — isi bagian kosong pada urutan. **QA / PR #102**
12. `reorder_cards` — susun kartu ke urutan yang benar.
13. `tap_in_order` — ketuk item sesuai urutan yang diminta.
14. `before_after` — tentukan item sebelum atau sesudah target.
15. `story_sequence` — susun kejadian cerita dari awal sampai akhir.

### D. Drag, drop & sort
16. `drag_to_target` — seret item ke target yang tepat.
17. `sorting_buckets` — kelompokkan item ke beberapa kategori.
18. `shape_fit` — masukkan bentuk ke slot yang sesuai.
19. `assemble_pieces` — gabungkan bagian menjadi objek utuh.
20. `label_picture` — seret label ke bagian gambar yang benar.

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

Tidak ada satu pola yang boleh mendominasi hanya karena paling mudah dibuat. Audit WS-05 harus melaporkan distribusi mechanic terhadap 900 activity dan menandai concentration yang terlalu tinggi.

Prinsip alokasi:
- gunakan mechanic yang paling cocok dengan objective;
- variasikan mechanic di dalam subject/stage agar sesi tidak monoton;
- jangan memaksa creative/practice activity menjadi assessed;
- jangan mengubah mastery/progression hanya untuk membuat mechanic baru;
- jangan membuat one-off engine jika pola bisa reusable.

## Rollout order

1. `memory_pair` — Letters case matching. **MERGED PR #101**
2. `missing_sequence_slot` — 10 Letters sequence/order activities. **QA / PR #102**
3. `sorting_buckets` + `drag_to_target` — classification/matching families; next implementation wave after #102.
4. `reorder_cards` + `tap_in_order` — sequence families yang benar-benar membutuhkan multi-step ordering.
5. `find_in_scene` + `hidden_object` — recognition/observation families.
6. `count_and_select` + `number_line` + `make_total` — Math.
7. `listen_and_point` + `listen_and_match` + `sound_discrimination` — audio-heavy families.
8. puzzle/path, literacy construction, science exploration, creative, dan story families berikutnya berdasarkan mechanic concentration audit.

## Definition of done per mechanic

Satu pola baru baru dianggap selesai jika:
- reusable untuk lebih dari satu activity yang memang cocok;
- objective dan evidence semantics benar;
- pointer/touch dan keyboard dapat dipakai;
- mobile layout aman;
- success/error state rapi secara visual pada viewport target;
- progression guard tetap benar;
- completion tidak bisa dipalsukan oleh UI;
- regression/browser tests masuk CI;
- canonical docs dan distribution audit diperbarui.
