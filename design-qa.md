# Design QA — Mainlagi Garden (desain 1)

Tanggal: 12–13 September 2026
Status: interaksi Garden perwakilan PASS; acceptance menyeluruh blocked karena coverage aktivitas. Belum release, commit atau deploy.

## Target dan bukti

- Source: C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-2d410408-35ce-473b-9ac2-c2b48c5244ee.png
- Implementasi: C:/Users/Amand/Documents/ChatGPT/mainlagihub/.qa-playroom/garden/letters-1487.png
- Viewport desktop: 1487×1058 CSS px, DPR 1; source dan screenshot sama-sama 1487×1058 pixels. Tidak ada frame browser atau resampling.
- State: aktivitas cari huruf A, sebelum memilih jawaban, tema anak terang.
- Kedua gambar dibuka bersama dalam satu input perbandingan. Screenshot tambahan pada 390×844 untuk responsive; report.json menyimpan seluruh bukti.
- Perbedaan konten yang disengaja: mock memakai I/A/U, katalog aktual A/B/D. Pilihan dan jawaban data tetap dipertahankan; tidak mengubah kurikulum agar menyerupai gambar.
- Riwayat Playroom sebelum pilihan desain 1 disimpan di docs/DESIGN_QA_PLAYROOM_PRE_GARDEN_2026-09-12.md.

## Temuan dan iterasi

1. [P1, diperbaiki] Tombol jawaban mengecil menjadi font 16px dan min-height 44px akibat CSS foundation menimpa komponen. Perbaikan: default font dan min-height memakai specificity rendah. Ukuran diuji dari computed style browser, bukan hanya source.
2. [P2, diperbaiki] Ukuran header/heading dan posisi kartu desktop terlalu kecil/tinggi dibanding mock. Kontrol desktop dibesarkan menjadi 88px, heading singkat 110px, kartu diposisikan sejajar karakter. Screenshot terbaru memperlihatkan tiga token netral dan komposisi dekat source.
3. [P2, diperbaiki] Wordmark masih berupa teks biasa. Kini memakai aset wordmark navy dengan matahari kuning, alpha asli dan ejaan Mainlagi sudah diperiksa.
4. [P2, diperbaiki] Halaman akun tidak memiliki main/h1 dan masih memakai latar gradient serta nav ikon tanpa label. Landmark diperbaiki, latar cream, ikon diberi label, nav desktop dan HP menggunakan sumber destinasi yang sama.
5. [P2, diperbaiki] Ada reset min-height kedua khusus mobile di MobileFoundation.module.css:238. Setelah line-height huruf dinormalisasi, tinggi tombol menjadi 94.89px, di bawah target internal 110px (tetap lebih besar dari 44px). Selector diperbaiki; screenshot dan assertion tinggi >=110px/font >=50px PASS pada build 13 September di desktop dan 390px.
6. [P2, diperbaiki] Pada 360px, label visual Kembali disembunyikan dan ikon aria-hidden, sehingga link kehilangan accessible name. Tes tambahan mereproduksi kegagalan (0 link bernama Kembali). Label aria-label ditambahkan pada link, tanpa mengubah ukuran atau tujuan navigasi. Build final `tr6PiSLvvymWrSsYpLmS3` dan uji ulang 360px PASS; 48 screenshot Garden pada tiga viewport.
7. [P1, coverage belum selesai] Crawl lama menghitung URL yang kemudian diarahkan guard ke subject sebagai activity lolos. Probe `bahasa-terapan-lani-tunas` berakhir di `/child/demo-gian/subject/bahasa`, dengan 0 activity frame. Angka 900 lama bukan bukti 900 layar aktivitas. QA kini mewajibkan pathname tetap sesuai serta tepat satu activity frame. Full run ketat selesai: 900 URL dicoba, 55 layar lolos, 845 redirect; 1 blocker coverage dan 8 warning. Diperlukan fixture readiness QA terisolasi dan skenario fresh-profile terpisah, bukan perubahan progression produk.

## Lima fidelity surfaces

