# VUI-03 Public/Auth/Account Closure — 2026-09-17

Status: **FULLY CLOSED / LIVE VERIFIED**

## Scope

VUI-03 converged the clean-session public root, account and family auth journey onto the Mainlagi Art Bible while preserving existing product/auth behavior.

Changed product surfaces:
- `/`
- `/account`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/auth/callback`

Permanent visual baseline remains 14 canonical routes x 3 canonical viewports = 42 captures.

## Functional contracts preserved

VUI-03 did **not** change:
- `readActiveChild()` / `childDestination()` known-child fast resume semantics;
- Supabase sign-in/sign-up/reset operations;
- auth validation rules;
- recovery/callback verification semantics;
- session behavior;
- auth redirects/messages;
- account signed-in/signed-out behavior or destination routes;
- learning/mastery/evidence/progression/readiness;
- curriculum/activity content;
- schema/database contracts.

## Accepted visual/product outcome

Public root:
- clean session is a family/public entry rather than child `PlayroomShell`;
- child and parent paths are separate and explicit;
- product age context is clear;
- movement-camera play is described as optional without unsupported privacy/security claims;
- subject discovery remains available.

Auth:
- login/signup/forgot/reset/callback share one scoped family shell;
- auth routes own the viewport, preventing duplicate public + auth shells;
- desktop uses contextual Garden/family composition instead of a tiny isolated utility card;
- narrower layouts stack cleanly;
- controls retain visible focus states and >=44px target height.

Account:
- `/account` no longer depends on its legacy global presentation cluster;
- phone remains stacked;
- tablet/desktop use readable two-column family settings cards;
- destructive action remains visually restrained.

## Permanent VQA additions

The existing permanent browser matrix additionally blocks regressions in:
- clean root family marker;
- exactly one child CTA and one parent CTA;
- optional-camera copy;
- >=44px public family CTA target height;
- auth family shell/context/panel markers;
- expected login/signup/forgot form mode;
- >=44px auth controls;
- callback error state inside the family shell;
- account family/settings markers;
- seven canonical account settings links;
- readable account card geometry at tablet/desktop.

Existing exact-path, status, overflow, framework-overlay, page-error and browser-console assertions remain blocking.

## Evidence chain

```text
baseline before wave:          ea32df85cab33e8510a086ae2af1a1bcadd870b3
PR:                            #160
accepted implementation head: 96de380796cdcb16cd10f390805f4c7b62f9b83b
implementation CI:             #771 / run 35122985995 — full success
artifact id:                   10458188042
artifact digest:               sha256:c554eca3a218c659b97c07f6bfb6521b00fea7f28c6b9de18ac1a799ea3fcdbb
captures:                      42 / 42
manifest path/status mismatch: 0
final PR head:                 d6569864e0149816abea5bff65cbc2a948b4f58b
final PR CI:                   #775 / run 35124156787 — full success
squash merge:                  415008a4a0503da98937ee8df0a1e5feb1a08c62
independent main CI:           #776 / run 35124809180 — full success
exact Cloudflare release:      success
```

Cloudflare verification step:

```text
Wait for exact Cloudflare release and smoke public endpoints — SUCCESS
```

## Manual visual acceptance

Reviewed at actual screenshot scale:
- 390x844
- 768x1024
- 1280x800

Accepted representative surfaces:
- public root;
- account;
- login;
- signup;
- forgot-password;
- auth callback error state.

`/reset-password` shares the same accepted family shell/form styling and preserves the existing recovery/session behavior.

## Resulting baseline state

After live VUI-03 closure:

```text
P0 findings: 0
P1 findings: 1
P2 findings: 3
VBASE-P1-04 public/adult root IA: CLOSED
Pattern #38: BLOCKED until P1=0
```

The sole remaining P1 is **VBASE-P1-01 residual visual-token fragmentation**.

Initial residual evidence identifies the canonical not-found surface as a deterministic candidate because it remains on legacy `center-page`, `dialog-card` and old blue `.button--primary` styling while already being part of the permanent screenshot matrix.

Admin-only utility presentation is not automatically P1: the Art Bible explicitly permits denser/utilitarian admin styling as long as it does not leak into public/child/parent flows.

## Next gate

Execute one targeted residual-token closure wave, re-run permanent browser/manual visual QA, and only record **P0=0 / P1=0** after exact-head merge plus independent main CI and exact Cloudflare smoke.