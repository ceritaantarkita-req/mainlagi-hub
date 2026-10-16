# Mainlagi Child Visual Pilot P1-b — generic tap-choice (15 Oct 2026)

Status: **review branch only / not merged / not production verified**.  
Base: `main@94dc356e8a25a9d2f8de0b3472bd46d00485dc9f` — P0 child visual foundation (#509 merged, real Cloudflare exact-SHA verification still unavailable from Github run history).  
Sibling: [draft Logic Sorting PR #510](https://github.com/ceritaantarkita-req/mainlagi-hub/pull/510) has CI 7/7 PASS, but its downloaded image ZIP is not yet manually inspected; **do not merge based on CI alone**. VQA-06 PR #508 remains a separate draft.

## Owner-observed problem, scoped fix

The owner-provided Science `science-seed-grows-plant` screenshot shows a long oversized question and cramped 3-column answer layout splitting the canonical label `🌱 tanaman` into the word fragments `tana`/`man`.

Current fallback family owner: `src/components/learning/ChildLearningPlatform.tsx` `ChoiceActivity`, with former `LearningPlatform.module.css` `.activityPrompt`, `.choiceGrid`, `.bigChoice`. That CSS had broad `overflow-wrap:anywhere` plus 58px desktop answer labels and a fixed 3-column grid.

P1-b fixes the *shared canonical `tap_choice` renderer* for all activities actually routed through this component (rather than patching one Science ID); dedicated gameplay families still use their own components. This is an **opt-in family**, not a claim that every one of 174 classified choice_grid activities flows through this exact renderer.

### Changes

- `tap_choice` branch consumes the P0 pure `planChildVisualHierarchy` policy and shared `ChildVisualHierarchy.module.css`. One exact canonical `activity.prompt` is the visible main heading (legacy Cari huruf exception remains). Canonical activity title remains present as semantic context via `aria-label`, not a second giant text heading.
- Adds `ChildChoicePresentation.module.css`, scoped only to this branch: adaptive 1/2/3-column choices based on minimum label width; font 18–30px for words, larger single glyphs; no unnatural `word-break:break-all` or `overflow-wrap:anywhere`; responsive touch hit areas and focus outline; no surrounding decorative panel.
- `Sentuh pilihanmu.` or English `Tap your answer!` is *help on demand* via an accessible `Cara main` control instead of a permanent redundant idle instruction block. Wrong feedback is still announced, correct choice still calls `onDone(completeActivity)`, and canonical Completion/Again are unchanged.
- `listen_and_choose` legacy Choice renderer remains **unchanged** until an answer-safe audio-first audit. Audio target text must not leak into the visible question. No audio manager, narration, answer, stage/age gating or assessment change.
- Existing `LearningPlatform.module.css` other families are untouched; no global `h1` or `button` override and no catalog-copy rewrite.

### Regression

Permanent new `scripts/run-child-choice-visual-browser-tests.mjs` is in the canonical `test:ui:mobile-routes` Chromium chain, **after** the route runner's screenshot cleanup so artifacts persist.

Route `/child/demo-gian/activity/science-seed-grows-plant` with legitimate staged local Science prerequisites (same model used by existing cause-effect QA); viewports **320, 390, 768, 1280**. Gates:
- exactly one main instruction; **exact 66-character question unchanged**, all three labels in canonical order, `tanaman` uses one rendered text line fragment at each width;
- first answer in the first viewport, all answers >=44px and within viewport, no horizontal document overflow;
- idle/helper reveal/hide, wrong/correct, canonical Completion and Again; reset does not manufacture another attempt;
- screenshots `{width}-child-choice-science-idle/help/wrong/success.png` in `.mobile-route-qa`.

Do not merge unless the PR exact-head 7/7 gates PASS **and** real screenshot PNGs are inspected for first-action hierarchy, balanced choice sizes, language fit, completion and any screenshot-specific failure. Fix the presentation, not the assertions, if a test fails.

### Boundaries & next

- No change to Learning Evidence/mastery, catalog scoring/distractors, World, Motion Engine, Character, Shop, auth or DB.
- Pilot #510 remains separate and must be closed after actual screenshot acceptance.
- Next P1-c is Drawing Stage using a shared playful-catalog presentation, **not** converting drawing to a choice game.
- Physical iPhone Safari and owner reading/copy approval remain separate gates. Activity structural 900/900 classification does not imply 900 visual acceptances.
