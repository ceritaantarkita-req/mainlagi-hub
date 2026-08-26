# Data Layer Contract

Direction: `docs/adr-0002-database-layer.md`.

Aplikasi berbicara ke `DataRepositories` (interface), bukan ke backend konkret. Ada dua implementasi: **mock** (dev, in-memory) dan **Supabase** (production, terhubung belakangan). Supabase connect ditunda sampai Phase 1 (auth) siap.

---

## Backend selection

- Nilai default: `mock`.
- Bila sudah siap: `NEXT_PUBLIC_DATA_BACKEND=supabase`.

```text
src/lib/config/backend.ts      → dataBackend() / isMock()
src/lib/data/index.ts          → getData()        (factory; saat ini selalu mock)
```

---

## Layering

```text
UI / React
   │  hanya memanggil getData().<repo>.<method>()
   ▼
repositories/contracts.ts  ← interface (source of truth untuk UI)
   ├── mock/index.ts       ← in-memory, bisa jalan tanpa backend
   └── (supabase)          ← akan ditambahkan setelah Phase 1
```

Aturan:

- UI tidak import Supabase client atau PostgREST langsung untuk data aplikasi.
- Semua operasi data melewati repository.
- Field di UI memakai nama domain (camelCase), bukan nama kolom DB (snake_case). Mapping dilakukan di implementation.

---

## Repositories

| Repository | Operasi |
|---|---|
| `profiles` | `current()`, `update()` |
| `players` | `list()`, `create()`, `update()`, `remove()` |
| `scores` | `createSession()`, `completeSession()`, `submitScore()`, `scoresFor()`, `bestPersonal()` |
| `leaderboards` | `currentSeason()`, `entries()`, `entryFor()` |
| `articles` | `listPublished()`, `bySlug()`, `related()` |
| `products` | `listActive()`, `recordClick()` |
| `audit` | `log()` |

Semua method bersifat `async` dan mengembalikan domain types (`src/lib/data/domain.ts`).

---

## Domain types (camelCase)

UI menggunakan shape di `src/lib/data/domain.ts`. Mapping DB → domain (mis. `displayName` ← `display_name`, `createdAt` ← `created_at`) dilakukan di implementation, tidak di UI.

Catatan penting: `GameDefinition` untuk katalog game dan `AffiliateItem` di UI masih bersumber dari `src/lib/data/games.ts` dan `src/lib/data/affiliate.ts` (static) pada MVP. Repository `games` belum ditambahkan ke kontrak; katalog tetap static sampai CMS/admin siap (Phase 5).

---

## SQL schema

`supabase/migrations/0001_init.sql` mendefinisikan seluruh tabel dengan UUID PK, foreign key, RLS, trigger, dan RPC. Sumber kebenaran schema ada di sana.

---

## Supabase implementation (belum ada, rencana)

Saat Phase 1 (auth) siap:

1. Buat `supabase-client.ts` (browser) dan `supabase-server.ts` (server).
2. Implementasikan tiap repository di `src/lib/data/supabase/*`.
3. Mapping snake_case DB → camelCase domain.
4. Uji kesetaraan perilaku mock vs supabase (terutama RLS) sebelum pindah.
5. Pilih backend via `NEXT_PUBLIC_DATA_BACKEND`.

---

## Testing

- Contract test: pastikan mock mengikuti kontrak (ids unik, nullability, ordering).
- Integration test saat supabase impl ada: login, submit score, leaderboard ordering, artikel published hanya untuk lokal yang benar.
- Jangan biarkan UI mengakses Supabase langsung; kunci lewat interface.
