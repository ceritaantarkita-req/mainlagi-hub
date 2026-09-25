# Mainlagi Semantic Illustration SVG Production — Session 11 Closure — 25 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / RUNTIME ACTIVATION OFF**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
base main before Session 11: 7e6941614be712cb06d6b535888b10f1b9d51e24
implementation branch: agent/semantic-svg-production-session11-20260925
PR: #346
final PR head: 32e84d08ad43e172935dd6fb6a63f08567ac9549
final PR CI: #1684 / run 36156244598 — full success
merged main: d8992804beb82e553a3965066cf674fbfca9d7b5
merged-main CI: #1685 / run 36157147165 — full success
Production smoke (Cloudflare): success
```

Session 11 promotes the exact 14 already-reviewed semantic SVG sources into production while keeping semantic runtime activation off.

## Production result

Current machine-readable truth:

```text
registry version:             2
preferred production format: svg
runtime activation:           off

semantic P0 keys:             17
approved clear-scope keys:    14
held keys:                     3

approved WebP history:        14
approved SVG binaries:        14
SVG migration-ready:           0
held SVG slots:                3
```

Canonical SVG production path:

```text
/artwork/learning-illustrations/<semantic-slug>-v1.svg
```

The 14 existing WebP production binaries are retained as rollback/history and are not deleted in this wave.

## Exact approved SVG bindings

| semantic key | production path | SHA-256 |
| --- | --- | --- |
| `action.jump` | `/artwork/learning-illustrations/action-jump-v1.svg` | `5c8bb179f4b6a83bdde993f6598847f656a535a46d1009470d7d6500a5e5f522` |
| `animal.bird` | `/artwork/learning-illustrations/animal-bird-v1.svg` | `7f48db66d50fb6c892353120339dd950643e69385e8872134930cf5e6143a927` |
| `animal.cat` | `/artwork/learning-illustrations/animal-cat-v1.svg` | `d1d533398e9141438ec280f1c8b4c65f52320a91d5881b13d68e298cbce47c38` |
| `animal.fish` | `/artwork/learning-illustrations/animal-fish-v1.svg` | `34fd1640e25cf078df41f0cae2532493bc2176047c72856a5634ccb91f90ae8f` |
| `body.head` | `/artwork/learning-illustrations/body-head-v1.svg` | `f0f45658fc81df468075cccbc5d347ddc6a1fd745941d2b2b1c184ed7f63720b` |
| `feature.beak` | `/artwork/learning-illustrations/feature-beak-v1.svg` | `0b79a6f355976fb24ae4f8b7a999ad0e6c574d9d2287206ea154a2d9842e4e3e` |
| `feature.cactus-thick-stem` | `/artwork/learning-illustrations/feature-cactus-thick-stem-v1.svg` | `34a5c823e83fc0543948e91cf9fb77e3cdc21f49b84d4a3f78c694f1e78874ff` |
| `feature.gills` | `/artwork/learning-illustrations/feature-gills-v1.svg` | `49e33a279d0284333a7cecf4d80be22f985e4e718d750fb9a152089cfd1a0c31` |
| `object.apple` | `/artwork/learning-illustrations/object-apple-v1.svg` | `2d9b41b217aa4b735ab32dd73b85413473a1e9fe08c8059e3a467842d493093b` |
| `object.ball` | `/artwork/learning-illustrations/object-ball-v1.svg` | `63b14a3422e53da84ef31617c0d3762e136a280b9bee805dfb62ac0b3108c134` |
| `object.cup` | `/artwork/learning-illustrations/object-cup-v1.svg` | `1d36c427b383746c0cc49fc367bf9784a64690e3f2f6b0e196b38a3910084296` |
| `object.house` | `/artwork/learning-illustrations/object-house-v1.svg` | `8180f78817b0a611421220cb17effe9002db7a17d5ad36ba640297fd7a54a31f` |
| `object.toy-block` | `/artwork/learning-illustrations/object-toy-block-v1.svg` | `3719ccc9e0c558e930e6b273fa64cd03b0ad5999888c76779d17fb93b0650b87` |
| `object.umbrella` | `/artwork/learning-illustrations/object-umbrella-v1.svg` | `e2fe6b828c33c3349224dac67d8efba2ff68e38611afcebdb27079007b58059e` |

## Source and sanitization boundary

All 14 promoted files came from the exact canonical Drive source IDs already recorded in the semantic provenance registry.

Promotion used the shared SVG security contract:

```text
scripts/lib/svg-asset-security.mjs
```

The production files are the sanitized/normalized SVG outputs, not an unrelated re-download or substitute asset.

The validator enforces:

- valid UTF-8 SVG;
- valid `viewBox`;
- no scripts;
- no event handlers;
- no unsafe active SVG content;
- no unsafe external URL dependency;
- canonical production path;
- exact SHA-256;
- no stray production SVG;
- approved provenance and redistribution permission.

## Held-key fail-closed contract

These three keys remain unchanged:

```text
vehicle.car
object.towel
object.raincoat
```

For each held key:

```text
lifecycle: review-required
WebP production binding: null
SVG status: held
SVG path: null
SVG sha256: null
redistributionAllowed: false
semantic review: pending
```

Session 11 does not reinterpret or clear their rights status.

## Preserved WebP history

All 14 WebP production binaries from PR #324 remain present and exact-hash validated.

Current production directory therefore contains:

```text
14 approved semantic SVG binaries
14 approved WebP history/rollback binaries
1 attribution document
```

The WebPs are intentionally not deleted in Session 11.

## Attribution

`public/artwork/learning-illustrations/ATTRIBUTION.md` now covers both SVG and WebP production forms for the CC BY assets and derivatives.

The public repository license does not replace upstream artwork license/attribution obligations.

## Runtime boundary

Session 11 does not change:

- `LearningVisualToken` runtime behavior;
- child-facing semantic resolver;
- activity configs;
- existing emoji/glyph fallbacks;
- correctness;
- mastery;
- progression;
- evidence;
- rewards/certificates;
- Mainlagi World;
- character runtime;
- Motion Engine/game mechanics;
- narration/audio activation.

Mandatory state remains:

```text
production approval
!=
runtime activation
```

and:

```text
runtimeActivation = off
```

## Verification

PR head `32e84d08ad43e172935dd6fb6a63f08567ac9549` passed CI #1684 / run `36156244598`:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
```

Merged main `d8992804beb82e553a3965066cf674fbfca9d7b5` passed CI #1685 / run `36157147165` with the same full gate set plus:

```text
Production smoke (Cloudflare)  success
```

Therefore Session 11 is **merged, deployed, exact-hash locked and live verified**.

## Next authorized session

```text
Session 12 -> implement the central semantic SVG runtime resolver and controlled activation
```

Session 12 may:

- add a centralized semantic-key → approved production SVG resolver;
- make the resolver fail closed to the existing canonical fallback when a key is missing/held/unapproved;
- activate only the 14 currently approved SVG-backed semantic keys;
- preserve the three held keys on fallback behavior;
- add permanent resolver/runtime regression coverage;
- preserve all existing learning correctness/mastery/progression/evidence semantics.

Session 12 must not:

- delete the WebP rollback/history assets;
- approve car/towel/raincoat;
- hardcode production file paths per activity;
- change learning correctness/mastery/progression/evidence;
- reopen World, character, Motion Engine, or narration work;
- broaden to new semantic art beyond the existing approved 14.

Responsive/browser visual QA remains a later dedicated session after central resolver activation.
