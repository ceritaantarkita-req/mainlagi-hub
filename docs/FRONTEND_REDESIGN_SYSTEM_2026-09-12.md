# Mainlagi — redesign seluruh frontend

Status update 20 September: Garden sudah menjadi baseline produk yang ter-merge/deploy, tetapi user acceptance terbaru membuka kembali pekerjaan UX pada homepage, katalog, activity completion, matching, audio, parent/settings, character system dan visual per subject. Dokumen ini tetap menjadi fondasi/history redesign; rencana eksekusi terbaru ada di [PRODUCT_UX_NEXT_WORK_2026-09-20.md](PRODUCT_UX_NEXT_WORK_2026-09-20.md). Bukti validasi Garden 13 September tetap historis dan tidak boleh dipakai sebagai klaim bahwa UX 20 September sudah diterima final.

## User acceptance update — 20 September 2026

Temuan produk terbaru menegaskan bahwa green CI tidak cukup untuk acceptance visual/usability. Prioritas baru mencakup canonicalisasi komponen aktif, warning cleanup, lima karakter utama (Naya/Gian/Zia/Paca/Gavi), hero dan grid subject, QA unlock mode, katalog activity, completion bersama, matching shuffle, narration latency/quality, parent/profile/settings responsive, serta subject themes. Progression/mastery/evidence tetap di luar redesign kecuali ada kebutuhan terpisah yang disetujui.

## Alternatif visual yang sudah ditampilkan

Urutan berikut mengikuti urutan gambar ditampilkan kepada pengguna. Pengguna memilih **opsi 1** (taman ilustratif).

| Opsi | File gambar |
| --- | --- |
| 1 | `C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-2d410408-35ce-473b-9ac2-c2b48c5244ee.png` |
| 2 | `C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-bd382505-7792-460f-ad69-705302c36810.png` |
| 3 | `C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-cf8bd3d0-5c42-44a2-b3a8-42218189cdef.png` |

Ketiganya menunjukkan tugas yang sama untuk menilai perbedaan arah visual.
Ini mockup gambar, belum preview interaktif atau bukti implementasi.
Saat implementasi, warna/aksen pilihan tidak boleh menandai jawaban benar
sebelum anak memilih. Opsi 2 memiliki satu blok biru yang lebih menonjol dan
opsi 3 mempunyai aksen dekat jawaban A; keduanya perlu dinetralkan bila dipilih.
Karakter, background, logo, dan kontrol di gambar juga perlu diekstrak menjadi
aset serta elemen interaktif; gambar utuh tidak boleh dijadikan UI statis.

## Implementasi Garden — 12 September 2026

- `GardenActivityFrame` menyatukan kembali, logo, dengar, area tugas dan karakter. Semua renderer route aktivitas menggunakan bingkai ini: pilihan, audio, matching, trace umum, trace 5 terukur, cerita, coloring, drawing, serta entry aktivitas gerak.
- Aset tersendiri: taman, Gavi, Paca, apel, dan wordmark. Semuanya lokal; tombol/teks tetap elemen interaktif, bukan screenshot UI.
- Nunito, Phosphor, token navy/cream/green, kontrol, kartu subject/stage, beranda, profil, koleksi, navigasi orang tua dan akun diselaraskan.
- Header katalog disembunyikan ketika bermain; tidak ada progress sesi hardcoded `1 dari 2` / `2 dari 2` pada dua renderer matematika khusus.
- CSS foundation sebelumnya menimpa font/min-height komponen: tombol jawaban menjadi 16px/44px. Default typography dan ukuran kini berspesifisitas rendah, sehingga ukuran komponen berlaku. Uji browser khusus menjaga tinggi dan font pilihan huruf.
- Halaman akun diberi landmark `main` dan judul `h1`; navigasi publik desktop/HP memakai destinasi sama dengan label terlihat. `Belajar` yang menduplikasi entry beranda dihapus dari nav publik; profil tetap dapat dibuka lewat beranda/akun.
- Pesan anak tidak lagi menampilkan skor lintasan/prototype jargon di renderer aktif yang diperbarui. Perhitungan dan event trace tidak diubah.
- Satu source-test audio semula mengharuskan literal `Audio fallback:`. Diganti menjadi kontrak render `role=status` serta teks untuk muted/unavailable/error; fallback tidak dihapus dan QA console tidak dilonggarkan.

