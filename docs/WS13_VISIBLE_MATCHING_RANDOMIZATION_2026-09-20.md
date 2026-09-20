# WS-13 — Visible Matching Randomization

Date: **20 September 2026**  
Status: **MERGED / LIVE VERIFIED**  
Base: `main` = `53a5f04c6d5430f3feb6273d42f178c5419fe418`

Closure: PR #247 -> `main` `61f8fb64bca412b13abd5570e3c322b2ab158c8a`; merged-main CI #1134 / run `35504645189` passed all gates including exact Cloudflare production smoke. Manual 390px review accepted both the initial randomized layout and Try Again reshuffle with no same-row answer leak.

## Scope

This wave changes only generic **visible matching** rendered by `ChildLearningPlatform.ActivityScreen`.

Excluded:
- `memory_pairs`
- `drag_targets`
- specialized matching mechanics
- canonical answer/evidence/mastery/progression data

## UX contract

Visible matching now:

- renders one card from every canonical pair in the **left** column and its partner in the **right** column;
- randomizes which member of each pair appears on which side;
- shuffles left and right columns independently;
- applies a derangement constraint so the correct pair **cannot share the same row** when there are 2+ pairs;
- requires the second selection from the opposite column, preventing same-side accidental pair attempts;
- preserves existing pair identity and `matching_accuracy_v1` semantics;
- uses the shared completion overlay after all pairs are matched;
- **Try Again** resets the board and guarantees a different valid layout.

## Difficulty rule

No synthetic distractors or new canonical answers are invented.

Difficulty follows the catalog's existing pair count:
- 2 pairs = basic;
- 3 pairs = intermediate;
- 4+ pairs = higher visual-search load.

This keeps curriculum/evidence unchanged while removing the positional answer leak.

## QA

390px browser QA must verify:

- exactly two columns;
- one card per canonical pair on each side;
- no correct pair is adjacent on the same row;
- both canonical pairs can be completed;
- shared three-star completion appears;
- Try Again creates a different layout;
- retry layout also has no adjacent correct pair;
- screenshot evidence is captured;
- normal console/error/overflow/touch gates remain active.

## Non-goals

- no matching-content rewrite;
- no new pair/distractor data;
- no mastery/evidence/schema change;
- no WS-05 pattern-count change.
