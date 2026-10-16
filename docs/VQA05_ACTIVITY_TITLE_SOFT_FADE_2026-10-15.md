# VQA-05 — Activity title soft fade (15 Oct 2026)

Status: **MERGED / LIVE VERIFIED** — PR #507, production `main@3644a9270d7557ee3033ccbf393d06f7ed75c965` (15 Oct 2026).
Historical pre-PR baseline: `main@de04dd2eb8e7c56eb0dac9528e1dd79318f2640c` (#506 merged and Cloudflare exact SHA verified).
Parent: VQA visual quality issue #501.

## Owner decision

**No more solid blocks, pills or rectangular shadows behind the main activity title.** Use a very soft, **title-sized radial fade** to protect legibility while preserving the bright, detailed subject illustration. Fade must not reduce opacity across the whole header or whole scene. Keep existing headline size, real interaction geometry, gameplay content and character art.

Screenshots motivating the issue: Garden Choice headings, title `Temukan huruf A` in Symbol Hunt, and matching `Cari pasangan!` in Math/Logic. Existing Logic-specific CSS added hard cream backing to all nested `h1` (including prompt-board instructions) and created visually heavy labels; only the task title should carry its own text-specific contrast aid.

## Implementation

- `GardenActivityFrame.module.css`: remove the obsolete Logic-specific hard paper title rules and broad rule touching nested `h1`. Replace the **direct top-level Garden title and fallback Choice h1** rectangular `background` / box shadow with a feathered cream radial gradient that fades to alpha=0 at its outer edge; retain deep-navy text and subtle **text** shadow, no border/pill/card shadow. Audio-focus/workspace remain excluded because their purposeful instructional workspaces need their own backgrounds. Do not retouch prompts inside separate exercise boards.
- `LearningPlatform.module.css`: give two Child-owned h1 families the same local fade: `.activityPrompt` (Choice/trace/story where applicable) and `.matchingTitle` (Math, Logic, language). Matching progress badge and four play pieces are deliberately unchanged.
- The old **matchingFocus full-scene radial veil** (up to 16% off-white) is removed altogether; only the title glyph area receives a fading cream gradient. This restores the subject illustration's original saturation. Approved art, narration and characters are unchanged.

## Visual correction from first green CI screenshots

The first successful PR screenshot run (head `fcd2ae3`, #38673606496) was inspected at desktop and 320px. **Do not merge that head:** the explicit `ellipse 76% 88%` radial gradient extends beyond the h1 element boundaries and still creates a visible translucent **rectangle** around `Hitung sampai 3` and the nighttime Logic `Cari pasangan!` title. This conflicts with the owner's no-box decision even though tests passed.

Changed all three title-gradient instances to `ellipse closest-side at 50% 50%`, so the fade reaches 0 alpha at the heading's own edges, while preserving the central readable backlight and text-shadow. Regression assertions now require `closest-side` and a zero-alpha edge rather than a generic radial gradient. **Closed:** final PR head `e26918505e84a0ad914c74aaa4f12543e3470d36` passed required CI (7/7); real Chromium screenshot samples at 320/390/768/1280 were reviewed before squash merge. The preceding paragraphs are historical review notes, not outstanding release blockers.

## Regression

- Permanent Chromium visual baseline tests the computed title style at **390×844 / 768×1024 / 1280×800** for Garden Math title, Choice English h1, Symbol Hunt Letters h1, and Math/Logic/Bahasa Matching h1.
- Checks radial gradient, fully transparent edge color, no solid background color, no border, no pill radius, **no box shadow**, subtle text shadow and no title overflow; Math/Logic/Bahasa matching must have **no full-scene `::before` wash**. Adds 3 baseline screenshot files for `letters-find-a`.
- Existing Symbol Hunt browser QA additionally asserts the Garden-owned borderless gradient title at **320px and larger**, while retaining real canonical letter positions, pointer/keyboard/Completion testing.
- Existing English matching route additionally asserts title treatment at **320px** without changing pairing, wrong/correct feedback, local Again or the full instruction disclosure.
- Use manual before/after screenshot review for both bright Garden and dark Logic scenes. Test pass alone is *not* human aesthetic acceptance or proof all 900 activities are individually visually approved.

## Release gates

- [x] Exact PR head 7/7 blocking CI checks PASS (Ubuntu, Windows, Chromium, production build, secrets, dependencies, Shop staging) — [run #38682664337](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/38682664337).
- [x] Representative Chromium title samples at 320/390/768/1280 reviewed, including nighttime Logic and multiline Math; this is not 900-activity approval — see [final PR comment](https://github.com/ceritaantarkita-req/mainlagi-hub/pull/507#issuecomment-6184777205).
- [x] Final reviewed head `e26918505e84a0ad914c74aaa4f12543e3470d36` squash-merged to `main@3644a9270d7557ee3033ccbf393d06f7ed75c965` on 15 Oct 2026.
- [x] Post-merge `main` [run #38684386266](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/38684386266) 8/8 SUCCESS. Cloudflare smoke log reports `Production is serving expected commit 3644a9270d7557ee3033ccbf393d06f7ed75c965` with canonical Supabase target at 12:14 WIB, 15 Oct 2026.
- [ ] Real iPhone Safari / owner physical-device visual acceptance remains **open** and is not proven by Chromium or Cloudflare smoke.

**Frozen:** 9 subjects / 900 activities / 47 active patterns, correct answers, tap choices, score, mastery, learning evidence, readiness/stage locks, audio/TTS, World, Motion Engine, character production, Shop, Supabase/auth.

## Post-release visual audit boundary (15 Oct 2026)

- Issue [#501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501) stays **open** for evidence-led audio-first, Symbol Hunt and other visual/pedagogical acceptance; PR #507 closed only its title-soft-fade scope.
- Audio focus retains a reading-safe task panel, including muted/unavailable/error fallback; the fallback must not reveal the hidden audio answer or unlock choices.
- Symbol Hunt's `promptCard` is a **nested instruction card**, not the Garden-owned main title. Removing it requires separate child-first visual evidence, not a broad CSS rule.
- 900/900 deterministic classification and 47 active patterns do **not** mean 900 individually inspected or approved visual states.
- Follow-up QA evidence tracking: `docs/VQA06_AUDIO_SYMBOL_HUNT_EVIDENCE_2026-10-15.md` (separate test-only review branch, no runtime presentation change).
