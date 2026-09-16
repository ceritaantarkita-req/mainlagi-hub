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

All subjects remain 100 KEEP / 0 flagged. Deterministic zero does **not** mean every activity is human-approved or maximally varied. Gameplay diversity, art direction, real-device/accessibility, and Iqro expert review remain separate requirements.

## WS-05 gameplay diversification

Pattern #32 `take_away` is **FULLY CLOSED**. Pattern #33 `equal_groups` implementation PR #145 is **MERGED / LIVE VERIFIED**; docs-only closure is the remaining final gate.

Verified merged distribution after PR #145:

```text
900 / 900 classified
0 unclassified
33 active merged patterns
choice_grid                 295 / 900 = 32.78%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Math choice_grid             43 / 100
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. There is no global hotspot on the merged Pattern #33 baseline.

## Equal Groups — Pattern #33 merged/live closure record

Exact scope:

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical numeric choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `math.grouping.equal_groups`;
- stage `math-operasi-awal`, lesson `math-grouping`, pack `math.pack.grouping`;
- activity IDs and completion semantics;
- `math-group-match-2s` and `math-group-match-3s` remain `visible_matching`;
- missing-number, addition, subtraction, length/size and existing Math specialized mechanics remain outside scope;
- all non-Math families remain outside scope;
- content, schema and migrations remain unchanged.

Interaction/evidence contract:
- the reviewed total is visibly separated into equal-size groups;
- config requires total 2..10, a positive proper group size, exact divisibility, and `totalCount / groupSize` equal to canonical `correctChoice`;
- numeric group count stays masked as `?` until a correct assessment;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable, cannot complete and cannot reveal the group count;
- correct choice completes the canonical activity and may reveal the group count;
- no changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_equal_groups_interaction`;
- runtime metadata source `equal-groups-runtime` with `totalCount`, `groupSize`, `groupCount` and `selectedChoice`.

Acceptance and merge chain:
- CI #685 / run `35052200287` correctly caught 320x720 success CTA clipping;
- CI #686 / run `35052577160` correctly caught 390x844 idle-feedback clipping after the first responsive fix;
- accepted code head `26c2b2355099c4097c015ba5767703035b33aa63` passed full CI #687 / run `35053008065`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual review;
- final implementation docs head `11f278a0150ff31b1ba89394c23b78fa244038aa` passed full CI #692 / run `35053984870`;
- PR #145 passed the clean exact-head merge gate and squash merged as `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #693 / run `35054346467` passed all gates including Cloudflare production smoke;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #33 is **MERGED / LIVE VERIFIED / CLOSURE PENDING**. It becomes fully closed only after its docs-only closure PR passes fresh exact-head CI, clean review/thread/mergeability gate, exact-head merge, independent final `main` verification, and post-closure `main` CI including Cloudflare production smoke.

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
- WS-05 Make Total — Pattern #31 fully closed via #141 + #142.
- WS-05 Take Away — Pattern #32 fully closed via #143 + #144; final CI #684.
- WS-05 Equal Groups implementation — **MERGED PR #145 / LIVE VERIFIED**; merge SHA `3de991e75fdb4fdf33d1cd9cdcf90443ddbb3fb6`; post-merge CI #693 full success including Cloudflare smoke.
- WS-05 Equal Groups closure — **PENDING**.
- WS-05 NEXT after Pattern #33 full closure — fresh Pattern #34 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #33 itself remains unclosed until the docs-only closure PR is exact-head merged and independently verified live on `main`.
