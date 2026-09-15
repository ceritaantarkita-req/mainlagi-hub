# WS-05 Pattern #30 — Bahasa Syllable Assembly

Date: **16 September 2026**  
Status: **QA ACCEPTED / UNMERGED**  
Implementation PR: **#139**  
Branch: `agent/ws05-bahasa-syllable-assembly-20260915`  
Verified merged base: `2a5e0f35725456e00b4cd85e64999f9f84a29c6c`

## Why this family

Pattern #30 was selected from a fresh objective/evidence audit of the verified 29-pattern baseline. Distribution concentration was used only as a planning signal. The reviewed Bahasa Wave B blending family is the strongest fit because all five activities share one explicit learning objective—combining two visible syllables into a familiar word—while the evidence remains a canonical assessed three-choice decision.

Compared with nearby candidates, the mechanic is materially distinct rather than cosmetic: it externalizes the composition step (`syllable + syllable = ?`) without changing the answer set, inventing language content, or introducing an extra assessed action.

## Exact scope

```text
bahasa-gabung-baju
bahasa-gabung-buku
bahasa-gabung-meja
bahasa-gabung-bola
bahasa-gabung-susu
```

Canonical family boundaries:
- subject `bahasa`;
- stage `bahasa-suku-kata-kata`;
- lesson `bahasa-suku-kata-gabung`;
- pack `bahasa.pack.suku-kata-gabung`;
- skill `bahasa.suku_kata.blending`;
- runtime remains `tap_choice`;
- assessment remains assessed;
- exactly three canonical choices and unchanged `correctChoice`.

Explicit exclusions:
- Bahasa syllable-recognition activities remain `choice_grid`;
- Bahasa picture-word and initial-sound activities remain outside this pattern;
- listening remains `listen_choose` and matching remains `visible_matching` where already canonical;
- English phonics remains outside scope;
- Math and Logic families remain unchanged.

## Interaction and evidence contract

Pattern: `syllable_assembly`.

The activity board shows only the two syllables already present in canonical title/prompt content and a masked result slot. Config validation requires the two reviewed syllables to concatenate exactly to canonical `correctChoice`.

Before a correct assessment:
- result stays `?`;
- canonical three choices remain available via keyboard/touch/pointer;
- a wrong choice records incorrect/retry evidence;
- a wrong choice cannot complete and cannot reveal the result.

After the canonical correct choice:
- the existing activity completes;
- the result slot may reveal the canonical assembled word;
- no extra confirmation or intermediate assessment is introduced.

Runtime measurement:
- source `syllable-assembly-runtime`;
- assessed fidelity `choice_syllable_assembly_interaction`;
- records first/second syllable and selected canonical choice;
- canonical mastery, stars, progression and activity identity remain unchanged.

## QA history

Two implementation defects were caught and fixed before acceptance:

1. CI #640 / run `34999759651` failed because the permanent central gameplay-presentation regression had not yet registered the new exact family. The fix added the exact five-ID family while preserving the strict assertion that every other unreviewed choice activity must remain `default`.
2. CI #641 / run `35000289970` then reached the dedicated Syllable Assembly regression and failed because `tsconfig.learning-tests.json` did not compile the new config module into `.learning-test-dist`. The fix added `src/lib/learning/syllableAssemblyConfig.ts` to the learning-test compile manifest.

Accepted implementation head:

```text
d55c1deb54f1402c38d84417ca7ae8248c9d3b07
```

Full CI #642 / run `35000557604` passed:
- Ubuntu quality gate;
- Windows compatibility;
- production build and build budgets;
- production dependency audit;
- secret-history scan;
- complete engine/learning suite including central and dedicated Syllable Assembly regressions;
- deterministic activity-quality audit;
- gameplay-distribution audit;
- simulations;
- Batch17 final acceptance contracts;
- Chromium canonical mobile/accessibility/browser matrix including Syllable Assembly responsive QA.

Cloudflare production smoke is correctly skipped on the unmerged PR and remains a post-merge `main` gate.

## Accepted audit evidence

Deterministic activity quality:

```text
subjects:                9
activities:            900
KEEP:                  900
POLISH:                  0
REDESIGN:                0
REPLACE:                 0
structural findings:     0
```

Gameplay distribution on accepted PR head:

```text
classified:               900 / 900
unclassified:               0
active PR-head patterns:   30
choice_grid               308 / 900 = 34.22%
syllable_assembly           5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Logic choice_grid           47 / 100
Science choice_grid         56 / 100
```

If merged unchanged, remaining distance is **20** patterns to minimum 50 and **30** to working target 60.

## Manual visual acceptance

All nine Syllable Assembly browser screenshots were manually reviewed and accepted:
- 320x720 — idle / wrong / success;
- 390x844 — idle / wrong / success;
- 768x1024 — idle / wrong / success.

Accepted observations:
- no horizontal overflow or viewport clipping;
- two canonical syllables remain readable;
- result is masked as `?` in idle and wrong states;
- wrong feedback is visible and does not leak the answer;
- correct state reveals only the canonical assembled word;
- success feedback and CTA are visible;
- direct-choice targets remain usable across phone/tablet layouts.

## Closure gate

Pattern #30 is **not fully closed yet**. Remaining gates are:
1. update all canonical docs to this accepted/unmerged state;
2. fresh full CI on the exact final docs head;
3. clean PR #139 mergeability/review-thread gate;
4. exact-head squash merge and independent `main` SHA verification;
5. post-merge `main` CI with Cloudflare production smoke;
6. separate docs-only closure PR with its own exact-head CI/merge/live verification.

No Pattern #31 family is pre-approved before Pattern #30 is fully closed.
