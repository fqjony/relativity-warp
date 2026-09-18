---
title: Operational Truth
type: concept
status: developing
created: 2026-07-05
updated: 2026-09-18
summary: Operational truth is the verifiable state of engineering reality as held by the systems that own it.
research_area: engineering memory
concepts: engineering-memory, execution-evidence, workflow-contracts
related: engineering-memory, repository-centric-engineering, knowledge-promotion, what-makes-engineering-knowledge-reusable
depends_on:
supports: engineering-memory
contradicts:
evidence: postmortems-create-knowledge-but-rarely-create-memory, 2026-06-17-operational-truth-and-engineering-memory, 2026-05-25-repositories-as-operational-execution-surfaces, 2026-09-18-changing-the-agent-without-losing-the-work
references: engineering-memory-model-v0-2
confidence: medium
maturity: early
---

# Operational Truth

## Definition

Operational truth is the verifiable state of engineering reality as held by the systems that own it.

Runtime behavior belongs to runtime systems. Implementation behavior belongs to repositories. Workflow history belongs to issues, pull requests, releases, and deployment records.

## Working Claim

Reusable understanding should point back to operational truth instead of replacing it.

When a summary becomes easier to consult than the owning source, it can quietly become a weaker source of authority. The healthier pattern is to preserve truth where it can be checked and promote only the reusable lesson.

The source also needs to be read for the authority it actually has. A test or runtime record can establish observed behavior; documentation and decision records state scope and intent; a session trace can recover a question but cannot settle the current state. The distinction keeps useful context from becoming a false source of truth.

## Use

Use this concept to evaluate whether a research object, workflow, or agent memory is grounded in a verifiable owner.
