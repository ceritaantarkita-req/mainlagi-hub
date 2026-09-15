# WS-05 Logic Odd One Out Wave — 2026-09-15

Status: **IMPLEMENTATION + CI + VISUAL QA ACCEPTED / PR #125 UNMERGED**

Baseline: `main` @ `c0583c8e07907f02e9671e8254bc35353cf64d24` (Rule Pipeline closure PR #124).
Accepted implementation head: `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`.

## Audit decision

After Rule Pipeline closed, Logic remained the largest assessed `choice_grid` hotspot at 72/100. A fresh Wave A audit kept classification, comparison, simple sequence rules, relations and odd-one-out objectives separate.

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

## Accepted PR-head distribution

```text
900 / 900 classified
0 unclassified
24 active patterns
choice_grid            337 / 900 = 37.44%
odd_one_out              5 / 900 = 0.56%
Logic choice_grid       67 / 100
Science choice_grid     60 / 100
```

This is PR-head evidence only. Merged `main` remains at 23 patterns until exact-head merge and live-main verification.

## Acceptance history

### CI #562 — blocked by stale Rule Pipeline sentinel

The new exact family was correctly classified as `odd_one_out`, but the older Rule Pipeline regression still named `logic-odd-category-animal-vehicle` as a permanent `default` sentinel. That assertion became stale because this activity was intentionally promoted by #125.

Correct fix:
- replace only that stale Rule Pipeline exclusion sentinel with `logic-compare-more-dots`, an unrelated Logic comparison activity that must remain `default` / `choice_grid`;
- keep the Rule Pipeline exact five-ID classifier and all old default-family assertions active.

Fix commit: `c88e9c4bf055c896ebb0633d8a34cc199847210b`.

### CI #563 — blocked by incorrect progression assumption

Ubuntu, Windows, build, dependency, secret, activity-quality, distribution, simulations and Batch17 passed. Mobile Chromium failed because the first Odd One Out QA draft assumed `logic-classification-rules-basics` was naturally unlocked. Runtime correctly redirected because the preceding `logic-foundations` readiness contract had not been satisfied.

Correct fix:
- seed the same canonical qualifying Logic foundation evidence already used by existing Sorting Buckets browser QA;
- prerequisite completed activities remain `logic-match-pairs` and `logic-odd-one-out` with assessed qualifying evidence for `logic.visual.matching` and `logic.visual.discrimination`;
- keep the real progression guard enabled and assert that it accepts these legitimate prerequisites.

Fix + documentation commit: `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`.

### CI #564 — accepted implementation run

Run `34951235607` completed successfully on exact implementation head `d15a5a4c49b4a14d5dd7a49f4a2f6a5a2d2f2c8d`.

Accepted evidence:
- Ubuntu quality gate: PASS through typecheck, lint, engine tests, activity-quality audit, gameplay-distribution audit, simulations and Batch17;
- Windows compatibility: PASS;
- production build and Batch16 budgets: PASS;
- production dependency audit: PASS;
- secret history scan: PASS;
- Mobile Chromium: PASS; production smoke was normally skipped by workflow condition;
- gameplay-presentation regression and dedicated Odd One Out exact-family regression pass for exactly five IDs;
- deterministic activity-quality artifact: **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay distribution: **24 PR-head patterns, `choice_grid` 337/900, `odd_one_out` 5/900, Logic 67/100, Science 60/100**;
- browser log explicitly reports: Odd-one-out browser QA passed 3 viewports with canonical Logic foundation progression, keyboard wrong-state, pointer completion, trio layout, CTA and assessed evidence checks;
- wrong choice does not complete; correct choice records assessed attempt metadata with `choice_odd_one_out_interaction`, one incorrect/retry and 0.5 accuracy on the representative path;
- controls remain >=44px, no horizontal overflow, and success CTA remains inside viewport at 320x720, 390x844 and 768x1024;
- manual review of green #564 idle/error/success screenshots at all three viewports accepted the visual hierarchy, error state, success summary and CTA; no polish commit was required.

## Remaining acceptance before shipping #125

1. Finalize canonical docs on the PR head while keeping merged-vs-unmerged state explicit.
2. Run full CI again on that exact docs head.
3. Check PR comments, submitted reviews and review threads after final CI.
4. Re-fetch exact head and mergeability.
5. Squash merge only with exact `expected_head_sha`.
6. Verify live `main` at the returned merge SHA.
7. Complete a docs-only post-merge closure, full closure CI and exact-head closure merge.

Only after all seven steps may pattern #24 be described as shipped.
