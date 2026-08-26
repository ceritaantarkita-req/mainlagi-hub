# Product Requirements Document

## Mainlagi Hub Motion Learning Hub

- **Status:** Approved direction. Implementation specs live in `docs/roadmap.md` and `docs/tickets.md`.
- **Owner:** Mainlagi Hub
- **Primary language:** Bahasa Indonesia
- **Target platforms:** Responsive web (SSR), PWA, Android, iOS (Capacitor)
- **Source of truth:** This document defines the *what* and *why*. The *how* is delegated to `docs/adr-0001-architecture.md` and `docs/roadmap.md`.

---

## 1. Product Summary

Mainlagi Hub Motion Learning Hub adalah platform permainan edukasi berbasis gerakan tangan dan tubuh. User bermain di browser dengan kamera, memilih permainan berdasarkan kategori/umur, membaca artikel edukasi, melihat leaderboard, mengelola akun, dan membagikan pencapaian.

Prinsip utama: **produk harus bisa dipakai tanpa login.** Login hanya dibutuhkan untuk menyimpan progress antar-perangkat, mengikuti leaderboard online (fase berikutnya), dan mengelola profile.

Produk dibangun web-first dengan server-side rendering. Setelah web stabil, dibungkus menjadi Android/iOS app memakai Capacitor tanpa rewrite game engine.

---

## 2. Problem Statement

Versi saat ini terasa seperti kumpulan halaman game terpisah, bukan satu aplikasi.

Masalah utama:

- Tidak ada navigasi aplikasi yang konsisten (mobile dan desktop).
- Tidak ada mobile bottom navigation.
- Login terlalu menonjol di navbar, mengganggu user baru.
- Homepage belum punya jalur jelas antara bermain, membaca, melihat skor, dan kelola akun.
- Auth memakai JWT di `localStorage`, rentan XSS dan tidak ideal untuk review toko aplikasi.
- Leaderboard lokal belum cukup untuk kompetisi lintas perangkat.
- Affiliate, artikel, dan discovery belum punya struktur informasi yang jelas.
- Data akun dan privacy belum punya lifecycle lengkap.
- Tidak ada jalur eksplisit menuju Android/iOS launch.
- SEO teknis, structured data, dan AI-search visibility belum jadi bagian dari model produk.

---

## 3. Product Goals

### 3.1 Goals

1. Membuat pengalaman terasa seperti satu aplikasi, bukan kumpulan game.
2. User bisa mulai bermain dalam satu atau dua tindakan, tanpa login.
3. Navigasi mobile mudah dijangkau dengan ibu jari.
4. Account aman, memakai server cookie session.
5. Leaderboard family + personal yang rapi, dapat dibagikan.
6. Menambahkan content discovery untuk game, artikel, dan produk affiliate.
7. Akun parent + player profile dengan privacy produk anak.
8. Fondasi SEO, GEO, dan AI search tanpa artikel tipis.
9. Game engine dan vision runtime tetap reusable untuk web dan app wrapper.
10. Privacy, terms, deletion, dan store requirements siap sebelum mobile launch.

### 3.2 Non-goals pada fase awal

- Rewrite seluruh game ke React Native.
- Multiplayer real-time antar-perangkat.
- Chat atau social feed.
- Pembayaran atau subscription.
- Marketplace affiliate penuh.
- Moderasi user-generated content.
- Anti-cheat sempurna untuk seluruh game.
- Push notification sebagai requirement MVP.
- Leaderboard online publik pada launch (baru di fase berikutnya).

---

## 4. Target Users

### 4.1 Parent / guardian

- Cepat memahami produk.
- Yakin kamera tidak di-upload.
- Memilih game sesuai umur dan kemampuan anak.
- Melihat progress dan skor.
- Mengatur profile anak.
- Menghapus akun dan data.

### 4.2 Anak

- Bisa langsung bermain tanpa banyak membaca.
- Tombol besar dan target interaksi jelas.
- Feedback warna, suara, gerakan mudah dipahami.
- Tidak dipaksa membuat akun.
- Tidak melihat menu admin atau privacy yang mengganggu permainan.

