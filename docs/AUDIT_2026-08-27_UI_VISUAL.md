# Audit Visual UI — Homepage, Katalog Game, Discover, Detail Game, Leaderboard, Account
**Tanggal:** 27 Agustus 2026
**Dibuat oleh:** Claude (sesi Cowork), hasil audit langsung di browser tersambung (Chrome milik user, live `localhost:3000`, dev server Next.js/Turbopack) + pembacaan source code.
**Cakupan:** folder proyek `motion-learning-hub-upload` (lokal, belum di-commit ke git kecuali disebutkan). Target pembaca: AI/engineer lain yang melanjutkan perbaikan tanpa konteks percakapan sebelumnya.
**Status branch saat audit:** `HEAD` di atas commit `a1fd803` ("merge: bring in production deploy automation..."), dengan **6 file berstatus modified belum di-commit** (lihat §5) — perubahan tersebut adalah bagian dari kerja audit ini, BUKAN kerja orang lain yang sedang berjalan paralel.

---

## 0. Ringkasan eksekutif

| # | Temuan | Prioritas | Status |
|---|---|---|---|
| 1 | Dev server/browser sering menyajikan CSS/JS basi tanpa hard-reload — bikin banyak "bug" terlihat padahal kode sudah benar | 🔴 **Kritis (proses)** | Belum diperbaiki — lihat §1 |
| 2 | Hero mascot di homepage: badge "MOVE 10" menabrak wajah/topi karakter, foto ter-crop janggal | 🟠 Tinggi (visual) | Belum diperbaiki — lihat §2.1 |
| 3 | Label navigasi & judul halaman campur Inggris/Indonesia (top-nav desktop 100% Inggris, semua konten lain Indonesia) | 🟠 Tinggi (konsistensi/kesan "belum jadi") | Belum diperbaiki — lihat §2.2 |
| 4 | `globals.css` punya banyak class yang didefinisikan ulang di beberapa tempat terpisah (mis. `.fun-card`, `.game-tile`, `.bottom-nav__item`, `.hero-product__*`) | 🟡 Sedang (utang teknis, akar penyebab drift visual) | Belum diperbaiki — lihat §3.1 |
| 5 | Ikon campur: Unicode glyph (⌕ ★ ••• →) berdampingan dengan sistem SVG custom (`Icon`/`GameIcon`) | 🟡 Sedang (polish) | Belum diperbaiki — lihat §3.2 |
| 6 | Unifikasi kartu game (homepage/katalog/discover), navbar bawah icon-only, hero pakai foto maskot asli, hapus badge nomor | ✅ Selesai | Sudah diterapkan sesi ini, lihat §5 |

**Baca §1 dulu sebelum menyentuh kode apa pun** — ini yang paling penting dan paling gampang bikin salah diagnosis.

---

## 1. WAJIB DIBACA: cara verifikasi visual yang benar (jangan skip)

Selama audit, kami membuktikan berkali-kali (4 kejadian terpisah: homepage hero, `/leaderboards`, `/games` search bar, `/games/[slug]` grid detail) bahwa **navigasi biasa (klik link, atau bahkan reload biasa) sering menampilkan versi CSS/JS lama**, sementara hard-reload (`Ctrl+Shift+R` / DevTools → Network tab → centang "Disable cache") langsung menampilkan versi yang benar dan rapi.

Bukti konkret: `.game-detail__hero` (grid 2 kolom di halaman detail game) sempat terukur via `getComputedStyle` sebagai `gridTemplateColumns: "693.76px"` (cuma 1 kolom implisit — grid rusak, konten numpuk ke bawah, ada kotak kosong besar). Setelah hard-reload di halaman **yang sama, tanpa ubah kode apa pun**, terukur `gridTemplateColumns: "500.72px 612px"` (2 kolom, benar). Tidak ada service worker terdaftar di source (`grep` untuk `sw.js`/`next-pwa` nihil), jadi ini murni cache HTTP dev server/browser yang agresif, bukan bug kode.

**Implikasi untuk siapa pun yang melanjutkan pekerjaan ini:**
- Sebelum menyimpulkan sesuatu "rusak", **hard-reload dulu** halaman yang sedang dicek, baru screenshot/evaluasi ulang.
- Kalau punya akses browser tool, aktifkan "Disable cache" di DevTools Network tab selama development supaya tidak tertipu versi lama.
- Semua temuan di §2 dan §3 di bawah ini **sudah diverifikasi ulang setelah hard-reload** — jadi itu memang bug asli di kode, bukan artefak cache. Temuan yang ternyata cuma cache basi didaftar terpisah di §4 (supaya tidak diperbaiki dua kali / tidak dikejar-kejar padahal sudah benar).

