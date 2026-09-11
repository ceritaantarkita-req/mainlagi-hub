# Mainlagi Production Deployment

Last reviewed: 11 September 2026

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

## Latest verified production implementation

**Batch 17 engineering final acceptance is live in production. Full product acceptance remains externally pending.**

```text
Implementation PR:       #82
Git SHA:                 d27b32124d3df1613c648132aa2f1ff0ed94ebaa
Main CI:                 #322
Quality gate (Ubuntu):   success
Windows compatibility:  success
Mobile route QA:         success
Production build:        success
Dependency audit:        success
Secret history scan:    success
Production smoke:        success, exact SHA
Final acceptance gate:   PASS
Physical-device cert:    PENDING_EXTERNAL_EVIDENCE
```

Detailed evidence: `EXPANSION_BATCH17_ENGINEERING_ACCEPTANCE_2026-09-11.md`.

Batch 17 introduces no Supabase migration/DDL and no catalog/evidence-classification change.

## Permanent release gates

GitHub Actions now validates:

- `Production build` — OpenNext/Cloudflare artifact plus Batch 16 JS/lazy-load budgets;
- `Quality gate (Ubuntu)` — structure/assets/source, Batch 16 security regressions, typecheck, lint, engine/learning tests, simulations, and Batch 17 final acceptance contracts;
- `Windows compatibility`;
- `Mobile route QA (Chromium)` — responsive/accessibility/lazy-load matrix and build budgets;
- `Production dependency audit`;
- `Secret history scan` — pinned full-history Gitleaks;
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

Migration registry still ends at `batch14_creative_wave_d`; Batches 15–17 require no DDL.

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

A successful Cloudflare smoke and Chromium QA do not prove real iOS/Android camera/audio/touch behavior.

`BATCH16_PHYSICAL_DEVICE_QA.md` remains the canonical physical-hardware matrix. Actual representative iPhone/Safari and Android/Chrome evidence is still required for full product acceptance.

Canonical external tracker: issue #83 — `Final external acceptance: physical-device QA and required secret-scan check`.

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

All repository/CI/Cloudflare/Supabase steps through Batch 17 engineering acceptance are complete. Only the external acceptance items in issue #83 remain.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

Never commit Cloudflare or Supabase secret values.

## Rollback

Rollback Cloudflare to a known-good Git deployment and rerun exact-SHA health/smoke verification. For additive catalog migrations, prefer forward corrective migrations rather than destructive rollback of learning history.