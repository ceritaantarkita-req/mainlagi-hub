# Mainlagi Hub — Child Visual Foundation v1 (P0 audit + shared design contract)

Date: **15 October 2026**  
Status: **REVIEW BRANCH / FOUNDATION ONLY / NOT LIVE / NO GAMEPLAY VISUAL MIGRATION**  
Base: `main@3644a9270d7557ee3033ccbf393d06f7ed75c965` (PR #507 verified).  
Separate pending work: [PR #508](https://github.com/ceritaantarkita-req/mainlagi-hub/pull/508) is a **draft** VQA-06 audio/Symbol Hunt testing wave. Its 7/7 PR CI is not authorization to overwrite that branch or silently merge it.  
Product issue: [#501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).

## Purpose and owner decisions

Adopt a **single reusable visual hierarchy**, **not 900 manually edited pages**. Preserve the existing 9 learning subjects, 900 activity IDs, 47 active gameplay patterns, content taxonomy, scoring, attempt/evidence fidelity, mastery/readiness, audio gating, canonical completion, World, Motion Engine, Shop, account/auth, and Supabase.

Agreed UX: **visual-first, interaction-first, audio-assisted**. For an interactive child activity, show **one primary instruction** initially. The task is the hero; the decorative background, chapter title, supplementary helper and duplicated labels must not compete with it. Secondary help should appear on request, during an appropriate state transition, or as non-competing assistive metadata.

This contract applies to **instruction chrome**, **not** to necessary reading passages, word labels used as learning targets, correct/wrong feedback, explicit audio-unavailable fallback, progress truth, accessible names, captions, or creative workspace guides. Do not hide essential curriculum/evidence behind a cosmetic rule.

## 1. P0 audit: source-confirmed causes, not a blanket visual verdict

| Source / family | Confirmed source coupling | Consequence / policy |
| --- | --- | --- |
| `src/components/learning/GardenActivityFrame.tsx` and `GardenActivityFrame.module.css` | Garden renders a large direct `h1` title and optional `.hint`; `.spacious > .title` becomes **110px at desktop ≥900px**, with top gap and 190px grid margin for certain descendants | Main Garden title can overpower first action. Replace in a **future audited opt-in pilot**, not by global `h1` override, because nested game boards own their typography |
| `src/components/learning/SortingBucketsChoiceActivity.tsx` | Screenshot route `logic-classify-up-arrow` supplies Garden activity title plus separate `.promptCard h1` question, another helper sentence, `.trayLabel`, `.bucketHint` and `.status`; `SortingBucketsChoiceActivity.module.css` adds rounded boxes within rounded boxes | P1 first-action hierarchy and layered-panel density. One primary question; keep card/bucket geometry and dynamic state semantics; avoid deleting sorting's essential group targets |
| `src/components/learning/ChildLearningPlatform.tsx` and `LearningPlatform.module.css` | Generic ChoiceActivity supplies `activity.prompt` as an `h1`; `.bigChoice` has `overflow-wrap:anywhere` and desktop `clamp(25px,4vw,58px)`, `data-short=true` can reach 210px | Screenshot `science-seed-grows-plant`: label `tanaman` fractures across syllables on a narrow card. Content-size-aware grid / smaller role-based label typography is needed; NEVER shrink the canonical answer string or remove an answer |
| `src/app/child/[childId]/stage/[stage]/page.tsx` and `src/components/learning/CreativeTrackViews.tsx` | Drawing stages route to `DrawingStageScreen`; other subjects use `StageScreen` in `ChildLearningPathViews.tsx`. Drawing uses generic `LearningPlatform.module.css` catalog cards rather than the StagePath layout | Screenshot `drawing-lines-shapes-basics`: stage resembles a small left/center catalog on a wide blank cream page, with repetitive tags. Future **playful catalog** migration should reuse stage layout roles while preserving creative preview and completion truth |
| `src/lib/learning/system.ts`, `gameplayPresentation.ts`, `catalog.ts`, activity route dispatcher | Canonical data/curriculum and gameplay mechanic/presentation routing already exist. Individual components own their state, CSS and evidence bridge; there is **not one universal renderer** | Extend visual role contracts across **families**, not by replacing the learning/game engine or forcing 47 patterns into one template |
| `src/components/learning/mobile/MobileFoundation.module.css` and `MobilePrimitives.tsx` | Existing `--ml-*` mobile structure and safe-area/touch primitives already serve child routes | Add child-facing semantic type/spacing tokens **under the existing child-learning boundary**, not another competing global root or parent theme |

Evidence classification: these are code-backed mechanisms plus **owner-provided 15 Oct desktop screenshots** for exactly the three cited routes. No claim that every activity is ugly or that all 900 pages have been screenshot-inspected. Existing visual QA notes in `MAINLAGI_VISUAL_QA_NINE_SUBJECTS_2026-10-14.md` distinguish representative-family screenshots from complete catalog acceptance.

## 2. Canonical visual roles (foundation P0 decisions)

### Instruction contract: one primary instruction

1. **Context title** (`contextTitle`): canonical activity name retained for navigation, analytics, ARIA and document semantics. On a task screen it is either a quiet, small context label or not redundantly displayed. A second giant title is not permitted.
2. **Primary instruction** (`primaryInstruction`): exactly one initially prominent, answer-safe prompt, with the first playable action adjacent to it. Prefer approved `visibleInstruction` from catalog over the activity title, without rewriting learning content automatically.
3. **Supporting help** (`onDemandHelp`): separate assistance state, not an always-open competing helper card. A clearly labelled accessible Help action and audio/replay affordance must remain available when adopted. No instruction is removed from the source dataset.
4. **Live feedback**: wrong/correct/completion status and help after an interaction are allowed when they convey a **new state**, not repeated idle copy. Preserve live regions and keyboard navigation.
5. **Audio-first exception**: private `audioPrompt` / spoken target stays with the audio runtime, **never** copied to visual primary text. `visibleInstruction` must be explicitly answer-safe. Until speech starts, choices remain locked; muted/unavailable/error states must retain truthful accessible escape instructions.
6. **Narrative/creative exception**: reading passages, word examples, drawing scaffold text and canvas labels are task material, not duplicate instructions. Do not hide narrative behind Help or alter creative progress to meet an arbitrary word budget.

`src/lib/learning/childVisualHierarchy.ts` is a **pure opt-in planner**, not a globally activated renderer. It returns only presentation metadata (`contextTitle`, `primaryInstruction`, `onDemandHelp`, `firstAction`, initially one primary instruction) and never mutates the learning activity, answer or scoring.

### Typography roles

| Role | New child-learning token | Intended responsive range |
| --- | --- | --- |
| Quiet context label | `--ml-child-context-size` | 16–24px |
| Primary activity question | `--ml-child-question-size` | 23–38px, balanced lines, max 34ch |
| Answer/choice text | `--ml-child-answer-size` | 20–32px; keep whole words when possible |
| Supplemental copy | `--ml-child-support-size` | 15–18px |
| Stage heading (catalog, not live game) | `--ml-child-stage-heading-size` | 26–40px |

Use `line-height` ≥1.15 for headings and ≥1.2 for choices; preserve letter identity and language diacritics. **Ban `overflow-wrap:anywhere` / `word-break:break-all` on natural-language choice labels** in migrated families. Use `overflow-wrap:break-word`, adaptive grid/card widths, readable text size, and screenshot inspection at 320px. Do not silently abbreviate or split canonical answers. Unbreakable URLs/codes are separate content types with distinct policies.

### Layout and surfaces

- One clear main playfield per activity; no extra solid/rounded title card by default. An existing pedagogically necessary board, sorting bucket, or contrast plate **may** remain.
- Separate **interactive objects** (answer buttons, bucket targets) from **redundant informational boxes**. The rule is not zero cards.
- Layout must be responsive by task content rather than by subject alone. Do not globally apply `repeat(3,1fr)` to long-word answers or the same grid to Sorting/Symbol Hunt/Canvas.
- Primary touch targets: prefer ≥56px; existing **44px minimum** is non-negotiable. Maintain focus rings, keyboard operation, touch/drag, pointer events and reduced motion.
- No new document-level `overflow-x:hidden` / `clip` masking overflow. Existing scene artwork and protected character positions stay unchanged.
- Stage pages use a **playful catalog** role distinct from in-game activity. For Drawing, share the stage container, hierarchy and responsive spacing later, but preserve lesson grouping, age eligibility, `requiredForStage`, completed badges and canonical links.

## 3. Source of truth introduced (opt-in, non-disruptive)

- Existing parent: `MobileFoundation.module.css` — child-facing `--ml-child-*` tokens scoped only to `[data-mainlagi-route-boundary="child-learning"]`.
- New CSS module: `ChildVisualHierarchy.module.css` — class-scoped `.activity`, `.contextLabel`, `.primaryInstruction`, `.assistance`, `.playfield`, `.choiceGrid`, `.choice`, `.stageHeading`. **Not imported by live renderers yet.** It avoids global `h1`, button and hint selectors, and doesn't change the VQA-05 gradient.
- New policy: `src/lib/learning/childVisualHierarchy.ts` — first-action and one-primary-text selection, no audio leakage.
- New permanent static/pure regression: `scripts/run-child-visual-foundation-tests.mjs` — token scope, primitive boundaries, narrowing/word safety, representative Logic/Science/Audio/Creative contracts. Run with `npm run test:ui:child-visual-foundation`, required in Ubuntu CI.

**Not done by this wave:** mass CSS replacement, migration of 47 pattern components, removal of title DOM nodes, prompt shortening or translation, stage redesign, new art, semantic/evidence/audio changes, or production release. A foundation can pass CI without the three screenshot problems being fixed yet.

## 4. Adoption order after this PR is independently accepted

| Follow-up family pilot | Exact owner(s) | First review / exit condition |
| --- | --- | --- |
| P1-a — Logic sorting | `SortingBucketsChoiceActivity` + Garden title boundary | `logic-classify-up-arrow`; 320/390/768/1280/1440 captures; preserve 3 cards, matching and other buckets, retries, status, Completion+Share, assessed evidence |
| P1-b — Science choice | `ChildLearningPlatform` ChoiceActivity, `LearningPlatform.module.css` | `science-seed-grows-plant`; `tanaman` whole word at 320/390, no forced 3 narrow columns; correct/distractor strings unchanged; first-action/score preserved. Audit all `choice_grid` renderer variants before sharing a selector |
| P1-c — Drawing stage | `CreativeTrackViews.DrawingStageScreen` and canonical `StageScreen` presentation | `drawing-lines-shapes-basics`; graceful desktop width and mobile catalog, fewer redundant tags, lessons and availability intact. Keep Drawing as workspace family, not choice |
| P1-d — Expand | Reuse tokens in reviewed gameplay families only | 47 patterns/900 catalog structural regression, representative screenshots and real child/owner validation, no cosmetic global find/replace |

Proposed sample visual matrix: widths **320, 390, 430, 768, 1280, 1440** plus 844×390 landscape, 100% zoom baseline; inspect long and short prompts, missing/slow audio, wrong/correct, Again, stage locks, no overflow, at least 44px targets, visibility of the first action. Human review of each representative screenshot remains necessary even when assertions pass. Real iOS Safari, parent/child usability and native pronunciation acceptance are separate gates.

## 5. Merge / safety policy

1. This P0 foundation PR is independent from **PR #508**; do not rebase onto its draft or modify its tests without a separate review.
2. Complete exact-head 7/7 PR CI, including the new policy regression, typecheck, lint, and production build.
3. Inspect the diff: CSS variables/classes and pure code only; no live renderer import means no visible site change is claimed.
4. Squash merge exact head only if gates pass; merged-main 8/8 including **Cloudflare** exact SHA before recording release as live.
5. Open the P1-a pilot on a fresh post-merge branch; do **not** use “P0 foundation merged” as evidence the owner’s screenshots are fixed.
6. Issue #501 stays open through family-level visual review and physical-device owner acceptance.
