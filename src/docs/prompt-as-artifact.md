---
title: Prompt as Artifact
description: Treat prompts as versioned inputs, not transient chat messages.
---

# Prompt as Artifact

## Why prompts must be stored

Prompts encode intent. If they are not stored, intent disappears. That creates a gap between what was asked and what was shipped.

## Artifact rules

- Every prompt becomes a file.
- The file has a declared output type.
- The file is reviewed like code.
- The file maps to a deterministic result.

## What changes when prompts are artifacts

- You can diff intent over time.
- You can reproduce decisions.
- You can audit why automation made a choice.

## Practical start

Create a `prompts/` or `manifests/` directory. Name prompts by purpose, not by author. Wire them into build or workflow steps.
