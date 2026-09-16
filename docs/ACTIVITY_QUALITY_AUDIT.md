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

Pattern #36 `sentence_order_cards` is **FULLY CLOSED** via implementation PR #151 + closure PR #152. Final verified `main` SHA is `461b0fd59a6c238752aa858bf783716b225b548a`; final CI #732 / run `35094107947` passed the full matrix including exact Cloudflare production smoke.

Pattern #37 `reading_passage_question` implementation PR **#153** is open. Accepted implementation head `6ac29623ce53940f45cdfea623340d833af68c4d` passed full CI #733 / run `35096952272`, and all nine dedicated responsive screenshots passed manual visual acceptance. Canonical docs and a fresh exact docs-head CI are the next implementation gates.

Verified merged distribution on current `main` remains 36 patterns. Accepted Pattern #37 implementation-head distribution is:

```text
900 / 900 classified
0 unclassified
37 active candidate patterns
choice_grid                    277 / 900 = 30.78%
reading_passage_question         5 / 900 = 0.56%
sentence_order_cards              5 / 900 = 0.56%
picture_word_match                5 / 900 = 0.56%
Bahasa choice_grid                29 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings. No global hotspot exceeds the advisory 35% threshold.

## Reading Passage Question — Pattern #37 implementation acceptance

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

Acceptance evidence:
- exact base was fully closed Pattern #36 `main` `461b0fd59a6c238752aa858bf783716b225b548a`;
- accepted code head `6ac29623ce53940f45cdfea623340d833af68c4d` passed CI #733 / run `35096952272`;
- dedicated browser QA passed 320x720, 390x844 and 768x1024 idle/wrong/success;
- all 9 screenshots passed manual visual review with no clipping/overflow and visible wrong/success feedback + CTA;
- wrong-then-right path records `correctCount=1`, `incorrectCount=1`, `retryCount=1`, `accuracy=0.5`;
- gameplay-distribution audit passes 900/900 classification with 37 candidate patterns and no global hotspot;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #37 remains **implementation-in-progress**, not merged or fully closed. It still requires canonical docs, fresh exact-head PR CI, clean merge gate, implementation merge, independent live-main verification, then the separate docs-only closure chain.

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
- WS-05 Sentence Order Cards — Pattern #36 fully closed via #151 + #152; final `main` `461b0fd59a6c238752aa858bf783716b225b548a`; CI #732 full success.
- WS-05 Reading Passage Question — Pattern #37 **IMPLEMENTATION ACCEPTED / PR #153 OPEN**; accepted head `6ac29623ce53940f45cdfea623340d833af68c4d`; CI #733 full success; docs/fresh exact-head implementation gates pending.
- WS-05 NEXT only after Pattern #37 full closure — fresh Pattern #38 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #37 itself remains open until implementation and its separate post-merge docs closure are exact-head merged and independently verified live on `main` with Cloudflare smoke.
