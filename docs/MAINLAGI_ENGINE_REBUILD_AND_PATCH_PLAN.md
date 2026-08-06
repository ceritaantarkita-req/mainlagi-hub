# Mainlagi TV Motion Learning Hub
## Engine Rebuild, AI Strategy, dan Rencana Patch Repository

**Dokumen:** Blueprint teknis dan rencana perbaikan  
**Versi:** 1.0  
**Tanggal:** 6 Agustus 2026  
**Repository:** `ceritaantarkita-req/motion-learning-hub`  
**Status keputusan:** **Jangan merge PR #1 ke `main` sebelum seluruh gate dan acceptance criteria pada dokumen ini terpenuhi.**

---

## 1. Tujuan Dokumen

Dokumen ini merangkum seluruh diskusi mengenai:

- kondisi repository saat ini;
- penyebab engine motion, skeleton, gesture, tracing, handwriting, dan body game tidak presisi;
- perbedaan webapp, localhost, dan local browser processing;
- peran NVIDIA sebagai referensi dan benchmark;
- posisi OpenRouter dalam arsitektur;
- kebutuhan AI tambahan pada engine;
- rekomendasi arsitektur engine baru;
- penyederhanaan scope produk;
- rencana patch jika diminta memperbaiki repository GitHub;
- urutan implementasi, testing, acceptance criteria, dan rollback.

Dokumen ini dirancang sebagai acuan untuk pekerjaan oleh ChatGPT/Codex, Claude Code, Antigravity, atau agentic AI lain tanpa mengubah arah produk yang sudah disepakati.

---

# 2. Ringkasan Eksekutif

## 2.1 Keputusan utama

1. **Mainlagi TV tetap menjadi webapp.**
2. User tidak perlu menginstal aplikasi desktop.
3. Kamera dan computer vision tetap berjalan di browser user.
4. Login, subscription, progress, entitlement, dan analytics boleh berjalan di server.
5. PR #1 tidak boleh di-merge dalam kondisi sekarang.
6. Visual V2 dipertahankan karena secara produk sudah kuat.
7. Motion engine, gesture engine, handwriting engine, tracing engine, dan body action engine perlu dibangun ulang bertahap.
8. OpenRouter tidak digunakan dalam real-time motion loop.
9. NVIDIA digunakan sebagai referensi arsitektur dan benchmark, bukan dependency wajib bagi user.
10. MediaPipe tetap dapat dipertahankan sebagai perception layer awal.
11. AI tambahan yang tepat adalah model kecil spesifik tugas yang berjalan lokal di browser.
12. Jumlah game release awal perlu dikurangi agar kualitas interaction lebih penting daripada jumlah fitur.

## 2.2 Diagnosis inti

Masalah terbesar bukan tidak adanya AI.

Project sudah memakai AI melalui MediaPipe Hand Landmarker dan Pose Landmarker. Masalahnya adalah output perception dipakai terlalu mentah dan terlalu cepat diubah menjadi game event.

Kondisi sekarang kurang lebih:

```text
Camera
→ MediaPipe landmark
→ threshold sederhana
→ game action
```

Arsitektur yang benar:

```text
Camera
→ quality gate
→ hand/body detection
→ temporal smoothing
→ calibration
→ persistent player tracking
→ gesture/action state machine
→ confidence and stability gate
→ game event
```

Untuk handwriting:

```text
Fingertip
→ smoothed cursor
→ stroke state machine
→ cleanup and normalization
→ raster image
→ task-specific classifier
→ expected-answer validation
→ feedback
```

---

# 3. Kondisi Repository Saat Ini

## 3.1 Struktur branch

Pada saat audit dilakukan:

- `main` masih berisi Motion Learning Hub V1.
- V2 berada di branch:

```text
feature/mainlagitv-v2.0.2-ts6-fix
```

- V2 diajukan melalui Draft PR #1.
- PR tersebut mengganti sebagian besar aplikasi, bukan sekadar TypeScript 6 fix.
- PR tidak boleh dianggap siap hanya karena GitHub menandainya mergeable.

## 3.2 Status quality gate

Audit menemukan:

- build lokal dapat berhasil;
- GitHub Actions gagal;
- ESLint menemukan 18 error dan 5 warning;
- dependency audit menemukan 3 high severity vulnerabilities;
- production audit belum dapat dianggap lulus;
- physical camera QA belum terbukti;
- real browser E2E belum ada;
- beberapa QA screenshot berasal dari preview HTML terpisah, bukan aplikasi Next.js sebenarnya.

