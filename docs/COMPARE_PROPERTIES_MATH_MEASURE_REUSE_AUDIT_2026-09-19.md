# Compare Properties Reuse Audit — Math Measure Intuition — 19 September 2026

Status: **AUDIT COMPLETE / REUSE JUSTIFIED FOR EXACT 4 DIRECT-CHOICE IDS / CODE NOT STARTED / IMPLEMENTATION BLOCKED BY PRIOR LIVE-CLOSURE GATES**

## Purpose

Evaluate whether the existing `compare_properties` gameplay pattern can safely represent the Math `math.measure.intuition` direct-choice activities without creating Pattern #48.

The audit is evidence-first. Matching evidence remains matching and is not converted merely to increase reuse coverage.

## Audit base

```text
canonical main:                 3e30a817ef86fa691f9b2f1249ac00bc00dce4e6
latest fully closed pattern:    Pattern #47 — shape_attribute_board
active pattern count:           47
Pattern #48:                    no justified new pattern
Set Reasoning implementation:   main 9debb6cf / live closure still pending
Math spatial reuse audit:       PR #209 -> main 3e30a817 / PR CI #970 success
Math spatial runtime:           not started
```

This audit may advance documentation/evidence only. Runtime implementation remains blocked until the preceding reuse/live-verification gates are resolved.

## Canonical Math family

Lesson:

```text
id:        math-measure-intuition
title:     Intuisi pengukuran
objective: Membandingkan panjang, kapasitas, dan ukuran dari representasi yang jelas.
```

Pack:

```text
math.pack.measure-intuition
```

Skill:

```text
id:          math.measure.intuition
description: Membandingkan panjang, kapasitas, dan ukuran dari representasi sederhana.
```

Canonical stage/runtime ownership for the direct-choice family:

```text
subject:     math
stage:       math-ukur-ruang
runtime:     tap_choice
assessment:  assessed
evidence:    choice_accuracy_v1
age:         5–7
```

## Exact direct-choice reuse scope

```text
math-measure-longer
math-measure-more-capacity
math-measure-fuller
math-measure-three-lengths
```

### `math-measure-longer`

```text
prompt:  Pita A = ━━━━━━ dan pita B = ━━━. Mana lebih panjang?
choices: A / B / Sama
correct: A
```

### `math-measure-more-capacity`

```text
prompt:  Untuk menampung lebih banyak air, mana biasanya punya kapasitas lebih besar?
choices: ember / cangkir / sendok
correct: ember
```

### `math-measure-fuller`

```text
prompt:  Gelas A terisi 3 dari 4 bagian; gelas B terisi 1 dari 4 bagian. Mana lebih penuh?
choices: A / B / Sama
correct: A
```

### `math-measure-three-lengths`

```text
prompt:  A=━━, B=━━━━, C=━━━━━━. Mana yang paling pendek?
choices: A / B / C
correct: A
```

## Explicit exclusion

```text
math-measure-match-length
```

This activity is canonical:
- runtime `matching`;
- assessed;
- evidence `matching_accuracy_v1`.

It measures pair matching rather than direct property selection and must remain matching.

## Existing mechanic

Current `compare_properties` scope is exactly three Science direct-choice activities:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

The current component:
- shows two primary property cards;
- exposes the third canonical answer as an “other” choice;
- preserves assessed direct-choice evidence;
- records `source: compare-properties-runtime`;
- records `evidenceFidelity: choice_compare_properties_interaction`;
- supports keyboard/pointer/touch;
- keeps wrong answers retryable;
- has verified 320/390/768 browser QA.

The current configuration is intentionally binary and currently models:
- length;
- temperature;
- fill.

## Reuse decision

**Reuse is justified for all four Math direct-choice activities, but not by forcing every task into the current binary layout.**

The common semantic contract is:
1. display a qualitative property comparison;
2. keep the canonical direct-choice answer controls;
3. preserve the existing measured `choice_accuracy_v1` evidence path.

### Binary variant

These two map naturally to the current two-primary + third-answer structure:

```text
math-measure-longer
math-measure-fuller
```

The board can compare A vs B directly while retaining “Sama” as the third canonical choice.

### Multi-candidate variant

These two require all three candidates to be first-class comparison targets:

```text
math-measure-more-capacity
math-measure-three-lengths
```

Forcing `sendok` or candidate C into the current visually secondary “other choice” would bias the presentation and weaken evidence fidelity. Reuse therefore requires a deterministic multi-candidate variant within the same `compare_properties` mechanic.

This is still the same interaction family: **compare visible qualitative properties and submit one unchanged canonical direct-choice answer**.

It does not require:
- a new pattern;
- sorting;
- drag/drop;
- numeric measurement;
- ordering construction;
- an extra assessed checkpoint.

## Required config model

A later implementation should preserve a typed variant boundary rather than flattening all configs.

Conceptually:

```text
binary_compare
  candidates: left, right
  thirdChoice: canonical equality/other answer

multi_candidate_compare
  candidates: exactly three canonical selectable property cards
```

Each candidate needs explicit:
- canonical submitted choice;
- visible label;
- deterministic property representation;
- qualitative level/rank needed only for rendering;
- accessible label.

No arbitrary prompt parsing is approved.

## Property representation

### Length

`math-measure-longer` and `math-measure-three-lengths` may use explicit relative bar lengths because the canonical source already encodes the relative lengths visually.

### Fill

`math-measure-fuller` may render the canonical 3/4 vs 1/4 fill relation visually. It must not introduce new numeric measurement evidence; the fractions are already in the canonical prompt.

### Capacity

`math-measure-more-capacity` may show bucket/cup/spoon as three explicit capacity candidates with deterministic qualitative capacity levels. The task remains the canonical qualitative “usually larger capacity” comparison; no liters, volumes, or invented numeric scale may be added.

## Fail-closed implementation boundary

For the four Math IDs, later config must require:
- subject `math`;
- stage `math-ukur-ruang`;
- exact canonical activity ID;
- runtime `tap_choice`;
- exact prompt;
- exactly three canonical choices in exact order;
- exact `correctChoice`;
- exact deterministic variant and property representation.

The existing three Science IDs must remain behaviorally stable and must also be protected from prompt/choice/order/answer drift.

No keyword-based classifier or prompt parser is approved.

## Evidence contract

Must remain unchanged:
- canonical IDs;
- assessed status;
- `choice_accuracy_v1`;
- exact prompt;
- canonical choices and order;
- canonical `correctChoice`;
- retry/incorrect/accuracy semantics;
- progression/mastery;
- schema/database;
- lesson/pack/skill ownership.

Runtime metadata may preserve:

```text
source: compare-properties-runtime
evidenceFidelity: choice_compare_properties_interaction
propertyKind
comparisonGoal
selectedChoice or selectedTarget
```

Legacy Science metadata keys must remain backwards-compatible unless a tested additive field is introduced.

## Required regression/browser proof

Before a later implementation may merge:
1. exactly three existing Science + four audited Math direct-choice activities classify as `compare_properties`;
2. the Math matching activity remains matching;
3. all seven configs fail closed on subject/stage/prompt/order/answer/runtime drift;
4. existing Science binary presentation/evidence remains unchanged;
5. Math binary and multi-candidate variants preserve exact choices/order/submitted values;
6. wrong answer cannot complete and increments incorrect/retry;
7. correct answer completes through canonical assessed evidence;
8. keyboard, pointer and actual touch are covered;
9. representative Math multi-candidate QA covers 320x720, 390x844 and 768x1024 idle/wrong/success;
10. all three candidate cards remain equivalent selectable controls before submission;
11. no answer-specific styling/cue leaks correctness;
12. short viewport keeps feedback and CTA visible;
13. no horizontal overflow;
14. permanent visual QA remains P0=0/P1=0;
15. gameplay distribution remains 900/900 classified;
16. deterministic activity-quality remains clean.

## Distribution impact

Current code truth after Set Reasoning implementation, before Math spatial/measurement runtime reuse:

```text
47 active patterns
choice_grid             228 / 900
set_reasoning            10 / 900
spatial_relation_board    6 / 900
compare_properties        3 / 900
```

If **only this four-ID Math measurement reuse** were later implemented and verified from that baseline:

```text
47 active patterns
choice_grid             224 / 900
compare_properties        7 / 900
```

If the already-audited five-ID Math spatial reuse is implemented first and both reuse waves later pass all gates, the combined expected counts become:

```text
47 active patterns
choice_grid             219 / 900
set_reasoning            10 / 900
spatial_relation_board   11 / 900
compare_properties        7 / 900
```

These are future expected distributions only. This audit changes no runtime classification.

## Explicit non-scope

This audit does not approve:
- `math-measure-match-length`;
- arbitrary Math activities;
- numeric measurement units;
- sorting/ranking as a new assessed task;
- content rewrites;
- mastery/progression changes;
- schema/database migrations;
- Pattern #48;
- runtime implementation before prerequisite closure/audit gates are resolved.

## Decision

**Reuse existing `compare_properties` for exactly four Math `math.measure.intuition` direct-choice activities is justified.**

The binary activities can reuse the current presentation model directly. The three-candidate activities require a first-class multi-candidate presentation variant so every canonical answer remains equally represented. This is a controlled generalization of the existing mechanic, not a new gameplay pattern.

## Next gate

1. merge and verify this docs-only audit;
2. keep Set Reasoning live closure and Math spatial audit/live gates explicit;
3. do not start Math measurement runtime before earlier prerequisite gates are resolved;
4. when eligible, implement exact config variants, legacy Science regressions, Math browser/touch QA and distribution gates on a separate branch;
5. require exact-head CI, manual visual acceptance, exact merge, merged-main Cloudflare verification and post-merge docs closure.
