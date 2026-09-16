# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay:** Pattern #32 — Math `take_away`  
**Pattern #32 implementation PR:** #143  
**Pattern #32 closure PR:** #144  
**Final implementation docs head:** `061b004188e827ff62bd1e5c48377a087f0f9144`  
**Final implementation PR CI:** #676 / run `35048147580` — full success  
**Verified implementation merge SHA:** `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`  
**Post-merge implementation CI:** #677 / run `35048981508` — full success including Cloudflare production smoke  
**Pattern #32:** **MERGED / LIVE VERIFIED / CLOSURE PR #144 PENDING**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **32 merged patterns; Pattern #32 closure PR #144** |
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
32 active merged patterns
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

Distance remaining: **18 patterns** to minimum 50 and **28 patterns** to working target 60.

## Pattern #32 — Math Take Away — merged / closure PR #144 pending

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
- exactly the reviewed remove count is visibly marked as taken away while the original group context remains visible;
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

QA and merge chain:
- implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed full CI #671 / run `35047494614` on the first run;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- final canonical implementation docs head `061b004188e827ff62bd1e5c48377a087f0f9144` passed full CI #676 / run `35048147580`;
- PR #143 passed clean exact-head review/thread/mergeability gate and squash merged as `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`;
- `main` was independently verified at that SHA;
- post-merge `main` CI #677 / run `35048981508` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #32 becomes **FULLY CLOSED only after closure PR #144 passes fresh exact-head CI, clean review/thread/mergeability gate, exact-head merge, independent final `main` SHA verification, and final post-closure `main` CI including Cloudflare production smoke**.

## Pattern #31 — closed baseline

`make_total` is fully closed. PR #141 implementation and PR #142 closure are merged; final verified `main` is `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`; CI #670 / run `35045153104` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #32 closure PR #144: exact closure-head CI -> clean review/thread/mergeability gate -> exact-head merge -> final `main` verification -> post-closure `main` CI + Cloudflare smoke.
2. Only after Pattern #32 is fully closed, run a **fresh objective/evidence audit for Pattern #33**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
