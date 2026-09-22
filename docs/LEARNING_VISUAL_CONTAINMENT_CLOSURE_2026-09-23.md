# Learning Visual Containment Closure — 23 September 2026

Status: **IMPLEMENTATION MERGED / MERGED-MAIN VERIFICATION IN PROGRESS**

Implementation PR: **#294**  
Final PR head: `38fe722a63fe073a6ad3ffcfe8fa0e846559dff6`  
PR CI: **#1529 / run `35763091032` — FULL SUCCESS**  
Merged implementation main: `6d0f9bd8972297e316bdf031603d160d901d8d04`  
Merged-main CI: **#1531 / run `35764397545` — IN PROGRESS at checkpoint creation**

Parent audit:
- PR **#287**
- audit main `bea1380e29106388eea415d3733e95d092095d97`
- merged-main CI **#1453 / run `35746899947` — FULL SUCCESS + exact Cloudflare smoke**

## 1. Scope closed by the implementation

The implementation establishes a reusable containment foundation for learning visuals without approving final semantic illustration art.

Runtime surfaces covered:

1. shared `ActivityGallery` picture previews;
2. Bahasa Indonesia `InitialSoundActivity`;
3. Bahasa Indonesia + English `PictureWordMatchActivity`;
4. Science `FeatureFunctionLinkActivity`;
5. Science `MaterialLabActivity`.

Shared primitive:

- `src/components/learning/LearningVisualToken.tsx`;
- `src/components/learning/LearningVisualToken.module.css`.

The visual token owns:

- bounded frame geometry;
- explicit overflow clipping;
- centered placement;
- safe internal padding;
- responsive bounded sizing;
- future image/SVG support with intrinsic aspect ratio and `object-fit: contain`;
- accessible semantic labels where required;
- decorative hiding where the visual is not semantic.

## 2. Blocking containment regression

New browser helper:

`scripts/lib/assert-learning-visual-containment.mjs`

The browser gate rejects:

- missing parent/glyph;
- frame collapse below 32x32;
- invisible/transparent learning visuals;
- missing explicit overflow bounding;
- a visual frame escaping its parent card;
- the glyph escaping its visual frame.

Dedicated activity coverage now includes:

- 320x720;
- 390x844;
- 768x1024;
- 1280x800.

The shared gallery is also exercised through the canonical responsive route matrix at 320/360/375/390/430/768/1024 plus a dedicated 1280x800 catalog check.

## 3. CI-driven defects fixed before merge

The new gate found real layout defects rather than merely validating the intended implementation.

Fixed before merge:

- Material Lab selected-sample visual was forced into a 30px mobile grid column and collapsed below the readability floor;
- Material Lab parent grid was changed to an explicit safe 32px visual slot plus `minmax(0,1fr)` text ownership;
- Feature/Function success layouts were compacted so completion feedback/CTA remain visible on short mobile and desktop viewports;
- Initial Sound received short-desktop fit handling;
- Picture & Word received short-desktop fit handling while preserving a readable recognition visual;
- English Picture & Word retained its leak-free English heading/instruction contract;
- `GardenActivityFrame` gained a scoped `compactShortDesktop` mode;
- the final 1280x800 English regression was fixed by explicitly wiring `compactShortDesktop={isEnglish}` from `PictureWordMatchActivity`.

The acceptance test was not weakened to make failures disappear. Runtime layout was changed to satisfy the readability/visibility contract.

## 4. PR acceptance evidence

PR #294 exact-head CI **#1529 / run `35763091032`** passed:

- Quality gate Ubuntu;
- Windows compatibility;
- Secret history scan;
- Production dependency audit;
- Production build;
- canonical mobile route QA;
- all dedicated containment activity suites;
- permanent visual product baseline.

Responsive screenshot artifact:

- artifact name: `mobile-route-qa-screenshots`;
- artifact ID: `10710764036`;
- head: `38fe722a63fe073a6ad3ffcfe8fa0e846559dff6`.

Human/model spot-check reviewed representative:

- English Picture & Word 320 idle;
- English Picture & Word 1280 idle/success;
- Material Lab 320 idle/success;
- Feature/Function 390 idle and 320 success;
- Initial Sound 390 idle;
- Activity Gallery 1280.

Result: **no P0/P1 containment/readability blocker found** in the reviewed pilot surfaces.

## 5. Superseded PR chain

PRs **#288, #289, #290, #291, #292 and #293** were superseded/closed without merge while the same implementation branch was stabilized through CI-discovered layout fixes and GitHub PR-head snapshot issues.

Only **PR #294** is the final merged implementation record.

Do not treat any earlier superseded PR head as production truth.

## 6. What is deliberately still open

This closure is for **containment/readability infrastructure**, not semantic illustration replacement.

Recognition-critical emoji/glyph fallback remains open. Confirmed examples include:

- English HEAD -> `🙂`;
- English JUMP -> `🤸`;
- Science gills -> `🫧`;
- Science beak -> `👄`;
- Science thick cactus stem -> `💚`;
- Science towel -> `🧺`;
- raincoat currently represented by a generic coat;
- toy block currently represented by a generic brick.

These are semantic-art problems, not containment failures.

Existing `public/artwork/activity-previews/` contains potentially reusable Mainlagi-style artwork, but file existence/name is not sufficient for semantic or provenance approval. Early visual review found strong reuse candidates such as apple, cat, fish, umbrella, car, cup, house, bird and flower, while the existing `color-object-ball.webp` is **not acceptable as a semantic ball illustration**.

## 7. Next safe wave

After merged-main CI #1531 and exact Cloudflare smoke are confirmed, the next independent illustration wave should be a **small semantic illustration registry/provenance pilot**, not a bulk 280-field rewrite.

Architecture direction:

- centralized semantic keys such as `object.apple`, `animal.cat`, `body.head`, `action.jump`, `feature.gills`;
- separate provenance approval from runtime mapping;
- fail-closed missing/unapproved asset behavior;
- a dedicated machine-readable learning-illustration provenance registry;
- a dedicated production subtree rather than arbitrary hardcoded paths;
- blocking format/dimension/size/path/provenance validation;
- deliberate rejection of stray public binaries;
- reuse existing Mainlagi-owned/reviewed artwork only after exact semantic and rights review;
- use `LearningSymbol` for controlled learning concepts where a symbol is more appropriate than pictorial art;
- preserve `LearningVisualToken` as the containment layer;
- human child-readability review before scale-up.

Priority should start with the clearest semantic mismatches, then a small set of high-confidence reusable object assets.

## 8. Hard boundaries preserved

This implementation does not authorize changes to:

- Mainlagi World;
- character production/runtime;
- fixed English narration/audio;
- canonical activity identity;
- prompts;
- choice order;
- answers;
- evidence;
- mastery;
- progression;
- schema;
- stage ownership;
- gameplay-pattern classification.

WS-05 remains closed at 900/900 activities / 47 active patterns, and Pattern #48 remains unjustified.

## 9. Finalization condition

Update this document to **CLOSED / MERGED / LIVE VERIFIED** only after:

1. merged-main CI #1531 is fully successful; and
2. exact-SHA Cloudflare production smoke confirms `6d0f9bd8972297e316bdf031603d160d901d8d04`.

Until then, this document is the safe post-merge checkpoint, not final production closure.
