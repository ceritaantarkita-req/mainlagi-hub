# Mainlagi Hub — Current State

Last reviewed: **15 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; active PR work must always be labeled unmerged/QA.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current merged `main` baseline: `e46c9ff13fcf0004edbd36ed36bd638dc02cd4e0`
- latest merged gameplay change: PR #121 — Science Healthy Habit Routine
- latest docs closure: PR #122
- active gameplay branch: `agent/ws05-logic-rule-pipeline-20260915`
- active gameplay PR: #123 — Logic Rule Pipeline
- accepted implementation head: `5def5791d3e3b09fbc680ba52e9e6605695e66c4`
- active PR status: **implementation + CI + visual QA accepted; unmerged**
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

### Merged on `main`: 22 patterns

`choice_grid`, `symbol_hunt`, `listen_choose`, `visible_matching`, `guided_trace`, `story_read`, `motion_game`, `coloring_canvas`, `drawing_canvas`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`.

```text
classified:               900 / 900
unclassified:               0
active patterns:           22
choice_grid               347 / 900 = 38.56%
healthy_habit_routine       4 / 900 = 0.44%
Science choice_grid         60 / 100
Logic choice_grid           77 / 100
```

Science is exactly 60% `choice_grid`; Logic remains above the `>60%` advisory threshold.

### PR #123 `rule_pipeline` — ACCEPTED QA / UNMERGED

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

Accepted evidence at implementation head `5def5791d3e3b09fbc680ba52e9e6605695e66c4`:
- CI #557 / run `34936058944`: **completed / success**;
- Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium passed;
- gameplay-presentation regression: exactly **5 `rule_pipeline`** activities;
- dedicated exact-family regression: PASS for five reviewed Logic Wave D composed-rule activities;
- activity-quality: **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / 0 flagged / structural findings 0**;
- gameplay distribution: **900/900 classified, 23 active patterns, `choice_grid` 342/900 = 38.00%, `rule_pipeline` 5/900, Logic 72/100, Science 60/100**;
- five simulations: `invariantErrors: 0` on every run;
- Batch17: PASS with canonical totals; physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`;
- browser QA at 320x720, 390x844, 768x1024 passed legitimate Logic Wave C progression, keyboard rule-1 execution, visible intermediate state, keyboard wrong-state, pointer completion, false-completion protection, assessed evidence persistence, touch-size, overflow and CTA checks;
- manual review accepted #557 idle/intermediate/error/success screenshots at all three viewports.

PR-head distribution, **not yet merged**:

```text
classified:               900 / 900
unclassified:               0
active patterns:           23
choice_grid               342 / 900 = 38.00%
rule_pipeline               5 / 900 = 0.56%
Science choice_grid         60 / 100
Logic choice_grid           72 / 100
```

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

1. Finalize canonical docs for PR #123 and rerun full CI on the final docs head.
2. Check comments/reviews/review threads, then exact-head squash merge only if all gates remain clean.
3. Verify live `main`, then complete a docs-only post-merge closure so pattern #23 becomes canonical merged baseline.
4. Audit Logic Wave A `odd-one-out` next; it is a coherent five-ID family but must remain a separate wave/PR.
5. Continue objective-fit mechanics toward 50–60 meaningful patterns plus Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
