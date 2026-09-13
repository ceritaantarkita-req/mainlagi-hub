# Mainlagi — perbaikan lokal

Status 12 September 2026: perbaikan alur inti selesai divalidasi lokal.
Full product QA PASS. Dokumen ini bukan klaim seluruh audit telah selesai.

## Batas perubahan

- Lokal pada branch agent/local-product-qa-20260911; tanpa commit, push, deploy, atau merge PR.
- Tidak mengubah mastery, evidence, progression, aturan unlock, atau kepemilikan akun.
- Catalog 900 route tetap dipertahankan; jumlah route bukan bukti kualitas konten.
- Temuan GitHub governance, konten ahli Iqro, QA perangkat fisik, dan data produksi perlu validasi/otorisasi tersendiri.

## Paket implementasi

1. Satu shell dan bahasa navigasi, homepage anak sederhana, katalog sembilan area dengan jumlah aktual.
2. Pilihan profil diingat; intent subject diteruskan; profil tersimpan tetap divalidasi terhadap koleksi akun saat ini.
3. Kanvas kreatif nyata, warna, undo/reset, instruksi yang tidak overflow; completion-only tetap sama.
4. Audio setelah gesture awal dengan replay/mute; fallback teks tidak dibuang.
5. Affiliate memiliki judul dan fallback gambar; tidak membuat gambar produk/tautan palsu.
6. QA lint generated artifacts, interaksi dan viewport lokal; review diff dan regressions.

## Arah visual

Playroom editorial: cream #fffaf0, forest teal #164b43, coral #e46c49,
sage, tipografi Noto Sans; satu ilustrasi utama, navigasi berlabel, tanpa
gradient dekoratif, emoji besar, kartu bersarang, atau jargon belajar internal.

## Implementasi yang sudah masuk lokal

- Beranda publik dan beranda anak memakai Playroom; di jalur anak, navigasi
  konsisten: Beranda dan Main gerak. Profil, bintang, mute, dan pintu
  area orang tua berada di menu Profil. Commerce/leaderboard tidak lagi
  dicampur di beranda belajar.
- Halaman `Jelajahi` yang mengulang isi beranda dihapus dari navigasi aktif.
  Route legacy `/child/:id/learn` mengarah kembali ke pilihan subject di
  beranda. Halaman subject tidak lagi menampilkan switcher sembilan subject.
- Profil aktif diingat sebagai preferensi navigasi, bukan bukti ownership.
  Sebelum redirect, id harus ada dalam koleksi profil yang dimuat untuk
  pengguna saat ini. Pilihan subject diteruskan melalui onboarding.
- Rekomendasi beranda menggunakan ranking adaptive yang sudah ada, bukan
  mengambil sembarang aktivitas matematika yang belum selesai.
- Katalog menampilkan jumlah aktual sembilan area. Stage terkunci tetap
  terkunci. Penjelasan anak tidak lagi memakai istilah evidence/mastery.
- Semua 100 route mewarnai memiliki bentuk spatial tertutup yang dapat
  diwarnai lewat sentuh atau keyboard. Beberapa aktivitas memakai motif yang
  sama dengan tujuan eksplorasi warna berbeda; ini bukan 100 ilustrasi unik.
- Mewarnai: delapan warna bernama, isi bidang, undo, reset yang bisa di-undo,
  dan completion-only. Menggambar: warna pena, stroke, undo, reset; instruksi
  kalimat tidak lagi diperbesar menjadi teks 150px di kanvas.
- Narration mencoba berjalan saat masuk aktivitas sesudah gesture browser
  pertama. Voice wajib cocok dengan locale prompt: perangkat yang hanya punya
  voice English tidak boleh membacakan teks Indonesia. Dalam kondisi itu UI
  menampilkan petunjuk teks, bukan memakai pelafalan bahasa lain. Mute/replay
  tetap ada. Voice Indonesia natural yang stabil masih memerlukan aset audio
  berlisensi dan uji perangkat; fallback ini bukan pengganti voice final.
- Affiliate tetap menampilkan judul dan penjelasan jika gambar gagal.
  Tidak mengunduh foto Shopee, membuat produk palsu, atau mengganti data cloud.