### Batas status implementasi

Ini bukan klaim bahwa seluruh backlog audit telah selesai. Sistem visual dan keluarga aktivitas inti sudah dimigrasikan. Sepuluh runtime kamera, editor admin, seluruh auth/error state, dan ilustrasi karakter manusia lama belum mendapat redesign mendalam/acceptance visual per state. Shared tokens berlaku pada permukaan tersebut, tetapi itu tidak setara dengan redesign mekanik atau visual menyeluruh.

Narasi masih bergantung pada voice berbahasa sesuai yang tersedia di perangkat; belum ada rekaman narator Indonesia baru. Artwork region mewarnai tetap SVG interaktif yang sudah ada—bukan gambar dekorasi—agar fill, keyboard, undo, dan completion tetap bekerja. Tidak menambah/mengubah 100 activity per subject atau aturan unlock. Perubahan pembukaan semua activity perlu keputusan progression terpisah.

### Bukti validasi

- `npm run build`: PASS; build final `tr6PiSLvvymWrSsYpLmS3` pada 13 September.
- `npm run test:learning`: seluruh 15 suite PASS, termasuk mastery, anti-farming, progression, evidence measurement, adaptive, ownership, outbox, dan catalog.
- `test:audio-manager`, `test:ui:mobile-foundation`: PASS.
- `run-local-product-flow-check.mjs`: PASS, kedalaman 3 klik.
- Quick product QA: PASS, 159 routes, 0 blocker, 8 warning exposure; bukti `.qa-playroom/garden/quick-product-report.json`.
- Supplemental Garden QA: PASS, 48 screenshots (1487×1058, 390×844, 360×800), huruf netral/salah/benar, matching, trace terukur, navigasi selesai, nama aksesibel Kembali, 12 keluarga halaman tambahan, no horizontal overflow/broken images/console errors. Bukti `.qa-playroom/garden/report.json`.
- Full crawl lama melaporkan 900 URL PASS, tetapi itu tidak membuktikan 900 layar: guard dapat mengarahkan ke subject dan tetap dihitung sukses. Assertion pathname/frame sudah diperketat; hasil final ada pada laporan 13 September. Progression produk tidak dibypass.

## Brief pengguna

Orang tua dan anak merasa antarmuka membingungkan, tidak menarik, dan berbeda-beda antarhalaman. Targetnya pengalaman joyful/playful dengan kejernihan interaksi seperti Khan Academy Kids dan Lingokids. Cakupan mencakup seluruh frontend hingga setiap keluarga aktivitas, bukan hanya beranda.

Pekerjaan lokal pada branch yang sama. Pertahankan perubahan lokal yang sudah ada. Perubahan aturan mastery, evidence, progression, kepemilikan akun, atau kurikulum tidak termasuk redesign presentasi ini. Tidak melakukan deployment atau merge PR #87.

## Penyebab yang terverifikasi dari source

