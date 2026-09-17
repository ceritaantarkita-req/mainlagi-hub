# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #39 — Math `visual_word_problem`  
**Pattern #39 final closure main:** `98725727c866d410b2d0caa206e86e70cd0e5741`  
**Pattern #39 final CI:** **#811 / run `35190499794` — success**  
**Pattern #40 audit:** **MERGED PR #173 -> main `f1b4b13d3d9814d2ed06500022218848cd721419`**  
**Pattern #40 implementation:** **DRAFT PR #175 — `spatial_relation_board` exact six-activity scope**  
**Pattern #40 foundation verification:** head `1889e1b5ea954be3cab6978e1f82a680b8281ca8`, **CI #821 / run `35213178491` — full success**  
**Merged-main P1:** **0**  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. WS-05 tetap diarahkan ke minimum **50**, working target **60 meaningful gameplay patterns**, tetapi mechanic baru hanya boleh dipilih karena learning objective dan evidence contract-nya membutuhkan interaction tersebut.

Garden activity direction tetap child-facing anchor. Permanent visual QA tetap blocking di setiap wave berikutnya.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan demi mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact-scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA dan manual visual review.
5. Jangan membuat drag-only interaction tanpa fallback accessible bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Deployment smoke tidak sama dengan whole-product visual acceptance.
9. Public, child, parent/account/auth dan system states harus mengikuti Art Bible setelah dimigrasikan.
10. Screenshot QA invalid jika route diam-diam redirect dari expected pathname.
11. Pattern berikutnya wajib dimulai dari fresh objective/evidence audit. Tidak ada family mechanic yang otomatis pre-approved oleh pattern sebelumnya.
12. Failing visual gate harus didiagnosis; exception hanya boleh dipersempit jika intentional dan terverifikasi eksplisit.
13. Responsive acceptance bersifat evidence-based: lolos `no overflow` tidak membenarkan komposisi yang cramped, terpotong, atau menyisakan canvas kosong secara tidak sengaja.
14. Stage/readiness visual emphasis tidak boleh mengubah gate, prerequisite, recommendation source, lesson/activity ordering semantic, atau completion requirement.
15. Public/auth/account convergence tidak boleh mengubah auth security/session semantics hanya untuk menyederhanakan UI.
16. Known-child fast resume tidak boleh dihapus hanya agar public root selalu tampil.
17. Residual token cleanup tidak boleh menjadi alasan mass rewrite global CSS; hanya migrate surface yang benar-benar user-facing dan terverifikasi drift.
18. Admin/diagnostic styling boleh tetap utilitarian bila tidak bocor ke public/child/parent flows.
19. Green automated checks tidak menggantikan screenshot review.
20. P1=0 tidak menghapus P2 atau external-evidence backlog. Status harus tetap dipisahkan.
21. Parallel implementation PR untuk scope yang sama harus ditutup/ditolak setelah canonical candidate terbukti.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | **IN PROGRESS** | Pattern #40 implementation state synchronized in PR #175 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged on merged baseline |
| WS-05 Gameplay diversification | **39 FULLY CLOSED / PATTERN #40 IMPLEMENTATION IN PROGRESS** | foundation runtime green; distribution/regression/browser gates next |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 21 routes / 63 captures live on main |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

## Verified gameplay baseline

Merged-main gameplay distribution remains:

```text
900 / 900 classified
0 unclassified
39 active merged patterns
choice_grid                     267 / 900
visual_word_problem               5 / 900
cloze_sentence_choice             5 / 900
reading_passage_question          5 / 900
sentence_order_cards              5 / 900
picture_word_match                5 / 900
```

Distance remaining: **11 patterns** to minimum 50 and **21** to working target 60. Pattern #40 is not included until implementation is merged and independently verified.

No global pattern exceeds the existing >35% advisory hotspot threshold.

## Pattern #39 — fully closed

Canonical chain:

```text
Audit PR:              #169
Implementation PR:     #170
Implementation main:   bcb8479514f44d46ebc68917981699240aabc3b2
Implementation CI:     #809 / run 35187506724 — full success
Closure PR:            #171
Final closure main:    98725727c866d410b2d0caa206e86e70cd0e5741
Final closure CI:      #811 / run 35190499794 — success
```

Exact implementation scope remains the five `math-problem-*` activities with unchanged canonical content, assessed `tap_choice`, `choice_accuracy_v1`, mastery/progression and schema boundaries.

