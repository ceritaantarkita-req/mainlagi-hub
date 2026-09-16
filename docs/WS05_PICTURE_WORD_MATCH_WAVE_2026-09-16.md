# WS-05 Picture Word Match Wave — 2026-09-16

Status: **Pattern #35 QA ACCEPTED / UNMERGED**  
Implementation PR: **#149**  
Base: Pattern #34 final `main` `8bfb0027a5f4963a6875310c7408cb56018cc422`

## Why this family

Fresh objective/evidence audit after Pattern #34 selected the Bahasa image-to-word family because the canonical learning objective is specifically to choose the word that matches a visually represented familiar object. This is semantically distinct from generic choice grids, Syllable Assembly, Initial Sound, listening recognition and visible matching.

## Exact scope

```text
bahasa-gambar-apel
bahasa-gambar-mobil
bahasa-gambar-kucing
bahasa-gambar-rumah
bahasa-gambar-pisang
```

Canonical shared boundary:
- subject `bahasa`;
- stage `bahasa-suku-kata-kata`;
- lesson `bahasa-kata-gambar`;
- pack `bahasa.pack.kata-gambar`;
- skill `bahasa.kata.picture_matching`;
- assessment `assessed`;
- runtime `tap_choice`;
- three canonical lowercase word choices with unchanged `correctChoice`.

Explicit exclusions:
- `bahasa-pasang-kata-*` remains `visible_matching`;
- `bahasa-gabung-*` remains `syllable_assembly`;
- audio word recognition remains `listen_choose`;
- Pattern #34 Initial Sound remains unchanged;
- English, Math and all other subject families remain unchanged;
- no content seed, mastery, progression, schema or migration rewrite.

## Interaction contract

`picture_word_match` presents the canonical familiar object as a large visual clue and asks the child to match it to the unchanged word choices. The answer slot remains `?` until correct.

Wrong choice:
- assessed incorrect count increases;
- retry count increases;
- activity does not complete;
- canonical word remains masked.

Correct choice:
- records the measured choice outcome;
- completes the canonical existing activity;
- reveals the canonical word;
- shows the existing return CTA.

Accessibility/input:
- keyboard direct choice;
- touch/pointer direct choice;
- >=44px tested touch targets;
- no drag-only dependency;
- responsive QA at 320x720, 390x844 and 768x1024.

## Evidence contract

Assessed fidelity: `choice_picture_word_match_interaction`.

Runtime metadata source: `picture-word-match-runtime` with:
- `picture`;
- `word`;
- `selectedChoice`.

Representative wrong-then-right browser path validates:
- `correctCount = 1`;
- `incorrectCount = 1`;
- `retryCount = 1`;
- `accuracy = 0.5`;
- false completion/reveal is blocked before correct answer.

## QA evidence

Accepted code head before canonical docs:
`e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca`

Exact-head CI:
- CI **#718** / run `35082720001` — full PR success;
- Ubuntu: structure/assets/source, security boundary, device harness contract, typecheck, lint, engine/learning suite, deterministic activity quality, gameplay distribution, simulations and Batch17 — success;
- Windows compatibility — success;
- production build and build budgets — success;
- production dependency audit — success;
- secret-history scan — success;
- Chromium mobile/accessibility/browser matrix — success;
- Cloudflare production smoke skipped on PR as designed.

Chromium dedicated representative: `bahasa-gambar-apel`.

Progression fixture uses the legitimate immediate-prior Bahasa Wave A readiness rather than seeding the target activity/future completion.

Manual screenshot review: **9/9 accepted**.
- 320x720 idle/wrong/success;
- 390x844 idle/wrong/success;
- 768x1024 idle/wrong/success.

Observed acceptance:
- no horizontal overflow;
- prompt/object/choices readable;
- wrong state keeps `?` and shows retry feedback;
- success reveals `apel`;
- feedback and success CTA stay visible;
- layout remains consistent with Garden UI.

## Distribution/quality evidence

CI #718 gameplay-distribution artifact:

```text
900 / 900 classified
35 active candidate patterns
choice_grid          287 / 900 = 31.89%
picture_word_match     5 / 900 = 0.56%
Bahasa choice_grid     39 / 100
```

No global gameplay hotspot exceeds the advisory 35% threshold.

Deterministic activity quality remains:

```text
KEEP                  900
POLISH                   0
REDESIGN                 0
REPLACE                  0
structural findings      0
```

## Remaining closure chain

Pattern #35 is **not closed** at this status. Required remaining gates:
1. fresh exact canonical docs-head full CI;
2. clean exact-head implementation PR scope/review/thread/mergeability gate;
3. exact-head squash merge PR #149;
4. independent `main` verification and full post-merge CI including Cloudflare production smoke;
5. separate docs-only closure branch/PR;
6. fresh exact closure-head CI and clean closure gate;
7. exact-head closure merge;
8. final independent `main` verification and full CI including Cloudflare production smoke.

Only after all of the above may Pattern #35 be marked **FULLY CLOSED**.
