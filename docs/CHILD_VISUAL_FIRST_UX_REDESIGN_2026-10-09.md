# Mainlagi Child Visual-First UX Redesign — Approved Execution Plan

**Date:** 9 October 2026  
**Status:** WAVE 1 MERGED / WAVE 2 MATCHING PRESENTATION IN IMPLEMENTATION / LIVE VERIFICATION PENDING  
**Source baseline:** `main@25e8388c28e16b477e4c305b775aacbd5056e87c`  
**Inputs:** four user-supplied iPhone screenshots (matching letters, Belajar Journey Map, Stage Detail, Child Home) and current canonical runtime owners on `main`.

## 1. Problem statement

Mainlagi child screens look too text-heavy, dense, formal and repetitive. The app is functional but children are asked to read/interpret large titles, paragraphs, status labels, and long lists before acting. Decorative background can compete with the matching gameplay. Child Home uses a long slogan and next-activity description above the discovery choices; Belajar Journey Map looks like an administrative timeline with pale, nearly blank locked stages; Stage Detail repeats canonical stage title, description, progress explanation and all activities; matching has headline, count, instruction box and a busy garden scene.

**Goal:** child can **see → understand → tap → play → receive feedback** while preserving adult accessibility, progress truth, narration, and core mechanics. Short copy and visual status are presentation changes, **not** relaxation of curriculum/readiness.

## 2. Screens: diagnosis → approved redesign

### A. Child Home (`Batch14WorldHome`, `Playroom.module.css`)
- **Observed:** multi-line slogan and next-activity sentence push the first useful choice down; large character artwork occupies much of the first viewport; experience cards have layered descriptions.
- **Target:** short personal hello (e.g. `Hai, Gian! 👋`); primary high-salience continue action (`Lanjut main`) with **short activity label**; retain one approved character ensemble, but use more compact mobile hero; one small verified star count; visually recognizable `Belajar`, `Petualangan`, `Bermain` destinations; discoverable subject directory further down.
- **Boundaries:** keep `rankAdaptiveLearningV2` as next-activity source, `useLearningProgress` as stars source; world age eligibility and World starting/resume state unchanged; links and child/profile ownership unchanged; character art not regenerated.
- **Acceptance:** at mobile widths 320/390/430, greeting, main action, character art and entry choices are legible, keyboard/touch-safe; headline/paragraph do not dominate first viewport. Public Home is **not** silently redesigned by this wave.

### B. Belajar Journey Map (`BelajarJourneyMap`, `BelajarJourneyMap.module.css`)
- **Observed:** stacked flat boxes with thin track and low-opacity locked nodes; `0/5 Stage selesai` has admin-dashboard feel; `Sedang dipelajari` text competes with meaningful visual status.
- **Target:** compact winding/adventure path using existing stage order, stage emoji/icon, larger alternating/offset nodes on wide view and usable staggered nodes mobile; accessible distinct current/completed/locked states; progress in child-readable short form; a clear resume action. Do not render locked stage as invisible.
- **Boundaries:** `buildBelajarJourneyMap` is canonical; no new unlock rules or auto-unlocking. Preserve `data-journey-stage`, `data-state`, `data-journey-map-track`, `data-journey-resume`, `data-journey-browse-all`; 9 subject routes / 46 stages / 900 activities remain shared.

### C. Stage Detail sheet (same owner)
- **Observed:** long title + subtitle + `1/2 langkah utama` + explanation + 3 activity rows + formal statuses create hierarchy overload. **Important:** required count differs from full list count by design; do not treat `1/2` versus 3 activities as an arithmetic bug.
- **Target:** concise child-facing title while retaining accessible full stage title, a compact visual representation of `completedCount / requiredCount` **explicitly labeled as main steps**, one recommended next activity and dominant continue CTA; full activity list available via progressive disclosure (expand), with completed and optional labels accessible. Keep sheet close/backdrop/Escape/focus keyboard; test screen height and scrolling.
- **Boundaries:** same recommended activity URL, `getActivitiesForStage`, completion IDs, age filter, QA unlock boundary and Drawing-specific handoff.

### D. Matching gameplay (Wave 2, scoped)
- **Observed:** busy background behind 2x2 cards, very large title, repeated instructional copy and feedback block; cats/robot at bottom compete with task.
- **Target:** short child-facing prompt, answer cards in the focal plane, instruction `Pilih pasangan!`, character/background de-emphasized behind answer workspace, clear selected/matched feedback, accessible audio.
- **Boundaries:** preserve `buildMatchingColumns`, `matchingSeedFromText`, `nextDistinctMatchingSeed`, matching correctness and `completeActivity` side effects. No production answer leak.

## 3. Design principles and measurements

