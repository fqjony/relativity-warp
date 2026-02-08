---
title: Context Resolvers
description: Turning messy repositories into deterministic, queryable context for automation.
type: discovery
---

# Context Resolvers

## The problem

Real repositories are full of implicit rules. A human can infer them, but automation cannot. Context resolvers convert those hidden rules into explicit, machine-derivable artifacts.

## What a resolver does

- Maps raw files into structured context.
- Declares constraints and ownership.
- Normalizes naming, paths, and scope.
- Outputs deterministic summaries for tooling.

## Minimal resolver shape

- **Input:** repo paths + manifests.
- **Logic:** extract, normalize, validate.
- **Output:** JSON or Markdown artifact.

## Where to start

- Declare the repo root contract.
- Define a minimal inventory of packages, services, and entry points.
- Add validation rules for each artifact.

## Why it matters

Resolvers make automation reliable. They reduce guesswork and make AI outputs verifiable against known constraints.
