# Learning Semantic P0 — Production-Readiness Preflight

Date: **24 September 2026**

Status: **TOOLING MERGED / LIVE VERIFIED + REAL 14-SOURCE PREFLIGHT COMPLETE / NON-PRODUCTION**

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

## Tooling merge/live verification

The preflight tooling is **MERGED / LIVE VERIFIED** through PR **#321**.

```text
PR #321 final head:        0882f7d6485129a500c48c3140d54a66bd83e495
PR CI #1604 / run:         36020304671 — full success
merged main:               1e623a3416741c8308aa5d4a6c9bb9534bc04596
merged-main CI #1605:      36021416028 — full success
Cloudflare exact-SHA smoke: PASS
```

The new regression executed inside the blocking asset-validation chain on both the PR and merged-main verification path.

## Real canonical-source preflight execution

The real 14 canonical Drive/library SVGs were assembled and run through the same technical conversion contract after PR #321 merged.

Canonical normalized Drive staging folder:

```text
P0_PRODUCTION_READINESS_PREFLIGHT_14_2026-09-24
Drive folder ID: 1wLcXO5fziyXcdOBH8YC04oi4RJF9UYNZ
```

The folder was audited after staging cleanup and contains **exactly 14 normalized SVG files** — no car, towel or raincoat source is present.

Canonical spreadsheet evidence:

```text
MAINLAGI_ILLUSTRATION_ASSET_INDEX
tab: P0_PRODUCTION_PREFLIGHT
rows: 14 PREFLIGHT_PASS_NON_PRODUCTION + 3 HELD_NOT_RENDERED
```

Every clear asset produced a deterministic **512×512 alpha WebP** within the existing production technical limit. The largest output was `action.jump` at **18,956 bytes**, far below the current 300,000-byte ceiling.

| semantic key | source SHA-256 | preflight WebP SHA-256 | bytes |
| --- | --- | --- | ---: |
| `action.jump` | `5c8bb179f4b6a83bdde993f6598847f656a535a46d1009470d7d6500a5e5f522` | `dcb7edbd9749f2a913829175572d84e42f48b0a30698d970728031c2244d093b` | 18,956 |
| `animal.bird` | `7f48db66d50fb6c892353120339dd950643e69385e8872134930cf5e6143a927` | `de38296a4249d492be66f3253a343efb0997d08d83ae5c20b908b3e47b396914` | 9,594 |
| `animal.cat` | `d1d533398e9141438ec280f1c8b4c65f52320a91d5881b13d68e298cbce47c38` | `6bacca64a1bac258bb6d92a4c5b39a81cb383a45baba0cf35d3b7df26685c482` | 10,120 |
| `animal.fish` | `34fd1640e25cf078df41f0cae2532493bc2176047c72856a5634ccb91f90ae8f` | `54feddc6722908341f5f8f6bb9bdfae82dae85b663e6d018449d33bdbb1da5f5` | 9,700 |
| `body.head` | `968c46103f6cb62ccc3ff745296d90d924f808cad7c75a47d481b86203a9cca6` | `81640c6143fb52f71abdbeebe6b425fae79ca6ac1b00c0c84b6cc4801182c435` | 7,102 |
| `feature.beak` | `0b79a6f355976fb24ae4f8b7a999ad0e6c574d9d2287206ea154a2d9842e4e3e` | `0423a3b8b2bec07d84faa54e5de7ac224becae21c32512de19e3abc274d6f53f` | 11,674 |
| `feature.cactus-thick-stem` | `808f81f9f83319347487bb6b8cbed70642d8c97a06954d6c99c295ed92331180` | `f73fbe012350f85b5ef22c8f0595617cff84c971a9f262da49cf80be2d5c3e45` | 9,206 |
| `feature.gills` | `49e33a279d0284333a7cecf4d80be22f985e4e718d750fb9a152089cfd1a0c31` | `1d9c2da20507b89928b4c3a0c0783ed88b8108085f4beeecd86fd43bea7c1996` | 13,994 |
| `object.apple` | `2d9b41b217aa4b735ab32dd73b85413473a1e9fe08c8059e3a467842d493093b` | `68b867f733facd325ee3e0baa5814c682f9c107756edd99b56b468ca8337302f` | 8,432 |
| `object.ball` | `f73876df82881cf2e20a66d6eb95c9432113ea2391443429580638666d704c52` | `ef3b525cb818b98dc7ec1363574c50668b907abd464ea11ad8c761eda09c050a` | 15,618 |
| `object.cup` | `27f24b239e850f4a187ab383db81746a32a58727ef9329e783b660d266afa460` | `b9d751dd2c7ec8e25d496ff3f18d6d4bae1769a607b94e2f9cc1acbb829269c6` | 9,752 |
| `object.house` | `8180f78817b0a611421220cb17effe9002db7a17d5ad36ba640297fd7a54a31f` | `23fe8ae122a8e4336b3d522d697d41f5a7e1a0343c48bc63a1cd9be01c6ebc84` | 4,214 |
| `object.toy-block` | `3719ccc9e0c558e930e6b273fa64cd03b0ad5999888c76779d17fb93b0650b87` | `d9b3ddda42263f42c18b339be92a204b2627c9fddbb53188fc0a159f25430251` | 5,760 |
| `object.umbrella` | `e2fe6b828c33c3349224dac67d8efba2ff68e38611afcebdb27079007b58059e` | `f26193c5b1b8d473cc2ea93f46e4b8cdbf8ddf9a552310536edda430f714dd46` | 5,086 |

The three held source identities were also SHA-bound as evidence but were **not rendered**:

```text
object.raincoat  b50c1f9f89d2f6a0d2ae68aa2bea20fc966fb0d7a3e5ec84195940551b6d2d2b
object.towel     7170ee9ed53be74b45cfe42ae4131e8d3b2d46674f836c0cb85926cd351a1140
vehicle.car      1eeaed66cde042efe955b0b3ef43ddc42b07393dea62c976026cdb1922df0737
```

The spreadsheet records `legal_production_approval=NO`, `production_registry_approval=NO`, and `runtime_active=NO` for all 17 rows.

## Result

```text
P0 visual decisions frozen:                 17/17
canonical source/license clear:             14/17
real-source technical preflight PASS:       14/14 eligible
redistribution-held / not rendered:          3/17
production semantic registry approvals:      0
production semantic binaries:                0
runtime semantic activation:                 0
```

No production asset was copied into `public/`. No production provenance record was approved or mutated. No runtime semantic mapping was activated.

## Next safe step

For the 14 technically preflighted assets, the next boundary is a **separate production-approval packet/gate** that can bind legal provenance, attribution requirements, prior visual/human-review evidence, exact source SHA and exact preflight WebP SHA without yet copying binaries into `public/`.

The three redistribution-held KEEP-CURRENT assets remain outside that packet until their owner decision gate is resolved.

Production integration and runtime activation remain later, separate waves.
