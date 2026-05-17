---
title: Structured Evidence and Interpreted Intent
description: A practical boundary for repo-context tools: parse deterministic sources, use prose for meaning, and keep generated context reviewable.
status: published
date: 2026-05-18
datetime: 2026-05-18 11:00
labels: engineering, repositories, context, dev.kit, agents
---

# Structured Evidence and Interpreted Intent

The `dev.kit` series started with the broad idea of [repo-centric workflows](/spectrum/2026-05-18-repo-centric-workflows/), then moved through the [tool idea](/spectrum/2026-05-18-dev-kit-idea/), [development arc](/spectrum/2026-05-18-dev-kit-development-log/), [session synthesis](/spectrum/2026-05-18-dev-kit-repo-sessions/), and [workflow contract](/spectrum/2026-05-18-dev-kit-workflow-contract/).

The missing piece is the boundary that makes the whole model durable:

```text
structured evidence should be parsed
interpreted intent should be explained
generated context should keep the two visibly separate
```

That sounds small, but it is the difference between a repo-context tool that stays trustworthy and one that turns into generated lore.

## The Temptation

When a tool scans a repository, it is tempting to make the output as helpful as possible.

That can quickly become too much:

- infer project intent from a README
- infer team workflow from a prompt
- infer release behavior from an old issue
- infer runtime contracts from prose
- merge session notes into generated context
- summarize everything into one confident story

Some of those inferences may be useful. They are not the same kind of evidence as a workflow file, package script, manifest header, or test command.

If the generated context does not preserve that distinction, the reader cannot tell which parts are observed and which parts are interpreted.

## The Useful Split

A repository has several kinds of sources.

Scripts and manifests define what can run.

Structured refs define what can be parsed.

Docs and sessions explain why.

Generated context should summarize the operational contract: reading order, detected commands, structured gaps, dependency contracts, manifest provenance, and repair targets.

That split gives each source a job.

## Why This Matters For Agents

Humans often understand source quality intuitively. Agents need the boundary stated more clearly.

A repo agent may read a Markdown paragraph and treat it like an executable rule. It may see an old session note and assume it is current policy. It may infer a deployment path from prose even when the workflow file says something different.

A good repo-context artifact should help prevent that.

It should say what was detected from runnable sources, what was traced from structured sources, what caused a gap, and which docs are references rather than executable sources.

That makes the generated context reviewable by both humans and agents.

## Gaps Are Where The Boundary Becomes Practical

When generated context reports a gap, that is exactly where the boundary matters.

One bad response would be to edit generated context until it sounds complete.

The better response is to improve the repo-owned source: document configuration, add an example when it fits the repo, improve manifest metadata, or make the workflow path clearer.

Then regenerate context.

The generated file becomes a coverage report over the repo, not a substitute for the repo.

## Prose Still Matters

This boundary is not anti-documentation.

Prose is where teams explain why the workflow exists, which tradeoffs were accepted, when a command should be used, what a manifest means operationally, how to repair a weak contract, and what still needs human judgment.

The point is that prose should not silently become deterministic evidence.

When both structured and prose sources exist, parse the structured source first. Use prose to explain intent, repair guidance, and open decisions.

That keeps automation deterministic without stripping the repository of human meaning.

## A Reviewable Contract

The goal is not perfect inference. It is a reviewable contract.

A useful repo-context artifact should let someone ask where a command came from, why a dependency is listed, what evidence caused a gap, which source should be fixed, and which parts are observed versus interpreted.

If those questions are easy to answer, the context can be trusted even when it is incomplete.

Incomplete and explicit is better than complete and magical.

## The Pattern

The durable pattern is:

```text
structured source -> deterministic parse
prose source      -> interpreted intent
generated context -> compact evidence and gaps
repo repair       -> improve the owning source
regeneration      -> prove the contract changed
```

That is the practical boundary for `dev.kit`, but it applies more broadly to any repo-context system.

If repositories are going to drive humans, automation, CI/CD, and agents from the same operating contract, the contract has to stay grounded. It has to say what the repo proves, what the repo suggests, and what the repo still does not explain.

That is how generated context remains useful without becoming another place for drift.
