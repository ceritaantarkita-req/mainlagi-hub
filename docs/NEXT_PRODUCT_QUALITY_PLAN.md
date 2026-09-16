# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #30 — Bahasa `syllable_assembly`  
**Pattern #30 implementation / closure:** PR #139 + #140  
**Final verified Pattern #30 `main`:** `53667560d72ca4cfe3556bc59411a71c53a84834`  
**Pattern #30 final live CI:** #655 / run `35005253923` — full success including Cloudflare production smoke  
**Current accepted unmerged gameplay:** PR #141 — Math `make_total`  
**Accepted Pattern #31 implementation head:** `4b513676c9029fbb7a788a49175ed02954f0d2f7`  
**Accepted Pattern #31 CI:** #657 / run `35042439233`  
**Pattern #31:** **QA ACCEPTED / UNMERGED**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **30 merged patterns; Pattern #31 PR #141 QA accepted / unmerged** |
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
30 active merged patterns
choice_grid                 308 / 900 = 34.22%
syllable_assembly             5 / 900 = 0.56%
Bahasa choice_grid           47 / 100
Math choice_grid             56 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Merged-baseline distance remaining: **20 patterns** to minimum 50 and **30 patterns** to working target 60.

## Pattern #31 — Math Make Total — QA accepted / unmerged

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

QA chain:
- initial CI #656 / run `35042089820` correctly caught a 320x720 viewport defect because idle feedback extended below the visible viewport;
- the fix compacted only the narrow/short UI, retained >=48px touch targets, and kept the strict visibility assertion;
- accepted implementation head `4b513676c9029fbb7a788a49175ed02954f0d2f7` passed full CI #657 / run `35042439233`;
- CI #657 passed Ubuntu, Windows, production build, dependency audit, secret-history scan, central + dedicated learning regressions, deterministic quality/distribution audits, simulations, Batch17 and Chromium mobile/accessibility/browser QA;
- all nine 320/390/768 idle/wrong/success screenshots passed manual visual acceptance;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Accepted PR-head distribution:

```text
900 / 900 classified
0 unclassified
31 active PR-head patterns
choice_grid                 303 / 900 = 33.67%
make_total                    5 / 900 = 0.56%
Math choice_grid             51 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

If merged unchanged, distance becomes **19 patterns** to minimum 50 and **29 patterns** to working target 60.

Pattern #31 is not fully closed until final canonical docs receive fresh exact-head CI, PR #141 exact-head merge/live verification succeeds, and its separate docs-only closure also passes exact-head CI/merge/live verification.

## Pattern #30 — closed baseline

`syllable_assembly` is fully closed. PR #139 implementation and PR #140 closure are merged; final verified `main` is `53667560d72ca4cfe3556bc59411a71c53a84834`; CI #655 / run `35005253923` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #31 PR #141: fresh exact docs-head CI -> clean merge/review gate -> exact-head merge -> post-merge `main` CI + Cloudflare smoke -> separate docs-only closure -> closure live verification.
2. After Pattern #31 is fully closed, run a **fresh objective/evidence audit for Pattern #32**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
