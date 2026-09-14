# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `18beb9bc676d529cc5701bc964bdef26bea33132`  
**Active gameplay PR:** none; next mechanic requires exact-family review  
**Primary focus:** WS-05 gameplay/mechanic diversification.  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines, bukan 60 gimmick one-off.

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

Accepted waves:
- PR #101 Memory Pair — merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- PR #102 Sequence Slot — merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- PR #103 Sorting Buckets — merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`.
- PR #104 Drag-to-Target — merge `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`.
- PR #105 Gameplay Distribution Audit — merge `02d4696760d7b697cfd319804cd655c0d2bfec4c`.
- PR #106 Count-and-Select — merge `18beb9bc676d529cc5701bc964bdef26bea33132`.

Current measured baseline after PR #106:

```text
900 / 900 classified
0 unclassified
14 active patterns
choice_grid      383 / 900 = 42.56%
count_and_select   9 / 900 = 1.00%
Math choice_grid  73 / 100
Science choice_grid 79 / 100
Logic choice_grid   77 / 100
```

`choice_grid` remains the only global >35% hotspot. Concentration is advisory, not an instruction to force unsuitable mechanics.

## PR #106 Count-and-Select — DONE

Exactly 9 reviewed Math activities `math-count-2` through `math-count-10` now use reusable `count_and_select` presentation.

Preserved:
- runtime `tap_choice`;
- activity IDs;
- choices/correctChoice;
- skill mapping;
- assessment mode;
- stars;
- progression/stage requirements;
- completion identity.

Measured evidence fidelity: `choice_count_interaction`, including correct/incorrect/retry/accuracy and canonical `countTarget` metadata.

Acceptance:
- implementation CI #480 full green;
- final docs-head CI #485 full green;
- browser QA covers valid Math progression, keyboard wrong-state, pointer completion, canonical objects/choices, evidence persistence, >=44px controls, no horizontal overflow, and success CTA visibility;
- manual visual review accepted idle/error/success at 320, 390, and 768;
- activity quality remains **900 KEEP / 0 flagged**.

PR #106 also corrected the first distribution classifier's semantic underclassification of `math-count-3`, which historically already had a counting-specific renderer.

## Next mechanic selection

Do not start implementation until exact candidate activities are reviewed from the catalog.

Priority candidate families:
1. `number_line` for number-position/order objectives;
2. `more_less_balance` for compare-more/less/equal objectives;
3. `pattern_completion` for missing/pattern objectives;
4. `make_total` only where number composition/addition objectives genuinely fit.

Selection criteria:
- coherent family with multiple activities;
- materially reduces repetitive `choice_grid` sessions;
- interaction directly represents the skill being measured;
- canonical evidence can be preserved or explicitly migrated safely;
- child-facing UI can remain clean at 320/390/768;
- reusable beyond one bespoke activity.

After Math, use the permanent audit to prioritize Logic, Science, search/scene, audio, ordering, puzzle/path, literacy construction, creative, and story mechanics toward 60.

## Definition of Done

A mechanic/PR is complete only when applicable implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

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

1. Close PR #106 docs status on a docs-only branch.
2. Audit exact Math candidate families and choose mechanic #15 from actual catalog data.
3. Implement only the selected family on a new branch from latest `main`.
4. Re-run distribution audit and record the measured delta.
5. Continue toward 50–60 meaningful patterns using the same acceptance discipline.
6. Continue WS-08 visual system, then WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
