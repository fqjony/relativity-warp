---
title: Repository Contracts
description: The repo is the contract. Make it explicit, stable, and consumable.
type: article
---

# Repository Contracts

## What is a repo contract

A repo contract is the explicit agreement between humans, tools, and automation. It describes structure, responsibilities, and the artifacts that define how work happens.

## Contract layers

- **Structure:** directory layout, source roots, build outputs.
- **Artifacts:** manifests, schemas, templates, docs.
- **Execution:** scripts and commands that are allowed.
- **Validation:** tests, checks, and gates.

## The contract test

If a new engineer cannot infer how to work from the repo itself, the contract is missing. If automation cannot find the same answer, the contract is broken.

## Minimal contract artifacts

- `README` with purpose and entry points.
- `docs/` describing behavior and constraints.
- `scripts/` for build and validation.
- `manifests/` for machine-readable data.
