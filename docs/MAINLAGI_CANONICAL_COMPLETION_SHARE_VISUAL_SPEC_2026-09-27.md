# Mainlagi — Canonical Completion, Share, Character & World Visual Direction

Date: 27 September 2026  
Status: **OWNER-APPROVED / VISUAL DIRECTION LOCKED**

This is the canonical visual/product contract for the shared child-facing Completion system, Share experience, Character Presentation, responsive orientation behavior, migration/QA rules, and the next World visual cleanup direction.

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

# 6. Journey-map successor dependency

The World visual debt listed during the original Completion/Share review has since
been promoted into a separate owner-approved **Canonical Journey Map System**.

Current source of truth:

`MAINLAGI_CANONICAL_JOURNEY_MAP_SYSTEM_2026-09-27.md`

That later wave now owns:

1. the full-page Belajar Learning Journey Map across all nine subjects;
2. the immersive map/game header;
3. one node = one stage/cluster/checkpoint, not one mini-game;
4. stage-open contextual detail without mini-game thumbnail grids;
5. true portrait and landscape map compositions;
6. Mainlagi-specific illustration-language requirements;
7. Petualangan Uang World map redesign with eight authored stages;
8. removal of obsolete/wrong-concept World header/map presentation;
9. World map character safe-area use without changing evidence/progression/story truth.

This Completion/Share document does **not** own the map UI. It remains a required
shared dependency consumed by that later Journey Map wave.

# 7. Locked execution priority

## Priority 1 — shared system

1. Canonical Completion System.
2. Character clipping and safe-area correction.
3. Remove character-name labels.
4. Canonical Share Experience.
5. Migrate Belajar/Bermain/World final completion onto the same system.

Completion and Share should be implemented as one connected shared-component wave.

## Priority 2 — Canonical Journey Map System

6. Implement the separately specified Belajar Learning Journey Map foundation.
7. Migrate all nine Belajar subjects through bounded subject batches.
8. Redesign Petualangan Uang through the same shared journey-map language.

## Priority 3 — residual consistency

9. Audit remaining route-specific visual drift.
10. Fix verified inconsistencies without reopening unrelated product logic.

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

# 10. Canonical Responsive Orientation Policy — LOCKED

The mobile product must be **responsive to the device's current orientation**.

Canonical behavior:

```text
phone portrait
→ portrait composition

phone landscape
→ landscape composition
```

This is **one design system with two adaptive compositions**, not two different products and not a desktop layout simply scaled down.

## 10.1 Rotation changes layout, not state

A device rotation or viewport-orientation change must cause a live reflow only.

It must **not**:

- reload the route;
- restart the activity/game;
- reset an answer already entered;
- reset timer/game state;
- create a duplicate attempt merely because orientation changed;
- lose progress;
- close an open dialog;
- close Completion;
- close Share;
- change the current story segment;
- change the current World stage;
- navigate the user elsewhere.

Examples:

```text
portrait gameplay
→ rotate device
→ same gameplay state in landscape

Completion open in portrait
→ rotate device
→ same Completion remains open in landscape

Share open in landscape
→ rotate device
→ same Share modal remains open in portrait
```

Rotation is a presentation/layout event, not a product-state event.

## 10.2 Default orientation policy

Mainlagi should remain usable in both portrait and landscape unless a specific mechanic has a separately approved hard requirement.

Default policy:

- Belajar: portrait and landscape responsive;
- Bermain / Main Gerak: portrait and landscape responsive;
- World navigation/story: portrait and landscape responsive;
- Completion: portrait and landscape responsive;
- Share: portrait and landscape responsive;
- Character Presentation: portrait and landscape responsive.

A motion/camera-heavy experience may show a **non-blocking** recommendation that landscape is more comfortable, but it must not introduce a forced orientation lock without explicit separate authorization and QA.

## 10.3 Responsive composition, not proportional shrinking

Do not solve mobile by scaling the desktop layout down until it fits.

