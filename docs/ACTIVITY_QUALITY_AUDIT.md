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

Pattern #31 `make_total` is **FULLY CLOSED** through PR #141 + #142. Pattern #32 `take_away` implementation PR #143 is **MERGED / LIVE VERIFIED**; docs-only closure PR #144 is the final closure gate.

Current verified merged distribution:

```text
900 / 900 classified
0 unclassified
32 active merged patterns
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

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. There is no global >35% hotspot on the merged Pattern #32 baseline.

## Take Away — Pattern #32 merged/live closure record

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

Acceptance and merge chain:
- implementation code head `5b6e774b942b5024bbf5fc21beac63ea0caeb7a7` passed full CI #671 / run `35047494614` on the first run;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success states passed manual visual review;
- final implementation docs head `061b004188e827ff62bd1e5c48377a087f0f9144` passed full CI #676 / run `35048147580`;
- PR #143 passed the clean exact-head merge gate and squash merged as `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #677 / run `35048981508` passed all gates including Cloudflare production smoke;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #32 is **MERGED / LIVE VERIFIED / CLOSURE PR #144 PENDING**. It becomes fully closed only after #144 exact-head CI, clean review/thread/mergeability gate, exact-head merge, independent final `main` verification, and post-closure `main` CI including Cloudflare production smoke.

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
- WS-05 Make Total — Pattern #31 fully closed via #141 + #142; final CI #670 live-verified.
- WS-05 Take Away implementation — **MERGED PR #143 / LIVE VERIFIED**; merge SHA `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`; post-merge CI #677 full success including Cloudflare smoke.
- WS-05 Take Away closure — **PR #144 PENDING**.
- WS-05 NEXT after Pattern #32 full closure — fresh Pattern #33 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #32 itself remains unclosed until PR #144 is exact-head merged and independently verified live on `main`.
