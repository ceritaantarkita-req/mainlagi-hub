# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase product-quality Mainlagi Hub. Semua developer/AI agent wajib membaca dan memperbarui dokumen ini ketika mengerjakan scope terkait.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current merged baseline:** `main` @ `ebeae5ed8d7e58c9b7b9807c88c0d92c45481329`  
**Active branch/PR:** `agent/ws07-drawing-scaffold-final-20260914` / PR #100  
**Focus:** frontend/UI/visual quality, gameplay/mechanic diversity, voice, activity quality, dan product coherence.  
**Principle:** **Quality first. Quantity later.** Improve the existing 900 activities before major expansion.

## 1. Product goal

Mainlagi harus terasa sebagai produk belajar anak 3–7 tahun yang visualnya konsisten, mudah dipahami, punya narration Indonesia/English yang natural, activity yang valid secara pedagogi, gameplay yang cukup beragam, creative art yang tidak slop, dan public/parent experience yang jelas—tanpa merusak learning/mastery foundation yang sudah sehat.

## 2. Mandatory rules

1. Frontend/UI/visual dan gameplay quality adalah patokan utama fase ini.
2. Jangan menambah activity hanya untuk mengejar jumlah.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan yang terbukti.
4. Assessed activity wajib menjaga atau secara eksplisit memperbarui evidence contract.
5. Gameplay diversification harus reusable dan cocok dengan objective; jangan membuat gimmick satu-off.
6. Affiliate/commerce tidak boleh masuk child learning flow.
7. Voice/model/art wajib licence/provenance-safe.
8. Iqro/Hijaiyah tidak boleh dianggap approved hanya dari engineering/TTS.
9. Generated/procedural art bukan otomatis production-ready.
10. Jangan merusak route/database/progression yang sudah lolos CI.
11. **Code merged tanpa update docs = pekerjaan belum selesai.**

## 3. Workstreams

### WS-01 — Canonical docs
**Status: DONE.** PR #88; CI #362; merge `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

### WS-02 — Native voice & narration
**Status: TODO.** Build provider-independent narration, voice registry for Naya/Gian/Zia/Paca/Gavi, licence review, pre-generated reviewed fixed audio, runtime TTS only where justified, and separate reviewed Iqro audio.

### WS-03 — Public/parent frontend
**Status: TODO.** Rewrite stale `/about` and `/faq`, improve public navigation/footer, expose parent recommendations/affiliate area with clear disclosure, fix image fallback/CTA/mobile/accessibility, and keep commerce outside child flow.

### WS-04 — Audit/redesign 900 activities
**Status: DETERMINISTIC TRIAGE CLEAN; HUMAN REVIEW STILL OPEN.** Canonical detail: `ACTIVITY_QUALITY_AUDIT.md`.

Accepted progression:

```text
Wave A          640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B          683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C          766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A    805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B    825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
WS-07 Wave A    850 KEEP /  50 POLISH /  0 REDESIGN / 0 REPLACE —  50 flagged
WS-07 Wave B    875 KEEP /  25 POLISH /  0 REDESIGN / 0 REPLACE —  25 flagged
WS-07 Final     900 KEEP /   0 POLISH /  0 REDESIGN / 0 REPLACE —   0 flagged
```

Structural findings remain **0**. Q101–Q108 are now zero in PR #100 / CI #422. This is a deterministic triage result, not human expert approval.

### WS-05 — Gameplay/mechanic diversification
**Status: IN_PROGRESS — NEXT PRIMARY IMPLEMENTATION FOCUS.**

Already delivered:
- 74 direct literacy activities render through reusable `symbol_hunt` presentation while preserving canonical choice values and attempt evidence.

Next phase:
1. measure mechanic/template concentration across the 900-activity catalog;
2. select repeated families where a different interaction better expresses the learning objective;
3. implement reusable mechanics/presentations rather than per-activity gimmicks;
4. preserve the canonical assessed evidence contract (`correct`, `incorrect`, retries/attempts, completion) or explicitly migrate it with tests;
5. add browser/mobile/accessibility QA for every new mechanic family.

Priority candidates from the final audit include large repeated `listen_and_choose`, Letters `tap_choice`, matching, and trace families. Candidate reusable mechanics include drag-to-target, sorting/bucketing, ordering/sequencing, find-in-scene, count/select, lightweight puzzle/assembly, memory/pairing, and story interaction. The mechanic must be chosen by learning objective—not by a quota for novelty.

### WS-06 — Coloring rebuild
**Status: DONE.** PR #95 + PR #96. Q108 59 -> 0; 100/100 deterministic KEEP; runtime-derived preview lifecycle and human clipping/off-canvas review added; creative-practice semantics preserved.

### WS-07 — Drawing rebuild
**Status: QA — final PR #100 passed implementation CI #422 and visual review; final docs-head CI/merge pending.**

Results across all waves:
- original 25 foundational trace/dots/composition guides preserved;
- Wave A added 25 concrete object/animal/nature/face/scene starters;
- Wave B added 25 structured space/texture/symmetry/story/focus starters;
- Final wave adds 25 sparse invention/character/map/design/capstone starters;
- functional scaffold coverage becomes **100/100 Drawing activities**;
- Q106: **75 -> 50 -> 25 -> 0**;
- all authored guide definitions remain activity-specific and unique;
- SVG parsing, nonzero path length, 480×480 bounds, direct route loading, thumbnail availability, and no synthetic completion are browser-tested;
- no mastery/progression/schema/activity-count changes.

