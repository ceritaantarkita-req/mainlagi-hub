# JM-00 — Canonical Journey Map read-only audit

Date: **30 September 2026**  
Status: **COMPLETE / READ-ONLY / NO RUNTIME OR DATA SEMANTICS CHANGED**  
Audit baseline: `main@f6b9f97fc5c6917188d228d0d724421c346579e5`  
Workstream: **Phase C — Canonical Journey Map System**

## 1. Objective and hard boundary

JM-00 audits the existing canonical navigation/progression truth before any Journey Map engine or visual redesign is introduced.

This pass audits:

- exact stage order and stage membership for all nine Belajar subjects;
- canonical subject, stage and activity routes;
- stage readiness/unlock semantics;
- current Browse All behavior;
- the separate Petualangan Uang World hierarchy, routing and progression model.

JM-00 is intentionally read-only. It does **not**:

- create the shared Journey Map engine;
- change stage order, membership, activities, lessons, packs, skills, mastery, evidence or progression;
- change Browse All behavior;
- change any Belajar, World, Bermain or Shop visual;
- add database/schema/migration work;
- remodel Petualangan Uang as an ordinary Belajar subject.

## 2. Canonical sources audited

Belajar:

- `src/lib/learning/system.ts`
- `src/lib/learning/systemBase.ts`
- `src/lib/learning/contentManifest.ts`
- `src/lib/learning/contentManifestBase.ts`
- `src/lib/learning/curriculum.ts`
- `src/lib/learning/progression.ts`
- `src/lib/learning/insights.ts`
- `src/components/learning/ChildLearningPathViews.tsx`
- `src/components/learning/ActivityGallery.tsx`
- `src/app/child/[childId]/subject/[subject]/page.tsx`
- `src/app/child/[childId]/stage/[stage]/page.tsx`
- `scripts/run-local-product-qa.mjs`
- `scripts/run-expansion-baseline-tests.mjs`
- `scripts/run-content-architecture-tests.mjs`

Petualangan Uang:

- `src/lib/learning/world/moneyWorld.ts`
- `src/lib/learning/world/moneyWorldStructure.ts`
- `src/lib/learning/world/progress.ts`
- `src/components/learning/world-v2/MoneyWorldExperience.tsx`
- `src/app/child/[childId]/world/[worldId]/page.tsx`
- `src/app/child/[childId]/world/[worldId]/stage/[stageId]/page.tsx`

## 3. Global Belajar inventory

Repository invariants remain:

```text
subjects:    9
activities:  900
stages:      46
lessons:     197
packs:       197
skills:      200
activities per subject: 100
```

The existing QA/content-architecture gates reject duplicate IDs, uncovered stages, uncovered activities, missing learning specs/content-pack ownership, and broken stage/path/lesson/pack references.

### Canonical ordering rule

For Journey Map navigation, **`CONTENT_PATHS[*].stageIds` is the explicit curriculum ordering contract**. Stage metadata and exact activity membership resolve from `STAGES` / `getStage()` / `getActivitiesForStage()`.

The current path extension code and the current `STAGES` aggregation are aligned. JM-01 must consume these canonical registries rather than copy stage arrays into a second hand-maintained map model.

## 4. Exact Belajar stage audit

Counts below are exact activity membership counts for the audited baseline. Each row totals **100 activities**.

### Bahasa Indonesia — `bahasa-fondasi-literasi`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `bahasa-huruf` | Kenal Huruf | 5 |
| 2 | `bahasa-cerita` | Cerita Pendek | 1 |
| 3 | `bahasa-dasar-huruf` | Dasar Huruf & Bunyi | 19 |
| 4 | `bahasa-suku-kata-kata` | Suku Kata & Kata | 25 |
| 5 | `bahasa-kalimat-pemahaman` | Kalimat & Pemahaman | 25 |
| 6 | `bahasa-literasi-terapan` | Literasi Terapan | 25 |

