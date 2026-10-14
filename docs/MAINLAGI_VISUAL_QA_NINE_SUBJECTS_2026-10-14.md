# Mainlagi Hub — Nine-subject / activity-family visual QA (14 Oct 2026)

**Status:** REPRESENTATIVE ARTIFACT AUDIT / ONE CONFIRMED FIX IN REVIEW / PHYSICAL-DEVICE ACCEPTANCE OPEN  
**Audited main:** `33dcb7da0540dc424aca72567250c11b0756c0b7` (PR #497 merged, exact-SHA Cloudflare smoke SUCCESS, run `38502633729`).  
**Evidence:** Production-run artifacts `11866911519` (mobile-route QA screenshots), `11866698081` (activity-quality), and `11866353830` (gameplay-distribution). These were downloaded and inspected, **not inferred from CI green status**.

## 1. What was actually checked

- Deterministic learning audit: **9 subjects / 900 activities / 900 KEEP / 0 structural findings**. A zero-flag result is **not** a complete child-facing or visual acceptance decision.
- Gameplay distribution: **900/900 classified, 47 active patterns**. Overall `choice_grid` 174, `visible_matching` 108, `listen_choose` 76, `symbol_hunt` 74, Coloring 100, Drawing 100.
- Production artifact contained **772 files**, including **78 baseline route screenshots = 26 routes × 3 viewports** (390×844, 768×1024, 1280×800), three Stage-detail-open screenshots, **52 idle activity-family captures at 390px**, plus extensive 320px/768px state/interaction captures and specialized creative previews. Not every capture is an independent activity.
- Manual inspection included the public entry, child home, Math and Bahasa subject samples, the changed matching and English choice screens, symbol hunt, and contact sheets of all **52** 390px idle family samples. Closer individual inspection included Material Lab, Investigation Board, Rule Pipeline, Initial Sound, Transitive Chain, among others, and the narrow 320px screenshot families.
- The capture set gives broad runtime sampling but **does not establish per-activity human review of all 900**, nor full 9-subject Journey Map screenshots or real-device iOS acceptance.
- Source inspection covered the live `HomePage`, `BelajarJourneyMap`, `GardenActivityFrame`, `MaterialLabActivity` and `InvestigationBoardActivity`, their CSS, and relevant browser-test contracts. No new assets, World progression, Motion Engine, or learning evidence modified.

## 2. Subject-specific coverage / distribution

| Subject | Activities | Leading classified patterns | Visual QA scope / remaining gap |
|---|---:|---|---|
| Bahasa Indonesia | 100 | choice_grid 24, visible_matching 21, listen_choose 20 | Bahasa Journey screenshot and symbol hunt/matching examples. Full stage/state grid and individual copy review open. |
| English | 100 | listen_choose 27, visible_matching 25, picture_word_match 18 | English choice + picture-word / cloze screenshots inspected. Native audio listening acceptance open. |
| Matematika | 100 | visible_matching 15, choice_grid 13, number_line 11 | 390/1280 Journey and diverse number/count/operation screenshots. Long-word stage typography still needs broader review. |
| Iqro | 100 | choice_grid 58, listen_choose 29, visible_matching 12 | Runtime mechanisms covered by shared samples; no complete Iqro-specific stage and human/expert content/audio acceptance. |
| Huruf & Menulis | 100 | symbol_hunt 64, guided_trace 13, memory_pair 12 | Letters Symbol Hunt 320/390/1440 captures; 64% one visual pattern merits a diversity review, not a failed QA claim. |
| Logika | 100 | choice_grid 21, visible_matching 18, set_reasoning 10 | Pattern, reasoning, rule, spatial and chain samples present; check age-appropriate reading load and instruction hierarchy. |
| Sains | 100 | choice_grid 41, visible_matching 16, healthy_habit_routine 8 | Material Lab / Investigation and other dedicated Science families examined. Confirmed 320px heading word fracture below. |
| Mewarnai | 100 | coloring_canvas 100 | 49 specialized preview captures and a Coloring route screenshot. Full canvas interaction/art composition review remains separate. |
| Menggambar | 100 | drawing_canvas 100 | 25 Drawing previews plus Stage/detail screenshots. Drawing canvas and child art-product evaluation remain separate. |

These counts come from the production gameplay-distribution artifact. Dominant Coloring and Drawing patterns are intentional creative workspace families, **not** evidence they should be converted into other mechanics.

## 3. Prioritized findings (no production issue invented)

### P0 — blocking runtime/visual defect

**None confirmed in the reviewed representative artifact screenshots.** This does not prove P0 absence across all 900 routes or real iPhones.

### P1-01 — Material Lab breaks a word in the main heading at 320px (CONFIRMED)

- Production screenshot: `320-material-lab-idle.png`.
- Visible output renders **“Laboratoriu” on the first line and “m bahan” on the next**. The available width is insufficient for the icon plus long heading. Standard no-horizontal-overflow checks do not detect this.
- Source: `src/components/learning/MaterialLabActivity.tsx`, `MaterialLabActivity.module.css`.
- Proposed bounded correction in this branch: remove decorative beaker from the cramped prompt row only at ≤350px, preserve complete word wrapping, and assert the first word stays within **one rendered line fragment** in `run-material-lab-browser-tests.mjs`.
- **Acceptance:** 320px full screenshot has intact “Laboratorium” and “bahan” on natural word boundaries; test remains touch/keyboard/evidence safe at 320/390/430/768/1280. Do not claim success until the PR Chromium gate and screenshot are checked.

### P1-02 — Visual QA representation gap (CONFIRMED PROCESS GAP)

- Only Math is included as a dedicated subject route in the 26-route permanent product baseline. Other subject Journey routes are not all independently represented there.
- Even though separate browser tests cover stage order and mobile behavior, they do not replace human screenshot acceptance across the nine subject scene compositions.
- **Next:** add a nine-subject Journey Map screenshot matrix with current/locked/completed states and desktop/390px; include direct named variant captures for Iqro, creative workspaces and audio content. Keep QA-only setup fail-closed and preserve canonical progression.

### P2-01 — Investigation Board information hierarchy still dense at 390px (REVIEW CANDIDATE)

- `390-investigation-board-idle.png` displays a stage title, a second large “Papan penyelidikan” heading, explanatory sentence, four-step process rail, scenario and focus text, choices, and an additional instruction/status strip.
- This is not a technical failure and instructions may be curriculum-relevant. It is a **child UX/design review request**, not authorization to remove learning evidence or text.
- Proposed review: visually emphasize the active task and use progressive disclosure for supporting explanations **only after objective/age/curriculum review**.

### P2-02 — Material Lab first-action visibility at 320/390px (REVIEW CANDIDATE)

- `320-material-lab-idle.png` and `390-material-lab-idle.png`: the test bench/button starts near or below the bottom of the first captured screen. Vertical scroll may be intentional; no clipping or broken interaction is established.
- Measure scroll distance and consider compacting header/bench on narrow screens without shrinking 44px targets.

### P2-03 — Public child entry first-fold discovery (REVIEW CANDIDATE)

- `visual-baseline/390x844-public-root.png`: primary “Ayo mulai” CTA is above the fold, while the three experience choices begin at the bottom edge. This meets entry conversion but may still bury direct subject discovery.
- Owner visual review at 100% zoom should determine whether to shorten the hero illustration further. Do not silently remove the five-character ensemble.

### P2-04 — Pattern/content diversity and content rights (ONGOING SEPARATE TRACK)

- Letters `symbol_hunt` 64/100; Iqro `choice_grid` 58/100. Consider repetitive experience across long sessions, but never diversify mechanics merely to raise a pattern count.
- Car/towel/raincoat semantic visual fallbacks remain subject to the previously documented rights/provenance gate. Do not import replacements without approval.

## 4. Required acceptance for the active P1 patch

1. PR CI all seven blocking gates PASS; inspect the 320 Material Lab screenshot, not just the test status.
2. Confirm no new 320/390/430 overflow, unexpected word-fragmentation, answer/assessment drift, completion or audio change.
3. Merge with exact head SHA only if success. Verify merged SHA via Cloudflare smoke and then owner 320px/Safari visual acceptance.
4. Preserve existing authority: 9 subjects, 46 Stages, 900 activities, real attempts/mastery, nine World boundaries, Motion Engine, Shop, auth/DB, and characters.

## 5. Suggested next isolated QA waves

- **VQA-01:** material heading P1 and a regression guard (this branch).
- **VQA-02:** nine-subject × desktop/phone Journey Map visual matrix, non-invasive to runtime.
- **VQA-03:** child readability hierarchy across representative audio, matching, reasoning, science, creative families; distinguish pedagogy from paint.
- **VQA-04:** real iOS Safari + desktop sign-off and specific P1/P2 refinements based on those screenshots.

**Audit closure rule:** passing CI means engineering tests have passed. An issue is “visually accepted” only after actual screenshot and/or physical-device review, not because 900 activities were classified.