Final-wave visual review accepted the sparse treatment: free studio uses corner marks only; maps use nodes/routes/boundaries; character activities use construction anchors; design uses empty layout containers; invention/capstone guides use sparse zones/starting marks instead of finished answers.

### WS-08 — Art direction & visual QA
**Status: TODO / CONTINUES IN PARALLEL AFTER WS-07.** Create Mainlagi Art Bible covering character proportions, stroke, shape language, palette, backgrounds, icons/objects, shadows, spacing, age complexity, touch/fill sizes, and animation. Permanent visual QA must cover clipping, overlap, contrast, overflow, touch targets, SVG/path errors, duplicate geometry, and human review.

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
3. WS-04 deterministic Waves A/B/C — DONE.
4. WS-06 Coloring rebuild — DONE; Q108=0.
5. WS-07 Drawing rebuild — final PR #100 in closeout; Q106=0 in CI #422.
6. **WS-05 gameplay/mechanic diversification — NEXT PRIMARY IMPLEMENTATION.**
7. WS-08 Art Bible + permanent visual QA.
8. WS-02 voice/narration.
9. WS-03 public/parent frontend.
10. WS-10 external acceptance.
11. WS-11 governance.
12. WS-12 cleanup.
13. Only then consider major activity/feature expansion.

## 5. Global Definition of Done

A task is complete only when applicable implementation, typecheck/lint/build, relevant tests, routes, mobile UX, visible visual review, accessibility, pedagogy/evidence behavior, licence/provenance, screenshots/evidence, canonical docs, and execution log are current.

## 6. Mandatory agent handoff

Before work: read this plan, `CURRENT_STATE.md`, `ARCHITECTURE.md`, and subsystem docs. After work: update status, changed scope, QA/result, decisions, remaining issues, affected canonical docs, and add an Execution Log entry. Never claim production/deployment/expert approval without evidence.

## 7. Status tracker

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 / CI #362 |
| WS-02 Voice & narration | TODO | Engine/voice/licence evaluation needed |
| WS-03 Public/parent frontend | TODO | About/FAQ + parent recommendations |
| WS-04 Activity audit/redesign | QA / deterministic clean | PR #100 audit 900/0/0/0; human review still separate |
| WS-05 Mechanic diversification | IN_PROGRESS | 74 symbol_hunt merged; mechanic concentration audit + next reusable families now primary |
| WS-06 Coloring rebuild | DONE | PR #95/#96; Q108=0 |
| WS-07 Drawing rebuild | QA | PR #100; 100/100 guides; Q106=0; final docs-head CI/merge pending |
| WS-08 Art direction/visual QA | TODO | Art Bible + permanent visual quality gate |
| WS-09 Stage/gallery UX | DONE | PR #89 + #90 |
| WS-10 External acceptance | TODO | Physical devices + Iqro expert review |
| WS-11 Governance | TODO | Required checks/ruleset review |
| WS-12 Technical cleanup | TODO | After product-quality stabilization |

Allowed states: `TODO -> IN_PROGRESS -> BLOCKED -> QA -> DONE`.

## 8. Execution Log

### 2026-09-14 — WS-07 final sparse Drawing scaffolds
**Branch/PR:** `agent/ws07-drawing-scaffold-final-20260914` / PR #100  
**Status:** QA — implementation + visual review complete; final docs-head CI/merge pending  
**Implementation QA:** CI #422 full success

Changed:
- extended functional Drawing scaffold coverage 75 -> 100 activities;
- added 25 sparse guides for invention, character, map/world, visual design, and capstone/free studio;
- used workspace boundaries, zones, axes, nodes, routes, and starting marks instead of finished-picture templates;
- strengthened drawing regression/local playroom expectations from 75 -> 100 real guides;
- exported all 25 final sparse-scaffold previews for human review;
- preserved activity count, creative completion, mastery, progression, assessment, and schema.

Audit:

```text
Before final wave   875 KEEP / 25 POLISH / 0 REDESIGN / 0 REPLACE — 25 flagged
After final wave    900 KEEP /  0 POLISH / 0 REDESIGN / 0 REPLACE —  0 flagged
Q106                 25 -> 0
Q108                  0 -> 0
structural             0 -> 0
```

Visual QA reviewed all 25 runtime-derived final previews and accepted the sparse treatment with no clipping/off-canvas issue observed and no obvious finished-answer scaffold.

### 2026-09-14 — WS-07 Drawing Wave B structured scaffolds
**Status:** DONE. PR #99; merge `ebeae5ed8d7e58c9b7b9807c88c0d92c45481329`; docs-head CI #420 full success. Q106 50 -> 25. Manual QA corrected three overly prescriptive story guides before merge.

### 2026-09-14 — WS-07 Drawing Wave A concrete scaffolds
**Status:** DONE. PR #98; merge `d9f0245e8531662840e2d9030e7b9b6e2f9e1df0`; final head CI #415 success. Q106 75 -> 50.

### 2026-09-14 — WS-06 Coloring Wave A/B
**Status:** DONE. PR #95/#96; Q108 59 -> 0; final Coloring deterministic 100/100 KEEP.

### 2026-09-14 — WS-04 Wave C / WS-05 symbol-hunt
**Status:** DONE. PR #93; merge `85aea0e5843f251eb83e5aa62180268b75455cfa`; CI #398. Q105=0; 74 symbol_hunt presentations.

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

Selesai ketika anak melihat task yang menarik dan jelas, bisa berinteraksi nyaman melalui mechanics yang sesuai objective, mendapat feedback yang menyenangkan, mendengar narration yang tepat, benar-benar melatih skill yang dimaksud, dan orang tua memahami serta percaya pada produk.

**Quality first. Quantity later.**
