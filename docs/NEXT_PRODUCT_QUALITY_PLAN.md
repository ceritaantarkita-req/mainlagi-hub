# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #31 — Math `make_total`  
**Pattern #31 implementation / closure:** PR #141 + #142  
**Final verified Pattern #31 `main`:** `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`  
**Pattern #31 final live CI:** #670 / run `35045153104` — full success including Cloudflare production smoke  
**Current accepted unmerged gameplay:** PR #143 — Math `take_away`  
**Accepted Pattern #32 implementation code head:** `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7`  
**Accepted Pattern #32 CI:** #671 / run `35047494614`  
**Pattern #32:** **QA ACCEPTED / UNMERGED**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **31 merged patterns; Pattern #32 PR #143 QA accepted / unmerged** |
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
Math choice_grid             51 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Merged-baseline distance remaining: **19 patterns** to minimum 50 and **29 patterns** to working target 60.

## Pattern #32 — Math Take Away — QA accepted / unmerged

Exact scope:

```text
math-sub-3-1
math-sub-4-2
math-sub-5-1
math-sub-6-2
math-sub-7-3
```

All five remain assessed `tap_choice` activities in stage `math-operasi-awal`, lesson `math-subtraction`, pack `math.pack.subtraction`, canonical skill `math.operation.subtraction.within_10`, with exactly three canonical numeric choices and unchanged `correctChoice`.

Interaction/evidence contract:
- one reviewed starting group is rendered with the exact reviewed start count;
- exactly the reviewed remove count is visually marked as taken away while the original group context remains visible;
- numeric remainder stays masked as `?` before a correct assessment;
- config validation requires a positive proper removed subset, start count <=10 and `startCount - removeCount === Number(correctChoice)`;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the numeric remainder;
- correct choice completes the canonical activity identity and may reveal the remainder;
- no changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_take_away_interaction`;
- runtime metadata source `take-away-runtime` with `startCount`, `removeCount` and selected canonical choice;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Scope boundaries remain explicit: Math addition stays `make_total`; equal-group grouping, missing-number, length/size and existing Math specialized mechanics remain outside Pattern #32; all non-Math families remain unchanged.

QA chain:
- accepted implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed full CI #671 / run `35047494614` on the first run;
- CI #671 passed Ubuntu, Windows, production build, dependency audit, secret-history scan, central + dedicated learning regressions, deterministic quality/distribution audits, simulations, Batch17 and Chromium mobile/accessibility/browser QA;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- wrong state keeps the numeric remainder masked and success reveals only the canonical remainder;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Accepted PR-head distribution:

```text
900 / 900 classified
0 unclassified
32 active PR-head patterns
choice_grid                 298 / 900 = 33.11%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             46 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

If merged unchanged, distance becomes **18 patterns** to minimum 50 and **28 patterns** to working target 60.

Pattern #32 is not fully closed until final canonical docs receive fresh exact-head CI, PR #143 exact-head merge/live verification succeeds, and its separate docs-only closure also passes exact-head CI/merge/live verification.

## Pattern #31 — closed baseline

`make_total` is fully closed. PR #141 implementation and PR #142 closure are merged; final verified `main` is `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`; CI #670 / run `35045153104` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #32 PR #143: fresh exact docs-head CI -> clean merge/review gate -> exact-head merge -> post-merge `main` CI + Cloudflare smoke -> separate docs-only closure -> closure live verification.
2. After Pattern #32 is fully closed, run a **fresh objective/evidence audit for Pattern #33**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
