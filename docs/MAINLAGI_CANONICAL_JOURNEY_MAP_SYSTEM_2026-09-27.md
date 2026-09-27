# Mainlagi — Canonical Journey Map System — 27 September 2026

Status: **OWNER-APPROVED PRODUCT/VISUAL DIRECTION / IMPLEMENTATION PENDING**  
Scope: Belajar subject journey maps + Mainlagi World journey maps + responsive map interaction.

This document records the complete 27 September 2026 product discussion that followed
the Canonical Completion / Share / Character decision. It is the canonical contract
for the **map experience itself**.

It does **not** authorize implementation before the execution sequence in
`MAINLAGI_POST_SHOP_CHILD_SURFACE_HANDOFF_2026-09-27.md` reaches this wave.

---

## 1. Why the journey-map system is changing

The current Belajar subject surface still reads too much like a dashboard/catalog:

```text
recommended activity
→ compact stage cards
→ playable activity grid
→ browse all
```

The product owner wants the child-facing subject experience to feel more like one
coherent Mainlagi world.

The direction is therefore:

```text
Belajar subject
→ Learning Journey Map as the primary experience

World
→ Adventure Journey Map as the primary experience
```

The two domains share a map language, but their meaning remains different:

- **Belajar** = structured curriculum / learning journey;
- **World** = narrative exploration / adventure journey.

Do not collapse Belajar and World into the same product concept.

---

## 2. Canonical hierarchy — one node is a stage, not a mini-game

A map node represents a **stage / learning cluster / story checkpoint**.

It does **not** represent one mini-game.

Canonical data meaning remains:

```text
Subject / World
└── Stage / Chapter checkpoint
    └── Lesson / activity cluster
        └── Activity / mini-game
            └── Attempt
                └── Evidence / mastery
```

Example for Bahasa Inggris:

```text
Stage: First Words
├── Find blue
├── Listen & find blue
├── Listen: cat
├── Listen again: cat
├── Match the words
└── More word pairs
```

The map shows **First Words** as one journey node.  
The six activities are revealed after the child opens that stage.

This prevents a 100-activity subject from becoming a giant unreadable map of
100 individual game nodes.

---

## 3. One subject = one learning world

Each of the nine canonical Belajar subjects should eventually read as its own
learning world:

1. Bahasa Indonesia
2. Bahasa Inggris
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

The existing 900-activity / 100-per-subject content baseline remains unchanged by
this presentation redesign.

The map engine must be shared. Do **not** create nine independent runtime map
implementations.

Canonical concept:

```text
LearningJourneyMap
├── subject theme
├── authored stage order
├── stage state
├── current/recommended stage
├── progress
├── subject environment art
└── activity list resolved only when a stage is opened
```

Subject-specific visual theming may vary. Runtime architecture should remain shared.

---

## 4. More than one map area / chapter

A subject is not limited to five total stages just because approved concept samples
show five visible stage nodes.

The visible node count comes from canonical authored stage data.

When a subject needs more journey content, continue into a new **area/chapter of the
same learning world**, not a disconnected unrelated map.

Preferred experience:

```text
one subject world
├── Area / Chapter 1
├── Area / Chapter 2
├── Area / Chapter 3
└── ...
```

Transitions should feel spatially/narratively connected: meadow -> village -> coast,
garden -> town, classroom -> park, etc., depending on the subject theme.

Avoid:

```text
five arbitrary mini-games
→ hard cut
→ unrelated new map
```

The child should feel that the journey continues.

---

## 5. Full-page map — no map inside another window

This is a locked visual decision.

The journey map is the **page experience itself**.

Do not render:

```text
cream webpage
→ giant rounded card/window
→ map inside that card
```

That presentation was reviewed and rejected because it makes the map feel like an
image embedded in a dashboard.

Instead:

```text
immersive shell / HUD
→ title/context overlay
→ full-page illustrated environment
→ path + stage overlays integrated into that environment
```

The map should consume the available child viewport and feel like an actual
interactive world.

---

## 6. Environment first, UI second

Locked principle:

> **Environment first, UI second.**

The child should first perceive a Mainlagi world that can be explored. Progress UI
is a light overlay on top of that world.

Do not build a landscape around giant UI cards.

Stage progression should be carried by:

- the path;
- landmarks;
- environmental composition;
- subtle stage markers;
- current/completed/locked state;
- short stage names.

Avoid turning the map into a dashboard made of floating cards, large coins, giant
medals or rows of generic app icons.

---

## 7. Mainlagi illustration language — locked

Earlier generic “cute 3D island / glossy toy / edtech game” samples were reviewed
and rejected as conceptually wrong for Mainlagi.

