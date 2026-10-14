# VQA-03 — Garden spacious nested-heading scope correction

Date: 14 October 2026
Status: IMPLEMENTED IN REVIEW BRANCH / PR CI PENDING
Baseline: main@33dcb7da0540dc424aca72567250c11b0756c0b7 (PR #497)
Evidence: production mobile QA screenshot artifact 11866911519.

## Confirmed visual problem
The shared Garden Activity Frame currently styles **all descendant h1** under the `spacious` class. It applies large mobile `clamp(38px, 6.5vw, 96px)` and desktop `110px` headline sizing to specialized nested task-board headers that have their own CSS.

Production screenshots demonstrating the issue:
- `1280-feature-function-idle.png`: "Hubungkan ciri dan fungsi" becomes oversized and "Hubungkan" breaks into "Hubungka" / "n", pushing the body task below the first screen.
- `1280-material-lab-idle.png`: "Laboratorium bahan" splits across words and characters, with the lab task offscreen. An independent Material Lab-specific mitigation is PR #498.
- `1280-initial-sound-idle.png`: extra-large outer title; nested instructions are not as severely affected and this screen retains an accessible activity. It remains part of the responsive acceptance sample.

Source confirmation: `GardenActivityFrame.module.css` `.spacious :global(h1)` (two declarations); nested `h1` in Feature Function Link, Initial Sound, Picture Word Match, Material Lab and additional dedicated activity renderers.

## Bounded CSS fix
Replace both descendant selectors with **`.spacious > .title`**. This keeps the intended spacious treatment on the one Garden-owned **top-level** heading, while letting nested runtime-owned headings use their local typography. No class, runtime markup, content, scoring or progression changes.

Regression in `run-feature-function-link-browser-tests.mjs` checks 320/390/430/768/1280:
- nested Feature Function heading is 16–32px, not 38/110px;
- "Hubungkan" stays intact as a word;
- nested heading remains within the prompt board;
- all prior wrong/correct/keyboard/pointer, evidence and Completion assertions remain.

## Release boundary
- [ ] PR all seven required CI gates SUCCESS.
- [ ] Manually compare dedicated screenshots at phone and desktop (Feature Function, Material Lab, Initial Sound, Picture Word Match).
- [ ] Exact head merge only after the visual regression looks correct.
- [ ] Merged SHA production smoke PASS before claiming live verified.
- [ ] Real iPhone Safari + owner design acceptance separate.

Do not remove or broadly rewrite `spacious` from all runtime families. This fix changes **selector reach only**, preserving the prominent primary Garden title. Stages, nine subjects / 900 activities, World, Motion, Shop, Supabase, audio, narration, completion and characters are outside scope.
