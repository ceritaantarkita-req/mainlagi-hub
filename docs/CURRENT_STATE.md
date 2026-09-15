# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- latest verified gameplay baseline: `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1`
- latest merged gameplay change: PR #123 — Logic Rule Pipeline
- active gameplay branch: none
- active gameplay PR: none
- post-merge docs closure branch: `agent/ws05-rule-pipeline-closure-20260915`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, and permanent gameplay-distribution audit.

External physical-device, accessibility specialist, art/pedagogical human acceptance, and Iqro expert acceptance remain separate and incomplete.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged gameplay baseline: 23 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`.

```text
classified:               900 / 900
unclassified:               0
active patterns:           23
choice_grid               342 / 900 = 38.00%
rule_pipeline               5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           72 / 100
```

Science is exactly 60% `choice_grid`. Logic remains above the `>60%` advisory threshold and is the next subject hotspot.

### PR #123 `rule_pipeline` — MERGED

Exact scope:

```text
logic-compose-red-circle-to-star
logic-compose-small-left-then-up
logic-compose-two-to-blue
logic-compose-triangle-turn-right
logic-compose-swap-then-grow
```

All five share stage `logic-mixed-reasoning-challenge`, lesson `logic-composed-rules`, canonical skill `logic.rule.composition.basic`, assessed choice evidence, and the objective of applying two rules in sequence without losing the intermediate step.

Nearby one-step conditional rules, set reasoning, transitive comparison, spatial transforms and odd-one-out remain outside the family.

Interaction/evidence contract:
- start state + rule 1 are visible;
- explicit accessible execution of rule 1 reveals a deterministic intermediate state;
- rule 2 then uses the canonical three final choices;
- final choices cannot be used before rule 1;
- wrong final answer increments assessed error/retry and cannot complete;
- correct final answer completes canonical activity identity;
- runtime remains `tap_choice`;
- canonical IDs, choices, `correctChoice`, skill, assessment, stars and progression remain unchanged;
- assessed fidelity `choice_rule_pipeline_interaction`.

Accepted and merged evidence:
- implementation head `5def5791d3e3b09fbc680ba52e9e6605695e66c4` passed CI #557 / run `34936058944`;
- final docs head `3bb4684ae69fcd76a354b6b319fbe9992e6a50d3` passed CI #558 / run `34937511724`;
- Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium passed;
- gameplay-presentation regression and dedicated exact-family regression pass for exactly five Rule Pipeline activities;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0;
- gameplay distribution verifies 900/900 classified, 23 patterns, `choice_grid` 342/900 (38.00%), Logic 72/100 and Science 60/100;
- five simulations report zero invariant errors;
- Batch17 remains PASS with canonical catalog totals; `physicalDeviceCertification` remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA passes legitimate Logic Wave C progression, keyboard rule-1 execution, visible intermediate state, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence, touch sizing, overflow and CTA checks at 320/390/768;
- manual screenshot review accepted idle/intermediate/error/success states at 320x720, 390x844 and 768x1024;
- final review gate had **0 PR comments, 0 submitted reviews and 0 review threads**;
- exact-head squash merge produced `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1` and live `main` was verified at that SHA.

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

1. Merge the Rule Pipeline docs-only post-merge closure from verified gameplay `main` `2d5b71ca2c8662c1ab2cd98cc83a7a7f7f873de1`.
2. Audit Logic Wave A `odd-one-out` from the verified 23-pattern baseline.
3. Promote only objective-coherent/evidence-safe mechanics; do not combine unrelated tasks merely to lower concentration counts.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
