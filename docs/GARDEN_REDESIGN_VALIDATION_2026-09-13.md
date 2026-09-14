# Mainlagi Garden — validasi lokal desain 1

> Pembaruan lanjutan: docs/ACTIVITY_GALLERY_AND_VARIETY_2026-09-13.md. Alur subject → tahap → activity yang dicatat di laporan historis ini telah diganti menjadi galeri subject → activity. Quick QA terbaru bukan pengganti full crawl ketat yang masih blocked.

Tanggal: 13 September 2026. Status: interaksi Garden perwakilan PASS; penerimaan menyeluruh BLOCKED oleh coverage seluruh aktivitas. Bukan release.

## Workspace dan batas perubahan

- Path: `C:/Users/Amand/Documents/ChatGPT/mainlagihub`.
- Branch: `agent/local-product-qa-20260911`.
- Base HEAD: `e0b8ad50ddc5a973669c17986570e263e743143e`.
- Next build ID yang diuji: `tr6PiSLvvymWrSsYpLmS3`.
- Preview: `http://127.0.0.1:3011`.
- Working tree berisi perubahan lokal yang belum di-commit, termasuk pekerjaan audit/redesign sebelumnya. SHA HEAD saja tidak mewakili build lokal ini.
- Tidak commit, push, merge PR #87, checkout main/master, atau deploy. Website produksi tidak berubah oleh pekerjaan ini.

## Yang sudah diimplementasikan

Satu bingkai aktivitas Garden menyatukan kontrol kembali/dengar, tipografi, area tugas, feedback, dan ilustrasi Gavi/Paca. Renderer pilihan, audio, matching, cerita, trace, matematika khusus, mewarnai, menggambar, serta entry gerak memakai bahasa visual yang sama. Beranda, subject/stage, profil, rewards, navigasi orang tua, dan akun turut diselaraskan.

Tidak ada katalog Jelajah kedua di jalur anak. Jalur belajar utama kini beranda → subject → tahap → aktivitas. Anak yang kembali menggunakan profil tersimpan tanpa mengisi setup lagi. Semua kategori menampilkan jumlah katalog 100; aturan usia dan unlock tetap berlaku.

### Perbaikan pada sesi 13 September

1. Build dan uji ulang reset CSS mobile yang sebelumnya menimpa ukuran pilihan huruf. Assertion tinggi >=110px dan font >=50px tetap dipertahankan.
2. Tambahkan pemeriksaan layar 360px. Tes menangkap link Kembali kehilangan nama aksesibel saat label visual disembunyikan. Tambahkan `aria-label="Kembali"`; tidak mengubah navigasi.
3. Perluas regresi Garden menjadi desktop, HP 390px, dan HP 360px. Simpan hasil dan screenshot sebagai bukti, bukan sekadar build success.

## Hasil validasi

Build final dengan accessible name sudah diuji. Ditemukan celah coverage pada full QA lama; penerimaan seluruh 900 layar belum selesai:

- Flow lokal PASS, 3 klik dari beranda anak ke aktivitas.
- Quick product PASS: 159 route, 0 blocker, 8 warning, 82 screenshot.
- **Full QA ketat FAIL**: seluruh 900 URL dicoba, 55 activity route lolos identitas layar, 845 redirect ke subject; 214 total route lolos (159 non-crawl + 55 activity), 1 blocker agregat, 8 warning, 82 screenshot. Primary learning flow tetap PASS, 3 klik. Tidak ditemukan jenis kegagalan lain dalam 845 detail tersebut.
- Full run sebelumnya melaporkan PASS: 900 URL activity, 1059 total route, 0 blocker, 8 warning, 82 screenshot. **Bukan bukti 900 layar aktivitas**, karena redirect tidak dideteksi pada versi QA itu.
- Garden desktop/390px/360px PASS: 48 screenshot. Accessible name Kembali, ukuran tombol, pilihan salah/benar, matching, trace dan 12 keluarga halaman per viewport lolos.
- Playroom PASS pada 1440×1000, 390×844, 1505×1045: profil/subject intent, returning child, satu direktori, coloring keyboard/fill/undo/reset/completion, drawing stroke/undo.
- Parser Chromium mewarnai PASS 100/100 scene.
- Lint dan mobile foundation PASS.
- Seluruh 15 suite learning PASS. AudioManager PASS setelah source-contract diperbarui untuk jalur narasi bersama.

