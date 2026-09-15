# WS-05 Set Reasoning Wave — 2026-09-15

Status: **QA ACCEPTED / UNMERGED**

Branch: `agent/ws05-logic-set-reasoning-20260915`

PR: #130 — `feat: add Logic set-reasoning gameplay`

Base: verified live `main` at `4a146b1f188eb90c612a8cf4dd0285363d5f6738` after Transitive Chain closure metadata PR #129.

Accepted implementation head: `acc5ce9d5661818842effcd120346ded3891dd50`.

## Objective

Add one meaningful Logic gameplay pattern for the exact Wave D set-reasoning family without changing canonical activity identity, runtime, assessment, mastery, progression, choices, or correct answers.

Pattern: `set_reasoning`.

## Exact scope

```text
logic-set-both-red-round
logic-set-animal-not-bird
logic-set-shape-not-square
logic-set-only-blue-triangle
logic-set-outside-round-red
```

All five share:
- subject `logic`;
- stage `logic-mixed-reasoning-challenge`;
- lesson `logic-set-reasoning`;
- pack `logic.pack.set-reasoning`;
- canonical skill `logic.set.relation.basic`;
- assessed `tap_choice` runtime;
- exactly three canonical choices;
- objective: determine category membership, intersection of two properties, exclusion, or being outside two target sets.

## Explicit exclusions

These nearby families stay outside `set_reasoning`:

```text
logic-compose-red-circle-to-star
logic-transitive-height-abc
logic-spatial-halfturn-up
logic-infer-not-red
logic-classify-red-round
```

No other Logic family is reclassified by this wave.

## Interaction design

Use an explicit two-rule set board instead of a generic three-button quiz:
- each rule is visible as `harus masuk` or `harus di luar`;
- the operation is named (`Irisan A ∩ B`, `A tetapi bukan B`, or `Di luar A ∪ B`);
- the child evaluates all rules together and taps one of the unchanged canonical choices;
- wrong choice is retryable and cannot complete;
- correct choice completes the canonical assessed activity;
- no false Venn geometry is used for subset cases such as birds within animals;
- no drag-only dependency;
- no extra confirmation or invented intermediate assessment.

Assessed evidence fidelity: `choice_set_reasoning_interaction`.

Runtime metadata records:
- source `set-reasoning-runtime`;
- the two explicit set rules and their membership state;
- operation label;
- selected canonical member;
- rule count 2;
- standard assessed correct/incorrect/retry/accuracy fields.

## Accepted PR-head distribution

CI #586 / run `34969198343` on accepted implementation head reports:

```text
classified:                900 / 900
unclassified:                0
active PR-head patterns:    26
choice_grid                327 / 900 = 36.33%
set_reasoning                5 / 900 = 0.56%
Science choice_grid          60 / 100
Logic choice_grid            57 / 100
```

If merged unchanged, remaining distance becomes **24 patterns to minimum 50** and **34 to working target 60**.

## QA history

### CI #583 — rejected

Run `34968050234` failed Ubuntu Engine tests because `run-rule-pipeline-tests.mjs` still contained a stale sentinel asserting that `logic-set-both-red-round` must remain `default` / `choice_grid`.

That expectation became obsolete only because this exact activity was intentionally promoted to `set_reasoning`. The fix was narrow: Rule Pipeline still guards exactly its five canonical IDs, and the Set Reasoning activity remains explicitly outside Rule Pipeline scope.

### CI #584 — automated green, manual visual rejection

Run `34968353606` passed the required automated jobs and confirmed:
- exact five `set_reasoning` presentation regression;
- 900 KEEP / zero flagged / structural findings 0;
- 26 active patterns and expected distribution;
- five simulations with zero invariant errors;
- unchanged Batch17 totals;
- Chromium browser matrix completed.

Manual review of the generated screenshots found a real UI defect at **320x720**: the idle and wrong-state feedback card extended below the viewport. Therefore #584 was not accepted despite automated green status.

The narrow-phone layout was tightened, and browser QA was strengthened so idle feedback, retry feedback, success feedback, and the success CTA must each be fully inside the viewport.

### CI #586 — accepted implementation run

Run `34969198343` on head `acc5ce9d5661818842effcd120346ded3891dd50` passed:
- Quality gate Ubuntu — success;
- Windows compatibility — success;
- Production build — success;
- Production dependency audit — success;
- Secret history scan — success;
- Mobile route QA Chromium — success;
- Production smoke — skipped by normal workflow condition.

Permanent evidence from #586:
- exact-family Set Reasoning regression PASS for exactly five activities;
- gameplay-presentation regression includes exactly `5 set_reasoning`;
- gameplay distribution: 900/900 classified, 26 active patterns, `choice_grid` 327/900, `set_reasoning` 5/900, Logic 57/100, Science 60/100;
- activity-quality: 900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0;
- five simulations: `invariantErrors: 0`;
- Batch17: 9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills;
- physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

Manual visual review of fresh #586 screenshots accepted all nine representative states:
- 320x720 idle / try / success;
- 390x844 idle / try / success;
- 768x1024 idle / try / success.

Observed acceptance:
- feedback/status is fully visible at 320 after the responsive fix;
- success CTA is fully visible;
- no horizontal overflow;
- no clipping or overlap;
- two-rule relationship remains visually central;
- wrong-state and success-state hierarchy are clear;
- 390 and 768 layouts remain stable after the narrow-phone change.

Screenshot artifact from #586:
- `mobile-route-qa-screenshots`
- artifact ID `10396139858`
- digest `sha256:b23e06780a9896613ea3203f8e347377ed0474de62aaf18599679c2bf4909155`.

Activity-quality artifact:
- artifact ID `10397140187`
- digest `sha256:f261f14eb3867175e6b319b486725d62e424a53916cdff727f1d24d8641f8989`.

Gameplay-distribution artifact:
- artifact ID `10396359062`
- digest `sha256:6859402e7f29f77e9c6697603598864d146e824728d4f932abe7bf64372f2d45`.

## Remaining gates before merge

1. canonical docs must be current on the PR head;
2. fresh exact docs-head CI must complete successfully;
3. PR #130 must remain open, non-draft and mergeable at that exact head;
4. PR conversation comments, submitted reviews and review threads must be clean;
5. exact-head squash merge must use the final tested head;
6. returned merge SHA must be independently verified live on `main`;
7. required docs-only closure PR must then update the merged baseline and itself pass full CI + clean gate + exact-head merge + live-main verification.

Until those steps complete, Pattern #26 is **QA accepted but unmerged**, not shipped and not fully closed.
