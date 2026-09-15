# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

All **9 subjects / 900 activities** remain deterministically clean:

```text
symbol_hunt           74
structural findings    0
KEEP                  900
POLISH                  0
REDESIGN                0
REPLACE                 0
flagged total           0
```

All subjects remain 100 KEEP / 0 flagged. Q101–Q108 remain zero.

Deterministic zero does **not** mean every activity is human-approved or maximally varied. Gameplay diversity, art direction, real-device/accessibility, and Iqro expert review remain separate requirements.

## WS-05 gameplay diversification

Merged waves:
- `symbol_hunt` — 74 direct-literacy activities.
- `memory_pair` — PR #101.
- `missing_sequence_slot` — PR #102.
- `sorting_buckets` — PR #103.
- `drag_to_target` — PR #104.
- permanent gameplay-distribution audit — PR #105.
- `count_and_select` — PR #106, exactly 9 Math counting activities.
- `number_line` — PR #108, exactly 6 Math Wave B ordering activities.
- `more_less_balance` — PR #109, exactly 6 Math Wave B comparison activities.
- `pattern_completion` — PR #110, exactly 5 Math Wave B choice-pattern activities.
- `cause_effect` — PR #112, exactly 4 Science Wave B water-change choice activities.
- `compare_properties` — PR #114, exactly 3 Science Wave C direct-comparison activities.
- `material_lab` — PR #116, exactly 4 Science Wave D material-purpose activities.

Current active QA wave:
- `feature_function_link` — PR #119, exactly 4 Science Wave D living feature/function activities; **accepted implementation QA / unmerged**.

Merged distribution after PR #116:

```text
900 / 900 classified
0 unclassified
20 active patterns
choice_grid           355 / 900 = 39.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

PR #119 accepted-QA distribution:

```text
900 / 900 classified
0 unclassified
21 active patterns on PR head
choice_grid                 351 / 900 = 39.00%
feature_function_link         4 / 900 = 0.44%
Science choice_grid          64 / 100
Logic choice_grid            77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## Feature Function Link — ACCEPTED IMPLEMENTATION QA / PR #119 / UNMERGED

Exact scope:

```text
science-feature-duck-webbed-feet
science-feature-fish-gills
science-feature-bird-beak-seeds
science-feature-cactus-water
```

Explicit exclusion:

```text
science-match-feature-function-d
```

Preserved:
- canonical runtime `tap_choice`;
- choices/`correctChoice`;
- assessment and stars;
- progression and canonical skill `science.living.features_function.basic`;
- activity IDs and completion semantics;
- Wave D stage identity.

Interaction/evidence:
- organism + feature appear as the source context;
- canonical three functions appear as accessible destination buttons;
- wrong choice is measured/retryable and cannot complete;
- assessed fidelity `choice_feature_function_link_interaction`;
- exact four-ID allowlist prevents unrelated Science activities from reclassification;
- `science-match-feature-function-d` remains canonical visible matching.

Accepted evidence:
- CI #541 caught stale default-choice family coverage plus decorative connector pointer interception; fixes preserved the default-family guard and made decoration non-interactive;
- CI #543 caught an invalid static-test assumption that skill identity existed on the runtime activity; the test now verifies the canonical catalog learning spec instead;
- CI #544 caught the 320px success CTA below the viewport;
- success-only phone layout was compacted without shrinking answer controls or changing idle/error layout;
- implementation head `94effe387912f27d0667e36fbf1d2351d612b62d` passed full CI #545;
- representative route uses legitimate Science readiness;
- keyboard wrong-state, pointer completion, assessed evidence persistence, >=44px controls, no horizontal overflow, and CTA visibility all pass at 320/390/768;
- manual visual review accepted the green #545 idle/error/success screenshots at 320x720, 390x844 and 768x1024;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0.

## Permanent audits

```bash
npm run qa:activity-quality
npm run qa:gameplay-distribution
```

CI uploads both artifacts. Gameplay-distribution coverage and active-pattern-set consistency are blocking; concentration remains advisory.

## Wave status

- WS-04 deterministic triage DONE — 900 KEEP / 0 flagged.
- WS-06 Coloring DONE — PR #95/#96.
- WS-07 Drawing DONE — PR #98/#99/#100.
- WS-05 Memory Pair DONE — PR #101.
- WS-05 Sequence Slot DONE — PR #102.
- WS-05 Sorting Buckets DONE — PR #103.
- WS-05 Drag-to-Target DONE — PR #104.
- WS-05 Gameplay Distribution Audit DONE — PR #105.
- WS-05 Count-and-Select DONE — PR #106.
- WS-05 Number Line DONE — PR #108.
- WS-05 More/Less Balance DONE — PR #109.
- WS-05 Pattern Completion DONE — PR #110.
- WS-05 Cause/Effect DONE — PR #112.
- WS-05 Compare Properties DONE — PR #114.
- WS-05 Material Lab DONE — PR #116.
- WS-05 Feature Function Link — **ACCEPTED QA / PR #119; final docs-head CI + merge pending**.
- WS-05 NEXT — after #119 closure, fresh Science exact-family audit, then Logic.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
