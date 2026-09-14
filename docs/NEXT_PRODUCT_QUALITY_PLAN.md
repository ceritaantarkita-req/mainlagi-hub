# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`  
**Active branch/PR:** `agent/ws05-gameplay-distribution-audit-20260914` / PR #105  
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
13. Gameplay distribution harus tetap terukur; coverage/pattern-set regression adalah blocking, concentration adalah planning signal.
14. **Code merged tanpa canonical docs = pekerjaan belum selesai.**

## 3. Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | provider-independent, reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | About/FAQ + parent surfaces |
| WS-04 Activity audit/redesign | QA / deterministic clean | 900 KEEP / 0 flagged; human review separate |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 13 merged patterns; distribution audit QA on #105; target 60 |
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
- use reusable interaction engines;
- distribute patterns across 900 activities according to learning objective;
- keep a permanent audit so easy templates do not silently dominate sessions.

### Merged patterns on `main`: 13

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`.

Accepted waves:
- PR #101 Memory Pair — 12 Letters case-matching activities; merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- PR #102 Sequence Slot — 10 Letters order activities; merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- PR #103 Sorting Buckets — 5 basic Logic classification activities; merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`.
- PR #104 Drag-to-Target — 5 reviewed Science Wave A matching activities; merge `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`.
- `symbol_hunt` covers 74 direct-literacy activities.

### Active PR #105 — Gameplay Distribution Audit

PR #105 adds one canonical child-facing pattern classifier and permanent report generation. It changes no activity content, runtime identity, evidence, progression, mastery, or UI behavior.

Implementation-head CI #472 on `d275dbb0f2b1acfa033fc0c99ecb77d0860d24bd` is full green across Ubuntu, Windows, production build, dependency audit, secret scan, mobile Chromium, existing activity audit, and the new distribution audit.

Measured baseline:

```text
900 / 900 activities classified
0 unclassified
13 active patterns
```

Top overall distribution:
- `choice_grid`: 392 / 900 = **43.56%** — only global hotspot above the >35% advisory threshold.
- `visible_matching`: 108 / 900 = 12.00%.
- `coloring_canvas`: 100 / 900 = 11.11%.
- `drawing_canvas`: 100 / 900 = 11.11%.
- `listen_choose`: 76 / 900 = 8.44%.
- `symbol_hunt`: 74 / 900 = 8.22%.

Subject `choice_grid` concentration:
- Matematika: **82/100**.
- Sains: **79/100**.
- Logika: **77/100**.
- Bahasa Indonesia: 52/100.
- Iqro: 58/100.
- English: 44/100.

Other subject hotspot: Huruf & Menulis `symbol_hunt` 64/100. Coloring/Drawing each use their canvas 100/100 by design; this is a specialization signal, not automatically a defect.

Audit artifacts:

```text
.qa/gameplay-distribution/report.json
.qa/gameplay-distribution/report.md
```

CI uploads `gameplay-distribution-audit`.

### Decision for mechanic #14

The next planned mechanic is **`count_and_select`**, starting with a reviewed coherent Math counting family rather than broad runtime conversion.

Why:
- Math is the strongest non-creative hotspot at 82% `choice_grid`.
- Current Math choice families include `math-count-*` (9), compare (6), order (6), pattern (5), missing (5), plus arithmetic/review families.
- `count_and_select` fits the counting objective directly and can reduce quiz repetition without changing the canonical answer/evidence contract.

Do not route all Math choice activities into one new presentation. Each follow-on family must be reviewed separately.

Likely Math follow-ons after the first wave:
- `number_line` for number position/order families;
- `more_less_balance` for compare-more/less/equal families;
- `pattern_completion` for pattern/missing families;
- `make_total` where addition/composition objectives justify it.

Logic, Science, ordering, search/scene, audio, puzzle/path, literacy construction, creative, and story mechanics follow according to audit evidence and objective fit—not merely hotspot percentage.

## 5. Global Definition of Done

A mechanic/PR is complete only when applicable implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, visible screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

For WS-05 specifically:
- classifier scope must be explicit and regression-tested;
- assessed evidence must be trustworthy;
- wrong/retry behavior must be measured where applicable;
- success/error state must fit target viewports;
- distribution coverage must remain complete;
- hotspot reduction never overrides objective fit.

## 6. Execution order

1. Close PR #105 Gameplay Distribution Audit safely.
2. Implement Math `count_and_select` wave on a new branch from latest `main`.
3. Re-run distribution audit and record the new measured baseline.
4. Continue Math diversification by coherent family where appropriate.
5. Use the audit to choose the next Logic/Science/search/audio/ordering/puzzle/literacy/creative/story waves toward 60.
6. Run WS-08 Art Bible/permanent visual QA in parallel where useful.
7. WS-02 narration.
8. WS-03 public/parent frontend.
9. WS-10 physical-device/accessibility/Iqro expert acceptance.
10. WS-11 governance.
11. WS-12 cleanup after quality stabilizes.
12. Only then consider major activity/feature expansion.

## 7. Mandatory agent handoff

Before work:
- read `CURRENT_STATE.md`, this plan, `ARCHITECTURE.md`, and `GAMEPLAY_VARIATION_CATALOG.md`;
- start from clean latest `main`;
- use one objective per branch/PR.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots when UI changes;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- record merge SHA in canonical docs on the next relevant docs update;
- never present unmerged work as shipped.

## 8. Execution log — recent

### 2026-09-14 — Gameplay Distribution Audit
**PR:** #105  
**Status:** QA; implementation audit full green, canonical docs-head CI pending.

Result so far:
- canonical classifier covers 13 currently implemented child-facing patterns;
- 900/900 activities classified, 0 unclassified;
- `choice_grid` is 392/900 (43.56%), the only global >35% hotspot;
- Math 82%, Science 79%, Logic 77% `choice_grid`;
- CI #472 full green at implementation head;
- next planned mechanic changed to Math `count_and_select` based on measured concentration and objective fit.

### 2026-09-14 — Drag-to-Target Wave
**Status:** DONE. PR #104; merge `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`. Exactly 5 reviewed Science Wave A matching activities; mouse/touch/tap/keyboard/evidence/visual QA accepted.

### 2026-09-14 — Sorting Buckets Wave
**Status:** DONE. PR #103; merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`. Exactly 5 basic Logic classification activities; browser/evidence/visual QA accepted.

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
