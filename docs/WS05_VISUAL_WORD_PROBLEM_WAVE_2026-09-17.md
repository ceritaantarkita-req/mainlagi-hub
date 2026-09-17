# WS-05 Pattern #39 — Visual Word Problem — 17 September 2026

Status: **IMPLEMENTATION CANDIDATE / AWAITING EXACT-HEAD CI AND LIVE VERIFICATION**

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

## Permanent QA added

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

Each viewport verifies:

- legitimate prerequisite/progression readiness;
- unchanged canonical story;
- subtraction quantity board `5 -> −2 -> ?`;
- result masked before success and after a wrong answer;
- three canonical answer labels/order;
- keyboard wrong-answer path;
- pointer correct-answer completion;
- touch-target floor and no horizontal overflow;
- assessed attempt source/fidelity/count/accuracy/retry metadata;
- idle, wrong and success screenshots;
- no page or console errors.

The browser suite is wired into the blocking mobile-route QA chain. The focused regression is wired into the blocking learning/engine chain. Gameplay-distribution expects Pattern #39 explicitly.

## Expected distribution after implementation

```text
activities classified:          900 / 900
active merged patterns:          39
choice_grid                     267 / 900
visual_word_problem               5 / 900
```

The exact counts remain a CI assertion/evidence result, not a reason to keep the mechanic if objective/evidence tests fail.

## Acceptance gate

Do not mark Pattern #39 fully closed until all are complete:

1. exact-head implementation CI is fully green;
2. focused browser screenshots are manually reviewed;
3. gameplay distribution remains 900/900 with exactly 39 patterns;
4. PR scope/reviews/threads/behind gate is clean;
5. exact implementation head is squash-merged;
6. independent merged-main CI passes, including exact Cloudflare release/public smoke;
7. separate canonical live-closure docs are merged and independently verified.

Until those gates pass, this file is an implementation candidate record rather than a closure claim.
