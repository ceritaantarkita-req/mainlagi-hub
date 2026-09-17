# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #39 — Math `visual_word_problem`  
**Pattern #39 final closure main:** `98725727c866d410b2d0caa206e86e70cd0e5741`  
**Pattern #39 final CI:** **#811 / run `35190499794` — success**  
**Pattern #40 audit:** **MERGED PR #173 -> main `f1b4b13d3d9814d2ed06500022218848cd721419`**  
**Pattern #40 implementation:** **DRAFT PR #175 — `spatial_relation_board`, exact six-activity scope**  
**Pattern #40 foundation:** head `1889e1b5ea954be3cab6978e1f82a680b8281ca8`, **CI #821 / run `35213178491` — full success**  
**Pattern #40 current gate:** final exact-head implementation CI after classifier/distribution/regression/browser/mobile/docs convergence  
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
22. New spatial/directional presentation must not reveal the assessed result before successful completion when the canonical task asks the learner to infer that result.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | **CURRENT ON PR #175** | README/current state/catalog/plan + Pattern #40 implementation wave synchronized |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged on merged baseline |
| WS-05 Gameplay diversification | **39 FULLY CLOSED / PATTERN #40 FINAL IMPLEMENTATION GATE** | code/tests/docs converged; exact-head CI next |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | **PERMANENT / BLOCKING** | 21 routes / 63 captures live on main; must stay green on #175 |
| WS-09 Stage/gallery UX | DONE | VUI-02 closed |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after gameplay/product priorities |

## Verified merged gameplay baseline

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

Pattern #40 implementation branch is expected to move exactly six activities from `choice_grid` to `spatial_relation_board`, so the intended branch result is:

```text
900 / 900 classified
0 unclassified
40 active patterns
choice_grid                     261 / 900
spatial_relation_board            6 / 900
```

Those branch numbers are acceptance targets, not verified merged-main claims, until the exact-head distribution audit and later merged-main verification pass.

Merged-main distance remains **11 patterns** to minimum 50 and **21** to working target 60 until Pattern #40 is actually merged.

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

## Pattern #40 implementation — final pre-merge gate

Audit PR #173 is merged. Draft implementation PR #175 is the only canonical implementation path for:

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

Implemented on PR #175:

- exact six-ID deterministic config with canonical prompt/choice-order/answer snapshots;
- fail-closed behavior on scope/content/runtime drift;
- dedicated child-facing spatial board for object relation, turn and opposite-direction tasks;
- turn/opposite answer masking until successful completion;
- direct answer buttons preserve keyboard/touch/pointer access;
- wrong answers remain measured/retryable and cannot complete;
- correct answer completes through the existing measured path;
- runtime metadata: `spatial-relation-board-runtime`, `choice_spatial_relation_interaction`, `mode`, `relationOrTurn`, `selectedChoice`;
- `canonicalGameplayPattern` registers Pattern #40 while preserving existing pattern logic;
- gameplay-distribution expected set includes `spatial_relation_board`;
- exact-scope regression tests six IDs, canonical snapshots, skill evidence, all relation branches and malformed/non-scope failures;
- browser QA is wired into the permanent mobile route matrix at 320x720, 390x844 and 768x1024;
- browser QA verifies masked result, keyboard wrong-state, pointer success, touch targets, overflow, attempt metadata and accuracy/retry semantics;
- mobile CSS is compacted for 320x720 so feedback/CTA do not get pushed out by three short symbolic answers;
- no drag-only dependency, extra assessed checkpoint, mastery migration, progression migration, schema change or database migration.

Supporting foundation head `1889e1b5ea954be3cab6978e1f82a680b8281ca8` passed CI #821, but final acceptance must use a newer exact head containing all changes above.

## Pattern #40 exact-head acceptance checklist

A single final implementation head must prove:

1. typecheck and lint pass on Ubuntu and Windows;
2. Pattern #40 exact-scope regression passes;
3. activity-quality remains deterministic clean;
4. gameplay distribution is 900/900 classified, 0 unclassified, exactly 40 active patterns, with six `spatial_relation_board` activities;
5. simulations and Batch 17 acceptance contracts pass;
6. production Cloudflare/OpenNext build and build budgets pass;
7. mobile Chromium matrix passes including Pattern #40 browser QA at all three viewports;
8. permanent visual baseline remains green with no new P0/P1 finding;
9. security, secret-history and production dependency jobs pass;
10. PR #175 is mergeable with no unresolved comments/reviews/threads;
11. only that exact verified SHA is allowed to squash-merge.

After implementation merge:

12. independently verify merged `main` CI and exact production smoke;
13. update canonical docs with the merged SHA, final distribution artifact/run and production evidence;
14. run a separate docs-only Pattern #40 closure PR;
15. independently verify the closure merge before calling Pattern #40 **FULLY CLOSED**.

## Current execution order

1. Freeze PR #175 implementation/docs head and run the exact-head full CI.
2. Diagnose any failing job from its exact logs; do not weaken gates to make it green.
3. If green, inspect distribution artifact/log, browser/permanent visual evidence and PR review/thread/mergeability state.
4. Mark #175 ready and squash-merge only the exact verified head.
5. Independently verify merged `main` and production smoke.
6. Run the separate Pattern #40 closure documentation gate to full verification.
7. Start Pattern #41 only from a fresh objective/evidence audit after Pattern #40 is fully closed; no mechanic is pre-approved.
8. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
9. Continue WS-02 narration, WS-10 external physical-device/accessibility/Iqro evidence and WS-11 governance.
10. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
11. Perform later WS-12 cleanup and final end-to-end production acceptance.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