---

## 2. Temuan prioritas tinggi (visual, terverifikasi setelah hard-reload)

### 2.1 Hero homepage — badge "MOVE 10" menabrak wajah maskot, foto ter-crop janggal

**Lokasi:**
- Komponen: `src/components/HomePage.tsx`, fungsi `HeroScene()` (sekitar baris 68–84)
- CSS: `src/app/globals.css`, blok `.hero-product` dan turunannya (sekitar baris 1978–1997), plus override mobile `.hero-product { max-width: 350px; }` di dalam `@media (max-width: 767px)` (sekitar baris 2149)
- Aset gambar: `public/artwork/_mascot-reference.webp` (karakter maskot topi merah/hoodie cyan, pose melompat-menunjuk, wajah & topi ada di sepertiga atas foto)

**Kondisi sekarang (CSS relevan, sudah dicek nomor barisnya):**
```css
.hero-product {
  width: min(100%, 470px);
  padding: 15px;
  /* ... */
}
.hero-product__stage {
  position: relative;
  min-height: 270px;         /* TINGGI TETAP */
  overflow: hidden;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: radial-gradient(circle at 50% 45%, #25458f 0, #182e68 37%, #0d1938 100%);
}
.hero-product__mascot {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover;          /* crop otomatis, object-position default = center */
}
.hero-product__target {       /* badge "MOVE 10" */
  position: absolute; top: 23px; right: 23px;
  width: 82px; height: 82px;
  border: 1px solid rgba(210,244,106,.6);  /* TANPA background solid → transparan, gampang "menyatu" dengan foto di belakangnya */
  border-radius: 50%;
  /* ... */
}
```

**Kenapa ini jadi masalah (root cause):** Kotak `.hero-product__stage` punya rasio landscape tetap (lebar maksimum 470px, tinggi tetap 270px ≈ rasio 1.74:1), sementara foto sumbernya adalah foto potret penuh badan. `object-fit: cover` dengan `object-position` default (center) meng-crop bagian atas/bawah foto secukupnya supaya lebar penuh — hasilnya wajah & topi karakter tetap berada di area atas-tengah kotak. Badge "MOVE 10" diposisikan `absolute` di pojok kanan-atas (top:23px, right:23px) TANPA latar solid (cuma outline tipis), jadi dia numpuk transparan tepat di atas wajah/topi karakter. Ini bukan cuma soal estetika kebetulan — kombinasi "tinggi kotak tetap + crop tengah + badge tanpa latar di pojok atas" akan SELALU berisiko tabrakan dengan bagian atas foto siapa pun mascot-nya.

**Terverifikasi di:** mobile (viewport sempit, `.hero-product` di-clamp `max-width:350px`) DAN desktop (`.hero-product` di 470px penuh) — sama-sama menunjukkan badge menabrak wajah/topi setelah hard-reload.

**Rekomendasi perbaikan (pilih salah satu atau kombinasi — bukan resep pasti, keputusan desain ada di eksekutor):**
1. Beri `.hero-product__target` latar solid semi-opaque (mis. `background: rgba(16,31,67,.85); backdrop-filter: blur(4px);`) supaya badge terbaca jelas apa pun yang ada di belakangnya, dan/atau pindahkan ke pojok yang lebih aman (kiri-bawah / kanan-bawah, jauh dari area kepala karakter).
2. Sesuaikan `object-position` pada `.hero-product__mascot` (mis. `object-position: 50% 15%` atau nilai lain yang pas) supaya kepala karakter tidak persis di bawah badge, ATAU ubah `.hero-product__stage` dari `min-height: 270px` tetap ke `aspect-ratio` yang lebih ramah potret (mis. `aspect-ratio: 4 / 5`) supaya crop tidak seagresif itu.
3. Kombinasi 1+2 kemungkinan paling robust.

**Acceptance criteria:** buka `/` di mobile (≤430px) dan desktop (≥1200px), **hard-reload**, badge "MOVE 10" tidak menutupi wajah/topi karakter, dan torso karakter (bukan cuma potongan kecil) terlihat utuh dalam frame.

