# SI-00 — Shared Interaction Coverage Audit — 27 September 2026

Status: **AUDIT COMPLETE / HISTORICAL PRE-IMPLEMENTATION BASELINE**

> Post-audit implementation note — **30 September 2026**: SI-01 through SI-11 are now CLOSED / MERGED / LIVE VERIFIED. The ownership tables and counts below intentionally describe the 27 September audit base and must not be read as current runtime status. SI-11 preflight found the one missed production-reachable renderer from the implementation sequence, `SubitizingGlanceActivity`; it was migrated before final closure. Current authority is `SI11_SHARED_INTERACTION_INTEGRATED_CLOSURE_SAFE_CHECKPOINT_2026-09-30.md`.

Audit base:

```text
repository: ceritaantarkita-req/mainlagi-hub
main:       bf69beea081cff4eb1cf9f1a54ed3ef9aba6408a
audit branch:
audit/si-00-shared-interaction-coverage-20260927
```

This audit was intentionally performed before Shop closure because SI-00 is read-only
with respect to product/runtime behavior.

No Shop runtime, Shop migration, Shop provider contract, child runtime, database
schema, gameplay mechanic, learning evidence, World evidence or production asset was
changed by SI-00.

The active Shop branch is **not** the audit base and is not modified by this audit.

---

## 1. Goal

Identify the exact ownership and migration surface for the owner-approved shared
interaction wave:

1. Canonical Completion System;
2. Canonical Share Experience;
3. Canonical Character Presentation;
4. portrait/landscape responsive behavior with state preservation.

The audit must answer:

- where final completion is currently implemented;
- which routes already consume the old shared completion;
- which routes still use local/inline completion;
- where Share is duplicated or inconsistent;
- where character clipping/name labels originate;
- which state owners are sensitive to orientation;
- which migrations can be solved once at a shared owner and which are true exceptions.

This audit does **not** authorize implementation. Implementation starts only in the
later SI sessions after the normal post-Shop execution gates.

---

# 2. Executive findings

## 2.1 Belajar is only partially on the existing shared completion

The activity router currently exposes **42 specialized activity renderers** before its
fallback path.

Only **3 of those 42 specialized renderers** currently render the existing shared
`ActivityCompletion` component:

- `MemoryMatchActivity`;
- `PatternCompletionActivity`;
- `TakeAwayActivity`.

The other **39 specialized renderers** complete their canonical activity/evidence
flow but still render local success UI, typically a success message plus
`Pilih permainan lain`.

The fallback `ChildLearningPlatform.ActivityScreen` is also mixed:

- legacy `MatchingActivity` uses `ActivityCompletion`;
- legacy choice, trace, coloring and story paths do not;
- `motion_game` redirects into Main Gerak rather than owning a final completion.

Therefore the existing shared completion is a proven substrate, but it is **not**
the canonical final-completion owner for all Belajar activity families today.

This matches the historical WS-13 completion record: that wave deliberately adopted
only representative mechanics rather than performing a mass migration.

## 2.2 Bermain has one shared round-end owner for 9/10 games, but it is not the approved Completion system

The current Main Gerak catalog has exactly 10 game slugs.

Nine slugs terminate through the shared `RoundEndOverlay` in
`src/games/shared.tsx`.

The exception is:

- `airboard-presenter` — open-ended presenter/workspace with no explicit final
  completion state in the current module.

`RoundEndOverlay` is centralized and therefore a strong migration seam, but its
current contract is different from the owner-approved canonical Completion:

- current result/score presentation;
- actions are `Main lagi` + `Kalibrasi ulang`;
- no canonical `Back | Again | Next` row;
- no completion-scoped canonical Share.

Bermain currently exposes a separate generic `ShareButton` in `GameShell` during
the game. That share path is not the same as the parent-gated achievement Share used
by Belajar/World completion.

## 2.3 World has a bespoke completion/share implementation

`MoneyWorldExperience.tsx` owns a separate `WorldStageCompletion`.

It already has:

- stage-dependent praise;
- three stars;
- Gavi/Paca completion characters;
- chapter milestone reward;
- stage/finale-specific completion message;
- `Back | Again | Next`;
- Share;
- parent share gate;
- public-safe World URL.

