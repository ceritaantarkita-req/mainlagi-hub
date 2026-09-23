# Learning Semantic P0 Candidate Generator — 23 September 2026

Status: **CANDIDATE PRODUCTION TOOL / REVIEW-ONLY / NO PRODUCTION APPROVAL / NO RUNTIME ACTIVATION**

Parent gate: `LEARNING_SEMANTIC_ILLUSTRATION_REGISTRY_CLOSURE_2026-09-23.md`.

## Purpose

Produce exact, deterministic Mainlagi-style candidate art for semantic slots that currently have misleading or weak emoji/glyph fallbacks, without placing unreviewed binaries in the public production subtree.

Exact candidate set:

- `body.head`;
- `action.jump`;
- `feature.gills`;
- `feature.beak`;
- `feature.cactus-thick-stem`;
- `object.towel`;
- `object.raincoat`;
- `object.toy-block`;
- `object.ball` (existing preview candidate is rejected).

The first eight are current P0 mismatches. Ball is included because its existing reuse candidate is already explicitly rejected.

## Command

Dry-run default:

```bash
npm run pilot:illustrations:generate
```

Generate local review candidates:

```bash
npm run pilot:illustrations:generate -- --generate
```

Default output:

`internal/learning-illustration-candidates/p0-v1/`

The generator refuses any output path under `public/`.

Use `--force` only to replace an existing local candidate directory.

## Output contract

Each generated item is:

- 512x512;
- WebP;
- transparent/alpha-bearing;
- isolated, low-noise, rounded Mainlagi 2D visual language;
- deterministic for the exact source revision;
- recorded in `candidate-manifest.json` with byte size + SHA-256;
- marked `production:false`;
- marked `runtimeActive:false`;
- marked `humanReviewRequired:true`.

The generator does not mutate the semantic provenance registry.

## Review contract

Generated candidates are not approved merely because generation/tests pass.

Human review must confirm, per exact binary:

1. semantic identity is immediately clear without answer text;
2. the picture does not depict a neighboring concept instead;
3. it remains understandable at small learning-card scale;
4. the shape is visually clean and centered;
5. it fits the Mainlagi friendly/rounded/low-noise illustration direction;
6. no critical detail disappears on mobile;
7. no candidate is promoted merely to replace an emoji numerically.

Only after exact-binary acceptance may a later wave:

- establish legal provenance/redistribution basis;
- copy the accepted binary deliberately into `public/artwork/learning-illustrations/`;
- bind final SHA-256;
- set semantic review approved;
- pass the existing blocking validator.

Runtime mapping remains a separate wave after asset approval.

## Regression

`npm run test:assets:learning-illustration-candidates` proves:

- dry-run writes nothing;
- exact nine semantic keys only;
- 512x512 WebP + alpha;
- size under the production technical ceiling;
- SHA output is deterministic across two generations;
- overwrite fails without `--force`;
- public-tree output is rejected.

## Boundaries

- Mainlagi World untouched.
- Character development paused.
- Fixed English audio deferred.
- No activity identity/prompt/choice/answer/evidence/mastery/progression/schema/stage change.
- No gameplay-pattern change / no Pattern #48.
- No production semantic binary.
- No runtime semantic activation.