- Wrapper aktivitas tidak lagi berupa overlay fixed satu layar di atas shell;
  konten tetap dalam document flow. Subject navigation dapat membungkus
  ke baris berikutnya; teks badge dan pilihan panjang tidak dipaksa overflow.

## Tooling dan dependency

- ESLint mengabaikan output compiler .learning-test-dist, bukan source.
- qa:local:flow sekarang membangun aplikasi terlebih dahulu.
- Pengecualian luas ERR_CONNECTION_RESET dihapus sepenuhnya: setiap console
  error tetap gagal, termasuk connection reset.
- Tes baru: qa:local:playroom dan test:ui:coloring-art.
- js-yaml diperbarui dari 4.3.1 ke 4.3.2. npm melaporkan 0 vulnerabilities.
  Dasar patch: [advisory upstream](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh).
- npm juga menyelaraskan lockfile dengan package.json: entri stale
  @types/sanitize-html dan dependency dev orphan-nya dipangkas.
  sanitize-html runtime tidak diganti/dihapus.
- README, CURRENT_STATE, dan KNOWN_LIMITATIONS diberi koreksi/batas waktu
  agar snapshot deployment lama tidak disamakan dengan perubahan lokal.

## Catatan bug yang ditemukan saat verifikasi

Full run pertama: FAIL, 899/900 activity route, 1 blocker, 8 warning.
Route color-contrast-space memiliki perintah SVG Q yang kurang pasangan angka.
Tes panjang path saja tidak menangkapnya karena Chromium merender prefix valid.

Regression loop:

1. node scripts/run-coloring-art-tests.mjs gagal dalam sekitar 5 detik
   dengan console parser error yang sama.
2. Perintah garis L ditambahkan pada path cincin planet.
3. Tes parser lulus untuk 100/100 ilustrasi.
4. Tes kini gagal atas setiap console parser error, bukan hanya bentuk kosong.
5. Seluruh full QA diulang, bukan hanya route yang gagal.

Pendekatan diagnosing-bugs dipakai pada error ini. Cabang hipotesis luas
tidak diperlukan karena pesan parser menunjuk kesalahan sintaks deterministik.

Run kedua sesudah koreksi SVG: 899/900 route, satu kegagalan
ERR_NO_BUFFER_SPACE pada science-eco-bee-flower; SVG tidak gagal lagi.
Snapshot resource sesudah kegagalan: sekitar 2.4 GiB RAM bebas dari 15.4 GiB
dan 2.019 koneksi TCP TimeWait. Snapshot ini mendukung investigasi resource,
bukan bukti pasti sumber alokasi buffer yang gagal.

Untuk run berikutnya, hanya server dev port 3010 milik task ini dihentikan.
Concurrency menjadi 1; jendela observasi activity ditambah dari 60 menjadi
250 ms lewat MAINLAGI_PRODUCT_QA_ACTIVITY_WAIT_MS. Tidak ada error yang
diabaikan atau assertion yang dikurangi. Semua 900 route diulang pada build
yang sama. Laporan kedua kegagalan disimpan di .qa-playroom.

## Ledger visual dan deviasi yang disengaja

Skill frontend-app-builder digunakan untuk menetapkan satu konsep; imagegen
built-in membuat konsep dan aset pendamping. Tidak ada screenshot UI yang
dijadikan antarmuka statis. Seluruh kontrol tetap HTML/React.

Konsep asal (lokal, tidak di-deploy):

- C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-dd40e886-0136-45d7-805c-a5142ae99840.png
- C:/Users/Amand/.codex/generated_images/01a09023-21ac-7731-b550-7c46ac70d588/exec-2bbdfa29-5cf3-4597-8c1a-3790d744e611.png

Aset yang digunakan: public/artwork/playroom-companions.png.
Prompt aset: ekstrak/reka ulang kucing oranye dan robot teal yang bermain
balok 1/2/3 dari konsep, gaya paper-cut, latar transparan, tanpa UI/text lain.

