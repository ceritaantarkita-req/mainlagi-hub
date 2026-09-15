# WS-05 Pattern #30 — Bahasa Syllable Assembly

Date: **16 September 2026**  
Status: **CLOSURE PR #140 — FINAL GATE**  
Implementation PR: **#139**  
Implementation merge SHA: `c973dbc9e6010ff167a082cd6759728b590e7626`  
Closure PR: **#140**  
Closure branch: `docs/close-syllable-assembly-20260916`

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

## QA and closure history

Two implementation defects were caught and fixed before acceptance:

1. CI #640 / run `34999759651` failed because the permanent central gameplay-presentation regression had not yet registered the new exact family. The fix added the exact five-ID family while preserving the strict assertion that every other unreviewed choice activity must remain `default`.
2. CI #641 / run `35000289970` then reached the dedicated Syllable Assembly regression and failed because `tsconfig.learning-tests.json` did not compile the new config module into `.learning-test-dist`. The fix added `src/lib/learning/syllableAssemblyConfig.ts` to the learning-test compile manifest.

Accepted implementation head:

```text
d55c1deb54f1402c38d84417ca7ae8248c9d3b07
```

Full CI #642 / run `35000557604` passed Ubuntu, Windows, production build/budgets, dependency audit, secret-history scan, complete engine/learning regressions, deterministic activity-quality, gameplay distribution, simulations, Batch17 and Chromium mobile/accessibility/browser QA.

Final canonical implementation docs head `ee891dc99c1f86831ba67b34ae39e71ec50ee886` passed full PR CI #647 / run `35001595648` before merge.

PR #139 was exact-head squash merged as:

```text
c973dbc9e6010ff167a082cd6759728b590e7626
```

`main` was independently verified at that exact SHA. Post-merge CI #648 / run `35003757463` passed the full matrix, including **Production smoke (Cloudflare)** against the exact release.

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

Verified merged gameplay distribution:

```text
classified:               900 / 900
unclassified:               0
active merged patterns:    30
choice_grid               308 / 900 = 34.22%
syllable_assembly           5 / 900 = 0.56%
Bahasa choice_grid          47 / 100
Logic choice_grid           47 / 100
Science choice_grid         56 / 100
```

Remaining distance is **20** patterns to minimum 50 and **30** to working target 60.

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

## Final closure gate

Implementation is merged and live-verified. Closure PR #140 is docs-only and must:
1. keep all five canonical docs aligned to the verified 30-pattern merged state;
2. pass fresh full CI on its exact final head;
3. have clean mergeability/comments/reviews/review-thread gates;
4. exact-head squash merge;
5. independently verify final `main` SHA and final `main` CI including Cloudflare production smoke.

Pattern #30 is **FULLY CLOSED only after PR #140 completes those gates**. No Pattern #31 family is pre-approved before that point.
