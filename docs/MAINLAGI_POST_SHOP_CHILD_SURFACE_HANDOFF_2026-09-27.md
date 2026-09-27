# Mainlagi — Post-Shop Child Surface Handoff — 27 September 2026

Status: **PENDING SUCCESSOR WORK / DO NOT START BEFORE SHOP RELEASE CLOSURE**

This document exists so a future human or AI agent finishing Mainlagi Shop knows exactly what work resumes next. It is a handoff pointer, not permission to interrupt the active Shop release sequence.

## 1. Mandatory execution order

The order is locked:

```text
1. Finish Mainlagi Shop according to docs/SHOP_IMPLEMENTATION.md
2. Close Shop staging / provider / launch gates
3. Merge the approved Shop release to latest main
4. Verify merged-main CI + production smoke / launch record
5. Only then resume PR #360 child-surface visual alignment
```

Do **not** mix the child-surface revision into unfinished Shop batches. Do **not** rebuild the child-surface revision from memory after Shop. A reviewed implementation already exists on its own branch.

## 2. Existing successor implementation

The post-Shop revision is already implemented here:

```text
PR:     #360 — ui: align Belajar Bermain World child surfaces
branch: agent/child-surface-visual-alignment-20260927
implementation checkpoint:
        ce5c17da519a970b2f8589b5c93df888bbe4cdcc
CI:     Mainlagi TV V3 CI #1719 / run 36294204273 — full success
```

At that implementation checkpoint, the successful CI covered:

- Secret history scan;
- Production dependency audit;
- Production build;
- Windows compatibility;
- Quality gate (Ubuntu);
- Mobile route QA (Chromium).

Cloudflare production smoke was skipped by PR workflow condition; therefore this checkpoint is **PR-green, not production-live**.

PR #360 was intentionally created as a stacked PR on top of the Shop foundation because the new child navbar exposes `/shop`. The Shop branch continues to move while Shop is being completed, so the child-surface branch can become behind/diverged during that work. That is expected. Do not treat temporary divergence as a reason to discard or rewrite the approved revision.

## 3. Product revision already implemented in PR #360

Canonical top-level child navigation:

```text
Belajar | Bermain | World | Shop
```

The revision includes:

- navbar order changed to **Belajar → Bermain → World → Shop**;
- mobile child navigation changed to four equal destinations;
- Shop remains a separate destination and must not become a mastery/progression reward;
- Belajar Home no longer duplicates top-level navigation with the old `Satu Mainlagi / Mau ke mana sekarang?` Belajar/World/Bermain card block;
- Belajar Home copy is simplified around `Mau belajar apa hari ini?`, one continue-learning action, and the subject directory;
- Belajar page atmosphere uses a subtle blush/red family with low-contrast decorative shapes;
- Bermain page atmosphere uses a subtle green family with low-contrast decorative shapes;
- World catalog uses a soft sky-blue to mint atmosphere rather than a hard two-band background;
- Belajar subject cards remain 3 columns desktop / 2 columns mobile;
- Bermain game cards are normalized to 3 columns desktop / 2 columns through 760 px mobile;
- World cards remain 3 columns desktop / 2 columns mobile;
- existing 9 Belajar subjects, 10 Main Gerak games and 9 World cards are preserved;
- browser/QA contracts were updated to lock the new navigation and responsive-grid behavior.

The relevant implementation files are:

```text
src/components/learning/Playroom.tsx
src/components/learning/Playroom.module.css
src/components/learning/Batch14WorldHome.tsx
src/components/learning/LearningPlatform.module.css
src/components/learning/world-v2/MoneyWorldExperience.module.css
src/app/globals.css

scripts/run-core-thumbnail-wave01-browser-tests.mjs
scripts/run-home-bermain-character-session09-tests.mjs
scripts/run-local-playroom-check.mjs
scripts/run-mobile-route-browser-tests.mjs

docs/PRODUCT_DIRECTION.md
```

## 4. Non-negotiable boundaries

This successor work is presentation/navigation work. It must **not** silently change:

- learning progression;
- learning attempts, evidence or mastery semantics;
- stars/reward meaning;
- the 900-activity / 47-active-pattern baseline;
- Motion Engine mechanics;
- Main Gerak game mechanics;
- Petualangan Uang content, stage order, World progression or World evidence semantics;
- database schemas merely for this visual revision;
- Shop cart, checkout, inventory, Midtrans, Biteship, order, refund, reporting or provider contracts;
- product/media facts approved during the Shop release.

Shop must remain operationally independent from Belajar progression. A child seeing `Shop` in top-level navigation does not make commerce part of learning completion or mastery.

## 5. Exact resume procedure after Shop is finished

After the final Shop release is merged to `main`:

1. Fetch/prune and verify the actual latest `main` SHA and the final Shop production checkpoint.
2. Read, in this order:
   - `docs/SHOP_IMPLEMENTATION.md`;
   - this document;
   - `docs/MAINLAGI_CANONICAL_COMPLETION_SHARE_VISUAL_SPEC_2026-09-27.md`;
   - `docs/CURRENT_STATE.md`;
   - `docs/NEXT_PRODUCT_QUALITY_PLAN.md`;
   - `docs/PRODUCT_DIRECTION.md`;
   - PR #360 diff and discussion.
