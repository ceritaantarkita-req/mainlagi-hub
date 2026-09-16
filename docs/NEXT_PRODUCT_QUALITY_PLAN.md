# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #34 — Bahasa `initial_sound`  
**Pattern #34 final main:** `8bfb0027a5f4963a6875310c7408cb56018cc422`  
**Pattern #34 final CI:** #717 / run `35074306579` — full success including Cloudflare production smoke  
**Active implementation:** Pattern #35 — Bahasa `picture_word_match`  
**Pattern #35 implementation PR:** #149  
**Accepted pre-docs code head:** `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca`  
**Accepted code-head CI:** #718 / run `35082720001` — full PR success  
**Pattern #35:** **QA ACCEPTED / UNMERGED**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **34 fully closed; Pattern #35 PR #149 QA accepted** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Verified merged baseline

Pattern #34 final `main`:

```text
900 / 900 classified
0 unclassified
34 active merged patterns
choice_grid                 292 / 900 = 32.44%
initial_sound                 3 / 900 = 0.33%
Bahasa choice_grid           44 / 100
```

Pattern #35 accepted PR candidate from CI #718:

```text
900 / 900 classified
0 unclassified
35 active candidate patterns
choice_grid                 287 / 900 = 31.89%
picture_word_match            5 / 900 = 0.56%
initial_sound                 3 / 900 = 0.33%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Bahasa choice_grid           39 / 100
Math choice_grid             43 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

If merged, distance remaining becomes **15 patterns** to minimum 50 and **25 patterns** to working target 60.

## Pattern #35 — Bahasa Picture Word Match — QA ACCEPTED / UNMERGED

Exact scope:

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

Canonical boundaries:
- subject `bahasa`;
- stage `bahasa-suku-kata-kata`;
- lesson `bahasa-kata-gambar`;
- pack `bahasa.pack.kata-gambar`;
- skill `bahasa.kata.picture_matching`;
- assessed runtime remains `tap_choice`;
- exactly three canonical lowercase word choices and unchanged `correctChoice`;
- `bahasa-pasang-kata-*` remains `visible_matching` and excluded;
- Syllable Assembly, audio word recognition, Initial Sound, English, Math and all other subjects/families are excluded;
- content, activity IDs, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- render the existing familiar object as the primary visual clue;
- keep the selected-word result masked as `?` before correct assessment;
- preserve canonical keyboard/touch/pointer direct-selection evidence;
- wrong choice records assessed incorrect/retry and cannot complete or reveal the answer;
- correct choice completes the canonical activity and reveals the canonical word;
- no changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_picture_word_match_interaction`;
- runtime metadata source `picture-word-match-runtime` with `picture`, `word`, `selectedChoice`.

QA chain so far:
- branch starts exactly from Pattern #34 final main `8bfb0027a5f4963a6875310c7408cb56018cc422`;
- accepted code head `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca` passed full CI #718 / run `35082720001`;
- Ubuntu passed typecheck, lint, engine/learning regressions including exact Pattern #35 scope test, deterministic quality, distribution, simulations and Batch17;
- Windows, production build, dependency audit and secret-history scan passed;
- Chromium canonical mobile/accessibility matrix and dedicated Picture Word Match browser QA passed;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0;
- distribution remains 900/900 classified, 35 candidate patterns, no global advisory hotspot above 35%.

Pattern #35 remains unmerged. Required next gates: fresh canonical docs-head CI -> clean review/thread/mergeability/scope gate -> exact-head squash merge -> independent `main` verification -> post-merge full CI + Cloudflare smoke -> separate docs-only closure branch/PR -> closure exact-head CI/gate/merge -> final `main` + Cloudflare verification.

## Pattern #34 — Initial Sound — FULLY CLOSED

Implementation PR #147 and closure PR #148 are complete. Closure CI #716 / run `35073594364` passed. Final verified `main` is `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717 / run `35074306579` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #35 PR #149: canonical docs -> fresh exact docs-head CI -> clean exact-head merge gate -> merge -> live `main` + Cloudflare verification.
2. Complete separate docs-only Pattern #35 closure and final `main` verification.
3. Only after Pattern #35 is fully closed, run a fresh objective/evidence audit for Pattern #36; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
