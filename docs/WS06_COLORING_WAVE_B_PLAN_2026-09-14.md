# WS-06 Coloring Wave B Plan — 14 September 2026

Baseline: `main` @ `4049449b5678f7f769f986750380a71b30536928` after PR #95.

Goal: resolve the remaining 20 medium `Q108_DUPLICATE_COLORING_GEOMETRY` findings (10 exact-geometry pairs) without changing creative-practice semantics, activity IDs, progression, mastery, schema, or catalog size.

Remaining pairs:

1. `color-gavi` / `color-parts-cat`
2. `color-object-umbrella` / `color-contrast-umbrella`
3. `color-object-house` / `color-limited-two-house`
4. `color-palette-car` / `color-transport-car`
5. `color-palette-kite` / `color-contrast-kite`
6. `color-nature-sun` / `color-warm-sun`
7. `color-cool-ocean` / `color-scene-pond`
8. `color-pattern-dots` / `color-pattern-circles`
9. `color-fantasy-monster` / `color-character-creature`
10. `color-mood-cozy` / `color-capstone-dream-room`

Strategy: keep one established composition in each pair and author a context-specific presentation override for the other member. Validate all 100 SVG scenes, require zero exact geometry duplicates, regenerate gallery previews from the same runtime geometry, visually review changed previews, and run the full CI matrix before merge.

Expected deterministic audit after Wave B:

```text
KEEP       825
POLISH      75
REDESIGN     0
REPLACE      0
Q108         0
structural   0
```

The remaining 75 POLISH findings should then be only `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`, handed to WS-07/WS-08.
