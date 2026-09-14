# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `18beb9bc676d529cc5701bc964bdef26bea33132`  
**Active gameplay PR:** none; next mechanic requires exact-family review first.  
**Primary focus:** WS-05 gameplay/mechanic diversification.  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya static scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
6. **Code merged tanpa canonical docs = pekerjaan belum selesai.**

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 14 merged patterns; target 60 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **14**.

Recent accepted waves:
- PR #101 Memory Pair — merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- PR #102 Sequence Slot — merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- PR #103 Sorting Buckets — merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`.
- PR #104 Drag-to-Target — merge `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`.
- PR #105 Gameplay Distribution Audit — merge `02d4696760d7b697cfd319804cd655c0d2bfec4c`.
- PR #106 Count-and-Select — merge `18beb9bc676d529cc5701bc964bdef26bea33132`.

Current permanent distribution:

```text
900 / 900 classified
0 unclassified
14 active patterns
choice_grid       383 / 900 = 42.56%
count_and_select    9 / 900 = 1.00%
Math choice_grid   73 / 100
Science choice_grid 79 / 100
Logic choice_grid   77 / 100
```

Global `choice_grid` remains above the >35% advisory threshold, so WS-05 continues.

## Count-and-Select — DONE / PR #106

Exactly 9 reviewed Math activities (`math-count-2` through `math-count-10`) use one reusable counting renderer.

Preserved boundaries:
- runtime remains `tap_choice`;
- activity ID, choices, correctChoice, skill, assessment, stars, progression, and completion identity remain canonical;
- wrong answer increments incorrect/retry without completion;
- assessed fidelity is `choice_count_interaction` with accuracy, correct/incorrect/retry, and `countTarget`;
- exact 9-ID allowlist prevents unrelated Math families from being reclassified.

Acceptance:
- implementation CI #480 full green;
- final docs-head CI #485 full green;
- activity quality remains **900 KEEP / 0 flagged**, structural=0;
- browser QA validated legitimate Math progression, keyboard wrong-state, pointer completion, canonical objects/choices, evidence, touch targets, overflow, and success CTA;
- manual visual QA accepted idle/error/success at 320, 390, and 768.

## Next mechanic selection

No mechanic #15 is active yet. First review exact Math families and choose based on objective fit and catalog evidence.

Current candidates:
1. `number_line` — number position/order objectives;
2. `more_less_balance` — comparison objectives;
3. `pattern_completion` — pattern/missing objectives;
4. `make_total` — composition/addition objectives where appropriate.

After that, use the permanent audit to prioritize Logic, Science, search/scene, audio, ordering, puzzle/path, literacy construction, creative, and story mechanics toward 60. Do not mass-convert activities only to reduce hotspot percentages.

## Definition of Done

A mechanic/PR is complete only when applicable implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

## Current execution order

1. exact-family audit for mechanic #15;
2. implement one coherent mechanic wave in its own branch/PR;
3. verify measured distribution delta, not estimates;
4. continue toward 50–60 meaningful patterns;
5. continue WS-08 visual system, then WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
