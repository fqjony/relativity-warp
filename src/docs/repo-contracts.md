---
title: Repository Contracts
description: The repo is the contract. Make it explicit, stable, and consumable.
type: article
labels: repo-centric, engineering, development, standards
---

# Repository Contracts

## The principle

The repo itself is the contract. If intent, structure, and execution are not encoded there, automation will guess.

## What belongs in the contract

- Structure: source roots, build outputs, entry points.
- Artifacts: manifests, schemas, docs.
- Execution: approved scripts and commands.
- Validation: tests and gates.

## Related foundations

- 12 Factor App
- Config separated from code
- Interface drives development
- Repo-centric as a default
- Keyless access where possible

## Flow (placeholder)

1. Declare repo layout.
2. Define artifacts.
3. Define execution surface.
4. Enforce validation.
