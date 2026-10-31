# VSG-14 — Elimination Board: canonical first question and visible deduction clue

**Date:** 31 October 2026
**Base:** `main@62df677e5f9208934c9736c39020419482a638d5` following VSG-13 PR #550.
**Status:** Review branch; NOT merged or live until exact-head QA.

## Source-backed issue

The existing elimination runtime puts a large generic "Singkirkan lalu simpulkan" heading on top of `activity.prompt`, while displaying clue label, detailed hint and a second idle status instruction. At 320px this competes with the three answer cards. This is not a mandate to hide the deduction clue itself.

## Scoped first-action treatment

- **Primary heading** is the exact original `activity.prompt`, preserving five distinct logic questions: not red, only triangle, not-largest/smallest, shared feature, missing direction.
- The canonical short `config.clueLabel` remains **always visible** in the separate evidence/clue card. It is part of the thinking task, not decorative instruction text.
- The canonical detailed `config.hint` is now behind accessible **Cara main (?)**, displayed via the shared high-contrast assistance panel. It is not rewritten or deleted.
- All three original `activity.choices` and their numbers, `Tersisih` badges and incorrect-elimination visual states, correct conclusion, and `data-eliminated-count` remain intact.
- No idle repeated status. Visible retry is `Tersisih. Coba pilihan lain!`; full canonical success reasoning remains in live-region status, visually hidden behind the canonical three-star concise completion. `Dengar` still narrates the exact original prompt.
- Responsive size and word wrapping are scoped to Elimination Board only; no global CSS restyle.

## Immutable contracts

Do not edit `eliminationBoardConfig`, activity prompt or content, three choice IDs/order, source `correctChoice`, elimination set semantics, metadata `eliminatedChoices`/`eliminatedCount`, score/accuracy/retry/mastery, Stage locks, 900 content entries, 47 pattern definitions, World, Motion Engine, Shop or database.

## QA acceptance

- [ ] Exact-head **7 required CI jobs PASS** with Chromium VSG-14 checks.
- [ ] Representative negative-exclusion fixture at **320/390/430/768/1280**, four states **idle/help/wrong/success**, archive `vsg14-elimination-board-screenshots` (**20 screenshots**).
- [ ] Confirm question and always-visible clue, 3 original answer cards, keyboard wrong/exclusion, 1 incorrect, 1 retry, 0.5 assessed accuracy, non-completion on wrong, correct conclusion and Again without duplicating attempts.
- [ ] Visual review all original screenshots from the actual final PR head, especially 320px and text wrap. Representative fixture does not prove all five variant aesthetics; sample them separately.
- [ ] Cloudflare deployed-SHA smoke and real Safari/iPhone accessibility and touch remain separate acceptance checks.

Tracks global Visual System issue #501.
