---
title: Repository-Centric Engineering
type: concept
status: developing
created: 2026-07-05
updated: 2026-07-05
summary: Repository-centric engineering treats the repository as the primary surface for implementation truth, workflow contracts, and reusable project knowledge.
research_area: repository systems
concepts: engineering-memory, operational-truth, workflow-contracts, agentic-engineering-workflows
related: engineering-memory, operational-truth, knowledge-promotion
depends_on: operational-truth
supports: engineering-memory
contradicts:
evidence: 2026-05-18-repo-centric-workflows, 2026-05-25-repositories-as-operational-execution-surfaces, 2026-05-19-real-repos-as-context-probes
references:
confidence: medium
maturity: early
---

# Repository-Centric Engineering

## Definition

Repository-centric engineering treats the repository as the primary surface for implementation truth, workflow contracts, and reusable project knowledge.

## Working Claim

The repository is not only where code lives. It is where an engineering system can preserve the contracts that make future work safer: setup, tests, architecture, release paths, operating boundaries, and local conventions.

## Use

Use this concept when deciding whether a lesson should become repo documentation, automation, tests, templates, or agent guidance.

## Boundary

The repository should not absorb every operational fact. Runtime evidence, credentials, incidents, and deployment state still belong to their owning systems.
