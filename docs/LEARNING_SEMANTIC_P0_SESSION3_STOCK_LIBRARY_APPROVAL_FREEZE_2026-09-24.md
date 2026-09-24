# Learning Semantic P0 — Session 3 Stock-Library Approval Freeze

Date: **24 September 2026**

Status: **SESSION 3 FREEZE COMPLETE / 3 KEEP-CURRENT ASSETS FAIL-CLOSED FOR PUBLIC-REPOSITORY REDISTRIBUTION**

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
| `vehicle.car` | KEEP CURRENT | SVG Repo `499718` | visually frozen; public-repository redistribution not cleared |
| `object.raincoat` | KEEP CURRENT | SVG Repo `212019` | visually frozen; public-repository redistribution not cleared |
| `object.towel` | KEEP CURRENT | SVG Repo `288034` | visually frozen; public-repository redistribution not cleared |
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

## Upstream provenance hunt — 24 September 2026

The three production-held KEEP-CURRENT assets were investigated beyond the unavailable SVG Repo item pages. This was a provenance-identification pass only; it did not authorize a production binary or runtime mapping.

### `vehicle.car` — upstream strongly identified, public-repository redistribution blocked

The exact current visual remains SVG Repo item `499718`.

A strong visual/structural upstream match was found to the official **Icons8 Color — Car** icon, icon **#15126**, slug `car--v1`. The official Icons8 icon page marks that icon as created in-house by Icons8.

This materially improves upstream identity confidence, but it does **not** clear the existing SVG Repo copy for production. A later redistribution review of the current official Icons8 license found that commercial use and standalone-file redistribution are separate questions: the license prohibits distributing licensed material as stand-alone files without express written consent. Mainlagi is a public AGPL repository, so committing a WebP derivative under `public/artwork/learning-illustrations/` would make that binary directly cloneable, forkable, archivable, and extractable. An ordinary Icons8 free/paid acquisition is therefore **not** sufficient for this repository gate. The KEEP-CURRENT car requires either authoritative open redistribution rights for the exact artwork or express written standalone-distribution permission.

Canonical status:

```text
vehicle.car:
visual decision:       KEEP CURRENT
SVG Repo identity:     499718
upstream identity:     strong Icons8 Color Car #15126 / car--v1 match
production status:     HELD
next legal action:     open redistribution evidence or express written standalone-distribution permission
```

### `object.towel` — upstream unresolved

The exact current visual remains SVG Repo item `288034`.

A Freepik/Flaticon-style towel-on-hanger asset, icon `3816382`, was found as a close structural/visual lead. It resembles the hook, hanger, folded-towel composition, and layer organization of the current asset, but the audit could not bind its vector geometry authoritatively to the exact current SVG.

It is therefore **not** accepted as source or license authority. In addition, current Flaticon-style commercial-library terms do not provide the public standalone-file redistribution rights required by this repository gate, so identifying a visually close commercial-library asset would not by itself unblock production.

Canonical status:

```text
object.towel:
visual decision:       KEEP CURRENT
SVG Repo identity:     288034
upstream identity:     unresolved
production status:     HELD
```

### `object.raincoat` — tested upstream candidate rejected

The exact current visual remains SVG Repo item `212019`.

Flaticon/Freepik raincoat icon `263922` was tested as a possible upstream source. It is visually close, but its current artwork contains additional dark outline/highlight layers not present in the exact current SVG. The candidate is therefore rejected as an exact-source binding. A related SVG Repo-distributed raincoat geometry family was also found in a public repository, but it carried no authoritative rights metadata. Current Flaticon-style commercial-library terms likewise do not provide the public standalone-file redistribution rights required by this repository gate.

Canonical status:

```text
object.raincoat:
visual decision:       KEEP CURRENT
SVG Repo identity:     212019
upstream identity:     unresolved
production status:     HELD
```

### Result

The upstream hunt improves provenance quality but does not change the production gate:

```text
P0 stock-library visual decisions:       17/17 frozen
P0 stock-library rows:                   17/17 library-ready
P0 source/license evidence clear:        14/17
P0 production-held assets:                3/17
  car: upstream identified / public-repo redistribution blocked
  towel: upstream unresolved / public-repo redistribution blocked
  raincoat: upstream unresolved / public-repo redistribution blocked
production semantic registry approvals:   0
production semantic binaries:             0
runtime semantic activation:              0
```

Canonical Drive index status was synchronized accordingly. No visual selection changed, no production binary was copied, and no runtime mapping was activated.

## Public-repository redistribution closure — 24 September 2026

The production gate was re-evaluated against Mainlagi's actual repository contract rather than only commercial-use language.

Mainlagi's learning-illustration validator requires any approved binary to have:

- `owned` or `licensed` provenance;
- `redistributionAllowed=true`;
- a named rights holder and concrete license basis;
- an approved child-readable semantic review;
- an exact SHA-256;
- a production WebP under `public/artwork/learning-illustrations/`.

Because the repository is public AGPL, a production binary is distributed as a directly accessible standalone file to clones, forks, mirrors, and archives. Permission to **use an icon commercially in an app** is therefore not equivalent to permission to **redistribute the icon binary in this public repository**.

The current evidence closes the remaining source-hunt paths as follows:

1. **car `499718`**
   - strong upstream identity: Icons8 Color Car #15126 / `car--v1`;
   - ordinary Icons8 licensing does not clear standalone-file redistribution for this public repository;
   - remains fail-closed unless express written standalone-distribution permission or authoritative open redistribution rights are obtained.

2. **towel `288034`**
   - exact SVG fingerprint is corroborated by secondary public copies;
   - authoritative open-license upstream remains unresolved;
   - close commercial-library leads are not accepted as exact source and would not by themselves satisfy the standalone-redistribution gate;
   - remains fail-closed.

3. **raincoat `212019`**
   - exact SVG fingerprint is corroborated by a secondary public copy;
   - a related geometry-family SVG exists, but it carries no authoritative rights metadata and is not the exact binary;
   - close commercial-library candidates are not accepted as exact source and would not by themselves satisfy the standalone-redistribution gate;
   - remains fail-closed.

This changes the nature of the blocker from an open-ended item-page search to a finite production decision gate.

Safe ways to unblock any of the three are limited to:

- authoritative license evidence that the **exact current artwork** may be redistributed as a standalone binary in a public repository;
- express written permission from the rights holder allowing that redistribution; or
- a later explicit project-owner decision to adopt a different owned/open-license replacement.

The third path is **not authorized by Session 3**. The previously rejected alternatives remain historical candidates and must not be silently substituted.

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

The next production step must begin only from these frozen decisions. Car/towel/raincoat must **not** be copied or approved as production semantic binaries under the currently available evidence. Repeating the same SVG Repo item-page search is no longer considered a sufficient next action.

A separate production-integration wave may begin for these held assets only after exact standalone public-repository redistribution rights are established, or after a later explicit project-owner visual replacement decision produces a separately cleared candidate. After that gate is closed, production integration may:

1. copy only the exact approved stock binaries into the dedicated production subtree;
2. bind exact SHA-256 values and provenance to the semantic registry;
3. pass the production asset validators;
4. keep runtime mapping off until a later activation wave.

Do **not** collapse production approval and runtime activation into the same step.