3. Inspect branch `agent/child-surface-visual-alignment-20260927`. Do not assume its old Shop base is still current.
4. Synchronize PR #360 onto the **post-Shop latest main**. Rebase or integrate latest main carefully; do not lose finalized Shop work.
5. If conflicts occur:
   - preserve final Shop behavior for Shop-specific runtime/provider/commerce files;
   - preserve PR #360 child-surface behavior for the files and UI contract listed above;
   - re-evaluate docs conflicts manually instead of choosing one side wholesale.
6. Retarget/open the final PR #360 against `main` once its ancestry is clean.
7. Run full required CI on the exact final PR #360 head.
8. Re-run browser review for Belajar Home, Bermain catalog and World catalog at minimum phone portrait, phone landscape and desktop.
9. Confirm no horizontal overflow, no console/page errors and the canonical grid/navigation contract.
10. Merge PR #360 only after all required checks are green.
11. Verify merged-main CI and exact production smoke for PR #360.
12. Record the final PR #360 merged SHA/CI/smoke in canonical docs.

Only after that foundation is merged:

13. Start a **fresh bounded shared-interaction wave** from the new latest `main`.
14. Use `docs/MAINLAGI_CANONICAL_COMPLETION_SHARE_VISUAL_SPEC_2026-09-27.md` as the owner-approved source of truth.
15. Audit coverage before broad code replacement:
    - Belajar runtime families;
    - all 10 Main Gerak/Bermain games;
    - World story/activity/stage/finale completion;
    - existing Share implementations;
    - existing character-placement paths.
16. Implement the shared system in this order:
    - responsive orientation foundation;
    - Canonical Completion;
    - Canonical Character Presentation safe areas;
    - removal of character-name labels;
    - Canonical Share;
    - migration of existing final-completion paths to the shared components.
17. Verify portrait/landscape reflow does not reload/reset gameplay, progress, timer, dialog, Completion or Share state.
18. Run the full responsive/orientation QA matrix from the canonical visual spec.
19. Merge and production-verify the shared-interaction wave.
20. Only then begin the separate World header/map redesign after a dedicated owner-approved World visual target exists.

Do **not** silently expand PR #360 into the entire Completion/Share/Character/World redesign. The existing PR #360 is the child-navigation/page-atmosphere/grid foundation; the shared-interaction migration is the next bounded wave.

## 5A. Locked visual + responsive successor contract

Treat `docs/MAINLAGI_CANONICAL_COMPLETION_SHARE_VISUAL_SPEC_2026-09-27.md` as owner-approved truth for the shared-interaction wave.

The approved and locked directions include:

- Canonical Completion System;
- Canonical Share Experience;
- Canonical Character Presentation:
  - no unintended crop;
  - no floating name label underneath;
  - safe-area placement;
- responsive orientation behavior:
  - portrait device → portrait composition;
  - landscape device → landscape composition;
  - rotation changes layout only, never product state.

The two approved popup mockups lock the **popup/modal visual systems only**. The background artwork visible behind those mockups is non-canonical; runtime keeps the real background of the active Belajar/Bermain/World experience.

The same responsive component identity must survive portrait and landscape. Do not create visually unrelated portrait and landscape versions.

Rotation/orientation change must not:

- reload the route;
- restart activity/game state;
- reset an answer;
- reset timer/progress;
- close dialog;
- close Completion;
- close Share;
- create duplicate attempt/evidence writes.

The execution priority after PR #360 is:

```text
responsive orientation foundation
→ Canonical Completion
→ Character safe-area/no-name migration
→ Canonical Share
→ coverage + portrait/landscape QA
→ merge/production verify
→ separate World header/map redesign
```

Do not regenerate or materially redesign the approved Completion/Share concepts without explicit project-owner approval.

## 6. Acceptance contract

The successor revision is ready for merge only when all of the following are true:

- Shop is already closed/merged according to its own release gates;
- `/shop` exists and remains functional after branch synchronization;
- navbar order is exactly `Belajar | Bermain | World | Shop`;
- Belajar has no duplicate top-level domain-card block;
- Belajar keeps all nine subject entries;
- Bermain keeps all ten existing game entries/routes;
- World keeps one live + eight locked cards unless a separately authorized World change has happened;
- Belajar/Bermain/World grids are 3 columns desktop and 2 columns mobile through 760 px;
- visual atmosphere remains subtle and does not reduce text/card readability;
- learning, World, Motion Engine and Shop transaction semantics are unchanged by this revision;
- full CI passes on the exact post-Shop synchronized head;
- merged-main production smoke succeeds.

## 7. What the next agent must not do

Do not:

- start PR #360 integration before Shop is actually closed;
- merge the old stacked PR blindly after the Shop branch has moved;
- delete PR #360 and recreate the work from scratch without first auditing its verified diff;
- remove Shop from the navbar because the old child shell historically had only three domains;
- restore the duplicated `Mau ke mana sekarang?` domain-card section on Belajar;
- restore five desktop columns for Main Gerak;
- broaden this visual pass into curriculum, mastery, World evidence, character-production or commerce-provider redesign;
- claim production-live status from CI #1719 alone.

## 8. Source-of-truth rule

While Shop is active, `docs/SHOP_IMPLEMENTATION.md` controls Shop execution.

After Shop is merged, this document becomes the explicit successor pointer for the child-surface revision, while the actual latest `main` remains the repository source of truth.

If later code or owner decisions supersede any snapshot SHA in this document, preserve the product intent and re-audit against the actual latest branch state rather than blindly resetting to the historical SHA.
