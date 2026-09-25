# Mainlagi Semantic Illustration SVG Runtime — Session 12 Closure — 25 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / CONTROLLED SVG RUNTIME ACTIVE**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
Session 11 closure baseline: edc7429577148ec868494f9419159cab337f4d1d
implementation branch: agent/semantic-svg-runtime-session12-20260925
PR: #348
final PR head: ace106307d4aca512076d87853659301ecbd0763
final PR CI: #1689 / run 36164884662 — full success
merged main: 47b98c4a17bd423ced32eb8fb45658575f83a888
merged-main CI: #1690 / run 36165969710 — full success
Production smoke (Cloudflare): success
```

Session 12 activates the already-approved semantic SVG production bank through one centralized registry-backed runtime resolver. It does not broaden semantic art scope or change learning semantics.

## Runtime contract

Current machine-readable truth:

```text
registry version:             2
preferred production format: svg
runtime activation:           controlled-svg

semantic P0 keys:             17
approved SVG keys:            14
held keys:                     3
approved WebP history:        14
SVG migration-ready:           0
```

The central resolver is:

```text
src/lib/learning/semanticIllustrationRuntime.ts
```

It accepts a semantic key plus the visual's existing canonical fallback identity. It returns an SVG only when all of the following are true:

- runtime activation is `controlled-svg`;
- preferred production format is SVG;
- the semantic key exists in the canonical registry;
- the supplied fallback glyph matches the registry record;
- lifecycle is approved;
- redistribution is approved;
- semantic review is approved and child-readable;
- the SVG production binding is approved;
- path is inside the canonical production directory and ends in `.svg`;
- SHA-256 is present in canonical lowercase form.

Otherwise it returns no production asset and the existing child-facing fallback remains visible.

## Controlled surface activation

Activity configs carry semantic identity only. They do **not** carry production file paths.

Session 12 adds explicit semantic identity to these established visual-token families:

```text
Picture Word Match
Initial Sound
Feature / Function Link
Material Lab
```

Current explicit runtime bindings:

```text
19 semantic visual placements
16 unique semantic keys referenced by current visual-token surfaces
13 approved unique keys currently consumed -> SVG
3 held unique keys currently consumed -> canonical fallback
```

Approved `object.umbrella` is resolver-addressable but has no current `LearningVisualToken` semantic placement. Session 12 does not force a new visual into an unrelated text/coloring surface merely to make every approved asset appear.

This keeps runtime activation semantic and intentional rather than glyph-driven.

## Approved resolver scope

All 14 approved keys are resolver-addressable:

```text
action.jump
animal.bird
animal.cat
animal.fish
body.head
feature.beak
feature.cactus-thick-stem
feature.gills
object.apple
object.ball
object.cup
object.house
object.toy-block
object.umbrella
```

## Held-key fail-closed contract

These remain held:

```text
vehicle.car
object.towel
object.raincoat
```

Their existing runtime placements may declare their semantic identity, but the central resolver returns null and `LearningVisualToken` keeps the existing glyph/emoji fallback.

Session 12 does not change their provenance, redistribution, semantic-review or production-binding state.

## LearningVisualToken behavior

`LearningVisualToken` now owns the shared presentation switch:

```text
explicit semantic key
        +
existing fallback identity
        |
        v
central registry-backed resolver
        |
        +-- approved exact binding --> sanitized production SVG <img>
        |
        +-- held / unknown / mismatch --> existing fallback child
```

The SVG is loaded as an image asset. Raw SVG markup is not injected into the DOM.

Accessibility remains owned by the outer visual token; the nested production image is decorative to avoid duplicate accessible names.

## Preserved invariants

Session 12 does not change:

- activity correctness or answers;
- mastery;
- progression/readiness;
- evidence semantics or evidence payload meaning;
- rewards/certificates;
- schema/database contracts;
- Mainlagi World;
- shared character runtime;
- Home/Bermain behavior;
- Motion Engine/game mechanics;
- narration/audio activation;
- semantic production approvals;
- the 14 historical WebP rollback/history assets.

Existing evidence metadata may continue to record the canonical fallback glyph/string because that metadata describes the authored activity identity rather than the rendered asset format.

## Permanent regression coverage

Session 12 regression coverage proves:

- all 14 approved semantic keys resolve to their exact registry SVG path/SHA;
- all three held keys resolve to null;
- unknown keys resolve to null;
- semantic-key/fallback mismatches resolve to null;
- activity configs store semantic keys, not production paths;
- approved apple, ball and JUMP visuals render registry-backed SVGs in browser QA;
- held raincoat retains the existing glyph and renders no semantic production image;
- existing activity correctness/evidence/browser flows still pass.

## CI note

Initial PR run **#1688** found one stale historical-preflight assertion that still expected the old text `runtime activation: off`. The underlying registry validator, production build, Windows checks and browser code were not bypassed. The assertion was updated to the new controlled state, producing final PR head `ace106307...` and final CI **#1689 — full success**.

Merged main `47b98c4a17bd423ced32eb8fb45658575f83a888` then passed CI **#1690**:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
Production smoke (Cloudflare)  success
```

Therefore Session 12 is **merged, deployed and live verified**.

## Next authorized session

```text
Session 13 -> semantic/activity SVG responsive QA + fixes
```

Session 13 should verify the active semantic SVG surfaces at:

```text
320
390
430
768
1280
```

Check:

- semantic readability;
- cropping/overflow;
- answer leakage;
- accessibility;
- deterministic resolver output;
- no external SVG network dependency;
- held-key fallback stability.

Session 13 must not:

- add new artwork;
- approve car/towel/raincoat;
- change activity correctness/mastery/progression/evidence;
- delete WebP rollback/history;
- reopen World, character, Motion Engine or narration work.

