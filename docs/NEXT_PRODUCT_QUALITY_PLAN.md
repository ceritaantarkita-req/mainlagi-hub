# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical merged baseline:** `main` @ `a961be0e61055f7347244b58b9dc252d5ed6f382`  
**Latest merged gameplay change:** PR #125 — Logic `odd_one_out`; closure PR #126  
**Active gameplay PR:** PR #127 — Logic `transitive_chain` — **QA ACCEPTED / UNMERGED**  
**Active gameplay branch:** `agent/ws05-logic-transitive-chain-20260915`  
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
8. Work tidak boleh disebut shipped sebelum exact-head merge, live `main` verification, dan required post-merge closure selesai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | PR #88; terus dijaga current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **24 merged patterns + PR #127 QA-accepted pattern #25 unmerged** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Canonical merged WS-05 baseline

Verified live `main` remains at Odd One Out closure SHA `a961be0e61055f7347244b58b9dc252d5ed6f382` with **24 merged patterns**:

```text
900 / 900 classified
0 unclassified
24 active merged patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

Science is exactly 60% `choice_grid`. Logic remains above the permanent subject advisory threshold (`>60%`). Concentration is advisory only; the next mechanic must still be objective/evidence exact-fit.

## PR #127 Logic Transitive Chain — QA ACCEPTED / UNMERGED

Exact scope:

```text
logic-transitive-height-abc
logic-transitive-shortest-xyz
logic-transitive-most-dots
logic-transitive-lightest
logic-transitive-middle-order
```

All five share:
- stage `logic-mixed-reasoning-challenge`;
- lesson `logic-transitive-comparison`;
- canonical skill `logic.comparison.transitive.basic`;
- assessed `tap_choice` evidence;
- the objective of deriving one conclusion from two ordered comparison premises.

Pattern: `transitive_chain`.

Interaction/evidence contract:
- show the two canonical premises as one visible three-node relation chain;
- preserve the canonical three answer choices as accessible direct-selection buttons;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- no invented numeric values, reordering assessment, drag-only dependency, extra confirmation, or changed answer set;
- runtime, IDs, choices, `correctChoice`, skill, assessment, stars and progression remain canonical;
- assessed fidelity: `choice_transitive_chain_interaction`.

Accepted implementation evidence at head `46bcd677d2b3003f30b2e20bd21fe854c4f1f833`:
- CI #569 correctly blocked a stale Rule Pipeline exclusion sentinel and was not accepted;
- CI #570 then passed all non-browser gates but correctly blocked a 390x844 success-state CTA that was below the viewport; it was not accepted;
- the responsive fix hides the already-consumed premise chain only in completed phone-sized state while keeping the question, canonical answers, success explanation and CTA visible; touch targets/evidence are unchanged;
- full CI #572 / run `34957824566` is green across Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium;
- exact gameplay-presentation regression reports exactly **5 `transitive_chain`** activities and dedicated exact-family regression passes;
- deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution verifies **900/900 classified, 25 PR-head patterns, `choice_grid` 332/900 (36.89%), `transitive_chain` 5/900, Logic 62/100, Science 60/100**;
- all five simulations report `invariantErrors: 0`;
- Batch17 remains **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills**, with physical-device certification still `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes canonical Logic Wave C readiness, keyboard wrong-state, pointer completion, two-premise layout, assessed evidence, >=44px controls, no horizontal overflow and in-viewport CTA at 320x720, 390x844 and 768x1024;
- manual review of #572 idle/try/success screenshots at 320/390/768 is accepted; the 390 success regression is resolved and the 768 completed state intentionally retains the full relation chain.

Because PR #127 is still open, the merged baseline remains **24**. On the QA-accepted PR head there are **25** active patterns. If #127 merges unchanged, remaining distance is **25 patterns to the minimum 50** and **35 to the working target 60**.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Finalize these canonical docs on PR #127 while labeling it **QA accepted / unmerged**.
2. Run full CI on the resulting exact docs head; do not reuse implementation CI #572 as merge acceptance after docs change the head.
3. Recheck PR comments/reviews/threads, mergeability, draft/state and exact SHA.
4. Exact-head squash merge PR #127 only after the final docs head is fully green, then verify live `main` at the returned merge SHA.
5. Create and merge a docs-only Transitive Chain post-merge closure from verified live `main`.
6. Only after closure, run a **fresh Logic exact-family audit**; no next family is pre-approved merely because Logic remains 62% `choice_grid`.
7. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
8. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
