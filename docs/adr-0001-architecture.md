# ADR-0001 — Deployment, Auth, dan Leaderboard Strategy

- **Date:** 2026-08-22
- **Status:** Accepted
- **Deciders:** Mainlagi Hub
- **Context:** Mainlagi Hub Motion Learning Hub, web-first menuju PWA dan Capacitor wrapper.

---

## 1. Summary

Dokumen ini mengunci tiga keputusan arsitektur yang paling menentukan dan sulit dibalik:

1. Deployment: SSR server (bukan static export).
2. Auth: server cookie session (Supabase SSR + middleware), bukan JWT di localStorage.
3. Leaderboard launch: family + personal dulu, online publik fase berikutnya.

---

## 2. Context and Problem

Kode saat ini:

- `next.config.mjs` memakai `output: "standalone"` → sudah ada node server runtime (SSR dimungkinkan).
- Tidak ada `src/middleware.ts`.
- Auth memakai `src/lib/auth/supabase-auth.ts` yang menyimpan token di `localStorage` (client-side JWT).
- Tidak ada `cookies()` atau `createServerClient` di auth.
- Tidak ada route `/leaderboards`, `/games`, `/discover`, `/account`.
- Score terstruktur sebagai `progress` (client + Supabase), bukan `game_sessions`.

Keputusan ini menentukan seluruh turunannya: auth flow, RLS, admin, leaderboard server validation, dan cara bungkus ke Android/iOS.

---

## 3. Decision

### 3.1 Decision A — Deployment: SSR via standalone Next.js server

**Jawaban:** Produksi memakai `next start` dengan `output: "standalone"`. Bukan `output: "export"` (static).

Konsekuensi:

- Bisa memakai SSR, middleware, `cookies()`, dan route handlers dengan akses server.
- Perlu platform node runtime (Vercel, Railway, Fly.io, Render, atau VPS/Nginx+pm2).
- Berbeda dari static hosting (jam statis) — CDN kurang agresif, runtime lebih aktif.
- Semua route publik yang butuh SEO memakai SSR/SSG sesuai kebutuhan.

**Mengapa tidak static export:** static export tidak bisa menetapkan cookie HttpOnly di server, tidak punya middleware session refresh, dan tidak punya server-side auth. Ini tidak kompatibel dengan Decision B.

| Kriteria | SSR standalone | Static export |
|---|---|---|
| Cookie HttpOnly session | ✅ | ❌ |
| Middleware session refresh | ✅ | ❌ |
| Server-side auth guard | ✅ | ❌ |
| SEO SSR | ✅ | ❌ (client / pre-render) |
| Kompleksitas deploy | Lebih tinggi | Lebih rendah |

**Rekomendasi deploy:** susunan URL production harus HTTPS. Env production perlu `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan Supabase cookie/secret hanya di server.

---

### 3.2 Decision B — Auth: Server cookie session (Supabase SSR + middleware)

**Jawaban:** Pindah dari client JWT di `localStorage` ke server cookie session memakai `@supabase/ssr` + `middleware.ts`.

Alasan utama:

1. Security: `HttpOnly` cookie tidak bisa dibaca JavaScript, mengurangi kerugian akibat XSS.
2. App store review (Apple/Google) mengharapkan session yang aman dan account deletion.
3. Kepatuhan data anak (COPPA/GDPR-K/PDP) lebih mudah dipertanggungjawabkan.
4. RLS tetap dipakai sebagai lapisan kedua, tapi session dikelola server.

Konsekuensi implementasi:

- Tambah `@supabase/ssr` sebagai dependency.
- Hapus penyimpanan token di `localStorage` (`src/lib/auth/supabase-auth.ts` direfactor).
- Buat `createServerClient` untuk server components / route handlers (`src/lib/auth/supabase-server.ts`).
- Buat `createBrowserClient` untuk client components (`src/lib/auth/supabase-client.ts`).
- Buat `src/proxy.ts` (Next 16 "proxy", dulu bernama `middleware.ts`) yang melakukan session refresh.
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan cookie keys (default Supabase).
- `auth/callback/page.tsx` menukar code menjadi session via cookie.

Google login: tidak di navbar. Tersedia di `/account`. Email/password sebagai provider utama.

**Backward compatibility:** saat migrasi, sesi lama di `localStorage` dibiarkan kadaluarsa (expired) atau dibersihkan; user login ulang sekali. Tidak ada bilah rusak karena fitur ini hanya untuk account/leaderboard, bukan untuk trial play.

---

### 3.3 Decision C — Leaderboard: family + personal dulu, online mingguan fase berikutnya

**Jawaban:** Launch memakai leaderboard family + personal (per perangkat), seperti yang sudah ada, tetapi diperbaiki UI-nya. Leaderboard online publik (server-validated) ditunda ke fase berikutnya.

Alasan:

1. Menghindari paparan fake-score pada launch awal.
2. Menghindari beban anti-cheat/moderation/privacy anak sebelum maturity.
3. Kebutuhan share dapat dipenuhi dengan share card family + personal.
4. Arsitektur (season, countdown, entry) tetap dirancang sekarang agar migration mulus.

Konsekuensi:

- Sekarang: leaderboard lokal (localStorage) + session di Supabase (bila login) bersifat family.
- Ke depan: `game_sessions`, `game_scores`, `leaderboard_seasons`, `leaderboard_entries`, server validation, status `pending/verified/rejected`.
- Aturan scoring dan skema season dicatat di `docs/roadmap.md` fase leaderboard-online, bukan diimplementasikan pada MVP.

---

## 4. Consequences

### Positive

- Keamanan token lebih baik.
- Review App Store/Play lebih mudah dipertanggungjawabkan.
- SEO/SSR untuk konten publik.
- RLS tetap relevan.
- Leaderboard family lebih aman untuk anak.

### Negative / cost

- Deploy lebih kompleks (perlu node runtime, bukan static hosting).
- Refactor auth cukup besar (menyentuh `supabase-auth.ts`, `progress.ts`, `supabase-rest.ts`, `SiteHeader`, `admin/affiliate`, `auth/callback`).
- Perlu test end-to-end auth (login, refresh, logout, callback, delete).
- Perlu memastikan session cookie mengalir di route handler dan middleware.

### Risks

- Supabase versi SSR mengubah cara client dibuat. Risiko error konfigurasi.
- Middleware harus efisien (jangan query berlebihan per request).
- Sesi lama vs baru saat deploy.

---

## 5. Alternatives Considered

| Option | Verdict |
|---|---|
| Static export + client JWT | ❌ Tidak cocok dengan cookie session dan SEO server. |
| Static export + cookie via edge | ❌ Cookie HttpOnly tetap butuh server runtime; edge membatasi. |
| Rewrite React Native | ❌ Terlalu besar, game engine & UI tetap web. |
| Online leaderboard saat launch | ❌ Ditunda demi keamanan/privacy anak. |

---

## 6. Related Documents

- `docs/prd.md`
- `docs/roadmap.md`
- `docs/tickets.md`
- `supabase/schema.sql`
- `src/lib/auth/supabase-auth.ts` (source yang perlu direfactor)
- `src/lib/auth/progress.ts`
- `src/lib/auth/supabase-rest.ts`
