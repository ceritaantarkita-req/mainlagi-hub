# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest gameplay change:** PR #137 — Logic `relative_order_track`  
**Verified Pattern #29 implementation merge SHA:** `ec083b7206fdc7d8d2c21a1bbd6c2abbd1d44949`  
**Post-merge implementation CI:** #632 / run `34994824331` — full success including Cloudflare production smoke  
**Closure PR:** #138 — docs-only Relative Order Track closure  
**Pattern #29:** **FULLY CLOSED after closure exact-head merge/live verification**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **29 merged patterns; Pattern #29 closure PR #138** |
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
29 active merged patterns
choice_grid                 313 / 900 = 34.78%
relative_order_track          5 / 900 = 0.56%
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Distance remaining: **21 patterns** to minimum 50 and **31 patterns** to working target 60.

## Pattern #29 — Logic Relative Order Track — closure record

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
- inferred target slot remains masked as `?` until assessment;
- config validation requires hidden slot = canonical `correctChoice`;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes canonical activity identity;
- no invented sequence fact, answer leakage, changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_relative_order_track_interaction`;
- runtime metadata source `relative-order-track-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Scope boundaries remain explicit: Logic conditional/classification/inference families stay outside Pattern #29; Logic analogies remain `visible_matching`; Math ordering remains `number_line`; Letters ordering remains `missing_sequence_slot`.

Acceptance/closure chain:
- implementation QA head `e91087aa1176723b0d90f310088b65a51d413ce7` passed full CI #626 / run `34992813094`;
- canonical docs head `48d92434d83b028d48821e270a025c3a08a859bc` passed full CI #631 / run `34994322707`;
- all nine 320/390/768 idle/wrong/success screenshots passed manual visual acceptance;
- PR #137 exact-head squash merged as `ec083b7206fdc7d8d2c21a1bbd6c2abbd1d44949`, independently verified on `main`;
- post-merge `main` CI #632 / run `34994824331` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- post-merge closure is PR #138; its exact-head CI/gate/merge/live verification is the final Pattern #29 closure step.

Permanent evidence remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #29 closure PR #138 exact-head CI/gate/merge/live verification.
2. Run a **fresh objective/evidence audit for Pattern #30** from the verified 29-pattern baseline; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
