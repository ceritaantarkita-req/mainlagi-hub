# VSG-15 — Single Rule Apply: canonical first-action question

**Date:** 2 November 2026
**Base:** `main@98058c77effc5396e969b0baf0d2deccc28272ea` after VSG-14 PR #551.
**Status:** Code review branch. NOT merged/live before exact-head QA.

## Source-backed issue

The legacy renderer stacks a Garden frame title, badge "Satu aturan", generic heading "Terapkan aturannya", the exact task prompt, essential `ruleLabel`/input/unknown target, and persistent cue in the idle status. At 320px it also reduces answer buttons to 48px and label font to 10.5px. The rule board itself is learning material, **not redundant chrome**.

## Scoped visual-only solution

- The original `activity.prompt` is the **one prominent primary question**, preserving the five distinct canonical variants (red-circle, 2 stars, small-left, directional symbol mapping, single shape transformation).
- Preserve all `config.ruleLabel`, source condition/input icon, `targetLabel`, masked target `?` (until correct answer), three canonical choice visuals/labels/ARIA. Preserve rule→input→target sequence and mobile two-row reflow. Do not reveal `correctChoice` from the new heading or help.
- Move the exact original `config.cue` behind accessible **Cara main (?)** using the existing high-contrast assistance panel. Full canonical prompt remains in `Dengar`.
- Replace idle repeated status with empty UI. Wrong state: "Belum tepat. Coba lagi!". Keep full successful reasoning in screen-reader live region and existing concise three-star completion.
- At 320px keep a readable minimum 20px first question and 72px answer buttons. Preserve glyph size and no broken-word labels. CSS is scoped to Single Rule Apply only.

## Immutable contracts

Do not edit `singleRuleApplyConfig`, all five source activity IDs or expected prompts/choice IDs, rule/output masking, correct answer, accuracy/incorrect/retry accounting, `metadata.ruleMode`/`selectedChoice`, mastery, Stage locks, 900 content entries, 47 pattern identities, World, Motion Engine, Shop, database or auth.

## QA gates

- [ ] Exact PR SHA 7/7 required CI checks PASS (Cloudflare PR smoke may be skipped).
- [ ] Representative red-circle variant: Chromium at 320/390/430/768/1280, **idle/help/wrong/success**, artifact `vsg15-single-rule-screenshots` (20 PNGs). Check initial masked target remains "?", still masked on wrong answer, one assessed attempt with 0.5 accuracy and 1 retry, correct target + concise completion and Again without duplicate attempt.
- [ ] Manually inspect original 20 screenshots especially 320px rule/condition/input/target readability, help contrast and touch targets.
- [ ] Other four canonical variants still need targeted visual sampling: representative red-circle passing does NOT prove all five variants visually approved.
- [ ] Live Cloudflare deployed-SHA and real iPhone Safari are unverified until separately tested.

Follows [Visual System tracker #501](https://github.com/ceritaantarkita-req/mainlagi-hub/issues/501).
