---
title: Prompt as Artifact
description: Treat prompts as versioned inputs, not transient chat messages.
type: article
labels: ai, workflows, automation
---

# Prompt as Artifact

## The shift

Prompts are not chats; they are inputs. When you treat them as artifacts, you can reproduce decisions and audit intent.

## Why it matters

- You can diff intent over time.
- You can replay workflows deterministically.
- You can explain why the system made a choice.

## Implementation notes

- Store prompts in `manifests/`.
- Attach an explicit output type.
- Review prompts like code.

## Flow (placeholder)

1. Write prompt.
2. Declare output type.
3. Generate artifact.
4. Verify result.
5. Store in repo.
