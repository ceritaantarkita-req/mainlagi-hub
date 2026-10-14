# VQA-05 Wave 2 — Joined child-facing matching guidance

Date: 14 October 2026
Status: REVIEW / NOT LIVE VERIFIED
Parent issue: #501
Baseline: `main@19701e2fe08ce30fab24fd89c9327bee6c77e819` (PR #505 merged; Cloudflare exact-SHA smoke pending when branched)

## Evidence

Owner complained about repeated text/chip chrome, including `Sentuh dua kartu!` and `Baca petunjuk` beneath a game. Real #505 Chromium screenshots show open Math, Logic, and Bahasa matching playfield now correctly free of a fifth outer card; however, a live hint and a fallback instruction summary still look like **two adjacent mini-cards**, diluting first-action focus. They are educationally important and cannot simply be deleted:

- `matchingFeedback` is a polite live status region with distinct wrong/success text and tone.
- `matchingInstructions` is a keyboard/touch-operable details disclosure preserving the canonical full prompt when speech is unavailable.
- Progress count, board pieces and top-level Dengar button have separate purposes and stay unchanged.

## Presentation-only change

- Wrap only these two existing blocks in one `data-match-guidance` group after the matching choices.
- Give the group one cream readable backing over varied nine-subject illustrated scenes; leave inner status and instructions transparent.
- Make `Baca petunjuk` / `Read instructions` an underlined 44px-tall disclosure trigger **inside the same ribbon**.
- When expanded, the full original prompt occupies a wrapped row; 320px should never produce horizontal overflow.
- Keep role=status aria-live=polite, data-match-feedback tone states and accessible <details>/<summary> semantics unchanged.

## Test and acceptance

- Permanent visual baseline checks joined ribbon, two transparent children, 44px summary target, 390/768/1280 Math/Logic/Bahasa screenshots and existing clear background geometry.
- Existing English matching interaction suite retains randomized pairs, incorrect selection, partial correct progress, completed 3-star navigation, Again/reseed and landscape checks; adds a 320px **open instruction disclosure** screenshot and overflow assertion.
- Required 7/7 exact-head PR checks green, review idle/expanded/wrong/success screenshots, then merge **only after #505 merged-main exact SHA Cloudflare smoke**.
- Exact merged-main 8/8 CI and production smoke for this follow-up SHA.
- Physical iPhone Safari and owner aesthetics remain separate.

## Frozen boundaries

Absolutely no changes to 900 canonical content or correct pairs, random layout, selection/retry logic, scoring, progress, stage locks, learning attempts/evidence/mastery, spoken content/audio, subject illustrations, World, Motion Engine, characters, Shop, Supabase and auth.
