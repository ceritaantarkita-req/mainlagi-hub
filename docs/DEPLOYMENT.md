# Mainlagi Production Deployment

Last reviewed: 10 September 2026

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

Expansion Batch 10 — Iqro to 100 is engineering/content-catalog production-complete.

```text
Batch:                 Expansion Batch 10 — Iqro to 100
Final PR:              #57
Git SHA:               e927e3e283b3c15fb97239c9ce013ef6121d3947
Main CI run:            #256
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The exact-SHA production smoke verified the final Wave D implementation release on the public Cloudflare deployment with the canonical Supabase backend.

Batch 10 wave release sequence:

| Wave | Iqro | PR | Migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | ---: | --- | --- | ---: | --- |
| A | 25 | #54 | `0027_batch10_iqro_wave_a` | `75152bcf5d930c5a0f072e77a2679ca1c9edef73` | #250 | success |
| B | 50 | #55 | `0028_batch10_iqro_wave_b` | `074026b1c8b62a5a63b3004e6d591c820dd3ec5d` | #252 | success |
| C | 75 | #56 | `0029_batch10_iqro_wave_c` | `dc367d2fa712c3ec793d6161d8fdde434197a17b` | #254 | success |
| D | 100 | #57 | `0030_batch10_iqro_wave_d` | `e927e3e283b3c15fb97239c9ce013ef6121d3947` | #256 | success |

Batch 7 Math, Batch 8 Bahasa Indonesia, and Batch 9 English remain production-complete at 100 activities each. Detailed Batch 10 evidence is in `EXPANSION_BATCH10_CLOSURE_2026-09-10.md`.

**Religious-learning review boundary:** deployment success does not convert Iqro content into expert-approved material. All active Iqro packs remain `expert_required` pending explicit competent human review.

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

Applied migration chain verified on 10 September 2026:

```text
0001_init
0002_learning_attempt_schema
0003_learning_mastery_functions
0004_learning_rpc_hardening
0005_database_advisor_hardening
0006_private_admin_helper
0007_learning_child_ownership
0008_curriculum_content_expansion
0009_learning_awards_certificates
0010_legacy_fk_indexes
0011_scalable_content_architecture
0012_reusable_mechanic_library
0013_new_subject_curriculum_foundations
0014_batch6_award_catalog_scaling
0015_batch7_math_wave_a
0016_batch7_math_wave_b
0017_batch7_math_wave_c
0018_batch7_math_wave_d
0019_batch8_bahasa_wave_a
0020_batch8_bahasa_wave_b
0021_batch8_bahasa_wave_c
0022_batch8_bahasa_wave_d
0023_batch9_english_wave_a
0024_batch9_english_wave_b
0025_batch9_english_wave_c
0026_batch9_english_wave_d
0027_batch10_iqro_wave_a
0028_batch10_iqro_wave_b
0029_batch10_iqro_wave_c
0030_batch10_iqro_wave_d
```

Post-`0030` live catalog verification:

- 411 active learning activities;
- exactly 100 Iqro activities: 99 assessed / 1 historical practice;
- exactly 100 English activities;
- exactly 100 Bahasa Indonesia activities;
- exactly 100 Math activities;
- 404 assessed / 7 practice globally;
- 97 active learning skills;
- 94 active content packs;
- 22 active Iqro packs, all `expert_required`;
- 100 Iqro activity-skill links;
- zero active Iqro activities missing mechanic/evidence metadata.

Important boundaries remain unchanged:

- `0007` prevents real-child attempts unless `child_key` resolves to an undeleted account-owned profile; `demo-gian` remains the explicit account-scoped sandbox sentinel;
- `0011` provides scalable content ownership without renaming historical IDs;
- `0012` expands mechanic/evidence vocabulary without fake playable counts;
- `0013`/`0014` establish Batch 6 subjects and eight-subject award scaling;
- `0015`–`0018` add Batch 7 Math content additively;
- `0019`–`0022` add Batch 8 Bahasa content additively;
- `0023`–`0026` add Batch 9 English content additively;
- `0027`–`0030` add Batch 10 Iqro content additively while preserving the four historical Iqro identities;
- Batch 10 authoring metadata is parity-checked against canonical `HIJAIYAH_TEMPLATES`;
- no new generic trace is promoted to assessed;
- all Iqro packs remain `expert_required`; database/code CI does not equal expert religious-learning approval.

## Post-DDL advisor state

After `0030`:

- performance advisor has **no WARN-level regression**; 18 unused-index observations are INFO-level only;
- security advisor still reports the existing intentional authenticated SECURITY DEFINER exposure for `public.record_learning_attempt(...)` and leaked-password protection disabled under the current Supabase configuration/plan;
- no new Batch 10 security warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Auth and learning production state

Production supports account login, account-owned child profiles, assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

Practice/completion-only activities cannot manufacture academic mastery. All 96 Batch 10 additions use measured tap-choice, listen-and-choose, or matching evidence paths. Iqro closes at 99 assessed / 1 historical practice.

## Production verification checklist

For every expansion wave/batch:

1. [x] focused branch/PR;
2. [x] full quality/security/build checks before merge;
3. [x] relevant migration regression-tested before application;
4. [x] live database counts verified after migration;
5. [x] Cloudflare remains Git-driven from `main`;
6. [x] post-merge smoke verifies exact release SHA and canonical Supabase metadata.

Batch 10 satisfies all six engineering/deployment conditions across Waves A–D. Formal expert Iqro approval remains a separate content-governance condition and is not claimed here.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
