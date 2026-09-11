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

**Expansion Batch 14 — Drawing/Menggambar + Coloring/Mewarnai to 100 each is engineering/content-catalog production-complete.**

```text
Batch:                 Expansion Batch 14 — Drawing + Coloring to 100 each
Final PR:              #76
Git SHA:               b273edc282261bbec89b0c3d438822204cd925e5
Main CI run:            #308
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The final smoke verified the exact SHA `b273edc282261bbec89b0c3d438822204cd925e5` on the public Cloudflare deployment with the canonical Supabase backend.

Batch 14 wave release sequence:

| Wave | Drawing | Coloring | PR | Migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| A | 25 | 25 | #73 | `0043_batch14_creative_wave_a` | `f27ea5b047e657e896d991656bfe64cdb215c84e` | #301 | success |
| B | 50 | 50 | #74 | `0044_batch14_creative_wave_b` | `62e88a5f696d2b4eb2e691298671e137e91caa30` | #304 | success |
| C | 75 | 75 | #75 | `0045_batch14_creative_wave_c` | `e120d1fa098ff9f1a7949ba3d1ffa0dee00d312c` | #306 | success |
| D | 100 | 100 | #76 | `0046_batch14_creative_wave_d` | `b273edc282261bbec89b0c3d438822204cd925e5` | #308 | success |

PR quality-gate evidence:

- Wave A final PR head `b168191e16b14c1180c4475542cf9136a35e393b`, PR CI #300 — success;
- Wave B final PR head `09947cc7fd0ec826eeb785453baf504dd463dc80`, PR CI #303 — success;
- Wave C final PR head `44598c27bc68b0cca701826a444cb30c2114172f`, PR CI #305 — success;
- Wave D final PR head `45cbea6b858cd18b4000c136e72f3af0dee62c48`, PR CI #307 — success.

Detailed evidence: `EXPANSION_BATCH14_CLOSURE_2026-09-11.md`.

Earlier closure docs remain canonical historical evidence for Batches 7–13.

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

The active `Protect main` ruleset currently requires `Production build`, `Quality gate (Ubuntu)`, `Windows compatibility`, and `Production dependency audit`. `Secret history scan` runs successfully but is not yet a required status check; see `ACCOUNT_LEVEL_ACTIONS.md`.

## Canonical Supabase dependency

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)
- status: active/healthy.

Applied migration chain is verified through Batch 14 Wave D. Recent expansion migrations are:

```text
0039_batch13_science_wave_a.sql
0040_batch13_science_wave_b.sql
0041_batch13_science_wave_c.sql
0042_batch13_science_wave_d.sql
0043_batch14_creative_wave_a.sql
0044_batch14_creative_wave_b.sql
0045_batch14_creative_wave_c.sql
0046_batch14_creative_wave_d.sql
```

Canonical registry contains:

```text
batch13_science_wave_a
batch13_science_wave_b
batch13_science_wave_c
batch13_science_wave_d
batch14_creative_wave_a
batch14_creative_wave_b
batch14_creative_wave_c
batch14_creative_wave_d
```

The earlier canonical migration chain remains intact.

Final post-`0046` live catalog verification:

- **900 active learning activities**;
- **683 assessed / 217 practice** globally;
- all nine subjects exactly 100 activities;
- Drawing exactly 100 practice activities;
- Coloring exactly 100 practice activities;
- 200 active learning skills;
- 197 active content packs;
- Drawing 20 active skills;
- Coloring 21 active skills;
- zero active creative activities with assessed/non-completion evidence drift;
- zero Drawing/Coloring runtime-mechanic drift.

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

Important boundaries remain unchanged:

- `0007` prevents real-child attempts unless `child_key` resolves to an undeleted account-owned profile; `demo-gian` remains the account-scoped sandbox sentinel;
- historical activity/mastery identities are preserved by additive catalog migrations;
- generic Latin letter traces remain completion-only practice without validated glyph-shape mastery;
- all active Iqro packs remain `expert_required` pending competent human review;
- Science uses measured response evidence and does not rely on unsafe unsupervised experiments;
- Drawing/Coloring are completion-only creative practice and cannot fabricate academic or creative mastery.

## Post-DDL advisor state

After Batch 14 Wave D:

- security advisor has the same **two known WARN findings**:
  - signed-in users can execute protected `SECURITY DEFINER` `public.record_learning_attempt(...)`; this is intentional for the guarded attempt-recording RPC boundary;
  - leaked-password protection is disabled under the current Supabase configuration/plan;
- performance advisor has **17 `unused_index` INFO findings** and no WARN-level regression;
- Batch 14 introduced no new security/performance WARN.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Auth and learning production state

Production supports account login, account-owned child profiles, assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

Practice/completion-only activities cannot manufacture academic mastery. Batch 14 creative activities intentionally use completion-only evidence.

## Production verification checklist

For every expansion wave/batch:

1. focused branch/PR;
2. full quality/security/build checks before merge;
3. migration regression-tested before application;
4. live database counts verified after migration;
5. post-DDL advisor state reviewed;
6. Cloudflare remains Git-driven from `main`;
7. post-merge smoke verifies exact release SHA and canonical Supabase metadata.

Batch 14 satisfies all seven engineering/deployment conditions across Waves A–D.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
