# VSG-08 — Relative Order Track 320px first-action fix

**Date:** 28 October 2026
**Base:** `main@d5abe2301cbe76f69447c660d4e7032f966429d2` after VSG-07 PR #541 merged.
**Status:** REVIEW-ONLY IMPLEMENTATION — dependent on PR #541 acceptance and merge.

## Source-confirmed defect

At ≤340px, the old `RelativeOrderTrackActivity.module.css` explicitly sets `.promptCard { display: none; }` and hides the only prominent question. There are also repeated generic instructions in a heading, descriptive paragraph, relation/position cue and idle status.

## Scope of safe change

- One main instruction **"Apa isi tanda tanya?"** through the existing `planChildVisualHierarchy`. The complete `activity.prompt` remains narrated; prior generic guidance is accessible via **Cara main (?)**.
- All five canonical `relativeOrderTrackConfig` variants retain the original `relationLabel`, `cue`, 4/5 nodes, masked target slot, original index and all three choices; no revealing the hidden slot before answering.
- The position relation and its cue stay **visible**, because unlike generic instructions they are necessary task evidence. Only redundant visual status copy is removed.
- Mobile first question stays visible at 320px, position nodes have at least 44px minimum width with scoped scroll containment for longer labels, and answer buttons retain large touch areas.
- Short retry text; success reason screen-reader-accessible; concise canonical three-star completion. No answer/scoring/progression changes.

## Test requirements

`scripts/run-relative-order-track-browser-tests.mjs` has five viewport checks at 320/390/430/768/1280; 20 screenshots (idle/help/wrong/success). Must verify exact original 4-node/2 cue? This family has **one original cue and one masked target slot**; preserve those conditions plus keyboard retry, 0.5 accuracy, 1 real assessed attempt and Again reset. CI artifact: `vsg08-relative-order-screenshots`.

### Acceptance gates

- [ ] VSG-07 #541 merged before VSG-08 merges to main; if target branch changes, retarget PR and rerun exact-head CI.
- [ ] Seven CI gates PASS for final VSG-08 PR state.
- [ ] Manually review original 20 screenshot PNGs especially 320px and the five-node variants in additional checks before claiming full family coverage.
- [ ] No horizontal page overflow; long target label readable; target masking, arrow order and accessibility intact.
- [ ] Cloudflare exact deployed SHA and physical iOS Safari validated separately after merge.

**Non-goals:** World, Motion Engine, Shop, DB, auth, new gameplay pattern, 900 content, Stage lock/readiness changes, scoring or mastery.
