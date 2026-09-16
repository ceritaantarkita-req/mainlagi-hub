# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #34 — Bahasa `initial_sound`  
**Pattern #34 final main:** `8bfb0027a5f4963a6875310c7408cb56018cc422`  
**Pattern #34 final CI:** #717 / run `35074306579` — full success including Cloudflare production smoke  
**Latest merged implementation:** Pattern #35 — Bahasa `picture_word_match`  
**Pattern #35 implementation PR:** #149  
**Pattern #35 final docs head:** `79767b320372ac6dd78bfae90ffb2e2307154401`  
**Pattern #35 docs-head CI:** #723 / run `35083623316` — full PR success  
**Pattern #35 implementation merge:** `47e3373ed9ba4a96331a8e61286dc80d37b6b518`  
**Pattern #35 post-merge CI:** #724 / run `35085618422` — full success including Cloudflare production smoke  
**Pattern #35:** **IMPLEMENTATION MERGED / LIVE VERIFIED; DOCS-ONLY CLOSURE IN PROGRESS**  
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
| WS-01 Canonical docs | DONE / maintained | Pattern #35 closure update in progress |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **34 fully closed; Pattern #35 implementation merged/live verified; closure in progress** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Verified merged baseline

Pattern #35 merged/live state:

```text
900 / 900 classified
0 unclassified
35 active merged patterns
choice_grid                 287 / 900 = 31.89%
picture_word_match            5 / 900 = 0.56%
initial_sound                  3 / 900 = 0.33%
equal_groups                   3 / 900 = 0.33%
make_total                     5 / 900 = 0.56%
take_away                      5 / 900 = 0.56%
Bahasa choice_grid            39 / 100
Math choice_grid              43 / 100
Science choice_grid           56 / 100
Logic choice_grid             47 / 100
English choice_grid           44 / 100
Iqro choice_grid              58 / 100
```

Distance remaining is **15 patterns** to minimum 50 and **25 patterns** to working target 60.

## Pattern #35 — Bahasa Picture Word Match — IMPLEMENTATION MERGED / LIVE VERIFIED

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

Verified chain:
- branch started exactly from Pattern #34 final main `8bfb0027a5f4963a6875310c7408cb56018cc422`;
- accepted code head `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca` passed full CI #718 / run `35082720001`;
- final canonical implementation docs head `79767b320372ac6dd78bfae90ffb2e2307154401` passed full CI #723 / run `35083623316`;
- Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution, simulations and Batch17 passed;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- PR #149 passed exact-head clean scope/review/thread/mergeability gate and squash merged as `47e3373ed9ba4a96331a8e61286dc80d37b6b518`;
- independent post-merge CI #724 / run `35085618422` passed the complete matrix including exact **Production smoke (Cloudflare)**;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0;
- distribution is 900/900 classified, 35 active merged patterns, no global advisory hotspot above 35%.

Required remaining Pattern #35 gate: separate docs-only closure -> fresh exact closure-head CI -> clean closure scope/review/thread/mergeability gate -> exact-head squash merge -> final independent `main` verification + Cloudflare smoke. Only then mark Pattern #35 **FULLY CLOSED**.

## Pattern #34 — Initial Sound — FULLY CLOSED

Implementation PR #147 and closure PR #148 are complete. Closure CI #716 / run `35073594364` passed. Final verified `main` is `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717 / run `35074306579` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish the docs-only Pattern #35 closure: fresh exact closure-head CI -> clean exact-head gate -> merge -> final live `main` + Cloudflare verification.
2. Only after Pattern #35 is fully closed, run a fresh objective/evidence audit for Pattern #36; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
