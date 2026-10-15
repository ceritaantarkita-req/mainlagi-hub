# Child visual hierarchy — Logic Sorting pilot (15 Oct 2026)

Status: **REVIEW BRANCH / NOT MERGED / NOT LIVE VERIFIED**.  
Parent P0 visual foundation: [PR #509](https://github.com/ceritaantarkita-req/mainlagi-hub/pull/509), merged to `main@94dc356e8a25a9d2f8de0b3472bd46d00485dc9f`. **Foundation merge is not Cloudflare verification**; verify the exact release independently before recording it as live.  
VQA owner issue: [#501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501). PR #508 Audio/Symbol Hunt QA remains separate.

## Canonical scope

The owner-provided 15 Oct screenshot of `logic-classify-up-arrow` shows:
- Huge Garden `Cari arah ke atas` title competes with the inner `Panah mana yang mengarah ke atas?` question.
- White promptCard and green board nest multiple decorative panels over an already illustrated Logic scene.
- Tray label, bucket hint, explanation, and always-visible bottom status repeat the same idle action.

`SortingBucketsChoiceActivity` is a **family renderer** selected by `isSortingBucketsActivity` in the canonical gameplay dispatcher. The narrow changes apply automatically to the entire reviewed SortingBuckets family, not an activity-id-specific CSS patch. No new pattern or catalog data change.

## Implemented pilot

- Import the shared `planChildVisualHierarchy` from foundation #509 with sorting mode. It preserves the canonical activity title as **quiet context**, uses the existing canonical `activity.prompt` as **one primary visible h1**, and keeps the existing supplementary instruction behind a `Cara main` button (`aria-expanded`, keyboard-accessible).
- Garden frame retains Back, Dengar, scene and characters; suppress its redundant title, and remove `spacious` 110px desktop layout only for this renderer. Audio narration remains the authored prompt.
- The dedicated Sorting CSS now uses a localized feathered text backdrop without a giant white rounded question card. Remove the decorative green enclosing board while preserving both colored target buckets and 3 distinct selectable symbol cards. Keep target sizes ≥44px, focus rings, responsive placement and reduced-motion support.
- Remove redundant tray label and idle bucket hint from the visual hierarchy. Dynamic selection guidance, incorrect answer, and success keep an accessible `role=status` live region **only when the interaction state changes**. Content/pedagogy is otherwise intact.
- No semantic object or interaction has been turned into a generic `choice_grid`. Two sorting targets remain visible and distinguishable.

## Exact source invariants

- `logic-classify-animal` correct choice `🐱`; `logic-classify-up-arrow` correct choice `↑`; unchanged canonical arrays, three cards, two buckets.
- Wrong-target selection increments retry + incorrect and does not consume selected item; sorting all three produces an assessed attempt with `evidenceFidelity: choice_sorting_interaction`, `correctCount=3`, and accuracy determined by actual wrong attempts (the test's one-wrong route is 0.75).
- Completion, Back/Again/Next/Share, stage guards and local replay behavior unchanged.
- Stage unlocks, age eligibility, audio manager, curriculum, learning evidence, World, Motion, characters, Shop, auth and DB remain outside scope.

## Required review

The existing `run-sorting-buckets-browser-tests.mjs` is extended to run two canonical routes at **320 / 390 / 768 / 1280px**, with:
- exactly one `h1`, activity context present and question text unchanged;
- no help/status strip on initial idle; help can be revealed and closed;
- all three cards and two buckets, first actionable card discoverable on the initial viewport, no horizontal overflow, ≥44px tap targets;
- keyboard wrong-placement, correct placement, canonical assessed evidence, completion, Again no duplicate attempts;
- screenshots for each route's idle/wrong/success states.

**Before merge:** all seven exact-head PR checks PASS, inspect downloaded screenshots visually at phone + desktop and reject clipped/too-dense/completion-obscured layouts; do not downgrade assertions to get a green build. After merge require **8/8 main including Cloudflare exact SHA**, and keep owner physical-device Safari/UX acceptance open.

This pilot does **not** solve generic Science choice text wrapping or the Drawing stage. Those are P1-b/P1-c *next* after this family is safe.
