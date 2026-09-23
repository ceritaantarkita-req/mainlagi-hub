# Learning Semantic P0 Visual Pre-Review — 23 September 2026

Status: **AI VISUAL PRE-REVIEW / SOURCE REFINEMENT / HUMAN APPROVAL STILL REQUIRED**

Baseline generator:
- PR #300;
- main `89adf887e270c2451ae81af8cd6a9bae0b798fbd`;
- merged-main CI #1546 / run `35805378889`;
- full success including exact Cloudflare production smoke.

## Scope

Exact review-only candidate set remains:

1. `body.head`;
2. `action.jump`;
3. `feature.gills`;
4. `feature.beak`;
5. `feature.cactus-thick-stem`;
6. `object.towel`;
7. `object.raincoat`;
8. `object.toy-block`;
9. `object.ball`.

## Method

The canonical generator geometry was rendered locally for visual inspection at 96px, 64px, 48px and 32px stress scale.

This is an AI visual pre-review only. It is not a child usability study, not the required human semantic review and not production approval.

Review questions:
- can the intended concept be recognized without answer text?
- can it be mistaken for a neighboring concept?
- do critical features survive small learning-card scale?
- is the shape clean, centered and consistent with Mainlagi's rounded low-noise 2D direction?

## Findings

Clear enough to proceed to exact human review:
- `body.head` — clearly depicts a head/body part rather than a generic smile emoji;
- `feature.gills` — fish plus highlighted gill region remains recognizable at small scale;
- `feature.beak` — bird head with a prominent beak is clear;
- `object.ball` — new soccer-ball candidate fixes the rejected old preview ambiguity;
- `object.raincoat` — hood, coat silhouette and rain cues distinguish it from a generic coat;
- `object.towel` — hanging towel is distinct from the current basket fallback;
- `object.toy-block` — child stacking block/cube is clear.

Two source refinements were required before human review.

### `action.jump`

Original risk:
- the splayed pose plus two small arrows could read like a jumping-jack/gymnastics action;
- the two small motion cues became weak at 48/32px.

Refinement:
- preserve a visibly airborne body;
- replace the two weak arrows with one large upward-motion cue;
- add a separated ground reference;
- reduce competing tiny motion marks.

### `feature.cactus-thick-stem`

Original risk:
- the image read primarily as “cactus + water”;
- “batang tebal” was not the first visual feature.

Refinement:
- make the central stem more dominant;
- use a larger internal water-storage cutaway;
- add explicit width-direction cues;
- reduce nonessential small decorative marks.

## Approval boundary

No item in this document is production-approved.

Next required gate is exact human review of the generated binaries. Each of the nine exact files must be accepted/rejected individually.

Only accepted exact binaries may later proceed to a separate provenance/production-approval wave that must still:
- establish rights holder/license basis and redistribution permission;
- bind final production SHA-256;
- copy only accepted binaries into `public/artwork/learning-illustrations/`;
- update only matching semantic registry records;
- pass the existing fail-closed asset validator;
- keep runtime activation separate.

## Hard boundaries

- Mainlagi World untouched.
- Character development remains paused.
- Fixed English audio remains deferred.
- WS-05 remains closed at 900/900 activities / 47 active gameplay patterns / no Pattern #48.
- No prompt, choice, answer, evidence, mastery, progression, schema or stage ownership change.
- No production semantic binary.
- No runtime semantic activation.
