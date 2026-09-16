# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #33 — Math `equal_groups`  
**Pattern #33 implementation PR:** #145  
**Pattern #33 closure PR:** #146  
**Pattern #33 final verified main:** `0f90a7fae1164ae6ace86f993024cef7b4989ca9`  
**Pattern #33 final CI:** #700 / run `35058250562` — full success including Cloudflare production smoke  
**Active implementation:** Pattern #34 — Bahasa `initial_sound`, PR #147  
**Pattern #34 accepted code head:** `207153f8e88f7c5e64949354c12b4feb1ee583e8`  
**Pattern #34 accepted code CI:** #704 / run `35069389333` — full PR matrix success  
**Pattern #34:** **QA ACCEPTED / UNMERGED**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **33 fully merged; Pattern #34 PR #147 QA accepted** |
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

Merged distance: **17 patterns** to minimum 50 and **27 patterns** to working target 60.

## Accepted Pattern #34 candidate state

PR #147 exact-head evidence after code QA:

```text
900 / 900 classified
0 unclassified
34 active candidate patterns
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

Candidate distance after merge: **16 patterns** to minimum 50 and **26 patterns** to working target 60.

## Pattern #34 — Bahasa Initial Sound — QA ACCEPTED / UNMERGED

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

QA chain:
- CI #701 / run `35059536603`, #702 / run `35068097261`, and #703 / run `35068805216` correctly caught invalid progression fixtures rather than producing a false browser pass;
- final fixture follows actual Bahasa stage order: immediate prior stage `bahasa-cerita`, required practice `bahasa-cerita-teman`, completion-only contract;
- accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` passed full CI #704 / run `35069389333`;
- 320x720, 390x844 and 768x1024 idle/wrong/success browser QA passed keyboard, pointer, progression, false-completion, masked-answer, touch-target, feedback/CTA and evidence checks;
- all nine screenshots passed manual visual acceptance;
- quality remains **900 KEEP / 0 flagged / structural findings 0**.

Remaining implementation steps:
1. finish canonical docs on PR #147;
2. run a fresh exact docs-head full CI;
3. pass clean scope/review/thread/mergeability gate;
4. exact-head squash merge implementation PR #147;
5. independently verify `main` and post-merge CI including Cloudflare smoke;
6. create a separate docs-only Pattern #34 closure PR from the exact implementation merge SHA;
7. run exact closure-head CI, clean merge gate, exact-head closure merge, and final `main` + Cloudflare verification.

Only then may Pattern #34 be called **FULLY CLOSED**.

## Pattern #33 — Equal Groups — FULLY CLOSED

Implementation PR #145 and closure PR #146 are complete. Final verified `main` is `0f90a7fae1164ae6ace86f993024cef7b4989ca9`; CI #700 / run `35058250562` passed the full matrix including Cloudflare production smoke.

## Definition of Done

A mechanic is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish Pattern #34 implementation PR #147 through exact docs-head CI, clean exact-head merge and post-merge live/Cloudflare verification.
2. Finish separate docs-only Pattern #34 closure from the exact implementation merge SHA.
3. Only after Pattern #34 is fully closed, run a **fresh objective/evidence audit for Pattern #35**; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
