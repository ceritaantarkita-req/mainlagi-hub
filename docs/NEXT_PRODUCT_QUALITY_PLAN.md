# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical merged baseline:** `main` @ `c0583c8e07907f02e9671e8254bc35353cf64d24` (Rule Pipeline closure PR #124)  
**Latest merged gameplay change:** PR #123 — Logic `rule_pipeline`  
**Active gameplay PR:** #125 — Logic `odd_one_out`  
**Accepted implementation head:** `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`  
**Active PR status:** **implementation + CI + visual QA accepted; UNMERGED**  
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
8. Work in PR tidak boleh disebut shipped sebelum exact-head merge, live `main` verification, dan post-merge closure selesai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88; terus dijaga current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 23 merged; #125 accepted QA would make 24 if merged |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline on `main`

Merged on verified `main`: **23 active patterns**.

```text
900 / 900 classified
0 unclassified
23 active patterns
choice_grid                 342 / 900 = 38.00%
rule_pipeline                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            72 / 100
```

Science is exactly 60% `choice_grid`. Logic remains above the permanent subject advisory threshold (`>60%`).

## PR #125 Logic Odd One Out — ACCEPTED QA / UNMERGED

Exact Logic Wave A scope:

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

Accepted implementation evidence at head `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`:
- CI #562 exposed a stale Rule Pipeline exclusion sentinel after this exact family was intentionally promoted; the sentinel was replaced with `logic-compare-more-dots`, which must remain `choice_grid`, without weakening Rule Pipeline scope coverage;
- CI #563 passed non-browser product gates and exposed an incorrect browser-test assumption that this stage was naturally unlocked; the progression guard correctly redirected because prior `logic-foundations` readiness is required;
- browser QA was corrected to seed the same canonical qualifying Logic foundation evidence used by existing Sorting Buckets QA, preserving rather than bypassing progression;
- CI #564 / run `34951235607`: **completed / success** across Ubuntu quality gate, Windows compatibility, production build, dependency audit, secret-history scan and Mobile Chromium; production smoke remained normally skipped by workflow condition;
- gameplay-presentation regression and dedicated exact-family regression pass for exactly five `odd_one_out` activities while Rule Pipeline and unrelated Logic families keep their intended classifications;
- deterministic activity-quality artifact verifies **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay-distribution audit verifies **900/900 classified, 24 PR-head patterns, `choice_grid` 337/900 = 37.44%, `odd_one_out` 5/900, Logic 67/100, Science 60/100**;
- simulations and Batch17 complete successfully with canonical catalog totals unchanged;
- browser QA at 320x720, 390x844 and 768x1024 passes canonical Logic foundation progression, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence persistence, >=44px controls, no horizontal overflow and in-viewport success CTA;
- Mobile log explicitly reports: Odd-one-out browser QA passed all 3 representative viewports with canonical Logic foundation progression, keyboard wrong-state, pointer completion, trio layout, CTA and assessed evidence checks;
- manual review of green #564 idle/error/success screenshots at 320/390/768 accepted the visual state; no polish commit required.

PR-head distribution, **not yet merged**:

```text
900 / 900 classified
0 unclassified
24 active patterns
choice_grid                 337 / 900 = 37.44%
odd_one_out                   5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            67 / 100
```

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

Before merge:
- all relevant CI green at **current docs head**;
- visual changes manually reviewed from accepted screenshots;
- review threads/comments checked;
- merge uses exact current `expected_head_sha`.

After merge:
- verify `main` contains the merge;
- update stale QA wording through a docs-only closure;
- never present unmerged work as shipped.

## Current execution order

1. Run full CI on the finalized canonical-docs head of PR #125.
2. Re-check PR comments, submitted reviews, review threads, exact head and mergeability.
3. Exact-head squash merge #125 only if all gates remain green, then verify live `main`.
4. Create and merge a docs-only post-merge closure so 24 patterns become the canonical merged baseline.
5. Start a fresh Logic exact-family audit from the verified 24-pattern baseline; Logic would remain above the advisory threshold at 67%.
6. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit toward 50–60 meaningful patterns.
7. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
