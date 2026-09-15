# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical merged baseline:** `main` @ `92664642287ecdd64ce408d3d08794a24aa2b588` (Feature Function Link closure PR #120)  
**Latest merged gameplay change:** PR #119 @ `49850145a918afcba4f8279a6f5da12fe4a9c5b8`  
**Active gameplay PR:** #121 — Science Healthy Habit Routine, QA accepted / unmerged  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 21 merged; PR #121 would become pattern #22 |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **21**. Latest gameplay merge is Science Feature Function Link PR #119 `49850145a918afcba4f8279a6f5da12fe4a9c5b8`; docs closure is PR #120 / `92664642287ecdd64ce408d3d08794a24aa2b588`.

```text
900 / 900 classified
0 unclassified
21 active patterns
choice_grid                 351 / 900 = 39.00%
feature_function_link         4 / 900 = 0.44%
Science choice_grid          64 / 100
Logic choice_grid            77 / 100
```

## Healthy Habit Routine PR #121 — QA ACCEPTED / UNMERGED

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

Accepted implementation evidence on PR head `8086670711221dd077c64bdab2eb308040c3db86`:
- initial implementation diff was deliberately cleaned before acceptance; current PR diff is 12 files, +372/-5, with existing-file edits limited to required integrations;
- full CI #552 (`34932904970`) passed Ubuntu quality gate, Windows compatibility, production build, dependency audit, secret scan and Mobile Chromium;
- static gameplay regression reports exactly `4 healthy_habit_routine` activities;
- dedicated static regression passes exactly the four reviewed Science Wave C IDs and preserves `science-match-body-care-c` as visible matching;
- deterministic activity-quality remains **900 KEEP / 0 flagged / structural findings 0**;
- permanent distribution audit verifies **900/900 classified, 22 PR-head patterns, `choice_grid` 347/900 (38.56%), `healthy_habit_routine` 4/900, Science `choice_grid` 60/100, Logic `choice_grid` 77/100**;
- Batch17 remains **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills**; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes legitimate Science Wave B readiness, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence, >=44px controls, no overflow and in-viewport CTA at 320x720, 390x844 and 768x1024;
- manual visual review of CI #552 idle/error/success screenshots at all three viewports is accepted: readable hierarchy, clear error/success states, no clipping/overflow, visible CTA, and balanced tablet layout.

PR #121 is **not shipped yet**. Remaining merge gates: canonical docs-head CI, clean review/comment/thread check, exact-head squash merge, `main` verification and docs-only post-merge closure.

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

1. Finalize PR #121 canonical docs, run final docs-head CI, clear review gate, exact-head merge and post-merge closure.
2. After #121 closure, start a fresh **Logic exact-family audit**. Logic remains the largest assessed choice hotspot at 77/100; Science would be exactly 60/100 and no longer exceeds the >60% advisory threshold.
3. Promote Logic mechanics only when objective/evidence fit is exact; do not lower hotspot counts cosmetically.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics based on objective fit toward 50–60 meaningful patterns.
5. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, then later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
