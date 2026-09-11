# Mainlagi Hub — Current State

Last reviewed: 11 September 2026

This is the canonical human/AI handoff. `main` is the implementation source of truth; commit SHAs below are verification snapshots.

## Canonical baseline

- repository: `ceritaantarkita-req/mainlagi-hub`;
- canonical branch: `main`;
- production: `https://mainlagihub.my.id/`;
- deployment: GitHub `main` -> Cloudflare Git integration -> OpenNext Worker `mainlagi-hub`;
- canonical Supabase project: `estvtgflwkebomsqlolv`, `ap-southeast-1`;
- source license: `AGPL-3.0-only`.

## Latest verified engineering production baseline

**Batch 17 engineering final acceptance is complete in production. Full product acceptance remains externally blocked by physical-device evidence and one GitHub ruleset administration action.**

Latest implementation:

```text
PR:                     #82
main SHA:               d27b32124d3df1613c648132aa2f1ff0ed94ebaa
main CI:                #322
Ubuntu quality:         success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Exact-SHA smoke:        success
```

Batch 17 added the permanent `test:batch17:final` release contract. CI reports:

```text
subjects:     9
activities:   900
assessed:     683
practice:     217
stages:       46
lessons:      197
packs:        197
skills:       200
engineering:  PASS
physical-device certification: PENDING_EXTERNAL_EVIDENCE
```

Detailed evidence: `EXPANSION_BATCH17_ENGINEERING_ACCEPTANCE_2026-09-11.md`.

## Catalog and learning baseline

The final repository and live database remain aligned:

| Subject | Playable | Assessed | Practice | Active skills |
| --- | ---: | ---: | ---: | ---: |
| Bahasa Indonesia | 100 | 99 | 1 | 23 |
| English | 100 | 100 | 0 | 23 |
| Math | 100 | 98 | 2 | 22 |
| Iqro | 100 | 99 | 1 | 22 |
| Letters / Menulis | 100 | 87 | 13 | 25 |
| Logic / Logika | 100 | 100 | 0 | 22 |
| Science / Sains | 100 | 100 | 0 | 22 |
| Coloring / Mewarnai | 100 | 0 | 100 | 21 |
| Drawing / Menggambar | 100 | 0 | 100 | 20 |

Totals:

- 9 first-class subjects / 9 paths;
- 46 stages;
- 197 lessons;
- 197 versioned content packs;
- 900 activities;
- 683 assessed / 217 practice;
- 200 active skills;
- 8 manifest mechanics.

Runtime inventory:

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

Batch 17 verifies globally unique activity/stage/lesson/pack IDs and exact one-pack coverage for every activity.

## Evidence/mastery boundaries

These remain non-negotiable:

- mastery states remain `not_started -> exploring -> developing -> proficient -> mastered`;
- assessed mastery requires qualifying measured assessed evidence;
- one perfect qualifying attempt remains at most `exploring`;
- rapid replay and excessive retries cannot farm mastery;
- measured all-wrong interaction is accuracy `0` evidence;
- missing measurement fails closed to completion-only;
- practice/completion-only activity cannot manufacture assessed mastery, certificates, or synthetic creative mastery;
- generic Latin tracing remains completion-only practice until a validated glyph-shape evaluator exists;
- Drawing/Coloring remain `practice` + `completion_only_v1`;
- motion remains opt-in;
- all active Iqro packs remain `expert_required`, not `expert_approved`.

## Adaptive/reporting state

Batch 15 remains production-closed:

- Adaptive Learning V2 is used by recommendation consumers across all nine subjects;
- remediation can prefer alternate same-skill variants instead of immediate exact replay;
- Parent reporting remains bounded by subject/stage/skill summaries and capped recent attempts;
- creative-only subjects do not receive synthetic mastery percentages;
- the scale regression exercises 1,200 attempts with `<64 KiB` Parent-report payload and `<5s` report + nine-subject adaptive sweep budget.

## Batch 16 automated hardening

Automated Batch 16 work is production-complete:

- production JavaScript budgets are permanent CI gates;
- verified baseline: largest static chunk 0.35 MiB, total static JS 2.03 MiB, root/main JS 0.42 MiB;
- MediaPipe executable loading remains dynamic/lazy;
- remote TTS is not eagerly initialized;
- Chromium QA covers release widths plus reduced motion, alt/form labels, keyboard focus, `aria-hidden` focusability, overflow, touch targets, and eager MediaPipe/TTS network checks;
- security regression gates protect credential boundaries, reviewed raw-HTML sinks/sanitization, SECURITY DEFINER search paths, RPC grants, credential-free account-bound outbox state, and server-only service-role access.

The automated portion is not equivalent to physical-device certification.

## Canonical Supabase verification — Batch 17

Project `estvtgflwkebomsqlolv` was rechecked and is `ACTIVE_HEALTHY`.

Live database verification:

- 900 active and 900 unique activity IDs;
- 683 assessed / 217 practice;
- 9 subjects, each exactly 100 activities;
- 46 distinct stages / 197 distinct lessons;
- 197 referenced, active, and unique content packs;
- 200 active and unique skills;
- runtime inventory matches repository exactly;
- creative evidence drift = 0;
- Drawing runtime drift = 0;
- Coloring runtime drift = 0;
- 22 active Iqro packs are `expert_required`; 0 are `expert_approved`.

Latest migration registry remains Batch 14 Wave D. Batches 15–17 require no migration/DDL.

Live RLS is enabled on `player_profiles`, attempts, evidence, mastery, progress, achievements, and certificates. `learning_attempt_child_ownership` remains installed on `learning_attempts`.

Live `record_learning_attempt(...)` remains `SECURITY DEFINER`, has `search_path=public`, is executable by `authenticated`, and is not executable by `anon` or `public`.

Advisor state:

- security: exactly two known WARN categories remain — intentional authenticated SECURITY DEFINER RPC execution and leaked-password protection disabled;
- performance: 17 `unused_index` INFO findings, no WARN regression.

## CI and release governance

CI now permanently covers:

- structure/assets/source audit;
- Batch 16 security regression;
- typecheck/lint;
- engine + full learning suite;
- simulations;
- Batch 17 final acceptance contract;
- Windows compatibility;
- Chromium responsive/accessibility/lazy-load QA;
- Cloudflare/OpenNext build + JS budgets;
- production dependency audit;
- full-history Gitleaks scan;
- exact-SHA Cloudflare smoke on `main`.

The active `Protect main` ruleset requires four checks: Production build, Ubuntu quality, Windows compatibility, and dependency audit. `Secret history scan` runs and passes but is not yet mandatory in the ruleset.

## External acceptance still open

Canonical tracker: **issue #83 — `Final external acceptance: physical-device QA and required secret-scan check`**.

Two external conditions remain:

1. `BATCH16_PHYSICAL_DEVICE_QA.md` still needs actual representative physical iPhone/Safari and Android/Chrome evidence for camera, audio/TTS, finger trace/drawing/coloring, safe areas/orientation/keyboard, VoiceOver/TalkBack/text scaling, and offline/reconnect/session isolation;
2. GitHub repository Settings must add `Secret history scan` to the active `Protect main` required-status-check list, or that governance difference must be explicitly accepted and documented.

Neither condition can be truthfully manufactured by GitHub-hosted headless CI. The connected GitHub API can inspect but cannot modify ruleset administration.

## Engineering status

- Batches 0–14: complete at documented engineering/catalog scopes; Iqro expert review remains separate;
- Batch 15: **COMPLETE IN PRODUCTION**;
- Batch 16 automated hardening: **COMPLETE IN PRODUCTION**;
- Batch 16 physical-device acceptance: **PENDING EXTERNAL EVIDENCE**;
- Batch 17 engineering final-acceptance gate: **COMPLETE IN PRODUCTION**;
- full Batch 16/17 product acceptance: **PENDING issue #83**.

Do not relabel the final line as COMPLETE until issue #83's external acceptance conditions are actually resolved or explicitly accepted as reviewed exceptions.