# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay:** Pattern #31 — Math `make_total`  
**Pattern #31 implementation PR:** #141  
**Pattern #31 closure PR:** #142  
**Final implementation docs head:** `7230d87fb5c53d6e164465aa3353531228b8f4c6`  
**Final implementation PR CI:** #662 / run `35043111245` — full success  
**Verified implementation merge SHA:** `de358c3e6610c3ae9b8669ce3df3b0f2a95e3136`  
**Post-merge implementation CI:** #663 / run `35044172180` — full success including Cloudflare production smoke  
**Pattern #31:** **MERGED / CLOSURE PR #142 PENDING**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **31 merged patterns; Pattern #31 closure PR #142** |
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
31 active merged patterns
choice_grid                 303 / 900 = 33.67%
make_total                    5 / 900 = 0.56%
syllable_assembly             5 / 900 = 0.56%
Math choice_grid             51 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Distance remaining: **19 patterns** to minimum 50 and **29 patterns** to working target 60.

## Pattern #31 — Math Make Total — merged / closure pending

Exact scope:

```text
math-add-1-1
math-add-2-1
math-add-2-2
math-add-3-2
math-add-4-3
```

All five remain assessed `tap_choice` activities in stage `math-operasi-awal`, lesson `math-addition`, pack `math.pack.addition`, canonical skill `math.operation.addition.within_10`, with exactly three canonical numeric choices and unchanged `correctChoice`.

Interaction/evidence contract:
- two reviewed positive addend groups are shown as a visual composition;
- total stays masked as `?` before a correct assessment;
- config validation requires the addends to sum exactly to canonical `correctChoice` and remain <=10;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the total;
- correct choice completes the canonical activity identity and may reveal the total;
- no changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_make_total_interaction`;
- runtime metadata source `make-total-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Scope boundaries remain explicit: subtraction, equal-group grouping, missing-number, length/size and existing Math specialized mechanics remain outside Pattern #31; all non-Math families remain unchanged.

Acceptance and merge chain:
- CI #656 / run `35042089820` correctly caught a 320x720 viewport defect because idle feedback extended below the visible viewport;
- the fix compacted only the narrow/short UI, retained >=48px touch targets, and kept the strict visibility assertion;
- implementation QA head `4b513676c9029fbb7a788a49175ed02954f0d2f7` passed full CI #657 / run `35042439233`;
- all nine 320/390/768 idle/wrong/success screenshots passed manual visual acceptance;
- final canonical implementation docs head `7230d87fb5c53d6e164465aa3353531228b8f4c6` passed full CI #662 / run `35043111245`;
- PR #141 passed the clean exact-head merge gate and squash merged as `de358c3e6610c3ae9b8669ce3df3b0f2a95e3136`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #663 / run `35044172180` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #31 becomes **FULLY CLOSED only after closure PR #142 passes fresh exact-head CI, clean review/thread/mergeability gate, exact-head merge, independent final `main` SHA verification, and final post-closure `main` CI including Cloudflare production smoke**.

## Pattern #30 — closed baseline

`syllable_assembly` remains fully closed through PR #139 implementation + PR #140 closure.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #31 closure PR #142: exact final closure-head CI -> clean review/thread/mergeability gate -> exact-head merge -> independent `main` verification -> post-closure `main` CI + Cloudflare production smoke.
2. Only after Pattern #31 is fully closed, run a **fresh objective/evidence audit for Pattern #32**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