### 4.3 Guru / presenter

- Memakai AirBoard dengan cepat.
- Memahami input camera dan keyboard fallback.
- Memakai layar besar.
- Akses game dan alat kelas tanpa account flow yang berat.

### 4.4 Search user

- Menemukan artikel berdasarkan pertanyaan nyata.
- Menemukan game berdasarkan umur atau skill.
- Menemukan perlengkapan kamera atau aktivitas.

---

## 5. Product Principles

1. **Play first.** User boleh mencoba game sebelum signup.
2. **Parent-controlled account.** Data akun milik parent/guardian.
3. **Privacy by default.** Kamera diproses lokal dan tidak disimpan; tidak ada biometrik dikirim.
4. **One shell, many games.** Semua game memakai app shell dan visual language sama.
5. **Server is authoritative.** Auth, score online, season, dan permission ditentukan server. Jam device bukan sumber kebenaran.
6. **Content must answer intent.** Artikel menjawab pertanyaan spesifik, bukan filler SEO.
7. **Progressive enhancement.** Kamera, Web Share, PWA, native API punya fallback.
8. **Mobile-first, desktop-complete.** Mobile memakai bottom navigation, desktop memakai top navigation.
9. **Stable URLs.** URL game, artikel, leaderboard, dan share card tidak berubah-ubah.
10. **Accessibility adalah kualitas produk.** Keyboard, screen reader, contrast, focus, reduced motion, zoom.

---

## 6. Information Architecture

### 6.1 Public routes

```text
/                                    Home
/games                               Game catalog
/games/[slug]                        Game detail
/play/[slug]                         Gameplay
/discover                            Search + curated
/discover/products                   Affiliate products
/discover/articles                   Article list
/discover/articles/[slug]            Article detail
/leaderboards                        Leaderboard (all games, current season)
/leaderboards/[gameSlug]             Leaderboard satu game (current season)
/about                               About Mainlagi
/faq                                 FAQ publik
/privacy                             Privacy policy
/terms                               Terms of service
/cookie-policy                       Cookie policy
/parental-consent                    Parental consent info
```

> Keputusan kunci: `/about` dan `/faq` adalah satu sumber kebenaran **publik**. Section ini tidak diduplikasi di `/account/about` atau `/account/faq`. Akun hanya berisi pengaturan yang bersifat personal.

### 6.2 Authentication routes

```text
/login
/signup
/forgot-password
/reset-password
/auth/callback
```

### 6.3 Account routes

```text
/account
/account/profile
/account/players
/account/preferences
/account/security
/account/delete
```

### 6.4 Admin routes (owner-only)

```text
/admin
/admin/dashboard        Analytics, grafik, performa
/admin/products         Kelola affiliate (foto + deskripsi + link Shopee)
/admin/articles         Kelola artikel
/admin/games            Kelola katalog game
/admin/users            Kelola akun
```

**Admin hanya boleh diakses oleh pemilik (owner) aplikasi.** Bukan multi-admin shared.

Admin adalah **full analytics dashboard**, bukan sekadar CRUD sederhana. Kontennya mencakup:

- Data pengguna (jumlah akun, signup, retention, growth).
- Data gameplay (sesi dimainkan, durasi, per game, per kategori).
- Data performa teknis (camera startup failure, model load failure, error rate, web vitals).
- Data leaderboard (jumlah pemain, skor tertinggi, distribusi).
- Data content (artikel ditayangkan, affiliate click, CTR).
- Grafik dan trend waktu.

Admin dilindungi server-side berdasarkan role `owner` di database. Hiding link di frontend bukan otorisasi.

Keputusan kunci: `audit_logs` hanya ditulis dari server. Admin tidak boleh menjadi otorisasi hanya karena email cocok dengan allowlist di frontend. Akses dashboard dibatasi satu identitas owner yang dipilih server-side.

### 6.5 Route conflict resolution

