# Mainlagi Activity Quality Audit

Last reviewed: **14 September 2026**

Status: **WS-04 deterministic triage is clean; WS-06 Coloring and WS-07 Drawing are complete; WS-05 gameplay diversification is active. Human pedagogical/art review remains separate.** Canonical plan: `NEXT_PRODUCT_QUALITY_PLAN.md`.

## Current calibrated state

PR #102 implementation-head CI #447 audits all **9 subjects / 900 activities** after Memory Pair merge and Sequence Slot implementation:

```text
symbol_hunt           74
structural findings    0
KEEP                  900
POLISH                  0
REDESIGN                0
REPLACE                 0
flagged total           0
```

| Subject | KEEP | POLISH | REDESIGN |
|---|---:|---:|---:|
| Bahasa Indonesia | 100 | 0 | 0 |
| English | 100 | 0 | 0 |
| Matematika | 100 | 0 | 0 |
| Iqro | 100 | 0 | 0 |
| Huruf & Menulis | 100 | 0 | 0 |
| Logika | 100 | 0 | 0 |
| Sains | 100 | 0 | 0 |
| Mewarnai | 100 | 0 | 0 |
| Menggambar | 100 | 0 | 0 |

Accepted progression:

```text
Wave A          640 KEEP / 186 POLISH / 74 REDESIGN / 0 REPLACE — 260 flagged
Wave B          683 KEEP / 178 POLISH / 39 REDESIGN / 0 REPLACE — 217 flagged
Wave C          766 KEEP /  95 POLISH / 39 REDESIGN / 0 REPLACE — 134 flagged
WS-06 Wave A    805 KEEP /  95 POLISH /  0 REDESIGN / 0 REPLACE —  95 flagged
WS-06 Wave B    825 KEEP /  75 POLISH /  0 REDESIGN / 0 REPLACE —  75 flagged
WS-07 Wave A    850 KEEP /  50 POLISH /  0 REDESIGN / 0 REPLACE —  50 flagged
WS-07 Wave B    875 KEEP /  25 POLISH /  0 REDESIGN / 0 REPLACE —  25 flagged
WS-07 Final     900 KEEP /   0 POLISH /  0 REDESIGN / 0 REPLACE —   0 flagged
```

Structural findings stayed **0** throughout.

## Resolved deterministic rules

- `Q101_TEXT_LABEL_USED_AS_COLOR_VISUAL`: 3 -> 0.
- `Q102_VISUAL_SKILL_USES_TEXT_ONLY_CHOICES`: 6 -> 0.
- `Q103_AUDIO_TARGET_VISIBLE_IN_PROMPT`: 26 -> 0.
- `Q104_EARLY_AGE_READING_LOAD`: 8 -> 0.
- `Q105_DIRECT_SYMBOL_DISCRIMINATION`: 83 -> 0.
- `Q106_YOUNG_DRAWING_WITHOUT_SCAFFOLD`: 75 -> 50 -> 25 -> 0 across WS-07.
- `Q107_EXACT_ACTIVITY_CONTENT_DUPLICATE`: remains 0.
- `Q108_DUPLICATE_COLORING_GEOMETRY`: 59 -> 20 -> 0 across WS-06.

Deterministic zero does **not** mean all 900 activities are human-approved or maximally varied. The audit is a structural/quality triage gate; WS-05 gameplay diversification, WS-08 art direction, physical-device/accessibility acceptance, and competent Iqro review remain separate requirements.

## WS-06 Coloring

WS-06 rebuilt Coloring geometry while keeping all 100 Coloring activities creative practice. Q108 is zero, runtime geometry validation remains active, and gallery previews regenerate from the same runtime geometry before dev/build/Cloudflare build.

## WS-07 Drawing

WS-07 reuses the existing `DrawingGuide` + `DrawingScaffold` runtime. Scaffolds are non-interactive visual starters, can be shown/hidden, and never count as the child's stroke or synthetic completion.

### Wave A — concrete families

Added 25 activity-specific `complete` starter guides for objects, animals, nature, faces/people, and simple scenes. Together with the original 25 foundational trace/dots/composition guides, this raised coverage to 50/100 and reduced Q106 75 -> 50.

Manual visual review caught two overly prescriptive face guides before acceptance and reduced them to structural anchors.

### Wave B — structured visual skills

Added 25 guides across space/layers, texture/marks, symmetry, story/sequence, and composition/focus. Coverage became 75/100 and Q106 fell 50 -> 25.

Manual visual review rejected three story guides that were still too prescriptive. They were reduced to neutral sequence/path/figure anchors before merge.

### Final wave — open-ended families

PR #100 added sparse activity-specific guides for the remaining 25 invention, character, map/world, visual-design, and capstone/free-studio activities. The guides use only workspace boundaries, construction zones, axes, nodes, routes, or starting marks; they deliberately avoid supplying the requested invention, character identity, symbol, story content, or capstone answer.

