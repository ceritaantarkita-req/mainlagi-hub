# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase product-quality Mainlagi Hub. Semua developer/AI agent wajib membaca dan memperbarui dokumen ini ketika mengerjakan scope terkait.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current merged baseline:** `main` @ `31ed55a0bee24a3baae7ff459f79bee9f585ad22`  
**Active branch/PR:** `docs/ws06-coloring-closeout-20260914` / WS-06 closeout  
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
Wave A        640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B        683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C        766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A  805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B  825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
```

Structural findings remain **0**.

Wave A established permanent audit tooling.  
Wave B fixed visual representation, listening leakage, and pre-reader issues.  
Wave C diversified direct literacy recognition through **74 `symbol_hunt` activities** while keeping existing `tap_choice` evidence intact.  
WS-06 Wave A/B closed all Coloring exact-geometry duplicate findings: **Q108 59 -> 20 -> 0**.

Remaining deterministic finding:

- **75 young Drawing activities without explicit scaffold -> WS-07 + WS-08.**

### WS-05 — Gameplay/mechanic diversification
**Status: IN_PROGRESS.** Wave C delivered the first reusable presentation diversification (`symbol_hunt`) while preserving canonical choice evidence. Continue only when a mechanic genuinely improves the learning objective. Candidate families include drag/target, sorting, ordering, memory, find-in-scene, trace, puzzle/assembly, count/select, and story interaction. Avoid one-off gimmicks.

### WS-06 — Coloring rebuild
**Status: DONE.** PR #95 + PR #96.

Results:
- all 100 Coloring activities remain creative practice;
- Q108 exact geometry duplicates: **59 -> 0**;
- high-severity groups of 3+ were rebuilt first, then the final ten duplicate pairs;
- final deterministic Coloring triage: **100 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**;
- runtime geometry parser/validation remains required;
- gallery preview images are regenerated from runtime geometry before `dev`, `build`, and `build:cloudflare`, reducing stale-thumbnail drift;
- runtime-derived visual evidence covers all 49 authored Coloring variants introduced by WS-06;
- Wave A human visual review found and corrected two clipping/off-canvas issues before merge;
- Wave B ten changed scenes were reviewed for clipping, context readability, and canvas fit before merge.

Wave A: PR #95, merge `4049449b5678f7f769f986750380a71b30536928`, final CI #406 full success.  
Wave B: PR #96, merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22`, final CI #408 full success.

No assessment/mastery/progression/schema semantics changed.

### WS-07 — Drawing rebuild
**Status: TODO — NEXT.** Current handoff: **75 `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD` findings**.

Goals:
- add progressive visual guides where age/development requires them;
- structure suitable tasks as basic shape -> structure -> detail -> optional decoration;
- preserve true free drawing as open creative practice where appropriate;
- do not manufacture mastery/assessment for creative drawing;
- keep touch/stroke ergonomics suitable for young children;
- verify scaffold visibility and usefulness on phone/tablet sizes;
- split implementation into reviewable waves rather than changing all 75 blindly at once.

### WS-08 — Art direction & visual QA
**Status: TODO / SUPPORTING WS-07.** Create Mainlagi Art Bible: character proportions, stroke, shape language, palette, backgrounds, icons/objects, shadows, spacing, age complexity, minimum touch/fill size, animation. Permanent visual QA must cover mobile/tablet/desktop, clipping, overlap, contrast, overflow, touch targets, SVG/path errors, duplicate geometry, and human review.

### WS-09 — Stage/gallery UX
**Status: DONE.** Product model: **Recommended Path + Stage Journey + Browse All**. PR #89 implementation + PR #90 closeout. Direct Home -> Subject -> Activity remains valid; mastery/readiness logic unchanged.

### WS-10 — Physical-device/accessibility/Iqro acceptance
**Status: TODO.** Real iPhone/Safari + Android/Chrome checks for touch/trace/drawing/coloring/audio/orientation/camera permission/offline/reconnect/reduced motion/text scaling/VoiceOver/TalkBack. Iqro requires competent human content/pronunciation review.

### WS-11 — Governance
**Status: TODO.** Review required checks, make secret-history scan required if repository policy allows, review approval requirement, keep generated QA outputs handled correctly, and keep docs-update discipline mandatory.

### WS-12 — Technical cleanup
**Status: TODO AFTER product quality stabilizes.** Remove confirmed-unused helpers/duplicates, improve static authoring architecture, optimize only from measurements, and tidy historical docs.

## 4. Execution order