Portrait and landscape may legitimately change:

- element order;
- character position;
- dialog width;
- card proportions;
- action wrapping;
- padding;
- spacing;
- decorative density.

They must preserve:

- the same component identity;
- the same information hierarchy;
- the same actions;
- the same character state;
- the same game/activity state;
- the same completion/share state.

## 10.4 Completion orientation rules

### Portrait

Use a narrower/taller composition.

Allowed adaptations:

- reduce character scale while keeping full silhouettes;
- move characters into a dedicated safe band inside the card;
- wrap/stack action controls only when required by width;
- reduce decorative confetti density;
- tighten vertical spacing without collapsing hierarchy.

The hierarchy still remains:

```text
praise
stars
completion message/status
character celebration
Back / Again / Next
Share
```

### Landscape

Use the wider composition:

- characters may flank the central content;
- Back / Again / Next should remain one row when space allows;
- Share remains a separate action below;
- characters must not collide with copy or buttons.

The portrait and landscape versions must clearly look like the **same Completion component**.

## 10.5 Share orientation rules

### Portrait

- full-width title/description area;
- copy-link field remains readable at phone width;
- share choices may use a compact 2-column or similarly readable grid;
- Copy Link / Share Device may stack if needed;
- no horizontal scrolling.

### Landscape

- copy-link field remains above the share choices;
- share choices may use a wider multi-column row/grid;
- Copy Link / Share Device may sit side-by-side;
- modal height must remain safe for short landscape viewports.

The social-choice order and component identity remain unchanged.

## 10.6 Tablet behavior

Tablet layout should follow available geometry, not a device-name assumption.

A tablet in portrait may use a spacious portrait composition.  
A tablet in landscape may use the wider landscape composition.

Do not hard-code logic such as “tablet always desktop” or “phone always portrait.” Use viewport/aspect-ratio/container geometry appropriate to the component.

# 11. Canonical Completion Behavior — LOCKED

The visual concept is already approved. This section locks the behavior so Belajar, Bermain, and World do not merely look similar while behaving differently.

## 11.1 Trigger

The canonical Completion System appears when a playable experience reaches its real final-completion state.

It must not replace ordinary:

- correct-answer feedback;
- retry feedback;
- hint UI;
- intermediate story/dialog beats;
- mid-stage checkpoint feedback.

A route/runtime should not show a second unrelated completion card after the canonical one.

## 11.2 One shared final-completion contract

At completion, all eligible child-playable surfaces resolve into the same shared component family:

- Belajar;
- Bermain / Main Gerak;
- World activity/stage completion;
- future child-facing game surfaces.

Context can provide copy, characters, destination and status metadata, but not a separate visual system.

## 11.3 Action semantics

Canonical visual order remains:

```text
Back | Again | Next
Share
```

Behavioral meaning:

- **Back**: leave the completed playable experience for its immediate parent surface/context.
- **Again**: replay the same playable experience using the existing runtime's legitimate replay/attempt semantics.
- **Next**: continue to the next eligible/recommended item in the current context. If no next item exists, resolve to the appropriate parent/finale destination rather than leaving a dead button.
- **Share**: open the canonical Share modal without destroying Completion state.

These navigation decisions must not redefine mastery/evidence/progression.

## 11.4 Replay and persistence safety

The visual migration must not accidentally create duplicate attempts or evidence.

In particular:

- orientation change does not create a new attempt;
- opening/closing Share does not create a new attempt;
- opening/closing Completion does not create a new attempt;
- `Again` follows the existing runtime's intentional replay semantics;
- re-rendering the popup must not replay completion writes.

## 11.5 Stars and reward meaning

The approved Completion visual uses a three-star celebration.

Treat the visual stars as the approved completion/celebration language unless an existing runtime already binds stars to a real reward/score value.

Do **not** change stored reward, score, mastery or evidence semantics merely to match the popup artwork.

If a runtime has genuine star/reward data, bind presentation to that existing contract rather than inventing a new academic meaning.

