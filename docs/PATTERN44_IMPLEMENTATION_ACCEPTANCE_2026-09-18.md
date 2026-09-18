# Pattern #44 Implementation Acceptance — 18 September 2026

Status: **IMPLEMENTATION CHECKPOINT ACCEPTED / PR #194 / NOT MERGED**

## Accepted scope

```text
pattern: subitizing_glance
activities:
  - math-subitize-2
  - math-subitize-4
  - math-subitize-5
```

Canonical ownership remains Math / `math-jumlah-dasar` / `math-subitizing` / `math.pack.subitizing` / `math.quantity.subitizing` / assessed `tap_choice` / `choice_accuracy_v1`.

## Accepted code checkpoint

```text
head: 3a4385790a793ed5297db4f6d33fa8e1d084ccf1
CI:   #906 / run 35301923329
result: full success
```

CI #905 on the previous head correctly caught a smallest-viewport success-CTA visibility failure. The corrective CSS-only success-state compaction is included in the accepted checkpoint and does not change the canonical stimulus, choices, answer, evidence, progression, mastery, schema, or database.

## Acceptance assertions

- exact three-ID fail-closed config;
- exact canonical prompt/choices/order/`correctChoice`;
- deterministic 3x3 dot arrangements: pair, square, dice-five;
- stimulus stays visible; no forced timing, auto-hide, or speed score;
- existing `count_and_select` scope remains unchanged;
- wrong answer remains retryable/measured and cannot complete;
- correct answer completes through the existing attempt/evidence path;
- assessed accuracy remains `1 / (1 + incorrectCount)`;
- classifier reports exactly 44 active patterns and `choice_grid=246`;
- keyboard wrong-state, pointer success, and actual-touch success are verified;
- 320/390/768 idle/wrong/success dedicated screenshots are manually accepted;
- permanent visual product gate passed;
- Ubuntu, Windows, production build, dependency audit, and secret scan passed;
- no mastery/progression/schema/database migration exists in the PR.

## Verified artifacts

```text
mobile-route screenshots
artifact id: 10529469378
sha256:482035f2b37ebf6bbc5cc8207291a55f9d9ff620c5c91994609a60cdb2f4e380

gameplay distribution
artifact id: 10529739343
sha256:f78d5f341d1ae545d6075e4eec2b46361108fe376cc9fcbacddf59e433a2f93f

activity quality
artifact id: 10529788890
sha256:4eb4991cf347e2efbdd6ebcf70f01175078c149dc7cb31a8a9bb5e86d7985538
```

## Manual visual result

All nine dedicated Pattern #44 screenshots were reviewed. Result: **ACCEPTED / no P0-P1 Pattern #44 visual blocker**.

The implementation is accepted at this exact code checkpoint, but it is **not merged production truth**. The docs-inclusive final PR head still needs full CI, exact-head merge, and independent merged-main production verification.
