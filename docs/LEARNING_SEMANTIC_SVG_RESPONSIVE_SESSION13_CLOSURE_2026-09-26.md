# Mainlagi Semantic SVG Responsive QA — Session 13 Closure — 26 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / RESPONSIVE SEMANTIC SVG QA COMPLETE**

## Exact release checkpoint

```text
repository: ceritaantarkita-req/mainlagi-hub
Session 12 closure baseline: 1fc656548ccc9486679faf2f360a78b2425b18c0
implementation branch: agent/semantic-svg-responsive-session13-20260926
PR: #350
final PR head: 08e1e561d3873d13c455c0973510cbf54d711325
final PR CI: #1694 / run 36178188858 — full success
merged main: d9fba856e3819c2a0f353624f5255f84c27bef9a
merged-main CI: #1695 / run 36179277785 — full success
Production smoke (Cloudflare): success
```

Session 13 verifies the Session 12 controlled semantic SVG runtime across the required responsive surface families and closes the remaining approved `object.umbrella` presentation gap without changing learning semantics.

## Runtime truth after Session 13

```text
semantic registry version:       2
preferred production format:     svg
runtime activation:              controlled-svg
approved semantic SVG keys:      14
held semantic keys:               3
approved WebP rollback/history:  14
central semantic resolver:        active
approved keys with explicit consumer coverage: 14/14
held keys with explicit fallback coverage:      3/3
semantic consumer union:         17/17
```

The three held keys remain unchanged:

```text
vehicle.car
object.towel
object.raincoat
```

They still resolve to the existing glyph/emoji fallback and do not render a semantic production image.

## Responsive QA matrix

Required widths:

```text
320
390
430
768
1280
```

Affected semantic surface families are covered by the permanent browser suites for:

- Picture Word Match;
- English Picture Word Match;
- Initial Sound;
- Feature / Function Link;
- Material Lab;
- Activity Gallery semantic preview.

The responsive claim is intentionally scoped correctly:

- every approved semantic key has exact browser coverage;
- every affected surface family is exercised at the required responsive widths;
- this is **not** represented as a 14-key × 5-width exhaustive Cartesian matrix when the suite uses exact-key checks plus representative family-responsive checks.

## Complete semantic-key browser coverage

Session 13 browser coverage exercises the approved semantic SVG set:

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

Held-key runtime coverage also verifies:

```text
vehicle.car   -> fallback only
object.towel  -> fallback only
object.raincoat -> fallback only
```

## Shared semantic containment contract

The shared visual containment QA now waits for semantic SVG decode and verifies:

- image decode completes;
- intrinsic width and height are non-zero;
- semantic image is same-origin;
- production path stays under `/artwork/learning-illustrations/`;
- rendered semantic production asset remains SVG;
- image box remains inside the glyph box;
- glyph remains inside the shared visual frame;
- visual frame remains inside its parent;
- no fallback visual accidentally renders a semantic production image.

This strengthens QA only. It does not change runtime rendering behavior.

## Umbrella presentation gap closure

Session 12 left `object.umbrella` approved and resolver-addressable but without a dedicated `LearningVisualToken` consumer placement.

Session 13 closes that presentation gap through:

```text
src/lib/learning/semanticIllustrationPresentation.ts
```

Current exact presentation binding:

```text
bahasa-baca-sari-hujan -> object.umbrella
```

The binding is presentation-only and intentionally attached to the Activity Gallery preview.

The assessed activity asks for the color of Sari's umbrella:

```text
correctChoice = merah
```

Therefore rendering the umbrella object in the gallery does not reveal the assessed answer. Permanent regression verifies that the gallery card does not expose `merah`, `biru`, or `kuning` as preview-answer leakage.

Dedicated umbrella gallery QA verifies all five required widths, canonical SVG path, `object-fit: contain`, minimum readable geometry, no horizontal overflow, and no page/console errors.

## Permanent consumer-coverage regression

The static semantic presentation regression now computes the semantic-key union from the real current consumers:

- Picture Word Match config;
- Initial Sound config;
- Feature / Function config;
- Material Lab config;
- Activity Gallery semantic preview presentation resolver.

The required union is exactly:

```text
14 approved keys + 3 held keys = 17/17 semantic P0 keys
```

This makes future accidental semantic-consumer coverage loss a CI failure.

## Hard boundaries preserved

Session 13 does not change:

- semantic artwork binaries;
- provenance or redistribution approval;
- correctness;
- canonical answers;
- choice order;
- mastery;
- progression/readiness;
- evidence semantics;
- rewards/certificates;
- database/schema contracts;
- Mainlagi World;
- shared character runtime;
- Home/Bermain behavior;
- Motion Engine;
- narration/audio activation.

No new artwork was generated.

The 14 WebP semantic derivatives remain preserved as rollback/history.

## CI evidence

PR head `08e1e561d3873d13c455c0973510cbf54d711325` passed PR CI **#1694 / run `36178188858`**.

Merged main `d9fba856e3819c2a0f353624f5255f84c27bef9a` passed merged-main CI **#1695 / run `36179277785`**:

```text
Quality gate (Ubuntu)          success
Windows compatibility          success
Production build               success
Production dependency audit    success
Secret history scan            success
Mobile route QA (Chromium)     success
Production smoke (Cloudflare)  success
```

Therefore Session 13 is **merged, deployed, responsive-regression-locked and live verified**.

## Next authorized session

### Session 14 — Repository-wide approved-SVG sweep

Use the Session 01 inventory plus repository search to find any remaining **already-approved canonical SVG source** still unnecessarily converted or shadowed by a WebP-only production rule.

For each bounded candidate:

- keep SVG directly when vector-native;
- keep raster-native backgrounds/photos as raster;
- do not migrate unclear-provenance assets;
- record every known approved vector as direct-SVG, explicitly exempted, or explicitly held with reason.

Session 14 must not:

- generate new art;
- expand semantic scope;
- silently approve unclear-provenance assets;
- reopen correctness/mastery/progression/evidence;
- reopen World, character runtime, Motion Engine, or narration work.

## Safe resume baseline

```text
Sessions 01–13: COMPLETE
semantic registry: v2
preferred production format: svg
runtime activation: controlled-svg
approved semantic SVG keys: 14
approved consumer coverage: 14/14
held fallback coverage: 3/3
semantic P0 consumer union: 17/17
historical WebP rollback/history: 14
Session 13 main: d9fba856e3819c2a0f353624f5255f84c27bef9a
Session 13 merged-main CI: #1695 / run 36179277785 — full success
Cloudflare production smoke: success
next: Session 14 — repository-wide approved-SVG sweep
```
