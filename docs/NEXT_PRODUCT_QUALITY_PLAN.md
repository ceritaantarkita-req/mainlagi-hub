# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay change:** PR #130 — Logic `set_reasoning`  
**Verified gameplay merge SHA:** `678c2b0ec73910181f4a8a8e804f83f0fe0d0392`  
**Live `main` verification:** exact SHA match confirmed after merge  
**Pattern #26 closure:** **IN PROGRESS** on `agent/ws05-set-reasoning-closure-20260915`  
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
8. Work tidak boleh disebut fully closed sebelum exact-head merge, live `main` verification, dan required post-merge closure selesai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | terus dijaga current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **26 merged patterns; Pattern #26 closure in progress** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Verified live `main` after exact-head squash merge PR #130:

```text
900 / 900 classified
0 unclassified
26 active merged patterns
choice_grid                 327 / 900 = 36.33%
set_reasoning                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

Distance remaining: **24 patterns** to minimum 50 and **34 patterns** to working target 60.

Science remains exactly 60% `choice_grid`. Logic is now 57%. Concentration remains advisory only; Pattern #27 still requires a fresh objective/evidence audit.

## Pattern #26 — Logic Set Reasoning — MERGED / CLOSURE IN PROGRESS

Exact scope:

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

All five share stage `logic-mixed-reasoning-challenge`, lesson `logic-set-reasoning`, pack `logic.pack.set-reasoning`, canonical skill `logic.set.relation.basic`, assessed `tap_choice` evidence, exactly three canonical choices, and the objective of evaluating set membership, intersection, exclusion, or being outside two target sets.

Pattern: `set_reasoning`.

Preserved contract:
- explicit two-rule set board;
- each rule shown as `harus masuk` or `harus di luar`;
- operation visible as `Irisan A ∩ B`, `A tetapi bukan B`, or `Di luar A ∪ B`;
- unchanged canonical three answer choices;
- wrong answer records assessed error/retry and cannot complete;
- correct answer completes the canonical activity identity;
- no false Venn geometry, invented intermediate assessment, extra confirmation, or drag-only dependency;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain canonical;
- assessed fidelity `choice_set_reasoning_interaction`.

Acceptance and merge chain:
- CI #583 / run `34968050234` correctly rejected a stale Rule Pipeline sentinel;
- CI #584 / run `34968353606` passed automation but was manually rejected because 320x720 idle/try feedback clipped below the viewport;
- accepted implementation head `acc5ce9d5661818842effcd120346ded3891dd50` passed full CI #586 / run `34969198343` and manual 320/390/768 screenshot review;
- final canonical-docs head `a725e567898a07bfd4977d5015a179c7a6d88ab2` passed full CI #591 / run `34971570563`;
- final PR #130 gate was clean: open, non-draft, mergeable, 0 comments, 0 reviews, 0 review threads;
- exact-head squash merge PR #130 produced `678c2b0ec73910181f4a8a8e804f83f0fe0d0392`;
- independent branch fetch verified live `main` exactly at `678c2b0ec73910181f4a8a8e804f83f0fe0d0392`.

Pattern #26 is merged but not yet called fully closed until this required docs-only closure itself passes full CI, clean gate, exact-head merge and live-main verification.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish and merge the docs-only Pattern #26 closure from verified merge SHA `678c2b0e...`.
2. Only after closure is live-verified, run a fresh exact-family audit for Pattern #27; no next family is pre-approved.
3. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
4. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
