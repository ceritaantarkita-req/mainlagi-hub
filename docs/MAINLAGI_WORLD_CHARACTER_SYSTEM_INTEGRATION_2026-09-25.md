# Mainlagi World + Character System Integration Plan — 25 September 2026

**Status:** AUTHORIZED IMPLEMENTATION PLAN / DISCUSSION-LOCKED ARCHITECTURE  
**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Audited production branch:** `main`  
**Audited HEAD:** `ef024c8c324404946189c94efb4fadf68b739833`  
**Character source folder:** `https://drive.google.com/drive/folders/1H0fP4cTxWikNaRrerWntQWaxZAi2Zix3`  
**Primary objective:** make Mainlagi World and the five Mainlagi characters first-class parts of one Mainlagi product system without collapsing World narrative progress into canonical Belajar mastery.

### Current implementation checkpoint — 25 September 2026

The original `Audited HEAD` above records the starting point of this plan. It is **not the current repository head**.

Current live checkpoint:

```text
Sessions 01–07: COMPLETE
Session 07 PR: #335
final PR head: 1f0e52a13319b6c7730b825b11e3d8540fc967e0
final PR CI: #1650 / run 36105937149 — full success
merged main: 1c4ba5f41c554621ee29aeccb6b5b85415a45d55
merged-main CI: #1651 / run 36106692149 — full success
Cloudflare production smoke: success
Belajar responsive character matrix: 35/35 PASS
next authorized session: Session 08 — World shared-character integration
```

Safe handoff: `MAINLAGI_CHARACTER_WORLD_SAFE_CHECKPOINT_2026-09-25.md`.

---

## 0. Executive decision

Starting from this document, Mainlagi must be treated as **one coherent product system** with several experience domains:

```text
Mainlagi
├── Child identity / family account / session
├── Shared child product shell
│   ├── Belajar
│   ├── World
│   └── Bermain / Motion
├── Shared character system
│   ├── Naya
│   ├── Gian
│   ├── Zia
│   ├── Paca
│   └── Gavi
├── Shared audio / accessibility / visual language
├── Progress + evidence layer
│   ├── Belajar canonical progression
│   ├── World narrative progression
│   └── reviewed World → supplemental evidence bridge
└── Parent surfaces
    ├── child progress
    ├── World journey progress
    ├── source-aware mastery context
    └── reports / certificates where evidence permits
```

**Mainlagi World is no longer to be treated as a separate product or a separate development island.** It is a first-class Mainlagi experience domain that shares the same child identity, shell, visual language, character identities, account boundary, accessibility rules, product navigation, QA discipline, and parent-facing product surface.

However, **“one system” does not mean “one progression table.”**

The following boundary remains mandatory:

```text
World completion / World ★★★ / narrative progress
≠
Belajar activity completion / canonical stars / stage readiness / mastery / certificates
```

World may contribute to learning understanding only through the existing reviewed **supplemental evidence bridge**. World completion itself must never mint Belajar mastery, unlock Belajar stages, issue a Belajar certificate, or fabricate learning evidence.

This is the architectural rule that allows Mainlagi to feel like one product without corrupting the learning model.

---

## 1. Supersession of the previous execution boundary

Older documents currently say:

- Mainlagi World is developed separately;
- character development is paused;
- Drive character assets are reference-only.

Those statements were valid execution boundaries for earlier workstreams. They are now **historical execution constraints** for those earlier waves.

The project-owner instruction on **25 September 2026** explicitly re-authorizes the combined World + character work described here.

Therefore:

1. the historical records must not be deleted or rewritten as if they were never true;
2. their old “do not touch World / character paused” wording must not be used to block this newly authorized integration program;
3. after the first integration PR is merged, canonical current-state documentation must be synchronized so future agents do not follow a stale pause;
4. asset safety gates remain fail-closed even though development is resumed.

**Resume authorization does not equal production approval.** New character binaries still have to pass provenance, technical, visual, responsive, and runtime-activation gates.

---

## 1.1 Character SVG + state decision lock — 25 September 2026

This section records the project-owner decision made after PR #327. Where this section conflicts with the earlier character-format proposal below, this section is the current decision.

- New Mainlagi character production assets use the reviewed **single-character SVG files directly**.
- Do not convert the new character bank to WebP as the normal production path.
- Runtime loads the sanitized SVG as an image asset; do not inject untrusted/raw SVG markup into the DOM.
- Design-set SVG files and `character-set-collection-mainlagi.ai` remain identity/master references, not runtime sprites.
- Existing Garden WebP assets for Gavi/Paca remain compatibility fallbacks during migration only.
- The project owner confirmed the formerly ambiguous Gavi hero source is now `gavi-panel-hero.svg`.

Locked runtime state vocabulary:

```text
hero
welcome
pointing
thinking
correct
try_again
celebrate
```

`hero` is the neutral/default state. Source filename `try-again` maps to runtime `try_again`.

Normalized production naming direction:

```text
/artwork/characters/<character>-hero-v1.svg
/artwork/characters/<character>-welcome-v1.svg
/artwork/characters/<character>-pointing-v1.svg
/artwork/characters/<character>-thinking-v1.svg
/artwork/characters/<character>-correct-v1.svg
/artwork/characters/<character>-try-again-v1.svg
/artwork/characters/<character>-celebrate-v1.svg
```

Source suffixes such as `sample`, `panel-pose`, `(2)`, `(3)` and `(4)` stay in provenance/source metadata and do not become production path names.

This decision is architecture/documentation authorization only. The current validator, registry and runtime remain unchanged until the implementation wave lands.
---

## 1.2 Cross-system SVG-first asset rule — 25 September 2026

The SVG-native decision is **not character-only**.

If an exact approved Mainlagi asset already has a clean canonical SVG source, preserve that SVG through production/runtime instead of creating a WebP derivative solely for pipeline consistency. This includes the semantic/activity illustration set where canonical SVG sources already exist.

Raster-native backgrounds and other genuinely raster artwork stay raster/WebP. Existing verified WebPs are not deleted until their replacement path is separately implemented and verified.

For the 14 source/license-clear semantic P0 assets from PR #324, the next target is direct sanitized SVG production binding before broad runtime activation. The three held keys remain held.

Canonical policy: `SVG_NATIVE_ASSET_POLICY_2026-09-25.md`.

---
# PART A — CURRENT REPOSITORY AUDIT

## 2. Current `main` state

Fresh audit of the connected GitHub repository found:

```text
repo:           ceritaantarkita-req/mainlagi-hub
default branch: main
visibility:     public
audited HEAD:   ef024c8c324404946189c94efb4fadf68b739833
HEAD message:   docs: close semantic P0 production checkpoint (#326)
```

The repository has moved significantly beyond the earlier WS-05 checkpoint.

Recent production history includes:

- semantic P0 production integration through PR #324;
- World evidence release through PR #312;
- World evidence/database hardening waves;
- World non-audio production implementation;
- character presentation foundation;
- character runtime registry;
- character production asset pipeline.

The current `CURRENT_STATE.md` still contains stale current-boundary wording that World is separate and character development is paused. That documentation is now inconsistent with this new project-owner authorization and must be synchronized as part of implementation.

### Audit caveat

The GitHub connector did not return an associated PR-triggered workflow run for the final documentation-only HEAD `ef024c8...`. This document therefore does **not** independently assert a new CI result for that exact docs-only commit. The underlying implementation checkpoints referenced by `CURRENT_STATE.md` are recorded there as merged/live verified.

Do not invent a CI claim that was not observed.

---

## 3. Mainlagi World is already structurally inside the Mainlagi child application

This is important: Mainlagi World is **not** currently a totally separate app.

The child layout already uses the same authenticated child boundary and shared shell:

```text
src/app/child/[childId]/layout.tsx
  -> learningChildCanAccess(childId)
  -> LearningAttemptBridge
  -> LearningProgressionGuard
  -> MobileFoundation
  -> WorldChildShell
  -> PlayroomShell
```

`WorldChildShell` is currently only a wrapper around the same `PlayroomShell`.

The child navigation already exposes:

```text
Belajar
World
Bermain
```

from:

```text
src/components/learning/Playroom.tsx
```

Existing child World routes are already first-class routes:

```text
/child/[childId]/worlds
/child/[childId]/world/[worldId]
/child/[childId]/world/[worldId]/stage/[stageId]
```

The public World landing also exists:

```text
/worlds/money-festival
```

**Conclusion:** the missing integration is primarily **product-level and presentation-level**, not a rewrite of routing or account architecture.

Do not create a second World router, a second auth system, a second child profile model, or a second app shell.

---

## 4. Current World canonical model

The repository already defines the canonical hierarchy:

```text
World
└── Chapter
    └── Stage
        └── Scene
            └── Segment
```

Canonical contract:

```text
src/lib/learning/world/worldStructure.ts
src/lib/learning/world/moneyWorldStructure.ts
```

Current authored Petualangan Uang implementation is regression-locked at:

```text
World:    Petualangan Uang
World ID: money-festival
Chapters: 2
Stages:   8
Scenes:   44
Segments: 89
```

The existing World implementation must remain the source of truth. Do not re-model Petualangan Uang as Subjects, Lessons, or ordinary `LearningActivity` rows merely to make the architecture look uniform.

Uniformity belongs at the **product layer**, not by destroying meaningful domain differences.

---

## 5. Current World persistence and evidence architecture

World already has dedicated narrative persistence:

```text
public.child_world_progress
```

with identity:

```text
account + child + world
```

and server-owned save behavior.

Relevant files include:

```text
src/lib/learning/world/progress.ts
src/lib/learning/world/cloud.ts
supabase/migrations/0047_world_progress_persistence.sql
```

World progress is intentionally separate from canonical Belajar progression.

The repo also already contains the World → supplemental evidence architecture and a tightly scoped live production mapping. The evidence boundary is designed so that a World answer can contribute reviewed supplemental evidence without allowing the browser to choose:

- canonical skill;
- evidence weight;
- mastery qualification;
- reward effects;
- progression effects;
- certificate effects.

This architecture must be preserved.

### Mandatory invariant

```text
World narrative state
        │
        ├──────────────> child_world_progress
        │
        └─ only reviewed assessment observations
                         │
                         v
             server-owned World evidence gate
                         │
                         v
          supplemental skill evidence
                         │
                         v
         source-aware mastery calculation

NOT:
World completion -> Belajar completion
```

Do not replace this with a shortcut.

---

## 6. Current child Home is still Belajar-first

Current child home route:

```text
src/app/child/[childId]/home/page.tsx
  -> Batch14WorldHome
```

Despite its name, `Batch14WorldHome` currently presents:

- a Belajar recommendation;
- subject directory;
- current generic `CharacterGroup`.

It does **not** yet give World and Bermain the same product-level visibility as Belajar.

This is one of the main remaining gaps between:

```text
“World exists inside the same repo”
```

and:

```text
“World feels like an integral Mainlagi system”
```

The Home integration must be fixed without mixing World into Belajar adaptive ranking.

---

# PART B — CHARACTER ASSET AUDIT

## 7. Drive character folder is materially more complete than the current repo documentation says

The current repo documentation still says the Drive contains only Naya/Gian/Zia reference design sheets and that no separate foreground candidates exist.

That is now stale.

The audited Drive folder contains canonical design sets for all five characters:

| Character | Canonical design-set asset |
| --- | --- |
| Naya | `kak-naya-character-design-set.svg` |
| Gian | `gian-character-design-set.svg` |
| Zia | `zia-character-design-set.svg` |
| Paca | `paca-character-design-set.svg` |
| Gavi | `gavi-character-design-set.svg` |

The folder also contains `character-set-collection-mainlagi.ai`, which may be retained as a master/source bundle but must **never** be used directly as a browser runtime dependency.

The Drive folder also contains separate per-character pose/state artwork. The recurring state vocabulary observed across the asset set includes:

```text
welcome
pointing
thinking
correct
try-again
celebrate
```

There are also waving / greeting-style assets and full character design sheets.

This changes the implementation situation materially:

> Mainlagi is no longer blocked by “we only have character sheets.”  
> The project now has an actual source bank for a reusable character-state system.

---

## 8. Visual character audit

The five characters share a coherent visual family:

- rounded, readable silhouettes;
- bright but controlled palette;
- child-friendly proportions;
- consistent vector language;
- clear facial expressions;
- consistent interaction-state vocabulary;
- sufficiently distinct identities at small scale.

Identity summary:

```text
Naya  -> older sister / pink hijab / calm guide
Gian  -> energetic young boy / blue-white outfit
Zia   -> younger girl / purple identity
Paca  -> cyan/blue robot
Gavi  -> orange cat / teal accent
```

The current visual set is suitable as the **source-of-truth character design bank**.

This audit does **not** automatically declare every Drive file production-ready. Before public runtime use, each production derivative still needs:

- exact source record;
- rights/provenance record;
- transparent production export;
- technical validation;
- small-scale visual review;
- responsive overlap QA;
- explicit runtime activation.

