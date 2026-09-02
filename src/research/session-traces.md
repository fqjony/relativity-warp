---
title: Session Traces
type: concept
status: developing
created: 2026-09-02
updated: 2026-09-02
summary: Session traces preserve useful orientation for later work, but they become reusable engineering memory only after live evidence verifies and promotes the lesson.
research_area: engineering memory
concepts: engineering-memory, operational-truth, knowledge-promotion, execution-evidence
related: engineering-memory, operational-truth, knowledge-promotion, repository-centric-engineering
depends_on: operational-truth
supports: engineering-memory, knowledge-promotion, what-makes-engineering-knowledge-reusable
contradicts:
evidence: 2026-09-02-session-traces-are-orientation-not-authority
references: engineering-memory-model-v0-1, 2026-05-19-local-agent-dev-kit-enterprise-workflow
confidence: medium
maturity: early
---

# Session Traces

## Definition

A session trace is the temporary record of an engineering interaction: the questions asked, evidence inspected, actions attempted, decisions made, and friction encountered while work was active.

## Working Claim

Session traces are useful for orientation, not authority.

They can recover the next useful question and identify the sources worth reopening. They cannot settle the current state of a repository, workflow, runtime, or human decision once those sources may have changed.

## Promotion Boundary

A lesson discovered in a session becomes engineering memory only after it is checked against its owning source and promoted into the smallest durable structure that can support its next use.

```text
session trace
  -> question to recheck
  -> live owning source
  -> validated lesson
  -> durable reuse
```

## Use

Use this concept when returning to a previous workstream, reviewing agent history, or deciding whether a session-derived observation belongs in repository guidance, a workflow, a skill, a research object, or nowhere durable at all.

## Open Questions

- What level of evidence is sufficient to promote a session-derived pattern?
- How can session tooling make the owning source easier to reopen without becoming a competing source of truth?
