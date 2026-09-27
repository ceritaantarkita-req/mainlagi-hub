# Mainlagi — Canonical Completion, Share, Character & World Visual Direction

Date: 27 September 2026  
Status: **OWNER-APPROVED / VISUAL DIRECTION LOCKED**

This is the canonical visual/product contract for the shared child-facing completion system, share experience, character presentation corrections, and the next World visual cleanup direction.

## Critical visual lock

The owner approved two frontend mockups in the 27 September 2026 review:

- mainlagi-canonical-completion-approved-2026-09-27.png
- mainlagi-canonical-share-approved-2026-09-27.png

The approved source visuals are preserved in the ChatGPT Library under:

- /Mainlagi/Visual Specs/mainlagi-canonical-completion-approved-2026-09-27.png
- /Mainlagi/Visual Specs/mainlagi-canonical-share-approved-2026-09-27.png

A handoff package containing this Markdown file plus both original approved PNGs is also preserved as MAINLAGI_CANONICAL_COMPLETION_SHARE_VISUAL_SPEC_2026-09-27.zip in the originating review conversation.

**Only the popup/modal components and their internal visual language are approved by those images. The illustrated background behind them is NOT part of the visual contract.** Production must keep the real background of the current Belajar, Bermain, or World game/activity behind the popup.

Do not regenerate the two approved popup concepts and treat a new generation as canonical. Material visual redesign requires explicit project-owner approval.

## 1. Why this spec exists

Current production still exposes multiple visual systems for completion, sharing, character placement, and World presentation. The owner identified five problems:

1. the final “praise + Back / Again / Next / Share” completion experience appears on some games but not all;
2. characters are frequently clipped, across multiple characters and surfaces, and name labels under characters are unnecessary;
3. Belajar and Bermain use different completion visual languages even though they belong to one product;
4. the existing Share popup is visually weak and should follow the cleaner approved share concept;
5. the current World overview/header/map has character cropping, obsolete/wrong-concept background art, and a weak journey-map presentation.

The execution priority is locked: shared completion/character/share system first, then World header/map redesign, then residual consistency cleanup.

# 2. Canonical Completion System — LOCKED

## 2.1 Mandatory usage

The final-completion experience must appear at the end of **all playable child experiences**:

- Belajar activities;
- Bermain / Main Gerak games;
- World playable stages/activities;
- future child-facing games added to the same product system.

This applies to the final completion state. Ordinary correct/incorrect feedback during gameplay may remain mechanic-specific.

Once a game/activity is complete, the user must enter the shared canonical Completion System.

## 2.2 Canonical hierarchy

The popup must preserve this hierarchy:

1. Mainlagi identity;
2. celebration/achievement visual;
3. short praise such as Keren!, Hebat!, or Luar biasa!;
4. three-star completion visual;
5. one very short completion sentence;
6. optional compact context/progress status;
7. character celebration area;
8. Back | Again | Next;
9. Share underneath.

Copy may vary by context, but the layout must not.

## 2.3 Action contract

The canonical action structure is:

Back | Again | Next  
Share underneath as a separate full-width action.

Rules:

- Back, Again, Next stay in that order.
- Next is the primary CTA.
- Share is a separate secondary action below.
- Belajar, Bermain, and World must not reorder or restyle this into separate systems.
- Route semantics may be context-specific, but the visual/action hierarchy remains fixed.
- If Next needs a context-specific destination, change the destination logic, not the component design.

The owner explicitly wants this pattern to stop appearing only sometimes.

## 2.4 Visual language

Preserve the approved concept:

- warm ivory/cream card surface;
- Mainlagi brand navy for important text;
- soft rounded geometry;
- subtle elevation/shadow;
- restrained celebratory confetti;
- gold/yellow stars;
- green primary Next action;
- white/light Back and Again actions;
- warm pale-yellow Share treatment;
- generous spacing;
- child-friendly visual hierarchy;
- no dense dashboard metadata.

Belajar, Bermain, and World may pass different context/copy into the component, but they must use the same visual family.

## 2.5 Background is explicitly NOT canonical