1. `src/app/child/[childId]/activity/[activity]/page.tsx` membagi aktivitas ke renderer audio, kreatif, angka-trace khusus, dan WorldExperience. Masing-masing memiliki struktur kontrol berbeda.
2. `WorldActivityScreen` memberi perlakuan khusus pada `math-count-3`; aktivitas lain kembali ke `ChildLearningPlatform.ActivityScreen`. Ini membuat perbedaan kualitas terlihat bahkan dalam subject yang sama.
3. `LearningPlatform.module.css`, `WorldExperience.module.css`, `MathTraceWorldActivity.module.css`, `CreativeStudio.module.css`, dan `Playroom.module.css` memegang keputusan visual sendiri-sendiri.
4. `ChildLearningPlatform` masih menampilkan jargon seperti `Prototype mencatat completion`, `stage`, dan angka teknis. Audio renderer menampilkan `Listening` serta penjelasan teknis `Audio fallback` kepada anak.
5. Public/account memakai TopNavbar dan BottomNavbar; child memakai Playroom; parent memakai shell sendiri. Perbedaan audience memang perlu, tetapi warna, tipografi, ikon, kontrol, dan istilah harus tetap satu keluarga.
6. Bentuk karakter masih tercampur antara raster, SVG buatan sendiri, CSS shapes, dan emoji. Dibutuhkan set ilustrasi dan ekspresi karakter yang konsisten.

## Kontrak UX yang berlaku di semua aktivitas

- Satu instruksi utama yang singkat, satu area kerja yang dominan.
- Kembali di kiri atas, Dengar di kanan atas; letak dan bentuk kontrol konsisten.
- Navigasi katalog tidak memenuhi layar bermain.
- Target sentuh utama besar; tidak bergantung pada kemampuan membaca kalimat panjang.
- Prompt panjang, teks Arab, pilihan kata, dan kalimat memiliki layout sesuai kebutuhan konten, tanpa font size tetap yang menyebabkan clipping.
- Feedback benar, coba lagi, loading, audio tidak tersedia, serta selesai memakai komponen bersama.
- Tidak memberi petunjuk jawaban melalui warna/ilustrasi yang hanya muncul pada pilihan benar.
- Jumlah langkah hanya ditampilkan bila benar-benar berasal dari data sesi; tidak ada progress palsu seperti angka hardcoded.
- Tombol selesai, ulangi, keluar, dan lanjut hanya muncul dalam state yang sesuai dengan mekanik.
- Animasi singkat membantu memahami aksi; reduced-motion tetap didukung dan animasi tidak menghalangi input.
- Bahasa anak sederhana; detail teknis dan laporan belajar berada di area orang tua.

## Matriks cakupan implementasi

| Permukaan | Perubahan wajib | Bukti penerimaan |
| --- | --- | --- |
| Beranda publik | Identitas baru, pilihan main jelas, parent entry konsisten | Jalur first visit dan kembali ke profil tersimpan |
| Pilih/buat profil | Visual karakter konsisten, langkah singkat, subject intent diteruskan | Profil baru, profil lama, switching, loading/error |
| Beranda anak | Pilihan permainan berupa thumbnail yang bisa dikenali anak, satu direktori | Anak dapat memilih kategori tanpa menu duplikat |
| Subject dan stage | Hierarki kegiatan yang jelas, preview visual, informasi unlock yang ramah | Semua 9 subject, ready/locked/completed, empty age state |
| Tap choice dan audio | Area pilihan besar, prompt singkat, replay dan feedback seragam | Huruf, angka, kata panjang, English, hijaiyah |
| Matching | Kartu pasangan dengan selected/matched state jelas | Pilih, batal, mismatch, semua cocok |
| Tracing | Panduan terlihat, titik mulai/arah sesuai data yang tersedia, kontrol konsisten | Touch/pointer, reset, selesai, angka khusus dan renderer umum |
| Mewarnai | Artwork line-art yang layak, bidang isi nyata, palet dan undo yang mudah ditemukan | Seluruh 100 route, isi bidang, keyboard, undo/reset, selesai |
| Menggambar | Area gambar dominan, alat mudah disentuh, panduan sesuai instruksi | Seluruh 100 route, stroke, palette, undo/reset, selesai |
| Cerita | Halaman membaca yang nyaman, narasi, teks singkat/bertahap sesuai konten | Teks lengkap tetap tersedia dan completion tetap benar |
| Main gerak | Pilihan game dan onboarding konsisten, kamera dan feedback jelas | Semua game, izin, loading, kegagalan, pause/keluar |
| Rewards/hasil | Perayaan ramah, lanjut dan ulang jelas | Completion baru dan aktivitas yang sudah selesai |
| Area orang tua | Identitas sama dengan kepadatan yang sesuai orang dewasa | Overview, anak, progress, laporan, sertifikat, settings, privacy, plan |
| Account/auth | Form, validasi, loading/error dan navigasi konsisten | Login/signup/recovery/profile/preferences/security/delete UI |
| Discover/articles/affiliate | Typography dan navigasi sama, gambar gagal tetap terbaca | Daftar/detail, empty/error, affiliate fallback |
| Legal/about/FAQ | Sistem tipografi, konten dan navigasi konsisten | Semua halaman informasi |
| Admin | Komponen form/table/status satu keluarga dengan area dewasa | Dashboard, affiliate, article list/editor |
| Global state | Not-found, loading, error, focus, disabled, dialog konsisten | Keyboard, mobile landscape, zoom, reduced motion |

