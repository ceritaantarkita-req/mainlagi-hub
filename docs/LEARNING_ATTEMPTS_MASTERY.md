# Mainlagi Learning Attempts & Mastery

Last reviewed: **20 September 2026**

Status: production implementation active on canonical `main`. Core learning/security migrations `0001–0007` are applied; later content migrations extend the catalog. Cloudflare exact-commit deployment/smoke has been validated.

This document defines the shared evidence/mastery layer for all nine current Mainlagi learning subjects. Legacy motion-game scores remain separate.

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

`game_sessions`, `game_scores`, and legacy progress are not reinterpreted as academic mastery.

## 2. Current catalog

The current canonical learning catalog contains:

- 9 subjects;
- 900 activities;
- 683 assessed / 217 practice activities;
- 46 stages;
- 197 lessons;
- 197 active content packs;
- 200 active skills.

Subjects:

1. Bahasa Indonesia
2. English
3. Matematika
4. Iqro
5. Huruf & Menulis
6. Logika
7. Sains
8. Mewarnai
9. Menggambar

Every activity must have explicit learning/catalog semantics including subject, stage/lesson placement, runtime, age range, assessed/practice classification, progression role and skill mappings where evidence is valid.

Practice experiences such as open-ended Drawing/Coloring must not fabricate right/wrong mastery evidence.

## 3. Learning attempts

A learning attempt records one meaningful try at one activity, including bounded fields such as:

- child/activity/subject/stage/runtime;
- completed/abandoned/interrupted state;
- assessed vs practice classification;
- measurable score/accuracy when available;
- correct/incorrect, hints and retries;
- duration/input mode/timestamps;
- bounded metadata.

Guest attempts may remain local. Authenticated attempts use the canonical server write boundary; server-side canonicalization owns evidence/mastery materialization.

## 4. Evidence scoring

For an assessed completed attempt with measurable accuracy:

```text
independencePenalty = min(0.65, hints * 0.12 + retries * 0.08)
independence        = 1 - independencePenalty

evidenceScore =
  accuracy      * 0.72 +
  independence  * 0.18 +
  completion    * 0.10
```

The score is clamped to `0..1` and weighted by difficulty/mapping weight where applicable.

Anti-farming rules include:

- same-activity replay inside the rapid-replay window is retained but non-qualifying;
- replay timing uses server receipt time;
- seven or more retries make the attempt non-qualifying for mastery;
- practice cannot be promoted to assessed by a caller flag;
- completion-only data does not create fake accuracy/evidence.

## 5. Mastery states

Canonical states:

1. `not_started`
2. `exploring`
3. `developing`
4. `proficient`
5. `mastered`

Current thresholds:

- one qualifying attempt: at most `exploring`;
- `developing`: at least 2 qualifying attempts and score >= 0.45;
- `proficient`: at least 2 qualifying attempts and score >= 0.70;
- `mastered`: at least 3 qualifying attempts, score >= 0.85, confidence >= 0.65, and latest two qualifying attempts each >= 0.80.

Only recent qualifying evidence contributes to the current snapshot. There is no current time-decay penalty.

## 6. Completion, rewards and mastery differ

- **Completion** = activity finished.
- **Stars/rewards** = motivation/reward state.
- **Mastery** = evidence-backed state for a measured skill.

A completed creative activity is not automatically evidence of academic competence.

## 7. Progression

Stage readiness requires the defined progression conditions, including required activity completion and qualifying assessed evidence where the stage depends on assessed skills.

Later stages depend on previous-stage readiness. `LearningProgressionGuard` protects direct stage/activity routes from bypassing locked progression.

The UI may change how progression is presented, but a presentation redesign must not silently weaken the evidence/readiness rules.

## 8. Recommendation/adaptive layer

Adaptive Learning V2 is the current recommendation foundation used by child-learning and parent/reporting consumers.

Ranking considers factors such as:

- age compatibility;
- unlocked stages;
- incomplete core activities;
- weak/under-covered assessed skills;
- avoiding immediate exact replay;
- difficulty/context;
- optional motion preference.

Recommendation is deterministic learning-product logic, not medical/developmental diagnosis.

