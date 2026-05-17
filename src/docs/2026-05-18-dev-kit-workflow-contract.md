---
title: Turning Repo Output Into a Workflow Contract
description: A practical note on exposing repo status, environment capability, context gaps, and repair steps as one workflow.
status: published
date: 2026-05-18
datetime: 2026-05-18 10:45
labels: engineering, dev.kit, workflow, repositories, agents
---

# Turning Repo Output Into a Workflow Contract

The earlier notes in this series explain the bigger idea:

- [Repo-Centric Workflows as an Engineering System](/spectrum/2026-05-18-repo-centric-workflows/)
- [The Idea Behind dev.kit](/spectrum/2026-05-18-dev-kit-idea/)
- [How dev.kit Changed While Building It](/spectrum/2026-05-18-dev-kit-development-log/)
- [Structured Evidence and Interpreted Intent](/spectrum/2026-05-18-structured-evidence-interpreted-intent/)

This note is more concrete. It comes from the current `dev.kit` direction, where command output is being reshaped from a set of reports into a workflow contract.

The change is small in plain language:

```text
dev.kit should say what workflow state the repo is in,
which job needs attention,
and what the next repair loop should be.
```

That matters because a repo-context tool should not only describe a repository. It should help the next human, script, or agent decide what to do safely.

## The Problem

`dev.kit` already had separate useful pieces: environment inspection, repo context generation, command detection, gap reporting, manifest tracing, dependency tracing, and machine-readable output.

But separate pieces can still leave the user asking, "What state am I in?"

For a repo-facing tool, the useful answer is not only:

```text
config is partial
```

The useful answer is:

```text
status: needs repair
environment: ready
next: fix repo-owned gaps, then refresh context
```

That gives the session a direction.

## The New Shape

The current direction adds a workflow layer to the main command, environment command, and repo command.

At the top level, the tool should show whether the environment is usable, whether repo context exists, whether gaps remain, and which job needs attention.

The status vocabulary should stay compact. The point is not to create a new process language; it is to answer whether the repo is ready, blocked, missing context, stale, customized, or in need of repair.

## Environment As a Job

`dev.kit env` is no longer just a list of detected tools.

It should represent an environment workflow job: detect local tools, resolve repo-facing capabilities, and review overrides.

This is important because environment capability affects context coverage. A full local workstation can resolve more than a restricted runner. A machine with disabled tools or credentials should report that clearly instead of pretending full coverage exists.

## Repo Context As a Job

`dev.kit repo` now emits a repo workflow job.

That job should include the context path, context status, gap count, and ordered steps: read the strongest refs, run the canonical verification when needed, review generated context, and repair the strongest gap.

This turns gap reporting into an actionable loop rather than a passive warning.

## The Repair Loop

The repo docs now make the boundary explicit:

```text
1. dev.kit repo detects a gap or weak contract
2. fix the repo-owned doc, example, manifest, or workflow
3. rerun dev.kit repo
4. let the regenerated contract point back to the improved repo assets
```

That boundary is important. Generated context should not become the place where missing meaning is patched manually.

If config coverage is weak, the repair target might be a doc, an example config, or a manifest. Then the context should be regenerated from that improved source.

## Local References Instead of Tool References

One implementation detail is subtle but useful.

For repos outside `dev.kit` itself, gap references should point to the local repo asset that can be repaired when possible. A config gap in a simple shell repo should not always point back to `dev.kit`'s internal reference docs.

That makes the output more practical. A repair loop should send the user to the source they can improve, not only to the tool's explanation of the factor.

## What the Command Shows Now

In the current repo, the important message is simple: the environment is usable, repo context exists, and a repo-owned gap still needs repair. The next step is not to edit generated output. The next step is to improve the owning source and regenerate.

## Tests Followed the Contract

The tests should follow the contract: the same workflow model should appear in human output and machine-readable output, and gap references should point back to repo-owned sources where possible.

## Why This Matters

This change makes `dev.kit` feel less like a scanner and more like an operating loop.

The loop is:

```text
inspect environment
inspect repo context
report workflow state
read the right sources
repair the strongest repo-owned gap
regenerate
verify the output changed
```

That is the practical shape of repo-centric engineering. The repository remains the source of truth, but the tool makes the current state, missing coverage, and next action explicit.

For agents, this is especially useful. A workflow contract gives the agent a small, structured plan before code exploration. For humans, it reduces the "what now?" moment at the start of a repo session.

The best part is that the model stays humble. It does not claim the repo is fully understood. It says what was detected, what is missing, and which repo-owned source should improve next.