## 11.6 Close behavior

If the approved close/X control is present:

- it must not discard a completed result;
- it must not erase state;
- it should resolve safely to the appropriate parent/previous completion context;
- it must not become a shortcut around required persistence.

# 12. Canonical Character Placement Matrix — LOCKED

The visual target is not “put the character somewhere that looks okay.” It is a bounded placement system.

## 12.1 Shared rules

For every context and orientation:

- preserve the full intended silhouette;
- keep safe padding from viewport/card edges;
- no floating character-name label underneath;
- no overlap with primary interaction targets;
- no overlap with essential copy;
- no overlap with Completion/Share action controls;
- scale down before cropping;
- reduce character count before cropping;
- if two characters cannot fit safely, show the contextually primary character rather than forcing both.

## 12.2 Story / Dialog

### Portrait

Preferred composition:

```text
dialog/story card
        ↓
character in lower safe area
```

or a narrow side-by-side composition when there is enough width.

Keep the character fully visible. Speaker identity, when needed, belongs **inside** the dialog card.

### Landscape

Preferred composition:

```text
character | dialog/story card
```

The dialog may occupy the larger side of the screen. The character retains a dedicated padded zone.

## 12.3 Activity Helper

### Portrait

- primary interaction stays central/top;
- helper character occupies a lower safe zone or side safe zone;
- a second character is allowed only if both remain fully visible and do not reduce interaction readability.

### Landscape

- helper characters may occupy left/right lower corners or side bands;
- central gameplay remains unobstructed;
- edge padding protects ears/antennae/hands/tails from clipping.

## 12.4 Completion

### Portrait

- one or two characters may sit in a dedicated celebration band;
- characters may become smaller;
- action area remains a separate safe zone below;
- characters never overlap Back/Again/Next/Share.

### Landscape

- one or two characters may flank the central praise/stars/status area;
- maintain balanced whitespace;
- full silhouettes remain inside the popup.

## 12.5 World Story

### Portrait

- story/dialog card takes the readable upper or central area;
- one primary character sits below or beside it in a safe zone;
- never crop the character to preserve more background art.

### Landscape

- character and dialog may sit side-by-side;
- World environment remains visible as atmosphere, not at the expense of character/dialog readability.

## 12.6 Character identity

The character used is context-driven.

The approved samples showing Gavi/Paca do not authorize hard-coding Gavi/Paca into every route.

Use the existing canonical character resolver/state system and authored cast rules.

# 13. Canonical Share Behavior — LOCKED

The visual design is already approved. This section locks behavior and safety.

## 13.1 Open/close state

Opening Share:

- keeps the completed activity state intact;
- keeps Completion underneath;
- adds the canonical Share modal above it;
- must not navigate away merely to render the modal.

Closing Share:

- returns to the exact same Completion state;
- preserves the same stars, copy, characters and available actions.

## 13.2 Share destination safety

A child completion page must never expose a private authenticated child route as a public share target.

The share resolver must use a public-safe URL/landing contract.

If a safe public target cannot be produced, fail closed or disable that action rather than leaking:

- child route identifiers;
- private profile data;
- account/session data;
- detailed evidence/mastery data.

## 13.3 Provider behavior

The canonical visual choices remain:

- WhatsApp;
- Telegram;
- X;
- Facebook;
- Copy Link;
- Share Device.

Implementation may use platform-specific share URLs and the device Web Share API where supported.

If a capability is unavailable:

- fail gracefully;
- keep the modal visually consistent;
- do not replace the whole modal with a browser-native-looking alternative.

## 13.4 Copy feedback

Copy Link may show a small temporary success state such as `Tersalin`.

That feedback should not materially redesign/reflow the modal.

# 14. Coverage and Migration Plan — REQUIRED BEFORE BROAD REPLACEMENT

Do not blindly replace completion code route by route.

First produce a coverage matrix that identifies, for each surface/runtime family:

- current final-completion implementation;
- whether final completion exists;
- whether Share exists;
- current character placement behavior;
- current portrait behavior;
- current landscape behavior;
- target shared component;
- representative QA route.

At minimum cover:

### Belajar runtime families

- tap choice / choice-grid families;
- listen-and-choose/listening;
- matching;
- tracing;
- story;
- motion-game integration;
- coloring;
- drawing;
- other active shared runtime patterns that terminate through a distinct final state.

The goal is shared runtime integration, not manually editing 900 activities one by one when a common runtime can provide coverage safely.

### Bermain / Main Gerak

Audit all 10 existing game experiences.

### World

Audit:

- story/dialog segments;
- mini-game/activity segments;
- stage completion;
- chapter/finale completion;
- Share flow.

The coverage artifact must distinguish:

```text
shared runtime fixed once
vs
route-specific exception that genuinely needs separate handling
```

Do not treat historical duplicated UI as justification to keep multiple completion systems.

# 15. QA and Acceptance Matrix — LOCKED

The shared system is not complete until portrait, landscape and orientation transitions are verified.

## 15.1 Required viewport classes

At minimum verify:

- compact phone portrait: around 320 × 568;
- standard phone portrait: around 390 × 844;
- compact phone landscape: around 568 × 320;
- standard phone landscape: around 844 × 390;
- tablet portrait: around 768 × 1024;
- tablet landscape: around 1024 × 768;
- desktop: at least around 1280 px wide.

Exact browser chrome may vary; the intent is to test both geometry and short-height landscape stress cases.

## 15.2 Required orientation-transition tests

Rotate/change viewport while each of these is active:

1. gameplay before answer;
2. gameplay after partial interaction;
3. story/dialog open;
4. retry/correct feedback visible;
5. Completion open;
6. Share open;
7. World story segment;
8. motion/game state where applicable.

For each transition assert:

- same route/context;
- same answer/game state;
- same timer state where applicable;
- same story segment;
- same Completion state;
- same Share state;
- no duplicate attempt/evidence write;
- no horizontal overflow;
- no unintended character crop;
- no console/page error.

## 15.3 Character visual assertions

Representative browser QA should verify bounding/safe-area behavior, not only take screenshots.

For every canonical character presentation context:

- full intended image bounds stay within its safe container;
- no name label exists underneath;
- essential UI does not overlap the character;
- orientation change does not push character outside bounds.

Manual screenshot review remains required because numeric containment alone cannot prove good composition.

## 15.4 Completion assertions

Verify:

- one canonical final Completion;
- praise + stars + short completion copy present;
- Back/Again/Next order correct;
- Share separate below;
- no route-specific alternate completion card appears afterward;
- same component identity in portrait and landscape.

## 15.5 Share assertions

Verify:

- Share opens from Completion;
- closing returns to same Completion;
- safe public URL contract;
- no child-private route/data in share payload;
- Copy Link works;
- provider actions are capability-safe;
- portrait and landscape layouts preserve hierarchy.

# 16. Journey Map System — NEXT AFTER SHARED SYSTEM

After the shared Completion/Character/Share foundation is merged and
production-verified, the next major visual/product wave is the owner-approved
**Canonical Journey Map System**.

It now covers both:

- Belajar subject Learning Journey Maps across all nine subjects; and
- the Petualangan Uang World Adventure Journey Map.

Canonical journey-map source of truth:

`MAINLAGI_CANONICAL_JOURNEY_MAP_SYSTEM_2026-09-27.md`

Do not implement map/header behavior from this Completion/Share document. The
dedicated journey-map spec owns:

- full-page immersive map composition;
- one node = one stage/cluster;
- stage-open contextual detail;
- no mini-game thumbnail grid;
- immersive map/game header;
- Mainlagi illustration-language requirements;
- portrait/landscape map composition;
- Belajar vs World differentiation;
- Petualangan Uang map redesign boundaries.

Completion/Share/Character rules from this document remain shared dependencies
consumed by the later map wave.

