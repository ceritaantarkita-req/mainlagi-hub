# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical merged baseline:** `main` @ `b61656662f8f6bad8545e7a6236c6bdd07f930ab` (Healthy Habit Routine PR #121)  
**Latest merged gameplay change:** PR #121 @ `b61656662f8f6bad8545e7a6236c6bdd07f930ab`  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 22 merged; next Logic exact-family audit |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **22**. Latest gameplay merge is Science Healthy Habit Routine PR #121 `b61656662f8f6bad8545e7a6236c6bdd07f930ab`.

```text
900 / 900 classified
0 unclassified
22 active patterns
choice_grid                 347 / 900 = 38.56%
healthy_habit_routine         4 / 900 = 0.44%
Science choice_grid          60 / 100
Logic choice_grid            77 / 100
```

Science is now exactly 60% `choice_grid`, so it no longer exceeds the permanent subject advisory threshold (`>60%`). Logic is the next subject hotspot to audit.

## Healthy Habit Routine PR #121 — MERGED

Exact Science Wave C scope:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

Explicit exclusion:

```text
science-match-body-care-c
```

Why this family is coherent:
- all four are assessed `science-body-health-habits` choices in `science-earth-body-environment`;
- all four target canonical skill `science.body.health_habits.basic`;
- all ask the child to choose the healthy everyday habit for one familiar care context;
- the excluded body-care activity remains canonical `matching` / `visible_matching`;
- heterogeneous Science investigation/evidence and mixed-review tasks remain intentionally outside this family.

Interaction/evidence contract:
- visible health focus + familiar routine cue;
- exactly the canonical three answer choices remain accessible buttons;
- wrong choice increments assessed error/retry evidence and cannot complete;
- correct choice completes through the canonical activity identity;
- runtime remains `tap_choice`;
- assessed fidelity `choice_healthy_habit_routine_interaction`;
- activity IDs, choices, `correctChoice`, assessment, stars, progression and skill identity remain canonical.

Accepted and merged evidence:
- initial implementation formatting churn was cleaned before acceptance; accepted implementation head `8086670711221dd077c64bdab2eb308040c3db86` had a reviewable minimal diff;
- implementation CI #552 / run `34932904970` passed Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium;
- final canonical docs head `f530d88d9b94ccddbceb2ec6fba7c661ff252215` passed full CI #553 / run `34933560692`;
- gameplay regression confirms exactly 4 `healthy_habit_routine` activities and preserves `science-match-body-care-c` as visible matching;
- deterministic activity-quality remained **900 KEEP / 0 flagged / structural findings 0**;
- gameplay distribution verified **22 patterns**, 900/900 classified, `choice_grid` 347/900 (38.56%), `healthy_habit_routine` 4/900, Science `choice_grid` 60/100 and Logic `choice_grid` 77/100;
- Batch17 remained PASS with **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills**; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passed legitimate Science Wave B progression, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence persistence, >=44px controls, no overflow and in-viewport success CTA at 320/390/768;
- manual review of green #552 idle/error/success screenshots at 320x720, 390x844 and 768x1024 accepted the visual state;
- final merge gate found 0 issue comments, 0 combined PR comments, 0 submitted reviews and 0 review threads;
- exact-head squash merge produced `b61656662f8f6bad8545e7a6236c6bdd07f930ab`, then live `main` was verified at that SHA.

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

1. Complete this post-merge docs closure for Healthy Habit Routine from verified `main` `b61656662f8f6bad8545e7a6236c6bdd07f930ab`.
2. Start a fresh **Logic exact-family audit** from the verified 22-pattern baseline. Logic remains the largest assessed choice hotspot at 77/100.
3. Promote Logic mechanics only when objective/evidence fit is exact; do not lower hotspot counts cosmetically.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
