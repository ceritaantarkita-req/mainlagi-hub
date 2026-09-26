# Mainlagi Character + World Safe Checkpoint — 25 September 2026

Status: **SAFE HANDOFF / SESSIONS 01–11 COMPLETE / SESSION 12 NOT STARTED**

## Exact live implementation baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
production branch: main
Session 11 PR: #346
Session 11 final PR head: 32e84d08ad43e172935dd6fb6a63f08567ac9549
Session 11 final PR CI: #1684 / run 36156244598 — full success
merged implementation main: d8992804beb82e553a3965066cf674fbfca9d7b5
merged-main CI: #1685 / run 36157147165 — full success
Production smoke (Cloudflare): success
```

The SHA above is the verified Session 11 implementation baseline for starting Session 12. A later docs-only descendant is acceptable if it preserves this contract.

## Closed character work

```text
Session 01  exact SVG source inventory frozen
Session 02  shared SVG security/validation foundation
Session 03  provenance registry v2
Session 04  35/35 SVG production promotion + approval
Session 05  shared state-aware runtime resolver + CharacterLayer
Session 06  Belajar integration
Session 07  Belajar responsive QA
Session 08  Mainlagi World shared-character integration
Session 09  Home + Bermain shared-character integration
Session 10  semantic illustration registry SVG-aware v2 migration
Session 11  exact semantic SVG production promotion
```

Current character bank:

```text
characters: 5
states per character: 7
approved SVG runtime assets: 35/35
states:
  hero
  welcome
  pointing
  thinking
  correct
  try_again
  celebrate
```

Canonical production paths:

```text
public/artwork/characters/<character>-<state>-v1.svg
```

Do not reconvert these SVGs to WebP as the normal runtime path.

## Current Belajar truth

Belajar is live on the shared SVG character runtime.

```text
Bahasa          Gavi + Paca
English         Naya + Zia
Math            Gian + Paca
Iqro            Gavi + Paca
Huruf           Gavi + Paca
Logic           Gavi + Paca
Science         Gavi + Paca
Color           Gavi + Paca, hidden in active creative workspace
Drawing         Gavi + Paca, hidden in active creative workspace
```

Presentation moments:

```text
entry       -> welcome
guide       -> pointing
waiting     -> hero
correct     -> correct
retry       -> try_again
completion  -> celebrate
```

Belajar integration is centralized through the shared resolver and CharacterLayer. Do not add per-activity character-file hardcoding.

## Session 07 responsive closure

Permanent regression:

```bash
npm run test:ui:character-responsive
```

It is included in:

```bash
npm run test:ui:mobile-routes
```

Matrix:

```text
routes:
  Bahasa
  English
  Math
  Science
  Iqro
  Coloring
  Drawing

viewports:
  320
  390
  430
  768
  1280

35/35 route × viewport captures PASS
horizontal overflow: 0
critical-content overlap: 0
pointer blocking: 0
broken character SVG: 0
creative-workspace character leakage: 0
```

Manual visual review found no defect that justified a CharacterLayer or GardenActivityFrame CSS correction.

## World truth at this checkpoint

**Session 08 is CLOSED / MERGED / LIVE VERIFIED.**

Petualangan Uang remains:

```text
World: Petualangan Uang
World ID: money-festival
authored cast: Gavi + Paca
Chapters: 2
Stages: 8
Scenes: 44
Segments: 89
auth/profile/shell: existing shared Mainlagi child app
narrative progress: child_world_progress
learning contribution: existing reviewed supplemental-evidence bridge only
```

World presentation now uses the shared character resolver + `CharacterLayer`.

```text
catalog/entry       -> welcome
map guidance        -> pointing
neutral story       -> hero
concept/challenge   -> thinking
correct             -> correct
retry               -> try_again
stage/final finish  -> celebrate
```

Permanent browser regression:

```bash
npm run test:ui:world-character
```

It is included in `npm run test:ui:mobile-routes` and verifies the shared SVG runtime at representative 390px and 1280px World flows, including SVG decode, state swaps, pointer safety, overflow, and mobile/tablet challenge containment.

Mandatory invariant remains:

```text
World completion / World stars / narrative progress
!=
Belajar activity completion / mastery / readiness / certificate
```

Session 08 did not change World structure/content, `child_world_progress` semantics, supplemental-evidence activation, Belajar mastery/progression, rewards/certificates, narration activation, or character provenance/approval. Historical World asset-plan gaps remain explicit.

Canonical closure: `MAINLAGI_WORLD_CHARACTER_INTEGRATION_SESSION08_2026-09-25.md`.

## Session 09 Home + Bermain truth

**Session 09 is CLOSED / MERGED / LIVE VERIFIED.**

Home now exposes one Mainlagi product surface with:

```text
Belajar
World
Bermain
```

Home uses the shared approved five-character SVG ensemble in canonical order:

```text
Naya / Gian / Paca / Zia / Gavi
```

Ordinary `CharacterLayer` surfaces remain capped at two characters. Only the explicit Home ensemble variant may render up to five.

Bermain authored cast remains:

```text
Gavi + Paca
```

Presentation mapping:

```text
catalog entry     -> welcome
game preflight    -> welcome
round completion  -> celebrate
```

Preflight characters render only while camera status is idle and disappear before active camera calibration/tracking.

Permanent browser regression:

```bash
npm run test:ui:home-bermain-character
```

It is included in `npm run test:ui:mobile-routes`.

Session 09 did not modify Motion Engine/game mechanics, Belajar mastery/progression, World progress/evidence semantics, character provenance/approval, narration activation, or semantic illustration runtime.

Canonical closure: `MAINLAGI_HOME_BERMAIN_CHARACTER_INTEGRATION_SESSION09_2026-09-25.md`.

## Session 11 semantic SVG production truth

**Session 11 is CLOSED / MERGED / LIVE VERIFIED.**

Current semantic registry machine truth:

```text
version: 2
preferredProductionFormat: svg
runtimeActivation: off

