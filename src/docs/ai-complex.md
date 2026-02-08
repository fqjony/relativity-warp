---
title: AI and Complex Problems
description: A practical view on why complexity breaks AI, and how to de-risk multi-step engineering.
type: research
---

# AI and Complex Problems

## A Practical View

AI is strongest when a task is narrow, clean, and bounded. Complex problems are the opposite. They are uncertain, incomplete, and full of hidden constraints. The mismatch creates output that looks confident but drifts from reality.

## Why complexity breaks the model

Complexity introduces three failure modes:

- **Hidden constraints.** The model has to guess what it cannot see.
- **Ambiguous priorities.** It cannot decide which trade-offs matter most.
- **Unbounded scope.** A single request becomes a chain of assumptions.

## The illusion of completeness

Large outputs feel complete because they are fluent. But without explicit inputs, outputs, and verification steps, the result is fragile. It compiles or reads well, yet fails when connected to real systems.

## Practical countermeasures

1. **Make the problem smaller.** Turn it into steps with single responsibilities.
2. **Declare context.** Provide constraints, paths, dependencies, and tools.
3. **Add verification.** Define what “correct” means before execution.
4. **Capture outputs.** Every step must write to a known artifact.

## The rule of thumb

If the task cannot be explained as a sequence of verifiable steps, it is not ready for automation. Complexity demands structure, not more prompting.