Legacy/simple recommendation helpers should not be treated as canonical if they have no current consumer.

## 9. Cloud child profile boundary

Authenticated learning uses account-owned `public.player_profiles`.

Supported principles:

- list account-owned undeleted profiles;
- create child profiles under the authenticated account;
- select cloud profiles across devices;
- soft-delete using the existing ownership model;
- do not silently auto-upload unrelated local guest profiles after login.

Learning profiles use explicit age data compatible with the current 3–7 product range. Legacy age-group mappings remain supported only where their meaning is explicit.

`demo-gian` remains an explicit sandbox sentinel.

## 10. Cloud reads and refresh

Authenticated parent/learning views read canonical cloud state from learning attempts, evidence, mastery, progress and player profiles under RLS/account ownership.

After a successful canonical cloud attempt write, the learning UI can refresh cloud-backed state without requiring a full browser reload.

Guest/local child play remains local where explicitly supported.

## 11. Ownership/isolation

Ownership is enforced in layers:

### RLS

Learning tables and player profiles are account scoped.

### Parent routes

Authenticated parent routes must verify session and owned/undeleted child identity.

### Authenticated child routes

Changing a child route to another account's real profile ID must fail closed.

### Database write boundary

Core migration `0007_learning_child_ownership` validates real child keys against an undeleted account-owned profile. `demo-gian` is the explicit sandbox exception.

Client/RPC URL manipulation must not create learning history for arbitrary foreign profiles.

## 12. Parent reporting

Parent views distinguish:

- completion;
- rewards/stars;
- assessed/practice attempts;
- evidence coverage;
- skill state/confidence;
- recommendations/practice suggestions;
- achievements/certificates where valid.

Language must avoid medical, developmental or intelligence judgments.

## 13. Certificates

Competency-style certificate criteria require sufficient required completion **and** valid assessed-skill evidence at the configured threshold.

Practice-only subjects must not receive a competency/mastery certificate merely from completion.

Creative completion/milestone outputs may exist, but their wording must not imply measured mastery that the evidence model did not assess.

## 14. Drawing and Coloring boundary

Current Drawing and Coloring activities remain practice/completion-only by design.

The product-quality phase may improve their artwork, scaffolding, interaction and creative feedback without inventing academic mastery evidence.

If a future assessed creative/glyph evaluator is proposed, it requires a separate validated evidence design and regression tests before affecting mastery.

## 15. Activity-quality rule

A technically valid attempt schema does not make an activity pedagogically valid.

For assessed activities, the representation and mechanic must actually measure the mapped skill. Examples:

- visual color recognition should use meaningful visual color representation rather than accidentally measuring reading of color words;
- phonics/listening must not be replaced by visually obvious text answers;
- distractors must be plausible enough to measure the intended discrimination;
- ambiguous or multi-valid answers must not create mastery evidence.

Activity redesign must preserve or explicitly update its skill/evidence contract.

## 16. Iqro boundary

Active Iqro content remains `expert_required`, not `expert_approved`.

Engineering tests can validate code/data consistency but cannot certify pronunciation, religious/pedagogical correctness, glyph/dot content or teaching appropriateness. Competent expert review remains separate acceptance evidence.

## 17. Security hardening summary

Current boundaries include:

- normal anonymous callers cannot forge canonical assessed attempts;
- server/RPC canonicalizes subject/stage/runtime/assessment fields;
- metadata is bounded;
- replay timing uses server receipt time;
- derived learning tables cannot be directly forged by normal clients;
- service-role operations remain server-side;
- child ownership is validated against account-owned profiles;
- parent and authenticated child routes enforce ownership.

## 18. QA contract

Learning regression coverage includes:

- mastery transitions and anti-false-mastery cases;
- poor evidence/hints/retries/rapid replay;
- practice spoof prevention;
- progression/evidence readiness;
- catalog/runtime consistency;
- certificate integrity;
- schema/RLS/RPC/security contracts;
- child ownership and multi-child isolation;
- cloud read/account binding;
- parent/child route ownership;
- scale/adaptive/reporting contracts;
- final catalog acceptance across the current nine-subject/900-activity baseline.

Automated tests do not replace activity-level pedagogical review or physical-device UX acceptance.

