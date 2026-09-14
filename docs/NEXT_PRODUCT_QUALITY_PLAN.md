# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase berikutnya Mainlagi Hub.  
> Semua developer/AI agent wajib membaca dokumen ini sebelum mengubah frontend, learning content, audio, visual, atau public/parent experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Baseline branch:** `main`  
**Baseline commit saat dokumen dibuat:** `25c83840b74c4eca1dd3d3b71e888f7dfc4d8b21`  
**Focus utama:** kualitas UI/visual frontend, voice, activity quality, dan product coherence.  
**Prinsip:** jangan mengejar jumlah activity baru. Perbaiki kualitas 900 activity yang sudah ada terlebih dahulu.

---

## 1. Tujuan fase ini

Membuat Mainlagi Hub terasa sebagai produk belajar anak usia 3–7 tahun yang:

- konsisten secara visual;
- mudah dipahami anak dan orang tua;
- punya voice/narration Bahasa Indonesia dan English yang natural;
- punya activity yang masuk akal secara pedagogi;
- punya variasi gameplay yang cukup;
- tidak menghasilkan visual procedural/AI slop;
- punya About, FAQ, dan rekomendasi affiliate yang benar-benar terintegrasi;
- tetap mempertahankan learning/mastery foundation yang sudah sehat.

Fase ini adalah **Product Coherence & Content Quality**, bukan ekspansi jumlah fitur.

---

## 2. Aturan kerja utama

1. **Frontend/UI/visual adalah patokan utama fase ini.**
2. Jangan menambah activity hanya untuk mengejar angka.
3. Jangan rewrite learning attempt, mastery, progression, evidence, atau schema yang sudah sehat tanpa alasan teknis yang jelas.
4. Semua perubahan activity harus tetap kompatibel dengan evidence/mastery.
5. Child learning flow tidak boleh berisi CTA komersial/affiliate.
6. Affiliate hanya muncul pada public/parent surface dengan disclosure yang jelas.
7. Jangan menggunakan TTS/model/voice yang lisensinya tidak aman untuk penggunaan komersial.
8. Jangan clone suara orang/anak nyata tanpa izin yang jelas.
9. Iqro/Hijaiyah tidak boleh mengandalkan generic TTS sebagai sumber final pronunciation.
10. Generated/procedural art boleh menjadi draft, tetapi tidak otomatis dianggap production-ready.
11. Jangan merusak route, database, progression, atau production behavior yang sekarang sudah lolos CI.
12. Setiap pekerjaan harus punya QA dan bukti sebelum dianggap selesai.

---

# 3. Workstream

## WS-01 — Canonical documentation sync

### Masalah
Beberapa dokumentasi masih menggambarkan kondisi sebelum PR #87, lima subject lama, atau snapshot activity lama.

### Kerja
- Update `README.md`.
- Update `docs/CURRENT_STATE.md`.
- Update `docs/KNOWN_LIMITATIONS.md`.
- Update `docs/ARCHITECTURE.md`.
- Update `docs/LEARNING_ATTEMPTS_MASTERY.md`.
- Review `docs/PRODUCT_DIRECTION.md`.
- Review `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`.
- Tandai dokumen historical sebagai historical jika tidak lagi canonical.
- Pastikan kondisi current main dan production tidak bercampur dengan historical snapshot.

### Selesai jika
- Tidak ada canonical doc yang masih mengatakan PR #87 belum merge/deploy.
- Current catalog konsisten: 9 subjects / 900 activities.
- Stage/data architecture dan current frontend UX dijelaskan terpisah dengan jelas.

---

## WS-02 — Native voice & narration system

### Tujuan
Mainlagi punya voice Bahasa Indonesia dan English yang natural, konsisten, aman secara lisensi, dan mudah diganti engine.

### Arsitektur target
Buat abstraction seperti:

`Narration Engine -> Voice Provider -> Generated/Approved Audio Asset -> Playback`

Frontend tidak boleh bergantung langsung pada satu TTS provider.

