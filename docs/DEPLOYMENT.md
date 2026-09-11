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

**Batch 16 automated performance/accessibility/security hardening is live; full Batch 16 closure still waits for representative physical-device acceptance.**

```text
Batch:                  Batch 16 automated hardening
Final implementation PR:#80
PR head:                32ff7389b2755436f448f41bfbf476df894f569d
Git SHA:                8193bccbab8293ec7e30fb4de54a0f86537cfa59
Main CI run:            #318
Quality gate (Ubuntu):  success
Windows compatibility: success
Mobile route QA:        success
Production build:       success
Dependency audit:       success
Secret history scan:   success
Production smoke:       success
```

The post-merge smoke verified the exact SHA `8193bccbab8293ec7e30fb4de54a0f86537cfa59` on the public Cloudflare deployment with the canonical Supabase backend.

Batch 16 automated hardening is application/CI-only. It requires **no Supabase migration/DDL** and preserves the exact production catalog/persistence baseline.

Detailed progress evidence: `EXPANSION_BATCH16_PROGRESS_2026-09-11.md`.

Physical-device acceptance remains open in `BATCH16_PHYSICAL_DEVICE_QA.md`; therefore Batch 16 is **IN PROGRESS**, not closed.

## Batch 16 automated release scope

Production/CI behavior added in PR #80:

- production JavaScript regression budgets in build and browser-QA paths;
- executable MediaPipe dynamic-import guard;
- non-eager remote TTS initialization guard;
- representative reduced-motion browser regression checks;
- visible image-alt/form-label accessibility checks;
- keyboard-focus and `aria-hidden` focusability checks;
- eager vision/TTS network detection on representative routes;
- source security regressions covering client credential boundaries, raw-HTML sink allowlisting/sanitization, `SECURITY DEFINER` search paths, learning RPC grants, account-bound credential-free outbox state, and server-only service-role use.

Current verified production-build baseline from CI #317/#318:

| Metric | Observed | CI ceiling |
| --- | ---: | ---: |
| Largest static JS chunk | 0.35 MiB | 5 MiB |
| Total static JS | 2.03 MiB | 18 MiB |
| Root/main JS | 0.42 MiB | 2 MiB |
| App entry JS | no entry above gate | 3 MiB per entry |

These are automated regression budgets, not real-device latency guarantees.

## Batch 15 production closure

Batch 15 remains fully production-complete and unchanged by Batch 16.

```text
Implementation PR:       #78
Implementation SHA:      58e5d14633dd3d105f383f56e016c61c9104a892
Main CI:                 #312
Exact-SHA production smoke: success
```

Detailed evidence: `EXPANSION_BATCH15_CLOSURE_2026-09-11.md`.

## Repository deployment configuration

- `wrangler.jsonc` — Worker `mainlagi-hub`, `.open-next/worker.js`, `.open-next/assets`, Cloudflare bindings.
- `open-next.config.ts` — OpenNext Cloudflare config.
- `next.config.mjs` — Cloudflare binding initialization and release-metadata baking.
- `src/app/api/health/route.ts` — public/non-secret release/backend health metadata.
- `package.json` — build/deploy commands plus Batch 16 security/build-budget scripts.
- `scripts/run-batch16-build-budget.mjs` — production JS/lazy-load regression budgets.
- `scripts/run-batch16-security-tests.mjs` — application/source security boundary regression gate.
- `scripts/run-mobile-route-browser-tests.mjs` — responsive route plus Batch 16 accessibility/lazy-load browser QA.

## GitHub CI responsibilities

GitHub Actions validates; Cloudflare deploys. Primary jobs are:

- `Production build` — OpenNext/Cloudflare artifact plus Batch 16 JS/lazy-load budgets;
- `Quality gate (Ubuntu)` — structure/assets/source, Batch 16 security boundary regressions, typecheck, lint, engine/learning tests, simulations;
- `Windows compatibility`;
- `Mobile route QA (Chromium)` — responsive matrix plus build budget and representative accessibility/lazy-load gates;
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

Applied migration chain remains verified through Batch 14 Wave D. Batches 15 and 16 automated hardening have no migration/DDL. Recent expansion migrations remain:

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

Current live catalog state remains:

- **900 active learning activities**;
- **683 assessed / 217 practice** globally;
- all nine subjects exactly 100 activities;
- Drawing exactly 100 practice activities;
- Coloring exactly 100 practice activities;
- 200 active learning skills;
- 197 active content packs;
- zero active creative activities with assessed/non-completion evidence drift;
- zero Drawing/Coloring runtime-mechanic drift.

Important boundaries remain unchanged:

- `0007` prevents real-child attempts unless `child_key` resolves to an undeleted account-owned profile; `demo-gian` remains the account-scoped sandbox sentinel;
- historical activity/mastery identities are preserved;
- generic Latin letter traces remain completion-only practice without validated glyph-shape mastery;
- all active Iqro packs remain `expert_required` pending competent human review;
- Science uses measured response evidence and does not rely on unsafe unsupervised experiments;
- Drawing/Coloring are completion-only creative practice and cannot fabricate academic or creative mastery.

## Post-DDL advisor state

Batch 16 introduces no DDL, so the prior production database-advisor baseline remains applicable:

- security advisor retains the known intentional authenticated `SECURITY DEFINER` `record_learning_attempt(...)` WARN and leaked-password-protection WARN under the current Supabase configuration/plan;
- previously observed unused-index items remain informational unless a later query/index review changes the state.

The new Batch 16 source-security gate complements these advisor checks but does not claim to replace live database advisors.

## Physical-device release boundary

A successful exact-SHA Cloudflare smoke proves the expected release/configuration is live; it does **not** prove camera/audio/touch behavior on physical phones.

Before Batch 16 may be marked complete, the matrix in `BATCH16_PHYSICAL_DEVICE_QA.md` must contain representative physical-hardware evidence for the required iPhone/Safari and Android/Chrome flows or an explicitly reviewed blocker.

Batch 17 remains blocked until that Batch 16 closure condition is met.

## Production verification checklist

For every batch, apply only the relevant gates and document why any persistence-specific gate is not applicable:

1. focused branch/PR;
2. full quality/security/build checks before merge;
3. migration regression/application where persistence changes;
4. live database/advisor verification where persistence/DDL changes;
5. Cloudflare remains Git-driven from `main`;
6. post-merge smoke verifies exact release SHA and canonical Supabase metadata;
7. representative physical-device evidence where the batch explicitly depends on hardware/browser behavior;
8. closure/progress evidence and canonical docs are synchronized.

PR #80 satisfies the automated production portion of Batch 16. The physical-device step remains intentionally open.

## Manual deployment fallback

Operator fallback only:

```bash
npm run deploy
```

It requires an authorized Cloudflare environment. Never commit Cloudflare API tokens or account credentials.

## Rollback

Rollback the Cloudflare deployment layer to a known-good Git deployment, then rerun public health/smoke verification. For additive catalog migrations, prefer a forward corrective migration rather than destructive rollback of learning history. Do not reintroduce a separate VPS rollback path unless the architecture is intentionally changed and documented through a new ADR.