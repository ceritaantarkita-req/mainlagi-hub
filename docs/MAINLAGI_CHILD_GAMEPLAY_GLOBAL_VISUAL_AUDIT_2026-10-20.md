# Mainlagi — Global Child Gameplay Visual System: P0 Audit and Execution Matrix

**Date:** 20 October 2026
**Scope:** Belajar child-facing gameplay and Stage presentation. **No World, Motion Engine, Shop, auth, database, content, answers, scoring, evidence/mastery, or stage-unlock changes.**
**Source checkpoint:** `main@da056af01945d55298b70dbc1a0cbd062b94a97f` (Odd One Out PR #529, merged).
**Status:** EVIDENCE-BASED BASELINE AND NEXT-WAVE PLAN ONLY. No new gameplay implementation, visual approval, exact-SHA production verification, or physical iOS acceptance is claimed by this audit.

## 1. Decision: reuse the existing system; do not invent a second global UI

The original ten-item roadmap still stands, but the foundation is **partially implemented already**. In particular:

- `src/lib/learning/childVisualHierarchy.ts` already defines `planChildVisualHierarchy()`: one visible primary instruction plus an optional on-demand hint, differentiated by choice/sorting/audio-first/creative/reading modes. Audio-only answer content must **not** become visible.
- `src/components/learning/ChildVisualHierarchy.module.css` already provides opt-in `activity`, `primaryInstruction`, `assistance`, `playfield`, `choiceGrid`, `choice`, and `stageHeading` primitives. It consumes `--ml-child-*` tokens.
- `src/components/learning/ChildChoicePresentation.module.css` and `ChildLearningPlatform.tsx` already opt the ordinary `tap_choice` fallback into the visual-first plan with `Cara main` disclosure. The `listen_and_choose` fallback is **intentionally not** migrated by that owner.
- `src/components/learning/GardenActivityFrame.tsx` and `GardenActivityFrame.module.css` own the shared header, Dengar narration control, theme, and placement of characters. The frame already has scoped `workspace`, `matchingFocus`, and `audioFocus` presentation boundaries.
- `src/app/globals.css` already defines product typography tokens (`--text-xs` through `--text-xl`), `--tap:56px`, `--tap-sm:48px`, plus shared palette/spacing. Generic global CSS must **not** override local pedagogical/subject styling.
- `src/components/learning/OddOneOutActivity.tsx` is the #529 reviewed one-question/three-picture pilot, with standalone responsive styling and concise opt-in completion. This is **one pilot**, not proof the other 46 patterns were reviewed.
- `src/components/learning/BelajarJourneyMap.tsx` already owns the shared Stage Detail, disclosure, and readiness truth; do not replace its data model or equate a Stage with a gameplay runtime.

**Conclusion:** next work is a controlled **adoption and QA program** on the existing primitives. Do not create parallel design tokens, a second layout engine, generic `h1` overrides, or 900 individual page rewrites.

## 2. Evidence inventory and scope limitation

| Evidence | Source | Verified conclusion | Limitation |
|---|---|---|---|
| 47 active gameplay patterns / 900 of 900 classified | CI gameplay distribution artifact `12184614289` (2026-10-19) | Full catalog has deterministic gameplay classification | Classification does **not** prove 900 screenshots are child readable |
| Historical 52 representative idle family images at 390px | Production screenshot artifact `11866911519` (run `38502633729`, 14 Oct) | Manually reviewed contact sheets of all 52; visible density was widespread across families | These are **historical**; VQA-04/05 and #529 subsequently revised some families |
| Odd One Out idle/try/success at 320/390/768 | Final #529 Chromium artifact `12186501653` and CI run `39249841450` | Actual pilot passes three viewports, keyboard/wrong/correct/Again, assessment checks | Not the entire family inventory; live Safari unverified |
| Current source owners above | Fetched from `main@da056af...` on 20 Oct | Reusable hierarchy foundation, frame boundaries, and fallback runtime ownership exist | Source review alone does not measure on-screen child comprehension |
| Current-head screenshot collection | #529 CI artifact `12185959648` | A fresh artifact is available for next-wave differential comparison | **Do not** imply each image was manually signed off in this audit |

Prior visual baseline documents: `docs/MAINLAGI_VISUAL_QA_NINE_SUBJECTS_2026-10-14.md`, `docs/CHILD_VISUAL_FIRST_UX_REDESIGN_2026-10-09.md`, and issue [#501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).

The historical contact sheets show examples where children encounter **two or more independently framed instruction-like blocks** before the first action. Examples include `390-cause-effect-idle.png`, `390-material-lab-idle.png`, `390-relative-order-track-idle.png`, `390-rule-pipeline-idle.png`, `390-set-reasoning-idle.png`, and the old `390-odd-one-out-idle.png`. These are **recheck candidates**, not claims that the same defects still exist on the October 20 build. #529 already fixed Odd One Out; VQA-04 previously touched Investigation Board and Material Lab.

## 3. Coverage-weighted audit order (NOT automatic redesign authorization)

Counts from the 19 October gameplay-distribution report:

| Order | Pattern / workspace | Count | Why next | Existing boundary |
|---|---|---:|---|---|
| 1 | `choice_grid` | 174 | Largest shared selection family; first-action, word-wrap, Help disclosure and single-heading QA | `planChildVisualHierarchy` and `ChildChoicePresentation` **already active** on standard tap-choice; audit gaps before editing |
| 2 | `visible_matching` | 108 | Verify open playfield, pairing feedback, title/hint hierarchy, English/Indonesian localization | Preserve matching randomization, two-side cards, and Wave VQA-05 fixes |
| 3 | `listen_choose` | 76 | Visible instructions must be answer-safe; inspect idle/audio-unlock/listening/muted/try/success | Separate audio-first path; **no auto-prompt exposure**, no autoplay |
| 4 | `symbol_hunt` | 74 | Focal letter size/touch access and avoiding extra instructional strips | Free-positioned target field, **never generic grid** |
| 5 | `coloring_canvas` | 100 | Workspace and palette visibility, touch accuracy, on-demand help | Preserve creative canvas, illustration geometry |
| 6 | `drawing_canvas` | 100 | Canvas, guidance, Finish/replay and Stage catalog; mobile stroke/touch QA | Preserve drawing geometry/strokes and separate creative viewport |
| 7 | `picture_word_match` | 23 | Large meaningful image, correct labels, bilingual helper placement | Do not hide image/answer context or collapse pedagogical text |
| 8 | All remaining Logic, Science, Math, reading, syllable, ordering and tracing mechanics | 145 (residual) | Audit each *active pattern* with at least one representative before shared CSS migration | Preserve unique rule/sequence/diagram/reasoning content |

**Total: 900.** The counts are a **review-order heuristic**, not a quality score or permission to reshape the mechanic. The 52 screenshot names are *samples*, not 52 unique active pattern identifiers.

## 4. P0/P1/P2 defect and owner matrix

Use `CONFIRMED CODE STRUCTURE`, `HISTORICAL VISUAL CANDIDATE`, or `CURRENT VISUAL DEFECT` precisely. None of the historical image findings should be called a current failure without a new screenshot.

| Priority | Observation / review candidate | Evidence | Owner / safe change | Required fresh acceptance |
|---|---|---|---|---|
| P0 | Core child hierarchy contract is already opt-in, not universal | `childVisualHierarchy.ts`, `ChildLearningPlatform.tsx` | Extend adoption via **one tested gameplay family at a time**; never replace mechanic | First task recognizable without reading multiple panels; one visible primary instruction when pedagogically valid |
| P0 | Distinct typography scales across app, Garden and local components | `globals.css`, `ChildVisualHierarchy.module.css`, `GardenActivityFrame.module.css` | Set **child-gameplay scoped semantic roles** (context/question/answer/help) using existing tokens; no broad root selector | 320/390/768/1280: legible and no clipping, intact source strings, background contrast |
| P0 | Duplicated-looking instruction cards in some historical screenshots | `390-cause-effect-idle.png`, `390-rule-pipeline-idle.png`, `390-set-reasoning-idle.png` | Respective runtime component + local module CSS only after refreshed screenshots | Keep essential rules/data; move optional explanation into accessible Help **only if safe** |
| P0 | #529 deployed-main SHA not established via public Cloudflare probe here | merged `da056af...`; PR #529 CI 7/7; PR-side Cloudflare smoke skipped | No runtime edit. Verify merged-main exact-SHA production `/api/health`, site route, and Cloudflare smoke via push CI | Confirm deployed `sha:da056af...` (or identify intervening newer main SHA) and production route success |
| P1 | Large context/problem blocks can visually overshadow answer in science/math | `390-material-lab-idle.png`, `390-make-total-idle.png`, `390-visual-word-problem-idle.png` historical | Local science/math component; preserve all data needed to solve | First input and complete diagram visible; scrolling allowed where needed |
| P1 | Audio-first fallback intentionally retains legacy choice rendering | `ChildLearningPlatform.tsx` explicit comment; Garden `audioFocus` | Dedicated audio owner, only after spoken-answer leakage/locale audit | Muted/offline/on-demand Dengar, keyboard, no answer leakage |
| P1 | Matching and stage visuals previously updated | VQA-05 #505–#507, child visual waves #482–#483, Journey owner | **Regression review**, not fresh rebuild by default | Focus, completion, Stage truth and current screenshot evidence |
| P2 | Character/background thematic contrast varies across nine subjects | Nine-subject themed Garden and asset contracts | Prefer existing subject-specific tokens/approved assets; no new art | Real screenshot comparison per subject, no target overlap |
| P2 | Physical iOS Safari comprehension/tap test outstanding | Issue #501 and VQA evidence | Owner device session | Manual Safari + voice + touch + short-landscape approval separately |

## 5. Canonical child-gameplay design contract (proposed rollout; not yet globally applied)

1. **Question**: one dominant *actionable* instruction in the initial scene. Shorten **presentation copy** only where meaning/age fit remains intact. Canonical `activity.prompt` and subject wording stay available via narration or an accessible disclosure; do not silently rewrite learning data.
2. **Content**: a scientific rule, reading passage, diagram, number, Arabic grapheme, or scenario is **learning material**, not automatically “extra instruction” to delete. Do not enforce a mechanical single-`h1` rule across all nested task content.
3. **Answers**: visuals/text pair must remain legible. Interactive targets minimum 44×44 px, preferred 56px+; labels never cropped or broken inside an unbreakable word.
4. **Feedback**: short visible wrong/correct guidance, `role=status` where appropriate, no pre-emptive answer leak. The existing canonical three-star completion and Back/Again/Next/Share remain the shared outcome.
5. **Theme**: retain nine backgrounds, approved five-character roles, and subject-specific scene identity. Background never outranks the child’s first-action target.
6. **Screen modes**: choice, matching, audio-first, spatial/reasoning, reading, tracing, and creative need separate layout adapters. **No universal card grid**.
7. **Isolation**: never touch attempts, evidence/mastery, scoring, readiness/Stage locks, World, Motion Engine, Shop, DB, or new Pattern #48 while resolving visual hierarchy.

## 6. Ordered implementation waves following this audit

| Wave | Priority | Deliverable | Scope | Gate |
|---|---|---|---|---|
| VSG-00 | P0 | Close #529 deployed-SHA evidence or document production blocker | QA/docs only | Exact merged-main Cloudflare smoke + health SHA; no CI-green = live shortcut |
| VSG-01 | P0 | Validate shared child typography **roles**, width/wrap, and action-safe hierarchy | Existing opt-in primitives first; ordinary choice + one contrasting family | Visual source/screenshot matrix with no regression |
| VSG-02 | P0 | Shared instruction/Help system adoption through adapters | One family per small PR; do not auto-hide teaching content | Initial/help/try/success/completion, screen-reader/voice |
| VSG-03 | P0 | Shared layout/spacing and subject-background readability | Scoped Garden variants + local layout only | 320/390/768/1280 + short landscape |
| VSG-04 | P1 | Extend choice and answer presentation to high-coverage families | choice_grid, matching, audio-first, symbol hunt, separately | Stable answer/assessment and all family QA |
| VSG-05 | P1 | Stage and creative presentation audit and scoped remediation | Journey Map, Stage Detail, coloring, Drawing | Stage lock truth, touch strokes, Finish, navigation |
| VSG-06 | P1 | Completion, responsive and accessibility consolidation | Existing canonical completion and QA harness | CI + genuine screenshots + physical Safari |
| VSG-07 | P0 | Full validation and production verification | All 900 deterministic catalog checks, representatives from all 47 patterns | Exact-head CI, screenshot review, merged-main Cloudflare exact SHA |

**No mass refactor.** Open at most one runtime PR at a time. Keep commits scoped by family and preserve existing QA fixtures and metadata selectors. Every accepted wave requires an artifact-level screenshot review and successful CI before merge; exact-SHA Cloudflare smoke and real-device sign-off remain separate.

## 7. Next executable task

Start with **VSG-01**: inventory the current child-facing heading, primary question, answer, and assistance roles on `ChildVisualHierarchy.module.css`, `ChildChoicePresentation.module.css`, `GardenActivityFrame.module.css`, one science/logic task-board owner and one audio-first owner. Check a current-head production-build screenshot at **320, 390, 768, 1280**, then implement *minimal opt-in* typography/spacing adjustments under the existing `--ml-child-*` contract. Do not bulk-replace `font-size` or write a new global stylesheet. Make the screenshot defects reproducible and add scoped regression checks before changing a runtime.

## 8. Open blockers / verification honesty

- Cloudflare `/api/health` was not reachable through available public web/terminal access in this audit; merged SHA **does not mean live verified**.
- Most reviewed 52-family images came from 14 October. Newer #529 artifact `12185959648` exists, but full current-head 52-image visual acceptance is not claimed here.
- No real physical iOS Safari test performed. No 900/900 *human* visual approval claim.
