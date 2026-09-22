# Mainlagi World — Petualangan Uang Pilot Production Pass — 22 September 2026

Status: **IMPLEMENTED ON ISOLATED WORLD PRODUCTION BRANCH / CI GREEN NOT YET CLAIMED**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This wave closes the eight-Stage pilot runtime production contract after the canonical `World -> Chapter -> Stage -> Scene -> Segment` hierarchy was introduced.

## 1. Production manifest

Source of truth:

```text
src/lib/learning/world/moneyWorldPilot.ts
MONEY_WORLD_PILOT_CONTRACT_VERSION = money-world-pilot-v1
```

All eight canonical Stages now have one explicit production entry containing:

- canonical Stage ID;
- approved reused wide background;
- approved reused mobile background;
- exactly three ambient scene props;
- runtime coverage state;
- asset status.

The manifest order must match `MONEY_WORLD_STAGES` exactly.

## 2. Eight-Stage coverage

Current pilot runtime matrix:

```text
Stage 1  Uang Buat Apa?            -> playground
Stage 2  Kok Jadi Lebih Mahal?     -> mini market
Stage 3  Uang Datang dari Mana?    -> warung
Stage 4  Butuh atau Mau?           -> mini market
Stage 5  Simpan Dulu Yuk           -> number park
Stage 6  Uang Bisa Bertambah?      -> garden
Stage 7  Kalau Naik dan Turun?     -> playground
Stage 8  Siapkan Festival!         -> festival garden
```

Every entry uses repository-owned artwork already accepted by the World asset plan. No new binary art was introduced.

## 3. Runtime is now data-driven

The Stage runtime no longer selects its environment through eight CSS blocks such as:

```text
.stageRuntime[data-stage-order="1"] ...
.stageRuntime[data-stage-order="2"] ...
...
```

Instead it resolves:

```text
getMoneyWorldPilotStage(stageId)
```

and supplies:

```text
--world-scene-wide
--world-scene-mobile
```

as runtime CSS variables.

Ambient props also moved out of the React component and into the same pilot manifest.

This removes two important presentation hardcodes from `MoneyWorldExperience.tsx` / CSS while keeping the same approved visuals.

## 4. Fail-closed pilot rules

`validateMoneyWorldPilotProduction()` requires:

- exactly the canonical eight Stages in canonical order;
- unique production Stage IDs;
- repository-owned background paths;
- exactly three non-empty ambience props per Stage;
- an authored Scene set for every Stage;
- each Stage begins with a `story` Scene;
- each Stage contains a `challenge` Scene;
- each Stage ends with a `closing` Scene;
- Stage 8 contains both the child `choice` and final `recap` Scenes.

If runtime cannot resolve a pilot manifest entry, it stops with an explicit runtime error rather than falling back to an untracked visual.

## 5. Existing canonical hierarchy preserved

This production pass does not change:

- World ID;
- Chapter IDs;
- Stage IDs;
- Scene IDs;
- Segment IDs;
- Segment order;
- narration cue IDs;
- activity IDs;
- Stage unlock order;
- Stage ★★★ completion semantics;
- Segment-index resume compatibility.

Current topology remains:

```text
1 World
2 Chapters
8 Stages
44 Scenes
89 Segments
```

## 6. Character boundary

Human-character development remains paused.

Current World presentation still maps:

```text
Gian story role -> Gavi runtime dummy
Naya story role -> Paca runtime dummy
```

This pilot pass does not activate Gian/Naya fallback or production binaries.

## 7. QA coverage added

Static World contract QA now locks:

- `money-world-pilot-v1`;
- exact eight-Stage manifest coverage/order;
- clean pilot validation;
- every background path is part of the approved World asset manifest;
- every wide/mobile background file exists;
- every Stage starts in story, contains challenge, and closes in closing;
- ambience/background selection does not drift back into component/CSS hardcoding.

Browser QA now includes an **all-eight Stage closure matrix** at 390px.

For each Stage it seeds a valid final Segment checkpoint and verifies:

- the route opens;
- the Stage resolves `data-world-pilot-stage`;
- production runtime status is `pilot-runtime-covered`;
- the last Segment resolves to a canonical `closing` Scene;
- an illustrated background is active;
- narration can be attempted;
- the final Segment advances into Stage completion;
- completion renders exactly ★★★.

This closure matrix complements the existing deeper interaction QA for representative mechanics and milestone/finale paths. It is not a claim that every possible wrong-answer/retry path in all eight Stages has a unique browser test.

## 8. Remaining deliberate production gaps

Still not final:

- fixed recorded Indonesian narration assets;
- final Gian/Naya production character assets;
- dedicated Petualangan Uang public social card;
- bespoke final art for every Stage, if later commissioned;
- World -> Belajar evidence activation;
- age migration beyond the current fail-closed boundary.

## 9. CI truth

The implementation and QA contracts are committed on the isolated production branch.

Do **not** label this wave CI-green until a workflow run validates the resulting branch head. Existing frozen green World checkpoints remain untouched.

## 10. Narration follow-through

Production wave 04 now adds the deterministic fixed-narration review/resolution pipeline:

```text
src/lib/learning/world/moneyWorldNarrationProduction.ts
src/lib/learning/world/moneyWorldNarrationPlayback.ts
docs/WORLD_PETUALANGAN_UANG_NARRATION_PRODUCTION_2026-09-22.md
```

Current fixed-audio truth remains **0/88 approved**, so browser speech stays active.

The next unresolved runtime layer is reusable Scene presentation/rendering based on canonical `Scene.kind`, without changing Stage/Segment progression.
