# Tickets — Mainlagi Hub Motion Learning Hub

Dokumen ini berisi ticket kerja yang dapat dieksekusi langsung (oleh manusia atau AI lain). Setiap ticket punya: **scope**, **files**, **acceptance criteria**, dan **out of scope**.

Aturan umum sebelum mengerjakan ticket:

- Selalu jalankan `npm run typecheck`, `npm run lint`, lalu `npm run build` sebelum menganggap selesai.
- Jangan mengubah engine/vision/gameplay kecuali ticket menyebut.
- Jangan meng-commit kecuali diminta.
- Referensi keputusan arsitektur: `docs/adr-0001-architecture.md`, `docs/adr-0002-database-layer.md`.
- Referensi fase: `docs/roadmap.md`.
- Pastikan mengikuti urutan fase (lihat "Urutan eksekusi" di `docs/roadmap.md`).

Priority: **P0 (harus sekarang)** → **P1 (segera)** → **P2 (diprioritaskan)**.

---

## Phase 0 — App shell & navigation

### T-001 · Design tokens & icon system

**Priority:** P0
**Phase:** 0

**Scope:**

- Finalkan token warna, typography, spacing, radius, shadow di `src/app/globals.css` `:root`.
- Bangun icon system internal dengan satu stroke weight dan viewBox konsisten.
- Pastikan ikon: Home, Gamepad, Search, Trophy, Account, Settings, Globe, Sun, Moon, Lock, Share, Arrow, Back, Close.
- Hapus ketergantungan pada emoji sebagai icon navigasi/utama.

**Files:**

- `src/app/globals.css`
- `src/components/*` (semua yang memakai icon)
- Buat `src/components/icons/Icon.tsx` atau `src/components/Icon.tsx`

**Acceptance criteria:**

- Icon setereo bebas emoji untuk navigasi.
- Icon konsisten ukuran dan stroke.
- Tidak ada `transition: all` / `will-change: all`.
- Typecheck + lint + build lulus.
- Mobile/desktop tidak overflow.

**Out of scope:** redesign konten Artikel/Produk.

---

### T-002 · Top + bottom navigation shell

**Priority:** P0
**Phase:** 0

**Scope:**

- Buat `AppShell` yang menentukan:
  - Desktop: top navbar.
  - Mobile: bottom navbar.
  - Active route state.
  - Scroll glass state.
- Buat `TopNavbar` (desktop) dan `BottomNavbar` (mobile).
- Routing: Home, Games, Discover, Leaderboards, Account.
- Hapus Google login dari navbar.

**Files:**

- Buat `src/components/AppShell.tsx`
- Buat `src/components/nav/TopNavbar.tsx`
- Buat `src/components/nav/BottomNavbar.tsx`
- Buat `src/components/nav/ScrollGlassHeader.tsx`
- Update `src/components/SiteHeader.tsx` (refactor jadi badge/logo + nav)
- Update `src/app/layout.tsx`
- Update `src/components/HomePage.tsx`

**Acceptance criteria:**

- Dari Home dapat navigasi ke Games/Discover/Leaderboards/Account.
- Bottom nav (mobile) 5 item, safe-area, active state jelas, hit area ≥ 44 px.
- Bottom nav disembunyikan di `/play/[slug]`.
- Tidak ada login di navbar.
- Keyboard navigation berfungsi.

**Out of scope:** implementasi konten halaman tujuan; hanya routing + placeholder.

---

### T-003 · Scroll glass behavior

**Priority:** P0
**Phase:** 0

**Scope:**

- Satu hook `useScrollState` di shared shell.
- `top` → solid surface; `scrolled` → glass (alpha background + blur + border/shadow).
- Threshold default 16 px.
- `prefers-reduced-motion` mematikan transisi.

**Files:**

- Buat `src/lib/react/useScrollState.ts`
- Update navbar component

**Acceptance criteria:**

- Navbar berubah state setelah 16 px scroll.
- Tetap terbaca di background terang dan gelap (border/shadow, bukan cuma blur).
- Backdrop-filter hanya enhancement.
- Reduced-motion menghormati.

---

### T-004 · Redirect & route structure

**Priority:** P0
**Phase:** 0