Do not infer public redistribution rights solely because a file exists in the project Drive.

---

# PART C — TARGET MAINLAGI PRODUCT ARCHITECTURE

## 9. Product model: one Mainlagi, multiple experience domains

Target child product:

```text
Mainlagi Child
│
├── Home
│   ├── Continue Belajar
│   ├── Continue Petualangan / World
│   ├── Bermain
│   └── Shared character cast
│
├── Belajar
│   └── Subject -> Path -> Stage -> Lesson -> Activity
│
├── World
│   └── World -> Chapter -> Stage -> Scene -> Segment
│
└── Bermain
    └── existing motion/game runtime
```

All three experience domains share:

```text
childId
account/session ownership
PlayroomShell
Mainlagi visual system
character identities
sound/accessibility preferences
responsive/mobile foundation
analytics conventions
parent-facing context
security conventions
deployment/QA pipeline
```

They do **not** need identical content schemas.

### Do not create a premature “universal activity schema”

Do not flatten:

- World Segment;
- Belajar Activity;
- Motion Game

into one generic database table in this integration.

There is currently no demonstrated need for that migration and it would create unnecessary regression risk.

If Mainlagi later has several structurally different Worlds and several cross-domain recommendation engines, a generalized experience registry may become justified. It is **not required** to complete this integration.

---

## 10. Home becomes the first truly unified Mainlagi surface

`Batch14WorldHome.tsx` should evolve from a Belajar-only launch page into a Mainlagi product home.

Recommended information architecture:

```text
Hero
  "Hai, {name}"
  approved Mainlagi cast / guide presentation

Continue
  Belajar recommendation
  World continuation, if eligible and started

Explore
  Belajar
  Petualangan / World
  Bermain

Below
  subjects
  current World card / progress
  optional motion-game discovery
```

### Important recommendation boundary

Do **not** put World stages into `rankAdaptiveLearningV2()` during this integration.

Belajar adaptive ranking is tied to canonical learning progression and evidence.

Instead:

```text
Belajar continuation = Belajar recommender
World continuation   = child_world_progress
Bermain continuation = game/product navigation
```

Home combines the three outputs visually without pretending they are one scoring system.

This is the correct definition of “one product.”

---

## 11. Navigation

Existing `PlayroomShell` already has:

```text
Belajar | World | Bermain
```

Keep that shared shell.

Allowed improvements:

- change `World` label to a more child-readable product label later if desired;
- show World progress/availability affordance;
- align active states and visual identity;
- make the World destination feel as first-class as Belajar.

Do not:

- add a second World-specific global header;
- hide Mainlagi child profile context inside World;
- create an isolated World account/session;
- duplicate mute/audio controls;
- duplicate parent/account links.

Immersive Stage behavior may continue to hide the main header while the child is actively inside a World stage.

---

# PART D — CHARACTER SYSTEM ARCHITECTURE

## 12. Character identity is not child identity

Preserve the current correct rule:

```text
child profile identity != guide/character identity
```

Naya/Gian/Zia/Paca/Gavi are:

- brand characters;
- guides;
- companions;
- feedback presenters;
- story cast.

They are not the child's avatar identity in parent reporting.

Parent UI should continue to represent the actual child profile separately.

---

## 13. Separate three character concerns

The implementation must maintain three explicit layers:

```text
1. Character source/design
   Google Drive canonical masters

2. Production asset/provenance gate
   src/lib/data/character-asset-provenance.json
   public/artwork/characters/
   validator

3. Runtime presentation
   src/lib/learning/characterAssets.ts
   activity/world presentation resolver
```

Never let one layer silently imply the next.

Examples:

```text
Drive asset exists
≠ production redistribution approved

Production SVG exists
≠ runtime active

Runtime character approved
≠ automatically appears in every surface
```

---

## 14. Existing production character pipeline must be evolved, not replaced

The fail-closed PR #263 pipeline remains the implementation baseline, but the 25 September decision **supersedes its WebP-specific target for new character assets**.

Target production contract for the new character bank:

```text
format:             SVG
scope:              isolated single-character asset
background:         transparent/no baked full-canvas background
viewBox:            required
scripts/events:     forbidden
unsafe active DOM:  forbidden
external refs:      reject unless explicitly reviewed/allowlisted
runtime loading:    image asset path, not raw SVG injection
max bytes:          current 1,000,000-byte ceiling until tightened by measured implementation
```

Current PR #263 validator behavior must be migrated before these SVGs can be marked production-approved. Keep provenance and runtime activation as separate gates.

The provenance schema must move from one production binary per human character to one character with seven reviewed state variants.

---

## 15. Canonical runtime character states

Use the following semantic runtime state vocabulary:

```ts
type CharacterPresentationState =
  | "hero"
  | "welcome"
  | "pointing"
  | "thinking"
  | "correct"
  | "try_again"
  | "celebrate";
```

Notes:

- `hero` is the neutral/default state;
- Drive filename `try-again` maps to runtime state `try_again`;
- source filenames do not define runtime API naming;
- every state is optional until approved.

### Fallback contract

```text
requested approved state
    ↓ unavailable
approved hero/welcome for same character
    ↓ unavailable
existing approved legacy Gavi/Paca fallback when context permits
    ↓ unavailable
hide character layer, do not render an unapproved asset
```

Never fall back to a reference-only Naya/Gian/Zia file.

---

## 16. Proposed production naming

New production assets use normalized SVG state paths:

```text
/artwork/characters/<id>-hero-v1.svg
/artwork/characters/<id>-welcome-v1.svg
/artwork/characters/<id>-pointing-v1.svg
/artwork/characters/<id>-thinking-v1.svg
/artwork/characters/<id>-correct-v1.svg
/artwork/characters/<id>-try-again-v1.svg
/artwork/characters/<id>-celebrate-v1.svg
```

Do not preserve Drive working suffixes such as `sample`, `panel-pose`, `(2)`, `(3)` or `(4)` in production filenames. Preserve those exact source names and Drive IDs in provenance metadata.

Existing legacy runtime assets remain migration fallbacks:

```text
/artwork/garden-paca.webp
/artwork/garden-gavi.webp
```

Do not move/delete the legacy files in the first SVG integration wave.

---

## 17. Provenance registry v2

Recommended schema direction:

```json
{
  "version": 2,
  "scope": "character-foreground",
  "items": {
    "naya": {
      "identityReference": "...",
      "variants": {
        "hero": {},
        "welcome": {},
        "pointing": {},
        "thinking": {},
        "correct": {},
        "try_again": {},
        "celebrate": {}
      }
    }
  }
}
```

