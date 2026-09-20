# WS-13 — Visible Matching Randomization Wave

Date: **20 September 2026**  
Status: **IMPLEMENTATION PR / VALIDATION PENDING**  
Base when branch opened: `main` = `53a5f04c6d5430f3feb6273d42f178c5419fe418`

## Why

The generic `visible_matching` renderer currently lays canonical pair items in source order. For common two-pair activities this places the correct answer on the same visual row, making the answer structurally obvious before the child actually matches it.

Current gameplay distribution: **108 activities** use `visible_matching`.

## Scope

This wave changes **presentation only** for the generic grid-pair renderer owned by `ChildLearningPlatform.ActivityScreen`.

It does not change:
- activity IDs;
- canonical pair membership;
- number of canonical pairs;
- scoring formula;
- mastery/evidence contract;
- stage progression;
- content packs or database schema.

## New matching contract

- Every canonical pair is split across a **left** and **right** column.
- Left and right pair order are shuffled independently.
- For two or more pairs, the renderer guarantees that a correct pair is **not on the same row**.
- A child may begin from either column.
- Selecting another card in the same column **moves the current selection** instead of counting a false error.
- Only a wrong cross-column pair increments incorrect/retry evidence.
- Correct pairs become disabled/marked complete.
- The complete state uses the shared WS-13 completion overlay.
- **Try Again** resets the board and reshuffles it while preserving canonical pair data.

Randomization is session/runtime presentation state only. It does not rewrite stored content or answer/evidence identity.

## Difficulty boundary

This wave does **not invent extra pairs or distractors**. Canonical activities currently own their pair count and difficulty metadata. The renderer supports the available pair count without answer-row leakage.

Any future change from 2 pairs to 3/4/6 pairs must be a separate content/objective review because adding response items changes the activity stimulus and may affect evidence difficulty.

## Evidence bridge

The legacy matching evidence bridge is hardened for two-column selection:
- pair identity comes from explicit matching-card metadata instead of ambiguous label lookup when available;
- same-column reselection does not count as an incorrect attempt;
- wrong cross-column matching still increments incorrect/retry;
- canonical `matching_accuracy_v1` semantics remain unchanged.

## Browser QA

Representative route: `english-match-hello`.

Required at 320 / 390 / 768:
- exactly two matching columns;
- canonical pair sets preserved;
- no correct pair shares the same row;
- >=44px touch targets and no horizontal overflow;
- same-column reselection does not count as a wrong attempt;
- one intentional wrong cross-column attempt is measured exactly once;
- successful matching records assessed evidence;
- shared three-star completion appears;
- Try Again removes completion and reshuffles;
- retry layout also has no same-row answer leak;
- no page/console errors;
- idle/success/retry screenshot evidence.

## Next after this wave

After merged-main production verification:
1. narration first-instruction latency/preload;
2. parent/profile/settings responsive redesign;
3. character bible + final Naya/Gian/Zia production art;
4. subject visual themes/backgrounds;
5. English production voice-quality upgrade.