### Pemeriksaan browser perwakilan Garden

| Pemeriksaan | Hasil | Bukti |
| --- | --- | --- |
| Identitas aktivitas utama | PASS | Heading Cari huruf A, 3 pilihan, frame Garden, kontrol Kembali |
| Konten tidak kosong | PASS | Main dan interaksi nyata pada tiap keluarga yang ditangkap |
| Error framework | PASS pada smoke | Tidak ada overlay pada route yang diperiksa product QA |
| Console/page error | PASS pada Garden | Listener error aktif sepanjang interaksi dan screenshot; tidak ada filter |
| Responsive | PASS pada sampel | 1487×1058, 390×844, 360×800; tidak ada overflow horizontal/gambar gagal |
| Interaksi | PASS | B salah → A benar → completion; pilih/batal/mismatch/selesai matching; hitung 3 → trace 5 sesuai checkpoint |
| Seluruh 900 layar | FAIL | 900 URL dicoba; 55 layar lolos, 845 redirect; 1 blocker coverage |

Build dijalankan sekali lalu entry Node dari script npm QA dijalankan terhadap `.next` yang sama, agar tidak membangun ulang output saat server QA lain masih membaca build. Perintah utama: `npm run build`, `node scripts/run-local-product-flow-check.mjs`, `node scripts/run-local-product-qa.mjs --skip-activity-crawl`, `node scripts/run-local-product-qa.mjs`, `node scripts/run-local-garden-check.mjs`, `node scripts/run-local-playroom-check.mjs`, `npm run test:learning`, `npm run test:audio-manager`, `npm run lint`.

### Arti coverage

Full crawl lama menguji setiap URL untuk respons, konten tidak kosong, overlay framework, console/page error, dan overflow, tetapi tidak memverifikasi identitas layar akhir. Probe browser membuktikan `/child/demo-gian/activity/bahasa-terapan-lani-tunas` diarahkan ke `/child/demo-gian/subject/bahasa` dan tidak memiliki activity frame. Hasil 900 lama tidak boleh dipakai sebagai sertifikasi seluruh layar.

QA sekarang menuntut pathname aktivitas tetap sesuai dan tepat satu Garden activity frame sebelum menghitung route berhasil. Guard tidak dibypass dan progression tidak diubah. Run ketat selesai pada 13 September sekitar 02:21 WIB dengan 55 layar lolos dan 845 redirect. Itu merupakan blocker **cakupan pengujian**, bukan bukti 845 aktivitas rusak. Uji interaksi mendalam tetap dilakukan pada perwakilan mekanik, bukan menyelesaikan seluruh katalog.

8 warning `ux.low_fresh_start_activity_exposure` harus tetap terlihat. Kategori bahasa, English, matematika, Iqro, menulis, logika, sains, dan mewarnai belum mengekspos seluruh katalog dari fresh start karena progression yang dipertahankan. Jangan menghapus warning atau membuka semua tahap untuk membuat laporan hijau.

## Review diff dan integritas QA

- `package.json`: tambahan Nunito/Phosphor untuk desain, perintah QA Playroom/coloring, dan build sebelum flow. Ini bukan lagi patch QA-only: redesign frontend memang diminta pengguna setelah audit.
- `scripts/run-local-product-qa.mjs`: filter `ERR_CONNECTION_RESET` dihapus; semua console error tetap menjadi blocker. Masa observasi dapat diperpanjang, minimum 60ms. Full crawl tidak dipangkas. Satu worker dan jeda 250ms dipakai untuk laptop.
- Flow assertion mengikuti jalur nyata 3 klik tanpa katalog duplikat.
- Crawl activity kini gagal bila redirect atau activity frame hilang. Ini menutup false-positive coverage, bukan melonggarkan QA.
- Runtime measurement test mengganti pencocokan literal teknis `Audio fallback:` dengan kontrak status aksesibel dan teks fallback muted/unavailable/error. Tidak menghilangkan fallback.
- AudioManager source-contract sebelumnya mencari fungsi lama `speakManagedPrompt`. Setelah kontrol narasi dipindahkan, assertion diperbarui untuk memeriksa Activity → GardenActivityFrame → managed audio facade, teks cerita lengkap, dan bahasa yang diminta. Tes queue, privacy, warmup, route-stop, serta larangan speech synthesis langsung tetap berjalan.
- `LearningProgressionGuard` hanya mengganti tujuan redirect saat terkunci menjadi subject terkait, bukan mengubah perhitungan unlock.
- Checkpoint, threshold, emission measurement trace, penilaian jawaban, perhitungan bintang, curriculum, mastery, evidence, dan progression tidak diubah oleh migrasi Garden.
- Audio menolak voice bahasa asing yang tidak cocok; ini bukan rekaman narator Indonesia baru.

