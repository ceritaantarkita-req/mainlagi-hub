# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase product-quality Mainlagi Hub. Semua developer/AI agent wajib membaca dan memperbarui dokumen ini ketika mengerjakan scope terkait.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current baseline:** `main` @ `f85cb66a78fc395263d9ca1928d64b312ef03a90`  
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

Selesai melalui PR #88, CI #362 success, squash merge `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

Canonical docs sekarang membedakan current truth dari historical snapshots dan konsisten dengan 9 subjects / 900 activities.

### WS-02 — Native voice & narration

**Status: TODO**

Goal: provider-independent Indonesian/English narration yang natural, reviewed dan licence-safe.

Target:

```text
Narration request
  -> provider abstraction
      -> character/voice registry
          -> approved pre-generated audio for fixed content
          -> runtime TTS only for justified dynamic content
```

Work:
- audit current audio/TTS;
- evaluate open-source engines/voices including Indonesian support;
- verify engine + model/voice licence individually;
- build voice registry for Naya, Gian, Zia, Paca, Gavi;
- pre-generate + human-review fixed lesson narration;
- record provenance/version/approval;
- separate Iqro reviewed audio from generic TTS.

Done when minimal approved Indonesian + English paths exist and frontend is not coupled to one provider.

### WS-03 — Public/parent frontend

**Status: TODO**

Work:
- rewrite stale `/about`;
- rewrite stale `/faq`;
- improve public/footer/navigation discoverability;
- integrate parent-facing recommendations from existing affiliate infrastructure;
- clear affiliate disclosure;
- fix image fallback/CTA/mobile/accessibility as needed;
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

Audit all 100 Coloring activities.

Production art requirements:
- clear silhouette;
- consistent stroke;
- closed/fillable shapes;
- no accidental overlap;
- adequate finger/fill area;
- age-appropriate complexity;
- correct layer order;
- phone readability;
- no disguised heavy duplicate composition;
- screenshot + geometry QA;
- human visual approval.

### WS-07 — Drawing rebuild

**Status: TODO**

Audit all 100 Drawing activities.

Target:
- clear visual objective;
- meaningful scaffold/guide;
- progressive guide when appropriate: basic shape -> structure -> detail -> optional decoration;
- guide does not obstruct canvas;
- free drawing remains possible;
- no fake academic mastery from creative completion.

### WS-08 — Art direction & visual QA

**Status: TODO**

Create permanent **Mainlagi Art Bible** covering:
- characters/proportions;
- stroke/line language;
- shape language;
- palette;
- backgrounds;
- object/icon style;
- shadows;
- spacing;
- complexity by age;
- minimum touch/fill sizes;
- animation principles.

Visual QA must cover mobile/tablet/desktop, clipping, overlap, contrast, overflow, touch targets, SVG/path errors, duplicate geometry and human visual review.

### WS-09 — Stage progression vs 100-card gallery

**Status: QA**

Product decision: **Recommended Path + Stage Journey + Browse All**.

Contract:
- one recommended next activity is prominent;
- open stages are visible as a learning journey and link to the existing Stage/Lesson view;
- stage navigation is useful context, not a mandatory extra click;
- default activity grid shows only currently playable + age-eligible activities;
- the complete 100-activity subject catalog remains available through secondary `Lihat semua`;
- locked/age-ineligible cards do not dominate the default child view;
- progression/evidence readiness remains unchanged;
- direct Home -> Subject -> Activity remains possible.

Implementation: PR #89, branch `agent/ws09-stage-gallery-coherence-20260914`.

Done when CI, browser/mobile QA, visual review, docs, and merge are complete.

### WS-10 — Physical-device, accessibility & Iqro acceptance

**Status: TODO**

Required external checks include:
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
- make documentation-update discipline part of PR completion.

### WS-12 — Technical cleanup

**Status: TODO — AFTER product quality is stable**

Candidates:
- retire unused recommendation helpers if confirmed unused;
- improve static content authoring architecture;
- remove duplicate definitions;
- optimize bundle only from measurements;
- tidy historical docs/indexing.

Do not combine broad cleanup with major content redesign unless necessary.

## 4. Default execution order

1. WS-01 Canonical docs — **DONE**.
2. WS-09 Stage/gallery coherence — **QA**.
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
14. Only then evaluate major new activity/features expansion.