approved WebP history: 14
approved SVG binaries: 14
SVG migration-ready: 0
held SVG slots: 3
```

The 14 approved semantic P0 keys now bind canonical production SVGs at:

```text
/artwork/learning-illustrations/<semantic-slug>-v1.svg
```

Each SVG is exact SHA-bound and validated by the shared SVG security contract. The existing 14 WebPs remain rollback/history.

The three held keys remain:

```text
vehicle.car
object.towel
object.raincoat
```

with no WebP or SVG production binding and `redistributionAllowed=false`.

Canonical closure: `LEARNING_SEMANTIC_SVG_PRODUCTION_SESSION11_CLOSURE_2026-09-25.md`.

## Session 12 runtime checkpoint

**Session 12 is CLOSED / MERGED / LIVE VERIFIED.**

```text
PR: #348
final PR head: ace106307d4aca512076d87853659301ecbd0763
PR CI: #1689 / run 36164884662 — full success
implementation main: 47b98c4a17bd423ced32eb8fb45658575f83a888
merged-main CI: #1690 / run 36165969710 — full success
Production smoke (Cloudflare): success

registry v2
preferred format: svg
runtime activation: controlled-svg
approved SVG bindings: 14
approved WebP history: 14
held: 3
central resolver: active
```

All 14 approved semantic keys are resolver-addressable. Current explicit visual-token consumer coverage is 13 approved unique keys plus three held fallback keys. `object.umbrella` is the one approved key without a dedicated visual-token placement; do not hide this gap by claiming 14/14 current UI consumption.

Canonical closure: `LEARNING_SEMANTIC_SVG_RUNTIME_SESSION12_CLOSURE_2026-09-25.md`.

## Session 13 responsive semantic checkpoint

**Session 13 is CLOSED / MERGED / LIVE VERIFIED.**

```text
PR: #350
final PR head: 08e1e561d3873d13c455c0973510cbf54d711325
PR CI: #1694 / run 36178188858 — full success
implementation main: d9fba856e3819c2a0f353624f5255f84c27bef9a
merged-main CI: #1695 / run 36179277785 — full success
Production smoke (Cloudflare): success

registry v2
preferred format: svg
runtime activation: controlled-svg
approved SVG bindings: 14
approved consumer coverage: 14/14
held fallback coverage: 3/3
semantic consumer union: 17/17
approved WebP history: 14
```

All 14 approved semantic keys now have explicit consumer coverage. The Session 12 `object.umbrella` presentation gap is closed through a safe Activity Gallery preview binding whose assessed answer remains the color `merah`, not the object identity. The three held keys remain fallback-only.

Canonical closure: `LEARNING_SEMANTIC_SVG_RESPONSIVE_SESSION13_CLOSURE_2026-09-26.md`.

## Next authorized session

### Session 14 — Repository-wide approved-SVG sweep

Session 14 may:

- use the Session 01 SVG inventory plus repository search;
- identify remaining already-approved canonical SVG sources hidden behind unnecessary WebP-only rules;
- classify each known approved vector asset as direct-SVG, explicitly exempted, or held with an exact reason;
- preserve raster-native backgrounds/photos as raster;
- add audit/regression evidence needed to make the classification reproducible.

Session 14 must not:

- generate new artwork;
- broaden semantic scope;
- approve unclear-provenance assets;
- delete the 14 semantic WebP rollback/history assets yet;
- change correctness/mastery/progression/evidence/reward semantics;
- reopen World, character, Motion Engine, or narration work.

## Safe start procedure for the next agent/session

1. Fetch latest `main`.
2. Confirm Session 13 implementation main `d9fba856e3819c2a0f353624f5255f84c27bef9a` or a newer docs-only descendant.
3. Read:
   - `LEARNING_SEMANTIC_SVG_RESPONSIVE_SESSION13_CLOSURE_2026-09-26.md`;
   - `MAINLAGI_SVG_SOURCE_INVENTORY_SESSION01_2026-09-25.md`;
   - `MAINLAGI_WORLD_CHARACTER_SYSTEM_INTEGRATION_2026-09-25.md`;
   - `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`;
   - `CURRENT_STATE.md`;
   - this checkpoint.
4. Confirm registry v2 still reports 14 approved SVG bindings, 3 held keys and `runtimeActivation=controlled-svg`.
5. Confirm current semantic consumer union remains 17/17.
6. Audit only already-approved canonical vector assets; do not use the sweep to create or approve new art.
7. Keep raster-native subject backgrounds/photos exempt from forced SVG conversion.
8. Require PR CI full green and merged-main exact-SHA Cloudflare smoke before declaring Session 14 live.

## Stop conditions

Stop and request a separate decision instead of silently changing scope if Session 12 would require:

- a World, Home, Bermain or Belajar behavior rewrite;
- a progression/evidence schema change;
- a new character identity/state;
- clearing any held semantic asset without new rights evidence;
- global age-range expansion;
- Motion Engine or game-mechanic changes;
- narration activation;
- new semantic artwork or rights approval beyond the already-approved 14;
- deleting the existing WebP rollback/history in the SVG promotion wave.

This checkpoint is the safe handoff from **closed Session 13** to **not-yet-started Session 14**.
