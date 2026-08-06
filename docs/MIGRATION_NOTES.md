# Migration notes

The rebuild used the existing repositories as learning material, not as external launch targets.

## Motion Learning Hub / Math Motion Battle

Reused concepts:

- procedural math constraints;
- exact division;
- mirrored camera coordinates;
- one-digit-at-a-time answers;
- countdown/timer/result lifecycle;
- deterministic question tests.

Replaced:

- monolithic game orchestration;
- player count inferred from display strings;
- fixed split UI for one player;
- single-stroke auto-finish based only on inactivity.

## Math Warung

Reused concepts:

- Indonesian warung context;
- cooperative/family mode;
- total, payment, change, and rupiah-in-thousands;
- mouse/touch fallback.

Migrated as an internal module with product selection, receipt, total, payment, change, writing pad, and numeric fallback.

## Iqro Motion

Reused concepts:

- 14-letter MVP;
- tracing, free writing, dots, adaptive practice, audio;
- requirement for teacher review.

Migrated to the shared multi-stroke system. The rebuild does not claim official calligraphy correctness.

## AirBoard Presenter

Reused concepts:

- pointer/pen/highlighter/eraser;
- pinch drawing;
- slide/whiteboard workflow;
- vector undo/redo/clear/export;
- image/PDF input.

Migrated as an internal presenter workspace, not a companion URL.
