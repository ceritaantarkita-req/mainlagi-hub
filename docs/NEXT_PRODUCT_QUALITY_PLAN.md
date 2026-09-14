# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `f981d40fd55c1cdef3137600b4b44677e550b06d`  
**Active branch/PR:** `agent/ws05-gameplay-sorting-buckets-20260914` / PR #103  
**Primary focus:** WS-05 gameplay/mechanic diversification.  
**Principle:** **Quality first. Quantity later.** Improve the existing 900 activities before major expansion.

## 1. Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, narration-nya natural, dan evidence/mastery-nya dapat dipercaya. Gameplay diversity harus mengurangi rasa repetitif tanpa mengorbankan objective, progression, accessibility, atau correctness.

## 2. Mandatory rules

1. Frontend/UI/visual dan gameplay quality adalah patokan utama fase ini.
2. Jangan menambah activity hanya untuk mengejar jumlah.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
5. Mechanic harus reusable dan cocok dengan objective; jangan membuat gimmick one-off.
6. Target WS-05: **minimum 50, target kerja 60 gameplay patterns**; bukan 60 engine terpisah.
7. Setiap mechanic baru wajib punya static regression, progression, completion/evidence, keyboard, touch/pointer, mobile responsive, dan visual review nyata.
8. Jangan membuat drag-only interaction; input alternatif wajib tersedia bila mechanic memungkinkan.
9. Affiliate/commerce tidak boleh masuk child learning flow.
10. Voice/model/art wajib licence/provenance-safe.
11. Iqro/Hijaiyah tidak boleh dianggap approved hanya dari engineering/TTS.
12. Jangan merusak route/database/progression yang sudah lolos CI.
13. **Code merged tanpa canonical docs = pekerjaan belum selesai.**

## 3. Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | provider-independent, reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | About/FAQ + parent surfaces |
| WS-04 Activity audit/redesign | QA / deterministic clean | 900 KEEP / 0 flagged; human review separate |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 11 merged patterns; Sorting Buckets QA on #103; target 60 |
| WS-06 Coloring rebuild | DONE | PR #95/#96; Q108=0 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100; Q106=0 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human visual gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert review |
| WS-11 Governance | TODO | required checks/rulesets/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product-quality stabilization |

## 4. WS-05 — Gameplay diversification

Canonical mechanic catalog: `docs/GAMEPLAY_VARIATION_CATALOG.md`.

### Target

- minimum **50** distinct child-facing patterns;
- working target **60**;
- implement through roughly **12–15 reusable interaction engines**;
- distribute patterns across 900 activities according to learning objective;
- maintain a distribution audit so easy templates do not dominate sessions.

