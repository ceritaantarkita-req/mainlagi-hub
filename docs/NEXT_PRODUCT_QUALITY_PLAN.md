# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan untuk fase product-quality Mainlagi Hub. Semua developer/AI agent wajib membaca dan memperbarui dokumen ini ketika mengerjakan scope terkait.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Current merged baseline:** `main` @ `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`  
**Active branch/PR:** `agent/ws05-gameplay-sequence-slot-20260914` / PR #102  
**Focus:** frontend/UI/visual quality, gameplay/mechanic diversity, voice, activity quality, dan product coherence.  
**Principle:** **Quality first. Quantity later.** Improve the existing 900 activities before major expansion.

## 1. Product goal

Mainlagi harus terasa sebagai produk belajar anak 3–7 tahun yang visualnya konsisten, mudah dipahami, punya narration Indonesia/English yang natural, activity yang valid secara pedagogi, gameplay yang beragam, creative art yang tidak slop, dan public/parent experience yang jelas—tanpa merusak learning/mastery foundation yang sudah sehat.

## 2. Mandatory rules

1. Frontend/UI/visual dan gameplay quality adalah patokan utama fase ini.
2. Jangan menambah activity hanya untuk mengejar jumlah.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan yang terbukti.
4. Assessed activity wajib menjaga atau secara eksplisit memperbarui evidence contract.
5. Gameplay diversification harus reusable dan cocok dengan objective; jangan membuat gimmick satu-off.
6. Target WS-05 adalah **minimum 50, target kerja 60 pola permainan**; pola bukan berarti 60 engine terpisah.
7. Setiap mechanic baru wajib punya mobile, keyboard/accessibility, progression, completion, evidence regression QA, dan visual review pada viewport target.
8. Affiliate/commerce tidak boleh masuk child learning flow.
9. Voice/model/art wajib licence/provenance-safe.
10. Iqro/Hijaiyah tidak boleh dianggap approved hanya dari engineering/TTS.
11. Generated/procedural art bukan otomatis production-ready.
12. Jangan merusak route/database/progression yang sudah lolos CI.
13. **Code merged tanpa update docs = pekerjaan belum selesai.**

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

Structural findings remain **0**. Q101–Q108 are zero. This is a deterministic triage result, not human expert approval.

### WS-05 — Gameplay/mechanic diversification
**Status: IN_PROGRESS — PRIMARY IMPLEMENTATION FOCUS.**

Canonical gameplay list: **`docs/GAMEPLAY_VARIATION_CATALOG.md`**.

Target:
- minimum **50** distinct gameplay patterns;
- working target **60** patterns;
- implement them through roughly **12–15 reusable interaction engines**, not 60 one-off components;
- distribute patterns across the 900 activities according to learning objective so one easy template does not dominate.

Current state:
- **10 patterns merged** on `main`: choice grid, symbol hunt, listen/choose, visible matching, guided trace, story/read, motion game, coloring canvas, drawing canvas, and `memory_pair`;
- PR #101 merged as `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`; `memory_pair` covers exactly 12 Letters uppercase/lowercase case-matching activities and preserves canonical matching evidence/mastery semantics;
- **pattern #11 `missing_sequence_slot` is in QA on PR #102**, scoped to exactly 10 `letters-order-*` activities while preserving canonical `tap_choice`, choices/correctChoice, assessed evidence, progression and completion semantics;
- PR #102 browser QA covers progression, keyboard wrong-state, pointer completion, evidence persistence, 320/390/768 layouts, and explicit in-viewport success CTA checks;
- manual visual QA accepted the compacted 320×720 idle/try/success states after fixing a clipped success CTA;
- `symbol_hunt` already covers 74 direct-literacy activities while preserving canonical choice/evidence semantics.

Next rollout order:
1. close `missing_sequence_slot` PR #102 with final docs-head CI and merge;
2. add `sorting_buckets` + `drag_to_target` for classification/matching families;
3. add `reorder_cards` + `tap_in_order` only where objectives require multi-step ordering;
4. add `find_in_scene` + `hidden_object` for recognition/observation families;
5. expand Math with count/select, number-line, total-building and pattern interactions;
6. diversify audio with listen/point, listen/match and sound discrimination;
7. continue puzzle/path, literacy construction, science exploration, creative and story interaction families until the 60-pattern target is reached.

Rules:
- mechanic follows objective, not novelty quota;
- assessed evidence must remain valid or be explicitly migrated with tests;
- practice/creative activities must not manufacture mastery;
- every new pattern gets browser/mobile/accessibility QA plus visible visual review;
- maintain a mechanic-distribution audit over all 900 activities and flag excessive concentration.

### WS-06 — Coloring rebuild
**Status: DONE.** PR #95 + PR #96. Q108 59 -> 0; 100/100 deterministic KEEP; runtime-derived preview lifecycle and human clipping/off-canvas review added; creative-practice semantics preserved.

### WS-07 — Drawing rebuild
**Status: DONE.** PR #98 + PR #99 + PR #100; final merge `c01f8122b19cde3d46ea0e2d3297b58216fe824c`.

Results:
- 100/100 Drawing activities have functional activity-specific scaffolds;
- foundational, concrete, structured, and sparse open-ended guide families are covered;
- Q106: **75 -> 50 -> 25 -> 0**;
- all authored guide definitions remain activity-specific and unique;
- SVG parsing, nonzero path length, 480×480 bounds, direct route loading, thumbnail availability, and no synthetic completion are browser-tested;
- no mastery/progression/schema/activity-count changes;
- final sparse guides preserve creativity: free studio uses corner marks; maps use nodes/routes/boundaries; character uses construction anchors; design uses empty layout containers.

