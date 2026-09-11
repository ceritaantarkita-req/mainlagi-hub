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

**Batch 15 — Adaptive/mastery/report scaling across the complete 900-activity catalog is production-complete.**

```text
Batch:                  Batch 15 — Adaptive/mastery/report scaling
Final PR:               #78
PR head:                c5ca9c186c810e5ba219169c0dd387d744b13bf7
Git SHA:                58e5d14633dd3d105f383f56e016c61c9104a892
Main CI run:            #312
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The final smoke verified the exact SHA `58e5d14633dd3d105f383f56e016c61c9104a892` on the public Cloudflare deployment with the canonical Supabase backend.

Batch 15 is application/test scaling only. It requires **no Supabase migration/DDL** and preserves the exact production catalog/persistence baseline closed by Batch 14.

Detailed evidence: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

Earlier closure docs remain canonical historical evidence for Batches 7–14.

## Batch 15 release scope

Production behavior added/validated in Batch 15:

- unified recommendation consumers on Adaptive Learning V2;
- bounded recommendation evaluation across all nine subjects;
- remediation diversity that can prefer alternate same-skill activities/runtimes over immediate exact replay;
- Drawing/Coloring recommendation support without synthetic mastery;
- bounded Parent-report projection by subject/stage/assessed skill plus capped recent attempts;
- certificate regression keeping completion-only creative activity outside assessed mastery gates;
- `test:learning:batch15` with a 1,200-attempt scale fixture, `<64 KiB` Parent-report payload gate, and conservative `<5s` report + nine-subject adaptive sweep budget.

These application-level scale gates are not a substitute for the broader performance/accessibility/security/physical-device work planned for Batch 16.

## Previous Batch 14 catalog release sequence

Batch 14 remains the latest persistence/catalog expansion and established the unchanged 900-activity baseline used by Batch 15.

| Wave | Drawing | Coloring | PR | Migration | Main SHA | Main CI | Exact-SHA smoke |
| --- | ---: | ---: | ---: | --- | --- | ---: | --- |
| A | 25 | 25 | #73 | `0043_batch14_creative_wave_a` | `f27ea5b047e657e896d991656bfe64cdb215c84e` | #301 | success |
| B | 50 | 50 | #74 | `0044_batch14_creative_wave_b` | `62e88a5f696d2b4eb2e691298671e137e91caa30` | #304 | success |
| C | 75 | 75 | #75 | `0045_batch14_creative_wave_c` | `e120d1fa098ff9f1a7949ba3d1ffa0dee00d312c` | #306 | success |
| D | 100 | 100 | #76 | `0046_batch14_creative_wave_d` | `b273edc282261bbec89b0c3d438822204cd925e5` | #308 | success |

Detailed Batch 14 evidence: `EXPANSION_BATCH14_CLOSURE_2026-09-11.md`.

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

Applied migration chain remains verified through Batch 14 Wave D. Batch 15 has no migration/DDL. Recent expansion migrations remain:

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

Current live catalog state remains:

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

Batch 15 introduces no DDL, so the post-Batch-14 advisor state remains the relevant production database baseline:

- security advisor has the same **two known WARN findings**:
  - signed-in users can execute protected `SECURITY DEFINER` `public.record_learning_attempt(...)`; this is intentional for the guarded attempt-recording RPC boundary;
  - leaked-password protection is disabled under the current Supabase configuration/plan;
- performance advisor has **17 `unused_index` INFO findings** and no WARN-level regression.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Auth and learning production state

Production supports account login, account-owned child profiles, assessed-attempt persistence, evidence/mastery materialization, parent-derived state, cloud child ownership/isolation, durable offline attempt queuing, and exact-commit health verification.

Practice/completion-only activities cannot manufacture academic mastery. Batch 15 preserves that rule while scaling recommendations/reporting over the complete catalog.

## Production verification checklist

For every batch, apply only the relevant gates and document why any persistence-specific gate is not applicable:

1. focused branch/PR;
2. full quality/security/build checks before merge;
3. migration regression/application where persistence changes;
4. live database/advisor verification where persistence/DDL changes;
5. Cloudflare remains Git-driven from `main`;
6. post-merge smoke verifies exact release SHA and canonical Supabase metadata;
7. closure evidence and canonical docs are synchronized.

Batch 15 satisfies the application-only version of these production/deployment conditions: PR #78 is merged, main CI #312 is green, exact-SHA Cloudflare smoke is green, and no persistence migration is required.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.
