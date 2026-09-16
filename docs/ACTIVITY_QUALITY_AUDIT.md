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

Pattern #31 `make_total` is **FULLY CLOSED** through implementation PR #141 and closure PR #142. Final verified Pattern #31 `main` SHA is `79a1b3871e7494a7f9580ca26e56f4f30d5874b4`; final CI #670 / run `35045153104` passed the full matrix including Cloudflare production smoke.

Current verified merged distribution:

```text
900 / 900 classified
0 unclassified
31 active merged patterns
choice_grid                 303 / 900 = 33.67%
make_total                    5 / 900 = 0.56%
Math choice_grid             51 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Pattern #32 `take_away` is **QA ACCEPTED / UNMERGED** on PR #143. Accepted PR-head distribution:

```text
900 / 900 classified
0 unclassified
32 active PR-head patterns
choice_grid                 298 / 900 = 33.11%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             46 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. There is no global >35% hotspot on the accepted PR head.

## Take Away — Pattern #32 QA acceptance record

Exact scope:

```text
math-sub-3-1
math-sub-4-2
math-sub-5-1
math-sub-6-2
math-sub-7-3
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical numeric choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `math.operation.subtraction.within_10`;
- stage `math-operasi-awal`, lesson `math-subtraction`, pack `math.pack.subtraction`;
- activity IDs and completion semantics;
- addition remains `make_total`; grouping, missing-number, length/size and existing Math specialized mechanics remain outside scope;
- all non-Math families remain outside scope.

Interaction/evidence contract:
- one reviewed starting group is visualized and exactly `removeCount` objects are visibly marked as taken away;
- numeric remainder stays masked as `?` until a correct assessment;
- config requires a positive proper removed subset, start count <=10 and `startCount - removeCount` exactly equal to canonical `correctChoice`;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable, cannot complete, and cannot reveal the numeric remainder;
- correct choice completes the canonical activity and may reveal the remainder;
- no changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_take_away_interaction`;
- runtime metadata source `take-away-runtime` with reviewed start/remove counts and selected canonical choice.

Acceptance chain so far:
- accepted implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed full CI #671 / run `35047494614` on its first run;
- full CI passed central + dedicated Take Away regressions, Ubuntu, Windows, production build, dependency/secret audits, simulations, Batch17 and Chromium mobile/accessibility/browser QA;
- gameplay distribution remained 900/900 classified with 32 active patterns and `choice_grid` reduced to 298/900;
- manual idle/wrong/success screenshot review at 320x720, 390x844 and 768x1024 passed all nine states;
- removed objects remain visually distinct, wrong state keeps `?`, and correct state reveals only the canonical remainder;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #32 is not fully closed until PR #143 receives fresh exact final docs-head CI, exact-head merge/live verification, and the separate docs-only closure is also merged and verified.

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
- WS-05 Syllable Assembly — Pattern #30 fully closed via #139 + #140.
- WS-05 Make Total — Pattern #31 **FULLY CLOSED** via #141 + #142; final CI #670 live-verified.
- WS-05 Take Away — **QA ACCEPTED / UNMERGED PR #143**.
- WS-05 NEXT after Pattern #32 closure — fresh Pattern #33 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #32 itself remains unclosed until its implementation and required post-merge docs closure are both exact-head merged and independently verified live on `main`.
