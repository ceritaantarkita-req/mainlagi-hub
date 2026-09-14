# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase product-quality Mainlagi Hub. Semua developer/AI agent wajib membaca dan memperbarui dokumen ini ketika mengerjakan scope terkait.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current baseline:** `main` @ `59f9dca8a81de80bdbbd4070fcbb6a203af90f6b`  
**Focus:** frontend/UI/visual quality, voice, activity quality, dan product coherence.  
**Prinsip:** **Quality first. Quantity later.** Perbaiki 900 activity yang ada sebelum ekspansi besar.

## 1. Tujuan

Mainlagi harus terasa sebagai produk belajar anak 3–7 tahun yang:

- konsisten dan menarik secara visual;
- mudah dipahami anak dan orang tua;
- punya narration Bahasa Indonesia dan English yang natural;
- punya activity yang masuk akal secara pedagogi;
- punya gameplay yang cukup beragam;
- tidak menghasilkan visual procedural/AI slop;
- punya public/parent information architecture yang jelas;
- mempertahankan learning/mastery foundation yang sudah sehat.

Fase ini adalah **Product Coherence & Content Quality**, bukan feature-count expansion.

## 2. Aturan kerja

1. Frontend/UI/visual adalah patokan utama fase ini.
2. Jangan menambah activity hanya untuk mengejar jumlah.
3. Jangan rewrite learning attempt/mastery/progression/schema tanpa kebutuhan yang terbukti.
4. Perubahan assessed activity wajib menjaga atau secara eksplisit memperbarui evidence contract.
5. Affiliate/commerce tidak boleh muncul sebagai CTA di child learning flow.
6. TTS/model/voice/art wajib aman licence/provenance-nya untuk penggunaan yang dimaksud.
7. Iqro/Hijaiyah tidak boleh dianggap approved hanya dari generic TTS atau engineering tests.
8. Generated/procedural art boleh menjadi draft; production art perlu visual review.
9. Jangan merusak route/database/progression yang sudah lolos CI.
10. **Code merged tanpa update docs = pekerjaan belum selesai.**

## 3. Workstreams

### WS-01 — Canonical documentation sync

**Status: DONE**

PR #88; CI #362 success; merge `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

Current docs sekarang membedakan canonical truth dari historical snapshots dan konsisten dengan 9 subjects / 900 activities.

### WS-02 — Native voice & narration

**Status: TODO**

Goal: provider-independent Indonesian/English narration yang natural, reviewed dan licence-safe.

```text
Narration request
  -> provider abstraction
      -> character/voice registry
          -> approved pre-generated audio for fixed content
          -> runtime TTS only for justified dynamic content
```

Work:
- audit current audio/TTS;
- evaluate open-source engines/voices with real Indonesian support;
- verify engine + model/voice licence individually;
- build voice registry for Naya, Gian, Zia, Paca, Gavi;
- pre-generate + human-review fixed narration;
- record provenance/version/approval;
- keep Iqro reviewed audio separate from generic TTS.

### WS-03 — Public/parent frontend

**Status: TODO**

Work:
- rewrite stale `/about`;
- rewrite stale `/faq`;
- improve public/footer/navigation discoverability;
- integrate parent-facing recommendations from existing affiliate infrastructure;
- keep clear affiliate disclosure;
- fix image fallback/CTA/mobile/accessibility;
- no affiliate CTA in child learning flow.

### WS-04 — Audit/redesign 900 activities

**Status: TODO**

Every activity must be reviewed for:
- age;
- learning objective;
- mapped skill;
- assessed/practice status;
- prompt;
- representation;
- distractors;
- mechanic validity;
- ambiguity;
- difficulty;
- uniqueness;
- visual quality;
- evidence compatibility.

Classification:
- `KEEP`
- `POLISH`
- `REDESIGN`
- `REPLACE`

Critical red flags:
- representation measures the wrong skill;
- answer leaked by prompt/UI;
- irrelevant/trivial distractors;
- repeated template with only label/data changed;
- ambiguous/multiple valid answers;
- age mismatch;
- prompt/visual mismatch;
- misleading artwork.

Example: visual color recognition should use actual colors/objects; reading `BLUE / RED / GREEN` is written-vocabulary recognition, not pure color recognition.

### WS-05 — Gameplay/mechanic diversification

**Status: TODO**

Use only when pedagogically useful:
- tap/select;
- audio choose;
- drag/drop;
- matching;
- sorting;
- ordering/sequence;
- memory;
- find-in-scene/hotspot;
- trace;
- drawing;
- coloring;
- puzzle/assembly;
- count/select;
- story interaction;
- optional motion.

