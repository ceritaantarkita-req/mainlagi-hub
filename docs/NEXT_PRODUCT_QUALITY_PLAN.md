# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `7c1a679c156c623a318cb9640880374eedc7e149`  
**Active gameplay PR:** #108 / `agent/ws05-gameplay-number-line-20260914`  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 14 merged; pattern #15 Number Line QA |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **14**. Latest gameplay merge is Count-and-Select PR #106 `18beb9bc676d529cc5701bc964bdef26bea33132`; PR #107 closed its canonical docs.

Merged distribution:

```text
900 / 900 classified
0 unclassified
14 active patterns
choice_grid         383 / 900 = 42.56%
count_and_select      9 / 900 = 1.00%
Math choice_grid     73 / 100
Science choice_grid  79 / 100
Logic choice_grid    77 / 100
```

## Active PR #108 — Number Line

Exact scope: six Math Wave B ordering activities:

```text
math-order-next-1-2
math-order-next-3-4
math-order-before-6
math-order-between-6-8
math-order-descend-5
math-order-descend-10
```

Why this family:
- coherent stage/lesson/skill: `math-banding-bentuk` / number ordering / `math.number.ordering`;
- interaction directly represents relative number position;
- all six retain three canonical numeric answers;
- Wave C missing-number activities are deliberately excluded pending separate review.

Interaction:
- compact five-tick local number line;
- explicit configured context for forward/backward/between tasks;
- only canonical choices are clickable;
- runtime remains `tap_choice`;
- IDs, choices, correctChoice, skill, assessment, stars, progression and completion identity remain unchanged;
- assessed fidelity `choice_number_line_interaction` records wrong/retry/accuracy plus line direction/range/context.

Implementation-head acceptance at `6b92ff922b6878d6ff1a88b1162f6adc9beee05f`:
- CI #489 full green across Ubuntu, Windows, production build, dependency audit, secret scan and Chromium mobile QA;
- deterministic quality remains **900 KEEP / 0 flagged**;
- browser representative `math-order-between-6-8` uses legitimate previous-stage readiness and keeps progression guard active;
- keyboard wrong-state + pointer completion + evidence persistence + >=44px controls + no overflow + success CTA checks pass;
- manual visual review accepted idle/error/success at 320x720, 390x844, 768x1024.

Measured PR #108 distribution:

```text
900 / 900 classified
0 unclassified
15 active patterns
choice_grid        377 / 900 = 41.89%
number_line          6 / 900 = 0.67%
Math choice_grid    67 / 100
```

Delta from merged baseline: global `choice_grid` 383 -> 377; Math `choice_grid` 73 -> 67.

## Next mechanic after #108

Do not start until #108 closes. Strongest next coherent Math candidate is `more_less_balance` for the six reviewed Wave B comparison activities:

```text
math-compare-more-2-4
math-compare-less-5-3
math-compare-equal-4-4
math-compare-more-6-5
math-compare-less-7-9
math-compare-more-10-8
```

After that, review `pattern_completion`, Wave C missing-number family, and `make_total` separately. Do not mass-convert activities just to reduce hotspot percentages.

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

1. Close PR #108 Number Line safely.
2. Verify merged distribution baseline.
3. Review and, if still appropriate, implement `more_less_balance` on a separate branch.
4. Continue toward 50–60 meaningful patterns using permanent audit evidence.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance and WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
