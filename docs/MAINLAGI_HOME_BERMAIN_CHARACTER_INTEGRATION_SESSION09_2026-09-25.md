# Mainlagi Home + Bermain Character Integration — Session 09 Closure — 25 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
implementation branch: agent/home-bermain-character-session09-20260925
PR: #340
final PR head after main sync: 80e2a7211e6ebe1791370a87790b4c2ff20a621a
final PR CI: #1673 / run 36131389534 — full success
merged main: 227a77799cd73fecc8e58960ef8758c2e323bc30
merged-main CI: #1674 / run 36132350678 — full success
Production smoke (Cloudflare): success
```

Session 09 completes the product-surface character integration planned after Belajar Sessions 06–07 and World Session 08.

## Home result

The active child Home remains `Batch14WorldHome`, but its presentation is now one coherent Mainlagi product surface.

Home now presents exactly three primary domains:

```text
Belajar
World
Bermain
```

The existing Belajar adaptive recommendation stays intact. The World card reads the existing Money World progress state and preserves the current Petualangan Uang age gate. The Bermain card enters the existing child games catalog.

The Home hero now renders the approved five-character SVG ensemble through the shared runtime in canonical order:

```text
Naya
Gian
Paca
Zia
Gavi
```

This is not a second character renderer. `CharacterLayer` gained an explicit `ensemble` variant, while ordinary foreground presentation remains capped at two characters.

## Bermain result

Bermain now uses the same approved shared character system for presentation-only entry and completion moments:

```text
catalog entry      -> Gavi + Paca / welcome
game preflight     -> Gavi + Paca / welcome
round completion   -> Gavi + Paca / celebrate
```

The preflight characters are shown only while camera status is idle. Once camera permission/model/calibration starts, the character layer disappears so it cannot cover the child, face, hands, body or calibration UI.

Completion is integrated centrally through the shared `RoundEndOverlay`, so individual game mechanic modules were not modified.

## Shared presentation/runtime changes

New presentation contexts:

```text
play_entry
play_completion
```

Shared resolver behavior remains bounded:

```text
resolveCharacterPresentation(...) -> max 2 characters
resolveCharacterEnsemble(...)     -> max 5 characters, used for Home ensemble only
```

All activated Session 09 character assets resolve through the already-approved state-aware SVG bank. Session 09 added no new character binary and made no new provenance or rights decision.

## World progress reuse

The existing Money World local/cloud progress reconciliation logic was extracted into:

```text
src/components/learning/world-v2/useMoneyWorldProgress.ts
```

This allows Home to read World journey status without creating a second progress system.

The extraction preserved existing World writes, cloud synchronization and progress semantics. It does not connect World completion to Belajar mastery.

## Hard boundaries preserved

Session 09 did **not** change:

- any of the 10 game mechanic modules;
- Motion Engine architecture;
- gesture/body/hand tracking semantics;
- game scoring rules;
- 900 Belajar activity identities;
- 47 active gameplay patterns;
- correct-answer logic;
- Belajar mastery/progression/readiness;
- World Chapter/Stage/Scene/Segment structure;
- World evidence mapping or activation semantics;
- World reward/mastery boundaries;
- character provenance/approval;
- fixed narration activation;
- semantic illustration runtime activation.

Mandatory separation still holds:

```text
World progress / completion
!=
Belajar mastery / completion

Bermain score / round completion
!=
Belajar mastery / completion
```

## Permanent regression contract

Session 09 added:

```bash
npm run test:ui:home-bermain-character
```

and included it in:

```bash
npm run test:ui:mobile-routes
```

Representative browser coverage verifies at 390×844 and 1280×900:

- Home five-character canonical ensemble;
- exactly three Home product domains;
- age-5 demo profile remains gated from the 6–8 Petualangan Uang pilot;
- all nine Belajar subject entries remain available;
- all 10 Bermain game entries remain available;
- Gavi + Paca `welcome` on Bermain catalog/preflight;
- preflight camera start control remains present;
- shared completion source contract uses `play_completion` + `celebrate`;
- active camera calibration does not retain the decorative entry character layer;
- no horizontal overflow;
- no page errors;
- no console errors.

Character-runtime regression additionally locks:

- the new `play_entry` / `play_completion` contexts;
- the canonical five-character Home ensemble order;
- ordinary shared presentation max-2 behavior;
- explicit Home ensemble max-5 behavior;
- approved SVG-state source use.

## CI truth

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

## Current sequence checkpoint

```text
Sessions 01–09: COMPLETE
next authorized session: Session 10 — migrate semantic/activity illustration registry to SVG-aware production
```

Session 10 must start from latest merged `main`. It must not activate semantic illustrations in runtime yet; the Session 10 boundary is registry/provenance/validator support for direct SVG production paths while `vehicle.car`, `object.towel`, and `object.raincoat` remain held.