Final visual review of all 25 runtime-derived previews confirmed the intended sparse treatment: no clipping/off-canvas issues and no obvious finished-answer scaffold. The free-studio activity uses corner marks only; maps use nodes/routes/boundaries; character tasks use construction anchors; design tasks use empty layout containers; capstones use sparse composition anchors.

WS-07 final audit reports **900 KEEP / 0 POLISH / 0 REDESIGN / 0 REPLACE**, Q106=0, Q108=0, structural=0.

## WS-05 gameplay diversification

The clean quality audit still exposes repeated template families that are useful for WS-05 planning. Examples include:

- 29 Iqro `listen_and_choose` activities with the same instruction family;
- 27 English `listen_and_choose` activities;
- 20 Bahasa `listen_and_choose` activities;
- large Letters `tap_choice` families even though 74 direct-symbol activities already render through `symbol_hunt`;
- repeated matching/trace families.

These are **not quality failures by themselves**. They are candidates for reusable mechanic diversification only where the mechanic improves the learning objective and preserves assessed evidence.

Accepted / current WS-05 state:
- `symbol_hunt`: merged for 74 direct-literacy activities; canonical choice evidence preserved.
- `memory_pair`: merged in PR #101 for exactly 12 Letters case-matching activities; canonical `matching` runtime and assessed evidence preserved.
- `missing_sequence_slot`: QA on PR #102 for exactly 10 `letters-order-*` activities; canonical `tap_choice` contract preserved, explicit evidence fidelity `choice_sequence_interaction` added.
- PR #102 browser QA covers progression, keyboard wrong-state, pointer completion, evidence persistence, 320/390/768 responsive states and an explicit in-viewport success CTA assertion.
- manual visual QA caught and corrected a clipped 320×720 success CTA before acceptance.
- PR #102 implementation-head CI #447 remains **900 KEEP / 0 flagged**, structural=0.

Next WS-05 wave after PR #102: `sorting_buckets` + `drag_to_target` for classification/matching objectives, followed by additional sequence/search/math/audio families according to `GAMEPLAY_VARIATION_CATALOG.md`.

## Permanent audit

```bash
npm run qa:activity-quality
```

Outputs:

```text
.qa/activity-quality/report.json
.qa/activity-quality/report.md
```

CI uploads `activity-quality-audit`.

Blocking structural rules: `Q001` missing catalog spec, `Q002` assessed without skill, `Q003` creative marked assessed, `Q004` invalid choice contract, `Q005` invalid matching contract.

Advisory quality rules: `Q101`–`Q108`. Heuristics do not replace human pedagogical/visual review.

## Wave status

- **Wave A DONE** — PR #91, merge `7a087d590381dd4487811027690ac187ff87954b`, CI #378.
- **Wave B DONE** — PR #92, merge `7b2f8a75cc00eafc0c3202a718e2fd81374f5f8e`, CI #387.
- **Wave C DONE** — PR #93, merge `85aea0e5843f251eb83e5aa62180268b75455cfa`, CI #398; Q105=0.
- **WS-06 Wave A DONE** — PR #95, merge `4049449b5678f7f769f986750380a71b30536928`, CI #406.
- **WS-06 Wave B DONE** — PR #96, merge `31ed55a0bee24a3baae7ff459f79bee9f585ad22`, CI #408; Q108=0.
- **WS-07 Wave A DONE** — PR #98, merge `d9f0245e8531662840e2d9030e7b9b6e2f9e1df0`, final head CI #415.
- **WS-07 Wave B DONE** — PR #99, merge `ebeae5ed8d7e58c9b7b9807c88c0d92c45481329`, final docs-head CI #420; Q106 50 -> 25.
- **WS-07 Final DONE** — PR #100, merge `c01f8122b19cde3d46ea0e2d3297b58216fe824c`; Q106=0.
- **WS-05 Memory Pair DONE** — PR #101, merge `aea24d47bd2793fbbf3b3723878674ec6f3c98a0`; 12 activities; final visual/browser QA accepted.
- **WS-05 Sequence Slot QA** — PR #102; 10 activities; implementation-head CI #447 full success; visual QA accepted; docs-head CI required before merge.
- **WS-05 NEXT** — Sorting/Buckets + Drag-to-Target wave; measure mechanic concentration while preserving evidence contracts.
- **Wave E LATER** — human subject-by-subject review for age fit, ambiguity, difficulty, cultural fit, visual quality, and progression coherence.

## Completion rule

Deterministic WS-04 triage is clean at 900/900 KEEP. Product-quality work remains open until human pedagogical/art review, gameplay diversification where justified, canonical docs, physical-device/accessibility acceptance, and specialist Iqro review are complete. Deterministic zero findings must never be represented as expert approval.