## 19. Production/data baseline

Canonical project:

- organization: `inmydraft`
- project: `mainlagi-hub`
- ref: `estvtgflwkebomsqlolv`
- region: `ap-southeast-1`

Core ownership/RLS boundaries are active in production. Current catalog/database verification has matched the nine-subject/900-activity repository baseline.

## 20 September presentation-wave non-impact

The WS-13 child-home/gallery/completion/matching/audio-latency/parent-responsive work does not redefine mastery, evidence, stage readiness or progression.

In particular:

- parent overview may summarize completed activities, stars and recent activity using existing data;
- presentation must not infer mastery from stars/completion;
- family/demo visual separation does not change ownership or evidence storage;
- profile identity vs guide-character separation is visual/domain clarity, not a schema migration;
- QA unlock behavior must stay isolated and may not weaken normal production progression;
- the current Logic `pattern_completion` reuse audit does not authorize mastery/schema changes.

## 19A. World → Evidence design boundary

Petualangan Uang now has a **design-only, disabled** World → Evidence contract.

Source:

```text
src/lib/learning/world/moneyWorldEvidenceBridge.ts
docs/WORLD_EVIDENCE_BRIDGE_ARCHITECTURE_2026-09-23.md
```

Current rule:

```text
World completion / ★★★
≠
Belajar activity completion
≠
skill evidence
≠
mastery
≠
Belajar stars
≠
stage readiness
```

All 16 current World activity placements remain `practice`. Two activities have unapproved candidate relationships to existing Math skills; the other 14 are explicitly excluded from canonical mastery mapping. Candidate status is not activation.

The current `record_learning_attempt(...)` RPC must not be called directly from World because a completed canonical learning attempt can also mutate `child_learning_progress` and canonical star rewards. A future bridge requires a server-owned write boundary that isolates evidence from Belajar completion/reward effects.

The bridge remains disabled until explicit product authorization, pedagogical mapping approval, age-8 handling, server canonicalization, progression/reward isolation and security/anti-farming regression coverage are complete.

No SQL/RPC/schema change is authorized by the design contract.

The disabled contract is validated by CI #1530 at `38bbe570...` and frozen in `checkpoint/world-evidence-bridge-contract-green-20260923`. This is design evidence only; canonical Belajar mastery behavior remains unchanged.

## 19B. World supplemental-evidence activation decision

The next isolated design wave resolves the two v1 candidates without activating runtime writes.

Decision:

```text
money-s02-activity-01
→ deferred from canonical evidence

money-s08-activity-02
→ future supplemental evidence candidate
→ math.operation.subtraction.within_10
→ choice_accuracy_v1
```

The subtraction mapping is limited to future child ages 6–7. Age 8 remains World completion-only because the canonical skill contract currently stops at age 7.

World evidence is explicitly **supplemental**:

- at most one qualifying item per World activity + content version;
- replay of the same static question cannot create repeated qualifying mastery evidence;
- World-only evidence is capped at `exploring`;
- `developing`, `proficient`, and `mastered` require qualifying canonical Belajar evidence;
- World evidence must not mutate Belajar completion, stars, stage readiness or certificate eligibility.

Selected future ingestion is server-owned and separate from `record_learning_attempt(...)`. The proposed additive persistence boundary is `learning_supplemental_skill_evidence`, reached only through a server route/private write function after ownership, source mapping, age, assessment, idempotency, replay and measured-result validation.

Current implementation state remains disabled: no schema migration, endpoint, private write function, runtime emission or source-aware mastery recompute exists yet.

See `WORLD_EVIDENCE_ACTIVATION_DECISION_2026-09-23.md`.

## 20. Change rule

The learning/mastery foundation is currently considered healthy. The next product-quality phase should **not rewrite it by default**.

Any activity/content/frontend redesign must ask:

1. What learning skill is intended?
2. Does the interaction actually measure/practice that skill?
3. Is it assessed or practice?
4. Does the evidence contract remain valid?
5. Does progression/recommendation remain coherent?
6. Are regression tests/docs updated?

See `NEXT_PRODUCT_QUALITY_PLAN.md` for the current execution order.
