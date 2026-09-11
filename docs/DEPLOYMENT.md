# Mainlagi Production Deployment

Last reviewed: 11 September 2026

## Canonical production architecture

```text
GitHub (`ceritaantarkita-req/mainlagi-hub`)
  -> `main`
  -> Cloudflare Git integration / build
  -> OpenNext for Cloudflare Workers
  -> Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

There is **no VPS/SSH production deployment path** for Mainlagi. Normal publication is Cloudflare-side Git integration from branch `main`.

- repository: `ceritaantarkita-req/mainlagi-hub`;
- production branch: `main`;
- build: `npm run build:cloudflare`;
- Worker: `mainlagi-hub`;
- custom domain: `mainlagihub.my.id`.

Manual local Wrangler deployment remains operator fallback only.

## Commit-aware production smoke

Mainlagi bakes release SHA/branch into the server artifact and exposes non-secret release/backend metadata through `/api/health`.

On pushes to `main`, `Production smoke (Cloudflare)` succeeds only when production reports:

- the exact current `github.sha`;
- branch `main`;
- canonical site URL `https://mainlagihub.my.id`;
- backend `supabase`;
- Supabase project ref `estvtgflwkebomsqlolv`.

## Latest verified production implementation

**Batch 15 — Adaptive/mastery/report scaling across the 900-activity catalog is production-complete.**

```text
Batch:                 Batch 15 — Adaptive/mastery/report scaling
Implementation PR:     #78
PR head:               c5ca9c186c810e5ba219169c0dd387d744b13bf7
PR CI run:              #311
Main implementation:   58e5d14633dd3d105f383f56e016c61c9104a892
Main CI run:            #312
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The final implementation smoke verified the exact SHA `58e5d14633dd3d105f383f56e016c61c9104a892` on the public Cloudflare deployment with the canonical Supabase backend.

Batch 15 did not require a database migration or DDL. It changed application recommendation/reporting behavior only; the canonical schema and content catalog remain unchanged.

Dedicated Batch 15 PR CI benchmark:

```text
Synthetic attempt history: 1,200 attempts
Recommendation sweep:      all 9 subjects
Measured sweep time:       72.8 ms
Bounded Parent report:     7,937 bytes serialized
CI guard:                  < 5,000 ms / < 65,536 bytes
```

Detailed closure evidence: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

Batch 14 remains the final content-expansion release; its implementation SHA is `b273edc282261bbec89b0c3d438822204cd925e5`.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization and release-metadata baking.
- `src/app/api/health/route.ts` — public/non-secret release/backend health metadata.
- `package.json` — Cloudflare commands plus the full learning/Batch15 regression chain.

## GitHub CI responsibilities

GitHub Actions validates; Cloudflare deploys. Primary jobs are:

- `Production build`;
- `Quality gate (Ubuntu)` including engine/learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)` on `main`.

Batch 15 adds `test:learning:batch15` to the canonical learning/engine gate rather than introducing a separate optional workflow.

The active `Protect main` ruleset currently requires `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, and `Production dependency audit`. `Secret history scan` runs successfully but is not yet a required status check; see `ACCOUNT_LEVEL_ACTIONS.md`.

## Canonical Supabase dependency

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- status: active/healthy.

Applied migration chain remains through Batch 14 Wave D:

```text
0043_batch14_creative_wave_a.sql
0044_batch14_creative_wave_b.sql
0045_batch14_creative_wave_c.sql
0046_batch14_creative_wave_d.sql
```

There is intentionally **no Batch 15 migration** because persistence/schema/catalog rows are unchanged.

Live post-Batch15 verification:

- 900 active learning activities;
- 683 assessed / 217 practice globally;
- all nine subjects exactly 100 activities;
- Drawing exactly 100 practice activities;
- Coloring exactly 100 practice activities;
- 200 active skills;
- 197 active content packs;
- zero active creative activities with assessed/non-completion evidence drift;
- zero Drawing/Coloring runtime-mechanic drift.

Current runtime inventory remains:

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

## Batch 15 integrity and scaling release behavior

Production recommendation consumers now use one Adaptive V2 policy across child and Parent surfaces. Recommendation priority can use same-skill variant diversity, confidence, spacing, recent repeats, measured frustration, age, stage, difficulty, and motion opt-in; it does not mutate mastery merely to change priority.

Parent Progress/Reports are bounded summaries rather than raw catalog/history dumps. Mastery summaries are assessed-only. Drawing/Coloring remain reportable completion-only practice with no synthesized mastery percentage.

Full creative completion is regression-tested not to satisfy academic certificate mastery eligibility.

Important pre-existing boundaries remain unchanged:

- child ownership/isolation and durable account-bound outbox remain canonical;
- generic Latin traces remain completion-only practice;
- all active Iqro packs remain `expert_required` pending competent human review;
- Science remains age-appropriate and does not rely on unsafe unsupervised experiments;
- creative practice cannot fabricate academic or creative mastery.

## Advisor state

After Batch 15 implementation, despite no DDL, advisors were rechecked:

- security advisor: the same two known WARN findings remain:
  - authenticated execution of `SECURITY DEFINER` `public.record_learning_attempt(...)`, intentional for the guarded attempt-recording RPC boundary;
  - leaked-password protection disabled under the current Supabase configuration/plan;
- performance advisor: 17 `unused_index` INFO findings; no WARN-level performance regression.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Production verification checklist

For a behavioral batch such as Batch 15:

1. focused branch/PR;
2. full type/lint/engine/learning/simulation/security/build/mobile gates;
3. explicit confirmation whether persistence changes exist;
4. live database/catalog drift verification even when no migration is required;
5. advisor review;
6. immutable-head squash merge;
7. exact-SHA Cloudflare production smoke;
8. canonical docs closure and final docs exact-SHA smoke.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. Because Batch 15 has no DB migration, rollback does not require a data/schema reversal. Do not reintroduce a VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
