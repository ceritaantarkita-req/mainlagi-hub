# Mainlagi Belajar Character Integration — Session 06 Closure

Date: **25 September 2026**  
Status: **SESSION 06 COMPLETE / BELAJAR MIGRATED TO SHARED SVG CHARACTER RUNTIME / RESPONSIVE POLISH DEFERRED TO SESSION 07**  
Base main: `6d97a99f1e276509e7ec5c9c012858c425ea1697`

## Scope

Session 06 deliberately migrates Mainlagi **Belajar** from the historical Gavi/Paca compatibility path to the shared state-aware SVG character runtime created in Sessions 01–05.

The integration is centralized. It does **not** add character paths or pose decisions activity-by-activity.

Primary integration points:

```text
src/lib/learning/activityVisualTheme.ts
src/lib/learning/characterPresentation.ts
src/lib/learning/characterPresentationFeedback.ts
src/components/learning/ActivityVisualThemeProvider.tsx
src/components/learning/LearningAttemptBridge.tsx
src/components/learning/GardenActivityFrame.tsx
src/components/learning/CharacterLayer.tsx
```

## Belajar subject pair activation

The shared resolver is now the Belajar source of truth:

```text
Bahasa          Gavi + Paca
English         Naya + Zia
Math            Gian + Paca
Iqro            Gavi + Paca
Huruf           Gavi + Paca
Logic           Gavi + Paca
Science         Gavi + Paca
Color           Gavi + Paca
Drawing         Gavi + Paca
```

Coloring and Drawing continue to suppress the decorative foreground layer while the creative workspace is active.

Every normal Belajar activity visual theme now resolves through the approved SVG state bank under:

```text
/artwork/characters/<id>-<state>-v1.svg
```

The old `approvedCharacterRuntimeSrc()` compatibility API remains available for legacy callers, but `activityVisualTheme.ts` no longer depends on it.

## Belajar character moments

Canonical presentation-only mapping:

```text
entry       -> welcome
guide       -> pointing
waiting     -> hero
correct     -> correct
retry       -> try_again
completion  -> celebrate
```

`entry`, `guide`, `correct`, and `retry` are presentation moments only. They do not create or mutate learning evidence.

## Feedback bridge

`LearningAttemptBridge` already owns the existing DOM/runtime interaction inference used by learning-attempt measurement. Session 06 reuses that existing centralized knowledge to publish a separate presentation event:

```text
mainlagi-learning-character-presentation
```

The presentation event contains only:

```text
childId
activityId
moment
```

It contains no answer key, mastery score, evidence weight, reward, or progression instruction.

Current bridge signals:

- canonical correct choice -> `correct`;
- canonical wrong/retry choice -> `retry`;
- matching pair success -> `correct`;
- matching mismatch -> `retry`;
- trace reset -> `retry`;
- canonical activity completion event -> `completion`.

The character resolver itself never reads `correctChoice`.

## Activity presentation state machine

`ActivityVisualThemeProvider` now owns the transient Belajar character moment.

Behavior:

```text
activity entry
  -> welcome
  -> hero/waiting

Dengar / guide
  -> pointing
  -> hero/waiting

wrong / retry
  -> try_again
  -> hero/waiting

correct
  -> correct

activity completion
  -> celebrate

When a canonical correct interaction completes the activity in the same event turn, the provider preserves the `correct` pose for a bounded **550 ms presentation-only handoff** before switching to `celebrate`. Learning completion/progress/evidence is not delayed.
```

Events are filtered by exact `childId + activityId`, preventing another child/activity event from changing the current character presentation.

## Shared rendering

`GardenActivityFrame` now renders foreground characters only through:

```text
CharacterLayer
```

The frame no longer owns a second direct `runtimeCharacters.map(...<img>)` implementation.

Stable QA state is exposed at the frame/layer boundary:

```text
data-character-source
data-character-moment
data-character-state
data-character-left
data-character-right
data-character-id
data-character-side
data-character-role
data-character-asset-source
```

The old Garden frame character-positioning CSS was removed so there is one shared foreground renderer.

## Regression coverage

### Catalog / resolver

`npm run test:learning:visual-theme` now requires all **900/900** canonical Belajar activities to resolve:

- the correct subject pair;
- two distinct character slots;
- approved SVG state-bank paths;
- `hero` as neutral route-level activity state;
- `svg-state` as the asset source.

Representative explicit locks:

```text
English -> Naya + Zia
Math    -> Gian + Paca
```

### Runtime state machine

`npm run test:learning:character-runtime` now also locks:

- Belajar moment -> semantic state mapping;
- presentation-event bridge wiring;
- exact child/activity filtering;
- entry -> waiting transition;
- transient guide/correct/retry behavior;
- Dengar -> guide/pointing;
- creative workspace suppression;
- shared CharacterLayer rendering;
- no Belajar dependency on `approvedCharacterRuntimeSrc()`.

### Browser integration

New command:

```bash
npm run test:ui:character-belajar
```

It is included in:

```bash
npm run test:ui:mobile-routes
```

Representative 390px / reduced-motion flows:

```text
english-letter-a
  hero:       Naya + Zia
  Dengar:     Naya + Zia pointing
  wrong:      Naya + Zia try_again
  correct:    Naya + Zia correct
  completion: Naya + Zia celebrate

math-count-3
  hero:       Gian + Paca
  wrong:      Gian + Paca try_again
  correct:    Gian + Paca correct
  completion: Gian + Paca celebrate
```

Full multi-viewport visual/layout refinement remains Session 07.

## Hard boundaries preserved

Session 06 does **not**:

- change any activity ID;
- change prompts, choices or correct answers;
- change the 900-activity count;
- change the 47-pattern baseline or invent Pattern #48;
- change mastery thresholds;
- change attempt/evidence schema;
- change progression/readiness;
- change rewards/certificates;
- change World character rendering;
- change Home character composition;
- change Bermain/Motion Engine;
- delete legacy Gavi/Paca WebP fallbacks.

## Next allowed session

Only **Session 07 — Belajar character responsive QA + fixes**, after this Session 06 PR is merged and CI is green.

Session 07 owns the full 320 / 390 / 430 / 768 / 1280 layout inspection and any presentation-only containment/positioning fixes. It must not change learning semantics.
