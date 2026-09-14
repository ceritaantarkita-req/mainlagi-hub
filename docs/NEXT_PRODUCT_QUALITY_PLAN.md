# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase product-quality Mainlagi Hub. Semua developer/AI agent wajib membaca dan memperbarui dokumen ini ketika mengerjakan scope terkait.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current merged baseline:** `main` @ `d9f0245e8531662840e2d9030e7b9b6e2f9e1df0`  
**Active branch/PR:** `agent/ws07-drawing-scaffold-wave-b-20260914` / PR #99  
**Focus:** frontend/UI/visual quality, voice, activity quality, dan product coherence.  
**Principle:** **Quality first. Quantity later.** Perbaiki 900 activity yang ada sebelum ekspansi besar.

## 1. Product goal

Mainlagi harus terasa sebagai produk belajar anak 3–7 tahun yang visualnya konsisten, mudah dipahami, punya narration Indonesia/English yang natural, activity yang valid secara pedagogi, gameplay yang cukup beragam, creative art yang tidak slop, dan public/parent experience yang jelas—tanpa merusak learning/mastery foundation yang sudah sehat.

## 2. Mandatory rules

1. Frontend/UI/visual adalah patokan utama fase ini.
2. Jangan menambah activity hanya untuk mengejar jumlah.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan yang terbukti.
4. Assessed activity wajib menjaga atau secara eksplisit memperbarui evidence contract.
5. Affiliate/commerce tidak boleh masuk child learning flow.
6. Voice/model/art wajib licence/provenance-safe.
7. Iqro/Hijaiyah tidak boleh dianggap approved hanya dari engineering/TTS.
8. Generated/procedural art bukan otomatis production-ready.
9. Jangan merusak route/database/progression yang sudah lolos CI.
10. **Code merged tanpa update docs = pekerjaan belum selesai.**

## 3. Workstreams

### WS-01 — Canonical docs
**Status: DONE.** PR #88; CI #362; merge `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

### WS-02 — Native voice & narration
**Status: TODO.** Build provider-independent narration, voice registry for Naya/Gian/Zia/Paca/Gavi, licence review, pre-generated reviewed fixed audio, runtime TTS only where justified, and separate reviewed Iqro audio.

### WS-03 — Public/parent frontend
**Status: TODO.** Rewrite stale `/about` and `/faq`, improve public navigation/footer, expose parent recommendations/affiliate area with clear disclosure, fix image fallback/CTA/mobile/accessibility, and keep commerce outside child flow.

### WS-04 — Audit/redesign 900 activities
**Status: IN_PROGRESS.** Canonical detail: `ACTIVITY_QUALITY_AUDIT.md`.

Accepted progression:

```text
Wave A         640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B         683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C         766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A   805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B   825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
WS-07 Wave A   850 KEEP /  50 POLISH /  0 REDESIGN / 0 REPLACE —  50 flagged
WS-07 Wave B   875 KEEP /  25 POLISH /  0 REDESIGN / 0 REPLACE —  25 flagged
```

Structural findings remain **0**.

Wave A established permanent audit tooling.  
Wave B fixed visual representation, listening leakage, and pre-reader issues.  
Wave C diversified direct literacy recognition through **74 `symbol_hunt` activities** while preserving existing choice evidence.  
WS-06 closed all Coloring exact-geometry duplicate findings: **Q108 59 -> 20 -> 0**.  
WS-07 Waves A/B add 50 functional Drawing scaffolds, bringing Drawing scaffold coverage to **75/100** and reducing **Q106 75 -> 50 -> 25**.

Remaining deterministic finding:

- **25 young Drawing activities without explicit functional scaffold -> final WS-07 wave + WS-08 visual review.**

### WS-05 — Gameplay/mechanic diversification
**Status: IN_PROGRESS.** Wave C delivered the first reusable presentation diversification (`symbol_hunt`) while preserving canonical choice evidence. Continue only when a mechanic genuinely improves the learning objective. Avoid one-off gimmicks.

### WS-06 — Coloring rebuild
**Status: DONE.** PR #95 + PR #96.

Results:
- 100/100 Coloring deterministic KEEP;
- Q108 exact geometry duplicates: **59 -> 0**;
- runtime geometry validation remains required;
- gallery previews regenerate from runtime geometry before `dev`, `build`, and `build:cloudflare`;
- human visual review caught and corrected clipping/off-canvas issues before merge;
- no assessment/mastery/progression/schema semantics changed.

Wave A: PR #95, merge `4049449b5678f7f769f986750380a71b30536928`, CI #406.  
Wave B: PR #96, merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22`, CI #408.

### WS-07 — Drawing rebuild
**Status: IN_PROGRESS — Waves A/B completed through implementation QA; final 25 remain.**

