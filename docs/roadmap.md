# Roadmap — Mainlagi Hub Motion Learning Hub

Dokumen ini mendefinisikan **fase** dan **batas MVP**. Setiap fase memiliki exit criteria. Detail task masuk `docs/tickets.md`.

Keputusan terkunci: auth = server cookie session, leaderboard launch = family + personal. Lihat `docs/adr-0001-architecture.md`.

---

## Phase 0 — Fondasi & app shell

**Tujuan:** membangun navigasi aplikasi yang utuh (mobile bottom nav + desktop floating navbar), jadi semua halaman terasa satu aplikasi.

Scope:

- Design tokens final (warna, typography, spacing, radius, shadow).
- Icon system internal (single stroke weight, viewBox konsisten).
- Router structure baru (`/games`, `/discover`, `/leaderboards`, `/account`).
- `AppShell` + `TopNavbar` + `BottomNavbar` + `ScrollGlassHeader`.
- Mobile bottom nav (5 item, safe-area, active state).
- Desktop floating navbar (glass saat scroll).
- Hapus Google login dari navbar.
- Redirect `/papan-skor` → `/leaderboards`.
- Theme foundation (`system`/`light`/`dark`) tanpa flash besar.
- Safe-area dan content spacer.

Exit criteria:

- Semua route utama dapat dinavigasi dari mobile dan desktop.
- Bottom nav tidak menutup gameplay.
- Tidak ada horizontal overflow di 360/390/768/1280/1440.
- Navbar glass terbaca baik di background terang dan gelap.
- Keyboard navigation berfungsi.

---

## Phase 1A — Data layer foundation (siapkan dulu, belum connect Supabase)

**Tujuan:** menyiapkan semua tabel + UUID + boundary data layer supaya develop jalan penuh tanpa Supabase. Supabase connect ditunda sampai fase ini dan auth siap.

Scope:

- Tulis `supabase/migrations/*.sql`: seluruh tabel (`profiles`, `player_profiles`, `games`, `game_sessions`, `game_scores`, `leaderboard_seasons`, `leaderboard_entries`, `articles`, `article_relations`, `affiliate_items`, `affiliate_clicks`, `audit_logs`) dengan UUID PK, FK, index, enum, trigger, RLS, RPC.
- Repository interface (`ProfileRepository`, `ScoreRepository`, `LeaderboardRepository`, `ArticleRepository`, `ProductRepository`, `AuditRepository`, dll).
- Implementasi **local/mock** untuk develop tanpa backend.
- Flag/source of truth untuk memilih backend (mock vs supabase).
- Auth stub/mock untuk develop hingga auth asli siap.

Exit criteria:

- Semua tabel terdefinisi dengan UUID PK dan RLS yang dapat diuji.
- UI/flow berjalan penuh memakai mock tanpa Supabase running.
- Supabase connect tinggal `supabase db push` + pilih implementasi supabase.
- Tidak ada ui/ui yang bergantung langsung pada backend konkret.

> Catatan: fase ini **belum dikerjakan**. Urutan dilakukan menyusul Phase 0 (shell) sesuai `docs/tickets.md`. Tidak menyambar pembuatan Supabase connect.

---

**Tujuan:** pindah dari client JWT di `localStorage` ke server cookie session (Supabase SSR + middleware).

Scope:

- Tambah `@supabase/ssr`.
- Buat server client + browser client helper.
- Buat `src/middleware.ts` untuk session refresh.
- Refactor `src/lib/auth/supabase-auth.ts`.
- Update `src/lib/auth/progress.ts` dan `supabase-rest.ts`.
- Update `SiteHeader`, `/admin/affiliate`, `/auth/callback`.
- Email/password signup + login + forgot/reset.
- Logout (local + remote session).
- Account page dasar.

Exit criteria:

- Tidak ada token di `localStorage` untuk session production.
- Login → refresh → logout → callback diuji end-to-end.
- RLS tetap melindungi data akun.
- Guest tetap bisa bermain tanpa login.
- Tidak ada secret di source/logs.

---

## Phase 2 — Games catalog & detail

**Tujuan:** katalog game yang bisa difilter dengan halaman detail masing-masing.

Scope:

- `/games` katalog + filter (umur, kategori, tangan/tubuh, player count, durasi, difficulty).
- Search game.
- `/games/[slug]` game detail.
- Integrasi `/play/[slug]` existing (gameplay tidak diubah).
- Related games + related articles.

Exit criteria:

- Semua game existing punya detail page.
- Direct play link tetap berfungsi.
- Filter/search tidak merusak direct URLs.
- Metadata/OG per game diperbarui.

---

## Phase 3 — Account & player profile

**Tujuan:** akun parent + player profile dengan privacy produk anak.

Scope:

- Profile (nama, email read-only, locale, theme).
- Player profiles (alias, age group, grade opsional, avatar).
- Preferences (bahasa, theme, sound, reduced motion).
- Delete account (dengan confirm + deletion server-side + session invalidate).
- `/privacy`, `/terms`, `/cookie-policy`, `/parental-consent`, `/data-request`.
- About (`/about`) dan FAQ (`/faq`).

Exit criteria:

- Guest dapat bermain tanpa akun.
- Authenticated user dapat mengelola profile + player profiles.
- Deletion menghapus data sesuai retention.
- Dokumen privacy terhubung ke halaman yang benar.
- Tidak ada email anak / birth date lengkap diminta.

---

## Phase 4 — Leaderboard family + personal (dengan share)

**Tujuan:** leaderboard lokal yang rapi, dapat dibagikan, tanpa online leaderboard publik.

Scope:

- `/leaderboards` + `/leaderboards/[gameSlug]`.
- Current season/week + countdown server-based.
- Top 3 hierarchy + ranking list + user's own rank.
- Empty state.
- Share card (alias, game, rank, score, week, brand, canonical link).
- Web Share API + fallback WhatsApp/Telegram/Threads/copy link.

Exit criteria:

- Data family/personal tersimpan server-side bila login, lokal bila guest.
- Share card tidak memuat wajah/email/HP.
- Canonical URL bersih (tanpa trailing `weekKey`).
- Countdown membaca `ends_at` dari server.

---

## Phase 5 — Discover & content (products + articles)

**Tujuan:** layer discovery + SEO + AI search.

Scope:

- `/discover` + `/discover/products` + `/discover/articles` + `/discover/articles/[slug]`.
- Search.
- Product affiliate **owner-only**: card foto + deskripsi singkat, klik gambar → redirect link Shopee (https-only, host allowlist, disclosure, rate-limited redirect).
- Article SSR + metadata + structured data.
- **Admin owner-only full dashboard** (`/admin/dashboard`): data pengguna, gameplay, performa teknis, leaderboard, content, grafik dan trend.
- Admin publishing (`/admin/articles`, `/admin/products`) dengan role check server-side (`owner`) + audit log.
- CMS ringan berbasis Supabase (draft → review → publish).

Exit criteria:

- Published article SSR/SSG.
- Affiliate redirect secure (Shopee host only) dan rate limited.
- Affiliate disclosure tampil.
- Card affiliate hanya berisi foto + deskripsi singkat; klik gambar menuju link Shopee.
- Search punya empty state.
- Admin dashboard hanya accessible oleh owner (role server-side).
- Audit log tercatat untuk perubahan admin.
- Structured data valid.

---

## Phase 6 — SEO, GEO, AI search

**Tujuan:** konten + metadata + content strategy untuk organic dan AI search.

Scope:

- `sitemap.xml`, `robots.txt`.
- Canonical + `hreflang` (id/en).
- Structured data (`Organization`, `WebSite`, `VideoGame`, `ItemList`, `Article`, `FAQPage`, `BreadcrumbList`).
- Article initial batch (10–20) dengan quality gate.
- Internal linking.
- Search Console setup.
- Localization `/id` dan `/en`.

Exit criteria:

- Structured data valid.
- Tidak ada orphan article.
- Tidak ada duplikat conflict canonical.
- Article review checklist lulus.
- Sitemap + robots valid.

---

## Phase 7 — PWA

**Tujuan:** installable web app dengan offline fallback dasar.

Scope:

- Manifest.
- App icons.
- Install UX.
- Offline fallback sederhana.
- Cache strategy.

Exit criteria:

- Lighthouse/PWA checks direview.
- Private data tidak masuk public cache.
- Update path diuji.

---

## Phase 8 — Android & iOS (Capacitor)

**Tujuan:** bundling aplikasi ke store.

Scope:

- Capacitor wrapper.
- Camera permission.
- Native share.
- Lifecycle (background/foreground).
- Store assets (icons, launch screen, screenshots).
- Privacy declarations.
- Account deletion URL.

Exit criteria:

- Physical device QA lulus.
- Store review checklist lulus.
- Crash/error monitoring aktif.

---

## MVP Boundary (yang masuk rilis pertama)

1. App shell + navigasi (Phase 0).
2. Data layer foundation: schema + repository interface + mock (Phase 1A).
3. Auth server cookie session (Phase 1).
4. Games catalog + detail (Phase 2).
5. Account + player profile + privacy + deletion (Phase 3).
6. Leaderboard family + personal + share (Phase 4).
7. Discover artikel + produk (minimum, Phase 5 inti).
8. Admin owner-only dashboard (Phase 5 inti, minimal versi data pokok).
9. SEO dasar + beberapa artikel (Phase 6 inti).
10. PWA dasar (Phase 7 ringan).

> Catatan admin: dashboard admin di MVP pertama cukup menampilkan data inti (pengguna, sesi game, performa, affiliate click). Grafik dan deep analytics penuh bisa berkembang setelah rilis. Karena hanya owner yang mengakses, tidak ada concern multi-user permission.
>
> Catatan Supabase: connect Supabase ditunda sampai Phase 1A (schema/migrations) dan Phase 1 (auth) siap. Tidak ada dependency pada Supabase yang running selama pengembangan berjalan memakai mock.

## Keluar dari MVP pertama (post-launch)

- Leaderboard online publik (Phase 4 lanjutan).
- CMS penuh (Phase 5 lanjutan jika Supabase sederhana tidak cukup).
- English penuh (Phase 6 lanjutan).
- Capacity store packaging penuh (Phase 8).
- Push notification.

---

## Dependencies antar fase

- Phase 0 mendahului semua (shell).
- Phase 1A (data layer / schema + mock) diletakkan sebelum Phase 1 ke atas; bisa sejalan dengan Phase 0, tapi schema dan repository interface sebaiknya siap sebelum Phase 2–5 karena seluruh data flow melewatinya.
- Phase 1 (auth) mendahului Phase 4 server-backed leaderboard dan Phase 3 account.
- Phase 2 ringan dan bisa sejalan dengan Phase 0.
- Phase 3 bergantung pada Phase 1A dan Phase 1.
- Phase 4 (leaderboard) bergantung pada Phase 1A dan Phase 2 (slug game).
- Phase 5 bergantung pada Phase 1A (admin/content repo), Phase 1 (admin), dan Phase 2 (slug game).
- Phase 6 bergantung pada Phase 5 (konten) dan Phase 4 (canonical).
- Phase 7 ringan bisa menyusul kapan saja.
- Phase 8 paling akhir, butuh Phase 1A–5 stabil.

Urutan eksekusi rekomendasi (urut): Phase 0 → Phase 1A → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8.
