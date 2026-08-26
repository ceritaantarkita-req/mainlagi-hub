# Mainlagi Hub — Motion Learning Hub V2

Rebuild V2 yang menempatkan sembilan game/module langsung dalam satu aplikasi Next.js:

1. Math Motion Battle
2. Number Trace Adventure
3. Shape Quest
4. Pattern Race
5. Math Warung
6. Iqro Motion
7. AirBoard Presenter
8. Dodge Motion
9. Run to Target

Semua game memakai internal route `/play/[slug]`. Tidak ada companion launcher atau card yang membuka project lama sebagai aplikasi eksternal.

## Perubahan material dari V1

- Brand dan homepage Mainlagi Hub yang baru.
- Tepat sembilan internal module.
- Explicit 1/2-player selection.
- Single-player full-width tanpa divider.
- Preflight camera/model/skeleton/gesture sebelum countdown.
- Shared Hand + Pose Landmarker runtime.
- Temporal Player A/B body slots dan hand-to-body association.
- Multi-stroke writing: pinch start, release stroke, open-palm submit, fist clear.
- Expected-answer digit verifier; low confidence menjadi retry/time grace.
- Body-game controls untuk left/right/jump/crouch/forward/back.
- Optional Google OAuth/Supabase progress.
- Share, OG thumbnail, affiliate API/redirect/admin.

## Persyaratan

- Node.js 20.9+
- npm 10+
- Chrome atau Edge modern
- `localhost` atau HTTPS untuk kamera

## Verifikasi di Windows

```powershell
cd "C:\path\motion-learning-hub-mainlagitv-v2-corrected"
powershell -ExecutionPolicy Bypass -File .\VERIFY_WINDOWS.ps1
```

Script menjalankan dependency install terlebih dahulu, kemudian portable gate, full type/lint/test/simulation/build gate, dan production dependency audit.

Jalankan app:

```powershell
npm.cmd run dev
```

Buka `http://localhost:3000`.

Mulai dari mode **Mouse / keyboard**, lalu lakukan physical camera QA menggunakan `docs/CAMERA_QA.md`.

## Portable gate

Gate ini tidak memuat runtime Next.js/React, tetapi tetap membutuhkan compiler TypeScript dari `node_modules`. Karena itu jalankan `npm install` terlebih dahulu, atau gunakan `VERIFY_WINDOWS.ps1` yang sudah mengatur urutan tersebut:

```powershell
npm.cmd run check:portable
```

Ia bukan pengganti full gate.

## Google login

1. Buat Supabase project.
2. Jalankan `supabase/migrations/0001_init.sql` (lewat `supabase db push`, atau tempel isinya ke Supabase SQL editor).
3. Aktifkan Google provider.
4. Tambahkan callback lokal `http://localhost:3000/auth/callback` dan callback production.
5. Copy `.env.example` menjadi `.env.local`.
6. Isi public Supabase URL/anon key.
7. Isi `SUPABASE_SERVICE_ROLE_KEY` hanya pada server environment bila affiliate click logging diaktifkan.
8. Ubah admin role melalui trusted Supabase dashboard/backend, bukan client.

Credential asli tidak ada di ZIP.

## QA evidence

- `docs/QA_REPORT.md`
- `qa/five-full-pass-summary.json`
- `qa/full-pass-1.log` sampai `qa/full-pass-5.log`
- `qa/browser-qa.json`
- `qa/home-desktop.png`
- `qa/home-mobile.png`
- `qa/preflight-desktop.png`

## Dokumentasi

- `docs/ARCHITECTURE.md`
- `docs/SOURCE_AUDIT.md`
- `docs/MIGRATION_NOTES.md`
- `docs/FIDELITY_LEDGER.md`
- `docs/QA_REPORT.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/CAMERA_QA.md`
- `docs/GITHUB_UPDATE_GUIDE.md`

## Privasi

- Frame webcam diproses di browser.
- Tidak ada endpoint upload video.
- Share thumbnail tidak memakai frame kamera atau wajah user.
- Cloud progress hanya aktif setelah Supabase dikonfigurasi dan user login.


## V2.0.1 Windows verification fix

Versi 2.0.1 memperbaiki urutan `VERIFY_WINDOWS.ps1`. Versi 2.0.0 menjalankan `check:portable` sebelum `npm install`, padahal `check:portable` memanggil compiler TypeScript. Tidak ada source gameplay yang diubah oleh perbaikan ini.
