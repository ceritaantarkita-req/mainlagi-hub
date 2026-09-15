# WS-05 Science Material Lab Wave — 2026-09-15

Status: **MERGED / PR #116**.

Branch: `agent/ws05-science-material-lab-20260915`  
Base gameplay main: `4f3e2828aa3be804f6d896b10f8e3422c3180811`  
Merge target before acceptance included docs closure PR #115 at `539b5717f5e77ccd7c883acb3e44a09c5557b54d`.  
Merged gameplay commit: `5d6b429b64681bc6f2aa055a643a607cf54b1102`.

## Objective review

The next Science mechanic was selected from exact objective/evidence review, not from pattern-count pressure.

Wave D investigation/evidence was reviewed first, but its choice activities mix experiment design, control variables, prediction and conclusion. They are not one sufficiently coherent interaction family and remain outside this wave.

The Wave D material-design family is coherent: each activity asks the child to choose a material property that makes a familiar object fit its purpose.

## Exact scope

Only these four canonical `tap_choice` activities use `material_lab`:

```text
science-material-raincoat-waterproof
science-material-window-transparent
science-material-towel-absorbent
science-material-toy-block-rigid
```

Explicit exclusion:

```text
science-match-material-purpose-d
```

The excluded activity remains canonical `matching` / `visible_matching` because it measures property-purpose pairing rather than selecting and testing one material property for an object.

## Interaction contract

`material_lab` uses a deliberate two-step interaction:

1. choose one canonical material-property sample;
2. explicitly test that sample against the visible object purpose.

Selection alone cannot complete the activity. A wrong tested sample is retryable and cannot complete. A correct tested sample records measured evidence and then completes.

The engine preserves:
- runtime `tap_choice`;
- exact activity IDs;
- canonical choices and `correctChoice`;
- canonical assessment/stars/progression identity;
- existing skill IDs;
- stage identity `science-evidence-review-challenge`.

Assessed evidence fidelity is `choice_material_lab_interaction`.

## Implementation surface

- `src/lib/learning/materialLabConfig.ts`
- `src/components/learning/MaterialLabActivity.tsx`
- `src/components/learning/MaterialLabActivity.module.css`
- exact classifier/routing in `gameplayPresentation.ts` and the child activity route
- static scope regression in `run-gameplay-presentation-tests.mjs`
- permanent distribution recognition in `audit-gameplay-distribution.mjs`
- browser/mobile QA in `run-material-lab-browser-tests.mjs`
- mobile CI chain integration through `package.json`

## QA history

Initial CI #532 correctly failed before acceptance because an edit to `package.json` accidentally omitted the existing `@phosphor-icons/react` dependency. The failure surfaced as TypeScript module-resolution errors. The dependency was restored at its existing `^2.1.10` version; no package migration or unrelated dependency change was introduced.

Implementation head after the fix:

```text
09dd638748d62da1da264ce3b4f6f8f6880354b7
```

CI #533: **full green**. Key evidence:
- typecheck/lint/build pass on Ubuntu and Windows;
- production build, production dependency audit and secret-history scan pass;
- gameplay presentation regression locks exactly four Material Lab IDs;
- deterministic activity quality remains **900 KEEP / 0 flagged / structural 0**;
- gameplay distribution is 900/900 classified with 20 active patterns;
- Batch 17 final engineering acceptance remains PASS with external physical-device certification still correctly marked pending external evidence;
- Mobile Chromium runs the permanent Material Lab browser QA.

Browser QA covers 320x720, 390x844 and 768x1024 with legitimate Science Wave C readiness:
- progression guard does not redirect;
- exact canonical three choices render;
- keyboard can select a wrong sample;
- selection alone cannot complete;
- wrong explicit test cannot complete;
- pointer can select the correct sample;
- correct selection still requires the explicit test action;
- assessed attempt persists `choice_material_lab_interaction` plus material-test metadata;
- incorrect/retry/accuracy accounting is preserved;
- controls remain >=44px;
- no horizontal overflow;
- success CTA remains fully visible;
- no page or console errors.

## Manual visual review

CI #533 screenshot artifact was reviewed for idle/error/success states at 320, 390 and 768 widths.

Accepted:
- content hierarchy remains clear;
- three material samples remain readable and distinct;
- wrong-state feedback is obvious without blocking retry;
- success state preserves the selected sample and shows a visible CTA;
- compact 320 layout does not clip the CTA;
- 390 and 768 layouts scale without text collision or control overlap;
- tablet background mascots remain decorative behind translucent panels and do not obscure content or controls.

No visual polish commit was required after this review.

## Final acceptance and merge

Final docs head:

```text
974589a39617997093cde9e73241223a1c684935
```

CI #535: **full green**. Final PR state was mergeable/clean with 0 issue comments, 0 review comments, 0 submitted reviews, and 0 review threads. PR #116 was squash-merged with exact `expected_head_sha`.

Verified merge:

```text
5d6b429b64681bc6f2aa055a643a607cf54b1102
```

`main` was fetched after merge and verified at that exact SHA.

## Merged distribution

```text
900 / 900 classified
0 unclassified
20 active patterns
choice_grid           355 / 900 = 39.44%
material_lab            4 / 900 = 0.44%
Science choice_grid     68 / 100
Logic choice_grid       77 / 100
```

## Closure

Material Lab is shipped on `main`. Pattern #20 is canonical. The next WS-05 unit is a fresh exact-family Science audit from this 20-pattern baseline; heterogeneous investigation/evidence tasks remain intentionally ungrouped unless a coherent reusable objective family is proven.
