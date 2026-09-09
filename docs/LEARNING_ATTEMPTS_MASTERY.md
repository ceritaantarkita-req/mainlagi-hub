# Mainlagi Learning Attempts & Mastery

Status: implementation baseline for the learning-attempt/mastery phase.

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

Local-first attempts are stored under `mainlagi-learning-attempts-v1`. Logged-in users can additionally sync the same canonical attempt through `record_learning_attempt`.

The server RPC owns cloud evidence and mastery materialization. Clients cannot directly forge `child_skill_mastery` or derived evidence rows.

## 3. Skill catalog

Every current learning activity has an explicit spec in `src/lib/learning/catalog.ts`:

- difficulty 1–3
- assessed or practice
- required/optional for stage completion
- one or more measured skills with evidence weights

Practice activities can contribute engagement/progression context without being forced into an academic correctness score. This is especially important for open-ended coloring and story experiences.

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

A replay of the same activity inside 30 seconds is retained as an attempt but does not qualify for mastery. An attempt with seven or more retries is also retained but does not qualify for mastery. These guards prevent reward/mastery farming without deleting the child's learning history.

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

There is currently **no time-decay penalty**. A child is not punished for taking a break. A later curriculum/research decision can add spacing evidence without silently changing the meaning of existing data.

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

## 8. Next-best activity

The ranking engine prefers:

1. age-compatible activities;
2. unlocked stages;
3. incomplete core activities;
4. assessed activities for weaker skills;
5. avoiding the immediately previous activity;
6. touch/audio/core activities before optional motion activities unless motion recommendations are explicitly enabled.

This is deterministic adaptive learning, not an AI diagnosis.

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
- server-side catalog mappings decide which skills receive evidence;
- server-side logic recomputes materialized mastery;
- derived tables are read-only to normal authenticated clients.

Continuous child camera streams are not part of this learning-attempt sync.

## 12. Migration policy

This phase is additive:

- legacy motion scores remain intact;
- existing completion localStorage remains intact;
- new completions are bridged into canonical attempts;
- old completion history is not silently rewritten into high-confidence mastery because the historical evidence quality is insufficient.

A child may therefore need fresh learning attempts before a pre-existing completion can show meaningful mastery. That is deliberate evidence integrity, not data loss.

## 13. QA contract

`npm run test:learning` covers:

- anti-false-mastery behavior
- strong repeated evidence -> mastery
- excessive-retry evidence exclusion
- progression/unlock behavior
- next-activity ranking
- migration table/RLS/RPC/idempotency contracts
- no destructive drop of legacy game score tables

The tests are included in `npm run test:engine`, so both Ubuntu and Windows CI quality gates run them. Full project closure still requires the repository's existing typecheck, lint, simulation, production build, dependency audit, and secret-history scan.

## 14. Known evidence-fidelity boundary

Existing activity components historically emitted only `completeActivity(...)`, not a full attempt result object. The compatibility bridge therefore records these completions with `evidenceFidelity = completion_only` and a conservative assessed input rather than pretending it knows detailed mistakes/hints that the legacy runtime never exposed.

New and upgraded activities should emit explicit correct/incorrect/hint/retry/duration outcomes. The canonical attempt/mastery engine already supports those richer fields; the compatibility bridge is a migration path, not the desired final activity-authoring contract.
