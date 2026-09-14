# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`  
**Active gameplay PR:** #109 / `agent/ws05-gameplay-more-less-balance-20260915`  
**Primary focus:** WS-05 gameplay/mechanic diversification.  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya static scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Jangan membuat drag-only interaction; fallback accessible wajib tersedia bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. **Code merged tanpa canonical docs = pekerjaan belum selesai.**

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 15 merged; pattern #16 More/Less Balance QA |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **15**. Latest gameplay merge is Number Line PR #108 `f1a9b0a2adbbb6e9e68e9cb2525d7c9a12219bb4`.

Merged distribution:

```text
900 / 900 classified
0 unclassified
15 active patterns
choice_grid         377 / 900 = 41.89%
number_line           6 / 900 = 0.67%
count_and_select      9 / 900 = 1.00%
Math choice_grid     67 / 100
Science choice_grid  79 / 100
Logic choice_grid    77 / 100
```

## Number Line PR #108 — DONE

Exactly six Math Wave B ordering activities now use `number_line`. Implementation CI #489 and final docs-head CI #494 were full green; browser + manual visual QA accepted 320/390/768. Evidence fidelity is `choice_number_line_interaction` and Wave C `math-missing-*` remains outside this family.

## Active PR #109 — More/Less Balance

Exact scope: six Math Wave B comparison activities:

```text
math-compare-more-2-4
math-compare-less-5-3
math-compare-equal-4-4
math-compare-more-6-5
math-compare-less-7-9
math-compare-more-10-8
```

Why this family:
- coherent stage/lesson/skill: `math-banding-bentuk` / quantity comparison / `math.quantity.comparison`;
- interaction directly represents left/right/equal comparison;
- canonical three choices can map exactly to left/equal/right;
- no parsing-based routing or broad prefix conversion is needed.

Interaction/evidence:
- two visible quantity pans + center equal control;
- beam stays neutral before completion so UI does not reveal the answer;
- runtime remains `tap_choice`;
- IDs, choices, correctChoice, skill, assessment, stars, progression and completion identity remain unchanged;
- wrong answer increments incorrect/retry;
- assessed fidelity `choice_balance_comparison_interaction` records comparison goal, left/right counts and correct side.

Implementation-head acceptance at `9c71560e37a5dace1c79abea56d4cda625eb27c0`:
- CI #496 full green across Ubuntu, Windows, production build, dependency audit, secret scan and Chromium mobile QA;
- deterministic quality remains **900 KEEP / 0 flagged**;
- browser representative `math-compare-equal-4-4` uses legitimate previous-stage readiness and keeps progression guard active;
- keyboard wrong-state + pointer completion + evidence persistence + >=44px controls + no overflow + success CTA checks pass;
- manual visual review accepted idle/error/success at 320x720, 390x844, 768x1024.

Measured PR #109 distribution:

```text
900 / 900 classified
0 unclassified
16 active patterns
choice_grid          371 / 900 = 41.22%
more_less_balance      6 / 900 = 0.67%
number_line             6 / 900 = 0.67%
Math choice_grid       61 / 100
```

Delta from merged baseline: global `choice_grid` 377 -> 371; Math `choice_grid` 67 -> 61.

## Next mechanic after #109

Do not start until #109 closes. Strongest next Math candidate is `pattern_completion` for the reviewed Wave B pattern activities, but exact family review is required first. Wave C `math-missing-*` and `make_total` remain separate candidate families; do not assume they should share a mechanic.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- record merge SHA in canonical docs;
- never present unmerged work as shipped.

## Current execution order

1. Close PR #109 More/Less Balance safely.
2. Verify merged distribution baseline.
3. Review exact Wave B pattern family for `pattern_completion` on latest `main`.
4. Review Wave C missing-number and `make_total` separately.
5. Continue toward 50–60 meaningful patterns using permanent audit evidence.
6. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance and WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
