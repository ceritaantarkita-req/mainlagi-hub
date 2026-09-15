# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay change:** PR #127 — Logic `transitive_chain`  
**Latest gameplay closure:** PR #128 — Transitive Chain docs closure  
**Latest closure metadata:** PR #129 — verified post-closure metadata  
**Verified current `main` before Pattern #26:** `4a146b1f188eb90c612a8cf4dd0285363d5f6738`  
**Active gameplay PR:** #130 — Logic `set_reasoning` — **QA ACCEPTED / UNMERGED**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **25 merged patterns; Pattern #26 QA accepted in PR #130, unmerged** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Verified `main` baseline before PR #130:

```text
900 / 900 classified
0 unclassified
25 active merged patterns
choice_grid                 332 / 900 = 36.89%
transitive_chain              5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            62 / 100
```

Distance from merged baseline: **25 patterns** to minimum 50 and **35 patterns** to working target 60.

Science is exactly 60% `choice_grid`. Logic is 62% on merged `main`; concentration is advisory only.

## Pattern #26 — Logic Set Reasoning — QA ACCEPTED / UNMERGED

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
- no false Venn geometry for subset cases, no invented intermediate assessment, no extra confirmation, no drag-only dependency;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars, mastery and progression remain canonical;
- assessed fidelity `choice_set_reasoning_interaction`.

Accepted PR-head distribution from CI #586:

```text
900 / 900 classified
0 unclassified
26 active PR-head patterns
choice_grid                 327 / 900 = 36.33%
set_reasoning                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

If PR #130 merges unchanged, remaining distance becomes **24 patterns** to minimum 50 and **34 patterns** to working target 60.

Acceptance history:
- CI #583 / run `34968050234` correctly rejected a stale Rule Pipeline sentinel that still required `logic-set-both-red-round` to remain `default`;
- the sentinel was corrected narrowly without weakening Rule Pipeline's exact-five scope guard;
- CI #584 / run `34968353606` passed automated required jobs, but manual screenshot review rejected the implementation because the 320x720 idle/try status card was clipped below the viewport;
- the narrow-phone layout was tightened and browser QA was strengthened so idle, retry, success feedback and success CTA must be fully visible;
- accepted implementation head `acc5ce9d5661818842effcd120346ded3891dd50` passed full CI #586 / run `34969198343`;
- CI #586 artifacts report 900 KEEP / 0 flagged / structural findings 0, 26 patterns, `choice_grid` 327/900, `set_reasoning` 5/900, Logic 57/100, Science 60/100, five simulations with zero invariant errors, and unchanged Batch17 totals;
- manual review of new 320x720, 390x844 and 768x1024 idle/try/success screenshots accepted the responsive presentation: no clipping, overlap or horizontal overflow, and success CTA remains visible;
- physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

PR #130 is still **unmerged**. Pattern #26 must not be called shipped or fully closed until the final docs-head CI, clean PR gate, exact-head merge, live `main` verification, and required post-merge closure are complete.

## Pattern #25 — Logic Transitive Chain — FULLY CLOSED

Pattern #25 remains fully closed through PR #127 implementation, PR #128 closure, and post-closure metadata PR #129. Its canonical interaction/evidence contract remains unchanged.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finish PR #130 final docs-head CI and clean review gate.
2. Exact-head merge PR #130 and independently verify live `main`.
3. Create and merge required docs-only closure for Pattern #26.
4. Only then run a fresh exact-family audit for Pattern #27; no next family is pre-approved.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
6. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
