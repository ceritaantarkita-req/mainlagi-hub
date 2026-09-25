# Mainlagi World Character Integration — Session 08 Closure — 25 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
base main: 4ffe7bbcc6875bd1e38eae20148c16c95e36512d
implementation branch: agent/world-character-integration-session08-20260925
PR: #337
final PR head: 6a728c36f7bc0a1a34c46e2511062df5e2b9af9d
final PR CI: #1663 / run 36120579884 — full success
merged main: e2e5e4b676ce45313786420708de41731ec2e3cb
merged-main CI: #1664 / run 36121741946 — full success
Production smoke (Cloudflare): success
```

Session 08 is the deliberate Mainlagi World presentation migration onto the shared approved SVG character runtime created in Sessions 01–05 and already used by Belajar through Sessions 06–07.

## Runtime result

Petualangan Uang keeps its existing authored cast:

```text
money-festival -> Gavi + Paca
```

World character presentation now resolves through:

```text
src/lib/learning/characterPresentation.ts
src/components/learning/CharacterLayer.tsx
```

instead of the historical World-local `CharacterAvatar` rendering path.

Activated presentation mapping:

```text
World catalog / entry       -> welcome
World journey map           -> pointing
neutral story / payoff      -> hero
concept / challenge         -> thinking
correct challenge feedback  -> correct
retry / wrong feedback      -> try_again
Stage completion            -> celebrate
final World completion      -> celebrate
```

Story-role compatibility remains explicit:

```text
Gian -> Gavi
Naya -> Paca
```

This preserves the existing Petualangan Uang authored story copy/role model while the visual runtime uses the approved Gavi/Paca character identities.

## Files changed by the implementation

```text
package.json
scripts/run-mobile-route-browser-tests.mjs
scripts/run-world-character-session08-tests.mjs
scripts/run-world-money-tests.mjs
src/components/learning/world-v2/MoneyWorldExperience.module.css
src/components/learning/world-v2/MoneyWorldExperience.tsx
src/lib/learning/world/moneyWorldAssets.ts
```

No new character binary was added or approved in Session 08.

## Presentation behavior

The World runtime now:

- uses `resolveCharacterPresentation()` for catalog, map, scene and completion contexts;
- renders shared `CharacterLayer` instances instead of legacy `CharacterAvatar`;
- maps generic World mechanic correct/retry outcomes to presentation-only `correct` / `try_again` states;
- uses `thinking` during activity/narrative-choice/recap challenge contexts;
- uses single-speaker shared character portraits for story/concept scenes;
- uses shared Gavi + Paca pair presentation for challenge companions and completion;
- keeps character imagery decorative, `aria-hidden`, and pointer-transparent;
- moves challenge companion characters into normal flow on mobile/tablet instead of allowing them to cover controls;
- switches the completed World map to `celebrate`.

Character state changes are presentation-only. They do not produce or mutate learning evidence.

## Asset/provenance boundary

Session 08 initially surfaced a risk that changing World presentation could be mistaken for closing older World asset-plan production gaps.

The final implementation deliberately preserves those boundaries:

- all character SVGs used by World were already production-approved before Session 08;
- Session 08 performs no new provenance decision;
- Session 08 performs no new rights/redistribution decision;
- existing historical Naya/Gian World asset-plan gaps remain explicit;
- fixed World narration remains an independent unresolved production gap;
- the presentation runtime mode does not silently upgrade unrelated World asset slots.

This keeps presentation migration separate from asset lifecycle truth.

## World invariants preserved

Exact canonical Petualangan Uang structure remains:

```text
World ID: money-festival
Chapters: 2
Stages: 8
Scenes: 44
Segments: 89
```

Session 08 did not change:

- World IDs or authored content;
- Chapter/Stage/Scene/Segment identity;
- `child_world_progress` persistence semantics;
- World unlock/progress semantics;
- World supplemental-evidence activation or server mapping;
- canonical Belajar attempts;
- Belajar mastery/progression/readiness;
- stars/rewards/certificates semantics;
- the 900-activity baseline;
- the 47-pattern baseline;
- character provenance/approval;
- narration activation;
- Home product presentation;
- Bermain/Motion Engine.

Mandatory invariant remains:

```text
World completion / World stars / narrative progress
!=
Belajar activity completion / mastery / readiness / certificate
```

## Regression contract

New permanent browser command:

```bash
npm run test:ui:world-character
```

It is included in:

```bash
npm run test:ui:mobile-routes
```

Representative browser coverage:

```text
viewports:
  390 x 844
  1280 x 900

flow:
  World catalog
  -> World map
  -> Stage 1 story
  -> concept
  -> challenge
  -> retry
  -> correct
  -> Stage completion
```

The regression verifies:

- Gavi + Paca exact shared cast;
- `welcome`;
- `pointing`;
- single-speaker `hero`;
- single-speaker `thinking`;
- pair `thinking`;
- `try_again`;
- `correct`;
- `celebrate`;
- approved `svg-state` source;
- exact semantic SVG path;
- successful image decode;
- non-zero intrinsic SVG dimensions;
- pointer transparency;
- no horizontal overflow;
- mobile/tablet challenge companion containment;
- zero page errors;
- zero console errors.

During implementation the browser regression exposed a state-swap timing race: after `thinking -> try_again`, a test could inspect `naturalWidth` before the new SVG finished decoding. The final regression waits for `HTMLImageElement.decode()`, so it still fails on a genuinely broken SVG while avoiding a false failure during a valid state transition.

## Final CI truth

Final PR head `6a728c36f7bc0a1a34c46e2511062df5e2b9af9d` passed CI #1663 / run `36120579884`:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
```

Merged main `e2e5e4b676ce45313786420708de41731ec2e3cb` passed CI #1664 / run `36121741946` with the same full gate set plus:

```text
Production smoke (Cloudflare)  success
```

Therefore Session 08 is **merged, deployed, regression-locked and live verified**.

## Next authorized session

```text
Session 09 -> Home + Bermain shell character integration
```

Session 09 must start from merged latest `main`.

It may integrate the shared character presentation system into Mainlagi Home and Bermain entry/result/completion surfaces, but it must not redesign the Motion Engine, merge World progression into Belajar mastery, change character provenance, activate narration, or start semantic-SVG Sessions 10–16 inside the same session.