### Kerja
- Audit current audio/TTS flow.
- Evaluasi engine open-source yang realistis.
- Prioritas awal evaluasi:
  - Piper / compatible Indonesian voices;
  - engine English open-source yang kualitasnya memadai;
  - provider lain hanya jika licence dan Indonesian quality lolos review.
- Verifikasi licence engine **dan licence setiap voice/model**.
- Buat voice registry:
  - language;
  - character;
  - provider;
  - voice ID;
  - version;
  - licence;
  - approval status.
- Mapping karakter:
  - Naya;
  - Gian;
  - Zia;
  - Paca;
  - Gavi.
- Untuk fixed lesson narration:
  - generate sekali;
  - human review;
  - simpan sebagai approved asset;
  - playback asset tersebut saat runtime.
- Runtime TTS hanya fallback/dynamic content.
- Tambahkan pronunciation/content review workflow.
- Iqro menggunakan reviewed/recorded audio, bukan generic TTS final.

### Quality gate
Voice harus dinilai oleh manusia berdasarkan:
- naturalness;
- pronunciation;
- child friendliness;
- pacing;
- consistency;
- Bahasa Indonesia native feel;
- English native/clear feel;
- no robotic artefacts.

### Selesai jika
- Provider abstraction ada.
- Minimal satu approved Indonesian voice path.
- Minimal satu approved English voice path.
- Character voice registry tersedia.
- Fixed narration bisa menggunakan reviewed audio assets.
- Licence/provenance tercatat.

---

## WS-03 — About, FAQ, navigation, dan parent/public frontend

### Masalah
`/about` dan `/faq` sudah ada tetapi content masih menggambarkan Mainlagi lama. Affiliate/product page juga sudah ada tetapi sulit ditemukan.

### Kerja
- Rewrite `/about` berdasarkan produk Mainlagi sekarang.
- Rewrite `/faq`.
- Perbaiki metadata/SEO dasar.
- Integrasikan link yang relevan dalam navigation/footer/public shell.
- Tentukan nama final rekomendasi, preferensi:
  - `Rekomendasi Orang Tua`
  - atau nama lain yang jelas untuk parent.
- Integrasikan `/discover/products` secara jelas.
- Pastikan disclosure affiliate terlihat.
- Review empty state, broken image fallback, CTA, mobile layout, accessibility.
- Kelompokkan rekomendasi berdasarkan kebutuhan belajar jika data memungkinkan.
- Jangan tampilkan affiliate di child learning flow.

### Selesai jika
Orang tua dapat dengan mudah menemukan:
- Tentang Mainlagi;
- FAQ;
- rekomendasi produk;
- disclosure affiliate;
- informasi privasi/data;
- akun/parent flow.

---

## WS-04 — Audit dan redesign 900 activities

### Masalah
Jumlah activity besar, tetapi sebagian activity:
- terlalu trivial;
- representasinya tidak sesuai skill;
- repetitif;
- hanya mengganti teks/data;
- tidak terasa seperti permainan.

Contoh masalah:
- `Find BLUE` tetapi pilihan hanya teks `RED / BLUE / GREEN` untuk skill color recognition.
- letter recognition hanya menjadi repeated multiple-choice tanpa variasi context.

### Prinsip
**Learning objective menentukan representation dan mechanic.**

Contoh:
- color recognition -> objek/swatches berwarna;
- color word reading -> teks BLUE/RED/GREEN;
- letter recognition -> visual letter discrimination;
- phonics -> audio + object/sound mapping;
- tracing -> tracing;
- ordering -> drag/order mechanic;
- matching -> meaningful pairing.

### Audit setiap activity
Minimal klasifikasi:
- subject;
- age;
- learning objective;
- skill;
- runtime/mechanic;
- assessed/practice;
- prompt;
- representation;
- distractor quality;
- difficulty;
- uniqueness;
- visual quality;
- pedagogical validity;
- evidence compatibility.

### Severity
- `KEEP`
- `POLISH`
- `REDESIGN`
- `REPLACE`

