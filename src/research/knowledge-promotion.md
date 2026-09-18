---
title: Knowledge Promotion
type: framework
status: developing
created: 2026-07-05
updated: 2026-09-18
summary: Knowledge promotion moves a validated lesson into the smallest durable layer that can reuse, revise, and receive evidence from later work.
research_area: engineering memory
concepts: engineering-memory, operational-truth, reusable-engineering-knowledge, execution-evidence
related: engineering-memory, operational-truth, repository-centric-engineering, what-makes-engineering-knowledge-reusable, can-software-engineering-become-a-cumulative-discipline
depends_on: operational-truth
supports: software-organizations-preserve-artifacts-better-than-reusable-understanding, what-makes-engineering-knowledge-reusable
contradicts:
evidence: postmortems-create-knowledge-but-rarely-create-memory, 2026-07-04-when-experience-becomes-automation, 2026-06-17-operational-truth-and-engineering-memory, 2026-09-13-a-lesson-needs-a-destination, engineering-memory-model-v0-2
references: engineering-memory-model-v0-2
confidence: medium
maturity: early
---

# Knowledge Promotion

## Definition

Knowledge promotion is the process of moving a validated lesson from temporary execution into the smallest durable layer that can reuse it, revise it, and receive the result of later use.

## Working Path

A lesson begins in execution evidence. Human judgment identifies the reusable part, and the owning source carries it into the next use. That use should produce a check, correction, or stronger source rather than leave the lesson unchanged by experience.

## Promotion Targets

A lesson may belong in a repository doc, script, test, workflow, issue, pull request, release note, runbook, skill, model, or public research note.

The target should be chosen by ownership and reuse path, not by convenience.

## Return Path

Promotion is incomplete when the lesson can guide work but cannot be corrected by it. A repository guide should lead back to the repository, a test to the behavior it exercises, and a workflow to the mechanism that verifies it. Later work may confirm the lesson, expose a boundary, or require a repair; each result belongs with the owner rather than in a separate summary.

## Open Questions

- What is the minimum evidence required before promotion?
- Which promotion targets should remain private, repo-owned, or public?
- How should promoted knowledge expire or get revised?