## Sistem visual dan urutan migrasi

1. Pilih satu arah visual dari contoh aktivitas yang sama. Ketiga konsep adalah alternatif satu sistem, bukan tiga style yang akan dicampur.
2. Tetapkan token warna, type scale, spacing, radius, shadow, focus, motion, dan ukuran touch target bersama.
3. Buat aset karakter beserta ekspresi membantu/berhasil/mencoba lagi, serta thumbnail yang relevan. Ilustrasi tidak boleh menyamarkan kekurangan konten aktivitas.
4. Bangun kerangka aktivitas, prompt/audio, choice, feedback, completion, dan kontrol studio bersama. Migrate renderer umum maupun special-case agar seluruh route tercakup.
5. Migrate subject/stage dan katalog; beranda mengikuti bahasa visual aktivitas yang sudah matang.
6. Selaraskan onboarding, profil, parent/account, gerak, discover, admin, serta halaman informasi.
7. Audit rute aktif dan penggunaan komponen lama; file yang tetap ada tetapi tidak dipakai dibedakan dari UI yang masih aktif.

## Verifikasi sebelum dinyatakan selesai

- Matriks renderer × state × viewport, termasuk pilihan kata panjang dan teks Arab.
- Desktop, tablet, mobile portrait/landscape; overflow dan batas kontrol, bukan hanya jumlah screenshot.
- Interaksi inti tiap mekanik, nav kembali/lanjut, profil, dan state gagal.
- Full crawl 900 activity route dan coverage semua keluarga halaman.
- Tidak menghapus 8 warning exposure untuk membuat QA hijau.
- Membandingkan screenshot build dengan arah terpilih; dokumentasi lama diperbarui sebagai riwayat, bukan bukti acceptance baru.
- Usability review orang tua/anak setelah preview. Automated PASS tidak membuktikan anak sudah bisa menggunakan produk tanpa bingung.

## Batas yang perlu keputusan terpisah

- Suara Indonesia natural membutuhkan aset/provider yang telah dipilih serta uji pendengaran; memblokir voice asing saja belum menyelesaikan kualitas narasi.
- 100 route per subject tidak membuktikan 100 ilustrasi atau pengalaman pedagogis unik. Perombakan konten perlu inventaris dan review tersendiri.
- Perubahan data affiliate/cloud, GitHub governance, deployment, dan pengujian kamera di perangkat fisik tidak disamakan dengan perubahan CSS/React lokal.

## Referensi

- https://www.khanacademy.org/kids
- https://khankids.zendesk.com/hc/en-us/articles/360029139531-Learn-on-the-go-with-offline-content-in-Khan-Academy-Kids
- https://lingokids.com/playlearning
- https://help.lingokids.com/hc/en-us/articles/23532720590610-Playlearning-Sections

Reference dipakai untuk prinsip visual dan interaksi; karakter, artwork, logo, dan konten merek tersebut tidak disalin ke Mainlagi.