Independent workstreams may run in parallel only when ownership/file scope is clear and they do not create conflicting product decisions.

## 5. Global Definition of Done

A task is complete only when applicable checks are satisfied:

- implementation complete;
- typecheck/lint/build pass;
- relevant automated tests pass;
- routes remain healthy;
- mobile UX checked;
- visible changes human-reviewed;
- accessibility checked;
- pedagogical/evidence behavior checked for learning changes;
- licence/provenance checked for new audio/art/model dependencies;
- screenshots/evidence updated where relevant;
- canonical docs updated;
- this workstream status + execution log updated.

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
6. update all affected canonical docs;
7. add an Execution Log entry below.

Do not claim production/deployment/expert approval without evidence.

If code and docs conflict, verify against current code/production, reconcile canonical docs, and record the reconciliation.

## 7. Status tracker

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 merged; CI #362 success |
| WS-02 Voice & narration | TODO | Need engine/voice/licence evaluation |
| WS-03 Public/parent frontend | TODO | About/FAQ stale; affiliate exists but weakly discoverable |
| WS-04 Activity audit/redesign | TODO | Audit all 900 |
| WS-05 Mechanic diversification | TODO | Only based on learning objective |
| WS-06 Coloring rebuild | TODO | Audit 100 |
| WS-07 Drawing rebuild | TODO | Audit 100 |
| WS-08 Art direction/visual QA | TODO | Art Bible + permanent quality gate |
| WS-09 Stage/gallery UX | QA | PR #89; Recommended Path + Stage Journey + Browse All |
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
- changed Subject page from a flat default wall of 100 cards to progression-aware presentation;
- added one prominent recommended next activity;
- surfaced open stages as a horizontal learning journey linking to the existing Stage/Lesson screen;
- default grid now contains immediately playable + age-eligible activities;
- complete 100-card catalog remains available under secondary `Lihat semua`;
- preserved total catalog integrity without weakening route/progression rules;
- updated local product-flow and Playroom QA contracts that previously required flat 100-card/no-stage UX.

#### Decisions
- selected hybrid `Recommended Path + Stage Journey + Browse All` model;
- stage is context and structured exploration, not a mandatory extra click before every activity;
- direct Home -> Subject -> Activity remains valid;
- mastery/evidence/readiness logic remains untouched.

#### QA
- PR #89 opened;
- automated CI/browser checks are running/re-running against the branch;
- final human visual acceptance remains required before DONE.

#### Remaining
- resolve any CI/browser issue found by PR #89;
- review responsive screenshots/visual density;
- merge only when checks are green;
- after merge mark WS-09 DONE with final SHA/CI evidence.

#### Docs updated
- `docs/NEXT_PRODUCT_QUALITY_PLAN.md`;
- `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md` in this PR.

### 2026-09-14 — WS-01 canonical documentation reconciliation

**Agent/developer:** ChatGPT  
**Branch/PR:** `docs/next-product-quality-plan-20260914` / PR #88  
**Status:** DONE

#### Changed
- added canonical execution plan and docs index;
- reconciled README, CURRENT_STATE, KNOWN_LIMITATIONS, ARCHITECTURE, mastery, product direction and UX specification;
- separated current canonical truth from historical snapshots.

#### Decisions
- dated audit/redesign files remain historical evidence;
- learning/mastery foundation remains stable by default;
- PR #87 Garden/Playroom is the frontend baseline.

#### QA
- CI #362: success;
- PR #88 squash merged;
- main merge SHA: `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

#### Remaining
- none for WS-01.

## 9. Not current priorities

Until the quality work is substantially complete, do not prioritize:
- hundreds of new activities;
- subscription/paywall;
- large AI tutor;
- OCR rollout;
- generative realtime curriculum;
- major social/leaderboard expansion;
- large marketplace expansion;
- mastery/backend rewrite;
- architecture migration without a product need.

## 10. North Star

Fase ini selesai ketika anak dapat melihat sesuatu yang menarik, langsung memahami apa yang harus dilakukan, berinteraksi nyaman di perangkatnya, mendapat feedback yang menyenangkan, mendengar narration yang tepat, dan benar-benar melatih skill yang dimaksud—sementara orang tua memahami dan percaya pada kualitas produk.

**Quality first. Quantity later.**
