# WS-05 Investigation Board Wave — 2026-09-15

Status: **QA ACCEPTED / PR #135 UNMERGED**

Branch: `agent/ws05-science-investigation-board-20260915`

Base: verified live `main` at `05abb5191159299ee75b7a00a46d9ae4cdba075a` after Spatial Transform closure PR #134.

## Audit decision

The verified 27-pattern baseline has Science at exactly 60/100 `choice_grid` while Logic is 52/100. Concentration is only advisory, so the fresh audit compared coherent families rather than mechanically choosing the largest count.

Logic Wave C relative ordering is a viable later candidate, but Science Wave D `science-investigation-evidence` has the stronger next objective fit: four assessed `tap_choice` activities share one lesson, pack and skill while asking the child to reason from visible evidence about what to observe, what to keep constant, what to predict, or what conclusion is supported.

Pattern #28: `investigation_board`.

## Exact choice scope

```text
science-investigate-plant-light
science-investigate-fair-water
science-predict-ice-warm-place
science-evidence-shadow-times
```

All four share subject `science`, stage `science-evidence-review-challenge`, lesson `science-investigation-evidence`, pack `science.pack.investigation-evidence`, canonical skill `science.investigation.evidence.basic`, assessed `tap_choice` runtime, exactly three canonical choices and unchanged `correctChoice`.

The fifth lesson activity, `science-match-observation-tools-d`, is explicitly excluded. It remains canonical `matching` / `grid_pairs` / `visible_matching` because its objective is tool-to-measurement matching rather than selecting one evidence-based answer.

## Interaction design

The Investigation Board uses one reusable board with four reviewed inquiry modes: `observe` / **Amati**, `control` / **Jaga tetap**, `predict` / **Prediksi**, and `conclude` / **Simpulkan**.

For each activity the board shows only prompt-supported scenario facts, highlights one process step, gives a focus cue without revealing the answer, and preserves the unchanged three canonical direct-selection choices. Wrong choice increments assessed error/retry and cannot complete; correct choice completes the existing canonical activity. No extra confirmation, invented experiment result, fabricated numeric measurement, drag-only dependency, or intermediate assessment is added.

Assessed evidence fidelity: `choice_investigation_board_interaction`. Runtime metadata source: `investigation-board-runtime`.

## Accepted implementation-head distribution

CI #614 / run `34987172569`, exact implementation head `837c3b8ec46ed4a9bfc17a777adeb86dcbffcdc4`:

```text
classified:                900 / 900
unclassified:                0
active PR-head patterns:    28
choice_grid                318 / 900 = 35.33%
investigation_board          4 / 900 = 0.44%
Science choice_grid          56 / 100
Logic choice_grid            52 / 100
activity quality            900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE
structural findings           0
```

If merged unchanged, remaining distance becomes **22 patterns to minimum 50** and **32 to working target 60**.

## Acceptance history

### CI #611 / run `34983143311` — rejected on real 320px layout defect

All non-browser gates passed. Mobile Chromium correctly blocked acceptance because at 320x720 the idle feedback card was not fully inside the viewport. The strict visibility assertion was retained; the implementation was fixed instead of weakening the test.

### Final mobile fix and accepted implementation head

The final phone layout fix is commit `837c3b8ec46ed4a9bfc17a777adeb86dcbffcdc4`.

The fix preserves the process rail, scenario evidence, focus cue, all three canonical choices, completion/evidence semantics and >=44px interactive touch targets. It compacts redundant/non-interactive mobile presentation so idle/retry/success feedback remains fully visible.

CI #614 / run `34987172569` completed successfully on that exact implementation head:
- Ubuntu quality gate passed typecheck, lint, engine/static regressions, activity-quality audit, gameplay-distribution audit, simulations and Batch17 acceptance;
- Windows compatibility passed typecheck, lint and engine tests;
- production build and JS/lazy-load budgets passed;
- production dependency audit passed;
- full Git-history secret scan passed;
- Mobile route QA passed its complete canonical route/accessibility/lazy-load matrix, including the dedicated Investigation Board browser regression;
- Cloudflare production smoke was skipped by PR conditions, not failed.

Permanent CI artifacts verify 900/900 classified activities, 28 active patterns, `choice_grid` 318/900, `investigation_board` 4/900, and deterministic activity quality of 900 KEEP with zero POLISH/REDESIGN/REPLACE and zero structural findings.

Manual review accepted all nine generated Investigation Board screenshots:
- 320x720 — idle / try / success;
- 390x844 — idle / try / success;
- 768x1024 — idle / try / success.

The reviewed states keep content readable and in viewport with no horizontal clipping, preserve the canonical choices, clearly expose wrong/correct feedback, and keep the success CTA visible.

## QA gate result

1. exact-family static regression proves exactly four choice IDs and preserves canonical runtime, assessment, skill, choices and `correctChoice` — **PASS**;
2. `science-match-observation-tools-d` remains canonical `visible_matching` — **PASS**;
3. permanent gameplay-presentation regression keeps the exact four-ID allowlist and default-family guard — **PASS**;
4. gameplay-distribution audit verifies 28 patterns, 900/900 classified, zero unclassified, `choice_grid` 318/900, Science 56/100 and Logic 52/100 — **PASS**;
5. deterministic activity-quality remains 900 KEEP / zero flagged / structural findings 0 — **PASS**;
6. simulations and Batch17 remain clean — **PASS**;
7. representative browser QA passes 320x720, 390x844 and 768x1024 with legitimate progression readiness, keyboard wrong-state, pointer completion, exact choices, >=44px touch targets, no horizontal overflow, fully visible idle/retry/success feedback + CTA, assessed evidence, and zero console/page errors — **PASS**;
8. generated idle/try/success screenshots manually reviewed at all three viewports — **PASS**;
9. full implementation-head CI #614 is green — **PASS**;
10. canonical docs are finalized by this commit as QA accepted / unmerged — **PENDING fresh exact docs-head CI**;
11. implementation exact-head merge + live-main verification and a separate docs-only closure CI/gate/merge remain required before Pattern #28 is called fully closed.

Pattern #28 is therefore **QA ACCEPTED but still UNMERGED**. Do not call it fully closed until the fresh docs-head CI passes, PR #135 is exact-head merged and independently verified on live `main`, and the post-merge closure record is merged.