Prefer reusable runtime primitives. Every mechanic requires mobile/accessibility QA and valid evidence semantics.

### WS-06 — Coloring rebuild

**Status: TODO**

Audit all 100 Coloring activities. Production assets require clear silhouette, consistent stroke, closed/fillable shapes, no accidental overlaps, finger-friendly fill areas, age-appropriate complexity, correct layers, phone readability, duplicate control, geometry/screenshot QA, and human visual approval.

### WS-07 — Drawing rebuild

**Status: TODO**

Audit all 100 Drawing activities. Each needs a clear visual objective and useful scaffold. Progressive guide may use: basic shape -> structure -> detail -> optional decoration. Free drawing remains possible; creative completion must not manufacture academic mastery.

### WS-08 — Art direction & visual QA

**Status: TODO**

Create permanent **Mainlagi Art Bible** covering characters/proportions, stroke, shapes, palette, backgrounds, objects/icons, shadows, spacing, complexity by age, minimum touch/fill sizes, and animation principles.

Visual QA must cover mobile/tablet/desktop, clipping, overlap, contrast, overflow, touch targets, SVG/path errors, duplicate geometry and human visual review.

### WS-09 — Stage progression vs 100-card gallery

**Status: QA**

Product decision: **Recommended Path + Stage Journey + Browse All**.

Implemented and merged through PR #89 at `59f9dca8a81de80bdbbd4070fcbb6a203af90f6b`.

Contract:
- one recommended next activity is prominent;
- open stages are visible as a learning journey linking to Stage/Lesson view;
- stage navigation is context, not a mandatory extra click;
- default grid shows currently playable + age-eligible activities;
- complete 100-activity catalog stays available under secondary `Lihat semua`;
- locked/age-ineligible cards do not dominate the default child view;
- direct Home -> Subject -> Activity remains valid;
- progression/evidence/readiness logic remains unchanged.

QA evidence:
- PR CI #368: success;
- Production build: success;
- Windows typecheck/lint/engine path: success;
- dependency audit: success;
- secret-history scan: success;
- Mobile route QA (Chromium): success, including subject routes, touch-size, overflow, accessibility/lazy-load matrix and responsive screenshot artifact.

Remaining before `DONE`:
- final product/visual spot-check of the changed subject presentation after deployed-main availability.

### WS-10 — Physical-device, accessibility & Iqro acceptance

**Status: TODO**

Required external checks:
- iPhone + Safari;
- Android + Chrome;
- touch/trace/drawing/coloring;
- audio;
- orientation/safe area;
- camera permission/recovery/denial;
- reduced motion/text scaling;
- VoiceOver/TalkBack;
- offline/reconnect/session isolation.

Iqro requires competent human content/pronunciation review before `expert_approved`.

### WS-11 — Governance hardening

**Status: TODO**

Work:
- make `Secret history scan` required if repository policy allows;
- review main required checks;
- review approval requirement;
- keep generated QA output excluded appropriately;
- make docs-update discipline part of PR completion.

### WS-12 — Technical cleanup

**Status: TODO — AFTER product quality is stable**

Candidates:
- retire unused recommendation helpers if confirmed unused;
- improve static content authoring architecture;
- remove duplicate definitions;
- optimize bundle only from measurements;
- tidy historical docs/indexing.

## 4. Default execution order

1. WS-01 Canonical docs — **DONE**.
2. WS-09 Stage/gallery coherence — **merged; final visual QA pending**.
3. WS-04 Audit 900 activities.
4. WS-05 Add only needed mechanic/runtime gaps.
5. Redesign invalid/trivial activities.
6. WS-06 Coloring rebuild.
7. WS-07 Drawing rebuild.
8. WS-08 Art Bible + visual QA.
9. WS-02 Voice/narration architecture + reviewed assets.
10. WS-03 About/FAQ/parent affiliate UX.
11. WS-10 Physical-device/accessibility/Iqro acceptance.
12. WS-11 Governance.
13. WS-12 Technical cleanup.
14. Only then evaluate major feature/activity expansion.

Independent workstreams may run in parallel when ownership/file scope is clear and product decisions do not conflict.

## 5. Global Definition of Done

A task is complete only when applicable checks are satisfied:

- implementation complete;
- typecheck/lint/build pass;
- relevant automated tests pass;
- routes remain healthy;
- mobile UX checked;
- visible changes visually reviewed;
- accessibility checked;
- pedagogical/evidence behavior checked for learning changes;
- licence/provenance checked for new audio/art/model dependencies;
- screenshots/evidence updated where relevant;
- canonical docs updated;
- workstream status + execution log updated.

## 6. Mandatory agent handoff rule

Before work:
1. read this plan;
2. read `CURRENT_STATE.md`;
3. read `ARCHITECTURE.md`;
4. read UX/mastery/subsystem docs relevant to the task.

After work:
1. update workstream status;
2. list changed scope;
3. record QA/result;
4. record decisions;
5. record remaining issues;
6. update affected canonical docs;
7. add an Execution Log entry below.

Do not claim production/deployment/expert approval without evidence. If code and docs conflict, verify, reconcile canonical docs, and record it.

## 7. Status tracker

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 merged; CI #362 success |
| WS-02 Voice & narration | TODO | Need engine/voice/licence evaluation |
| WS-03 Public/parent frontend | TODO | About/FAQ stale; affiliate weakly discoverable |
| WS-04 Activity audit/redesign | TODO | Audit all 900 |
| WS-05 Mechanic diversification | TODO | Only based on learning objective |
| WS-06 Coloring rebuild | TODO | Audit 100 |
| WS-07 Drawing rebuild | TODO | Audit 100 |
| WS-08 Art direction/visual QA | TODO | Art Bible + permanent quality gate |
| WS-09 Stage/gallery UX | QA | PR #89 merged; CI #368 success; final visual spot-check pending |
| WS-10 External acceptance | TODO | Physical devices + Iqro expert review |
| WS-11 Governance | TODO | Required secret scan + ruleset review |
| WS-12 Technical cleanup | TODO | After product-quality stabilization |

Allowed states: `TODO` -> `IN_PROGRESS` -> `BLOCKED` -> `QA` -> `DONE`.

## 8. Execution Log

Add newest entry at the top.

### 2026-09-14 — WS-09 Recommended Path + Stage Journey + Browse All

**Agent/developer:** ChatGPT  
**Branch/PR:** `agent/ws09-stage-gallery-coherence-20260914` / PR #89  
**Status:** QA

#### Changed
- replaced flat default wall of 100 cards with progression-aware subject presentation;
- added prominent recommended activity;
- added stage journey linked to existing Stage/Lesson screen;
- default grid now shows playable + age-eligible activities;
- complete 100-card catalog remains under `Lihat semua`;
- updated local product-flow/Playroom QA contract from the old flat-gallery/no-stage requirement;
- updated canonical UX/product docs.

#### Decisions
- selected `Recommended Path + Stage Journey + Browse All`;
- stage is structured context, not a mandatory extra click;
- direct Home -> Subject -> Activity stays valid;
- mastery/evidence/readiness logic is untouched.

#### QA
- PR #89 merged to `main` at `59f9dca8a81de80bdbbd4070fcbb6a203af90f6b`;
- CI #368 success;
- Mobile route QA success across canonical viewport matrix;
- complete 100-card catalog integrity retained;
- dependency audit and secret scan success.

#### Remaining
- visual/product spot-check of deployed subject presentation before moving status from `QA` to `DONE`.

#### Docs updated
- `docs/NEXT_PRODUCT_QUALITY_PLAN.md`;
- `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`;
- `docs/PRODUCT_DIRECTION.md`;
- current-state/limitations/architecture closeout docs in follow-up.

### 2026-09-14 — WS-01 canonical documentation reconciliation

**Agent/developer:** ChatGPT  
**Branch/PR:** `docs/next-product-quality-plan-20260914` / PR #88  
**Status:** DONE

#### QA
- CI #362 success;
- PR #88 squash merged;
- main merge SHA: `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

#### Result
Canonical current docs now separate current truth from dated historical snapshots and define the product-quality phase.

## 9. Not current priorities

Until quality work is substantially complete, do not prioritize hundreds of new activities, subscription/paywall, large AI tutor, OCR rollout, generative realtime curriculum, major social expansion, large marketplace expansion, mastery/backend rewrite, or architecture migration without product need.

## 10. North Star

Fase ini selesai ketika anak dapat melihat sesuatu yang menarik, langsung memahami apa yang harus dilakukan, berinteraksi nyaman di perangkatnya, mendapat feedback yang menyenangkan, mendengar narration yang tepat, dan benar-benar melatih skill yang dimaksud—sementara orang tua memahami dan percaya pada kualitas produk.

**Quality first. Quantity later.**