## 3.3 Mismatch requirement dan implementasi

### Iqro Motion

Registry menyatakan mendukung 1–2 pemain, tetapi implementasi hanya benar-benar memakai Player A.

### Number Trace

Copy menyebut arah dan kelengkapan dinilai, tetapi scorer saat ini menerima path terbalik dan mirror.

### Shape Quest

Copy menyebut closure check dan adaptive target, tetapi implementasi belum memiliki validation tersebut secara nyata.

### Run to Target

Maju dan mundur diperkirakan dari ukuran torso, bukan true depth.

### Math Warung

Pemilihan object masih terlalu presisi dan tidak ramah air cursor.

### QA browser

QA statis tidak membuktikan runtime React, kamera, auth, game interaction, atau mobile behavior sebenarnya.

## 3.4 Regresi deployment

Branch V2 menghapus beberapa file operasional V1 seperti:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- sebagian dokumentasi deployment dan privacy

Jika target akhir adalah VPS Docker, file ini perlu dibangun kembali atau dipulihkan secara selektif.

---

# 4. Penegasan: Webapp vs Local Processing

## 4.1 Webapp

Mainlagi TV harus diakses melalui browser dan user cukup membuka website, login, berlangganan, memberi izin kamera, lalu bermain. Tidak ada kebutuhan instalasi aplikasi desktop.

## 4.2 Localhost

`http://localhost:3000` hanya alamat saat development. Saat production, alamat berubah menjadi domain publik.

## 4.3 Local browser processing

“Diproses lokal” berarti:

- video tidak harus dikirim ke server;
- MediaPipe/ONNX/TensorFlow.js berjalan di browser;
- frame webcam diproses di perangkat user;
- server hanya menerima event, progress, subscription, dan analytics yang diperlukan.

Arsitektur ini cocok untuk web subscription karena latency rendah, biaya server lebih murah, privasi lebih baik, dan tetap bisa dimainkan dari browser.

---

# 5. Arsitektur Produk Target

```text
MAINLAGI TV WEBAPP
│
├── Public Website
│   ├── Landing page
│   ├── Game catalog
│   ├── Pricing
│   ├── FAQ
│   ├── Privacy
│   └── Terms
│
├── Authenticated Product
│   ├── Free games
│   ├── Premium games
│   ├── Subscription entitlement
│   ├── Parent dashboard
│   ├── Child/player profiles
│   ├── Progress
│   └── Session history
│
├── Browser Real-Time Engine
│   ├── Camera manager
│   ├── Hand perception
│   ├── Pose perception
│   ├── Temporal smoothing
│   ├── Calibration
│   ├── Player tracking
│   ├── Gesture state machine
│   ├── Air cursor
│   ├── Handwriting recognition
│   ├── Tracing scorer
│   └── Body action recognition
│
├── Server
│   ├── Supabase Auth
│   ├── PostgreSQL
│   ├── Subscription status
│   ├── Progress sync
│   ├── Admin APIs
│   ├── OpenRouter proxy
│   └── Rate limiting
│
└── Optional AI Layer
    ├── Tutor explanation
    ├── Parent report
    ├── Question generation
    ├── Personalized coaching
    └── Content localization
```

---

# 6. Peran NVIDIA

## 6.1 Digunakan sebagai referensi

Teknologi NVIDIA dapat dijadikan referensi untuk temporal pose tracking, persistent person identity, multi-person tracking, joint confidence, 3D-relative pose, occlusion recovery, low-jitter skeleton, action sequence modeling, dan performance profiling.

## 6.2 Tidak dijadikan dependency wajib

Mainlagi TV menargetkan browser umum di Indonesia. Tidak semua user memiliki NVIDIA RTX GPU, CUDA, TensorRT, hardware kelas gaming, atau desktop Windows yang kompatibel. Karena itu NVIDIA Maxine atau DeepStream tidak boleh menjadi satu-satunya production engine.

## 6.3 Opsi pemakaian yang disarankan

### Benchmark lab

Bandingkan video yang sama:

```text
MediaPipe browser
vs
NVIDIA reference
vs
engine Mainlagi V3
```

Metrik:

- keypoint jitter;
- tracking loss;
- player identity swap;
- action latency;
- false crouch;
- false jump;
- recovery setelah occlusion;
- FPS;
- CPU/GPU load.