#### Wave A — concrete scaffold families
PR #98 / merge `d9f0245e8531662840e2d9030e7b9b6e2f9e1df0`.

- added 25 explicit functional scaffolds for objects, animals, nature, faces/people, and simple scenes;
- preserved the original 25 foundational trace/dots/composition guides;
- functional coverage became 50/100 Drawing activities;
- reused existing `DrawingGuide` + `DrawingScaffold` runtime;
- scaffolds remain non-interactive and never count as child strokes or synthetic completion;
- manual visual review corrected two face guides that were too prescriptive;
- final head CI #415 success;
- deterministic result: **850 KEEP / 50 POLISH / 0 REDESIGN / 0 REPLACE**, Q106=50.

#### Wave B — structured visual skills
PR #99.

Scope:
- space/layers: 5;
- texture/marks: 5;
- symmetry: 5;
- story/sequence: 5;
- composition/focus: 5.

Implementation principles:
- use partial anchors/axes/frames/surfaces rather than finished pictures;
- texture activities provide a surface while the child authors the marks;
- symmetry activities provide axis/half-form cues while the child completes the counterpart;
- story activities provide sequence/layout anchors while the child authors the event;
- composition/focus activities provide relative placement cues while the child authors the subject/details.

QA:
- total functional guide contract: **75/100**;
- all 75 definitions unique;
- SVG paths parse, have non-zero length, and stay inside the 480×480 canvas;
- direct runtime routes load with matching preview assets;
- scaffold alone never enables `Selesai`;
- audit result: **875 KEEP / 25 POLISH / 0 REDESIGN / 0 REPLACE**, Q106=25, Q108=0, structural=0;
- implementation CI #418 full success across Ubuntu, production build, mobile Chromium, Windows, dependency audit, simulations/final acceptance, and secret scan.

Manual visual review found three story scaffolds too prescriptive before final acceptance: `drawing-story-rain-sun` supplied the cloud/sun, `drawing-story-ball-roll` supplied the ball, and `drawing-story-friend-wave` supplied the waving arm. All three were reduced to neutral panel/path/figure anchors and rerendered. Corrected previews were manually reviewed and accepted.

#### Remaining 25

Do not blindly generate finished-picture scaffolds for these open-ended families:

- invention: 5;
- character: 5;
- map/world: 5;
- visual design: 5;
- capstone/free studio: 5.

The final wave should prefer sparse zones, frames, starting marks, composition anchors, or explicit age-fit disposition. Do not weaken Q106 merely to make the audit zero, and do not manufacture mastery for creative work.

### WS-08 — Art direction & visual QA
**Status: TODO / SUPPORTING WS-07.** Create Mainlagi Art Bible covering character proportions, stroke, shape language, palette, backgrounds, icons/objects, shadows, spacing, age complexity, touch/fill sizes, and animation. Permanent visual QA must cover clipping, overlap, contrast, overflow, touch targets, SVG/path errors, duplicate geometry, and human review.

### WS-09 — Stage/gallery UX
**Status: DONE.** PR #89 + PR #90. Product model: Recommended Path + Stage Journey + Browse All. Direct Home -> Subject -> Activity remains valid; mastery/readiness logic unchanged.

### WS-10 — Physical-device/accessibility/Iqro acceptance
**Status: TODO.** Real iPhone/Safari + Android/Chrome checks for touch/trace/drawing/coloring/audio/orientation/camera permission/offline/reconnect/reduced motion/text scaling/VoiceOver/TalkBack. Iqro requires competent human content/pronunciation review.

### WS-11 — Governance
**Status: TODO.** Review required checks, secret-history scan/ruleset requirements, review approval policy, generated QA outputs, and docs-update discipline.

### WS-12 — Technical cleanup
**Status: TODO AFTER product quality stabilizes.** Remove confirmed-unused helpers/duplicates, improve static authoring architecture, optimize only from measurements, and tidy historical docs.

## 4. Execution order

1. WS-01 docs — DONE.
2. WS-09 stage/gallery — DONE.
3. WS-04 Waves A/B/C — DONE.
4. WS-06 Coloring rebuild — DONE; Q108=0.
5. **WS-07 Drawing rebuild — IN PROGRESS; Waves A/B done, final 25 remain.**
6. WS-08 Art Bible + permanent visual QA.
7. WS-02 voice/narration.
8. WS-03 public/parent frontend.
9. WS-10 external acceptance.
10. WS-11 governance.
11. WS-12 cleanup.
12. Only then consider major activity/feature expansion.

## 5. Global Definition of Done

