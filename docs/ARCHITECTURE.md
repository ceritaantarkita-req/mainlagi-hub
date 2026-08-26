# Architecture — Mainlagi Hub Motion Learning Hub V2

## Layer

```text
Next.js App Router
  ├── Platform shell, auth, sharing, affiliate
  ├── GameShell + Preflight
  ├── Nine internal game modules
  ├── Shared game/recognition engine
  └── Shared vision runtime
       ├── Camera stream
       ├── Hand Landmarker
       ├── Pose Landmarker
       ├── player assignment
       ├── gesture latch
       └── body action classifier
```

## Vision mode

- `hand`: writing/tracing/whiteboard one-player.
- `pose`: full-body game.
- `hybrid`: two-player hand game or module requiring body-to-hand association.

Models are loaded only for the active mode.

## Player assignment

One player always maps to Player A and owns the full arena.

Two players:

1. First stable frame initializes left body as A and right body as B.
2. Subsequent frames use temporal anchors and minimum movement cost, so a change in MediaPipe result order does not swap players.
3. Each hand is paired with the closest pose wrist.
4. If one body is temporarily missing, its slot is retained for a bounded reacquisition window.
5. If pose is unavailable, a wide center dead zone is used only as fallback.

## Gesture contract

```text
pinch start      -> begin stroke
pinch hold       -> append points
pinch release    -> end stroke, keep glyph open
open palm hold   -> submit glyph
fist hold        -> clear glyph
```

`GestureLatch` requires multiple stable frames when entering/exiting a state to reduce chatter.

## Recognition

Digit questions use expected-answer verification first. A clearly different high-confidence digit may be marked wrong; low-confidence input becomes retry and receives time grace.

Tracing and shape modules use path scoring instead of digit classification.

Iqro V2 MVP separates body stroke from short dot strokes and validates body similarity, dot count, and dot zone.

## Auth

Google OAuth uses Supabase PKCE through public Auth endpoints. Only the public Supabase URL and anon key reach the browser. RLS in `supabase/migrations/0001_init.sql` protects user and admin data.
