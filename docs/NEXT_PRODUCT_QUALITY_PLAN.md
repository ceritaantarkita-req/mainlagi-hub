# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #35 — Bahasa `picture_word_match`  
**Pattern #35 final main:** `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`  
**Pattern #35 final CI:** #727 / run `35086954102` — full success including exact Cloudflare production smoke  
**Active implementation:** Pattern #36 — Bahasa `sentence_order_cards`  
**Pattern #36 implementation PR:** #151  
**Pattern #36 accepted code head:** `595bc4e94065eb5250aef27797858641ca959c67`  
**Pattern #36 accepted code CI:** #728 / run `35089266590` — full PR success  
**Pattern #36:** **QA ACCEPTED / UNMERGED; CANONICAL DOCS UPDATE IN PROGRESS**  
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
| WS-01 Canonical docs | DONE / maintained | Pattern #36 implementation docs in progress |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **35 fully closed; Pattern #36 QA accepted/unmerged** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Verified baseline and accepted candidate

Merged Pattern #35 baseline:

```text
900 / 900 classified
0 unclassified
35 active merged patterns
choice_grid                 287 / 900 = 31.89%
picture_word_match            5 / 900 = 0.56%
Bahasa choice_grid            39 / 100
```

Accepted Pattern #36 candidate from CI #728 artifact:

```text
900 / 900 classified
0 unclassified
36 active candidate patterns
choice_grid                 282 / 900 = 31.33%
sentence_order_cards          5 / 900 = 0.56%
picture_word_match            5 / 900 = 0.56%
Bahasa choice_grid            34 / 100
```

Candidate distance is **14 patterns** to minimum 50 and **24 patterns** to working target 60.

## Pattern #36 — Bahasa Sentence Order Cards — QA ACCEPTED / UNMERGED

Exact scope:

```text
bahasa-urut-ibu-memasak
bahasa-urut-adi-berlari
bahasa-urut-kucing-tidur
bahasa-urut-siti-membaca
bahasa-urut-burung-terbang
```

Canonical boundaries:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-kalimat-urutan`;
- pack `bahasa.pack.kalimat-urutan`;
- skill `bahasa.kalimat.order`;
- assessed runtime remains `tap_choice`;
- exactly three canonical sentence choices and unchanged `correctChoice`;
- all non-scope families, content, activity IDs, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- present each existing sentence choice as its canonical words in left-to-right cards;
- preserve one direct canonical keyboard/touch/pointer choice;
- wrong choice records assessed incorrect/retry and cannot complete;
- correct choice completes the existing canonical activity;
- no changed answer set, invented tokens, drag-only dependency, extra confirmation or intermediate assessment;
- assessed fidelity `choice_sentence_order_cards_interaction`;
- runtime metadata source `sentence-order-cards-runtime` with `selectedChoice` and canonical-derived `selectedWords`.

Verified code-head QA:
- branch started exactly from fully closed Pattern #35 `main` `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`;
- accepted code head `595bc4e94065eb5250aef27797858641ca959c67` passed full CI #728 / run `35089266590`;
- Ubuntu quality, Windows compatibility, production build/budgets, dependency audit, secret-history scan and Chromium mobile/accessibility/browser QA passed;
- deterministic quality/distribution, simulations and Batch17 passed;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- candidate distribution is 900/900 classified, 36 active patterns, no global advisory hotspot above 35%;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Required next Pattern #36 gates: canonical docs update -> fresh exact docs-head CI -> clean scope/review/thread/mergeability gate -> exact-head squash merge -> independent live `main` + Cloudflare verification -> separate docs-only closure -> final `main` + Cloudflare verification. Only then mark Pattern #36 **FULLY CLOSED**.

## Pattern #35 — Picture Word Match — FULLY CLOSED

Implementation PR #149 and closure PR #150 are complete. Final verified `main` is `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`; final CI #727 / run `35086954102` passed the full matrix including exact Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #36 canonical docs and fresh exact docs-head CI.
2. Clean exact-head merge PR #151 and independently verify live `main` + Cloudflare smoke.
3. Complete separate docs-only Pattern #36 closure and final live verification.
4. Only after Pattern #36 is fully closed, run a fresh objective/evidence audit for Pattern #37; no family is pre-approved.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns, then parallel product-quality workstreams.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
