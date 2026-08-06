# Source Repository Audit

Tanggal audit: 5 Agustus 2026

Repository yang dijadikan bahan pembelajaran:

- `ceritaantarkita-req/motion-learning-hub`
- `ceritaantarkita-req/math-motion-battle`
- `ceritaantarkita-req/math-warung-fullstack`
- `ceritaantarkita-req/iqro-motion`
- `ceritaantarkita-req/airboard-presenter`

Rebuild ini tidak menjadikan project lama sebagai external launcher. Concept dan logic yang layak dipindahkan ke module internal V2; lifecycle kamera, player assignment, preflight, gesture, dan writing pipeline ditulis ulang sebagai shared layers.

## Motion Learning Hub lama

Dipertahankan sebagai pembelajaran:

- App Router dan route game;
- privacy-first browser processing;
- random math/pattern constraints;
- mirror correction;
- local progress;
- deterministic engine tests.

Tidak dipertahankan:

- companion app launcher;
- satu `GameClient` untuk semua gameplay;
- player count berdasarkan string label;
- nested canvas panel pada camera view;
- hand-only architecture untuk full-body game.

## Math Motion Battle

Dipertahankan:

- procedural operations;
- exact division;
- age constraints;
- digit-by-digit multi-number answer;
- low-confidence retry;
- timer/result lifecycle;
- camera/demo test philosophy.

Diubah:

- tersedia 1 atau 2 pemain;
- expected-answer verifier dipisahkan dari free classifier;
- multi-stroke session;
- preflight shared;
- hand ownership melalui pose ketika dua pemain.

## Math Warung Fullstack

Source game engine menunjukkan state setup, ready, countdown, playing, paused, finished; family roles Pembeli/Kasir; confidence policy; score/streak; serta transaction question flow.

Dipertahankan:

- konteks warung Indonesia;
- family/cooperative mode;
- total, payment, change;
- rupiah dalam ribuan;
- pause/timer/result;
- low-confidence tidak langsung dianggap salah.

Diubah:

- menjadi route internal Next.js;
- menggunakan shared vision/writing layers;
- memilih product langsung dalam module;
- 1-player dan 2-player menjadi option eksplisit.

## Iqro Motion

Dipertahankan dari source MVP:

- 14 huruf: `ا ب ت ث ن ج ح خ د ذ ر ز س ش`;
- tracing, free writing, body/dot checks;
- audio bantuan;
- mouse/touch fallback;
- teacher-review requirement.

Diubah:

- dot stroke satu titik dipertahankan;
- body stroke dan dot stroke dianalisis terpisah;
- generic shared multi-stroke session;
- regression test untuk 14 canonical templates.

Tidak diklaim:

- 28 huruf final;
- standard kaligrafi resmi;
- tajwid atau pronunciation scoring;
- huruf sambung.

## AirBoard Presenter

Dipertahankan:

- pointer, pen, highlighter, eraser;
- pinch drawing;
- vector strokes;
- undo, redo, clear, export;
- image/PDF input;
- presentation/whiteboard concept.

Diubah:

- menjadi internal route;
- shared camera/gesture runtime;
- built-in slide workspace.

Belum dimigrasikan ke candidate ini:

- audience BroadcastChannel window;
- screen recording;
- per-page PDF renderer.

## New full-body modules

Dodge Motion dan Run to Target tidak berasal dari launcher lama. Keduanya memakai shared Pose Landmarker output dan body-action classifier.

- Dodge: left/right/jump/crouch, obstacle/lives, keyboard fallback.
- Run: left/right/forward/back, hold-to-confirm, relative torso-scale depth proxy, keyboard fallback.

## Migration rule

Tidak ada code path di `src/lib/data/games.ts` atau homepage yang membuka repository/project lama. Semua sembilan slug dirender oleh `GameShell` dan internal module di `src/games/`.
