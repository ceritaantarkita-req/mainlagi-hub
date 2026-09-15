# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `4f3e2828aa3be804f6d896b10f8e3422c3180811`  
**Active gameplay PR:** none  
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
7. **Code merged tanpa canonical docs yang current = pekerjaan belum selesai.**

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 19 merged; next Science exact-family audit |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **19**. Latest gameplay merge is Science Compare Properties PR #114 `4f3e2828aa3be804f6d896b10f8e3422c3180811`.

Merged distribution after #114:

```text
900 / 900 classified
0 unclassified
19 active patterns
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

## Compare Properties PR #114 — MERGED

Exactly three Science Wave C observation/measurement activities are routed to `compare_properties`:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Explicit exclusions:

```text
science-observe-record-same-time
science-match-observation-tools-c
```

Why this family is coherent:
- all three directly compare one observable property;
- the engine supports qualitative length, temperature, and relative fill without inventing numerical measurements;
- canonical choices/correctChoice remain intact;
- recording discipline and tool matching remain different objectives and stay outside scope.

Interaction/evidence contract:
- visible A/B comparison board plus the canonical third distractor;
- explicit per-activity configuration, no prompt parsing;
- wrong choice is retryable and cannot complete;
- keyboard and touch/pointer use identical controls;
- runtime remains `tap_choice`;
- assessed fidelity `choice_compare_properties_interaction`;
- assessment, stars, progression, activity IDs, and completion identity remain canonical.

Accepted QA evidence before merge:
- CI #522 full green on the first implementation head;
- manual review found a duplicate visible label on A/B cards, so the implementation was polished instead of accepted unchanged;
- accepted implementation head `c962e0c05a38eecf2890a76bf6417545100238a1` removed duplicate label/canonical-choice text when equivalent;
- CI #523 full green across Ubuntu, Windows, production build, dependency audit, secret-history scan, and Mobile Chromium; production smoke skipped as expected;
- browser representative `science-measure-longer-pencil` used legitimate Science Wave B prerequisite readiness;
- keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px targets, no overflow, and in-viewport CTA passed at 320/390/768;
- manual visual review after polish accepted all idle/error/success screenshots;
- deterministic activity quality remained **900 KEEP / 0 flagged / structural 0**.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from current screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- update stale QA wording through a docs-only closure if necessary;
- never present unmerged work as shipped.

## Current execution order

1. Close stale post-merge wording for PR #114 and keep canonical docs synchronized with `main`.
2. Re-audit remaining Science exact families from latest `main`; Science remains concentrated at 72% `choice_grid`.
3. Prioritize Wave D investigation/evidence as the next candidate area, but only promote pattern #20 after exact objective/evidence review.
4. Audit Logic after the Science pass, then continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
