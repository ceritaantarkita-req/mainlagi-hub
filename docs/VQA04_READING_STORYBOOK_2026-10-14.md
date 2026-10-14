# VQA-04 — Reading Passage storybook presentation (Wave 2)

Date: 14 October 2026
Status: PR REVIEW / NOT LIVE VERIFIED
Canonical baseline: `main@4fa5cc8bc6b880b20927892df5ecef5d205137e3` (PR #502 live verified)
Parent: issue #501

## Evidence and problem

Reviewed actual Chromium screenshot `390-reading-passage-idle.png` and `320-reading-passage-idle.png` in the production artifact after PR #502. The Bahasa activity `bahasa-baca-lala-kucing` had three separate white panels: an instructional introduction, a passage panel, and a question panel, in addition to three answer buttons and feedback. The story content itself is very short and does not need a dashboard-card stack. This is a visual hierarchy issue, **not** a defective learning objective or incorrect text.

The existing route has both valid 320/390 screenshots and a dedicated browser QA checking canonical story, question, three answer labels, wrong/correct feedback, touch targets, keyboard selection, completion and assessed attempt evidence.

## Changes

- `ReadingPassageQuestionActivity.tsx`: wrap the original `article[data-reading-passage]` and `div[data-reading-question]` in **one presentational `data-reading-storybook` wrapper**. Article, question, their text, semantic labels and answer buttons are identical.
- `ReadingPassageQuestionActivity.module.css`: use one warm paper/book surface with a light dashed reading/question divider. Remove nested rectangular borders and intro-card shadow; retain good reading contrast, font scale, status and 44px+ answer touch targets. The scene illustration is untouched.
- `run-reading-passage-question-browser-tests.mjs`: at **320, 390 and 768 px**, assert a single two-part book sheet, transparent interior sections, separator and readable warm surface. Existing route, progression, exact answer labels/order, keyboard retry, completion and assessed-evidence checks still apply.

## Frozen scope

No changes to the story, question, choices, assessment, mastery, stage readiness, `GardenActivityFrame`, voice/audio, canonical Completion and Share, subject art, character production, World, Motion Engine, Shop, admin, data or auth. No claim that all Reading Passage content has been human reviewed.

## Release gates

- [ ] Current PR exact-head 7/7 CI PASS, including dedicated Reading Passage browser tests.
- [ ] Inspect 320/390/768 screenshots for the whole storybook, choice row, idle/wrong/success and completion visibility; first-action scroll distance and line breaks must remain usable.
- [ ] Merge only after green, exact-head squash.
- [ ] Main CI and Cloudflare exact-SHA production smoke PASS.
- [ ] Real-device Safari/owner visual sign-off tracked separately.

Issue #501 remains open for other gameplay families.