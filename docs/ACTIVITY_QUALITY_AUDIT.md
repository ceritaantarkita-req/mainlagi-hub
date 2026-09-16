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

Pattern #33 `equal_groups` is **FULLY CLOSED** via implementation PR #145 + closure PR #146. Final verified `main` SHA is `0f90a7fae1164ae6ace86f993024cef7b4989ca9`; final CI #700 / run `35058250562` passed the full matrix including Cloudflare production smoke.

Pattern #34 `initial_sound` implementation PR #147 is **MERGED / LIVE VERIFIED**. Exact implementation merge SHA is `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`; post-merge CI #710 / run `35072815182` passed the full matrix including Cloudflare production smoke. Docs-only closure PR **#148** is open and is the remaining closure gate.

Verified merged distribution after PR #147:

```text
900 / 900 classified
0 unclassified
34 active merged patterns
choice_grid                 292 / 900 = 32.44%
initial_sound                 3 / 900 = 0.33%
equal_groups                  3 / 900 = 0.33%
make_total                    5 / 900 = 0.56%
take_away                     5 / 900 = 0.56%
Bahasa choice_grid           44 / 100
Math choice_grid             43 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
English choice_grid          44 / 100
Iqro choice_grid             58 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. There is no global hotspot on the merged Pattern #34 baseline.

## Initial Sound — Pattern #34 merged/live closure record

Exact scope:

```text
bahasa-awal-bola
bahasa-awal-kucing
bahasa-awal-pisang
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical uppercase single-letter choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `bahasa.bunyi.awal.recognition`;
- stage `bahasa-dasar-huruf`, lesson `bahasa-bunyi-awal`, pack `bahasa.pack.bunyi-awal`;
- activity IDs and completion semantics;
- `bahasa-match-awal-tas-susu` remains `visible_matching`;
- vowel recognition/classification, Syllable Assembly, English inverse initial-sound tasks, letter ordering and other subjects remain outside scope;
- content seeds, schema and migrations remain unchanged.

Interaction/evidence contract:
- existing familiar clue stays visible and the canonical word is shown with only its first letter masked;
- child can say/read the displayed familiar word, then choose the first letter;
- first-letter result remains `?` until correct;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable, cannot complete and cannot reveal the answer;
- correct choice completes the canonical activity and reveals the initial letter;
- no changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_initial_sound_interaction`;
- runtime metadata source `initial-sound-runtime` with `word`, `initialSound` and `selectedChoice`.

Acceptance and merge chain:
- CI #701 / run `35059536603`, #702 / run `35068097261`, and #703 / run `35068805216` correctly rejected invalid progression fixtures rather than producing a false browser pass;
- the accepted fixture follows canonical historical Bahasa progress plus immediate prior stage `bahasa-cerita` / required practice `bahasa-cerita-teman`;
- accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` passed full CI #704 / run `35069389333`;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual review;
- final implementation docs head `e12d9eef073a9989bb8e9b6f8d374e098e17edde` passed full CI #709 / run `35072401631`;
- PR #147 passed the clean exact-head merge gate with 16 scoped files, behind 0, zero comments, zero reviews and zero review threads;
- PR #147 squash merged as `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`;
- `main` was independently verified at that exact SHA;
- post-merge `main` CI #710 / run `35072815182` passed all gates including Cloudflare production smoke;
- closure PR #148 is docs-only and is restricted to exactly the five canonical Pattern #34 docs;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #34 is **MERGED / LIVE VERIFIED / CLOSURE PR #148 OPEN**. It becomes fully closed only after PR #148 passes fresh exact-head CI, clean review/thread/mergeability/scope gate, exact-head merge, independent final `main` verification, and post-closure `main` CI including Cloudflare production smoke.

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
- WS-05 Equal Groups — Pattern #33 fully closed via #145 + #146; final main `0f90a7fae1164ae6ace86f993024cef7b4989ca9`; final CI #700.
- WS-05 Initial Sound implementation — **MERGED PR #147 / LIVE VERIFIED**; merge SHA `42da6cfd2114bd29b9aa4ddd36361bb975db2bf1`; post-merge CI #710 full success including Cloudflare smoke.
- WS-05 Initial Sound closure — **PR #148 OPEN**.
- WS-05 NEXT after Pattern #34 full closure — fresh Pattern #35 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #34 itself remains unclosed until closure PR #148 is exact-head merged and independently verified live on `main` with Cloudflare smoke.
