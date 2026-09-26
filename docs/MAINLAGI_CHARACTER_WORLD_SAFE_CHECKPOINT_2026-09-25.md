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

At the historical Session 12 checkpoint, all 14 approved semantic keys were resolver-addressable but explicit visual-token consumer coverage was still 13 approved unique keys plus three held fallback keys; `object.umbrella` had no dedicated placement yet. **Session 13 below supersedes that coverage state and closes the gap to 14/14 approved + 3/3 held fallback coverage.**

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

## Session 14 repository-wide SVG checkpoint

**Session 14 is CLOSED / MERGED / LIVE VERIFIED.**

```text
PR: #352
final PR head: 74a1fb9967af062274c9ae289e236571c616a862
PR CI: #1698 / run 36210232551 — full success
implementation main: ae1c10087b9b328059605a5cbe9f4fcdf3ba1829
merged-main CI: #1699 / run 36210749985 — full success
Production smoke (Cloudflare): success

approved public artwork SVGs: 49
  character state SVGs: 35
  semantic SVGs: 14
public artwork WebPs: 263 / 263 classified
normal direct legacy Garden character WebP consumers: 0
normal direct semantic WebP runtime refs: 0
held semantic vectors: 3
```

Session 14 migrated all known normal product-surface Gavi/Paca Garden WebP shadows to the approved direct SVG state bank, while preserving the two legacy Garden WebP files as explicit compatibility fallback/history. The 14 semantic WebP derivatives remain rollback/history. No new art or rights approval was introduced.

Canonical closure: `MAINLAGI_APPROVED_SVG_SWEEP_SESSION14_CLOSURE_2026-09-26.md`.

## Session 15 redundant-WebP cleanup checkpoint

**Session 15 is CLOSED / MERGED / LIVE VERIFIED.**

```text
PR: #354
final PR head: 1165053368b69440ce55e067f8c5232256a84146
PR CI: #1703 / run 36218219712 — full success
implementation main: 0f8505fb58b3f698a93e9003eb32ad9fe0e75c67
merged-main CI: #1704 / run 36218744065 — full success
Production smoke (Cloudflare): success

redundant WebP binaries removed: 16 / 223,524 bytes
approved public artwork SVGs: 49
semantic WebP binaries: 0
legacy Garden character WebP binaries: 0
semantic retired WebP history records: 14
public artwork WebPs retained: 247
held semantic vectors: 3
```

Session 15 removed only the exact binaries proven redundant after live SVG verification and exact reference tracing. The 14 semantic WebP histories remain as exact retired path/SHA metadata. The 247 retained WebPs remain justified raster/reference classes.

Canonical closure: `MAINLAGI_REDUNDANT_WEBP_CLEANUP_SESSION15_CLOSURE_2026-09-26.md`.

## Next authorized session

### Session 16 — Final production checkpoint

Session 16 may:

- re-run the full relevant CI/QA matrix;
- verify the exact deployed main SHA and Cloudflare production smoke;
- re-audit final character SVG, semantic SVG, held-asset and retained-WebP counts;
- confirm permanent Session 14/15 asset regressions remain green;
- synchronize final canonical documentation;
- close the SVG/character integration program.

Session 16 must not:

- generate or approve new artwork;
- start a new semantic migration;
- change correctness/mastery/progression/evidence/reward semantics;
- change World content or progression;
- change Motion Engine mechanics;
- activate or redesign narration/audio;
- use final verification as a reason to begin another product wave.

## Safe start procedure for the next agent/session

1. Fetch latest `main`.
2. Confirm Session 15 implementation main `0f8505fb58b3f698a93e9003eb32ad9fe0e75c67` or a newer docs-only descendant.
3. Read:
   - `MAINLAGI_REDUNDANT_WEBP_CLEANUP_SESSION15_CLOSURE_2026-09-26.md`;
   - `docs/data/MAINLAGI_REDUNDANT_WEBP_CLEANUP_SESSION15_2026-09-26.json`;
   - `CURRENT_STATE.md`;
   - `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`;
   - this checkpoint.
4. Verify final tree truth before changing docs: 49 approved public artwork SVGs, 247 justified public artwork WebPs, 0 semantic WebP binaries, 0 legacy Garden character WebP binaries, 14 retired semantic WebP history records, and 3 held semantic vectors.
5. Run the relevant full CI matrix and require exact-SHA Cloudflare smoke.
6. Record final main SHA/CI/deploy evidence.
7. Make documentation-only closure changes unless an actual regression is discovered.

## Stop conditions

Stop and separate the work if Session 16 discovers a need for:

- a feature/runtime redesign;
- a learning semantics/schema change;
- new artwork or rights approval;
- a World/Motion/narration implementation wave;
- deletion of any of the 247 justified retained WebPs without a new approved replacement decision.

This checkpoint is the safe handoff from **closed Session 15** to **not-yet-started Session 16**.