- `[weekKey]` **tidak** dipakai di canonical URL. Canonical leaderboard adalah `/leaderboards` dan `/leaderboards/[gameSlug]`. History/arsip diakses via query string `?week=YYYY-WNN` atau halaman arsip terpisah, agar canonical URL tetap bersih dan tidak punya trailing segment opsional yang membingungkan search engine.
- `/games` adalah sumber kebenaran katalog game. `/discover` adalah layar pencarian + kurasi yang menautkan ke `/games/[slug]`. Sebuah game boleh muncul di keduanya.
- `/play/[slug]` dipertahankan agar link lama tidak rusak.

### 6.6 Legacy route policy

- `/papan-skor` → redirect `301` ke `/leaderboards`.
- `/go/[slug]` dipertahankan untuk affiliate redirect, tapi harus HTTPS-only, host allowlist, dan rate limited.
- `/play/[slug]` dipertahankan.

---

## 7. Navigation Requirements

### 7.1 Primary navigation (5 items)

| Label | Icon | Route | Tujuan |
|---|---|---|---|
| Home | Rumah | `/` | Dashboard dan entry |
| Games | Game console | `/games` | Katalog permainan |
| Discover | Search | `/discover` | Search, artikel, produk |
| Leaderboards | Trophy | `/leaderboards` | Skor dan ranking |
| Account | Profile | `/account` | Profile, pengaturan, auth |

### 7.2 Mobile bottom navigation

- Fixed/floating di bawah viewport, menghormati safe-area inset.
- Tinggi minimum 64 px, hit area tiap item minimal 44 px.
- Maksimal lima item, label selalu tampil (bukan icon-only).
- Active item punya filled background atau accent shape yang jelas.
- Disembunyikan selama gameplay fullscreen jika menutup kontrol / camera stage.
- Tidak menutup modal, keyboard, preflight, atau result dialog.
- `padding-bottom: env(safe-area-inset-bottom)`.
- Bottom content spacer agar konten tidak tertutup nav.

### 7.3 Desktop top navigation

- Top navbar floating dengan max-width content container.
- Tidak menampilkan Google login.
- Menu: Home, Games, Discover, Leaderboards, Account.
- Admin hanya muncul untuk admin yang login, atau tetap di direct route.
- Navbar accessible dengan keyboard.

### 7.4 Scroll glass behavior

```text
top      → solid surface
scrolled → transparent glass
```

- Threshold default 16 px.
- Background scrolled memakai alpha surface.
- `backdrop-filter: blur()` hanya enhancement, bukan satu-satunya mekanisme kontras.
- Border dan shadow tetap menjaga keterbacaan di background terang/gelap.
- Tidak memakai `transition: all`.
- State scroll diimplementasikan satu kali di shared shell.
- `prefers-reduced-motion` mematikan animasi transisi.

### 7.5 Account access

- Tidak ada tombol login besar di top navbar.
- Account nav item menampilkan avatar/initial bila login.
- Guest dikirim ke `/account` yang menampilkan CTA signup/login.
- Guest tetap bisa bermain dan membaca konten.

---

## 8. Page Requirements

### 8.1 Home

Tujuan: membuat user bermain secepat mungkin.

Prioritas konten:

1. Brand dan headline singkat.
2. CTA utama `Mulai bermain`.
3. Featured games.
4. Continue playing / recently played (hanya jika ada riwayat lokal).
5. Weekly score summary (jika login).
6. Shortcut leaderboard.
7. Featured article / discover content.
8. Privacy notice singkat.

Home tidak menampilkan seluruh detail setiap game.

Acceptance criteria:

- User guest menemukan CTA bermain tanpa scroll panjang.
- Tidak ada visual decoration yang tidak menjelaskan fungsi.
- Mobile tidak horizontal overflow.
- Hero desktop tidak menggeser katalog terlalu jauh.
- Semua CTA punya focus state dan hit area cukup.

### 8.2 Games catalog (`/games`)

Filter:

- Umur.
- Kategori belajar.
- Aktivitas tangan / tubuh.
- Satu atau dua pemain.
- Durasi.
- Tingkat kesulitan.

