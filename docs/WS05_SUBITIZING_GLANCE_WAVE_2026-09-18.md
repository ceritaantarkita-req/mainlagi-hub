# WS-05 Pattern #44 Subitizing Glance Wave — 18 September 2026

Status: **IMPLEMENTATION VERIFIED ON PR CHECKPOINT / PR #194 / NOT MERGED**

## Verified implementation base

Pattern #44 audit:

```text
Audit PR:          #193
Audit main:        8b3cb7e73a77502b4c9206936e7736ac9169b1ca
Audit main CI:     #904 / run 35299949341
Result:            full success including exact Cloudflare production smoke
```

Merged production truth at implementation start remains:

```text
classified:        900 / 900
unclassified:        0
active patterns:    43
choice_grid        249 / 900
```

## Implementation PR

```text
PR:                    #194
Branch:                agent/pattern44-subitizing-glance-20260918
Base:                  8b3cb7e73a77502b4c9206936e7736ac9169b1ca
Verified code head:    3a4385790a793ed5297db4f6d33fa8e1d084ccf1
Verified code CI:      #906 / run 35301923329 — full success
Pattern:               subitizing_glance
```

An earlier implementation head `f118aad7dfa65b3473212ab35a3df07c9edd9d93` reached CI #905. All non-browser gates passed, but the dedicated Pattern #44 browser QA correctly blocked merge because the success CTA was not fully visible at the smallest viewport. The responsive success state was compacted without changing the learning stimulus or evidence contract. The corrected exact code head `3a4385790a793ed5297db4f6d33fa8e1d084ccf1` then passed the complete PR gate in CI #906.

This documentation refresh advances PR #194 beyond that verified code checkpoint. Therefore the resulting docs-inclusive PR head must independently pass full PR CI before merge. Pattern #44 must not be described as merged, live, or fully closed until exact-head merge and merged-main Cloudflare verification pass.

## Exact scope

```text
math-subitize-2
math-subitize-4
math-subitize-5
```

Explicitly outside scope:

```text
math-count-2 through math-count-10 / existing count_and_select family
math-match-number-quantity-* / canonical matching
math-recognize-* / numeral recognition
all unrelated Math and non-Math activities
```

## Canonical ownership preserved

```text
subject:     math
stage:       math-jumlah-dasar
lesson:      math-subitizing
pack:        math.pack.subitizing
skill:       math.quantity.subitizing
runtime:     tap_choice
assessment:  assessed
contract:    choice_accuracy_v1
```

No canonical activity ID, prompt, choice order, submitted answer string, `correctChoice`, mastery rule, progression rule, schema, or database record is rewritten.

## Implemented interaction contract

Pattern #44 presents each audited quantity as a deterministic spatial dot arrangement on a stable 3x3 board:

```text
math-subitize-2  -> pair
math-subitize-4  -> square
math-subitize-5  -> dice_five
```

The board intentionally differs from `count_and_select`:
- `count_and_select` teaches explicit one-by-one enumeration;
- `subitizing_glance` preserves the lesson objective of recognizing a small quantity from a spatial pattern;
- no forced timer is introduced;
- no stimulus auto-hide is introduced;
- no speed score is introduced;
- no additional assessed checkpoint is introduced;
- all three canonical choices retain their exact order and submitted value.

The stimulus remains visible during idle, wrong/retry, and success states. Wrong selection cannot complete. Success uses the existing canonical correct choice.

## Runtime evidence

Canonical `choice_accuracy_v1` remains primary. Presentation metadata adds only interaction identity:

```text
source:           subitizing-glance-runtime
evidenceFidelity: choice_subitizing_interaction
patternMode
selectedChoice
visibleDotCount
```

For assessed completion, measured accuracy remains:

```text
1 / (1 + incorrectCount)
```

The representative browser path verifies one wrong answer followed by the correct answer as accuracy `0.5`, `correctCount=1`, `incorrectCount=1`, and `retryCount=1`.

## Fail-closed configuration

