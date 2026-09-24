# Learning Semantic P0 — 14-Asset Production Approval / Integration

Date: **25 September 2026**

Status: **PRODUCTION APPROVAL + BINARIES INTEGRATED / RUNTIME ACTIVATION OFF / 3 HELD**

## Scope

This wave promotes only the 14 P0 illustrations whose source/license evidence was already clear and whose real canonical Drive/library SVGs passed the deterministic production-readiness preflight.

Still held and unchanged:

- `vehicle.car`
- `object.towel`
- `object.raincoat`

Those three remain `review-required`, with no production path/SHA and no runtime mapping.

## Production result

```text
visual decisions frozen:              17/17
production-approved semantic assets:  14/17
production WebP binaries:             14/17
held / not rendered:                   3/17
runtime semantic activation:             0
```

All 14 production binaries are the exact deterministic 512×512 alpha WebP bytes previously recorded by the real-source preflight. No artwork was redesigned or substituted in this wave.

## Exact binary bindings

| semantic key | production path | SHA-256 |
| --- | --- | --- |
| `action.jump` | `/artwork/learning-illustrations/action-jump-v1.webp` | `dcb7edbd9749f2a913829175572d84e42f48b0a30698d970728031c2244d093b` |
| `animal.bird` | `/artwork/learning-illustrations/animal-bird-v1.webp` | `de38296a4249d492be66f3253a343efb0997d08d83ae5c20b908b3e47b396914` |
| `animal.cat` | `/artwork/learning-illustrations/animal-cat-v1.webp` | `6bacca64a1bac258bb6d92a4c5b39a81cb383a45baba0cf35d3b7df26685c482` |
| `animal.fish` | `/artwork/learning-illustrations/animal-fish-v1.webp` | `54feddc6722908341f5f8f6bb9bdfae82dae85b663e6d018449d33bdbb1da5f5` |
| `body.head` | `/artwork/learning-illustrations/body-head-v1.webp` | `81640c6143fb52f71abdbeebe6b425fae79ca6ac1b00c0c84b6cc4801182c435` |
| `feature.beak` | `/artwork/learning-illustrations/feature-beak-v1.webp` | `0423a3b8b2bec07d84faa54e5de7ac224becae21c32512de19e3abc274d6f53f` |
| `feature.cactus-thick-stem` | `/artwork/learning-illustrations/feature-cactus-thick-stem-v1.webp` | `f73fbe012350f85b5ef22c8f0595617cff84c971a9f262da49cf80be2d5c3e45` |
| `feature.gills` | `/artwork/learning-illustrations/feature-gills-v1.webp` | `1d9c2da20507b89928b4c3a0c0783ed88b8108085f4beeecd86fd43bea7c1996` |
| `object.apple` | `/artwork/learning-illustrations/object-apple-v1.webp` | `68b867f733facd325ee3e0baa5814c682f9c107756edd99b56b468ca8337302f` |
| `object.ball` | `/artwork/learning-illustrations/object-ball-v1.webp` | `ef3b525cb818b98dc7ec1363574c50668b907abd464ea11ad8c761eda09c050a` |
| `object.cup` | `/artwork/learning-illustrations/object-cup-v1.webp` | `b9d751dd2c7ec8e25d496ff3f18d6d4bae1769a607b94e2f9cc1acbb829269c6` |
| `object.house` | `/artwork/learning-illustrations/object-house-v1.webp` | `23fe8ae122a8e4336b3d522d697d41f5a7e1a0343c48bc63a1cd9be01c6ebc84` |
| `object.toy-block` | `/artwork/learning-illustrations/object-toy-block-v1.webp` | `d9b3ddda42263f42c18b339be92a204b2627c9fddbb53188fc0a159f25430251` |
| `object.umbrella` | `/artwork/learning-illustrations/object-umbrella-v1.webp` | `f26193c5b1b8d473cc2ea93f46e4b8cdbf8ddf9a552310536edda430f714dd46` |

## Provenance and attribution

The production registry now records concrete source, rights holder, license basis, redistribution permission, semantic approval, production path, and SHA-256 for every promoted asset.

CC BY attribution is preserved for Darius Dan's bird/cat/fish art and the beak/gills derivatives, plus Yu-Chun Chou's house illustration. Public Domain / CC0 records remain source-bound even where attribution is not required.

## Runtime boundary

No learning component, activity config, `LearningVisualToken`, emoji fallback, gameplay presentation, progression, mastery, evidence, World, character, or narration runtime mapping is changed here.

Next safe wave: **runtime semantic mapping + visual regression QA for the approved 14 only**.