Search game melakukan filtering tanpa menghapus direct URLs.

Game card minimal: nama, deskripsi pendek, age range, player count, input mode, status ready/beta, CTA `Lihat game` atau `Mainkan`.

### 8.3 Game detail (`/games/[slug]`)

Konten: hero game, cara bermain, persiapan kamera, umur dan jumlah pemain, durasi, skill yang dilatih, privacy note, CTA `Mulai bermain`, related games, related articles.

### 8.4 Gameplay (`/play/[slug]`)

Harus:

- Menyembunyikan bottom nav jika mengganggu.
- Punya exit yang jelas.
- Punya preflight camera.
- Punya mouse/keyboard fallback.
- Menangani permission denied.
- Menangani camera disconnect.
- Menangani model loading failure.
- Membersihkan camera stream saat keluar route.
- Menyimpan skor lokal.
- Menyimpan skor cloud hanya jika user login dan session valid.

### 8.5 Discover (`/discover`)

Subcategory:

```text
Semua
Game
Produk
Artikel
Tips orang tua
Aktivitas belajar
```

Search mencari title, summary, tag, kategori, keyword.

Empty state menjelaskan tidak ada hasil dan menautkan kategori terkait.

### 8.6 Products (`/discover/products`)

**Affiliate hanya dikelola oleh owner.** Tidak ada marketplace atau user yang menambahkan produk.

Card produk menampilkan **foto produk + deskripsi singkat saja**.

- Menampilkan gambar produk dan satu atau dua kalimat deskripsi.
- Saat gambar diklik → `redirect` ke link Shopee yang sesuai produk (link diberikan owner).
- Tetap ada disclosure affiliate.
- Tidak ada tombol/tracking berlebihan pada card.

Requirements produk:

- Destination hanya HTTPS (Shopee host).
- Host allowlist Shopee.
- `/go/[slug]` melakukan validation dan redirect.
- Click logging rate-limited.
- Tidak menyimpan data berlebihan.
- Owner tidak boleh memasukkan executable/arbitrary URL; redirect hanya ke host yang disetujui.

### 8.7 Articles (`/discover/articles/[slug]`)

Konten: title, summary, author, published date, updated date, reading time, content, table of contents (jika panjang), FAQ (jika relevan), related games, related articles, breadcrumb, share actions.

Artikel tidak boleh dibuat hanya untuk mengisi keyword. Setiap artikel punya target search intent dan reviewer.

### 8.8 Leaderboards (`/leaderboards`)

Menampilkan current season/week, countdown server-based, tab/filter game, top 3 hierarchy, ranking list, user's own rank, empty state, share CTA.

Score card share menampilkan: alias pemain, nama game, rank, score, week label, brand Mainlagi, link canonical leaderboard.

Tidak menampilkan wajah, frame kamera, email, nomor HP, atau data sensitif.

**Scope launch:** family + personal. Leaderboard online publik ditambahkan pada fase berikutnya.

### 8.9 Account (`/account`)

Berisi: profile, player profiles, preferences, security, delete account, logout.

Tidak berisi duplikasi `/about` atau `/faq`; ini tetap di route publik.

---

## 9. Authentication and Account

### 9.1 Auth strategy (KEPUTUSAN TERKUNCI)

- Pindah ke **server cookie session** (Supabase SSR pattern + middleware).
- `HttpOnly` cookie, tidak bisa dibaca JavaScript.
- Client components memakai browser Supabase client.
- Server components dan route handlers memakai server Supabase client.
- `middleware.ts` melakukan session refresh.
- Google login tidak ditampilkan di navbar; dipindah ke Account.
- Email/password disediakan sebagai provider utama.
- Jika login sosial ditambahkan ke iOS app, review requirement Sign in with Apple.

Lihat `docs/adr-0001-architecture.md`.

### 9.2 Session security