### Bahasa Inggris — internal subject `english`, path `english-first-steps`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `english-first-words` | First Words | 6 |
| 2 | `english-alphabet-basics` | Alphabet, Sounds & Basics | 19 |
| 3 | `english-everyday-words` | Everyday Words | 25 |
| 4 | `english-words-actions` | Food, Actions & Categories | 25 |
| 5 | `english-phrases-review` | Opposites, Phrases & Review | 25 |

**Display-name finding:** the internal subject title is historically `English`, while child-facing UI already presents **Bahasa Inggris**. The Journey Map presentation adapter must preserve the child-facing label and must not accidentally regress to the internal title.

### Matematika — `math-fondasi-numerasi`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `math-angka` | Kenal Angka | 4 |
| 2 | `math-pola` | Pola & Logika | 3 |
| 3 | `math-jumlah-dasar` | Jumlah & Angka 0–10 | 18 |
| 4 | `math-banding-bentuk` | Bandingkan, Urutkan & Bentuk | 25 |
| 5 | `math-operasi-awal` | Urutan, Kelompok & Operasi Awal | 25 |
| 6 | `math-ukur-ruang` | Ruang, Ukuran & Tantangan Campuran | 25 |

### Iqro — `iqro-fondasi-hijaiyah`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `iqro-huruf` | Kenal Hijaiyah | 4 |
| 2 | `iqro-recognition-basics` | Kenal Bentuk Hijaiyah Awal | 21 |
| 3 | `iqro-middle-families` | Keluarga Bentuk Hijaiyah Menengah | 25 |
| 4 | `iqro-advanced-families` | Keluarga Hijaiyah Lanjutan | 25 |
| 5 | `iqro-final-families` | Hijaiyah Akhir & Review | 25 |

### Huruf & Menulis — `letters-writing-foundations`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `letters-foundations` | Huruf & Gerak Menulis | 3 |
| 2 | `letters-recognition-prewriting-basics` | Kenal Huruf & Gerak Awal Menulis | 22 |
| 3 | `letters-middle-alphabet` | Huruf G–M & Urutan | 25 |
| 4 | `letters-late-middle-alphabet` | Huruf N–T & Urutan Lanjut | 25 |
| 5 | `letters-final-alphabet` | Huruf U–Z & Penutup Alfabet | 25 |

### Logika — `logic-thinking-foundations`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `logic-foundations` | Cocok, Beda & Bandingkan | 3 |
| 2 | `logic-classification-rules-basics` | Kelompokkan, Bandingkan & Ikuti Aturan | 22 |
| 3 | `logic-patterns-sequences-relations` | Pola, Urutan & Relasi | 25 |
| 4 | `logic-conditional-analogy-inference` | Aturan, Analogi & Inferensi | 25 |
| 5 | `logic-mixed-reasoning-challenge` | Tantangan Nalar Campuran | 25 |

### Sains — `science-discovery-foundations`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `science-foundations` | Kenali Dunia Sekitar | 3 |
| 2 | `science-living-observation-basics` | Makhluk Hidup & Observasi Dasar | 22 |
| 3 | `science-life-material-motion` | Siklus Hidup, Bahan & Gerak | 25 |
| 4 | `science-earth-body-environment` | Bumi, Tubuh & Lingkungan | 25 |
| 5 | `science-evidence-review-challenge` | Bukti, Pilihan & Tantangan Sains | 25 |

### Mewarnai — `color-creative-play`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `color-characters` | Karakter Mainlagi | 2 |
| 2 | `color-exploration-basics` | Eksplorasi Warna Dasar | 23 |
| 3 | `color-patterns-scenes` | Pola & Adegan Warna | 25 |
| 4 | `color-mood-material-story` | Suasana, Material & Cerita | 25 |
| 5 | `color-palette-scene-capstone` | Palet, Adegan & Studio Akhir | 25 |

### Menggambar — `drawing-creative-studio`

