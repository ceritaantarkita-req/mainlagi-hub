# Mainlagi — iPhone contrast, affiliate media, and all-age World decision — 12 October 2026

Status: **IMPLEMENTED IN ISOLATED BRANCH / CI AND LIVE ACCEPTANCE PENDING**.

## Owner decision (supersedes 6–8 access gating)

The owner explicitly decided on 12 October 2026: **every child profile age can play every SHIPPED World**. The `6–8` value remains a **recommended curriculum/reading level**, not a runtime gate. No age-based runtime morphing is introduced. World categories and direct map/stage routes must agree.

Only `money-festival` is shipped today. **Eight future World cards remain locked until actually built/released**. All previous Stage/Scene/Segment IDs, completion, sequential unlock, progress persistence, and source-aware mastery/evidence boundaries remain unchanged. Playing an age-recommended activity is not proof of age-appropriate skill mastery. Do not silently broaden Supabase evidence scoring/activation.

Runtime owners:
- `src/components/learning/Batch14WorldHome.tsx` — Child Home World category points to World catalog for every age.
- `src/components/learning/world-v2/MoneyWorldExperience.tsx` — one shipped World card links to its map, map/stage gates enforce profile existence and canonical stage order but **not age**.
- `src/lib/learning/world/moneyWorldPresentation.ts` — historical age-oriented **presentation recommendation** is retained; it is no longer a playability condition.

## iPhone screenshot findings and bounded remediation

The user supplied physical iPhone browser screenshots on 12 October:
- Logic/space Garden question heading was near-invisible because dark text visually blended into the busy dark background. A high-contrast paper backing is scoped to regular themed Garden headings; the game answers are unchanged.
- In account/login pages, the navy Mainlagi wordmark blended into the dark-mode global top nav; the auth hero characters also collided visually with explanatory copy on small screens. Contrast and safe-area layout styling are adjusted without auth behavior changes.
- The Discover/Shopee product grid showed blank/broken media. `affiliate-catalog.json` has missing image data for its entries, while live Supabase may supply external `image_url` values that reject loading/hotlinking. Exact third-party image/network error is not proven from screenshots alone. Product grid and Discover list/grid now share a non-deceptive fallback when source is absent, unsafe URL type, or `img.onError` fires. The outbound affiliate `/go/[slug]` redirect, allowlist, click metrics, and credentials remain untouched.
- **Real product photography still requires owner-supplied owned/licensed or explicitly permission-cleared source assets**, not scraped Shopee images. This patch prevents broken media UI; it does not promise all missing photography is restored.

## Verification gates

- Static source contract asserts correct World live vs future-locked states, fallback usage, and visible text styling.
- Browser QA must cover demo age 5 / eligible age 7 / age 9 World catalog + direct map/stage, maintain 1 live + 8 locked, no horizontal overflow, World sequential progress unchanged.
- Existing 320/390/430/desktop responsive, route QA, visual baseline, typecheck, lint, engine, Shop PostgreSQL and production build gates must pass.
- GitHub PR-side Cloudflare smoke may be skipped. **Do not mark LIVE VERIFIED** before successful push-to-main Cloudflare build and exact-SHA `/api/health`, plus actual iPhone Safari review of contrast, product fallback, World play/navigation/audio and child progress.
- Shop affiliate thumbnails should use approved images once available; never silently use placeholders as if they were product photos.

Original Cloudflare build remediation and release SHA `42ab6c5322da924926e2a0714b671a60b5d304b0` were verified before this branch. Issue #486 still tracks user-device acceptance.
