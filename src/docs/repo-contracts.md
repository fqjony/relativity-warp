---
title: Repository Contracts
description: The repo is the contract. Make it explicit, stable, and consumable.
type: article
labels: repo-centric, engineering, development, software
---

# Repository Contracts

Automation fails when the repo is vague. A repository contract is the minimum set of rules that makes work deterministic for humans and machines.

## What a repo contract contains

- **Structure**: source roots, build outputs, entry points.
- **Artifacts**: manifests, schemas, docs, and their locations.
- **Execution**: allowed scripts and commands.
- **Verification**: tests and validation gates.
- **Ownership**: who approves changes and where.

## Practical contract checklist

1. `src/` vs `docs/` boundaries are explicit.
2. All generated outputs are in a single publish root.
3. Manifests define data inputs (`tips.yml`, `spectrum/*.md`).
4. Builds are deterministic and documented (`npm run build`).
5. Verification is visible (`npm test`, `npm run lint`, etc.).

## Why this feels like physics

A system with hidden rules is like a lab with unknown variables: you cannot reproduce the experiment. Make variables explicit, and results become repeatable.

## Flow (placeholder)

- Declare layout → Publish contract → Enforce build → Verify output

## Related foundations

- Config separated from code
- Interface drives development
- Repo-centric by default
- Keyless access where possible
