# Random Content Engine

The system does not depend on a finite list of questions. It creates challenges procedurally from rules and grade constraints.

## Mathematics

- Addition starts from a valid answer and splits it into two operands.
- Subtraction chooses the larger operand first, preventing negative answers.
- Multiplication uses factors 1–10.
- Division chooses result and divisor first, then calculates dividend, guaranteeing an integer result.

## Pattern Race

A starting number, signed step, sequence length, and grade maximum are generated. The start is constrained so the next answer remains inside the allowed range.

## Deduplication

`ChallengeDeck` stores recent signatures and avoids repeating equivalent challenges in the configured history window. Each challenge also receives a unique seeded ID.

## Reproducibility

The Mulberry-style seeded random source allows simulations and bug reports to reproduce the same sequence.

## Automated stress coverage

The QA suite validates:

- 25,000 Kindergarten math questions;
- 25,000 Grade 1 math questions;
- 25,000 Grade 2 math questions;
- 30,000 pattern questions across the three levels.