### Tidak disarankan untuk MVP

Mengirim webcam user ke GPU server NVIDIA karena mahal, latency, privacy lebih rumit, bandwidth besar, dan tidak cocok untuk koneksi yang tidak stabil.

---

# 7. Peran OpenRouter

## 7.1 OpenRouter tidak masuk ke real-time engine

OpenRouter tidak dipakai untuk fingertip tracking, skeleton tracking, Player A/B assignment, gesture per frame, jump/crouch per frame, collision, air cursor, tracing, object selection, countdown, atau handwriting classification real-time.

## 7.2 OpenRouter dipakai sebagai optional intelligence layer

Cocok untuk AI tutor, penjelasan kesalahan, parent report, question generation, dynamic coaching copy, translation, content generation, development QA, dan analisis log session.

## 7.3 Arsitektur aman

```text
Browser
→ Next.js server endpoint
→ OpenRouter
```

Jangan pernah menaruh API key di frontend.

Gunakan:

```env
OPENROUTER_API_KEY=...
```

Bukan:

```env
NEXT_PUBLIC_OPENROUTER_API_KEY=...
```

## 7.4 Fallback wajib

Game tetap harus dapat dimainkan walaupun OpenRouter gagal.

---

# 8. AI yang Menempel ke Engine

## 8.1 AI yang sudah ada

MediaPipe Hand Landmarker dan Pose Landmarker sudah merupakan AI perception layer.

## 8.2 AI tambahan yang direkomendasikan

### Digit classifier

Prioritas pertama. Input 64×64 grayscale raster dan output probability 0–9. Runtime menggunakan ONNX Runtime Web atau TensorFlow.js.

### Latin uppercase classifier

Ditambahkan setelah digit stabil.

### Hijaiyah classifier

Bukan prioritas awal. Tahap awal lebih aman memakai guided tracing.

### Temporal action classifier

Ditambahkan bila pose rule-based yang sudah dioptimalkan masih belum stabil. Input berupa 30–60 frame normalized pose landmarks.

### Custom gesture classifier

Ditambahkan hanya jika gesture standar masih tidak memadai.

## 8.3 Strategi AI

```text
MediaPipe
= melihat tangan dan tubuh

Deterministic engine
= membuat perception stabil dan aman

Small task-specific AI
= mengenali digit, huruf, dan temporal actions

OpenRouter
= tutor, content, dan laporan
```

---

# 9. Engine Target

## 9.1 Vision quality gate

Sebelum game menerima input:

- frame terang;
- blur tidak berlebihan;
- tubuh/tangan cukup besar;
- user tidak terlalu dekat;
- jumlah orang sesuai mode;
- confidence joint cukup;
- tubuh tidak terlalu banyak terpotong;
- model FPS minimum terpenuhi.

## 9.2 Temporal smoothing

Rekomendasi awal:

- One Euro Filter untuk cursor;
- exponential smoothing adaptif untuk body center;
- confidence-weighted smoothing untuk joints;
- short dropout interpolation;
- max velocity clamp.

Jangan mengirim raw landmark langsung ke UI/game.

## 9.3 Personal calibration

### Hand writing

- center position;
- comfortable range;
- left/right writing boundary;
- motion scale;
- dominant hand.

### Body

- standing baseline;
- torso scale;
- hip height;
- shoulder width;
- center line;
- safe lean range.

## 9.4 Player tracking

Untuk dua pemain:

- persistent A/B slot;
- body anchor;
- wrist association;
- missing-frame grace;
- reacquisition;
- prevention of identity swap;
- hand candidate ranking;
- support hingga empat detected hands.

## 9.5 Gesture state machine

```text
UNKNOWN
→ CANDIDATE
→ CONFIRMED
→ HELD
→ RELEASED
→ COOLDOWN
```

Gesture tidak dianggap valid dari satu frame.

## 9.6 Hands-free preflight

```text
Camera on
→ body detected
→ skeleton stable
→ gesture calibration
→ "Tunjukkan jempol"
→ thumbs-up hold
→ progress ring
→ voice confirmation
→ countdown 3–2–1
→ game starts
```

Tidak ada kebutuhan mengarahkan mouse setelah user berdiri di depan kamera.

---

# 10. Handwriting Engine Baru

## 10.1 Pipeline

