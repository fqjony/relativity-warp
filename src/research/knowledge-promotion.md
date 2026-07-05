---
title: Knowledge Promotion
type: framework
status: developing
created: 2026-07-05
updated: 2026-07-05
summary: Knowledge promotion is the process of moving a validated lesson from temporary execution into the smallest durable layer that can reuse it.
research_area: engineering memory
concepts: engineering-memory, operational-truth, reusable-engineering-knowledge, execution-evidence
related: engineering-memory, operational-truth, repository-centric-engineering, what-makes-engineering-knowledge-reusable, can-software-engineering-become-a-cumulative-discipline
depends_on: operational-truth
supports: software-organizations-preserve-artifacts-better-than-reusable-understanding, what-makes-engineering-knowledge-reusable
contradicts:
evidence: postmortems-create-knowledge-but-rarely-create-memory, 2026-07-04-when-experience-becomes-automation, 2026-06-17-operational-truth-and-engineering-memory
references:
confidence: medium
maturity: early
---

# Knowledge Promotion

## Definition

Knowledge promotion is the process of moving a validated lesson from temporary execution into the smallest durable layer that can reuse it.

## Working Path

```text
execution evidence
  -> human judgment
  -> owning source
  -> validated reuse
  -> stronger next execution
```

## Promotion Targets

A lesson may belong in a repository doc, script, test, workflow, issue, pull request, release note, runbook, skill, model, or public research note.

The target should be chosen by ownership and reuse path, not by convenience.

## Open Questions

- What is the minimum evidence required before promotion?
- Which promotion targets should remain private, repo-owned, or public?
- How should promoted knowledge expire or get revised?
