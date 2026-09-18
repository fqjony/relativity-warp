---
title: Engineering Memory Model v0.2
version: v0.2
status: published
date: 2026-09-18
summary: Engineering memory compounds when source-backed lessons remain owned, current, reachable where work runs, and open to repair through use.
labels: engineering-memory, operational-truth, ai-native-engineering, repository-centric-engineering
questions: why-does-engineering-experience-not-compound, what-makes-engineering-knowledge-reusable, can-software-engineering-become-a-cumulative-discipline
series: engineering-memory
---

# Engineering Memory Model v0.2

## Status

Draft model, version 0.2. Version 0.1 explains how an observation becomes a reusable lesson. This revision adds the conditions that let the lesson remain useful across session, tool, provider, and work-environment changes.

## What Changed

Version 0.1 described the shape of a reusable lesson: evidence establishes it, a boundary limits it, a generalization states the pattern, and an application puts it in front of the next actor.

Recent work exposed a gap. A lesson can have an owner and still fail to help if the next session cannot recover the current source, or if the source is absent from the environment where work must continue. Memory has to survive the handoff as well as the original promotion.

## Working Claim

Engineering memory is source-backed working structure that lets a later human, tool, or agent recover a safe part of the work, verify it, and continue without rebuilding the operating context from a conversation.

It compounds when a lesson has an owner who can revise its source, the source remains current with the work, the necessary part is reachable where the next actor must act, and later use has a return path for evidence or repair.

## The Five Parts Remain

- **Observation** records what real work revealed.
- **Evidence** provides the source that can be checked again.
- **Boundary** says where the lesson applies and where it does not.
- **Generalization** keeps the smallest pattern that survived verification.
- **Application** puts that pattern into a surface the next actor can use and return new evidence to.

These are roles, not a sequence every task must perform. A repository guide may carry the boundary and application together; a test may carry evidence and application; a research note may hold a provisional generalization while its evidence remains elsewhere.

Application is not the end of the model. A later use can confirm the lesson, expose that it no longer applies, or reveal a gap in the owning source. The useful result goes back to the owner: a test changes, a repository guide is repaired, a workflow gains a check, or generated context is refreshed from the source it describes. That return keeps memory from becoming a one-way archive.

## What a Source Can Establish

Authority depends on the question being asked. A script, manifest, test, or runtime record can establish observable behavior. Documentation and a human decision record state intended scope and accepted tradeoffs. A session trace recovers the earlier question and the sources worth reopening, but does not settle the present state. Generated context is a derived view: useful when it shows provenance and gaps, unreliable when it replaces its inputs.

The distinction matters because a lesson can be well routed and locally available yet still rest on the wrong kind of evidence. The next actor should be able to see what the source proves, what it states, and what remains to be checked.

## Three Conditions for Continuity

The five parts explain the shape of a lesson. These conditions determine whether it survives a handoff.

**Recoverable.** Can the next actor find the current source? A session trace is useful when it recovers the unfinished question and points back to the owner. It becomes harmful when it is mistaken for the owner. Current repository, workflow, runtime, or human evidence still decides what is true.

**Revisable.** Can the source be corrected where the lesson lives? The lesson belongs in the smallest durable surface that its owner can keep accurate: a repository document, test, workflow, skill, research object, or dated note. Convenience is not enough; the destination needs a revision path.

**Reachable.** Is the necessary part present where work runs? A different agent or inference provider can continue only from instructions, state, controls, and checks that are current at the work host. Offline work is a sharp test: it can safely continue the local part of a task, but cannot invent remote state, web evidence, or a source that was never synchronized.

## Evidence in This Revision

[Session Traces Are Orientation, Not Authority](/spectrum/2026-09-02-session-traces-are-orientation-not-authority/) establishes the recovery boundary: history can locate the next question, not replace live evidence. [A Lesson Needs a Destination](/spectrum/2026-09-13-a-lesson-needs-a-destination/) tests ownership and the smallest durable layer. [Offline Work Begins at the Work Host](/spectrum/2026-09-18-changing-the-agent-without-losing-the-work/) tests locality by switching between connected and local Codex modes without moving the working context into either provider.

Together, these notes do not prove a complete memory system. They support a narrower claim: preservation is not enough. A source must be recoverable, revisable, and available for the work at hand.

Earlier work establishes the other half of the revision. [Structured Evidence and Interpreted Intent](/spectrum/2026-05-18-structured-evidence-interpreted-intent/) separates deterministic evidence from explanation. [Repositories as Operational Execution Surfaces](/spectrum/2026-05-25-repositories-as-operational-execution-surfaces/) and [When Experience Becomes Automation](/spectrum/2026-07-04-when-experience-becomes-automation/) show why a later use must return through a check or repair to the source that owns the work.

## Practical Tests

When a lesson is proposed for promotion, first ask what its source can establish. Then ask whether a later session can find that current source rather than rely on a trace, whether the owner can correct it when work changes, and what evidence shows the available local representation is current enough for the task.

When work may continue under a different tool, provider, or network condition, restrict the environment and ask what remains safe to do from local sources. After the work, ask where the resulting evidence goes. A failure identifies a remote dependency, stale copy, missing owner, or missing repair path. It does not justify filling the gap with an old summary.

## Boundary

The model does not claim that all engineering work should be available offline, or that every source should be duplicated locally. Current production state, remote decisions, external references, and collaboration can be essential. The model asks systems to state their limits honestly and preserve the local, checkable part of work when that is useful.

## Open Questions

- What evidence shows that a local representation is current enough to govern a task?
- How can shared engineering memory stay close to its owners without becoming a scattered set of competing copies?
- How should generated context show the difference between observed evidence, stated intent, and unresolved gaps?
- Which changes justify a new model version rather than a correction to an existing one?

## Next Revision

The next revision should compare these tests against work that crosses repository and organizational boundaries, where no single work host or owner is sufficient.
