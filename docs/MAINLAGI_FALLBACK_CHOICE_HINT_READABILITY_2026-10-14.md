# Mainlagi Belajar — fallback ChoiceActivity hint readability (14 October 2026)

## Scope and source-backed problem
PR #494 put legible cream backing behind `GardenActivityFrame.hint` and standard illustrated Garden headings. PR #495 removed copy-length-dependent `spacious` from fallback `tap_choice` and was merged/live verified as `main@748c2a4a2324e3707f60be50734b6dffd1444081`.

Source audit finds a leftover distinct text surface: `ChoiceActivity` renders its own `<p className={styles.playHint}>` with “Tap your answer!” (English) or “Sentuh pilihanmu.”. This does **not** receive `GardenActivityFrame.hint` styling. Previously its desktop CSS was `margin:70px auto 0` with transparent background over the subject artwork. That makes the advice less readable and unnecessarily far below the cards even though game answers and audio work.

## Minimal implementation
- Modify only the CSS class `.playHint` used by fallback `ChoiceActivity`; add near-opaque cream background, dark ink, balanced 8px/16px padding, and cap vertical gap to 28px desktop / 18px mobile.
- Add `data-belajar-choice-hint` marker for a stable visual-test target; no spoken prompt or gameplay content changes.
- Extend PR #495's existing `assertTapChoiceGeometry` for both `english-find-blue` (English) and `science-living-cat` (Indonesian) at 320px, 430px, and 1440px. Verify exact answer-free localized hint, paper color/opacity, readable text size, <=62px answer-to-hint separation, no viewport clipping or horizontal overflow.
- Use the same CSS class for English and Indonesian `ChoiceActivity` fallback. Do **not** claim testing all 900 activities or authoring variants.

## Safety
No changes to scoring, attempt logging, completion/share, audio/narration, correctness hints, canonical progression, Shop, Supabase, World, Motion Engine, or illustration assets. Purpose-built specialty runtimes remain untouched.

## Release requirements
- PR 7/7 required gates including mobile Chromium, Ubuntu/Windows, production build, Shop PG staging, security and dependency checks.
- Merge only exact successful head.
- Cloudflare Workers Build + exact SHA production smoke for post-merge main.
- Physical iPhone Safari/desktop owner review and additional cross-runtime legibility audit remain pending; prior Issue #486 was already closed and is not automatically an acceptance sign-off for new reports.