However it duplicates both Completion and Share UI rather than consuming the shared
Belajar component.

The later canonical component must therefore support World context/metadata without
removing:

- chapter milestone semantics;
- final-stage/festival semantics;
- authored next-stage routing;
- existing World evidence/progression behavior.

## 2.4 Character clipping is structural, not one bad asset

The shared `CharacterLayer` uses canonical SVG character assets and
`object-fit: contain`, but its root layer is currently `overflow: hidden`.

Several caller containers are shorter than the maximum character geometry.

Verified examples:

- World story art container height: 190 px while its character may render around
  150 px wide with a 500:650 source ratio, approximately 195 px tall;
- World completion character container height: 160 px while the same maximum width
  can imply approximately 195 px height;
- Bermain round-end card and character band both clip overflow at shared/result
  container boundaries.

Therefore the fix must be a **safe-area/container contract**, not ad-hoc per-character
nudging and not merely replacing SVG assets.

## 2.5 One visible character-name label source is confirmed

World story `SpeechCard` renders the runtime character and then renders:

```tsx
<strong>{runtimeCharacter.name}</strong>
```

under the character.

This is the confirmed source of the Gavi/Paca name tag seen in the reviewed World
screens.

The shared `CharacterLayer` itself does not render visible character names.

## 2.6 There are three child-facing Share implementations/owners to reconcile

Confirmed current owners:

1. `ActivityCompletion.tsx`
   - parent-gated;
   - generic public Mainlagi origin;
   - completion-scoped.

2. `MoneyWorldExperience.tsx::WorldStageCompletion`
   - parent-gated;
   - public `/worlds/money-festival` target;
   - completion-scoped;
   - duplicate UI/logic.

3. `GameShell.tsx -> ShareButton.tsx`
   - available during Main Gerak gameplay;
   - shares current route/current game description;
   - native-share-first + small fallback menu;
   - no parent share gate;
   - not an achievement completion modal.

The owner-approved future contract is one canonical Share Experience opened from
canonical Completion. The current Main Gerak share path therefore needs an explicit
migration/retirement decision during SI implementation.

## 2.7 Orientation is currently mostly CSS-driven; there is no shared product orientation state owner

There is no production-wide central orientation store that remounts activity/game
components.

Current relevant behavior is primarily:

- CSS responsive rules;
- game local React state;
- activity local React state;
- World local React state;
- browser `<dialog>` state;
- physical-device QA harness listening to resize/orientationchange for evidence only.

That is a useful baseline: SI-01 should preserve local runtime identity and introduce
the minimum shared orientation/layout substrate needed for composition. It must not
create orientation-keyed remounts.

---

# 3. Current route ownership

Primary child activity dispatcher:

`src/app/child/[childId]/activity/[activity]/page.tsx`

The dispatcher has 42 specialized activity component branches, then falls back to
`WorldActivityScreen`.

`WorldActivityScreen` itself:

- special-cases `math-count-3` into `MathCountActivity`;
- otherwise falls back to legacy `ChildLearningPlatform.ActivityScreen`.

This means SI migration must cover both:

1. specialized activity components; and
2. the fallback/legacy activity renderer.

Do not assume changing one generic component covers all 900 activities.

---

# 4. Belajar specialized-renderer coverage matrix

Legend:

- **Shared** = currently renders `ActivityCompletion`;
- **Inline** = canonical completion/evidence occurs, but final UI remains local;
- **Workspace** = creative/open work surface with its own local done state;
- **Special** = distinct route-specific owner requiring explicit migration treatment.