---

### 2.2 Label navigasi & judul halaman campur bahasa (Inggris vs Indonesia)

Seluruh copy aplikasi ini berbahasa Indonesia ("Papan skor", "Pilih permainanmu", "Mainkan", "Beranda", "Jelajah", "Akun" di navbar bawah) KECUALI lima titik berikut, yang semuanya berbahasa Inggris:

| # | Teks Inggris ditemukan | File | Baris | Konteks |
|---|---|---|---|---|
| a | `"Home"`, `"Games"`, `"Discover"`, `"Leaderboards"`, `"Account"` | `src/lib/navigation.ts` | 10–16, const `PRIMARY_NAV` | Sumber label menu top-nav DESKTOP (`TopNavbar.tsx` me-render array ini apa adanya) |
| b | `<h2>Discover</h2>` | `src/app/discover/page.tsx` | 14 | Judul besar halaman `/discover` |
| c | `<h2>Account</h2>` | `src/app/account/page.tsx` | 31 | Judul besar halaman `/account` |
| d | `<h2>Profile</h2>` | `src/app/account/profile/page.tsx` | 11 | Judul halaman `/account/profile` (item lain di menu Account: "Pemain", "Preferensi", "Keamanan", "Tentang", "Hapus akun" — SUDAH Indonesia, cuma "Profile" yang ketinggalan) |
| e | `<small>Motion Learning</small>` | `src/components/nav/TopNavbar.tsx` | ~30 | Subteks di bawah logo "Mainlagi Hub" — **ini mungkin tagline/nama produk yang memang sengaja bilingual, bukan pasti bug.** Tandai untuk konfirmasi ke product owner (Amanda), jangan diubah otomatis. |

**Root cause khusus item (a):** `TopNavbar.tsx` (nav desktop) dan `BottomNavbar.tsx` (nav mobile) punya SUMBER LABEL TERPISAH yang tidak sinkron. `BottomNavbar.tsx` sudah benar (Indonesia, hardcoded array lokal `LEFT`/`RIGHT` + `"Jelajah"` untuk item Discover). `TopNavbar.tsx` mengambil label dari `PRIMARY_NAV` di `src/lib/navigation.ts`, yang isinya 100% Inggris dan sepertinya tidak pernah diterjemahkan sejak awal dibuat. Efeknya: kalau resize browser dari desktop ke mobile (atau sebaliknya), label menu untuk **rute yang sama** berubah bahasa — "Discover" (desktop) vs "Jelajah" (mobile), "Account" vs "Akun", "Leaderboards" vs "Skor".

**Rekomendasi perbaikan:**
- Terjemahkan `PRIMARY_NAV` di `src/lib/navigation.ts`: `Home→Beranda`, `Games→Game`, `Discover→Jelajah`, `Leaderboards→Papan Skor`, `Account→Akun` (samakan persis dengan istilah yang sudah dipakai `BottomNavbar.tsx` supaya user tidak melihat dua istilah beda untuk tujuan yang sama).
- Ganti `<h2>Discover</h2>` → `<h2>Jelajah</h2>` di `src/app/discover/page.tsx`.
- Ganti `<h2>Account</h2>` → `<h2>Akun</h2>` di `src/app/account/page.tsx`.
- Ganti `<h2>Profile</h2>` → `<h2>Profil</h2>` di `src/app/account/profile/page.tsx`, dan cek label `"Profile"` di array `SECTIONS` (`src/app/account/page.tsx` baris ~8) juga perlu diganti ke `"Profil"` supaya konsisten dengan menu di bawahnya yang sudah Indonesia.
- Item (e) — **jangan diubah tanpa konfirmasi**, kemungkinan tagline sengaja.

**Acceptance criteria:** grep ulang `>Home<|>Games<|>Discover<|>Account<|>Leaderboards<|>Profile<` di `src/` — hasilnya nihil kecuali item (e) yang sudah dikonfirmasi sengaja.

---

## 3. Temuan prioritas sedang (utang teknis / konsistensi)

### 3.1 `globals.css` — banyak class didefinisikan ulang di tempat terpisah

Selama sesi ini, class-class berikut ditemukan punya **lebih dari satu blok rule terpisah** di file yang sama (`src/app/globals.css`), saling override tergantung urutan baris — bukan di-`@media`-kan dengan jelas, tapi memang dua deklarasi dasar berbeda untuk selector yang sama:

- `.fun-card` — muncul di sekitar baris 1765 (definisi lama/awal) DAN baris 2013 (override menengah) DAN baris 3659 (override final yang sekarang benar-benar dipakai)
- `.game-tile` — sempat ada override 4:3 terpisah dari base 1:1 (sudah diperbaiki sesi ini, lihat §5, tapi pola dua-definisi-terpisah masih ada risikonya untuk class lain)
- `.bottom-nav__item` — style warna didefinisikan ulang di baris ~3520 terpisah dari blok layout utama di ~2236
- `.hero-product__stage`, `.hero-product__target` dll — untungnya cuma satu definisi masing-masing (tidak kena isu ini), tapi disebut di sini sebagai KONTRAS: kalau nanti ditambah override untuk fix §2.1, jangan bikin definisi kedua yang terpisah jauh dari definisi pertama — edit di tempat, atau kalau terpaksa pisah, taruh langsung di bawah blok aslinya dengan komentar jelas kenapa.

**Kenapa ini penting dilaporkan (bukan cuma "kode jorok"):** ini adalah AKAR PENYEBAB kenapa selama sesi perbaikan sebelumnya user berulang kali bilang "kok kartunya beda-beda", "kok masih ada nomornya" — bukan karena ada yang sengaja dibedakan, tapi karena rule lama menumpuk dan gampang lupa satu tempat pas mau menyamakan sesuatu di seluruh sistem. Selama file ini belum dirapikan jadi satu definisi per komponen, risiko drift serupa akan terus muncul di perubahan berikutnya.

**Rekomendasi (skala lebih besar, tidak untuk sekali PR kecil):** audit menyeluruh `globals.css` untuk cari selector yang punya >1 blok definisi (bisa pakai `grep -n "^\.classname"` per nama class, atau tooling lint CSS seperti `stylelint` dengan rule `no-duplicate-selectors`), lalu gabungkan jadi satu blok per komponen. Ini pekerjaan terpisah dan lebih besar dari dua fix di §2 — jangan digabung dalam PR yang sama supaya diff tetap mudah di-review.

### 3.2 Sistem ikon campur: Unicode glyph vs SVG custom

Ditemukan pemakaian karakter Unicode mentah sebagai "ikon" berdampingan dengan sistem SVG custom yang sudah rapi (`src/components/Icon.tsx`, `src/components/GameIcon.tsx`):

| Glyph | Lokasi | Class CSS terkait |
|---|---|---|
| `⌕` (search) | `src/components/games/GameCatalog.tsx`, `src/components/discover/DiscoverShell.tsx` | `.catalog-search__icon` (`src/app/globals.css` ~baris 3734) |
| `★` (skor) | cek `HomePage.tsx` bagian skor total (`⭐ {totalScore}` atau serupa — grep `"⭐"` atau `"★"` di `src/components`) | — |
| `•••` (menu) | `src/components/leaderboard/LeaderboardRow.tsx` baris ~68, class `.lb-dots` | `.lb-dots` |
| `→` (panah CTA) | banyak tempat, mis. `.fun-card__play b`, tombol "Mainkan" | berbagai |

**Kenapa ini masalah nyata (bukan cuma gaya penulisan):** render Unicode glyph bergantung pada font sistem device — bisa beda ukuran/posisi vertikal antar device/browser. Kasus nyata yang KETEMU LANGSUNG saat audit: icon `⌕` (search) posisinya sempat kelihatan melayang di ATAS kotak input, bukan nempel rapi di dalamnya — meskipun setelah hard-reload ternyata di kondisi *sekarang* posisinya SUDAH benar (lihat §4, ini termasuk kasus yang sempat dicurigai bug tapi ternyata cache basi). Karena render glyph ini font-dependent, risiko dia meleset lagi di device/browser lain (terutama Android/Windows dengan font default berbeda) tetap ada selama masih pakai karakter Unicode + `rotate()`/`translateY()` manual yang di-tune untuk satu metrik font tertentu.

**Rekomendasi:** ganti keempat glyph di atas dengan SVG inline eksplisit (ukuran & viewBox tetap, tidak bergantung font), idealnya lewat komponen `Icon`/`GameIcon` yang sudah ada supaya satu sistem ikon konsisten di seluruh app.

**Prioritas:** rendah-sedang — tidak ada bukti visual rusak di kondisi kode SAAT INI (sudah dicek fresh), tapi ini technical debt yang berisiko regresi random di device lain. Boleh dikerjakan belakangan.

