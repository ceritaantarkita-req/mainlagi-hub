# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, `MAINLAGI_ART_BIBLE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest fully closed gameplay:** Pattern #39 — Math `visual_word_problem`  
**Pattern #39 final closure main:** `98725727c866d410b2d0caa206e86e70cd0e5741`  
**Pattern #39 final CI:** **#811 / run `35190499794` — success**  
**Pattern #40 audit:** **OPEN PR #173 — `spatial_relation_board` candidate selected for six exact Logic spatial activities; implementation not started**  
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
| WS-01 Canonical docs | **IN PROGRESS** | Pattern #40 audit synchronization in PR #173 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | **P1 COMPLETE** | VUI-01/02/03 + residual token closure live verified |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **39 FULLY CLOSED / PATTERN #40 AUDIT OPEN** | `spatial_relation_board` candidate, no implementation yet |
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

## Pattern #40 objective/evidence audit — current gate

Fresh audit PR #173 evaluated remaining generic `choice_grid` families and preserves the valid option of rejecting unjustified novelty. The current audit selects one exact candidate because its learning objective is materially under-represented by the generic choice presentation.

Working pattern:

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

Why this candidate is justified:

- the lesson objective explicitly targets left/right/between, turning and opposite direction relations;
- the existing generic choice presentation records the final answer but does not spatially represent the relation being reasoned about;
- all six activities share one narrow lesson/pack/skill/runtime family;
- canonical prompts, choices, answer order and `correctChoice` can stay unchanged;
- a deterministic board can represent the existing relation without creating a second assessment step;
- existing patterns such as `sequence_slot`, `relative_order_track`, `pattern_completion`, and generic `choice_grid` do not provide the same direct spatial-relation presentation contract.

Implementation is **not** authorized to broaden beyond these six IDs or rewrite canonical content. The audit remains docs-only until PR #173 is accepted and merged.

## Pattern #40 implementation gate after audit merge

If PR #173 is accepted, implementation must start from the resulting latest `main` on a separate branch and prove all of the following before merge:

1. exact classifier selects only the six audited IDs and fails closed outside the canonical Logic lesson/pack/skill/runtime shape;
2. deterministic config covers left/right, between, right-turn, left-turn and opposite-direction semantics without heuristic prompt parsing;
3. canonical prompt, choices/order and `correctChoice` remain unchanged;
4. runtime remains assessed `tap_choice` with `choice_accuracy_v1` semantics;
5. wrong answers remain measured/retryable and cannot complete;
6. correct answer completes through the existing measured activity path;
7. keyboard, touch and pointer all remain primary controls;
8. no drag-only dependency is introduced;
9. responsive idle/wrong/success states are visually accepted at 320x720, 390x844 and 768x1024;
10. no horizontal overflow or hidden answer controls occur;
11. permanent visual QA remains green;
12. activity-quality stays deterministic clean;
13. gameplay distribution remains 900/900 classified and becomes exactly 40 active patterns only after implementation;
14. full CI, Windows compatibility, production build and exact Cloudflare release smoke pass;
15. implementation and closure docs remain synchronized with verified reality.

## Current execution order

1. Finish PR #173 as the canonical **Pattern #40 objective/evidence audit** with synchronized docs and exact-head quality gates.
2. Merge the audit only if its scope remains docs-only, mergeable and clean.
3. Start a separate Pattern #40 implementation branch from the resulting latest `main`.
4. Implement `spatial_relation_board` only for the six audited Logic spatial activities and run full evidence/accessibility/responsive/visual/distribution gates.
5. Independently verify merged `main` before claiming Pattern #40 implementation complete, then perform its separate closure documentation gate.
6. Continue WS-05 toward 50–60 while permanent WS-08 visual QA runs in parallel.
7. Continue WS-02 narration, WS-10 external physical-device/accessibility/Iqro evidence and WS-11 governance.
8. Address P2 game-shell/icon/inline-style work without destabilizing accepted P1 surfaces.
9. Perform later WS-12 cleanup and final end-to-end production acceptance.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion or major mastery/backend rewrites during this quality phase.
