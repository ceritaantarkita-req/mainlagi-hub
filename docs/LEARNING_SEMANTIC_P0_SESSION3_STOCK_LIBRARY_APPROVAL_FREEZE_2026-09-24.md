# Learning Semantic P0 — Session 3 Stock-Library Approval Freeze

Date: **24 September 2026**

Status: **SESSION 3 FREEZE COMPLETE / PRODUCTION RELEASE HELD ON 3 ITEM-PAGE LICENSE RECHECKS**

This record closes the stock-library visual/decision freeze after the exact P0 v2 human review and the later project-owner comparison decisions. It does **not** approve production binaries, copy semantic assets into `public/`, mutate the production semantic registry lifecycle, or activate runtime semantic mapping.

## Session boundary

This session is an approval/freeze gate only.

Allowed in this session:

- freeze the project-owner visual decisions;
- synchronize the canonical Google Drive stock library and provenance index;
- preserve exact review/provenance evidence;
- identify production-release blockers;
- prepare a safe repository checkpoint.

Explicitly out of scope:

- `public/artwork/learning-illustrations/` production copies;
- production registry approval;
- runtime semantic mapping;
- Mainlagi World changes;
- character development;
- fixed English-audio activation.

## Human-review evidence carried forward

The exact P0 v2 review record in Drive is bound to the candidate manifest and records **9/9 accepted** with `viewedExactFiles:true`, `noProductionApprovalRequested:true`, and `noRuntimeActivationRequested:true`.

The later project-owner visual comparison is authoritative for the four replacement decisions below:

| asset | final stock-library visual decision | source identity | Session 3 result |
| --- | --- | --- | --- |
| `vehicle.car` | KEEP CURRENT | SVG Repo `499718` | visually frozen; production license item-page recheck still required |
| `object.raincoat` | KEEP CURRENT | SVG Repo `212019` | visually frozen; production license item-page recheck still required |
| `object.towel` | KEEP CURRENT | SVG Repo `288034` | visually frozen; production license item-page recheck still required |
| `body.head` | ADOPT REPLACEMENT | SVG Repo `271316`, hair recolored to `#59474E` | visually frozen; exact source page verified CC0 |

The earlier clean alternatives `490914` / `297932` / `118911` remain rejected for car/raincoat/towel. They are retained only as historical replacement candidates.

## Canonical head binding

Exact source page:

- <https://www.svgrepo.com/svg/271316/man-hair-head>
- license shown by the item page: **CC0**

Exact recolored review SVG:

- filename: `body-head__svgrepo-271316-cc0-darkhair.svg`
- review Drive file: `10zxkjupXpowjJVU0XxgR7-dd_0LLvY-Z`
- SHA-256: `968c46103f6cb62ccc3ff745296d90d924f808cad7c75a47d481b86203a9cca6`
- verified hair fill: `#59474E`

Canonical stock-library copy:

- folder: `04_BODY_FAMILY_ACTIONS`
- Drive file: `1jJjdsOnWRKTo3wFZHBlfJ6C3XWNOxkGb`
- filename: `body-head__svgrepo-271316-cc0-darkhair.svg`

The previous user-selected head remains historical evidence and is no longer the canonical stock-library head.

## Canonical index synchronization

`MAINLAGI_ILLUSTRATION_ASSET_INDEX` was synchronized in these tabs:

- `NEEDED_STOCK`;
- `FINAL_LIBRARY`;
- `ATTRIBUTION_PROVENANCE`.

The updated index now records `body.head` as `FINAL_LIBRARY_STOCK_ONLY_HUMAN_APPROVED_CC0` and removes it from the provenance-held override group.

The replacement-candidate provenance row now records the actual decisions: head `271316` adopted; car `490914`, raincoat `297932`, and towel `118911` not adopted.

## Final P0 stock-library audit

All **17/17 P0 targets are library-ready with a frozen visual decision**.