**Scope:**

- Redirect `/papan-skor` → `/leaderboards`.
- Buat route placeholder `/games`, `/games/[slug]`, `/discover`, `/discover/articles`, `/discover/products`, `/leaderboards`, `/leaderboards/[gameSlug]`, `/account`.

**Files:**

- Update `src/app/papan-skor/page.tsx` (ganti redirect)
- Buat page baru sesuai route di atas
- Update `src/lib/data/games.ts` bila perlu

**Acceptance criteria:**

- `/papan-skor` 301 ke `/leaderboards`.
- Semua route baru dapat diakses tanpa 404.
- Metadata dasar ada di tiap route publik.

---

### T-005 · Theme system

**Priority:** P1
**Phase:** 0

**Scope:**

- `ThemeProvider` mendukung `system`/`light`/`dark`.
- Set `color-scheme`, akses token dark, tanpa flash besar saat load.
- Simpan preferensi di cookie/local; sinkron ke akun bila login.

**Files:**

- Buat `src/components/ThemeProvider.tsx`
- Update `src/app/layout.tsx`
- Update `src/app/globals.css` untuk token dark

**Acceptance criteria:**

- Tidak ada flash besar saat load.
- Contrast AA diuji untuk semua state.
- Preferensi tersimpan dan pulih.

---

## Phase 1A — Data layer foundation (supaya develop tanpa Supabase)

> Catatan: ticket di fase ini **belum dikerjakan**. Tujuannya menyiapkan semua tabel + UUID + boundary data layer. Supabase connect ditunda sampai fase ini dan auth (T-101 dst) siap.

### T-051 · Schema migrations PostgreSQL (semua tabel + UUID)

**Priority:** P0 (perlu, tapi ditunda sampai giliran Phase 1A)
**Phase:** 1A

**Scope:**

- Tulis `supabase/migrations/*.sql` versioned.
- Buat seluruh tabel dengan UUID PK (`gen_random_uuid()`):
  - `profiles` (role `user`/`admin`/`owner`)
  - `player_profiles`
  - `game_sessions`
  - `game_scores`
  - `leaderboard_seasons`
  - `leaderboard_entries`
  - `articles` + `article_relations`
  - `affiliate_items` + `affiliate_clicks`
  - `audit_logs`
- Foreign key eksplisit + index.
- RLS, trigger, RPC (mis. `record_best_score`, season functions).

**Files:**

- Buat `supabase/migrations/0001_init.sql` (dan seterusnya)
- Referensi `supabase/migrations/0001_init.sql`

**Acceptance criteria:**

- Semua tabel terdefinisi dengan UUID PK.
- RLS aktif dan dapat diujikan.
- Migrasi dapat dijalankan (`supabase db push`).
- Tidak ada tabel yang duplikat dengan `schema.sql`.

**Out of scope:** connect ke Supabase cloud.

---

### T-052 · Repository interface

**Priority:** P0 (perlu, ditunda)
**Phase:** 1A

**Scope:**

- Definisikan interface TypeScript: `ProfileRepository`, `PlayerProfileRepository`, `ScoreRepository`, `LeaderboardRepository`, `ArticleRepository`, `ProductRepository`, `AuditRepository`.
- UI hanya bergantung pada interface.

**Files:**

- Buat `src/lib/data/repositories/*.ts`
- Buat `src/lib/data/types.ts`

**Acceptance criteria:**

- UI tidak memanggil backend konkret langsung.
- Interface mencakup operasi yang dibutuhkan fase 2–5.
- Typecheck lulus.

**Out of scope:** implementasi Supabase / connect.

---

### T-053 · Mock/local implementation

**Priority:** P0 (perlu, ditunda)
**Phase:** 1A

**Scope:**

- Implementasi mock/local (in-memory atau file JSON) untuk seluruh repository.
- Auth stub/mock untuk develop tanpa Supabase.
- Flag/source of truth untuk memilih backend (mock vs supabase) via env/config.

**Files:**

- Buat `src/lib/data/mock/*`
- Buat `src/lib/config/backend.ts`

**Acceptance criteria:**

