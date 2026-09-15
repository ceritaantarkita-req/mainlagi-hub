# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest gameplay change:** PR #139 — Bahasa `syllable_assembly`  
**Verified Pattern #30 implementation merge SHA:** `c973dbc9e6010ff167a082cd6759728b590e7626`  
**Final implementation PR docs head:** `ee891dc99c1f86831ba67b34ae39e71ec50ee886`  
**Final implementation PR CI:** #647 / run `35001595648` — full success  
**Post-merge implementation CI:** #648 / run `35003757463` — full success including Cloudflare production smoke  
**Closure PR:** #140 — docs-only Syllable Assembly closure  
**Pattern #30:** **FULLY CLOSED after closure exact-head merge/live verification**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **30 merged patterns; Pattern #30 closure PR #140** |
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
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Distance remaining: **20 patterns** to minimum 50 and **30 patterns** to working target 60.

## Pattern #30 — Bahasa Syllable Assembly — closure record

Exact scope:

```text
bahasa-gabung-baju
bahasa-gabung-buku
bahasa-gabung-meja
bahasa-gabung-bola
bahasa-gabung-susu
```

All five remain assessed `tap_choice` activities in stage `bahasa-suku-kata-kata`, lesson `bahasa-suku-kata-gabung`, pack `bahasa.pack.suku-kata-gabung`, canonical skill `bahasa.suku_kata.blending`, with exactly three canonical choices and unchanged `correctChoice`.

Interaction/evidence contract:
- only the two canonical prompt/title-supported syllables are visualized;
- assembled result stays masked as `?` before a correct assessment;
- config validation requires the two syllables to concatenate exactly to canonical `correctChoice`;
- keyboard/touch/pointer direct selection remains canonical;
- wrong choice records assessed error/retry, cannot complete, and cannot reveal the result;
- correct choice completes the canonical activity identity and may reveal the assembled word;
- no invented syllable, answer leakage, changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_syllable_assembly_interaction`;
- runtime metadata source `syllable-assembly-runtime`;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression unchanged.

Scope boundaries remain explicit: Bahasa recognition, picture-word, initial-sound, listening and matching remain outside Pattern #30; English phonics, Math and Logic families remain unchanged.

Acceptance/closure chain:
- CI #640 / run `34999759651` caught missing permanent central gameplay-presentation registration and forced a strict fix;
- CI #641 / run `35000289970` caught missing learning-test compile-manifest coverage and forced a strict fix;
- implementation head `d55c1deb54f1402c38d84417ca7ae8248c9d3b07` passed full CI #642 / run `35000557604`;
- all nine 320/390/768 idle/wrong/success screenshots passed manual visual acceptance;
- final canonical implementation docs head `ee891dc99c1f86831ba67b34ae39e71ec50ee886` passed full CI #647 / run `35001595648`;
- PR #139 exact-head squash merged as `c973dbc9e6010ff167a082cd6759728b590e7626` and `main` was independently verified at the exact SHA;
- post-merge `main` CI #648 / run `35003757463` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- post-merge closure is PR #140; its exact-head CI/gate/merge/live verification is the final Pattern #30 closure step.

Permanent evidence remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Pattern #29 — closed baseline

`relative_order_track` remains fully closed. PR #137 implementation and PR #138 closure remain merged and live-verified.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #30 closure PR #140 exact-head CI/gate/merge/live verification.
2. Run a **fresh objective/evidence audit for Pattern #31** from the verified 30-pattern baseline; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
