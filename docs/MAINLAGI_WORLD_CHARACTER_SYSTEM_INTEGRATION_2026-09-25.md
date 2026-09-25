# Mainlagi World + Character System Integration Plan — 25 September 2026

**Status:** AUTHORIZED IMPLEMENTATION PLAN / DISCUSSION-LOCKED ARCHITECTURE  
**Repository:** `ceritaantarkita-req/mainlagi-hub`  
**Audited production branch:** `main`  
**Audited HEAD:** `ef024c8c324404946189c94efb4fadf68b739833`  
**Character source folder:** `https://drive.google.com/drive/folders/1H0fP4cTxWikNaRrerWntQWaxZAi2Zix3`  
**Primary objective:** make Mainlagi World and the five Mainlagi characters first-class parts of one Mainlagi product system without collapsing World narrative progress into canonical Belajar mastery.

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

# PART I — IMPLEMENTATION WAVES

## 31. Wave 0 — Boundary and documentation synchronization

**Goal:** remove future-agent ambiguity before runtime changes.

Actions:

1. add this document to `docs/`;
2. update canonical current-state wording to state that World + character integration is now authorized;
3. mark old “World separate / character paused” statements as historical where they appear in current canonical handoff docs;
4. do not rewrite old closure documents that accurately describe their original workstream;
5. preserve semantic P0 runtime activation as a separate workstream.

Primary current docs to synchronize after approval:

```text
docs/CURRENT_STATE.md
README.md
docs/README.md
docs/MAINLAGI_ART_BIBLE.md
docs/CHARACTER_PRESENTATION_SYSTEM.md
docs/KNOWN_LIMITATIONS.md
docs/PRODUCT_DIRECTION.md
```

**Exit criteria:**

- no canonical current document tells an agent character work is still paused;
- no canonical current document says World must remain isolated from Mainlagi product integration;
- historical closures remain historically accurate.

---

## 32. Wave 1 — Character Drive intake + provenance manifest

**Goal:** turn the current Drive asset bank into a deterministic reviewed source inventory without public activation.

Actions:

1. list every canonical design set and every pose source from the supplied Drive folder;
2. record exact Drive file ID, source filename, character ID, semantic state, source hash where materialized, and review status;
3. normalize semantic state names;
4. select one canonical source per character/state;
5. reject duplicates/ambiguous alternatives rather than silently choosing;
6. record creation/ownership/licensing basis;
7. keep candidate files outside `public/artwork/characters/`;
8. produce a machine-readable intake manifest under a non-public/internal or docs-reviewed path;
9. visually review scale, silhouette, outfit, face, and state readability.

**No runtime change.**

**Exit criteria:**

```text
5/5 character identities accounted for
all intended states mapped or explicitly missing
no ambiguous duplicate source
rights/provenance review recorded
no public production binary added
```

---

## 33. Wave 2 — Character provenance registry v2 + validator

**Goal:** extend the already-live character production gate to multiple state variants.

Actions:

1. version `character-asset-provenance.json`;
2. extend validator for pose variants;
3. preserve existing base-path compatibility;
4. add regression fixtures for:
   - unknown state;
   - stray variant binary;
   - duplicate path;
   - approved state without rights;
   - invalid alpha;
   - invalid dimensions;
   - valid multi-state character;
5. run existing blocking asset tests;
6. merge validator/schema before production binaries.

**No runtime activation.**

Required checks:

```bash
npm run validate:assets:characters
npm run test:assets:characters
npm run validate:assets
npm run typecheck
npm run lint
```

---

## 34. Wave 3 — Production character derivatives

**Goal:** create the actual validated runtime binaries.

Actions:

1. promote the reviewed, sanitized single-character SVG source files directly as canonical production SVG assets;
2. meet the SVG sanitization, security and normalized-path contract;
3. bind production SHA/provenance;
4. intentionally add only reviewed files to `public/artwork/characters/`;
5. pass blocking validators;
6. review at:
   - native size;
   - activity scale;
   - mobile scale;
   - dark/light contextual backgrounds;