### WS-08 — Art direction & visual QA
**Status: TODO / CONTINUES IN PARALLEL.** Create Mainlagi Art Bible covering character proportions, stroke, shape language, palette, backgrounds, icons/objects, shadows, spacing, age complexity, touch/fill sizes, and animation. Permanent visual QA must cover clipping, overlap, contrast, overflow, touch targets, SVG/path errors, duplicate geometry, and human review.

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
5. WS-07 Drawing rebuild — DONE; Q106=0.
6. **WS-05 gameplay/mechanic diversification — ACTIVE; target 60 patterns.**
7. WS-08 Art Bible + permanent visual QA in parallel where useful.
8. WS-02 voice/narration.
9. WS-03 public/parent frontend.
10. WS-10 external acceptance.
11. WS-11 governance.
12. WS-12 cleanup.
13. Only then consider major activity/feature expansion.

## 5. Global Definition of Done

A task is complete only when applicable implementation, typecheck/lint/build, relevant tests, routes, mobile UX, visible visual review, accessibility, pedagogy/evidence behavior, licence/provenance, screenshots/evidence, canonical docs, and execution log are current.

For WS-05, a mechanic is not DONE until its pattern is documented in `GAMEPLAY_VARIATION_CATALOG.md` and the catalog-wide distribution audit is updated.

## 6. Mandatory agent handoff

Before work: read this plan, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `GAMEPLAY_VARIATION_CATALOG.md`, and subsystem docs. After work: update status, changed scope, QA/result, decisions, remaining issues, affected canonical docs, and add an Execution Log entry. Never claim production/deployment/expert approval without evidence.

## 7. Status tracker

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 / CI #362 |
| WS-02 Voice & narration | TODO | Engine/voice/licence evaluation needed |
| WS-03 Public/parent frontend | TODO | About/FAQ + parent recommendations |
| WS-04 Activity audit/redesign | QA / deterministic clean | 900/0/0/0; human review still separate |
| WS-05 Mechanic diversification | IN_PROGRESS | 10 merged patterns; missing_sequence_slot QA on PR #102; target 60 |
| WS-06 Coloring rebuild | DONE | PR #95/#96; Q108=0 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100; 100/100 guides; Q106=0 |
| WS-08 Art direction/visual QA | TODO | Art Bible + permanent visual quality gate |
| WS-09 Stage/gallery UX | DONE | PR #89 + #90 |
| WS-10 External acceptance | TODO | Physical devices + Iqro expert review |
| WS-11 Governance | TODO | Required checks/ruleset review |
| WS-12 Technical cleanup | TODO | After product-quality stabilization |

Allowed states: `TODO -> IN_PROGRESS -> BLOCKED -> QA -> DONE`.

## 8. Execution Log

### 2026-09-14 — WS-05 Sequence Slot Wave
**Branch/PR:** `agent/ws05-gameplay-sequence-slot-20260914` / PR #102  
**Status:** QA

Implementation and acceptance evidence:
- exactly 10 `letters-order-*` activities route to reusable `sequence_slot` presentation / catalog pattern `missing_sequence_slot`;
- canonical runtime remains `tap_choice`; activity IDs, choices, correctChoice, skills, assessment, stars, progression and completion semantics are unchanged;
- explicit runtime evidence uses `choice_sequence_interaction` with correct/incorrect/retry counts;
- browser QA checks progression readiness, keyboard wrong-state, pointer completion, persistence/evidence, no horizontal overflow, balanced candidate row, and 320/390/768 screenshots;
- manual review found the first 320×720 success CTA clipped below the viewport; narrow-screen CSS was compacted and browser QA now asserts the success CTA is fully in viewport;
- CI #447 on implementation head `3f0f5b335675fba1aefc03552cc9c4ed3d9f4006` is full success across Ubuntu, Windows, production build, dependency audit, secret scan and mobile Chromium;
- activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural findings 0.

Remaining before merge: docs-head CI must be fully green; then merge with exact current head SHA.

### 2026-09-14 — WS-05 Memory Pair Wave
**PR:** #101  
**Status:** DONE; merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.

Result:
- 12 Letters case-matching activities use `memory_pair` presentation;
- canonical `matching` runtime/evidence/mastery semantics preserved;
- browser QA covers keyboard/pointer, 320/390/768 layouts, completion, evidence and progression;
- progression hydration race discovered during QA was fixed at product level before merge;
- final visual review accepted responsive 2×2 four-card layouts.

### 2026-09-14 — WS-05 gameplay target raised to 60 patterns
**Status:** DONE as planning decision.

Decision:
- product target is minimum 50, working target **60 gameplay patterns**;
- patterns are grouped under reusable interaction families rather than implemented as 60 independent engines;
- `docs/GAMEPLAY_VARIATION_CATALOG.md` is the canonical short catalog for names, behavior, status, rollout order, and Definition of Done;
- mechanic distribution across all 900 activities becomes a required WS-05 audit so a single template cannot dominate merely because it is easy to author.

### 2026-09-14 — WS-07 final sparse Drawing scaffolds
**Status:** DONE. PR #100; merge `c01f8122b19cde3d46ea0e2d3297b58216fe824c`. Final deterministic audit reached 900 KEEP / 0 flagged; Q106=0; final sparse-scaffold visual review accepted.

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

Untuk WS-05, “beragam” berarti katalog mendekati **60 pola permainan yang meaningful**, bukan 900 activity yang hanya memakai ulang quiz yang sama dengan konten berbeda.
