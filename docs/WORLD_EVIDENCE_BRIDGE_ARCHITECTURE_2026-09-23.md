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

Two activities remain **unapproved candidates**, not active mappings.

### Candidate A

```text
World:
money-s02-activity-01
Stage 2 — price comparison
mechanic: compare
current assessment: practice

possible canonical skill:
math.quantity.comparison

possible mechanic evidence contract:
choice_accuracy_v1
```

Reason for keeping it only as a candidate:

the child compares numeric price amounts, but contextual price comparison is not automatically identical to canonical quantity-comparison mastery.

### Candidate B

```text
World:
money-s08-activity-02
Stage 8 — 8 minus 2
mechanic: tap_choice
current assessment: practice

possible canonical skill:
math.operation.subtraction.within_10

possible mechanic evidence contract:
choice_accuracy_v1
```

Reason for keeping it only as a candidate:

the objective is structurally close to canonical subtraction, but the World activity is still authored as practice and no canonical bridge activity/write path is approved.

The remaining 14 World activities are explicitly excluded from canonical mastery mapping today.

Their financial-literacy objectives do not have compatible canonical Belajar skills merely because their interaction mechanics are measurable.

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
- exact 2 candidate / 14 excluded audit coverage;
- candidate skill IDs exist;
- candidate mechanic evidence contracts are compatible;
- candidate mappings have no canonical learning-activity ID yet;
- all write permissions remain false;
- all activation requirements remain unsatisfied;
- valid candidate observation still returns blocked;
- `practice → assessed` spoof fails closed;
- excluded activity stays unmapped;
- unknown source identity fails closed;
- World runtime contains no evidence-bridge/learning-attempt write hook;
- current learning-attempt RPC still has progression/reward side effects, so direct reuse stays prohibited.

## 18. Next boundary

After this design contract is green, there is still **no activation work by default**.

The next World → Evidence step requires a separate user/product authorization to choose:

```text
candidate scope
+ pedagogical mapping approval
+ age handling
+ server write architecture
+ progression/reward isolation
+ schema/RPC impact
```

Until then the correct production state is:

```text
World → Evidence = designed, fail-closed, disabled
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

## 22. Post-v1 activation decision wave

The separately authorized decision wave is recorded in:

```text
docs/WORLD_EVIDENCE_ACTIVATION_DECISION_2026-09-23.md
src/lib/learning/world/moneyWorldEvidenceActivationDesign.ts
```

It resolves the previously open design questions without changing this v1 runtime authority:

- Stage 2 price comparison is deferred from canonical evidence;
- Stage 8 `8 - 2` is selected as the sole future supplemental-evidence mapping to `math.operation.subtraction.within_10`;
- future evidence is age 6–7 only; age 8 remains World-only;
- server ingestion is selected as a dedicated server route + private supplemental-evidence write boundary;
- repeated static World content cannot farm qualifying evidence;
- World-only evidence is capped at `exploring` and higher mastery requires canonical Belajar evidence.

The v1 bridge in this document remains fail-closed and disabled until the implementation blockers in the activation-decision contract are separately completed and validated.
