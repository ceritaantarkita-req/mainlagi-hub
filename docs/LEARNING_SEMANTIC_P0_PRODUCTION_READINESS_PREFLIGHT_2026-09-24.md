# Learning Semantic P0 — Production-Readiness Preflight

Date: **24 September 2026**

Status: **IMPLEMENTATION PRECHECK ONLY / NON-PRODUCTION**

This checkpoint prepares the legally clear semantic-P0 subset for a later production approval wave without crossing the current three-asset redistribution hold.

## Why this exists

Session 3 froze all 17 P0 visual decisions, but only **14/17** currently have source/license evidence compatible with the public-repository production gate.

The held KEEP-CURRENT visuals remain:

- `vehicle.car`;
- `object.towel`;
- `object.raincoat`.

Those three are intentionally excluded from this preflight.

The purpose of this layer is to eliminate avoidable technical risk for the other 14 assets before any production approval is requested.

## Tooling

New generator:

```text
scripts/preflight-learning-semantic-p0-production-readiness.mjs
```

Regression coverage:

```text
scripts/run-learning-semantic-p0-production-readiness-preflight-tests.mjs
```

Package commands:

```bash
npm run preflight:illustrations:p0:production-readiness
npm run test:assets:learning-illustration-production-preflight
```

The regression test is included in the blocking `npm run validate:assets` chain.

## Exact clear scope

The preflight contains exactly 14 semantic keys:

```text
action.jump
animal.bird
animal.cat
animal.fish
body.head
feature.beak
feature.cactus-thick-stem
feature.gills
object.apple
object.ball
object.cup
object.house
object.toy-block
object.umbrella
```

Held and excluded:

```text
object.raincoat
object.towel
vehicle.car
```

The script validates that the production registry still contains exactly the canonical 17-key P0 scope before it runs.

## Input contract

The preflight source directory is internal/review-only and must contain exactly these normalized SVG filenames:

```text
action-jump.svg
animal-bird.svg
animal-cat.svg
animal-fish.svg
body-head.svg
feature-beak.svg
feature-cactus-thick-stem.svg
feature-gills.svg
object-apple.svg
object-ball.svg
object-cup.svg
object-house.svg
object-toy-block.svg
object-umbrella.svg
```

The normalization layer deliberately decouples Drive/library filenames from the later production filename contract.

Default paths:

```text
source:
internal/learning-illustration-production-readiness/p0-clear-source

output:
internal/learning-illustration-production-readiness/p0-clear-preflight
```

Both source and output paths are rejected if they resolve under `public/`.

## Output contract

For each of the 14 clear-scope assets, the generator creates an internal 512×512 lossless alpha WebP using the exact basename expected by the production registry, for example:

```text
object-apple-v1.webp
animal-cat-v1.webp
feature-beak-v1.webp
```

It also records:

- source byte length;
- source SHA-256;
- expected production path;
- preflight filename;
- width / height / alpha;
- rendered byte length;
- rendered SHA-256;
- explicit non-production lifecycle flags.

The manifest is:

```text
preflight-manifest.json
```

with:

```text
scope: learning-semantic-p0-production-readiness-preflight
lifecycle: preflight-only
clearCount: 14
heldCount: 3
legalApproval: false
productionApproval: false
production: false
runtimeActive: false
```

## Fail-closed rules

The preflight refuses to run if:

- the production registry is no longer the exact canonical 17-key scope;
- any registry record has already moved away from `review-required`;
- any production path or production SHA is already set;
- registry redistribution is no longer fail-closed;
- semantic production review is no longer pending;
- the source directory does not contain exactly the 14 clear-scope SVGs;
- source or output is under `public/`;
- a generated WebP violates the production technical bounds;
- the production provenance registry changes during generation.

The held car/towel/raincoat keys never enter the generated manifest.

## Boundary

This checkpoint does **not**:

- approve legal provenance in the production registry;
- approve semantic child-readability in the production registry;
- copy any binary to `public/artwork/learning-illustrations/`;
- set a production path or SHA;
- activate runtime semantic mapping;
- alter Mainlagi World;
- resume character development;
- resume fixed English audio.

It only makes the 14 currently clear assets technically ready for a later, explicit production-approval decision.

## Next safe step

After this tooling is merged/live verified, the real 14 canonical Drive/library sources may be assembled into the normalized internal source directory and run through this preflight.

That real-source preflight is still **not production approval**. The three redistribution-held KEEP-CURRENT assets remain excluded until their owner decision gate is resolved.
