# WS-05 Science Compare Properties Wave — 2026-09-15

Status: implementation in QA; canonical docs will be finalized only after CI + manual visual acceptance.

Exact reviewed scope:

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

The excluded recording activity keeps the canonical choice presentation because its objective is observation-recording practice, not direct property comparison. The matching activity keeps canonical `matching` / `visible_matching`.

Interaction contract:
- child compares two visible objects directly;
- explicit qualitative visual encodings cover length, temperature, and relative fill;
- no invented numeric measurements are introduced;
- the canonical third distractor remains a separate accessible choice;
- wrong choices are retryable and cannot complete;
- keyboard and touch/pointer share the same controls;
- runtime remains canonical `tap_choice`;
- assessed evidence target is `choice_compare_properties_interaction`.

Preserved: activity IDs, canonical choices/correctChoice, assessment, stars, progression, completion identity, and Science Wave C catalog placement.
