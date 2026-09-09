# Mainlagi Learning Attempts & Mastery

Status: production implementation active on canonical `main`; canonical Supabase migrations `0001–0007` are applied; Cloudflare exact-commit deployment/smoke is validated.

This document defines the shared evidence layer for Bahasa Indonesia, English, Matematika, Iqro, Mewarnai, and future Mainlagi activities. Legacy motion-game scores remain separate.

## 1. Core model

```text
Child Profile
  -> Learning Attempt
    -> Activity-Skill Evidence
      -> Skill Mastery
        -> Stage Readiness / Unlock
          -> Next-Best Activity
            -> Parent Report / Achievement / Certificate
```

`game_sessions`, `game_scores`, and legacy `progress` remain compatible with the motion-game product and are not reinterpreted as academic mastery.

## 2. Learning attempts

A learning attempt records one meaningful try at one activity:

- child/activity/subject/stage/runtime;
- completed, abandoned, or interrupted state;
- assessed vs practice classification;
- measurable score/accuracy when available;
- correct/incorrect, hints, retries;
- duration, input mode, timestamps;
- bounded metadata.

Guest attempts can remain local. Authenticated attempts are sent through `record_learning_attempt`; the server owns canonical evidence/mastery materialization.

Authenticated parent/report UI now treats Supabase as the source of truth rather than silently substituting localStorage when a cloud read fails.

## 3. Skill/activity catalog

Every current learning activity has an explicit catalog spec in `src/lib/learning/catalog.ts`:

- difficulty 1–3;
- assessed or practice;
- required/optional progression role;
- measured skill mappings and weights.

Practice experiences such as open-ended coloring/story activity do not fabricate right/wrong mastery evidence.

Current canonical catalog for this phase contains 12 skills, 17 activities, and 17 activity-skill mappings.

## 4. Evidence scoring

For an assessed completed attempt with measurable accuracy:

```text
independencePenalty = min(0.65, hints * 0.12 + retries * 0.08)
independence        = 1 - independencePenalty

evidenceScore =
  accuracy     * 0.72 +
  independence * 0.18 +
  completion   * 0.10
```

The score is clamped to `0..1` and weighted by difficulty/mapping weight.

Anti-farming rules:

- repeat of the same activity inside 30 seconds is retained but non-qualifying;
- replay timing uses server receipt time;
- attempt with seven or more retries is retained but non-qualifying;
- practice cannot be promoted to assessed by a caller flag;
- completion-only data does not produce fake accuracy/evidence.

## 5. Mastery levels

States:

1. `not_started`
2. `exploring`
3. `developing`
4. `proficient`
5. `mastered`

Only recent qualifying evidence contributes to the current snapshot. One lucky answer must not become mastery:

- one qualifying attempt: at most `exploring`;
- `developing`: at least 2 qualifying attempts and score >= 0.45;
- `proficient`: at least 2 qualifying attempts and score >= 0.70;
- `mastered`: at least 3 qualifying attempts, score >= 0.85, confidence >= 0.65, and latest two qualifying attempts each >= 0.80.

There is no time-decay penalty in the current model.

## 6. Completion, stars, and mastery are different

- **Completion** = activity finished.
- **Stars/rewards** = motivation; first-completion reward semantics prevent replay farming.
- **Mastery** = evidence-backed state for a measured skill.

Parent UI uses the wording **Skor evidence** so a 100% attempt is not presented as 100% mastery.

## 7. Progression

Stage readiness requires:

1. required activities complete;
2. assessed skills represented by required activities have qualifying evidence;
3. evidence readiness reaches the defined threshold.

Later stages depend on previous-stage readiness. The progression guard prevents simply typing a locked stage/activity URL to bypass evidence requirements.

## 8. Next-best activity

Ranking considers:

- age compatibility;
- unlocked stages;
- incomplete core activities;
- weaker assessed skills;
- avoiding immediate repetition;
- touch/audio/core before optional motion unless motion recommendations are enabled.

This is deterministic adaptive ranking, not diagnosis. The engine primitive exists; not every child-home surface has been replaced by it yet.

## 9. Cloud child profile boundary

Authenticated learning UI uses existing `public.player_profiles`.

Supported operations:

- list account-owned undeleted profiles;
- create a child profile under current authenticated `account_id`;
- select a cloud profile across devices;
- soft-delete with `deleted_at`;
- do not auto-upload local guest profiles after login.

Learning profiles created by the new flow store explicit age `3..7` in the existing `age_group` text column. Legacy account profiles remain compatible for specific groups:

```text
TK   -> age 5
SD 1 -> age 6
SD 2 -> age 7
```

Legacy `Umum` is deliberately not assigned a child learning age because that would be ambiguous.

`demo-gian` remains an explicit sandbox sentinel. Its learning data is still account-scoped.

## 10. Cloud learning reads

For an authenticated user, Parent Progress/Report and learning hooks read canonical state from:

- `learning_attempts`;
- `learning_attempt_skill_evidence`;
- `child_skill_mastery`;
- `child_learning_progress`;
- `player_profiles`.