- `HttpOnly` cookie session di production.
- Refresh session aman terhadap expired token.
- Logout menghapus local session dan invalidate remote session.
- Tidak memasukkan token ke logs.
- Tambahkan CSP dan frame protection (`frame-ancestors 'none'`).

### 9.3 Profile

Account profile: display name, email (read-only atau change flow terverifikasi), phone optional, locale, theme, created date.

Phone tidak wajib untuk MVP. Jika dipakai, harus ada verification, recovery policy, dan rate limit OTP.

### 9.4 Player profile

Mewakili anak/pemain, bukan login identity. Field: alias, age group, grade optional, avatar key (asset internal), created at, deleted at / hard delete sesuai retention.

Jangan minta email anak atau tanggal lahir lengkap bila age group cukup.

### 9.5 Delete account

Flow:

1. `/account/delete`.
2. Sistem menjelaskan data yang dihapus.
3. User mengetik confirmation phrase atau re-authenticate.
4. Deletion server-side.
5. Semua session di-invalidate.
6. Redirect ke confirmation page.
7. Deletion timestamp dicatat tanpa menyimpan data pribadi lebih dari perlu.

Deletion mencakup profile, player profiles, scores, progress, preferences, dan auth user sesuai retention/legal.

---

## 10. Leaderboard and Scoring

### 10.1 Weekly season

Tidak menghapus data lama; pakai season partition.

```text
week_key = ISO year + ISO week, dihitung di timezone Asia/Jakarta
starts_at = server timestamp
ends_at = server timestamp
```

- Reset mingguan: **Senin 00:00 WIB** (Asia/Jakarta).
- `week_key` dihitung di Asia/Jakarta, bukan UTC, agar sesuai pasar utama Indonesia.
- Countdown membaca `ends_at` dari server. Jam device bukan source of truth.

### 10.2 Ranking rules (online, fase berikutnya)

- Ranking per game, per season.
- Skor tertinggi menang.
- Tie-breaker: skor lebih dulu tercapai menang.
- Hanya skor verified masuk leaderboard publik.
- User melihat skor sendiri walau belum masuk top 100.
- Deleted account diganti label anonim sesuai policy.

### 10.3 Score submission (online, fase berikutnya)

Client kirim hasil session, bukan angka bebas. Server validasi session ownership, slug whitelist, score bounds, duration range, session nonce, duplicate, rate limit, player profile ownership, season validity.

Status: `pending` / `verified` / `rejected`.

### 10.4 Data model recommendation

```text
profiles
player_profiles
games
game_sessions
game_scores
leaderboard_seasons
leaderboard_entries
articles
article_relations
affiliate_items
affiliate_clicks
audit_logs
```

### 10.5 Share

Gunakan Web Share API bila tersedia. Fallback: WhatsApp, Telegram, Threads, copy link, native share sheet di Capacitor. Share URL canonical dan tidak memuat token private.

---

## 11. Discover Content and CMS

### 11.1 Content types

**Products:** slug, title (deskripsi singkat), image, destination URL (Shopee), active, sort order, disclosure. Dikelola owner saja.

**Articles:** slug, title, excerpt, content, author, category, tags, cover image, locale, status draft/published, published_at, updated_at, canonical URL, SEO title, SEO description, FAQ data optional.

### 11.2 Admin publishing workflow

1. Draft dibuat.
2. Slug divalidasi.
3. Metadata SEO diperiksa.
4. Content reviewer memeriksa klaim.
5. Preview dibuka.
6. Publish oleh admin.
7. Updated date dicatat.

### 11.3 Article quality gate

Setiap artikel punya: search intent, audience, primary question, direct answer, supporting explanation, internal link ke game, related content, author/reviewer, update date, tanpa klaim edukasi/medis tanpa sumber.

---

## 12. SEO, GEO, and AI Search

### 12.1 Technical SEO

- SSR/SSG untuk konten publik (aplikasi memakai server).
- Metadata unik per route.
- Canonical URL.
- `sitemap.xml`.
- `robots.txt`.
- Open Graph image.
- Twitter card.
- Breadcrumb.
- Core Web Vitals.
- Explicit image dimensions.
- Hindari duplicate locale URL.

