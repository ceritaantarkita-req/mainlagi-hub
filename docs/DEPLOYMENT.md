# Mainlagi Production Deployment

Last reviewed: 22 September 2026

## Canonical production architecture

```text
GitHub `ceritaantarkita-req/mainlagi-hub`
  -> main
  -> Cloudflare Git integration
  -> OpenNext Cloudflare Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
  -> canonical Supabase `estvtgflwkebomsqlolv`
```

There is no canonical VPS/SSH production path.

## Commit-aware production smoke

On pushes to `main`, `Production smoke (Cloudflare)` succeeds only when production reports:

- exact current `github.sha`;
- branch `main`;
- site URL `https://mainlagihub.my.id`;
- backend `supabase`;
- Supabase project ref `estvtgflwkebomsqlolv`.

## Latest verified production release

Current production `main` is the repository-governance hardening merge from PR #269:

```text
PR:                       #269
Current main:             6fd9e3fc7ffa57aab687b5529033f1a995e0e5ba
PR CI:                    #1208 / run 35625095287 — success
Merged-main CI:           #1209 / run 35625953536 — success
Production smoke:         PASS, exact SHA
Required secret gate:     PASS inside Production dependency audit
```

The latest application-data integrity change remains PR #267 (`89a2bc629e...`), which closed cloud analytics pagination/failure-state defects. PR #269 changes CI/governance only; it does not change application runtime behavior.

Batch 17 engineering/device-QA foundations remain valid historical prerequisites.

## Guided physical-device QA route

The production release now contains:

```text
https://mainlagihub.my.id/qa/device
```

This hidden/noindex route mirrors the 22 canonical physical tests in `BATCH16_PHYSICAL_DEVICE_QA.md`. It records test status and non-secret device/browser context locally, persists an in-progress session in localStorage, and can export JSON or copy a summary.

The route intentionally does not:

- upload evidence;
- access authentication/session credentials;
- automatically request camera or microphone permission;
- turn headless/emulated checks into physical-device PASS evidence.

`test:qa:device` is a permanent CI contract protecting the route's noindex/local-only/privacy boundary, exact 22-test inventory, touch sizing, and no automatic camera/upload behavior.

## Permanent release gates

GitHub Actions now validates:

- `Production build` — OpenNext/Cloudflare artifact plus Batch 16 JS/lazy-load budgets;
- `Quality gate (Ubuntu)` — structure/assets/source, Batch 16 security regressions, physical-device QA harness contract, typecheck, lint, engine/learning tests, simulations, and Batch 17 final acceptance contracts;
- `Windows compatibility`;
- `Mobile route QA (Chromium)` — responsive/accessibility/lazy-load matrix and build budgets;
- `Production dependency audit` — ruleset-required and now includes the merge-blocking pinned full-history Gitleaks gate before dependency auditing;
- `Secret history scan` — separate pinned full-history Gitleaks visibility job;
- `Production smoke (Cloudflare)` on `main`.

`test:batch17:final` locks the final catalog counts/IDs/content-pack coverage/evidence boundaries, required learning/outbox/isolation test wiring, Batch 16 gate wiring, CI topology, and exact-SHA production-smoke contract.

## Performance baseline

Current verified production-build baseline:

| Metric | Observed | CI ceiling |
| --- | ---: | ---: |
| Largest static JS chunk | 0.35 MiB | 5 MiB |
| Total static JS | 2.03 MiB | 18 MiB |
| Root/main JS | 0.42 MiB | 2 MiB |
| App entry JS | no entry above gate | 3 MiB per entry |

MediaPipe executable loading remains lazy/dynamic and remote TTS is not eagerly initialized before interaction.

## Canonical Supabase verification

Project `estvtgflwkebomsqlolv` was rechecked during Batch 17:

```text
name:    mainlagi-hub
region:  ap-southeast-1
status:  ACTIVE_HEALTHY
```

Live state matches repository contracts:

- 900 active + unique activities;
- 683 assessed / 217 practice;
- 9 subjects, 100 activities each;
- 46 distinct stages;
- 197 distinct lessons;
- 197 active/unique/referenced content packs;
- 200 active/unique skills;
- exact runtime inventory: 481 tap_choice, 76 listen_and_choose, 125 matching, 14 trace, 1 story, 3 motion_game, 100 coloring, 100 drawing;
- creative evidence drift = 0;
- Drawing runtime drift = 0;
- Coloring runtime drift = 0;
- Iqro `expert_required` active packs = 22;
- Iqro `expert_approved` active packs = 0.

Migration registry still ends at `batch14_creative_wave_d`; Batches 15–17 and the QA harness require no DDL.

## Live ownership/security boundary

RLS is enabled on `player_profiles`, `learning_attempts`, attempt skill evidence, child mastery/progress/achievements, and certificates.

`learning_attempts` retains `learning_attempt_child_ownership`.

`record_learning_attempt(...)` is live as:

- `SECURITY DEFINER`;
- `search_path=public`;
- executable by `authenticated`;
- not executable by `anon` or `public`.

Security advisor remains at the two previously documented WARN categories: intentional authenticated SECURITY DEFINER execution and leaked-password protection disabled. Performance advisor currently has 17 `unused_index` INFO observations and no WARN regression.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Protect main status

The active ruleset currently requires:

- `Production build`;
- `Quality gate (Ubuntu)`;
- `Windows compatibility`;
- `Production dependency audit`.

`Secret history scan` runs and passes but is not yet mandatory. The connected GitHub API surface can read this ruleset but does not expose administration writes. This is tracked in issue #83 and `ACCOUNT_LEVEL_ACTIONS.md`.

## Physical-device boundary

A successful Cloudflare smoke, the guided recorder, and Chromium QA do not prove real iOS/Android camera/audio/touch behavior.

`BATCH16_PHYSICAL_DEVICE_QA.md` remains the canonical physical-hardware matrix. Use `/qa/device` on actual representative iPhone/Safari and Android/Chrome hardware, then transfer the resulting evidence into the canonical matrix/issue.

All 22 physical-device rows remain pending until those tests are actually exercised.

Canonical external tracker: issue #83 — `Final external acceptance: physical-device QA`.

## Production verification flow

```text
focused branch
  -> PR
  -> full CI
  -> migration/live DB verification where persistence changes
  -> squash merge
  -> Cloudflare Git deployment from main
  -> exact-SHA production smoke
  -> canonical docs/evidence sync
```

Repository/CI/Cloudflare/Supabase foundations through Batch 17 remain complete, and later product/UX/gameplay waves continue to use the same release flow. External physical-device/accessibility evidence in issue #83 remains pending and is not replaced by the later Chromium/Cloudflare successes.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

Never commit Cloudflare or Supabase secret values.

## Rollback

Rollback Cloudflare to a known-good Git deployment and rerun exact-SHA health/smoke verification. For additive catalog migrations, prefer forward corrective migrations rather than destructive rollback of learning history.