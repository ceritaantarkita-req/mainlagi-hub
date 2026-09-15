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

Fully merged waves through verified Pattern #29:
- `symbol_hunt` — 74 direct-literacy activities.
- `memory_pair` — PR #101.
- `missing_sequence_slot` — PR #102.
- `sorting_buckets` — PR #103.
- `drag_to_target` — PR #104.
- permanent gameplay-distribution audit — PR #105.
- `count_and_select` — PR #106.
- `number_line` — PR #108.
- `more_less_balance` — PR #109.
- `pattern_completion` — PR #110.
- `cause_effect` — PR #112.
- `compare_properties` — PR #114.
- `material_lab` — PR #116.
- `feature_function_link` — PR #119.
- `healthy_habit_routine` — PR #121.
- `rule_pipeline` — PR #123.
- `odd_one_out` — PR #125 + closure #126.
- `transitive_chain` — PR #127 + closure #128 + metadata #129.
- `set_reasoning` — PR #130 + closure #131 + metadata #132.
- `spatial_transform` — PR #133 + closure #134.
- `investigation_board` — PR #135 + closure #136.
- `relative_order_track` — PR #137 + closure #138 — **FULLY CLOSED**; final verified main `2a5e0f35725456e00b4cd85e64999f9f84a29c6c`, CI #639 full success including Cloudflare smoke.

Current verified merged distribution:

```text
900 / 900 classified
0 unclassified
29 active merged patterns
choice_grid                 313 / 900 = 34.78%
relative_order_track          5 / 900 = 0.56%
Bahasa choice_grid           52 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Pattern #30 `syllable_assembly` is **QA ACCEPTED / UNMERGED** on PR #139. Accepted PR-head distribution:

```text
900 / 900 classified
0 unclassified
30 active PR-head patterns
choice_grid                 308 / 900 = 34.22%
syllable_assembly             5 / 900 = 0.56%
Bahasa choice_grid           47 / 100
Science choice_grid          56 / 100
Logic choice_grid            47 / 100
```

Concentration remains advisory and does not itself create POLISH/REDESIGN findings.

## Syllable Assembly — Pattern #30 QA acceptance record

Exact scope:

```text
bahasa-gabung-baju
bahasa-gabung-buku
bahasa-gabung-meja
bahasa-gabung-bola
bahasa-gabung-susu
```

Preserved:
- canonical runtime `tap_choice`;
- exactly three canonical choices and unchanged `correctChoice`;
- assessment, stars, mastery and progression;
- canonical skill `bahasa.suku_kata.blending`;
- stage `bahasa-suku-kata-kata`, lesson `bahasa-suku-kata-gabung`, pack `bahasa.pack.suku-kata-gabung`;
- activity IDs and completion semantics;
- Bahasa syllable recognition, picture-word, initial-sound, listening and matching remain outside scope;
- English phonics, Math and Logic families remain outside scope.

Interaction/evidence contract:
- visualizes only two canonical syllables already expressed by title/prompt;
- result stays masked as `?` until a correct assessment;
- config requires the two syllables to concatenate exactly to canonical `correctChoice`;
- canonical keyboard/touch/pointer direct selection remains available;
- wrong choice is measured/retryable, cannot complete, and cannot reveal the word;
- correct choice completes the canonical activity and may reveal the word;
- no invented syllable, answer leakage, changed choice set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_syllable_assembly_interaction`;
- runtime metadata source `syllable-assembly-runtime`.

Acceptance chain so far:
- CI #640 / run `34999759651` caught missing registration in the permanent central gameplay-presentation gate and was fixed without weakening the default-family assertion;
- CI #641 / run `35000289970` caught missing learning-test compile-manifest coverage for the new config and was fixed;
- accepted implementation head `d55c1deb54f1402c38d84417ca7ae8248c9d3b07` passed full CI #642 / run `35000557604`;
- full CI includes central + dedicated Syllable Assembly regressions, Ubuntu, Windows, production build, dependency/secret audits, simulations, Batch17 and Chromium mobile/accessibility/browser QA;
- manual idle/wrong/success screenshot review at 320x720, 390x844 and 768x1024 passed all nine states;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #30 is not fully closed until PR #139 receives fresh exact final docs-head CI, exact-head merge/live verification, and the separate docs-only closure is also merged and verified.

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
- WS-05 Memory Pair DONE — PR #101.
- WS-05 Sequence Slot DONE — PR #102.
- WS-05 Sorting Buckets DONE — PR #103.
- WS-05 Drag-to-Target DONE — PR #104.
- WS-05 Gameplay Distribution Audit DONE — PR #105.
- WS-05 Count-and-Select DONE — PR #106.
- WS-05 Number Line DONE — PR #108.
- WS-05 More/Less Balance DONE — PR #109.
- WS-05 Pattern Completion DONE — PR #110.
- WS-05 Cause/Effect DONE — PR #112.
- WS-05 Compare Properties DONE — PR #114.
- WS-05 Material Lab DONE — PR #116.
- WS-05 Feature Function Link DONE — PR #119.
- WS-05 Healthy Habit Routine DONE — PR #121.
- WS-05 Rule Pipeline DONE — PR #123.
- WS-05 Odd One Out DONE — PR #125 + #126.
- WS-05 Transitive Chain DONE — PR #127 + #128 + #129.
- WS-05 Set Reasoning DONE — PR #130 + #131 + #132.
- WS-05 Spatial Transform DONE — PR #133 + #134.
- WS-05 Investigation Board DONE — PR #135 + #136.
- WS-05 Relative Order Track DONE — PR #137 + #138, fully closed and live-verified.
- WS-05 Syllable Assembly — **QA ACCEPTED / UNMERGED PR #139**.
- WS-05 NEXT after Pattern #30 closure — fresh Pattern #31 objective/evidence audit; no family pre-approved.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done. Pattern #30 itself remains unclosed until its implementation and required post-merge docs closure are both exact-head merged and independently verified live on `main`.
