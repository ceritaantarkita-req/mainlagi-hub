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

Pattern #35 `picture_word_match` is **FULLY CLOSED** via implementation PR #149 + closure PR #150. Final verified `main` SHA is `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`; final CI #727 / run `35086954102` passed the full matrix including exact Cloudflare production smoke.

Pattern #36 `sentence_order_cards` implementation PR **#151** is **QA ACCEPTED / UNMERGED** at accepted code head `595bc4e94065eb5250aef27797858641ca959c67`; CI #728 / run `35089266590` passed the full PR matrix.

Accepted candidate distribution from CI #728:

```text
900 / 900 classified
0 unclassified
36 active candidate patterns
choice_grid                 282 / 900 = 31.33%
sentence_order_cards          5 / 900 = 0.56%
picture_word_match            5 / 900 = 0.56%
initial_sound                  3 / 900 = 0.33%
Bahasa choice_grid            34 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. No global hotspot exceeds the advisory 35% threshold.

## Sentence Order Cards — Pattern #36 QA acceptance record

Exact scope:

```text
bahasa-urut-ibu-memasak
bahasa-urut-adi-berlari
bahasa-urut-kucing-tidur
bahasa-urut-siti-membaca
bahasa-urut-burung-terbang
```

Preserved:
- canonical `tap_choice` runtime;
- exactly three canonical sentence choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `bahasa.kalimat.order`;
- stage `bahasa-kalimat-pemahaman`, lesson `bahasa-kalimat-urutan`, pack `bahasa.pack.kalimat-urutan`;
- activity IDs, content payload and completion semantics;
- all non-scope Bahasa, Letters, Logic, Math and other subject families;
- schema and migrations.

Interaction/evidence contract:
- each unchanged canonical sentence is rendered as a left-to-right sequence of word cards;
- cards are presentation only: the child still makes one direct canonical sentence choice;
- keyboard/touch/pointer direct selection remains available; no drag-only dependency;
- wrong choice increments assessed incorrect/retry and cannot complete;
- correct choice completes the canonical activity;
- no invented tokens, changed answer set, extra confirmation or intermediate assessment;
- assessed fidelity `choice_sentence_order_cards_interaction`;
- runtime metadata source `sentence-order-cards-runtime` with `selectedChoice` and `selectedWords` derived only from canonical choice text.

Acceptance evidence:
- branch started exactly from Pattern #35 final `main` `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`;
- accepted code head `595bc4e94065eb5250aef27797858641ca959c67` passed full CI #728 / run `35089266590`;
- Ubuntu typecheck/lint/engine suite, deterministic quality/distribution, simulations and Batch17 passed;
- Windows typecheck/lint/engine suite passed;
- production build/budgets, dependency audit and secret-history scan passed;
- representative browser QA uses `bahasa-urut-ibu-memasak` with legitimate immediate-prior Bahasa Wave B readiness;
- Chromium QA covers 320x720, 390x844 and 768x1024, exact three canonical choices, keyboard wrong-state, pointer completion, false-completion guard, evidence metadata, >=44px targets, horizontal overflow and visible feedback/CTA;
- all nine idle/wrong/success screenshots passed manual visual review;
- distribution artifact confirms **900/900 classified, 36 active candidate patterns, `choice_grid` 282, `sentence_order_cards` 5, Bahasa `choice_grid` 34**;
- deterministic quality artifact confirms **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #36 remains **UNMERGED** until canonical docs pass fresh exact-head CI and PR #151 passes clean exact-head scope/review/thread/mergeability gates. Full closure additionally requires implementation live verification plus a separate docs-only closure.

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
- WS-05 Initial Sound — Pattern #34 fully closed via #147 + #148.
- WS-05 Picture Word Match — Pattern #35 **FULLY CLOSED** via #149 + #150; final main `b00a5b59e213dcd3f2410dd2ffb45c2e7f8dc3d0`; final CI #727.
- WS-05 Sentence Order Cards — Pattern #36 **PR #151 QA ACCEPTED / UNMERGED**; accepted code CI #728.
- WS-05 NEXT only after Pattern #36 full closure — fresh Pattern #37 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #36 itself remains open until implementation and separate closure are exact-head merged and independently verified live on `main` with Cloudflare smoke.
