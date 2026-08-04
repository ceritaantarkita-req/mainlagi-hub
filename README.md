# Motion Learning Hub

Motion Learning Hub adalah web app edukasi berbasis **Next.js + MediaPipe** untuk anak TK sampai SD kelas 2. Webcam digunakan untuk membaca gerakan telunjuk, lintasan tulisan di udara, dan pose telapak tangan. Tidak ada login, database pengguna, rekaman video, atau pengenalan wajah.

## Game yang tersedia

1. **Math Motion Battle** — duel matematika dua pemain; jawaban ditulis satu digit per tahap.
2. **Number Trace Adventure** — mengikuti jalur angka dengan telunjuk.
3. **Shape Quest** — mengikuti bentuk geometri dan mendapatkan skor lintasan.
4. **Pattern Race** — mencari angka berikutnya dari pola secara satu atau dua pemain.

## Persyaratan

- Node.js 20.9 atau lebih baru.
- Chrome atau Edge modern direkomendasikan untuk kamera.
- Kamera internal/eksternal.
- HTTPS saat di-hosting. `localhost` boleh memakai kamera tanpa HTTPS.

## Menjalankan di Windows / macOS / Linux

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Setelah instalasi pertama, npm akan membuat `package-lock.json`. Simpan/commit lockfile itu hanya setelah `npm run check` berhasil di laptop. Lockfile tidak dibuat secara manual di paket ini.

Setelah `npm install`, script `postinstall` mencoba:

- menyalin WASM MediaPipe ke `public/mediapipe/wasm`;
- mengunduh model resmi Hand Landmarker ke `public/models`;
- mempertahankan fallback resmi apabila download lokal gagal.

## Pemeriksaan lengkap

```bash
npm run check
```

Perintah tersebut menjalankan typecheck, lint, automated engine tests, tiga simulasi, dan production build.

Untuk pemeriksaan engine tanpa memerlukan browser:

```bash
npm run test:engine
npm run simulate
```

## Mode kamera dan mode demo

- **Aktifkan kamera**: menggunakan MediaPipe Hand Landmarker.
- **Mode demo mouse/touch**: seluruh game tetap dapat direview tanpa webcam atau model MediaPipe.

## Privasi

Video diproses di browser. Aplikasi tidak mengunggah atau menyimpan video. Progress sederhana disimpan hanya di `localStorage` perangkat.

## Dokumentasi utama

- `docs/PRD.md`
- `docs/TECHNICAL_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/CAMERA_TESTING.md`
- `docs/CLAUDE_REVIEW_GUIDE.md`
- `docs/TROUBLESHOOTING.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/QA_REPORT.md`
- `docs/FIDELITY_LEDGER.md`
- `CLAUDE.md`
