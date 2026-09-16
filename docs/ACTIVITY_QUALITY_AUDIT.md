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

Pattern #34 `initial_sound` implementation PR #147 is **QA ACCEPTED / UNMERGED** at accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` after full CI #704 / run `35069389333`.

Accepted candidate distribution on PR #147:

```text
900 / 900 classified
0 unclassified
34 active candidate patterns
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

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. There is no global hotspot in the accepted Pattern #34 candidate distribution.

## Initial Sound — Pattern #34 QA acceptance record

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

Acceptance chain:
- CI #701 / run `35059536603` caught the first invalid progression fixture;
- CI #702 / run `35068097261` confirmed targeting the first family activity alone did not unlock the target stage;
- CI #703 / run `35068805216` exposed that the immediate prior Bahasa stage is `bahasa-cerita`, not `bahasa-huruf`;
- final browser fixture uses canonical historical progress plus required practice `bahasa-cerita-teman` (`completion_only_v1`) to satisfy the real stage-unlock contract;
- accepted code head `207153f8e88f7c5e64949354c12b4feb1ee583e8` passed full CI #704 / run `35069389333`;
- dedicated 320x720, 390x844 and 768x1024 idle/wrong/success browser QA passed progression, keyboard wrong-state, pointer completion, masked answer, false-completion guard, touch-target and evidence checks;
- all nine Initial Sound screenshots passed manual visual review;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #34 remains **UNMERGED** until docs-head CI and clean exact-head merge gates complete. It is not fully closed until the implementation is merged/live-verified and its separate docs-only closure is also exact-head merged and verified on `main` with Cloudflare smoke.

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
- WS-05 Initial Sound implementation — **PR #147 QA ACCEPTED / UNMERGED**; accepted code CI #704.
- WS-05 NEXT after Pattern #34 full closure — fresh Pattern #35 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #34 itself remains unclosed until implementation + separate closure are exact-head merged and independently verified live on `main`.
