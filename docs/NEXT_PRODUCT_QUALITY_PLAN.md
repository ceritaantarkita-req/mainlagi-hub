# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `02d4696760d7b697cfd319804cd655c0d2bfec4c`  
**Active branch/PR:** `agent/ws05-gameplay-count-select-20260914` / PR #106  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 13 merged; pattern #14 Count-and-Select QA on #106 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **13**.

Accepted waves:
- PR #101 Memory Pair — merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`.
- PR #102 Sequence Slot — merge `f981d40fd55c1cdef3137600b4b44677e550b06d`.
- PR #103 Sorting Buckets — merge `6d28ff2f4f3eb8a5b642d2e3b79979c910924342`.
- PR #104 Drag-to-Target — merge `01fae0dbf73e47cb6d0281671b92ad77e6be03f7`.
- PR #105 Gameplay Distribution Audit — merge `02d4696760d7b697cfd319804cd655c0d2bfec4c`.

Permanent PR #105 baseline:

```text
900 / 900 classified
0 unclassified
13 active patterns
choice_grid 392 / 900 = 43.56%
Math choice_grid 82 / 100
Science choice_grid 79 / 100
Logic choice_grid 77 / 100
```

## Active PR #106 — Count-and-Select

Scope: exactly 9 reviewed Math activities, `math-count-2` through `math-count-10`.

Behavior:
- child counts a visible canonical object set, then chooses from the existing three numeric answers;
- runtime remains `tap_choice`;
- activity ID, choices, correctChoice, skill, assessment, stars, progression, and completion identity remain canonical;
- wrong answer increments incorrect/retry and does not complete;
- assessed fidelity is `choice_count_interaction` with accuracy, correct/incorrect/retry, and `countTarget`;
- exact 9-ID allowlist prevents unrelated Math families from being reclassified.

PR #106 also fixes a semantic audit gap: `math-count-3` historically had a counting-specific renderer but the first distribution audit still labeled it `choice_grid`. The reusable family now makes all nine reviewed count activities explicit.

Acceptance evidence at implementation head `871677650ecc9e2e86618fb5f81b342b0b370c85`:
- CI #480 full green across Ubuntu, Windows, production build, dependency audit, secret scan, and mobile Chromium;
- activity quality remains **900 KEEP / 0 flagged**, structural=0;
- browser QA checks legitimate Math progression, keyboard wrong-state, pointer completion, canonical objects/choices, assessed evidence, >=44px controls, no horizontal overflow, and success CTA visibility;
- manual visual QA accepted idle/error/success at 320, 390, and 768.

Measured PR #106 distribution:

```text
900 / 900 classified
0 unclassified
14 active patterns
choice_grid      383 / 900 = 42.56%
count_and_select   9 / 900 = 1.00%
Math choice_grid  73 / 100
```

Delta: global `choice_grid` 392 -> 383; Math `choice_grid` 82 -> 73.

If #106 merges, merged gameplay-pattern count becomes **14**.

## Next mechanic order

After #106, review exact Math families before implementation:
1. `number_line` for number-position/order objectives;
2. `more_less_balance` for comparison objectives;
3. `pattern_completion` for pattern/missing objectives;
4. `make_total` where composition/addition objectives justify it.

Then use the permanent distribution audit to prioritize Logic, Science, search/scene, audio, ordering, puzzle/path, literacy construction, creative, and story mechanics toward 60. Do not mass-convert activities only to reduce hotspot percentages.

## Definition of Done

A mechanic/PR is complete only when applicable implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- record merge SHA on the next relevant canonical update;
- never present unmerged work as shipped.

## Current execution order

1. Close PR #106 Count-and-Select safely.
2. Verify merged distribution baseline.
3. Start the next Math mechanic only after exact-family review.
4. Continue toward 50–60 meaningful patterns using the audit.
5. Continue WS-08 visual system, then WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and WS-12 cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
