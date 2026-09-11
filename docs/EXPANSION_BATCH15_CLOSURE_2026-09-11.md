# Batch 15 — Adaptive/Mastery/Report Scaling Production Closure

Closure date: 11 September 2026

## Status

**ENGINEERING / LEARNING-SYSTEM PRODUCTION CLOSED.**

Batch 15 scales adaptive recommendations, mastery-facing projections, and Parent reporting over the production-complete 900-activity catalog. It does not add catalog content and does not change the canonical Supabase schema.

Final implementation SHA: `58e5d14633dd3d105f383f56e016c61c9104a892`.

Implementation PR: #78.

PR head: `c5ca9c186c810e5ba219169c0dd387d744b13bf7`.

PR CI: #311 — full success.

Implementation main CI: #312 — full success, including exact-SHA `Production smoke (Cloudflare)`.

## Entry baseline

Batch 15 entered from the fully closed Batch 14 baseline:

- 9 first-class subjects / 9 learning paths;
- 46 stages;
- 197 lessons;
- 197 content packs;
- 900 playable activities;
- 683 assessed / 217 practice;
- 200 active skills;
- 8 reusable manifest mechanics;
- Drawing 100 practice-only;
- Coloring 100 practice-only.

The catalog-count target was already complete. Batch 15 therefore treats new activity count as **out of scope**.

## Shipped implementation

### 1. Unified Adaptive Learning V2 policy

Before Batch 15, the newer child path already used Adaptive V2, while some legacy child/Parent surfaces still resolved recommendations through the older base ranker. Batch 15 removes that policy split.

The following recommendation consumers now resolve through the same Adaptive V2 policy:

- child learning landing;
- child subject/path experience;
- Parent Progress;
- Parent Reports.

Legacy insight helpers remain as compatibility wrappers but delegate to Adaptive V2 rather than maintaining a second recommendation policy.

### 2. Catalog-scale ranking optimization

The recommendation/progression path was optimized for the 900-item catalog without changing mastery semantics:

- static activity/stage descriptors are materialized once per application build;
- stage unlock/readiness is evaluated once per stage instead of repeatedly for every candidate activity;
- attempt history is indexed by skill once per ranking instead of repeatedly filtering the full history for every candidate;
- subject-scoped Parent recommendations evaluate subject-scoped stages/activities.

### 3. Remediation diversity and replay control

For assessed activities, weak recent evidence can be detected from measured low accuracy, high retries, or high hint usage.

When weakness is observed:

- an alternate activity targeting the same skill receives a remediation boost;
- a different runtime/mechanic receives an additional diversity boost;
- immediate exact replay is penalized;
- recent repeated items receive additional repetition penalties.

The canonical regression fixture uses historical Bahasa Indonesia variants `bahasa-cari-a` and `bahasa-dengar-a` for skill `bahasa.huruf.a.recognition`, and verifies the alternate/different-runtime activity outranks exact replay with reason `remediate_variant`.

### 4. Confidence, spacing, and frustration policy

Batch 15 adds recommendation policy signals without rewriting canonical mastery:

- reasonable skill score with low confidence can trigger `build_confidence`;
- proficient/mastered skills can re-enter through `spaced_review` after evidence spacing;
- mastered/proficient snapshots are not decayed merely to force review;
- recent measured accuracy, retries, hints, and interrupted attempts softly adjust difficulty preference;
- age eligibility, stage unlock, and motion opt-in remain hard constraints.

### 5. Creative-practice integrity

Drawing/Coloring remain useful recommendation candidates, but Batch 15 intentionally does **not** interpret their completion as mastery.

Creative recommendations remain backed by canonical:

```text
assessment: practice
evidence contract: completion_only_v1
```

Regression coverage explicitly verifies that completing every activity in Drawing or Coloring can make completion ready while:

- `masteryReady` remains false;
- academic certificate eligibility remains false;
- Parent mastery projection remains `null`.

### 6. Bounded Parent reporting

Batch 15 replaces raw-scale reporting pressure with bounded projections built from the already-loaded analytics snapshot.

Parent report/progress now includes:

- one compact row for each of the 9 subjects;
- weekly assessed/practice attempt split;
- assessed-only average accuracy;
- qualifying evidence count;
- completion summary;
- assessed-only mastery score/coverage where a subject has assessed skills;
- explicit creative-practice reporting with no mastery percentage for Drawing/Coloring;
- stage status rollups: `ready`, `in_progress`, `evidence_needed`, `locked`;
- weakest assessed skill where relevant;
- one Adaptive V2 recommendation per subject;
- capped recent attempts rather than unbounded history rendering.

This preserves Parent explainability while avoiding a UI/data dump of hundreds of activities.

## Dedicated Batch 15 regression and benchmark

