# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical merged baseline:** `main` @ `0d595f8b1b824125dc2cc26277f3e469b9325c73`  
**Latest merged gameplay change:** PR #125 — Logic `odd_one_out`  
**Active gameplay PR:** none  
**Post-merge closure branch:** `docs/close-odd-one-out-20260915`  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **24 merged patterns**; fresh Logic exact-family audit next |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged on verified `main`: **24 active patterns**.

```text
900 / 900 classified
0 unclassified
24 active patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

Science is exactly 60% `choice_grid`. Logic remains above the permanent subject advisory threshold (`>60%`), so Logic remains the next audit focus. Concentration is advisory only; the next mechanic must still be objective/evidence exact-fit.

## PR #125 Logic Odd One Out — MERGED

Exact scope:

```text
logic-odd-category-animal-vehicle
logic-odd-shape-angular
logic-odd-direction-right
logic-odd-count-three
logic-odd-pattern-symmetry
```

Pattern: `odd_one_out`.

Why this family is coherent:
- all five are assessed `tap_choice` activities in stage `logic-classification-rules-basics`;
- all five belong to lesson `logic-odd-one-out-basic`;
- all five target canonical skill `logic.discrimination.odd_one_out.basic`;
- all five ask the child to compare a trio where two options share one visible relation and exactly one differs;
- classification, comparison, simple sequence-rule, set, spatial, inference and composed-rule families remain outside scope.

Interaction/evidence contract:
- canonical three choices appear as one comparison trio;
- relation cue is explicit as `2 mirip • 1 beda` without revealing the answer;
- child selects the outsider through accessible buttons;
- wrong choice increments assessed error/retry and cannot complete;
- correct choice completes the canonical activity identity;
- success may explain the reviewed shared relation after completion;
- runtime, IDs, choices, `correctChoice`, assessment, stars, progression and skill identity remain canonical;
- assessed fidelity: `choice_odd_one_out_interaction`.

Accepted and merged evidence:
- CI #562 correctly blocked on a stale Rule Pipeline exclusion sentinel; the sentinel was replaced with unrelated `logic-compare-more-dots`, preserving the old exact-scope guard;
- CI #563 correctly exposed a bad QA assumption about natural unlock; runtime required prior `logic-foundations` readiness as designed;
- browser QA was corrected to seed canonical qualifying Logic foundation evidence while leaving progression guards active;
- accepted implementation head `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d` passed full CI #564 / run `34951235607`;
- final canonical-docs head `7b0735f13ab7ad22dff8c6fed792e62f9a66bc60` passed full CI #565 / run `34952172997`;
- Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium all passed;
- deterministic activity-quality remained **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution verified **900/900 classified, 24 patterns, `choice_grid` 337/900, `odd_one_out` 5/900, Logic 67/100, Science 60/100**;
- simulations and Batch17 passed with catalog totals unchanged;
- browser QA passed canonical Logic foundation progression, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence persistence, >=44px controls, no horizontal overflow and in-viewport CTA at 320x720, 390x844 and 768x1024;
- manual visual review of green #564 idle/error/success screenshots at 320/390/768 was accepted; no polish commit required;
- final pre-merge gate had **0 PR comments, 0 submitted reviews, 0 review threads** and exact head `7b0735f13ab7ad22dff8c6fed792e62f9a66bc60` was mergeable;
- exact-head squash merge produced `0d595f8b1b824125dc2cc26277f3e469b9325c73`;
- live `main` was verified at that exact merge SHA.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Merge this docs-only Odd One Out post-merge closure from verified `main` `0d595f8b1b824125dc2cc26277f3e469b9325c73`.
2. Start a **fresh Logic exact-family audit** from the verified 24-pattern baseline; do not assume the next family before checking objective/evidence coherence.
3. Promote the next mechanic only when scope, evidence and progression fit are exact; do not lower hotspot counts cosmetically.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
