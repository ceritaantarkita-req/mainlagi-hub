# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #36 — Bahasa `sentence_order_cards`  
**Pattern #36 final main:** `461b0fd59a6c238752aa858bf783716b225b548a`  
**Pattern #36 final CI:** #732 / run `35094107947` — full success including exact Cloudflare production smoke  
**Current implementation candidate:** Pattern #37 — Bahasa `reading_passage_question`  
**Pattern #37 implementation PR:** #153  
**Pattern #37 accepted code head:** `6ac29623ce53940f45cdfea623340d833af68c4d`  
**Pattern #37 accepted-head CI:** #733 / run `35096952272` — full success  
**Pattern #37:** **IMPLEMENTATION ACCEPTED; DOCS + FRESH EXACT-HEAD / MERGE GATES PENDING**  
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
| WS-01 Canonical docs | DONE / maintained | Pattern #37 implementation docs current on PR #153 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **36 fully closed; Pattern #37 implementation accepted / PR #153 open** |
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
36 active merged patterns
choice_grid                 282 / 900 = 31.33%
sentence_order_cards          5 / 900 = 0.56%
picture_word_match            5 / 900 = 0.56%
Bahasa choice_grid            34 / 100
```

Accepted Pattern #37 implementation-head audit:

```text
900 / 900 classified
0 unclassified
37 active candidate patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
Bahasa choice_grid                29 / 100
```

If merged unchanged, distance remaining becomes **13 patterns** to minimum 50 and **23 patterns** to working target 60.

## Pattern #37 — Bahasa Reading Passage Question — IMPLEMENTATION ACCEPTED

Exact scope:

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Canonical boundaries:
- subject `bahasa`;
- stage `bahasa-kalimat-pemahaman`;
- lesson `bahasa-bacaan-pendek`;
- pack `bahasa.pack.bacaan-pendek`;
- skill `bahasa.bacaan.short_comprehension`;
- assessed runtime remains `tap_choice`;
- exactly three canonical answer choices, same order and unchanged `correctChoice`;
- all non-scope families, content, activity IDs, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- parse the existing quoted passage and literal question from the unchanged prompt with exact-scope/fail-closed guards;
- present passage and question as separate visual reading surfaces;
- preserve one direct canonical keyboard/touch/pointer answer choice;
- wrong choice records assessed incorrect/retry and cannot complete;
- correct choice completes the existing canonical activity;
- no changed answer set, invented passage, extra confirmation or intermediate assessment;
- assessed fidelity `choice_reading_passage_question_interaction`;
- runtime metadata source `reading-passage-question-runtime` with canonical `selectedChoice`.

Accepted chain:
- branch started exactly from fully closed Pattern #36 `main` `461b0fd59a6c238752aa858bf783716b225b548a`;
- accepted code head `6ac29623ce53940f45cdfea623340d833af68c4d` passed full CI #733 / run `35096952272`;
- Ubuntu, Windows, production build/budgets, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution, simulations and Batch17 passed;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0;
- accepted-head distribution is 900/900 classified, 37 candidate patterns, `choice_grid` 277/900, Bahasa `choice_grid` 29/100, no global advisory hotspot above 35%.

Required remaining Pattern #37 implementation gates: complete canonical docs -> fresh exact docs-head CI -> clean scope/review/thread/mergeability gate -> exact-head squash merge -> independent `main` verification including exact Cloudflare production smoke. Then run the separate docs-only closure chain. Only after that may Pattern #37 be **FULLY CLOSED**.

## Pattern #36 — Bahasa Sentence Order Cards — FULLY CLOSED

Implementation PR #151 and closure PR #152 are complete. Final verified `main` is `461b0fd59a6c238752aa858bf783716b225b548a`; final CI #732 / run `35094107947` passed the full matrix including exact Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #37 implementation PR #153: fresh exact docs-head full CI -> clean exact-head gate -> merge -> final live `main` + Cloudflare verification.
2. Run Pattern #37 separate docs-only closure: exact implementation-merge base -> fresh closure-head CI -> clean closure gate -> merge -> final `main` + Cloudflare verification.
3. Only after Pattern #37 is fully closed, run a fresh objective/evidence audit for Pattern #38; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