## Berkas terkait

- Sistem: `src/app/garden-tokens.css`, `src/app/layout.tsx`, `src/components/learning/GardenActivityFrame.tsx`, CSS module Garden/MobileFoundation/LearningPlatform.
- Renderer: AudioChoiceLearningActivity, ChildLearningPlatform, CreativePracticeActivity, MathTraceWorldActivity, WorldExperience.
- Navigasi/katalog: Playroom, Batch14WorldHome, ChildLearningPathViews, HomePage, TopNavbar, BottomNavbar, navigation.
- Area dewasa: ParentLearningPlatform dan account; profil bersama melalui LearningCommon/CloudProfileScreens.
- Artwork: lima aset `public/artwork/garden-*.webp`.
- Regresi: `scripts/run-local-garden-check.mjs`, suite product/flow/Playroom/coloring serta learning/audio.

Daftar di atas mengelompokkan migrasi, bukan mengklaim seluruh dirty file dibuat pada sesi terakhir. Perubahan lokal sebelumnya tetap dipertahankan.

## Yang belum selesai

0. Coverage 900 layar aktual: pisahkan uji fresh-profile lock/redirect dari uji katalog dengan fixture QA readiness yang valid. Fixture harus berada di konteks browser pengujian, bukan mengubah data/aturan produk atau membuka semua aktivitas pengguna.
1. Redesign mendalam sepuluh runtime kamera, izin/loading/error/pause dan pengujian perangkat fisik.
2. Seluruh state admin editor, auth, form error, serta halaman dewasa yang baru mendapat token bersama. Shared CSS tidak sama dengan acceptance seluruh state.
3. Narasi Indonesia natural: membutuhkan aset atau provider yang dipilih dan uji pendengaran.
4. Seratus route per kategori tidak membuktikan seratus pengalaman/ilustrasi unik. Inventaris kualitas konten dan variasi mekanik masih diperlukan.
5. Review langsung orang tua/anak, zoom/reduced-motion, browser non-Chromium, kamera nyata, dan akun cloud nyata belum tercakup penuh.

## Bukti

Browser skill/plugin tidak tercantum pada sesi pengujian. Percobaan in-app sebelumnya juga gagal dengan `Browser is not available: iab`. Validasi dilanjutkan melalui Playwright Chromium repo sesuai izin QA lokal pengguna. Ini bukan klaim pengujian manual melalui tab produksi yang masih terbuka.

- `design-qa.md`: perbandingan referensi desain 1 dengan hasil browser, riwayat temuan dan status penerimaan visual.
- `.qa/product-report.json` dan `.qa/product-report.md`: full crawl terakhir.
- `.qa-playroom/garden/quick-product-report.json`: quick run tersimpan.
- `.qa-playroom/garden/full-product-strict-report.json`: hasil final 55 lolos / 845 redirect, disalin sebelum run berikutnya dapat menimpa `.qa`.
- `.qa-playroom/garden/report.json`: interaksi dan screenshot Garden.
- `.qa-playroom/report.json`: regresi Playroom.
- `docs/FRONTEND_REDESIGN_SYSTEM_2026-09-12.md`: brief, cakupan seluruh frontend, batas, dan backlog audit.

## Langkah lanjutan yang aman

Bangun fixture kesiapan belajar hanya untuk browser QA yang terisolasi, menggunakan bentuk progress/evidence resmi dan validasi fungsi readiness. Jalankan skenario fresh-profile terpisah agar 8 warning exposure dan penguncian tetap diuji. Periksa juga transisi saat data profil/progress baru terhidrasi; jangan mengubah guard produk untuk memaksa crawl hijau. Setelah fixture teruji, ulangi 900 route dengan assertion identitas layar tetap aktif, baru lanjutkan acceptance seluruh runtime/desain.

Tidak ada commit SHA baru atau push ke GitHub dari sesi ini. HEAD tetap `e0b8ad50ddc5a973669c17986570e263e743143e`; working tree belum bersih karena perubahan lokal yang disengaja dan pekerjaan sebelumnya.