`subitizingGlanceConfig()` returns a config only when all audited assumptions remain exact:

- subject is Math;
- stage is `math-jumlah-dasar`;
- runtime is `tap_choice`;
- ID is one of the exact three audited IDs;
- prompt is byte-preserved;
- three choices are byte-preserved and ordered;
- `correctChoice` is byte-preserved;
- dot-cell indexes are unique and constrained to the 3x3 board;
- visible dot count equals the canonical correct numeric answer.

Any drift falls back instead of silently absorbing changed content into Pattern #44.

## Automated verification — code checkpoint

Exact implementation-code checkpoint:

```text
head:   3a4385790a793ed5297db4f6d33fa8e1d084ccf1
CI:     #906 / run 35301923329
result: full success
```

Verified gates:

- Ubuntu quality gate: success through typecheck, lint, engine/learning tests, activity-quality, gameplay-distribution, simulations and final acceptance;
- Windows compatibility: typecheck, lint and engine tests success;
- Cloudflare/OpenNext production build and build-budget audit: success;
- production dependency audit and full-history secret scan: success;
- full canonical mobile-route/browser matrix: success;
- dedicated Pattern #44 browser QA: success after the responsive CTA fix;
- keyboard wrong-answer path: success;
- pointer completion: success;
- actual touch `tap()` at 390x844: success;
- permanent visual product baseline: success;
- responsive screenshot artifact upload: success.

Production smoke is intentionally skipped on pull-request runs and remains a required merged-main gate.

## Distribution verification

The verified code checkpoint produced the intended blocking distribution:

```text
classified:                    900 / 900
unclassified:                    0
active patterns:                44
choice_grid                    246 / 900
subitizing_glance                3 / 900
single_rule_apply                 5 / 900
```

Gameplay-distribution artifact:

```text
artifact id: 10529739343
digest:      sha256:f78d5f341d1ae545d6075e4eec2b46361108fe376cc9fcbacddf59e433a2f93f
```

Activity-quality artifact:

```text
artifact id: 10529788890
digest:      sha256:4eb4991cf347e2efbdd6ebcf70f01175078c149dc7cb31a8a9bb5e86d7985538
```

## Browser and manual visual QA

Representative `math-subitize-4` was exercised at:

```text
320x720
390x844
768x1024
```

States reviewed:

```text
idle
wrong/retry
success
```

Automated browser QA confirms legitimate Math progression readiness, exact square dot arrangement, canonical choice order, stable visible stimulus, keyboard retry, pointer completion, actual touch completion at 390x844, no false completion, >=44px controls, no horizontal overflow, visible feedback/CTA, measured attempt metadata/counts, and zero browser console/page errors.

Manual review of all nine dedicated screenshots confirms:
- title, prompt, dot stimulus, choices, feedback, and CTA are readable at 320/390/768;
- no horizontal clipping is visible;
- the four-dot square remains visible and unchanged in idle, wrong, and success;
- wrong-state selection is visually distinct without revealing a different answer mechanism;
- success CTA is fully visible after the responsive fix, including 320x720;
- the Garden mascot remains decorative and does not obscure controls;
- no Pattern #44 P0/P1 visual blocker remains.

Responsive screenshot artifact:

```text
artifact id: 10529469378
digest:      sha256:482035f2b37ebf6bbc5cc8207291a55f9d9ff620c5c91994609a60cdb2f4e380
manual result: ACCEPTED / no P0-P1 Pattern #44 visual blocker
```

## Remaining gates before Pattern #44 closure

1. Run full CI on the docs-inclusive final PR #194 head created by this truth refresh.
2. Re-check PR mergeability, comments/reviews, and unresolved review threads.
3. Merge only the exact verified final PR head.
4. Independently verify resulting `main`, including gameplay distribution and exact Cloudflare production smoke.
5. Create and merge final Pattern #44 closure truth across canonical docs before starting Pattern #45 implementation work.

Until those gates complete, current merged production truth remains **43 active patterns**; the verified 44-pattern distribution is implementation-branch evidence, not yet merged truth.
