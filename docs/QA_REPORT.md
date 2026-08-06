# QA Report — Mainlagi TV Motion Learning Hub V2

Tanggal: 5 Agustus 2026  
Scope: source package di ZIP, pure engine, portable TypeScript, structure/security audit, generated visual preview, dan simulation invariants.

## Kesimpulan

Portable quality gate final lulus lima kali dengan lima seed batch yang berbeda pada setiap pass. Tidak ada invariant error pada scope yang diuji. Hasil ini bukan bukti bahwa semua webcam fisik, browser, OAuth credential, dan deployment production bebas masalah.

Full dependency-aware Next.js gate belum dapat dijalankan di environment pembuatan ZIP karena registry internal mengembalikan `404` untuk `@mediapipe/tasks-vision@0.10.35`. Bukti kegagalan environment disimpan di `qa/npm-install-environment.log`. Laptop penerima wajib menjalankan `VERIFY_WINDOWS.ps1` sebelum source di-push atau di-merge.


## Koreksi Windows verifier — V2.0.1

Pada V2.0.0, `VERIFY_WINDOWS.ps1` salah menjalankan portable gate sebelum `npm install`. Karena portable gate tetap memerlukan executable TypeScript (`tsc`), laptop bersih berhenti dengan pesan `tsc is not recognized`. V2.0.1 memindahkan dependency install ke tahap kedua dan memverifikasi keberadaan `node_modules\.bin\tsc.cmd` sebelum menjalankan gate. Error tersebut terjadi sebelum perubahan source atau build dijalankan.

## Lima full portable pass

Masing-masing pass menjalankan:

1. required-file dan internal-route validation;
2. source/security scan;
3. portable TypeScript check;
4. 13 pure-engine tests;
5. lima simulation run dengan seed berbeda;
6. static preview build.

Evidence:

- `qa/full-pass-1.log`
- `qa/full-pass-2.log`
- `qa/full-pass-3.log`
- `qa/full-pass-4.log`
- `qa/full-pass-5.log`
- `qa/five-full-pass-summary.json`

Aggregate dari lima pass:

| Pemeriksaan | Jumlah |
|---|---:|
| Full portable passes | 5 |
| Engine test executions | 65 |
| Simulation runs | 25 |
| Random math questions | 1,500,000 |
| Random pattern questions | 750,000 |
| Countdown sequences | 2,500 |
| Noisy digit samples | 5,000 |
| Shape canonical checks | 125 |
| Hijaiyah canonical checks | 350 |
| Player-order swap checks | 25 |
| Invariant errors | 0 |

## Automated engine coverage

13 tests mencakup:

- constraint matematika TK, SD 1, SD 2;
- pattern integer constraints;
- monotonic countdown dan termination;
- multi-stroke lifecycle;
- canonical digit 0–9;
- body-action classification;
- gesture hysteresis/latch;
- 14 unique Hijaiyah MVP labels;
- one-point dot stroke preservation;
- temporal Player A/B assignment ketika detection order berubah;
- canonical Hijaiyah body, dot count, dan dot-zone validation.

## Bug yang ditemukan dan diperbaiki selama audit

### 1. Alif selalu gagal canonical simulation

Penyebab: generic path scorer menolak target di bawah empat titik, sedangkan template Alif adalah garis dua titik.

Perbaikan: path scorer sekarang menerima path minimal dua titik. Ditambahkan regression test untuk seluruh 14 template Hijaiyah.

### 2. Dot Hijaiyah dapat hilang

Penyebab: filter stroke umum sebelumnya berpotensi membuang stroke satu titik.

Perbaikan: `usableStrokes()` mempertahankan stroke satu titik. Digit recognizer memiliki filter kecilnya sendiri agar accidental dot tidak mengganggu digit.

### 3. Player A/B dapat bertukar saat urutan deteksi MediaPipe berubah

Penyebab: assignment berdasarkan urutan satu frame.

Perbaikan: `BodySlotTracker` mempertahankan anchor temporal dan memilih assignment dengan movement cost terendah.

### 4. Gesture chatter dapat memutus tulisan

Perbaikan: `GestureLatch` menerapkan beberapa stable frame untuk enter/exit state. Pinch membuat pen-down; release hanya mengakhiri satu stroke; glyph tetap terbuka sampai submit.

### 5. Single-player masih berisiko memakai struktur split

Perbaikan: player count menjadi state eksplisit; pad satu pemain memakai seluruh area. Divider hanya dirender untuk module dua pemain.

### 6. Low-confidence recognition menghukum user

Perbaikan: low-confidence menjadi retry dan memberi time grace. Penalty hanya terjadi jika classifier cukup yakin membaca digit lain.

### 7. Privilege escalation pada profile role

Perbaikan: RLS tidak mengizinkan client mengubah role sendiri. Role admin hanya diubah melalui trusted backend/Supabase dashboard.

### 8. Affiliate click logging memakai jalur client yang tidak tepat

Perbaikan: click log dilakukan server-side menggunakan optional service-role key. Client tidak memiliki izin insert click event.

## Browser/static visual QA

Preview statis yang dihasilkan dari design source diperiksa dengan Chromium:

| Surface | Viewport | Result |
|---|---|---|
| Homepage desktop | 1440×1000 | 9 rows, 0 page errors, 0 horizontal overflow |
| Homepage mobile | 390×844 | 9 rows, 0 page errors, 0 horizontal overflow |
| Preflight desktop | 1440×900 | 5 checks, 0 page errors, 0 horizontal overflow |

Evidence:

- `qa/browser-qa.json`
- `qa/home-desktop.png`
- `qa/home-mobile.png`
- `qa/preflight-desktop.png`

Static preview bukan pengganti real Next.js runtime QA. Ia dipakai untuk memeriksa identitas visual baru, jumlah module, responsive overflow, dan struktur preflight.

## Source audit

Final source scan melaporkan:

- 51 source files;
- sembilan internal module;
- 10 OG images;
- tidak ada companion/external game launcher;
- tidak ada hard-coded service key;
- gesture preflight tersedia;
- temporal player slots tersedia;
- replay overlay tersedia.

## Gate yang wajib dijalankan di laptop

```powershell
powershell -ExecutionPolicy Bypass -File .\VERIFY_WINDOWS.ps1
```

Script tersebut menjalankan:

```text
npm install
npm run check
npm audit --omit=dev --audit-level=high
```

Jangan push atau merge ketika salah satu command gagal.

## Physical camera gate

Synthetic tests tidak dapat membuktikan real-world detection. Ikuti `docs/CAMERA_QA.md` untuk:

- 1 dan 2 pemain;
- child/adult;
- tangan kanan/kiri;
- lighting terang, indoor, redup, backlight;
- crossing hands;
- internal/external webcam;
- sesi minimal 10 menit;
- Dodge/Run safety area.