Journey-map art must follow the existing Mainlagi illustration direction:

- friendly 2D / softly painted cartoon environment;
- rounded readable forms;
- soft shading;
- controlled visual noise;
- bright child-friendly palette;
- natural scene depth rather than glossy toy rendering;
- props integrated into the environment;
- paths, bridges, homes, trees, gardens, markets and landmarks should feel authored
  as part of the scene rather than pasted-on 3D objects;
- activity/game UI stays visually secondary to the environment.

Relevant existing canon remains:

- `MAINLAGI_ART_BIBLE.md`;
- `SUBJECT_BACKGROUND_SYSTEM.md`;
- approved Mainlagi character SVG system;
- current activity environment language.

Do not introduce a parallel “generic island-game” art style.

---

## 8. Character use on maps

Map characters must consume the existing canonical Character Presentation System.

Rules:

- use only canonical authored characters/cast;
- never invent substitute child/mascot characters merely for a map illustration;
- no unintended crop;
- no floating name label underneath;
- keep characters inside a deliberate safe area;
- characters support orientation/story, not block the route or stage choices;
- reduce scale/character count before cropping.

Belajar may show the subject-resolved approved cast where appropriate.

Petualangan Uang keeps its authored World cast and must not infer new cast members
from asset availability.

---

## 9. Stage markers — no mini-game thumbnails

The owner explicitly rejected mini-game thumbnail/icon presentation inside the
journey-map flow.

Do not show the stage as:

- a strip/grid of colorful mini-game thumbnails;
- a catalog of large app icons;
- one giant game icon per activity.

On the default map, a stage should primarily communicate:

- stage number / state;
- short stage name;
- completed/current/locked state;
- optional small progress/status indicator;
- integrated landmark/environment cue.

Small functional symbols such as lock/check/stars are allowed when restrained and
consistent.

The landmark and environment should carry more visual weight than the stage UI.

---

## 10. Default map state — clean

The normal/default state is a clean map.

No large stage-detail panel is shown until a child selects an unlocked/current
stage.

Default map must keep:

- world/environment visible;
- current stage obvious;
- path readable;
- stage states readable;
- minimal HUD;
- no mini-game list;
- no activity-thumbnail strip.

A current node may show a restrained cue such as:

`Lanjut di sini`

This cue is integrated into the node/state, not shown as a separate giant
recommended-activity dashboard card.

---

## 11. Stage-open interaction

When a child clicks/taps an unlocked/current stage, the stage detail appears
contextually.

The map remains the main visual experience behind it.

### Desktop / landscape

Preferred patterns:

- floating contextual card near the selected node;
- lightweight side/floating sheet;
- compact bottom drawer where geometry makes that safer.

Do not use a huge dashboard panel that permanently occupies half the page.

### Mobile portrait

Use a bottom sheet / bottom drawer.

The sheet opens over the lower portion of the map while preserving enough visible
map context above it.

The sheet can expand/scroll if the activity list is long.

Closing the sheet returns to the same clean map and selected/current stage state.

---

## 12. Stage detail content — text first

The stage detail is intentionally simple.

Canonical information:

```text
Stage title
short friendly description
progress summary
progress bar where useful
Lanjut belajar
simple activity list
```

Example:

```text
First Words
2 dari 6 permainan selesai

[ Lanjut belajar ]

✓ Find blue
✓ Listen & find blue
○ Listen: cat
○ Listen again: cat
○ Match the words
○ More word pairs
```

Do not use colorful game thumbnail cards in this view.

The activity list is utility/navigation. It is not the hero.

Existing direct routes and canonical progression guards remain valid.

---

## 13. Immersive Mainlagi Header / game-like navigation

The owner rejected the heavy full website navbar while inside the map experience.

Journey-map surfaces should use an **immersive Mainlagi header/HUD**.

Desired behavior:

- lightweight;
- semi-transparent / visually quiet;
- does not create a heavy white bar that cuts the illustration;
- clear Back/Kembali action;
- small Mainlagi identity;
- compact child profile/menu;
- navigation is discoverable without dominating the scene.

### Desktop

Expanded top-level destinations may appear on hover/focus/menu-open state.

The canonical destination order remains:

```text
Belajar | Bermain | World | Shop
```

Hover must not be the only access method. Keyboard focus/click must work.

### Touch/mobile

No hover dependency.

Use tap/menu expansion where top-level navigation is needed.

### Outside immersive map/game surfaces

Home/catalog pages may keep the normal full navigation treatment.

The immersive header is a route/context mode, not a replacement for every Mainlagi
page.