| Aspek | Implementasi dan alasan |
|---|---|
| Susunan beranda | Sapaan, satu strip lanjut bermain, direktori 3×3; mobile 2 kolom |
| Palet | Cream #fffaf0, forest #164b43, sage #dbe6c8; tidak memakai gradient dekoratif |
| Tipografi | Noto Sans dari repo; hierarki heading/label/control diperiksa |
| CTA | Coral digelapkan menjadi #bc482a agar teks putih lebih terbaca |
| Copy | Judul rekomendasi berasal dari engine nyata, bukan contoh statis Kenali angka 1 |
| Ikon | Vector UI book/globe/pencil/palette/sprout; bukan raster dekorasi kecil dari mockup |
| Profil | Icon akun netral; tidak menciptakan foto/avatar personal yang tidak dimiliki user |
| Studio | Bidang SVG native agar setiap bidang dapat difokuskan/diwarnai; art berbeda dari raster mockup |
| Dekorasi studio | Furnitur/tempelan dekoratif dari mockup dihilangkan agar area gambar dan kontrol lapang |
| Mobile | 390×844, tidak ada horizontal overflow, palet/control boleh membungkus tanpa dipotong |

Ini verifikasi arah visual dan interaksi, bukan klaim pixel-perfect terhadap
mockup atau pengganti review kualitas seni semua ilustrasi.

## Hasil validasi final — 12 September 2026

Full run ketiga selesai **PASS** pada build yang sama, satu worker dan
observasi 250 ms. Seluruh error console tetap menjadi kegagalan; tidak ada
pengecualian untuk ERR_CONNECTION_RESET atau ERR_NO_BUFFER_SPACE.

| Pemeriksaan | Hasil |
|---|---|
| qa:local:flow | PASS; beranda → bahasa → stage → activity, 3 klik |
| qa:local:product:quick | PASS; 0 blocker, 8 warning (run sebelum full) |
| Full product QA | PASS; 900/900 activity routes, 1.059 route total |
| Full blocker / warning / screenshot | 0 / 8 / 82 |
| Primary learning flow | PASS; tujuan bahasa-cari-a |
| Katalog | 9 subject, masing-masing 100 activity |
| Playroom desktop/mobile | PASS; profil, subject intent, warna, keyboard, undo/reset, completion, drawing |
| Parser SVG | PASS; 100/100 ilustrasi, termasuk regression color-contrast-space |
| Learning regression | PASS; 15 kelompok test:learning |
| Audio manager | PASS |
| Build / typecheck / lint / diff whitespace | PASS |
| Bundle budget (test:batch16:build) | PASS; JS terbesar 0,37 MiB, total 2,03 MiB, root 0,42 MiB |
| Asset validation | PASS; tidak berarti gambar affiliate cloud telah diperbaiki |

Perintah full terakhir memakai `node scripts/run-local-product-qa.mjs`
sesudah build sukses, dengan MAINLAGI_PRODUCT_QA_ACTIVITY_CONCURRENCY=1 dan
MAINLAGI_PRODUCT_QA_ACTIVITY_WAIT_MS=250. Build tidak diubah di antara rerun.
Tidak menjalankan dua crawl bersamaan pada run terakhir.

Delapan warning semuanya `ux.low_fresh_start_activity_exposure`: Bahasa
Indonesia 5 link, English 6, matematika 4, Iqro 4, huruf/menulis 3, logika 3,
sains 3, mewarnai 2. Artinya profil baru belum bisa mengakses seluruh 100
activity lewat stage terbuka. Aturan unlock tidak diubah demi meloloskan QA.

Bukti lokal (direktori ignored, bukan aset deployment):

- `.qa/product-report.json` dan `.qa/product-report.md`: full run final.
- `.qa/screenshots/`: 82 screenshot route.
- `.qa-playroom/report.json`: tes interaksi Playroom dan parser ilustrasi.
- `.qa-playroom/home-1440.png`, `home-390.png`, `color-1440.png`, `color-390.png`:
  bukti desktop 1440×1000 dan mobile 390×844.
- Rerun final Playroom juga PASS pada ukuran konsep asli 1505×1045;
  `home-1505.png` dan `color-1505.png`. Total 6 screenshot Playroom.
- `.qa-playroom/full-before-svg-fix.json` serta `full-resource-failure.json`:
  hasil gagal dipertahankan untuk jejak diagnosis.

