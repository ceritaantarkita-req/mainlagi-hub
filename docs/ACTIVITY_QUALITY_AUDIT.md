# Mainlagi Activity Quality Audit

Last reviewed: **16 September 2026**

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

Fully merged waves through verified Pattern #30 include `symbol_hunt`, `memory_pair`, `missing_sequence_slot`, `sorting_buckets`, `drag_to_target`, `count_and_select`, `number_line`, `more_less_balance`, `pattern_completion`, `cause_effect`, `compare_properties`, `material_lab`, `feature_function_link`, `healthy_habit_routine`, `rule_pipeline`, `odd_one_out`, `transitive_chain`, `set_reasoning`, `spatial_transform`, `investigation_board`, `relative_order_track`, and `syllable_assembly`.

Pattern #30 `syllable_assembly` is fully closed through implementation PR #139 and closure PR #140; final verified `main` is `53667560d72ca4cfe3556bc59411a71c53a84834`, with CI #655 / run `35005253923` full success including Cloudflare production smoke.

Current verified merged distribution:

```text
900 / 900 classified
0 unclassified
30 active merged patterns
choice_grid                 308 / 900 = 34.22%
syllable_assembly             5 / 900 = 0.56%
Bahasa choice_grid           47 / 100
Math choice_grid             56 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Pattern #31 `make_total` is **QA ACCEPTED / UNMERGED** on PR #141. Accepted PR-head distribution:

```text
900 / 900 classified
0 unclassified
31 active PR-head patterns
choice_grid                 303 / 900 = 33.67%
make_total                    5 / 900 = 0.56%
Math choice_grid             51 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Make Total — Pattern #31 QA acceptance record

Exact scope:

```text
math-add-1-1
math-add-2-1
math-add-2-2
math-add-3-2
math-add-4-3
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical numeric choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `math.operation.addition.within_10`;
- stage `math-operasi-awal`, lesson `math-addition`, pack `math.pack.addition`;
- activity IDs and completion semantics;
- subtraction, equal-group grouping, missing-number, length/size, and existing Math specialized mechanics remain outside scope;
- all non-Math families remain outside scope.

Interaction/evidence contract:
- two reviewed positive addend groups are visualized;
- total stays masked as `?` until a correct assessment;
- config requires the two addends to sum exactly to canonical `correctChoice` and remain within 10;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable, cannot complete, and cannot reveal the total;
- correct choice completes the canonical activity and may reveal the total;
- no changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_make_total_interaction`;
- runtime metadata source `make-total-runtime`.

Acceptance chain so far:
- CI #656 / run `35042089820` caught a real 320x720 viewport defect: the idle feedback was below the visible viewport;
- the fix compacted only the narrow/short layout while keeping choice targets >=48px and retaining the strict viewport assertion;
- accepted implementation head `4b513676c9029fbb7a788a49175ed02954f0d2f7` passed full CI #657 / run `35042439233`;
- full CI passed central + dedicated Make Total regressions, Ubuntu, Windows, production build, dependency/secret audits, simulations, Batch17 and Chromium mobile/accessibility/browser QA;
- manual idle/wrong/success screenshot review at 320x720, 390x844 and 768x1024 passed all nine states;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #31 is not fully closed until PR #141 receives fresh exact final docs-head CI, exact-head merge/live verification, and the separate docs-only closure is also merged and verified.

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
- WS-05 gameplay waves through Syllable Assembly DONE — Pattern #30 fully closed via #139 + #140.
- WS-05 Make Total — **QA ACCEPTED / UNMERGED PR #141**.
- WS-05 NEXT after Pattern #31 closure — fresh Pattern #32 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #31 itself remains unclosed until its implementation and required post-merge docs closure are both exact-head merged and independently verified live on `main`.
