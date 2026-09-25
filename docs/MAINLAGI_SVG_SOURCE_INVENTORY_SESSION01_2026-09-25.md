# Mainlagi SVG Source Inventory — Session 01 Closure

Date: **25 September 2026**  
Status: **SESSION 01 COMPLETE / INVENTORY FROZEN / NO RUNTIME OR PUBLIC ASSET ACTIVATION**  
Base main: `28c95a0966ba726f960e4fa204d74b7e1793045b`

Canonical machine-readable inventory:

```text
docs/data/MAINLAGI_SVG_SOURCE_INVENTORY_SESSION01_2026-09-25.json
```

## Result

```text
character source folder:       47 direct files
SVG files in character folder: 45
canonical character slots:     35/35
characters:                     5/5
states per character:           7/7
duplicate character slots:      0
ambiguous character slots:      0

semantic clear SVGs:           14/14
semantic held keys:             3/3
held files in clear staging:    0

runtime change:                 none
public production files added:  none
registry lifecycle mutation:    none
```

## Character source freeze

Canonical state vocabulary:

```text
hero
welcome
pointing
thinking
correct
try_again
celebrate
```

All five characters have exactly one source for every locked state:

| Character | hero | welcome | pointing | thinking | correct | try_again | celebrate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gavi | yes | yes | yes | yes | yes | yes | yes |
| Paca | yes | yes | yes | yes | yes | yes | yes |
| Naya | yes | yes | yes | yes | yes | yes | yes |
| Zia | yes | yes | yes | yes | yes | yes | yes |
| Gian | yes | yes | yes | yes | yes | yes | yes |

All 35 scoped SVGs were materialized for this audit and have exact SHA-256 values in the JSON inventory.

Visual inventory review found no character/state mismatch. Identity and intended state remain readable across the 35 source files. This is an **inventory review**, not production responsive QA.

### Excluded character-folder material

Not part of the 35 runtime-state slots:

- 5 `*-character-design-set.svg` identity/master references;
- 5 `*-melambaikan-tangan.svg` sources because `waving` is not in the locked seven-state vocabulary;
- `character-set-collection-mainlagi.ai` master/source collection;
- one PNG review/reference file.

These are not ambiguous duplicates of a locked state.

### Character provenance boundary

The Drive files are project-owner-supplied Mainlagi sources. Exact public-repository ownership/license/redistribution basis is **not yet machine-approved** for the 35 character SVGs.

Therefore Session 01 records:

```text
source identity: frozen
source SHA: frozen
state mapping: frozen
visual inventory review: pass
public redistribution approval: pending
runtime approval: not requested
```

Session 03/04 must not mark a character SVG production-approved until the exact provenance/redistribution basis is recorded.

## Semantic P0 clear-source freeze

The normalized Drive staging folder remains:

```text
P0_PRODUCTION_READINESS_PREFLIGHT_14_2026-09-24
Drive folder ID: 1wLcXO5fziyXcdOBH8YC04oi4RJF9UYNZ
```

Exact clear scope:

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

For every clear asset the JSON inventory records:

- semantic key;
- normalized SVG filename;
- normalized staging Drive file ID;
- canonical Drive/source ID from the approved provenance registry;
- exact source byte size;
- exact SVG SHA-256;
- rights holder;
- license basis;
- redistribution decision;
- semantic child-readability approval;
- future normalized direct-SVG production path.

The 14 source SHA-256 values match the existing real-source preflight checkpoint.

## Held semantic scope

These remain deliberately excluded:

```text
vehicle.car     / SVG Repo 499718
object.towel    / SVG Repo 288034
object.raincoat / SVG Repo 212019
```

They remain fail-closed because public-repository redistribution/upstream authority is unresolved. The SVG-first policy does not override this rights gate.

## Session 01 exit criteria

- [x] 5/5 character identities accounted for.
- [x] 35/35 locked character state slots mapped.
- [x] No ambiguous duplicate locked-state source.
- [x] Exact Drive IDs recorded.
- [x] Exact SHA-256 recorded for all 35 character SVGs.
- [x] 14/14 clear semantic SVGs recorded with source SHA and provenance.
- [x] 3/3 held semantic keys recorded and absent from clear staging.
- [x] Visual source inventory review completed.
- [x] No file copied to `public/`.
- [x] No runtime activation.
- [x] No production registry lifecycle mutation.

## Next allowed session

Only **Session 02 — Build shared SVG sanitization + validation foundation**.

Do not start Session 03+ until Session 02 is independently complete.