| # | Stage ID | Title | Activities |
|---:|---|---|---:|
| 1 | `drawing-lines-shapes-basics` | Garis, Bentuk & Jalur | 25 |
| 2 | `drawing-objects-scenes` | Objek & Adegan Sederhana | 25 |
| 3 | `drawing-space-story-imagination` | Ruang, Cerita & Imajinasi | 25 |
| 4 | `drawing-composition-design-capstone` | Komposisi, Desain & Studio Akhir | 25 |

**Creative-runtime boundary:** Mewarnai and Menggambar use the shared subject/catalog navigation model, but Drawing Stage routes intentionally hand off to `DrawingStageScreen`. JM-01/JM-13 must not absorb or redesign the creative workspace runtime.

## 5. Exact Belajar route audit

Current canonical route family:

```text
Subject:
  /child/:childId/subject/:subjectId

Stage:
  /child/:childId/stage/:stageId

Activity:
  /child/:childId/activity/:activityId
```

The subject route resolves `SubjectScreen` and passes the complete subject catalog into the shared `ActivityGallery`.

The stage route resolves canonical stage ownership. Drawing is the intentional route-level runtime exception: a Drawing stage resolves `DrawingStageScreen`; the other canonical learning stages resolve `StageScreen`.

JM-01 onward should change presentation/navigation around these routes, not invent replacement activity URLs or mutate stable activity IDs.

## 6. Belajar readiness audit

Canonical stage state is currently derived from existing completion + evidence semantics, not from map UI.

The current state vocabulary is:

```text
locked
in_progress
evidence_needed
ready
```

Rules:

1. the first stage in a subject is unlocked;
2. later stages unlock only when the immediately preceding stage is `readyToAdvance`;
3. stage completion is based on activities marked `requiredForStage`;
4. assessed required skills additionally require qualifying evidence;
5. evidence readiness must reach the existing **0.45** threshold;
6. practice-only stages can advance from required completion without inventing mastery evidence.

`getSubjectStageReadiness()` is already the presentation-safe adapter for these semantics. JM-01 must consume its output; Journey Map code must **not** reimplement or weaken progression.

A visual `completed/current/open/locked` map model therefore has to be a presentation projection of this richer canonical state. In particular, `evidence_needed` must not be silently treated as unlocked-next-stage completion.

## 7. Browse All audit — all nine subjects

All nine subject pages share the same current `ActivityGallery` ownership.

Current contract:

- `activities` contains the subject's complete **100-activity** catalog;
- the primary grouped gallery renders activities currently playable for the child;
- an activity is playable only when its stage is open **and** its age band matches, except isolated QA unlock;
- unavailable activities are retained behind an expandable `<details>` section;
- the current summary is `Lihat semua 100 permainan (N lainnya)`;
- locked/age-ineligible entries are not deleted from the catalog;
- `demo-gian?qa=unlock-all` is an isolated QA path and only activates when the explicit QA environment gate is enabled;
- QA unlock does not change the canonical progression data.

**JM requirement:** the future map may become the default subject navigation surface, but Browse All must remain a discoverable compatibility/catalog path. JM-03/JM-04 must not strand direct activity access or turn Browse All into a second progression system.

## 8. Petualangan Uang exact audit

World ID:

```text
money-festival
```

Canonical hierarchy:

```text
World
└── 2 Chapters
    └── 8 Stages
        └── canonical Scenes
            └── 89 Segments
```

### Chapters

| # | Chapter ID | Title | Stages |
|---:|---|---|---|
| 1 | `money-chapter-01-road-to-festival` | Jalan ke Festival | 1–4 |
| 2 | `money-chapter-02-prepare-festival` | Siapkan Festival! | 5–8 |

### Stages and exact segment membership counts

