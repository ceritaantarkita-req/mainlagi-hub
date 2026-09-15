# WS-05 Logic Rule Pipeline Wave — 2026-09-15

Status: **IMPLEMENTATION COMPLETE / CI + VISUAL QA PENDING**

Baseline: `main` @ `e46c9ff13fcf0004edbd36ed36bd638dc02cd4e0` (Healthy Habit Routine closure PR #122).

## Audit decision

After Science reached exactly 60/100 `choice_grid`, the next audit moved to Logic, which remains the largest assessed choice hotspot at 77/100. A fresh Wave A–D review kept spatial, set reasoning, inference, odd-one-out and composed-rule objectives separate rather than combining them for concentration reduction.

The strongest first Logic family is Wave D `logic-composed-rules`: five assessed activities in one lesson, one stage and one canonical skill, all requiring the child to apply two rules in sequence without losing the intermediate step.

Exact scope:

```text
logic-compose-red-circle-to-star
logic-compose-small-left-then-up
logic-compose-two-to-blue
logic-compose-triangle-turn-right
logic-compose-swap-then-grow
```

Nearby Logic tasks remain explicitly outside this family, including conditional one-step rules, set reasoning, transitive inference, spatial half-turns and odd-category discrimination.

## Pattern #23

Pattern: `rule_pipeline`.

Interaction contract:
- show the canonical start state and rule 1;
- child explicitly runs rule 1 with an accessible button;
- reveal the deterministic intermediate state;
- show rule 2 and keep the canonical three final choices as the assessed answer set;
- final choices are disabled until rule 1 has been executed;
- wrong final answer increments assessed error/retry evidence and cannot complete;
- correct final answer completes the canonical activity identity;
- no invented intermediate multiple-choice assessment and no drag-only interaction.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, canonical final choices and `correctChoice` remain unchanged;
- skill remains `logic.rule.composition.basic`;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_rule_pipeline_interaction`.

## Intended distribution

```text
900 / 900 classified
0 unclassified
23 active patterns
choice_grid            342 / 900 = 38.00%
rule_pipeline            5 / 900 = 0.56%
Logic choice_grid       72 / 100
Science choice_grid     60 / 100
```

This reduction is a consequence of objective-fit, not the reason for selecting the mechanic.

## Required acceptance

1. Exact classifier/config/static regression for five IDs only.
2. Nearby one-step/spatial/set/inference/odd-category Logic tasks remain canonical `choice_grid`.
3. Dedicated browser QA at 320x720, 390x844 and 768x1024 with legitimate Wave C readiness.
4. Keyboard execution of rule 1, visible intermediate state, keyboard wrong final state, pointer correct completion, false-completion guards, assessed evidence persistence, >=44px controls, no overflow and in-viewport success CTA.
5. Full CI, deterministic activity-quality audit, gameplay-distribution audit and Batch17 acceptance remain green.
6. Manual review of idle/intermediate/error/success screenshots from a green run.
7. Canonical docs finalization, final docs-head CI, clean review gate, exact-head merge and post-merge docs closure before calling pattern #23 shipped.

## Next Logic candidates after this wave

Wave A `logic-odd-one-out` is another coherent five-ID family and can be audited next after `rule_pipeline` is fully closed. It must not be bundled into this PR merely to increase pattern count.
