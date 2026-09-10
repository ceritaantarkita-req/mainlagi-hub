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

There is **no VPS/SSH production deployment path** for Mainlagi. Previous VPS, `/srv/mainlagi`, SSH deploy-key, `MAINLAGI_VPS_*`, and `mainlagi.inmydraft.com` references are superseded.

## Cloudflare Git deployment

Normal production publication is Cloudflare-side Git integration from branch `main`.

- repository: `ceritaantarkita-req/mainlagi-hub`;
- production branch: `main`;
- build: `npm run build:cloudflare`;
- deploy command: `npx wrangler deploy`;
- Worker: `mainlagi-hub`;
- custom domain: `mainlagihub.my.id`.

Manual local Wrangler deployment is operator fallback only.

## Commit-aware production smoke

Mainlagi bakes release SHA/branch into the server artifact and exposes non-secret release/backend metadata through `/api/health`.

On pushes to `main`, `Production smoke (Cloudflare)` succeeds only when production reports:

- the exact current `github.sha`;
- branch `main`;
- canonical site URL `https://mainlagihub.my.id`;
- backend `supabase`;
- Supabase project ref `estvtgflwkebomsqlolv`.

## Latest verified production implementation

**Expansion Batch 11 — Letters/Menulis to 100 is engineering/content-catalog production-complete.**

```text
Batch:                 Expansion Batch 11 — Letters/Menulis to 100
Final PR:              #62
Git SHA:               1ec8c69bce010424807d918a3b4655cd18b1f357
Main CI run:            #270
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The exact-SHA production smoke verified the final Wave D implementation release on the public Cloudflare deployment with the canonical Supabase backend.

Batch 11 wave release sequence:

| Wave | Letters | PR | Migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | ---: | --- | --- | ---: | --- |
| A | 25 | #59 | `0031_batch11_letters_wave_a` | `cb6dfb662f0f14b8c66de29db30319ea08e06644` | #261 | success |
| B | 50 | #60 | `0032_batch11_letters_wave_b` | `3c3f446b70c6047236216b0b505e3f5fe9da9c88` | #263 | success |
| C | 75 | #61 | `0033_batch11_letters_wave_c` | `fdd0dae049b1cd4740286dd1b1a56700d9641154` | #267 | success |
| D | 100 | #62 | `0034_batch11_letters_wave_d` | `1ec8c69bce010424807d918a3b4655cd18b1f357` | #270 | success |

Batch 7 Math, Batch 8 Bahasa Indonesia, Batch 9 English, and Batch 10 Iqro remain production-complete at 100 activities each. Detailed Batch 11 evidence is in `EXPANSION_BATCH11_CLOSURE_2026-09-11.md`.

**Letters evidence boundary:** generic pre-writing and letter-formation traces remain completion-only practice. Deployment success does not convert trace completion into measured Latin letter-shape accuracy or mastery.

**Iqro review boundary remains:** all active Iqro packs remain `expert_required`; engineering deployment success is not expert religious-learning approval.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization and release-metadata baking.
- `src/app/api/health/route.ts` — public/non-secret release/backend health metadata.
- `package.json` — `build:cloudflare`, `preview`, `deploy`, `upload`.

## GitHub CI responsibilities

GitHub Actions validates; Cloudflare deploys. Primary jobs are:

- `Production build`;
- `Quality gate (Ubuntu)` including engine/learning tests and simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)`;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)` on `main`.

No `MAINLAGI_VPS_*` secrets are required.

## Canonical Supabase dependency

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- status: active/healthy.

Applied migration chain is verified through Batch 11 Wave D. The Batch 11 repository migrations are:

```text
0031_batch11_letters_wave_a.sql
0032_batch11_letters_wave_b.sql
0033_batch11_letters_wave_c.sql
0034_batch11_letters_wave_d.sql
```

The canonical Supabase migration registry records the corresponding applied entries as:

```text
batch11_letters_wave_a
batch11_letters_wave_b
batch11_letters_wave_c
batch11_letters_wave_d
```

The earlier canonical migration chain `0001_init` through `0030_batch10_iqro_wave_d` remains intact.

Post-Wave-D live catalog verification:

- **508 active learning activities**;
- **489 assessed / 19 practice** globally;
- Math exactly 100;
- Bahasa Indonesia exactly 100;
- English exactly 100;
- Iqro exactly 100;
- **Letters/Menulis exactly 100 = 87 assessed / 13 practice**;
- 120 active learning skills;
- 117 active content packs;
- 25 active Letters skills;
- 25 Wave D activity-skill links;
- zero active Letters activities missing mechanic/evidence metadata.

Important boundaries remain unchanged:

- `0007` prevents real-child attempts unless `child_key` resolves to an undeleted account-owned profile; `demo-gian` remains the explicit account-scoped sandbox sentinel;
- `0011` provides scalable content ownership without renaming historical IDs;
- `0012` expands mechanic/evidence vocabulary without fake playable counts;
- `0013`/`0014` establish Batch 6 subjects and eight-subject award scaling;
- `0015`–`0018` add Batch 7 Math content additively;
- `0019`–`0022` add Batch 8 Bahasa content additively;
- `0023`–`0026` add Batch 9 English content additively;
- `0027`–`0030` add Batch 10 Iqro content additively;
- `0031`–`0034` add Batch 11 Letters/Menulis content additively;
- no generic Latin letter trace is promoted to assessed evidence without validated shape-fidelity measurement;
- all Iqro packs remain `expert_required` pending competent human review.

## Post-DDL advisor state

After Batch 11 Wave D:

- performance advisor has **no WARN-level regression**; 18 unused-index observations are INFO-level only;
- security advisor still reports the existing intentional authenticated SECURITY DEFINER exposure for `public.record_learning_attempt(...)` and leaked-password protection disabled under the current Supabase configuration/plan;
- no new Batch 11 security/performance warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Auth and learning production state

Production supports account login, account-owned child profiles, assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

Practice/completion-only activities cannot manufacture academic mastery. Batch 11 assessed additions use measured choice/matching evidence; generic letter-formation traces remain completion-only practice.

## Production verification checklist

For every expansion wave/batch:

1. [x] focused branch/PR;
2. [x] full quality/security/build checks before merge;
3. [x] relevant migration regression-tested before application;
4. [x] live database counts verified after migration;
5. [x] post-DDL advisor state reviewed;
6. [x] Cloudflare remains Git-driven from `main`;
7. [x] post-merge smoke verifies exact release SHA and canonical Supabase metadata.

Batch 11 satisfies all seven engineering/deployment conditions across Waves A–D.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
