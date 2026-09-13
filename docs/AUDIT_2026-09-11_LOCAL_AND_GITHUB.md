# Audit Lokal dan GitHub — Mainlagi Hub

Tanggal audit: 11 September 2026
Workspace: `C:\Users\Amand\Documents\ChatGPT\mainlagihub`
GitHub: `https://github.com/ceritaantarkita-req/mainlagi-hub`
Branch yang diaudit: `agent/local-product-qa-20260911`
HEAD lokal/remote branch saat audit: `e0b8ad50ddc5a973669c17986570e263e743143e`

## Ringkasan eksekutif

Tracked files lokal sinkron persis dengan remote branch `origin/agent/local-product-qa-20260911`: ahead/behind `0/0` dan working tree bersih sebelum dokumen audit ini dibuat. Namun workspace **tidak sama dengan default branch GitHub `main`**. Branch audit berada dua commit di depan `main` (`9de0b8d`, `e0b8ad5`) dan masih berada dalam draft PR #87.

Kondisi engineering inti cukup kuat: seluruh check GitHub pada exact HEAD lulus, production dependency audit bersih, secret-history scan lulus, quick/full product QA lulus, dan full QA memeriksa 900/900 activity route. Tidak ditemukan bukti secret committed atau kerusakan mastery/evidence/progression.

Masalah terpenting yang ditemukan:

1. final product acceptance masih terbuka karena physical-device evidence belum ada dan secret-history scan belum diwajibkan ruleset;
2. `npm run check` tidak reproducible setelah local product QA karena `.learning-test-dist/` tidak di-ignore ESLint;
3. dependency tree development mengandung satu advisory High pada `js-yaml@4.3.1`;
4. dokumentasi utama saling bertentangan dan sebagian sudah stale;
5. governance `main` mengizinkan PR tanpa approval dan tidak memiliki CODEOWNERS;
6. delapan warning UX fresh-start exposure tetap nyata dan belum ditindaklanjuti;
7. audit production menemukan defect produk yang tidak tertangkap blocker QA: pilihan subject hilang saat masuk mode anak, aktivitas Mewarnai/Menggambar belum berupa pengalaman visual yang valid, audio selalu menunggu klik, dan seluruh sampel gambar affiliate yang diuji 404;
8. angka 900 route benar secara inventory, tetapi belum setara dengan 900 pengalaman belajar yang kaya atau berbeda secara bermakna.

Tidak ada finding P0/Critical. Audit ini tidak mengubah production code, UI, curriculum, mastery, evidence, progression, database, atau GitHub state.

## Ruang lingkup dan metode

Audit meliputi:

- inventory `C:\Users\Amand\Documents\ChatGPT` dan status Git lokal;
- fetch branch aktif dan `origin/main`, perbandingan SHA/ahead-behind;
- metadata repository, branch ruleset, PR, issue, workflow, dan status checks via GitHub CLI/API;
- `npm audit` untuk production serta seluruh dependency tree;
- repository-provided structure, asset, source, security, device-QA, typecheck, lint, engine, simulation, build, dan product-QA gates;
- review konfigurasi CI, ESLint, package scripts, generated artifacts, dokumentasi canonical, dan known limitations;
- pencarian marker unfinished, credential-boundary patterns, raw HTML sinks, suppressions, dan local-only artifacts.
- audit browser read-only terhadap production `https://mainlagihub.my.id/` untuk home, pemilihan profil, child home, learning library, subject/stage, audio, Mewarnai, Menggambar, affiliate, account, dan parent gate;
- korelasi defect visual production dengan komponen/source data lokal;
- pemeriksaan HTTP sampel asset affiliate production;
- pembandingan prinsip alur dengan dokumentasi resmi Khan Academy Kids dan Lingokids, bukan penyalinan visual satu-ke-satu.

Yang tidak dapat dibuktikan hanya dari laptop/GitHub automation: perilaku kamera/audio/touch pada hardware fisik, live Supabase configuration saat ini, serta kualitas pedagogis/religious review Iqro.

Audit UI/UX ini bukan moderated usability study dengan anak/orang tua dan bukan klaim kepatuhan WCAG penuh. Temuan visual didasarkan pada state production yang diamati, accessibility tree browser, respons HTTP publik, dan source yang merender state tersebut.

## Snapshot keadaan lokal vs GitHub

| Pemeriksaan | Hasil |
| --- | --- |
| Isi langsung `Documents\ChatGPT` | hanya folder `mainlagihub` |
| Remote fetch/push | `https://github.com/ceritaantarkita-req/mainlagi-hub.git` |
| Branch lokal | `agent/local-product-qa-20260911` |
| Local HEAD | `e0b8ad50ddc5a973669c17986570e263e743143e` |
| Remote branch HEAD | sama dengan local HEAD |
| Ahead/behind terhadap remote branch | `0/0` |
| Default branch GitHub | `main` |
| Default branch HEAD | `981f5768f9f24b3be5e878a85395d9951292e4ed` |
| Branch audit vs `main` | 2 ahead, 0 behind |
| PR branch | draft PR #87, merge state `CLEAN` |
| Tracked worktree sebelum laporan | clean |
| Local-only ignored state | `node_modules/`, `.next/`, `.qa/`, `.learning-test-dist/`, `.wrangler/`, downloaded MediaPipe/model assets, `tsconfig.tsbuildinfo` |

Kesimpulan sinkronisasi: lokal sinkron dengan **remote feature branch**, bukan dengan default branch/release GitHub. File ignored di laptop memang tidak ada di GitHub dan membuat kedua filesystem tidak byte-for-byte identik; ini normal untuk dependencies/build artifacts, tetapi salah satu artifact menimbulkan bug lint lokal yang dijelaskan di bawah.

## Temuan

### F-01 — High — Final product acceptance masih belum selesai

**Evidence**

- Issue #83 masih open: `Final external acceptance: physical-device QA and required secret-scan check`.
- Seluruh 22 baris physical-device di `docs/BATCH16_PHYSICAL_DEVICE_QA.md` masih `PENDING` untuk iPhone/Safari dan Android/Chrome.
- Iqro tetap memiliki 22 active pack berstatus `expert_required`, bukan `expert_approved`.

**Dampak**

