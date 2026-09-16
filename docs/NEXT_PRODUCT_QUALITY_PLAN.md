# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #32 — Math `take_away`  
**Latest merged gameplay:** Pattern #33 — Math `equal_groups`  
**Pattern #33 implementation PR:** #145  
**Final implementation docs head:** `11f278a0150ff31b1ba89394c23b78fa244038aa`  
**Final implementation PR CI:** #692 / run `35053984870` — full success  
**Verified implementation merge SHA:** `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`  
**Post-merge implementation CI:** #693 / run `35054346467` — full success including Cloudflare production smoke  
**Pattern #33 closure PR:** PENDING  
**Pattern #33:** **MERGED / LIVE VERIFIED / CLOSURE PENDING**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **33 merged patterns; Pattern #33 closure pending** |
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
33 active merged patterns
choice_grid                 295 / 900 = 32.78%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             43 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Distance remaining: **17 patterns** to minimum 50 and **27 patterns** to working target 60.

## Pattern #33 — Math Equal Groups — merged / closure pending

Exact scope:

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

Canonical boundaries:
- subject `math`;
- stage `math-operasi-awal`;
- lesson `math-grouping`;
- pack `math.pack.grouping`;
- skill `math.grouping.equal_groups`;
- assessed runtime remains `tap_choice`;
- exactly three canonical numeric choices and unchanged `correctChoice`;
- the two grouping matching activities remain `visible_matching` and are excluded;
- missing-number, addition, subtraction, length/size, existing Math specialized families and all non-Math families are excluded;
- content, activity IDs, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- render the reviewed total as visibly separated equal-size groups;
- require exact divisibility and `totalCount / groupSize === Number(correctChoice)` within total <=10;
- keep the group-count result masked as `?` before a correct assessment;
- preserve canonical keyboard/touch/pointer direct-selection evidence;
- wrong choice records assessed incorrect/retry and cannot complete or reveal the answer;
- correct choice completes the canonical activity and reveals the group count;
- no changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_equal_groups_interaction`;
- runtime metadata source `equal-groups-runtime` with `totalCount`, `groupSize`, `groupCount`, `selectedChoice`.

QA and merge chain:
- CI #685 / run `35052200287` correctly caught 320x720 success CTA clipping;
- CI #686 / run `35052577160` correctly caught 390x844 idle-feedback clipping after the first fix;
- accepted code head `26c2b2355099c4097c015ba5767703035b33aa63` passed full CI #687 / run `35053008065`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- final canonical implementation docs head `11f278a0150ff31b1ba89394c23b78fa244038aa` passed full CI #692 / run `35053984870`;
- PR #145 passed clean exact-head review/thread/mergeability/scope gate and squash merged as `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #693 / run `35054346467` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #33 becomes **FULLY CLOSED only after the docs-only closure PR passes fresh exact-head CI, clean review/thread/mergeability gate, exact-head merge, independent final `main` verification, and final post-closure `main` CI including Cloudflare production smoke**.

## Pattern #32 — Take Away — FULLY CLOSED

Implementation PR #143 and closure PR #144 are complete. Final Pattern #32 verified `main` was `63285c6dd39b0cc1a521b042a492a83338bb2582`; CI #684 / run `35049954680` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #33 docs-only closure: bind closure PR -> fresh exact closure-head CI -> clean exact-head merge gate -> exact-head merge -> final `main` verification -> post-closure `main` CI + Cloudflare smoke.
2. Only after Pattern #33 is fully closed, run a **fresh objective/evidence audit for Pattern #34**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
