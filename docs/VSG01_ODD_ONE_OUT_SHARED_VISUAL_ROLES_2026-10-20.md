# VSG-01 — Opt-in shared child typography and instruction roles (Odd One Out)

Date: 20 October 2026
Base: `main@3127a50438c6638cab39b472411357b8d0ebd276`, after VSG-00 audit PR #530 merged.
Status: **PR CI 7/7 PASS / 9 FINAL SCREENSHOTS REVIEWED / MERGE & EXACT-SHA LIVE CHECK PENDING**.

## Why this narrow wave

The global child visual foundation already has semantic styles and an answer-safe first-action planner. `ChildLearningPlatform` standard `tap_choice` and `SortingBucketsChoiceActivity` currently consume it; Odd One Out PR #529 had fixed child-facing copy and layout but still hardcoded its own visual instruction/answer type scale.

This wave **connects Odd One Out to the existing canonical roles**, rather than creating another design system or forcing the complete 47-pattern catalog into one layout. Its content, answers, narration, 3-card mechanic and evidence algorithm remain untouched.

## Source changes

1. `OddOneOutActivity.tsx`: use `planChildVisualHierarchy({mode:"choice", activityTitle:activity.title, visibleInstruction:"Mana yang beda?"})`; render the single `primaryInstruction` with `ChildVisualHierarchy.module.css`. Retain activity title in the accessible section name rather than a duplicate giant heading.
2. `OddOneOutActivity.module.css`: use the child-scoped `--ml-child-question-size` role and capped `--ml-child-answer-size` for three cards, preserve the scene-specific high-contrast white question, word-safe wrapping and the compact mobile trio. No generic CSS selector touches another family.
3. Browser QA: assert opt-in family marker, exactly one initial question, high-contrast heading, child-scale typography, no arbitrary word fracture, canonical three answer labels, touch/keyboard wrong/correct/replay, assessment evidence and three-star completion at 320/390/768px.

No new design tokens, media assets, DB schema, runtime routes, answer/curriculum changes or global overrides.

## Acceptance checklist

- [x] Exact-head GitHub CI: Ubuntu, Windows, build, secret scan, dependency, Postgres staging, Chromium mobile matrix all green.
- [x] Original VQA-16 screenshot artifact from **this exact PR SHA**, idle/wrong/success at 320/390/768 manually inspected for question contrast, trio text fit, tap size and overlap.
- [x] Wrong input does not complete; correct produces one genuine assessed attempt. Again resets without duplicate evidence.
- [x] CI regression coverage for Choice / Sorting and distinct gameplay mechanics passed; dedicated real-device visual review remains separate.
- [ ] Merge only after QA and visual review, then verify merged-main Cloudflare exact release SHA separately. Physical Safari sign-off remains owner-dependent.

## Forward rollout

Continue **one family per reviewed, short-lived PR**, prioritized by distribution and current evidence. Next is inspect high-coverage Choice and Matching first-action/Help behavior at 320/390/768/1280 rather than applying one CSS rule to audio-first, Symbol Hunt, reading, coloring or Drawing. Those mechanics need separate adapters, not cosmetic forced grids.

See `docs/MAINLAGI_CHILD_GAMEPLAY_GLOBAL_VISUAL_AUDIT_2026-10-20.md` and GitHub issue #501 for the shared 47-pattern roadmap.

## Verified PR checkpoint (20 October)

- Exact PR head before this docs-only checklist update: `b9aeb44124675c8fdfe62a1c66bd869dca063cac`.
- [PR CI run #2687](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/39426249574): **7/7 required jobs PASS** (Cloudflare smoke skipped by PR design).
- [Final VQA16 screenshot artifact](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/39426249574/artifacts/12267210370): all nine actual Chromium screenshots manually reviewed at 320/390/768, idle/wrong/success. One short question, all three full cards/labels and footer characters visible; wrong feedback and three-star completion actions retained. No screenshot-visible clipping, duplicated headline, or overflowing modal was observed.
- Contract/assertion QA protects title contrast and size, touch targets, no horizontal overflow, keyboard selection, assessment and completion. Human iOS Safari acceptance still open.

**Release boundary:** updating this document creates a new docs-only head commit requiring at least a fresh exact-head CI check before merge. Production Cloudflare verification must target the merged main SHA, not this PR SHA.