Headless Chromium dan synthetic tests tidak membuktikan camera permission/recovery, overlay alignment, audio unlock, real-finger input, safe area, orientation, accessibility, atau offline/reconnect pada perangkat nyata. Produk belum boleh disebut full product acceptance complete.

**Rekomendasi**

Jalankan `/qa/device` pada perangkat representatif, simpan bukti per baris, transfer ke matrix canonical, lalu tutup/terima exception melalui issue #83. Lakukan review Iqro oleh ahli kompeten secara terpisah dari engineering acceptance.

### F-02 — High — Secret-history scan hijau tetapi tidak mandatory di `main`

**Evidence**

- Workflow `Secret history scan` lulus pada exact HEAD PR #87.
- Ruleset `Protect main` hanya mewajibkan: `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, dan `Production dependency audit`.
- `Secret history scan` tidak termasuk required status checks, sesuai catatan `docs/CURRENT_STATE.md:201` dan issue #83.

**Dampak**

PR dapat lolos ruleset walaupun full-history secret scan gagal atau tidak dijalankan. Untuk public repository yang menangani Supabase/service-role boundaries, ini gap governance material.

**Rekomendasi**

Tambahkan `Secret history scan` sebagai required check pada ruleset aktif dan verifikasi merge diblokir saat check tersebut gagal.

### F-03 — High — Satu advisory High pada development dependency

**Evidence**

- `npm audit --omit=dev --audit-level=high`: 0 vulnerability pada production dependencies.
- `npm audit --audit-level=moderate`: 1 High pada `js-yaml@4.3.1`, advisory `GHSA-2883-xcg3-v3hh`, fix tersedia.
- Dependency path: `eslint -> @eslint/eslintrc -> js-yaml`; lockfile mencatat versi di `package-lock.json:8472-8473`.

**Dampak**

Tidak masuk runtime production, tetapi dapat memengaruhi tooling/CI jika YAML tak tepercaya diproses. CI saat ini hanya mengaudit production dependency sehingga advisory dev ini tidak terlihat sebagai gate.

**Rekomendasi**

Update dependency/lockfile sampai `js-yaml >=4.3.2`, lalu jalankan `npm ci`, full `npm audit`, lint, dan seluruh CI. Pertimbangkan audit dev dependency terjadwal tanpa harus menjadikannya release blocker identik dengan production audit.

### F-04 — Medium — `npm run check` gagal setelah product QA karena artifact generated dilint

**Evidence**

- Local product QA mengompilasi TypeScript ke `.learning-test-dist/` (`scripts/run-local-product-qa.mjs:14,96`) dan tidak menghapusnya pada finalization (`:707-709`).
- `.gitignore` mengabaikan `.learning-test-dist/`, tetapi `eslint.config.mjs:8` tidak memasukkannya ke `globalIgnores`.
- Setelah product QA, `npm run check` berhenti di lint dengan **105 errors**, seluruhnya `@typescript-eslint/no-require-imports` dari generated CommonJS di `.learning-test-dist/`.
- Exact GitHub HEAD tetap hijau karena CI lint berjalan pada clean checkout sebelum artifact tersebut dibuat.

**Dampak**

Urutan normal developer `qa:local:product -> npm run check` menghasilkan false failure. Keberhasilan CI tidak merepresentasikan reproducibility workspace yang sudah dipakai QA.

**Rekomendasi**

Pilih satu atau keduanya: hapus `compiledDir` pada `finally`, dan tambahkan `.learning-test-dist/**` ke ESLint global ignores. Tambahkan regression test yang menjalankan product-QA compile step lalu lint.

### F-05 — Medium — `qa:local:flow` bukan command standalone pada clean clone

**Evidence**

- `package.json:27` menjalankan langsung `node scripts/run-local-product-flow-check.mjs`.
- Runner menggunakan `next start`, yang membutuhkan `.next/BUILD_ID`, tetapi script tidak menjalankan build.
- Pada workspace baru, command gagal sebelum flow test; setelah `npm run build`, flow lulus.
- `docs/LOCAL_PRODUCT_QA.md:24` menyajikan command tersebut langsung tanpa prerequisite build spesifik.

**Dampak**

Diagnostic yang dimaksudkan sebagai entry point cepat gagal pada clone bersih dengan error lifecycle/server, sehingga mudah disalahartikan sebagai product-flow defect.

**Rekomendasi**

Jadikan npm script `npm run build && node ...`, atau dokumentasikan secara eksplisit bahwa build harus tersedia dan tambahkan error message yang menyebut missing build.

### F-06 — Medium — Dokumentasi canonical stale dan saling bertentangan

**Evidence**

- `docs/KNOWN_LIMITATIONS.md:5-19` masih menyatakan dependency install, TypeScript, ESLint, build, dan npm audit tidak dapat dijalankan. Semua itu kini berjalan di laptop/CI.
- `README.md:45` masih menyebut lima learning area sebagai arah berikutnya yang “Planned”, sedangkan `docs/CURRENT_STATE.md` dan catalog terverifikasi sudah memiliki 9 subject dan 900 activity.
- `docs/CURRENT_STATE.md:23` menyebut release terbaru PR #85 / SHA `ee7040c`, sementara `main` sudah di `981f576` dan PR #86 sudah tercatat di history.
- Beberapa dokumen batch lama tetap menggunakan status fase lama tanpa banner archival/superseded yang jelas.

**Dampak**

Onboarding, planning, dan keputusan release dapat memakai fakta lama. Contributor baru sulit membedakan historical evidence dari current source of truth.

**Rekomendasi**

Perbarui README, KNOWN_LIMITATIONS, dan CURRENT_STATE dalam satu docs-only PR. Beri banner `Historical / Superseded` pada closure/progress docs lama dan tautkan ke current canonical state.

### F-07 — Medium — Delapan warning UX fresh-start exposure belum diselesaikan

**Evidence**

Quick/full local product QA sama-sama mencatat 0 blocker dan 8 warning `ux.low_fresh_start_activity_exposure`:

| Subject | Activity links yang terlihat dari fresh profile |
| --- | ---: |
| Bahasa Indonesia | 5 |
| English | 6 |
| Matematika | 4 |
| Iqro | 4 |
| Huruf & Menulis | 3 |
| Logika | 3 |
| Sains | 3 |
| Mewarnai | 2 |

Drawing mengekspos 25 dan tidak memicu warning. Semua subject memiliki 100 catalog activities, sehingga catalog completeness tidak sama dengan discoverability.

**Dampak**

Fresh user mungkin menilai produk sangat tipis atau sulit menemukan breadth konten meskipun inventory lengkap. Ini warning heuristic, bukan bukti bahwa progression salah.

**Rekomendasi**

Lakukan UX review screenshot dan moderated child/parent test sebelum mengubah progression. Solusi harus meningkatkan preview/discoverability tanpa melemahkan mastery, evidence, atau stage unlock semantics.

### F-08 — Medium — Governance mengizinkan merge tanpa approval manusia

**Evidence**

- Ruleset mewajibkan pull request dan resolution thread, tetapi `required_approving_review_count` adalah `0`.
- Tidak ada `.github/CODEOWNERS`.
- `require_last_push_approval` dan `require_code_owner_review` bernilai false.

**Dampak**

Perubahan sensitif pada child privacy, auth, service-role boundary, evidence/mastery, atau deployment dapat digabung hanya dengan automated checks. Automation kuat tetapi tidak menilai intent/product semantics sepenuhnya.

**Rekomendasi**

Untuk area sensitif, wajibkan minimal satu approval dan definisikan CODEOWNERS. Jika repo dikelola satu orang, dokumentasikan exception dan gunakan environment/release approval untuk perubahan produksi berisiko tinggi.

### F-09 — Low — Scope filter `ERR_CONNECTION_RESET` masih berbasis seluruh umur server

**Evidence**

- `scripts/run-local-product-qa.mjs:52-54` mengabaikan hanya exact console text `Failed to load resource: net::ERR_CONNECTION_RESET`, hanya jika runner menyalakan server lokal dan `server.killed === false`.
- Error console lain, page error, HTTP >=400, blank page, overflow, serta navigation error tetap blocker.
- Namun `ChildProcess.killed` hanya menandakan kill signal pernah dikirim; itu bukan bukti proses masih hidup, dan filter tidak dibatasi ke window pergantian navigation/prefetch tertentu.

**Dampak**

Scope sudah sempit secara message/environment, tetapi exact resource reset yang benar-benar berasal dari defect asset/API selama server-owned run dapat luput dari console assertion.

**Rekomendasi**

Catat URL/request failure melalui Playwright `requestfailed`, korelasikan reset dengan navigation yang dibatalkan, dan hanya suppress jika request lama dibatalkan oleh perpindahan route serta main document baru berhasil. Simpan counter suppressed resets di report agar observable.

### F-10 — Low — GitHub Actions menyimpan banyak workflow record `active` yang tidak ada di checkout

**Evidence**

- Checkout branch hanya memiliki `.github/workflows/ci.yml`.
- GitHub `workflow list` menampilkan 10 workflow berstatus active, termasuk beberapa bernama `TEMP ...`, repair lockfile, cleanup asset, dan patch workflow.

**Dampak**

Walaupun workflow tanpa file default-branch tidak otomatis berjalan, Actions UI/governance menjadi bising dan lebih sulit diaudit. Workflow lama berisiko diaktifkan kembali tanpa review konteks.

**Rekomendasi**

Audit workflow IDs satu per satu; disable/delete record obsolete dan pertahankan hanya workflow canonical yang masih punya file serta owner jelas.

### F-11 — Low — PR maintenance belum rapi

**Evidence**

- PR #87 masih draft walaupun seluruh checks hijau; audit ini tidak merekomendasikan merge otomatis.
- PR #34 masih open dengan merge state `DIRTY`, 19 additions/19 deletions, dan tidak memiliki review decision.

**Dampak**

Backlog PR menambah ambiguity tentang source of truth dan pekerjaan yang masih relevan.

**Rekomendasi**

Triage PR #34 (rebase/close/supersede). Untuk PR #87, selesaikan temuan tooling audit dan review manual sebelum mengubah draft status; jangan merge hanya karena checks hijau.

### F-12 — Low/Accepted risk — Batas platform dan konfigurasi eksternal masih terbuka

**Evidence**

- Supabase leaked-password protection masih disabled menurut current canonical docs.
- Affiliate default dapat memakai example/demo destination bila operator belum mengisi campaign sah.
- Safari/Firefox camera behavior belum dibuktikan.
- 17 unused-index findings tercatat sebagai performance INFO pada Supabase advisor.

**Dampak**

Risiko ini tidak menyebabkan failure pada source/CI sekarang, tetapi memengaruhi security posture, monetization correctness, compatibility, dan database hygiene production.

**Rekomendasi**

Verifikasi ulang langsung pada Supabase/production sebelum release sign-off, aktifkan leaked-password protection bila plan mendukung, audit destination affiliate production, dan jadwalkan index review berbasis query metrics.

## Audit produk live dan UI/UX

Snapshot live diperiksa pada 11 September 2026. Endpoint health production mengembalikan `release.sha = 981f5768f9f24b3be5e878a85395d9951292e4ed` dan `release.branch = main`. Dengan demikian, bukti visual di bawah adalah bukti deployment production `main`, bukan bukti bahwa dua commit tambahan pada branch audit sudah live.

### Flow audit ringkas

| Langkah | State production | Health | Masalah utama |
| --- | --- | --- | --- |
| 1. Home → pilih subject | `/` | **FAIL** | Sembilan card subject menuju URL identik `/child/select`; intent subject hilang. |
| 2. Pilih/buat profil anak | `/child/select` | **FAIL** | Selector, onboarding, form tambah profil, demo sandbox, dan pintu area orang tua bercampur dalam satu screen. |
| 3. Child home | `/child/demo-gian/home` | **CAUTION** | Hierarki sangat besar/sparse, istilah sistem muncul, dan jalur orang tua/profil selalu dominan. |
| 4. Learning library | `/child/demo-gian/learn` | **FAIL** | Semua subject dan hampir seluruh stage ditumpuk dalam satu halaman; mayoritas card terkunci dan memakai jargon internal. |
| 5. Audio activity | `/child/demo-gian/activity/bahasa-dengar-a` | **FAIL** | Narasi tidak dimulai saat activity terbuka; anak harus membaca prompt dan menekan `Putar suara`. |
| 6. Coloring | `/child/demo-gian/activity/color-gavi` dan `color-neighbor-leaves` | **FAIL** | Tidak ada gambar untuk diwarnai; tombol berisi `gavi` atau raw slug seperti `color-neighbor-leaves-utama`. |
| 7. Drawing | `/child/demo-gian/activity/drawing-space-near-far` | **FAIL** | “Panduan visual” berupa kalimat literal yang membesar dan overflow di atas kanvas, bukan contoh gambar. |
| 8. Affiliate | `/discover/products` | **FAIL** | Tile tampak kosong; sampel asset 404; link tidak punya accessible name. |
| 9. Parent/account | `/parent`, `/account`, `/account/players` | **FAIL** | Profil lokal tamu, pemain akun, dan parent dashboard memakai model identitas/gate yang terpisah dan tidak dijelaskan sebagai satu perjalanan. |
| 10. Automated QA | local quick/full QA | **CAUTION** | Route availability lulus, tetapi defect visual/content di atas tidak menjadi blocker. |

### F-13 — High — Pilihan subject di homepage tidak diteruskan setelah profile gate

**Evidence**

- Semua card pada `src/components/HomePage.tsx:109-119` memakai `href="/child/select"`, apa pun subject yang ditekan.
- Browser production menunjukkan card Bahasa Indonesia, English, Matematika, Iqro, Menulis, Logika, Sains, Mewarnai, dan Menggambar semuanya menuju `/child/select`.
- Setelah pengguna memilih Bahasa Indonesia, screen berikutnya hanya menampilkan pemilihan/tambah profil; tidak ada state, query, atau CTA yang mengembalikan pengguna ke Bahasa Indonesia.
- `STEPS` pada `src/components/HomePage.tsx:20-24` bahkan mendefinisikan urutan “Pilih profil anak” lalu “Pilih area belajar”, tetapi homepage menampilkan subject picker sebelum profil.

**Dampak**

Klik subject menjanjikan navigasi ke subject, tetapi sistem membuang intent tersebut. Pengguna harus membuat keputusan yang sama dua kali dan dapat merasa card tidak bekerja.

**Rekomendasi**

Jadikan child/profile setup sebagai onboarding satu kali. Simpan `activeChildId` secara eksplisit. Jika belum ada profil, teruskan destination seperti `/child/select?continue=/child/{childId}/subject/bahasa`; setelah profil dipilih/dibuat, lanjutkan ke subject yang semula dipilih. Jika profil aktif sudah ada, card homepage langsung membuka subject. Penggantian profil dan edit data anak tetap tersedia dari profile/settings, bukan menjadi interstitial pada setiap entry.

### F-14 — High — Seluruh jalur Mewarnai belum memiliki objek visual yang dapat diwarnai

**Evidence**

- Production `color-gavi` hanya menampilkan bidang dengan teks `gavi` dan satu tombol region.
- Production `color-neighbor-leaves` menampilkan tiga raw identifier: `color-neighbor-leaves-utama`, `...-detail`, dan `...-latar`; tidak ada daun atau scene.
- `CreativePracticeActivity.tsx:112-137` merender setiap string `coloringRegions` sebagai isi tombol teks dan mengganti background seluruh tombol ketika ditekan.
- Dua activity awal hanya fallback ke `coloringCharacter`; 98 activity lain menerima string region dari authoring. Audit compiled catalog menemukan 100/100 route bertipe `coloring`, 98 memakai `coloringRegions`, dan sekurangnya 75 activity mengandung region berbentuk raw slug identifier.

**Dampak**

Aktivitas tidak memenuhi affordance dasar “mewarnai”. Raw implementation identifiers bocor ke anak. Klaim catalog 100 activity memperbesar jumlah route, tetapi bukan 100 lembar/scene mewarnai yang usable.

**Rekomendasi**

Blokir klaim siap-rilis untuk Mewarnai sampai setiap activity memiliki asset asli berlisensi/owned dengan region map yang nyata. Render ilustrasi raster/vector yang sesuai slot, region hit targets yang menyatu dengan gambar, outline tetap terlihat, undo/reset, dan preview berwarna. Jangan mengubah semantics completion/mastery: creative activity tetap non-accuracy/open-ended, tetapi presentation layer harus benar-benar visual. Tambahkan validation yang menolak raw ID sebagai visible label dan screenshot regression untuk activity representatif setiap pack.

### F-15 — High — Sebagian besar “panduan visual” Menggambar adalah simbol atau kalimat placeholder

**Evidence**

- Production `drawing-space-near-far` menampilkan kalimat “Panduan visual sederhana untuk dekat dan jauh.” dalam font raksasa di atas kanvas; teks overflow keluar viewport dan menutupi kontrol.
- `CreativePracticeActivity.tsx:82-99` menampilkan `drawingGuide` sebagai teks kecil di banner sekaligus sebagai teks absolut berukuran `150px` di dalam kanvas.
- Compiled catalog berisi 100 route `drawing`; 50 memakai kalimat generik `Panduan visual...` atau `Mulai dari...`, dan 25 hanya memakai simbol pendek. Semuanya menggunakan satu mechanic kanvas yang sama.

**Dampak**

Anak tidak mendapatkan contoh bentuk, urutan goresan, titik awal, atau komposisi yang dijanjikan. Pada prompt panjang, layout rusak secara nyata. Ini defect fungsi dan visual, bukan preferensi estetika.

**Rekomendasi**

Ganti string guide dengan asset demonstrasi nyata atau sequence animasi singkat: contoh hasil, 2–4 langkah, start point, direction, dan opsi hide/show guide. Batasi guide dalam canvas bounds, uji text zoom serta viewport kecil, dan buat schema yang memisahkan `instructionText` dari `guideAsset`. Pertahankan completion-only semantics sampai evaluator bentuk memang tervalidasi.

### F-16 — High — Gambar affiliate production 404 dan card gagal secara visual maupun aksesibilitas

**Evidence**

- `/api/affiliate` production mengembalikan local path seperti `/affiliate/kumon-...jpg`.
- Delapan asset pertama yang diuji semuanya mengembalikan HTTP 404 dari `mainlagihub.my.id`.
- Workspace tidak memiliki directory/file `public/affiliate`; `affiliate-provenance.json` kosong; catalog source fail-closed ke `image: null`. Ini menunjukkan row Supabase production menyimpan path yang tidak tersedia pada artifact Cloudflare.
- `ProductGrid.tsx:15-22` memakai `<img alt="">`, tidak memiliki fallback `onError`, dan menyembunyikan satu-satunya judul/CTA dengan `aria-hidden`.
- Pada accessibility tree production, puluhan link affiliate tidak memiliki nama. Secara visual, pengguna melihat tile besar kosong/broken image.

**Dampak**

Halaman commerce terlihat rusak, tidak dapat dipahami screen-reader, mengurangi trust, dan berpotensi menghilangkan klik affiliate.

**Rekomendasi**

Segera set `image_url = null` untuk path production yang tidak tersedia atau upload hanya asset dengan provenance `owned/licensed` dan redistribution allowed. Card harus selalu menampilkan judul produk sebagai visible text dan accessible name, bahkan tanpa gambar. Tambahkan neutral fallback illustration/icon, `onError` state, aspect-ratio skeleton yang berakhir, dan scheduled link/image checker. CI/deploy smoke harus memeriksa seluruh local `image_url` mengembalikan 200 sebelum publish.

### F-17 — High — Audio activity mengharuskan anak membaca dan menekan tombol sebelum mendengar instruksi

**Evidence**

- Production activity `bahasa-dengar-a` terbuka dalam keadaan senyap; hanya ada heading “Pilih huruf A” dan button `Putar suara`.
- `AudioChoiceLearningActivity.tsx:32-36,60-63` baru memanggil `unlockAudio()` dan `speakWithStatus()` di event klik tombol.
- Catalog berisi 76 `listen_and_choose` activity. Untuk anak usia 3–7, text-first prompt menurunkan kemandirian pre-reader.
- `feedback.ts:91-98` benar bahwa audio harus di-unlock dari real user gesture; kendala browser ini tidak mengharuskan tombol replay ditekan pada setiap activity.

**Dampak**

Activity yang disebut listening bergantung pada kemampuan membaca dan memiliki satu langkah ekstra berulang. Anak dapat menebak jawaban tanpa mendengar prompt.

**Rekomendasi**

Gunakan gesture pertama saat masuk child mode/pilih profil/tekan `Mulai` untuk mengaktifkan audio sekali per session. Setelah unlocked, auto-narrate saat activity siap, dengan replay besar, mute global, caption, indikator speaking, dan fallback teks. Jika autoplay benar-benar diblokir, tampilkan satu gate ramah anak “Ketuk untuk mulai dengan suara”, bukan tombol teknis pada setiap soal. Jangan pernah auto-play di area orang tua atau halaman marketing.

### F-18 — High — Learning library membebani anak dengan seluruh struktur sistem dan jargon internal

**Evidence**

- `/child/demo-gian/learn` merender seluruh sembilan subject dan 46 stage pada satu halaman panjang.
- Fresh state didominasi card opacity rendah/terkunci, angka `0/10`, dan kalimat berulang “Selesaikan aktivitas inti dan evidence readiness...”.
- Visible copy memuat `LEARNING PATH`, `subject`, `stage`, `evidence`, `completion`, `mastery`, `sandbox cepat`, dan `prototype` di berbagai child/parent surface (`ChildLearningPathViews.tsx:243-277`, `CloudProfileScreens.tsx:75-89`).
- Fixed bottom nav menutupi sebagian card pada viewport audit walau halaman memiliki bottom padding untuk final scroll position.

**Dampak**

Bahasa sistem ditulis untuk engineer/parent, bukan untuk anak usia dini. Banyak lock dan progress denominator membentuk pengalaman “ditolak” sebelum anak mulai dan membuat breadth catalog sulit dipahami.

**Rekomendasi**

Child home harus memberi satu CTA utama “Lanjut belajar”, 3–6 rekomendasi visual, dan pintu “Jelajah” yang sederhana. Pindahkan detail evidence/mastery/completion ke parent dashboard. Gunakan copy anak seperti “Selesai”, “Coba lagi”, “Petualangan berikutnya”; jangan menerjemahkan jargon engineering setengah-setengah. Library bisa memakai feed/category yang mudah dipindai, bukan dump seluruh dependency graph stage.

### F-19 — High — Model akun, profil anak, pemain, dan area orang tua terfragmentasi

**Evidence**

- `/child/select` dapat membuat profil tamu di local storage atau profil cloud jika login; demo profile selalu hadir (`CloudProfileScreens.tsx:17-62,105-183`).
- `/parent` menolak anonymous user dan redirect ke `/login` (`src/app/parent/layout.tsx`).
- `/account` anonymous tetap menampilkan menu `Profil`, `Pemain`, dan `Preferensi`, tetapi detail `Profil`/`Pemain` kemudian meminta login.
- Child header memiliki dua jalan berdekatan: `Area orang tua` dan `Ganti profil anak`; homepage juga memiliki top-level `Akun`.

**Dampak**

Orang tua tidak tahu apakah “profil”, “pemain”, dan “anak” adalah objek yang sama. Progress tamu lokal berisiko dianggap sudah tersimpan ke akun. Parent gate terasa seperti login error, bukan transisi peran yang aman.

**Rekomendasi**

Definisikan satu model keluarga: `Parent account -> child profiles -> progress`. Onboarding akun/orang tua membuat profil anak sekali; child mode hanya memilih profil aktif. Gabungkan edit anak, avatar, umur, screen time, progress, dan penghapusan di parent settings. Jika guest mode dipertahankan, labeli jelas “tersimpan di perangkat ini”, berikan migrasi eksplisit ke akun, dan jangan menampilkan menu cloud yang terlihat sudah aktif. Parent area dari kids mode perlu parental gate yang konsisten sebelum dashboard.

### F-20 — Medium — “900 activity” benar sebagai route count, tetapi variasi experience sangat rendah

**Evidence**

Compiled catalog menunjukkan distribusi 900 route:

| Runtime | Jumlah |
| --- | ---: |
| Tap choice | 481 |
| Listen and choose | 76 |
| Matching | 125 |
| Story | 1 |
| Trace | 14 |
| Motion game | 3 |
| Coloring | 100 |
| Drawing | 100 |

Sebanyak 682/900 activity (75,8%) adalah choice/listen-choice/matching; Mewarnai dan Menggambar masing-masing mengulang satu renderer. Hanya satu activity bertipe story di seluruh learning catalog.

**Dampak**

Target kuantitas route dapat lulus sementara pengalaman terasa repetitif, tipis, atau tidak sesuai deskripsi. Ini menjelaskan mengapa user melihat “sedikit activity” walau invariant menghitung 100 per subject.

**Rekomendasi**

Pisahkan KPI `catalog route count` dari `meaningful activity experience`. Tambahkan content-quality rubric per activity: objective, unique stimulus, usable asset, age fit, interaction fidelity, narration, feedback, retry, dan completion evidence. Tetapkan minimum mechanic diversity per subject dan audit sampling manusia per pack. Jangan mengubah mastery/evidence/progression semantics hanya untuk mempercantik jumlah.

### F-21 — Medium — Homepage mencampur terlalu banyak audience dan tujuan

**Evidence**

- Hero menyebut hanya Bahasa Indonesia, English, Matematika, Iqro, dan Mewarnai (`HomePage.tsx:93-100`), padahal ada sembilan subject.
- Satu halaman yang sama memuat marketing value proposition, subject picker, 10 camera games, cara mulai, public leaderboard, dan affiliate recommendations.
- Copy production masih memuat bahasa proyek seperti “10 game existing tetap dipertahankan” (`HomePage.tsx:123-124`).
- Child-learning brand, public site/account, motion games, dan affiliate commerce memiliki gaya serta mental model berbeda.

**Dampak**

Tidak jelas apakah homepage dibuat untuk anak, orang tua yang sedang evaluasi produk, pemain game, atau pembeli affiliate. Hal ini melemahkan primary action dan trust pada produk anak.

**Rekomendasi**

Pisahkan dua surface: landing/onboarding untuk orang tua dan child app untuk belajar. Landing fokus pada manfaat, keamanan, bukti kurikulum, cara mulai, dan satu CTA. Setelah profil aktif, child entry fokus pada `Lanjut` dan `Jelajah`. Tempatkan commerce di area orang tua/Jelajah dengan disclosure jelas; jangan mencampurnya dengan flow anak. Hapus semua copy internal seperti `existing`, `prototype`, `wave`, dan `sandbox` dari production.

### F-22 — Medium — Visual language belum konsisten atau cukup kaya untuk produk anak usia dini

**Evidence**

- Homepage mengandalkan gradient headline, white cards, emoji subject, dan whitespace besar; learning library menggunakan dense locked cards; account memakai utility settings grid; activity memakai panel form-like.
- Karakter memang memiliki beberapa SVG sederhana, tetapi sebagian besar subject/activity art tetap emoji atau teks, bukan scene/illustration yang menjelaskan tugas.
- Banyak screen memakai card radius/shadow yang mirip tetapi tidak membentuk world, story, atau character-led continuity seperti referensi yang disebut user.
- Locked state opacity `0.62` (`ChildLearningPathViews.tsx:92-94`) membuat banyak copy penting sangat pucat saat halaman dipenuhi card terkunci.

**Dampak**

Produk terasa seperti kumpulan dashboard/template berbeda. Anak tidak mendapat landmark visual dan affordance kuat; orang tua melihat banyak area kosong atau placeholder.

**Rekomendasi**

Buat design direction tunggal berbasis karakter dan world map yang konsisten, tetapi tetap sederhana. Susun token visual untuk child vs parent surface, art direction per subject, real illustration set, component states, motion/audio behavior, dan density rules. Prototype tiga screen kritis terlebih dulu—onboarding, child home, dan satu activity—lalu uji pada anak/orang tua sebelum migrasi seluruh route.

### F-23 — Medium — Automated QA belum memiliki gate untuk content presentation dan visual sanity

**Evidence**

- Quick/full product QA lulus dengan 0 blocker meskipun production memperlihatkan raw slugs, text overflow, blank affiliate cards, dan unnamed links.
- Delapan warning saat ini hanya memeriksa `low_fresh_start_activity_exposure`; route crawl terutama membuktikan route dapat dimuat.
- Screenshot count 82 belum berarti visual regression pass jika tidak dibandingkan dengan baseline/acceptance criteria.

**Dampak**

Green QA memberi rasa aman palsu. Regressions yang paling jelas bagi user tidak mengubah status build.

**Rekomendasi**

Tambahkan blocker QA yang sempit dan objektif: visible raw-ID regex, overflow/cropped-control check, accessible-name untuk interactive links, image response 2xx/fallback state, no permanent loading state, dan representative screenshot diff per renderer/viewport. Tetap pertahankan 900-route crawl untuk availability, tetapi tambahkan curated visual acceptance matrix untuk kualitas.

### F-24 — High — Terasa seperti “sistem di dalam sistem” karena ada beberapa application shell dan navigasi yang saling mengulang

**Evidence**

- Public shell memiliki top navigation dan bottom navigation lima item: Beranda, Main Gerak, Belajar, Skor game, dan Akun (`AppShell.tsx:39-46`, `BottomNavbar.tsx:8-40`).
- Begitu URL masuk `/child/*`, public shell dihilangkan dan diganti child shell dengan header serta bottom navigation empat item yang berbeda: Dunia, Belajar, Main Gerak, dan Hadiah (`AppShell.tsx:9-18,37`; `LearningCommon.tsx:170-200`).
- Homepage sudah menampilkan sembilan subject dan 10 game, lalu child home kembali menampilkan subject/rekomendasi, lalu `/child/{id}/learn` kembali menampilkan sembilan subject beserta seluruh stage.
- Istilah dan destination berganti di antara shell: `Beranda` menjadi `Dunia`, `Main Gerak` menjadi `Gerak`, `Akun` menghilang lalu digantikan dua shortcut `Area orang tua` dan `Ganti profil anak`.

**Dampak**

Pengguna kehilangan sense of place. Mereka tidak tahu apakah sedang berpindah halaman, mengganti profil, atau masuk aplikasi lain. Fungsi yang sama tampak berulang dengan nama dan navigasi berbeda, sehingga perjalanan sederhana terasa bertingkat-tingkat.

**Rekomendasi**

Tetapkan satu information architecture dengan dua mode yang jelas, bukan beberapa mini-app:

1. **Parent/public mode:** Beranda, Tentang/keamanan, Akun keluarga, dan pengaturan.
2. **Child mode:** Home/Lanjut, Jelajah, Karya/Hadiah, dan profil aktif.

Saat masuk child mode, berikan transisi eksplisit sekali dan pertahankan konteks sampai orang tua keluar melalui parental gate. Jangan ulang subject catalog di homepage, child home, dan learning library dengan bobot yang sama. Satu surface menjadi `Lanjut/rekomendasi`; satu surface lain menjadi `Jelajah semua`.

### F-25 — High — Beberapa elemen responsif benar-benar terpotong atau saling menindih

**Evidence**

- Audit viewport 390×844 pada `/child/demo-gian/learn` menunjukkan subject card ketiga terpotong di sisi kanan tanpa affordance/indikator bahwa baris dapat digeser; enam subject lain tidak terlihat.
- Badge `0/6 stage siap` terpecah menjadi empat baris sempit di sisi kanan heading.
- Fixed bottom navigation menindih isi card yang sedang dibaca. `LearningPlatform.module.css:85-101` memosisikannya fixed di atas content; bottom padding hanya memastikan ujung akhir halaman dapat discroll, bukan mencegah overlay saat membaca bagian tengah.
- Audit mobile `color-neighbor-leaves` menunjukkan raw slug membungkus menjadi banyak baris di dalam tombol besar; pilihan ketiga dan palet berada di bawah fold sehingga tugas tidak terbaca sebagai satu komposisi.
- Audit desktop `drawing-space-near-far` menunjukkan string panduan berukuran besar overflow keluar batas kanvas/card dan menutupi area kontrol.

**Dampak**

Konten penting tampak hilang, kontrol tertutup, dan layout terlihat rusak pada viewport utama yang justru diklaim mobile-first. Ini bukan sekadar preferensi spacing.

**Rekomendasi**

- Beri carousel subject peek yang disengaja, gradient edge + label “Geser”, atau gunakan grid dua kolom yang tidak memotong card secara acak.
- Pindahkan stage summary di bawah heading pada mobile dan larang badge menyusut ke kolom ekstrem.
- Gunakan navigation bar yang menyediakan layout inset nyata atau sticky section footer yang tidak menutupi content.
- Terapkan `overflow-wrap`, max line count, dan content schema validation, tetapi jangan mengandalkan wrapping untuk raw IDs—raw IDs harus tidak pernah dirender.
- Tambahkan visual acceptance pada 320×568, 360×800, 390×844, 412×915, tablet, dan desktop untuk setiap renderer utama, dengan assertion bahwa CTA, palette, dan prompt tidak terpotong/tertindih.

### Benchmark prinsip terhadap referensi user

Referensi tidak perlu dikloning secara visual. Prinsip yang relevan:

- [Khan Academy Kids](https://www.khanacademy.org/kids) memisahkan personalized learning path dari library eksplorasi dan menekankan karakter, aktivitas interaktif, buku, video, serta creative activities.
- [Getting Started with Khan Academy Kids](https://www.khanacademy.org/v/getting-started-with-khan-academy-kids) menunjukkan profil anak dibuat saat onboarding, lalu anak dipilih untuk masuk ke personalized path; penambahan profil berikutnya berada di parent section.
- [Lingokids Parents Area](https://help.lingokids.com/hc/en-us/articles/115005129325-What-is-the-Parents-Area) menggabungkan progress, pengelolaan profil anak, screen time, subscription, downloads, dan account settings di area orang tua dengan parental gate.
- [Lingokids App Sections](https://help.lingokids.com/hc/en-us/articles/9563170182801-App-Sections) membedakan Kids Area, Explore/catalog, lessons, dan Parents Area; breadth konten ditampilkan melalui feed/category, bukan seluruh progression graph sekaligus.
- [Lingokids level guidance](https://help.lingokids.com/hc/en-us/articles/360019924937-How-do-I-know-what-my-child-s-level-is) menekankan bahwa umur/level diatur di profil dan rekomendasi berjalan otomatis, sehingga anak tidak dibebani setup berulang.

Benchmark ini mendukung arah perbaikan user: setup profil satu kali, child area yang langsung bisa dimainkan, parent settings terpusat, library yang menunjukkan breadth, dan audio/visual yang memungkinkan anak pra-baca belajar lebih mandiri.

## Hal yang terverifikasi sehat

- Exact HEAD PR #87: seluruh GitHub checks lulus (`Secret history scan`, Ubuntu quality, production build, mobile Chromium QA, Windows compatibility, production dependency audit).
- Production dependency audit: 0 vulnerability.
- Source audit: 336 files / 38,872 lines, 0 finding; secret scan PASS.
- Batch 16 security boundary tests PASS; raw HTML sinks dibatasi ke dua reviewed/sanitized sinks.
- Device-QA harness contract PASS: 22 canonical tests, local-only evidence, tanpa automatic camera request/upload.
- TypeScript check PASS sebelum lint menemukan generated-artifact issue.
- Local product flow PASS: Home → Learn → Subject → Stage → Activity.
- Quick product QA PASS: 0 blocker, 8 warning, 159 routes checked.
- Full product QA PASS: 0 blocker, 8 warning, 1,059 total routes, 900/900 activity routes, 82 screenshots, primary flow PASS.
- Catalog: 9 subject, 900 activity, 46 stage, 197 lesson/pack, 200 skill; tidak ada duplicate/orphan yang dilaporkan.
- Branch protection aktif, linear history dan squash-only merge diterapkan, deletion/non-fast-forward dicegah.

## Prioritas diskusi yang disarankan

1. **Containment production:** F-14, F-15, F-16, dan F-25. Jangan mempromosikan Mewarnai/Menggambar sebagai experience siap sampai renderer visual benar; hilangkan row asset affiliate 404 atau berikan fallback yang valid; jadikan clipping/raw IDs sebagai blocker.
2. **Reset information architecture:** F-13, F-19, dan F-24. Putuskan model `parent account -> child profiles -> child mode`, onboarding satu kali, continuation setelah memilih subject, dan satu sumber kebenaran navigasi.
3. **Prototype UX inti sebelum migrasi besar:** F-17, F-18, F-21, dan F-22. Prototype dan uji tiga screen terlebih dulu: onboarding/profile, child home, dan satu activity audio/visual.
4. **Content-quality program:** F-07 dan F-20. Pertahankan 100 route per subject sebagai inventory invariant, tetapi tambah quality bar dan sampling manusia agar setiap route menjadi pengalaman bermakna.
5. **QA hardening:** F-23 dan F-09. Tambahkan visual/content/accessibility assertions tanpa blanket suppression dan tanpa melemahkan mastery/evidence/progression.
6. **Engineering/repository cepat:** F-04, F-05, F-06, dan F-03 dalam PR terpisah/terukur.
7. **Acceptance dan governance:** F-01, F-02, F-08, dan F-12.
8. **Repository hygiene:** F-10 dan F-11.

Hal yang **tidak** disarankan:

- jangan sekadar mengganti label `0/2` menjadi `100`; itu akan menyamarkan beda antara required progression dan total inventory;
- jangan membuka semua stage dengan mengubah mastery/evidence semantics hanya agar catalog terlihat penuh;
- jangan mencoba autoplay audio lewat timer sebelum user gesture; gunakan satu session-level child start gesture yang sah;
- jangan mengambil/commit ulang gambar marketplace tanpa hak distribusi yang terdokumentasi;
- jangan memperbaiki Mewarnai dengan mengganti warna background rectangle teks; dibutuhkan objek/scene dan spatial regions nyata;
- jangan redesign seluruh 1.059 route sekaligus sebelum tiga screen/renderer inti lolos uji orang tua dan anak.

## Perintah/bukti utama

```text
git fetch origin --prune
git fetch origin main:refs/remotes/origin/main
git rev-list --left-right --count origin/main...HEAD
gh pr checks 87
gh run list
gh api repos/ceritaantarkita-req/mainlagi-hub/rulesets/22624066
npm audit --omit=dev --audit-level=high --json
npm audit --audit-level=moderate --json
npm explain js-yaml
npm run check
npm run qa:local:flow
npm run qa:local:product:quick
npm run qa:local:product
GET https://mainlagihub.my.id/api/health
GET https://mainlagihub.my.id/api/affiliate
GET https://mainlagihub.my.id/affiliate/<sample>.jpg
```

## Status setelah audit

Audit hanya menambahkan dokumen ini. Tidak ada commit atau push. Dengan hadirnya file ini, working tree lokal akan berbeda dari remote sampai user memutuskan apakah laporan perlu dikomit.
# Pembaruan perbaikan lokal — 12 September 2026

Audit di bawah adalah snapshot sebelum redesign. Implementasi, hasil
regression test, bukti visual, serta temuan yang **belum ditutup** dicatat di
[LOCAL_REDESIGN_2026-09-11.md](LOCAL_REDESIGN_2026-09-11.md).
Perubahan belum di-commit, di-push, atau di-deploy; tidak menyatakan GitHub
dan produksi sudah mengikuti workspace lokal.

## Status temuan setelah paket perbaikan lokal

Status ini tidak mengubah snapshot audit awal dan tidak menyatakan produksi
sudah diperbaiki. Semua bukti berikut hanya berlaku pada workspace lokal.

| Temuan | Status lokal | Bukti/keputusan |
| --- | --- | --- |
| F-03/F-04/F-05/F-06 | Selesai lokal | `js-yaml` 4.3.2, lint mengabaikan generated output, flow membangun aplikasi, docs diperbarui. |
| F-07 | Dipertahankan dan diperjelas | Delapan warning tetap ada. UI memisahkan `siap dimainkan`, `selesai`, dan `100 total`; progression tidak dibuka paksa. |
| F-09 | Selesai lokal | Suppression `ERR_CONNECTION_RESET` tidak dipakai; console error tetap failure. Full run berhasil dengan concurrency 1. |
| F-13 | Selesai lokal | Subject intent dan profil tersimpan diteruskan tanpa setup berulang. |
| F-14 | Selesai untuk renderer | 100/100 route Mewarnai mempunyai spatial regions interaktif, palette, keyboard, undo/reset, dan completion-only. |
| F-15 | Sebagian | Menggambar kini punya kanvas/stroke/warna/undo/reset; kurasi 100 panduan objek unik masih terbuka. |
| F-16 | Containment lokal | Card tetap bermakna saat gambar gagal. URL/data gambar cloud dan hak distribusi belum diperbaiki. |
| F-17 | Sebagian | Autoplay setelah gesture sesi dan replay tersedia. Voice non-matching ditolak; aset voice Indonesia natural belum tersedia. |
| F-18/F-21/F-24 | Selesai untuk child core flow | Satu Playroom, tidak ada nav `Jelajahi`, tidak ada subject switcher di subject page, dan jargon internal dihapus dari flow aktif. |
| F-19 | Sebagian | Pilihan profil diingat dan parent entry dipusatkan; konsolidasi model akun/cloud/legacy belum dilakukan. |
| F-20 | Terbuka | Inventory tetap 900 route; audit tidak mengklaim 900 pengalaman pedagogis unik. |
| F-22 | Sebagian | Home dan creative renderer memakai arah visual konsisten; seluruh surface legacy belum dikurasi. |
| F-23/F-25 | Selesai untuk scope aktif | QA menambah interaksi, SVG parser, desktop/mobile/tablet screenshots, overflow checks, dan full crawl 900 route. |
| F-01/F-02/F-08/F-10/F-11/F-12 | Terbuka | Membutuhkan hardware, GitHub governance, external config, atau keputusan deployment di luar paket lokal. |

Validasi terakhir: flow PASS (3 klik), quick QA PASS, full QA PASS; 900/900
activity route, 1.059 total route, 0 blocker, 8 warning, 82 screenshot.
Perubahan belum di-commit, push, deploy, atau digabung ke PR #87.
