# Learning Semantic Illustration Registry Closure — 23 September 2026

Status: **CLOSED / MERGED / LIVE VERIFIED / NO PRODUCTION SEMANTIC BINARY ACTIVATED**

Implementation PR: **#297**  
Final PR head: `098a6c242569e5a45030ddaeb1dc5db8035dbe14`  
PR CI: **#1536 / run `35769098899` — FULL SUCCESS**  
Merged implementation main: **`ed7db8a6c5b8a3ee4acc9bcca260b4e0b5776773`**  
Merged-main CI: **#1537 / run `35770021133` — FULL SUCCESS + exact Cloudflare smoke**

Parent visual containment closure:
- PR **#294**
- main `6d0f9bd8972297e316bdf031603d160d901d8d04`
- merged-main CI **#1531 / run `35764397545` — full success + exact Cloudflare smoke**

## 1. What this wave closed

This wave adds the production/provenance gate for recognition-critical semantic illustrations without adding or activating final semantic binaries.

New canonical registry:

`src/lib/data/learning-illustration-asset-provenance.json`

New canonical production subtree:

`public/artwork/learning-illustrations/`

New blocking validator/regression:

- `scripts/validate-learning-illustration-assets.mjs`;
- `scripts/run-learning-illustration-asset-validator-tests.mjs`;
- `npm run validate:assets:learning-illustrations`;
- `npm run test:assets:learning-illustrations`;
- both are wired into aggregate `npm run validate:assets`.

## 2. Exact current registry truth

The registry contains exactly **17 semantic slots**:

```text
object.apple
animal.cat
animal.fish
object.umbrella
vehicle.car
object.cup
object.house
animal.bird
object.ball
body.head
action.jump
feature.gills
feature.beak
feature.cactus-thick-stem
object.towel
object.raincoat
object.toy-block
```

Current lifecycle truth:

```text
registry slots:                    17
review-required:                   17
approved semantic illustrations:    0
production semantic binaries:       0
runtime semantic activation:        0
```

This is intentional fail-closed state.

## 3. Preliminary existing-art review

Existing `public/artwork/activity-previews/` assets were reviewed only as **candidate sources**, not production approvals.

Preliminary visually-suitable reuse candidates:

- `object.apple` -> `color-object-apple.webp`;
- `animal.cat` -> `color-parts-cat.webp`;
- `animal.fish` -> `color-palette-fish.webp`;
- `object.umbrella` -> `color-object-umbrella.webp`;
- `vehicle.car` -> `color-palette-car.webp`;
- `object.cup` -> `color-palette-cup.webp`;
- `object.house` -> `color-object-house.webp`;
- `animal.bird` -> `color-contrast-bird.webp`.

Those eight remain provenance-pending and semantic-review-pending. Repository presence or file naming does not grant production approval.

Explicitly rejected candidate:

- `object.ball` -> `color-object-ball.webp` is **rejected for semantic ball use** because the visible artwork reads as a circle containing a pentagon rather than a reliable ball depiction.

## 4. P0 semantic mismatches still open

The following slots have no approved candidate and remain high-priority semantic-art work:

- `body.head` — fallback `🙂`;
- `action.jump` — fallback `🤸`;
- `feature.gills` — fallback `🫧`;
- `feature.beak` — fallback `👄`;
- `feature.cactus-thick-stem` — fallback `💚`;
- `object.towel` — fallback `🧺`;
- `object.raincoat` — fallback generic coat;
- `object.toy-block` — fallback masonry brick.

These are semantic clarity defects. Containment infrastructure is already closed.

## 5. Blocking approval contract

The validator now fails closed on:

- registry semantic-key drift;
- malformed category/lifecycle records;
- unsafe candidate/production paths;
- candidate review pointing at a nonexistent local file;
- non-approved records with a production path or SHA;
- premature redistribution approval;
- approved lifecycle without owned/licensed provenance;
- missing rights holder or license basis;
- approved lifecycle without explicit child-readable semantic approval;
- missing/malformed SHA-256;
- missing production binary;
- non-WebP output;
- dimensions outside 128–1024px;
- missing alpha/transparency;
- file above 300 KB;
- SHA mismatch;
- duplicate production paths;
- stray image binaries under the dedicated production subtree.

Regression fixtures prove both failure cases and a valid approved metadata fixture.

The gate separates four things that must not be conflated:

1. visual candidate suitability;
2. provenance/redistribution approval;
3. semantic child-readability approval;
4. runtime activation.

## 6. Production verification

PR #297 exact-head CI **#1536 / run `35769098899`** passed:

- Quality gate Ubuntu;
- Windows compatibility;
- Secret history scan;
- Production dependency audit;
- Production build;
- Mobile route QA Chromium;
- permanent visual product baseline.

Merged-main CI **#1537 / run `35770021133`** passed all required jobs including exact production smoke.

Exact smoke:

```text
EXPECTED_SHA: ed7db8a6c5b8a3ee4acc9bcca260b4e0b5776773
branch: main
site: https://mainlagihub.my.id
data backend: supabase
modules: 9
result: production is serving the expected commit
```

## 7. Next safe wave

Do **not** create another registry/provenance architecture wave unless this gate reveals a defect.

Next work is exact semantic-art production/review:

1. start with the eight P0 mismatches that currently have no acceptable production candidate;
2. separately resolve provenance for any existing-art reuse candidate before copying it into the dedicated semantic production subtree;
3. produce/review exact isolated Mainlagi-style assets;
4. approve exact binaries only after provenance + child-readability review + SHA binding;
5. add production binaries deliberately;
6. keep runtime activation separate;
7. later map approved semantic keys through the existing `LearningVisualToken`;
8. run 320/390/768/1280 idle/wrong/success screenshot review for affected routes.

Do not bulk-replace the 280-field emoji inventory.

## 8. Hard boundaries preserved

- Mainlagi World remains untouched.
- Character production/development remains paused.
- Fixed English audio remains deferred.
- Canonical activity identity, prompts, choice order, answers, evidence, mastery, progression, schema and stage ownership remain unchanged.
- WS-05 remains closed at 900/900 activities / 47 active gameplay patterns.
- Pattern #48 remains unjustified.

The semantic illustration registry/provenance infrastructure is therefore **CLOSED / MERGED / LIVE VERIFIED**. The active open work is now exact P0 semantic-art candidate production/review.
