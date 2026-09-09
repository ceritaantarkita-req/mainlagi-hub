# Mainlagi Learning Attempts & Mastery

Status: merged into canonical `main`; code-level CI is green; canonical Supabase learning migrations are applied and hardened. Final production smoke-test closure is pending on the canonical Cloudflare deployment.

This document describes the shared learning evidence layer used by Bahasa Indonesia, English, Matematika, Iqro, Mewarnai, and future Mainlagi activities. It is intentionally separate from the legacy motion-game score/leaderboard model.

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

`game_sessions`, `game_scores`, and legacy `progress` remain compatible with the existing motion-game product. They are not reinterpreted as academic mastery.

## 2. Learning attempt

A learning attempt represents one meaningful try at one learning activity. It records:

- child/activity/subject/stage/runtime
- completed, abandoned, or interrupted status
- assessed vs practice mode
- normalized score/accuracy when the activity can actually be assessed
- correct/incorrect counts
- hint and retry counts
- duration and input mode
- start/completion timestamps
- bounded metadata

Local-first attempts are stored under `mainlagi-learning-attempts-v1`. Logged-in users can additionally sync the same canonical attempt through `record_learning_attempt` when a valid authenticated Supabase session exists.

The server RPC owns cloud evidence and mastery materialization. Clients cannot directly forge `child_skill_mastery` or derived evidence rows.

## 3. Skill catalog

Every current learning activity has an explicit spec in `src/lib/learning/catalog.ts`:

- difficulty 1–3
- assessed or practice
- required/optional for stage completion
- one or more measured skills with evidence weights

Practice activities can contribute engagement/progression context without being forced into an academic correctness score. This is especially important for open-ended coloring and story experiences.

The canonical Supabase project currently contains 12 learning skills, 17 learning activities, and 17 activity-skill mappings, matching the committed catalog for this phase.

## 4. Evidence scoring

For an assessed, completed attempt with measurable accuracy:

```text
independencePenalty = min(0.65, hints * 0.12 + retries * 0.08)
independence        = 1 - independencePenalty

evidenceScore =
  accuracy     * 0.72 +
  independence * 0.18 +
  completion   * 0.10
```

The result is clamped to `0..1` and weighted by activity difficulty and the activity-skill mapping.

A replay of the same activity inside 30 seconds is retained as an attempt but does not qualify for mastery. Server-side replay protection uses server receipt time rather than trusting a client-supplied completion timestamp. An attempt with seven or more retries is also retained but does not qualify for mastery.

## 5. Mastery levels

Skill states are:

1. `not_started`
2. `exploring`
3. `developing`
4. `proficient`
5. `mastered`

Only the eight most recent qualifying evidence rows are considered for the current mastery snapshot. Recent evidence gets slightly more weight, while consistency contributes to confidence.

Rules intentionally prevent one lucky answer from becoming mastery:

- one qualifying attempt: at most `exploring`
- `developing`: at least 2 qualifying attempts and score >= 0.45
- `proficient`: at least 2 qualifying attempts and score >= 0.70
- `mastered`: at least 3 qualifying attempts, score >= 0.85, confidence >= 0.65, and the latest two qualifying attempts each score >= 0.80

There is currently **no time-decay penalty**. A child is not punished for taking a break.

## 6. Completion, rewards, and mastery are different

- **Completion**: the child finished an activity.
- **Stars/rewards**: motivational feedback; awarded once per unique completion.
- **Mastery**: evidence-backed estimate for a specific assessed skill.

Stars must never be presented as intelligence or academic rank. Practice activities may award stars without creating assessed mastery.

## 7. Progression

Stage readiness requires:

1. all required activities in the stage are completed; and
2. every assessed skill represented by those required activities has evidence; and
3. average evidence readiness is at least 0.45.

The first stage of each subject is unlocked by default. A later stage unlocks only when the previous stage is ready.

The child runtime mounts an evidence-aware progression guard so locked stages/activities cannot be bypassed merely by typing a URL.

Important current boundary: a legacy completion-only event does **not** fabricate assessed evidence. Therefore a stage that requires assessed evidence can remain locked until that activity runtime emits a real measurable attempt result.

## 8. Next-best activity

The ranking engine prefers:

1. age-compatible activities;
2. unlocked stages;
3. incomplete core activities;
4. assessed activities for weaker skills;
5. avoiding the immediately previous activity;
6. touch/audio/core activities before optional motion activities unless motion recommendations are explicitly enabled.

This is deterministic adaptive learning, not an AI diagnosis.

The ranking primitive exists in the learning engine. Existing child-home quest selection has not yet been fully replaced by this ranking everywhere, so product UI must not claim that all recommendations are already adaptive.

## 9. Parent reporting

Parent progress/report views separate:

- unique activity completion
- stars/rewards
- total/assessed/practice attempts
- evidence coverage
- skill-level states
- suggested areas for additional practice
- achievements

The language deliberately avoids medical, developmental, or intelligence judgments.

## 10. Certificates

Certificate criteria v1:

- all required activities for the subject are complete; and
- every skill measured by an assessed activity in that subject is at least `proficient`.

Practice-only subjects can qualify on completion because the product must not invent a right/wrong mastery score for open-ended creative work.