7. approve only exact binaries.

Recommended priority:

```text
1. Naya base/welcome
2. Gian base/welcome
3. Zia base/welcome
4. shared core states
5. new Paca states
6. new Gavi states
```

This preserves the existing safe Gavi/Paca fallback while unlocking the three currently blocked human characters first.

**Runtime still may remain fail-closed until Wave 4.**

---

## 35. Wave 4 — Shared character runtime state system

**Goal:** activate approved assets through one reusable resolver.

Actions:

1. evolve `characterAssets.ts`;
2. add shared presentation-state resolver;
3. add generic CharacterLayer;
4. keep `activityVisualTheme.ts` subject pairings;
5. wire character state to shared activity feedback/completion states where available;
6. preserve creative workspace hiding;
7. preserve fallback behavior;
8. verify English and Math pair transitions.

Expected production behavior after approval:

```text
English -> Naya + Zia
Math    -> Gian + Paca
others  -> current approved pairing
```

Character state behavior:

```text
entry        -> welcome/hero
instruction  -> pointing when appropriate
waiting      -> hero/thinking
correct      -> correct
retry        -> try_again
completion   -> celebrate
```

Do not require all 900 activities to be individually edited.

Use shared runtime boundaries.

---

## 36. Wave 5 — Unified Mainlagi Home

**Goal:** make the product visibly one system.

Modify `Batch14WorldHome.tsx` so Home exposes:

```text
Belajar
World
Bermain
```

as first-class experiences.

Integrate:

- Belajar continuation;
- World continuation;
- World eligibility;
- World progress;
- Games entry;
- approved Mainlagi character hero/cast.

Do not change canonical Belajar recommendation semantics.

**Exit criteria:**

A child should not need to already know that “World” exists from the top nav. Home itself should make it obvious that Petualangan is part of Mainlagi.

---

## 37. Wave 6 — World uses shared character runtime

**Goal:** replace World-specific static/ambient character assumptions with the common approved system.

Actions:

1. define Petualangan Uang cast metadata;
2. resolve Gavi/Paca through shared character runtime;
3. wire default World moment → state mapping;
4. add only necessary authored overrides;
5. retain story continuity;
6. validate Stage map, active Scene, challenge, retry, completion, and final completion;
7. ensure no character overlaps:
   - story text;
   - challenge controls;
   - Back / Again / Next;
   - Share;
   - stage-complete ★★★;
   - mobile safe areas.

Do not touch World progression IDs or evidence mapping merely to add characters.

---

## 38. Wave 7 — Parent integration

**Goal:** make World part of the family product without misreporting learning.

Add a parent-readable World journey section using existing World progress.

Display:

```text
World title
completed stages
current stage
journey completion
last update if available
```

Keep mastery/evidence source-aware.

No new certificate semantics in this wave.

---

## 39. Wave 8 — Final integration QA and release

Minimum automated regression:

```bash
npm run lint
npm run typecheck
npm run validate:assets:characters
npm run test:assets:characters
npm run validate:assets
npm run test:learning:visual-theme
node scripts/run-world-money-tests.mjs
node scripts/run-world-cloud-tests.mjs
node scripts/run-world-evidence-activation-tests.mjs
npm run test:ui:mobile-routes
npm run build
```

Also run the repository's normal merge-blocking CI matrix.

Required browser QA should include at minimum:

```text
320
390
430
768
1280
```

and representative routes:

```text
/child/:id/home
/child/:id/subject/english
/child/:id/subject/math
/child/:id/activity/<English activity>
/child/:id/activity/<Math activity>
/child/:id/worlds
/child/:id/world/money-festival
/child/:id/world/money-festival/stage/<representative stage>
/parent/children/:id/progress
/parent/children/:id/reports
```

Final release requires:

- merged-main CI green;
- exact deployed SHA verification;
- no unexpected asset binaries;
- no stale canonical boundary docs.

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
