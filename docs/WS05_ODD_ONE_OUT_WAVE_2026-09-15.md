# WS-05 Logic Odd One Out Wave — 2026-09-15

Status: **IMPLEMENTATION COMPLETE / CI + VISUAL QA PENDING**

Baseline: `main` @ `c0583c8e07907f02e9671e8254bc35353cf64d24` (Rule Pipeline closure PR #124).

## Audit decision

After Rule Pipeline closed, Logic remains the largest assessed `choice_grid` hotspot at 72/100. A fresh Wave A audit kept classification, comparison, simple sequence rules, relations and odd-one-out objectives separate.

The exact `logic-odd-one-out-basic` family is coherent: five assessed activities in one stage, one lesson and one canonical skill, all requiring the child to compare a trio where two options share one visible relation and exactly one option differs.

Exact scope:

```text
logic-odd-category-animal-vehicle
logic-odd-shape-angular
logic-odd-direction-right
logic-odd-count-three
logic-odd-pattern-symmetry
```

Canonical skill:

```text
logic.discrimination.odd_one_out.basic
```

Nearby classification, comparison, sequence-rule, set, spatial, inference and composed-rule activities remain outside this family.

## Pattern #24

Pattern: `odd_one_out`.

Interaction contract:
- present the canonical three choices as one comparison trio;
- make the relation explicit as `2 mirip • 1 beda` without revealing the answer;
- child directly selects the outsider using accessible buttons;
- wrong choice increments assessed error/retry evidence and cannot complete;
- correct choice completes the canonical activity identity;
- success may explain the reviewed shared relation after completion;
- no extra confirmation step, invented assessment, drag-only dependency or altered answer set.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, canonical choices and `correctChoice` remain unchanged;
- skill remains `logic.discrimination.odd_one_out.basic`;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_odd_one_out_interaction`.

## Intended distribution

```text
900 / 900 classified
0 unclassified
24 active patterns
choice_grid            337 / 900 = 37.44%
odd_one_out              5 / 900 = 0.56%
Logic choice_grid       67 / 100
Science choice_grid     60 / 100
```

The distribution change is a consequence of objective-fit, not the reason for selecting the mechanic.

## Required acceptance

1. Exact classifier/config/static regression for five IDs only.
2. Nearby Logic classification/comparison/sequence/set/spatial/inference/composed-rule tasks remain their existing canonical patterns.
3. Dedicated browser QA at 320x720, 390x844 and 768x1024 on the first Logic stage without fabricated prerequisite evidence.
4. Keyboard wrong selection, pointer correct completion, false-completion guard, assessed evidence persistence, >=44px controls, no horizontal overflow and in-viewport success CTA.
5. Full CI, deterministic activity-quality audit, gameplay-distribution audit, simulations and Batch17 remain green.
6. Manual review of idle/error/success screenshots from a green run.
7. Canonical docs finalization, final docs-head CI, clean review gate, exact-head merge and post-merge docs closure before calling pattern #24 shipped.
