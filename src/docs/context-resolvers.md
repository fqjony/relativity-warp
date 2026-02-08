---
title: Context Resolvers
description: Turning messy repositories into deterministic, queryable context for automation.
type: discovery
labels: context, repo-centric, automation
---

# Context Resolvers

## Discovery

Implicit repo rules are a leading cause of automation drift.

## Evidence

- Same prompt yields different output across repos.
- Errors often traced to missing conventions or hidden paths.

## Conclusion

Context resolvers should be first-class artifacts. They turn invisible rules into machine-derivable inputs.

## Output artifacts

- `context/index.json` (repo inventory)
- `context/contracts.md` (human-readable rules)

## Flow (placeholder)

1. Scan repo structure.
2. Extract constraints.
3. Emit context artifacts.
4. Validate against schema.