```text
Fingertip landmarks
→ smoothing
→ writing zone mapping
→ stroke state machine
→ resampling
→ de-jitter
→ crop
→ aspect-ratio normalization
→ center
→ rasterize
→ classifier
→ expected-answer validation
→ confidence policy
```

## 10.2 Stroke state machine

```text
IDLE
PEN_READY
DRAWING
TEMPORARY_LOST
STROKE_END
SUBMIT_READY
SUBMITTED
```

Aturan:

- kehilangan pinch singkat tidak langsung memutus stroke;
- open palm tidak submit sebelum glyph memiliki stroke valid;
- accidental dot pada digit dapat diabaikan;
- dot penting untuk Hijaiyah tetap dipertahankan;
- cooldown mencegah double-submit.

## 10.3 Confidence policy

```text
confidence ≥ 0.80
→ accepted

0.55–0.79
→ compare expected answer and shape score

< 0.55
→ unclear, retry without penalty
```

## 10.4 Expected-answer prior

Expected answer boleh membantu, tetapi tidak boleh membuat semua input otomatis benar.

---

# 11. Guided Tracing Engine

## 11.1 Digunakan untuk

- Number Trace;
- Shape Trace;
- Latin tracing;
- Hijaiyah MVP.

## 11.2 Scoring

Gunakan:

- start point;
- end point;
- path direction;
- stroke order;
- corridor coverage;
- off-path penalty;
- completion ratio;
- closure;
- temporal consistency.

## 11.3 Multi-stroke

Stroke boundaries harus dipertahankan. Jangan menggabungkan stroke terpisah seolah ada garis di antaranya.

## 11.4 Hijaiyah

Tahap MVP:

1. trace badan huruf;
2. selesaikan badan;
3. tambahkan titik;
4. validasi jumlah titik;
5. validasi zona titik;
6. audio;
7. feedback.

Free handwriting Hijaiyah ditunda sampai dataset dan model cukup.

---

# 12. Air Cursor dan Object Selection

## 12.1 Tidak membutuhkan object detection AI

Untuk card UI Math Warung, sistem sudah mengetahui posisi setiap card.

Yang dibutuhkan:

- smoothed fingertip;
- large hitbox;
- magnetic snapping;
- dwell;
- pinch optional;
- visual feedback;
- audio feedback.

## 12.2 Interaction model

```text
Pointer enters target
→ target highlights
→ progress ring fills
→ hold 800–1000 ms
→ selection confirmed
```

## 12.3 Accessibility

- target besar;
- spacing lebar;
- sticky focus;
- cancel gesture;
- keyboard fallback;
- touch fallback.

---

# 13. Body Games

## 13.1 Dodge Motion

Masih layak dipertahankan setelah redesign dengan action relatif dan aman: lean left, lean right, crouch, hands-up, dan center.

## 13.2 Run to Target

Konsep maju/mundur sebaiknya diubah. Rekomendasi nama baru: Pose to Target, Move to Target, atau Body Zone Challenge.

Target:

- kiri;
- kanan;
- tengah;
- jongkok;
- tangan atas;
- rentangkan tangan;
- lean.

Jangan menjanjikan true depth atau room mapping.

## 13.3 Room detection

Yang realistis:

- framing check;
- user terlalu dekat/jauh;
- full body visible;
- center position;
- left/right space dalam frame;
- third-person detection;
- floor visibility estimate.

Yang tidak boleh dijanjikan:

- ukuran ruangan akurat;
- jarak tembok;
- area di luar frame aman;
- obstacle mapping tanpa depth sensor.

---

# 14. Scope Produk yang Direkomendasikan

## 14.1 Release awal

1. **Math Motion Battle** — digit 0–9, satu pemain dahulu.
2. **Number Trace** — guided, direction, start/end, coverage.
3. **Shape Trace** — lingkaran, segitiga, persegi, closure.
4. **Math Warung** — air cursor, dwell selection, digit answer.

## 14.2 Experimental

- Pattern Race;
- Iqro guided tracing;
- AirBoard.

## 14.3 Ditahan atau didesain ulang

- Dodge Motion;
- Run to Target.

---

# 15. Rencana Patch Repository

Jika diminta membuat patch, pekerjaan tidak langsung dilakukan dalam satu commit besar.

## 15.1 Branch

Branch yang digunakan:

```text
feature/mainlagitv-motion-engine-v3
```

## 15.2 Prinsip patch

