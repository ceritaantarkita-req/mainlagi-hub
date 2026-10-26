# VSG-05 — Rule Pipeline visual-first, two-step safe presentation

**Date:** 26 October 2026  
**Base:** `main@34a48134be280c8868c50711aca3362df7f6fd53` (after VSG-04 PR #536).  
**Status:** IMPLEMENTED ON REVIEW BRANCH. Not merged until exact-head CI and 20 screenshots reviewed.

## Intent

The existing Rule Pipeline has one Garden title, a prominent "Jalankan dua aturan" heading, a long subordinate prompt, and a status panel that repeats a command before or after the first step. The child must also see two original rule cards and the intermediate result. Unlike a plain choice grid, **the first input is a sequential action**, not an answer choice.

Adopt **the existing** `planChildVisualHierarchy` with a *step-aware* single question:

- **Before running rule 1:** "Coba aturan pertama!"
- **After step 1 is applied:** "Apa hasil akhirnya?"
- Full previous help sentence ("Ikuti aturan pertama, lihat hasil sementara, lalu gunakan aturan kedua.") remains under a keyboard/touch-accessible **Cara main (?)** disclosure.
- Both canonical rule sentences, start state, intermediate result, and all three final choices stay visible. The final choices remain locked until `stepOneApplied`.
- Initial status-panel copy is removed; retry becomes "Belum tepat. Coba lagi!" and the original accurate scientific/logic success explanation remains available to screen readers. Completion uses canonical "Hebat!" + three stars + Back/Again/Next/Share.

This is not a global layout rewrite. The existing 4-cell cause/transform pipeline is unchanged; only subordinate prompt chrome, final-choice group presentation, and touch/typography scale are scoped.

## Non-functional boundaries

Never change correct choices, `rulePipelineConfig`, measurement metadata `pipelineStepsApplied:2`, accuracy, incorrect/retry counts, attempt evidence, stage readiness, user progress, World, Shop, DB, Motion Engine or any new content/pattern. First-step keyboard activation and final-answer lock remain behavioral requirements.

## Browser QA acceptance

`npm run test:ui:rule-pipeline` (part of existing canonical mobile route workflow) now covers **320/390/430/768/1280** and four states per viewport: idle, intermediate, wrong, and success. It asserts:

- exactly one prominent step-aware question in each pre-completion state;
- Help expands and collapses without removing canonical explanatory text;
- initial three final answer buttons disabled; keyboard activation of first rule unlocks answers;
- visible intermediate label remains canonical;
- retry feedback does not complete;
- final correct choice records one assessed attempt with the original 2-step metadata, one wrong answer, and 0.5 accuracy;
- concise three-star completion and local Again reset do not generate duplicate evidence;
- pointer/keyboard controls >= 44px, no horizontal overflow.

CI artifact `vsg05-rule-pipeline-screenshots` stores 20 original PNGs independently of the general mobile screenshots. Every screenshot must be visually reviewed for 320px touch and text fit, rule readability, scroll availability, character/background preservation and completion position.

## Release gates

- [ ] 7/7 required exact-head CI PASS
- [ ] 20 original screenshot PNGs manually reviewed
- [ ] No regression to Math/Logic, Stage readiness, assessment or shared Choice
- [ ] Merge only when all gates green; Cloudflare exact deployed SHA and real iOS verification stay separate.

Follow-up: Set Reasoning remains another **independent family**; do not preemptively change it inside this PR.