A task is complete only when applicable implementation, typecheck/lint/build, relevant tests, routes, mobile UX, visible visual review, accessibility, pedagogy/evidence behavior, licence/provenance, screenshots/evidence, canonical docs, and execution log are current.

## 6. Mandatory agent handoff

Before work: read this plan, `CURRENT_STATE.md`, `ARCHITECTURE.md`, and subsystem docs.  
After work: update status, changed scope, QA/result, decisions, remaining issues, affected canonical docs, and add an Execution Log entry. Never claim production/deployment/expert approval without evidence.

## 7. Status tracker

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 / CI #362 |
| WS-02 Voice & narration | TODO | Engine/voice/licence evaluation needed |
| WS-03 Public/parent frontend | TODO | About/FAQ + parent recommendations |
| WS-04 Activity audit/redesign | IN_PROGRESS | 875/25/0/0 after WS-07 Wave B; Q106 only |
| WS-05 Mechanic diversification | IN_PROGRESS | 74 symbol_hunt activities merged |
| WS-06 Coloring rebuild | DONE | PR #95/#96; Q108=0 |
| WS-07 Drawing rebuild | IN_PROGRESS | 75/100 guides; final 25 open-ended activities remain |
| WS-08 Art direction/visual QA | TODO | Art Bible + permanent visual quality gate |
| WS-09 Stage/gallery UX | DONE | PR #89 + #90 |
| WS-10 External acceptance | TODO | Physical devices + Iqro expert review |
| WS-11 Governance | TODO | Required checks/ruleset review |
| WS-12 Technical cleanup | TODO | After product-quality stabilization |

Allowed states: `TODO -> IN_PROGRESS -> BLOCKED -> QA -> DONE`.

## 8. Execution Log

### 2026-09-14 — WS-07 Drawing Wave B structured scaffolds
**Branch/PR:** `agent/ws07-drawing-scaffold-wave-b-20260914` / PR #99  
**Status:** QA — implementation complete; final docs-head CI required before merge  
**Implementation QA:** CI #418 full success

Changed:
- extended functional Drawing guide coverage 50 -> 75 activities;
- added 25 structured starter scaffolds across space, texture, symmetry, story, and focus;
- kept guides non-interactive and separate from creative completion;
- strengthened browser/local playroom expectations from 50 -> 75 real guides;
- exported runtime-derived Wave B previews for visual review;
- preserved activity count, practice semantics, mastery, progression, assessment, and schema.

Audit:

```text
Before Wave B   850 KEEP / 50 POLISH / 0 REDESIGN / 0 REPLACE — 50 flagged
After Wave B    875 KEEP / 25 POLISH / 0 REDESIGN / 0 REPLACE — 25 flagged
Q106             50 -> 25
Q108              0 ->  0
structural         0 ->  0
```

Visual QA rejected three initially over-prescriptive story guides and reduced them to neutral anchors before final acceptance. Corrected rerenders passed manual review and CI #418.

Remaining: 25 open-ended invention/character/map/design/capstone activities.

### 2026-09-14 — WS-07 Drawing Wave A concrete scaffolds
**Status:** DONE. PR #98; merge `d9f0245e8531662840e2d9030e7b9b6e2f9e1df0`; final head CI #415 success. Q106 75 -> 50.

### 2026-09-14 — WS-06 Coloring Wave A/B
**Status:** DONE. PR #95/#96; Q108 59 -> 0; final Coloring deterministic 100/100 KEEP.

### 2026-09-14 — WS-04 Wave C / WS-05 symbol-hunt
**Status:** DONE. PR #93; merge `85aea0e5843f251eb83e5aa62180268b75455cfa`; CI #398. Q105=0.

### 2026-09-14 — WS-04 Wave B
**Status:** DONE. PR #92; merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`; CI #387.

### 2026-09-14 — WS-04 Wave A
**Status:** DONE. PR #91; CI #378; merge `7a087d590381dd4487811027690ac187ff87954b`.

### 2026-09-14 — WS-09 stage/gallery coherence
**Status:** DONE. PR #89 + #90; CI #368.

### 2026-09-14 — WS-01 canonical docs
**Status:** DONE. PR #88; CI #362; merge `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

## 9. Not current priorities

Do not prioritize hundreds of new activities, subscription/paywall, large AI tutor, OCR rollout, realtime generative curriculum, major social expansion, marketplace expansion, mastery/backend rewrite, or architecture migration until the quality phase is substantially complete.

## 10. North Star

Selesai ketika anak melihat task yang menarik dan jelas, bisa berinteraksi nyaman, mendapat feedback yang menyenangkan, mendengar narration yang tepat, benar-benar melatih skill yang dimaksud, dan orang tua memahami serta percaya pada produk.

**Quality first. Quantity later.**