---

## 14. Belajar vs World visual distinction

Both use the same journey-map system language, but they must remain distinguishable.

### Belajar — Learning Journey Map

Primary feeling:

- structured;
- friendly;
- progress-oriented;
- subject-specific;
- less narrative-heavy;
- current stage and next learning step are easy to understand.

Stage landmarks represent curriculum clusters.

### World — Adventure Journey Map

Primary feeling:

- narrative;
- exploratory;
- cinematic/story-driven;
- larger landmarks;
- story destinations;
- character/world progression has greater presence.

Petualangan Uang should read as a journey through meaningful places/ideas such as
saving, market, growth, price change, needs/wants and the festival destination,
while preserving its canonical authored stage semantics.

---

## 15. Petualangan Uang map direction

The current World map/header was reviewed as weak because of:

- obsolete/wrong-concept header background artwork;
- character cropping;
- map presentation that feels visually unfinished;
- path/node composition that does not yet feel like an authored Mainlagi adventure.

The redesign should:

- remove obsolete/wrong-concept header art;
- stop cropping characters;
- integrate title/context into the environment/HUD;
- show the eight authored stages as meaningful journey checkpoints;
- use landmarks/environment to carry the story;
- make the festival a clear destination;
- keep completed/current/locked states readable;
- preserve World evidence/progression semantics exactly.

Do not rewrite Petualangan Uang curriculum/story truth merely to make the map prettier.

---

## 16. Responsive orientation — map-specific contract

This extends the locked global orientation rule in
`MAINLAGI_CANONICAL_COMPLETION_SHARE_VISUAL_SPEC_2026-09-27.md`.

```text
portrait device  → portrait map composition
landscape device → landscape map composition
rotation         → layout reflow only
```

Rotation must not reset:

- selected stage;
- open/closed stage sheet state;
- activity progress;
- route context;
- World stage state;
- scroll/journey position more than necessary to preserve the selected/current area.

### Portrait mobile

Do not shrink the desktop map.

Use a true vertical composition:

- world continues vertically;
- path/stages recompose for narrow width;
- title/HUD remains compact;
- stage labels remain readable;
- current stage remains visible;
- characters keep safe areas;
- stage detail opens as a bottom sheet;
- no horizontal scrolling as the default interaction.

### Landscape mobile/tablet

Use the wider composition:

- more horizontal world context;
- stage detail may use a floating/side/bottom sheet depending on safe geometry;
- do not crop the environment merely to imitate portrait.

Portrait and landscape are two responsive compositions of the same world/state.

---

## 17. Approved visual direction from the 27 September review

The owner explicitly approved the conceptual direction of the later Journey Map
samples and the portrait mobile adaptations.

The approved concept characteristics are:

- full-page illustrated map;
- Mainlagi-like soft cartoon environment;
- journey path integrated into the environment;
- stage nodes as curriculum/story checkpoints;
- no permanent mini-game thumbnail grid;
- immersive/lightweight header;
- clean default map state;
- stage detail only after node selection;
- mobile portrait uses a vertical world composition;
- mobile stage detail uses a bottom sheet;
- World mobile remains a continuous vertical adventure map.

These approved concepts are **visual direction references**, not authorization to
copy accidental generated text, invented cast members, incorrect stage names or
AI-generated asset details.

Canonical repo data, authored cast, stage names and product logic always win over
generated mockup mistakes.

---

## 18. What is NOT approved / must not be copied from generated concepts

Generated mockups may contain accidental artifacts.

Do not copy:

- random/non-canonical human or mascot characters;
- incorrect character identity;
- incorrect stage titles/order;
- made-up progress values;
- made-up icons as product truth;
- invented English/Indonesian copy that conflicts with canonical content;
- generic glossy 3D/toy rendering;
- map-inside-card/window treatment;
- heavy website navbar inside the immersive map;
- mini-game thumbnail grids;
- node = mini-game semantics.

Use the samples for **composition and interaction direction only**.

---

## 19. Browse All remains secondary

The full subject catalog remains available.

The canonical priority changes to:

```text
Journey Map = primary child experience
Browse All = secondary utility
```

Browse All can help a parent/older child find a specific activity, but it should not
dominate the normal subject journey.

Do not delete valid activities/routes simply because the main presentation changes.

---

## 20. Runtime/data boundaries

This visual/product redesign must not silently change:

- subject IDs;
- 900-activity baseline;
- canonical stage ordering;
- readiness;
- age eligibility;
- attempt lifecycle;
- evidence/mastery;
- progression guards;
- reward semantics;
- World evidence;
- World authored story truth;
- Motion Engine mechanics;
- Shop behavior;
- database schema unless a separately justified requirement is approved.

