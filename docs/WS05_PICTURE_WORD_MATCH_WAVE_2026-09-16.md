# WS-05 Picture Word Match Wave — 2026-09-16

Status: **Pattern #35 IMPLEMENTATION MERGED / LIVE VERIFIED; DOCS-ONLY CLOSURE PR #150 OPEN**  
Implementation PR: **#149**  
Closure PR: **#150**  
Base: Pattern #34 final `main` `8bfb0027a5f4963a6875310c7408cb56018cc422`  
Implementation merge: `47e3373ed9ba4a96331a8e61286dc80d37b6b518`  
Post-merge CI: **#724 / run `35085618422` — full success including Cloudflare production smoke**

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

## QA and merge evidence

Accepted code head before canonical docs:
`e0f93bd20f24c2efaebfbaa7f782427e8d0e1bca`

Final implementation docs head:
`79767b320372ac6dd78bfae90ffb2e2307154401`

Exact-head implementation CI:
- CI **#718** / run `35082720001` — accepted code-head full success;
- CI **#723** / run `35083623316` — final docs-head full success;
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

Exact implementation merge gate:
- PR #149 head was `79767b320372ac6dd78bfae90ffb2e2307154401`;
- branch was zero commits behind `main`;
- mergeability state was clean;
- scope stayed limited to the reviewed Pattern #35 implementation/tests/audit/docs;
- comments, inline review comments, reviews and review threads were all zero;
- exact-head squash merge succeeded as `47e3373ed9ba4a96331a8e61286dc80d37b6b518`.

Independent live `main` verification:
- `main` independently resolved to exact implementation merge `47e3373ed9ba4a96331a8e61286dc80d37b6b518`;
- CI **#724** / run `35085618422` completed **success**;
- Ubuntu quality gate — success;
- Windows compatibility — success;
- production build — success;
- production dependency audit — success;
- secret-history scan — success;
- Chromium mobile/accessibility matrix — success;
- **Production smoke (Cloudflare)** waited for the exact release and successfully smoked public endpoints.

## Distribution/quality evidence

Verified merged gameplay-distribution:

```text
900 / 900 classified
35 active merged patterns
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

Pattern #35 implementation is merged and live verified, but Pattern #35 is **not yet FULLY CLOSED**. Required remaining gates:
1. closure PR #150 must remain docs-only and based exactly on implementation merge `47e3373ed9ba4a96331a8e61286dc80d37b6b518`;
2. fresh exact closure-head full CI;
3. clean exact-head closure scope/review/thread/mergeability gate;
4. exact-head closure squash merge;
5. final independent `main` verification and full CI including Cloudflare production smoke.

Only after all of the above may Pattern #35 be marked **FULLY CLOSED**. Pattern #36 objective/evidence audit must not start before that point.
