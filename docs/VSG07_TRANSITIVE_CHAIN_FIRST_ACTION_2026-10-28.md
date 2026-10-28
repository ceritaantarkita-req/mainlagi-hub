# VSG-07 — Transitive Chain child-first instruction

**Date:** 28 October 2026
**Base:** main@26fac525791768e4572ea887cb55411027c7c5ad (Set Reasoning #540).
**Status:** Review branch; no live claim.

## What changed

Transitive Chain previously had a generic Garden activity title, a second heading, a long instruction paragraph, a third question panel, plus a repeated idle-status instruction.

The canonical `config.questionLabel` is now the **single prominent first question** (for the representative activity: "Siapa paling tinggi?"). This preserves the correct question for all variants, including shortest, dots, weight and middle order; never replace their intended question with a generic instruction.

The previous generic instruction "Baca dua hubungan berurutan, lalu tarik kesimpulan yang benar." is now available from accessible **Cara main (?)**. All three nodes and both premise relations remain visible. The exact answer set, relations, correctness, narration, attempt evidence and completion semantics are untouched. Wrong answer gives one brief retry message; canonical success explanation is retained screen-reader-accessibly behind concise three-star completion.

The mobile chain is compressed via **scoped CSS only**. It remains a sequential chain, not a generic three-choice grid.

## QA and release gates

- [ ] Exact-head seven required CI jobs PASS. Cloudflare PR smoke conditional/skipped is not a production proof.
- [ ] Original `vsg07-transitive-chain-screenshots` 20 PNGs (320/390/430/768/1280 × idle/help/try/success) reviewed for overlap, clipped labels, readable premises and first question.
- [ ] Chromium checks keyboard wrong-state/retry, three choices, three nodes/two premises, assessment accuracy 0.5, `premiseCount:2`, one true completion, Again without duplicate attempt, and preserved canonical explanation.
- [ ] Merge only after gates, then verify live deployed commit separately. Real iPhone Safari remains a manual acceptance requirement.

## Invariant boundaries

Do not touch `transitiveChainConfig`, any of five variations, answer IDs, source `activity.prompt`, scoring/mastery, 47 active patterns/900 content, Stage locks, World, Shop, Motion Engine or DB.

Subsequent work: Relative Order Track's 320px `.promptCard {display:none}` is source-confirmed. Address it **in a separate wave**, after VSG-07 acceptance.
