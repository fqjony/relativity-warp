---
title: AI and Complex Problems
description: A practical view on why complexity breaks AI, and how to de-risk multi-step engineering.
type: article
labels: ai, engineering, software, automation
---

# AI and Complex Problems

## Why complexity breaks AI

Complex problems are incomplete by definition. They contain hidden constraints, competing goals, and unknown dependencies. A single prompt cannot carry this load without distortion. AI output becomes fluent but fragile.

## The failure modes

1. **Hidden constraints.** The model guesses what it cannot see.
2. **Ambiguous priorities.** The output optimizes the wrong dimension.
3. **Unbounded scope.** A single answer tries to solve multiple systems at once.
4. **Non-verifiable output.** The result looks complete but cannot be tested.

## What actually works

- Break problems into bounded steps.
- Declare inputs, outputs, and tools per step.
- Verify after each step.
- Persist artifacts and diffs.

## Engineering mindset

Treat AI like a junior collaborator: it can draft, but it cannot own architecture without constraints. The real win is not speed — it is controlled reliability.

## Flow (placeholder)

1. Define constraints.
2. Split into steps.
3. Generate artifacts.
4. Verify outputs.
5. Integrate safely.

## References

- 12 Factor App
- TDD
- Repo-centric workflows
