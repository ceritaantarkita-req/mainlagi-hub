# Learning Semantic P0 Human Review Gate — 23 September 2026

Status: **IMPLEMENTATION GATE / HUMAN DECISION NOT YET RECORDED / NO PRODUCTION APPROVAL / NO RUNTIME ACTIVATION**

Parent candidate baseline:
- PR #300 -> main `89adf887e270c2451ae81af8cd6a9bae0b798fbd`;
- PR #301 -> main `9f6270c79bb92f7cb6ce1d29a2165df54801debf`;
- main CI #1548 / run `35807137419` — full success + exact Cloudflare production smoke.

## Purpose

Bind the required human child-readability review to the **exact nine generated WebP binaries** and their exact manifest/SHA values.

This gate exists so a reviewer cannot accidentally approve:
- a different render;
- a stale candidate directory;
- a modified candidate after review;
- only a semantic label or filename instead of the actual image;
- the whole nine-item set when one or more items should be rejected.

This is review evidence only. It has no path to approve production assets, mutate the semantic provenance registry, copy binaries into `public/`, or activate runtime semantic mapping.

## Exact scope

The gate accepts exactly:

1. `body.head`;
2. `action.jump`;
3. `feature.gills`;
4. `feature.beak`;
5. `feature.cactus-thick-stem`;
6. `object.towel`;
7. `object.raincoat`;
8. `object.toy-block`;
9. `object.ball`.

No tenth item and no bulk 17-slot review are allowed in this wave.

## Commands

Generate exact local review candidates first:

```bash
npm run pilot:illustrations:generate -- --generate
```

Validate exact candidate integrity:

```bash
npm run pilot:illustrations:review
```

Create a non-overwriting human review template:

```bash
npm run pilot:illustrations:review -- --write-template
```

After the human reviewer has viewed the exact files and filled the template:

```bash
npm run pilot:illustrations:review -- --validate-review
```

Default local directory:

```text
internal/learning-illustration-candidates/p0-v1/
```

Review evidence file:

```text
internal/learning-illustration-candidates/p0-v1/candidate-human-review.json
```

The directory remains gitignored/review-local.

## Candidate integrity contract

Before a review template can be created or validated, the script verifies:

- manifest version/scope/lifecycle;
- exactly nine semantic keys;
- exact canonical candidate filenames;
- `production:false`;
- `runtimeActive:false`;
- `humanReviewRequired:true`;
- 512x512 dimensions;
- WebP format;
- alpha/transparency;
- byte count;
- SHA-256;
- exact file existence;
- no input path under `public/`.

Any candidate byte change after template creation invalidates the review evidence.

## Per-item human rubric

Each exact candidate receives its own decision:

- `pending`;
- `accepted`;
- `rejected`.

Each item must also record all six rubric fields:

1. `semanticIdentity` — the intended object/action/feature is immediately identifiable without answer text;
2. `neighboringConceptSafety` — the picture does not primarily depict a neighboring/wrong concept;
3. `smallScaleReadability` — the concept survives learning-card scale;
4. `visualCleanliness` — silhouette, centering and critical detail remain clean;
5. `mainlagiStyleFit` — friendly rounded low-noise Mainlagi/Garden direction remains coherent;
6. `mobileDetailRetention` — critical semantic detail survives mobile-size rendering.

Accepted requires **all six checks pass** for that item.

Rejected requires:
- no pending rubric checks; and
- at least one explicit failed rubric field.

The gate deliberately permits a mixed result such as **8 accepted / 1 rejected**.

## Human attestation

A completed review requires:

- reviewer name;
- valid review timestamp;
- `viewedExactFiles:true`;
- explicit acknowledgment that production approval is separate;
- explicit acknowledgment that runtime activation is separate.

The tooling cannot truthfully set these fields on behalf of a human reviewer.

## What human acceptance means

Human acceptance means only:

> this exact local candidate binary passed the child-readability/semantic visual review rubric.

It does **not** mean:
- provenance is legally cleared;
- public redistribution is allowed;
- the production registry is approved;
- the candidate may be copied into `public/artwork/learning-illustrations/`;
- the runtime may resolve to the image.

Those remain later gates.

## Regression

`npm run test:assets:learning-illustration-review` proves:

- the exact generator can produce the nine review candidates;
- integrity validation binds to the exact files;
- review template creation is non-overwriting;
- incomplete accepted reviews fail closed;
- mixed per-item accepted/rejected review is supported;
- candidate tampering fails by SHA;
- the production semantic registry remains byte-for-byte unchanged.

The regression is wired into `npm run validate:assets`.

## Hard boundaries

This wave does not modify:
- Mainlagi World;
- character work;
- English narration/audio;
- canonical activity IDs/prompts/choices/answers;
- evidence/mastery/progression/schema/stage ownership;
- gameplay pattern classification;
- Pattern #48;
- production semantic binaries;
- runtime semantic mapping.