Every production variant must retain the existing principles:

```text
source
rights holder
license/ownership basis
redistributionAllowed
reviewedAt
expectedProductionPath
productionPath
technical contract
lifecycle
```

The exact implementation may preserve compatibility fields temporarily, but the validator must reject:

- unknown state names;
- unexpected public binaries;
- approved variants without rights basis;
- non-approved variants that expose production paths;
- missing files;
- opaque files;
- invalid dimensions/format;
- path collisions;
- duplicate state/path bindings.

---

## 18. Character runtime registry

Current:

```text
src/lib/learning/characterAssets.ts
```

currently exposes one runtime source per character and correctly keeps:

```text
Naya = reference-only
Gian = reference-only
Zia  = reference-only
Paca = approved
Gavi = approved
```

Evolve it so asset lifecycle and pose selection remain centralized.

Target conceptual API:

```ts
approvedCharacterRuntimeAsset(characterId, state)
resolveCharacterState(characterId, requestedState)
```

`characterAssets.ts` must remain the only place that turns an approved production record into a concrete runtime asset path.

Do not spread raw character file paths throughout components.

---

## 19. Presentation resolver

Presentation behavior should be separated from asset approval.

Recommended new module:

```text
src/lib/learning/characterPresentation.ts
```

Responsibilities:

```text
subject/world/context -> which character(s)
feedback/runtime state -> which semantic pose
availability -> fail-closed asset resolution
```

Conceptual input:

```ts
{
  context:
    | "home"
    | "subject"
    | "activity"
    | "activity_completion"
    | "world_catalog"
    | "world_map"
    | "world_scene"
    | "world_completion",
  subjectId?,
  worldId?,
  feedbackState?,
  requestedCharacters?
}
```

Conceptual output:

```ts
{
  characters: [
    { id, state, src, side, role }
  ],
  source: "authored" | "subject-preference" | "world-cast" | "approved-fallback"
}
```

This module must be **presentation-only**.

It must never inspect:

- correct answer values to manufacture evidence;
- mastery scores to change evidence;
- private answer keys for visual leakage;
- parent data;
- unrelated child accounts.

---

## 20. Existing subject character pairings remain valid

Current subject preferences already encoded in:

```text
src/lib/learning/activityVisualTheme.ts
```

Preserve them unless separately changed:

| Subject | Preferred pair |
| --- | --- |
| Bahasa Indonesia | Gavi + Paca |
| English | Naya + Zia |
| Matematika | Gian + Paca |
| Iqro | Gavi + Paca |
| Huruf & Menulis | Gavi + Paca |
| Logika | Gavi + Paca |
| Sains | Gavi + Paca |
| Mewarnai | Gavi + Paca, hidden in workspace |
| Menggambar | Gavi + Paca, hidden in workspace |

When approved assets exist:

```text
English -> Naya + Zia
Math    -> Gian + Paca
```

should finally be allowed to resolve without activity-specific hardcoding.

Creative workspaces must continue to suppress decorative characters where they compete with the canvas/tools.

---

# PART E — WORLD + CHARACTER INTEGRATION

## 21. Petualangan Uang cast

Current authored Petualangan Uang copy and presentation are built around:

```text
Gavi + Paca
```

Do not rewrite the story merely to force all five characters into every World.

Target World cast metadata should be explicit:

```ts
cast: {
  primary: ["gavi", "paca"]
}
```

Naya, Gian, and Zia may appear in:

- Mainlagi Home;
- World catalog;
- general Mainlagi celebration;
- future World entries;
- future authored supporting roles.

They should not be injected into an existing story scene unless the content is intentionally authored for them.

This keeps the character system unified without making narrative continuity incoherent.

---

## 22. World character-state behavior

For Petualangan Uang, use the shared state vocabulary rather than bespoke one-off character files.

Recommended defaults:

| World moment | Character state |
| --- | --- |
| World/catalog entry | `welcome` |
| Stage map guidance | `pointing` |
| Story/neutral scene | `hero` |
| Child is considering a challenge | `thinking` |
| Correct challenge feedback | `correct` |
| Incorrect/retry feedback | `try_again` |
| Stage complete | `celebrate` |
| Final World complete | `celebrate` |

Prefer rule-based defaults with optional authored overrides.

Do **not** manually add 89 pose declarations just because there are 89 Segments.

A Segment-specific override should exist only when the story needs a particular character/state.

---

## 23. World presentation integration points

Primary files:

```text
src/components/learning/world-v2/MoneyWorldExperience.tsx
src/components/learning/world/WorldSceneRenderer.tsx
src/lib/learning/world/moneyWorldPresentation.ts
src/lib/learning/world/moneyWorld.ts
```

Target responsibilities:

```text
moneyWorld.ts
  authored World content / stage / scene / segment semantics

moneyWorldPresentation.ts
  presentation metadata, cast, optional character cue overrides

characterPresentation.ts
  shared cross-product character resolution

WorldSceneRenderer.tsx
  generic rendering of resolved character presentation

MoneyWorldExperience.tsx
  World catalog/map/stage flow; no direct raw pose-path hardcoding
```

Avoid making `MoneyWorldExperience.tsx` a new monolith with hardcoded file paths.

---

## 24. Shared character component

Use or introduce one generic foreground layer, rather than separately implementing character markup in Belajar and World.

Recommended component:

```text
src/components/learning/CharacterLayer.tsx
```

Responsibilities:

- render 0–2 normal foreground characters;
- accept already-resolved runtime assets;
- expose stable data attributes for QA;
- handle side/anchor;
- respect safe-area and mobile layout;
- mark decorative imagery appropriately;
- prevent pointer blocking;
- provide a stable class/API for subtle transition animation.

It must **not** decide mastery, cast, or character eligibility.

The resolver decides. The component renders.

---

## 25. Character motion policy

Initial production animation should be deliberately simple.

Allowed initial motion:

```text
fade/slide-in
very small idle float/breath
small celebrate emphasis
state crossfade
```

Avoid:

- constant bouncing;
- large motion behind answer controls;
- animation that delays task interaction;
- motion on every screen element;
- autoplay animation that ignores reduced-motion preferences.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Character identity must remain understandable even when animation is disabled.

---

# PART F — WORLD AS A FIRST-CLASS MAINLAGI EXPERIENCE

## 26. Home integration contract

Modify:

```text
src/components/learning/Batch14WorldHome.tsx
```

so it presents all three Mainlagi child areas.

Minimum acceptable Home state:

### Belajar card

Use the existing adaptive Belajar recommendation.

### World card

Use World eligibility + `child_world_progress`:

```text
Not started:
  "Mulai Petualangan Uang"

Started:
  "Lanjut Petualangan"
  current Stage / journey progress

Completed:
  completion state / replay entry
```

### Bermain card

Provide direct child-friendly entry to existing games/motion experience.

### Character hero

Once character assets are approved, the Home hero can become the canonical five-character ensemble composition.

Until then, it must continue to fail closed to currently approved runtime identities.

---

## 27. Do not merge World into Belajar adaptive recommendation yet

This is explicitly out of scope for the integration.

Do not turn:

```text
rankAdaptiveLearningV2()
```

into a cross-domain recommender in this wave.

Reason:

- Belajar ranking has mastery/progression semantics;
- World continuation has narrative semantics;
- Bermain has play semantics.

Mainlagi can provide a unified Home without inventing a fake universal score.

A future cross-domain recommendation system requires its own objective, evidence model, safety rules, and product decision.

---

## 28. Parent reporting

World should become visible as part of the child's Mainlagi journey.

Parent-facing target:

```text
Belajar
  canonical completion / evidence / mastery

Petualangan
  World stages completed
  current stage
  last journey activity
  World completion status

Learning insight
  source-aware only
  clearly labels supplemental World evidence when it contributes
```

Do not display:

```text
"World Stage complete = Math mastered"
```

If supplemental World evidence contributes to a mastery summary, the UI must preserve the existing source-aware labeling contract.

World narrative progress may be shown even when no supplemental learning evidence exists.

That distinction is important and parent-readable.

---

# PART G — AGE CONTRACT

## 29. Preserve the current age boundary during integration

Current facts:

```text
Mainlagi core child profile creation: ages 3–7
Petualangan Uang pilot:              ages 6–8
```

Do **not** silently expand global Mainlagi age support in this integration.

Safe behavior:

```text
3–5 -> World card may hide or show "belum untuk umurmu" based on approved UX
6–7 -> eligible Petualangan Uang child experience
8   -> World content contract exists, but current core onboarding does not create age-8 profiles
```

The age-8 gap is a separate product decision.

This integration must not:

- rewrite every activity age range;
- expand child profile onboarding to 8+;
- mutate existing child ages;
- enable age-8 canonical Belajar evidence;
- use World age range as a reason for global curriculum migration.

When a global age expansion is explicitly authorized later, audit every downstream dependency first.

---

# PART H — AUDIO BOUNDARY

## 30. Character/World integration does not authorize fixed narration activation

World narration infrastructure exists, but fixed World narration binaries remain governed by their own asset/review gate.

Do not combine:

```text
character activation
+
World product integration
+
bulk narration generation
```

into one risky release.

Current browser fallback may remain.

Character pose changes must not change narration identity automatically.

A future character voice model should be treated as a separate identity/voice contract.

---

# PART I — CANONICAL SESSION-BY-SESSION EXECUTION QUEUE

## 31. Execution contract

This section is the **canonical implementation queue** for character + SVG work. It supersedes the older wave ordering when there is any conflict.

Every item below is deliberately sized for **one focused work session**.

Rules for every session:

```text
start from latest main
one bounded objective only
no unrelated refactor
implementation + tests + docs/checkpoint in the same session
finish with exact changed files + test result + commit/PR SHA
do not start the next session inside the same session
fail closed if provenance/security/rights are unresolved
```

Do not edit 900 activities individually. Use shared registries/resolvers/components.

### Session 00 — Merge the documentation/policy checkpoint

**Do:** merge the current docs-only SVG-native/World-character policy PR after checks are green.  
**Do not:** change runtime/code/assets.  
**Done when:** canonical docs on `main` state SVG-first policy, character work resumed, and World is first-class Mainlagi.

### Session 01 — Freeze exact SVG source inventory — COMPLETE

**Closure:** `MAINLAGI_SVG_SOURCE_INVENTORY_SESSION01_2026-09-25.md`  
**Machine-readable manifest:** `data/MAINLAGI_SVG_SOURCE_INVENTORY_SESSION01_2026-09-25.json`  
**Base main:** `28c95a0966ba726f960e4fa204d74b7e1793045b`

Verified result:

```text
5/5 characters
35/35 locked character state slots
14/14 source/license-clear semantic SVGs
3/3 held semantic keys
0 duplicate/ambiguous character slots
0 held semantic files in clear staging
49/49 scoped SVG source SHA-256 values recorded
0 public production files added
0 runtime activation
0 registry lifecycle mutation
```

Character-folder extras are explicitly excluded from the locked runtime slots: 5 design-set SVGs, 5 waving SVGs, the Illustrator collection, and one PNG reference/review file.

Character source identity/state/hash is frozen; exact public-repository rights/redistribution approval remains pending and must fail closed until later provenance approval.

**Session 01 is closed. Do not repeat inventory work unless the source Drive folders change.**


### Session 02 — Build shared SVG sanitization + validation foundation — COMPLETE

**Closure:** `MAINLAGI_SVG_VALIDATION_SESSION02_2026-09-25.md`  
**Shared module:** `scripts/lib/svg-asset-security.mjs`  
**Regression:** `scripts/run-svg-asset-security-tests.mjs` / `npm run test:assets:svg-security`  
**Base main:** `3833edd7b49b9a6d12b5ebf6e447819ab39ce340`

Verified implementation:

```text
malformed XML                   blocked
missing/invalid viewBox         blocked
script/event handlers           blocked
foreignObject/active content    blocked
external/data resource refs     blocked
unsafe CSS imports/URLs         blocked
oversized SVG                   blocked
duplicate production paths      blocked
stray production SVG            blocked
symbolic-link production SVG    blocked
simple external DOCTYPE         stripped safely
DOCTYPE internal subset/entity  blocked
```

The helper was compatibility-tested against the exact Session 01 source set:

```text
35/35 character SVGs pass
14/14 semantic SVGs pass after sanitizer
49/49 total
```

Only `object-ball.svg` required deterministic removal of its legacy external SVG 1.1 DOCTYPE. No source was converted to WebP.

`npm run validate:assets` now includes the SVG security regression suite.

**No registry migration, public SVG addition, or runtime activation occurred in Session 02.**

**Session 02 is closed. Start Session 03 only from merged latest main.**


### Session 03 — Migrate character provenance registry to 5 × 7 SVG states — COMPLETE

