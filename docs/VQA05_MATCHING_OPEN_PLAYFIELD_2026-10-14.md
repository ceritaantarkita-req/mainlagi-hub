# VQA-05 — Open matching playfield (Wave 1)

Date: 14 October 2026
Status: REVIEW BRANCH — NOT LIVE VERIFIED
Source baseline: `main@52d232acb5ea6e722e7c82b7a494c81bfa47d14c` (#503 live verified)
Parent visual quality backlog: #501
Parallel PR: #504 (ecosystem relation, separate; 7/7 PR checks passed, manual screenshot acceptance / merged-main smoke not yet completed at writing)

## Grounded owner feedback

Owner-provided desktop production screenshots:
- `math-pattern-touch`: a four-piece matching game under a large white rounded board with additional column marks / feedback.
- `logic-match-pairs`: structurally identical to Math despite different objective and subject artwork.
- `bahasa-pasang-awal`: same layout family, though approved cheerful illustrated environments should remain.

The **shared cause** is `MatchingActivity` in `ChildLearningPlatform.tsx` and scoped `LearningPlatform.module.css` styles:
- `.matchingSurface` draws a large cream card, shadow and border **around** four already bordered answer buttons.
- `.matchingSideLabels` adds two extra decorative circled numbers that are not needed to understand the left/right matching model.
- `.matchingInstructions` is already a semantic progressive-disclosure summary. It must remain, but can visually recede.
- The Canonical Garden illustration, localized feedback, accessible text fallback and completed 3-star navigation already work.

## Implementation

1. **Open playfield**: remove the redundant `matchingSurface` rectangle, shadow and heavy padding while keeping the four tappable `matchButton` pieces. Hide only the decorative ①/② markers (`aria-hidden` already true). Preserve 2-column grid and non-color feedback.
2. **Subject-aware paint only** with `data-match-visual` on the same MatchingActivity section, based on canonical `activity.subjectId`:
   - `math`: warm asymmetric counting stones (golden edges and physical grounded shadow).
   - `logic`: cooler, flatter reasoning pieces (blue outline, thinner grounding, different asymmetric corners).
   - `language`: neutral word tiles for Bahasa and English.
   These changes **do not** split or fork the matching engine, reorder content, or create a new gameplay pattern.
3. **Response affordances**: preserve visual selection and correct colors while retaining aria-pressed, check mark, progress pips, live retry/success text, sound, keyboard and pointer handling. 320px tap geometry remains protected.

## Regression and screenshot acceptance

- `run-visual-baseline-browser-tests.mjs`: adds Math `math-pattern-touch` and Logic `logic-match-pairs` real routes to the existing Bahasa matching baseline; captures **390×844 / 768×1024 / 1280×800** each, for a total of six additional baseline route screenshots (previous baseline 34 × 3 = 102; proposed 36 × 3 = 108).
- Test asserts **same 4 pieces + 2 columns**, progress 0, canonical fallback prompt, subject-specific visual skin, no large enclosing background/border/shadow, no decorative numeric row, tap targets >= 90×82 and no Garden wash.
- `run-mobile-route-browser-tests.mjs`: the existing English wrong/partial/correct/Again/landscape route gets an additional **320×720** visual geometry assertion and screenshot. Existing seed, answer randomization, selection, progress, local Again, 3-star Completion and audio bridge remain untouched.

## Frozen boundaries

No changes to 900 activities or correct pairing values, matching seed/shuffle algorithm, scoring/completion evidence, mastery, Stage readiness, World, Motion Engine, art/character rights, Shop, Supabase/auth, voice/narration or other dedicated gameplay engines. No "Pattern #48" or curriculum variation forced by aesthetics.

## Gates

- [ ] Verify the new route URLs remain accessible with the browser QA fixture and don't cause false-lock redirects.
- [ ] All seven blocking PR checks PASS.
- [ ] Inspect real idle/selected/wrong/complete screenshots for Bahasa, Math, Logic and English at the captured widths, paying attention to legibility over busy backgrounds, no visual merging of tokens, and first fold.
- [ ] Rebase/update if #504 merges to main before this PR; don't bypass GitHub branch protection.
- [ ] Exact-head squash merge only after CI+visual review, followed by all 8/8 merged-main gates and Cloudflare exact-SHA smoke.
- [ ] Physical iPhone Safari and owner aesthetic acceptance remain separate.

## Remaining VQA-05 backlog

Audit 47 gameplay presentation patterns by representative idle/try/success/complete captures and log P0/P1/P2 items. Prioritize repetitive instruction/panel chrome, mis-scaled content, contrast and first action accessibility, **not** changing learning mechanic just for variety. Keep all nine subject illustration families intact.
