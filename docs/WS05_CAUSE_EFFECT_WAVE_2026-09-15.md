# WS-05 Science Cause/Effect Wave — 2026-09-15

## Purpose

Diversify the reviewed Science water-change choice family with a reusable child-facing `cause_effect` interaction while preserving canonical assessment and progression contracts.

Branch: `agent/ws05-gameplay-science-cause-effect-20260915`  
PR: #112  
Merged base `main`: `06477dbc8fc4d2c4f990b19f2edb3e217b3e26ae`

## Exact scope

Exactly four Science Wave B `tap_choice` activities:

```text
science-water-ice-melts
science-water-freezes
science-water-puddle-evaporates
science-water-cold-glass-droplets
```

Intentionally excluded:

```text
science-match-water-states-b
```

The excluded activity remains canonical `matching` / `visible_matching`; its interaction and evidence contract is different.

## Interaction contract

- child sees a visible **Awal -> Kondisi -> Hasil** flow;
- the result slot is unrevealed before a choice, so the visual does not leak the answer;
- per-activity water-change semantics come from explicit config rather than prompt parsing;
- the canonical three choices remain the answer set;
- a wrong result can be shown as feedback but cannot complete the activity;
- keyboard and touch/pointer use the same answer controls;
- correct completion emits explicit measured evidence before canonical completion.

Assessed evidence fidelity:

```text
choice_cause_effect_interaction
```

Metadata includes the explicit process identity and cause/effect configuration used by the activity.

## Preserved contracts

Unchanged:
- runtime `tap_choice`;
- activity IDs;
- canonical choices/correctChoice;
- skill `science.water.state_changes.basic`;
- assessment mode;
- stars;
- progression/stage requirements;
- completion identity.

## QA evidence

Accepted implementation head: `ad5f427afc9cb0c755872ee88588534066942d47`.

CI #513: full green across Ubuntu quality gate, Windows compatibility, production build, dependency audit, secret-history scan, and Mobile Chromium. Production smoke remains skipped as expected for this PR environment.

Representative browser activity: `science-water-ice-melts`.

Browser checks:
- legitimate Science Wave A prerequisite readiness with progression guard enabled;
- result slot is unrevealed before interaction;
- keyboard wrong-state remains retryable and cannot falsely complete;
- pointer correct completion persists canonical completion and assessed attempt;
- evidence fidelity `choice_cause_effect_interaction` persists with incorrect/retry/accuracy accounting;
- >=44px interaction targets;
- no horizontal overflow;
- success CTA fully inside viewport;
- screenshots at 320x720, 390x844, and 768x1024.

CI #512 originally caught a real 320x720 success-CTA clipping issue. The compact-phone layout was tightened without dropping answer/CTA targets below 44px. CI #513 then passed the same CTA visibility assertion.

Manual visual review accepted idle/error/success at all three viewports. The 320 compact state now keeps prompt, three causal phases, choices, feedback, and success CTA readable and reachable.

Deterministic activity quality at the accepted head remains:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
structural findings 0
```

## Distribution delta

```text
merged baseline after #110: choice_grid 366 / 900; Science choice_grid 79 / 100; 17 patterns
PR #112 accepted QA:          choice_grid 362 / 900; Science choice_grid 75 / 100; 18 patterns
cause_effect:                 4 / 900
coverage:                     900 / 900, 0 unclassified
```

Science remains above the >60% subject concentration advisory threshold, so the next WS-05 step is another exact-family Science audit. Concentration is a planning signal only; the next mechanic must still fit its learning objective.

## Remaining merge gates

- canonical docs on the current PR head;
- final docs-head CI;
- clean review threads/comments;
- exact-head squash merge;
- verify `main` after merge;
- record the final merge SHA in the post-merge canonical status closure if needed.
