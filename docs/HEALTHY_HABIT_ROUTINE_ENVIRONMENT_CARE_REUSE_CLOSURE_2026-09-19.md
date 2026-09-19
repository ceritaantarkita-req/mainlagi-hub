# Healthy Habit Routine Environment-Care Reuse Closure — 19 September 2026

Status: **FULLY CLOSED / LIVE VERIFIED**

## Scope

Existing Pattern #22 `healthy_habit_routine` now serves exactly eight assessed Science direct-choice activities.

Legacy body-health:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

Environment-care reuse:

```text
science-env-trash-bin
science-env-save-water
science-env-reuse-bottle
science-env-plant-care
```

Explicit exclusion:

```text
science-match-environment-actions-c -> matching / matching_accuracy_v1
```

Active gameplay-pattern count remains 47. Pattern #48 remains unimplemented.

## Verification chain

Audit:

```text
Audit PR:          #212
Audit main:        0fccffd769211e5b47be81ec5126c913d9c26fec
Audit PR CI:       #976 / run 35409354940 — full success
Audit main CI:     #977 / run 35409698981 — full success
Audit smoke:       exact Cloudflare production smoke PASS
```

Implementation:

```text
Implementation PR:       #221
Accepted code head:      87c0d7efcecb7202f408df2aa24b2445a3834d22
Accepted code CI:        #1012 / run 35435713520 — full success
Final PR head:           208a7fd4bc779a0ac4638718a7edf96c021e2d8a
Final PR CI:             #1017 / run 35436529543 — full success
Implementation main:     986c5c47e2d75366623611f323118b8013f93fe1
Implementation main CI:  #1018 / run 35436868321 — full success
Cloudflare smoke:        exact main SHA PASS
```

Production smoke explicitly verified:

```text
release.sha:             986c5c47e2d75366623611f323118b8013f93fe1
release.branch:          main
siteUrl:                 https://mainlagihub.my.id
dataBackend:             supabase
result:                  PASS
```

## Merged-main evidence

Main CI #1018 artifacts:

```text
mobile-route-qa-screenshots
artifact: 10583415007
sha256:b156449aa5916ed8275e5e0e71309a356213df2ea234a28ad6c2aae44896434d

gameplay-distribution-audit
artifact: 10582985837
sha256:ddf9d299f50857dbb2c13a2fb02e254eb2ebe0ee1eb3168035c5ad84830e83e3

activity-quality-audit
artifact: 10582985831
sha256:57e6d67a5ffb50eab84c749eaec708fab573e466bbd81e7a7c5518331d420461
```

Verified merged distribution:

```text
activities:                    900
classified:                    900
unclassified:                    0
active patterns:                47
choice_grid                    210
healthy_habit_routine            8
cloze_sentence_choice           10
spatial_relation_board          11
set_reasoning                   10
compare_properties               7
```

Deterministic activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
```

## Runtime / evidence contract

The full eight-ID family is exact and fail-closed on:
- activity ID;
- subject;
- stage;
- `tap_choice` runtime;
- canonical prompt;
- canonical three-choice order;
- canonical correct answer;
- complete explicit visual mapping.

Two explicit domain variants are now supported:

```text
body_health
environment_care
```

Legacy body-health child-facing copy and evidence metadata remain unchanged.

Environment-care uses domain-correct action-selection copy and evidence:

```text
source: healthy-habit-routine-runtime
evidenceFidelity: choice_environment_care_action_interaction
domainVariant: environment_care
goalLabel
cueLabel
selectedAction
```

No generic prompt parser or "good action" detector is used.

No curriculum payload rewrite, mastery/progression change, schema/database migration, activity-count change or new gameplay pattern was introduced.

## Browser and visual acceptance

Legacy body-health browser QA remains wired.

Dedicated environment-care QA uses:

```text
/child/demo-gian/activity/science-env-trash-bin
```

at:
- 320x720;
- 390x844;
- 768x1024.

It verifies:
- legitimate Science progression readiness;
- explicit `environment_care` domain;
- environment-specific copy and ARIA;
- absence of body-health wording;
- canonical three choices/order;
- keyboard wrong/retry;
- wrong answer cannot complete;
- pointer completion;
- actual Playwright touchscreen completion;
- assessed evidence with incorrect=1 / retry=1 / accuracy=0.5;
- exact environment metadata;
- >=44px touch targets;
- no horizontal overflow;
- feedback and success CTA visibility;
- no page/console errors.

Nine screenshots (idle / wrong / success × 320 / 390 / 768) were manually reviewed. Result: **P0=0 / P1=0**.

Permanent visual product baseline passed both final PR CI #1017 and merged-main CI #1018.

## Closure

Science environment-care -> existing `healthy_habit_routine` reuse is **FULLY CLOSED / LIVE VERIFIED**.

All five reuse waves authorized by the Pattern #48 reuse-first audit chain are now closed:
1. Logic multi-attribute -> `set_reasoning`;
2. Math spatial -> `spatial_relation_board`;
3. Math measurement -> `compare_properties`;
4. English completion -> `cloze_sentence_choice`;
5. Science environment-care -> `healthy_habit_routine`.

No additional runtime wave is automatically authorized by these closures. Any next WS-05 runtime change must begin with a **fresh objective/evidence audit**. Pattern #48 remains **NO JUSTIFIED NEW PATTERN YET** until such an audit supports a distinct interaction.