Browser in-app tersedia dan dipakai untuk review interaksi. Playwright repo
dipakai untuk crawl/regression yang memang diminta user, bukan pengganti
diam-diam atas kegagalan browser. Saat preview dihidupkan ulang, tab lama
tertahan di halaman connection-refused dari server yang sebelumnya dimatikan;
tab baru berhasil memuat build lokal. Alur beranda → mewarnai → Warnai Gavi →
pilih kuning → warnai badan terverifikasi, kontrol undo/selesai aktif, console
error/warn kosong. Tidak ada setup profil ulang untuk profil demo tersimpan.

Screenshot full-page in-app pada viewport override menunjukkan artifact
penggabungan capture (potongan terduplikasi), sehingga tidak dipakai sebagai
bukti fidelity. Capture Chromium Playwright 1505×1045 bersih, sembilan subject
tanpa duplikasi, dan sudah dibandingkan dengan konsep asal. Heading dan aset
hero lebih kecil daripada konsep, margin utama lebih lapang, logo tidak memakai
ornamen kuning; ini masih deviasi visual, bukan klaim salinan pixel-perfect.

Preview: http://127.0.0.1:3010/child/demo-gian/home (hanya laptop ini).
Server `next start` memberi warning konfigurasi `output: standalone`; ini
preview lokal yang berhasil diakses, bukan validasi packaging deployment.

Validasi browser terbaru juga membuktikan halaman Bahasa tidak lagi memuat
subject switcher, ringkasan memisahkan jumlah siap/selesai/100 total, route
`/learn` redirect ke `home#choose-subject`, dan audio Indonesia pada mesin
English-only menampilkan fallback teks. Console error/warn kosong. Pada mobile
390×844, tidak ada link/button di luar viewport dan document tidak overflow.

Design QA terbaru tersedia di `design-qa.md` dengan hasil `passed`.

Review React menggunakan skill react-best-practices: preferensi localStorage
berversi, minimal (id saja), try/catch saat storage tidak tersedia; listener
audio memiliki cleanup pada perpindahan route. Tidak menambah provider,
library state, atau mengganti mekanisme authorization.

Workspace: `C:/Users/Amand/Documents/ChatGPT/mainlagihub`.
Branch: `agent/local-product-qa-20260911`.
Origin: `https://github.com/ceritaantarkita-req/mainlagi-hub.git`.
HEAD tetap `e0b8ad50ddc5a973669c17986570e263e743143e`.
Working tree berisi perubahan lokal, **belum commit/push/deploy**.
PR #87 tidak disentuh. AGENTS.md dan CLAUDE.md dibuat otomatis oleh Next dev;
audit awal pengguna tetap dipertahankan.

## Batas yang belum selesai

Perbaikan inti ini **bukan penutupan seluruh 25 temuan audit**.

- F-01: QA webcam/perangkat fisik dan review pengajar Iqro belum dilakukan.
- F-02/F-08/F-10/F-11: governance/ruleset/workflow/PR GitHub tidak diubah
  karena pekerjaan ini lokal; PR #87 tidak di-merge.
- F-12/F-16: URL gambar/konfigurasi cloud perlu dibetulkan dengan aset sah.
  Fallback UI mencegah kartu kosong, tetapi bukan perbaikan data produksi.
- F-19: koleksi profil local/cloud dan legacy player belum dimigrasikan
  menjadi satu model; live OAuth/RLS/cloud write belum diuji.
- F-20: 900 route tetap bukan bukti 900 pengalaman pedagogis berbeda.
  Variasi mekanik/kualitas instruksi butuh kurasi, bukan menambah ID semata.
- F-15/F-22/F-24: seluruh surface legacy motion-game, parent dashboard, dan
  panduan gambar objek belum selesai dirombak satu per satu.
- 8 warning exposure sengaja tetap dipertahankan. Tidak ada perubahan aturan
  unlock untuk mengubahnya menjadi hijau.
- Goresan/warna karya pada sesi studio belum menjadi galeri karya tersimpan.
  Yang disimpan lewat engine adalah completion, bukan file hasil gambar.
