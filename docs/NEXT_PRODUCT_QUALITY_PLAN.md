# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Canonical branch:** `main`  
**Latest merged gameplay change:** PR #130 — Logic `set_reasoning`  
**Latest gameplay closure:** PR #131 — Set Reasoning docs closure; metadata PR #132  
**Verified live baseline SHA before Pattern #27:** `7e3192898e37743826266c92c6c12a918d72e508`  
**Active gameplay PR:** #133 — Logic `spatial_transform` — **QA ACCEPTED / UNMERGED**  
**Primary focus:** WS-05 gameplay/mechanic diversification  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi harus terasa seperti produk belajar anak 3–7 tahun yang jelas, menarik, visualnya konsisten, interaction-nya beragam, dan evidence/mastery-nya dapat dipercaya. Target WS-05 adalah minimum **50**, working target **60 meaningful gameplay patterns** melalui reusable interaction engines.

## Mandatory rules

1. Mechanic dipilih karena cocok dengan learning objective, bukan untuk mengejar angka.
2. Assessed activity wajib menjaga atau secara eksplisit memigrasikan evidence contract dengan test.
3. Jangan rewrite mastery/progression/schema tanpa kebutuhan terbukti.
4. Setiap mechanic baru wajib punya exact scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive QA, dan manual visual review.
5. Jangan membuat drag-only interaction; fallback accessible wajib tersedia bila relevan.
6. Gameplay-distribution coverage/pattern-set regression adalah blocking; concentration hanya planning signal.
7. Code merged tanpa canonical docs yang current = pekerjaan belum selesai.
8. Work tidak boleh disebut fully closed sebelum exact-head merge, live `main` verification, dan required post-merge closure selesai.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE / maintained | terus dijaga current |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | **26 merged patterns; Pattern #27 QA accepted in PR #133** |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## Verified merged baseline

Live `main` before active PR #133 remains the fully closed 26-pattern baseline:

```text
900 / 900 classified
0 unclassified
26 active merged patterns
choice_grid                 327 / 900 = 36.33%
set_reasoning                 5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

Distance on merged `main`: **24 patterns** to minimum 50 and **34 patterns** to working target 60.

## Pattern #27 — Logic Spatial Transform — QA ACCEPTED / UNMERGED

Fresh audit from live `main` `7e319289...` selected the exact Wave D family because all five activities share one objective, lesson, pack and skill: determine final direction after rotation or left-right reflection.

Exact scope:

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

Canonical identity:
- stage `logic-mixed-reasoning-challenge`;
- lesson `logic-spatial-transform`;
- pack `logic.pack.spatial-transform`;
- skill `logic.spatial.transform.basic`;
- assessed `tap_choice`;
- exactly three canonical choices;
- runtime, IDs, choices, `correctChoice`, assessment, stars, mastery and progression unchanged.

Pattern: `spatial_transform`.

Interaction/evidence contract:
- board shows starting direction + canonical transform + hidden `?` result slot;
- result is not revealed before assessment;
- canonical choices remain accessible keyboard/touch/pointer buttons;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes the existing activity identity;
- no drag-only dependency, extra confirmation, invented intermediate assessment, or bundling with Wave B spatial-relation objectives;
- assessed fidelity `choice_spatial_transform_interaction`.

Accepted implementation head: `267f00d243dc1778c2d86e5a0ca70d8cfe76872a`.

CI #597 / run `34976080767` is the accepted implementation run:
- Ubuntu quality gate success;
- Windows compatibility success;
- Production build success;
- dependency audit success;
- secret history scan success;
- Mobile Chromium success;
- Production smoke skipped by normal workflow condition.

Permanent evidence on #597:
- exact family regression: exactly `5 spatial_transform`;
- gameplay-presentation regression retains default-family guard;
- 900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0;
- gameplay distribution: 900/900, 27 PR-head patterns, `choice_grid` 322/900 = 35.78%, `spatial_transform` 5/900;
- five simulations `invariantErrors: 0`;
- Batch17 remains 9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills;
- physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

Browser QA passed 320x720, 390x844 and 768x1024 with canonical Wave C readiness, keyboard wrong-state, pointer completion, hidden-result guard, >=44px controls, no horizontal overflow, fully visible idle/retry/success feedback + CTA, assessed evidence, and zero console/page errors. Manual review of all nine idle/try/success screenshots accepted the layout at all three viewports.

If PR #133 is merged unchanged, the baseline becomes 27 patterns with Logic `choice_grid` 52/100, Science still 60/100, and remaining distance **23 to 50 / 33 to 60**. These are PR-head facts only until merge is verified.

## Pattern #26 — Logic Set Reasoning — FULLY CLOSED

Implementation PR #130, closure PR #131, and metadata PR #132 are complete. Verified baseline after #132 is `7e3192898e37743826266c92c6c12a918d72e508`. Pattern #26 remains fully closed; Pattern #27 does not alter its evidence/mastery/progression contract.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, review-thread checks, exact-head merge, live-main verification, and required post-merge closure are current.

## Current execution order

1. Run a fresh full CI on the final Pattern #27 canonical-docs head.
2. Require clean comments/reviews/threads + mergeability, exact-head merge, and independent live-main verification for PR #133.
3. Complete required docs-only post-merge closure and verify that closure live on `main` before calling Pattern #27 fully closed.
4. Only then run a fresh objective/evidence audit for Pattern #28; no family is pre-approved.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
