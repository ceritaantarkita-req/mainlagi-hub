# Math Compare Properties Reuse Closure — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Scope

Existing `compare_properties` now serves exactly seven assessed direct-choice activities.

Legacy Science:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Math reuse:

```text
math-measure-longer
math-measure-more-capacity
math-measure-fuller
math-measure-three-lengths
```

Explicit exclusion:

```text
math-measure-match-length -> matching / matching_accuracy_v1
```

Active gameplay-pattern count remains 47. Pattern #48 remains unimplemented.

## Verification chain

Audit:

```text
Audit PR:          #210
Audit main:        f9833568dea0f021cd5c4ed94f6f6fc7505ad8d8
Audit main CI:     #973 / run 35378825618
Audit smoke:       exact Cloudflare production smoke PASS
```

Implementation:

```text
Implementation PR:       #216
Initial CI:              #990 / run 35424220516 — stale distribution sentinel only
Second CI:               #992 / run 35424446329 — browser assertion mismatch only
Final PR head:           9f9335837ed1bc02dc3b6bf6a7f9b62523a6ff2d
Final PR CI:             #994 / run 35424613584 — full success
Implementation main:     365070772554d3f00ff7b8124e9f71e97b5252a6
Implementation main CI:  #995 / run 35425340216 — full success
Cloudflare smoke:        exact main SHA PASS
```

The earlier failures did not expose product/runtime defects. #990 found only a stale gameplay-distribution sentinel. #992 found only a browser assertion expecting the canonical prompt as visible body text although the component intentionally renders the reviewed comparison cue while preserving the canonical prompt as narration and exact config identity.

## Merged-main evidence

Main CI #995 artifacts:

```text
gameplay-distribution-audit
artifact: 10578069509
sha256:57ff1376ed5f26b5963ce83abf0db9c0c0b8a816fdcec4ffffb96b7a83728818

activity-quality-audit
artifact: 10578759077
sha256:3807455c896dbed20887b99f1b93ee8f295e3208c714424b4a095fa4352bc91d

mobile-route-qa-screenshots
artifact: 10577963361
sha256:907d362a34b59a43345b9a17615f5022edc82eb4b20a6290b841db59d2724b14
```

Verified distribution:

```text
activities:                 900
classified:                 900
unclassified:                 0
active patterns:             47
choice_grid                 219
spatial_relation_board       11
set_reasoning                10
compare_properties            7
cloze_sentence_choice         5
healthy_habit_routine         4
```

Deterministic activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
```

## Runtime / evidence contract

All four Math activities remain canonical:
- subject `math`;
- stage `math-ukur-ruang`;
- lesson `math-measure-intuition`;
- pack `math.pack.measure-intuition`;
- skill `math.measure.intuition`;
- runtime `tap_choice`;
- assessed `choice_accuracy_v1`;
- exact prompt, choices/order and `correctChoice`.

Config is fail-closed on ID, subject, stage, runtime, prompt, choices/order and answer.

Legacy Science remains binary. Math uses:
- binary compare for `math-measure-longer` and `math-measure-fuller`;
- three first-class candidates for `math-measure-more-capacity` and `math-measure-three-lengths`.

No content rewrite, mastery/progression change, schema/database migration, prompt parser or extra assessed step was introduced.

## Browser and visual acceptance

Legacy Science browser QA remained wired.

Dedicated Math QA used `math-measure-more-capacity` at:
- 320x720;
- 390x844;
- 768x1024.

It verified canonical choice order, keyboard wrong/retry, actual-touch correct completion, assessed evidence, incorrect=1 / retry=1 / accuracy=0.5, touch targets, no horizontal overflow, feedback/CTA visibility and no page/console errors.

Nine Math capacity screenshots (idle / wrong / success × 320 / 390 / 768) were manually reviewed. Result: **P0=0 / P1=0**.

## Closure

Math measurement -> `compare_properties` reuse is **FULLY CLOSED / LIVE VERIFIED**.

The next authorized runtime wave is the already-audited English sentence-completion reuse:

```text
english-complete-cat-sleeps
english-complete-bird-flies
english-complete-i-read
english-complete-two-apples
english-complete-mother-family
```

into existing `cloze_sentence_choice`.

English runtime must preserve the five existing Bahasa cloze activities, use exact ten-ID fail-closed config, subject-aware child-facing locale/copy, keyboard/pointer/actual-touch QA, exact-head CI, manual nine-shot review, exact merge, merged-main exact Cloudflare smoke and post-merge closure before Science environment-care runtime reuse begins.
