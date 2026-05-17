---
title: What the dev.kit Sessions Converged On
description: A synthesis note collecting repo-session lessons from building dev.kit as a repo-context and workflow normalization tool.
status: published
date: 2026-05-18
datetime: 2026-05-18 10:30
labels: engineering, dev.kit, repositories, agents, workflow
---

# What the dev.kit Sessions Converged On

Context first: [Repo-Centric Workflows as an Engineering System](/spectrum/2026-05-18-repo-centric-workflows/) describes the larger operating model. Then [The Idea Behind dev.kit](/spectrum/2026-05-18-dev-kit-idea/) explains why the tool exists, and [How dev.kit Changed While Building It](/spectrum/2026-05-18-dev-kit-development-log/) traces the development arc.

This note is the synthesis from the `dev.kit` repo sessions: what the implementation work kept teaching back.

The repeated goal was simple: make repositories easier to enter, inspect, repair, and automate without depending on hidden memory. That sounds broad, but the sessions kept reducing it to a smaller working shape.

`dev.kit` should not become a second project management system, a local notebook, or a giant agent prompt generator. It should be a repo-context adapter. It reads the repository, reports what can be trusted, exposes what is missing, and points the next actor to the safest useful step.

## The Shape That Survived

The early version had more public surface area: audit-style inspection, machine-readable agent output, generated guidance, local lesson extraction, install helpers, diagrams, docs, completions, and fixtures.

That was useful for exploration, but too much of it blurred the boundary between repo facts, agent behavior, and local session notes.

The current direction is smaller:

```bash
dev.kit      # inspect environment and repo context status
dev.kit env  # detect tools, auth, and capability controls
dev.kit repo # generate or refresh repo context
```

That reduction matters. The default command should orient the user. `dev.kit env` should explain what the machine can actually resolve. `dev.kit repo` should write the repo-owned contract.

Everything else should be justified by a clear contract boundary.

## Repo Context Is Evidence, Not Advice

One of the strongest lessons was that generated repo context has to stay factual.

It can contain repo identity, reading order, commands and their sources, manifests, dependencies, coverage gaps, and repair hints grounded in detected evidence.

It should not contain long behavior rules, subjective workflow advice, session transcripts, local-only lessons, or dynamic noise that does not help a future repo reader.

The practical rule became: if it can be regenerated from repo signals, it belongs in structured context. If it is guidance about how to work, it belongs in docs or agent instructions. If it is only a local session artifact, it should not leak into the repo contract.

## Environment Changes The Truth

The sessions also made environment detection feel less optional.

A repo scan from a full local workstation can resolve more than a restricted machine. A remote agent with no credentials should not pretend to see workflow history or dependency repos it cannot access. A local developer may intentionally disable a tool or credential for a run.

That is why `dev.kit env` became part of the core loop. It is not just setup checking. It is context coverage input.

The generated repo context should be honest about the capabilities available during generation.

## Gaps Are The Product

The most useful output was not a perfect summary of a healthy repo. It was the list of gaps that made a repo harder to work with.

Good gaps are specific: a missing config contract, a weak command surface, an untraced manifest, an unclear dependency, stale generated context, or docs that describe a workflow without pointing to the executable path.

Bad gaps are generic advice.

The useful loop is:

```text
run dev.kit
refresh context
inspect gaps
repair the smallest repo-owned source
run dev.kit repo again
verify the gap changed
```

That turns repo cleanup into a testable workflow. The repository improves because the sources improve, not because the generated output was hand-edited.

## Manifests Need Backends

Several sessions circled around YAML manifests. A manifest is only useful if a future reader can tell what executes it.

For example, a workflow file is backed by a runner. A deploy manifest may be backed by a separate tool. A config catalog may be consumed by a script. Metadata may identify a contract family. A comment may point to a source repo or docs page.

The useful context is not just "found a manifest." It is the trace: what the manifest declares, what uses it, and what evidence supports the relationship. That is the difference between inventory and operational context.

## Agent Workflow Should Start From The Repo

The repo sessions repeatedly tested the same instruction: start with `dev.kit`, then follow the next command it recommends.

The point is not ritual. The point is to make every new human or AI session re-ground itself in current repo evidence before editing code.

A good agent workflow should answer what the repo says it is, what to read first, how to verify a change, which manifests shape behavior, which dependencies matter, and which gaps should influence the next repair.

That does not require a giant prompt. It requires a compact repo contract and a habit of refreshing it.

## Why The Tool Needed To Shrink

The strongest design decision was removing or demoting features that sounded useful but made the model less clear.

Local lesson extraction was interesting because sessions do create useful lessons. But it can become noisy and hard to trust. The better pattern is to use sessions as source material, then promote only durable findings into repo docs, manifests, or tests when they prove reusable.

Generated agent guidance also blurred the boundary. Agent guidance is useful, but it should point to the generated repo contract rather than replace it.

The tool becomes more valuable when it does less: inspect current capability, read repo-owned evidence, generate structured context, report gaps, and guide the next repair loop.

## The Working Model

The sessions converged on this model:

```text
repo sources
  -> dev.kit env
  -> dev.kit repo
  -> generated repo context
  -> docs, agents, scripts, CI, and humans
  -> repairs to repo sources
  -> regenerate
```

The repository remains the source of truth. `dev.kit` is the adapter that makes the truth easier to inspect and reuse.

For local development, that means less guessing. For CI/CD, it means clearer command and manifest contracts. For AI agents, it means less prompt drift. For teams, it means workflow knowledge has a path back into the repo instead of staying in one person's terminal history.

That is the practical lesson from the repo sessions: standardization does not need a heavy platform first. It can start with a small loop that makes each repository more self-explaining every time work happens.
