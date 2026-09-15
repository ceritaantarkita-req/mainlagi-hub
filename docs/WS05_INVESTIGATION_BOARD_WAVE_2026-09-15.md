# WS-05 Investigation Board Wave — 2026-09-15

Status: **FULLY CLOSED subject to closure PR #136 exact-head merge/live verification**

Implementation PR: **#135**  
Closure PR: **#136**  
Implementation merge SHA: `790487b1672bcf1d1edce023c3f071a7f1175fbf`

## Objective

Pattern #28 adds one meaningful Science gameplay pattern for the exact Wave D investigation/evidence family without changing canonical activity identity, runtime, assessment, mastery, progression, choices, or correct answers.

Pattern: `investigation_board`.

## Exact scope

```text
science-investigate-plant-light
science-investigate-fair-water
science-predict-ice-warm-place
science-evidence-shadow-times
```

All four share subject `science`, stage `science-evidence-review-challenge`, lesson `science-investigation-evidence`, pack `science.pack.investigation-evidence`, canonical skill `science.investigation.evidence.basic`, assessed `tap_choice`, exactly three canonical choices, and unchanged `correctChoice`.

`science-match-observation-tools-d` remains explicitly outside the pattern and stays canonical `matching` / `grid_pairs` / `visible_matching`.

## Interaction/evidence contract

- reusable inquiry rail: **Amati / Jaga tetap / Prediksi / Simpulkan**;
- one reviewed mode active per activity;
- scenario board shows only prompt-supported facts;
- focus cue does not reveal the answer;
- canonical three direct-selection choices remain unchanged;
- wrong choice records assessed error/retry and cannot complete;
- correct choice completes the canonical activity;
- no extra confirmation, invented experiment result, fabricated numeric measurement, drag-only dependency, or intermediate assessment;
- assessed fidelity `choice_investigation_board_interaction`;
- runtime metadata source `investigation-board-runtime`.

## Acceptance and closure chain

- CI #611 / run `34983143311` correctly rejected an initial 320px idle-feedback visibility defect; the browser assertion was not weakened;
- final mobile-fix head `837c3b8ec46ed4a9bfc17a777adeb86dcbffcdc4` passed full CI #614 / run `34987172569`;
- manual review accepted idle/try/success screenshots at 320x720, 390x844 and 768x1024;
- final canonical implementation/docs head `a2b01b272c6dc42f819c43a74e8f52058ed0298d` passed full CI #615 / run `34988108936`;
- PR #135 exact-head squash merged as `790487b1672bcf1d1edce023c3f071a7f1175fbf`;
- independent branch read verified live `main` exactly at that implementation merge SHA;
- docs-only closure is PR #136. Its exact-head full CI, clean review/mergeability gate, merge, and final live-main verification are the final closure gate for this record.

Verified merged distribution:

```text
classified:                 900 / 900
unclassified:                 0
active merged patterns:      28
choice_grid                 318 / 900 = 35.33%
investigation_board           4 / 900 = 0.44%
Science choice_grid           56 / 100
Logic choice_grid             52 / 100
```

Remaining WS-05 distance: **22 patterns to minimum 50** and **32 to working target 60**.

Deterministic activity-quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**. Simulations and Batch17 acceptance remain clean. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Next

Only after closure PR #136 is exact-head merged and independently verified live on `main`, start a fresh objective/evidence audit for Pattern #29. No next family is pre-approved.