Eligible certificates can be downloaded as scalable SVG from the parent area. SVG keeps the artifact dependency-free and print-sharp; a parent can print/save it as PDF through the operating system/browser.

## 11. Local/cloud boundary

Guest/local mode remains usable without Supabase. When Supabase is configured and a valid authenticated session exists:

- the same attempt is sent through `record_learning_attempt`;
- `(account_id, child_key, client_attempt_id)` provides idempotency;
- subject/stage/runtime/assessment are canonicalized from `learning_activities` on the server;
- server-side catalog mappings decide which skills receive evidence;
- server-side logic recomputes materialized mastery;
- derived learning tables are read-only to normal authenticated clients;
- `anon` cannot execute `record_learning_attempt`;
- the lower-level `recompute_child_skill_mastery` helper is service-role only.

Continuous child camera streams are not part of this learning-attempt sync.

## 12. Migration policy and live database state

This phase is additive:

- legacy motion scores remain intact;
- existing completion localStorage remains intact;
- new completions are bridged into canonical attempts;
- old completion history is not silently rewritten into high-confidence mastery because the historical evidence quality is insufficient.

A child may therefore need fresh **measurable** learning attempts before a pre-existing completion can show meaningful mastery. That is deliberate evidence integrity, not data loss.

Canonical Supabase project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- project ref: `estvtgflwkebomsqlolv`
- region: Singapore (`ap-southeast-1`)

Applied migration chain verified 9 September 2026:

- `0001_init`
- `0002_learning_attempt_schema`
- `0003_learning_mastery_functions`
- `0004_learning_rpc_hardening`
- `0005_database_advisor_hardening`
- `0006_private_admin_helper`

The duplicate empty Mainlagi-named project that previously caused confusion was deleted by the account owner. No learning migration/data had been written to it, so no data transfer was required.

### Security hardening added after live inspection

Hardening migrations:

- explicitly revoke `anon` execution from `record_learning_attempt`;
- make `recompute_child_skill_mastery` service-role only;
- bound attempt metadata to 16 KiB server-side;
- ignore client-supplied subject/stage/runtime/assessment for evidence semantics and derive them from the activity catalog;
- make replay protection depend on server receipt time;
- change legacy `record_best_score` to SECURITY INVOKER because RLS already provides its ownership boundary;
- remove unnecessary public access to trigger/season helper functions;
- move the admin-check helper from exposed `public.is_admin()` to `private.is_admin()` and rebind RLS policies.

## 13. QA contract

`npm run test:learning` covers:

- anti-false-mastery behavior
- strong repeated evidence -> mastery
- excessive-retry evidence exclusion
- progression/unlock behavior
- next-activity ranking
- migration table/RLS/RPC/idempotency contracts
- RPC hardening and server-canonical activity metadata
- advisor hardening and private admin-helper contract
- no destructive drop of legacy game score tables

The tests are included in `npm run test:engine`, so both Ubuntu and Windows CI quality gates run them.

The canonical production build target is OpenNext/Cloudflare. GitHub `Production build` must pass `npm run build:cloudflare` before merge.

Database verification on the canonical project confirmed:

- all new learning tables have RLS enabled;
- direct authenticated DML on derived learning tables is revoked;
- function ACLs match the intended trust boundary;
- Supabase performance advisor has no WARN-level findings after hardening;
- Supabase security advisor has one intentional warning for authenticated execution of the SECURITY DEFINER `record_learning_attempt` RPC.

Supabase leaked-password protection remains disabled because the project is on the Free plan and Supabase documents that protection as a Pro-plan feature. Minimum password length is at least 8, secure password change is enabled, and current password is required when updating. This is an accepted plan limitation, not a production blocker.

## 14. Evidence-fidelity boundary

Existing activity components historically emitted only `completeActivity(...)`, not a full attempt result object.

The compatibility bridge treats those events conservatively:

- the completion is retained as a learning attempt;
- `evidenceFidelity = completion_only` is recorded in metadata;
- no placeholder accuracy/score is invented;
- no mastery evidence is created from completion-only data.

On the server, an activity becomes evidence-bearing only when the catalog marks it assessed **and** the attempt contains measurable score/accuracy. A client cannot force completion-only data into mastery simply by setting an `assessed` flag.

New and upgraded assessed activities should emit explicit measurable outcomes such as correct/incorrect counts, hints, retries, duration, and input mode. The canonical attempt/mastery engine already supports those richer fields; the compatibility bridge is only a migration path.

## 15. Production closure state

Canonical production architecture:

```text
GitHub `main`
  -> Cloudflare Git integration / build
  -> OpenNext Cloudflare Worker `mainlagi-hub`
  -> https://mainlagihub.my.id/
```

Observed 9 September 2026:

- learning-attempt/mastery foundation is merged into `main`;
- canonical Supabase `mainlagi-hub` is active/healthy;
- migrations `0001–0006` are applied and live database ACL/RLS/advisor checks are complete;
- obsolete VPS/SSH deployment assumptions have been identified and are being removed from code/docs;
- no `MAINLAGI_VPS_*` GitHub Actions secrets are required;
- final closure requires the corrected `main` commit to deploy successfully through Cloudflare, public health to pass, and an authenticated learning-attempt/mastery write-path smoke test plus local fallback check to succeed.

Do not mark this phase production-closed until those Cloudflare/public/application smoke checks pass.
