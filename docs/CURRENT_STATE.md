# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth; open PR status is called out explicitly below.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: **Pattern #34 — Bahasa `initial_sound`**
- Pattern #34 implementation PR: **#147**
- Pattern #34 closure PR: **#148**
- Pattern #34 final verified `main`: `8bfb0027a5f4963a6875310c7408cb56018cc422`
- Pattern #34 final CI: **#717 / run `35074306579`**, full success including Cloudflare production smoke
- active implementation: **Pattern #35 — Bahasa `picture_word_match`**
- Pattern #35 implementation PR: **#149**
- accepted implementation code head before canonical docs: `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca`
- accepted implementation CI: **#718 / run `35082720001`**, full PR success
- Pattern #35 status: **QA ACCEPTED / UNMERGED**

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, permanent gameplay-distribution audit, simulations, Batch17 and production smoke on `main`.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Verified merged on `main`: 34 patterns

Final Pattern #34 baseline remains:

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    34
choice_grid               292 / 900 = 32.44%
initial_sound               3 / 900 = 0.33%
Bahasa choice_grid          44 / 100
```

### Pattern #35 accepted PR candidate: 35 patterns

Exact CI #718 distribution artifact from PR #149:

```text
classified:               900 / 900
unclassified:               0
active candidate patterns: 35
choice_grid               287 / 900 = 31.89%
picture_word_match          5 / 900 = 0.56%
initial_sound               3 / 900 = 0.33%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          39 / 100
Math choice_grid            43 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

No global gameplay hotspot exceeds the advisory 35% threshold. Subject-level concentration remains advisory. If Pattern #35 merges, remaining distance becomes **15** patterns to minimum 50 and **25** to working target 60.

## Pattern #35 `picture_word_match` — QA ACCEPTED / UNMERGED

Exact scope:

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

All five remain assessed `tap_choice` activities in stage `bahasa-suku-kata-kata`, lesson `bahasa-kata-gambar`, pack `bahasa.pack.kata-gambar`, canonical skill `bahasa.kata.picture_matching`, with exactly three canonical lowercase word choices and unchanged `correctChoice`.

Explicit exclusions:
- `bahasa-pasang-kata-*` remains canonical `visible_matching`;
- `syllable_assembly`, audio word recognition, `initial_sound`, English, Math and every other subject/family remain unchanged;
- content seeds, IDs, stars, assessment, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- presents the existing familiar object as a large visual clue;
- asks the child to match that visual object to one of the unchanged canonical word choices;
- selected word result stays masked as `?` until a correct assessment;
- keyboard/touch/pointer direct selection remains available; no drag-only dependency;
- wrong choice records assessed incorrect/retry, cannot complete and cannot reveal the canonical word;
- correct choice completes the canonical activity and reveals the canonical word;
- assessed fidelity `choice_picture_word_match_interaction`;
- runtime metadata source `picture-word-match-runtime` with `picture`, `word`, and `selectedChoice`.

Acceptance evidence so far:
- implementation branch was created exactly from Pattern #34 final `main` SHA `8bfb0027a5f4963a6875310c7408cb56018cc422`;
- PR #149 code head `e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca` passed full CI #718 / run `35082720001`;
- Ubuntu passed typecheck, lint, engine/learning regressions, deterministic quality, 900/900 gameplay distribution, simulations and Batch17;
- Windows compatibility, production build, dependency audit and secret-history scan passed;
- Chromium mobile/accessibility/browser matrix passed;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots were manually reviewed and accepted: no horizontal clipping, feedback and CTA remain visible, wrong state retains `?`, success reveals `apel`;
- deterministic quality remains **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**.

Pattern #35 is **not merged and not closed**. Remaining implementation gates: canonical docs on PR #149 -> fresh exact docs-head CI -> clean exact-head review/thread/mergeability/scope gate -> squash merge -> independent live `main` verification + Cloudflare smoke -> separate docs-only closure PR -> closure CI/gate/merge -> final `main` + Cloudflare verification.

## Pattern #34 `initial_sound` — FULLY CLOSED

Pattern #34 implementation PR #147 and closure PR #148 are complete. Closure head `fadef258d11e386491df5c112dab7221b097213d` passed CI #716 / run `35073594364`. Final verified `main` is `8bfb0027a5f4963a6875310c7408cb56018cc422`; final CI #717 / run `35074306579` passed Ubuntu, Windows, production build, dependency audit, secret-history scan, Chromium QA and **Cloudflare production smoke**.

## Pattern #33 `equal_groups` — FULLY CLOSED

Pattern #33 implementation PR #145 and closure PR #146 are complete. Final verified `main` before Pattern #34 was `0f90a7fae1164ae6ace86f993024cef7b4989ca9`; final CI #700 / run `35058250562` passed all gates including Cloudflare production smoke.

## Learning/mastery boundaries

Non-negotiable unless explicitly redesigned with migration/tests:
- mastery: `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured evidence;
- one perfect attempt cannot jump straight to mastery;
- retry/rapid replay cannot farm mastery;
- practice/completion-only cannot manufacture assessed mastery;
- Drawing/Coloring stay creative practice;
- legacy game scores stay separate from academic mastery;
- motion remains optional input/context;
- Iqro remains `expert_required`, not `expert_approved`.

## Current priority order

1. Finish Pattern #35 implementation PR #149 through fresh canonical docs-head CI, clean exact-head gate, exact-head merge and live `main` + Cloudflare verification.
2. Complete separate docs-only Pattern #35 closure and final verification before calling Pattern #35 fully closed.
3. Only after Pattern #35 is fully closed, run a fresh objective/evidence audit for Pattern #36; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns, plus Art Bible, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