Every child-specific cloud query filters `child_key`/profile ID while RLS binds rows to `auth.uid()`.

After `record_learning_attempt` succeeds, the runtime emits `mainlagi-learning-cloud`, causing the cloud-backed UI to refresh immediately instead of requiring a page reload.

Guest/local child play remains local-only.

## 11. Multi-child and ownership isolation

Ownership is enforced in layers:

### RLS

Learning tables and `player_profiles` are account scoped by `auth.uid()`.

### Parent server routes

When Supabase is configured:

- `/parent/*` requires a server-verified authenticated session;
- `/parent/children/<childId>/*` requires an undeleted profile owned by that account;
- foreign/deleted child IDs fail closed.

### Authenticated child routes

A logged-in user changing `/child/<childId>/...` to another account's real profile ID receives a fail-closed route result. Unauthenticated guest/local play remains available.

### Database write boundary

Migration `0007_learning_child_ownership` attaches a trigger to `learning_attempts`. Real child keys must resolve to an undeleted `player_profiles` row with the same `account_id`; otherwise the write raises `42501`. Only `demo-gian` is the explicit sandbox exception.

This means client/RPC URL manipulation cannot create learning history for an arbitrary foreign/non-owned real child profile.

## 12. Parent reporting

Parent views separate:

- unique completion;
- stars/rewards;
- total/assessed/practice attempts;
- evidence coverage;
- skill state/confidence;
- practice suggestions;
- achievements/certificates.

Language avoids medical, developmental, or intelligence judgments.

## 13. Certificates

Competency certificate criteria require:

- all required subject activities complete; and
- every skill measured by assessed activity in that subject at least `proficient`.

A practice-only subject **does not receive a competency/mastery certificate merely from completion**, because that would imply measured competence without assessed evidence. This rule was hardened in the mastery closure tests.

Certificates that legitimately qualify can be produced as scalable SVG for browser/OS print-to-PDF workflows.

## 14. Migration policy and live database

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)

Applied chain verified 10 September 2026:

- `0001_init`
- `0002_learning_attempt_schema`
- `0003_learning_mastery_functions`
- `0004_learning_rpc_hardening`
- `0005_database_advisor_hardening`
- `0006_private_admin_helper`
- `0007_learning_child_ownership`

The phase remains additive: legacy game data is not dropped or rewritten into artificial mastery.

Live structure verification confirmed the new ownership trigger is enabled. The Supabase SQL inspection connector itself runs read-only, so it cannot run a direct mutation test through `execute_sql`; that tool limitation is recorded rather than misreported as an application failure.

## 15. Security hardening summary

Current boundaries include:

- `anon` cannot call `record_learning_attempt`;
- attempt RPC is authenticated/service-role only;
- lower-level mastery recompute helper is service-role only;
- activity subject/stage/runtime/assessment are canonicalized server-side;
- metadata is bounded;
- replay timing uses server receipt time;
- derived learning tables cannot be directly forged by normal clients;
- admin helper moved to private schema;
- real attempt child keys are validated against account-owned undeleted profiles;
- parent and authenticated child URLs enforce ownership.

## 16. QA contract

`npm run test:learning` includes:

- anti-false-mastery / full mastery transitions;
- poor evidence, hints, retries, rapid replay;
- practice spoof prevention;
- progression qualifying-evidence behavior;
- catalog/assessed runtime consistency;
- certificate integrity;
- migration table/RLS/RPC/security contracts;
- migration `0007` ownership contracts;
- multi-child isolation;
- cloud child query/account-binding contracts;
- parent/child URL ownership contracts;
- legacy profile age-group compatibility.

Tests run inside the engine suite on Ubuntu and Windows CI.

## 17. Production evidence

Production architecture:

```text
GitHub main
  -> Cloudflare Git integration
  -> OpenNext Worker mainlagi-hub
  -> https://mainlagihub.my.id/
  -> canonical Supabase estvtgflwkebomsqlolv
```

Verified production evidence includes:

- exact-commit Cloudflare Git deployment;
- commit-aware `/api/health` smoke gate;
- canonical Supabase target metadata verification;
- authenticated production learning attempts for `demo-gian` observed in live DB;
- assessed evidence and mastery materialization observed live;
- one perfect evidence row correctly remains `exploring` rather than becoming mastery;
- cloud-profile/ownership implementation commit `7fa7ab7b4642e67343370924e740433fefe8f914` deployed successfully;
- Cloudflare Build ID `77e6e799-bd5d-4170-ae2e-8a39876a5c6d`, Version ID `e9d879f1-100d-48d6-9142-90f1f51d1912`;
- `Production smoke (Cloudflare)` passed for the exact commit.

## 18. Closure state

Requested cloud-learning items 1–5 are implemented and production-deployed:

1. [x] cloud child profiles;
2. [x] cloud learning-state reads;
3. [x] immediate refresh after cloud attempt sync;
4. [x] multi-child isolation/ownership hardening;
5. [x] parent gate + direct URL child ownership protection.

A manual browser create/delete exercise for a brand-new real cloud child can still be captured as UX acceptance evidence, but the code/schema/deployment block is closed and protected by regression tests.