1. WS-01 docs — DONE.
2. WS-09 stage/gallery — DONE.
3. WS-04 Wave A — DONE.
4. WS-04 Wave B — DONE.
5. WS-04 Wave C + WS-05 first diversification — DONE.
6. WS-06 Coloring rebuild — DONE; PR #95/#96; Q108=0.
7. **WS-07 Drawing rebuild — NEXT.**
8. WS-08 Art Bible + permanent visual QA.
9. WS-02 voice/narration.
10. WS-03 public/parent frontend.
11. WS-10 external acceptance.
12. WS-11 governance.
13. WS-12 cleanup.
14. Only then consider major activity/feature expansion.

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
| WS-04 Activity audit/redesign | IN_PROGRESS | 825/75/0/0; only Drawing Q106 remains |
| WS-05 Mechanic diversification | IN_PROGRESS | 74 symbol_hunt activities merged; broader mechanics only where justified |
| WS-06 Coloring rebuild | DONE | PR #95/#96; Q108=0; 100/100 Coloring deterministic KEEP |
| WS-07 Drawing rebuild | TODO — NEXT | 75 young Drawing/no-scaffold findings |
| WS-08 Art direction/visual QA | TODO | Art Bible + permanent quality gate; support Drawing rebuild |
| WS-09 Stage/gallery UX | DONE | PR #89 + #90 |
| WS-10 External acceptance | TODO | Physical devices + Iqro expert review |
| WS-11 Governance | TODO | Required secret scan + ruleset review |
| WS-12 Technical cleanup | TODO | After product-quality stabilization |

Allowed states: `TODO -> IN_PROGRESS -> BLOCKED -> QA -> DONE`.

## 8. Execution Log

### 2026-09-14 — WS-06 Coloring Wave A/B
**Status:** DONE  
**Wave A:** PR #95 -> merge `4049449b5678f7f769f986750380a71b30536928` -> CI #406 full success  
**Wave B:** PR #96 -> merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22` -> CI #408 full success

Changed:
- rebuilt duplicate Coloring scene compositions instead of cosmetically renaming prompts;
- Wave A removed all duplicate groups containing 3+ activities;
- Wave B removed the final ten exact-geometry pairs;
- strengthened Coloring QA to require zero exact geometry duplicate groups after Wave B;
- added runtime-derived preview evidence for authored scenes;
- integrated Coloring preview regeneration into normal dev/build/Cloudflare build lifecycle;
- kept all Coloring activities creative practice with no mastery/progression/schema changes.

Audit progression:

```text
Wave C baseline        766 KEEP / 95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
After WS-06 Wave A     805 KEEP / 95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
After WS-06 Wave B     825 KEEP / 75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
Q108                     59 -> 20 -> 0
structural findings       0 ->  0 -> 0
```

Manual visual QA: Wave A exposed two issues that parser-valid SVG did not catch (rain-trip bus clipping and an off-canvas night star); both were corrected and rerendered before merge. Wave B's ten new variants were reviewed as a set and showed no clipping/off-canvas blocker.

Remaining deterministic issue: only `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD` = 75.

### 2026-09-14 — WS-04 Wave C / WS-05 symbol-hunt diversification
**Status:** DONE. PR #93; merge `85aea0e5843f251eb83e5aa62180268b75455cfa`; CI #398 success. 74 direct literacy activities use `symbol_hunt`; Q105=0; canonical choice evidence preserved.

### 2026-09-14 — WS-04 Wave B representation/pre-reader fixes
**Status:** DONE. PR #92; merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`; closeout CI #387 success. Q101/Q102/Q103/Q104 resolved to zero.

### 2026-09-14 — WS-04 Wave A deterministic baseline
**Status:** DONE. PR #91; CI #378; merge `7a087d590381dd4487811027690ac187ff87954b`.

### 2026-09-14 — WS-09 stage/gallery coherence
**Status:** DONE. PR #89 implementation; PR #90 closeout; CI #368.

### 2026-09-14 — WS-01 canonical docs
**Status:** DONE. PR #88; CI #362; merge `f85cb66a78fc395263d9ca1928d64b312ef03a90`.

## 9. Not current priorities

Do not prioritize hundreds of new activities, subscription/paywall, large AI tutor, OCR rollout, realtime generative curriculum, major social expansion, marketplace expansion, mastery/backend rewrite, or architecture migration until the quality phase is substantially complete.

## 10. North Star

Selesai ketika anak melihat task yang menarik dan jelas, bisa berinteraksi nyaman, mendapat feedback yang menyenangkan, mendengar narration yang tepat, benar-benar melatih skill yang dimaksud, dan orang tua memahami serta percaya pada produk.

**Quality first. Quantity later.**