# 17. Post-Shop Execution Sequence — LOCKED

This work belongs after Shop release closure.

Recommended bounded sequence:

```text
A. Finish Shop
   ↓
B. Merge + production-verify Shop
   ↓
C. Synchronize and finish PR #360
   (navbar / page atmospheres / canonical card grids)
   ↓
D. Merge + production-verify PR #360
   ↓
E. Start a fresh shared-interaction wave
   - responsive orientation foundation
   - canonical Completion
   - canonical Character Presentation
   - canonical Share
   - coverage migration
   - portrait/landscape QA
   ↓
F. Merge + production-verify shared-interaction wave
   ↓
G. Start Canonical Journey Map System
   - nine Belajar subject worlds
   - Petualangan Uang World map
```

Do not silently expand PR #360 into the entire Completion/Share/World redesign. Keeping the shared-interaction migration and World redesign bounded reduces regression risk and makes QA evidence attributable.

# 18. Non-negotiable approval rule

Future agents must not:

- materially redesign the approved Completion popup;
- materially redesign the approved Share popup;
- move/reorder canonical actions without approval;
- restore separate completion styles for Belajar vs Bermain vs World;
- restore character names under characters;
- knowingly allow character clipping;
- treat the mockup background as a universal runtime background;
- regenerate the approved popup concept and declare the new generation canonical;
- force one mobile orientation globally merely because one mockup looks better there;
- reset/reload activity state on orientation change;
- expand the shared-system wave into the Journey Map System before the shared-interaction wave is independently closed;
- substitute a new design merely because it seems cleaner or more modern.

Minor responsive adaptation is allowed only when it preserves the same approved component/system identity.

The goal is **implementation fidelity, not repeated redesign**.

# 19. Final Acceptance Contract

The shared-system migration is acceptable only when:

- every completed playable experience reaches the canonical Completion component;
- final Completion is visually consistent across Belajar, Bermain, and World;
- Back | Again | Next plus Share are present in the canonical hierarchy;
- Share opens the canonical Share modal;
- Share follows the approved visual structure;
- characters are not clipped;
- character labels underneath are gone;
- portrait and landscape both work responsively;
- rotating does not reset state or close active UI;
- the actual game/activity background remains behind the popup;
- no horizontal overflow;
- no new page/console errors;
- learning/game/World semantics remain unchanged;
- compact-phone, phone-landscape, tablet portrait/landscape and desktop screenshots are manually reviewed.

# 20. Relationship to the Post-Shop Handoff

This spec belongs to the deferred post-Shop child-surface workstream.

Sequencing/integration remains controlled by:

`docs/MAINLAGI_POST_SHOP_CHILD_SURFACE_HANDOFF_2026-09-27.md`

After Shop is fully closed and merged, the next agent must read that handoff and this visual spec together before resuming child-surface work.

The post-Shop handoff controls branch/release sequencing.  
This document controls visual, behavior and responsive fidelity.

## Final owner-approved summary

```text
Completion:
ONE canonical popup across all games.

Actions:
Back | Again | Next
Share underneath.

Share:
ONE canonical modal opened from Completion.

Characters:
No unintended crop.
No name labels underneath.
Safe-area placement is canonical.

Mobile:
Responsive to current orientation.
Portrait device → portrait composition.
Landscape device → landscape composition.
Rotation changes layout only, never state.

Belajar / Bermain / World:
Different game/background context is allowed.
Shared interaction components must look and behave like one product.

Approved Completion + Share concepts:
LOCKED.
Do not redesign without explicit owner approval.

Background shown behind popup mockups:
NOT LOCKED.
Use the actual background of each game/activity.

Execution:
Shop → PR #360 → shared interaction system → Canonical Journey Map System.

Journey Map:
Owner-approved concept is now locked in
MAINLAGI_CANONICAL_JOURNEY_MAP_SYSTEM_2026-09-27.md.
Do not redesign from scratch; implement against that dedicated contract.
```
