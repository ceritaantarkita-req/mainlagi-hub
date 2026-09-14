# WS-05 Gameplay Diversification — Memory Pair Wave

Date: **14 September 2026**  
Baseline: `main` @ `c01f8122b19cde3d46ea0e2d3297b58216fe824c`  
Branch: `agent/ws05-gameplay-memory-matching-20260914`

## Goal

Diversify a coherent assessed family without changing its canonical learning objective or mastery contract. The 12 Letters uppercase/lowercase case-matching activities currently use the same all-cards-visible matching interaction as every other matching activity. This wave routes only that family to a reusable memory-pair presentation.

## Scope

- 12 `letters-match-case-*` activities across B–F, G–M, N–T, and U–Z.
- Runtime remains `matching`.
- `matchItems`, pair ids, skill mapping, assessment, stage requirements, stars, activity ids, and completion semantics remain canonical.
- Non-Letters matching activities stay on the existing visible-grid matching mechanic.

## Interaction contract

- Cards start concealed.
- Child opens two cards at a time.
- Upper/lower forms of the same letter stay revealed when matched.
- Wrong pairs close again after a short memory interval and count as incorrect/retry evidence.
- Keyboard activation and touch/pointer interaction are both supported.
- Explicit runtime measurement is emitted before `completeActivity()` so assessed accuracy/retries remain evidence-backed rather than inferred from hidden-card DOM text.

## QA contract

- Static presentation regression locks the exact 12-activity family and confirms other matching remains `grid_pairs`.
- Browser QA checks 320/390/768 widths, no horizontal overflow, minimum touch target, concealed initial state, keyboard activation, pointer completion, canonical progress completion, and persisted assessed attempt evidence with `matching_memory_interaction` fidelity.
- Existing full CI, mobile matrix, Windows, production build, quality audit, simulations/final acceptance, dependency audit, and secret scan remain required.

## Non-goals

This wave does not yet diversify listening, sequencing, sorting, drag-to-target, story, or trace families. Those should follow as separate reusable mechanic waves after this family is proven stable.