### 12.2 Structured data

Gunakan schema hanya bila konten cocok: `Organization`, `WebSite`, `VideoGame`, `ItemList`, `Article`, `FAQPage`, `BreadcrumbList`.

Validate structured data sebelum release.

### 12.3 Localization

```text
/id/...
/en/...
```

- Bahasa Indonesia default.
- English opsional pada rilis pertama, tapi arsitektur harus mendukung.
- `hreflang` antar locale.
- Locale disimpan di cookie dan account preference.
- User-selected locale mengalahkan browser locale.
- Metadata ikut locale.
- Artikel terjemahan punya URL terpisah.

### 12.4 AI-search readability

- Jawaban utama muncul di awal artikel.
- Heading berbentuk pertanyaan saat sesuai intent.
- Definisi dan facts tersusun jelas.
- FAQ tidak dibuat spam.
- Author dan update date terlihat.
- Klaim edukasi punya sumber atau reviewer.
- Internal links memakai anchor text deskriptif.
- Jangan sembunyikan informasi penting dalam client-only UI.

---

## 13. Privacy, Safety, and Compliance

### 13.1 Required public documents

```text
/privacy
/terms
/cookie-policy
/account/delete
/data-request
/parental-consent
```

### 13.2 Camera policy

- Frame kamera diproses lokal di browser/WebView.
- Tidak ada video upload.
- Tidak menyimpan frame kamera.
- Tidak memasukkan wajah ke share card.
- Permission dijelaskan sebelum request.
- Fallback mouse/keyboard jika kamera gagal.
- Tidak mengirim face/hand landmark sebagai analytics.

### 13.3 Child data policy

- Parent account menjadi data controller contact.
- Child profile memakai alias.
- Age group lebih disukai daripada birth date lengkap.
- Tidak minta email anak.
- Tidak menampilkan data anak ke publik tanpa pilihan parent.
- Sediakan account deletion.
- Sediakan contact privacy.
- Tetapkan retention period.
- Minimalkan analytics.

### 13.4 Compliance review

Legal review mencakup: Indonesia PDP, GDPR/GDPR-K (jika EU), COPPA (jika AS), Google Play Families policy, Apple App Store privacy requirements, Apple Kids Category (jika dipilih).

Dokumen legal tidak selesai hanya karena halaman dibuat. Data flow dan vendor harus cocok dengan isi dokumen.

---

## 14. Mobile App Strategy

### 14.1 Path

1. Stabilkan responsive web (SSR).
2. Tambahkan PWA foundation.
3. Uji camera/vision pada mobile browser.
4. Bungkus memakai Capacitor.
5. Tambahkan native share dan lifecycle hooks.
6. Submit Android.
7. Submit iOS setelah QA camera/memory/privacy/deletion.

### 14.2 Why not rewrite to React Native

- Game engine TypeScript reusable.
- UI existing dipertahankan.
- Rewrite menaikkan risiko bug camera/gameplay.
- Web tetap diperlukan untuk SEO dan content.
- Capacitor memberi jalur launch lebih cepat.

### 14.3 Native requirements

Camera permission text, microphone disabled, safe area, back navigation, background/foreground, native share, deep links, app icons, launch screen, store screenshots, privacy URL, terms URL, support URL, account deletion URL, data safety declarations, crash reporting review.

### 14.4 Native risk gate

Uji: iPhone Safari/WebView camera, Android low-end, permission denied, permission revoked, app background saat camera aktif, back saat game jalan, orientation change, memory pressure, offline, model load failure, account deletion, share.

---

## 15. Technical Architecture

### 15.1 Shared shell

Komponen: `AppShell`, `TopNavbar`, `BottomNavbar`, `ScrollGlassHeader`, `PageContainer`, `ThemeProvider`, `LocaleProvider`, `AccountMenu`.

### 15.2 Separation boundary

```text
AppShell
  ├── Home
  ├── Games
  ├── Discover
  ├── Leaderboards
  └── Account

GameShell
  ├── Preflight
  ├── VisionRuntime
  └── GameModule
```

