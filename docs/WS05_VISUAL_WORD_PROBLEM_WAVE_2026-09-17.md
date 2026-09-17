# WS-05 Pattern #39 — Visual Word Problem — 17 September 2026

Status: **IMPLEMENTATION MERGED / LIVE VERIFIED / DOCS CLOSURE IN PROGRESS**

Audit source: `PATTERN39_OBJECTIVE_EVIDENCE_AUDIT_2026-09-17.md`  
Implementation base: `f8ac7e630392a9bd015d8ed59fe4c275f113ab37`

## Exact scope

```text
math-problem-apples
math-problem-birds
math-problem-cars
math-problem-cookies
math-problem-balloons
```

Pattern name:

```text
visual_word_problem
```

Canonical contract preserved:

- subject `math`;
- stage `math-ukur-ruang`;
- lesson `math-visual-problems`;
- pack `math.pack.visual-problems`;
- skill `math.problem.visual`;
- assessed `tap_choice` runtime;
- `choice_accuracy_v1` evidence semantics;
- unchanged IDs, prompts, choice labels/order and `correctChoice`;
- unchanged mastery, progression, content schema and database.

## Presentation

The canonical story remains the primary child-facing prompt. A dedicated quantity-change board represents:

```text
starting quantity -> story change -> unknown final quantity
```

Addition uses a positive incoming change; subtraction uses a leaving/removal change. The final quantity stays hidden as `?` until the correct canonical answer is selected.

This is intentionally not a renamed `make_total` or `take_away` activity. Those mechanics begin from direct arithmetic tasks; Pattern #39 begins from a canonical everyday story and visualizes the story's quantity transition.

## Interaction/evidence behavior

- three canonical numeric answers remain direct buttons;
- keyboard, touch and pointer remain primary input paths;
- wrong choice increments measured incorrect/retry state, remains retryable and cannot complete;
- wrong choice does not reveal the result;
- correct choice completes through the existing activity/evidence path;
- runtime metadata source is `visual-word-problem-runtime`;
- assessed evidence fidelity is `choice_visual_word_problem_interaction`;
- metadata records `startCount`, `changeCount`, `operation` and `selectedChoice`.

## Fail-closed classifier

`visualWordProblemConfig` accepts only the five audited IDs when all of these remain true:

- Math subject;
- `math-ukur-ruang` stage;
- `tap_choice` runtime;
- exactly three unique numeric choices;
- numeric canonical `correctChoice` included in choices;
- explicit deterministic config result equals canonical `correctChoice`;
- prompt and presentation labels are present.

No arbitrary Indonesian prompt parsing is used.

## Permanent QA

Regression coverage checks:

- exact five-activity classification;
- frozen canonical prompt/choice/correct-answer fixtures;
- `math.problem.visual` assessed skill evidence preserved;
- deterministic addition/subtraction configs resolve to canonical answers;
- non-scope and malformed activities fail closed;
- Pattern #39 canonical taxonomy classification.

Responsive browser QA checks representative `math-problem-birds` at:

```text
320x720
390x844
768x1024
```

Each viewport verifies legitimate progression readiness, unchanged canonical story, subtraction quantity board, hidden result before success, canonical answer order, keyboard wrong path, pointer correct completion, touch-target floor, no overflow, assessed evidence metadata, screenshots, and no page/console errors.

## Verified implementation chain

```text
Audit PR:            #169
Implementation PR:   #170
Implementation head: df503b95abf86e2b530dd9ff18bd5d8b9707e2db
Merge/main:          bcb8479514f44d46ebc68917981699240aabc3b2
Main CI:             #809 / run 35187506724 — full success
Cloudflare smoke:    success
```

Main CI #809 passed production build, dependency/security checks, Windows, Ubuntu quality gate, engine/learning tests, activity-quality and gameplay-distribution audits, simulations/final acceptance, mobile Chromium QA/permanent visual baseline, and exact Cloudflare release/public smoke.

Gameplay-distribution artifact:

```text
id:     10482459288
digest: sha256:4bacc984852eb4befd352a727935daf8e75cb0b30ec1a58af8451895649ae967
```

Verified distribution:

```text
activities classified:          900 / 900
unclassified:                     0
active merged patterns:          39
choice_grid                     267 / 900
visual_word_problem               5 / 900
```

## Remaining closure gate

Implementation is already live verified. Remaining work is documentation/governance only:

1. synchronize canonical current-state, quality-plan, gameplay-catalog and docs index;
2. add dedicated Pattern #39 closure evidence;
3. run fresh exact-head CI on the docs-only closure branch;
4. require clean intended scope, no unresolved review/thread issue and mergeability;
5. squash-merge exact closure head;
6. require independent merged-main CI including exact Cloudflare release/public smoke.

Only after those gates may Pattern #39 be called **FULLY CLOSED**. After closure, Pattern #40 must start from a fresh objective/evidence audit with no mechanic pre-approved.
