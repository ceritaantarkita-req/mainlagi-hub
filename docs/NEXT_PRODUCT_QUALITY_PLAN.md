# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay change:** PR #133 — Logic `spatial_transform`  
**Verified implementation merge SHA:** `f3f00b86537af8d0862a15113778458a777358ca`  
**Closure PR:** #134 — docs-only Spatial Transform closure  
**Pattern #27:** **FULLY CLOSED**  
**Primary focus:** WS-05 gameplay/mechanic diversification  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Jangan membuat drag-only interaction; fallback accessible wajib tersedia bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Work tidak boleh disebut fully closed sebelum exact-head implementation merge, live `main` verification, dan required post-merge closure selesai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | terus dijaga current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **27 merged patterns; Pattern #27 fully closed** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Verified merged baseline

```text
900 / 900 classified
0 unclassified
27 active merged patterns
choice_grid                 322 / 900 = 35.78%
spatial_transform             5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            52 / 100
```

Distance remaining: **23 patterns** to minimum 50 and **33 patterns** to working target 60.

## Pattern #27 — Logic Spatial Transform — FULLY CLOSED

Exact scope:

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

All five remain assessed `tap_choice` activities in stage `logic-mixed-reasoning-challenge`, lesson `logic-spatial-transform`, pack `logic.pack.spatial-transform`, canonical skill `logic.spatial.transform.basic`, with exactly three canonical choices and unchanged `correctChoice`.

Interaction/evidence contract:
- visible canonical starting direction and transform operation;
- final result hidden as `?` until assessment;
- keyboard/touch/pointer direct selection;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no answer leakage, drag-only dependency, extra confirmation, invented intermediate assessment, or Wave B spatial-relation bundling;
- assessed fidelity `choice_spatial_transform_interaction`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Acceptance/closure chain:
- implementation head `267f00d243dc1778c2d86e5a0ca70d8cfe76872a` passed full CI #597 / run `34976080767` plus manual 320x720, 390x844 and 768x1024 screenshot review;
- final implementation/docs head `c10294b1a69afd50b2458fee305ef59b321274e1` passed full CI #602;
- PR #133 gate was clean: open, non-draft, mergeable, 0 comments, 0 reviews, 0 review threads;
- exact-head squash merge PR #133 produced `f3f00b86537af8d0862a15113778458a777358ca`, independently verified live on `main`;
- post-merge closure is PR #134; this closure records the final completed state.

Permanent evidence remains 900 KEEP / 0 flagged / structural 0; five simulations remain `invariantErrors: 0`; Batch17 totals remain 9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Pattern #27 closure PR #134 is the final docs-only gate; after its exact-head merge + live-main verification, continue from the verified 27-pattern baseline.
2. Run a **fresh objective/evidence audit for Pattern #28**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