- tidak merge langsung;
- tidak mengubah `main`;
- tidak menghapus V2 visual;
- setiap fase memiliki commit terpisah;
- setiap commit harus buildable;
- setiap fase memiliki acceptance criteria;
- perubahan engine tidak dicampur dengan subscription;
- dependency update tidak dicampur dengan gameplay rewrite;
- rollback dapat dilakukan per fase.

---

# 16. Fase Patch

## Fase 0 — Baseline dan Proteksi

### Pekerjaan

- fetch branch terbaru;
- simpan current commit SHA;
- pastikan PR tetap Draft;
- buat branch V3;
- jalankan clean install;
- catat Node/npm;
- jalankan seluruh test;
- simpan hasil;
- tambahkan `.nvmrc` atau Volta;
- tambahkan deterministic lockfile policy;
- pulihkan atau tentukan deployment target.

## Fase 1 — Quality Gate dan Repo Hygiene

### Pekerjaan

- perbaiki 18 ESLint errors;
- hapus unused disable;
- ganti internal `<a>` dengan `Link`;
- hilangkan impure calls saat render;
- hilangkan `any` pada vision runtime;
- format file padat;
- tambahkan Prettier;
- pisahkan one-line components;
- ubah CI ke `npm ci`;
- pisahkan job lint/test/build/audit;
- audit tetap berjalan dengan `if: always()`;
- tambahkan Windows CI;
- perbarui PR title dan body;
- perbarui QA report.

### Acceptance criteria

```text
npm ci
npm run typecheck
npm run lint
npm run test:engine
npm run simulate
npm run build
```

Semua lulus lokal dan CI.

## Fase 2 — Dependency Security

### Pekerjaan

- `npm explain postcss`;
- `npm explain sharp`;
- evaluasi override aman;
- hindari `npm audit fix --force`;
- jalankan clean install;
- jalankan production audit;
- dokumentasikan residual risk.

## Fase 3 — Vision Runtime Stabilization

### File target utama

```text
src/lib/vision/useVisionRuntime.ts
src/lib/vision/player-assignment.ts
src/lib/vision/types.ts
src/lib/vision/gesture.ts
src/components/VisionOverlay.tsx
```

### Pekerjaan

- typed MediaPipe interfaces;
- frame quality metrics;
- One Euro Filter;
- smoothing per landmark;
- confidence gate;
- dropout interpolation;
- hand candidate ranking;
- up to four hand detection in two-player mode;
- separate detection, gesture, and handedness confidence;
- runtime performance budget;
- reduced React publish frequency;
- model loading telemetry;
- GPU/CPU fallback status.

## Fase 4 — Hands-Free Preflight

### Pekerjaan

- thumbs-up recognition;
- hold progress;
- voice prompt;
- auto countdown;
- cancel gesture;
- no mouse requirement;
- camera restart flow;
- accessible fallback button.

## Fase 5 — Air Cursor dan Math Warung

### Pekerjaan

- smoothed cursor;
- large hitbox;
- magnetic snap;
- dwell progress;
- pinch optional;
- card focus state;
- sound;
- keyboard/touch fallback;
- no object detector required.

## Fase 6 — Guided Tracing

### Pekerjaan

- preserve stroke boundaries;
- start/end validation;
- direction validation;
- corridor coverage;
- closure;
- off-path penalty;
- stroke order;
- separate shape and trace scorers;
- guided Hijaiyah stages.

## Fase 7 — Digit AI Classifier

### Pekerjaan

- rasterizer;
- model loader;
- ONNX Runtime Web;
- WebGPU/WASM fallback;
- worker inference;
- confidence policy;
- expected-answer fusion;
- offline fallback;
- model versioning.

## Fase 8 — Body Action Engine

### Pekerjaan

- normalized joint angles;
- temporal hold;
- calibrated thresholds;
- action hysteresis;
- remove true-depth claims;
- redesign Run to Target;
- throttle animation state;
- collision based on stable action event;
- safety prompts.

## Fase 9 — Real Browser E2E

### Pekerjaan

- Playwright against actual Next.js app;
- mock camera landmarks;
- test preflight;
- test game start;
- test pause;
- test replay;
- test one/two player;
- test mobile overflow;
- test auth fallback;
- test affiliate flow;
- upload artifact.

## Fase 10 — Privacy, Auth, dan Subscription Foundation

### Pekerjaan

- privacy page;
- terms;
- child/parent disclosure;
- role-based admin UI;
- remove public email as authority;
- CSP;
- frame protection;
- production headers;
- subscription entitlement table;
- premium route guard;
- server-side API key handling;
- OpenRouter proxy optional.

