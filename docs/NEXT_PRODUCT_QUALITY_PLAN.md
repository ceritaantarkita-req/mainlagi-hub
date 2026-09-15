# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay change:** PR #135 — Science `investigation_board`  
**Verified implementation merge SHA:** `790487b1672bcf1d1edce023c3f071a7f1175fbf`  
**Closure PR:** #136 — docs-only Investigation Board closure  
**Pattern #28:** **FULLY CLOSED after closure exact-head merge/live verification**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **28 merged patterns; Pattern #28 closure PR #136** |
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
28 active merged patterns
choice_grid                 318 / 900 = 35.33%
investigation_board           4 / 900 = 0.44%
Science choice_grid          56 / 100
Logic choice_grid            52 / 100
```

Distance remaining: **22 patterns** to minimum 50 and **32 patterns** to working target 60.

## Pattern #28 — Science Investigation Board — closure record

Exact scope:

```text
science-investigate-plant-light
science-investigate-fair-water
science-predict-ice-warm-place
science-evidence-shadow-times
```

All four remain assessed `tap_choice` activities in stage `science-evidence-review-challenge`, lesson `science-investigation-evidence`, pack `science.pack.investigation-evidence`, canonical skill `science.investigation.evidence.basic`, with exactly three canonical choices and unchanged `correctChoice`.

`science-match-observation-tools-d` remains canonical `matching` / `visible_matching` and outside the family.

Interaction/evidence contract:
- inquiry rail Amati / Jaga tetap / Prediksi / Simpulkan;
- one reviewed mode per activity;
- scenario facts are prompt-supported only;
- focus cue does not reveal the answer;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no fabricated experiment result/measurement, answer leakage, extra confirmation, drag-only dependency, or intermediate assessment;
- assessed fidelity `choice_investigation_board_interaction`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Acceptance/closure chain:
- CI #611 / run `34983143311` rejected a real 320px idle-feedback viewport defect; test remained strict;
- final mobile-fix head `837c3b8ec46ed4a9bfc17a777adeb86dcbffcdc4` passed full CI #614 / run `34987172569` plus manual 320x720, 390x844 and 768x1024 idle/try/success screenshot review;
- final implementation/docs head `a2b01b272c6dc42f819c43a74e8f52058ed0298d` passed full CI #615 / run `34988108936`;
- PR #135 exact-head squash merge produced `790487b1672bcf1d1edce023c3f071a7f1175fbf`, independently verified live on `main`;
- post-merge closure is PR #136; its exact-head CI/gate/merge/live verification is the final closure step.

Permanent evidence remains 900 KEEP / 0 flagged / structural 0; simulations and Batch17 acceptance remain clean; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #28 closure PR #136 exact-head CI/gate/merge/live verification.
2. Run a **fresh objective/evidence audit for Pattern #29** from the verified 28-pattern baseline; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
