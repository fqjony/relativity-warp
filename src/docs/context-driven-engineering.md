---
title: Context-Driven Engineering
description: Why AI breaks on real engineering work, and how to make it reliable using workflows, context, and verification.
type: research
labels: ai, engineering, software, repo-centric
---

# Context-Driven Engineering

## Research signal

AI output degrades as constraints become implicit. The fix is not “better prompts,” but a deterministic context surface that the system can verify.

## Observations

- Real engineering work has hidden rules (ownership, environments, safety gates).
- Models improvise when context is absent, creating drift.
- Repeatability requires explicit inputs and outputs per step.

## Working hypothesis

If the repo exposes deterministic context (structure, manifests, execution rules), the same prompt yields consistent results.

## Constraints that matter

- Source and build boundaries.
- Execution permissions.
- Output paths.
- Verification steps.

## Flow (placeholder)

1. Detect repo contract.
2. Resolve context artifacts.
3. Generate bounded steps.
4. Verify outputs.
5. Persist results.

## Next probes

- Compare output consistency with and without explicit context manifests.
- Measure regression rate when verification gates are missing.
