# VQA-04 Wave 3 — Ecosystem relation visual clarity

Date: 14 October 2026
Status: REVIEW BRANCH ONLY — NOT LIVE VERIFIED
Parent issue: #501
Baseline: `main@52d232acb5ea6e722e7c82b7a494c81bfa47d14c` (PR #503 merged; production smoke pending at branch creation).

## Visual QA evidence

Actual production screenshot `390-ecosystem-relation-idle.png` in the existing responsive QA capture set shows an ecosystem relation question with a large instruction card, two relation boxes, a boxed cue, three boxed answers, and another full-width boxed status sentence. Although all content fits the 390×844 viewport, the equal-weight cards and repeated tip treatment diminish the sense of a relationship puzzle and feel like stacked dashboard UI. This is a **visual presentation candidate**, not evidence of a wrong answer.

## Scoped change

The shared runtime `PhenomenonRelationBoardActivity` also handles non-ecosystem Earth/sky cases. Therefore the fix is **CSS-only scoped by `data-relation-domain="ecosystem_dependency"`**, in `PhenomenonRelationBoardActivity.module.css`:

- Show the observation as a soft green ground/island without an elevated white-card border or shadow.
- Keep the unknown relation destination as a visible dashed goal, including the existing try/good result variants.
- Make both cue and status **readable cream inline notes** rather than elevated bordered cards. Preserve their text, aria-live state and state-specific wrong/success contrast.
- Keep all three actual answer buttons large and clickable, the bright subject scene, characters, title, audio, and canonical Completion untouched.

Regression in `run-phenomenon-relation-board-ecosystem-reuse-browser-tests.mjs` checks visual chrome on 320×720, 390×844, and 768×1024 while retaining the existing exact choice order, keyboard wrong-state, touch/pointer correct-state, assessed evidence, correct/incorrect counts, status, 3-star Completion, local Again and no-horizontal-overflow gates.

## Release gates

- [ ] All seven required PR CI gates PASS.
- [ ] Manually compare idle/wrong/success screenshots in 320/390/768 on exact-head build. Ensure first action is visible, response remains clear, dashed target obvious, and guide text readable.
- [ ] Only after merged-main #503 exact-SHA Cloudflare smoke PASS, perform exact-head squash merge for this PR if CI and visual review pass.
- [ ] Verify post-merge CI + exact-SHA Cloudflare smoke on the resulting production commit.
- [ ] Physical Safari and owner aesthetic sign-off remain separately tracked.

## Frozen boundaries

No gameplay engine change, new pattern, activity copy or correct choices, assessment/mastery/attempts, Stage locks, Sound/TTS, World, Motion Engine, Shop, auth/database, or media/character changes. No change to non-ecosystem `PhenomenonRelationBoardActivity` styling.
