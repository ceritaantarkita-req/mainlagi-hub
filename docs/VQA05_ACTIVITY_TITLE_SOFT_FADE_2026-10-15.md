# VQA-05 — Activity title soft fade (15 Oct 2026)

Status: **review branch / not merged / not production verified**
Baseline: `main@de04dd2eb8e7c56eb0dac9528e1dd79318f2640c` (#506 merged and Cloudflare exact SHA verified).
Parent: VQA visual quality issue #501.

## Owner decision

**No more solid blocks, pills or rectangular shadows behind the main activity title.** Use a very soft, **title-sized radial fade** to protect legibility while preserving the bright, detailed subject illustration. Fade must not reduce opacity across the whole header or whole scene. Keep existing headline size, real interaction geometry, gameplay content and character art.

Screenshots motivating the issue: Garden Choice headings, title `Temukan huruf A` in Symbol Hunt, and matching `Cari pasangan!` in Math/Logic. Existing Logic-specific CSS added hard cream backing to all nested `h1` (including prompt-board instructions) and created visually heavy labels; only the task title should carry its own text-specific contrast aid.

## Implementation

- `GardenActivityFrame.module.css`: remove the obsolete Logic-specific hard paper title rules and broad rule touching nested `h1`. Replace the **direct top-level Garden title and fallback Choice h1** rectangular `background` / box shadow with a feathered cream radial gradient that fades to alpha=0 at its outer edge; retain deep-navy text and subtle **text** shadow, no border/pill/card shadow. Audio-focus/workspace remain excluded because their purposeful instructional workspaces need their own backgrounds. Do not retouch prompts inside separate exercise boards.
- `LearningPlatform.module.css`: give two Child-owned h1 families the same local fade: `.activityPrompt` (Choice, Symbol Hunt, trace/story where applicable) and `.matchingTitle` (Math, Logic, language). Matching progress badge and four play pieces are deliberately unchanged.
- No additional fade layer over the backdrop and no changes to approved scene art, narration or characters.

## Regression

- Permanent Chromium visual baseline tests the computed title style at **390×844 / 768×1024 / 1280×800** for Garden Math title, Choice English h1, Symbol Hunt Letters h1, and Math/Logic/Bahasa Matching h1.
- Checks radial gradient, fully transparent edge color, no solid background color, no border, no pill radius, **no box shadow**, subtle text shadow and no title overflow. Adds 3 baseline screenshot files for `letters-find-a`.
- Existing Symbol Hunt browser QA additionally asserts borderless gradient title at **320px and larger**, while retaining real canonical letter positions, pointer/keyboard/Completion testing.
- Existing English matching route additionally asserts title treatment at **320px** without changing pairing, wrong/correct feedback, local Again or the full instruction disclosure.
- Use manual before/after screenshot review for both bright Garden and dark Logic scenes. Test pass alone is *not* human aesthetic acceptance or proof all 900 activities are individually visually approved.

## Release gates

- [ ] Exact PR head 7/7 blocking CI checks PASS (Ubuntu, Windows, Chromium, production build, secrets, dependencies, Shop staging).
- [ ] Inspect title area on desktop + 390/320 phones, including nighttime Logic contrast, multi-line titles and no horizontal overflow.
- [ ] Squash merge **exact head SHA** after safety checks; never bypass branch protection.
- [ ] Post-merge `main` 8/8 checks, Cloudflare smoke must confirm the precise merged SHA.
- [ ] Real iPhone Safari/owner visual acceptance remains separately open.

**Frozen:** 9 subjects / 900 activities / 47 active patterns, correct answers, tap choices, score, mastery, learning evidence, readiness/stage locks, audio/TTS, World, Motion Engine, character production, Shop, Supabase/auth.
