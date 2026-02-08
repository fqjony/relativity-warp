---
title: Context Resolvers
description: Turn implicit repo rules into deterministic context for automation.
type: note
labels: context, repo-centric, automation, engineering
---

# Context Resolvers

- Hidden repo rules cause automation drift.
- Resolvers extract those rules into artifacts.
- The goal is repeatable context, not guesswork.

## Example artifacts

- `context/index.json` (repo inventory)
- `context/contracts.md` (human-readable rules)

## Flow (placeholder)

- Scan repo → Extract constraints → Emit artifacts → Validate