| asset | stock source/license state | Session 3 gate |
| --- | --- | --- |
| `food.apple` | Public Domain / PD | clear |
| `animal.cat` | CC BY | clear; attribution required |
| `animal.fish` | CC BY | clear; attribution required |
| `object.umbrella` | CC0 | clear |
| `vehicle.car` | SVG Repo default license, exact ID `499718` | **production recheck** |
| `object.cup` | CC0 | clear |
| `object.house` | CC BY | clear; attribution required |
| `animal.bird` | CC BY | clear; attribution required |
| `object.ball` | CC0 | clear |
| `body.head` | CC0, exact ID `271316` | clear |
| `action.jump` | Public Domain / CC0-equivalent | clear |
| `feature.gills` | CC BY derivative of verified fish base | clear; derivative attribution preserved |
| `feature.beak` | CC BY derivative of verified bird base | clear; derivative attribution preserved |
| `feature.cactus-thick-stem` | CC0 | clear |
| `object.towel` | SVG Repo default license, exact ID `288034` | **production recheck** |
| `object.raincoat` | SVG Repo default license, exact ID `212019` | **production recheck** |
| `object.toy-block` | CC0 | clear |

Therefore:

```text
P0 stock-library visual decisions:       17/17 frozen
P0 stock-library rows:                   17/17 library-ready
P0 source/license evidence clear:        14/17
P0 exact item-page production rechecks:   3/17
production semantic registry approvals:   0
production semantic binaries:             0
runtime semantic activation:              0
```

## Why the three-item hold remains

SVG Repo's current licensing page says its default SVG Repo License permits remixing and use as part of a commercial project, with attribution not required, **unless an individual icon page indicates differently**.

The exact item identities for car/towel/raincoat are resolved and their exact SVG binaries are bound in Drive. During this audit, however, their individual landing pages could not be independently retrieved. The SVG files themselves contain an SVG Repo generator/upload comment but no item-specific license statement.

The gate therefore remains fail-closed for final production release of those three assets. This is a legal/provenance evidence hold, not a visual-design hold.

## Exact item-page license recheck — 24 September 2026

A fresh recheck was performed after the Session 3 merge for the three KEEP-CURRENT assets:

- `vehicle.car` -> SVG Repo `499718`;
- `object.towel` -> SVG Repo `288034`;
- `object.raincoat` -> SVG Repo `212019`.

Verified current policy evidence:

- SVG Repo's licensing page still states that the default SVG Repo License permits sharing/remixing and use as part of a commercial project;
- no attribution is required under that default license;
- the same page explicitly says the default applies **unless an individual icon page indicates differently**.

Authoritative exact-item retrieval result:

- `/svg/499718/car` and `/show/499718/car.svg` were not retrievable by the audit;
- `/svg/288034/towel` and `/show/288034/towel.svg` were not retrievable by the audit;
- `/svg/212019/raincoat` and `/show/212019/raincoat.svg` were not retrievable by the audit.

Secondary provenance search found exact SVG fingerprints in public repositories for these visuals. Those copies are useful for identity/provenance corroboration, but they are **not accepted as authority for an SVG Repo item-specific license exception** and therefore do not clear the production gate.

Canonical Drive rows in `NEEDED_STOCK` and `ATTRIBUTION_PROVENANCE` were updated to record this recheck.

Result remains fail-closed:

```text
P0 source/license evidence clear:        14/17
P0 exact item-page production holds:      3/17
production semantic registry approvals:   0
production semantic binaries:             0
runtime semantic activation:              0
```

No visual decision changed. No production binary, production-registry approval, or runtime semantic mapping was added.

## Merge/live verification

Session 3 repository closure is **MERGED / LIVE VERIFIED** through PR **#316**.

```text
PR #316 final head:       d393e18501b0ac066e52d43c397bf01c0ae01b56
PR CI #1594 / run:        35996626132 — full success
merged main:              763ed2db21fda86bf96499b49df4b09dc13e9340
merged-main CI #1595:     35997454405 — full success
Cloudflare exact-SHA smoke: PASS
```

The merged diff contains no production illustration binaries, no semantic production-registry lifecycle approval, and no runtime semantic mapping activation.

## Safe checkpoint result

Session 3 has completed the intended decision freeze and canonical stock-library synchronization.

The next production step must begin only from these frozen decisions. Before car/towel/raincoat can be copied or approved as production semantic binaries, recheck the individual item pages for IDs `499718`, `288034`, and `212019` and confirm there is no item-specific license exception.

After that evidence is closed, the separate production-integration wave may:

1. copy only the exact approved stock binaries into the dedicated production subtree;
2. bind exact SHA-256 values and provenance to the semantic registry;
3. pass the production asset validators;
4. keep runtime mapping off until a later activation wave.

Do **not** collapse production approval and runtime activation into the same step.
