# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Semua human/AI agent wajib membaca dokumen ini, `CURRENT_STATE.md`, `ARCHITECTURE.md`, dan `GAMEPLAY_VARIATION_CATALOG.md` sebelum mengubah learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `6c5566ea9465a26399f9c4637f252d316552636d`  
**Active gameplay PR:** none during this docs closure  
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
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 17 merged; Science next |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **17**. Latest gameplay merge is Pattern Completion PR #110 `6c5566ea9465a26399f9c4637f252d316552636d`.

Merged distribution:

```text
900 / 900 classified
0 unclassified
17 active patterns
choice_grid          366 / 900 = 40.67%
pattern_completion     5 / 900 = 0.56%
more_less_balance      6 / 900 = 0.67%
number_line             6 / 900 = 0.67%
Math choice_grid       56 / 100
Science choice_grid    79 / 100
Logic choice_grid      77 / 100
```

Math is now below the >60% subject hotspot threshold. Science and Logic are the next concentration targets, but each mechanic still requires exact-family objective fit.

## Pattern Completion PR #110 — DONE

Exactly five Math Wave B choice activities now use `pattern_completion`; the two matching pattern activities remain `visible_matching`. Implementation CI #503 and final docs-head CI #508 were full green. Browser + manual visual QA accepted 320/390/768. Evidence fidelity is `choice_pattern_completion_interaction`. Merge: `6c5566ea9465a26399f9c4637f252d316552636d`.

## Next mechanic review — Science `cause_effect`

Current strongest exact family from the Science hotspot audit is the Wave B water-change lesson, skill `science.water.state_changes.basic`:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

Why this family is a strong candidate:
- one lesson and one assessed skill;
- each activity explicitly connects a condition/event to a resulting state change;
- a cause/effect board can represent the learning objective more directly than another generic answer grid;
- exactly four choice activities can be allowlisted without converting the related matching activity `science-match-water-states-b`;
- canonical choices/correctChoice and progression can remain intact.

Proposed interaction contract for review/implementation:
- present a visible **cause card → effect/result choices** flow;
- explicit per-activity config, no fragile prompt parsing;
- wrong choice remains retryable and cannot complete;
- assessed evidence should distinguish the cause/effect interaction, likely `choice_cause_effect_interaction`;
- keyboard and touch/pointer must use the same answer controls;
- exact four-ID allowlist; the matching water-state activity remains canonical matching.

Do not code broader Science families into the same PR. Prediction/investigation, materials, observation/measurement, and environment reasoning remain separate mechanic candidates.

## Definition of Done

A mechanic/PR is complete only when implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread checks are current.

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

1. Merge the Pattern Completion docs closure.
2. Start Science `cause_effect` on the exact four Wave B water-change activities from latest `main`.
3. Re-run distribution and continue Science family audit while Science remains concentrated.
4. Audit Logic exact families after Science.
5. Revisit Math missing-number / make-total only when objective fit warrants it.
6. Continue toward 50–60 meaningful patterns using permanent audit evidence.
7. Continue WS-08 visual system, WS-02 narration, WS-03 parent/public frontend, WS-10 external acceptance, WS-11 governance, and later cleanup.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