- **One main action per screen** with supporting secondary navigation; do not hide paths or change semantics just to simplify visuals.
- **Visual-first, never visual-only:** short child copy + audio + real text for screen readers, visible focus and status communicated with more than color.
- **Use approved Mainlagi Garden aesthetic:** cream, green, navy, yellow highlights; consistent rounded geometry; existing five-character canonical source; no alternative cast or fake assets.
- **Reducing text is an editorial target** (not fixed percentage): child-facing headings 2–5 words where context permits, instructional sentence short, details remain in accessible disclosure or parent surface.
- **Mobile first:** baseline checks 320/360/375/390/430/768/1024, short landscape 620px high, iOS Safari manual QA, browser safe-area, no horizontal overflow, minimum accessible targets 44px (ideal primary 56px+), reduced-motion, readable contrast.
- **Progress truth:** preserve stage `completedCount`, `requiredCount`, `completedStageCount`, `totalStageCount` and eligibility; visual reward must not imply stage mastery before criteria pass.
- **Performance:** approved artwork only; avoid duplicative large hero images and heavy animations; no new remote image dependencies.
- **No visual acceptance claim from CI alone:** compare real screenshots against user feedback. Cloudflare smoke must verify exact merged SHA before LIVE VERIFIED.

## 4. Canonical owner and scope map

| Screen | Active owner | CSS |
|---|---|---|
| Child Home | `src/components/learning/Batch14WorldHome.tsx` | `src/components/learning/Playroom.module.css` |
| Shared Belajar Journey Map / stage sheet | `src/components/learning/BelajarJourneyMap.tsx` | `src/components/learning/BelajarJourneyMap.module.css` |
| Matching / other learning runtime | `src/components/learning/ChildLearningPlatform.tsx` | `src/components/learning/LearningPlatform.module.css` |
| Garden shared frame | `src/components/learning/GardenActivityFrame.tsx` | `src/components/learning/GardenActivityFrame.module.css` |
| World | **Separate adapter/runtime, no changes** | none |

Do not create replacement screen owners, duplicate Journey Map, or revive legacy ActivityGallery. Existing product direction/docs remain valid for their established scopes; this new user-approved visual remediation overrides earlier "no visual redesign next" *only for the four affected child-facing presentation surfaces*.

## 5. Execution backlog (one active branch at a time)

| ID | Priority | Work | Wave |
|---|---|---|---|
| VIS-01 | P0 | Child Home copy/hierarchy, compact hero, visual actions | 1 |
| VIS-02 | P0 | Journey Map nodes, current/completed/locked clarity, child-oriented path | 1 |
| VIS-03 | P0 | Stage Detail concise hero, accurate required progress, activity disclosure | 1 |
| VIS-04 | P0 | Matching focus and short instructions, scoped visual treatment | 2 |
| VIS-05 | P1 | Shared Garden composition and layering, guard other activities | 2 |
| VIS-06 | P1 | Child-safe audio + feedback + character response | 3 |
| VIS-07 | P0 | Full regression + real device QA + exact-SHA live verification | each |

**Execution rule:** one short-lived `agent/child-visual-wave1-20261009` branch/PR for Wave 1. Docs get committed **first on that same branch**, then UI commits; no parallel experimental branches. Merge only after QA and CI green, verify Cloudflare on merged SHA, then branch auto-delete. Wave 2 is not authorized to begin in this PR.

## 6. Wave 1 acceptance and test matrix

- [ ] Child Home CTA target remains the real adaptive next activity.
- [ ] Child Home World card remains correct for age eligible/ineligible users; no unlock hacks.
- [ ] Character presentation uses approved existing art, with no new identity.
- [ ] Shared 9-subject Journey Map uses same stage IDs/order/current/locked/completed state.
- [ ] Locked stages remain unclickable; QA override remains explicitly QA-only.
- [ ] Stage Detail shows exact required-step counts, with accessible full detail and no mislabel.
- [ ] `data-journey-*`, `data-stage-*` and permanent browser QA selectors remain stable.
- [ ] Escape/backdrop/close, keyboard focus, small mobile sheet height and reduced-motion work.
- [ ] No horizontal overflow at 320/390/430/768/1024 and portrait/landscape.
- [ ] Typecheck, lint, existing learning/Journey Map tests, visual browser baseline and GitHub CI pass.
- [ ] Exact merged SHA Cloudflare production smoke passes before DONE/LIVE VERIFIED.
- [ ] iOS Safari user/device visual approval received after release.

## 7. Explicit non-goals

No changes to learning data/900 classification, evidence/mastery, readiness, rewards accounting, adaptive ranking, activity matching mechanics, World scenes/segments, Motion Engine, production character development, Shop activation/payments, auth/RLS, profile ownership, or DB schema. No new decorative fake buttons. No broad code cleanup or unrelated fixes.

## 8. Evidence tracking

