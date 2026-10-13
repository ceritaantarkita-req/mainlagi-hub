# Mainlagi — Garden gameplay legibility and AudioChoice responsive remediation (13 Oct 2026)

## Owner evidence
Desktop screenshot shows vowel-O Symbol Hunt now correctly spaced after PR #493. A second 393×852 Chrome device emulation screenshot of `/child/demo-gian/activity/english-find-blue-audio` still shows:
- English instruction directly on detailed beach illustration, with weak readability;
- a header that visually crowds the controls, answer cards very high in the scene, and a large empty lower half;
- follow-up text over detailed sand/rocks, also weak contrast.

Owner reports similar legibility and composition issues across other learning pages. **Do not claim every activity is visually accepted based on existing CI alone**.

## Root causes from source
1. The AudioChoice runtime passed `spacious={visiblePrompt.length<45}` to `GardenActivityFrame`. This is a **string-length heuristic**, not a gameplay layout contract. It triggers `.spacious :global(h1)` up to **110px on desktop**, `min-height:700px` and an extra `margin-top:190px` on all `[data-choices]`. Even on mobile it lacks a legible grouping/background.
2. Garden scene artwork is intentionally vivid, but regular game `h1` headings and `hint` text had no consistent paper surface; only Logic had an ad hoc contrast patch. This explains why some subject scenes have readable labels while others blend into the art.
3. Previous CI primarily validated routes, choices, interaction and completion. It did not assert **headline size, panel opacity, or answer/hint geometry** for AudioChoice at mobile/desktop widths.

## Changes (small, bounded)
- Explicit opt-in `audioFocus` for Garden. AudioChoice uses it instead of `spacious`. All other runtimes preserve their existing `spacious`, `workspace`, `matchingFocus` semantics.
- A cream, nearly opaque responsive audio instruction/answer panel with balanced spacing, smaller headline, touch-safe answer cards, and readable hint, including landscape handling. Prompt stays answer-free: the audible target is never revealed in visible text.
- Shared readable paper treatment for standard Garden direct heading and the Garden hint across **all illustrated subject themes**, excluding workspace, matching-focus and audio-focus screens which have their own presentation systems. Scene background assets and gameplay controls are unchanged.
- Expand SI-06B1 AudioChoice browser suite with portrait 320/390/430, tablet 768, landscape 844×390 and desktop 1440. Check title remains answer-free, panel is opaque cream, title ≤46px, buttons in panel, instructions before choices, hint after choices, no horizontal overflow. Existing listening evidence, wrong/right, Back/Again/Next/Share and orientation persistence remain covered.

## Gates
1. GitHub PR CI 7/7 green including SI-06B1 browser, permanent visual baseline, Ubuntu, Windows, production build, dependency/security and Shop staging.
2. After merge Cloudflare Workers Build + exact SHA production smoke.
3. Owner physical mobile Safari + desktop visual acceptance. Samples should include `english-find-blue-audio`, `bahasa-vokal-o` and representative activities across the nine subjects. Issue #486 stays open for remaining cross-curriculum visual cleanup; one PR is not proof that all 900 activities look perfect.

## No-touch boundaries
Learning scoring and attempts; English narration prompts, voice gating and audio assets; completion/share; World, Bermain Motion Engine, Shop/payments, Supabase, characters and art files.