Presentation reads canonical data. It does not redefine it.

---

# 21. Implementation architecture direction

The future implementation should prefer one shared journey-map foundation with
domain-specific adapters.

Conceptual shape:

```text
CanonicalJourneyMap
├── JourneyMapScene
├── JourneyPath
├── JourneyStageNode
├── JourneyStageState
├── JourneyStageDetail
├── ImmersiveMainlagiHeader
├── responsive portrait/landscape composition
│
├── BelajarLearningJourneyAdapter
└── WorldAdventureJourneyAdapter
```

Do not create one bespoke map component per subject.

Scene art/theming should be data-driven and provenance-controlled where production
assets are introduced.

---

# 22. Required audit before implementation

Before coding the map redesign, audit:

### Belajar

For all nine subjects:

- canonical stage records;
- actual stage counts;
- stage names/order;
- readiness/lock rules;
- activity membership per stage;
- direct activity routes;
- recommendation source;
- Browse All behavior;
- existing stage/lesson pages.

Do not assume every subject has exactly five canonical stages because a visual sample
showed five.

### World

For Petualangan Uang:

- exact eight-stage order;
- authored stage names;
- current/complete/locked rules;
- World evidence mapping;
- chapter/finale behavior;
- stage/open/final completion routes;
- canonical character cast;
- current asset/runtime dependencies.

---

# 23. QA acceptance contract

Journey-map migration is acceptable only when:

- no map is embedded inside an unnecessary giant container/window;
- default map state is clean;
- current stage is obvious;
- node means stage/cluster, not mini-game;
- stage detail opens only after stage selection;
- mini-game thumbnails are absent from canonical stage detail;
- activity list remains readable and functional;
- immersive header is accessible by keyboard/touch and does not depend on hover alone;
- canonical nav order remains Belajar | Bermain | World | Shop when expanded;
- characters use canonical assets/cast and are not cropped;
- no character name label appears underneath;
- portrait map is a real vertical composition, not a scaled desktop screenshot;
- landscape map is a real wide composition;
- orientation change preserves selected stage/detail state;
- no horizontal overflow;
- no page/console errors;
- direct activity routes still work;
- readiness/age/mastery/evidence/progression are unchanged;
- Petualangan Uang evidence/story semantics are unchanged;
- screenshots are manually reviewed against owner-approved visual direction.

Required representative visual QA:

- Belajar subject map desktop default;
- Belajar subject map desktop stage-open;
- Belajar subject map phone portrait default;
- Belajar subject map phone portrait stage-open;
- Belajar subject map phone landscape;
- World Petualangan Uang desktop;
- World Petualangan Uang phone portrait;
- World Petualangan Uang phone landscape;
- at least one additional Belajar subject to prove the map engine is not English-specific.

---

# 24. Execution order relative to existing work

Locked sequence:

```text
1. Finish Shop
2. Merge + production-verify Shop
3. Synchronize + merge + production-verify PR #360
4. Implement shared interaction wave
   - responsive orientation foundation
   - Canonical Completion
   - Canonical Character Presentation
   - Canonical Share
5. Merge + production-verify shared interaction wave
6. Start Canonical Journey Map System
   - Belajar Learning Journey Maps
   - immersive map header
   - stage detail interaction
   - responsive portrait/landscape
   - Petualangan Uang World map redesign
7. Full QA + production verification
8. Residual visual cleanup only after this foundation is stable
```

Do not merge this scope into unfinished Shop, PR #360 or the shared Completion/Share
wave.

---

# 25. Bounded implementation sessions

The Journey Map work must be split into sessions that can each finish cleanly. A
session must not intentionally stop halfway through a migration.

## Session JM-00 — Read-only audit and exact contract

Scope:

- audit all nine Belajar subjects;
- audit Petualangan Uang;
- inventory current subject/stage/map components and routes;
- record exact stage counts/names/membership;
- identify shared vs route-specific code;
- define implementation file plan.

No runtime changes.

Exit:

- one exact audit artifact;
- no unknown stage/runtime ownership;
- no implementation started.

## Session JM-01 — Shared map primitives only

Scope:

- create shared journey-map data/types/state helpers;
- shared stage-state model;
- no visual migration yet.

Exit:

- unit tests green;
- no route behavior changed.

## Session JM-02 — Immersive header

Scope:

- implement the map/game immersive header mode;
- Back, Mainlagi identity, profile/menu;
- expanded nav preserves Belajar | Bermain | World | Shop;
- desktop focus/hover/click + mobile tap behavior.

Exit:

- header works independently;
- accessibility and responsive tests green.

## Session JM-03 — Belajar desktop pilot: one subject, clean default map

Scope:

- pilot Bahasa Inggris only;
- full-page desktop map;
- stage nodes from canonical data;
- no stage-detail panel yet;
- Browse All retained secondarily.

Exit:

- desktop default map complete;
- no activity/progression semantics changed;
- screenshots approved before expansion.

## Session JM-04 — Belajar stage-open interaction

Scope:

- stage click/select behavior;
- floating/detail drawer;
- text-only activity list;
- Lanjut belajar;
- close/return-to-map behavior.

Exit:

- clean default + stage-open state both complete;
- no mini-game thumbnail grid;
- direct routes verified.

## Session JM-05 — Belajar mobile portrait + landscape

Scope:

- true portrait map composition;
- landscape composition;
- portrait bottom-sheet stage detail;
- preserve selected/open state across rotation.

Exit:

- phone/tablet orientation matrix green;
- no overflow;
- no state reset.

## Session JM-06 — Shared Belajar engine extraction

Scope:

- remove English-specific assumptions from pilot;
- theme/data adapter;
- stage-count-agnostic rendering;
- chapter/area continuation support.

Exit:

- shared engine can render a second subject from canonical data without bespoke
  component duplication.

## Session JM-07 — Belajar subjects batch A

Scope:

- Bahasa Indonesia;
- Matematika;
- Iqro;
- Huruf & Menulis.

Exit:

- all four migrated and individually QA-verified;
- no subject-specific runtime fork.

## Session JM-08 — Belajar subjects batch B

Scope:

- Logika;
- Sains;
- Mewarnai;
- Menggambar.

Exit:

- all nine Belajar subjects use the canonical map foundation;
- Browse All and direct routes preserved.

## Session JM-09 — Belajar regression closure

Scope:

- nine-subject route matrix;
- stage membership/order;
- recommendation/current-stage integration;
- desktop/portrait/landscape screenshots;
- accessibility/overflow/console checks.

Exit:

- Belajar Journey Map wave independently releasable.

## Session JM-10 — Petualangan Uang read-only map translation

Scope:

- map existing eight stages into the shared journey model;
- identify World-specific adapter needs;
- exact evidence/story/cast boundary;
- no World visual change yet.

Exit:

- exact translation plan;
- zero World behavior changes.

## Session JM-11 — Petualangan Uang desktop redesign

Scope:

- full-page World adventure map;
- corrected header/environment;
- eight authored stages;
- canonical Gavi/Paca cast;
- no obsolete header art;
- no completion/evidence change.

Exit:

- desktop World map complete and QA green.

## Session JM-12 — Petualangan Uang mobile responsive

Scope:

- portrait vertical adventure composition;
- landscape composition;
- selected-stage state preservation;
- character safe areas.

Exit:

- World responsive matrix green.

## Session JM-13 — Integrated regression / production closure

Scope:

- Belajar + World journey-map matrix;
- shared Completion/Share interoperability;
- orientation changes;
- CI;
- production smoke;
- docs/screenshots/checkpoint.

Exit:

- exact merged SHA recorded;
- production verification recorded;
- no known journey-map regression left open.

---

# 26. Session sizing rule

Every future agent must keep sessions bounded.

A session should:

- have one dominant goal;
- avoid touching unrelated product logic;
- end with tests/QA and a clean checkpoint;
- not intentionally leave half of a route family migrated;
- not combine art generation, runtime migration, database work and broad refactors
  into one giant PR.

If a session cannot be finished safely in one work unit, split it **before coding**.

---

# 27. Final owner-approved summary

```text
Belajar:
each subject becomes a Learning Journey Map.

World:
uses the same journey-map language, but remains a narrative Adventure World.

Map:
full-page / immersive.
Not a map inside a giant card/window.

Node:
one stage / cluster / checkpoint.
Not one mini-game.

Mini-games:
revealed only after stage selection.
Simple text list.
No thumbnail/icon grid.

Default:
clean map.

Stage click:
desktop contextual card/drawer.
mobile portrait bottom sheet.

Navbar:
immersive game-like header.
light / semi-transparent.
normal full navbar remains for non-immersive pages.

Illustration:
Mainlagi soft 2D/painted cartoon language.
Not generic glossy 3D/toy island style.

Responsive:
portrait gets a true vertical map.
landscape gets a wide map.
rotation changes layout only, never state.

Characters:
canonical cast only.
no crop.
no name labels.

Content/progression:
presentation only.
do not change mastery, evidence, readiness, stage truth or World story semantics.
```
