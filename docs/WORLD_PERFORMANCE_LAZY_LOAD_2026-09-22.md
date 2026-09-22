# Mainlagi World — Performance / Lazy-Load Pass — 22 September 2026

Status: **IMPLEMENTED AS WORLD-SPECIFIC QA CONTRACT / CI VALIDATION PENDING**

Branch:

```text
feature/world-petualangan-uang-production-wave-20260922
```

This pass keeps the current Petualangan Uang runtime architecture and adds explicit visual-asset budgets plus route-scoped loading QA. No shared Belajar component is changed merely to chase synthetic performance work.

## 1. Current approved visual footprint

Measured repository asset sizes at this wave:

```text
garden-gavi.webp                      ~43 KiB
garden-paca.webp                      ~40 KiB
garden-background.webp                ~59 KiB
math-warung.webp                      ~61 KiB
playground-park-wide.webp             ~48 KiB
playground-park-mobile.webp           ~45 KiB
mini-market-wide.webp                 ~54 KiB
mini-market-mobile.webp               ~54 KiB
number-park-wide.webp                 ~49 KiB
number-park-mobile.webp               ~54 KiB
garden-wordmark.webp                  ~28 KiB
```

Approved reused World visual library, excluding the Stage-shell wordmark:

```text
~509 KiB
```

## 2. Static performance budgets

World QA now fails closed if:

```text
single approved reused visual > 80 KiB
approved reused visual library > 600 KiB
Stage-shell wordmark > 40 KiB
map core artwork > 230 KiB
single Stage shell artwork set > 190 KiB
```

Current map core artwork is approximately 204 KiB:

```text
math-warung
garden-background
garden-gavi
garden-paca
```

Worst current Stage shell artwork set is approximately 173 KiB:

```text
largest current Stage background
+ garden-wordmark
+ Gavi
+ Paca
```

These are repository-byte budgets, not claims about compressed transfer cache behavior.

## 3. Lazy background boundary

The runtime already resolves only the active Stage through:

```text
getMoneyWorldPilotStage(stageId)
```

Stage background paths remain data-driven. CSS must not reintroduce a hardcoded list of all Stage backgrounds.

New browser QA checks the actual network boundary.

### World map

At narrow map routes:

```text
320px
430px
```

the map may load its map/hero/mascot artwork, but must not eagerly request any:

```text
/artwork/backgrounds/math/*
```

Stage-specific background.

### Stage 1 mobile

At the 390px Stage-1 route:

```text
playground-park-mobile.webp -> requested
playground-park-wide.webp   -> not requested
mini-market-*               -> not requested
number-park-*               -> not requested
```

This verifies that the active mobile Stage does not preload unrelated Stage art.

## 4. Why no shared CharacterAvatar rewrite

The approved Gavi/Paca files are already small, and `CharacterAvatar` is shared across Belajar/parent surfaces.

This pass intentionally does not rewrite the shared component to Next Image or add global lazy-loading behavior without evidence that such a change is needed.

World isolation remains more important than speculative cross-product optimization.

## 5. Existing protections retained

The pass keeps:

- mobile 320/390/430 browser matrix;
- production build budget audit already present in CI;
- reduced-motion support;
- current responsive crop rules;
- data-driven Stage backgrounds;
- approved reused asset manifest;
- no camera/motion dependency.

## 6. Boundaries

This wave does not:

- alter story/content;
- change World progression;
- generate narration;
- resume final character production;
- modify Belajar;
- modify Bermain/motion;
- change SQL/evidence/mastery contracts.

## 7. Next

After the content, accessibility, and performance heads are independently green, freeze the latest immutable World production checkpoint.

Remaining non-audio work should then be limited to verified defects or explicitly authorized art/character/evidence work rather than speculative architecture churn.
