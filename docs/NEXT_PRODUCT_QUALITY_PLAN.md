# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #33 — Math `equal_groups`  
**Latest merged gameplay:** Pattern #34 — Bahasa `initial_sound`  
**Pattern #34 implementation PR:** #147  
**Final implementation docs head:** `e12d9eef073a9989bb8e9b6f8d374e098e17edde`  
**Final implementation PR CI:** #709 / run `35072401631` — full success  
**Verified implementation merge SHA:** `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`  
**Post-merge implementation CI:** #710 / run `35072815182` — full success including Cloudflare production smoke  
**Pattern #34 closure PR:** #148  
**Pattern #34:** **MERGED / LIVE VERIFIED / CLOSURE PR #148 OPEN**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **34 merged patterns; closure PR #148 open** |
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
34 active merged patterns
choice_grid                 292 / 900 = 32.44%
initial_sound                 3 / 900 = 0.33%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Bahasa choice_grid           44 / 100
Math choice_grid             43 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Distance remaining: **16 patterns** to minimum 50 and **26 patterns** to working target 60.

## Pattern #34 — Bahasa Initial Sound — merged / closure PR #148 open

Exact scope:

```text
bahasa-awal-bola
bahasa-awal-kucing
bahasa-awal-pisang
```

Canonical boundaries:
- subject `bahasa`;
- stage `bahasa-dasar-huruf`;
- lesson `bahasa-bunyi-awal`;
- pack `bahasa.pack.bunyi-awal`;
- skill `bahasa.bunyi.awal.recognition`;
- assessed runtime remains `tap_choice`;
- exactly three canonical uppercase single-letter choices and unchanged `correctChoice`;
- `bahasa-match-awal-tas-susu` remains `visible_matching` and excluded;
- vowel recognition/classification, Syllable Assembly, English inverse initial-sound tasks, letter ordering, Math and all other subjects are excluded;
- content, activity IDs, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- render the existing familiar visual clue and canonical word with its first letter masked;
- keep the initial-letter result masked as `?` before correct assessment;
- ask the child to say/read the visible familiar word before choosing the initial letter;
- preserve canonical keyboard/touch/pointer direct-selection evidence;
- wrong choice records assessed incorrect/retry and cannot complete or reveal the answer;
- correct choice completes the canonical activity and reveals the initial letter;
- no changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_initial_sound_interaction`;
- runtime metadata source `initial-sound-runtime` with `word`, `initialSound`, `selectedChoice`.

QA and merge chain:
- CI #701 / run `35059536603`, #702 / run `35068097261`, and #703 / run `35068805216` correctly caught invalid progression fixtures instead of allowing a false browser pass;
- final fixture follows the actual Bahasa stage order: immediate prior stage `bahasa-cerita`, required practice `bahasa-cerita-teman`, completion-only contract;
- accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` passed full CI #704 / run `35069389333`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance;
- final canonical implementation docs head `e12d9eef073a9989bb8e9b6f8d374e098e17edde` passed full CI #709 / run `35072401631`;
- PR #147 passed clean exact-head review/thread/mergeability/scope gate and squash merged as `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #710 / run `35072815182` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium mobile/accessibility/browser QA, deterministic quality/distribution audits, simulations, Batch17 and Cloudflare production smoke;
- closure PR #148 is docs-only and restricted to exactly the five canonical Pattern #34 docs;
- deterministic quality remains 900 KEEP / 0 flagged / structural findings 0.

Pattern #34 becomes **FULLY CLOSED only after closure PR #148 passes fresh exact-head CI, clean review/thread/mergeability/scope gate, exact-head merge, independent final `main` verification, and final post-closure `main` CI including Cloudflare production smoke**.

## Pattern #33 — Equal Groups — FULLY CLOSED

Implementation PR #145 and closure PR #146 are complete. Final verified `main` is `0f90a7fae1164ae6ace86f993024cef7b4989ca9`; CI #700 / run `35058250562` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #34 closure PR #148 through exact closure-head CI, clean exact-head merge and final `main` + Cloudflare verification.
2. Only after Pattern #34 is fully closed, run a **fresh objective/evidence audit for Pattern #35**; no family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
