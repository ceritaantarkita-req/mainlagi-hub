# Mainlagi Hub — Current State

Last reviewed: **16 September 2026**

This is the canonical human/AI handoff. `main` is the merged source of truth.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`
- canonical branch: `main`
- production: `https://mainlagihub.my.id/`
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker
- source licence: `AGPL-3.0-only`
- latest fully closed gameplay: Pattern #32 — Math `take_away`
- Pattern #32 implementation PR: #143
- Pattern #32 closure PR: #144
- Pattern #32 final closure head: `a019a549f7685e0eac7aba0554a1c6d839bfb0d4`
- Pattern #32 closure CI: #683 / run `35049573890`, full success
- Pattern #32 final verified `main` SHA: `63285c6dd39b0cc1a521b042a492a83338bb2582`
- Pattern #32 final post-closure `main` CI: #684 / run `35049954680`, full success including Cloudflare production smoke
- Pattern #32: **FULLY CLOSED**
- active implementation: Pattern #33 — Math `equal_groups`, PR #145
- Pattern #33 accepted code head: `26c2b2355099c4097c015ba5767703035b33aa63`
- Pattern #33 accepted code-head CI: #687 / run `35053008065`, full success
- Pattern #33: **QA ACCEPTED / UNMERGED**

## Engineering status

No known P0 engineering blocker is open on merged `main`. CI covers Ubuntu quality gate, Windows compatibility, production build, dependency audit, Chromium mobile-route QA, secret-history scan, learning/mastery regressions, build budgets, source/security audits, deterministic activity-quality audit, permanent gameplay-distribution audit, simulations, Batch17 and production smoke on `main`.

External physical-device acceptance, accessibility-specialist review, human art/pedagogical acceptance, and Iqro expert acceptance remain separate and incomplete. Physical-device certification remains `PENDING_EXTERNAL_EVIDENCE`.

## Learning/catalog baseline

Totals remain **9 subjects, 900 activities, 683 assessed, 217 practice, 46 stages, 197 lessons, 197 packs, 200 skills.** Runtime totals remain `tap_choice` 481, `listen_and_choose` 76, `matching` 125, `trace` 14, `story` 1, `motion_game` 3, `coloring` 100, `drawing` 100.

Runtime count is not gameplay-pattern count.

## Gameplay variation state

Target: minimum **50**, working target **60 meaningful patterns**.

### Merged `main` baseline: 32 patterns

Pattern #32 `take_away` is fully closed. Merged distribution on exact `main` SHA `63285c6dd39b0cc1a521b042a492a83338bb2582` remains:

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    32
choice_grid               298 / 900 = 33.11%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Math choice_grid            46 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

### Pattern #33 PR-head accepted distribution: 33 patterns

If PR #145 merges unchanged, gameplay distribution is:

```text
classified:               900 / 900
unclassified:               0
active patterns:           33
choice_grid               295 / 900 = 32.78%
equal_groups                3 / 900 = 0.33%
make_total                  5 / 900 = 0.56%
take_away                   5 / 900 = 0.56%
Math choice_grid            43 / 100
Bahasa choice_grid          47 / 100
Science choice_grid         56 / 100
Logic choice_grid           47 / 100
English choice_grid         44 / 100
Iqro choice_grid            58 / 100
```

Remaining distance after Pattern #33 would be **17** patterns to minimum 50 and **27** to working target 60.

## Pattern #33 `equal_groups` — QA ACCEPTED / UNMERGED

Exact scope:

```text
math-group-6-by-2
math-group-8-by-2
math-group-9-by-3
```

Canonical boundaries:
- subject `math`;
- stage `math-operasi-awal`;
- lesson `math-grouping`;
- pack `math.pack.grouping`;
- canonical skill `math.grouping.equal_groups`;
- assessed runtime remains `tap_choice`;
- exactly three canonical numeric choices and unchanged `correctChoice`;
- the two canonical grouping matching activities `math-group-match-2s` and `math-group-match-3s` remain `visible_matching` and are explicitly outside this mechanic;
- missing-number, addition, subtraction, length/size, existing Math specialized families and all non-Math families remain outside scope;
- activity IDs, content, assessment, stars, mastery, progression, schema and migrations remain unchanged.

