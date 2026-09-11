# Expansion Batch 15 Closure — Adaptive / Mastery / Parent Report Scaling

Date: 11 September 2026

## Status

**COMPLETE IN PRODUCTION**

Batch 15 scales the learning/recommendation/reporting system across the already production-closed 900-activity catalog. It does not add activity-count targets and does not reinterpret completion-only evidence as academic mastery.

Implementation landed through PR #78 and is live on the exact production SHA below.

```text
PR:                     #78
PR head:                c5ca9c186c810e5ba219169c0dd387d744b13bf7
Main SHA:               58e5d14633dd3d105f383f56e016c61c9104a892
Main CI:                 #312
Quality gate (Ubuntu):   success
Windows compatibility:  success
Mobile route QA:         success
Production build:        success
Dependency audit:        success
Secret history scan:     success
Production smoke:        success
```

The post-merge Cloudflare smoke verified the exact main SHA `58e5d14633dd3d105f383f56e016c61c9104a892` on the canonical public deployment.

## Production baseline preserved

Batch 15 intentionally preserves the Batch 14 catalog and persistence baseline:

- 9 first-class subjects / 9 learning paths;
- 46 stages;
- 197 lessons;
- 197 versioned content packs;
- 900 playable activities;
- 683 assessed activities;
- 217 practice activities;
- 200 active skills;
- 8 manifest mechanics;
- every subject exactly 100 activities.

No Supabase migration or DDL change is required for Batch 15. Historical catalog IDs, attempt/evidence/mastery identities, ownership rules, and the migration chain through `0046_batch14_creative_wave_d.sql` remain unchanged.

## Closed Batch 15 scope

### 1. One adaptive ranking policy across the product

Child/parent recommendation consumers now resolve through Adaptive Learning V2 rather than maintaining a second independent recommendation policy.

The catalog-scale regression verifies that all nine subjects can return bounded recommendations, subject isolation is preserved, and motion activities remain excluded unless motion is explicitly allowed.

### 2. Mastery remains assessed-evidence only

Batch 15 does not weaken the canonical evidence boundary:

- only qualifying measured assessed evidence can advance assessed skill mastery;
- completion-only practice does not manufacture accuracy or proficiency;
- measured all-wrong remains accuracy `0`;
- missing measurement continues to fail closed;
- replay/retry protections remain part of mastery qualification.

### 3. Drawing and Coloring stay useful without fake mastery

Drawing and Coloring remain recommendation-capable, but every creative activity stays `practice` with `completion_only_v1` evidence.

Parent-report projection intentionally returns `mastery: null` for creative-only subjects. Completing all Drawing or Coloring activities can satisfy completion tracking, but it cannot satisfy assessed mastery or academic certificate gates.

### 4. Weak-skill remediation prefers useful variation

The adaptive policy now has explicit remediation diversity behavior. When weak assessed evidence exists, same-skill alternatives can outrank immediate exact replay, including alternatives that use a different runtime/mechanic when available.

The regression fixture verifies a weak Bahasa Indonesia result where an alternate same-skill activity outranks the failed exact replay and exposes the `remediate_variant` reason.

### 5. Catalog-scale adaptive factors remain bounded

Batch 15 validates adaptive behavior over the full catalog with the existing policy inputs, including age eligibility, stage readiness, difficulty, confidence/evidence state, retry/frustration signals, spacing/review behavior, completion state, and motion opt-in.

The change scales ranking work without introducing a second mastery model or a creative-accuracy shortcut.

### 6. Parent Progress / Reports are bounded projections

`buildBatch15ParentReport(...)` provides a compact report over an already-loaded analytics snapshot instead of dumping hundreds of catalog/activity rows.

The projection contains:

- weekly attempt, assessed/practice, activity-day, accuracy, evidence, and trend summary;
- exactly one summary row per subject;
- assessed-only mastery summary where assessed skills exist;
- stage-status rollups;
- weakest assessed skill where applicable;
- one adaptive recommendation per subject;
- capped recent-attempt rows (maximum 12; Batch 15 regression uses 6).

This preserves useful creative completion/reporting while keeping creative mastery absent when no assessed evidence contract exists.

### 7. Certificate boundary regression is explicit

Batch 15 regression tests verify that completion-only Drawing/Coloring activity cannot become assessed mastery readiness or certificate eligibility.

The existing certificate/achievement model therefore remains evidence-gated rather than completion-farmed.

### 8. Scale regression / benchmark is now part of `test:learning`

`npm run test:learning:batch15` is included in the canonical learning test suite.

The Batch 15 scale fixture uses 1,200 synthetic attempts and verifies:

- all nine subject recommendations remain bounded;
- the Parent report remains exactly nine subject rows;
- recent attempts remain capped rather than exposing raw history;
- Drawing/Coloring mastery remains `null`;
- Drawing/Coloring recommendations remain explicitly `practice`;
- serialized bounded Parent report payload stays below 64 KiB;
- report + nine-subject adaptive sweep stays below the conservative 5-second CI budget.

These are regression budgets, not claims about final Batch 16 performance optimization on all physical devices.

## CI and production evidence

Main CI #312 completed successfully after PR #78 merged to `main`.

Successful jobs:

- `Quality gate (Ubuntu)` — source/structure validation, typecheck, lint, engine/learning tests, simulations;
- `Windows compatibility` — typecheck, lint, engine tests;
- `Mobile route QA (Chromium)` — production build plus canonical responsive route matrix;
- `Production build` — OpenNext/Cloudflare production artifact;
- `Production dependency audit`;
- `Secret history scan`;
- `Production smoke (Cloudflare)` — waited for and verified the exact release SHA.

No migration application or post-DDL advisor delta is required because Batch 15 changes application logic/tests only and leaves the database schema/catalog data unchanged.

## Explicit boundaries that remain open

Batch 15 completion does **not** close the following product-wide work:

- physical-device camera/audio/trace testing remains for Batch 16;
- accessibility, payload/bundle/query profiling, code splitting, security/RLS review, and device QA remain Batch 16 scope;
- all active Iqro packs remain `expert_required` pending competent human approval;
- generic Latin tracing remains completion-only until a validated glyph-shape evaluator exists;
- Drawing/Coloring remain completion-only creative practice until a separately validated objective evaluator/evidence contract exists;
- `Secret history scan` is green but still is not an account-level required status check in the current `Protect main` ruleset.

## Closure decision

Batch 15 satisfies the planned adaptive/mastery/report scaling acceptance scope over the full 900-activity catalog, with production CI and exact-SHA Cloudflare smoke green.

**Next canonical phase: Batch 16 — performance, accessibility, security, and representative physical-device QA.**
