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

Pattern #34 `initial_sound` is **FULLY CLOSED** via implementation PR #147 + closure PR #148. Final verified `main` SHA is `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717 / run `35074306579` passed the full matrix including Cloudflare production smoke.

Pattern #35 `picture_word_match` implementation PR **#149** is **QA ACCEPTED / UNMERGED**. Accepted code head `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca` passed full CI #718 / run `35082720001`, including Ubuntu/Windows, production build, dependency audit, secret scan, Chromium browser QA, deterministic quality/distribution audits, simulations and Batch17.

Accepted candidate distribution on PR #149:

```text
900 / 900 classified
0 unclassified
35 active candidate patterns
choice_grid                 287 / 900 = 31.89%
picture_word_match            5 / 900 = 0.56%
initial_sound                  3 / 900 = 0.33%
equal_groups                   3 / 900 = 0.33%
make_total                     5 / 900 = 0.56%
take_away                      5 / 900 = 0.56%
Bahasa choice_grid            39 / 100
Math choice_grid              43 / 100
Science choice_grid           56 / 100
Logic choice_grid             47 / 100
English choice_grid           44 / 100
Iqro choice_grid              58 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. No global hotspot exceeds the advisory 35% threshold.

## Picture Word Match — Pattern #35 QA record

Exact scope:

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical lowercase word choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `bahasa.kata.picture_matching`;
- stage `bahasa-suku-kata-kata`, lesson `bahasa-kata-gambar`, pack `bahasa.pack.kata-gambar`;
- activity IDs and completion semantics;
- `bahasa-pasang-kata-*` remains `visible_matching`;
- Syllable Assembly, audio word recognition, Initial Sound, English, Math and non-scope families remain unchanged;
- content seeds, schema and migrations remain unchanged.

Interaction/evidence contract:
- familiar canonical object is presented as the visual clue;
- answer text stays masked as `?` until correct;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable, cannot complete and cannot reveal the word;
- correct choice completes the canonical activity and reveals the word;
- no changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_picture_word_match_interaction`;
- runtime metadata source `picture-word-match-runtime` with `picture`, `word` and `selectedChoice`.

Acceptance evidence:
- branch started exactly from Pattern #34 final `main` `8bfb0027a5f4963a6875310c7408cb56018cc422`;
- exact code head `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca` passed CI #718 / run `35082720001`;
- exact family regression verifies only the five reviewed Bahasa Wave B activities classify as `picture_word_match`;
- representative browser QA uses `bahasa-gambar-apel` and legitimate immediate-prior Wave A readiness;
- browser QA covers 320x720, 390x844 and 768x1024, keyboard wrong-state, pointer success, false-completion/reveal guards, evidence metadata, touch targets, feedback and CTA visibility;
- all nine idle/wrong/success screenshots passed manual visual review with no clipping or horizontal overflow;
- distribution is 900/900 classified with 35 active candidate patterns;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #35 remains **UNMERGED**. Canonical docs-head CI, exact-head clean merge gate, live-main verification and the separate post-merge docs closure are still required.

## Initial Sound — Pattern #34 FULLY CLOSED

Implementation PR #147 and closure PR #148 are complete. Closure head `fadef258d11e386491df5c112dab7221b097213d` passed CI #716 / run `35073594364`. Final verified `main` is `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717 / run `35074306579` passed the full matrix including Cloudflare production smoke.

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
- WS-05 Take Away — Pattern #32 fully closed via #143 + #144.
- WS-05 Equal Groups — Pattern #33 fully closed via #145 + #146.
- WS-05 Initial Sound — Pattern #34 **FULLY CLOSED** via #147 + #148; final main `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717.
- WS-05 Picture Word Match — Pattern #35 **QA ACCEPTED / PR #149 OPEN**; code-head CI #718 full success and 9/9 screenshots manually accepted.
- WS-05 NEXT after Pattern #35 full closure — fresh Pattern #36 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #35 itself remains unclosed until implementation and docs-only closure are exact-head merged and independently verified live on `main` with Cloudflare smoke.