Interaction/evidence contract:
- renders the reviewed total as visibly separated equal-size groups;
- validates a positive proper `groupSize`, exact divisibility, total <=10, and `totalCount / groupSize === Number(correctChoice)`;
- keeps the numeric group count masked as `?` before a correct assessment;
- canonical keyboard/touch/pointer direct-selection choices remain unchanged;
- wrong choice records assessed error/retry, cannot complete and cannot reveal the group count;
- correct choice completes the canonical activity and reveals the canonical group count;
- no changed answer set, extra confirmation, drag-only dependency or intermediate assessment;
- assessed fidelity `choice_equal_groups_interaction`;
- runtime metadata source `equal-groups-runtime` with `totalCount`, `groupSize`, `groupCount` and `selectedChoice`.

QA evidence:
- first implementation CI #685 / run `35052200287` correctly failed because the success CTA was clipped at 320x720;
- fix head `8c15144db99feb1620a2523d5ccd384510354cd5` preserved the hard browser assertion, but CI #686 / run `35052577160` then correctly exposed idle feedback clipping at 390x844;
- final responsive fix head `26c2b2355099c4097c015ba5767703035b33aa63` preserved >=48px phone choice targets and compacted only redundant/spacing content;
- full CI #687 / run `35053008065` passed Ubuntu, Windows, production build, dependency audit, secret-history scan and the full Chromium mobile/browser matrix;
- dedicated static regression passed for the exact three-activity family;
- all nine 320x720, 390x844 and 768x1024 idle/wrong/success screenshots passed manual visual review;
- deterministic quality remained **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE / structural findings 0**;
- gameplay-distribution audit reported **33 active patterns / 900 classified / 0 unclassified / no global hotspot**.

Pattern #33 is **not fully closed**. Remaining gates: canonical docs on PR #145 -> fresh exact docs-head full CI -> clean review/thread/mergeability gate -> exact-head squash merge -> independent live `main` verification + post-merge Cloudflare smoke -> separate docs-only closure PR -> exact closure-head CI/gate/merge -> final live-main verification + Cloudflare smoke.

## Pattern #32 `take_away` — FULLY CLOSED

Pattern #32 implementation PR #143 merged as `3ac5ab049e94f65c3e28a7e4e5cbd18185a9466a`; post-implementation `main` CI #677 / run `35048981508` passed including Cloudflare smoke. Docs-only closure PR #144 head `a019a549f7685e0eac7aba0554a1c6d839bfb0d4` passed CI #683 / run `35049573890`, then exact-head squash merged as final `main` SHA `63285c6dd39b0cc1a521b042a492a83338bb2582`. Final post-closure `main` CI #684 / run `35049954680` passed all gates including Cloudflare production smoke.

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

1. Finish Pattern #33 implementation PR #145: canonical docs -> fresh docs-head CI -> clean exact-head merge gate -> exact-head merge -> independent `main` verification -> post-merge `main` CI + Cloudflare production smoke.
2. Create and finish Pattern #33 docs-only closure PR with fresh exact closure-head CI, clean exact-head merge gate, final `main` verification and final Cloudflare smoke.
3. Only after Pattern #33 is fully closed, run a fresh objective/evidence audit for Pattern #34; no family is pre-approved.
4. Continue search/scene, audio, ordering, puzzle/path, literacy, creative and story mechanics toward 50–60 meaningful patterns.
5. Continue Art Bible/permanent visual QA, narration, parent/public frontend, external acceptance and governance.

Do not prioritize activity-count expansion, OCR, major AI tutor work, subscription/paywall, or mastery/backend rewrites before this quality phase is substantially complete.
