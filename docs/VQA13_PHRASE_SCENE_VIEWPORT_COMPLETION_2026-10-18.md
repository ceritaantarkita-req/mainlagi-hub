# VQA-13 — Phrase–Scene canonical Completion fixed-viewport containment

Date: 18 October 2026
Status: **DRAFT / NOT MERGED / NOT LIVE VERIFIED**
Base: `main@f65b389088dbff30650c076ebace492e438337ec` after Syllable legibility #524 merged; this Phrase–Scene branch was reconciled to the newer main.
Parent Issue #501.

## Source- and image-grounded defect hypothesis

In an older authentic Chromium 320×720 `phrase-scene-success` screenshot, the `Excellent!` heading was visibly clipped near the top and the `Share` action clipped near the bottom, with the dimming overlay apparently restricted to the gameplay board rather than the full application viewport. That screenshot predates VQA-12 and is a **historical observation**, not proof of today's deployed production state.

The latest source shows `PhraseSceneMatchActivity` renders `<ActivityCompletion>` **inside** `<section className="scene sceneDone">`. The `sceneDone` CSS rule `filter:saturate(1.03)` establishes a containing block and stacking context for the descendant `CanonicalCompletion`, even though the shared component is `position:fixed; inset:0; z-index:60`. This can trap its fullscreen overlay within the parent and explain the screenshot edge clipping. The tint effect is nonessential to the child's lesson.

## Exact narrow patch

- Remove only the `.sceneDone{filter:saturate(1.03)}` CSS rule from `PhraseSceneMatchActivity.module.css`. Never change `CanonicalCompletion.tsx` or its shared CSS because it is used by World, Bermain and other Belajar families and evidence does not justify a shared change.
- Retain the complete current scene layout, three real semantic scene choices, source phrase `Which phrase means a small cat?`, size/noun/quantity meanings, canonical answers, incorrect retry and assessed progress, actual score/evidence, audio and all completion actions.
- Extend **the existing route-tested** `scripts/run-phrase-scene-match-browser-tests.mjs` at 320×720, 390×844 and 768×1024 with invariants: the completion overlay is genuinely `position:fixed` against the **whole viewport** (left/top ≈0, right/bottom equal viewport bounds); ancestor `scene` has no filter; the contained card, canonical deterministic `Excellent!` heading and all four `Back/Again/Next/Share` actions are completely within the viewport and each action has >=44px physical dimensions. Assert three stars, stage readiness, original phrase-scene semantics, unchanged keyboard wrong/correct, assessed `accuracy=0.5` and true successful completion. Exercise **Again** to return to all three enabled choices.
- Capture four real states on each width: **idle / wrong / completion / Again** = 12 screenshot PNGs. Preserve in dedicated hidden-safe `.vqa13-phrase-completion/` before shared mobile tests clear the directory. GitHub Actions step `vqa13-phrase-completion-screenshots` must fail closed on empty/missing artifact.

## Release gate, no shortcuts

1. Exact PR head **7/7 required GitHub checks pass**, including Ubuntu, Windows and full Chromium matrix. No changed gameplay data or test bypass.
2. Download the genuine 12-PNG artifact and examine 320/390/768 screenshots side-by-side. Heading and Share must both fit in success; dimmer must cover **header and entire viewport**; background game remains stable; Again returns to live scene. If the overlay still clips, investigate other fixed-position containing blocks before merging. Never hide vertical overflow globally to fake the test.
3. Squash merge to protected `main` only after screenshot acceptance, with exact-head verification. Separate merged-main **8/8 exact-SHA Cloudflare** and physical iOS Safari/owner acceptance remain open unless actually proven.
4. This repair covers one representative `phrase_scene_match` activity (4 classified instances in distribution), not all 900 human visual screenshots. Frozen boundaries: 47 patterns, 900 activity IDs/content, exact answers, scoring/mastery/locks/evidence, World, Motion Engine/Bermain, Shop, DB/auth, shared Completion, and paused character development.

The old `PhraseSceneMatchActivity` also has multiple idle instructional surfaces; **do not combine first-action typography redesign into this clipping repair**. Once the completion fix closes, inspect that presentation separately with its own QA.