At creation: user provided visual rejection and four screenshot examples. Source was reviewed on `main@25e8388c28e16b477e4c305b775aacbd5056e87c`. **No runtime edits, UI screenshot acceptance, CI result, or production smoke is claimed at this documentation step.** Append each subsequent commit/PR test run, defect/fix and exact production SHA here once confirmed.


## 9. Wave 1 merged checkpoint (9 October 2026)

- **Merged:** PR #482, `main@de6d3957b741d81d4eccc2078063a0f50f4e3ebc`.
- **CI evidence:** PR run [37933701872](https://github.com/ceritaantarkita-req/mainlagi-hub/actions/runs/37933701872), seven required jobs PASS including Chromium mobile route matrix and permanent visual baseline. Cloudflare smoke was skipped on PR events.
- **Branch hygiene:** Wave 1 branch automatically deleted, zero open PRs at the Wave 1 handoff.
- **Not live verified:** the connector does not expose push-triggered main CI. Exact merged-SHA Cloudflare smoke and iOS visual acceptance have not been proven; do not retroactively close those gates.
- **Scope completed in code:** child home compact greeting/hero/choices; nine-subject map visual states; truthful stage detail recommendation/disclosure; accessibility/regression updates.

## 10. Wave 2 — matching gameplay visual focus (implementation authorization)

**Branch/PR policy:** ONLY `agent/child-visual-wave2-20261009` branched from `main@de6d3957...` until merged. No parallel implementation branches. Docs-first, scoped runtime + tests in same PR, squash-merge once all gates pass, delete branch.

### Diagnosis validated against runtime

`MatchingActivity` is a fallback `ChildLearningPlatform.tsx` activity runtime, framed by shared `GardenActivityFrame`. Current mobile screen stacks long `activity.prompt`, pair count, two-column answer cards and large instruction banner over a busy Garden backdrop, with two decorative character assets. Matching logic is in `src/lib/learning/matchingLayout.ts` and completion in `completeActivity`, with `ActivityCompletion` owning canonical Back/Again/Next/Share. This wave must preserve all.

### Approved implementation
1. **Matching only:** show a short age-appropriate visual title, clear left/right pick flow, compact 0/N match-progress as visual stars with screen-reader text; retain the full canonical prompt in the `Dengar` narration and accessibility description.
2. Enclose answer cards in one strong **calm foreground play surface**, reducing background visual competition. Keep two columns, no new background/character assets, no horizontal scroll. Each card remains an actual `button`, accessible keyboard/touch target, with obvious selected and matched states and `aria-pressed`.
3. Make live feedback compact and distinct: initial instruction, correct, wrong and retry feedback. Keep `role=status`, do not add an artificial timer or reveal correct answers.
4. **Scoped shared-frame refinement only** via explicit matching presentation variant or data attribute. Do not adjust generic Garden frame for other subjects/activities, World or Motion Engine; character layer remains canonical and pointer-transparent.
5. Use browser-resident optional `Dengar` only on user action; no unsolicited autoplay. Speak the ORIGINAL canonical `activity.prompt` to avoid age/language/content drift. Keep audio fallback in `GardenActivityFrame`.
6. Keep `matchingSeedFromText`, `buildMatchingColumns`, `nextDistinctMatchingSeed`, shuffle/non-adjacent safety, attempts/evidence, completion, and Again semantics byte-for-byte.

### Tests and acceptance gates

- [ ] Matching demo Bahasa and English keep exact randomized left/right card count and 2 valid pairs, not row-aligned; retry layout differs.
- [ ] Wrong pair does not complete/write progress. Correct pairs complete exactly once; Again resets local cards without duplicate writes.
- [ ] Compact progress 0/2 → 1/2 → 2/2; clear selected/matched states and no misleading mastery indicator.
- [ ] `Dengar` reads canonical prompt; fallback notice remains available, no autoplay.
- [ ] Matching-only Garden presentation flag works, unrelated Choice/Trace/Story/Coloring/Drawing frames unchanged.
- [ ] No horizontal overflow at mobile 320/360/390/430; landscape content, controls and character placement remain usable; reduced motion and focus states verified.
- [ ] Existing selectors `data-visible-matching`, `data-pair-count`, `data-match-column`, `data-match-card`, `data-source-index`, `data-activity-frame` and canonical completion/share remain stable.
- [ ] All PR CI gates pass, exact post-merge Cloudflare smoke and human iPhone visual check required for LIVE VERIFIED.

### Explicit out of scope

No curriculum or new gameplay mechanics, question generation, RLS/auth, evidence/mastery/progression, character development or art assets, World, Motion Engine, Shop, scoring, reward counts, global nav. Wave 3 (audio feedback and dynamic character moments) is separate; this Wave 2 only retains current audio capability and presentation states.

