# WS-07 Drawing Wave A — Concrete Scaffolds

Date: **14 September 2026**  
Branch: `agent/ws07-drawing-scaffold-wave-a-20260914`  
Baseline: `main` @ `5118c66e3378cdd4e26bb51314072347682ad230`

## Goal

Reduce `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD` from **75 -> 50** without changing Drawing completion semantics, mastery, progression, schema, activity count, or creative-practice status.

## Scope

Wave A covers the 25 concrete Drawing activities in five families:

1. Objects: cup, boat, house, car, ice cream.
2. Animals: cat, fish, bird, butterfly, snail.
3. Nature: tree, flower, leaf, cloud/rain, rainbow.
4. Faces/people: happy face, surprised face, hair, simple person, two friends.
5. Simple scenes: park, beach, road, night, garden.

The existing 25 foundational line/curve/shape/dots/composition guides remain unchanged.

## Scaffold policy

- Use the existing `DrawingGuide` runtime; do not create a second drawing system.
- Wave A guides use `complete` mode as **starter structure**, not a finished picture.
- Guides stay non-interactive, can be hidden/shown, and are never counted as the child's stroke.
- The child still has to add the defining details requested by the activity prompt.
- All scaffold paths must stay inside the 480 x 480 drawing coordinate space.
- Every guide must be explicit and activity-specific; no title hashing or random templates.

## QA contract

`run-drawing-guide-tests.mjs` must verify:

- Drawing catalog remains 100 activities.
- Explicit guide count becomes exactly 50 after Wave A.
- All guide IDs and definitions are unique.
- All 25 Wave A activities have functional `complete` guides.
- Remaining Q106-equivalent activities equal exactly 50.
- Every SVG path parses with non-zero length and stays inside the 480 x 480 canvas.
- 25 runtime-derived Wave A preview artifacts are generated for visual review.

`qa:local:playroom` must also expect 50 real scaffolds and continue proving that guide visibility does not synthesize completion.

## Expected audit result

```text
KEEP       850
POLISH      50
REDESIGN     0
REPLACE      0
Q106        50
Q108         0
structural   0
```

The remaining 50 Q106 findings are intentionally left for later Drawing waves and must not be hidden by weakening the audit rule.
