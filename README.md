# Mainlagi Hub

**Mainlagi Hub** adalah platform motion-learning dan edutainment yang sedang dikembangkan untuk keluarga Indonesia. Produk saat ini sudah memiliki **10 game/experience berbasis gerak tangan dan tubuh** dengan computer vision di browser. Arah produk berikutnya memperluas fondasi ini menjadi platform belajar anak usia **3–7 tahun** tanpa membuang motion engine atau game yang sudah ada.

> Status: **public open-source core**, active development. Source code repository ini menggunakan `AGPL-3.0-only`, dengan jalur commercial/paid yang terpisah. Fitur yang ditandai **Planned** belum dianggap tersedia di production.

## Prinsip utama

- **Motion/vision engine yang sekarang dipertahankan.** Tidak ada rencana rewrite atau membuang engine hanya untuk mengejar arah produk baru.
- **10 game yang sekarang tetap dipertahankan** dan akan menjadi bagian dari activity/runtime layer Mainlagi.
- Fitur edukasi baru dibangun **di atas fondasi yang ada**, bukan menggantikan fondasi tersebut.
- Pengalaman anak harus child-first, playful, joyful, gameful, aman, dan mudah dipakai keluarga Indonesia.
- Kamera diproses di perangkat/browser sejauh runtime saat ini memungkinkan; aplikasi tidak mempunyai jalur upload video mentah sebagai bagian dari gameplay normal.

## Yang sudah ada sekarang

Semua experience memakai route internal `/play/[slug]`.

1. **Math Pilih Jawaban** — pilihan ganda berbasis gesture, 1–2 pemain.
2. **Math Motion Battle** — menjawab matematika dengan menulis angka di udara, 1–2 pemain.
3. **Number Trace Adventure** — guided number tracing.
4. **Shape Quest** — menggambar dan menilai bentuk.
5. **Pattern Race** — menyelesaikan pola dengan jawaban tulisan udara.
6. **Math Warung** — simulasi belanja, total, pembayaran, dan kembalian dengan konteks Rupiah.
7. **Iqro Motion** — tracing/tulisan Hijaiyah, titik, dan audio pendamping.
8. **AirBoard Presenter** — whiteboard/presenter berbasis gesture.
9. **Beat Motion** — body-motion rhythm/three-lane experience.
10. **Run to Target** — body-position target game dengan kalibrasi.

Definisi canonical game ada di `src/lib/data/games.ts`.

## Arah produk berikutnya — Planned

Mainlagi akan berkembang dari motion-game hub menjadi learning platform anak usia 3–7 tahun dengan lima area utama:

- Bahasa Indonesia
- English
- Matematika
- Iqro
- Mewarnai

Arah ini juga mencakup:

- Bahasa UI Indonesia dan English.
- Audio/narration native Indonesia dan English.
- Stage/progression learning path.
- Animasi, sound effect, reward, dan interaction yang lebih gameful.
- Parent area, laporan perkembangan, dan certificate/export.
- Lima karakter utama: **Naya, Gian, Zia, Paca, dan Gavi**.

Detail arah produk: [`docs/PRODUCT_DIRECTION.md`](docs/PRODUCT_DIRECTION.md).

## OCR + AI engine — Planned

Mainlagi juga direncanakan memiliki **OCR/visual-understanding engine** untuk aktivitas belajar yang membutuhkan pembacaan tulisan, lembar kerja, atau input visual. Desainnya harus modular: OCR lokal/deterministik bila sesuai, lalu AI dapat dipakai sebagai verifier/enrichment layer.

Integrasi AI yang direncanakan menggunakan **OpenRouter** dengan prinsip BYOK/configured-by-operator:

- API key tidak pernah di-hardcode di repository.
- API key tidak boleh memakai prefix `NEXT_PUBLIC_` dan tidak boleh dikirim ke browser.
- Panggilan OpenRouter harus melewati server-side boundary.
- Model harus configurable, bukan tertanam permanen pada satu provider/model.
- Data anak dan frame kamera tidak boleh otomatis dikirim ke model eksternal; minimisasi payload dan privacy gate wajib dirancang sebelum fitur diaktifkan.

Detail: [`docs/AI_OCR_OPENROUTER.md`](docs/AI_OCR_OPENROUTER.md).

## Arsitektur saat ini

```text
Next.js App Router
├── Platform shell / auth / discover / affiliate / admin
├── GameShell + Preflight
├── 10 internal game experiences
├── Shared interaction/game engine
└── Shared browser vision runtime
    ├── MediaPipe Hand Landmarker
    ├── MediaPipe Pose Landmarker
    ├── optional face signal
    ├── player assignment & hand ownership
    ├── gesture latch / smoothing
    └── body-action classification
```

