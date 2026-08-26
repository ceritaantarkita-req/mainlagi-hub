# ADR-0002 — Database Layer Strategy

- **Date:** 2026-08-22
- **Status:** Accepted (documented, not yet implemented)
- **Deciders:** Mainlagi Hub
- **Context:** Supabase connect diundur. Pengembang mau menyiapkan sistem database (semua tabel + UUID) dan boundary data-layer dahulu, supaya bisa develop lengkap tanpa bolak-balik menangani Supabase. Saat sistem jadi, tinggal migrate/connect.

---

## 1. Summary

Keputusan:

1. Database memakai **PostgreSQL (Supabase-compatible)**, bukan SQLite.
2. Schema ditulis sebagai **versioned migrations** sedini mungkin (satu source of truth).
3. Aplikasi memakai **repository interface** + **dua implementasi**: local/mock untuk develop, Supabase untuk production.
4. Supabase connect dilakukan belakangan, tanpa rewrite.

---

## 2. Why not SQLite

Supabase adalah PostgreSQL. RLS, `auth.uid()`, `auth.users`, `gen_random_uuid()`, `jsonb`, `timestamptz`, trigger, dan `security definer` function adalah fitur Postgres. `supabase-js` client berbicara ke PostgREST (`/rest/v1`, `.rpc()`), bukan ke SQLite.

Jika data layer dibangun di SQLite, seluruh RLS dan mekanisme akses harus ditulis ulang saat pindah ke Supabase. Itu migrasi palsu: sebenarnya rewrite.

| Fitur | SQLite | Postgres (Supabase) |
|---|---|---|
| RLS | ❌ | ✅ |
| `auth.uid()`, `auth.users` | ❌ | ✅ |
| `gen_random_uuid()` | ❌ | ✅ |
| `jsonb`, `timestamptz`, trigger, `security definer` | sebagian ❌ | ✅ |
| PostgREST (`/rest/v1`, `.rpc()`) | ❌ | ✅ |
| Client `supabase-js` | tidak dipakai | ✅ |

Kode existing sudah berbentuk Postgres (`gen_random_uuid()`, `auth.uid()`) sejak draf pertama `supabase/schema.sql`. Maka schema dipertahankan Postgres. (`schema.sql` sendiri di-retire 26 Agu 2026 -- lihat catatan di bawah.)

---

## 3. Architecture: three-layer boundary

Supaya develop tanpa Supabase, boundary yang salah bila di-disable. Caranya buat data layer abstrak.

```text
UI / App (Next.js, React)
          │  memanggil interface saja
          ▼
Repository interface (TypeScript)
  ├── ProfileRepository
  ├── PlayerProfileRepository
  ├── ScoreRepository
  ├── LeaderboardRepository
  ├── ArticleRepository
  ├── ProductRepository
  ├── AuditRepository
  └── AuthRepository (stub/mock untuk dev)
          │
          ├── implementasi: Local / Mock (in-memory / file)
          └── implementasi: Supabase (supabase-js + PostgREST)
```

Aturan:

- UI hanya bergantung pada interface, bukan backend concret.
- Lokasi/URL Supabase hanya di satu config, dibaca via env.
- Ada flag/source of truth untuk memilih backend: `mock` (dev) atau `supabase` (produksi).
- Mock menutupi data aplikasi dan menyediakan auth stub agar app berjalan offline penuh.

---

## 4. Consequences

### Positive

- UI/flow bisa dikembangkan penuh tanpa Supabase running.
- Schema sudah siap, tinggal `supabase db push`.
- Tidak ada rewrite saat connect.
- RLS dan constraint diujikan di Postgres/Supabase sejak awal (saat siap).

### Negative / cost

- Perlu menulis dua implementasi repository (mock + supabase) untuk entity yang sama.
- Auth Supabase (server cookie session) tetap spesifik Supabase; mock harus meniru session cukup untuk dev.
- Perlu runtime Postgres lokal bila ingin menguji SQL/RLS nyata sebelum connect (Docker atau `supabase start`).

### Risk

- Mock dan Supabase bisa berbeda perilaku (mis. RLS membolehkan/menolak). Wajib test integration saat pindah.
- Hindari membuat mock terlalu jauh dari kontrak SQL nyata.

---

## 5. Decisions

- [x] Database: PostgreSQL (Supabase-compatible).
- [x] Schema: versioned migrations siap push.
- [x] Data layer: repository interface + mock + supabase implementation.
- [ ] Connect Supabase: ditunda sampai fase data layer dan auth siap.

---

## 6. Related

- `docs/prd.md`
- `docs/roadmap.md`
- `docs/tickets.md`
- ~~`supabase/schema.sql`~~ (retired 26 Agu 2026 -- duplikat dan sudah tidak sinkron dengan `migrations/0001_init.sql`; lihat project audit)
- `supabase/migrations/0001_init.sql` (source of truth schema, sejak 26 Agu 2026)
- `src/lib/data/*` (repository layer)