| # | Stage ID | Title | Location | Segments |
|---:|---|---|---|---:|
| 1 | `money-stage-01-money-use` | Uang Buat Apa? | Halaman rumah | 10 |
| 2 | `money-stage-02-price-change` | Kok Jadi Lebih Mahal? | Toko mainan | 14 |
| 3 | `money-stage-03-income-sources` | Uang Datang dari Mana? | Jalan kios | 11 |
| 4 | `money-stage-04-needs-wants` | Butuh atau Mau? | Mini market | 11 |
| 5 | `money-stage-05-saving` | Simpan Dulu Yuk | Taman tabungan | 9 |
| 6 | `money-stage-06-investment-intro` | Uang Bisa Bertambah? | Kebun nilai | 11 |
| 7 | `money-stage-07-risk` | Kalau Naik dan Turun? | Jembatan festival | 11 |
| 8 | `money-stage-08-final-festival` | Siapkan Festival! | Festival Mainlagi | 12 |

All eight stage definitions are currently `playable: true`.

Canonical World structure is separately validated as World → Chapter → Stage → Scene → Segment. That hierarchy must remain the source of truth when JM-15 later adds the read-only World adapter.

## 9. Petualangan Uang routes and readiness

Routes:

```text
World catalog:
  /child/:childId/worlds

Petualangan Uang map:
  /child/:childId/world/money-festival

Petualangan Uang stage:
  /child/:childId/world/money-festival/stage/:stageId
```

World progression is intentionally different from Belajar progression:

- `completedStageIds` is normalized to an exact ordered prefix of the eight canonical stages;
- Stage 1 is always unlocked;
- Stage N unlocks when Stage N-1 is completed;
- a completed World stage receives three stars;
- current segment checkpoint state is stored separately through `currentStageId` + `currentSegmentIndex`;
- the map does **not** use Belajar's mastery/evidence threshold to unlock World stages.

**Adapter boundary:** JM-01 may define shared presentation types, but JM-15 must adapt this World progress source without pretending that World completion and Belajar readiness are the same semantic system.

## 10. JM-00 findings that constrain implementation

1. **No new curriculum data model is required for Journey Map.** Canonical stage/path/activity membership already exists.
2. **Do not duplicate stage order.** Read `CONTENT_PATHS.stageIds` and resolve metadata from `STAGES`.
3. **Do not duplicate progression logic.** Belajar state comes from `getSubjectStageReadiness()`.
4. **Preserve the richer Belajar state.** `evidence_needed` cannot be collapsed into a false completion.
5. **Browse All remains required.** Map-first UX must coexist with access to the complete catalog.
6. **Preserve stable direct routes.** Existing subject/stage/activity URLs remain valid.
7. **Bahasa Inggris needs an explicit child-facing display label.** Do not leak the historical internal `English` title.
8. **Creative runtimes stay separate.** Map navigation must not redesign Mewarnai/Menggambar workspaces.
9. **World stays a first-class separate domain.** Shared map presentation must not force Petualangan Uang into Belajar's mastery schema.
10. **The existing Petualangan Uang map is source behavior, not the JM-16 target visual.** JM-00 does not redesign it.

## 11. JM-01 entry contract

JM-00 found **no structural blocker** to JM-01.

JM-01 may now create a shared **data/state foundation only**, with no visual redesign. The foundation should be able to project at least:

```text
id
order
title
subtitle/label
destination route
completed
current
open
locked
canonical source state
```

For Belajar, the adapter must be derived from the canonical path/stage/readiness sources above. World support should remain outside the first Belajar implementation until the explicitly planned JM-15 adapter audit.

## 12. Phase C sequencing preserved

```text
JM-00  read-only map audit                         COMPLETE
JM-01  shared map data/state foundation            NEXT
JM-02  immersive Mainlagi header
JM-03  Bahasa Inggris desktop clean map
JM-04  Bahasa Inggris stage-open
JM-05  Bahasa Inggris responsive
JM-06  extract shared engine + Bahasa Indonesia
JM-07  Matematika
JM-08  Iqro
JM-09  Huruf & Menulis
JM-10  Logika
JM-11  Sains
JM-12  Mewarnai
JM-13  Menggambar
JM-14  9-subject Belajar closure
JM-15  Petualangan Uang read-only adapter audit
JM-16  Petualangan Uang desktop redesign
JM-17  Petualangan Uang mobile/responsive
JM-18  final Journey Map closure
```

No JM-01 runtime code is included in this checkpoint.
