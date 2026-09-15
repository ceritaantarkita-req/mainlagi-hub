# WS-05 Science Compare Properties Wave — 2026-09-15

Status: **accepted QA / PR #114 / unmerged**.

Branch: `agent/ws05-gameplay-science-compare-properties-20260915`  
Base `main`: `a628a3a7d3dbb0be9faef2fd2e0c7efddd9c0649`

## Exact scope

```text
science-measure-longer-pencil
science-measure-hot-cold
science-measure-more-water
```

Intentionally excluded:

```text
science-observe-record-same-time
science-match-observation-tools-c
```

The recording activity keeps canonical default choice gameplay because its objective is recording discipline, not direct comparison. The matching activity stays canonical `matching` / `visible_matching`.

## Interaction contract

- child compares two visible objects directly;
- explicit qualitative visual encodings cover length, temperature, and relative fill;
- no ruler values, temperatures, or volume numbers are invented;
- the canonical third distractor remains a separate accessible choice;
- wrong choices are retryable and cannot complete;
- keyboard and touch/pointer share the same controls;
- runtime remains canonical `tap_choice`;
- assessed fidelity is `choice_compare_properties_interaction`.

Evidence metadata records:

```text
source: compare-properties-runtime
propertyKind
comparisonGoal
correctTarget
leftLevel
rightLevel
```

Preserved: activity IDs, canonical choices/correctChoice, assessment, stars, progression, completion identity, and Science Wave C catalog placement.

## Static safety

- exact three-ID allowlist in gameplay classifier;
- config must cover exactly the canonical three choices;
- configured correct target must equal canonical correctChoice;
- left/right qualitative levels must differ;
- `science-observe-record-same-time` is asserted to remain default;
- `science-match-observation-tools-c` is asserted to remain visible matching;
- gameplay distribution expects the explicit 19-pattern set on this PR.

## Browser QA

Representative: `science-measure-longer-pencil`.

Progression guard remains enabled. Browser fixture establishes legitimate previous-stage readiness by completing required Wave B core activities and providing qualifying assessed evidence for the five Wave B Science skills.

QA covers 320x720, 390x844, and 768x1024:
- no progression redirect;
- exact canonical three choices;
- >=44px interaction targets;
- no horizontal overflow;
- keyboard wrong answer;
- wrong answer cannot complete;
- pointer correct completion;
- completion and assessed attempt persistence;
- fidelity `choice_compare_properties_interaction`;
- incorrect/retry/accuracy accounting;
- success CTA fully inside viewport;
- no page/console errors;
- idle/error/success screenshots.

## QA history

CI #522 was full green across the complete matrix. Manual screenshot review then identified a small but real presentation issue: A/B cards repeated the same visible object label and canonical choice text (`Pensil A`, `Pensil B`). The implementation was polished rather than accepting that redundancy.

Accepted implementation head:

```text
c962e0c05a38eecf2890a76bf6417545100238a1
```

The polish hides the secondary canonical text when it is equivalent to the visible card label while preserving the accessible `aria-label` and canonical choice semantics.

CI #523: **full green** across Ubuntu quality, Windows compatibility, production build, production dependency audit, secret-history scan, and Mobile Chromium. Production smoke skipped as expected for PR environment.

Manual visual review from #523 accepted idle/error/success at 320, 390, and 768. Duplicate labels are gone, A/B comparison remains clear, wrong-state is readable, and 320 success CTA remains fully visible.

Deterministic activity quality remains:

```text
KEEP       900
POLISH       0
REDESIGN     0
REPLACE      0
structural findings 0
```

## Distribution delta

```text
merged baseline after #112: choice_grid 362 / 900; Science choice_grid 75 / 100; 18 patterns
PR #114 accepted QA:          choice_grid 359 / 900; Science choice_grid 72 / 100; 19 patterns
compare_properties:            3 / 900
coverage:                    900 / 900, 0 unclassified
```

Science remains above the >60% advisory subject threshold after this wave. Concentration is a planning signal only.

## Remaining merge gates

- canonical docs on current PR head — completed in this docs-finalization pass;
- final docs-head CI — pending;
- clean review threads/comments — pending final check;
- exact-head squash merge — pending;
- verify `main` after merge;
- close stale QA wording through a docs-only closure if needed.

Do not start pattern #20 implementation until this PR is merged and the next Science exact-family objective/evidence audit is complete.
