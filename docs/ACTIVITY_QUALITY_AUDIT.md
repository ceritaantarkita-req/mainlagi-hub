# Mainlagi Activity Quality Audit

Last reviewed: **15 September 2026**

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

Merged waves:
- `symbol_hunt` — 74 direct-literacy activities.
- `memory_pair` — PR #101.
- `missing_sequence_slot` — PR #102.
- `sorting_buckets` — PR #103.
- `drag_to_target` — PR #104.
- permanent gameplay-distribution audit — PR #105.
- `count_and_select` — PR #106, exactly 9 Math counting activities.
- `number_line` — PR #108, exactly 6 Math Wave B ordering activities.
- `more_less_balance` — PR #109, exactly 6 Math Wave B comparison activities.
- `pattern_completion` — PR #110, exactly 5 Math Wave B choice-pattern activities.
- `cause_effect` — PR #112, exactly 4 Science Wave B water-change choice activities; merge `768b7f53a003d7677a74ea54e9686418c900eab4`.

Current active QA wave:
- `compare_properties` — PR #114, exactly 3 Science Wave C direct-comparison activities; **accepted QA but unmerged**.

Merged distribution after PR #112:

```text
900 / 900 classified
0 unclassified
18 active patterns
choice_grid          362 / 900 = 40.22%
Science choice_grid    75 / 100
Logic choice_grid      77 / 100
```

PR #114 measured QA distribution:

```text
900 / 900 classified
0 unclassified
19 active patterns on PR head
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

Concentration is advisory and does not itself create POLISH/REDESIGN findings.

## Compare Properties — ACCEPTED QA / PR #114 / UNMERGED

Exact scope:

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Explicit exclusions:

```text
science-observe-record-same-time
science-match-observation-tools-c
```

Preserved:
- canonical runtime `tap_choice`;
- choices/correctChoice;
- assessment and stars;
- progression;
- activity IDs and completion semantics;
- Wave C stage identity.

Interaction/evidence:
- child compares two visible property representations directly;
- qualitative visual encodings cover length, temperature, and relative fill;
- no invented numeric measurement values;
- canonical third distractor remains an accessible button;
- wrong answer is measured/retryable and cannot complete;
- assessed fidelity `choice_compare_properties_interaction`;
- exact three-ID allowlist prevents unrelated Science activities from reclassification.

Accepted evidence:
- CI #522 full green before final visual cleanup;
- manual visual review caught duplicated A/B label text and caused a targeted polish commit;
- accepted implementation head `c962e0c05a38eecf2890a76bf6417545100238a1`;
- CI #523 full green across Ubuntu, Windows, build, dependency audit, secret scan, and Mobile Chromium;
- representative route uses legitimate Science Wave B readiness to unlock Wave C;
- keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px controls, no horizontal overflow, and CTA visibility all pass;
- manual visual review after polish accepted idle/error/success at 320, 390, and 768;
- activity-quality remains **900 KEEP / 0 flagged**, structural findings 0.

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
- WS-05 Compare Properties — **ACCEPTED QA / PR #114; final docs-head CI + merge pending**.
- WS-05 NEXT — after #114 merge, continue fresh objective-driven Science audit; no pattern #20 is committed yet.

## Completion rule

Product-quality work remains open until gameplay diversity is materially expanded, human pedagogical/art review is addressed, canonical docs stay current, physical-device/accessibility acceptance is completed, and specialist Iqro review is done.
