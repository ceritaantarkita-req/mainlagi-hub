# JM-18 — Canonical Journey Map System final closure

Date: **2 October 2026**  
Status: **FINAL CLOSURE / RUNTIME COMPLETE / LIVE VERIFIED**  
Workstream: **Phase C — Canonical Journey Map System**

Final runtime baseline:

```text
main:             b4473cc0582c096441e429b8ed94c20fc4bf1b8e
main CI:          #2374 / run 36974133135 — FULL SUCCESS
Cloudflare smoke: SUCCESS — exact merged runtime SHA
```

JM-18 is a **documentation and authority closure**. It introduces no runtime, schema, curriculum, progression, activity, World story, Completion/Share or gameplay change.

## 1. Phase C is complete

The canonical sequence is now complete:

```text
JM-00  canonical read-only audit
JM-01  shared Belajar Journey Map data/state foundation
JM-02  immersive shared Mainlagi child header
JM-03  Bahasa Inggris desktop reference map
JM-04  Bahasa Inggris Stage detail / Continue learning
JM-05  Bahasa Inggris responsive/rotation behavior
JM-06  shared Journey Map engine + Bahasa Indonesia
JM-07  Matematika
JM-08  Iqro
JM-09  Huruf & Menulis
JM-10  Logika
JM-11  Sains
JM-12  Mewarnai
JM-13  Menggambar
JM-14  complete 9-subject Belajar closure
JM-15  Petualangan Uang read-only adapter audit
JM-16  Petualangan Uang desktop Journey Map
JM-17  Petualangan Uang mobile/responsive Journey Map
JM-18  final program closure
```

There is **no next JM session** after JM-18.

## 2. Final Belajar production truth

One shared `BelajarJourneyMap` owner serves all nine canonical Belajar subjects:

1. Bahasa Indonesia
2. Bahasa Inggris
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Final canonical inventory:

```text
Belajar subjects:          9
canonical Belajar Stages:  46
Belajar activities:        900
activities per subject:    100
shared Journey Map owners: 1
```

The map projects canonical learning truth rather than creating a second curriculum.

Preserved across all subjects:

- exact canonical Stage order;
- exact canonical activity membership;
- stable subject/Stage/activity routes;
- canonical readiness/evidence/mastery semantics;
- Browse All exact subject membership;
- JM-02 shared child-header ownership;
- canonical Completion/Share ownership;
- age/eligibility boundaries;
- database/schema boundaries.

Creative subject boundaries remain intact:

- Mewarnai still hands off to the existing Coloring runtime;
- Menggambar still hands off to the existing Drawing Stage/runtime;
- creative workspace state and completion-only evidence behavior remain outside ordinary activity-runtime flattening.

## 3. Final Petualangan Uang production truth

Petualangan Uang remains a separate first-class World semantic system.

Final topology:

```text
World:                        money-festival
Chapters:                     2
Stages:                       8
Scenes:                       44
Segments:                     89
practice activity placements: 16
activities per Stage:         2
```

Final architecture:

```text
canonical World structure
+ MoneyWorldProgress
        ↓
World-specific read-only Journey Map adapter
        ↓
desktop + responsive World Journey Map presentation
        ↓
existing stable World Stage routes/runtime
```

World remains intentionally separate from the Belajar engine:

- no `LearningSubjectId` ownership;
- no Belajar readiness/mastery-driven World unlock;
- no Belajar `LearningAttemptBridge` for normal World completion;
- no World Browse All;
- no second World progress store;
- ★★★ remains World completion presentation, not mastery;
- `currentStageId + currentSegmentIndex` remains the checkpoint/resume source.

Stable World routes remain:

```text
/child/:childId/worlds
/child/:childId/world/money-festival
/child/:childId/world/money-festival/stage/:stageId
```

## 4. Final Journey Map UX contract

### Belajar

The shared Belajar Journey Map provides:

- map-first subject navigation;
- canonical Stage states;
- contextual Stage detail;
- text-only activity presentation;
- Continue learning;
- exact 100-activity Browse All per subject;
- desktop, tablet, phone and rotation behavior;
- touch/keyboard/accessibility continuity.

### World

Petualangan Uang provides:

- illustrated World-specific map identity;
- Chapter progress;
- completed/current/open/locked Stage states;
- resume/checkpoint CTA;
- desktop alternating Journey presentation;
- compact winding phone nodes;
- stacked tablet lane;
- portrait/landscape same-document reflow;
- stable sequential Stage navigation;
- no Browse All.

## 5. Permanent regression ownership

The completed system is protected by permanent static and browser contracts, including:

- canonical Journey Map foundation tests;
- shared 9-subject Belajar Journey Map browser QA;
- canonical mobile route matrix;
- permanent visual product baseline;
- World money static/engine tests;
- SI-10 World Completion/Share adapter QA;
- JM-16 World desktop Journey Map QA;
- JM-17 World responsive Journey Map QA;
- Windows compatibility;
- Ubuntu quality gate;
- production build;
- production dependency audit;
- full-history secret scan;
- exact Cloudflare production smoke.

These tests are the regression boundary for future unrelated work. A later feature must not reopen JM-00 through JM-18 unless a new concrete Journey Map regression is proven.

## 6. Verified implementation lineage

Key production closures:

- JM-00 — read-only canonical audit / merged live checkpoint;
- JM-01 — shared data/state foundation / merged live checkpoint;
- JM-02 — runtime PR #415 + security remediation PR #416;
- JM-03/04/05 — runtime PR #418;
- JM-06 — runtime PR #420;
- JM-07 through JM-11 — runtime PR #423;
- JM-12/JM-13 -> JM-14 Belajar closure — runtime PR #426;
- JM-15 — read-only World adapter audit closure PR #428;
- JM-16 — runtime PR #430, `main@544475c534a05176f9c6d349b32c3b37819f7e1f`;
- JM-17 — runtime PR #432, `main@b4473cc0582c096441e429b8ed94c20fc4bf1b8e`.

The exact JM-17 merged runtime passed **main CI #2374 / run `36974133135` FULL SUCCESS including Production smoke (Cloudflare)**.

## 7. Hard closure boundary

After JM-18:

- do not create JM-19 by default;
- do not restart completed subject migrations;
- do not duplicate `BelajarJourneyMap`;
- do not fold World into Belajar progression;
- do not redesign World story/progression as follow-up cleanup;
- do not reinterpret World ★★★ as mastery;
- do not change curriculum or evidence semantics under a Journey Map label.

Any later Journey Map work requires a **new, concrete product requirement or verified regression** and should begin as a separately scoped workstream rather than silently extending Phase C.

## 8. Final status

```text
Phase C — Canonical Journey Map System
JM-00 through JM-18
FINAL CLOSED / MERGED RUNTIME / LIVE VERIFIED
```

The runtime source of truth is `main@b4473cc0582c096441e429b8ed94c20fc4bf1b8e` until this docs-only JM-18 closure itself is merged. The docs merge must also pass the repository CI matrix and exact Cloudflare smoke before the administrative closure is considered fully complete.