The completion mockup shows an illustrated playground/forest only so the popup could be reviewed in context.

Runtime behavior should be:

actual game/activity scene  
→ completion triggered  
→ existing scene remains behind  
→ scene is dimmed/de-emphasized  
→ canonical completion popup appears above it.

Never replace every game background with the mockup background.

# 3. Canonical Character Presentation Rules — LOCKED

Character clipping is a shared-system defect and must be fixed as a system problem, not by nudging individual screens.

## 3.1 No unintended crop

Normal character presentation must not unintentionally crop:

- head;
- ears;
- antenna;
- hands;
- feet;
- tail;
- costume or important silhouette.

Use predictable safe areas and contain-style presentation rather than aggressive cropping. Absolute positioning is allowed only when the container/safe-area contract guarantees the intended silhouette remains visible.

## 3.2 Remove names underneath characters

Remove normal floating labels underneath characters such as:

Gavi  
Paca  
Naya  
Gian  
Zia

Those labels read like prototype/debug UI and are not needed in normal character presentation.

If speaker identity genuinely needs to be communicated, put it inside the dialogue/story UI, for example “Paca bilang…”, not as a floating label below the character.

## 3.3 Characters inside Completion

Characters may appear in Completion, but:

- the full intended silhouette must remain visible;
- characters must not overlap action controls;
- characters must not cover praise/stars/status copy;
- use adequate internal safe margins;
- do not show name labels underneath;
- use the canonical character resolver/presentation policy rather than hard-coding one pair everywhere.

The approved mockup uses Gavi/Paca only as a visual example. It does not mean every game must always display Gavi/Paca.

# 4. Canonical Share Experience — LOCKED

## 4.1 Invocation

Normal flow:

game/activity complete  
→ Canonical Completion popup  
→ user presses Share  
→ Canonical Share modal opens above Completion.

The Completion popup may stay visible behind Share in a dimmed/de-emphasized state.

Closing Share returns to the same Completion state.

Do not turn Share into a separate page without a future explicit product decision.

## 4.2 Canonical hierarchy

Preserve this structure:

1. compact share/link visual;
2. Bagikan pencapaian;
3. short privacy-safe description;
4. Link untuk dibagikan;
5. clean URL/copy field;
6. Bagikan ke;
7. social/share choices;
8. Copy Link and Share Device.

The old plain stacked-button share dialog should be retired from child completion surfaces after migration.

## 4.3 Approved destinations

The approved concept shows:

- WhatsApp;
- Telegram;
- X;
- Facebook;
- Copy Link;
- Share Device.

Do not casually turn this into a large social-media directory. If a capability is unsupported in a browser/runtime, handle it gracefully without creating a different visual system.

## 4.4 Privacy boundary

The Share UI should communicate that the shared payload is general/public-safe.

Do not expose in a share payload:

- full child name;
- age;
- family/account identifiers;
- private profile information;
- detailed learning evidence;
- mastery internals;
- sensitive activity history.

Sharing is a presentation/distribution feature, not an academic-evidence export.

## 4.5 Background is explicitly NOT canonical

As with Completion, the environment shown behind the approved Share mockup is only review context.

The actual runtime keeps the current game/activity background. Only the Share modal is locked.

# 5. Cross-surface consistency rule — LOCKED

Belajar, Bermain, and World are allowed to have distinct atmosphere/backgrounds and mechanics.

They must share:

- canonical Completion component;
- final action hierarchy;
- canonical Share modal;
- button language;
- radius/elevation language;
- celebration hierarchy;
- character safe-area behavior;
- no-crop character rule;
- no-name-label character rule.

They may vary:

- background artwork behind the popup;
- gameplay mechanics;
- activity scene;
- World environment;
- context-specific completion copy;
- which approved characters are shown.

Principle:

**Different worlds, one Mainlagi interaction language.**

# 6. World visual debt already accepted for correction

A later dedicated World pass must address:

1. character clipping in World header/scene presentation;
2. obsolete/wrong-concept background illustration still used by the current World overview/header;
3. weak journey-map visual quality;
4. overly mechanical/empty path-node composition;
5. weak chapter/stage hierarchy;
6. inconsistent completed/current/locked/progress presentation;
7. visual redesign without changing World learning/evidence/progression semantics.

No final World redesign visual is approved by this document yet.

World redesign comes after the shared completion/character/share foundation.

# 7. Locked execution priority

## Priority 1 — shared system

1. Canonical Completion System.
2. Character clipping and safe-area correction.
3. Remove character-name labels.
4. Canonical Share Experience.
5. Migrate Belajar/Bermain/World final completion onto the same system.

Completion and Share should be implemented as one connected shared-component wave.

## Priority 2 — World presentation

6. Redesign World header/hero.
7. Redesign World journey map.

## Priority 3 — residual consistency

8. Audit remaining route-specific visual drift.
9. Fix verified inconsistencies without reopening unrelated product logic.

# 8. Implementation boundaries

This work must not silently alter:

- curriculum/content truth;
- learning-attempt semantics;
- evidence/mastery rules;
- stage progression;
- reward meaning;
- Motion Engine mechanics;
- existing game mechanics;
- World evidence semantics;
- database schema without a separately justified need;
- Shop commerce behavior;
- Midtrans/Biteship behavior;
- child privacy boundaries.

Visual unification must not become a backend/product-logic rewrite.

# 9. Non-negotiable approval rule

Future agents must not:

- materially redesign the approved Completion popup;
- materially redesign the approved Share popup;
- move/reorder canonical actions without approval;
- restore separate completion styles for Belajar vs Bermain vs World;
- restore character names under characters;
- knowingly allow character clipping;
- treat the mockup background as a universal runtime background;
- regenerate the approved popup concept and declare the new generation canonical;
- substitute a new design merely because it seems cleaner or more modern.

Minor responsive adaptation is allowed only when required to make the same approved component work safely on smaller screens.

The goal is **implementation fidelity, not repeated redesign**.

# 10. Responsive intent

The same hierarchy must survive mobile.

Responsive adaptation may:

- stack actions only when viewport constraints truly require it;
- reduce decorative confetti;
- reduce character size while preserving the complete silhouette;
- reduce modal width/padding proportionally;
- use native Share Device capability where available.

Responsive adaptation must not:

- remove praise/stars;
- reorder primary actions;
- remove Share;
- crop characters;
- turn the popup into a materially different mobile design.

# 11. Acceptance contract

Migration is acceptable only when:

- every completed playable experience reaches the shared Completion component;
- final completion is visually consistent across Belajar, Bermain, and World;
- Back | Again | Next plus Share are present in the canonical hierarchy;
- Share opens the canonical Share modal;
- Share modal follows the approved visual structure;
- characters are not clipped;
- character labels underneath are gone;
- the actual game/activity background remains behind the popup;
- closing Share returns to Completion;
- no horizontal overflow;
- no new page/console errors;
- learning/game/World semantics remain unchanged;
- compact-phone and desktop screenshots are manually reviewed against the approved popup references.

# 12. Relationship to the post-Shop handoff

This spec belongs to the deferred post-Shop child-surface workstream.

Sequencing/integration remains controlled by:

docs/MAINLAGI_POST_SHOP_CHILD_SURFACE_HANDOFF_2026-09-27.md

After Shop is fully closed and merged, the next agent must read that handoff and this visual spec together before resuming child-surface work.

The post-Shop handoff controls branch/release sequencing.  
This document controls visual/product fidelity.

## Final owner-approved summary

Completion: ONE canonical popup across all games.  
Actions: Back | Again | Next, with Share underneath.  
Share: ONE canonical modal opened from Completion.  
Characters: no unintended crop and no name labels underneath.  
Belajar/Bermain/World: different game/background context is allowed; shared interaction components must look like one product.  
Approved popup concepts: LOCKED. Do not redesign without explicit owner approval.  
Background shown behind popup mockups: NOT LOCKED. Use the actual background of each game/activity.  
World header/map: known visual debt; redesign after the shared completion/character/share system is stabilized.
