# NEXT PRODUCT QUALITY PLAN

> Canonical execution plan fase product-quality Mainlagi Hub. Read with `CURRENT_STATE.md`, `ARCHITECTURE.md`, and `GAMEPLAY_VARIATION_CATALOG.md` before changing learning experience.

**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Merged baseline:** `main` @ `8a54534ac285013d22d2fc458bb302ae1fe1a87b`  
**Active gameplay PR:** #110 / `agent/ws05-gameplay-pattern-completion-20260915`  
**Primary focus:** WS-05 gameplay/mechanic diversification  
**Principle:** **Quality first. Quantity later.**

## Product goal

Mainlagi should feel like a coherent learning product for children age 3–7: clear objectives, varied interactions, consistent visuals, and trustworthy evidence/mastery. WS-05 target: minimum **50**, working target **60 meaningful gameplay patterns**, implemented through reusable engines rather than one-off gimmicks.

## Mandatory rules

1. Choose mechanic from the learning objective, not from quota pressure.
2. Preserve assessed evidence contracts or explicitly migrate/test them.
3. Do not rewrite mastery/progression/schema without proven need.
4. Every mechanic needs exact scope regression, progression, completion/evidence, keyboard, touch/pointer, responsive browser QA, and manual visual review.
5. Do not create pointer-only interaction when an accessible fallback is appropriate.
6. Distribution coverage/pattern-set consistency is blocking; concentration is advisory.
7. Code merged without current canonical docs is incomplete work.

## Workstream status

| Workstream | Status | Current note |
|---|---|---|
| WS-01 Canonical docs | DONE | PR #88 |
| WS-02 Voice & narration | TODO | reviewed ID/EN narration |
| WS-03 Public/parent frontend | TODO | parent/public surfaces |
| WS-04 Activity audit/redesign | deterministic clean | 900 KEEP / 0 flagged |
| WS-05 Gameplay diversification | **IN_PROGRESS / PRIMARY** | 16 merged; pattern #17 Pattern Completion QA |
| WS-06 Coloring rebuild | DONE | PR #95/#96 |
| WS-07 Drawing rebuild | DONE | PR #98/#99/#100 |
| WS-08 Art direction / visual QA | TODO / parallel | Art Bible + permanent human gate |
| WS-09 Stage/gallery UX | DONE | PR #89/#90 |
| WS-10 External acceptance | TODO | real devices, accessibility, Iqro expert |
| WS-11 Governance | TODO | required checks/review discipline |
| WS-12 Technical cleanup | TODO LATER | after product quality stabilizes |

## WS-05 merged baseline

Merged patterns on `main`: **16**. Latest gameplay merge: More/Less Balance PR #109 `8a54534ac285013d22d2fc458bb302ae1fe1a87b`.

Merged distribution after #109:

```text
900 / 900 classified
0 unclassified
16 active patterns
choice_grid          371 / 900 = 41.22%
Math choice_grid      61 / 100
Science choice_grid   79 / 100
Logic choice_grid     77 / 100
```

PR #109 acceptance: implementation CI #496 full green; final docs-head CI #501 full green; visual review accepted 320/390/768; review surface clean; evidence fidelity `choice_balance_comparison_interaction`.

## Active PR #110 — Pattern Completion

Exact scope:

```text
math-pattern-ab-shapes
math-pattern-aab-colors
math-pattern-number-step-one
math-pattern-number-step-two
math-pattern-size
```

The matching activities `math-pattern-match-ab` and `math-pattern-match-aab` are intentionally excluded and remain `visible_matching`.

Why this family:
- coherent stage/lesson/skill: `math-banding-bentuk` / pattern sequences / `math.pattern.sequence`;
- all five measure the next element in a repeating or stepping pattern;
- canonical choices can remain unchanged;
- explicit per-activity config avoids brittle prompt parsing.

Interaction/evidence:
- visible observed pattern strip plus one next-slot;
- wrong candidate can fill the slot as feedback but cannot complete;
- keyboard and pointer/touch share the same canonical choice controls;
- runtime remains `tap_choice`;
- IDs, choices/correctChoice, assessment, stars, progression, and completion identity remain canonical;
- fidelity `choice_pattern_completion_interaction` stores pattern kind, visual mode, and observed sequence.

Implementation-head acceptance at `6d79bf3716b65657da67ff0078767800b76b22ed`:
- CI #503 full green across Ubuntu, Windows, build, dependency audit, secret scan, and mobile Chromium;
- deterministic quality remains **900 KEEP / 0 flagged**;
- representative `math-pattern-aab-colors` keeps progression guard active with legitimate prior-stage readiness;
- browser checks canonical AAB sequence/choices, keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px controls, no overflow, and success CTA visibility;
- manual visual review accepted idle/error/success at 320x720, 390x844, and 768x1024.

Measured PR #110 distribution:

```text
900 / 900 classified
0 unclassified
17 active patterns
choice_grid          366 / 900 = 40.67%
pattern_completion     5 / 900 = 0.56%
Math choice_grid       56 / 100
Science choice_grid    79 / 100
Logic choice_grid      77 / 100
```

Math is now below the >60% subject hotspot threshold. After #110, priority should shift to **Science then Logic** based on exact-family review, not continue Math mechanically.

## Next mechanic selection after #110

1. Audit Science choice families first. Prefer objective-native patterns such as `classify_observation`, `predict_result`, `cause_effect`, `compare_properties`, or `observation_checklist` only where catalog payload supports them.
2. Audit Logic choice families next; reuse existing sorting only where the objective truly remains classification, otherwise introduce a distinct mechanic.
3. Revisit Math missing-number / `make_total` only after those hotspot reviews or when a clear pedagogical need appears.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative, and story patterns toward the 60-pattern working target.

## Definition of Done

A mechanic/PR is complete only when current implementation, typecheck/lint/build, engine tests, activity-quality audit, gameplay-distribution audit, routes, progression, evidence, accessibility, mobile UX, screenshot review, canonical docs, final docs-head CI, and review-thread/comment checks are green/current.

Before merge: use exact current `expected_head_sha`. After merge: verify `main` contains the merge and keep canonical docs truthful about merged vs QA state.

Do not prioritize hundreds of new activities, paywall/subscription, OCR rollout, large AI tutor features, marketplace expansion, or major mastery/backend rewrites during this quality phase.