Teknologi utama:

- Next.js 16 + React 19 + TypeScript
- MediaPipe Tasks Vision
- Supabase Auth/Postgres/RLS untuk fitur cloud yang dikonfigurasi
- local-first browser state untuk sebagian progress/family data
- OpenNext/Cloudflare path dan VPS deployment path
- Capacitor preparation untuk wrapper native

Lihat [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Menjalankan lokal

### Requirements

- Node.js 20.9+
- npm 10+
- Chrome/Edge modern
- `localhost` atau HTTPS untuk akses kamera

### Setup

```bash
git clone https://github.com/ceritaantarkita-req/mainlagi-hub.git
cd mainlagi-hub
npm ci
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Supabase bersifat optional untuk sebagian flow lokal, tetapi fitur auth/cloud/admin membutuhkan konfigurasi backend yang sesuai. Jangan pernah commit `.env.local`, service-role key, OpenRouter key, atau credential lain.

## Quality gates

```bash
npm run validate:structure
npm run audit:source
npm run typecheck
npm run lint
npm run test:engine
npm run simulate
npm run build
npm audit --omit=dev --audit-level=high
```

Windows helper tersedia melalui `VERIFY_WINDOWS.ps1`.

Physical camera QA tetap penting karena unit/simulation test tidak menggantikan validasi gesture di kamera nyata. Lihat `docs/CAMERA_QA.md`.

## Privasi & keamanan

Mainlagi ditujukan untuk anak, sehingga perubahan yang menyentuh kamera, profil anak, analytics, voice, OCR, atau AI harus menggunakan prinsip **data minimization, explicit boundary, least privilege, dan fail-closed untuk secret**.

Security policy: [`SECURITY.md`](SECURITY.md).

## Open source + commercial edition

Source code Mainlagi Hub dirilis di bawah **GNU Affero General Public License v3.0 only (`AGPL-3.0-only`)**, kecuali file yang secara eksplisit menyatakan lisensi lain.

AGPL adalah lisensi open-source dan **mengizinkan commercial use** selama pihak yang memakai, memodifikasi, mendistribusikan, atau menyediakan versi networked mematuhi kewajiban lisensinya. Commercial license Mainlagi bukan biaya wajib hanya karena sebuah penggunaan menghasilkan uang; jalur tersebut ditujukan untuk hak/terms alternatif yang dinegosiasikan terpisah atau untuk produk, layanan, dan aset proprietary yang memang tidak dirilis sebagai bagian dari community core.

Model bisnis Mainlagi adalah **open-source core + paid/commercial offering**. Batas canonical antara community core dan komponen paid/proprietary dijelaskan di [`OPEN_CORE.md`](OPEN_CORE.md).

Lihat:

- [`LICENSE`](LICENSE)
- [`OPEN_CORE.md`](OPEN_CORE.md)
- [`COMMERCIAL_LICENSE.md`](COMMERCIAL_LICENSE.md)
- [`TRADEMARKS.md`](TRADEMARKS.md)
- [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)

**Penting:** lisensi source code tidak memberi izin memakai nama, logo, trademark, karakter, character artwork, voice identity, atau premium learning content Mainlagi sebagai brand milik pihak lain.

## Kontribusi

Baca [`CONTRIBUTING.md`](CONTRIBUTING.md) dan [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) sebelum membuka PR.

Untuk menjaga kemungkinan commercial licensing di masa depan, kontribusi eksternal yang akan digabung ke core dapat memerlukan contributor licensing terms tambahan. Detailnya dijelaskan di `CONTRIBUTING.md`.

## Public-repository security checklist

Repository ini sudah **Public**. Checklist di [`docs/PUBLIC_RELEASE_CHECKLIST.md`](docs/PUBLIC_RELEASE_CHECKLIST.md) sekarang dipakai sebagai audit pasca-publik dan kontrol berkelanjutan, termasuk history secret scan, Actions-log review, third-party asset review, serta branch/ruleset hardening.

## Dokumentasi penting

- `docs/ARCHITECTURE.md`
- `docs/PRODUCT_DIRECTION.md`
- `docs/AI_OCR_OPENROUTER.md`
- `docs/CAMERA_QA.md`
- `docs/DEPLOYMENT.md`
- `docs/KNOWN_LIMITATIONS.md`
- `docs/PUBLIC_RELEASE_CHECKLIST.md`
- `OPEN_CORE.md`

## Disclaimer

Mainlagi Hub adalah software yang sedang aktif dikembangkan dan **bukan pengganti guru, orang tua, tenaga kesehatan, atau asesmen perkembangan profesional**. Learning score di aplikasi harus diperlakukan sebagai sinyal produk/pembelajaran internal, bukan diagnosis perkembangan anak.