| Renderer | Current final UI | Existing shared Completion | Migration owner |
| --- | --- | ---: | --- |
| MathTraceWorldActivity | local success + subject exit | No | Special trace owner |
| CreativePracticeActivity | local creative completed block | No | Creative workspace owner |
| AudioChoiceLearningActivity | local done/subject exit | No | Audio-choice owner |
| SymbolHuntChoiceActivity | local success/subject exit | No | Symbol-hunt owner |
| MemoryMatchActivity | shared overlay | **Yes** | Existing shared adopter |
| DragTargetMatchActivity | local done/subject exit | No | Drag owner |
| SequenceSlotChoiceActivity | local success/subject exit | No | Sequence owner |
| SyllableAssemblyActivity | local success/subject exit | No | Syllable owner |
| InitialSoundActivity | local success/subject exit | No | Initial-sound owner |
| PhraseSceneMatchActivity | local success/subject exit | No | Phrase-scene owner |
| GrowthStageTransitionActivity | local success/subject exit | No | Growth-stage owner |
| SingleRuleApplyActivity | local success/subject exit | No | Rule owner |
| SubitizingGlanceActivity | local success/subject exit | No | Subitizing owner |
| EliminationBoardActivity | local success/subject exit | No | Elimination owner |
| PhenomenonRelationBoardActivity | local success/subject exit | No | Phenomenon owner |
| ShapeAttributeBoardActivity | local success/subject exit | No | Shape-attribute owner |
| PictureWordMatchActivity | local success/subject exit | No | Picture-word owner |
| SentenceOrderCardsActivity | local success/subject exit | No | Sentence-order owner |
| ReadingPassageQuestionActivity | local success/subject exit | No | Reading-passage owner |
| ClozeSentenceChoiceActivity | local success/subject exit | No | Cloze owner |
| VisualWordProblemActivity | local success/subject exit | No | Word-problem owner |
| SpatialRelationBoardActivity | local success/subject exit | No | Spatial-relation owner |
| SortingBucketsChoiceActivity | local done/subject exit | No | Sorting owner |
| OddOneOutActivity | local success/subject exit | No | Odd-one-out owner |
| RulePipelineActivity | local success/subject exit | No | Rule-pipeline owner |
| SetReasoningActivity | local success/subject exit | No | Set-reasoning owner |
| TransitiveChainActivity | local success/subject exit | No | Transitive owner |
| SpatialTransformActivity | local success/subject exit | No | Spatial-transform owner |
| RelativeOrderTrackActivity | local success/subject exit | No | Relative-order owner |
| CountAndSelectActivity | local success/subject exit | No | Count/select owner |
| NumberLineActivity | local success/subject exit | No | Number-line owner |
| MoreLessBalanceActivity | local success/subject exit | No | Balance owner |
| PatternCompletionActivity | shared overlay | **Yes** | Existing shared adopter |
| EqualGroupsActivity | local success/subject exit | No | Equal-groups owner |
| MakeTotalActivity | local success/subject exit | No | Make-total owner |
| TakeAwayActivity | shared overlay | **Yes** | Existing shared adopter |
| CauseEffectActivity | local success/subject exit | No | Cause/effect owner |
| ComparePropertiesActivity | local success/subject exit | No | Compare owner |
| HealthyHabitRoutineActivity | local success/subject exit | No | Healthy-habit owner |
| MaterialLabActivity | local success/subject exit | No | Material owner |
| FeatureFunctionLinkActivity | local success/subject exit | No | Feature/function owner |
| InvestigationBoardActivity | local success/subject exit | No | Investigation owner |

Exact specialized-owner summary:

```text
specialized renderers:          42
using ActivityCompletion:        3
still local/inline/special:     39
```

This is renderer ownership, not activity-count distribution. Multiple catalog
activities can route through one renderer.

---

# 5. Legacy/fallback Belajar coverage

Fallback owner:

`src/components/learning/ChildLearningPlatform.tsx::ActivityScreen`

| Legacy runtime path | Current completion presentation | Canonical shared Completion today |
| --- | --- | ---: |
| ChoiceActivity / tap choice | inline “Hebat! Aktivitas selesai.” + later subject exit | No |
| MatchingActivity | `ActivityCompletion` after all pairs | **Yes** |
| TraceActivity | inline success after finish | No |
| ColoringActivity | local finish button/state + subject exit | No |
| StoryActivity | local finish button/state + subject exit | No |
| MotionActivity | redirects to Main Gerak game route | N/A locally |

Additional fallback special case:

`src/components/learning/world/WorldExperience.tsx::MathCountActivity`

- route: `math-count-3`;
- local “Hebat!” success panel;
- local `Pilih permainan lain`;
- no shared `ActivityCompletion`.

This legacy fallback remains relevant because the current route dispatcher deliberately
uses it for activities not claimed by a specialized presentation classifier.

---

# 6. Existing Belajar Completion substrate