Global navigation tidak bergantung pada detail internal game.

### 15.3 Reusable game data

Static source data boleh dipakai pada MVP. Siapkan migration path ke DB/CMS bila catalog perlu diedit admin.

**Data layer (lihat `docs/adr-0002-database-layer.md`):** aplikasi memakai repository interface. Ada dua implementasi: **local/mock** untuk develop (tanpa Supabase) dan **Supabase** untuk production. Supabase connect ditunda; UI tidak boleh bergantung langsung pada backend. Schema SQL ditulis dulu dalam `supabase/migrations/` sebagai satu source of truth, siap `supabase db push`.

### 15.4 Theme system

Preference: `system` / `light` / `dark`. Tidak flash besar saat load. Contrast diuji semua state. Game stage boleh pakai theme sendiri bila diperlukan. Reduced motion dihormati.

### 15.5 Icon system

Satu set icon konsisten: Home, Gamepad, Search, Trophy, Account, Settings, Globe, Sun, Moon, Lock, Share, Arrow, Back, Close. Satu stroke weight, viewBox konsisten, active/inactive jelas, hit area min 44 px. Tidak memakai emoji sebagai icon navigasi. Tidak memakai SVG dekoratif tanpa makna.

---

## 16. Server and API Requirements

### 16.1 Public API

```text
GET  /api/health
GET  /api/games
GET  /api/discover
GET  /api/articles
GET  /api/articles/[slug]
GET  /api/leaderboards
GET  /api/leaderboards/[gameSlug]
POST /api/game-sessions
POST /api/game-scores
POST /api/share-cards
GET  /api/affiliate
GET  /go/[slug]
```

### 16.2 Authenticated API

- Validasi session server-side.
- Account ID tidak diterima mentah dari client tanpa dibandingkan session.
- Player profile ownership diverifikasi.
- Error tidak membocorkan secret/stack trace.
- Rate limit pada login, reset password, score submit, share-card, redirect logging.

### 16.3 Admin API

- Role check server-side.
- Audit log untuk create/update/delete/publish.
- Input validation.
- URL validation.
- Slug uniqueness.
- Draft/published state.
- Tidak memakai frontend email allowlist sebagai authorization utama.

---

## 17. Database and RLS Requirements

Tabel: `profiles`, `player_profiles`, `games`, `game_sessions`, `game_scores`, `leaderboard_seasons`, `leaderboard_entries`, `articles`, `article_relations`, `affiliate_items`, `affiliate_clicks`, `audit_logs`.

> Catatan implementasi (belum dikerjakan): seluruh tabel memakai UUID primary key (`gen_random_uuid()`), foreign key eksplisit, dan index yang diperlukan. Schema disiapkan dalam `supabase/migrations/*.sql` versi terurut, siap `supabase db push`. Akses data dari aplikasi melewati repository interface; Supabase connect dilakukan belakangan. Lihat `docs/adr-0002-database-layer.md`.

RLS:

- User hanya membaca profile sendiri.
- User hanya mengelola player profile sendiri.
- User hanya membaca score sendiri kecuali public leaderboard projection.
- Public leaderboard hanya expose field minimum.
- Affiliate public hanya membaca item active.
- Article public hanya membaca published.
- Admin access berdasarkan role di database.
- Service-role key hanya server-side.
- Migration versioned.
- Policy cleanup eksplisit dan dapat diaudit.

---

## 18. Analytics and Observability

Minimum events: `home_viewed`, `game_opened`, `game_started`, `game_completed`, `camera_permission_granted`, `camera_permission_denied`, `model_load_failed`, `leaderboard_viewed`, `score_shared`, `article_viewed`, `affiliate_clicked`, `signup_completed`, `account_deleted`.

Rules:

- Jangan kirim frame kamera.
- Jangan kirim raw face/hand landmark sebagai analytics.
- Jangan kirim email sebagai event property.
- Dokumentasikan vendor analytics di privacy policy.
- Sediakan opt-out bila diwajibkan.

