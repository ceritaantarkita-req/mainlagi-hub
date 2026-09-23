# Mainlagi World → Evidence Bridge Architecture — 23 September 2026

Status: **VALIDATED GREEN / DESIGN-ONLY / BRIDGE DISABLED / CHECKPOINTED**

Branch:

```text
feature/world-evidence-bridge-contract-20260923
```

Baseline:

```text
6aaee9323e53bea1a531a7e1013bf222c367b00e
```

This document defines how a future Mainlagi World experience may contribute measured learning evidence to the canonical Belajar/mastery system without allowing World completion, stars, replay, or client-controlled metadata to manufacture mastery.

It is an architecture contract only. It does not activate the bridge.

## 1. Existing systems remain separate

World currently owns:

```text
World
→ Chapter
→ Stage
→ Scene
→ Segment
→ World activity / narrative choice / recap
→ World completion + ★★★
```

Belajar currently owns:

```text
Child
→ Subject
→ Stage
→ Lesson
→ Activity
→ Learning Attempt
→ Skill Evidence
→ Skill Mastery
→ Stage Readiness / Recommendation / Parent Report
```

These are different progression domains.

World ★★★ and World Stage completion must not be interpreted as:

- Belajar activity completion;
- qualifying skill evidence;
- mastery;
- Belajar stars;
- Belajar stage readiness;
- certificate eligibility.

## 2. Why the current learning RPC cannot be called directly

The canonical `record_learning_attempt(...)` RPC is designed for canonical `learning_activities`.

For a completed canonical Belajar activity it can:

- insert `learning_attempts`;
- materialize assessed skill evidence;
- recompute mastery;
- append the activity ID to `child_learning_progress.completed_activity_ids`;
- award the canonical activity's Belajar stars.

Therefore a World client must **not** directly call the current learning-attempt RPC using a guessed or borrowed Belajar activity ID.

Doing so could make World play accidentally:

```text
complete a Belajar activity
→ award Belajar stars
→ satisfy required completion
→ alter stage readiness
```

That is explicitly forbidden by the v1 bridge contract.

## 3. Current v1 contract

Source:

```text
src/lib/learning/world/moneyWorldEvidenceBridge.ts
version: money-world-evidence-bridge-v1
mode: design-only-disabled
enabled: false
```

All write effects are false:

```text
direct record_learning_attempt use: false
local learning-attempt write:       false
cloud learning-attempt write:       false
skill-evidence write:               false
mastery recompute:                  false
Belajar progress mutation:          false
Belajar reward mutation:            false
certificate mutation:               false
schema migration authorization:     false
runtime hook authorization:         false
```

## 4. Current World activity truth

Petualangan Uang currently has:

```text
16 World activity placements
16 practice
0 assessed
```

Even when a reusable mechanic can technically calculate accuracy, its current World placement remains `practice`.

Mechanic capability does not override authored assessment semantics.

For example:

```text
compare mechanic can measure accuracy
≠
this World compare activity is automatically assessed
```

A caller is also forbidden from sending `assessment: assessed` to promote a World practice activity.

## 5. Current mapping audit

The owner-authorized candidate-scope and pedagogical review is now complete.

Exactly one relationship remains in the future evidence scope:

### Approved mapping — still disabled

```text
World:
money-s08-activity-02
Stage 8 — 8 minus 2
mechanic: tap_choice
current assessment: practice

approved canonical skill:
math.operation.subtraction.within_10

compatible measured contract:
choice_accuracy_v1

mapping status:
pedagogy-approved-disabled
```

Approval rationale:

- the authored prompt directly asks `8 - 2`;
- the presentation is explicit take-away with `startCount=8` and `removeCount=2`;
- the correct outcome is objectively `6`;
- the canonical skill is defined as subtraction within ten;
- canonical Belajar activities for the same skill use equivalent small-number take-away/subtraction prompts;
- the reusable `tap_choice` mechanic resolves to `choice_accuracy_v1` when assessed.

This is **pedagogical mapping approval only**. The World placement remains `practice`, has no canonical `learning_activity` ID, and cannot emit evidence.

### Rejected mapping

```text
World:
money-s02-activity-01
Stage 2 — price comparison
mechanic: compare
current assessment: practice

previous candidate:
math.quantity.comparison

decision:
rejected-after-pedagogy-review
```

Reason:

the child chooses which **price is more expensive** inside a price-change/inflation story. Although the visible numbers are 10 and 12, the authored construct is contextual financial price comparison. A correct answer therefore does not isolate the canonical Math quantity-comparison construct strongly enough to justify mastery evidence.

Current audited result:

```text
16 World activity placements
16 practice
0 assessed
1 pedagogy-approved future evidence mapping
15 exclusions
0 active evidence mappings
```

The rejected price relationship now carries no canonical skill/evidence mapping.

## 6. Financial-literacy catalog gap

The current Belajar catalog has nine subjects and does not currently define a financial-literacy subject/skill family for concepts such as:

- money and price;
- price change/inflation introduction;
- work/business income source;
- needs vs wants;
- saving toward a goal;
- investment introduction;
- uncertainty/risk.

The bridge must not borrow unrelated Math/Logic skills to make those concepts appear measurable.

A future financial-literacy catalog is a separate curriculum/schema/product decision.

## 7. Age boundary

Petualangan Uang pilot:

```text
age 6–8
```

Current canonical Belajar skill/catalog age contract:

```text
age 3–7
```

Therefore age 8 remains a hard activation blocker.

The World bridge must not silently solve this by rewriting all canonical skill `ageMax` values.

Any age expansion remains a separate migration decision.

## 8. Proposed future data flow

If the bridge is later authorized, the intended architecture is:

```text
World runtime
  ↓
WorldEvidenceObservation
  ↓
server-owned World Evidence Gate
  ↓
server-owned source/activity/skill mapping
  ↓
validated measured evaluator
  ↓
evidence-only canonical write boundary
  ↓
learning_attempt / skill evidence
  ↓
canonical mastery recompute
```

The important rule is:

```text
World evidence contribution
≠
Belajar completion/reward mutation
```

A future implementation must preserve:

```text
progressionEffect = none
rewardEffect      = none
```

unless a later product decision explicitly authorizes otherwise.

## 9. Observation envelope

The v1 design defines a bounded future observation shape containing:

- World ID;
- Stage ID;
- World activity ID;
- mechanic ID;
- authored assessment mode;
- attempt status;
- measured accuracy/counts when available;
- hints/retries/duration/input mode;
- timestamps.

The contract validates source identity against the audited World activity manifest before even considering a mapping.

Unknown activity IDs, stage/mechanic mismatches, or a caller attempting to promote `practice → assessed` fail closed.

## 10. Server ownership requirement

A future active bridge must be server-owned.

The client may report an observation, but it must not decide:

- target canonical skill;
- target canonical activity;
- evidence weight;
- assessment status;
- mastery eligibility;
- progression effect;
- reward effect.

Those decisions must come from an approved server-side mapping/catalog contract.

## 11. Anti-farming / integrity requirements

A future bridge must inherit the existing learning-integrity protections:

- account/child ownership;
- idempotency;
- server receipt-time replay protection;
- retry limits;
- measured result requirements;
- canonical skill mapping;
- bounded metadata;
- no client assessment promotion;
- no direct derived-table writes.

World replay should not become a shortcut to repeated qualifying mastery evidence.

## 12. Activation prerequisites

Every current activation requirement is deliberately `satisfied: false`.

Required before activation:

1. explicit product authorization;
2. server-owned ingestion/canonicalization boundary;
3. isolation from Belajar completion/stars/progression side effects;
4. validated assessed evaluator for each World activity being promoted;
5. pedagogical approval of each World → canonical skill mapping;
6. age-8 Belajar contract decision;
7. ownership/idempotency/replay/retry/security regression coverage;
8. schema/RPC changes, if any, reviewed as a separate migration wave;
9. cloud/local behavior explicitly defined;
10. parent-report language updated so World evidence is distinguishable from direct Belajar attempts.

## 13. Current fail-closed behavior

`evaluateMoneyWorldEvidenceObservation(...)` always returns:

```text
disposition: blocked

canWriteLearningAttempt:  false
canCreateSkillEvidence:   false
canAffectMastery:         false
canAffectLearningProgress:false
canAwardStars:            false
canIssueCertificate:      false
```

Additional blockers explain whether the observation is:

- an unapproved candidate;
- explicitly excluded;
- spoofing assessment;
- malformed/unknown;
- missing a measured outcome;
- incomplete.

## 14. Runtime isolation

The World runtime is not allowed to import or call the bridge.

The current global `LearningAttemptBridge` remains scoped to canonical child `/activity/<id>` routes and rejects unknown catalog activities.

World progression remains on the separate World progress channel.

This design wave adds no event emission from Petualangan Uang.

## 15. No schema migration in this wave

This branch adds:

```text
0 SQL migrations
0 RPC changes
0 RLS changes
0 learning_activity rows
0 learning_skill rows
0 runtime bridge hooks
0 mastery writes
```

The database remains unchanged.

## 16. Decision still open for a future implementation

The future server write mechanism is intentionally not selected here.

Possible implementations may include:

- a dedicated server action/API that internally materializes evidence;
- a dedicated RPC with explicit `progressionEffect=none` semantics;
- an extension of the canonical attempt layer that separates evidence contribution from completion/reward side effects.

The chosen implementation must preserve the v1 invariants above.

Do not activate by simply wiring World to the existing `record_learning_attempt(...)` RPC.

## 17. QA contract

World regression tests must keep verifying:

- all 16 current World activities remain practice;
- exact 1 pedagogy-approved-disabled candidate / 15 excluded audit coverage;
- candidate skill IDs exist;
- candidate mechanic evidence contracts are compatible;
- candidate mappings have no canonical learning-activity ID yet;
- all write permissions remain false;
- the candidate-scope pedagogical-review requirement is satisfied; every remaining activation requirement stays unsatisfied;
- valid candidate observation still returns blocked;
- `practice → assessed` spoof fails closed;
- excluded activity stays unmapped;
- unknown source identity fails closed;
- World runtime contains no evidence-bridge/learning-attempt write hook;
- current learning-attempt RPC still has progression/reward side effects, so direct reuse stays prohibited.

## 18. Next boundary

Candidate selection and pedagogical mapping are now closed for this wave.

The next World → Evidence decision boundary is:

```text
age-8 handling
+ validated assessed World evaluator
+ server-owned evidence write architecture
+ progression/reward isolation
+ schema/RPC impact
+ ownership/idempotency/replay/anti-farming/security
```

There is still **no runtime activation by default**.

Until those remaining gates are separately authorized and validated:

```text
World → Evidence = one pedagogy-approved mapping, fail-closed, disabled
```

## 19. Green validation / immutable design checkpoint

Exact validated design head:

```text
38bbe5704d4d63781410842cbf134dcb76c3ab54
```

CI:

```text
Mainlagi TV V3 CI #1530
run 35764121287

Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Relevant artifacts:

```text
mobile-route-qa-screenshots — 10711921117
activity-quality-audit      — 10711900290
gameplay-distribution-audit — 10710879966
```

Frozen immutable checkpoint:

```text
checkpoint/world-evidence-bridge-contract-green-20260923
@ 38bbe5704d4d63781410842cbf134dcb76c3ab54
```

This checkpoint validates the **architecture contract only**. It does not authorize an active evidence bridge, SQL/RPC changes, runtime event emission, activity promotion to assessed, mastery writes, Belajar progress changes, rewards, or certificates.

PR #295 remains Draft and is a CI/review surface only.

Do not move or force-push the checkpoint branch.


## 20. Documentation handoff checkpoint

The design implementation checkpoint remains immutable:

```text
checkpoint/world-evidence-bridge-contract-green-20260923
@ 38bbe5704d4d63781410842cbf134dcb76c3ab54
CI #1530 / run 35764121287
```

A later docs-only synchronization head was also validated and frozen before final handoff cleanup:

```text
checkpoint/world-evidence-bridge-docs-green-20260923
@ eb793f442cbee8d38f528cb5dbff0d15784a6200
CI #1532 / run 35765390710
```

The second checkpoint does not activate the bridge; it only synchronizes architecture/mastery/World documentation around the already-green v1 contract.

Canonical compact handoff:

```text
docs/WORLD_EVIDENCE_BRIDGE_DESIGN_CLOSURE_2026-09-23.md
```


## 21. Final design-closure checkpoint

The complete design + documentation handoff head was independently revalidated and frozen:

```text
head:   82faddd6b90eac603cb2449b8f16d7aff98a1792
CI:     #1535 / run 35768996360
branch: checkpoint/world-evidence-bridge-design-closure-green-20260923
PR:     #295 Draft / open / unmerged
```

Full matrix:

```text
Quality gate (Ubuntu):        PASS
Windows compatibility:        PASS
Production build:             PASS
Production dependency audit:  PASS
Secret history scan:          PASS
Mobile route QA (Chromium):   PASS
overall:                      SUCCESS
```

Artifacts:

```text
mobile-route-qa-screenshots — 10713213659
activity-quality-audit      — 10713845267
gameplay-distribution-audit — 10713730435
```

This is the final safe handoff for **v1 architecture design only**.

It does not supersede the narrower implementation checkpoint at `38bbe570...`; it adds the synchronized closure documentation and current-state handoff around the same disabled contract.

No activation permission is implied by this checkpoint.

## 22. Owner-authorized candidate-scope / pedagogy decision wave

Follow-up branch:

```text
feature/world-evidence-pedagogy-approval-20260923
```

Owner authorization in this wave covers only:

```text
1. candidate scope
2. pedagogical mapping
```

Decision:

```text
APPROVE:
money-s08-activity-02
→ math.operation.subtraction.within_10
→ choice_accuracy_v1 compatible
→ mappingStatus: pedagogy-approved-disabled

REJECT:
money-s02-activity-01
→ no canonical skill mapping
→ mappingStatus: rejected-after-pedagogy-review
```

Unchanged safety boundary:

- all 16 World placements remain `practice`;
- bridge remains `enabled: false`;
- runtime event emission remains absent;
- attempt/evidence/mastery writes remain false;
- Belajar completion/stars/progression remain untouched;
- SQL/RPC/RLS/schema changes remain zero;
- age 8, assessed evaluator, server ingestion, side-effect isolation and security/anti-farming remain unresolved activation gates.

This decision supersedes the old **2 candidate / 14 excluded** mapping state for the follow-up branch, but it does not alter or move the immutable earlier checkpoints.

