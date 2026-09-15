# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical merged baseline:** `main` @ `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`  
**Latest merged gameplay change:** PR #127 — Logic `transitive_chain`  
**Active gameplay PR:** none  
**Post-merge closure branch:** `docs/close-transitive-chain-20260915`  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **25 merged patterns**; Transitive Chain closure active |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Verified live `main` after PR #127:

```text
900 / 900 classified
0 unclassified
25 active merged patterns
choice_grid                 332 / 900 = 36.89%
transitive_chain              5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            62 / 100
```

Distance remaining: **25 patterns** to minimum 50 and **35 patterns** to working target 60.

Science is exactly 60% `choice_grid`. Logic remains above the permanent subject advisory threshold (`>60%`) at 62%, but concentration is advisory only. The next mechanic must come from a fresh objective/evidence audit, not from count pressure.

## PR #127 Logic Transitive Chain — MERGED

Exact scope:

```text
logic-transitive-height-abc
logic-transitive-shortest-xyz
logic-transitive-most-dots
logic-transitive-lightest
logic-transitive-middle-order
```

All five share stage `logic-mixed-reasoning-challenge`, lesson `logic-transitive-comparison`, canonical skill `logic.comparison.transitive.basic`, assessed `tap_choice` evidence, and the objective of deriving one conclusion from two ordered comparison premises.

Pattern: `transitive_chain`.

Interaction/evidence contract:
- show the two canonical premises as one visible three-node relation chain;
- preserve the canonical three answer choices as accessible direct-selection buttons;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- no invented numeric values, reordering assessment, drag-only dependency, extra confirmation, or changed answer set;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars and progression remain canonical;
- assessed fidelity: `choice_transitive_chain_interaction`.

Accepted and merged evidence:
- CI #569 correctly blocked a stale Rule Pipeline exclusion sentinel and was retained as regression history;
- CI #570 correctly blocked a 390x844 completed-state CTA below the viewport and was retained as regression history;
- implementation head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833` passed full CI #572 / run `34957824566`;
- manual visual QA of #572 idle/try/success screenshots at 320/390/768 was accepted;
- final canonical-docs head `beb2e793ad3dfeb7ebb2b41c0f085b11d910f948` passed full CI #577 / run `34961404909`;
- final pre-merge gate: state open, draft false, mergeable true, **0 PR comments, 0 submitted reviews, 0 review threads**;
- exact-head squash merge produced `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6`;
- live `main` was verified at that exact merge SHA;
- deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution remains **900/900 classified, 25 patterns, `choice_grid` 332/900, `transitive_chain` 5/900, Logic 62/100, Science 60/100**;
- simulations remain zero invariant errors and Batch17 totals remain unchanged.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Merge the docs-only Transitive Chain post-merge closure from verified live `main` `c6c1493e7c7d4f765d4a1c22bf36ed86e99004b6` after its own full exact-head CI and clean review gate.
2. After closure, run a **fresh Logic exact-family audit** from the verified 25-pattern baseline. No next family is pre-approved.
3. Promote only objective-coherent/evidence-safe mechanics; do not lower hotspot counts cosmetically.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
