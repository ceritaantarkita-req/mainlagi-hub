# Mainlagi Belajar — fallback tap_choice layout contract (14 October 2026)

## Context
Owner reported uneven visual layouts and unreadable prompts across Belajar. PR #493 corrected Symbol Hunt, and PR #494 (LIVE VERIFIED `main@1c059ad15c33f7be99d3f16458b018f43a5087cd`) corrected AudioChoice and added a non-layout-changing shared paper backdrop for standard illustrated Garden titles/hints.

Follow-up source audit found `ChildLearningPlatform` still passed `spacious={activity.runtime === "tap_choice" && (activity.prompt?.length ?? 0) < 45}` to `GardenActivityFrame`. This couples layout to **copy length**, so translation and prompt editing can silently trigger the large `.spacious` treatment: h1 up to 110px, `min-height:700px`, `[data-choices]` margin-top 190px at desktop. The issue is systemic in legacy choice fallback (not Symbol Hunt or specialized semantic activities).

## Change
- Remove the prompt-length `spacious` heuristic from **ChildLearningPlatform** only. Preserve explicit `matchingFocus` and all specialized runtimes' presentation choices.
- Use standard Garden + `LearningPlatform` title/grid layout, already adaptive for phone and desktop.
- Add measured browser QA for the known canonical fallback `/child/demo-gian/activity/math-count-3` at 320, 430 and 1440px. Assert no `spacious` class, title <=68px, 3 options, <=130px gap between prompt and options, no horizontal overflow. This does **not** assert visual acceptance for every activity.

## Protected boundaries
No change to question content, choice ordering, correct answers, assessed evidence, mastery, audio, Supabase, World, Bermain Motion Engine, Shop, illustration art or character assets. Other game families with purpose-built boards are untouched.

## Required release evidence
- 7/7 PR CI success, especially full mobile Chromium route suite and permanent baseline.
- Squash merge only after exact-head green.
- Cloudflare Workers Build and post-merge `/api/health` production smoke with exact main SHA.
- Owner desktop/iPhone visual acceptance, then continue inventory across legacy/specialized runtimes. Keep Issue #486 open; automated QA cannot certify all 900 activities at once.