**Closure:** `MAINLAGI_CHARACTER_PROVENANCE_V2_SESSION03_2026-09-25.md`  
**Registry:** `src/lib/data/character-asset-provenance.json` version 2  
**Base main:** `782d358aa2559f9aa48fb55aa94db4675d7cd6bf`

Verified state:

```text
5/5 characters
7/7 locked states per character
35/35 total SVG variants
35/35 unique Drive IDs
35/35 unique source SHA-256 values
35/35 unique normalized production paths
35/35 review-required
0/35 production-approved
0 public SVG character files added
0 runtime activation
```

Registry v2 now freezes exact Session 01 source identity/hash and Session 02 source-validation status for every state.

The validator/regression suite now understands only the locked five-character/seven-state SVG schema and validates the future approved-SVG path through the shared Session 02 security foundation.

**Rights boundary:** all 35 variants remain fail-closed with `redistributionAllowed=false` until exact rights-holder/license/public-redistribution basis is documented.

**Session 03 is closed. Start Session 04 only from merged latest main.**


### Session 04 — Promote approved character SVGs into production — COMPLETE

**Closure:** `MAINLAGI_CHARACTER_SVG_PRODUCTION_SESSION04_2026-09-25.md`  
**Base main:** `7bb981daa9cb10256640162313c526012b1b2974`

Verified result:

```text
5/5 characters
7/7 locked states each
35/35 normalized SVG files in public/artwork/characters/
35/35 lifecycle=approved
35/35 owned provenance
35/35 redistributionAllowed=true
35/35 exact production SHA-256 bindings
35/35 source SHA == production SHA
0 runtime activation
```

Every production SVG was fetched from the exact Session 01 Drive ID and verified byte-for-byte before commit. No character SVG required rewriting.

Rights basis is recorded as project-owner-created/owned Mainlagi character artwork with explicit project-owner authorization for public-repository redistribution of this exact 35-file state bank.

Design sets, waving extras and the Illustrator collection remain outside runtime. Legacy Garden Gavi/Paca WebP files remain unchanged as migration fallback.

**Session 04 is closed. Start Session 05 only from merged latest main.**


### Session 05 — Implement shared character runtime resolver — COMPLETE

**Closure:** `MAINLAGI_SHARED_CHARACTER_RUNTIME_SESSION05_2026-09-25.md`  
**Base main:** `9b9c28e997374d0dcb15b3796a8c6698097dd234`

Implemented:

```text
characterAssets.ts
  5 × 7 approved SVG state runtime registry
  approvedCharacterRuntimeAsset()
  resolveCharacterState()
  same-identity fail-closed fallback

characterPresentation.ts
  subject pair policy
  money-festival cast
  context -> semantic state
  authored override
  cross-identity approved fallback

CharacterLayer.tsx
  generic 0–2 character renderer
  stable QA attributes
  pointer-safe / safe-area-aware
  reduced-motion-safe
```

Regression:

```text
npm run test:learning:character-runtime
```

is now part of `npm run test:learning`.

Important compatibility boundary: the old `approvedCharacterRuntimeSrc()` API remains unchanged in this session, so existing Belajar still renders its pre-SVG Gavi/Paca fallback behavior. Session 06 owns the deliberate Belajar migration to the new resolver.

**No Belajar, World, Home, mastery, progression or evidence behavior is changed by Session 05 itself.**

**Session 05 is closed. Start Session 06 only from merged latest main.**

### Session 06 — Integrate characters into Belajar — COMPLETE

**Closure:** `MAINLAGI_BELAJAR_CHARACTER_INTEGRATION_SESSION06_2026-09-25.md`  
**Base main:** `6d97a99f1e276509e7ec5c9c012858c425ea1697`

Belajar now uses the shared state-aware character runtime without activity-by-activity asset hardcoding.

Activated pair policy:

```text
Bahasa          Gavi + Paca
English         Naya + Zia
Math            Gian + Paca
Iqro            Gavi + Paca
Huruf           Gavi + Paca
Logic           Gavi + Paca
Science         Gavi + Paca
Color/Drawing   Gavi + Paca, hidden while workspace is active
```

Presentation-only moment mapping:

```text
entry       -> welcome
guide       -> pointing
waiting     -> hero
correct     -> correct
retry       -> try_again
completion  -> celebrate
```

Integration uses the existing centralized learning interaction bridge to emit a separate `childId + activityId + moment` presentation event. The character resolver never reads answer keys and does not mutate evidence/mastery/progression.

`GardenActivityFrame` now renders via the shared `CharacterLayer`. The old Belajar dependency on `approvedCharacterRuntimeSrc()` is removed.

Regression now locks:

```text
900/900 Belajar activities -> canonical subject pair + approved SVG state bank
English representative      -> Naya + Zia
Math representative         -> Gian + Paca
retry                       -> try_again
completion                  -> celebrate
```

New representative browser command:

```bash
npm run test:ui:character-belajar
```

Full multi-viewport visual polishing remains Session 07.

**Session 06 is closed. Start Session 07 only from merged latest main.**

### Session 07 — Belajar character responsive QA + fixes — COMPLETE

**Closure:** `MAINLAGI_BELAJAR_CHARACTER_RESPONSIVE_SESSION07_2026-09-25.md`  
**Base main:** `edef9ab9b52580e19b8281fa7a473d59197e3625`  
**PR:** #335  
**Baseline QA:** CI #1646 / run `36104751650` — full success  
**Final PR head:** `1f0e52a13319b6c7730b825b11e3d8540fc967e0`  
**Final PR CI:** #1650 / run `36105937149` — full success  
**Merged main:** `1c4ba5f41c554621ee29aeccb6b5b85415a45d55`  
**Merged-main CI:** #1651 / run `36106692149` — full success including Cloudflare production smoke

Session 07 tested the shared Belajar character presentation at:

```text
320 / 390 / 430 / 768 / 1280
```

Representative routes:

```text
Bahasa   -> bahasa-cari-a
English  -> english-find-blue
Math     -> math-count-2
Science  -> science-living-cat
Iqro     -> iqro-cari-alif
Color    -> color-gavi
Drawing  -> drawing-line-horizontal
```

Result:

- 35/35 route × viewport captures passed;
- zero horizontal overflow;
- zero character overlap with prompt/answers/canvas/tools;
- character layer and images remain `pointer-events: none`;
- decorative layer remains `aria-hidden`;
- reduced-motion removes character animation;
- all visible character assets load directly from approved SVG runtime paths;
- character images stay contained inside the activity frame;
- Coloring/Drawing continue to suppress `CharacterLayer` while the creative workspace is active;
- manual visual review of all five viewport contact sheets found the existing responsive layout clean.