---

## 4. BUKAN bug — sudah diverifikasi sebagai artefak cache (jangan dikerjakan ulang)

Semua ini SEMPAT terlihat rusak sebelum hard-reload, tapi TERBUKTI benar setelah hard-reload — tidak perlu ada perubahan kode:

1. **`/leaderboards` teks numpuk tanpa spasi** ("1gianBeat Motion5400•••") — CSS `.lb-row` (grid dengan `gap:14px`) sudah benar di source, cache basi yang bikin browser skip CSS-nya.
2. **Search icon "⌕" melayang di luar kotak input** di `/games` dan `/discover` — CSS `.catalog-search` (`position:relative`) + `.catalog-search__icon` (`position:absolute; left:15px; top:50%`) sudah benar, sama, cache basi.
3. **Grid 2 kolom halaman detail game (`/games/[slug]`) kosong separuh, konten numpuk ke bawah** — `@media (min-width:768px) { .game-detail__hero { grid-template-columns: ... } }` sudah benar dan aktif, terverifikasi lewat `getComputedStyle` sebelum & sesudah hard-reload (lihat detail di §1).
4. **Ghost/duplikat top-nav bar muncul menimpa konten tengah halaman saat scroll** di screenshot — ini murni ARTEFAK ALAT SCREENSHOT (kombinasi `position: sticky` + `backdrop-filter: blur()` yang tidak sempurna di-composite ulang oleh Chrome DevTools Protocol saat capture di tengah scroll). Diverifikasi lewat `getBoundingClientRect()` langsung di DOM — posisi asli elemen selalu benar (`top: 0`, tidak ada `transform` di ancestor manapun yang bisa merusak `position: sticky`). Manusia yang scroll manual TIDAK akan melihat ini.

---

## 5. Perubahan yang SUDAH diterapkan sesi ini (uncommitted, siap direview)

`git status --porcelain` saat ini:
```
 M src/app/globals.css
 M src/components/GameArtwork.tsx
 M src/components/HomePage.tsx
 M src/components/discover/DiscoverShell.tsx
 M src/components/games/GameCatalog.tsx
 M src/components/nav/BottomNavbar.tsx
?? public/artwork/                 (10 game art baru .webp + 1 mascot reference, ~35-60KB masing-masing)
?? MIGRATE_TO_NEW_REPO.ps1         (tidak terkait, file lama, abaikan)
```

Ringkasan per file:
- **`GameArtwork.tsx`** — diganti total dari SVG abstrak hand-drawn jadi `<Image>` (`next/image`) yang menunjuk ke 10 file WebP baru di `public/artwork/` (satu ilustrasi 3D-render per game, karakter maskot konsisten). Signature komponen (`{ slug, label }`) tidak berubah, jadi semua caller (`HomePage.tsx`, `GameCatalog.tsx`, `DiscoverShell.tsx`, halaman detail) otomatis dapat gambar baru tanpa perlu diubah.
- **`globals.css`** — `.fun-card__art`, `.game-tile`, `.game-tile__art`, `.game-detail__art` disatukan jadi treatment yang sama: persegi (`aspect-ratio: 1/1`), full-bleed, `object-fit: cover`. Badge nomor `.fun-card__number` di CSS dibiarkan (dead code, tidak dipanggil lagi dari JSX). `.hero-product__mascot` baru ditambahkan untuk render foto mascot di hero. `.bottom-nav` dirombak: label teks dihapus dari render (`aria-label` tetap ada untuk aksesibilitas), state aktif jadi pill kecil 42×42 yang cuma melingkupi ikon (bukan kotak lebar penuh seperti sebelumnya).
- **`HomePage.tsx`** — `HeroScene()` diganti dari CSS stick-figure jadi `<img>` foto mascot (`/artwork/_mascot-reference.webp`). Badge `fun-card__number` (nomor urut card) dihapus dari render.
- **`GameCatalog.tsx`** (halaman `/games`) & **`DiscoverShell.tsx`** (halaman `/discover`) — kartu game (`GridTile`/`GameTile`) diganti total dari struktur `.game-tile` (overlay teks di atas gambar, rasio 4:3) jadi struktur `.fun-card` yang PERSIS SAMA dengan homepage (gambar persegi di atas, body putih di bawah berisi ikon+judul+meta+tombol "Mainkan"). Ini yang membuat tampilan katalog & discover sekarang identik dengan homepage sesuai permintaan user.
- **`BottomNavbar.tsx`** — label teks (`<span>{label}</span>`) dihapus dari render untuk `Item` dan tombol Discover; ikon dibungkus `<span className="bottom-nav__item-mark">` baru untuk styling pill aktif yang lebih kecil.

