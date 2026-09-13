# Galeri aktivitas dan variasi permainan — progres lokal

Tanggal: 13 September 2026. **Status keseluruhan: belum selesai; bukan release.**

Workspace: C:/Users/Amand/Documents/ChatGPT/mainlagihub. Branch: agent/local-product-qa-20260911.
Base HEAD: e0b8ad50ddc5a973669c17986570e263e743143e. Working tree masih berisi pekerjaan lokal sebelumnya.
Tidak commit, push, deploy, merge PR #87, atau pindah branch.

## Permintaan dan batas penerimaan

- Materi langsung menampilkan seluruh aktivitas, tanpa kategori/tahap perantara.
- Kartu mengutamakan thumbnail, bukan deskripsi panjang.
- Detail permainan harus benar-benar membantu anak yang belum lancar membaca.
- Target 100 atau lebih tantangan yang bervariasi per materi. Jumlah ID, perubahan judul, atau warna latar tidak membuktikan variasi.
- Perhitungan mastery, evidence, completion, dan progression tidak diubah dalam iterasi ini.

## Audit alur dan perbaikannya

1. **Masuk materi — diperbaiki.** Sebelumnya Mewarnai menampilkan ringkasan dan kartu tahap. Sekarang galeri datar menampilkan tepat 100 kartu pada masing-masing sembilan materi. Tidak ada link tahap di galeri.
2. **Pilih permainan — diperbaiki untuk aktivitas yang tersedia.** Thumbnail langsung menuju activity. Alur beranda → materi → aktivitas terbukti dua klik, bukan tiga. Kembali dan “Pilih permainan lain” menuju galeri materi.
3. **Bermain kreatif — sebagian diperbaiki.** Kanvas diperbesar, dekorasi samping tidak mengambil ruang kerja, palet 10 warna di samping desktop dan di bawah HP. Tombol memakai ikon dan label. Fill, keyboard, undo, reset mewarnai yang bisa di-undo, stroke menggambar, dan completion diuji.
4. **Panduan menggambar — 25 dari 100 diperbaiki.** Teks/simbol seperti “• ☆ •” diganti jalur latihan nyata: 15 garis/lengkung/bentuk, 5 hubungkan titik, 5 gambar awal untuk dilengkapi. Panduan bisa disembunyikan dan tidak dihitung sebagai hasil gambar anak. Ini tetap latihan bebas, bukan pengukuran ketepatan jalur baru.
5. **Akses semua permainan — belum berubah.** Seluruh kartu terlihat, tetapi availability masih mengikuti usia dan readiness lama. Kartu yang belum tersedia membuka dialog penjelasan, tidak diam-diam menuju tahap lain. Pilihan produk “main bebas atau tetap terkunci” belum diputuskan.

## Temuan variasi yang masih terbuka

Data aktual memuat 100 aktivitas per materi, tetapi sebagian besar bukan 100 cara bermain yang berbeda:

| Materi | Pilihan sentuh | Audio-pilihan | Matching | Lainnya |
| --- | ---: | ---: | ---: | --- |
| Bahasa Indonesia | 58 | 20 | 21 | 1 cerita |
| Bahasa Inggris | 48 | 27 | 25 | — |
| Matematika | 82 | 0 | 15 | 1 trace, 2 gerak |
| Iqro | 58 | 29 | 12 | 1 gerak |
| Menulis | 74 | 0 | 13 | 13 trace |
| Logika | 82 | 0 | 18 | — |
| Sains | 79 | 0 | 21 | — |
| Mewarnai | 0 | 0 | 0 | 100 coloring, **61 komposisi geometri unik** |
| Menggambar | 0 | 0 | 0 | 100 drawing, baru **25 panduan geometris nyata** |

Sumber: ACTIVITIES dari hasil kompilasi src/lib/learning/system.ts; komposisi mewarnai dihitung dari urutan path dan transform coloringScene, tanpa judul/nama region/warna.
Angka ini mengukur struktur, bukan kualitas pedagogis. Pilihan jawaban yang sama bisa menyertai soal berbeda; tidak otomatis duplikat.

Duplikasi mewarnai yang nyata: color-paca, color-parts-robot, color-fantasy-robot, color-material-metal, color-limited-three-robot, dan color-character-space menggunakan komposisi robot yang sama. Kelompok suasana pagi/siang/sore juga berbagi satu komposisi. **Belum diganti pada iterasi ini.**

Di menggambar, banyak panduan lanjutan masih berupa kalimat “Panduan visual sederhana untuk ...” atau “Mulai dari bentuk besar ...”, bukan diagram. 75 latihan berikutnya dan thumbnail-nya belum diselesaikan. Sebagian thumbnail non-kreatif masih memakai maskot atau token jawaban, bukan ilustrasi tantangan yang kaya.

mechanicLibrary.ts mendefinisikan mekanik reusable tambahan (sorting, ordering, maze, memory, dll.), tetapi mechanicRuntime.ts menyebut adapter untuk UI masa depan. Manifest/authoring saat ini memang masih memetakan mayoritas konten ke tap_choice/matching. Ini bukan sekadar satu komponen yang salah memilih renderer; dibutuhkan payload, UI interaksi, dan verifikasi evidence yang sesuai.

## Solusi lanjutan, belum diimplementasikan

