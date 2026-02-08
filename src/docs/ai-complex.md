---
title: AI and Complex Problems
description: Why complexity breaks AI output and how to engineer reliable multi-step work.
type: article
labels: ai, engineering, software, automation
---

# AI and Complex Problems

Complex engineering work is a chain of hidden constraints. AI does well with visible context, but it collapses when constraints are implicit. The answer looks fluent while the system underneath is wrong.

## What actually breaks

1. **Hidden constraints**: ownership rules, security boundaries, environments, or tooling are missing.
2. **Ambiguous priorities**: speed vs safety, correctness vs scope, are not declared.
3. **Unbounded scope**: the model tries to solve the entire system in one response.
4. **Non-verifiable output**: the result is not tied to checks, so drift is invisible.

## Engineering fixes

- Break work into bounded steps with explicit inputs and outputs.
- Require a verifiable artifact per step (diff, file, report, build output).
- Insert verification gates between steps.
- Persist artifacts so outputs are replayable and inspectable.

## Concrete pattern

1. **Define constraints**: list source roots, outputs, and forbidden paths.
2. **Split**: create 3–7 steps that each produce one artifact.
3. **Generate**: run the step with explicit context only.
4. **Verify**: check output with tests, lint, or deterministic validation.
5. **Integrate**: merge only after verification passes.

## Why this works

AI can draft. It cannot infer missing structure. When you make structure explicit, the model becomes predictable and safer. The key is not “better prompts” but **better boundaries**.

## Flow (placeholder)

- Constraints → Step plan → Artifact → Verify → Merge

## References

- 12 Factor App
- TDD (test-first verification)
- Repo-centric workflows
