# Mainlagi Home + Bermain Character Integration — Session 09 Closure — 25 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
base main before Session 09 runtime: ec894e302eac6d7bb80ab3169319611c9524514d
latest synchronized base before final PR CI: 427026237ab252e3f5e101437bf5664ee84fa235
implementation branch: agent/home-bermain-character-session09-20260925
PR: #340
final PR head: 80e2a7211e6ebe1791370a87790b4c2ff20a621a
final PR CI: #1673 / run 36131389534 — full success
merged main: 227a77799cd73fecc8e58960ef8758c2e323bc30
merged-main CI: #1674 / run 36132350678 — full success
Production smoke (Cloudflare): success
```

Session 09 closes the shared-character product-surface migration across Mainlagi Home and Bermain while preserving the existing Belajar, World, Motion Engine, evidence, mastery and asset-approval boundaries.

## Home result

The active child Home surface now presents Mainlagi as one product with three first-class domains:

```text
Belajar
World
Bermain
```

Home behavior:

- uses the shared approved SVG character runtime;
- renders the canonical five-character ensemble in this order: Naya / Gian / Paca / Zia / Gavi;
- uses the explicit `CharacterLayer variant="ensemble"` path rather than a second character renderer;
- keeps ordinary CharacterLayer surfaces capped at two characters;
- preserves the existing adaptive Belajar recommendation;
- reads existing Money World progress to label the World card without converting World progress into Belajar mastery;
- preserves the current Petualangan Uang pilot age gate;
- routes Bermain through the existing child games catalog.

The Money World local/cloud reconciliation logic was extracted into a shared hook so Home can read the same progress source-of-truth. The World write path and persistence semantics remain unchanged.

## Bermain result

The existing authored Bermain character cast is:

```text
Gavi + Paca
```

Shared presentation states:

```text
Bermain catalog entry  -> welcome
game preflight entry    -> welcome
round completion        -> celebrate
```

The preflight character layer is intentionally visible only while camera status is `idle`. Once camera permission/model/calibration begins, the character layer disappears so it cannot obscure body/hand/face tracking.

All ten existing games remain in place. Session 09 does not modify individual game mechanic modules.

Shared completion is integrated at the existing `RoundEndOverlay` level, so the result/completion character presentation is centralized rather than duplicated per game.

## Shared runtime changes

`characterPresentation.ts` now includes:

```text
play_entry
play_completion
```

and exposes an explicit five-character ensemble resolver for Home.

The runtime contract remains:

```text
ordinary presentation -> max 2 characters
Home ensemble         -> max 5 characters
```

All character assets still resolve only through the existing approved SVG asset registry/runtime. No new character identity, state, source, binary, provenance decision or redistribution approval was created in Session 09.

## Hard boundaries preserved

Session 09 did not change:

- the 900-activity Belajar baseline;
- the 47 active gameplay-pattern baseline;
- canonical Belajar correctness, evidence, mastery, readiness or certificate semantics;
- World IDs/content or 2 Chapters / 8 Stages / 44 Scenes / 89 Segments;
- `child_world_progress` semantics;
- World supplemental-evidence activation;
- Motion Engine architecture;
- any individual game rule/mechanic;
- character provenance/approval;
- narration activation;
- semantic learning-illustration runtime activation;
- global supported age range.

Mandatory product invariant remains:

```text
World completion / World stars / narrative progress
!=
Belajar activity completion / mastery / readiness / certificate
```

## Regression contract

New permanent browser command:

```bash
npm run test:ui:home-bermain-character
```

It is included in:

```bash
npm run test:ui:mobile-routes
```

Representative browser coverage uses:

```text
390 x 844
1280 x 900
```

and verifies:

- exact five-character Home ensemble order;
- approved `hero` SVG state on Home;
- exactly three Home domains in order: Belajar / World / Bermain;
- demo age-gate behavior for Petualangan Uang;
- all nine Belajar subject entries remain reachable;
- all ten Bermain game entries remain present;
- Gavi + Paca `welcome` on Bermain catalog;
- Gavi + Paca `welcome` on preflight entry;
- preflight camera-safe character boundary;
- shared completion uses `play_completion` + `celebrate`;
- SVG decode / intrinsic dimensions;
- pointer transparency;
- no horizontal overflow;
- no page or console errors.

Shared runtime tests additionally lock:

- `play_entry`;
- `play_completion`;
- ordinary max-2 behavior;
- explicit max-5 Home ensemble;
- canonical five-character Home order.

## Release verification

Final PR head `80e2a7211e6ebe1791370a87790b4c2ff20a621a` passed CI #1673 / run `36131389534`:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
```

Merged main `227a77799cd73fecc8e58960ef8758c2e323bc30` passed CI #1674 / run `36132350678` with the same full gate set plus:

```text
Production smoke (Cloudflare)  success
```

Therefore Session 09 is **merged, deployed, regression-locked and live verified**.

## Next authorized session

```text
Session 10 -> migrate semantic/activity illustration registry to SVG-aware production
```

Session 10 starts a separate semantic-illustration workstream. It must not reopen Sessions 01–09 character/runtime behavior as a side effect.

Session 10 may update the semantic illustration provenance/validator/registry contract for direct SVG production, while the three held keys remain fail-closed:

```text
vehicle.car
object.towel
object.raincoat
```

It must not activate semantic illustrations into child runtime yet; runtime activation remains later in the locked session sequence.
