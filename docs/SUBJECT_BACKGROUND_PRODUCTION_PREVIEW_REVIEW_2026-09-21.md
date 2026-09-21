# Subject Background Production Preview Review — 21 September 2026

Status: **PRODUCTION PREVIEW REVIEWED / 9 OF 9 SUBJECTS REPRESENTED**

This record captures the project-owner-supplied production screenshots reviewed on 21 September 2026 after the all-subject background wave was merged and deployed.

This is desktop production-preview evidence. It does **not** replace the automated responsive/mobile QA artifact or the permanent visual QA suite.

## Production context

- canonical site: `https://mainlagihub.my.id`;
- background implementation PR: **#256**;
- background implementation main: `7502c708c998c87bb273639025fcb10ba6c81e12`;
- background implementation merged-main CI: **#1183 / run 35565937149 — full success including exact Cloudflare production smoke**;
- docs closure PR: **#257**;
- latest production main at the time of this review: `41df41c9dc0edc449af8260bbfe3887e0175bfb0`;
- docs-closure merged-main CI: **#1186 / run 35567718494 — full success including exact Cloudflare production smoke**.

## Project-owner preview matrix

| Subject | Production route shown | Environment visible in preview | Runtime state shown |
| --- | --- | --- | --- |
| English | `/child/demo-gian/activity/english-find-blue` | beach / seaside learning cove | color-choice activity |
| Bahasa Indonesia | `/child/demo-gian/activity/bahasa-cari-a` | garden literacy scene | letter-find activity |
| Matematika | `/child/demo-gian/activity/math-count-2` | number/playground park | counting activity |
| Iqro | `/child/demo-gian/activity/iqro-cari-alif` | mosque courtyard | Hijaiyah choice activity |
| Huruf & Menulis | `/child/demo-gian/activity/letters-find-a` | city / alphabet plaza | letter-find activity |
| Logika | `/child/demo-gian/activity/logic-match-pairs` | space observatory | completion modal over finished activity |
| Sains | `/child/demo-gian/activity/science-living-cat` | nature / trail scene | living/non-living choice activity |
| Mewarnai | `/child/demo-gian/activity/color-gavi` | art gallery / museum | coloring workspace |
| Menggambar | `/child/demo-gian/activity/drawing-line-horizontal` | nature art meadow | drawing workspace |

## What the previews confirm

Across the nine supplied production screenshots:

- all nine canonical subjects are represented by a subject-specific environment;
- the background is visually distinct from the foreground learning UI;
- the shared Mainlagi header controls remain visible above the scene;
- normal gameplay routes keep Gavi and Paca as separate foreground character layers rather than baking them into the background;
- the Coloring and Drawing workspace routes keep their gallery/nature scenery visible behind the creative canvas and tools;
- the Logic completion state preserves the space environment beneath the dimmed completion overlay;
- task titles, choices, activity boards/canvas and primary controls remain readable in the supplied desktop captures;
- the scene composition leaves the central learning area usable while concentrating most decorative context near the edges.

## Important scope boundary

These supplied screenshots are desktop production previews. They do not independently prove:

- every one of the 54 scene families;
- every one of the 900 activities;
- all mobile/tablet viewport compositions;
- all retry/error/loading/audio-unavailable states.

Those broader contracts remain covered by the automated visual-theme regression, responsive/mobile browser QA, build/CI gates and permanent visual QA evidence recorded in the implementation closure.

## Current conclusion

The project-owner production preview now provides one real production screenshot for each of the nine subjects and is consistent with the intended subject-background architecture.

The subject-background wave remains **FULLY CLOSED / MERGED / LIVE VERIFIED**.

Next visual work should build on this production baseline rather than reopen the background architecture unless a concrete visual defect is found.
