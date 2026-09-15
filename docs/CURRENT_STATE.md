# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- verified live `main` before Pattern #27: `7e3192898e37743826266c92c6c12a918d72e508`
- latest merged gameplay implementation: PR #130 — Logic Set Reasoning
- latest completed Set Reasoning closure chain: PR #131 + metadata PR #132
- Pattern #26: **FULLY CLOSED**
- active gameplay PR: #133 — Logic Spatial Transform — **QA ACCEPTED / UNMERGED**
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Verified merged `main`: 26 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`.

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    26
choice_grid               327 / 900 = 36.33%
set_reasoning               5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           57 / 100
```

Distance on merged `main`: **24** patterns to minimum 50 and **34** to working target 60.

### Active PR #133 head: 27 patterns — QA accepted / unmerged

Pattern #27 is `spatial_transform`, limited to exactly five assessed Logic Wave D activities:

```text
logic-spatial-halfturn-up
logic-spatial-quarterturn-left
logic-spatial-quarterturn-right-down
logic-spatial-two-right-turns
logic-spatial-mirror-left-right
```

All five share stage `logic-mixed-reasoning-challenge`, lesson `logic-spatial-transform`, pack `logic.pack.spatial-transform`, canonical skill `logic.spatial.transform.basic`, assessed `tap_choice`, exactly three canonical choices, and the objective of determining final direction after rotation or left-right reflection.

Preserved contract:
- canonical runtime, IDs, prompts, choices and `correctChoice` remain unchanged;
- assessment, stars, mastery, progression and activity completion semantics remain unchanged;
- board shows starting direction + operation + hidden `?` result slot;
- answer is not revealed before assessment;
- canonical choices remain keyboard/touch/pointer accessible;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes the canonical activity;
- no drag-only dependency, extra confirmation or invented intermediate assessment;
- Wave B spatial-relation tasks remain outside scope;
- assessed fidelity `choice_spatial_transform_interaction`.

Accepted implementation head `267f00d243dc1778c2d86e5a0ca70d8cfe76872a` passed full CI #597 / run `34976080767`. Permanent evidence on that run:

```text
900 / 900 classified
0 unclassified
27 PR-head patterns
choice_grid               322 / 900 = 35.78%
spatial_transform           5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           52 / 100
activity quality           900 KEEP / 0 flagged / structural 0
simulations                5 runs / invariantErrors 0
```

Browser QA passed 320x720, 390x844 and 768x1024 with legitimate prerequisite evidence, keyboard wrong-state, pointer completion, hidden-result guard, >=44px controls, no horizontal overflow, visible feedback/CTA, assessed evidence and zero console/page errors. Manual review accepted all nine idle/try/success screenshots.

PR #133 remains unmerged until the finalized canonical-docs head passes a fresh full CI and the final comments/reviews/threads + mergeability gate is clean. If #133 merges unchanged, remaining distance becomes **23 to minimum 50 / 33 to working target 60**.

## Pattern #26 `set_reasoning` — FULLY CLOSED

Exact scope remains:

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

Set Reasoning implementation PR #130, closure PR #131 and metadata PR #132 are complete. The verified baseline after #132 is `7e3192898e37743826266c92c6c12a918d72e508`. Pattern #27 does not change Set Reasoning runtime, evidence, mastery, progression or canonical identity.

## Deterministic activity-quality baseline

```text
900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings: 0
Q101–Q108: 0
```

This is deterministic engineering triage, not human pedagogical/art/expert approval.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:
- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Finish Pattern #27 final docs-head CI on PR #133.
2. Require clean comments/reviews/threads + mergeability, exact-head merge, and independent live-main verification.
3. Complete the docs-only post-merge closure, closure CI/gate/merge, and final live-main verification before calling Pattern #27 fully closed.
4. Only then run a fresh objective/evidence audit for Pattern #28; no family is pre-approved.
5. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
6. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