- Seluruh flow (games, leaderboard family, artikel, produk, account) berjalan penuh dengan mock tanpa Supabase running.
- Perpindahan flag memilih implementasi yang benar.
- Tidak ada error saat Supabase belum dikonfigurasi.

**Out of scope:** connect Supabase cloud.

---

### T-054 · Data layer contract doc

**Priority:** P2
**Phase:** 1A

**Scope:**

- Dokumentasikan kontrak repository (input/output) agar implementasi Supabase belakangan mengikuti kontrak yang sama.

**Files:**

- Buat `docs/data-layer.md`

**Acceptance criteria:**

- Kontrak jelas untuk mock dan supabase.
- Nama field mencocokkan schema migrasi.
- Test contract dapat ditulis.

---

## Phase 1 — Auth migrasi (server cookie session)

### T-101 · Tambah dependency + klien server/browser

**Priority:** P0
**Phase:** 1

**Scope:**

- Tambah `@supabase/ssr`.
- Buat helper:
  - `src/lib/auth/supabase-server.ts` → `createServerClient` untuk server components / route handlers.
  - `src/lib/auth/supabase-client.ts` → `createBrowserClient` untuk client components.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Files:**

- `package.json`
- Buat `src/lib/auth/supabase-server.ts`
- Buat `src/lib/auth/supabase-client.ts`
- Update `.env.example`

**Acceptance criteria:**

- Server client berfungsi di route handler (uji `/api/health` atau route baru).
- Browser client berfungsi di client component.
- Typecheck + lint + build lulus.

---

### T-102 · Proxy session refresh

**Priority:** P0
**Phase:** 1

**Scope:**

- Buat `src/proxy.ts` (Next 16 "proxy", dulu `middleware.ts`) dengan refresh session dari Supabase SSR.
- Refresh access token via cookie.
- Jangan blokir route publik, termasuk game.

**Files:**

- Buat `src/proxy.ts`

**Acceptance criteria:**

- Session refresh berjalan saat request masuk.
- Guest tetap bisa akses semua route.
- Tidak ada query berlebihan per request.
- Cookie HttpOnly dipakai untuk session.

---

### T-103 · Refactor auth helper (hapus localStorage token)

**Priority:** P0
**Phase:** 1

**Scope:**

- Ganti `src/lib/auth/supabase-auth.ts` agar memakai cookie session, bukan `localStorage`.
- Update fungsi yang dipakai: `getCurrentUser`, `startGoogleLogin`, `signOut`, `getValidAccessToken`, `isSupabaseConfigured`.
- Update `src/lib/auth/progress.ts`.
- Update `src/lib/auth/supabase-rest.ts`.
- Update `src/components/SiteHeader.tsx`, `src/app/admin/affiliate/page.tsx`, `src/app/auth/callback/page.tsx`.
- Google login tersedia hanya di `/account`.

**Files:**

- `src/lib/auth/supabase-auth.ts` (refactor)
- `src/lib/auth/progress.ts`
- `src/lib/auth/supabase-rest.ts`
- `src/components/SiteHeader.tsx`
- `src/app/admin/affiliate/page.tsx`
- `src/app/auth/callback/page.tsx`
- Buat `src/app/account/page.tsx`

**Acceptance criteria:**

- Tidak ada token di `localStorage` untuk session production.
- Login → logout → refresh berfungsi.
- Guest tetap bisa bermain.
- Tidak ada secret di log.
- Google login tidak di navbar.

---

### T-104 · Email/password + forgot/reset + account page

**Priority:** P1
**Phase:** 1

**Scope:**

- Signup, login, forgot/reset password.
- `/account` page dasar.
- Guard server-side untuk route account & admin.

**Files:**

- Buat `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/forgot-password/page.tsx`, `src/app/reset-password/page.tsx`.
- Update `src/components/AccountMenu.tsx` (bila ada).

**Acceptance criteria:**

- Auth flow diuji end-to-end.
- Route account dilindungi server-side.
- Email/password berfungsi sebagai provider utama.

---

## Phase 2 — Games catalog & detail

### T-201 · Games catalog + filter

**Priority:** P1
**Phase:** 2

**Scope:**

