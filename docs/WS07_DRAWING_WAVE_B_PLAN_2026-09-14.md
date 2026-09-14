# WS-07 Drawing Wave B Plan — 14 September 2026

## Scope

Wave B addresses exactly 25 remaining structured Drawing activities:

- spatial composition: 5;
- texture: 5;
- symmetry: 5;
- visual story/sequencing: 5;
- focal/composition emphasis: 5.

The 25 invention/character/map/design/capstone activities remain out of scope for this wave because they require a lighter, less prescriptive scaffold strategy.

## Scaffold policy

- Reuse the existing `DrawingGuide` + `DrawingScaffold` runtime.
- Use `complete` mode only as a non-interactive starter structure.
- Do not count scaffold paths as child strokes or completion evidence.
- Do not add assessment, correctness masks, mastery, or progression behavior.
- Every guide must be activity-specific and remain inside the 480 × 480 drawing canvas.
- Spatial guides should teach organization, not draw the requested picture for the child.
- Texture guides provide a bounded surface; the child authors the texture itself.
- Symmetry guides provide axis/half-structure cues; the child completes/mirrors the counterpart.
- Story guides provide sequence anchors; the child authors the event/change.
- Focus guides provide composition anchors; the child authors the focal subject/details.

## QA contract

Wave B is accepted only if:

- total functional Drawing guides become exactly 75/100;
- all 25 Wave B IDs resolve to `complete` guides;
- all 75 guide definitions remain unique;
- every SVG path parses with non-zero length and stays within the 480 × 480 canvas;
- Q106-equivalent missing-scaffold count drops exactly 50 -> 25;
- runtime-derived previews exist for all 25 Wave B guides;
- real Drawing routes load the guide without redirects/runtime errors;
- scaffold presence never enables `Selesai` before the child draws;
- normal production/mobile/Windows/security CI remains green;
- manual visual review checks the 25 previews for clipping and over-prescription before merge.

## Expected deterministic baseline

```text
KEEP       875
POLISH      25
REDESIGN     0
REPLACE      0
Q106        25
Q108         0
structural   0
```

The final 25 Drawing findings should remain explicit for a later WS-07 wave rather than being hidden by weakening Q106.