**No CSS/layout correction was required.** Session 07 therefore closes as a QA/regression-hardening session rather than a visual redesign.

Permanent command:

```bash
npm run test:ui:character-responsive
```

The test is included in `npm run test:ui:mobile-routes` and writes its screenshots/report under `.mobile-route-qa/character-session07/`.

**Session 07 is closed. Start Session 08 only from merged latest main.**

### Session 08 — Integrate shared character runtime into Mainlagi World

**Do:** keep Petualangan Uang authored cast = Gavi + Paca and route it through the shared character resolver.

Default mapping:

```text
catalog/entry       welcome
map guidance        pointing
neutral story       hero
considering         thinking
correct             correct
retry               try_again
stage/final finish  celebrate
```

**Do not:** change World IDs, 2 Chapters / 8 Stages / 44 Scenes / 89 Segments, progress, evidence, stars, or Belajar mastery.  
**Done when:** catalog/map/stage/retry/completion use the shared runtime without UI overlap.

### Session 09 — Integrate characters into Home + Bermain shell

**Do:** use the shared character system on:
- Mainlagi Home full-cast/brand presentation;
- Belajar/World/Bermain entry cards where appropriate;
- Bermain entry/result/completion presentation only.

**Do not:** redesign Motion Engine or game mechanics.  
**Done when:** Home visibly presents one Mainlagi system and Bermain uses shared character assets without touching motion logic.

### Session 10 — Migrate semantic/activity illustration registry to SVG-aware production

**Do:** update the learning-illustration provenance schema/validator so the 14 clear semantic P0 items can use:

```text
/artwork/learning-illustrations/<semantic-slug>-v1.svg
```

Keep these held with no production activation:

```text
vehicle.car
object.towel
object.raincoat
```

**Do not:** delete the existing 14 WebP production derivatives or activate runtime yet.  
**Done when:** SVG-aware semantic registry/validator tests pass and held keys remain fail-closed.

### Session 11 — Promote the 14 approved semantic SVG sources into production

**Do:** sanitize, normalize, hash, provenance-bind, and add the exact 14 source/license-clear canonical SVGs to `public/artwork/learning-illustrations/`.

Keep existing WebP derivatives as rollback/history during migration.

**Do not:** map them into child runtime yet.  
**Done when:** all 14 SVGs pass provenance/security/asset validation with exact SHA bindings.

### Session 12 — Activate the central semantic SVG resolver

**Do:** implement one central semantic-key → approved SVG path resolver and connect only the intended recognition-critical learning surfaces.

Rules:
- 14 approved keys may resolve to SVG;
- car/towel/raincoat keep existing fallback;
- no raw Drive URL;
- no per-activity file-path hardcoding;
- missing/unapproved key fails closed.

**Do not:** change activity correctness, mastery, progression or evidence.  
**Done when:** representative semantic P0 activities render the approved SVGs and held keys still fall back.

### Session 13 — Semantic/activity SVG responsive QA + fixes

**Do:** verify the direct SVG semantic assets at 320/390/430/768/1280 on all affected surface families.

Check:
- semantic readability;
- no cropping/overflow;
- no answer leakage;
- accessibility;
- deterministic resolver output;
- no external SVG network dependency.

**Do not:** add new artwork during QA.  
**Done when:** all 14 active SVG assets pass representative browser QA and the 3 held keys remain unchanged.

### Session 14 — Repository-wide approved-SVG sweep

**Do:** use the Session 01 inventory plus repository search to find any remaining **already-approved canonical SVG source** still being unnecessarily converted or shadowed by a WebP-only production rule.

For each item in this bounded sweep:
- keep SVG if vector-native;
- leave raster-native backgrounds/photos as raster;
- do not migrate assets with unclear provenance.

**Do not:** generate new art or expand semantic scope.  
**Done when:** every currently known approved vector asset is either direct-SVG, explicitly exempted, or explicitly held with reason.

### Session 15 — Remove redundant WebP derivatives only after live SVG verification

**Do:** after Sessions 07/08/09/13/14 are verified, trace runtime references and remove only WebP files proven redundant.

Candidates:
- legacy character WebP fallback, only if no runtime path still needs it;
- 14 semantic WebP derivatives, only after SVG runtime is verified and rollback need is closed.

**Do not:** remove raster-native subject backgrounds or any still-referenced fallback.  
**Done when:** no broken references, no duplicate unnecessary derivative, asset tests/build pass.

### Session 16 — Final closure + exact production checkpoint

**Do:** run the full relevant test/CI matrix, verify deployed exact SHA, and synchronize current docs.

Minimum:

```bash
npm run lint
npm run typecheck
npm run validate:assets
npm run validate:assets:characters
npm run test:assets:characters
npm run test:learning:visual-theme
node scripts/run-world-money-tests.mjs
node scripts/run-world-cloud-tests.mjs
node scripts/run-world-evidence-activation-tests.mjs
npm run test:ui:mobile-routes
npm run build
```

Record:
- exact character SVG count;
- exact semantic/activity SVG count;
- remaining held assets;
- remaining justified WebP assets;
- exact merged main SHA;
- CI result;
- deployed SHA.

**Do not:** start another product wave.  
**Done when:** character + SVG migration is closed, reproducible, documented, and live-verified.

### Session dependency order

Execute strictly:

```text
00
-> 01
-> 02
-> 03
-> 04
-> 05
-> 06
-> 07
-> 08
-> 09
-> 10
-> 11
-> 12
-> 13
-> 14
-> 15
-> 16
```

If one session finds a rights/security blocker, close that session with the exact blocked item recorded as fail-closed. Do not expand the session or silently bypass the gate.

---

# PART J — FILE-LEVEL IMPLEMENTATION MAP

## 40. Existing files expected to change

### Character asset lifecycle

```text
src/lib/learning/characterAssets.ts
src/lib/data/character-asset-provenance.json
scripts/validate-character-assets.mjs
scripts/run-character-asset-validator-tests.mjs
docs/CHARACTER_ASSET_PIPELINE.md
docs/CHARACTER_PRESENTATION_SYSTEM.md
```

### Shared presentation

```text
src/lib/learning/activityVisualTheme.ts
src/components/learning/GardenActivityFrame.tsx
```

Likely new shared module/component:

```text
src/lib/learning/characterPresentation.ts
src/components/learning/CharacterLayer.tsx
```

### Mainlagi product integration

```text
src/components/learning/Batch14WorldHome.tsx
src/components/learning/Playroom.tsx
```

### World

