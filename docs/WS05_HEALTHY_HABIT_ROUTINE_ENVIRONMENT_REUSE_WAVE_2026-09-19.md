# WS-05 — Healthy Habit Routine Environment-Care Reuse Wave — 19 September 2026

Status: **IMPLEMENTED / CODE CHECKPOINT ACCEPTED / FINAL DOCS CI PENDING**

## Authorized scope

Reuse existing Pattern #22 `healthy_habit_routine` for exactly four audited Science environment-care direct-choice activities:

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

No Pattern #48 is created.

## Prerequisite gate

English cloze reuse is fully closed/live verified before this runtime wave began:

```text
English implementation main:       e3c92cfe8c1050fdcca1599ae92d98a9345b04ca
English implementation main CI:    #1009 / run 35431721131
English closure docs main:          ae29ada7f0f7f04e565f6a33e4f6f089d79e8f58
English closure main CI:            #1011 / run 35435228167
Cloudflare smoke:                   exact SHA PASS
```

Science audit prerequisite:

```text
Audit PR:          #212
Audit main:        0fccffd769211e5b47be81ec5126c913d9c26fec
Audit PR CI:       #976 / run 35409354940
Audit main CI:     #977 / run 35409698981
Audit smoke:       exact Cloudflare production smoke PASS
```

## Implementation branch / PR

```text
Branch:            agent/reuse-healthy-habit-environment-20260919
Base main:         ae29ada7f0f7f04e565f6a33e4f6f089d79e8f58
Implementation PR: #221
Accepted code head: 87c0d7efcecb7202f408df2aa24b2445a3834d22
Checkpoint CI:      #1012 / run 35435713520 — full success
```

## Runtime implementation

The existing four body-health activities remain in the family:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

The config is now exact and fail-closed for the full eight-ID family. Classification requires:
- exact activity ID;
- subject `science`;
- stage `science-earth-body-environment`;
- runtime `tap_choice`;
- exact canonical prompt;
- exactly three canonical choices in canonical order;
- exact canonical `correctChoice`;
- complete explicit visuals for all three choices.

Generic prompt/shape matching does not classify an arbitrary activity.

## Domain variants

Two explicit variants are supported:

```text
body_health
environment_care
```

Legacy `body_health` behavior and evidence metadata remain unchanged.

Environment-care uses neutral environmental action-selection copy:
- heading: `Jaga lingkungan`;
- board label: `Situasi dan pilihan tindakan menjaga lingkungan`;
- choice heading: `Tindakan mana yang paling tepat?`;
- environment-specific idle/retry copy;
- no body-health wording.

Environment evidence metadata:

```text
source: healthy-habit-routine-runtime
evidenceFidelity: choice_environment_care_action_interaction
domainVariant: environment_care
goalLabel
cueLabel
selectedAction
```

Legacy body-health evidence remains:

```text
source: healthy-habit-routine-runtime
evidenceFidelity: choice_healthy_habit_routine_interaction
routineLabel
cueLabel
selectedHabit
```

## Regression proof

Deterministic tests require:
1. exactly 4 body-health + 4 environment-care activities classify as `healthy_habit_routine`;
2. every activity retains canonical subject/stage/runtime/prompt/choice order/answer;
3. domain variant and skill are exact;
4. visual keys match canonical choices in canonical order;
5. subject drift fails closed;
6. stage drift fails closed;
7. runtime drift fails closed;
8. prompt drift fails closed;
9. choice-order drift fails closed;
10. answer drift fails closed;
11. body-care matching stays `visible_matching`;
12. environment-care matching stays `visible_matching`;
13. unrelated Science direct-choice activities remain outside the family.

## Browser QA

Representative route:

```text
/child/demo-gian/activity/science-env-trash-bin
```

Viewports:

```text
320x720
390x844
768x1024
```

Dedicated browser QA verifies:
- legitimate progression readiness;
- explicit `environment_care` domain marker;
- environment heading/copy/ARIA;
- absence of body-health heading/idle copy;
- canonical three choice labels/order;
- idle does not complete;
- no horizontal overflow;
- all choice targets >=44px;
- keyboard wrong selection;
- wrong state cannot complete;
- pointer completion at 390;
- actual Playwright touchscreen completion at 320 and 768;
- assessed completion;
- `incorrectCount=1`;
- `retryCount=1`;
- `accuracy=0.5`;
- exact environment evidence metadata;
- success status + CTA visible;
- no page/console errors.

Nine screenshots (idle / wrong / success × 320 / 390 / 768) were manually reviewed and accepted: **P0=0 / P1=0**.

Permanent visual product baseline passed CI #1012.

## Checkpoint artifacts

```text
mobile-route-qa-screenshots
artifact: 10581308953
sha256:47cc82b34f4892372746849faee1c0f46634f6b33d89e4fbb4ba4d65d1a0db34

gameplay-distribution-audit
artifact: 10582209410
sha256:6a3763092ba1bcdab5e805385ec38555fb6f59d97018a0f3f482936e51589916

activity-quality-audit
artifact: 10581944743
sha256:f2ee9416ab1ac4cd050ce68351fd3eefbca9082a5d298111110dc06d02bcd7e0
```

## Verified branch truth

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

Activity quality:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
```

## Non-scope

This wave does not:
- create Pattern #48;
- rewrite curriculum activity payloads;
- absorb matching activities;
- change mastery or progression;
- change schema/database;
- change total activity count;
- add a second assessed checkpoint.

## Remaining gates

Before merge:
1. canonical docs on PR #221 must reflect this accepted checkpoint;
2. final exact-head CI must pass;
3. PR must be merged only at the exact accepted head.

After merge:
1. merged-main CI must pass;
2. exact merged SHA must pass Cloudflare production smoke;
3. add post-merge closure/live-verification docs;
4. only then select any later runtime wave from a fresh objective/evidence audit.
