---
title: Prompt as Artifact
description: Prompts are inputs. Version them, review them, and bind them to outputs.
type: article
labels: ai, workflows, automation, development
---

# Prompt as Artifact

Treat prompts like code. If you cannot review or replay the prompt, you cannot trust the output.

## Why it matters

- **Traceability**: you can explain why a change happened.
- **Repeatability**: you can re-run the same prompt with fixed context.
- **Quality**: prompts can be refined with diffs and reviews.

## What to store

- Prompt text (as a file).
- Expected output type (diff, report, file).
- Inputs used (files, manifests, context files).
- Verification command.

## Minimal structure

```
/manifest/prompts/
  build-spectrum.md
  refactor-homepage.md
```

Each prompt file should include:

- purpose
- inputs
- outputs
- verification

## Physics mindset

Prompts are the initial conditions. If you change them without recording, you cannot reproduce the result.

## Flow (placeholder)

- Write prompt → Declare output → Run step → Verify → Commit

## Key rule

If the prompt is part of the system, it belongs in the repo.