Owner:

- `src/components/learning/ActivityCompletion.tsx`;
- `src/components/learning/ActivityCompletion.module.css`.

Current behavior already provides a useful migration base:

- deterministic short praise;
- exactly three visual stars;
- Back;
- Try Again;
- Next;
- Share;
- full-screen dimmed overlay;
- mobile CSS adaptation;
- server-verified parent Share gate.

Important differences from the newly approved contract:

- label is currently `Try Again`, while the owner-approved visual says `Again`;
- current visual is the old design, not the newly locked visual;
- no dedicated character celebration area exists inside this component;
- generic retry falls back to `window.location.reload()`;
- current Share dialog is the old visual;
- current Share target is the public site origin;
- current provider list also includes Threads, while the approved canonical visual
  currently locks WhatsApp, Telegram, X, Facebook, Copy Link and Share Device.

Migration rule:

> Preserve proven navigation/privacy behavior where still valid, but replace the
> presentation with the owner-approved canonical component. Do not call
> `completeActivity` from the new Completion component.

---

# 7. Learning attempt/evidence boundary

`completeActivity(childId, activityId)` is the current local completion signal.

It updates progress and dispatches:

`mainlagi-learning-progress`.

`LearningAttemptBridge`, mounted at the child layout level, listens to that event
and then:

- emits the character `completion` presentation moment;
- records the learning attempt/evidence;
- applies its duplicate guard;
- syncs or queues the attempt.

Therefore canonical Completion migration is a **post-success presentation migration**.

It must not:

- call `completeActivity` a second time;
- re-dispatch progress to make the modal appear;
- create a second attempt on modal mount;
- create an attempt when Share opens/closes;
- create an attempt on orientation change.

This preserves the successful WS-13 architectural boundary.

---

# 8. Bermain / Main Gerak exact coverage

Canonical game slugs:

1. `math-choice`
2. `math-motion-battle`
3. `number-trace`
4. `shape-quest`
5. `pattern-race`
6. `math-warung`
7. `iqro-motion`
8. `airboard-presenter`
9. `dodge-motion`
10. `run-to-target`

Current final-state ownership:

| Game slug | Runtime owner | Current terminal owner | Current canonical Completion |
| --- | --- | --- | ---: |
| math-choice | MathChoiceGame | RoundEndOverlay | No |
| math-motion-battle | MathMotionGame → DigitRace | RoundEndOverlay | No |
| number-trace | NumberTraceGame | RoundEndOverlay | No |
| shape-quest | ShapeQuestGame | RoundEndOverlay | No |
| pattern-race | PatternRaceGame → DigitRace | RoundEndOverlay | No |
| math-warung | MathWarungGame | RoundEndOverlay | No |
| iqro-motion | IqroMotionGame | RoundEndOverlay | No |
| airboard-presenter | AirBoardGame | **no explicit final state** | No |
| dodge-motion | DodgeMotionGame | RoundEndOverlay | No |
| run-to-target | RunToTargetGame | RoundEndOverlay | No |

Summary:

```text
Main Gerak games:            10
using RoundEndOverlay:        9
open-ended AirBoard:          1
using approved Completion:    0
```

### 8.1 RoundEndOverlay

`RoundEndOverlay` currently centralizes:

- play-completion Gavi + Paca presentation;
- score/winner;
- optional leaderboard capture;
- replay;
- recalibration.

It does **not** currently provide:

- canonical Back;
- canonical Next;
- canonical completion-scoped Share.

This is the correct shared seam for nine game slugs, but migration must preserve
score/leaderboard/recalibration semantics as context-specific content/actions around
the canonical Completion contract.

### 8.2 AirBoard is a genuine exception

`AirBoardGame` is currently an open-ended presenter workspace.

It has:

- drawing/pointer/highlighter/eraser;
- slide/file workspace;
- undo/redo/clear/export;
- no timer;
- no `RoundEndOverlay`;
- no explicit “finished” state.

SI implementation must **not invent completion semantics silently**.

Before forcing canonical Completion onto AirBoard, a product decision is required for
what counts as completion, for example an explicit child/user `Selesai` action.

Until that decision is made, AirBoard remains a documented terminal-state exception,
not evidence that the canonical Completion requirement should be weakened for the
other nine games.