```text
src/lib/learning/world/moneyWorld.ts
src/lib/learning/world/moneyWorldPresentation.ts
src/components/learning/world/WorldSceneRenderer.tsx
src/components/learning/world-v2/MoneyWorldExperience.tsx
```

### Canonical docs

```text
docs/CURRENT_STATE.md
README.md
docs/README.md
docs/MAINLAGI_ART_BIBLE.md
docs/KNOWN_LIMITATIONS.md
docs/PRODUCT_DIRECTION.md
```

### Parent reporting

Do not guess a legacy parent component from filename alone.

Before editing, trace the actual current route imports from:

```text
src/app/parent/**
```

and use the current canonical cloud-backed parent/report implementation.

The repo already documents that parent implementations have had legacy/duplicate variants. Follow route imports, not similarly named components.

---

# PART K — NON-GOALS / HARD BOUNDARIES

## 41. Do not do these things as side effects

This integration does **not** authorize:

- changing 900 Belajar activity identities;
- changing the 47 active gameplay patterns;
- inventing Pattern #48;
- changing correct answers;
- changing canonical mastery thresholds;
- turning World completion into canonical Belajar completion;
- making World ★★★ become Belajar stars;
- issuing certificates merely for World completion;
- expanding global supported age range;
- bulk activating fixed narration audio;
- activating semantic P0 runtime illustration mapping;
- rewriting motion engine architecture;
- replacing Supabase auth;
- adding a second profile system;
- adding a second World persistence system;
- deleting historical closure documents;
- hardcoding character files inside individual activities;
- baking characters into background illustrations;
- using unapproved Drive SVGs directly from public runtime.

If an agent needs one of these changes to complete the requested implementation, it must stop that sub-change and document why a separate authorization is required.

---

# PART L — SECURITY / DATA INVARIANTS

## 42. Preserve child ownership and server authority

All child World routes continue under the existing authenticated child boundary.

Do not weaken:

```text
learningChildCanAccess(childId)
RLS / ownership checks
server-owned World progress writes
server-owned evidence mapping
```

Never trust browser-submitted values for:

- skill ID;
- evidence weight;
- mastery state;
- progression effect;
- reward effect;
- certificate effect.

Character IDs/states are presentation data and must not be allowed to mutate evidence semantics.

---

## 43. Existing World security follow-up

Current project records contain an explicit follow-up around the private World evidence activation registry / RLS posture.

The existing privilege model was designed so browser roles do not directly mutate the registry, but RLS hardening has been recorded as an explicit operator decision.

Do not casually mix that security change into a character/UI PR.

If the registry is touched during future evidence work, re-audit:

- owner;
- direct privileges;
- RPC execute privileges;
- RLS/policies;
- service-role boundary.

---

# PART M — ACCEPTANCE CRITERIA

## 44. Product acceptance

This integration is complete only when all of these are true:

### One Mainlagi product

- child uses one profile/session;
- Home exposes Belajar, World, and Bermain;
- all share the same Playroom shell;
- World no longer feels like a hidden side product;
- World keeps its own meaningful content hierarchy.

### Character system

- all five identities have canonical source references;
- production variants are provenance-bound;
- Naya/Gian/Zia can become runtime-approved without hardcoding;
- character state resolver is reusable;
- missing assets fail closed;
- characters do not overlap task UI;
- child identity remains separate from guide identity.

### World

- existing 2 Chapters / 8 Stages / 44 Scenes / 89 Segments remain intact unless a separately authored content change is approved;
- World progress persists through existing local/cloud behavior;
- World completion does not mint canonical Belajar completion;
- Gavi/Paca story continuity remains intact;
- shared character system drives World presentation.

### Belajar

- 900 activity baseline remains intact;
- canonical mastery/progression remains intact;
- English can use Naya/Zia after approval;
- Math can use Gian/Paca after approval;
- fail-closed behavior remains valid.

### Parent

- parent can see World journey progress;
- supplemental World evidence is source-labeled;
- parent report never claims World completion equals mastery.

### QA

- asset gates pass;
- World tests pass;
- mobile routes pass;
- accessibility remains intact;
- exact deployment SHA is verified;
- canonical documentation is synchronized.

---

# PART N — AGENT EXECUTION RULES

## 45. Instructions for any future coding agent

An agent receiving this document must:

1. fetch current `main` before implementation;
2. compare current HEAD with `ef024c8c324404946189c94efb4fadf68b739833`;
3. treat any newer merged changes as the new source of truth;
4. do not reset/revert newer changes just to match this document;
5. trace current routes before modifying similarly named legacy components;
6. implement one wave at a time;
7. keep asset approval and runtime activation separate;
8. keep World progress and Belajar progression separate;
9. preserve all existing production evidence safety boundaries;
10. run the specific wave tests plus the normal repository CI matrix;
11. document exact before/after counts and SHA;
12. stop and report if a required change violates a hard boundary.

### Agent must not interpret this doc as permission for a giant one-PR rewrite

Preferred release pattern:

```text
PR A — boundary/docs sync
PR B — character source/provenance + validator v2
PR C — approved production character binaries
PR D — shared character runtime/state activation
PR E — unified Mainlagi Home + World first-class discovery
PR F — World shared-character integration
PR G — parent World journey integration
PR H — final closure/docs sync, if needed
```

Small, reviewable, fail-closed PRs are preferred over one broad refactor.

---

# PART O — RECOMMENDED FIRST EXECUTION

## 46. What should happen next

The next implementation should **not** start by editing World content.

The safest first engineering wave is:

```text
1. synchronize the new authorization boundary;
2. inventory exact Drive character pose assets;
3. create the deterministic character source manifest;
4. migrate the character provenance/validator contract to multi-state v2;
5. keep runtime unchanged.
```

Why this first:

- World runtime is already production-capable;
- child World routes already share the Mainlagi shell;
- the major newly available input is the complete character-state source bank;
- the current repo character gate is intentionally one-asset-per-character;
- changing the gate first allows later UI/World integration to consume reviewed assets safely.

After that, activate the character system and then update Home/World presentation.

---

# Final architecture statement

The intended end state is:

```text
Mainlagi is one product.

Belajar teaches through canonical structured learning.
World turns learning concepts into narrative, playful experiences.
Bermain provides motion/game experiences.
Characters make all three feel like the same living Mainlagi universe.
Parents see one child's journey across the product.

Under the hood, each domain keeps the progression semantics it actually needs.
Shared identity and presentation do not erase evidence boundaries.
```

That is the implementation definition of **“Mainlagi World sebagai satu sistem yang utuh dari Mainlagi.”**
