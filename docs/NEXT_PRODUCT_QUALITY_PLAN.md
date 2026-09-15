# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged gameplay baseline:** `main` @ `49850145a918afcba4f8279a6f5da12fe4a9c5b8` (PR #119)  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 21 merged; next Science exact-family audit |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **21**. Latest gameplay merge is Science Feature Function Link PR #119 `49850145a918afcba4f8279a6f5da12fe4a9c5b8`.

```text
900 / 900 classified
0 unclassified
21 active patterns
choice_grid                 351 / 900 = 39.00%
feature_function_link         4 / 900 = 0.44%
Science choice_grid          64 / 100
Logic choice_grid            77 / 100
```

## Feature Function Link PR #119 — MERGED

Exact Science Wave D scope:

```text
science-feature-duck-webbed-feet
science-feature-fish-gills
science-feature-bird-beak-seeds
science-feature-cactus-water
```

Explicit exclusion:

```text
science-match-feature-function-d
```

Why this family is coherent:
- all four are assessed `science-living-adaptations` choices in `science-evidence-review-challenge`;
- all four target canonical skill `science.living.features_function.basic`;
- all ask the child to connect one visible organism feature with its function;
- the excluded activity remains canonical `matching` / `visible_matching`;
- heterogeneous investigation/evidence tasks remain intentionally outside this family.

Interaction/evidence contract:
- visible organism + feature source node;
- canonical three function choices remain accessible buttons;
- wrong link increments assessed error/retry evidence and cannot complete;
- correct link completes through the canonical activity identity;
- runtime remains `tap_choice`;
- assessed fidelity `choice_feature_function_link_interaction`;
- activity IDs, choices, `correctChoice`, assessment, stars, progression and skill identity remain canonical.

Accepted and merged evidence:
- CI #541 caught and blocked stale default-choice regression coverage plus decorative connector pointer interception;
- fixes preserved the default-family guard and made the connector non-interactive;
- CI #543 caught an invalid test assumption about runtime `skillId`; static QA was corrected to verify the canonical catalog learning spec rather than changing the runtime model;
- CI #544 caught the 320px success CTA below the viewport;
- success-only phone layout was compacted while preserving idle/error layout and >=44px answer controls;
- implementation head `94effe387912f27d0667e36fbf1d2351d612b62d` passed full CI #545;
- canonical docs head `4f7523aad78ed7c76b57d89320cb4b29c2c9263d` passed full CI #547;
- deterministic activity-quality remained **900 KEEP / 0 flagged / structural 0**;
- gameplay distribution verified **21 patterns**, 900/900 classified, `choice_grid` 351/900 (39.00%), `feature_function_link` 4/900 and Science `choice_grid` 64/100;
- browser QA passed legitimate Science readiness, keyboard wrong-state, pointer completion, assessed evidence persistence, >=44px controls, no overflow and in-viewport success CTA at 320/390/768;
- manual review of green #545 idle/error/success screenshots at 320x720, 390x844 and 768x1024 accepted the visual state;
- final merge gate found 0 issue/review comments, 0 submitted reviews and 0 review threads;
- exact-head squash merge produced `49850145a918afcba4f8279a6f5da12fe4a9c5b8`, then `main` was verified at that SHA.

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

1. Re-audit remaining Science exact families from the verified 21-pattern `main` baseline while Science remains above the >60% advisory hotspot threshold; do not force heterogeneous objectives into one mechanic.
2. Promote pattern #22 only when objective/evidence fit is exact, reusable and evidence-safe.
3. If no coherent Science family remains, move to Logic; Logic remains the largest subject hotspot at 77% `choice_grid`.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