### Red flags otomatis/manual
- answer tertulis langsung pada prompt tanpa reasoning yang dimaksud;
- distractor terlalu jelas/tidak relevan;
- warna diuji menggunakan kata saat skill sebenarnya visual color recognition;
- object recognition menggunakan label teks sebagai substitusi objek;
- repeated template dengan hanya ganti noun/angka;
- age mismatch;
- ambiguous answer;
- lebih dari satu jawaban valid;
- misleading artwork;
- prompt dan visual tidak sinkron;
- interaction tidak mengukur skill target.

### Selesai jika
- 900 activity punya audit status.
- Semua critical/invalid activity telah diperbaiki.
- Tidak ada known absurd/trivial activity yang sengaja dibiarkan tanpa alasan.
- Evidence/mastery tetap valid.

---

## WS-05 — Gameplay/mechanic diversification

### Tujuan
900 activity tidak terasa sebagai 900 kartu multiple-choice.

### Kandidat mechanic
Gunakan hanya jika sesuai learning objective:
- visual tap/select;
- audio choose;
- drag-and-drop matching;
- sorting;
- ordering;
- sequence;
- memory;
- find-in-scene;
- hotspot;
- trace;
- draw;
- coloring;
- simple puzzle;
- maze;
- classification;
- count/select objects;
- build/assemble;
- motion optional;
- story interaction.

### Kerja
- Audit mechanic library yang sudah ada.
- Tentukan mechanic yang sudah punya runtime UI.
- Implement adapter/runtime yang masih missing secara bertahap.
- Hindari membuat mechanic baru jika mechanic existing cukup.
- Buat reusable activity rendering primitives.

### Selesai jika
- Variety meningkat nyata per subject.
- Activity tidak hanya berbeda data.
- Mechanic tetap accessible dan mobile-friendly.
- Semua mechanic punya automated QA minimal.

---

## WS-06 — Coloring art rebuild

### Masalah
Semakin kompleks coloring scene, visual semakin mudah terlihat berantakan atau duplicate.

### Target
Coloring memakai authored/curated vector illustrations dengan style Mainlagi yang konsisten.

### Aturan asset
- silhouette jelas;
- stroke konsisten;
- shape tertutup;
- tidak ada overlap aneh;
- minimum fill area cukup besar untuk jari;
- complexity sesuai usia;
- layer/order benar;
- tidak ada duplicate composition tersamar;
- setiap scene tetap terbaca pada layar HP.

### Kerja
- Audit 100 coloring assets.
- Kelompokkan duplicate/near-duplicate.
- Ganti asset yang buruk.
- Buat reusable style/art bible.
- Buat asset provenance.
- Tambahkan screenshot QA.
- Tambahkan geometry validation.
- Human visual approval wajib.

### Selesai jika
- Semua 100 scene punya visual yang layak.
- Tidak ada known broken/chaotic composition.
- Duplicate berat telah dikurangi.
- Visual consistent sebagai satu produk.

---

## WS-07 — Drawing experience rebuild

### Masalah
Sebagian drawing activity hanya memberi prompt tetapi scaffolding/guide visual lemah atau tidak ada.

### Target
Drawing harus membantu anak belajar menggambar tanpa membatasi kreativitas.

### Kerja
- Audit seluruh 100 drawing activities.
- Tambahkan guide/scaffold yang sesuai.
- Gunakan progressive visual steps jika perlu:
  1. basic shape;
  2. major structure;
  3. detail;
  4. optional decoration.
- Guide tidak boleh menutupi drawing area.
- Free drawing tetap diperbolehkan.
- Hasil creative practice tidak dipaksa menjadi academic mastery evidence jika tidak sesuai.

### Selesai jika
- Setiap drawing activity punya tujuan visual yang jelas.
- Activity kompleks tidak lagi hanya bergantung pada teks.
- Guide konsisten dan usable di mobile/tablet.

---

## WS-08 — Art direction & visual quality gate

### Tujuan
Mencegah visual slop masuk kembali setelah diperbaiki.