### 8.3 Bermain Back/Next context gap

`/play/[slug]` currently does not carry `childId` in its URL or `GameShell`
props.

Current shell semantics are:

- replay = remount current game with a new session key;
- calibration = return to preflight;
- exit = root route;
- no canonical next-game resolver.

Therefore `Again` has a clear existing implementation seam, but canonical
`Back`/`Next` for Main Gerak require an explicit route/context adapter during SI
implementation.

Do not fake a next-game progression rule in SI-00.

---

# 9. Current Main Gerak Share path

`GameShell` renders one generic `ShareButton` in the gameplay header.

Current behavior:

- tries Web Share API first;
- falls back to a small inline menu;
- Copy link;
- WhatsApp;
- Telegram;
- shares the current `window.location.href`;
- has no parent share-gate call;
- is available during gameplay, not only after completion.

This does not satisfy the newly approved canonical achievement Share contract.

Migration decision for SI:

- completion achievement sharing should move to the canonical Share modal;
- the existing gameplay-header Share must either be retired or explicitly retained
  for a different non-achievement purpose through a separate owner decision;
- do not leave two visually/semantically competing Share systems after migration.

---

# 10. Petualangan Uang / World coverage

Primary owner:

`src/components/learning/world-v2/MoneyWorldExperience.tsx`

## 10.1 World stage completion

`WorldStageCompletion` is currently bespoke.

It already owns:

- stage order/context;
- chapter detection;
- chapter milestone reward;
- final-stage/festival message;
- three-star completion;
- completion character presentation;
- Back;
- Again;
- Next;
- Share;
- focus placement;
- public World share URL.

The canonical shared Completion must support these World-specific context slots
without rewriting World progression/evidence.

## 10.2 World Share

World completion duplicates the parent-gated Share implementation.

Current World share target:

`/worlds/money-festival`

This is already public-safe relative to the authenticated child stage route and is a
useful semantic to preserve in the shared Share resolver.

The UI itself must be replaced by the approved canonical Share experience.

## 10.3 World character name label

`SpeechCard` currently renders a visible name beneath the character.

Confirmed owner:

`MoneyWorldExperience.tsx::SpeechCard`

Target behavior:

- remove the floating name under the character;
- if speaker identity is needed, put it inside the dialog/speaker treatment.

No World story/content rewrite is required.

---

# 11. Character presentation coverage

## 11.1 Shared owners

Canonical runtime chain:

```text
characterPresentation.ts
→ resolveCharacterPresentation(...)
→ CharacterLayer
→ caller-specific safe container
```

Current shared contexts include:

- activity;
- activity_completion;
- world map/scene/completion;
- play entry/completion.

This is a strong foundation and must be reused.

Do not create a second character asset resolver for the visual migration.

## 11.2 Belajar

`GardenActivityFrame` renders the shared `CharacterLayer` for non-workspace
activities.

Creative workspaces intentionally suppress the decorative layer.

`ActivityVisualThemeProvider` owns moment transitions:

- entry;
- guide;
- waiting;
- correct;
- retry;
- completion.

`LearningAttemptBridge` causes the completion moment after the real progress event.

Therefore Belajar's character animation/state system should be preserved; SI-02
primarily corrects geometry/safe areas and SI completion consumes the resolved
completion state.

## 11.3 Bermain

Preflight and `RoundEndOverlay` already use the shared character resolver.

The current authored completion cast is Gavi + Paca.

Do not hard-code a second completion renderer.

## 11.4 World

World already resolves canonical character assets through the shared resolver.

The problems are presentation geometry and the local name label, not lack of a
canonical asset pipeline.

---

# 12. Character clipping root-cause matrix

| Context | Current geometry risk | Audit result |
| --- | --- | --- |
| Shared CharacterLayer | root layer uses `overflow:hidden` | can amplify undersized caller containers |
| World SpeechCard | art container 190 px high; character can resolve near 195 px tall at max configured width | clipping risk confirmed structurally |
| World Completion | character band 160 px high; max configured character size can exceed band height | clipping risk confirmed structurally |
| Bermain RoundEndOverlay | result card clips overflow; character band is compact; character max height can exceed visual band | clipping risk confirmed |
| Garden activities | absolute character layer + page safe areas | needs representative portrait/landscape containment QA |
| Creative workspace | decorative layer intentionally suppressed | not a normal clipping target |

