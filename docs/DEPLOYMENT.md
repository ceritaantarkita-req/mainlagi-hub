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

**Expansion Batch 13 — Science/Sains to 100 is engineering/content-catalog production-complete.**

```text
Batch:                 Expansion Batch 13 — Science/Sains to 100
Final PR:              #71
Git SHA:               e35d211ada182e0c5379da7b9b33614309994852
Main CI run:            #290
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The final smoke verified the exact SHA `e35d211ada182e0c5379da7b9b33614309994852` on the public Cloudflare deployment with the canonical Supabase backend.

Batch 13 wave release sequence:

| Wave | Science | PR | Migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | ---: | --- | --- | ---: | --- |
| A | 25 | #68 | `0039_batch13_science_wave_a` | `296b8c69513d5577233a8a777062741fd83163c9` | #283 | success |
| B | 50 | #69 | `0040_batch13_science_wave_b` | `92f6767ee3015fb7e160adb0cd8ce85309676eb9` | #285 | success |
| C | 75 | #70 | `0041_batch13_science_wave_c` | `1c956867fd912bfea25c7cb0105a97921299cf80` | #287 | success |
| D | 100 | #71 | `0042_batch13_science_wave_d` | `e35d211ada182e0c5379da7b9b33614309994852` | #290 | success |

Batch 12 Logic/Logika is also production-complete:

| Wave | Logic | PR | Migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | ---: | --- | --- | ---: | --- |
| A | 25 | #64 | `0035_batch12_logic_wave_a` | `ce76d5f7d11385712005a1edaf4005c459ac0eb7` | #274 | success |
| B | 50 | #65 | `0036_batch12_logic_wave_b` | `1aa97490ab2d9f6625edfc027d4916784f719dfd` | #276 | success |
| C | 75 | #66 | `0037_batch12_logic_wave_c` | `1208d9487d150ff2825be417f82fe01ce0413d96` | #279 | success |
| D | 100 | #67 | `0038_batch12_logic_wave_d` | `553b9e28f91feefa9af9c2995f2f7e913bf31491` | #281 | success |

Detailed evidence:

- `EXPANSION_BATCH12_CLOSURE_2026-09-11.md`
- `EXPANSION_BATCH13_CLOSURE_2026-09-11.md`

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

Applied migration chain is verified through Batch 13 Wave D. Recent expansion migrations are:

```text
0035_batch12_logic_wave_a.sql
0036_batch12_logic_wave_b.sql
0037_batch12_logic_wave_c.sql
0038_batch12_logic_wave_d.sql
0039_batch13_science_wave_a.sql
0040_batch13_science_wave_b.sql
0041_batch13_science_wave_c.sql
0042_batch13_science_wave_d.sql
```

Canonical registry entries:

```text
batch12_logic_wave_a
batch12_logic_wave_b
batch12_logic_wave_c
batch12_logic_wave_d
batch13_science_wave_a
batch13_science_wave_b
batch13_science_wave_c
batch13_science_wave_d
```

The earlier canonical migration chain remains intact.

Final post-`0042` live catalog verification:

- **702 active learning activities**;
- **683 assessed / 19 practice** globally;
- Math exactly 100;
- Bahasa Indonesia exactly 100;
- English exactly 100;
- Iqro exactly 100;
- Letters/Menulis exactly 100;
- **Logic/Logika exactly 100 = 100 assessed / 0 practice**;
- **Science/Sains exactly 100 = 100 assessed / 0 practice**;
- Coloring/Mewarnai remains 2 practice activities;
- 160 active learning skills;
- 157 active content packs;
- 22 active Logic skills;
- 22 active Science skills;
- zero active Science activities missing mechanic/evidence metadata.

Current runtime inventory:

| Runtime | Activities |
| --- | ---: |
| `tap_choice` | 481 |
| `listen_and_choose` | 76 |
| `matching` | 125 |
| `trace` | 14 |
| `story` | 1 |
| `motion_game` | 3 |
| `coloring` | 2 |

Important boundaries remain unchanged:

- `0007` prevents real-child attempts unless `child_key` resolves to an undeleted account-owned profile; `demo-gian` remains the account-scoped sandbox sentinel;
- historical activity/mastery identities are preserved by additive catalog migrations;
- generic Latin letter traces remain completion-only practice without validated glyph-shape mastery;
- all active Iqro packs remain `expert_required` pending competent human review;
- Science expansion uses measured response evidence and does not rely on unsafe unsupervised experiments;
- free creative Drawing/Coloring work must not fabricate academic mastery.

## Post-DDL advisor state

After Batch 13 Wave D:

- performance advisor has **no WARN-level regression**; 18 unused-index observations remain INFO-level only;
- security advisor still reports the existing authenticated `SECURITY DEFINER` exposure for `public.record_learning_attempt(...)` and leaked-password protection disabled under the current Supabase configuration/plan;
- no new Batch 12 or Batch 13 security/performance warning was introduced.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Auth and learning production state

Production supports account login, account-owned child profiles, assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

Practice/completion-only activities cannot manufacture academic mastery. Batch 12/13 additions are measured assessed choice/matching interactions.

## Production verification checklist

For every expansion wave/batch:

1. focused branch/PR;
2. full quality/security/build checks before merge;
3. migration regression-tested before application;
4. live database counts verified after migration;
5. post-DDL advisor state reviewed;
6. Cloudflare remains Git-driven from `main`;
7. post-merge smoke verifies exact release SHA and canonical Supabase metadata.

Batches 12 and 13 satisfy all seven engineering/deployment conditions across Waves A–D.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