## Permanent visual/product gate — LIVE

The blocking production gate remains **21 canonical routes × 3 viewports = 63 exact-path screenshots** at 390x844, 768x1024 and 1280x800.

Merged-production state remains:

```text
P0 findings: 0
P1 findings: 0
P2 findings: 3
```

Open P2 remains:

- VBASE-P2-01 game detail/preflight legacy vocabulary;
- VBASE-P2-02 iconography mixes canonical symbols and raw emoji;
- VBASE-P2-03 inline visual styles increase drift risk.

## Pattern #40 implementation — current gate

Audit PR #173 is merged. Draft implementation PR #175 is the canonical implementation path for:

```text
spatial_relation_board
```

Exact scope:

```text
logic-spatial-star-left-circle
logic-spatial-circle-right-triangle
logic-spatial-circle-between-stars
logic-spatial-turn-right-from-up
logic-spatial-turn-left-from-right
logic-spatial-opposite-left
```

Canonical ownership:

```text
subject:     logic
stage:       logic-patterns-sequences-relations
lesson:      logic-spatial-relations
pack:        logic.pack.spatial-relations
skill:       logic.spatial.relation.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Implemented foundation:

- exact-scoped deterministic config for left/right, between, right-turn, left-turn and opposite-direction semantics;
- dedicated child-facing `SpatialRelationBoardActivity`;
- canonical prompt remains the primary narration/task text;
- canonical choices/order and `correctChoice` remain unchanged;
- direct answer buttons preserve keyboard/touch/pointer access;
- wrong answers are measured/retryable and cannot complete;
- correct answer completes through the existing measured path;
- runtime metadata source `spatial-relation-board-runtime` and evidence fidelity `choice_spatial_relation_board_interaction`;
- no drag-only dependency, extra assessed checkpoint, mastery migration, progression migration, schema change or database migration;
- verified foundation head `1889e1b5ea954be3cab6978e1f82a680b8281ca8` passed full CI #821 / run `35213178491`.

This green foundation is not sufficient for merge. Pattern #40 remains uncounted in merged distribution until all blocking work below is complete.

## Pattern #40 remaining implementation gates

1. register `spatial_relation_board` in the canonical gameplay pattern taxonomy and permanent distribution audit;
2. exact classifier must select only the six audited IDs and fail closed outside the canonical Logic lesson/pack/skill/runtime shape;
3. deterministic config must keep all canonical prompts, choices/order and `correctChoice` unchanged;
4. runtime remains assessed `tap_choice` with `choice_accuracy_v1` semantics;
5. wrong answers remain measured/retryable and cannot complete;
6. correct answer completes through the existing measured activity path;
7. keyboard, touch and pointer all remain primary controls;
8. browser QA must prove idle/wrong/success states at 320x720, 390x844 and 768x1024;
9. no horizontal overflow or hidden answer controls may occur;
10. permanent visual QA must remain green;
11. activity-quality must stay deterministic clean;
12. gameplay distribution must remain 900/900 classified and become exactly 40 active patterns on the implementation branch;
13. a fresh exact-head full CI must pass after final code/tests/docs;
14. PR #175 must have clean mergeability/review/thread gates before ready-for-review and merge;
15. exact implementation head must be squash-merged, then independently verified on merged `main` including exact production smoke;
16. a separate post-merge closure docs gate is required before Pattern #40 is called **FULLY CLOSED**.

## Current execution order

1. Finish canonical Pattern #40 taxonomy/distribution registration in PR #175.
2. Add exact-scope, canonical-content, evidence/retry/completion regression coverage.
3. Add browser keyboard/touch/responsive idle/wrong/success QA and verify permanent visual QA remains green.
4. Prove implementation-branch distribution is 900/900 classified with exactly 40 active patterns.
5. Run fresh exact-head full CI and clean PR review/thread/mergeability gates.
6. Mark PR #175 ready only when all implementation gates are green, then squash-merge the exact head.
7. Independently verify merged `main` and production smoke before claiming Pattern #40 implemented.
8. Run the separate Pattern #40 closure documentation gate before **FULLY CLOSED** status.
9. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
10. Continue WS-02 narration, WS-10 external physical-device/accessibility/Iqro evidence and WS-11 governance.
11. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
12. Perform later WS-12 cleanup and final end-to-end production acceptance.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
