# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay change:** PR #135 + closure #136 — Science `investigation_board`  
**Verified Pattern #28 implementation merge SHA:** `790487b1672bcf1d1edce023c3f071a7f1175fbf`  
**Current accepted unmerged gameplay PR:** #137 — Logic `relative_order_track`  
**Accepted implementation QA head:** `e91087aa1176723b0d90f310088b65a51d413ce7`  
**Accepted implementation CI:** #626 / run `34992813094`  
**Pattern #29:** **QA ACCEPTED / UNMERGED**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **28 merged patterns; Pattern #29 PR #137 QA accepted / unmerged** |
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

## Accepted PR #137 head

```text
900 / 900 classified
0 unclassified
29 active PR-head patterns
choice_grid                 313 / 900 = 34.78%
relative_order_track          5 / 900 = 0.56%
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

If PR #137 merges unchanged, distance remaining becomes **21 patterns** to minimum 50 and **31 patterns** to working target 60.

## Pattern #29 — Logic Relative Order Track — QA acceptance record

Exact scope:

```text
logic-order-first-after-start
logic-order-before-d
logic-order-between-blue-green
logic-order-third-symbol
logic-order-two-steps-after
```

All five remain assessed `tap_choice` activities in stage `logic-conditional-analogy-inference`, lesson `logic-relative-ordering`, pack `logic.pack.relative-ordering`, canonical skill `logic.order.relative.basic`, with exactly three canonical choices and unchanged `correctChoice`.

Interaction/evidence contract:
- only canonical ordered context already expressed by each prompt is visualized;
- the inferred target slot remains masked as `?` until assessment;
- config validation requires hidden slot = canonical `correctChoice`;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no invented sequence fact, answer leakage, changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_relative_order_track_interaction`;
- runtime metadata source `relative-order-track-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Scope boundaries remain explicit: Logic conditional/classification/inference families stay outside Pattern #29; Logic analogies remain `visible_matching`; Math ordering remains `number_line`; Letters ordering remains `missing_sequence_slot`.

Acceptance evidence:
- accepted implementation QA head `e91087aa1176723b0d90f310088b65a51d413ce7` passed full CI #626 / run `34992813094`;
- activity-quality artifact: **900 KEEP / 0 flagged / structural findings 0**;
- gameplay-distribution artifact: **900/900 classified, 0 unclassified, 29 patterns, choice_grid 313/900, relative_order_track 5/900, Logic 47/100, Science 56/100**;
- simulations and Batch17 acceptance passed;
- Ubuntu, Windows, production build, dependency audit, secret-history scan and Chromium canonical mobile/accessibility matrix passed;
- manual idle/wrong/success screenshot review at 320x720, 390x844 and 768x1024 accepted all nine states with no clipping/overflow or answer leakage and with visible feedback + success-only CTA.

Pattern #29 is not yet fully closed: canonical docs must now pass a fresh exact docs-head CI, then PR #137 must cleanly exact-head merge and be independently verified live on `main`, followed by a separate docs-only closure PR with its own exact-head CI/merge/live verification.

Permanent evidence remains 900 KEEP / 0 flagged / structural 0; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #29 PR #137: canonical docs -> fresh exact docs-head full CI -> clean PR gate -> exact-head merge -> live-main verification -> separate docs-only closure -> closure exact-head CI/merge/live verification.
2. After Pattern #29 is fully closed, run a **fresh objective/evidence audit for Pattern #30**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