### Buat `Mainlagi Art Bible`
Minimal mencakup:
- character proportions;
- line/stroke style;
- corner radius;
- shape language;
- palette;
- backgrounds;
- object style;
- shadows;
- icon style;
- complexity by age;
- minimum touch/fill size;
- spacing;
- animation principles.

### QA
Setiap visual penting harus diuji:
- mobile;
- tablet;
- desktop;
- clipping;
- overlap;
- contrast;
- touch target;
- text overflow;
- broken SVG/path;
- duplicate geometry;
- visual readability.

Automated test **tidak menggantikan human visual review**.

---

## WS-09 — Stage progression vs 100-card gallery UX

### Masalah
Data model menggunakan stage/progression, sedangkan frontend memperlihatkan 100 activity dalam gallery dan banyak yang locked.

### Kerja
Tentukan pengalaman final yang paling sederhana untuk anak.

Pilihan harus dievaluasi:
- stage-first;
- curated recommended path + browse all;
- gallery grouped by stage;
- hybrid.

### Prinsip
- Anak tidak perlu memahami internal progression model.
- Jangan membuat halaman terasa penuh konten terkunci.
- Recommended/continue learning harus dominan.
- Browse-all boleh tersedia tetapi tidak mengalahkan learning path.

### Selesai jika
Satu UX model dipilih, didokumentasikan, dan dipakai konsisten pada semua subject.

---

## WS-10 — Real-device, accessibility, dan content acceptance

### Kerja
Selesaikan external acceptance pada perangkat fisik:

- iPhone + Safari;
- Android + Chrome;
- touch;
- trace;
- drawing;
- coloring;
- audio;
- orientation;
- camera flow;
- permission denied/recovery;
- offline/reconnect;
- text scaling;
- reduced motion;
- VoiceOver/TalkBack.

### Iqro
- Jalankan expert review untuk pronunciation/content.
- Jangan mengubah status menjadi approved hanya karena engineering tests lulus.

### Selesai jika
External acceptance memiliki bukti nyata dan issue terkait bisa ditutup.

---

## WS-11 — Governance dan repository hardening

### Kerja
- Tambahkan `Secret history scan` sebagai required status check.
- Review required CI checks.
- Review branch protection/ruleset.
- Pertimbangkan approval requirement yang sesuai.
- Pastikan generated QA output tidak masuk lint/source secara salah.
- Pastikan docs wajib update menjadi bagian PR checklist.

### Selesai jika
Main tidak dapat merge perubahan yang melewati critical QA/governance.

---

## WS-12 — Technical cleanup setelah product work stabil

Bukan prioritas awal.

Candidate:
- hapus/retire unused recommendation helper lama jika terbukti tidak punya consumer;
- rapikan static content authoring architecture;
- pertimbangkan content registry/generator yang lebih maintainable;
- hilangkan duplicate definitions;
- rapikan historical docs;
- optimasi bundle hanya jika measurement menunjukkan perlu.

Jangan melakukan cleanup besar bersamaan dengan redesign activity kecuali diperlukan.

---

# 4. Urutan eksekusi

Urutan default:

1. Canonical documentation sync.
2. Tentukan final UX direction stage/gallery.
3. Audit activity quality.
4. Bangun mechanic/runtime gaps yang memang dibutuhkan.
5. Redesign invalid/trivial activities.
6. Rebuild Coloring.
7. Rebuild Drawing.
8. Bangun Art Bible + visual QA.
9. Voice engine evaluation + narration architecture.
10. Integrasikan reviewed narration assets.
11. Rewrite About/FAQ + parent/public affiliate UX.
12. Real-device + accessibility + Iqro expert acceptance.
13. Governance hardening.
14. Technical cleanup.
15. Baru evaluasi ekspansi activity/features berikutnya.

Workstream independen boleh berjalan paralel selama tidak mengubah area yang sama dan tidak merusak baseline.

---

# 5. Definition of Done global

Suatu task hanya boleh dianggap selesai jika:

- implementasi selesai;
- typecheck/lint/build lulus;
- test relevan lulus;
- route terkait tidak rusak;
- mobile UX dicek;
- visual dicek manusia jika perubahan terlihat user;
- accessibility dasar dicek;
- content/pedagogical behavior dicek jika activity berubah;
- licence/provenance dicek jika asset/model/audio baru;
- screenshots/evidence diperbarui bila diperlukan;
- dokumentasi terkait diperbarui;
- changelog pada dokumen ini diperbarui.

**Code merged tanpa update docs = pekerjaan belum selesai.**

---

# 6. Wajib update dokumen setelah setiap pekerjaan

Setiap developer/AI agent yang menyelesaikan perubahan wajib:

1. Baca dokumen ini sebelum mulai.
2. Update status workstream terkait.
3. Update canonical docs lain yang terdampak.
4. Catat file/area yang berubah.
5. Catat keputusan penting.
6. Catat QA yang dijalankan dan hasilnya.
7. Catat remaining issue/known limitation.
8. Tambahkan entry ke `Execution Log` di bawah.
9. Jangan menulis klaim production/deployed sebelum benar-benar diverifikasi.
10. Jika scope berubah, update dokumen ini **sebelum** melanjutkan implementasi besar berikutnya.

Jika AI agent menemukan konflik antara code dan docs:
- anggap code/current production sebagai evidence;
- jangan diam-diam memilih salah satu;
- verifikasi;
- perbaiki canonical docs;
- catat reconciliation di Execution Log.

---

# 7. Status tracker

| Workstream | Status | Notes |
|---|---|---|
| WS-01 Canonical docs | TODO | Mulai pertama |
| WS-02 Voice & narration | TODO | Evaluasi engine + licence + native quality |
| WS-03 Public/parent frontend | TODO | About/FAQ stale; affiliate ada tetapi kurang discoverable |
| WS-04 Activity audit/redesign | TODO | Audit 900 activity |
| WS-05 Mechanic diversification | TODO | Berdasarkan kebutuhan learning objective |
| WS-06 Coloring rebuild | TODO | Audit 100 assets |
| WS-07 Drawing rebuild | TODO | Audit 100 activities |
| WS-08 Art direction/visual QA | TODO | Buat art bible + human approval |
| WS-09 Stage/gallery UX | TODO | Perlu keputusan product |
| WS-10 External acceptance | TODO | Physical device + Iqro expert |
| WS-11 Governance | TODO | Secret scan wajib + ruleset review |
| WS-12 Technical cleanup | TODO | Dilakukan setelah product quality stabil |

Status yang boleh dipakai:

`TODO` → `IN_PROGRESS` → `BLOCKED` → `QA` → `DONE`

---

# 8. Execution Log

Tambahkan entry terbaru di paling atas.

Template:

```md
## YYYY-MM-DD — <workstream/task>

**Agent/developer:**  
**Branch/PR:**  
**Status:**  

### Changed
- ...

### QA
- ...

### Decisions
- ...

### Remaining
- ...

### Docs updated
- ...
```

---

# 9. Hal yang belum boleh menjadi fokus

Sebelum workstream utama selesai, jangan prioritaskan:

- menambah ratusan activity baru;
- subscription/paywall;
- AI tutor besar;
- OCR;
- generative content realtime;
- social/leaderboard expansion;
- marketplace besar;
- rewrite backend/mastery;
- migrasi arsitektur besar tanpa product need.

Fitur tersebut boleh dibahas, tetapi bukan blocker fase ini.

---

# 10. North Star

Fase ini selesai bukan ketika Mainlagi punya activity paling banyak.

Fase ini selesai ketika:

> Anak melihat sesuatu yang menarik, memahami apa yang harus dilakukan, mendapat feedback yang menyenangkan, mendengar voice yang natural, dan benar-benar belajar skill yang dimaksud — sementara orang tua memahami produk dan percaya pada kualitasnya.

**Quality first. Quantity later.**
