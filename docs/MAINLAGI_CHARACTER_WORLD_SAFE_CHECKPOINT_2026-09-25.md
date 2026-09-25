# Mainlagi Character + World Safe Checkpoint — 25 September 2026

Status: **SAFE HANDOFF / SESSIONS 01–10 COMPLETE / SESSION 11 NOT STARTED**

## Exact live implementation baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
production branch: main
Session 10 PR: #343
Session 10 final PR head: 698cba5f9baa8de896d0056daf777f3e00e56f6e
Session 10 final PR CI: #1678 / run 36142537668 — full success
merged implementation main: 21955a64728162f8985d04160e8ec683e1238080
implementation merged-main CI: #1679 / run 36143708306 — full success
implementation Production smoke (Cloudflare): success
closure docs PR: #344
verified closure main: 53e33c6b8ecb737da88af563d310ac486619b206
closure docs PR CI: #1680 / run 36146245332 — full success
closure merged-main CI: #1681 / run 36147457854 — full success
closure Production smoke (Cloudflare): success
```

The implementation SHA above is the Session 10 code baseline; `53e33c6b8ecb737da88af563d310ac486619b206` is the verified docs-closure baseline for starting Session 11. A later docs-only descendant is acceptable if it preserves this contract.

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

## Session 10 semantic SVG registry truth

**Session 10 is CLOSED / MERGED / LIVE VERIFIED.**

Current semantic registry machine truth:

```text
version: 2
preferredProductionFormat: svg
runtimeActivation: off

approved WebP history: 14
SVG migration-ready: 14
approved SVG binaries: 0
held SVG slots: 3
```

The 14 clear semantic P0 keys preserve the exact approved WebP history from PR #324 and now have canonical SVG target slots:

```text
/artwork/learning-illustrations/<semantic-slug>-v1.svg
```

Their Session 10 SVG state is:

```text
status: migration-ready
path: null
sha256: null
```

The three held keys remain:

```text
vehicle.car
object.towel
object.raincoat
```

with:

```text
lifecycle: review-required
WebP binding: null
SVG status: held
SVG path: null
SVG sha256: null
redistributionAllowed: false
```

The validator now supports future approved SVGs using the shared SVG security foundation while still validating the 14 existing WebP binaries. No child-facing semantic runtime changed.

Canonical closure: `LEARNING_SEMANTIC_SVG_REGISTRY_SESSION10_CLOSURE_2026-09-25.md`.

## Next authorized session

### Session 11 — Promote the 14 approved semantic SVG sources into production

Session 11 may:

- use the exact 14 already-reviewed canonical SVG sources;
- sanitize each with `scripts/lib/svg-asset-security.mjs`;
- normalize each into `/artwork/learning-illustrations/<semantic-slug>-v1.svg`;
- calculate and bind exact SHA-256 values;
- move exactly those 14 registry v2 SVG slots from `migration-ready` to `approved`;
- preserve existing WebP binaries as rollback/history.

Session 11 must not:

- activate the semantic SVG resolver in child runtime;
- change activity correctness/mastery/progression/evidence;
- clear car/towel/raincoat without new rights evidence;
- delete the existing WebP history;
- reopen character, World, Motion Engine, or narration work.

Runtime activation remains Session 12.

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
5. Create a new Session 11 branch from latest merged `main`.
6. Acquire/use only the exact 14 already-reviewed canonical source SVGs from the approved source records.
7. Sanitize, normalize, hash-bind, and promote exactly those 14 SVG slots.
8. Keep runtime semantic rendering off in Session 11.
9. Require PR CI full green and merged-main exact-SHA Cloudflare smoke before declaring Session 11 live.

## Stop conditions

Stop and request a separate decision instead of silently changing scope if Session 11 would require:

- a World, Home, Bermain or Belajar behavior rewrite;
- a progression/evidence schema change;
- a new character identity/state;
- clearing any held semantic asset without new rights evidence;
- global age-range expansion;
- Motion Engine or game-mechanic changes;
- narration activation;
- semantic runtime activation that belongs to Session 12 or later;
- deleting the existing WebP rollback/history in the SVG promotion wave.

This checkpoint is the safe handoff between **closed Session 10** and **not-yet-started Session 11**.
