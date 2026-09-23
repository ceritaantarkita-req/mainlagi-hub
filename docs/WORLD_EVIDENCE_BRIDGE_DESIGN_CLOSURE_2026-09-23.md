# Mainlagi World → Evidence v1 — Design Closure — 23 September 2026

Status: **DESIGN GREEN / FAIL-CLOSED / BRIDGE DISABLED**

This document is the compact handoff for the World → Evidence architecture work. It is not an activation record.

## 1. Branch / PR boundary

```text
branch: feature/world-evidence-bridge-contract-20260923
PR:     #295
state:  Draft / open / unmerged
base:   feature/world-petualangan-uang-production-wave-20260922
```

No merge to `main` is authorized by this closure.

## 2. Immutable checkpoints

Design implementation:

```text
checkpoint/world-evidence-bridge-contract-green-20260923
@ 38bbe5704d4d63781410842cbf134dcb76c3ab54
CI #1530 / run 35764121287 — full success
```

Docs synchronization before this closure cleanup:

```text
checkpoint/world-evidence-bridge-docs-green-20260923
@ eb793f442cbee8d38f528cb5dbff0d15784a6200
CI #1532 / run 35765390710 — full success
```

Do not move or force-push either checkpoint.

## 3. Core invariant

```text
World completion / ★★★
≠ Belajar activity completion
≠ canonical skill evidence
≠ mastery
≠ Belajar stars
≠ stage readiness
≠ certificate eligibility
```

World and Belajar remain separate progression domains.

## 4. Current audited World activity state

Petualangan Uang still contains:

```text
16 World activity placements
16 practice
0 assessed
```

The owner-authorized candidate-scope/pedagogy review has reduced the future evidence scope to exactly one activity:

```text
money-s08-activity-02
Stage 8 — 8 minus 2
→ pedagogy-approved-disabled
→ math.operation.subtraction.within_10
→ choice_accuracy_v1 compatible
```

The mapping is approved because the authored task directly represents subtraction within ten: eight tokens, two removed, one objectively correct remaining count.

The former Stage 2 candidate is now rejected:

```text
money-s02-activity-01
Stage 2 — price comparison
→ rejected-after-pedagogy-review
→ no canonical skill mapping
```

Its objective is contextual price change / "more expensive", so it does not isolate canonical quantity-comparison mastery strongly enough.

Current mapping totals:

```text
1 pedagogy-approved future candidate
15 exclusions
0 active evidence mappings
```

The approved candidate still has:

- World `assessment: practice`;
- no canonical `learning_activity` ID;
- no permission to write attempts/evidence;
- no permission to affect mastery/progression/rewards.

## 5. Why direct `record_learning_attempt(...)` reuse is forbidden

The existing canonical Belajar RPC is not an evidence-only sink.

A completed canonical learning attempt can also mutate:

- `child_learning_progress.completed_activity_ids`;
- Belajar stars/reward state;
- stage readiness indirectly through canonical completion/evidence state.

Therefore World must not borrow/guess a Belajar activity ID and call the existing RPC.

A future active bridge requires a server-owned write boundary that can preserve:

```text
progressionEffect = none
rewardEffect      = none
```

unless a later product decision explicitly changes that rule.

## 6. Current v1 source contract

```text
src/lib/learning/world/moneyWorldEvidenceBridge.ts
version: money-world-evidence-bridge-v1
mode:    design-only-disabled
enabled: false
```

All side-effect capabilities remain false:

```text
local learning-attempt write:        false
cloud learning-attempt write:        false
skill evidence write:                false
mastery recompute:                   false
Belajar progress mutation:           false
Belajar reward mutation:             false
certificate mutation:                false
schema migration authorization:      false
runtime hook authorization:          false
direct record_learning_attempt use:  false
```

Even a structurally valid candidate observation returns `blocked`.

## 7. Fail-closed source validation

The design contract rejects:

- unknown World activity IDs;
- Stage mismatch;
- mechanic mismatch;
- caller promotion of `practice → assessed`;
- excluded/unmapped activities;
- incomplete attempts;
- candidate observations with missing measured outcomes.

Mechanic measurability alone never changes authored assessment semantics.

## 8. Activation blockers

Candidate scope and pedagogical mapping are now decided for this wave.

The only satisfied activation prerequisite is:

```text
canonical-mapping-pedagogy-review = true
```

All runtime activation gates remain unsatisfied. Required before any active bridge:

1. explicit product authorization for activation;
2. age-8 Belajar/catalog decision;
3. validated assessed evaluator for the approved Stage 8 subtraction activity;
4. server-owned ingestion/canonicalization boundary;
5. strict isolation from Belajar completion/stars/progression side effects;
6. ownership and child isolation;
7. idempotency;
8. server receipt-time replay protection;
9. retry/anti-farming handling;
10. bounded metadata/canonicalization;
11. cloud/local behavior definition;
12. security regression coverage;
13. parent-report wording that distinguishes World evidence from direct Belajar attempts;
14. separately reviewed SQL/RPC/schema changes if the chosen server architecture requires them.

## 9. Financial-literacy catalog gap

Most Petualangan Uang objectives are not existing Math/Logic mastery skills.

Current World concepts include:

- money and price;
- price changes / inflation introduction;
- work/business income sources;
- needs vs wants;
- saving;
- investment introduction;
- uncertainty/risk.

The bridge must not invent false mastery by borrowing unrelated skills simply because an interaction can emit a score.

A future financial-literacy skill family is a separate curriculum/product/schema decision.

## 10. Age boundary

```text
Petualangan Uang pilot: 6–8
canonical Belajar contract: 3–7
```

Age 8 is an explicit blocker.

Do not solve this by silently changing every Belajar skill/content `ageMax`.

## 11. QA truth

The follow-up decision contract must verify:

- bridge disabled;
- 16/16 activity audit coverage;
- 16 practice placements;
- exactly 1 `pedagogy-approved-disabled` candidate;
- exactly 15 exclusions;
- Stage 8 subtraction maps to `math.operation.subtraction.within_10`;
- Stage 2 price comparison is explicitly `rejected-after-pedagogy-review` and unmapped;
- 0 canonical learning-activity mappings;
- all write/runtime/schema permissions false;
- only the pedagogical-review activation requirement is satisfied;
- every other activation requirement remains unsatisfied;
- valid approved candidate observation still returns `blocked`;
- practice-to-assessed spoof remains blocked;
- excluded and unknown sources remain blocked;
- World runtime contains no evidence-write hook;
- direct existing-RPC reuse remains prohibited.

## 12. What this closure did not do

```text
SQL migrations:                  0
RPC changes:                     0
RLS changes:                     0
new learning_activity rows:      0
new learning_skill rows:         0
World runtime evidence hooks:    0
canonical mastery writes:        0
Belajar progression mutations:   0
Belajar reward mutations:        0
```

Audio/provider work is unrelated and remains under its separate authorization boundary.

Final Gian/Naya character production remains paused.

Bermain/motion remains out of scope.

## 13. Next-work rule

Do not continue into runtime activation automatically.

Candidate scope and pedagogical mapping are now closed.

The next World → Evidence work begins only after explicit authorization for:

```text
age-8 handling
+ assessed evaluator decision
+ server-owned evidence write architecture
+ progression/reward isolation
+ security/anti-farming contract
```

Until then:

```text
World → Evidence = one pedagogy-approved mapping, green-by-contract target, fail-closed, disabled
```

## 14. Final closure checkpoint

The complete design-closure head is green and immutable:

```text
checkpoint/world-evidence-bridge-design-closure-green-20260923
@ 82faddd6b90eac603cb2449b8f16d7aff98a1792
CI #1535 / run 35768996360 — full success
```

This checkpoint includes the green v1 contract plus synchronized architecture/current-state/limitations/QA/policy handoff.

Checkpoint hierarchy:

```text
implementation contract:
checkpoint/world-evidence-bridge-contract-green-20260923
@ 38bbe5704d4d63781410842cbf134dcb76c3ab54

docs synchronization:
checkpoint/world-evidence-bridge-docs-green-20260923
@ eb793f442cbee8d38f528cb5dbff0d15784a6200

final design closure:
checkpoint/world-evidence-bridge-design-closure-green-20260923
@ 82faddd6b90eac603cb2449b8f16d7aff98a1792
```

Do not move or force-push any of these branches.

The next step is **not implementation activation**. It is a new owner-authorized decision wave covering candidate mapping approval, age-8 handling, isolated server ingestion, progression/reward isolation, and security/anti-farming acceptance.

## 15. Follow-up decision-wave boundary

Active follow-up branch:

```text
feature/world-evidence-pedagogy-approval-20260923
```

This branch is authorized only to close candidate selection and pedagogical mapping. It does not move the immutable checkpoints recorded above and does not authorize merge/activation of World evidence.

No `practice → assessed` promotion, runtime hook, SQL/RPC/RLS change, learning-attempt write, skill-evidence write, mastery recompute, Belajar progression/reward mutation, or certificate mutation is authorized by this decision.