Implementation implication:

- define context-specific safe containers;
- size by full silhouette/available block size;
- scale down before clipping;
- preserve pointer-events/decorative semantics;
- do not globally remove clipping without reviewing scene containment.

---

# 13. Share ownership matrix

| Surface | Owner | Parent gate | Public-safe target | Current visual | Target |
| --- | --- | ---: | ---: | --- | --- |
| Belajar shared adopter | ActivityCompletion | Yes | origin | old completion Share dialog | canonical Share |
| World | WorldStageCompletion | Yes | `/worlds/money-festival` | duplicate World dialog | canonical Share |
| Bermain | GameShell → ShareButton | No | current `/play/[slug]` | generic inline/native share | canonical completion Share for achievement |

Parent-gate endpoint:

`src/app/api/parent/share-gate/route.ts`

It currently allows:

- authenticated parent mode;
- unconfigured local/prototype mode.

The canonical Share migration should reuse the server gate rather than moving the
gate into client-only presentation logic.

---

# 14. Orientation/state ownership audit

## 14.1 Current baseline

There is no shared production `orientationchange` state owner for child gameplay.

The product largely relies on responsive CSS.

This is desirable insofar as device rotation does not inherently replace route
components.

Do not introduce code like:

```text
key={orientation}
```

on activity/game/world runtime roots.

That would directly violate the owner-approved “rotation changes layout only” rule.

## 14.2 Stable state owners to preserve

### Belajar

- activity component local React state;
- `ActivityVisualThemeProvider` character moment state;
- `LearningAttemptBridge` attempt statistics/evidence;
- progress in learning system/local persistence.

### Bermain

- `GameShell`:
  - `phase`;
  - `sessionKey`;
  - player count;
  - input mode;
  - session mode;
  - player levels.
- individual game module state;
- round timer deadlines/state;
- camera/vision runtime.

Rotation must not increment `sessionKey` or call replay/preflight.

### World

- current stage runtime;
- current story segment;
- local mechanic state;
- completion state;
- open Share dialog;
- World progress/evidence.

## 14.3 High-risk orientation families

Must receive explicit SI-01/SI-11 QA:

1. guided trace;
2. creative drawing canvas;
3. coloring/touch workspaces;
4. camera/motion overlays;
5. AirBoard coordinate surface;
6. Completion overlay;
7. Share modal;
8. World story/dialog;
9. character safe containers.

The repository already contains a physical-device QA harness with orientation,
trace-rotation and camera-orientation checks. Extend/reuse that acceptance direction;
do not create a conflicting QA system.

---

# 15. Exact migration seams

## 15.1 Fix once at shared owners

High-leverage seams:

1. **Canonical Completion component**
   - one owner consumed by Belajar, World and Bermain adapters.

2. **Canonical Share modal/resolver**
   - one visual component;
   - one parent-gate client path;
   - context-specific public share payload resolver.

3. **Character safe-area primitives**
   - shared geometry contract around `CharacterLayer`;
   - caller-specific layout slots.

4. **Bermain RoundEndOverlay adapter**
   - one migration can cover nine game slugs.

5. **LearningAttemptBridge boundary**
   - keep untouched as attempt/evidence owner;
   - canonical Completion stays presentation-only.

## 15.2 True exceptions/adapters

Do not flatten these into generic behavior:

- AirBoard terminal-state semantics;
- World chapter milestone content;
- World final festival completion;
- Bermain score/winner/leaderboard content;
- Bermain calibration action;
- creative workspace behavior;
- trace/canvas coordinate handling;
- route-specific legitimate replay reset functions.

---

# 16. Recommended SI implementation batches derived from this audit

This replaces an arbitrary “edit every route” approach.

## SI-01 — orientation substrate

No completion migration.

Deliver:

- stable portrait/landscape composition signal or CSS/container contract;
- no orientation-keyed remount;
- state-preservation browser tests.

## SI-02 — character geometry

Deliver shared safe-area rules first.

Representative QA:

- one Belajar activity;
- World SpeechCard;
- World completion;
- Bermain RoundEndOverlay.