### Merged patterns on `main`: 11

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`.

Important accepted waves:
- PR #101 Memory Pair — 12 Letters case-matching activities; merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- PR #102 Sequence Slot — 10 Letters `letters-order-*` activities; merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- `symbol_hunt` already covers 74 direct-literacy activities.

### Active PR #103 — Sorting Buckets

Scope: exactly 5 basic Logic classification activities:

- `logic-classify-animal`
- `logic-classify-round`
- `logic-classify-up-arrow`
- `logic-classify-two-items`
- `logic-classify-red`

Behavior and boundaries:
- child sorts all three canonical choices into **Sesuai aturan** vs **Tidak sesuai**;
- runtime stays `tap_choice`;
- IDs, choices, `correctChoice`, skill, assessment, stars, progression, and completion identity stay canonical;
- explicit assessed evidence fidelity: `choice_sorting_interaction`;
- keyboard + touch/pointer supported;
- advanced multi-attribute `logic-classify-*` activities are excluded by classifier guard;
- Drag-to-Target is intentionally not mixed into this PR.

Acceptance evidence:
- implementation head `97ae2e4d4b76e64865abb634216c5d8ce94dc8f8`;
- CI #457 full green: Ubuntu, Windows, production build, dependency audit, secret scan, mobile Chromium;
- deterministic audit remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, structural=0;
- browser QA: progression, keyboard wrong-state, pointer completion, evidence/persistence, >=44px controls, no horizontal overflow, 320/390/768 screenshots;
- visual QA accepted final idle/error/success states;
- QA caught two issues before acceptance: accidental removal of `@phosphor-icons/react` from `package.json`, and clipped 320×720 success CTA. Both are fixed and regression-covered.

Remaining for #103: canonical docs commit -> docs-head full CI -> review-thread check -> squash merge with exact head SHA.

### Next mechanic after #103

**`drag_to_target`**, on a new branch from latest `main`:
- choose activities whose objective genuinely involves spatial placement/matching;
- real pointer/touch drag to target;
- fallback tap/select + keyboard path required;
- canonical evidence/progression preserved;
- 320/390/768 browser + human visual QA required.

Then prioritize `reorder_cards`, `tap_in_order`, `find_in_scene`, `hidden_object`, Math interaction families, audio families, puzzle/path, literacy construction, science exploration, creative, and story interactions according to the distribution audit.

## 5. Global Definition of Done

A mechanic/PR is complete only when applicable implementation, typecheck/lint/build, engine tests, activity-quality audit, routes, progression, evidence, accessibility, mobile UX, visible screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

For WS-05 specifically:
- classifier scope must be explicit and regression-tested;
- assessed evidence must be trustworthy;
- wrong/retry behavior must be measured where applicable;
- success/error state must fit target viewports;
- mechanic distribution must eventually be reflected in the catalog-wide audit.

## 6. Execution order

1. Close PR #103 Sorting Buckets safely.
2. Implement `drag_to_target` as a separate mechanic wave.
3. Add/maintain 900-activity gameplay-distribution audit and use it to choose high-value families.
4. Continue toward 50–60 meaningful patterns.
5. Run WS-08 Art Bible/permanent visual QA in parallel where useful.
6. WS-02 narration.
7. WS-03 public/parent frontend.
8. WS-10 physical-device/accessibility/Iqro expert acceptance.
9. WS-11 governance.
10. WS-12 cleanup after quality stabilizes.
11. Only then consider major activity/feature expansion.

## 7. Mandatory agent handoff

Before work:
- read `CURRENT_STATE.md`, this plan, `ARCHITECTURE.md`, and `GAMEPLAY_VARIATION_CATALOG.md`;
- start from clean latest `main`;
- use one objective per branch/PR.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- record merge SHA in canonical docs on the next relevant docs update;
- never present unmerged work as shipped.

## 8. Execution log — recent

### 2026-09-14 — Sorting Buckets Wave
**PR:** #103  
**Status:** QA; implementation/browser/visual accepted, docs-head CI pending.

Result so far:
- 5 basic Logic classification activities use `sorting_buckets`;
- explicit `choice_sorting_interaction` evidence;
- advanced classification families remain untouched;
- CI #457 full green at implementation head;
- visual QA accepted 320/390/768 after narrow-success CTA fix;
- dependency regression from accidental Phosphor removal was caught and fixed before acceptance.

### 2026-09-14 — Sequence Slot Wave
**Status:** DONE. PR #102; merge `f981d40fd55c1cdef3137600b4b44677e550b06d`. Exactly 10 Letters sequence activities; visual/browser/evidence QA accepted.

### 2026-09-14 — Memory Pair Wave
**Status:** DONE. PR #101; merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`. Exactly 12 Letters case-matching activities; progression hydration race discovered/fixed before merge.

### 2026-09-14 — Gameplay target raised
**Status:** DONE as product decision. Minimum 50, working target 60 meaningful gameplay patterns with reusable engines and distribution auditing.

Earlier accepted quality waves remain recorded in Git history and subsystem docs: WS-01 (#88), WS-09 (#89/#90), activity-quality Waves A–C (#91–#93), Coloring (#95/#96), Drawing (#98–#100).

## 9. Not current priorities

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, major mastery/backend rewrite, or architecture migration until this quality phase is substantially complete.

## 10. North Star

Anak harus melihat task yang jelas dan menarik, berinteraksi lewat mechanic yang sesuai objective, mendapat feedback yang menyenangkan, dan benar-benar melatih skill yang dimaksud. “Beragam” berarti mendekati **60 meaningful gameplay patterns**, bukan 900 activity yang hanya mengganti konten pada quiz yang sama.
