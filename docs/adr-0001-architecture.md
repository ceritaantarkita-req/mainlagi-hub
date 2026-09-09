# ADR-0001 — Deployment, Auth, dan Leaderboard Strategy

- **Date:** 2026-08-22
- **Status:** Accepted, dengan Decision A deployment **superseded oleh ADR-0002 pada 2026-09-09**
- **Deciders:** Mainlagi Hub
- **Context:** Mainlagi Hub Motion Learning Hub, web-first menuju PWA dan Capacitor wrapper.

> Current production deployment source of truth: `docs/adr-0002-cloudflare-production.md`. Canonical production is GitHub `main` -> Cloudflare/OpenNext Workers -> `https://mainlagihub.my.id/`. VPS/standalone-node deployment is no longer the current production architecture.

---

## 1. Summary

Dokumen ini mengunci tiga keputusan arsitektur:

1. Deployment membutuhkan runtime server/edge yang mendukung SSR; implementasi production saat ini adalah OpenNext di Cloudflare Workers, bukan static export dan bukan VPS.
2. Auth: server cookie session (Supabase SSR + middleware), bukan JWT di localStorage.
3. Leaderboard launch: family + personal dulu, online publik fase berikutnya.

---

## 2. Context and Problem

Keputusan ini menentukan auth flow, RLS, admin, leaderboard server validation, dan cara membungkus aplikasi ke Android/iOS.

Catatan historis: versi awal ADR ini mengasumsikan `next start` standalone pada platform Node/VPS. Setelah repository memperoleh konfigurasi `@opennextjs/cloudflare`, `open-next.config.ts`, dan `wrangler.jsonc`, serta production path dikonfirmasi, deployment decision tersebut digantikan oleh ADR-0002.

---

## 3. Decision

### 3.1 Decision A — Deployment: SSR/server capability via Cloudflare Workers

**Current answer:** production memakai OpenNext for Cloudflare Workers, bukan static export dan bukan VPS/SSH.

Canonical path:

```text
GitHub `ceritaantarkita-req/mainlagi-hub`
  -> protected `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

Konsekuensi:

- SSR, route handlers, cookies, dan server-side boundaries tetap tersedia melalui runtime Cloudflare/OpenNext.
- Production artifact harus diuji dengan `npm run build:cloudflare`.
- Runtime config berasal dari Cloudflare environment/bindings, bukan `.env` yang di-commit.
- GitHub Actions adalah quality/security gate; Cloudflare Git integration melakukan production publication.
- Tidak ada kebutuhan `MAINLAGI_VPS_*`, SSH deploy key, `/srv/mainlagi`, atau Docker production path untuk Mainlagi.

**Mengapa tidak static export:** static export tidak menyediakan server runtime yang dibutuhkan oleh auth/session/server route behavior Mainlagi.

### 3.2 Decision B — Auth: Server cookie session (Supabase SSR + middleware)

**Jawaban:** gunakan server cookie session memakai `@supabase/ssr` dan Next.js proxy/middleware boundary.

Alasan utama:

1. Security: cookie session mengurangi kebutuhan menyimpan credential/session token secara manual di application localStorage.
2. App store/web account flow lebih mudah dipertanggungjawabkan.
3. RLS tetap dipakai sebagai lapisan authorization database.
4. Server-side route/auth behavior tersedia pada Cloudflare/OpenNext runtime.

Konsekuensi implementasi:

- `@supabase/ssr` menjadi dependency.
- Browser/server Supabase clients dipisahkan sesuai runtime.
- Next.js proxy/session refresh harus tetap kompatibel dengan Cloudflare/OpenNext build.
- Canonical production Supabase project adalah `inmydraft/mainlagi-hub` (`estvtgflwkebomsqlolv`).

Google login tidak harus berada di navbar; email/password tetap dapat menjadi provider utama.

### 3.3 Decision C — Leaderboard: family + personal dulu, online mingguan fase berikutnya

**Jawaban:** Launch memakai leaderboard family + personal terlebih dahulu. Leaderboard online publik server-validated dapat dikembangkan terpisah.

Alasan:

1. Menghindari fake-score/public ranking sebelum anti-cheat matang.
2. Mengurangi moderation/privacy complexity pada produk anak.
3. Share card family/personal cukup untuk fase awal.
4. Skema online dapat dikembangkan tanpa menjadikan score legacy sebagai universal learning mastery.

Konsekuensi:

- Legacy score/session tetap terpisah dari learning-attempt/mastery model.
- Future online leaderboard membutuhkan validation, season, moderation, dan privacy boundary tersendiri.

---

## 4. Consequences

### Positive

- Production runtime sesuai dengan repository OpenNext/Cloudflare tooling.
- Tidak ada lagi deployment architecture ganda Cloudflare vs VPS.
- Auth/server routes tetap dapat digunakan.
- RLS tetap relevan.
- Leaderboard family lebih aman untuk anak.

### Negative / cost

- Cloudflare/OpenNext compatibility harus menjadi bagian dari CI.
- Runtime-specific behavior perlu diuji pada Cloudflare, bukan hanya `next dev`/`next build`.
- Cloudflare environment variables/bindings perlu dikelola pada account layer.
- Auth end-to-end tetap perlu diuji setelah production deploy.

### Risks

- Perbedaan Node vs Workers runtime dapat menyebabkan package/runtime incompatibility.
- Cloudflare Git integration/build settings berada di account layer dan tidak seluruhnya terlihat dari source repository.
- Session/cookie flow perlu smoke test pada domain production.

---

## 5. Alternatives Considered

| Option | Verdict |
|---|---|
| Static export + client JWT | ❌ Tidak cocok dengan server-side session/route requirements. |
| VPS/SSH standalone Next.js | ❌ Bukan canonical production architecture Mainlagi. |
| Cloudflare Workers + OpenNext | ✅ Canonical production path. |
| Rewrite React Native | ❌ Terlalu besar; game engine & UI tetap web-first. |
| Online leaderboard saat launch | ❌ Ditunda demi keamanan/privacy anak. |

---

## 6. Related Documents

- `docs/adr-0002-cloudflare-production.md`
- `docs/DEPLOYMENT.md`
- `docs/CURRENT_STATE.md`
- `docs/prd.md`
- `docs/roadmap.md`
- `supabase/migrations/0001_init.sql`
- `wrangler.jsonc`
- `open-next.config.ts`
