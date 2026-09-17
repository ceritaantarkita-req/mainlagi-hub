# WS-05 Pattern #42 Growth Stage Transition Wave — 18 September 2026

Status: **IMPLEMENTATION IN PROGRESS / PR #187 / NOT MERGED**

## Verified implementation base

Pattern #42 audit:

```text
Audit PR:          #186
Audit main:        541c2348507e976fb723c9c6e5b8f1b242cff490
Audit main CI:     #871 / run 35255083348
Result:            full success including exact Cloudflare production smoke
```

Merged production truth at implementation start remains:

```text
classified:        900 / 900
unclassified:        0
active patterns:    41
choice_grid        257 / 900
```

## Implementation PR

```text
PR:      #187
Branch:  agent/p42-growth-stage-transition-20260918
Base:    541c2348507e976fb723c9c6e5b8f1b242cff490
Pattern: growth_stage_transition
```

This wave must not be described as merged, live or fully closed until exact-head CI, merge, merged-main CI and Cloudflare production smoke all pass.

## Exact scope

```text
science-cycle-frog
science-cycle-chick
science-cycle-seed-sprout
```

Explicitly outside scope:

```text
science-cycle-butterfly
science-match-young-adult-b
all unrelated Science activities
```

## Canonical ownership preserved

```text
subject:     science
stage:       science-life-material-motion
lesson:      science-life-cycles
pack:        science.pack.life-cycles
skill:       science.life_cycles.basic
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

No canonical activity ID, prompt, choice order, submitted answer string, `correctChoice`, mastery rule, progression rule, schema or database record is rewritten by this implementation.

## Implemented interaction contract

Pattern #42 uses an explicit deterministic two-stage transition board:

- the known biological stage is visible;
- the target growth-stage slot is visibly unknown before completion;
- forward/backward direction follows the audited transition mode;
- all three canonical choices retain their exact label/order/submitted value;
- each choice receives an equivalent deterministic visual affordance;
- wrong selection keeps the target hidden, increments incorrect/retry evidence and cannot complete;
- the target is revealed only after the canonical correct choice is selected;
- keyboard, touch and pointer use the same native button controls;
- no drag-only requirement, prompt parser, extra assessed checkpoint, timing score or speech scoring is introduced.

Transition modes:

```text
science-cycle-frog         previous_stage / backward
science-cycle-chick        next_adult_stage / forward
science-cycle-seed-sprout  next_young_stage / forward
```

## Runtime evidence

Canonical `choice_accuracy_v1` semantics remain primary. Presentation metadata adds only interaction identity:

```text
source:           growth-stage-transition-runtime
evidenceFidelity: choice_growth_stage_transition_interaction
transitionMode
selectedChoice
```

Accuracy remains `1 / (1 + incorrectCount)` for assessed completion, matching the existing measured direct-choice implementation convention.

## Fail-closed configuration

`growthStageTransitionConfig()` returns a config only when all audited assumptions remain exact:

- subject is Science;
- stage is `science-life-material-motion`;
- runtime is `tap_choice`;
- ID is one of the three audited IDs;
- prompt is byte-preserved;
- three choices are byte-preserved and ordered;
- `correctChoice` is byte-preserved;
- deterministic visual scenes map one-to-one to canonical choices;
- exactly one scene maps to the audited target stage;
- transition mode and direction remain consistent.

Any drift falls back instead of silently absorbing a changed activity into Pattern #42.

## Regression and browser gates added

### Exact-scope regression

`scripts/run-growth-stage-transition-tests.mjs` verifies:

- exact three-ID classification;
- all canonical prompts/choices/correct answers;
- Wave B authoring ownership;
- content-pack lesson/mechanic/assessment/evidence/skill ownership;
- all three transition modes;
- all nine deterministic choice scenes;
- fail-closed mutations;
- butterfly and life-cycle matching exclusions;
- existing `cause_effect`, `relative_order_track` and matching classification remain unchanged.

### Browser QA

`scripts/run-growth-stage-transition-browser-tests.mjs` verifies representative `science-cycle-chick` at:

```text
320x720
390x844
768x1024
```

Required states:

```text
idle
wrong/retry
success
```

It checks legitimate Science progression readiness, hidden target before success, keyboard wrong-answer path, pointer correct-answer path, no false completion, >=44px targets, no horizontal overflow, visible feedback/CTA, measured attempt metadata/counts and zero browser console/page errors.

The browser test is wired into permanent `test:ui:mobile-routes`; the exact-scope test is wired into permanent `test:learning`.

## Distribution gate

Implementation branch acceptance target is intentionally blocking:

```text
classified:                    900 / 900
unclassified:                    0
active patterns:                42
choice_grid                    254 / 900
growth_stage_transition          3 / 900
phrase_scene_match               4 / 900
```

Any unexpected classifier expansion/contraction fails the gameplay-distribution audit.

## Remaining gates before merge

- exact-head PR CI full green;
- Pattern #42 regression passes in Ubuntu and Windows engine suites;
- browser screenshots pass 320/390/768 idle/wrong/success;
- permanent visual QA remains P0=0 / P1=0;
- production build and dependency/security gates pass;
- PR is mergeable with no unresolved review threads;
- merge exact verified head only;
- resulting `main` independently passes full CI and exact Cloudflare production smoke;
- post-merge closure docs are recorded separately before Pattern #42 is called fully closed.
