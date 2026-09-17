# WS-05 Pattern #41 — Phrase Scene Match Wave

Date: **17 September 2026**  
Status: **IMPLEMENTATION IN PROGRESS / NOT MERGED / NOT PRODUCTION-ACCEPTED**

## Audit gate already closed

Pattern #41 objective/evidence audit merged through PR #179.

```text
Audit main:           917e933b2d69db3d014b98f3aa49bb6962aec992
Merged-main CI:       #860 / run 35223876877
CI conclusion:        success
Cloudflare smoke:     success
```

Implementation starts from that exact verified main.

## Exact implementation scope

```text
english-phrase-red-ball
english-phrase-two-books
english-phrase-small-cat
english-phrase-yellow-banana
```

Canonical ownership:

```text
subject:     english
stage:       english-phrases-review
lesson:      english-simple-phrases
pack:        english.pack.simple-phrases
skill:       english.phrase.literal
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

Out of scope:

- `english-listen-phrase-blue-book`;
- all `english-complete-*` activities;
- generic English vocabulary, opposites and unrelated phrase families;
- arbitrary prompt/phrase parsing;
- translation checkpoints;
- speech scoring;
- drag-only assessed interaction;
- mastery, progression, schema or database rewrites.

## Implementation design

Pattern name:

```text
phrase_scene_match
```

The implementation keeps the existing assessed choice contract while adding deterministic visual semantic scenes for every canonical answer option.

Semantic dimensions covered across the four activities:

```text
color
quantity
size
noun
```

Every canonical choice is explicitly configured. The runtime does not infer scenes from arbitrary English text.

### Canonical invariants

The implementation must preserve, byte-for-byte where applicable:

- activity IDs;
- prompts;
- visible choice labels and order;
- `correctChoice`;
- `tap_choice` runtime ownership;
- assessed status;
- `choice_accuracy_v1` evidence contract;
- lesson, pack and skill ownership;
- retry and completion semantics;
- mastery and progression behavior.

## Runtime evidence contract

Wrong selections:

- increment incorrect/retry counts;
- remain retryable;
- do not complete the activity.

Correct selection:

- completes through the existing learning runtime measurement path;
- preserves accuracy as `1 / (1 + incorrectCount)`;
- records canonical answer string as the selected choice;
- does not redefine mastery qualification.

Implementation metadata:

```text
source:            phrase-scene-match-runtime
evidenceFidelity:  choice_phrase_scene_interaction
targetPhrase:      explicit config value
selectedChoice:    canonical answer string
featureKinds:      deterministic semantic dimensions
```

## Files introduced/changed in implementation branch

Core implementation:

- `src/lib/learning/phraseSceneMatchConfig.ts`
- `src/components/learning/PhraseSceneMatchActivity.tsx`
- `src/components/learning/PhraseSceneMatchActivity.module.css`
- `src/lib/learning/gameplayPatternClassifier.ts`
- `src/app/child/[childId]/activity/[activity]/page.tsx`

Regression / QA:

- `scripts/run-phrase-scene-match-tests.mjs`
- `scripts/run-phrase-scene-match-browser-tests.mjs`
- `scripts/audit-gameplay-distribution.mjs`
- `tsconfig.learning-tests.json`
- `package.json`

Canonical docs:

- `docs/CURRENT_STATE.md`
- `docs/GAMEPLAY_VARIATION_CATALOG.md`
- `docs/NEXT_PRODUCT_QUALITY_PLAN.md`
- `docs/README.md`
- this wave record.

## Automated regression contract

`run-phrase-scene-match-tests.mjs` must prove:

1. exactly four activities classify as Pattern #41;
2. no listening/cloze/vocabulary/opposite activity leaks into the scope;
3. canonical prompt, choices/order and correct answer remain unchanged;
4. exact authoring ownership remains `english-simple-phrases` / `english.pack.simple-phrases` / `english.phrase.literal`;
5. manifest runtime remains `tap_choice`, assessed, `choice_accuracy_v1`;
6. all twelve canonical choices have deterministic scenes;
7. semantic scene target is unique for each activity;
8. changed prompt/order/correct answer/stage/subject/runtime fails closed.

## Browser QA contract

Representative activity:

```text
english-phrase-small-cat
```

Viewports:

```text
320x720
390x844
768x1024
```

The browser test must prove:

- legitimate English prerequisite readiness reaches the exact route;
- canonical prompt remains visible;
- three canonical choice labels stay in canonical order;
- scenes expose size/noun/quantity contrast deterministically;
- no horizontal overflow;
- every answer control keeps at least a 44px touch target;
- keyboard can submit a wrong answer;
- wrong answer does not complete;
- pointer can submit the correct answer;
- correct answer completes;
- idle/wrong/success feedback remains visible;
- success CTA remains visible;
- assessed attempt records one incorrect + one retry + one correct and accuracy `0.5`;
- runtime metadata matches the Pattern #41 contract;
- page/console errors remain empty;
- idle/wrong/success screenshots are captured for all three viewports.

## Distribution acceptance target

Implementation branch acceptance requires exactly:

```text
activities:          900
classified:          900
unclassified:          0
active patterns:      41
choice_grid:         257
phrase_scene_match:    4
```

This is a branch acceptance target only until the implementation is merged and merged-main verification succeeds.

## Full CI gate

Before implementation merge, the exact final PR head must pass:

- structure/source/asset validation;
- security boundary regression;
- physical-device QA harness contract;
- TypeScript typecheck;
- lint;
- full engine + learning tests, including Pattern #41 exact-scope regression;
- deterministic activity-quality audit;
- gameplay-distribution audit;
- simulations;
- Batch 17 final acceptance contracts;
- Windows compatibility;
- production dependency audit;
- Cloudflare/OpenNext production build;
- aggregate responsive/mobile route QA including dedicated Pattern #41 browser QA;
- permanent visual product baseline.

PR production smoke may be skipped by workflow design. After merge, resulting `main` must independently pass exact Cloudflare production smoke before implementation-complete status.

## Closure rule

Even after implementation merge + merged-main verification, Pattern #41 is not **FULLY CLOSED** until a separate closure-docs PR records the final implementation SHA, merged-main CI, production smoke, verified distribution and remaining next gate.
