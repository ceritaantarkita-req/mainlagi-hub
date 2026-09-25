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

## Next authorized session

### Session 12 — Central semantic SVG runtime resolver + controlled activation

Session 12 may:

- add a centralized semantic-key → approved SVG resolver;
- resolve only registry-approved SVG bindings;
- fail closed to the current canonical glyph/emoji fallback for missing/held/unapproved keys;
- activate only the 14 approved semantic keys;
- add permanent resolver/runtime regression coverage.

Session 12 must not:

- hardcode production SVG paths per activity;
- approve car/towel/raincoat;
- delete the existing WebP rollback/history;
- change correctness/mastery/progression/evidence/reward semantics;
- reopen World, character, Motion Engine, or narration work.

Responsive/browser visual QA remains a later dedicated session.

## Safe start procedure for the next agent/session

1. Fetch latest `main`.
2. Confirm this implementation baseline or a newer docs-only descendant.
3. Read:
   - `MAINLAGI_WORLD_CHARACTER_SYSTEM_INTEGRATION_2026-09-25.md`;
   - `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`;
   - `LEARNING_SEMANTIC_P0_PRODUCTION_APPROVAL_INTEGRATION_2026-09-25.md`;
   - `LEARNING_SEMANTIC_SVG_REGISTRY_SESSION10_CLOSURE_2026-09-25.md`;
   - this checkpoint.
4. Fetch latest `main` and confirm registry v2 is still 14 migration-ready / 0 SVG approved / 3 held.
5. Create a new Session 12 branch from latest merged `main`.
6. Trace the existing semantic visual token/activity consumption path before editing.
7. Implement one centralized registry-backed semantic SVG resolver; do not hardcode file paths per activity.
8. Keep held keys on canonical fallback behavior and preserve all learning/evidence semantics.
9. Require PR CI full green and merged-main exact-SHA Cloudflare smoke before declaring Session 12 live.

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

This checkpoint is the safe handoff between **closed Session 11** and **not-yet-started Session 12**.
