# VSG-06 — Set Reasoning first question remains visible at 320px

**Checkpoint:** 27 October 2026.  
**Base:** `main@34a48134be280c8868c50711aca3362df7f6fd53`.  
**Status:** Review-only branch; VSG-05 #537 is still a separate unmerged Draft due to pending manual screenshot inspection.

## Confirmed source issue

The old `@media (max-width: 340px)` contained `.promptCard { display:none }`, completely removing the main question on 320px screens. The same initial scene had a duplicated large Garden title, a task heading, an explanatory paragraph, and an idle instruction panel. At the same time, **two canonical membership rules, operation, target, and answers are problem data and must remain visible**, not get hidden in Help.

## Changes (visual only)

- Keep one prominent, actionable **“Mana yang cocok?”** question visible even on 320px. Consume the existing child visual hierarchy and child-scoped semantic question size.
- Use `Cara main (?)` for the exact original supplementary explanation, preserving narration `activity.prompt` and `config.rules`.
- Retain both `in/out` membership cards, `config.operationLabel`, `config.targetLabel`, the three original choices and precise `choiceLabels` for **all ten known Set Reasoning configurations**.
- No initial extra status; wrong feedback is **“Belum tepat. Coba lagi!”**. Canonical success reasoning remains available for accessibility with compact three-star completion.
- On 320px: retain prompt card, 44px help button, 72px answer targets. No global CSS overrides.

## Validation

- `scripts/run-set-reasoning-browser-tests.mjs`: five viewport widths 320/390/430/768/1280, exactly one visible main question, optional Help, two rules and operation, three answer choices, keyboard wrong state, correct attempt and `ruleCount:2` metadata, completion, replay.
- `scripts/run-set-reasoning-reuse-browser-tests.mjs`: earlier-stage reused configuration retains the exact membership, labels and measured evidence with touch/keyboard.
- CI publishes **20 original screenshots** in `vsg06-set-reasoning-screenshots` for idle/help/try/success at each viewport.
- Required QA before merge: all seven GitHub CI jobs PASS at the exact head; screenshot review including short 320px landscape not covered by standard CI; no horizontal clipping, complete source rule/answer text; Cloudflare production exact deployed SHA and real Safari touch verification are separate.

No edits to scoring, mastery, stage locks, activity catalog, World, Motion Engine, Shop, security, DB or any other gameplay family. VSG-05 #537 remains separately isolated, and do not merge either branch until its own release gates are satisfied.
