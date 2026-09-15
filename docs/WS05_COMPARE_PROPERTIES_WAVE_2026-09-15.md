# WS-05 Science Compare Properties Wave — 2026-09-15

Status: **MERGED / PR #114**.

Implementation branch: `agent/ws05-gameplay-science-compare-properties-20260915`  
Implementation base: `a628a3a7d3dbb0be9faef2fd2e0c7efddd9c0649`  
Merged `main`: `4f3e2828aa3be804f6d896b10f8e3422c3180811`

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
- qualitative encodings cover length, temperature and relative fill without invented numeric measurements;
- canonical third distractor remains accessible;
- wrong choices are retryable and cannot complete;
- keyboard and touch/pointer share the same controls;
- runtime remains canonical `tap_choice`;
- assessed fidelity is `choice_compare_properties_interaction`.

Preserved: activity IDs, canonical choices/correctChoice, assessment, stars, progression, completion identity and Science Wave C catalog placement.

## Accepted QA and merge history

- CI #522 was full green before final visual cleanup.
- Manual screenshot review identified duplicate visible label text; implementation was polished rather than accepted unchanged.
- Accepted implementation head `c962e0c05a38eecf2890a76bf6417545100238a1` removed redundant visible secondary text while preserving canonical accessible semantics.
- CI #523 was full green across Ubuntu, Windows, production build, dependency audit, secret-history scan and Mobile Chromium.
- Browser QA passed legitimate Science Wave B readiness, keyboard wrong-state, false-completion guard, pointer completion, evidence persistence, >=44px targets, no overflow and CTA visibility at 320/390/768.
- Manual visual review accepted idle/error/success screenshots after the polish.
- PR #114 was squash-merged to `main` as `4f3e2828aa3be804f6d896b10f8e3422c3180811`.
- Post-merge canonical closure was completed by PR #115.

## Merged distribution

```text
900 / 900 classified
0 unclassified
19 active patterns
choice_grid           359 / 900 = 39.89%
compare_properties      3 / 900 = 0.33%
Science choice_grid     72 / 100
Logic choice_grid       77 / 100
```

Science remained above the >60% advisory subject threshold after this wave, so the next work continued with an exact-family Science audit rather than cosmetic reclassification.