**Belum di-commit ke git** — menunggu konfirmasi visual dari user (pola kerja sesi ini: selalu minta user cek tampilan dulu sebelum commit, karena sempat 3x hand-coded SVG mascot sebelumnya ditolak user).

---

## 6. Cakupan yang BELUM diaudit (di luar sesi ini)

Supaya tidak ada asumsi salah bahwa audit ini menyeluruh — halaman/area berikut BELUM dicek sama sekali (baik live browser maupun baca kode) di sesi ini:

- `/account/players`, `/account/preferences`, `/account/security`, `/account/about`, `/account/delete`
- `/discover/articles`, `/discover/articles/[slug]`, `/discover/products`
- `/leaderboards/[slug]` (halaman leaderboard per-game, beda dari `LeaderboardGame.tsx` yang sempat dicek sekilas)
- `/admin/dashboard`
- Halaman gameplay itu sendiri (kanvas kamera/vision tracking) — di luar scope "kartu & navigasi", dan `GameShell.tsx` sengaja MENYEMBUNYIKAN `BottomNavbar`/`TopNavbar` saat main, jadi tidak relevan untuk audit ini
- Dark mode (`html[data-theme="dark"]`) — banyak override dark-theme ada di `globals.css` tapi belum divisualkan langsung; berpotensi ada inkonsistensi serupa yang belum ketahuan
- Aksesibilitas (kontras warna, navigasi keyboard, screen reader) — di luar scope audit visual ini, sebaiknya jadi audit terpisah

---

## 7. Verifikasi & definition of done

Setelah mengerjakan §2.1 dan/atau §2.2, jalankan (dari root folder proyek):

```bash
npm run typecheck
node scripts/validate-structure.mjs
node scripts/audit-source.mjs
```

Ketiganya harus keluar bersih (typecheck tanpa error; `audit-source.mjs` melaporkan `"findings":0`) — ini standar yang dipakai konsisten sepanjang sesi kerja sebelumnya di proyek ini.

**Manual QA checklist (WAJIB hard-reload sebelum tiap cek, lihat §1):**
- [ ] `/` — mobile (≤430px): badge "MOVE 10" tidak menabrak wajah karakter
- [ ] `/` — desktop (≥1200px): badge "MOVE 10" tidak menabrak wajah karakter, tidak terpotong di tepi
- [ ] Semua label menu (top-nav desktop, bottom-nav mobile, judul `<h2>` tiap halaman) konsisten Bahasa Indonesia
- [ ] `npm run typecheck`, `validate-structure.mjs`, `audit-source.mjs` bersih

---

## 8. Referensi cepat — file yang relevan

| File | Peran |
|---|---|
| `src/components/HomePage.tsx` | Homepage, termasuk `HeroScene()` |
| `src/components/nav/TopNavbar.tsx` | Nav desktop (pakai `PRIMARY_NAV`) |
| `src/components/nav/BottomNavbar.tsx` | Nav mobile (label lokal, sudah Indonesia) |
| `src/lib/navigation.ts` | `PRIMARY_NAV` — sumber label nav desktop, masih Inggris |
| `src/app/discover/page.tsx`, `src/app/account/page.tsx`, `src/app/account/profile/page.tsx` | Judul `<h2>` yang masih Inggris |
| `src/components/GameArtwork.tsx` | Render artwork game (sudah pakai WebP baru) |
| `src/components/games/GameCatalog.tsx`, `src/components/discover/DiscoverShell.tsx` | Kartu game di `/games` & `/discover` (sudah pakai `.fun-card`) |
| `src/components/leaderboard/LeaderboardRow.tsx` | Baris leaderboard, termasuk glyph `•••` |
| `src/app/globals.css` | Semua CSS di atas — file besar, lihat nomor baris yang disebut per temuan |
| `public/artwork/` | Aset gambar game + `_mascot-reference.webp` |
| `docs/AUDIT_2026-08-16.md` | Audit sebelumnya (topik berbeda: vision tracking, skeleton, bukan visual UI) |