Subscription tidak dicampur dengan engine patch awal. Engine harus stabil dahulu.

---

# 17. File dan Modul Baru yang Direkomendasikan

```text
src/lib/vision/
├── filters/
│   ├── one-euro.ts
│   ├── ema.ts
│   └── dropout.ts
├── calibration/
│   ├── hand-calibration.ts
│   └── body-calibration.ts
├── quality/
│   └── vision-quality.ts
├── tracking/
│   ├── player-tracker.ts
│   └── hand-association.ts
├── gesture/
│   ├── gesture-state-machine.ts
│   └── thumbs-up.ts
└── runtime/
    ├── mediapipe-adapter.ts
    └── vision-runtime.ts

src/lib/interaction/
├── air-cursor.ts
├── magnet.ts
├── dwell.ts
└── focus-target.ts

src/lib/recognition/
├── rasterize.ts
├── digit-model.ts
├── confidence.ts
└── expected-answer.ts

src/lib/tracing/
├── corridor.ts
├── direction.ts
├── closure.ts
├── stroke-order.ts
└── score.ts

src/workers/
├── digit-worker.ts
└── vision-worker.ts
```

---

# 18. Testing Strategy

## 18.1 Unit tests

- filters;
- gesture timing;
- dwell;
- player assignment;
- tracing;
- digit confidence;
- body action;
- timer;
- score;
- subscription entitlement.

## 18.2 Synthetic landmark tests

- noisy hand;
- missing wrist;
- crossing players;
- order swap;
- temporary disappearance;
- low FPS;
- left-handed user;
- right-handed user;
- child/adult scale.

## 18.3 Recorded test clips

Gunakan test video lokal yang tidak dimasukkan ke public repo bila mengandung wajah.

## 18.4 Physical QA

Minimal:

- 3 child profiles;
- 3 adult profiles;
- internal webcam;
- external webcam;
- laptop low/mid/high;
- 10-minute session;
- restart camera;
- route navigation;
- two-player crossing.

---

# 19. Metrics

## Vision

- fingertip jitter;
- body center jitter;
- FPS;
- dropped frame;
- tracking loss;
- reacquisition time;
- identity swap.

## Gesture

- false positive;
- false negative;
- trigger latency;
- double trigger;
- accidental submit.

## Handwriting

- digit accuracy;
- unclear rate;
- wrong acceptance;
- per-digit confusion;
- average retry count;
- inference latency.

## Tracing

- correct accept rate;
- reversed-path reject rate;
- off-path detection;
- completion ratio;
- average time.

## Body games

- false crouch;
- false jump;
- action latency;
- missed action;
- gameplay completion.

## Product

- game start success;
- time to start;
- session completion;
- early exit;
- retry frequency;
- subscription conversion.

---

# 20. Acceptance Criteria Sebelum Merge

## Engineering

- CI hijau;
- no lint error;
- no type error;
- build lulus;
- no high/critical production audit;
- real Playwright E2E lulus;
- clean clone dapat dijalankan.

## Motion

- hands-free preflight berhasil;
- cursor stabil;
- no severe identity swap;
- temporary loss dapat pulih;
- one/two player diuji.

## Games

- digit game playable;
- Number Trace direction benar;
- Shape closure benar;
- Math Warung selection mudah;
- Iqro scope sesuai implementasi;
- body game tidak memakai klaim room mapping palsu.

## Privacy

- webcam tidak di-upload;
- disclosure jelas;
- admin authorization konsisten;
- no secret in client;
- privacy page tersedia.

## Deployment

- target Vercel atau Docker ditentukan;
- deployment docs tersedia;
- model download/fallback diuji;
- healthcheck tersedia bila Docker.

---

# 21. Commit Strategy

```text
chore: establish reproducible V3 baseline
fix: resolve lint and React purity violations
ci: split quality, build, audit, and Windows jobs
security: resolve production dependency advisories
refactor: modularize vision runtime
feat: add temporal landmark smoothing
feat: add persistent multi-player tracking
feat: add hands-free thumbs-up preflight
feat: add magnetic air cursor and dwell selection
feat: replace path scorer with guided tracing engine
feat: add browser digit classifier
refactor: redesign body action engine
test: add real Next.js Playwright coverage
docs: update QA, privacy, deployment, and architecture
```

