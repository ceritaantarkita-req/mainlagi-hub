# Mainlagi Activity Quality Audit

Last reviewed: **16 September 2026**

Status: **WS-04 deterministic triage clean; WS-06 Coloring and WS-07 Drawing complete; WS-05 gameplay diversification active; production visual/product baseline audit queued after Pattern #37 closure.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

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

All subjects remain 100 KEEP / 0 flagged. Deterministic zero does **not** mean every activity or product surface is human-approved or visually final. Gameplay diversity, art direction, production cross-surface UX, real-device/accessibility, and Iqro expert review remain separate requirements.

## WS-05 gameplay diversification

Pattern #36 `sentence_order_cards` is **FULLY CLOSED** via implementation PR #151 + closure PR #152. Final verified `main` SHA is `461b0fd59a6c238752aa858bf783716b225b548a`; final CI #732 / run `35094107947` passed the full matrix including exact Cloudflare production smoke.

Pattern #37 `reading_passage_question` implementation PR **#153 is MERGED and live verified**.

Implementation evidence:
- final PR head `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6`;
- exact-head CI #738 / run `35097844249` — success;
- squash merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c`;
- independent `main` CI #739 / run `35098428328` — full success including exact Cloudflare production smoke;
- all nine dedicated 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual acceptance.

Merged distribution on current `main` is:

```text
900 / 900 classified
0 unclassified
37 active merged patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards              5 / 900 = 0.56%
picture_word_match                5 / 900 = 0.56%
Bahasa choice_grid                29 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. No global hotspot exceeds the advisory 35% threshold. Remaining distance is **13 patterns** to minimum 50 and **23 patterns** to working target 60.

## Reading Passage Question — Pattern #37 merged acceptance

Exact scope:

```text
bahasa-baca-lala-kucing
bahasa-baca-dodi-sepeda
bahasa-baca-nina-bunga
bahasa-baca-raka-sarapan
bahasa-baca-sari-hujan
```

Preserved:
- canonical `tap_choice` runtime;
- exactly three canonical answers, order, and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `bahasa.bacaan.short_comprehension`;
- stage `bahasa-kalimat-pemahaman`, lesson `bahasa-bacaan-pendek`, pack `bahasa.pack.bacaan-pendek`;
- activity IDs and content payload;
- all non-scope families;
- schema and migrations.

Interaction/evidence contract:
- parse the existing quoted passage and following literal question from the unchanged prompt, failing closed outside the reviewed format;
- display the passage and question separately without inventing reading content;
- preserve direct keyboard/touch/pointer selection of the same three answers;
- wrong choice increments assessed incorrect/retry and cannot complete;
- correct choice completes the canonical activity;
- assessed fidelity `choice_reading_passage_question_interaction`;
- runtime metadata source `reading-passage-question-runtime` with canonical `selectedChoice`.

Verified evidence:
- exact implementation base was Pattern #36 final `main` `461b0fd59a6c238752aa858bf783716b225b548a`;
- final implementation head `25baa6f103f4e3bb309fae8f0078c9fb099b9ab6` passed CI #738 / run `35097844249`;
- implementation merge `6a6f99ccb3a733af4e298ed8c48452e019f9980c` passed independent `main` CI #739 / run `35098428328` including exact Cloudflare production smoke;
- dedicated browser QA passed 320x720, 390x844 and 768x1024 idle/wrong/success;
- all 9 screenshots passed manual visual review with no clipping/overflow and visible wrong/success feedback + CTA;
- wrong-then-right path records `correctCount=1`, `incorrectCount=1`, `retryCount=1`, `accuracy=0.5`;
- gameplay-distribution audit passes 900/900 classification with 37 merged patterns and no global hotspot;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #37 is **implementation merged/live verified but not FULLY CLOSED** until this separate docs-only closure passes its own exact-head CI, clean gate, merge and final live-main verification.

## Production visual/product audit boundary

Representative Garden gameplay screenshots are accepted, but this does not equal whole-product visual acceptance.

The next baseline audit after Pattern #37 closure must cover:
- public/home entry;
- child select and child home;
- subject/gallery and stage/readiness states;
- representative activity families plus loading/error/empty states;
- rewards;
- parent, account and auth surfaces;
- header/navigation/menu behavior;
- desktop, tablet and mobile breakpoints.

Audit criteria include visual hierarchy, child/family tone, typography, spacing, card/button consistency, iconography, responsive density, CTA clarity, accessibility/focus behavior, overflow/clipping and state consistency. Full activity-route visual coverage must detect progression redirects instead of counting them as successful activity renders.

The audit will produce a P0/P1/P2 backlog and feed WS-08 Art Bible/permanent visual QA. After that baseline is established, visual QA runs in parallel with future WS-05 patterns.

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
- WS-05 Picture Word Match — Pattern #35 fully closed via #149 + #150.
- WS-05 Sentence Order Cards — Pattern #36 fully closed via #151 + #152.
- WS-05 Reading Passage Question — Pattern #37 **IMPLEMENTATION MERGED / LIVE VERIFIED** via #153; docs-only closure in progress.
- NEXT after Pattern #37 full closure — production visual/product baseline audit, then fresh Pattern #38 objective/evidence audit; no gameplay family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, production cross-surface visual acceptance and Art Bible/permanent QA are established, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #37 itself remains open until its post-merge docs closure is exact-head merged and independently verified live on `main` with Cloudflare smoke.
