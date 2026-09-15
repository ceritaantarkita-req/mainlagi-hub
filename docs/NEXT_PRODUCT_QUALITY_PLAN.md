# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged gameplay baseline:** `main` @ `e1082a5ab236e16fad5502155575109c342fbeed` (post-Material-Lab closure PR #117)  
**Active gameplay PR:** **#119 — Science Feature Function Link, accepted implementation QA / unmerged**  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 20 merged; pattern #21 accepted QA on PR #119 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **20**. Latest merged gameplay is Science Material Lab PR #116 `5d6b429b64681bc6f2aa055a643a607cf54b1102`; docs closure PR #117 moved `main` to `e1082a5ab236e16fad5502155575109c342fbeed`.

```text
900 / 900 classified
0 unclassified
20 active patterns
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

## PR #119 Feature Function Link — ACCEPTED IMPLEMENTATION QA / UNMERGED

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

Accepted implementation evidence:
- CI #541 caught two real regressions: the old default-choice regression set did not exclude the new specialized family, and a decorative connector intercepted pointer clicks;
- both were fixed without weakening existing gates; connector is now non-interactive and the old default-family assertion remains active;
- CI #543 exposed an incorrect test assumption that skill ID lived on runtime `LearningActivity`; the test was corrected to verify the canonical catalog learning spec instead of changing the runtime model;
- CI #544 passed Ubuntu/Windows/build/security but caught the 320px success CTA below the viewport;
- phone success layout was compacted only after completion while preserving >=44px controls and idle/error layout;
- implementation head `94effe387912f27d0667e36fbf1d2351d612b62d` passed full CI #545 across Ubuntu, Windows, production build, dependency audit, secret scan and Mobile Chromium;
- deterministic activity-quality remains **900 KEEP / 0 flagged / structural 0**;
- gameplay distribution verifies **21 patterns on PR head**, 900/900 classified, `choice_grid` 351/900 (39.00%) and `feature_function_link` 4/900;
- representative browser QA passes legitimate Science readiness, keyboard wrong-state, pointer completion, evidence persistence, touch sizing, no overflow and in-viewport success CTA at 320/390/768;
- manual review of the green #545 idle/error/success screenshots at 320x720, 390x844 and 768x1024 accepted the visual state.

PR-head figures remain unmerged product state until exact-head merge:

```text
21 active patterns on PR head
choice_grid                 351 / 900 = 39.00%
feature_function_link         4 / 900 = 0.44%
Science choice_grid          64 / 100
Logic choice_grid            77 / 100
```

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

1. Run final docs-head CI for PR #119, then clean review/comment/thread check and exact-head squash merge.
2. Verify `main`, then complete a docs-only post-merge closure so 21 patterns become canonical merged state.
3. Re-audit remaining Science exact families while Science remains above the >60% advisory hotspot threshold; do not force heterogeneous tasks together.
4. Audit Logic after the Science pass; Logic remains the largest subject hotspot at 77% `choice_grid` on the current merged baseline.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit toward 50–60 meaningful patterns.
6. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