- Typography: Nunito Variable untuk UI; Noto fallback tetap tersedia. Hierarki judul/instruksi/pilihan terbaca. Native HTML mempertahankan shaping hijaiyah. Teks panjang tidak memakai ukuran display 110px. Detail font dan label diperiksa pada screenshot ukuran asli.
- Layout: satu area tugas, back kiri/speaker kanan, tidak ada nav global atau statistik sesi palsu. Karakter tidak menerima input pointer. Posisi desktop diselaraskan dengan token; mobile menempatkan karakter di bawah konten agar tidak menutup canvas.
- Colors: navy, cream, sky blue, grass green; pilihan awal sama warna. Benar/hampir memakai teks serta warna sehingga tidak bergantung pada warna saja.
- Images: background, Gavi, Paca, apple dan wordmark adalah raster tersendiri; alpha transparan, proporsi tidak diregangkan. Tidak memakai keseluruhan mockup sebagai layar interaktif. Bidang SVG mewarnai dan jalur trace adalah geometri permainan yang dipertahankan, bukan pengganti dekorasi raster.
- Copy: jargon teknis di layar aktivitas diganti petunjuk ramah anak. Data pilihan dan penilaian tidak berubah. Tombol Dengar tetap mengungkap kondisi suara tidak tersedia; tidak mengklaim ada rekaman narator baru.

Full-view dipakai untuk komposisi. Focused reading pada header, pilihan huruf dan feedback dilakukan lewat screenshot asli serta computed style/interaksi browser. Bukti desktop trace, coloring, account dan stage turut dibuka; mobile letters/color/account/parent diperiksa tersendiri.

## Interaksi dan batas penerimaan

- Salah/benar pilihan huruf, feedback, lanjut; tidak ada pre-highlight jawaban.
- Matching: selected, batal, mismatch, semua pasangan dan completion.
- Trace 5: input pointer mengikuti checkpoint dan mencapai completion lewat measurement asli.
- Coloring/drawing: suite Playroom menguji fill keyboard, palet, undo/reset, completion, stroke; 100 scene coloring diparse Chromium.
- Semua 15 suite learning PASS; test AudioManager PASS.
- Full run sebelum perbaikan coverage: melaporkan 900 activity routes, 1059 total routes, 0 blocker, 8 warning exposure; klaim coverage activity tidak valid karena redirect tidak dideteksi.
- Supplemental desktop/390px/360px PASS, 48 screenshot. Full QA ketat FAIL (55/900 layar, 845 redirect, 1 blocker, 8 warning, 82 screenshot). Bahkan crawl yang lolos tetap bukan bukti menyelesaikan semua aktivitas.
- Gate ini menerima sistem Garden dan layar yang memiliki bukti. Belum berarti seluruh state admin, auth, kamera fisik atau semua konten sudah selesai diaudit/desain.

## Follow-up P3 / keputusan produk terpisah

- Decorative butterfly/sign dari mock belum ditambahkan; bukan kontrol atau konten pembelajaran.
- Variasi pose karakter, ilustrasi manusia lama, asset unik untuk seluruh aktivitas, serta seluruh layar runtime gerak masih backlog tersendiri.
- Natural Indonesian voice-over memerlukan rekaman/provider dan uji pendengaran.
- 8 warning exposure tetap ada; tidak mengubah progression untuk menghilangkannya.

final result: blocked

Pembaruan galeri/scaffold 13 September: subject kini langsung menampilkan 100 kartu, tanpa tahap perantara; kembali dari activity menuju subject. Studio kreatif memberi prioritas pada kanvas. 25 latihan menggambar dasar memiliki panduan nyata dan thumbnail yang sama dengan kanvas. Build/lint dan Playroom 3 viewport PASS (15 screenshot; 25 guide routes). Target 100–1000 tantangan non-berulang per materi **belum selesai**: 100 coloring masih 61 komposisi, 75 drawing belum berpanduan geometris, variasi interaksi materi lain masih terbatas. Rincian: docs/ACTIVITY_GALLERY_AND_VARIETY_2026-09-13.md.

Blocker bukan lagi ukuran/label kontrol di sampel Garden; blocker adalah belum terpenuhinya validasi seluruh activity yang diminta. Rincian: docs/GARDEN_REDESIGN_VALIDATION_2026-09-13.md.