Batch 15 adds `test:learning:batch15` to the canonical learning/engine CI chain.

The test gate verifies:

- exact catalog baseline remains 9 subjects / 900 activities / 683 assessed / 217 practice / 200 skills;
- every subject can produce scoped recommendations without cross-subject leakage;
- motion activities remain excluded without opt-in;
- Drawing/Coloring recommendations retain canonical completion-only practice evidence;
- full creative completion cannot manufacture academic certificate mastery eligibility;
- same-skill alternate remediation outranks exact replay after weak measured evidence;
- compatibility/legacy recommendation helpers resolve the same Adaptive V2 winner;
- large-history Parent output remains bounded;
- Drawing/Coloring mastery output remains null;
- recent raw history remains capped;
- serialized report remains below 64 KiB;
- full Batch 15 1,200-attempt + 9-subject recommendation/report sweep remains below a conservative 5-second CI budget.

Actual PR CI #311 Ubuntu result:

```text
Batch 15 scaling tests passed: 72.8ms sweep, 7937 byte bounded report.
```

This measurement is a CI regression benchmark, not a claim about end-user network latency or physical-device performance. Real device/runtime performance is part of Batch 16.

## Persistence and migration decision

**No Batch 15 Supabase migration/DDL exists or is required.**

Reason:

- no learning table/schema change;
- no RLS/RPC change;
- no activity/skill/pack/path/stage row change;
- no activity assessment/evidence reclassification;
- no content migration required.

Creating a no-op migration merely to assign Batch 15 a migration number would add migration noise without changing production state. Canonical migration history therefore intentionally remains through:

`0046_batch14_creative_wave_d.sql`.

## Live canonical database verification

Read-only canonical Supabase verification after the Batch 15 production release:

- **900 active activities**;
- **683 assessed / 217 practice**;
- Drawing exactly 100;
- Coloring exactly 100;
- 197 active packs;
- 200 active skills;
- zero creative assessed/non-completion evidence drift;
- zero Drawing runtime/mechanic drift;
- zero Coloring runtime/mechanic drift.

Active skill counts remain:

- Bahasa Indonesia 23;
- English 23;
- Math 22;
- Iqro 22;
- Letters/Menulis 25;
- Logic 22;
- Science 22;
- Coloring 21;
- Drawing 20.

## CI and production release evidence

Implementation PR #78, head `c5ca9c186c810e5ba219169c0dd387d744b13bf7`, passed PR CI #311:

- Quality gate (Ubuntu) — success, including all learning/engine tests and simulations;
- Windows compatibility — success;
- Mobile route QA (Chromium) — success;
- Production build — success;
- Production dependency audit — success;
- Secret history scan — success;
- PR production smoke — skipped by design.

The PR was squash-merged with expected-head protection to main SHA `58e5d14633dd3d105f383f56e016c61c9104a892`.

Main CI #312 passed all jobs and exact-SHA Cloudflare production smoke for that SHA.

## Supabase advisor state

Advisors were rechecked after the behavioral release even though there was no DDL.

Security advisor remains exactly the two known WARN findings:

1. authenticated execution of `SECURITY DEFINER` `public.record_learning_attempt(...)`; intentional for the guarded attempt-recording RPC boundary;
2. leaked-password protection disabled under the current Supabase configuration/plan.

Performance advisor remains **17 `unused_index` INFO** findings and no WARN-level performance regression.

Reference remediation guidance:

- SECURITY DEFINER advisor: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
- leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- unused-index advisor: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## Preserved integrity boundaries

Batch 15 preserves all established evidence/security boundaries:

- all active Iqro packs remain `expert_required`; engineering/catalog completion is not competent human religious-learning approval;
- the expected Iqro expert-review warnings remain intentional;
- generic Latin tracing remains completion-only practice and is not handwriting-shape mastery evidence;
- assessed mastery still requires qualifying measured evidence and anti-farming rules;
- measured all-wrong remains accuracy `0` evidence;
- missing measurement fails closed;
- Drawing/Coloring remain completion-only practice;
- Science remains age-appropriate and avoids unsafe unsupervised experiments;
- account-owned child isolation and durable authenticated attempt outbox behavior remain intact.

## Account/platform boundary

`Secret history scan` is part of CI and is green, but it is still not configured as a required status check in the active `Protect main` ruleset. Adding it remains the documented account-level manual action because ruleset administration writes are not exposed through the connected GitHub API surface.

Automated CI/benchmarking does not replace physical-device acceptance.

## Next stage

**Batch 16 — Performance, accessibility, security, and physical-device QA** is next.

Batch 16 should validate actual route/runtime payloads, accessibility, security boundaries, offline/authenticated flows, and representative physical mobile/camera/audio/trace/drawing/coloring behavior without weakening the Batch 15 recommendation/mastery/report contracts.