Also remove the confirmed World story name-under-character label.

## SI-03 — canonical Completion component

Build the approved component independent of broad route migration.

Required adapters/slots should cover:

- generic Belajar completion;
- World context/chapter/finale metadata;
- Bermain score/winner/leaderboard context.

Do not yet migrate all routes.

## SI-04 — canonical Share

Centralize:

- parent gate;
- public-safe payload resolver;
- provider actions;
- Copy Link / Share Device;
- context-safe public URL.

Keep the visual exactly within the owner-approved Share contract.

## SI-05 — Belajar pilot

Use one currently inline specialized renderer, not one of the already-adopted
three, so the pilot proves real migration.

Recommended pilot class:

- a normal finite assessed choice/board renderer with an explicit local success state.

Exit:

- existing `completeActivity` call unchanged;
- local success exit replaced by canonical Completion;
- no duplicate attempt/evidence;
- portrait/landscape green.

## SI-06A — legacy/fallback Belajar owner

Migrate the fallback `ChildLearningPlatform.ActivityScreen` paths as one bounded
owner:

- choice;
- matching (normalize existing shared usage);
- trace;
- coloring;
- story.

Keep motion redirect separate.

Also migrate the fallback special `MathCountActivity` if it remains reachable.

## SI-06B — literacy/audio specialized renderers

Suggested bounded set:

- AudioChoiceLearningActivity;
- SymbolHuntChoiceActivity;
- SyllableAssemblyActivity;
- InitialSoundActivity;
- PhraseSceneMatchActivity;
- PictureWordMatchActivity;
- SentenceOrderCardsActivity;
- ReadingPassageQuestionActivity;
- ClozeSentenceChoiceActivity.

If preflight shows this is too large, split before mutation into audio/symbol and
sentence/reading batches.

## SI-06C — matching/order/drag specialized renderers

- MemoryMatchActivity — normalize to the new canonical component;
- DragTargetMatchActivity;
- SequenceSlotChoiceActivity;
- SortingBucketsChoiceActivity;
- GrowthStageTransitionActivity.

## SI-06D — Math specialized renderers

- MathTraceWorldActivity;
- CountAndSelectActivity;
- NumberLineActivity;
- MoreLessBalanceActivity;
- EqualGroupsActivity;
- MakeTotalActivity;
- TakeAwayActivity — normalize existing shared usage;
- ComparePropertiesActivity where Math data resolves through it;
- VisualWordProblemActivity;
- SpatialRelationBoardActivity where Math data resolves through it.

Split by actual ownership if preflight identifies incompatible replay/reset behavior.

## SI-06E — Logic specialized renderers

- OddOneOutActivity;
- RulePipelineActivity;
- SetReasoningActivity;
- TransitiveChainActivity;
- SpatialTransformActivity;
- RelativeOrderTrackActivity;
- EliminationBoardActivity;
- ShapeAttributeBoardActivity;
- PatternCompletionActivity — normalize existing shared usage;
- SingleRuleApplyActivity where Logic data resolves through it.

## SI-06F — Science specialized renderers

- CauseEffectActivity;
- PhenomenonRelationBoardActivity;
- HealthyHabitRoutineActivity;
- MaterialLabActivity;
- FeatureFunctionLinkActivity;
- InvestigationBoardActivity;
- ComparePropertiesActivity where Science data resolves through it;
- GrowthStageTransitionActivity where Science data resolves through it.

Components used by more than one subject are migrated **once** at the shared renderer,
not copied per subject.

## SI-06G — Creative workspace

- CreativePracticeActivity;
- any remaining coloring/drawing fallback route.

Preserve drawing/coloring workspace state and canvas behavior.

Completion must overlay/resolve cleanly without destroying the child's completed
artwork state before navigation.

## SI-07 / SI-08 / SI-09 — Bermain QA batches

Implementation can centralize at `RoundEndOverlay`, but acceptance remains split into
small game batches:

- SI-07: games 1–3;
- SI-08: games 4–6;
- SI-09: games 7–10.

AirBoard must be explicitly handled according to the terminal-state decision before
SI-09 can claim 10/10 canonical completion coverage.

## SI-10 — World adapter

Migrate:

- WorldStageCompletion;
- World Share;
- SpeechCard character label;
- character safe geometry.

Preserve:

- eight-stage order;
- chapter/finale content;
- World evidence;
- stage progression;
- story content;
- canonical Gavi/Paca cast.

No Journey Map redesign in SI-10.

## SI-11 — integrated closure

Must prove:

- every finite playable Belajar runtime reaches canonical Completion;
- all Main Gerak games with a defined terminal state reach canonical Completion;
- AirBoard's approved terminal policy is documented/tested;
- World stage/finale completion is canonical;
- one Share system;
- no character label underneath;
- no clipping in representative contexts;
- rotation never resets state;
- no duplicate attempt/evidence;
- full CI + production smoke.

---

# 17. Blockers / decisions discovered by SI-00

These are implementation decisions, not Shop blockers.

## Decision D1 — AirBoard completion semantics

Required before claiming “all 10 Bermain games” use canonical Completion.

Question:

> What user action/state means an open-ended AirBoard presenter session is finished?

Do not infer this from the timer-based games.

## Decision D2 — Bermain Back/Next semantics

Required because `/play/[slug]` does not currently carry child context or next-game
progression.

Need a deliberate adapter rule for:

- Back;
- Next;
- return to Bermain catalog;
- optional next recommended game.

Again/replay already has a stable owner.

## Decision D3 — gameplay-header Share

Decide whether the existing `GameShell` Share button is:

- removed after canonical achievement Share lands; or
- retained only for a separately defined non-achievement sharing purpose.

Do not leave it as an accidental second Share system.

No other blocking product decision was found for SI-00.

---

# 18. Files that future SI work must treat as primary ownership points

### Completion / Share

- `src/components/learning/ActivityCompletion.tsx`
- `src/components/learning/ActivityCompletion.module.css`
- `src/components/learning/world-v2/MoneyWorldExperience.tsx`
- `src/components/learning/world-v2/MoneyWorldExperience.module.css`
- `src/games/shared.tsx`
- `src/components/GameShell.tsx`
- `src/components/ShareButton.tsx`
- `src/app/api/parent/share-gate/route.ts`

### Belajar dispatch / completion signal

- `src/app/child/[childId]/activity/[activity]/page.tsx`
- `src/components/learning/ChildLearningPlatform.tsx`
- specialized activity components listed in section 4;
- `src/lib/learning/system.ts`
- `src/components/learning/LearningAttemptBridge.tsx`

### Character presentation

- `src/lib/learning/characterPresentation.ts`
- `src/lib/learning/characterPresentationFeedback.ts`
- `src/components/learning/ActivityVisualThemeProvider.tsx`
- `src/components/learning/GardenActivityFrame.tsx`
- `src/components/learning/CharacterLayer.tsx`
- `src/components/learning/CharacterLayer.module.css`

### Orientation-sensitive QA/runtime

- `src/components/DeviceQaHarness.tsx`
- trace/canvas/creative runtime components;
- `src/components/GameShell.tsx`;
- `src/games/*`;
- World stage runtime.

---

# 19. What SI-00 did not change

SI-00 made no runtime change to:

- Shop;
- PR #360;
- child navigation;
- Completion UI;
- Share UI;
- character CSS;
- World runtime;
- Bermain runtime;
- learning activity routes;
- progression;
- evidence/mastery;
- database schema;
- Motion Engine;
- assets.

The only repository output of SI-00 is this audit document on its dedicated audit
branch.

---

# 20. SI-00 exit status

```text
coverage ownership:                COMPLETE
42 specialized Belajar renderers:  audited
existing specialized shared use:   3
specialized local owners:          39
legacy/fallback owner:              audited
Main Gerak games:                  10
RoundEndOverlay coverage:           9
AirBoard exception:                 confirmed
World bespoke completion/share:     confirmed
Share implementation owners:        3
World visible name-label source:     confirmed
character clipping root causes:      confirmed
orientation state owners:            mapped
implementation code:                NOT STARTED
Shop branch/runtime touched:         NO
```

**SI-00 is complete.**

Next normal implementation session remains **SI-01 — orientation-preserving layout
substrate**, but it should start only when the project execution sequence authorizes
Shared Interaction implementation.