---

# 22. Pull Request Strategy

## PR 1 — Quality and Security

- lint;
- type;
- dependency;
- CI;
- formatting;
- docs truthfulness.

## PR 2 — Vision Runtime

- smoothing;
- calibration;
- tracking;
- confidence.

## PR 3 — Hands-Free and Air Cursor

- thumbs-up;
- dwell;
- Math Warung.

## PR 4 — Tracing

- Number;
- Shape;
- Iqro guided.

## PR 5 — Digit Classifier

- raster;
- model;
- inference;
- metrics.

## PR 6 — Body Games

- Dodge;
- redesigned target game.

## PR 7 — Subscription and AI Features

- entitlement;
- pricing;
- OpenRouter optional.

Memecah PR membuat audit dan rollback jauh lebih aman daripada satu PR 180 file.

---

# 23. Rollback Plan

Sebelum patch:

- catat current SHA;
- tag baseline;
- jangan delete branch V2;
- backup lockfile;
- backup Supabase schema;
- backup deployment config.

Jika fase gagal:

- revert commit fase;
- pertahankan visual;
- kembalikan fallback mouse/keyboard;
- disable beta game melalui registry;
- jangan memaksa merge.

Feature flags:

```env
NEXT_PUBLIC_ENABLE_DIGIT_AI=false
NEXT_PUBLIC_ENABLE_TWO_PLAYER=false
NEXT_PUBLIC_ENABLE_BODY_GAMES=false
NEXT_PUBLIC_ENABLE_IQRO_FREEWRITE=false
```

---

# 24. Informasi yang Dibutuhkan Sebelum Patch

1. target deployment: Vercel, VPS Docker, atau keduanya;
2. prioritas game release pertama;
3. satu pemain dahulu atau dua pemain wajib;
4. target device minimum;
5. browser target;
6. apakah Iqro tetap dua pemain;
7. apakah Run to Target didesain ulang;
8. apakah subscription dikerjakan setelah engine;
9. apakah tersedia video test;
10. apakah boleh membuat branch baru dan beberapa PR;
11. apakah dependency override diperbolehkan;
12. apakah NVIDIA benchmark akan dilakukan.

---

# 25. Rencana Kerja Jika User Meminta Patch

1. Audit ulang branch terbaru.
2. Buat branch V3 dari base yang disetujui.
3. Buat baseline report dan jalankan clean quality gate.
4. Perbaiki quality gate dahulu tanpa mengubah gameplay besar.
5. Buat PR quality/security pertama.
6. Setelah hijau, patch vision runtime secara modular.
7. Tambahkan test dan metrik sebelum menambah digit AI.
8. Lakukan physical QA dan revisi threshold berdasarkan data.
9. Buat release candidate baru.
10. Merge hanya setelah seluruh acceptance criteria disetujui user.

---

# 26. Hal yang Tidak Akan Dilakukan

Tanpa persetujuan eksplisit, patch tidak akan:

- merge ke `main`;
- menghapus branch lama;
- menaruh OpenRouter key di frontend;
- mengirim webcam ke server;
- memakai `npm audit fix --force`;
- menjadikan NVIDIA GPU requirement;
- mengaktifkan subscription paywall sebelum engine stabil;
- mengklaim room mapping;
- mengubah seluruh UI V2;
- menyimpan wajah anak;
- mengumpulkan training data tanpa consent.

---

# 27. Verdict Akhir

Visual dan product direction Mainlagi TV sudah layak dipertahankan.

Masalah utama adalah bahwa engine perception, temporal processing, interaction design, dan recognition belum matang untuk pengalaman anak yang natural.

Strategi yang benar:

```text
MediaPipe perception
+
strong deterministic engine
+
personal calibration
+
temporal smoothing
+
task-specific browser AI
+
physical QA
+
optional OpenRouter intelligence
```

Prioritas terdekat:

1. jangan merge;
2. benahi quality gate;
3. stabilkan hand/body tracking;
4. buat hands-free preflight;
5. buat air cursor yang toleran;
6. bangun tracing engine yang benar;
7. tambahkan digit classifier lokal;
8. redesign body games;
9. baru lanjut subscription dan AI tutor.

---

## Status Dokumen

Dokumen ini menjadi blueprint utama untuk perbaikan repository Mainlagi TV Motion Learning Hub dan dapat digunakan sebagai dasar prompt implementasi ke Codex atau agentic AI lain.