1. Tuntaskan panduan gambar dan thumbnail yang cocok dengan setiap tantangan, bukan ilustrasi maskot yang diulang.
2. Ganti komposisi mewarnai duplikat dengan subjek/adegan yang benar-benar berbeda. Jangan menaikkan angka unik dengan sekadar translasi, skala, warna, atau tambahan bintang.
3. Diversifikasi interaksi sesuai tujuan materi: susun bunyi/kata dan urutan cerita; manipulasi jumlah dan perbandingan; klasifikasi/pola/urutan; observasi dan sebab-akibat. Jangan menambahkan drag sebagai satu-satunya input: harus ada alternatif tap/keyboard.
4. Gunakan kontrak pengukuran yang sudah ada. Migrasi mekanik harus disertai tes hasil, retry, bantuan, completion dan isolation; jangan mengubah definisi mastery untuk membuat UI baru lolos.
5. Baru tambah jumlah di atas 100 setelah setiap konten lolos review ketepatan, keunikan, usia, aksesibilitas dan uji interaksi. Belum ada klaim 100–1000 aktivitas non-berulang per materi.

## Bukti dan pemeriksaan

Build panduan terbaru: IBIv0zqxlh1nkqZSWgeUk.

- npm run build: PASS.
- npm run lint: PASS, tanpa warning.
- Primary flow: PASS, beranda → Bahasa → bahasa-cari-a, dua klik.
- Quick QA final setelah penambahan scaffold: PASS, 150 route checks, 82 screenshot, 0 blocker, 8 warning exposure; semua 9 galeri cocok dengan 100 ID katalog masing-masing. Alur dua klik diulang dan PASS pada build yang sama.
- Playroom setelah scaffold: PASS di 1440×1000, 390×844, 1505×1045; 15 screenshot.
- 25 route menggambar: renderer guide sesuai, URL tidak redirect, thumbnail HTTP berhasil, path terparse, tombol Selesai tetap disabled sebelum goresan.
- Tidak ada console/runtime/parser error dalam suite Playroom.
- 100 ilustrasi mewarnai terparse Chromium. Ini bukan bukti 100 gambar unik.
- Full crawl 900 aktivitas belum diulang dalam iterasi galeri ini. Kegagalan coverage sebelumnya (55 layar / 845 redirect) tidak dinyatakan selesai oleh quick QA.

Browser in-app digunakan untuk audit galeri/studio awal. Pada lanjutan scaffold, inventori browser kosong; suite Chromium proyek digunakan untuk verifikasi lanjutan. Screenshot desktop dan HP dibuka serta diperiksa, bukan hanya disimpan.

### Exposure profil demo baru

| Materi | Kartu terlihat | Langsung bisa dimainkan | Belum tersedia |
| --- | ---: | ---: | ---: |
| Bahasa | 100 | 5 | 95 |
| English | 100 | 6 | 94 |
| Math | 100 | 4 | 96 |
| Iqro | 100 | 4 | 96 |
| Menulis | 100 | 3 | 97 |
| Logika | 100 | 3 | 97 |
| Sains | 100 | 3 | 97 |
| Mewarnai | 100 | 2 | 98 |
| Menggambar | 100 | 25 | 75 |

8 warning low_fresh_start_activity_exposure tetap ada. Warning sekarang membedakan **kartu terlihat** dengan **bisa dimainkan**, bukan menyebut kartu tidak terlihat.

## File implementasi iterasi ini

- src/components/learning/ActivityGallery.tsx dan ActivityGallery.module.css: galeri datar, preview, dialog availability.
- src/components/learning/ChildLearningPathViews.tsx: SubjectScreen memakai galeri.
- src/components/learning/GardenActivityFrame.tsx dan GardenActivityFrame.module.css: mode ruang kerja kreatif.
- src/components/learning/CreativePracticeActivity.tsx dan CreativeStudio.module.css: kanvas, alat, dan panduan.
- src/components/learning/DrawingScaffold.tsx dan src/lib/learning/drawingGuides.ts: 25 panduan latihan.
- ChildLearningPlatform.tsx, AudioChoiceLearningActivity.tsx, world/MathTraceWorldActivity.tsx, world/WorldExperience.tsx: destinasi kembali ke subject.
- scripts/build-coloring-previews.mjs dan public/artwork/activity-previews/: 100 preview mewarnai + 25 preview drawing dari geometri permainan.
- scripts/run-local-product-flow-check.mjs, run-local-product-qa.mjs, run-local-playroom-check.mjs, tsconfig.learning-tests.json: regresi kontrak UI baru.

Daftar ini bukan seluruh dirty tree. Perubahan lokal dari sesi sebelumnya tetap dipertahankan.

## Screenshot

Galeri mewarnai setelah penghilangan tahap:

![Galeri mewarnai desktop](C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/activity-audit/05-gallery-after.png)

Galeri menggambar dengan preview panduan sebenarnya:

![Galeri menggambar desktop](C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/drawing-gallery-1440.png)

Hubungkan titik pada HP:

![Hubungkan titik bintang](C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/drawing-dots-star-390.png)

Gambar awal untuk dilengkapi:

![Lengkapi wajah](C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/drawing-compose-face-features-1440.png)

## Batas audit

Screenshot dan tes browser tidak membuktikan aksesibilitas menyeluruh, kualitas suara native, kesesuaian semua usia, atau kualitas 900 tantangan. Belum ada uji dengan anak setelah perubahan. Target variasi seluruh materi dan akses semua aktivitas masih terbuka; jangan menandai redesign keseluruhan selesai.