- `/games` katalog.
- Filter: umur, kategori, aktivitas tangan/tubuh, player count, durasi, difficulty.
- Search.
- Card: nama, deskripsi pendek, age, player count, input mode, status.

**Files:**

- Buat `src/app/games/page.tsx`
- Buat `src/components/games/GameCatalog.tsx`
- Update `src/lib/data/games.ts`

**Acceptance criteria:**

- Semua game muncul.
- Filter bekerja tanpa merusak direct URLs.
- Search punya empty state.
- Metadata per game/route.

---

### T-202 · Game detail page

**Priority:** P1
**Phase:** 2

**Scope:**

- `/games/[slug]`: hero, cara bermain, persiapan kamera, umur, player count, durasi, skill, privacy note, CTA `Mulai bermain`, related games, related articles.

**Files:**

- Buat `src/app/games/[slug]/page.tsx`

**Acceptance criteria:**

- Semua slug game valid punya halaman.
- Direct play link tetap berfungsi.
- OG image per game.

---

## Phase 3 — Account & privacy

### T-301 · Player profile

**Priority:** P1
**Phase:** 3

**Scope:**

- Player profile: alias, age group, grade opsional, avatar.
- Parent + player relationship.

**Files:**

- Update `supabase/migrations/0001_init.sql`
- Buat `src/app/account/players/page.tsx`

**Acceptance criteria:**

- User hanya mengelola player profile milik sendiri.
- RLS verified.
- Tidak ada email anak / birth date lengkap.

---

### T-302 · Delete account

**Priority:** P1
**Phase:** 3

**Scope:**

- `/account/delete`.
- Confirm + re-authenticate.
- Deletion server-side.
- Session invalidate.
- Redirect confirmation.

**Files:**

- Buat `src/app/account/delete/page.tsx`
- Update `supabase/migrations/0001_init.sql`

**Acceptance criteria:**

- Deletion menghapus profile, player profiles, scores, progress, auth user.
- Session invalidated.
- Tidak menyisakan data pribadi berlebih.

---

### T-303 · Privacy/terms/cookie/parental/data-request

**Priority:** P1
**Phase:** 3

**Scope:**

- Halaman `/privacy`, `/terms`, `/cookie-policy`, `/parental-consent`, `/data-request`.

**Files:**

- Buat halaman statis SSR.

**Acceptance criteria:**

- Semua halaman dapat diakses.
- Konten konsisten dengan data flow aktual.
- Link di footer/account mengarah benar.

---

## Phase 4 · Leaderboard family + share

### T-401 · Leaderboard server-backed (family + personal)

**Priority:** P1
**Phase:** 4

**Scope:**

- `/leaderboards` dan `/leaderboards/[gameSlug]`.
- Season + week key (Asia/Jakarta).
- Store skor server-side bila login, lokal bila guest.
- Countdown server-based.

**Files:**

- Update `supabase/migrations/0001_init.sql` (season, entry)
- Buat `src/app/leaderboards/page.tsx`, `src/app/leaderboards/[gameSlug]/page.tsx`
- Update `src/lib/data/leaderboard.ts`

**Acceptance criteria:**

- Data family/personal tersimpan sesuai rule.
- Canonical URL bersih (tanpa trailing `weekKey`).
- Countdown membaca `ends_at` dari server.
- Skor tidak dapat dipalsukan tanpa batas (rate limit + bounds).

---

### T-402 · Share card

**Priority:** P1
**Phase:** 4

**Scope:**

- Share card: alias, game, rank, score, week, brand, canonical link.
- Web Share API + fallback WhatsApp/Telegram/Threads/copy.

**Files:**

- Buat `src/components/leaderboard/ShareCard.tsx`

**Acceptance criteria:**

- Share card tidak memuat wajah/email/HP.
- Web Share API dipakai bila tersedia.
- Fallback tampil rapi.
- Link canonical valid.

---

## Phase 5 · Discover & CMS

### T-501 · Discover shell + search

**Priority:** P2
**Phase:** 5

**Scope:**

- `/discover`, `/discover/products`, `/discover/articles`.
- Search.
- Empty state.

**Files:**

- Buat `src/app/discover/page.tsx`, `src/app/discover/products/page.tsx`, `src/app/discover/articles/page.tsx`