Operational: API error rate, camera startup failure, model load failure, score rejection rate, leaderboard generation status, article publish failures, redirect error rate, web vitals.

---

## 19. Accessibility Requirements

Keyboard navigation seluruh public UI, visible focus, semantic landmarks, label untuk icon buttons, min target 44x44, contrast WCAG AA, warna bukan satu-satunya sinyal status, text wrapping tidak merusak layout, screen reader label untuk skor/countdown, `aria-live` hanya untuk feedback penting, hormati `prefers-reduced-motion`, jangan kunci zoom tanpa alasan disetujui, form error dekat field dan summary.

---

## 20. Performance Requirements

### Public web

- Homepage initial render cepat di mobile 4G.
- Tidak load MediaPipe sebelum user mulai game.
- Article pages tidak memuat vision runtime.
- Lazy-load image non-critical.
- Preload hanya asset hero yang dipakai.
- Hindari SVG/PNG besar tak teroptimasi.

### Gameplay

- Vision model hanya aktif di `/play/[slug]`.
- Inference frequency punya budget.
- Face model opsional, frekuensi bisa diturunkan.
- Heavy inference tidak membuat UI controls unusable.
- Dispose camera/model saat exit.

### PWA

- Cache shell dan public content dengan strategy terdokumentasi.
- Jangan cache private account response secara publik.
- Update tidak merusak session.
- Offline punya pesan jelas.

---

## 21. Definition of Done

Feature selesai bila:

- Behavior requirement diimplementasikan.
- Loading, empty, error, permission denied, success state tersedia.
- Mobile dan desktop diuji.
- Keyboard/focus diuji.
- Typecheck lulus.
- Lint lulus.
- Unit/integration test relevan lulus.
- E2E flow relevan lulus.
- Tidak ada secret di source/logs.
- RLS/policy diuji bila menyentuh Supabase.
- Metadata/SEO diperbarui bila menyentuh public route.
- Dokumentasi route/data flow diperbarui.
- Diff direview sebelum merge.

---

## 22. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Score dipalsukan | Leaderboard tidak dipercaya | Server validation, bounds, nonce, rate limit |
| Data anak terlalu banyak | Privacy/legal exposure | Parent account, alias, age group, minimization |
| Bottom nav menutup game | Gameplay rusak | Hide in game, safe area, E2E mobile test |
| Glass navbar sulit dibaca | Navigation failure | Contrast, border, opaque fallback |
| Artikel tipis | SEO buruk | Editorial brief dan review gate |
| Kamera gagal di WebView | App store rejection | Device matrix dan fallback input |
| Migration terlalu besar | Delivery lambat | Phase rollout dan backward-compatible routes |
| Affiliate abuse | Database/cost abuse | Rate limit, dedupe, server budget |
| Token localStorage dicuri XSS | Account takeover | Cookie session, CSP, XSS review |
| Weekly reset timezone bug | Ranking salah | Server timestamps Asia/Jakarta dan transition tests |
| Auth migration berisiko | Login rusak | Phase migration, backward-compatible, fallback session lama |

---

## 23. Decisions Requiring User Confirmation (semua sudah dikunci)

1. Auth → **Server cookie session.** ✅
2. Leaderboard launch → **Family + personal dulu.** ✅
3. Email/password sebagai provider utama. ✅
4. Nomor HP opsional, ditunda. ✅
5. Bahasa Inggris dirilis belakangan, arsitektur siap. ✅
6. Indonesia-first. ✅
7. Artikel dikelola via Supabase sederhana (CMS ringan). ✅
8. Affiliate subcategory, bukan pusat produk. ✅
9. Web/PWA lebih dulu, Capacitor setelah stabil. ✅
10. Parental gate tidak wajib untuk trial play, wajib dijelaskan bila akun anak dibuat. ✅

Default recommendation telah disetujui. Detail implementasi ada di `docs/roadmap.md`, `docs/adr-0001-architecture.md`, dan `docs/tickets.md`.
