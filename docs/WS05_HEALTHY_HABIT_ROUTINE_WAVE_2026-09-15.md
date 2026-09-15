# WS-05 Science Healthy Habit Routine Wave — 2026-09-15

Status: **QA ACCEPTED / ACTIVE PR #121 / UNMERGED**

Baseline: `main` @ `92664642287ecdd64ce408d3d08794a24aa2b588` (Feature Function Link closure PR #120).

Accepted implementation head before canonical docs finalization: `8086670711221dd077c64bdab2eb308040c3db86`.

## Audit decision

Science remained at 64/100 `choice_grid` after pattern #21. A fresh Wave A-D audit rejected heterogeneous investigation/evidence tasks and mixed-review tasks as one mechanic. The strongest remaining exact family is the four Wave C body-health choices: same stage, lesson, assessed evidence contract and canonical skill, all measuring recognition of a healthy everyday habit.

Exact scope:

```text
science-body-wash-hands
science-body-teeth-brush
science-body-water-drink
science-body-sleep-rest
```

Explicit exclusion:

```text
science-match-body-care-c
```

The excluded activity remains canonical `matching` / `visible_matching`; it measures direct body-part-to-care pairing rather than selecting one habit for one health context.

## Pattern #22

Pattern: `healthy_habit_routine`.

Interaction contract:
- show the health focus and familiar routine cue;
- show exactly the canonical three choices as accessible habit cards;
- keyboard or pointer/touch selects one habit;
- wrong choice increments assessed error/retry evidence and cannot complete;
- correct choice completes the canonical activity identity;
- no drag-only interaction.

Preserved canonical contract:
- runtime remains `tap_choice`;
- activity IDs, canonical choices and `correctChoice` remain unchanged;
- skill remains `science.body.health_habits.basic`;
- assessment/stars/progression stay canonical;
- assessed fidelity: `choice_healthy_habit_routine_interaction`.

## Accepted implementation QA

The initial implementation commit had unnecessary formatting churn in existing files. That state was not accepted. A cleanup commit rebuilt the touched existing files from canonical formatting and reduced the PR to a reviewable **12 files, +372/-5** before acceptance.

Accepted implementation head:

```text
8086670711221dd077c64bdab2eb308040c3db86
```

Full CI:

```text
run #552
run id: 34932904970
status: success
```

Verified gates:
- Ubuntu structure/assets/source, Batch16 security, device-harness contract, typecheck, lint and engine/learning suites PASS;
- gameplay-presentation regression includes exactly `4 healthy_habit_routine` activities;
- dedicated Healthy Habit Routine regression passes for exactly four Science Wave C IDs;
- `science-match-body-care-c` remains `matching` / `visible_matching`;
- deterministic activity-quality: **9 subjects / 900 activities / 900 KEEP / 0 flagged / structural findings 0**;
- five simulations complete with zero invariant errors;
- Batch17 final acceptance PASS: **9 subjects / 900 activities / 683 assessed / 217 practice / 46 stages / 197 lessons / 197 packs / 200 skills**;
- physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`, unchanged by this wave;
- Windows compatibility PASS;
- production build and Batch16 JS/lazy-load budgets PASS;
- production dependency audit PASS;
- secret-history scan PASS;
- Mobile Chromium route/accessibility/lazy-load matrix PASS.

Dedicated browser QA result:

```text
Healthy-habit browser QA passed 3 viewports with legitimate Science Wave B progression,
keyboard wrong-state, pointer completion, layout, CTA and assessed evidence checks.
```

The representative route is `science-body-wash-hands`. QA verifies:
- legitimate Wave B prerequisite evidence rather than bypassing progression;
- exactly three canonical answer choices;
- keyboard wrong choice cannot complete;
- pointer correct choice completes;
- persisted assessed evidence includes fidelity `choice_healthy_habit_routine_interaction`;
- wrong-then-correct path records `incorrectCount=1`, `retryCount=1`, `accuracy=0.5`;
- controls remain >=44px;
- no horizontal overflow;
- success CTA remains in viewport;
- no page or console errors.

## Manual visual QA

Green CI #552 uploaded idle/error/success screenshots for:

```text
320x720
390x844
768x1024
```

Manual review accepted all nine screenshots:
- phone hierarchy remains readable without clipping;
- the wrong-state selection and retry feedback are visually clear;
- the success state highlights the correct habit and exposes the CTA without scrolling it out of view;
- 390px spacing remains balanced;
- 768px layout uses the extra space without overlap or distracting scale changes;
- decorative characters remain non-obstructive;
- no additional visual-polish commit is required.

## Verified PR-head distribution

```text
900 / 900 classified
0 unclassified
22 active patterns
choice_grid               347 / 900 = 38.56%
healthy_habit_routine       4 / 900 = 0.44%
Science choice_grid        60 / 100
Logic choice_grid          77 / 100
```

At exactly 60%, Science no longer exceeds the permanent subject-hotspot advisory rule (`>60%`). After this wave is merged and closed, the next subject audit should move to **Logic** rather than forcing weaker Science families.

## Remaining merge gates

1. Canonical docs snapshot is finalized on the PR branch.
2. Trigger and pass a full **final docs-head CI**.
3. Verify issue comments, review comments, submitted reviews and review threads are clean.
4. Re-fetch PR #121 and verify exact current head + mergeability.
5. Squash merge using the exact current head SHA.
6. Verify live `main` SHA/message from GitHub.
7. Create and merge a docs-only post-merge closure that changes this status to `MERGED`, records the exact merge SHA/final CI/review gate, updates merged patterns to 22, and makes Logic the next active WS-05 audit.

Until those gates complete, pattern #22 is **QA accepted but not shipped**.
