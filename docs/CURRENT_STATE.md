# Mainlagi Hub — Current State

Last reviewed: **14 September 2026**

This is the canonical human/AI handoff for the current repository state. `main` is the implementation source of truth. Historical audit/redesign documents describe the state at the time they were written and must not override this file.

> Documentation note: the synchronized current-state wording in this branch is part of WS-01 / PR #88 and becomes the repository canonical text after that PR is merged.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- current main SHA: `25c83840b74c4eca1dd3d3b71e888f7dfc4d8b21`
- merged change: PR #87 — `Redesign child learning experience and product QA`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`
- source licence: `AGPL-3.0-only`

PR #87 is **merged**. Its Garden/Playroom redesign is no longer a local-only candidate. Post-merge CI #350 and exact-SHA Cloudflare smoke completed successfully for the merge SHA.

## Current engineering status

No known P0 engineering blocker was found in the post-merge audit.

Current CI coverage includes:

- Ubuntu quality gate;
- Windows compatibility;
- production build;
- production dependency audit;
- mobile route QA in Chromium;
- secret-history scan;
- exact-SHA Cloudflare production smoke;
- learning/mastery regression suites;
- build budgets and source/security audits.

External acceptance is still incomplete; see `External acceptance still open` below.

## Current learning/catalog baseline

| Subject | Activities | Assessed | Practice |
| --- | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 |
| English | 100 | 100 | 0 |
| Matematika | 100 | 98 | 2 |
| Iqro | 100 | 99 | 1 |
| Huruf & Menulis | 100 | 87 | 13 |
| Logika | 100 | 100 | 0 |
| Sains | 100 | 100 | 0 |
| Mewarnai | 100 | 0 | 100 |
| Menggambar | 100 | 0 | 100 |

Totals:

- 9 subjects / learning paths;
- 900 activities;
- 683 assessed / 217 practice;
- 46 stages;
- 197 lessons;
- 197 active content packs;
- 200 active skills.

Current runtime inventory:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 100 |
| `drawing` | 100 |

## Current frontend state

The current child experience includes:

- Garden/Playroom visual system;
- persistent active-child state;
- continue-learning/recommendation flow;
- redesigned home/navigation/subject/stage/activity surfaces;
- subject activity gallery;
- stage/progression route guard;
- redesigned coloring interaction with palettes, undo/reset, keyboard support and larger hit areas;
- drawing scaffolding where available;
- improved audio route/session handling;
- activity previews;
- Nunito UI typography and Phosphor icons.

The current visual implementation is the baseline for the next product-quality phase. Do not revert to the pre-PR #87 interface unless a specific regression proves necessary.

## Learning/mastery boundaries

These remain non-negotiable unless explicitly redesigned with tests and migration review:

- mastery states: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one qualifying perfect attempt remains at most `exploring`;
- retries/rapid replays cannot farm mastery;
- practice/completion-only activities cannot manufacture assessed mastery;
- Drawing and Coloring remain `practice` + completion-only semantics;
- legacy game scores remain separate from academic mastery;
- motion is optional input/context, not inherently stronger evidence;
- all active Iqro packs remain `expert_required`, not `expert_approved`.

## Adaptive/reporting state

Adaptive Learning V2 remains the active recommendation/reporting foundation across the nine subjects. Recommendation considers age compatibility, stage availability, incomplete core work, weak skills, replay avoidance and optional motion preference.

Parent reporting remains bounded and explainable. Creative-only subjects must not receive synthetic mastery percentages.

## Product-quality gaps now prioritized

The main remaining gap is **product depth/coherence**, not the core evidence engine.

Canonical next work is defined in `NEXT_PRODUCT_QUALITY_PLAN.md` and includes:

1. sync canonical documentation;
2. reconcile stage progression with the current 100-card gallery UX;
3. audit/redesign all 900 activities for pedagogical validity and meaningful variety;
4. expand runtime/mechanic variety only where it measures the intended skill better;
5. rebuild weak/duplicate Coloring and Drawing visuals;
6. create a Mainlagi art-direction/visual-QA gate;
7. implement licensed/reviewed native-feeling Indonesian and English narration architecture;
8. update About/FAQ and make parent-facing affiliate recommendations discoverable;
9. finish physical-device/accessibility/Iqro acceptance;
10. harden repository governance.

Do **not** prioritize increasing activity count, OCR, large AI features, subscription/paywall work, or a mastery rewrite before this phase is substantially complete.

## Known content/visual issues

The 900-route inventory must not be interpreted as 900 equally strong experiences.

Verified issues include:

- large concentration in `tap_choice` and `matching` mechanics;
- activities where representation does not match the intended learning objective;
- trivial/repetitive distractors and prompt patterns;
- Coloring scenes with duplicate/near-duplicate compositions;
- complex procedural/vector scenes that can become visually messy;
- Drawing activities with inconsistent visual scaffolding;
- current narration infrastructure without a final reviewed native Indonesian/English voice identity.

These are now first-class product issues, not cosmetic backlog.

## Stage progression vs gallery

The data/progression model remains stage-based, while the current subject frontend can expose a flat 100-card activity gallery with locked/age-ineligible entries visible.

This is an intentional unresolved product decision. The next phase must choose and document one coherent child model, such as:

- stage-first;
- recommended path + browse all;
- gallery grouped by stage;
- another validated hybrid.

Do not remove stage/evidence rules merely to simplify the screen.

## Public/parent frontend

`/about`, `/faq`, and affiliate/product infrastructure already exist, but the About/FAQ copy is stale and the product recommendation surface is not sufficiently discoverable from primary navigation.

Affiliate links must remain outside the child learning flow and must retain clear disclosure.

## Voice/audio

Current audio/TTS infrastructure exists, but Mainlagi does **not** yet claim production-quality native Indonesian and English character narration.

Target architecture:

```text
Narration contract
  -> provider/voice registry
      -> pre-generated reviewed audio for fixed content
      -> runtime TTS only for justified dynamic content
```

Engine/model/voice licences and provenance must be checked individually. Iqro pronunciation requires competent human review rather than generic TTS approval.

## External acceptance still open

Canonical tracker: issue #83 — `Final external acceptance: physical-device QA and required secret-scan check`.

Still required:

- representative physical iPhone + Safari validation;
- representative Android + Chrome validation;
- real touch/trace/drawing/coloring behavior;
- audio/TTS behavior;
- camera permission/alignment/orientation/recovery/denial flows;
- reduced motion, text scaling, VoiceOver/TalkBack;
- offline/reconnect/session isolation;
- competent Iqro content/pronunciation review;
- repository decision/action for making `Secret history scan` a required main check.

Headless CI cannot truthfully replace these external checks.

## Repository governance

The active main ruleset requires PR-based changes and currently requires four status checks:

- Production build;
- Quality gate (Ubuntu);
- Windows compatibility;
- Production dependency audit.

`Secret history scan` runs in CI but is not yet a required main status check. Required approving review count is currently zero. These are governance gaps to review, not application-runtime defects.

## Source of truth for next work

Every developer/AI agent working on the next product-quality phase must read:

1. `docs/NEXT_PRODUCT_QUALITY_PLAN.md`
2. this file;
3. `docs/ARCHITECTURE.md`;
4. `docs/MAINLAGI_LEARNING_PLATFORM_UX_SPEC.md`;
5. the specific subsystem docs affected by the task.

Completed work is not considered closed until related canonical docs and the execution log are updated.
