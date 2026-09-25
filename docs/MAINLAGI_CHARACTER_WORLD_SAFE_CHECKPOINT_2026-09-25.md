# Mainlagi Character + World Safe Checkpoint — 25 September 2026

Status: **SAFE HANDOFF / SESSIONS 01–09 COMPLETE / SESSION 10 NEXT**

## Exact live implementation baseline

```text
repository: ceritaantarkita-req/mainlagi-hub
production branch: main
Session 09 PR: #340
Session 09 final PR head after main sync: 80e2a7211e6ebe1791370a87790b4c2ff20a621a
Session 09 final PR CI: #1673 / run 36131389534 — full success
merged implementation main: 227a77799cd73fecc8e58960ef8758c2e323bc30
merged-main CI: #1674 / run 36132350678 — full success
Production smoke (Cloudflare): success
```

This SHA is the safe runtime implementation baseline for the next session. A later docs-only descendant may become the exact repository HEAD without changing this runtime baseline.

## Closed character/product integration work

```text
Session 01  exact SVG source inventory frozen
Session 02  shared SVG security/validation foundation
Session 03  provenance registry v2
Session 04  35/35 SVG production promotion + approval
Session 05  shared state-aware runtime resolver + CharacterLayer
Session 06  Belajar integration
Session 07  Belajar responsive QA
Session 08  Mainlagi World shared-character integration
Session 09  Home + Bermain shell character integration
```

Current approved character bank:

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

Canonical runtime paths remain:

```text
public/artwork/characters/<character>-<state>-v1.svg
```

Do not reconvert these approved SVGs to WebP as the normal runtime path.

## Belajar truth

Belajar remains live on the shared SVG character runtime.

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

Presentation moments remain:

```text
entry       -> welcome
guide       -> pointing
waiting     -> hero
correct     -> correct
retry       -> try_again
completion  -> celebrate
```

Belajar integration is centralized through `characterPresentation.ts` + `CharacterLayer`. Do not add per-activity character-file hardcoding.

## World truth

Session 08 remains **CLOSED / MERGED / LIVE VERIFIED**.

Petualangan Uang remains:

```text
World ID: money-festival
authored runtime cast: Gavi + Paca
Chapters: 2
Stages: 8
Scenes: 44
Segments: 89
narrative progress: child_world_progress
learning contribution: existing reviewed supplemental-evidence bridge only
```

World presentation mapping remains:

```text
catalog/entry       -> welcome
map guidance        -> pointing
neutral story       -> hero
concept/challenge   -> thinking
correct             -> correct
retry               -> try_again
stage/final finish  -> celebrate
```

Permanent World browser regression:

```bash
npm run test:ui:world-character
```

Mandatory invariant:

```text
World completion / World stars / narrative progress
!=
Belajar activity completion / mastery / readiness / certificate
```

Canonical World closure: `MAINLAGI_WORLD_CHARACTER_INTEGRATION_SESSION08_2026-09-25.md`.

## Home + Bermain truth

Session 09 is **CLOSED / MERGED / LIVE VERIFIED**.

Home now visibly exposes the three Mainlagi experience domains:

```text
Belajar
World
Bermain
```

Home presentation uses the shared approved five-character SVG ensemble in canonical order:

```text
Naya
Gian
Paca
Zia
Gavi
```

The Home ensemble is an explicit `CharacterLayer variant="ensemble"` path. Ordinary shared foreground character rendering remains capped at two characters.

World discovery on Home reads existing Money World progress only. It does not create a second World persistence model or convert World progress into Belajar mastery. The current 6–8 Petualangan Uang pilot gate remains intact.

Bermain presentation uses:

```text
catalog entry     Gavi + Paca / welcome
game preflight    Gavi + Paca / welcome
round completion  Gavi + Paca / celebrate
```

Preflight characters render only while camera state is idle. They disappear during permission/model/calibration so they cannot obstruct child/body/hand/face tracking.

The completion presentation is centralized in the shared `RoundEndOverlay`; no individual game mechanic module was rewritten.

Permanent Session 09 browser regression:

```bash
npm run test:ui:home-bermain-character
```

It is included in:

```bash
npm run test:ui:mobile-routes
```

Canonical Session 09 closure: `MAINLAGI_HOME_BERMAIN_CHARACTER_INTEGRATION_SESSION09_2026-09-25.md`.

## Cross-domain boundaries that remain locked

Do not change these as a side effect of the next session:

- 900 canonical Belajar activity identities;
- 47 active gameplay patterns;
- Pattern #48 remains unjustified;
- correct-answer logic;
- Belajar mastery/progression/readiness;
- World Chapter/Stage/Scene/Segment identity;
- World evidence activation or server mapping;
- World rewards/mastery separation;
- Motion Engine mechanics;
- child/profile ownership model;
- character provenance/approval;
- fixed narration activation;
- semantic illustration runtime activation.

Mandatory separation:

```text
World progress / completion
!= Belajar mastery / completion

Bermain score / round completion
!= Belajar mastery / completion
```

## Next authorized session

### Session 10 — Migrate semantic/activity illustration registry to SVG-aware production

Session 10 is a **registry/provenance/validator contract** wave.

It may:

- update semantic illustration registry/provenance schema to support approved direct SVG production paths;
- update validators/tests for direct sanitized SVG;
- preserve the existing 14 approved semantic P0 source/license-clear items as the eligible migration set;
- keep exact deterministic provenance/hash binding;
- keep existing WebP production derivatives as rollback/history during migration.

It must keep these three keys held and fail-closed:

```text
vehicle.car
object.towel
object.raincoat
```

Session 10 must **not**:

- activate semantic illustration runtime mapping;
- delete existing WebP production derivatives;
- create new artwork;
- relax provenance/redistribution gates;
- touch character runtime behavior;
- redesign Home/World/Bermain;
- alter learning correctness/mastery/progression/evidence;
- activate fixed narration.

## Safe start procedure for Session 10

1. Fetch latest merged `main`.
2. Confirm `227a77799cd73fecc8e58960ef8758c2e323bc30` or a newer docs-only descendant.
3. Read:
   - `MAINLAGI_WORLD_CHARACTER_SYSTEM_INTEGRATION_2026-09-25.md`;
   - `MAINLAGI_HOME_BERMAIN_CHARACTER_INTEGRATION_SESSION09_2026-09-25.md`;
   - `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`;
   - semantic P0 production approval/readiness documents;
   - this checkpoint.
4. Trace the current semantic illustration registry and validators before editing.
5. Create a dedicated Session 10 branch.
6. Keep runtime semantic activation at zero.
7. Keep the three held semantic keys fail-closed.
8. Run asset/security/schema tests plus normal CI.
9. Do not declare Session 10 closed until PR CI and merged-main exact-SHA Cloudflare smoke are green.

## Stop conditions

Stop the sub-change and request a separate decision if Session 10 would require:

- runtime semantic activation;
- replacing or generating held artwork;
- changing a rights/provenance decision;
- deleting rollback WebPs;
- changing Belajar content/correctness;
- changing World or Bermain behavior;
- changing character assets/runtime;
- narration activation.

This checkpoint is the safe handoff between **closed Session 09** and **Session 10 semantic SVG registry/provenance work**.