**Acceptance criteria:**

- Search mencari title, summary, tag, kategori.
- Empty state jelas.
- Tidak ada mixed content SEO yang merusak canonical.

---

### T-502 · Article SSR + structured data

**Priority:** P2
**Phase:** 5

**Scope:**

- `/discover/articles/[slug]` SSR.
- Metadata, canonical, structured data (Article, FAQ, Breadcrumb).
- Related games/articles.

**Files:**

- Buat `src/app/discover/articles/[slug]/page.tsx`
- Buat `src/lib/data/content.ts` (bila perlu)

**Acceptance criteria:**

- Published article SSR/SSG.
- Structured data valid.
- Metadata unik.

---

### T-503 · Admin owner-only dashboard + audit log

**Priority:** P1
**Phase:** 5

**Scope:**

- **Owner-only** `role = 'owner'` di database.
- `/admin/dashboard`: data pengguna, gameplay, performa, leaderboard, content, grafik dan trend waktu.
- Access hanya untuk satu identitas owner (server-side, bukan frontend email allowlist).
- `audit_logs` hanya ditulis server.

**Files:**

- Update `supabase/migrations/0001_init.sql`
- Buat `src/lib/auth/requireOwner.ts`
- Buat `src/app/admin/dashboard/page.tsx`
- Update `src/app/admin/affiliate/page.tsx`

**Acceptance criteria:**

- Non-owner ditolak server-side.
- Dashboard hanya open oleh owner.
- Audit log tercatat pada create/update/delete/publish.
- Tidak rely pada email allowlist frontend.
- Grafik/data tampil benar di mobile dan desktop.**Out of scope:** multi-admin permission & granular role.

### T-504 · Product card (owner-only affiliate)

**Priority:** P1
**Phase:** 5

**Scope:**

- Card produk di `/discover/products`: **foto + deskripsi singkat**.
- Klik gambar → redirect ke link Shopee yang diberikan owner.
- Host allowlist Shopee + https-only + disclosure.
- Redirect `/go/[slug]` melakukan validation.
- Dikelola owner saja (bukan marketplace).

**Files:**

- Update `src/components/discover/ProductCard.tsx` (bila ada)
- Update `src/lib/data/affiliate.ts`
- Update `src/app/go/[slug]/route.ts`
- Update `src/app/api/affiliate/route.ts`

**Acceptance criteria:**

- Card hanya berisi foto + deskripsi singkat.
- Klik gambar menuju link Shopee.
- Redirect hanya ke host Shopee https.
- Disclosure affiliate tampil.
- Tidak ada tombol/tracking berlebihan pada card.

**Out of scope:** marketplace affiliate, banyak vendor.

---

## Phase 6 · SEO & content

### T-601 · Sitemap + robots + canonical + hreflang

**Priority:** P2
**Phase:** 6

**Scope:**

- `sitemap.xml` + `robots.txt`.
- Canonical.
- `hreflang` id/en.

**Files:**

- Buat `src/app/sitemap.ts`
- Buat `src/app/robots.ts`

**Acceptance criteria:**

- Sitemap valid.
- Canonical unik.
- hreflang benar.

---

### T-602 · Initial article batch

**Priority:** P2
**Phase:** 6

**Scope:**

- 10–20 artikel dengan quality gate.
- Internal linking.

**Files:**

- `src/lib/data/content.ts` (atau CMS)

**Acceptance criteria:**

- Artikel menjawab intent, bukan filler.
- Tidak ada orphan.
- Author/update date tampil.

---

## Kontribusi langsung untuk AI berikutnya

**Mulai dari:**
1. `T-001` (design tokens + icon).
2. `T-002` (shell + nav).
3. `T-004` (route structure + redirect).
4. `T-051`–`T-054` (data layer foundation / schema + mock) — setelah shell stabil.
5. `T-101`–`T-103` (auth migrasi) — setelah data layer siap.

> Catatan urutan: data layer (T-051–T-054) dikerjakan **setelah** shell (T-001–T-004) dan **sebelum** auth migrasi (T-101–T-103) serta fase 2–5. Supabase connect ditunda sampai data layer dan auth siap.
