# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `a628a3a7d3dbb0be9faef2fd2e0c7efddd9c0649`  
**Active gameplay PR:** #114 — Science Compare Properties, accepted QA / unmerged  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 18 merged; pattern #19 QA in PR #114 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **18**. Latest gameplay merge is Science Cause/Effect PR #112 `768b7f53a003d7677a74ea54e9686418c900eab4`. Docs closure #113 moved `main` to `a628a3a7d3dbb0be9faef2fd2e0c7efddd9c0649` without runtime changes.

Merged distribution after #112:

```text
900 / 900 classified
0 unclassified
18 active patterns
choice_grid          362 / 900 = 40.22%
cause_effect           4 / 900 = 0.44%
Math choice_grid       56 / 100
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

## Compare Properties PR #114 — ACCEPTED QA / UNMERGED

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

QA evidence:
- CI #522 full green on the first implementation head;
- manual review found a duplicate visible label on A/B cards, so the implementation was polished instead of accepted unchanged;
- accepted head `c962e0c05a38eecf2890a76bf6417545100238a1` removes duplicate label/canonical-choice text when equivalent;
- CI #523 full green across Ubuntu, Windows, production build, dependency audit, secret-history scan, and Mobile Chromium; production smoke skipped as expected;
- browser representative `science-measure-longer-pencil` uses legitimate Science Wave B prerequisite readiness;
- keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px targets, no overflow, and in-viewport CTA pass at 320/390/768;
- manual visual review after polish accepted all idle/error/success screenshots;
- deterministic activity quality remains **900 KEEP / 0 flagged / structural 0**.

Measured PR-head distribution:

```text
900 / 900 classified
0 unclassified
19 active patterns on PR head
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

Do not treat these as merged figures until #114 is merged and `main` is verified.

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

1. Finish canonical docs for PR #114 on the accepted implementation head.
2. Run final docs-head CI; fix any regression before merge.
3. Check review threads/comments, re-fetch exact head, squash-merge with `expected_head_sha`, then verify `main`.
4. Close stale QA wording after merge if necessary.
5. Re-audit remaining Science exact families from latest `main`; Science would still be concentrated at 72% `choice_grid` if #114 merges.
6. Do not preselect pattern #20 before exact objective/evidence review; Wave D investigation/prediction is a candidate area, not a committed scope.
7. Audit Logic after the Science pass, then continue search/audio/puzzle/literacy/creative/story based on objective fit and distribution.
8. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
